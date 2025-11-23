# CTI IOC Lookup Tool - Free Deployment Guide

This guide will help you deploy your CTI IOC Lookup Tool for free using popular cloud platforms.

## 📋 Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Backend Deployment](#backend-deployment)
3. [Frontend Deployment](#frontend-deployment)
4. [Database Setup](#database-setup)
5. [Environment Configuration](#environment-configuration)
6. [Testing Your Deployment](#testing-your-deployment)

---

## 🏗️ Architecture Overview

**Stack:**
- **Frontend:** React.js (Static Site)
- **Backend:** FastAPI (Python)
- **Database:** MongoDB

**Recommended Free Hosting:**
- **Frontend:** Vercel / Netlify / Cloudflare Pages
- **Backend:** Railway / Render / Fly.io
- **Database:** MongoDB Atlas (Free tier: 512MB)

---

## 🗄️ Database Setup (MongoDB Atlas)

**Step 1:** Create Free MongoDB Atlas Account
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up for a free account
3. Create a new cluster (Select **FREE M0** tier)
4. Choose a cloud provider and region (closest to your backend)

**Step 2:** Configure Database Access
1. Go to **Database Access** → **Add New Database User**
2. Create username and password (save these!)
3. Set privileges to **Read and write to any database**

**Step 3:** Configure Network Access
1. Go to **Network Access** → **Add IP Address**
2. Click **Allow Access from Anywhere** (0.0.0.0/0) for development
3. For production, whitelist specific IPs

**Step 4:** Get Connection String
1. Go to **Database** → **Connect** → **Connect your application**
2. Copy the connection string (looks like: `mongodb+srv://username:<password>@cluster.mongodb.net/`)
3. Replace `<password>` with your actual password
4. Add your database name at the end: `mongodb+srv://username:password@cluster.mongodb.net/cti_tool`

---

## 🚀 Backend Deployment

### Option 1: Railway (Recommended - Easiest)

**Features:** 
- $5 free credits per month (~500 hours)
- GitHub integration
- Automatic deployments
- Built-in environment variables

**Steps:**

1. **Sign Up**
   - Go to https://railway.app
   - Sign in with GitHub

2. **Create New Project**
   - Click **New Project** → **Deploy from GitHub repo**
   - Select your repository
   - Select the `backend` folder as root directory

3. **Configure Environment Variables**
   Go to **Variables** tab and add:
   ```
   MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/cti_tool
   DB_NAME=cti_tool
   VIRUSTOTAL_API_KEY=your_key
   ABUSEIPDB_API_KEY=your_key
   URLSCAN_API_KEY=your_key
   OTX_API_KEY=your_key
   GREYNOISE_API_KEY=your_key
   LOG_LEVEL=INFO
   CORS_ORIGINS=https://your-frontend-domain.vercel.app
   ```

4. **Deploy**
   - Railway will auto-detect the Dockerfile and deploy
   - Get your backend URL from the deployment (e.g., `https://your-app.railway.app`)

---

### Option 2: Render

**Features:**
- Free tier: 750 hours/month
- Automatic HTTPS
- GitHub integration

**Steps:**

1. **Sign Up**
   - Go to https://render.com
   - Sign up with GitHub

2. **Create Web Service**
   - Click **New** → **Web Service**
   - Connect your GitHub repository
   - Select `backend` folder

3. **Configure Service**
   ```
   Name: cti-ioc-lookup-api
   Environment: Python 3
   Build Command: pip install -r requirements.txt
   Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
   ```

4. **Add Environment Variables**
   Same as Railway (see above)

5. **Deploy**
   - Click **Create Web Service**
   - Wait for deployment (5-10 minutes)
   - Get your backend URL

---

### Option 3: Fly.io

**Features:**
- Free tier: 3 VMs, 160GB/month bandwidth
- Global deployment
- CLI-based deployment

**Steps:**

1. **Install Fly CLI**
   ```bash
   # macOS/Linux
   curl -L https://fly.io/install.sh | sh
   
   # Windows (PowerShell)
   iwr https://fly.io/install.ps1 -useb | iex
   ```

2. **Sign Up and Login**
   ```bash
   fly auth signup
   fly auth login
   ```

3. **Navigate to Backend Folder**
   ```bash
   cd backend
   ```

4. **Launch Application**
   ```bash
   fly launch
   ```
   - Choose app name
   - Select region
   - Don't deploy yet

5. **Set Environment Variables**
   ```bash
   fly secrets set MONGO_URL="mongodb+srv://..."
   fly secrets set DB_NAME="cti_tool"
   fly secrets set VIRUSTOTAL_API_KEY="your_key"
   fly secrets set ABUSEIPDB_API_KEY="your_key"
   fly secrets set URLSCAN_API_KEY="your_key"
   fly secrets set OTX_API_KEY="your_key"
   fly secrets set GREYNOISE_API_KEY="your_key"
   ```

6. **Deploy**
   ```bash
   fly deploy
   ```

7. **Get URL**
   ```bash
   fly status
   ```

---

## 🎨 Frontend Deployment

### Option 1: Vercel (Recommended for React)

**Features:**
- Unlimited free deployments
- Automatic HTTPS
- Global CDN
- GitHub integration

**Steps:**

1. **Sign Up**
   - Go to https://vercel.com
   - Sign up with GitHub

2. **Import Project**
   - Click **Add New** → **Project**
   - Import your GitHub repository
   - Select `frontend` as root directory

3. **Configure Build Settings**
   ```
   Framework Preset: Create React App
   Build Command: yarn build
   Output Directory: build
   Install Command: yarn install
   ```

4. **Add Environment Variable**
   - Go to **Settings** → **Environment Variables**
   ```
   REACT_APP_BACKEND_URL=https://your-backend.railway.app
   ```

5. **Deploy**
   - Click **Deploy**
   - Get your frontend URL (e.g., `https://your-app.vercel.app`)

6. **Update Backend CORS**
   - Go back to Railway/Render
   - Update `CORS_ORIGINS` to include your Vercel URL

---

### Option 2: Netlify

**Features:**
- 100GB bandwidth/month
- Automatic HTTPS
- Form handling

**Steps:**

1. **Sign Up**
   - Go to https://netlify.com
   - Sign up with GitHub

2. **Add New Site**
   - Click **Add new site** → **Import an existing project**
   - Choose your GitHub repository

3. **Configure Build**
   ```
   Base directory: frontend
   Build command: yarn build
   Publish directory: frontend/build
   ```

4. **Add Environment Variable**
   - Go to **Site settings** → **Environment variables**
   ```
   REACT_APP_BACKEND_URL=https://your-backend.railway.app
   ```

5. **Deploy**
   - Netlify will auto-deploy
   - Get your URL

---

### Option 3: Cloudflare Pages

**Features:**
- Unlimited bandwidth
- Global CDN (fastest)
- 500 builds/month

**Steps:**

1. **Sign Up**
   - Go to https://pages.cloudflare.com
   - Sign up with GitHub

2. **Create Project**
   - Click **Create a project**
   - Select your repository

3. **Configure Build**
   ```
   Framework preset: Create React App
   Build command: yarn build
   Build output directory: build
   Root directory: frontend
   ```

4. **Add Environment Variable**
   ```
   REACT_APP_BACKEND_URL=https://your-backend.railway.app
   ```

5. **Deploy**

---

## ⚙️ Environment Configuration

### Backend Environment Variables

**Required:**
```bash
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/cti_tool
DB_NAME=cti_tool
VIRUSTOTAL_API_KEY=your_virustotal_api_key
ABUSEIPDB_API_KEY=your_abuseipdb_api_key
URLSCAN_API_KEY=your_urlscan_api_key
OTX_API_KEY=your_otx_api_key
GREYNOISE_API_KEY=your_greynoise_api_key
```

**Optional:**
```bash
LOG_LEVEL=INFO
CORS_ORIGINS=https://your-frontend.vercel.app,https://your-frontend.netlify.app
```

### Frontend Environment Variables

**Required:**
```bash
REACT_APP_BACKEND_URL=https://your-backend.railway.app
```

---

## 🧪 Testing Your Deployment

### 1. Test Backend API
```bash
# Health check
curl https://your-backend.railway.app/health

# API docs
Open: https://your-backend.railway.app/api/docs

# Test IOC lookup
curl -X POST https://your-backend.railway.app/api/ioc/lookup \
  -H "Content-Type: application/json" \
  -d '{"text": "8.8.8.8"}'
```

### 2. Test Frontend
- Open your frontend URL in browser
- Try looking up an IOC (e.g., `8.8.8.8`)
- Check History page
- Test Email Analysis
- Test File Analysis

### 3. Check Logs

**Railway:**
- Go to your project → **Deployments** → Click on deployment → **View Logs**

**Render:**
- Go to your service → **Logs** tab

**Vercel/Netlify:**
- Go to deployment → **Functions** or **Logs**

---

## 🔒 Production Best Practices

1. **Use Environment Variables** - Never hardcode API keys
2. **Enable CORS Properly** - Only allow your frontend domain
3. **Monitor Usage** - Check your free tier limits
4. **Set Up Alerts** - Get notified of deployment failures
5. **Use HTTPS** - All platforms provide it automatically
6. **Database Backups** - MongoDB Atlas has automatic backups
7. **Rate Limiting** - Consider adding rate limits to API endpoints

---

## 💰 Cost Breakdown (Monthly)

| Service | Free Tier | Paid Tier Starts |
|---------|-----------|------------------|
| MongoDB Atlas | 512MB | $9/month (2GB) |
| Railway | $5 credit (~500h) | $5/month (usage-based) |
| Render | 750 hours | $7/month (Pro) |
| Vercel | Unlimited | $20/month (Pro) |
| Netlify | 100GB bandwidth | $19/month (Pro) |
| Fly.io | 3 VMs, 160GB | Usage-based |

**Total Free:** $0/month ✅
**Expected Cost (if exceeds free tier):** $15-25/month

---

## 🆘 Troubleshooting

### Backend Not Starting
- Check environment variables are set correctly
- Verify MongoDB connection string
- Check deployment logs for errors

### Frontend Can't Connect to Backend
- Verify `REACT_APP_BACKEND_URL` is correct
- Check CORS settings in backend
- Ensure backend is running (check health endpoint)

### Database Connection Failed
- Verify MongoDB Atlas IP whitelist
- Check connection string format
- Ensure database user has correct permissions

### API Keys Not Working
- Verify keys are valid and active
- Check rate limits on third-party services
- Review API key permissions

---

## 📚 Additional Resources

- [Railway Docs](https://docs.railway.app)
- [Render Docs](https://render.com/docs)
- [Vercel Docs](https://vercel.com/docs)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com)
- [FastAPI Deployment](https://fastapi.tiangolo.com/deployment/)

---

## 🎉 Quick Start (TL;DR)

1. **Database:** Sign up for MongoDB Atlas → Get connection string
2. **Backend:** Deploy to Railway → Add environment variables
3. **Frontend:** Deploy to Vercel → Add backend URL
4. **Update:** Add frontend URL to backend CORS settings
5. **Test:** Open frontend → Try IOC lookup

**Done! Your CTI tool is now live! 🚀**
