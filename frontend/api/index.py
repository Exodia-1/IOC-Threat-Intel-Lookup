import sys
import os
from pathlib import Path

# Add _api to path
api_path = Path(__file__).parent.parent / "_api"
sys.path.insert(0, str(api_path))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum
from routes import api_router
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="CTI IOC Lookup Tool",
    description="Cyber Threat Intelligence Dashboard",
    version="2.0.0"
)

# CORS - allow all since we're on same domain
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root endpoint
@app.get("/")
@app.get("/api")
async def root():
    return {
        "message": "CTI IOC Lookup Tool API",
        "status": "running",
        "version": "2.0.0"
    }

# Health check
@app.get("/health")
@app.get("/api/health")
async def health():
    return {
        "status": "healthy",
        "service": "CTI IOC Lookup Tool",
        "version": "2.0.0"
    }

# Include API routes
app.include_router(api_router)

# Vercel serverless handler
handler = Mangum(app, lifespan="off")
