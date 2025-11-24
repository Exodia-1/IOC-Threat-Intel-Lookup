# Deploy Backend to Fly.io

## Why Fly.io?
- ✅ Faster global edge deployment
- ✅ Better performance than Render.com
- ✅ Free tier includes 256MB RAM (sufficient for this app)
- ✅ Auto-scaling and auto-stop (saves resources)
- ✅ Easy deployment with CLI

## Prerequisites
1. Create a Fly.io account: https://fly.io/app/sign-up
2. Install Fly CLI: https://fly.io/docs/hands-on/install-flyctl/

### Install Fly CLI
**Linux/Mac:**
```bash
curl -L https://fly.io/install.sh | sh
```

**Windows (PowerShell):**
```powershell
pwsh -Command "iwr https://fly.io/install.ps1 -useb | iex"
```

**Verify installation:**
```bash
flyctl version
```

## Step 1: Login to Fly.io
```bash
flyctl auth login
```
This will open your browser for authentication.

## Step 2: Navigate to Backend Directory
```bash
cd /app/backend
```

## Step 3: Initialize Fly App (First Time Only)
```bash
flyctl launch --no-deploy
```

**When prompted:**
- App Name: `cti-ioc-lookup-api` (or choose your own)
- Region: Choose closest to you (e.g., `iad` for US East)
- PostgreSQL: **No** (we don't need it)
- Redis: **No** (we don't need it)

This will create a `fly.toml` file (already created for you).

## Step 4: Set Environment Variables (API Keys)

You need to set all your API keys as secrets in Fly.io:

```bash
# Set all API keys at once
flyctl secrets set \
  ABUSEIPDB_API_KEY="9148d3835cb202106faff2e96ba675157fdd9ffd699662c7ddd8b0a194875a0c8f9bfdfe2b718ba7" \
  VIRUSTOTAL_API_KEY="64c29a69f93c5a804da1d3e029919bd86ef7219df80572e09f97f1d3cf72bc4a" \
  URLSCAN_API_KEY="019aaf63-f958-70b8-a1a4-402eddc31f40" \
  OTX_API_KEY="a6bcac71baee8bd978f78e714173af8fecb093c6f4f987a051de0bfab2678caa" \
  GREYNOISE_API_KEY="Jng2JXWhsaY1iCfsD3j6AbAiCdyVzUqr9saRE9kwQspwy24hOxQ81WxwzV6iS6qD" \
  CORS_ORIGINS="*"
```

**Optional: If you get IPVoid API key later:**
```bash
flyctl secrets set IPVOID_API_KEY="your-key-here"
```

## Step 5: Deploy to Fly.io
```bash
flyctl deploy
```

This will:
1. Build the Docker image
2. Push it to Fly.io registry
3. Deploy to your app
4. Start the service

**Deployment time:** Usually 2-3 minutes

## Step 6: Check Deployment Status
```bash
flyctl status
```

You should see:
```
Machines
PROCESS ID              VERSION REGION  STATE   ROLE    CHECKS  LAST UPDATED
app     xxx             1       iad     started         1 total  xxxx
```

## Step 7: Get Your App URL
```bash
flyctl info
```

Look for the **Hostname** - it will be something like:
```
Hostname: cti-ioc-lookup-api.fly.dev
```

Your backend URL will be: `https://cti-ioc-lookup-api.fly.dev`

## Step 8: Test Your Deployed Backend

```bash
curl -X POST "https://cti-ioc-lookup-api.fly.dev/api/ioc/lookup" \
  -H "Content-Type: application/json" \
  -d '{"text":"8.8.8.8"}'
```

**Check for `total_scans` field:**
```bash
curl -s -X POST "https://cti-ioc-lookup-api.fly.dev/api/ioc/lookup" \
  -H "Content-Type: application/json" \
  -d '{"text":"8.8.8.8"}' | grep -o '"total_scans":[0-9]*'
```

**Expected:** `"total_scans":95`

## Step 9: Update Frontend to Use New Backend URL

### Option 1: Update Vercel Environment Variable
1. Go to Vercel Dashboard
2. Select your project: `ioc-jk`
3. Go to Settings → Environment Variables
4. Update `REACT_APP_BACKEND_URL` to: `https://cti-ioc-lookup-api.fly.dev`
5. Redeploy your frontend

### Option 2: Update Locally and Redeploy
```bash
# Update /app/frontend/.env
REACT_APP_BACKEND_URL=https://cti-ioc-lookup-api.fly.dev

# Rebuild and deploy to Vercel
cd /app/frontend
npm run build
vercel --prod
```

## Monitoring & Logs

### View Logs
```bash
flyctl logs
```

### Monitor App
```bash
flyctl status
flyctl vm status
```

### Check App Health
```bash
flyctl checks list
```

## Useful Fly.io Commands

### Redeploy after code changes
```bash
cd /app/backend
flyctl deploy
```

### Scale VM (if needed)
```bash
# Increase memory to 512MB
flyctl scale memory 512

# Increase to 2 VMs for redundancy
flyctl scale count 2
```

### Restart App
```bash
flyctl apps restart
```

### SSH into running container (for debugging)
```bash
flyctl ssh console
```

### View all secrets (API keys)
```bash
flyctl secrets list
```

### Update a secret
```bash
flyctl secrets set API_KEY_NAME="new-value"
```

## Troubleshooting

### Issue: "Error: app not found"
**Solution:** Make sure you're in the `/app/backend` directory and `fly.toml` exists.

### Issue: Deployment fails with memory error
**Solution:** Scale up memory:
```bash
flyctl scale memory 512
```

### Issue: API returns old data (no total_scans)
**Solution:** 
1. Verify `threat_intel.py` has the updated code
2. Redeploy: `flyctl deploy --no-cache`
3. Check logs: `flyctl logs`

### Issue: CORS errors from frontend
**Solution:** Ensure CORS_ORIGINS is set:
```bash
flyctl secrets set CORS_ORIGINS="*"
# Or specific domain:
flyctl secrets set CORS_ORIGINS="https://ioc-jk.vercel.app"
```

### Issue: App is slow to respond
**Solution:** Fly.io auto-stops machines when idle. First request wakes it up (takes ~2 seconds). To keep it running:
```bash
# Keep at least 1 machine running
flyctl scale count 1 --min-machines-running=1
```

## Cost Estimate

**Free Tier includes:**
- Up to 3 shared-cpu-1x 256mb VMs
- 160GB outbound data transfer

**Your app usage:**
- 1 VM × 256MB = **FREE** ✅
- Auto-stop when idle = **Saves resources** ✅
- Estimated cost: **$0/month** (within free tier)

## Comparison: Render vs Fly.io

| Feature | Render.com | Fly.io |
|---------|-----------|--------|
| Cold start | ~30 seconds | ~2 seconds |
| Global deployment | Limited | Multiple regions |
| Free tier | 750 hours/month | Always free |
| Performance | Slow | Fast |
| Auto-scaling | No | Yes |
| Deployment speed | Slow | Fast (2-3 min) |

## Next Steps After Deployment

1. ✅ Test the API with curl
2. ✅ Update frontend environment variable
3. ✅ Redeploy frontend on Vercel
4. ✅ Test the full application
5. ✅ Verify VirusTotal gauge shows correct values (e.g., "2 / 95")
6. ✅ Check all enhanced data is displaying

## Support

**Fly.io Docs:** https://fly.io/docs/
**Fly.io Community:** https://community.fly.io/

If you need help, run:
```bash
flyctl doctor
```

This will diagnose common issues with your deployment.
