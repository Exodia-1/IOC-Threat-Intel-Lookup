# Railway Port Fix

## Issue
Railway logs showed: `Error: Invalid value for '--port': '$PORT' is not a valid integer.`

## Root Cause
Railway provides `PORT` as an environment variable, but the direct shell variable expansion `$PORT` wasn't working in the startup command.

## Solution Applied
Created a bash startup script (`start.sh`) that properly handles the PORT environment variable.

## Changes Made

### 1. Created `/app/backend/start.sh`
```bash
#!/bin/bash
PORT=${PORT:-8001}
echo "Starting server on port $PORT..."
uvicorn server:app --host 0.0.0.0 --port $PORT
```

### 2. Updated Config Files
All config files now use: `startCommand = "bash start.sh"`

- ✅ `Procfile`
- ✅ `railway.json`
- ✅ `railway.toml`

## How to Apply the Fix

### If you already deployed to Railway:

**Option 1: Push to GitHub (Recommended)**
```bash
cd /app/backend
git add .
git commit -m "Fix Railway port configuration"
git push origin main
```
Railway will auto-detect the change and redeploy.

**Option 2: Manual Redeploy in Railway Dashboard**
1. Go to Railway dashboard
2. Click on your project
3. Go to "Deployments" tab
4. Click "Redeploy" on the latest deployment

### If you haven't deployed yet:
Just follow the normal deployment process in `/app/RAILWAY_QUICK_START.md`. The fix is already included.

## Verification

After redeployment, check Railway logs. You should see:
```
Starting server on port 8000...
INFO:     Started server process [1]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000
```

## Test Your Deployment

```bash
# Replace with your Railway URL
curl https://YOUR-APP.up.railway.app/api/

# Should return:
{"message":"Hello World"}
```

## Why This Fix Works

Railway provides `PORT` as a numeric environment variable (e.g., `8000`), but when using it directly in the command like `--port $PORT`, the shell doesn't expand it correctly in the Railway context.

By using a bash script:
1. Bash properly reads the PORT environment variable
2. Falls back to 8001 if not set (for local testing)
3. Passes it correctly to uvicorn

## Additional Notes

- The startup script is executable (`chmod +x start.sh`)
- Works both locally and on Railway
- Falls back to port 8001 for local development
- Railway automatically provides PORT when deploying

## Next Steps

1. ✅ Push changes to GitHub or trigger redeploy
2. ✅ Wait for deployment (2-3 minutes)
3. ✅ Check logs - should see "Starting server on port..."
4. ✅ Test API endpoint
5. ✅ Update frontend environment variable
6. ✅ Verify full application works

Your backend should now deploy successfully on Railway! 🎉
