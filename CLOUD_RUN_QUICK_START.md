# 🚀 Quick Start - Deploy to Google Cloud Run

## One-Command Deployment

### Prerequisites
- Google Cloud account (free): https://console.cloud.google.com
- gcloud CLI installed

### Install gcloud CLI
**Linux/macOS:**
```bash
curl https://sdk.cloud.google.com | bash
exec -l $SHELL
```

**Windows:** Download from https://cloud.google.com/sdk/docs/install

---

## Deploy Backend (5 minutes)

### Option 1: Use Deployment Script (Easiest)
```bash
cd /app/backend
./deploy-cloud-run.sh
```

The script will:
1. Check gcloud CLI installation
2. Login if needed
3. Enable required APIs
4. Deploy to Cloud Run
5. Set environment variables
6. Give you the URL

### Option 2: Manual Deployment
```bash
# 1. Login
gcloud auth login

# 2. Set project (or create new)
gcloud config set project YOUR_PROJECT_ID

# 3. Enable APIs
gcloud services enable run.googleapis.com containerregistry.googleapis.com

# 4. Deploy
cd /app/backend
gcloud run deploy cti-ioc-lookup-api \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars "ABUSEIPDB_API_KEY=9148d3835cb202106faff2e96ba675157fdd9ffd699662c7ddd8b0a194875a0c8f9bfdfe2b718ba7,VIRUSTOTAL_API_KEY=64c29a69f93c5a804da1d3e029919bd86ef7219df80572e09f97f1d3cf72bc4a,URLSCAN_API_KEY=019aaf63-f958-70b8-a1a4-402eddc31f40,OTX_API_KEY=a6bcac71baee8bd978f78e714173af8fecb093c6f4f987a051de0bfab2678caa,GREYNOISE_API_KEY=Jng2JXWhsaY1iCfsD3j6AbAiCdyVzUqr9saRE9kwQspwy24hOxQ81WxwzV6iS6qD"
```

**Deployment time:** 3-5 minutes

You'll get a URL like: `https://cti-ioc-lookup-api-XXXXX-uc.a.run.app`

---

## Test Backend

```bash
# Health check
curl https://YOUR-URL.run.app/

# IOC lookup with total_scans
curl -X POST "https://YOUR-URL.run.app/api/ioc/lookup" \
  -H "Content-Type: application/json" \
  -d '{"text":"8.8.8.8"}' | grep total_scans
```

**Expected:** `"total_scans":95` ✅

---

## Deploy Frontend to Vercel (2 minutes)

### 1. Update Frontend Config
```bash
cd /app/frontend
echo "REACT_APP_BACKEND_URL=https://YOUR-CLOUD-RUN-URL.run.app" > .env.production
```

### 2. Deploy to Vercel
1. Go to https://vercel.com/new
2. Import GitHub repo
3. Root Directory: `frontend`
4. Add Environment Variable:
   ```
   REACT_APP_BACKEND_URL=https://YOUR-CLOUD-RUN-URL.run.app
   ```
5. Deploy!

---

## ✅ Verification

Visit your Vercel URL and search: `74.225.220.168`

**Check VirusTotal:**
- ✅ Gauge: **2 / 95** (not 2 / 1)
- ✅ Total Scans: **95** (not 0)
- ✅ Enhanced data showing

---

## 💰 Cost

**Free Tier:**
- 2 million requests/month
- Well within limits for this app

**Your estimated cost:** $0/month ✅

---

## 📚 Full Documentation

See `/app/GOOGLE_CLOUD_RUN_DEPLOYMENT.md` for:
- Detailed instructions
- Configuration options
- Monitoring & logs
- Troubleshooting
- Advanced features

---

## 🎉 Done!

**Backend:** Google Cloud Run (unlimited size, auto-scaling)
**Frontend:** Vercel (fast CDN, auto-deploy)

Perfect combination! 🚀
