# 🚀 Deploy CTI IOC Lookup Tool - Render + Vercel

**Complete deployment guide for hosting your CTI IOC Lookup Tool for FREE**

- **Backend**: Render (750 free hours/month)
- **Frontend**: Vercel (Unlimited free deployments)
- **Database**: MongoDB Atlas (512MB free)
- **Total Cost**: $0/month ✅

---

## 📋 Prerequisites

Before starting, ensure you have:
- [ ] GitHub account
- [ ] Your code pushed to a GitHub repository
- [ ] API keys for threat intelligence sources (VirusTotal, AbuseIPDB, etc.)

**Estimated Time**: 25 minutes

---

## 🗄️ Step 1: Setup MongoDB Atlas (5 minutes)

### 1.1 Create Account
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up with email or Google
3. Complete verification

### 1.2 Create Cluster
1. Click **"Build a Database"**
2. Choose **FREE** tier (M0)
3. Select cloud provider: **AWS** (recommended)
4. Choose region closest to you (e.g., `us-east-1`)
5. Cluster name: `cti-tool` (or any name)
6. Click **"Create"**

⏳ Wait 3-5 minutes for cluster creation

### 1.3 Configure Database Access
1. Go to **Database Access** (left sidebar)
2. Click **"Add New Database User"**
3. Choose **Password** authentication
4. Username: `ctiuser` (or your choice)
5. **Generate secure password** (save this!)
6. Database User Privileges: **Read and write to any database**
7. Click **"Add User"**

### 1.4 Configure Network Access
1. Go to **Network Access** (left sidebar)
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (0.0.0.0/0)
   - For production, you can whitelist specific IPs later
4. Click **"Confirm"**

### 1.5 Get Connection String
1. Go to **Database** (left sidebar)
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Driver: **Python**, Version: **3.11 or later**
5. Copy the connection string:
   ```
   mongodb+srv://<username>:<password>@cluster.mongodb.net/?retryWrites=true&w=majority
   ```
6. Replace `<username>` with your username
7. Replace `<password>` with your actual password
8. Add database name at the end:
   ```
   mongodb+srv://ctiuser:YOUR_PASSWORD@cluster.mongodb.net/cti_tool?retryWrites=true&w=majority
   ```

✅ **Save this connection string** - you'll need it for Render!

---

## ⚙️ Step 2: Deploy Backend to Render (10 minutes)

### 2.1 Create Render Account
1. Go to https://render.com
2. Sign up with GitHub (recommended for easy deployment)
3. Authorize Render to access your repositories

### 2.2 Create Web Service
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Select your repository from the list
4. Click **"Connect"**

### 2.3 Configure Service

**Basic Settings:**
```
Name: cti-ioc-lookup-api
Region: Oregon (US West) or closest to you
Branch: main (or your default branch)
Root Directory: backend
```

**Build Settings:**
```
Environment: Python 3
Build Command: pip install -r requirements.txt
Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
```

**Instance Type:**
```
Free
```

### 2.4 Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"**

Add the following variables one by one:

```bash
# Database
MONGO_URL=mongodb+srv://ctiuser:YOUR_PASSWORD@cluster.mongodb.net/cti_tool?retryWrites=true&w=majority
DB_NAME=cti_tool

# Threat Intelligence API Keys
VIRUSTOTAL_API_KEY=your_virustotal_key_here
ABUSEIPDB_API_KEY=your_abuseipdb_key_here
URLSCAN_API_KEY=your_urlscan_key_here
OTX_API_KEY=your_otx_key_here
GREYNOISE_API_KEY=your_greynoise_key_here

# App Configuration
LOG_LEVEL=INFO
CORS_ORIGINS=*
```

**Important**: 
- Use your actual MongoDB connection string from Step 1.5
- Add your actual API keys (get them from respective services)
- We'll update `CORS_ORIGINS` later with your Vercel URL

### 2.5 Deploy Backend
1. Click **"Create Web Service"**
2. ⏳ Wait 5-10 minutes for deployment
3. Watch the logs for any errors
4. Once deployed, you'll see **"Your service is live"** 🎉

### 2.6 Get Backend URL
1. Copy your backend URL from the top of the page
   - Example: `https://cti-ioc-lookup-api.onrender.com`
2. ✅ **Save this URL** - you'll need it for Vercel!

### 2.7 Test Backend
```bash
# Test health endpoint
curl https://your-backend-url.onrender.com/health

# Expected response:
{"status":"healthy","service":"CTI IOC Lookup Tool","version":"1.0.0"}

# Test API docs
# Open in browser:
https://your-backend-url.onrender.com/api/docs
```

✅ If you see the health response, your backend is working!

---

