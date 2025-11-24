# Deploy to Google Cloud Run

## 🎯 Why Google Cloud Run?
- ✅ **No size limits** (up to 10GB containers)
- ✅ **Auto-scales to zero** (pay only when running)
- ✅ **Fast cold starts** (~2 seconds)
- ✅ **Free tier**: 2 million requests/month, 360,000 GB-seconds
- ✅ **Production-ready** with global load balancing
- ✅ **Docker-based** - reliable and portable

## 📋 Prerequisites
1. Google Cloud account (free): https://console.cloud.google.com
2. Google Cloud SDK installed (gcloud CLI)

## 🚀 Setup & Deployment

### Step 1: Install Google Cloud SDK

**Linux/macOS:**
```bash
curl https://sdk.cloud.google.com | bash
exec -l $SHELL
```

**Windows:**
Download from: https://cloud.google.com/sdk/docs/install

**Verify installation:**
```bash
gcloud --version
```

### Step 2: Initialize & Login

```bash
# Login to Google Cloud
gcloud auth login

# Set your project (create one if needed)
gcloud config set project YOUR_PROJECT_ID

# Enable required APIs
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
```

**Don't have a project?**
```bash
# Create a new project
gcloud projects create cti-ioc-lookup --name="CTI IOC Lookup"
gcloud config set project cti-ioc-lookup
```

### Step 3: Configure Docker Authentication

```bash
gcloud auth configure-docker
```

### Step 4: Build & Deploy

Navigate to backend directory:
```bash
cd /app/backend
```

**Option A: Deploy with One Command (Easiest)**
```bash
gcloud run deploy cti-ioc-lookup-api \
  --source . \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --set-env-vars "ABUSEIPDB_API_KEY=9148d3835cb202106faff2e96ba675157fdd9ffd699662c7ddd8b0a194875a0c8f9bfdfe2b718ba7,VIRUSTOTAL_API_KEY=64c29a69f93c5a804da1d3e029919bd86ef7219df80572e09f97f1d3cf72bc4a,URLSCAN_API_KEY=019aaf63-f958-70b8-a1a4-402eddc31f40,OTX_API_KEY=a6bcac71baee8bd978f78e714173af8fecb093c6f4f987a051de0bfab2678caa,GREYNOISE_API_KEY=Jng2JXWhsaY1iCfsD3j6AbAiCdyVzUqr9saRE9kwQspwy24hOxQ81WxwzV6iS6qD"
```

This command:
1. Builds Docker image from source
2. Pushes to Google Container Registry
3. Deploys to Cloud Run
4. Sets environment variables
5. Makes it publicly accessible

**Deployment time:** 3-5 minutes

**Option B: Manual Build & Deploy**
```bash
# 1. Build Docker image
docker build -t gcr.io/YOUR_PROJECT_ID/cti-ioc-lookup-api .

# 2. Push to Google Container Registry
docker push gcr.io/YOUR_PROJECT_ID/cti-ioc-lookup-api

# 3. Deploy to Cloud Run
gcloud run deploy cti-ioc-lookup-api \
  --image gcr.io/YOUR_PROJECT_ID/cti-ioc-lookup-api \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated
```

### Step 5: Set Environment Variables

If not set during deployment:
```bash
gcloud run services update cti-ioc-lookup-api \
  --region us-central1 \
  --update-env-vars \
    ABUSEIPDB_API_KEY=9148d3835cb202106faff2e96ba675157fdd9ffd699662c7ddd8b0a194875a0c8f9bfdfe2b718ba7,\
    VIRUSTOTAL_API_KEY=64c29a69f93c5a804da1d3e029919bd86ef7219df80572e09f97f1d3cf72bc4a,\
    URLSCAN_API_KEY=019aaf63-f958-70b8-a1a4-402eddc31f40,\
    OTX_API_KEY=a6bcac71baee8bd978f78e714173af8fecb093c6f4f987a051de0bfab2678caa,\
    GREYNOISE_API_KEY=Jng2JXWhsaY1iCfsD3j6AbAiCdyVzUqr9saRE9kwQspwy24hOxQ81WxwzV6iS6qD
```

### Step 6: Get Your URL

After deployment, you'll get a URL like:
```
https://cti-ioc-lookup-api-XXXXX-uc.a.run.app
```

Save this URL - you'll need it for the frontend!

## 🔍 Test Your Deployment

### Test Health Check
```bash
curl https://YOUR-CLOUD-RUN-URL.run.app/
# Should return: {"status":"healthy","message":"CTI IOC Lookup API"}
```

### Test API Endpoint
```bash
curl https://YOUR-CLOUD-RUN-URL.run.app/api/
# Should return: {"message":"Hello World"}
```

### Test IOC Lookup
```bash
curl -X POST "https://YOUR-CLOUD-RUN-URL.run.app/api/ioc/lookup" \
  -H "Content-Type: application/json" \
  -d '{"text":"8.8.8.8"}'
```

### Verify total_scans Field
```bash
curl -s -X POST "https://YOUR-CLOUD-RUN-URL.run.app/api/ioc/lookup" \
  -H "Content-Type: application/json" \
  -d '{"text":"8.8.8.8"}' | grep -o '"total_scans":[0-9]*'
```

**Expected:** `"total_scans":95` ✅

## 🎨 Deploy Frontend to Vercel

Now that backend is on Cloud Run, deploy frontend to Vercel:

### 1. Update Frontend Environment Variable
```bash
cd /app/frontend
echo "REACT_APP_BACKEND_URL=https://YOUR-CLOUD-RUN-URL.run.app" > .env.production
```

