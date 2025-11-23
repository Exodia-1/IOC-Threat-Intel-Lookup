# 🗺️ CTI IOC Lookup Tool - Project Map

## 📊 Visual Structure

```
CTI IOC Lookup Tool
├── 🎨 Frontend (React)
│   ├── Pages
│   │   ├── IOC Lookup (Main Dashboard)
│   │   ├── History (Paginated)
│   │   ├── Email Analysis
│   │   └── File Analysis
│   └── Components
│       ├── ResultsDisplay (Charts & Graphs)
│       └── UI Components (Shadcn)
│
├── ⚙️ Backend (FastAPI)
│   ├── Routes
│   │   ├── IOC Lookup & History
│   │   ├── Email Analysis
│   │   ├── File Analysis
│   │   └── Health Checks
│   ├── Threat Intel Sources
│   │   ├── VirusTotal
│   │   ├── AbuseIPDB
│   │   ├── urlscan.io
│   │   ├── AlienVault OTX
│   │   ├── GreyNoise
│   │   ├── WHOIS
│   │   └── MXToolbox
│   └── Utilities
│       ├── IOC Detector (Defanging)
│       ├── Email Analyzer
│       └── File Analyzer
│
└── 💾 Database (MongoDB)
    ├── ioc_lookups (Max 150 entries)
    └── status_checks
```

## 🔄 Data Flow

### IOC Lookup Flow
```
User Input (Frontend)
    ↓
IOC Detection & Defanging
    ↓
Parallel Queries to Threat Intel Sources
    ├── VirusTotal
    ├── AbuseIPDB
    ├── urlscan.io
    ├── OTX
    ├── GreyNoise
    ├── WHOIS
    └── MXToolbox
    ↓
Aggregate Results
    ↓
Store in MongoDB (with 150 limit)
    ↓
Return to Frontend
    ↓
Display with Charts & Graphs
```

### Email Analysis Flow
```
User Input (Email/Domain/Headers)
    ↓
Domain Security Check
    ├── MX Records
    ├── SPF Record
    ├── DMARC Record
    └── DKIM Check
    ↓
Header Parsing (if headers provided)
    ├── Extract IPs
    ├── Extract Domains
    ├── Extract Sender Info
    └── Analyze Route
    ↓
Return Analysis Results
```

### File Analysis Flow
```
User Uploads File
    ↓
Calculate Hashes
    ├── MD5
    ├── SHA1
    └── SHA256
    ↓
Extract Metadata
    ├── File Size
    ├── MIME Type
    └── File Name
    ↓
Optional: Hash Lookup
    ├── Query VirusTotal
    └── Get File Details
    ↓
Return to User
```

## 📁 File Organization

### Backend Structure
```
/app/backend/
├── 🔧 config/
│   ├── settings.py          # All environment variables
│   └── database.py          # MongoDB connection
│
├── 📦 models/
│   ├── ioc_models.py        # IOC requests/responses
│   ├── email_models.py      # Email analysis models
│   └── file_models.py       # File analysis models
│
├── 🛣️ routes/
│   ├── health_routes.py     # /api/ health checks
│   ├── ioc_routes.py        # /api/ioc/* endpoints
│   ├── email_routes.py      # /api/email/* endpoints
│   └── file_routes.py       # /api/file/* endpoints
│
├── 🔨 utils/
│   ├── ioc_detector.py      # IOC extraction & defanging
│   ├── threat_intel.py      # External API aggregator
│   ├── email_analyzer.py    # Email/domain checks
│   └── file_analyzer.py     # File hash calculation
│
├── 🚀 main.py               # New entry point (modular)
├── 📜 server.py             # Legacy entry (maintained)
└── 📋 requirements.txt      # Python dependencies
```

### Frontend Structure
```
/app/frontend/
├── 📄 public/
│   └── index.html           # HTML template
│
├── 💻 src/
│   ├── pages/
│   │   ├── LookupPage.js        # Main IOC dashboard
│   │   ├── HistoryPage.js       # Lookup history
│   │   ├── EmailAnalysisPage.js # Email tools
│   │   └── FileAnalysisPage.js  # File upload
│   │
│   ├── components/
│   │   ├── ResultsDisplay.js    # Results with charts
│   │   └── ui/                  # Shadcn components
│   │
│   ├── App.js                   # Main app + routing
│   └── App.css                  # Global styles
│
└── 📦 package.json              # Node dependencies
```

## 🔑 Key Files

### Must-Read Files
1. **README.md** - Project overview
2. **QUICK_START.md** - Get started in 5 minutes
3. **DEPLOYMENT_GUIDE.md** - Full deployment instructions
4. **backend/.env** - API keys and configuration
5. **frontend/.env** - Backend URL configuration

### Configuration Files
- `backend/.env` - Backend environment variables
- `frontend/.env` - Frontend environment variables
- `backend/Dockerfile` - Docker configuration
- `frontend/netlify.toml` - Netlify deployment
- `frontend/vercel.json` - Vercel deployment
- `backend/railway.json` - Railway deployment
- `backend/render.yaml` - Render deployment

### Documentation Files
- `README.md` - Main documentation
- `QUICK_START.md` - Quick start guide
- `DEPLOYMENT_GUIDE.md` - Deployment instructions
- `MIGRATION_GUIDE.md` - Old → New structure migration
- `PRODUCTION_SETUP.md` - Production configuration
- `USAGE_GUIDE.md` - How to use the app
- `PROJECT_MAP.md` - This file

## 🎯 API Endpoints Map

### Base URL: `/api`

