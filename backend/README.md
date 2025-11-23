# Backend - CTI IOC Lookup Tool

## 📁 Structure

This backend follows a modular architecture pattern for better maintainability and scalability.

### Directory Layout

```
backend/
├── config/              # Configuration and settings
│   ├── settings.py      # Environment variables and app settings
│   └── database.py      # Database connection management
│
├── models/             # Pydantic data models
│   ├── ioc_models.py    # IOC-related models
│   ├── email_models.py  # Email analysis models
│   └── file_models.py   # File analysis models
│
├── routes/             # API endpoints
│   ├── health_routes.py # Health checks and status
│   ├── ioc_routes.py    # IOC lookup and history
│   ├── email_routes.py  # Email analysis endpoints
│   └── file_routes.py   # File upload and hash checking
│
├── utils/              # Utility functions and classes
│   ├── ioc_detector.py  # IOC detection and defanging
│   ├── threat_intel.py  # Threat intelligence aggregator
│   ├── email_analyzer.py # Email header and domain analysis
│   └── file_analyzer.py # File hash calculation
│
├── tests/              # Test files (future)
│
├── main.py             # New FastAPI entry point (modular)
├── server.py           # Legacy entry point (maintained)
├── requirements.txt    # Python dependencies
├── Dockerfile          # Docker configuration
├── .env                # Environment variables (gitignored)
└── .env.example        # Environment template
```

## 🚀 Quick Start

### Using New Structure (main.py)

```bash
# Install dependencies
pip install -r requirements.txt

# Copy environment template
cp .env.example .env
# Edit .env and add your API keys

# Run server
python main.py
# or
uvicorn main:app --reload
```

### Using Legacy Structure (server.py)

```bash
# Same installation
pip install -r requirements.txt

# Run server
uvicorn server:app --reload
```

## 🔧 Development

### Adding a New Route

1. Create route file in `routes/`:
```python
# routes/my_new_route.py
from fastapi import APIRouter

router = APIRouter()

@router.get("/my-endpoint")
async def my_endpoint():
    return {"message": "Hello"}
```

2. Register in `routes/__init__.py`:
```python
from .my_new_route import router as my_router

api_router.include_router(my_router, prefix="/my", tags=["my"])
```

### Adding a New Model

1. Create model in `models/`:
```python
# models/my_models.py
from pydantic import BaseModel

class MyRequest(BaseModel):
    field1: str
    field2: int
```

2. Export in `models/__init__.py`:
```python
from .my_models import MyRequest
```

### Adding Configuration

Edit `config/settings.py`:
```python
class Settings:
    # Add new setting
    MY_NEW_SETTING: str = os.environ.get('MY_NEW_SETTING', 'default')
```

## 🧰 Architecture Patterns

### Configuration Layer (`config/`)
- Centralized settings management
- Environment variable handling
- Database connection singleton

### Model Layer (`models/`)
- Pydantic models for request/response validation
- Type safety
- Auto-generated API documentation

### Route Layer (`routes/`)
- Endpoint definitions
- Request handling
- Response formatting

### Utility Layer (`utils/`)
- Business logic
- External API integrations
- Helper functions

## 🔌 API Endpoints

### Health
- `GET /health` - Health check
- `GET /api/` - API status

### IOC Operations
- `POST /api/ioc/lookup` - Lookup IOCs
- `GET /api/ioc/history` - Get history (paginated)
- `GET /api/ioc/stats` - Get statistics

### Email Analysis
- `POST /api/email/check-domain` - Check domain security
- `POST /api/email/analyze-headers` - Analyze headers

### File Operations
- `POST /api/file/analyze` - Upload and analyze file
- `POST /api/file/check-hash` - Check hash

## 📝 Environment Variables

### Required
```bash
MONGO_URL=mongodb://localhost:27017
DB_NAME=cti_tool
VIRUSTOTAL_API_KEY=your_key
ABUSEIPDB_API_KEY=your_key
URLSCAN_API_KEY=your_key
OTX_API_KEY=your_key
GREYNOISE_API_KEY=your_key
```

### Optional
```bash
LOG_LEVEL=INFO
CORS_ORIGINS=http://localhost:3000
```

## 🐛 Debugging

### View Logs
```bash
# If using supervisor
tail -f /var/log/supervisor/backend.out.log
tail -f /var/log/supervisor/backend.err.log

# If running directly
# Logs appear in console
```

### Test Endpoints
```bash
# Health check
curl http://localhost:8001/health

# API docs
open http://localhost:8001/api/docs

# Test IOC lookup
curl -X POST http://localhost:8001/api/ioc/lookup \
  -H "Content-Type: application/json" \
  -d '{"text": "8.8.8.8"}'
```

## 🛡️ Security

- ✅ CORS configured
- ✅ Environment variables for secrets
- ✅ Input validation via Pydantic
- ✅ MongoDB injection prevention

## 📦 Dependencies

### Core
- `fastapi` - Web framework
- `uvicorn` - ASGI server
- `motor` - Async MongoDB driver
- `pydantic` - Data validation

### Utilities
- `python-dotenv` - Environment management
- `requests` - HTTP client
- `dnspython` - DNS resolution
- `python-whois` - WHOIS lookups

## 🧪 Testing

```bash
# Run tests (future)
pytest tests/

# Run with coverage
pytest --cov=. tests/

# Lint code
flake8 .
black .
```

## 📊 Performance

- Async/await for I/O operations
- Connection pooling for MongoDB
- Efficient data serialization
- Cached threat intelligence results (future)

## 🔄 Migration from server.py

See [MIGRATION_GUIDE.md](../MIGRATION_GUIDE.md) for detailed instructions.

**TL;DR:**
- `server.py` → `main.py`
- Imports: `from utils.module import Class`
- Entry: `uvicorn main:app`

---

**Happy Coding! 🚀**
