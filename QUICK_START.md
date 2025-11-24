# 🚀 Quick Start - Deploy to Vercel in 5 Minutes

## Prerequisites
- GitHub account
- Vercel account (free): https://vercel.com/signup

## Step-by-Step

### 1️⃣ Push to GitHub (2 min)
```bash
cd /app
git init
git add .
git commit -m "CTI IOC Lookup App"
git remote add origin https://github.com/YOUR_USERNAME/your-repo-name.git
git push -u origin main
```

### 2️⃣ Import to Vercel (1 min)
1. Go to: https://vercel.com/new
2. Click "Import Git Repository"
3. Select your repository
4. Click "Import"

### 3️⃣ Configure Build (1 min)
**Build Command:**
```
cd frontend && yarn install && yarn build
```

**Output Directory:**
```
frontend/build
```

**Install Command:**
```
yarn install && pip install -r requirements.txt
```

### 4️⃣ Add Environment Variables (1 min)
In Vercel → Settings → Environment Variables:

```
ABUSEIPDB_API_KEY=9148d3835cb202106faff2e96ba675157fdd9ffd699662c7ddd8b0a194875a0c8f9bfdfe2b718ba7
VIRUSTOTAL_API_KEY=64c29a69f93c5a804da1d3e029919bd86ef7219df80572e09f97f1d3cf72bc4a
URLSCAN_API_KEY=019aaf63-f958-70b8-a1a4-402eddc31f40
OTX_API_KEY=a6bcac71baee8bd978f78e714173af8fecb093c6f4f987a051de0bfab2678caa
GREYNOISE_API_KEY=Jng2JXWhsaY1iCfsD3j6AbAiCdyVzUqr9saRE9kwQspwy24hOxQ81WxwzV6iS6qD
```

Set for: Production, Preview, Development

### 5️⃣ Deploy (5 min)
Click "Deploy" and wait ~3-5 minutes.

## ✅ Verification

Visit: `https://your-app.vercel.app`

Test IOC lookup: `8.8.8.8`

Check VirusTotal gauge shows: **0 / 95** ✅

## 🎉 Done!

Your app is live with:
- ✅ Frontend + Backend on same domain
- ✅ Auto-deploy from GitHub
- ✅ Global CDN
- ✅ Free SSL
- ✅ Zero CORS issues

---

**Need help?** See `/app/VERCEL_DEPLOYMENT.md` for detailed guide.
