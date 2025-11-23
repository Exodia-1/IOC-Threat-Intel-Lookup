# How to Deploy Updated Backend to Render.com

## Issue Confirmed ✅
Your backend at `https://cti-ioc-lookup-api.onrender.com` is **missing the `total_scans` field**, causing:
- VirusTotal gauge shows: **2 / 1** ❌ (should be **2 / 95**)
- Total Scans shows: **0** ❌ (should be **95**)

## Root Cause
The backend has the raw data (malicious, suspicious, harmless, undetected) but:
1. It doesn't calculate and return `total_scans`
2. It's missing all the enhanced fields we added (continent, network, detections, tags, etc.)

## Solution: Deploy Updated Files to Render.com

### Step 1: Update Your GitHub Repository

#### Option A: Push from Local (if you have Git setup)
```bash
cd /app/backend
git add threat_intel.py
git commit -m "Add total_scans and enhanced data extraction for all sources"
git push origin main
```

#### Option B: Manual Upload to GitHub
1. Go to your GitHub repository
2. Navigate to `backend/threat_intel.py`
3. Click "Edit" (pencil icon)
4. Copy the entire content from `/app/backend/threat_intel.py` here
5. Commit the changes

### Step 2: Trigger Redeploy on Render.com

#### Option A: Automatic Redeploy (if connected to GitHub)
1. Go to your Render.com dashboard
2. Find your backend service: `cti-ioc-lookup-api`
3. If you have auto-deploy enabled, it should automatically start deploying after you push to GitHub
4. Wait for the deployment to complete (usually 2-5 minutes)

#### Option B: Manual Redeploy
1. Go to your Render.com dashboard
2. Find your backend service: `cti-ioc-lookup-api`
3. Click "Manual Deploy" → "Deploy latest commit"
4. Wait for deployment to complete

### Step 3: Verify the Fix

Once deployed, test your API:

```bash
curl -s -X POST "https://cti-ioc-lookup-api.onrender.com/api/ioc/lookup" \
  -H "Content-Type: application/json" \
  -d '{"text":"8.8.8.8"}' | grep -o '"total_scans":[0-9]*'
```

**Expected output:** `"total_scans":95` (or similar number)

**If you see nothing:** The backend wasn't updated correctly. Try redeploying again.

### Step 4: Test Your Frontend

1. Go to your deployed frontend: `https://ioc-jk.vercel.app`
2. Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
3. Search for IP: `8.8.8.8`
4. Check VirusTotal card:
   - Gauge should show: **0 / 95** ✅ (not 0 / 1)
   - "Total Scans" should show: **95** ✅ (not 0)

### Step 5: Check Enhanced Data

After deploying, you should also see NEW enhanced data:
- **VirusTotal:** Continent, Network, Detection details, Tags
- **AbuseIPDB:** Recent reports with comments and categories
- **GreyNoise:** Trust level, Category, Explanation
- **WHOIS:** Full registrant details, Name servers
- **URLScan:** Scan details with countries and IPs
- **OTX:** Geographic data, Pulse details

## Troubleshooting

### Issue: Render shows "Build Failed"
- Check Render logs for Python errors
- Ensure `requirements.txt` includes all dependencies
- Verify Python version compatibility (should be 3.9+)

### Issue: Deployment successful but still showing old data
1. Check if you deployed to the correct service
2. Try a hard refresh on frontend (Ctrl+Shift+R)
3. Verify the API endpoint directly with curl (see Step 3)
4. Check if Render is caching the old code - try "Clear build cache" in Render settings

### Issue: "total_scans" still missing after deploy
1. Verify the correct file was pushed to GitHub:
   - Go to your GitHub repo
   - Check `backend/threat_intel.py`
   - Search for "total_scans" in the file
   - It should appear in lines ~55, ~100, ~145, ~190
2. If the file is correct on GitHub but Render isn't picking it up:
   - Go to Render dashboard
   - Click "Manual Deploy" → "Clear build cache & deploy"

## Quick Reference: What Changed in threat_intel.py

### VirusTotal (lines 33-76 for IP lookup)
**ADDED:**
```python
total_scans = malicious + suspicious + harmless + undetected
'total_scans': total_scans,  # THIS IS THE KEY FIX
'continent': attributes.get('continent', 'Unknown'),
'network': attributes.get('network', 'Unknown'),
'detections': [...],  # Top 10 detections
'tags': attributes.get('tags', [])
```

### Similar additions for:
- VirusTotal domain lookup
- AbuseIPDB (recent_reports, is_tor, hostnames)
- GreyNoise (trust_level, category, explanation)
- WHOIS (registrant details, name servers)
- URLScan (scan details)
- OTX (pulse details, geographic data)

## Need Help?
If you're still having issues after following these steps:
1. Check Render deployment logs for errors
2. Verify your GitHub repository has the updated file
3. Test the API endpoint directly to confirm what data it's returning
4. Make sure environment variables (API keys) are set in Render dashboard
