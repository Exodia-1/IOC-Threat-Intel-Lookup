# Migration Guide: Old Structure to New Structure

This guide explains how to migrate from the old server structure to the new production-ready structure.

## 🔄 What Changed?

### Old Structure (Monolithic)
```
/app/backend/
├── server.py              # Everything in one file (~295 lines)
├── ioc_detector.py
├── threat_intel.py
├── email_analyzer.py
├── file_analyzer.py
└── requirements.txt
```

### New Structure (Modular)
```
/app/backend/
├── config/
│   ├── settings.py        # Centralized configuration
│   └── database.py        # Database connection
├── models/
│   ├── ioc_models.py
│   ├── email_models.py
│   └── file_models.py
├── routes/
│   ├── health_routes.py
│   ├── ioc_routes.py
│   ├── email_routes.py
│   └── file_routes.py
├── utils/
│   ├── ioc_detector.py
│   ├── threat_intel.py
│   ├── email_analyzer.py
│   └── file_analyzer.py
├── main.py                # New entry point
└── server.py              # Legacy (can be removed)
```

## ✅ Benefits of New Structure

1. **Separation of Concerns**: Each module has a single responsibility
2. **Easier Testing**: Individual routes can be tested in isolation
3. **Better Scalability**: Easy to add new features without touching existing code
4. **Cleaner Imports**: No circular dependencies
5. **Production Ready**: Follows FastAPI best practices
6. **Deployment Ready**: Includes Docker, Railway, and Render configs

## 🔧 Migration Steps

### Step 1: Understanding the New Entry Point

**Old (`server.py`):**
```python
from fastapi import FastAPI
app = FastAPI()

@app.post("/api/ioc/lookup")
async def lookup_iocs(request):
    # 50 lines of code
    pass

@app.get("/api/ioc/history")
async def get_history():
    # 40 lines of code
    pass
# ... more routes
```

**New (`main.py`):**
```python
from fastapi import FastAPI
from routes import api_router

app = FastAPI()
app.include_router(api_router)
```

All routes are now in separate files under `routes/`.

### Step 2: Configuration Management

**Old:**
```python
# In server.py
load_dotenv()
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
```

**New:**
```python
# In config/settings.py
class Settings:
    MONGO_URL: str = os.environ.get('MONGO_URL')
    DB_NAME: str = os.environ.get('DB_NAME')
    # All settings in one place

settings = Settings()
```

### Step 3: Database Connection

**Old:**
```python
# Direct connection in server.py
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]
```

**New:**
```python
# In config/database.py
class Database:
    @classmethod
    def get_db(cls):
        if cls.client is None:
            cls.client = AsyncIOMotorClient(settings.MONGO_URL)
        return cls.client[settings.DB_NAME]

db = Database.get_db()
```

### Step 4: Import Changes

**Old imports:**
```python
from ioc_detector import IOCDetector
from threat_intel import ThreatIntelAggregator
```

**New imports:**
```python
from utils.ioc_detector import IOCDetector
from utils.threat_intel import ThreatIntelAggregator
# or
from utils import IOCDetector, ThreatIntelAggregator
```

## 📝 Key Changes Summary

| Component | Old Location | New Location |
|-----------|--------------|---------------|
| Main app | `server.py` | `main.py` |
| IOC routes | `server.py` lines 96-210 | `routes/ioc_routes.py` |
| Email routes | `server.py` lines 212-239 | `routes/email_routes.py` |
| File routes | `server.py` lines 241-274 | `routes/file_routes.py` |
| Health check | `server.py` lines 67-93 | `routes/health_routes.py` |
| Config | Scattered in `server.py` | `config/settings.py` |
| Database | Global in `server.py` | `config/database.py` |
| Models | Inline in `server.py` | `models/*.py` |
| Utils | Root directory | `utils/` directory |

## ⚠️ Breaking Changes

### 1. Import Paths

**Before:**
```python
from ioc_detector import IOCDetector
```

**After:**
```python
from utils.ioc_detector import IOCDetector
```

### 2. Entry Point

**Before:**
```bash
uvicorn server:app
```

**After:**
```bash
uvicorn main:app
```

### 3. Model Imports

**Before:**
```python
# Models defined in server.py
class IOCLookupRequest(BaseModel):
    text: str
```

**After:**
```python
from models.ioc_models import IOCLookupRequest
```

## 🚀 Running the New Structure

### Development

```bash
# Backend
cd backend
python main.py
# or
uvicorn main:app --reload
```

### Production

```bash
# Using Docker
docker build -t cti-tool .
docker run -p 8001:8001 --env-file .env cti-tool

# Using Gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker
```

## 🧹 Cleanup Old Files (After Migration)

Once you've verified the new structure works:

```bash
# Backup old server
mv backend/server.py backend/server.py.backup

# Remove old utility files from root
rm backend/ioc_detector.py
rm backend/threat_intel.py
rm backend/email_analyzer.py
rm backend/file_analyzer.py

# They're now in backend/utils/
```

## ✅ Testing Migration

### 1. Test Backend Starts
```bash
cd backend
python main.py
# Should see: "Starting CTI IOC Lookup Tool..."
```

### 2. Test Health Endpoint
```bash
curl http://localhost:8001/health
# Should return: {"status": "healthy", ...}
```

### 3. Test API Endpoints
```bash
# IOC Lookup
curl -X POST http://localhost:8001/api/ioc/lookup \
  -H "Content-Type: application/json" \
  -d '{"text": "8.8.8.8"}'

# History
curl http://localhost:8001/api/ioc/history
```

### 4. Test Frontend Connection
```bash
cd frontend
yarn start
# Open http://localhost:3000
# Try an IOC lookup
```

## 🔍 Rollback Plan

If something goes wrong:

```bash
# Stop new server
pkill -f "python main.py"

# Restore old server
mv backend/server.py.backup backend/server.py

# Restore old utils (if removed)
cp backend/utils/*.py backend/

# Start old server
cd backend
uvicorn server:app --reload
```

## 📚 Additional Resources

- [FastAPI Best Practices](https://fastapi.tiangolo.com/tutorial/bigger-applications/)
- [Python Project Structure](https://docs.python-guide.org/writing/structure/)
- [Twelve-Factor App](https://12factor.net/)

## ❓ FAQ

**Q: Do I need to change my environment variables?**
A: No, the `.env` file remains the same.

**Q: Will my database data be affected?**
A: No, the database structure and data remain unchanged.

**Q: Can I keep both old and new structures?**
A: Yes, but only run one at a time to avoid port conflicts.

**Q: What about supervisor configuration?**
A: Update supervisor to point to `main:app` instead of `server:app`.

**Q: Do I need to redeploy?**
A: Yes, you'll need to redeploy with the new structure.

---

**Migration Complete! 🎉**
