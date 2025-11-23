# 🚀 Deploy Everything on Vercel - Easiest Way!

**Deploy your entire CTI IOC Lookup Tool on Vercel only - 10 minutes, $0/month!**

Both backend AND frontend on one platform = Simplest deployment ever! ✅

---

## 🎯 Why Vercel Only?

**Benefits:**
- ✅ Only ONE platform to manage
- ✅ Even simpler than Render + Vercel
- ✅ Automatic HTTPS
- ✅ Global CDN for frontend
- ✅ Serverless backend (scales automatically)
- ✅ Still $0/month
- ✅ Single dashboard for everything

**Perfect For:**
- Quick deployments
- Personal projects
- Testing and demos
- Low to medium traffic

---

## 📋 How It Works

**Architecture:**
```
Vercel
├── Frontend (React) → Static site
└── Backend (FastAPI) → Serverless functions
```

**What's Different:**
- Backend runs as serverless functions (not always-on server)
- Each API call triggers a function
- Functions auto-scale
- No "spin down" delays like Render

---

## 🚀 Deployment Steps (10 minutes)

### Step 1: Prepare Your Repository

Your current structure should work, but let's verify:

```
/app
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   └── ...
└── frontend/
    ├── src/
    ├── package.json
    └── ...
```

### Step 2: Create vercel.json in Root

Create `/app/vercel.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    },
    {
      "src": "backend/main.py",
      "use": "@vercel/python"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "backend/main.py"
    },
    {
      "src": "/(.*)",
      "dest": "frontend/$1"
    }
  ],
  "env": {
    "VIRUSTOTAL_API_KEY": "@virustotal_api_key",
    "ABUSEIPDB_API_KEY": "@abuseipdb_api_key",
    "URLSCAN_API_KEY": "@urlscan_api_key",
    "OTX_API_KEY": "@otx_api_key",
    "GREYNOISE_API_KEY": "@greynoise_api_key"
  }
}
```

### Step 3: Update Frontend Environment

The frontend will use relative URLs since everything is on same domain.

Update `/app/frontend/.env`:
```
REACT_APP_BACKEND_URL=
```

Leave it empty! Vercel will handle routing.

Or set it to empty string in code:
```javascript
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';
const API = `${BACKEND_URL}/api`;
```

### Step 4: Deploy to Vercel

#### Option A: Via Dashboard (Easiest)

1. **Sign up at Vercel**
   - Go to https://vercel.com
   - Sign up with GitHub

2. **Import Project**
   - Click **"Add New..."** → **"Project"**
   - Select your repository
   - Click **"Import"**

3. **Configure Root**
   - Root Directory: `.` (leave as root)
   - Framework: Let Vercel auto-detect
   - Click **"Deploy"**

4. **Add Environment Variables** (After first deploy)
   - Go to **Settings** → **Environment Variables**
   - Add each API key:
     ```
     VIRUSTOTAL_API_KEY=your_key
     ABUSEIPDB_API_KEY=your_key
     URLSCAN_API_KEY=your_key
     OTX_API_KEY=your_key
     GREYNOISE_API_KEY=your_key
     LOG_LEVEL=INFO
     CORS_ORIGINS=*
     ```

5. **Redeploy**
   - Go to **Deployments**
   - Click **⋯** on latest → **Redeploy**

#### Option B: Via CLI (For Developers)

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy from root
cd /app
vercel

# Follow prompts
# Set up and deploy: Y
# Which scope: Your account
# Link to existing project: N
# Project name: cti-ioc-lookup
# Directory: ./
# Want to override settings: N

# Add environment variables
vercel env add VIRUSTOTAL_API_KEY
vercel env add ABUSEIPDB_API_KEY
vercel env add URLSCAN_API_KEY
vercel env add OTX_API_KEY
vercel env add GREYNOISE_API_KEY

# Deploy to production
vercel --prod
```

---

## ✅ That's It! Your App is Live!

**Your URL:** `https://your-app.vercel.app`

**What You Get:**
- 🌐 Frontend: `https://your-app.vercel.app`
- ⚙️ Backend: `https://your-app.vercel.app/api/...`
- 📚 API Docs: `https://your-app.vercel.app/api/docs`
- 🏥 Health: `https://your-app.vercel.app/health`

Everything on ONE domain!

---

## 🧪 Test Your Deployment

```bash
# Test root
curl https://your-app.vercel.app/

# Test health
curl https://your-app.vercel.app/health

# Test API
curl https://your-app.vercel.app/api/docs

# Test IOC lookup
curl -X POST https://your-app.vercel.app/api/ioc/lookup \
  -H "Content-Type: application/json" \
  -d '{"text": "8.8.8.8"}'
```

Open in browser: `https://your-app.vercel.app`

---

## ⚠️ Important Notes

### Serverless Function Limits (Free Tier)

**Timeout:**
- Free tier: 10 seconds per request
- Hobby/Pro: 60 seconds

**Solution:** Most threat intel APIs respond within 10 seconds, so you should be fine!

**Memory:**
- Free tier: 1024 MB
- Should be plenty for this app

**Execution:**
- Free tier: 100 GB-hours/month
- More than enough for normal use

### Cold Starts

- First request might take 2-3 seconds (cold start)
- Subsequent requests are fast (~200ms)
- This is normal for serverless

### CORS

- Not an issue since everything is on same domain!
- No CORS configuration needed

---

## 📊 Comparison

### Vercel Only vs Render + Vercel

