# 🚀 Quick Start Guide

## 📍 Current Status

Your CTI IOC Lookup Tool has been restructured for production deployment!

✅ **Working Now**: Original `server.py` (Emergent platform)
✅ **New Structure**: Modular `main.py` (Ready for deployment)
✅ **Both Maintained**: Choose what works for you

---

## 🎯 Choose Your Path

### Path 1: Continue Current Setup (No Changes)

**If you want to keep using the current Emergent setup:**

```bash
# Everything works as-is
# Check status
sudo supervisorctl status

# View app
# Backend: https://your-preview-url.emergentagent.com
# Frontend: https://your-preview-url.emergentagent.com
```

**No action needed! ✅**

---

### Path 2: Deploy to Free Hosting

**Want to host your app publicly for free? Follow this:**

#### Step 1: Database (MongoDB Atlas)

1. Sign up: https://www.mongodb.com/cloud/atlas/register
2. Create free M0 cluster
3. Get connection string: `mongodb+srv://user:pass@cluster.mongodb.net/cti_tool`

**Time: 5 minutes**

#### Step 2: Backend (Railway - Easiest)

1. Go to: https://railway.app
2. Sign in with GitHub
3. **New Project** → **Deploy from GitHub**
4. Select your repo → Select `backend` folder
5. Add environment variables:
   ```
   MONGO_URL=your_mongodb_atlas_url
   DB_NAME=cti_tool
   VIRUSTOTAL_API_KEY=your_key
   ABUSEIPDB_API_KEY=your_key
   URLSCAN_API_KEY=your_key
   OTX_API_KEY=your_key
   GREYNOISE_API_KEY=your_key
   CORS_ORIGINS=*
   ```
6. Railway auto-detects Dockerfile and deploys
7. Copy your backend URL: `https://your-app.railway.app`

**Time: 10 minutes**

#### Step 3: Frontend (Vercel - Easiest)

1. Go to: https://vercel.com
2. Sign in with GitHub
3. **New Project** → Import your repo
4. Root directory: `frontend`
5. Framework: Create React App
6. Add environment variable:
   ```
   REACT_APP_BACKEND_URL=https://your-app.railway.app
   ```
7. Deploy!
8. Your app is live: `https://your-app.vercel.app`

**Time: 5 minutes**

#### Step 4: Update CORS

1. Go back to Railway
2. Update `CORS_ORIGINS` variable:
   ```
   CORS_ORIGINS=https://your-app.vercel.app
   ```
3. Save (auto-redeploys)

**Time: 1 minute**

#### 🎉 Done! Your App is Live!

**Total Time: ~20 minutes**
**Total Cost: $0/month**

---

## 📊 What's New?

### Project Structure

**Before:**
```
backend/
├── server.py          # Everything here (~300 lines)
├── ioc_detector.py
└── threat_intel.py
```

**After:**
```
backend/
├── config/            # Settings & database
├── models/            # Data models
├── routes/            # API endpoints (separated)
├── utils/             # Business logic
├── main.py            # New entry point
└── server.py          # Old entry (kept for compatibility)
```

### Benefits

✅ **Modular**: Each feature in its own file
✅ **Scalable**: Easy to add new features
✅ **Testable**: Can test individual components
✅ **Production-Ready**: Follows best practices
✅ **Deployment-Ready**: Includes Docker, Railway, Render configs

---

## 📖 Documentation

| Document | Purpose |
|----------|----------|
| [README.md](./README.md) | Full project overview |
| [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) | Detailed deployment steps (all platforms) |
| [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) | How to migrate from old to new structure |
| [PRODUCTION_SETUP.md](./PRODUCTION_SETUP.md) | Production configuration |
| [USAGE_GUIDE.md](./USAGE_GUIDE.md) | How to use the application |

---

## 🧰 Architecture Comparison

### Old Structure (Still Works)

```python
# server.py
app = FastAPI()

@app.post("/api/ioc/lookup")
async def lookup():
    # All logic here
    pass

@app.get("/api/ioc/history")
async def history():
    # All logic here
    pass
# ... 20 more endpoints
```

### New Structure (Production-Ready)

