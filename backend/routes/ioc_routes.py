from fastapi import APIRouter, HTTPException
from models.ioc_models import IOCLookupRequest, IOCLookupResult
from utils.ioc_detector import IOCDetector
from utils.threat_intel import ThreatIntelAggregator
from config.database import db
from config.settings import settings
import logging
from datetime import datetime

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/lookup")
async def lookup_iocs(request: IOCLookupRequest):
    """
    Lookup IOCs across multiple threat intelligence sources.
    Supports bulk lookup - paste multiple IOCs separated by newlines.
    """
    try:
        # Extract and classify IOCs
        iocs = IOCDetector.extract_iocs(request.text)
        
        if not iocs:
            return {
                'success': False,
                'message': 'No valid IOCs detected',
                'results': []
            }
        
        # Initialize threat intel aggregator
        aggregator = ThreatIntelAggregator()
        
        # Lookup each IOC
        results = []
        for ioc in iocs:
            lookup_result = await aggregator.lookup(ioc['value'], ioc['type'])
            
            # Save to database
            result_obj = IOCLookupResult(
                ioc=ioc['value'],
                type=ioc['type'],
                results=lookup_result,
                timestamp=datetime.utcnow()
            )
            
            doc = result_obj.model_dump()
            doc['timestamp'] = doc['timestamp'].isoformat()
            
            await db.ioc_lookups.insert_one(doc)
            
            results.append(lookup_result)
        
        return {
            'success': True,
            'message': f'Looked up {len(results)} IOCs',
            'results': results
        }
    
    except Exception as e:
        logger.error(f"IOC lookup error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/history")
async def get_ioc_history(page: int = 1, per_page: int = 20):
    """Get IOC lookup history with pagination and enforce 150 entry limit."""
    try:
        # Enforce maximum database size
        total_count = await db.ioc_lookups.count_documents({})
        
        # Delete oldest entries if exceeding limit
        if total_count > settings.HISTORY_LIMIT:
            entries_to_keep = await db.ioc_lookups.find(
                {},
                {"timestamp": 1}
            ).sort('timestamp', -1).limit(settings.HISTORY_LIMIT).to_list(settings.HISTORY_LIMIT)
            
            if entries_to_keep:
                cutoff_timestamp = entries_to_keep[-1]['timestamp']
                await db.ioc_lookups.delete_many({
                    'timestamp': {'$lt': cutoff_timestamp}
                })
                total_count = settings.HISTORY_LIMIT
        
        # Calculate pagination
        skip = (page - 1) * per_page
        total_pages = (total_count + per_page - 1) // per_page
        
        # Get paginated results
        history = await db.ioc_lookups.find(
            {},
            {"_id": 0}
        ).sort('timestamp', -1).skip(skip).limit(per_page).to_list(per_page)
        
        # Convert ISO string timestamps
        for item in history:
            if isinstance(item['timestamp'], str):
                item['timestamp'] = datetime.fromisoformat(item['timestamp'])
        
        return {
            'success': True,
            'count': len(history),
            'total': total_count,
            'page': page,
            'per_page': per_page,
            'total_pages': total_pages,
            'history': history
        }
    
    except Exception as e:
        logger.error(f"History retrieval error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/stats")
async def get_ioc_stats():
    """Get statistics about IOC lookups."""
    try:
        total_lookups = await db.ioc_lookups.count_documents({})
        
        return {
            'success': True,
            'total_lookups': total_lookups
        }
    
    except Exception as e:
        logger.error(f"Stats retrieval error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
