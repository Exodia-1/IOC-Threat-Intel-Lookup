from fastapi import APIRouter, HTTPException, File, UploadFile
from pydantic import BaseModel
from utils.file_analyzer import FileAnalyzer
from utils.threat_intel import ThreatIntelAggregator
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

class FileHashRequest(BaseModel):
    hash: str
    hash_type: str  # md5, sha1, sha256

@router.post("/analyze")
async def analyze_file(file: UploadFile = File(...)):
    """Upload and analyze file to get hashes and metadata."""
    try:
        file_content = await file.read()
        result = FileAnalyzer.analyze_file(file.filename, file_content)
        return result
    
    except Exception as e:
        logger.error(f"File analysis error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/check-hash")
async def check_file_hash(request: FileHashRequest):
    """Check file hash against threat intelligence sources."""
    try:
        aggregator = ThreatIntelAggregator()
        result = await aggregator.lookup(request.hash, request.hash_type)
        
        return {
            'success': True,
            'data': result
        }
    
    except Exception as e:
        logger.error(f"Hash check error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
