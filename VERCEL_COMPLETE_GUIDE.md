# 🚀 Complete Vercel Deployment Guide

**Deploy EVERYTHING on Vercel - Backend + Frontend in ONE place!**

**Time:** 10 minutes | **Cost:** $0/month | **Platforms:** 1

---

## 🎯 What You're Deploying

```
Vercel
├── Frontend (React) - Static files
└── Backend (FastAPI) - Serverless functions at /api
```

**All on one domain!** `https://your-app.vercel.app`

---

## 📋 Prerequisites

- GitHub account
- Your code pushed to GitHub
- 5 API keys (VirusTotal, AbuseIPDB, urlscan.io, OTX, GreyNoise)

---

## 🚀 Deployment Steps

### Step 1: Push Your Code to GitHub

```bash
cd /app
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

### Step 2: Create Vercel Account

1. Go to https://vercel.com
2. Click **"Sign Up"**
3. Choose **"Continue with GitHub"**
4. Authorize Vercel to access your repositories

### Step 3: Import Your Project

1. Click **"Add New..."** → **"Project"**
2. Find your repository in the list
3. Click **"Import"**

### Step 4: Configure Project

**Root Directory:**
```
Leave blank (use root of repository)
```

**Framework Preset:**
```
Other (Vercel will auto-detect)
```

**Build Settings:**
- Will be auto-detected from `vercel.json`
- No need to change anything

### Step 5: Add Environment Variables

Click **"Environment Variables"** and add these:

```bash
# API Keys (REQUIRED)
VIRUSTOTAL_API_KEY=your_virustotal_key
ABUSEIPDB_API_KEY=your_abuseipdb_key
URLSCAN_API_KEY=your_urlscan_key
OTX_API_KEY=your_otx_key
GREYNOISE_API_KEY=your_greynoise_key

# App Config
LOG_LEVEL=INFO
CORS_ORIGINS=*
```

**Where to get API keys (All FREE):**
- [VirusTotal](https://www.virustotal.com/gui/join-us) - Sign up → Profile → API Key
- [AbuseIPDB](https://www.abuseipdb.com/register) - Register → API → Create Key
- [urlscan.io](https://urlscan.io/user/signup) - Sign up → Settings → API Key
- [AlienVault OTX](https://otx.alienvault.com/) - Create account → Settings → API
- [GreyNoise](https://www.greynoise.io/) - Sign up → Account → API Key

### Step 6: Deploy

1. Click **"Deploy"**
2. Wait 3-5 minutes
3. ✅ Your app is live!

**Your URL:** `https://your-app.vercel.app`

---

## 🎉 That's It! Test Your App

### Open Your App
Visit: `https://your-app.vercel.app`

### Test Endpoints

**Frontend:**
```bash
https://your-app.vercel.app
```

**Backend API:**
```bash
https://your-app.vercel.app/api/ioc/lookup
https://your-app.vercel.app/health
```

**API Documentation:**
```bash
https://your-app.vercel.app/api/docs
```

### Test Features

1. **IOC Lookup:** Enter `8.8.8.8` → Click "Lookup IOCs"
2. **Email Analysis:** Enter `example.com` → Click "Check Domain"
3. **File Analysis:** Upload a file → Click "Analyze File"

---

## 📊 How It Works

### Architecture

**Frontend:**
- Served as static files from `/frontend/build/`
- Fast global CDN delivery
- React app runs in browser

**Backend:**
- Runs as serverless functions in `/api/`
- Each API call triggers a function
- Auto-scales based on traffic
- No "always-on" server needed

**Routing:**
- `/` → Frontend (index.html)
- `/api/*` → Backend functions
- `/health` → Backend health check
- All static files served correctly

### File Structure
```
/app
├── vercel.json          # Configuration
├── api/
│   ├── main.py          # Backend entry point
│   └── requirements.txt # Python dependencies
├── backend/
│   ├── main.py          # FastAPI app
│   ├── routes/          # API routes
│   ├── utils/           # Business logic
│   └── config/          # Settings
└── frontend/
    ├── build/           # Production build (created)
    ├── src/             # React source
    └── package.json     # Dependencies
```

