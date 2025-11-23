# 🔧 Render Deployment - 404 Error Fix

## 🐛 Issue

You're seeing this error in Render logs:
```
INFO:     122.169.239.244:0 - "GET / HTTP/1.1" 404 Not Found
```

This happens because Render's health checks hit the root path "/" but your app didn't have a handler for it.

## ✅ Fix Applied

I've added a root endpoint to `/app/backend/main.py` that returns:
```json
{
  "message": "CTI IOC Lookup Tool API",
  "status": "running",
  "version": "1.0.0",
  "docs": "/api/docs",
  "health": "/health"
}
```

## 🚀 Deploy the Fix to Render

### Option 1: Auto-Deploy (If GitHub Connected)

1. **Commit and push the changes:**
   ```bash
   cd /app
   git add .
   git commit -m "Fix: Add root endpoint for Render health checks"
   git push origin main
   ```

2. **Render will auto-deploy** (takes 3-5 minutes)
   - Go to your Render dashboard
   - Watch the deployment logs
   - Wait for "Your service is live" message

### Option 2: Manual Deploy

If auto-deploy is not set up:

1. Go to Render dashboard
2. Click your service
3. Click **"Manual Deploy"** → **"Deploy latest commit"**
4. Wait for deployment to complete

## ✅ Verify the Fix

After deployment, test these endpoints:

### 1. Test Root Endpoint
```bash
curl https://your-app.onrender.com/

# Expected response:
{
  "message": "CTI IOC Lookup Tool API",
  "status": "running",
  "version": "1.0.0",
  "docs": "/api/docs",
  "health": "/health"
}
```

### 2. Test Health Endpoint
```bash
curl https://your-app.onrender.com/health

# Expected response:
{
  "status": "healthy",
  "service": "CTI IOC Lookup Tool",
  "version": "1.0.0"
}
```

### 3. Test API Docs
Open in browser:
```
https://your-app.onrender.com/api/docs
```

You should see the Swagger UI documentation.

### 4. Check Logs
Go to Render dashboard → Your Service → Logs

You should now see:
```
INFO:     122.169.239.244:0 - "GET / HTTP/1.1" 200 OK
```
Instead of 404!

## 📋 Complete Render Configuration

Make sure your Render service is configured correctly:

### Build & Start Commands

**For New Modular Structure (main.py):**
```
Build Command: pip install -r requirements.txt
Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
```

**For Legacy Structure (server.py):**
```
Build Command: pip install -r requirements.txt
Start Command: uvicorn server:app --host 0.0.0.0 --port $PORT
```

### Environment Variables

Make sure these are set in Render:

```bash
# Required
MONGO_URL=mongodb+srv://user:password@cluster.mongodb.net/cti_tool
DB_NAME=cti_tool
VIRUSTOTAL_API_KEY=your_key
ABUSEIPDB_API_KEY=your_key
URLSCAN_API_KEY=your_key
OTX_API_KEY=your_key
GREYNOISE_API_KEY=your_key

# Important for production
LOG_LEVEL=INFO
CORS_ORIGINS=https://your-frontend.vercel.app

# Or allow all (not recommended for production)
CORS_ORIGINS=*
```

### Root Directory
```
backend
```

## 🔍 Understanding the Fix

### What Changed?

**Before:**
- Only had `/health` and `/api/*` routes
- Root `/` path returned 404
- Render health checks failed

**After:**
- Added `/` route that returns service info
- Render health checks pass
- Better API discoverability

### File Modified:
- `/app/backend/main.py` - Added root endpoint
- `/app/backend/config/settings.py` - Improved CORS handling

### Why This Matters:

1. **Health Checks**: Render pings "/" to check if service is alive
2. **Load Balancing**: "/" endpoint helps with service discovery
3. **User Experience**: Visiting root URL shows API info instead of error
4. **Debugging**: Easy way to check if API is running

## 🎯 Additional Improvements Made

### 1. Better CORS Handling

The CORS settings now properly handle environment variables:

