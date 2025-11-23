# 🚀 Vercel Deployment - Single Function (FIXED!)

**Fixed the 12 function limit - Now uses only 1 serverless function!**

**Time:** 8 minutes | **Cost:** $0/month | **Works:** ✅

---

## ✅ What Was Fixed

**Problem:** Vercel created 12+ separate serverless functions (one per Python file)
**Solution:** Consolidated into ONE serverless function with all routes inside

### New Structure

```
/app/frontend/
├── api/
│   ├── index.py           ← ONLY THIS is a serverless function
│   └── requirements.txt
├── _api/                  ← Backend code (not exposed)
│   ├── routes/
│   ├── utils/
│   ├── config/
│   └── models/
├── src/                   ← React frontend
└── vercel.json
```

**Result:** Only 1 serverless function = Works on free tier! ✅

---

## 🚀 Deployment Steps (8 Minutes)

### Step 1: Push to GitHub (2 min)

```bash
cd /app
git add .
git commit -m "Fixed: Single serverless function for Vercel"
git push origin main
```

### Step 2: Deploy on Vercel (3 min)

1. Go to https://vercel.com
2. Sign up with GitHub
3. Click **"Add New..."** → **"Project"**
4. Import your repository

**CRITICAL SETTINGS:**
```
Root Directory: frontend  ← MUST SET THIS!
Framework Preset: Other
Build Command: yarn build
Output Directory: build
```

5. Click **"Deploy"**

### Step 3: Add Environment Variables (2 min)

Go to **Settings** → **Environment Variables**

Add these 7 variables:

```bash
VIRUSTOTAL_API_KEY=your_virustotal_key
ABUSEIPDB_API_KEY=your_abuseipdb_key
URLSCAN_API_KEY=your_urlscan_key
OTX_API_KEY=your_otx_key
GREYNOISE_API_KEY=your_greynoise_key
LOG_LEVEL=INFO
CORS_ORIGINS=*
```

