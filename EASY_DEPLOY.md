# 🚀 Easy Deployment Guide - Render + Vercel

**Deploy in 12 minutes - Guaranteed to work!**

---

## 🎯 Architecture

```
Frontend (Vercel) ←→ Backend (Render) ←→ Threat Intel APIs
```

**Why This Setup:**
- ✅ Proven to work (no serverless timeout issues)
- ✅ Still $0/month
- ✅ Each part deployed separately (simpler)
- ✅ Easy to debug

---

## ⚙️ Part 1: Deploy Backend (Render) - 6 minutes

### Step 1: Create Render Account
1. Go to https://render.com
2. Sign up with GitHub
3. Authorize Render

### Step 2: Create Web Service
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Click **"Connect"**

### Step 3: Configure Service

**Basic Settings:**
```
Name: cti-ioc-lookup-api
Region: Oregon (US West)
Branch: main
Root Directory: backend
```

**Build & Start Commands:**
```
Build Command: pip install -r requirements.txt
Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
```

**Instance Type:**
```
Free
```

### Step 4: Add Environment Variables

Click **"Environment"** and add:

```bash
VIRUSTOTAL_API_KEY=your_key
ABUSEIPDB_API_KEY=your_key
URLSCAN_API_KEY=your_key
OTX_API_KEY=your_key
GREYNOISE_API_KEY=your_key
LOG_LEVEL=INFO
CORS_ORIGINS=*
```

**Where to get API keys? All FREE:**
- [VirusTotal](https://www.virustotal.com/gui/join-us)
- [AbuseIPDB](https://www.abuseipdb.com/register)
- [urlscan.io](https://urlscan.io/user/signup)
- [AlienVault OTX](https://otx.alienvault.com/)
- [GreyNoise](https://www.greynoise.io/)

### Step 5: Create Web Service
1. Click **"Create Web Service"**
2. Wait 5 minutes for deployment
3. **Copy your backend URL**: `https://your-app.onrender.com`

✅ **Backend deployed!**

---

## 🎨 Part 2: Deploy Frontend (Vercel) - 4 minutes

### Step 1: Create Vercel Account
1. Go to https://vercel.com
2. Sign up with GitHub
3. Authorize Vercel

### Step 2: Import Project
1. Click **"Add New..."** → **"Project"**
2. Select your GitHub repository
3. Click **"Import"**

### Step 3: Configure Project

**Important Settings:**
```
Framework Preset: Create React App
Root Directory: frontend  ← IMPORTANT!
Build Command: yarn build
Output Directory: build
Install Command: yarn install
```

### Step 4: Add Environment Variable

Click **"Environment Variables"** and add:

```
Name: REACT_APP_BACKEND_URL
Value: https://your-backend-url.onrender.com
```

**Use YOUR actual Render URL from Part 1!**

### Step 5: Deploy
1. Click **"Deploy"**
2. Wait 2 minutes
3. **Copy your frontend URL**: `https://your-app.vercel.app`

✅ **Frontend deployed!**

---

## 🔄 Part 3: Connect Them - 2 minutes

### Update CORS in Render

1. Go to Render dashboard
2. Click your web service
3. Go to **"Environment"** tab
4. Find `CORS_ORIGINS`
5. Change from `*` to: `https://your-app.vercel.app`
6. Click **"Save Changes"**
7. Wait 2 minutes for auto-redeploy

✅ **Connected!**

---

## 🎉 Done! Test Your App

### Open Your App
Visit: `https://your-app.vercel.app`

### Test Features
1. **IOC Lookup**: Enter `8.8.8.8` → Click "Lookup IOCs"
2. **Email Analysis**: Enter `example.com` → Click "Check Domain"
3. **File Analysis**: Upload a file → Click "Analyze File"

---

## ✅ Success Checklist

Backend (Render):
- [ ] Service deployed successfully
- [ ] Logs show "Application startup complete"
- [ ] Can access: `https://your-api.onrender.com/health`
- [ ] All 5 API keys added

Frontend (Vercel):
- [ ] Build completed successfully
- [ ] Root directory set to `frontend`
- [ ] `REACT_APP_BACKEND_URL` added
- [ ] Can access: `https://your-app.vercel.app`

Connection:
- [ ] CORS updated in Render
- [ ] Backend URL correct in Vercel
- [ ] IOC lookup works end-to-end

---

## 🔧 Troubleshooting

### Backend Issues

**Problem:** Service not starting
```bash
# Check Render logs
Dashboard → Your Service → Logs
```

**Common Fixes:**
- Verify all 5 API keys are set
- Check `Start Command` is correct
- Ensure `Root Directory` is `backend`

**Problem:** 404 errors
```bash
# Test directly
curl https://your-api.onrender.com/
# Should return: {"message":"CTI IOC Lookup Tool API"...}
```

### Frontend Issues

**Problem:** Build failed
```bash
# Check Vercel logs
Dashboard → Deployments → [Latest] → View Function Logs
```

**Common Fixes:**
- Verify `Root Directory` is `frontend`
- Check `REACT_APP_BACKEND_URL` is set
- Ensure backend URL has no trailing slash

**Problem:** Can't connect to backend
- Check `REACT_APP_BACKEND_URL` is correct
- Verify CORS is updated in Render
- Check browser console for errors (F12)

---

## 💡 Important Notes

### Render Free Tier
- Spins down after 15 minutes of inactivity
- Takes ~30 seconds to wake up on first request
- 750 hours/month (always enough)

### Vercel Free Tier
- Unlimited deployments
- 100 GB bandwidth/month
- Fast CDN globally

### Making Updates

**Backend changes:**
```bash
git add backend/
git commit -m "Update backend"
git push origin main
# Render auto-deploys in 3-5 minutes
```

**Frontend changes:**
```bash
git add frontend/
git commit -m "Update frontend"
git push origin main
# Vercel auto-deploys in 1-2 minutes
```

---

## 🎯 Quick Reference

**Your URLs:**
- Frontend: `https://_______.vercel.app`
- Backend: `https://_______.onrender.com`
- API Docs: `https://_______.onrender.com/api/docs`

**Environment Variables:**

Render (Backend):
```
VIRUSTOTAL_API_KEY
ABUSEIPDB_API_KEY
URLSCAN_API_KEY
OTX_API_KEY
GREYNOISE_API_KEY
LOG_LEVEL=INFO
CORS_ORIGINS=https://your-app.vercel.app
```

Vercel (Frontend):
```
REACT_APP_BACKEND_URL=https://your-api.onrender.com
```

---

## 🎊 Summary

**What You Deployed:**
- ✅ Full-stack CTI IOC Lookup Tool
- ✅ Backend API on Render (always-on)
- ✅ Frontend on Vercel (global CDN)
- ✅ 7 threat intelligence integrations
- ✅ Real-time analysis
- ✅ $0/month cost

**Total Time:** 12 minutes
**Total Cost:** $0/month
**Complexity:** Minimal

**Your cyber threat intelligence tool is now LIVE! 🚀**

---

## 🆘 Need Help?

**Check Logs:**
- Render: Dashboard → Service → Logs
- Vercel: Dashboard → Deployments → [Latest] → Logs

**Test Endpoints:**
```bash
# Backend health
curl https://your-api.onrender.com/health

# Backend API
curl https://your-api.onrender.com/api/docs

# Frontend
open https://your-app.vercel.app
```

**Still stuck?**
1. Check both services are deployed
2. Verify all environment variables
3. Check CORS settings match
4. Review logs for specific errors

**Everything should work! If not, double-check the steps above. ✅**
