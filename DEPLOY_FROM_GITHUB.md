# Deploy to Google Cloud Run from GitHub (No Local Setup Needed!)

## ✨ Zero Local Setup Required

Since your code is on GitHub, you can deploy directly from the Google Cloud Console web interface!

## 🚀 Step-by-Step Deployment

### Step 1: Go to Google Cloud Console
1. Open: https://console.cloud.google.com
2. Sign in with your Google account
3. Accept terms if prompted

### Step 2: Create a Project
1. Click the project dropdown (top left)
2. Click "New Project"
3. Name: `cti-ioc-lookup`
4. Click "Create"
5. Wait for project creation (~30 seconds)
6. Make sure the project is selected (check top bar)

### Step 3: Enable Cloud Run
1. In the search bar at top, type "Cloud Run"
2. Click "Cloud Run"
3. Click "Enable API" if prompted
4. Wait for it to enable (~1 minute)

### Step 4: Create Service from GitHub
1. Click "Create Service" button
2. Select **"Continuously deploy from a repository (source or function)"**
3. Click "Set up with Cloud Build"

### Step 5: Connect GitHub Repository
1. Click "GitHub" as source repository
2. Click "Authenticate" and login to GitHub
3. Select your repository (e.g., `your-username/cti-ioc-lookup`)
4. Click "Next"

### Step 6: Configure Build
**Build Configuration:**
- Build Type: `Dockerfile`
- Source location: `/backend/Dockerfile`
- Click "Save"

### Step 7: Configure Service
**Service Settings:**
- Service name: `cti-ioc-lookup-api`
- Region: `us-central1` (or closest to you)
- Authentication: `Allow unauthenticated invocations` ✅
- CPU allocation: `CPU is only allocated during request processing`
- Memory: `1 GiB`
- Maximum requests per container: `80`

**Click "Show Advanced Settings" (expand)**

### Step 8: Add Environment Variables
In "Variables & Secrets" section, click "Add Variable" for each:

```
ABUSEIPDB_API_KEY = 9148d3835cb202106faff2e96ba675157fdd9ffd699662c7ddd8b0a194875a0c8f9bfdfe2b718ba7

VIRUSTOTAL_API_KEY = 64c29a69f93c5a804da1d3e029919bd86ef7219df80572e09f97f1d3cf72bc4a

URLSCAN_API_KEY = 019aaf63-f958-70b8-a1a4-402eddc31f40

OTX_API_KEY = a6bcac71baee8bd978f78e714173af8fecb093c6f4f987a051de0bfab2678caa

GREYNOISE_API_KEY = Jng2JXWhsaY1iCfsD3j6AbAiCdyVzUqr9saRE9kwQspwy24hOxQ81WxwzV6iS6qD
```

### Step 9: Deploy!
1. Click "Create" at the bottom
2. Wait 3-5 minutes for deployment

You'll see:
- ✅ Building container
- ✅ Pushing to registry
- ✅ Deploying to Cloud Run

### Step 10: Get Your URL
Once deployed, you'll see:
- ✅ Service URL (e.g., `https://cti-ioc-lookup-api-xxxxx-uc.a.run.app`)
- Copy this URL!

---

## 🧪 Test Your API

Open a new browser tab and visit:
```
https://YOUR-URL.run.app/
```

Should see: `{"status":"healthy","message":"CTI IOC Lookup API"}`

Test IOC lookup:
```
https://YOUR-URL.run.app/api/ioc/lookup
```
(Use Postman, Thunder Client, or curl to POST with JSON)

---

## 🎨 Deploy Frontend to Vercel

### Step 1: Update Frontend Config
In your GitHub repo, edit `frontend/.env.production`:
```
REACT_APP_BACKEND_URL=https://YOUR-CLOUD-RUN-URL.run.app
```

Commit and push to GitHub.

