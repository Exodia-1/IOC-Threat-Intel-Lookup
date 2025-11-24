# Migration from Render.com to Fly.io - Checklist

## Why Migrate?
- ✅ **Performance**: Fly.io is 10x faster (2s cold start vs 30s on Render)
- ✅ **Reliability**: Better uptime and global edge deployment
- ✅ **Cost**: Free tier is more generous
- ✅ **Deployment**: Faster deployments (2-3 min vs 5-10 min)

## Current Setup
- **Frontend**: Vercel (`https://ioc-jk.vercel.app`)
- **Backend**: Render.com (`https://cti-ioc-lookup-api.onrender.com`) ❌ OLD CODE
- **Issue**: Backend missing `total_scans` field, causing VirusTotal gauge to show "2/1" instead of "2/95"

## Migration Steps

### ☐ Step 1: Install Fly CLI
**Linux/Mac:**
```bash
curl -L https://fly.io/install.sh | sh
```

**Windows:**
```powershell
pwsh -Command "iwr https://fly.io/install.ps1 -useb | iex"
```

**Verify:**
```bash
flyctl version
```

### ☐ Step 2: Login to Fly.io
```bash
flyctl auth login
```

### ☐ Step 3: Deploy Backend to Fly.io

**Option A: Use the Quick Setup Script**
```bash
cd /app/backend
./deploy-to-fly.sh
```

**Option B: Manual Deployment**
```bash
cd /app/backend

# Launch app (first time only)
flyctl launch --no-deploy

# Set API keys
flyctl secrets set \
  ABUSEIPDB_API_KEY="your-key" \
  VIRUSTOTAL_API_KEY="your-key" \
  URLSCAN_API_KEY="your-key" \
  OTX_API_KEY="your-key" \
  GREYNOISE_API_KEY="your-key" \
  CORS_ORIGINS="*"

# Deploy
flyctl deploy
```

### ☐ Step 4: Get Your New Backend URL
```bash
flyctl info
```

Look for **Hostname**, e.g., `cti-ioc-lookup-api.fly.dev`

Your new backend URL: `https://cti-ioc-lookup-api.fly.dev`

### ☐ Step 5: Test the New Backend

```bash
# Test IOC lookup
curl -X POST "https://cti-ioc-lookup-api.fly.dev/api/ioc/lookup" \
  -H "Content-Type: application/json" \
  -d '{"text":"8.8.8.8"}'

# Verify total_scans field exists
curl -s -X POST "https://cti-ioc-lookup-api.fly.dev/api/ioc/lookup" \
  -H "Content-Type: application/json" \
  -d '{"text":"8.8.8.8"}' | grep "total_scans"
```

**Expected:** Should see `"total_scans":95` (or similar number)

### ☐ Step 6: Update Frontend to Use New Backend

**Option A: Via Vercel Dashboard**
1. Go to https://vercel.com/dashboard
2. Select your project: `ioc-jk`
3. Go to: Settings → Environment Variables
4. Find: `REACT_APP_BACKEND_URL`
5. Update value to: `https://cti-ioc-lookup-api.fly.dev`
6. Click "Save"
7. Go to Deployments → Click "..." → Redeploy

**Option B: Via CLI**
```bash
cd /app/frontend
# Update .env file
echo "REACT_APP_BACKEND_URL=https://cti-ioc-lookup-api.fly.dev" > .env.production
# Redeploy
vercel --prod
```

### ☐ Step 7: Verify Everything Works

1. Go to your frontend: `https://ioc-jk.vercel.app`
2. Clear browser cache (Ctrl+Shift+R)
3. Search for IP: `74.225.220.168` (the one from your screenshot)
4. Check VirusTotal card:
   - ✅ Gauge should show: **2 / 95** (not 2 / 1)
   - ✅ "Total Scans" should show: **95** (not 0)
   - ✅ Should see enhanced details: Continent, Network, etc.

### ☐ Step 8: Cleanup Old Render.com Deployment (Optional)

Once everything works on Fly.io:
1. Go to Render.com dashboard
2. Select your backend service
3. Click "Delete Service" (saves you resources)

**⚠️ Wait 24-48 hours before deleting Render to ensure Fly.io is stable**

## Verification Checklist

After migration, verify these work:
- [ ] VirusTotal gauge shows correct format (e.g., "2 / 95")
- [ ] Total Scans field shows actual number (e.g., 95)
- [ ] All enhanced data displays:
  - [ ] VirusTotal: Continent, Network, Detection details, Tags
  - [ ] AbuseIPDB: Recent reports with comments
  - [ ] GreyNoise: Trust level, Explanation
  - [ ] WHOIS: Full registrant details
  - [ ] URLScan: Scan details with countries
  - [ ] OTX: Geographic data, Pulse details
- [ ] Fast response time (< 3 seconds)
- [ ] No CORS errors in browser console

## Rollback Plan (If Needed)

If something goes wrong with Fly.io:
1. Update Vercel environment variable back to: `https://cti-ioc-lookup-api.onrender.com`
2. Redeploy frontend on Vercel
3. Debug Fly.io deployment and try again

## Cost Comparison

| Feature | Render.com | Fly.io |
|---------|------------|--------|
| Monthly Cost | $0 (750 hrs free) | $0 (always free) |
| Memory | 512MB | 256MB (upgradable) |
| Cold Start | ~30 seconds | ~2 seconds |
| Deployment Time | 5-10 minutes | 2-3 minutes |
| Performance | Slow | Fast |
| Auto-scaling | ❌ No | ✅ Yes |
| Global CDN | ❌ Limited | ✅ Yes |

## Support & Troubleshooting

**Issue: Deployment fails**
```bash
flyctl doctor  # Diagnose issues
flyctl logs     # Check error logs
```

**Issue: App is slow**
```bash
# Keep machines running (prevents cold starts)
flyctl scale count 1 --min-machines-running=1
```

**Issue: Need more memory**
```bash
flyctl scale memory 512
```

## Documentation References
- 📄 Full Guide: `/app/FLY_IO_DEPLOYMENT_GUIDE.md`
- 📄 Render Guide: `/app/RENDER_DEPLOYMENT_GUIDE.md` (for comparison)
- 📄 Quick Script: `/app/backend/deploy-to-fly.sh`

## Timeline Estimate
- Installation: 2 minutes
- Deployment: 3 minutes
- Testing: 2 minutes
- Frontend update: 3 minutes
- **Total: ~10 minutes** 🚀

## Success Criteria
✅ Backend deployed to Fly.io
✅ API returns `total_scans` field
✅ Frontend connected to new backend
✅ VirusTotal gauge shows correct values
✅ All enhanced data displaying
✅ Fast response times (< 3 seconds)
