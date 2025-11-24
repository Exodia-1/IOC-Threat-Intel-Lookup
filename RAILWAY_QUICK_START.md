# Railway Deployment - Quick Start Guide

## 🚀 Deploy in 5 Minutes

### Step 1: Sign Up (1 min)
```
1. Go to: https://railway.app
2. Click "Start a New Project"
3. Click "Login with GitHub"
4. Authorize Railway
```

### Step 2: Deploy Backend (2 min)
```
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your repository
4. Railway auto-detects Python
5. Click "Deploy Now"
6. Wait 2-3 minutes ⏱️
```

### Step 3: Add API Keys (2 min)
```
In Railway Dashboard:
1. Click your project
2. Go to "Variables" tab
3. Click "RAW Editor"
4. Paste this:

ABUSEIPDB_API_KEY=9148d3835cb202106faff2e96ba675157fdd9ffd699662c7ddd8b0a194875a0c8f9bfdfe2b718ba7
VIRUSTOTAL_API_KEY=64c29a69f93c5a804da1d3e029919bd86ef7219df80572e09f97f1d3cf72bc4a
URLSCAN_API_KEY=019aaf63-f958-70b8-a1a4-402eddc31f40
OTX_API_KEY=a6bcac71baee8bd978f78e714173af8fecb093c6f4f987a051de0bfab2678caa
GREYNOISE_API_KEY=Jng2JXWhsaY1iCfsD3j6AbAiCdyVzUqr9saRE9kwQspwy24hOxQ81WxwzV6iS6qD
CORS_ORIGINS=*
PORT=8001

5. Click "Update Variables"
6. Wait for auto-redeploy
```

### Step 4: Get Your URL (30 sec)
```
1. Go to "Settings" tab
2. Scroll to "Domains" section
3. Click "Generate Domain"
4. Copy your URL (e.g., https://xxx.up.railway.app)
```

### Step 5: Test API (30 sec)
```bash
# Replace with your Railway URL
curl -X POST "https://YOUR-APP.up.railway.app/api/ioc/lookup" \
  -H "Content-Type: application/json" \
  -d '{"text":"8.8.8.8"}'
```

**Look for:** `"total_scans":95` ✅

### Step 6: Update Frontend (1 min)
```
Vercel Dashboard:
1. Go to your project
2. Settings → Environment Variables
3. Update REACT_APP_BACKEND_URL to your Railway URL
4. Deployments → Redeploy
```

## ✅ Done! Your app is live!

Test at: `https://ioc-jk.vercel.app`

## 🔍 Quick Verification

Visit your frontend and search for: `74.225.220.168`

**Check VirusTotal Card:**
- ✅ Gauge shows: **2 / 95** (not 2 / 1)
- ✅ Total Scans: **95** (not 0)
- ✅ Shows: Continent, Network, Detection details

## 📊 What's Different from Render?

| Feature | Render | Railway |
|---------|--------|---------|
| Setup | Manual config | Auto-detect |
| Speed | ~30s cold start | ~5s cold start |
| Deployment | 5-10 minutes | 2-3 minutes |
| Free Tier | 750 hours | $5 credits |
| UI | Basic | Modern |

## 🎯 Pro Tips

1. **Auto-Deploy**: Push to GitHub → Railway auto-deploys
2. **Logs**: Click "Deployments" → View live logs
3. **Metrics**: Built-in CPU/Memory monitoring
4. **Zero Config**: Railway detects Python automatically

## 🆘 Common Issues

### "Build Failed"
→ Check Railway logs for errors
→ Verify requirements.txt is correct

### "App Crashes"
→ Go to Variables tab
→ Make sure all API keys are set

### "CORS Error"
→ Add: `CORS_ORIGINS=*` in Variables

### "Old Data (no total_scans)"
→ Make sure you pushed latest code to GitHub
→ Railway deploys from your GitHub repo

## 📁 Files Created for Railway

- ✅ `/app/backend/railway.toml` - Railway config
- ✅ `/app/backend/Procfile` - Start command
- ✅ `/app/RAILWAY_DEPLOYMENT_GUIDE.md` - Full guide

## 🔗 Useful Links

- Railway Dashboard: https://railway.app/dashboard
- Railway Docs: https://docs.railway.app
- Support: https://discord.gg/railway

---

**That's it!** Railway handles everything else automatically. 🎉
