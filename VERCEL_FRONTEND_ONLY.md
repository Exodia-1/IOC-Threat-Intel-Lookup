# Deploy Frontend to Vercel + Backend Separately

## Problem
Vercel serverless functions have a 250MB limit, which Python backends often exceed.

## Solution: Hybrid Deployment
- **Frontend**: Deploy on Vercel (React)
- **Backend**: Deploy on Render.com (Python/FastAPI) - **Already Working!**

## Quick Steps

### 1. Keep Existing Backend (Render.com)
Your backend is already deployed at: `https://cti-ioc-lookup-api.onrender.com`

**But it has OLD code!** Let's update it:

1. Go to Render Dashboard
2. Find your backend service
3. Click "Manual Deploy" → "Deploy latest commit"

Or push to GitHub and it will auto-deploy.

### 2. Deploy Frontend to Vercel

#### Update Frontend Environment Variable
```bash
cd /app/frontend
echo "REACT_APP_BACKEND_URL=https://cti-ioc-lookup-api.onrender.com" > .env.production
```

#### Deploy to Vercel
1. Go to https://vercel.com/new
2. Import your GitHub repo
3. **Root Directory:** Select `frontend`
4. **Framework Preset:** Create React App
5. **Build Command:** `yarn build`
6. **Output Directory:** `build`
7. Add Environment Variable:
   ```
   REACT_APP_BACKEND_URL=https://cti-ioc-lookup-api.onrender.com
   ```
8. Click "Deploy"

### 3. Update Render Backend with New Code

Your Render backend needs the updated `threat_intel.py` with `total_scans` field.

**Push to GitHub:**
```bash
cd /app
git add backend/threat_intel.py backend/server.py backend/requirements.txt
git commit -m "Add total_scans and enhanced data"
git push origin main
```

Render will auto-deploy (5-10 min).

### 4. Verify

**Test Backend:**
```bash
curl https://cti-ioc-lookup-api.onrender.com/api/
# Should return: {"message":"Hello World"}

curl -s -X POST "https://cti-ioc-lookup-api.onrender.com/api/ioc/lookup" \
  -H "Content-Type: application/json" \
  -d '{"text":"8.8.8.8"}' | grep "total_scans"
# Should see: "total_scans":95
```

**Test Frontend:**
Visit your Vercel URL and search for `74.225.220.168`

Check VirusTotal gauge shows: **2 / 95** ✅

## Advantages

| Feature | This Approach | Full Vercel |
|---------|--------------|-------------|
| Backend Size Limit | ✅ None | ❌ 250MB |
| Setup Complexity | ⭐⭐⭐ Easy | ⭐⭐⭐⭐⭐ Easiest |
| Cost | ✅ Free | ✅ Free |
| Performance | ⭐⭐⭐ Good | ⭐⭐⭐⭐⭐ Excellent |
| Maintenance | 2 platforms | 1 platform |

## Alternative: Serverless Backend

If you want everything on one platform, consider:

### Option 1: Cloudflare Workers (Python in Beta)
- Supports Python (beta)
- No size limits
- Edge deployment
- Free tier

### Option 2: AWS Lambda via API Gateway
- No size limits (up to 10GB container)
- Pay per use
- More complex setup

### Option 3: Google Cloud Run
- Container-based
- Auto-scales to zero
- Free tier: 2 million requests/month
- Simple deployment

## Recommended: Stick with Render + Vercel

**Why?**
- ✅ Already working setup
- ✅ Simple to maintain
- ✅ Free tier on both
- ✅ Just need to push new code to GitHub

**Your current issue is NOT the platform - it's that Render has OLD code!**

---

## Summary

1. **Update Render backend** with new code (push to GitHub)
2. **Deploy frontend to Vercel** (just the frontend folder)
3. **Connect them** via REACT_APP_BACKEND_URL

**Total time:** 10 minutes

**Result:** Working app with correct VirusTotal gauge showing 2/95! 🎉
