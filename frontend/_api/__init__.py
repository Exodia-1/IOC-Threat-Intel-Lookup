from fastapi import APIRouter
from .ioc_routes import router as ioc_router
from .email_routes import router as email_router
from .file_routes import router as file_router

api_router = APIRouter(prefix="/api")

api_router.include_router(ioc_router, prefix="/ioc", tags=["ioc"])
api_router.include_router(email_router, prefix="/email", tags=["email"])
api_router.include_router(file_router, prefix="/file", tags=["file"])
