from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Dict, Optional
import uuid
from datetime import datetime, timezone
from ioc_detector import IOCDetector
from threat_intel import ThreatIntelAggregator
from email_analyzer import EmailAnalyzer


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

# IOC Models
class IOCLookupRequest(BaseModel):
    text: str  # Can contain multiple IOCs

class IOCLookupResult(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    ioc_value: str
    ioc_type: str
    results: Dict
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class IOCHistoryResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str
    ioc_value: str
    ioc_type: str
    results: Dict
    timestamp: datetime

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    # Exclude MongoDB's _id field from the query results
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    # Convert ISO string timestamps back to datetime objects
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks

# IOC Lookup Endpoints
@api_router.post("/ioc/lookup")
async def lookup_iocs(request: IOCLookupRequest):
    """
    Lookup IOCs across multiple threat intelligence sources
    Supports bulk lookup - paste multiple IOCs separated by newlines
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
                ioc_value=ioc['value'],
                ioc_type=ioc['type'],
                results=lookup_result
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

@api_router.get("/ioc/history")
async def get_ioc_history(page: int = 1, per_page: int = 20):
    """Get IOC lookup history with pagination"""
    try:
        # Enforce maximum database size of 150 entries
        total_count = await db.ioc_lookups.count_documents({})
        
        # Delete oldest entries if exceeding 150
        if total_count > 150:
            # Get the 150th most recent timestamp
            entries_to_keep = await db.ioc_lookups.find(
                {},
                {"timestamp": 1}
            ).sort('timestamp', -1).limit(150).to_list(150)
            
            if entries_to_keep:
                cutoff_timestamp = entries_to_keep[-1]['timestamp']
                # Delete entries older than cutoff
                await db.ioc_lookups.delete_many({
                    'timestamp': {'$lt': cutoff_timestamp}
                })
                total_count = 150
        
        # Calculate pagination
        skip = (page - 1) * per_page
        total_pages = (total_count + per_page - 1) // per_page
        
        # Get paginated results
        history = await db.ioc_lookups.find(
            {},
            {"_id": 0}
        ).sort('timestamp', -1).skip(skip).limit(per_page).to_list(per_page)
        
        # Convert ISO string timestamps back to datetime objects
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

@api_router.get("/ioc/stats")
async def get_ioc_stats():
    """Get statistics about IOC lookups"""
    try:
        total_lookups = await db.ioc_lookups.count_documents({})
        
        return {
            'success': True,
            'total_lookups': total_lookups
        }
    
    except Exception as e:
        logger.error(f"Stats retrieval error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()