### Step 2: Deploy to Vercel
1. Go to: https://vercel.com/new
2. Import your GitHub repository
3. **Root Directory:** `frontend`
4. **Framework Preset:** Create React App
5. **Build Command:** `yarn build`
6. **Output Directory:** `build`
7. **Environment Variables:**
   - Name: `REACT_APP_BACKEND_URL`
   - Value: `https://YOUR-CLOUD-RUN-URL.run.app`
   - Environment: Production
8. Click "Deploy"

Wait 2-3 minutes.

---

## ✅ Verify Everything Works

1. Visit your Vercel URL (e.g., `https://your-app.vercel.app`)
2. Search for: `74.225.220.168`
3. Check VirusTotal card:
   - ✅ Gauge shows: **2 / 95** (not 2 / 1)
   - ✅ Total Scans: **95** (not 0)
   - ✅ All enhanced data displaying

---

## 🔄 Auto-Deploy from GitHub

**Best part:** Every time you push to GitHub:
- Cloud Run automatically rebuilds and redeploys backend
- Vercel automatically rebuilds and redeploys frontend

Zero manual work after initial setup! 🎉

---

## 💰 Free Tier

**Google Cloud Run:**
- 2 million requests/month
- 360,000 GB-seconds/month
- More than enough for this app ✅

**Vercel:**
- 100GB bandwidth/month
- Unlimited deployments
- More than enough ✅

**Total cost:** $0/month for both! 💵

---

## 📊 Monitoring

### View Logs (Cloud Run)
1. Go to Cloud Console
2. Navigate to Cloud Run
3. Click your service
4. Click "Logs" tab

### View Logs (Vercel)
1. Go to Vercel Dashboard
2. Click your project
3. Click "Deployments"
4. Click latest deployment
5. View "Function Logs"

---

## 🔧 Update Environment Variables

### Cloud Run
1. Cloud Console → Cloud Run
2. Click your service
3. Click "Edit & Deploy New Revision"
4. Go to "Variables & Secrets"
5. Update variables
6. Click "Deploy"

### Vercel
1. Vercel Dashboard → Your Project
2. Settings → Environment Variables
3. Edit the variable
4. Redeploy

---

## 🐛 Troubleshooting

### Build Fails
**Check:** Cloud Build logs in Cloud Console
**Common issues:**
- Dockerfile path incorrect (should be `/backend/Dockerfile`)
- Missing dependencies in requirements.txt
- Python version mismatch

### Service Not Starting
**Check:** Cloud Run logs
**Common issues:**
- Port not binding to $PORT
- Environment variables not set
- Import errors

### 502 Errors
**Check:** Cloud Run logs for Python errors
**Common issues:**
- Missing API keys
- Timeout (increase in service settings)
- Memory limit (increase to 2 GiB)

---

## 🎯 Summary

**What you did:**
1. ✅ Connected GitHub to Cloud Run
2. ✅ Deployed backend automatically from GitHub
3. ✅ Set environment variables
4. ✅ Got a public URL
5. ✅ Connected frontend to backend
6. ✅ Deployed frontend to Vercel

**Result:**
- Backend: Google Cloud Run (production-grade, auto-scaling)
- Frontend: Vercel (fast CDN, auto-deploy)
- Both auto-deploy from GitHub
- Zero cost!

**No local machine needed!** Everything done through web interfaces. 🚀

---

## 📱 Quick Links

- **Cloud Console:** https://console.cloud.google.com
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Your Backend (after deploy):** https://YOUR-SERVICE.run.app
- **Your Frontend (after deploy):** https://YOUR-APP.vercel.app

---

## ⚡ Even Faster Alternative

If you want to skip GitHub integration, you can also:

1. Download your code as ZIP from GitHub
2. Use Google Cloud Shell (built-in terminal)
3. Deploy from Cloud Shell

But GitHub integration is better because:
- ✅ Auto-deploys on push
- ✅ Version history
- ✅ Easy rollbacks
- ✅ CI/CD pipeline

Stick with GitHub integration! 👍
