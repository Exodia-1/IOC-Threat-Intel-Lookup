from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config.settings import settings
from routes import api_router
import logging

# Configure logging
logging.basicConfig(
    level=getattr(logging, settings.LOG_LEVEL),
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="CTI IOC Lookup Tool",
    description="Comprehensive Cyber Threat Intelligence Dashboard - Real-time Analysis",
    version="2.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=settings.CORS_ORIGINS,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "CTI IOC Lookup Tool API",
        "status": "running",
        "version": "2.0.0",
        "docs": "/api/docs",
        "health": "/health",
        "note": "Real-time threat intelligence lookup (no database required)"
    }

# Include API routes
app.include_router(api_router)

# Startup event
@app.on_event("startup")
async def startup_event():
    logger.info("Starting CTI IOC Lookup Tool...")
    logger.info("Mode: Real-time analysis (no database)")
    logger.info("API Documentation: /api/docs")

# Shutdown event
@app.on_event("shutdown")
async def shutdown_event():
    logger.info("Shutting down CTI IOC Lookup Tool...")

# Health check endpoint
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "CTI IOC Lookup Tool",
        "version": "2.0.0",
        "mode": "real-time"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True)
