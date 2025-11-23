from pydantic import BaseModel
from typing import Dict

class EmailDomainRequest(BaseModel):
    domain: str

class EmailHeaderRequest(BaseModel):
    headers: str

class EmailAnalysisResult(BaseModel):
    results: Dict
