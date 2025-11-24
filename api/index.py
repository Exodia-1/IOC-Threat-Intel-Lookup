# Vercel Serverless Function - Main API Router
# This splits the backend into smaller functions to stay under 250MB limit

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
@app.get("/api/")
async def root():
    return {"status": "healthy", "message": "CTI IOC Lookup API"}

@app.get("/health")
async def health():
    return {"status": "ok"}

# Import the IOC lookup handler
from .ioc_lookup import router as ioc_router
app.include_router(ioc_router, prefix="/api")

# Import email analysis handler
from .email_analysis import router as email_router
app.include_router(email_router, prefix="/api")

# Import file analysis handler
from .file_analysis import router as file_router
app.include_router(file_router, prefix="/api")
