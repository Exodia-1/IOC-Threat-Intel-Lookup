from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
import logging
from pathlib import Path
from pydantic import BaseModel
from typing import Dict
from ioc_detector import IOCDetector
from threat_intel import ThreatIntelAggregator
from email_analyzer import EmailAnalyzer
from file_analyzer import FileAnalyzer


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Create the main app without a prefix
app = FastAPI()

# Health check endpoint for Railway (at root level, not under /api)
@app.get("/")
async def health_check():
    return {"status": "healthy", "message": "CTI IOC Lookup API"}

@app.get("/health")
async def health():
    return {"status": "ok"}

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class IOCLookupRequest(BaseModel):
    text: str  # Can contain multiple IOCs

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

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
            try:
                lookup_result = await aggregator.lookup(ioc['value'], ioc['type'])
                results.append(lookup_result)
            except Exception as ioc_error:
                logger.error(f"Error looking up {ioc['value']}: {str(ioc_error)}")
                # Continue with other IOCs even if one fails
                results.append({
                    'ioc': ioc['value'],
                    'type': ioc['type'],
                    'error': str(ioc_error),
                    'sources': {}
                })
        
        return {
            'success': True,
            'message': f'Looked up {len(results)} IOCs',
            'results': results
        }
    
    except Exception as e:
        logger.error(f"IOC lookup error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

# Email Analysis Endpoints
class EmailDomainRequest(BaseModel):
    email: str

class EmailHeaderRequest(BaseModel):
    headers: str

@api_router.post("/email/check-domain")
async def check_email_domain(request: EmailDomainRequest):
    """Check email domain for security records"""
    try:
        result = EmailAnalyzer.check_email_domain(request.email)
        return result
    
    except Exception as e:
        logger.error(f"Email domain check error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/email/analyze-headers")
async def analyze_email_headers(request: EmailHeaderRequest):
    """Analyze email headers for threat indicators"""
    try:
        result = EmailAnalyzer.analyze_email_headers(request.headers)
        return result
    
    except Exception as e:
        logger.error(f"Email header analysis error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# File Analysis Endpoints
@api_router.post("/file/upload")
async def upload_file(file: bytes = None):
    """Upload and analyze file"""
    try:
        from fastapi import File, UploadFile
        
        result = FileAnalyzer.analyze_file(None, file)
        return result
    
    except Exception as e:
        logger.error(f"File analysis error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

class FileHashRequest(BaseModel):
    hash: str
    hash_type: str  # md5, sha1, sha256

@api_router.post("/file/check-hash")
async def check_file_hash(request: FileHashRequest):
    """Check file hash against threat intelligence"""
    try:
        # Use existing IOC lookup for hash
        aggregator = ThreatIntelAggregator()
        result = await aggregator.lookup(request.hash, request.hash_type)
        
        return {
            'success': True,
            'data': result
        }
    
    except Exception as e:
        logger.error(f"Hash check error: {str(e)}")
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

# MongoDB removed - no cleanup needed