# 🚀 Deploy Everything from Frontend - Vercel Only

**Complete deployment from frontend directory only - Backend + Frontend in ONE!**

**Time:** 8 minutes | **Cost:** $0/month | **Complexity:** Minimal

---

## ✅ What We Did

**Moved everything into the frontend directory:**
```
/app/frontend/
├── api/                    ← Backend code here!
│   ├── index.py           ← API entry point
│   ├── routes/            ← API routes
│   ├── utils/             ← Business logic
│   ├── config/            ← Settings
│   ├── models/            ← Data models
│   └── requirements.txt   ← Python deps
├── src/                   ← React frontend
├── build/                 ← Production build
├── package.json
└── vercel.json            ← Configuration
```

**All in one place!** 🎉

---

## 🚀 Deployment Steps (8 Minutes)

### Step 1: Push to GitHub (2 min)

```bash
cd /app
git add .
git commit -m "Frontend-only deployment ready"
git push origin main
```

### Step 2: Deploy on Vercel (3 min)

1. Go to https://vercel.com
2. Sign up with GitHub
3. Click **"Add New..."** → **"Project"**
4. Import your repository

**CRITICAL:** Set root directory to `frontend`

```
Root Directory: frontend  ← MUST SET THIS!
Framework Preset: Other
Build Command: yarn build
Output Directory: build
```

5. Click **"Deploy"**

### Step 3: Add Environment Variables (2 min)

After deployment, go to **Settings** → **Environment Variables**

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

### Step 4: Redeploy (1 min)

1. Go to **Deployments**
2. Click **⋯** on latest deployment
3. Click **"Redeploy"**

---

## 🎉 Done! Test Your App

### Your URL
```
https://your-app.vercel.app
```

**Everything is here:**
- Frontend: `https://your-app.vercel.app`
- Backend API: `https://your-app.vercel.app/api/...`
- Health Check: `https://your-app.vercel.app/health`

### Test Features

1. **IOC Lookup:**
   - Visit: `https://your-app.vercel.app`
   - Enter: `8.8.8.8`
   - Click "Lookup IOCs"

2. **Email Analysis:**
   - Click "Email Analysis"
   - Enter: `example.com`
   - Click "Check Domain"

3. **File Analysis:**
   - Click "File Analysis"
   - Upload a file
   - Click "Analyze File"

---

## 📊 How It Works

### Architecture

```
Vercel (Single Deployment from /frontend)
├── React Frontend (build/)
│   └── Served as static files
└── Python Backend (api/)
    └── Runs as serverless functions
```

### Routing

```
/                    → Frontend (index.html)
/email               → Frontend (index.html)
/file                → Frontend (index.html)
/api/*               → Backend (api/index.py)
/health              → Backend (api/index.py)
```

### Benefits

- ✅ **One directory** to deploy
- ✅ **Same domain** (no CORS)
- ✅ **Simple structure**
- ✅ **Fast deployment**
- ✅ **Easy updates**

---

## ⚙️ Environment Variables

**Where to get API keys (All FREE):**

1. **VirusTotal**
   - https://www.virustotal.com/gui/join-us
   - Sign up → Profile → API Key

2. **AbuseIPDB**
   - https://www.abuseipdb.com/register
   - Register → API → Create Key

3. **urlscan.io**
   - https://urlscan.io/user/signup
   - Sign up → Settings → API Key

4. **AlienVault OTX**
   - https://otx.alienvault.com/
   - Create account → Settings → API Integration

5. **GreyNoise**
   - https://www.greynoise.io/
   - Sign up → Account → API Key

---

## 🧪 Testing

### Test Backend API

```bash
# Health check
curl https://your-app.vercel.app/health

# API endpoint
curl https://your-app.vercel.app/api/

# IOC lookup
curl -X POST https://your-app.vercel.app/api/ioc/lookup \
  -H "Content-Type: application/json" \
  -d '{"text": "8.8.8.8"}'
```

### Test Frontend

Open browser: `https://your-app.vercel.app`

---

## 🔧 Making Updates

### Update Code

```bash
# Make changes in /app/frontend/
cd /app/frontend

# Update frontend
# Edit files in src/

# Update backend
# Edit files in api/

# Push to GitHub
git add .
git commit -m "Update app"
git push origin main
```

**Vercel auto-deploys!** ✅