## 🎨 Step 3: Deploy Frontend to Vercel (5 minutes)

### 3.1 Create Vercel Account
1. Go to https://vercel.com
2. Click **"Sign Up"**
3. Choose **"Continue with GitHub"**
4. Authorize Vercel

### 3.2 Import Project
1. Click **"Add New..."** → **"Project"**
2. Find your repository in the list
3. Click **"Import"**

### 3.3 Configure Project

**Framework Preset:**
```
Create React App (auto-detected)
```

**Root Directory:**
```
frontend
```

**Build Settings:** (auto-filled)
```
Build Command: yarn build
Output Directory: build
Install Command: yarn install
```

### 3.4 Add Environment Variables

Click **"Environment Variables"** section

Add this variable:
```
Name: REACT_APP_BACKEND_URL
Value: https://your-backend-url.onrender.com
```

**Replace** `your-backend-url` with your actual Render URL from Step 2.6

**Important**: Do NOT add trailing slash (/)

### 3.5 Deploy Frontend
1. Click **"Deploy"**
2. ⏳ Wait 2-3 minutes
3. Watch deployment logs
4. Once complete, you'll see **"Congratulations"** 🎉

### 3.6 Get Frontend URL
1. Copy your frontend URL
   - Example: `https://cti-ioc-lookup.vercel.app`
2. ✅ **Save this URL** - this is your live app!

---

## 🔄 Step 4: Update Backend CORS (3 minutes)

Now we need to tell the backend to accept requests from your frontend.

### 4.1 Update CORS in Render
1. Go back to Render dashboard
2. Click on your web service
3. Go to **"Environment"** tab
4. Find `CORS_ORIGINS` variable
5. Click **"Edit"**
6. Change value from `*` to your Vercel URL:
   ```
   https://cti-ioc-lookup.vercel.app
   ```
   (Use your actual Vercel URL)
7. Click **"Save Changes"**

### 4.2 Wait for Auto-Deploy
- Render will automatically redeploy (takes ~2 minutes)
- Watch the logs in the **"Logs"** tab

---

## ✅ Step 5: Test Your Live App (2 minutes)

### 5.1 Open Your App
1. Go to your Vercel URL: `https://cti-ioc-lookup.vercel.app`
2. You should see the CTI IOC Lookup Tool interface

### 5.2 Test IOC Lookup
1. Enter an IOC (e.g., `8.8.8.8`)
2. Click **"Lookup IOCs"**
3. Wait for results
4. ✅ You should see threat intelligence data!

### 5.3 Test Other Features
- [ ] Try email analysis
- [ ] Try file upload
- [ ] Check history page

---

## 🎉 Congratulations! Your App is Live!

**Your URLs:**
- 🌐 **Frontend**: https://your-app.vercel.app
- ⚙️ **Backend API**: https://your-api.onrender.com
- 📚 **API Docs**: https://your-api.onrender.com/api/docs

---

## 🔧 Common Issues & Solutions

### Issue 1: Backend Not Responding
**Symptoms**: Frontend shows connection error

**Solutions:**
1. Check Render logs: Dashboard → Your Service → Logs
2. Verify environment variables are set correctly
3. Test backend URL directly: `curl https://your-backend.onrender.com/health`
4. Check if MongoDB connection string is correct

### Issue 2: CORS Error
**Symptoms**: "CORS policy" error in browser console

**Solutions:**
1. Verify `CORS_ORIGINS` in Render includes your Vercel URL
2. Make sure there's no trailing slash (/)
3. Wait for Render to redeploy after CORS change

### Issue 3: MongoDB Connection Failed
**Symptoms**: "MongoServerError" in Render logs

**Solutions:**
1. Check MongoDB Atlas Network Access (should allow 0.0.0.0/0)
2. Verify connection string format
3. Ensure password doesn't have special characters (or URL encode them)
4. Check database user has read/write permissions

### Issue 4: Frontend Build Failed
**Symptoms**: Vercel deployment failed

**Solutions:**
1. Check build logs in Vercel
2. Verify `REACT_APP_BACKEND_URL` is set correctly
3. Make sure `frontend` is set as root directory
4. Try redeploying: Deployments → ⋯ → Redeploy

### Issue 5: API Keys Not Working
**Symptoms**: "Invalid API key" or empty results

**Solutions:**
1. Verify API keys are correct in Render environment variables
2. Check key validity on respective service websites
3. Some services have rate limits - check their dashboards

---

## 📊 Monitoring Your Deployment

### Render Dashboard
**Check Backend Health:**
1. Go to https://dashboard.render.com
2. Click your service
3. View **Metrics**: CPU, Memory, Request count
4. Check **Logs** for errors

