# 🚀 Simple Deployment Guide - No Database Required!

**Deploy your CTI IOC Lookup Tool in 15 minutes - FREE!**

This simplified version doesn't require MongoDB. Just backend + frontend = done! ✅

---

## 📊 What You Need

- GitHub account
- API keys for threat intelligence sources
- 15 minutes of time

**Cost**: $0/month ✅

---

## ⚙️ Step 1: Deploy Backend to Render (8 minutes)

### 1.1 Create Render Account
1. Go to https://render.com
2. Sign up with GitHub
3. Authorize Render

### 1.2 Create Web Service
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Click **"Connect"**

### 1.3 Configure Service

**Basic Settings:**
```
Name: cti-ioc-lookup-api
Region: Oregon (US West) or closest to you
Branch: main
Root Directory: backend
Environment: Python 3
```

**Build & Start:**
```
Build Command: pip install -r requirements.txt
Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
Instance Type: Free
```

### 1.4 Add Environment Variables

Click **"Advanced"** → Add these variables:

```bash
# Threat Intelligence API Keys (REQUIRED)
VIRUSTOTAL_API_KEY=your_virustotal_key_here
ABUSEIPDB_API_KEY=your_abuseipdb_key_here  
URLSCAN_API_KEY=your_urlscan_key_here
OTX_API_KEY=your_otx_key_here
GREYNOISE_API_KEY=your_greynoise_key_here

# App Configuration
LOG_LEVEL=INFO
CORS_ORIGINS=*
```