---

## ⚙️ Configuration Explained

### vercel.json
```json
{
  "builds": [
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build"  // Builds React app
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/main.py"  // API requests → Backend
    },
    {
      "src": "/(.*)",
      "dest": "/frontend/build/index.html"  // Everything else → Frontend
    }
  ]
}
```

### Environment Variables

**Backend access:**
```python
import os
api_key = os.environ.get('VIRUSTOTAL_API_KEY')
```

**Frontend access:**
```javascript
const backendUrl = process.env.REACT_APP_BACKEND_URL || '';
// Empty string = same domain
```

---

## 💡 Advantages

### Compared to Render + Vercel

| Feature | Vercel Only | Render + Vercel |
|---------|-------------|-----------------|
| **Platforms** | 1 | 2 |
| **Setup Time** | 10 min | 12 min |
| **Dashboards** | 1 | 2 |
| **CORS Config** | Not needed | Required |
| **Environment Vars** | 1 place | 2 places |
| **Deployment** | 1 command | 2 commands |
| **Domain** | Same | Different |
| **Cost** | $0 | $0 |

### Benefits

- ✅ **Single Platform:** Everything in one place
- ✅ **No CORS Issues:** Same domain
- ✅ **Faster Setup:** Fewer steps
- ✅ **Auto-Scaling:** Backend scales with traffic
- ✅ **Global CDN:** Frontend served globally
- ✅ **Easy Updates:** Single git push
- ✅ **Simple Debugging:** One dashboard

---

## ⚠️ Important Limitations

### Serverless Function Timeout

**Free Tier:**
- ⏱️ 10-second timeout per request
- 💾 1024 MB memory
- 🔄 Cold starts (~2 seconds)

**Will it work?**
✅ **YES** - Most threat intel APIs respond in 2-5 seconds

**If timeout occurs:**
- Upgrade to Hobby plan ($20/month) for 60-second timeout
- Or optimize queries to run faster
- Or switch to Render + Vercel

### Testing Needed

Deploy and test with real IOC lookups:
- If works perfectly → Done! ✅
- If timeout errors → Optimize or upgrade
- Can always switch to Render later

---

## 🔧 Making Updates

### Update Code

```bash
# Make changes
git add .
git commit -m "Update features"
git push origin main
```

**Vercel auto-deploys in 2 minutes!** ✅

### Update Environment Variables

1. Dashboard → Settings → Environment Variables
2. Edit or add variables
3. Redeploy:
   - Go to Deployments
   - Click **⋯** on latest
   - Click **"Redeploy"**

### View Logs

1. Dashboard → Deployments
2. Click latest deployment
3. View **Function Logs** or **Build Logs**

---

## 🐛 Troubleshooting

### Issue 1: Build Failed

**Check:**
```
Dashboard → Deployments → [Latest] → Build Logs
```

**Common fixes:**
- Verify `vercel.json` is in root directory
- Check frontend builds locally: `cd frontend && yarn build`
- Ensure all dependencies in `package.json`

### Issue 2: API Not Working

**Test directly:**
```bash
curl https://your-app.vercel.app/health
```

**Check:**
- Environment variables are set
- API logs in Function Logs
- `/api/main.py` exists

**Common fixes:**
- Add missing environment variables
- Check `/api/requirements.txt` has all dependencies
- Redeploy after adding env vars

### Issue 3: Function Timeout

**Error:** "FUNCTION_INVOCATION_TIMEOUT"

**Solutions:**
1. **Optimize queries** - Use async/await properly
2. **Reduce APIs** - Query fewer services
3. **Upgrade plan** - $20/month for 60s timeout
4. **Switch to Render** - Unlimited timeout

### Issue 4: Frontend Loads, API Fails

