from fastapi import APIRouter, HTTPException
from models.email_models import EmailDomainRequest, EmailHeaderRequest
from utils.email_analyzer import EmailAnalyzer
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/check-domain")
async def check_email_domain(request: EmailDomainRequest):
    """Check email domain for security records (SPF, DMARC, DKIM, MX)."""
    try:
        result = EmailAnalyzer.check_email_domain(request.domain)
        return result
    
    except Exception as e:
        logger.error(f"Email domain check error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/analyze-headers")
async def analyze_email_headers(request: EmailHeaderRequest):
    """Analyze email headers for threat indicators."""
    try:
        result = EmailAnalyzer.analyze_email_headers(request.headers)
        return result
    
    except Exception as e:
        logger.error(f"Email header analysis error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
