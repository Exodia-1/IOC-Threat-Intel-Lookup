# Deploy Full-Stack App to Vercel

## 🎯 Overview
Deploy both frontend (React) and backend (FastAPI) to Vercel in one unified deployment.

**Benefits:**
- ✅ Single deployment for frontend + backend
- ✅ Same domain for both (no CORS issues)
- ✅ Auto-deploys from GitHub
- ✅ Free SSL certificate
- ✅ Global CDN
- ✅ Zero configuration needed

## 📋 Prerequisites
1. GitHub account
2. Vercel account (free): https://vercel.com/signup
3. Your code pushed to GitHub

## 🚀 Deployment Steps

### Step 1: Push Code to GitHub

```bash
cd /app

# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Full-stack CTI IOC Lookup app"

# Add remote (replace with your GitHub repo URL)
git remote add origin https://github.com/YOUR_USERNAME/cti-ioc-lookup.git

# Push to GitHub
git push -u origin main
```

### Step 2: Import Project to Vercel

1. Go to https://vercel.com/dashboard
2. Click "Add New" → "Project"
3. Click "Import Git Repository"
4. Select your GitHub repository
5. Vercel will auto-detect it's a monorepo

### Step 3: Configure Project Settings

**Framework Preset:** Other

**Root Directory:** Leave as `./` (root)

**Build Command:**
```bash
cd frontend && yarn install && yarn build
```

**Output Directory:**
```
frontend/build
```

**Install Command:**
```bash
yarn install && pip install -r requirements.txt
```

### Step 4: Add Environment Variables

In Vercel dashboard → Settings → Environment Variables, add:

```
ABUSEIPDB_API_KEY=9148d3835cb202106faff2e96ba675157fdd9ffd699662c7ddd8b0a194875a0c8f9bfdfe2b718ba7
VIRUSTOTAL_API_KEY=64c29a69f93c5a804da1d3e029919bd86ef7219df80572e09f97f1d3cf72bc4a
URLSCAN_API_KEY=019aaf63-f958-70b8-a1a4-402eddc31f40
OTX_API_KEY=a6bcac71baee8bd978f78e714173af8fecb093c6f4f987a051de0bfab2678caa
GREYNOISE_API_KEY=Jng2JXWhsaY1iCfsD3j6AbAiCdyVzUqr9saRE9kwQspwy24hOxQ81WxwzV6iS6qD
PYTHON_VERSION=3.11
```

**Important:** Set environment for "Production", "Preview", and "Development"

### Step 5: Deploy

Click "Deploy"

Vercel will:
1. Build frontend (React)
2. Install backend dependencies (Python)
3. Deploy both to same domain
4. Provide you a URL like: `https://your-app.vercel.app`

**Deployment time:** ~3-5 minutes

## 🔍 Verify Deployment

### Test Frontend
Visit: `https://your-app.vercel.app`

You should see your CTI IOC Lookup interface.

### Test Backend
```bash
# Test health check
curl https://your-app.vercel.app/api/

# Should return: {"message":"Hello World"}

# Test IOC lookup
curl -X POST "https://your-app.vercel.app/api/ioc/lookup" \
  -H "Content-Type: application/json" \
  -d '{"text":"8.8.8.8"}'

# Should return JSON with total_scans field
```

### Test VirusTotal Gauge
1. Go to your app URL
2. Search for: `74.225.220.168`
3. Check VirusTotal card:
   - ✅ Gauge shows: **2 / 95** (not 2 / 1)
   - ✅ Total Scans: **95** (not 0)

## 📁 Project Structure

```
/app
├── vercel.json              # Vercel configuration
├── requirements.txt         # Python dependencies (root level)
├── frontend/
│   ├── package.json
│   ├── .env.production     # Empty backend URL (uses same domain)
│   └── build/              # Created during deployment
└── backend/
    ├── server.py           # FastAPI app
    ├── threat_intel.py
    └── requirements.txt
```

## 🔄 Auto-Deployment