**Where to get API keys:**
- [VirusTotal](https://www.virustotal.com/gui/join-us)
- [AbuseIPDB](https://www.abuseipdb.com/register)
- [urlscan.io](https://urlscan.io/user/signup)
- [AlienVault OTX](https://otx.alienvault.com/)
- [GreyNoise](https://www.greynoise.io/)

### Step 4: Redeploy (1 min)

1. Go to **Deployments**
2. Click **⋯** on latest
3. Click **"Redeploy"**

**Wait 2-3 minutes...**

---

## 🎉 Done! Your App is Live

### Your URL
```
https://your-app.vercel.app
```

### All Endpoints
```
Frontend:   https://your-app.vercel.app/
Backend:    https://your-app.vercel.app/api/
Health:     https://your-app.vercel.app/health
```

### Test It

1. **Open frontend:** Visit `https://your-app.vercel.app`
2. **Test IOC lookup:** Enter `8.8.8.8` → Click "Lookup IOCs"
3. **Test email:** Click "Email Analysis" → Enter `example.com`
4. **Test file:** Click "File Analysis" → Upload a file

---

## 📊 How It Works

### Architecture

```
Vercel
│
├── Frontend (React)
│   └── Static files from /build/
│
└── Backend (1 Function!)
    └── /api/index.py
        ├── FastAPI app
        ├── All routes inside
        └── Uses code from /_api/
```

### Why This Works

**Before (Failed):**
- ❌ 12+ Python files = 12+ functions
- ❌ Exceeds free tier limit
- ❌ Deployment fails

**After (Works):**
- ✅ 1 Python file = 1 function
- ✅ Within free tier limit
- ✅ Deployment succeeds

### Routing

```
/                → Frontend (index.html)
/email           → Frontend (index.html)
/file            → Frontend (index.html)
/api/*           → Backend (api/index.py)
/health          → Backend (api/index.py)
```

---

## ✅ Verification

### Check Function Count

After deployment:
1. Vercel Dashboard → Your Project
2. Settings → Functions
3. Should show: **1 function** ✅

### Test Backend

```bash
# Health check
curl https://your-app.vercel.app/health

# API root
curl https://your-app.vercel.app/api/

# IOC lookup
curl -X POST https://your-app.vercel.app/api/ioc/lookup \
  -H "Content-Type: application/json" \
  -d '{"text": "8.8.8.8"}'
```

---

## 🔧 Troubleshooting

### Issue: Still Getting Function Limit Error

**Check:**
- Only `/frontend/api/index.py` exists in `/api/` folder
- All other code is in `/frontend/_api/` folder

**Fix:**
```bash
cd /app/frontend
ls api/        # Should only show: index.py, requirements.txt
ls _api/       # Should show: routes/, utils/, config/, models/
```

### Issue: Import Errors

**Check:**
- `_api` folder exists
- Path is added in index.py: `sys.path.insert(0, str(api_path))`

**Fix:**
- Verify file structure matches guide
- Check function logs in Vercel

### Issue: API Not Working

**Check:**
- All environment variables set
- Redeployed after adding variables

**Fix:**
```bash
# Test health endpoint
curl https://your-app.vercel.app/health

# Check function logs
Vercel → Deployments → [Latest] → Function Logs
```

---

## 📈 File Structure Explained

### `/frontend/api/` (Exposed)
```
api/
├── index.py          ← Entry point (ONLY serverless function)
└── requirements.txt  ← Python dependencies
```

**Why:** Vercel only sees this folder for serverless functions

### `/frontend/_api/` (Hidden)
```
_api/
├── routes/
│   ├── __init__.py
│   ├── ioc_routes.py
│   ├── email_routes.py
│   └── file_routes.py
├── utils/
│   ├── ioc_detector.py
│   ├── threat_intel.py
│   ├── email_analyzer.py
│   └── file_analyzer.py
├── config/
│   └── settings.py
└── models/
    └── ...
```

**Why:** Underscore prefix (`_`) makes Vercel ignore these files

---

## 💡 Key Points

### What Makes This Work

1. **Single Entry Point:** Only `api/index.py` is a function
2. **Hidden Backend:** `_api/` folder is ignored by Vercel
3. **Import Path:** `index.py` imports from `_api/`
4. **FastAPI Router:** All routes are inside the single function

### Vercel Behavior

**Exposed (becomes functions):**
```
api/
└── *.py  ← Each .py file = 1 function
```

**Hidden (not functions):**
```
_api/     ← Underscore prefix = ignored
└── *.py  ← Used by import, not exposed
```

---

## ✅ Success Checklist

**Structure:**
- [ ] `/frontend/api/` has only `index.py` and `requirements.txt`
- [ ] `/frontend/_api/` has all backend code
- [ ] `vercel.json` routes to `/api/index.py`

**Deployment:**
- [ ] Root directory set to `frontend`
- [ ] All 7 environment variables added
- [ ] Redeployed after adding variables
- [ ] Function count shows: 1

**Testing:**
- [ ] Frontend loads
- [ ] `/health` returns healthy
- [ ] IOC lookup works
- [ ] Email analysis works
- [ ] File analysis works

---

## 🎯 Quick Reference

### Environment Variables (7 total)
```
VIRUSTOTAL_API_KEY=your_key
ABUSEIPDB_API_KEY=your_key
URLSCAN_API_KEY=your_key
OTX_API_KEY=your_key
GREYNOISE_API_KEY=your_key
LOG_LEVEL=INFO
CORS_ORIGINS=*
```

### Deploy Command
```bash
git add .
git commit -m "Deploy to Vercel"
git push origin main
```

**Vercel auto-deploys!** ✅

---

## 💰 Cost

**Free Tier:**
- ✅ 1 serverless function (within limit!)
- ✅ 100 GB bandwidth/month
- ✅ 100 GB-hours execution
- ✅ Unlimited deployments

**Monthly Cost:** $0 ✅

---

## 🎉 Summary

**Problem Solved:**
- ✅ Reduced from 12+ functions to 1 function
- ✅ Stays within free tier limit
- ✅ Deployment works!

**Architecture:**
- ✅ Single serverless function
- ✅ All routes inside FastAPI
- ✅ Backend code in `_api/` folder
- ✅ Same domain (no CORS)

**Result:**
- ✅ Everything on Vercel
- ✅ Everything in frontend directory
- ✅ 8-minute deployment
- ✅ $0/month cost
- ✅ **Actually works!** 🎊

---

**Deploy now and it will work! 🚀**