**Free Tier Limits:**
- 750 hours/month
- Spins down after 15 minutes of inactivity
- Takes ~30 seconds to wake up on first request

### Vercel Dashboard
**Check Frontend:**
1. Go to https://vercel.com/dashboard
2. Click your project
3. View **Deployments**, **Analytics**, **Logs**

**Free Tier Limits:**
- Unlimited deployments
- 100 GB bandwidth/month
- Serverless function execution: 100 GB-hours

### MongoDB Atlas
**Check Database:**
1. Go to https://cloud.mongodb.com
2. View **Metrics**: Connections, Operations, Storage
3. Check **Network Access**, **Database Access**

**Free Tier Limits:**
- 512 MB storage
- Shared CPU
- 500 connections max

---

## 🔄 Making Updates

### Update Backend Code
1. Push changes to GitHub:
   ```bash
   git add .
   git commit -m "Update backend"
   git push origin main
   ```
2. Render auto-deploys (takes 3-5 minutes)
3. Check logs for successful deployment

### Update Frontend Code
1. Push changes to GitHub:
   ```bash
   git add .
   git commit -m "Update frontend"
   git push origin main
   ```
2. Vercel auto-deploys (takes 1-2 minutes)
3. Check deployment status in Vercel dashboard

### Update Environment Variables
**Render:**
1. Dashboard → Service → Environment
2. Edit variable → Save
3. Manually trigger redeploy if needed

**Vercel:**
1. Dashboard → Project → Settings → Environment Variables
2. Edit variable → Save
3. Redeploy from Deployments tab

---

## 🔐 Security Best Practices

### Production Checklist
- [ ] Use strong MongoDB password
- [ ] Whitelist specific IPs in MongoDB (instead of 0.0.0.0/0)
- [ ] Set specific CORS origins (not `*`)
- [ ] Rotate API keys regularly
- [ ] Monitor usage dashboards
- [ ] Enable Vercel password protection (Settings → Password Protection)
- [ ] Set up Render alerts (Settings → Notifications)

---

## 💰 Cost Management

### Current Setup Cost: $0/month

**If You Exceed Free Tiers:**

| Service | Free Tier | Paid Plan |
|---------|-----------|-----------|
| Render | 750 hours/month | $7/month (Starter) |
| Vercel | 100 GB bandwidth | $20/month (Pro) |
| MongoDB Atlas | 512 MB | $9/month (M10) |

**Estimated Monthly Cost if Paid**: $36/month

**Tips to Stay Free:**
- Render spins down after inactivity (free tier)
- Monitor bandwidth in Vercel
- Optimize queries to reduce MongoDB operations
- Cache results when possible

---

## 🆘 Need Help?

### Check Logs First
1. **Render Logs**: Dashboard → Service → Logs
2. **Vercel Logs**: Dashboard → Project → Deployments → [Latest] → Logs
3. **Browser Console**: F12 → Console tab

### Documentation
- [Render Docs](https://render.com/docs)
- [Vercel Docs](https://vercel.com/docs)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com)

### Service Status
- [Render Status](https://status.render.com)
- [Vercel Status](https://www.vercel-status.com)
- [MongoDB Atlas Status](https://status.mongodb.com)

---

## 📝 Quick Reference Card

**Copy this for future reference:**

```
# My CTI IOC Lookup Tool Deployment

Frontend URL: https://_____________________.vercel.app
Backend URL:  https://_____________________.onrender.com
API Docs:     https://_____________________.onrender.com/api/docs

MongoDB:
  Cluster: _____________________
  Database: cti_tool
  User: _____________________

Render Account: _____________________
Vercel Account: _____________________
GitHub Repo: _____________________

Deployed: __________
Last Updated: __________
```

---

## 🎓 Next Steps

Now that your app is deployed:

1. **Share with your team** - Give them the Vercel URL
2. **Test all features** - Make sure everything works
3. **Monitor usage** - Check dashboards weekly
4. **Add custom domain** (optional) - Both Render and Vercel support this
5. **Set up monitoring** - Use UptimeRobot or similar
6. **Enable HTTPS** (already done by default!)

---

**🎉 Congratulations! Your CTI IOC Lookup Tool is now live and accessible to the world!**

**Your app is running on enterprise-grade infrastructure for FREE! 🚀**

---

## 📚 Additional Resources

- [Custom Domain Setup - Vercel](https://vercel.com/docs/concepts/projects/custom-domains)
- [Environment Groups - Render](https://render.com/docs/environment-groups)
- [Scaling Guide - MongoDB Atlas](https://docs.atlas.mongodb.com/scale-cluster/)
- [Performance Tips - Render](https://render.com/docs/optimization)