```
📍 Health & Status
├── GET  /health              # App health check
├── GET  /api/                # API status
├── POST /api/status          # Create status check
└── GET  /api/status          # Get status checks

📍 IOC Operations
├── POST /api/ioc/lookup      # Lookup IOCs
├── GET  /api/ioc/history     # Get history (paginated)
└── GET  /api/ioc/stats       # Get statistics

📍 Email Analysis
├── POST /api/email/check-domain      # Check domain security
└── POST /api/email/analyze-headers   # Analyze email headers

📍 File Operations
├── POST /api/file/analyze    # Upload file for hashing
└── POST /api/file/check-hash # Check hash against threat intel
```

## 🔐 Environment Variables Map

### Backend (.env)
```bash
# Database
MONGO_URL=mongodb://...           # MongoDB connection string
DB_NAME=cti_tool                  # Database name

# Threat Intelligence APIs
VIRUSTOTAL_API_KEY=xxx            # VirusTotal API key
ABUSEIPDB_API_KEY=xxx             # AbuseIPDB API key
URLSCAN_API_KEY=xxx               # urlscan.io API key
OTX_API_KEY=xxx                   # AlienVault OTX API key
GREYNOISE_API_KEY=xxx             # GreyNoise API key

# App Configuration
LOG_LEVEL=INFO                    # Logging level
CORS_ORIGINS=http://localhost:3000  # Allowed origins
```

### Frontend (.env)
```bash
# Backend URL
REACT_APP_BACKEND_URL=http://localhost:8001  # Backend API URL
```

## 🗃️ Database Schema

### Collection: `ioc_lookups`
```javascript
{
  "ioc": "8.8.8.8",              // The IOC value
  "type": "ip",                   // IOC type (ip, domain, url, hash)
  "results": {                    // Aggregated results
    "virustotal": {...},
    "abuseipdb": {...},
    "urlscan": {...},
    "otx": {...},
    "greynoise": {...},
    "whois": {...},
    "mxtoolbox": {...}
  },
  "timestamp": "2024-01-01T00:00:00Z"  // ISO timestamp
}
```

**Note**: Collection is automatically limited to 150 most recent entries.

### Collection: `status_checks`
```javascript
{
  "id": "uuid",
  "client_name": "string",
  "timestamp": "ISO-timestamp"
}
```

## 🛠️ Tech Stack Map

### Frontend
- **Framework**: React 18.x
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Routing**: React Router
- **HTTP**: Fetch API
- **Build**: Create React App + Craco

### Backend
- **Framework**: FastAPI
- **Server**: Uvicorn
- **Database**: Motor (Async MongoDB)
- **Validation**: Pydantic
- **CORS**: FastAPI CORS Middleware
- **Async**: asyncio

### Database
- **Database**: MongoDB
- **Driver**: Motor (async)
- **Host**: Local / MongoDB Atlas

### DevOps
- **Containerization**: Docker
- **Process Manager**: Supervisor (Emergent)
- **Backend Deployment**: Railway / Render / Fly.io
- **Frontend Deployment**: Vercel / Netlify / Cloudflare Pages

## 🔄 Development Workflow

### Local Development
```bash
# 1. Start MongoDB
mongod --dbpath /data/db

# 2. Start Backend (Terminal 1)
cd backend
python main.py  # or: uvicorn main:app --reload

# 3. Start Frontend (Terminal 2)
cd frontend
yarn start
```

### Testing
```bash
# Backend
curl http://localhost:8001/health
curl http://localhost:8001/api/docs

# Frontend
open http://localhost:3000
```

### Deployment
```bash
# 1. Set up MongoDB Atlas
# 2. Deploy backend to Railway
# 3. Deploy frontend to Vercel
# 4. Update CORS settings
```

## 📊 Feature Map

### ✅ Implemented Features
- [x] Multi-IOC lookup (IP, domain, URL, hash, email)
- [x] Bulk IOC analysis
- [x] IOC defanging
- [x] 7 threat intelligence sources integrated
- [x] Visual results (charts, gauges)
- [x] Lookup history (150 entries, paginated)
- [x] Email domain security checks
- [x] Email header analysis
- [x] File upload and hash extraction
- [x] Enhanced hash details from VirusTotal
- [x] URL redirect detection
- [x] Link extraction from URLs
- [x] Referral links to source reports

### 🔮 Potential Future Features
- [ ] User authentication
- [ ] Export functionality (CSV, JSON, PDF)
- [ ] Scheduled monitoring
- [ ] Webhook notifications
- [ ] More threat intel sources
- [ ] API rate limiting
- [ ] Result caching
- [ ] Advanced filtering
- [ ] Custom dashboards
- [ ] Team collaboration

## 🎯 Priority Order

### High Priority (Production-Ready)
1. ✅ Code refactoring (completed)
2. ✅ Deployment configurations (completed)
3. ✅ Documentation (completed)
4. ⏳ User testing
5. ⏳ Deploy to production

### Medium Priority (Enhancements)
1. Unit tests
2. Integration tests
3. Error handling improvements
4. Rate limiting
5. Result caching

### Low Priority (Nice-to-Have)
1. User authentication
2. Export features
3. Scheduled monitoring
4. More integrations
5. Mobile app

## 🚀 Quick Navigation

**Get Started:**
→ [QUICK_START.md](./QUICK_START.md)

**Deploy Your App:**
→ [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

**Understand Structure:**
→ [README.md](./README.md)

**Migrate Code:**
→ [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)

**Production Config:**
→ [PRODUCTION_SETUP.md](./PRODUCTION_SETUP.md)

**Use the App:**
→ [USAGE_GUIDE.md](./USAGE_GUIDE.md)

---

**This map gives you a complete overview of the project structure and workflow! 🗺️**