```python
# In Render, set CORS_ORIGINS to:
CORS_ORIGINS=https://your-app.vercel.app

# Or multiple origins:
CORS_ORIGINS=https://your-app.vercel.app,https://www.your-domain.com

# Or allow all (development only):
CORS_ORIGINS=*
```

### 2. API Documentation Access

With the root endpoint, users can:
- Visit `/` to see available endpoints
- Click on docs link to access Swagger UI
- Check service status easily

## 🐛 Troubleshooting

### Issue: Still Getting 404

**Check 1: Correct Start Command**
```bash
# In Render, verify start command is:
uvicorn main:app --host 0.0.0.0 --port $PORT
```

**Check 2: Deployment Completed**
- Wait for deployment to fully complete
- Check logs for "Application startup complete"

**Check 3: Root Directory**
- Verify root directory is set to `backend`
- Not `backend/` (no trailing slash)

### Issue: CORS Errors

**Check CORS_ORIGINS:**
```bash
# Should be your Vercel URL (without trailing slash)
CORS_ORIGINS=https://your-app.vercel.app
```

**Check Frontend ENV:**
```bash
# In Vercel, REACT_APP_BACKEND_URL should be:
REACT_APP_BACKEND_URL=https://your-api.onrender.com
# (no trailing slash)
```

### Issue: Service Spinning Down

This is normal for Render free tier:
- Service spins down after 15 minutes of inactivity
- Takes ~30 seconds to wake up on first request
- Health check "/" helps keep it alive

### Issue: Import Errors

Check Render logs for import errors:

**Common fixes:**
1. Verify all files are committed to GitHub
2. Check `requirements.txt` is complete
3. Ensure directory structure is correct:
   ```
   backend/
   ├── config/
   ├── models/
   ├── routes/
   ├── utils/
   ├── main.py
   └── requirements.txt
   ```

## 📊 Expected Log Output (Success)

After the fix, your Render logs should show:

```
==> Starting service with 'uvicorn main:app --host 0.0.0.0 --port 10000'

INFO:     Started server process [1]
INFO:     Waiting for application startup.
2024-01-01 12:00:00 - __main__ - INFO - Starting CTI IOC Lookup Tool...
2024-01-01 12:00:00 - __main__ - INFO - Database: cti_tool
2024-01-01 12:00:00 - __main__ - INFO - API Documentation: /api/docs
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:10000 (Press CTRL+C to quit)

INFO:     122.169.239.244:0 - "GET / HTTP/1.1" 200 OK
INFO:     122.169.239.244:0 - "GET /health HTTP/1.1" 200 OK
```

## 🎉 Success Checklist

After deploying the fix, verify:

- [ ] Render deployment completed successfully
- [ ] Logs show "200 OK" for "/" endpoint
- [ ] Can access `https://your-api.onrender.com/`
- [ ] Can access `https://your-api.onrender.com/health`
- [ ] Can access `https://your-api.onrender.com/api/docs`
- [ ] Frontend can connect to backend
- [ ] IOC lookup works from frontend

## 📞 Need More Help?

If you're still having issues:

1. **Check Render Logs**
   - Dashboard → Your Service → Logs
   - Look for error messages

2. **Verify Environment Variables**
   - Dashboard → Your Service → Environment
   - Ensure all required variables are set

3. **Test Backend Directly**
   ```bash
   # Test each endpoint
   curl https://your-api.onrender.com/
   curl https://your-api.onrender.com/health
   curl https://your-api.onrender.com/api/
   ```

4. **Check MongoDB Connection**
   - Verify MongoDB Atlas allows connections from anywhere (0.0.0.0/0)
   - Test connection string locally

## 🚀 Next Steps

Once this is fixed:

1. Update your Vercel frontend with the Render backend URL
2. Update CORS_ORIGINS in Render with your Vercel URL
3. Test the complete flow end-to-end
4. Monitor the logs for any other issues

---

**The fix has been applied! Just push to GitHub and Render will auto-deploy. 🎉**
