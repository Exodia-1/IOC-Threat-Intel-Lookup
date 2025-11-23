from pydantic import BaseModel
from typing import Dict

class FileAnalysisResult(BaseModel):
    filename: str
    size: int
    md5: str
    sha1: str
    sha256: str
    mime_type: str