### View Logs

1. Vercel Dashboard
2. Your Project
3. Deployments → [Latest]
4. **Build Logs** or **Function Logs**

---

## 💡 Advantages

### vs. Separate Deployments

| Feature | Frontend Only | Render + Vercel |
|---------|---------------|-----------------|
| **Platforms** | 1 | 2 |
| **Directories** | 1 | 2 |
| **Setup Time** | 8 min | 12 min |
| **CORS Config** | Not needed | Required |
| **Env Vars** | 1 place | 2 places |
| **Git Push** | 1 push | 1 push, 2 deploys |
| **Cost** | $0 | $0 |
| **Simplicity** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

---

## ⚠️ Limitations

### Serverless Timeouts

**Free Tier:**
- ⏱️ 10-second timeout per request
- 💾 1024 MB memory

**Will It Work?**
✅ **YES** - Most IOC lookups finish in 2-5 seconds

**If Timeout:**
- Optimize queries (use asyncio properly)
- Reduce number of APIs queried
- Upgrade to Hobby ($20/month) for 60s timeout

---

## 🐛 Troubleshooting

### Issue 1: Build Failed

**Check:**
- Root directory is set to `frontend`
- Build logs in Vercel dashboard

**Fix:**
```bash
# Test locally
cd /app/frontend
yarn install
yarn build
```

### Issue 2: API Not Working

**Check:**
- Environment variables are set
- Function logs in Vercel
- `/api/index.py` exists

**Fix:**
- Add all environment variables
- Redeploy after adding vars
- Check function logs for errors

### Issue 3: 404 on API Calls

**Check:**
- `vercel.json` has correct rewrites
- API routes start with `/api/`

**Fix:**
- Verify `vercel.json` in frontend directory
- Check API routes in code

### Issue 4: Module Import Errors

**Check:**
- All dependencies in `api/requirements.txt`
- Python packages installed

**Fix:**
```bash
# Update requirements.txt
cd /app/frontend/api
pip freeze > requirements.txt
```

---

## 📈 File Structure

### Before (Separate)
```
/app
├── backend/         ← Separate directory
└── frontend/        ← Separate directory
```

### After (Combined)
```
/app
└── frontend/        ← Everything here!
    ├── api/         ← Backend code
    └── src/         ← Frontend code
```

**Deploy just the frontend directory!** ✅

---

## ✅ Success Checklist

**Pre-Deployment:**
- [x] All code in `/app/frontend/`
- [x] Backend in `/app/frontend/api/`
- [x] `vercel.json` configured
- [ ] Code pushed to GitHub
- [ ] API keys ready

**Deployment:**
- [ ] Vercel account created
- [ ] Repository imported
- [ ] Root directory set to `frontend`
- [ ] Environment variables added
- [ ] Redeployed

**Post-Deployment:**
- [ ] Frontend loads
- [ ] `/health` returns healthy
- [ ] IOC lookup works
- [ ] Email analysis works
- [ ] File analysis works

---

## 🎯 Quick Commands

### Local Development

```bash
# Frontend
cd /app/frontend
yarn start

# Test build
yarn build
```

### Deploy

```bash
# Push to GitHub
git add .
git commit -m "Update"
git push origin main

# Vercel auto-deploys!
```

---

## 💰 Cost

**Free Tier:**
- ✅ 100 GB bandwidth/month
- ✅ 100 GB-hours function execution
- ✅ Unlimited deployments

**Monthly Cost:** $0 ✅

---

## 🎉 Summary

**What We Achieved:**
- ✅ Everything in frontend directory
- ✅ Backend as serverless functions
- ✅ Single deployment
- ✅ Same domain (no CORS)
- ✅ 8-minute setup
- ✅ $0/month cost

**Deployment:**
1. Set root directory to `frontend`
2. Add environment variables
3. Deploy
4. Done!

**Your app is ready to deploy! 🚀**

---

## 🆘 Need Help?

**Check:**
1. Root directory set to `frontend`
2. All 7 environment variables added
3. Redeployed after adding vars
4. Function logs for errors

**Test Endpoints:**
```bash
https://your-app.vercel.app/
https://your-app.vercel.app/health
https://your-app.vercel.app/api/
```

---

**Everything in ONE place, deployed from ONE directory! Simple! 🎊**