### 2. Deploy to Vercel
1. Go to https://vercel.com/new
2. Import your GitHub repo
3. Root Directory: `frontend`
4. Framework: Create React App
5. Build Command: `yarn build`
6. Output Directory: `build`
7. Add Environment Variable:
   ```
   REACT_APP_BACKEND_URL=https://YOUR-CLOUD-RUN-URL.run.app
   ```
8. Deploy

## 📊 Monitor Your App

### View Logs
```bash
gcloud run services logs read cti-ioc-lookup-api \
  --region us-central1 \
  --limit 50
```

### View Metrics
```bash
# In Google Cloud Console
https://console.cloud.google.com/run
```

See:
- Request count
- Request latency
- Container CPU utilization
- Container memory utilization
- Billable time

### Tail Logs (Real-time)
```bash
gcloud run services logs tail cti-ioc-lookup-api \
  --region us-central1
```

## ⚙️ Configuration Options

### Scale Settings
```bash
# Set min/max instances
gcloud run services update cti-ioc-lookup-api \
  --region us-central1 \
  --min-instances 0 \
  --max-instances 10
```

### Memory & CPU
```bash
# Increase memory (default 512MB)
gcloud run services update cti-ioc-lookup-api \
  --region us-central1 \
  --memory 1Gi \
  --cpu 1
```

### Timeout
```bash
# Increase timeout (default 300s, max 3600s)
gcloud run services update cti-ioc-lookup-api \
  --region us-central1 \
  --timeout 60
```

### Concurrency
```bash
# Max concurrent requests per instance (default 80)
gcloud run services update cti-ioc-lookup-api \
  --region us-central1 \
  --concurrency 100
```

## 🔄 Update Deployment

When you make code changes:

```bash
cd /app/backend

# Redeploy with new code
gcloud run deploy cti-ioc-lookup-api \
  --source . \
  --region us-central1
```

Cloud Run will:
1. Build new Docker image
2. Deploy with zero downtime
3. Gradually shift traffic to new version

## 💰 Cost Estimate

**Free Tier (Monthly):**
- 2 million requests
- 360,000 GB-seconds of memory
- 180,000 vCPU-seconds
- 1 GB network egress

**Your app usage (estimated):**
- ~10,000 requests/month
- ~0.5 GB-seconds per request
- **Total: $0/month** (well within free tier!) ✅

**If you exceed free tier:**
- $0.00002400 per request
- $0.00000250 per GB-second
- Very affordable for small to medium traffic

## 🌍 Regions

**Recommended regions:**
- `us-central1` (Iowa) - Free tier eligible
- `us-east1` (South Carolina) - Free tier eligible
- `europe-west1` (Belgium) - Free tier eligible
- `asia-east1` (Taiwan) - Free tier eligible

## 🔐 Security

### Enable Authentication (Optional)
```bash
# Require authentication
gcloud run services update cti-ioc-lookup-api \
  --region us-central1 \
  --no-allow-unauthenticated
```

### Custom Domain
```bash
# Map custom domain
gcloud run domain-mappings create \
  --service cti-ioc-lookup-api \
  --domain api.yourdomain.com \
  --region us-central1
```

### HTTPS
- Automatically enabled
- Free SSL certificate
- Auto-renewal

## 🐛 Troubleshooting

### Build Fails
```bash
# Check build logs
gcloud builds list
gcloud builds log BUILD_ID
```

### Service Not Starting
```bash
# Check service logs
gcloud run services logs read cti-ioc-lookup-api --region us-central1
```

### Port Issues
Cloud Run automatically sets `PORT` environment variable. Make sure your app binds to it:
```python
# In server.py or startup script
import os
port = int(os.environ.get("PORT", 8080))
```

### Permission Errors
```bash
# Grant Cloud Run Admin role
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
  --member="user:YOUR_EMAIL@gmail.com" \
  --role="roles/run.admin"
```

## 🎯 Advantages

| Feature | Cloud Run | Vercel | Railway | Render |
|---------|-----------|--------|---------|--------|
| Size Limit | ✅ 10GB | ❌ 250MB | ✅ None | ✅ None |
| Cold Start | ⭐⭐⭐⭐ ~2s | ⭐⭐⭐⭐⭐ ~1s | ⭐⭐⭐ ~5s | ⭐⭐ ~30s |
| Free Tier | ✅ 2M req/mo | ✅ 100GB-hr | ⚠️ $5 credit | ⚠️ 750 hrs |
| Scaling | ⭐⭐⭐⭐⭐ Auto | ⭐⭐⭐⭐⭐ Auto | ⭐⭐⭐ Manual | ⭐⭐⭐ Manual |
| Setup | ⭐⭐⭐⭐ Easy | ⭐⭐⭐⭐⭐ Easiest | ⭐⭐⭐⭐ Easy | ⭐⭐⭐ Medium |
| Production | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |

## 📱 Cloud Run UI

Manage your service via web console:
https://console.cloud.google.com/run

Features:
- Real-time logs
- Metrics & monitoring
- Revision history
- Traffic splitting (A/B testing)
- Environment variables
- Custom domains
- IAM permissions

## ✅ Success Checklist

- [ ] gcloud CLI installed and authenticated
- [ ] Project created and configured
- [ ] Service deployed successfully
- [ ] Health check returns 200 OK
- [ ] IOC lookup returns results with `total_scans`
- [ ] Frontend deployed to Vercel
- [ ] Frontend connected to Cloud Run backend
- [ ] VirusTotal gauge shows correct format (2 / 95)
- [ ] No CORS errors

## 🆘 Support

- **Cloud Run Docs**: https://cloud.google.com/run/docs
- **Pricing Calculator**: https://cloud.google.com/products/calculator
- **Status**: https://status.cloud.google.com
- **Community**: https://www.googlecloudcommunity.com

---

**Your backend is now production-ready on Google Cloud Run!** 🎉

Next: Deploy frontend to Vercel and connect them together.
