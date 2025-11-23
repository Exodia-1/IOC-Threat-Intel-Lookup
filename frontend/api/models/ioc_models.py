from pydantic import BaseModel, ConfigDict
from typing import List, Dict, Optional
from datetime import datetime

class IOCLookupRequest(BaseModel):
    text: str  # Can contain multiple IOCs

class IOCLookupResult(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    ioc: str
    type: str
    results: Dict
    timestamp: datetime

class HistoryResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    history: List[IOCLookupResult]
    total: int
    page: int
    per_page: int