| Feature | Vercel Only | Render + Vercel |
|---------|-------------|-----------------|
| **Platforms** | 1 | 2 |
| **Setup Time** | 10 min | 15 min |
| **Environment Variables** | 1 place | 2 places |
| **CORS Setup** | Not needed | Required |
| **Cost** | $0/month | $0/month |
| **Request Timeout** | 10 sec | Unlimited |
| **Cold Starts** | Yes (~2s) | Yes (~30s on Render) |
| **Always On** | No (serverless) | No (free tier) |
| **Deployment** | Single command | Two deployments |

**Winner:** Vercel Only (for most use cases!)

---

## 🔧 Troubleshooting

### Issue 1: Function Timeout

**Error:** "Function execution timed out after 10s"

**Cause:** Threat intel APIs taking too long

**Solutions:**
1. **Upgrade to Hobby plan** ($20/month for 60s timeout)
2. **Optimize queries:**
   ```python
   # Use asyncio.gather with timeout
   import asyncio
   
   async def lookup_with_timeout(aggregator, ioc, timeout=8):
       try:
           return await asyncio.wait_for(
               aggregator.lookup(ioc['value'], ioc['type']),
               timeout=timeout
           )
       except asyncio.TimeoutError:
           return {"error": "Timeout", "ioc": ioc['value']}
   ```

3. **Skip slow APIs** temporarily

### Issue 2: Backend Not Working

**Check:**
1. `vercel.json` is in root directory
2. Routes are configured correctly
3. Environment variables are set
4. Redeploy after adding env vars

**Fix:**
```bash
vercel logs
# Check logs for errors
```

### Issue 3: Frontend Can't Find Backend

**Check:**
1. `REACT_APP_BACKEND_URL` is empty or not set
2. Frontend is using `/api` paths (not full URLs)

**Fix in frontend code:**
```javascript
const API = '/api'; // Not: 'https://...'
```

### Issue 4: Module Import Errors

**Check:**
- All Python dependencies in `requirements.txt`
- Correct file structure

**Fix:**
```bash
# In backend directory
pip freeze > requirements.txt
git add requirements.txt
git commit -m "Update requirements"
git push
```

---

## 🔄 Making Updates

### Update Code
```bash
cd /app
git add .
git commit -m "Update features"
git push origin main
```

Vercel auto-deploys! ✅

### Update Environment Variables
1. Dashboard → Settings → Environment Variables
2. Edit variable → Save
3. Deployments → Redeploy latest

### View Logs
- Dashboard → Project → Deployments → [Latest] → Logs
- Or: `vercel logs`

---

## 💡 Pro Tips

### 1. Custom Domain
```bash
vercel domains add yourdomain.com
```
Follow DNS instructions, done!

### 2. Preview Deployments
Every git push creates a preview URL:
- `https://your-app-git-branch-username.vercel.app`
- Test before production

### 3. Environment Variables by Environment
- Production
- Preview
- Development

Set different values for each!

### 4. Analytics
- Dashboard → Analytics
- See traffic, performance, errors

### 5. Edge Functions (Future)
- Even faster than serverless
- Run at edge locations globally

---

## 📈 Scaling Options

### Free Tier Limits
- ✅ 100 GB-hours/month execution
- ✅ 100 GB bandwidth
- ✅ Unlimited requests (within limits)
- ⏱️ 10-second timeout

### When to Upgrade to Hobby ($20/month)
- ⏱️ Need 60-second timeout
- 📊 High traffic (>100GB bandwidth)
- 🚀 More execution time needed
- 👥 Team collaboration

### When to Upgrade to Pro ($40/month)
- ⚡ Need edge functions
- 👥 Team of 10+
- 🔐 Advanced security
- 📊 Advanced analytics

**For most personal/small projects: Free tier is perfect!**

---

## 🎯 Quick Reference

### Your URLs (All Same Domain!)
```
Frontend:   https://your-app.vercel.app
Backend:    https://your-app.vercel.app/api
API Docs:   https://your-app.vercel.app/api/docs
Health:     https://your-app.vercel.app/health
```

### Deploy Commands
```bash
vercel              # Preview
vercel --prod       # Production
vercel logs         # View logs
vercel ls           # List deployments
```

### File Structure
```
/app
├── vercel.json           # ← Vercel configuration
├── backend/
│   ├── main.py
│   └── requirements.txt
└── frontend/
    ├── src/
    └── package.json
```

---

## ✅ Success Checklist

After deployment:
- [ ] Frontend loads at `https://your-app.vercel.app`
- [ ] IOC lookup works
- [ ] Email analysis works
- [ ] File analysis works
- [ ] API docs accessible at `/api/docs`
- [ ] Health check returns `{"status":"healthy"}`
- [ ] All API keys working
- [ ] No timeout errors
- [ ] Logs look clean

---

## 🎉 Benefits Summary

**What You Get:**
- ✅ Entire app on ONE platform
- ✅ 10-minute deployment
- ✅ Single dashboard
- ✅ Auto-scaling backend
- ✅ Global CDN frontend
- ✅ No CORS issues
- ✅ Same domain for everything
- ✅ $0/month
- ✅ Automatic HTTPS
- ✅ Git-based deployments

**What You Lose:**
- Nothing! (For most use cases)

**Recommendation:**
- ✅ **Vercel Only** for: Personal projects, demos, low-medium traffic
- ✅ **Render + Vercel** for: Heavy backend processing, long-running tasks

---

## 🚀 Conclusion

**Vercel-only deployment is the SIMPLEST way to deploy your CTI IOC Lookup Tool!**

- Just push to GitHub
- Vercel handles everything
- One platform, one dashboard, one domain
- $0/month

**Ready to deploy? Follow the steps above! 🎉**
