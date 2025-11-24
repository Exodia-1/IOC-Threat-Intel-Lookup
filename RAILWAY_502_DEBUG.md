# Railway 502 Error - Debugging Guide

## Issue
Server starts successfully but returns 502 on requests.

## Changes Made to Fix

### 1. Added Health Check Endpoints
```python
@app.get("/")  # Root level for Railway health check
@app.get("/health")  # Alternative health endpoint
```

Railway needs a health check at the root `/` path, not `/api/`.

### 2. Improved Error Handling
- Added try-catch for individual IOC lookups
- Better logging with `exc_info=True`
- Returns partial results if some sources fail

### 3. Possible Causes of 502

#### A. Environment Variables Not Set
**Most Common Cause!**

In Railway Dashboard → Variables tab, ensure ALL these are set:
```
ABUSEIPDB_API_KEY=9148d3835cb202106faff2e96ba675157fdd9ffd699662c7ddd8b0a194875a0c8f9bfdfe2b718ba7
VIRUSTOTAL_API_KEY=64c29a69f93c5a804da1d3e029919bd86ef7219df80572e09f97f1d3cf72bc4a
URLSCAN_API_KEY=019aaf63-f958-70b8-a1a4-402eddc31f40
OTX_API_KEY=a6bcac71baee8bd978f78e714173af8fecb093c6f4f987a051de0bfab2678caa
GREYNOISE_API_KEY=Jng2JXWhsaY1iCfsD3j6AbAiCdyVzUqr9saRE9kwQspwy24hOxQ81WxwzV6iS6qD
CORS_ORIGINS=*
```

#### B. Railway Health Check Timing Out
Railway expects a quick response at `/` within 2 seconds.

**Solution:** We added a simple health check endpoint.

#### C. API Rate Limits
One API (like GreyNoise) hitting rate limits can cause delays.

**Solution:** Added error handling to continue even if one source fails.

## Testing Steps

### 1. Test Health Check
```bash
curl https://YOUR-APP.up.railway.app/
# Should return: {"status":"healthy","message":"CTI IOC Lookup API"}
```

### 2. Test API Endpoint
```bash
curl https://YOUR-APP.up.railway.app/api/
# Should return: {"message":"Hello World"}
```

### 3. Test IOC Lookup
```bash
curl -X POST "https://YOUR-APP.up.railway.app/api/ioc/lookup" \
  -H "Content-Type: application/json" \
  -d '{"text":"8.8.8.8"}'
# Should return JSON with results
```

## How to Apply the Fix

### If Deployed via GitHub:
```bash
git add .
git commit -m "Add health check endpoint and improve error handling"
git push origin main
```

Railway will auto-redeploy (2-3 min).

### If Manual:
1. Railway Dashboard → Deployments
2. Click "Redeploy" on latest

## Check Railway Logs After Redeployment

Look for:
```
✅ Good: 
INFO: Uvicorn running on http://0.0.0.0:8080
INFO: 127.0.0.1 - "GET / HTTP/1.1" 200 OK

❌ Bad:
ERROR: ...
KeyError: ...
ModuleNotFoundError: ...
```

## If Still Getting 502

### Check Railway Logs for These Errors:

1. **Missing Module Error**
```
ModuleNotFoundError: No module named 'xyz'
```
**Fix:** Add module to `requirements.txt`

2. **Environment Variable Error**
```
KeyError: 'SOME_API_KEY'
```
**Fix:** Add the key in Railway Variables tab

3. **Timeout Error**
```
Worker timeout
```
**Fix:** Increase timeout in Railway settings or optimize API calls

4. **Port Binding Error**
```
Address already in use
```
**Fix:** Should not happen with our `start.sh` script

## Railway Health Check Configuration

If Railway has custom health checks, update them:
- **Path:** `/` or `/health`
- **Port:** 8080 (Railway auto-detects)
- **Timeout:** 10 seconds
- **Interval:** 30 seconds

## Additional Debugging

### View Full Logs in Railway
```bash
# If you have Railway CLI installed
railway logs --tail 100
```

### Test Locally
```bash
cd /app/backend
PORT=8080 uvicorn server:app --host 0.0.0.0 --port 8080
```

Then test:
```bash
curl http://localhost:8080/
curl http://localhost:8080/api/
```

## Success Criteria

After fixing, you should see:
- ✅ Root endpoint `/` returns health status
- ✅ API endpoint `/api/` returns "Hello World"
- ✅ IOC lookup returns results with `total_scans` field
- ✅ No 502 errors in Railway logs
- ✅ Railway dashboard shows "Healthy" status

## Common Railway-Specific Issues

### Issue: App restarts frequently
**Cause:** Memory limit exceeded
**Fix:** Check Railway metrics, may need to upgrade plan

### Issue: Slow first request
**Cause:** Railway cold starts after inactivity
**Fix:** Normal behavior on free tier, or keep app awake with cron job

### Issue: CORS errors from frontend
**Cause:** CORS_ORIGINS not set correctly
**Fix:** Set `CORS_ORIGINS=*` or specific domain

---

**If none of this works, please share:**
1. Full Railway deployment logs (click "View Logs" in Railway)
2. Any error messages you see
3. Response from `curl https://YOUR-APP.up.railway.app/`
