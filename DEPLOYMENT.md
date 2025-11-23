# 🚀 Deployment Guide

**Deploy your CTI IOC Lookup Tool for FREE**

**Backend → Render | Frontend → Vercel | Cost: $0/month**

---

## 📋 Quick Deploy (10 Minutes)

### Part 1: Backend to Render (5 min)

1. **Sign up:** https://render.com (use GitHub)

2. **Create Web Service:**
   - New + → Web Service
   - Connect GitHub repository
   
3. **Configure:**
   ```
   Name: cti-ioc-lookup-api
   Root Directory: backend
   Build Command: pip install -r requirements.txt
   Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
   Instance Type: Free
   ```

4. **Add Environment Variables:**
   ```
   VIRUSTOTAL_API_KEY=your_key
   ABUSEIPDB_API_KEY=your_key
   URLSCAN_API_KEY=your_key
   OTX_API_KEY=your_otx_key
   GREYNOISE_API_KEY=your_key
   LOG_LEVEL=INFO
   CORS_ORIGINS=*
   ```

5. **Deploy** → Copy URL: `https://your-api.onrender.com`

---

### Part 2: Frontend to Vercel (3 min)

1. **Sign up:** https://vercel.com (use GitHub)

2. **Import Project:**
   - Add New → Project
   - Select your repository

3. **Configure:**
   ```
   Root Directory: frontend  ← IMPORTANT!
   Framework: Create React App
   Build Command: yarn build
   Output Directory: build
   ```

4. **Add Environment Variable:**
   ```
   REACT_APP_BACKEND_URL=https://your-api.onrender.com
   ```
   (Use YOUR Render URL from Part 1)

5. **Deploy** → Copy URL: `https://your-app.vercel.app`

---

### Part 3: Connect (2 min)

**Update CORS in Render:**
1. Render Dashboard → Your Service → Environment
2. Edit `CORS_ORIGINS` to: `https://your-app.vercel.app`
3. Save (auto-redeploys)

---

## ✅ Done!

**Your URLs:**
- Frontend: `https://your-app.vercel.app`
- Backend: `https://your-api.onrender.com`
- API Docs: `https://your-api.onrender.com/api/docs`

**Test:** Visit your frontend URL and try an IOC lookup!

---

## 🔑 Get Free API Keys

All services offer free tiers:

- **VirusTotal:** https://www.virustotal.com/gui/join-us
- **AbuseIPDB:** https://www.abuseipdb.com/register
- **urlscan.io:** https://urlscan.io/user/signup
- **AlienVault OTX:** https://otx.alienvault.com/
- **GreyNoise:** https://www.greynoise.io/

---

## 🔧 Troubleshooting

**Backend not starting:**
- Check Render logs
- Verify all API keys are set
- Ensure Start Command is correct

**Frontend can't connect:**
- Verify `REACT_APP_BACKEND_URL` in Vercel
- Check CORS is updated in Render
- No trailing slash in URLs

**CORS errors:**
- Update `CORS_ORIGINS` in Render to match your Vercel URL exactly

---

## 💰 Cost

**Free Tier:**
- Render: 750 hours/month
- Vercel: Unlimited

**Monthly Cost: $0** ✅

---

**That's it! Simple, free, and working! 🎉**
