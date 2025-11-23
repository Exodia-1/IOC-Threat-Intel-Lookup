from fastapi import APIRouter, HTTPException
from models.ioc_models import IOCLookupRequest
from utils.ioc_detector import IOCDetector
from utils.threat_intel import ThreatIntelAggregator
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/lookup")
async def lookup_iocs(request: IOCLookupRequest):
    """
    Lookup IOCs across multiple threat intelligence sources.
    Supports bulk lookup - paste multiple IOCs separated by newlines.
    Real-time analysis (no data stored).
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
        
        # Lookup each IOC in real-time
        results = []
        for ioc in iocs:
            lookup_result = await aggregator.lookup(ioc['value'], ioc['type'])
            results.append(lookup_result)
        
        return {
            'success': True,
            'message': f'Looked up {len(results)} IOCs',
            'results': results
        }
    
    except Exception as e:
        logger.error(f"IOC lookup error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