**Where to get API keys:**
- [VirusTotal](https://www.virustotal.com/gui/join-us) - Sign up for free
- [AbuseIPDB](https://www.abuseipdb.com/register) - Create account
- [urlscan.io](https://urlscan.io/user/signup) - Register
- [AlienVault OTX](https://otx.alienvault.com/) - Sign up
- [GreyNoise](https://www.greynoise.io/) - Create account

### 1.5 Deploy
1. Click **"Create Web Service"**
2. Wait 5-10 minutes for deployment
3. ✅ Your backend URL: `https://your-app.onrender.com`

### 1.6 Test Backend
```bash
curl https://your-app.onrender.com/
# Should return: {"message":"CTI IOC Lookup Tool API"...}

curl https://your-app.onrender.com/health
# Should return: {"status":"healthy"...}
```

---

## 🎨 Step 2: Deploy Frontend to Vercel (5 minutes)

### 2.1 Create Vercel Account
1. Go to https://vercel.com
2. Sign up with GitHub
3. Authorize Vercel

### 2.2 Import Project
1. Click **"Add New..."** → **"Project"**
2. Select your repository
3. Click **"Import"**

### 2.3 Configure Project

**Settings:**
```
Framework Preset: Create React App (auto-detected)
Root Directory: frontend
Build Command: yarn build
Output Directory: build
Install Command: yarn install
```

### 2.4 Add Environment Variable

Add this variable:
```
Name: REACT_APP_BACKEND_URL
Value: https://your-backend-url.onrender.com
```

**Important**: Use YOUR actual Render URL from Step 1.5

### 2.5 Deploy
1. Click **"Deploy"**
2. Wait 2-3 minutes
3. ✅ Your app URL: `https://your-app.vercel.app`

---

## 🔄 Step 3: Update CORS (2 minutes)

Now tell the backend to accept requests from your frontend.

### 3.1 Update in Render
1. Go to Render dashboard
2. Click your service
3. Go to **"Environment"** tab
4. Find `CORS_ORIGINS`
5. Change from `*` to your Vercel URL:
   ```
   https://your-app.vercel.app
   ```
6. Click **"Save Changes"**
7. Wait for auto-redeploy (~2 minutes)

---

## ✅ Step 4: Test Your App

### Open Your App
Visit: `https://your-app.vercel.app`

### Test Features
1. **IOC Lookup**: Enter `8.8.8.8` → Click "Lookup IOCs"
2. **Email Analysis**: Enter `example.com` → Click "Check Domain"
3. **File Analysis**: Upload a file → Click "Analyze File"

---

## 🎉 Done! Your App is Live!

**Your URLs:**
- 🌐 **Frontend**: https://your-app.vercel.app
- ⚙️ **Backend**: https://your-api.onrender.com
- 📚 **API Docs**: https://your-api.onrender.com/api/docs

**Features:**
- ✅ Real-time IOC lookups (no history stored)
- ✅ Email domain security checks
- ✅ File hash analysis
- ✅ 7 threat intelligence sources
- ✅ No database required
- ✅ $0/month hosting cost

---

## 🔧 Common Issues

### Issue 1: Backend "Service Unavailable"
**Check:**
- Render logs: Dashboard → Service → Logs
- Look for "Application startup complete"
- If missing API keys, add them in Environment

**Fix:**
- Add all 5 API keys in Render environment variables
- Redeploy manually if needed

### Issue 2: Frontend Can't Connect
**Check:**
- `REACT_APP_BACKEND_URL` is set correctly in Vercel
- No trailing slash in URL
- CORS is updated with your Vercel URL

**Fix:**
- Update environment variables
- Redeploy from Vercel dashboard

### Issue 3: API Keys Not Working
**Check:**
- Keys are valid and active
- Check rate limits on service dashboards

**Fix:**
- Regenerate keys on respective services
- Update in Render environment variables

---

## 💡 Pro Tips

### 1. Free Tier Limits
- **Render**: 750 hours/month, spins down after 15 min inactivity
- **Vercel**: Unlimited deployments, 100GB bandwidth

### 2. Keep Backend Alive
First request after spin-down takes ~30 seconds. Normal!

### 3. Monitor Usage
- **Render**: Dashboard → Service → Metrics
- **Vercel**: Dashboard → Project → Analytics

### 4. Update Your App
```bash
git add .
git commit -m "Update features"
git push origin main
```
Both Render and Vercel auto-deploy! 🚀

---

## 🔄 Making Changes

### Update Backend
1. Edit files in `/app/backend/`
2. Push to GitHub
3. Render auto-deploys (3-5 min)

### Update Frontend
1. Edit files in `/app/frontend/src/`
2. Push to GitHub
3. Vercel auto-deploys (1-2 min)

### Update Environment Variables
**Render**: Dashboard → Environment → Edit → Save
**Vercel**: Dashboard → Settings → Environment Variables

---

## 📊 What's Different?

**Old Version:**
- Required MongoDB Atlas setup
- Stored lookup history
- Complex configuration
- More points of failure

**New Simplified Version:**
- ✅ No database needed
- ✅ Real-time lookups only
- ✅ Simpler deployment
- ✅ Faster setup
- ✅ Fewer things to break

**What You Lose:**
- History page (removed)
- Lookup history storage

**What You Gain:**
- 💪 Simpler deployment
- 🚀 Faster setup (15 min vs 25 min)
- 🎯 No database issues
- 💰 Still $0/month

---

## 🎯 Quick Reference

### Backend
- **URL**: https://your-api.onrender.com
- **Docs**: https://your-api.onrender.com/api/docs
- **Health**: https://your-api.onrender.com/health

### Frontend
- **URL**: https://your-app.vercel.app

### Environment Variables (Render)
```
VIRUSTOTAL_API_KEY
ABUSEIPDB_API_KEY
URLSCAN_API_KEY
OTX_API_KEY
GREYNOISE_API_KEY
LOG_LEVEL=INFO
CORS_ORIGINS=https://your-app.vercel.app
```

### Environment Variables (Vercel)
```
REACT_APP_BACKEND_URL=https://your-api.onrender.com
```

---

## 🆘 Need Help?

### Check Logs
- **Render**: Dashboard → Service → Logs
- **Vercel**: Dashboard → Project → Deployments → [Latest] → Logs

### Service Status
- [Render Status](https://status.render.com)
- [Vercel Status](https://vercel-status.com)

### Documentation
- [Render Docs](https://render.com/docs)
- [Vercel Docs](https://vercel.com/docs)

---

## 🎊 Congratulations!

Your CTI IOC Lookup Tool is now live with:
- ✅ Real-time threat intelligence
- ✅ Professional hosting
- ✅ Auto-deployment
- ✅ $0/month cost
- ✅ No database complexity

**Enjoy your tool! 🚀**