```python
# main.py (Entry point)
from routes import api_router
app = FastAPI()
app.include_router(api_router)

# routes/ioc_routes.py (IOC endpoints)
@router.post("/lookup")
async def lookup(): pass

@router.get("/history")
async def history(): pass

# routes/email_routes.py (Email endpoints)
@router.post("/check-domain")
async def check(): pass

# routes/file_routes.py (File endpoints)
@router.post("/analyze")
async def analyze(): pass
```

**Result**: Same functionality, better organization!

---

## ❓ FAQ

### Do I need to change anything now?
**No.** Current setup continues to work. New structure is for deployment.

### Which structure should I use?
- **Current Emergent setup**: Use `server.py` (no changes)
- **Deploying to Railway/Render**: Use `main.py` (new structure)
- **Local development**: Either works!

### Will my data be affected?
**No.** Database structure unchanged. Both use same MongoDB.

### Can I switch between them?
**Yes.** Stop one, start the other. They're compatible.

### What about my API keys?
**Same.** Both use the same `.env` file.

### How much will deployment cost?

| Service | Free Tier |
|---------|------------|
| MongoDB Atlas | 512MB |
| Railway | $5 credit (~500 hours) |
| Vercel | Unlimited |
| **Total** | **$0/month** |

---

## 📝 Quick Commands

### Check Current Status
```bash
sudo supervisorctl status
```

### View Logs
```bash
tail -f /var/log/supervisor/backend.out.log
tail -f /var/log/supervisor/frontend.out.log
```

### Test New Structure
```bash
cd /app/backend
python main.py
```

### Test Endpoints
```bash
# Health
curl http://localhost:8001/health

# API Docs
open http://localhost:8001/api/docs

# IOC Lookup
curl -X POST http://localhost:8001/api/ioc/lookup \
  -H "Content-Type: application/json" \
  -d '{"text": "8.8.8.8"}'
```

---

## 👥 Who Should Use What?

### Use Current Setup (`server.py`)
- 👤 You're happy with Emergent platform
- 👤 Don't want to manage external hosting
- 👤 Just want it to work (it does!)

### Use New Structure (`main.py`)
- 👥 Deploying to production
- 👥 Want to host publicly
- 👥 Working in a team
- 👥 Want better code organization
- 👥 Planning to add many features

---

## 🌐 Free Hosting Platforms

### Backend Options
1. **Railway** (Recommended)
   - Easiest setup
   - $5 free credit/month
   - Auto-deploy from GitHub

2. **Render**
   - 750 hours/month free
   - Automatic HTTPS
   - Easy environment vars

3. **Fly.io**
   - 3 VMs free
   - Global deployment
   - CLI-based

### Frontend Options
1. **Vercel** (Recommended for React)
   - Unlimited deployments
   - Automatic previews
   - Zero config

2. **Netlify**
   - 100GB bandwidth
   - Form handling
   - Split testing

3. **Cloudflare Pages**
   - Unlimited bandwidth
   - Fastest CDN
   - Good DDoS protection

---

## ✅ Deployment Checklist

### Pre-Deployment
- [ ] MongoDB Atlas account created
- [ ] Connection string obtained
- [ ] All API keys ready
- [ ] GitHub repository set up

### Backend (Railway)
- [ ] Account created
- [ ] Project deployed from GitHub
- [ ] Environment variables added
- [ ] Deployment successful
- [ ] Backend URL copied
- [ ] Health endpoint tested

### Frontend (Vercel)
- [ ] Account created
- [ ] Project imported
- [ ] Backend URL added to env vars
- [ ] Deployment successful
- [ ] Frontend URL obtained
- [ ] App loads in browser

### Post-Deployment
- [ ] Updated CORS in backend
- [ ] Tested IOC lookup
- [ ] Tested history page
- [ ] Tested email analysis
- [ ] Tested file upload
- [ ] Bookmarked app URL

---

## 🎉 Next Steps

1. **Try the app**: Test all features
2. **Read docs**: Check out DEPLOYMENT_GUIDE.md
3. **Deploy**: Follow the 20-minute guide above
4. **Share**: Give the URL to your team
5. **Enhance**: Add new features easily with modular structure

---

**Need Help?**
- 📖 Read: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- 🔧 Issues: Check logs or open GitHub issue
- 💬 Questions: Check FAQ above

**Happy Deploying! 🚀**
