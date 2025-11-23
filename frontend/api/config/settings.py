import os
from pathlib import Path
from dotenv import load_dotenv

ROOT_DIR = Path(__file__).parent.parent
load_dotenv(ROOT_DIR / '.env')

class Settings:
    # API Keys
    VIRUSTOTAL_API_KEY: str = os.environ.get('VIRUSTOTAL_API_KEY', '')
    ABUSEIPDB_API_KEY: str = os.environ.get('ABUSEIPDB_API_KEY', '')
    URLSCAN_API_KEY: str = os.environ.get('URLSCAN_API_KEY', '')
    OTX_API_KEY: str = os.environ.get('OTX_API_KEY', '')
    GREYNOISE_API_KEY: str = os.environ.get('GREYNOISE_API_KEY', '')
    
    # CORS Origins - can be set via environment variable
    @property
    def CORS_ORIGINS(self):
        cors_env = os.environ.get('CORS_ORIGINS', '')
        if cors_env:
            # If CORS_ORIGINS is set, split by comma
            if cors_env == '*':
                return ['*']
            return [origin.strip() for origin in cors_env.split(',')]
        # Default origins for local development
        return [
            "http://localhost:3000",
            "http://127.0.0.1:3000",
        ]
    
    # Logging
    LOG_LEVEL: str = os.environ.get('LOG_LEVEL', 'INFO')

settings = Settings()