**Check browser console (F12):**
- Look for error messages
- Check network tab for failed requests

**Common fixes:**
- Verify environment variables in Vercel
- Check API logs for errors
- Test API endpoint directly

### Issue 5: Cold Start Delay

**Normal behavior:**
- First request after inactivity: ~2-3 seconds
- Subsequent requests: ~200-500ms

**Not an issue** - just how serverless works!

---

## 📊 Monitoring

### Vercel Dashboard

**Analytics:**
- View traffic
- See response times
- Check error rates

**Function Logs:**
- Real-time logs
- Error tracking
- Performance metrics

**Deployments:**
- History of all deploys
- Git commit info
- Preview URLs

### Free Tier Limits

**Monthly:**
- ✅ 100 GB bandwidth
- ✅ 100 GB-hours function execution
- ✅ Unlimited deployments
- ✅ Unlimited requests (within limits)

**Per Request:**
- ⏱️ 10-second timeout
- 💾 1024 MB memory
- 📦 50 MB deployment size

**Typical Usage:**
- Personal project: Well within limits
- Medium traffic: Still free
- High traffic: May need upgrade

---

## 💰 Cost Management

### Free Tier (Current)

**Cost:** $0/month

**Includes:**
- Everything you need
- Unlimited deployments
- Global CDN
- Automatic HTTPS
- Analytics

### When to Upgrade?

**Hobby Plan ($20/month):**
- Need >10 second timeout
- Want more bandwidth
- Need team features

**Pro Plan ($40/month):**
- High traffic
- Team collaboration
- Advanced features

**For most projects: Free tier is perfect!** ✅

---

## ✅ Success Checklist

**Pre-Deployment:**
- [ ] Code pushed to GitHub
- [ ] Have all 5 API keys
- [ ] `vercel.json` in root
- [ ] `/api/main.py` exists

**During Deployment:**
- [ ] Vercel account created
- [ ] Repository imported
- [ ] Environment variables added
- [ ] Deployment successful

**Post-Deployment:**
- [ ] Frontend loads: `https://your-app.vercel.app`
- [ ] API works: `https://your-app.vercel.app/health`
- [ ] IOC lookup works
- [ ] Email analysis works
- [ ] File analysis works
- [ ] No timeout errors

---

## 🎯 Quick Reference

### Your URLs
```
App:      https://your-app.vercel.app
API:      https://your-app.vercel.app/api
Docs:     https://your-app.vercel.app/api/docs
Health:   https://your-app.vercel.app/health
```

### Environment Variables (7 total)
```
VIRUSTOTAL_API_KEY
ABUSEIPDB_API_KEY
URLSCAN_API_KEY
OTX_API_KEY
GREYNOISE_API_KEY
LOG_LEVEL=INFO
CORS_ORIGINS=*
```

### Deploy Commands
```bash
git push origin main  # Auto-deploys
vercel               # Manual preview
vercel --prod        # Manual production
```

---

## 🆘 Need Help?

### Check Status
```bash
# Your deployment
https://your-app.vercel.app/health

# Vercel status
https://www.vercel-status.com
```

### View Logs
1. Vercel Dashboard
2. Your Project
3. Deployments → [Latest]
4. Build Logs or Function Logs

### Test Locally
```bash
# Backend
cd backend
python main.py

# Frontend
cd frontend
yarn start
```

---

## 🎊 Summary

**What You Deployed:**
- ✅ Full-stack CTI IOC Lookup Tool
- ✅ Backend + Frontend on Vercel
- ✅ 7 threat intelligence sources
- ✅ Real-time IOC analysis
- ✅ All features working

**Deployment:**
- ⏱️ 10 minutes
- 💰 $0/month
- 🚀 Single platform
- 🌐 Global CDN
- ⚡ Auto-scaling

**Everything on Vercel - Simple and Fast! 🚀**

---

**Your CTI tool is LIVE and ready to use! 🎉**