Every time you push to GitHub:
1. Vercel automatically detects changes
2. Rebuilds and redeploys
3. Zero downtime deployment
4. Preview deployments for pull requests

## ⚙️ How It Works

### Routing
- `https://your-app.vercel.app/` → Frontend (React)
- `https://your-app.vercel.app/api/*` → Backend (FastAPI)

### Vercel Configuration (`vercel.json`)
```json
{
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "backend/server.py"  // Backend handles /api/*
    },
    {
      "src": "/(.*)",
      "dest": "frontend/$1"         // Frontend handles everything else
    }
  ]
}
```

## 🐛 Troubleshooting

### Issue: "Module not found"
**Solution:** Make sure `requirements.txt` is in the root directory:
```bash
cp backend/requirements.txt requirements.txt
```

### Issue: Frontend build fails
**Solution:** Check if `frontend/package.json` exists and has correct build script:
```json
{
  "scripts": {
    "build": "react-scripts build"
  }
}
```

### Issue: Backend API returns 404
**Solution:** 
1. Check `vercel.json` routes configuration
2. Ensure backend endpoints start with `/api/`
3. Check Vercel function logs in dashboard

### Issue: Environment variables not working
**Solution:**
1. Vercel dashboard → Settings → Environment Variables
2. Make sure variables are set for "Production"
3. Redeploy after adding variables

### Issue: CORS errors
**Solution:** Since frontend and backend are on same domain, CORS shouldn't be an issue. If it persists:
1. Check `server.py` has CORS middleware
2. Verify `allow_origins` includes the domain

## 📊 Vercel Dashboard Features

### View Logs
1. Go to Vercel dashboard
2. Click on your project
3. Go to "Deployments"
4. Click on latest deployment
5. View "Function Logs" for backend errors

### Monitor Performance
- Real-time analytics
- Response times
- Error rates
- Bandwidth usage

### Custom Domain
1. Go to Settings → Domains
2. Add your custom domain
3. Update DNS records
4. Vercel handles SSL automatically

## 💰 Cost

**Free Tier Includes:**
- Unlimited deployments
- 100GB bandwidth/month
- Serverless functions (100GB-hours)
- Automatic SSL
- Preview deployments

**Your app usage:** Should stay well within free tier ✅

## 🎯 Advantages of This Approach

| Feature | Vercel | Railway/Render |
|---------|--------|----------------|
| Setup Complexity | ⭐⭐⭐⭐⭐ Easiest | ⭐⭐⭐ Medium |
| Frontend + Backend | ✅ Same domain | ❌ Separate |
| Auto-deploy | ✅ Yes | ✅ Yes |
| CORS Issues | ✅ None | ⚠️ Need config |
| Cold Start | ~1-2 seconds | ~5-30 seconds |
| Free Tier | ✅ Generous | ⚠️ Limited |
| Performance | ⭐⭐⭐⭐⭐ Excellent | ⭐⭐⭐ Good |

## 🔐 Security

- HTTPS automatically enabled
- Environment variables encrypted
- DDoS protection included
- Automatic security updates

## 📈 Scaling

Vercel automatically scales:
- More traffic = more serverless instances
- Zero configuration needed
- Pay only for what you use (on Pro plan)

## 🆘 Support

- **Vercel Docs:** https://vercel.com/docs
- **Vercel Discord:** https://vercel.com/discord
- **Vercel Status:** https://www.vercel-status.com

## ✅ Success Checklist

After deployment, verify:
- [ ] App loads at Vercel URL
- [ ] Frontend displays correctly
- [ ] Can search for IOCs
- [ ] Backend API responds: `/api/`
- [ ] IOC lookup returns results
- [ ] VirusTotal shows `total_scans` field
- [ ] Gauge displays correctly: "2 / 95"
- [ ] All enhanced data displays
- [ ] No CORS errors in console

---

**Your app is now live on Vercel!** 🎉

Share your URL: `https://your-app-name.vercel.app`
