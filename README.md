# CTI IOC Lookup Tool 🔍

A comprehensive Cyber Threat Intelligence (CTI) dashboard for analyzing Indicators of Compromise (IOCs) across multiple threat intelligence sources.

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![Python](https://img.shields.io/badge/python-3.11-blue.svg)
![React](https://img.shields.io/badge/react-18.x-blue.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115.12-green.svg)
![Vercel](https://img.shields.io/badge/deployed%20on-Vercel-black.svg)

## 🔥 Features

### Core Functionality
- ✅ **Multi-IOC Lookup**: Supports IPs, domains, URLs, file hashes (MD5, SHA1, SHA256), and emails
- ✅ **Bulk Analysis**: Paste multiple IOCs at once for batch processing
- ✅ **IOC Defanging**: Automatically detects and cleans "fanged" indicators (e.g., `hxxp://example[.]com`)
- ✅ **Visual Dashboard**: Results displayed with graphs, charts, and risk scores
- ✅ **History Management**: Stores last 150 lookups with pagination

### Threat Intelligence Sources
- 🛡️ **VirusTotal**: Comprehensive malware and URL analysis
- 🛡️ **AbuseIPDB**: IP reputation and abuse reports
- 🛡️ **urlscan.io**: URL scanning and screenshot analysis
- 🛡️ **AlienVault OTX**: Open threat exchange platform
- 🛡️ **GreyNoise**: Internet scanner detection
- 🛡️ **WHOIS**: Domain registration information
- 🛡️ **MXToolbox**: Email and DNS security checks

### Advanced Analysis
- 📬 **Email Analysis**: Domain security checks (SPF, DMARC, DKIM, MX) and header parsing
- 📄 **File Analysis**: Upload files to extract hashes and metadata
- 🔗 **URL Analysis**: Detect redirects and extract all links from web pages
- 🔎 **Enhanced Hash Details**: Detailed file information from VirusTotal (type, size, names, tags)

---

## 🏗️ Architecture

### Technology Stack

**Frontend:**
- React 18.x
- Tailwind CSS
- Recharts (for visualizations)
- React Router

**Backend:**
- FastAPI (Python 3.11)
- Motor (Async MongoDB driver)
- Pydantic (Data validation)

**Database:**
- MongoDB

**Deployment:**
- Docker support
- Railway / Render ready
- Vercel / Netlify ready (frontend)

---

## 📁 Project Structure

```
/app
├── backend/
│   ├── config/                  # Configuration management
│   │   ├── __init__.py
│   │   ├── settings.py          # Environment variables and settings
│   │   └── database.py          # Database connection handler
│   │
│   ├── models/                  # Pydantic models
│   │   ├── __init__.py
│   │   ├── ioc_models.py        # IOC request/response models
│   │   ├── email_models.py      # Email analysis models
│   │   └── file_models.py       # File analysis models
│   │
│   ├── routes/                  # API endpoints
│   │   ├── __init__.py
│   │   ├── health_routes.py     # Health check endpoints
│   │   ├── ioc_routes.py        # IOC lookup and history
│   │   ├── email_routes.py      # Email analysis
│   │   └── file_routes.py       # File analysis
│   │
│   ├── utils/                   # Utility modules
│   │   ├── __init__.py
│   │   ├── ioc_detector.py      # IOC detection and defanging
│   │   ├── threat_intel.py      # Threat intelligence aggregator
│   │   ├── email_analyzer.py    # Email analysis logic
│   │   └── file_analyzer.py     # File hash calculation
│   │
│   ├── tests/                   # Test files (future)
│   ├── main.py                  # FastAPI application entry point
│   ├── server.py                # Legacy server (to be removed)
│   ├── requirements.txt         # Python dependencies
│   ├── Dockerfile               # Docker configuration
│   ├── .env                     # Environment variables (gitignored)
│   └── .env.example             # Environment template
│
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   └── ...
│   │
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── ui/             # Shadcn UI components
│   │   │   └── ResultsDisplay.js
│   │   │
│   │   ├── pages/              # Page components
│   │   │   ├── LookupPage.js
│   │   │   ├── HistoryPage.js
│   │   │   ├── EmailAnalysisPage.js
│   │   │   └── FileAnalysisPage.js
│   │   │
│   │   ├── App.js              # Main app with routing
│   │   ├── App.css             # Global styles
│   │   └── index.js            # React entry point
│   │
│   ├── package.json
│   ├── tailwind.config.js
│   ├── craco.config.js
│   ├── netlify.toml            # Netlify configuration
│   ├── vercel.json             # Vercel configuration
│   └── .env.example
│
├── DEPLOYMENT_GUIDE.md      # Comprehensive deployment instructions
├── USAGE_GUIDE.md           # User guide
└── README.md                # This file
```

---

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- MongoDB (local or Atlas)
- API keys for threat intelligence sources

### 1. Clone and Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd app
```

### 2. Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment template
cp .env.example .env

# Edit .env and add your API keys
nano .env  # or use your preferred editor
```

**Required API Keys:**
- [VirusTotal](https://www.virustotal.com/gui/join-us)
- [AbuseIPDB](https://www.abuseipdb.com/register)
- [urlscan.io](https://urlscan.io/user/signup)
- [AlienVault OTX](https://otx.alienvault.com/)
- [GreyNoise](https://www.greynoise.io/)

```bash
# Start backend server
python main.py
# or
uvicorn main:app --reload --host 0.0.0.0 --port 8001
```

Backend will be available at: http://localhost:8001
API Documentation: http://localhost:8001/api/docs

### 3. Frontend Setup

```bash
# Navigate to frontend (in new terminal)
cd frontend

# Install dependencies
yarn install

# Create environment file
cp .env.example .env

# Edit .env
echo "REACT_APP_BACKEND_URL=http://localhost:8001" > .env

# Start frontend
yarn start
```

Frontend will be available at: http://localhost:3000

---

## 📚 API Documentation

Once the backend is running, visit:
- **Swagger UI**: http://localhost:8001/api/docs
- **ReDoc**: http://localhost:8001/api/redoc

### Key Endpoints

**Health Check:**
```bash
GET /health
GET /api/
```

**IOC Operations:**
```bash
POST /api/ioc/lookup      # Lookup IOCs
GET  /api/ioc/history     # Get lookup history
GET  /api/ioc/stats       # Get statistics
```

**Email Analysis:**
```bash
POST /api/email/check-domain       # Check email domain security
POST /api/email/analyze-headers    # Analyze email headers
```

**File Analysis:**
```bash
POST /api/file/analyze      # Upload file for hash extraction
POST /api/file/check-hash   # Check hash against threat intel
```

---

## 📦 Deployment

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for comprehensive deployment instructions.

### Quick Deploy Options

**Backend:**
- ✅ Railway (Recommended)
- ✅ Render
- ✅ Fly.io

**Frontend:**
- ✅ Vercel (Recommended)
- ✅ Netlify
- ✅ Cloudflare Pages

**Database:**
- ✅ MongoDB Atlas (Free tier: 512MB)

**All platforms offer free tiers suitable for this application.**

---

## 🧪 Testing

### Manual Testing

**Test Backend:**
```bash
# Health check
curl http://localhost:8001/health

# IOC lookup
curl -X POST http://localhost:8001/api/ioc/lookup \
  -H "Content-Type: application/json" \
  -d '{"text": "8.8.8.8"}'

# Get history
curl http://localhost:8001/api/ioc/history?page=1&per_page=10
```

**Test Frontend:**
1. Open http://localhost:3000
2. Enter IOC (e.g., `8.8.8.8`)
3. View results
4. Check history page
5. Try email analysis
6. Upload a file for analysis

### Automated Tests (Future)
```bash
# Backend tests
cd backend
pytest tests/

# Frontend tests
cd frontend
yarn test
```

---

## 🔧 Development

### Adding New Threat Intel Source

1. **Update `utils/threat_intel.py`:**
```python
def query_new_source(self, ioc_value, ioc_type):
    # Add your API logic here
    pass
```

2. **Add to aggregator:**
```python
async def lookup(self, ioc_value, ioc_type):
    # Add new source to the lookup chain
    results['new_source'] = self.query_new_source(ioc_value, ioc_type)
```

3. **Update frontend `ResultsDisplay.js`** to show new source data

### Code Style

**Backend:**
- Use `black` for formatting
- Follow PEP 8
- Use type hints

**Frontend:**
- Use ESLint
- Follow Airbnb style guide
- Use functional components with hooks

---

## 🐛 Known Issues

- None currently

---

## 🛣️ Roadmap

- [ ] Add unit tests
- [ ] Add integration tests
- [ ] Implement user authentication
- [ ] Add export functionality (CSV, JSON, PDF)
- [ ] Add scheduled IOC monitoring
- [ ] Implement webhook notifications
- [ ] Add more threat intelligence sources
- [ ] Create mobile-responsive enhancements

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License.

---

## 📧 Support

For issues, questions, or contributions:
- Open an issue on GitHub
- Contact: [Your Contact Info]

---

## 🚀 Acknowledgments

- VirusTotal, AbuseIPDB, urlscan.io, AlienVault OTX, GreyNoise for their APIs
- FastAPI and React communities
- All contributors

---

**Built with ❤️ for the cybersecurity community**
