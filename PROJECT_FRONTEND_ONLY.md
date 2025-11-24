# Project: Convert CTI IOC Lookup to Frontend-Only Application

## 🎯 Project Goal
Convert the existing full-stack CTI IOC Lookup application (React + FastAPI backend) into a **frontend-only React application** that makes direct API calls to threat intelligence services from the browser.

---

## 📊 Current Architecture (To Be Changed)
```
Frontend (React) → Backend (FastAPI) → Threat Intel APIs
                    ↓
                MongoDB (removed)
```

## 🎯 Target Architecture (Frontend-Only)
```
Frontend (React) → Threat Intel APIs (direct calls)
```

---

## 🔄 What Needs to Be Done

### 1. **Remove Backend Dependency**
- ❌ Delete `/app/backend/` folder (no longer needed)
- ❌ Remove all backend deployment files
- ❌ Remove API proxy layer

### 2. **Move All Logic to Frontend**
Migrate the following from backend to frontend:

#### A. IOC Detection & Parsing (`backend/ioc_detector.py`)
- Extract IOCs from text input (IPs, domains, URLs, hashes, emails)
- Defang IOCs (convert `hxxp://example[.]com` to `http://example.com`)
- Classify IOC types (IPv4, domain, URL, MD5, SHA1, SHA256, email)

**Move to:** `frontend/src/utils/iocDetector.js`

#### B. Threat Intelligence API Integration (`backend/threat_intel.py`)
Direct API calls to:
1. **VirusTotal** - Malware & URL analysis
2. **AbuseIPDB** - IP reputation
3. **URLScan.io** - URL scanning
4. **AlienVault OTX** - Open threat exchange
5. **GreyNoise** - Internet scanner detection
6. **WHOIS** - Domain registration info
7. **MXToolbox** - Email/DNS checks
8. **IPVoid** (optional) - IP blacklist checking

**Move to:** `frontend/src/services/threatIntelService.js`

#### C. Email Analysis (`backend/email_analyzer.py`)
- Domain security checks (SPF, DMARC, DKIM, MX records)
- Email header parsing
- Sender verification

**Move to:** `frontend/src/services/emailAnalyzer.js`

#### D. File Analysis (`backend/file_analyzer.py`)
- File upload handling
- Hash generation (MD5, SHA1, SHA256)
- File type detection
- Lookup hashes via threat intel APIs

**Move to:** `frontend/src/services/fileAnalyzer.js`

### 3. **API Key Management**
Since API calls are now from browser, need to handle API keys securely:

**Options:**
- **Option A (Recommended):** Use environment variables in build process (hidden from users, but visible in browser network tab)
- **Option B:** Let users input their own API keys (most secure)
- **Option C:** Use CORS-enabled public endpoints (limited)

**Implementation:**
- Create settings page for users to input API keys
- Store in browser localStorage (encrypted)
- Show warning about API key security
- Provide links to get free API keys

### 4. **Handle CORS Issues**
Direct browser calls to external APIs may face CORS restrictions.

**Solutions:**
- Use APIs that support CORS (most modern threat intel APIs do)
- For APIs without CORS: Use CORS proxy (e.g., `cors-anywhere`)
- Provide fallback messages when API is blocked

### 5. **Update UI Components**
Current components already built for frontend, just need to:
- Remove backend URL dependencies
- Update API call functions to use direct fetch/axios
- Add loading states for slower direct API calls
- Handle API rate limits gracefully
- Show error messages for failed API calls

### 6. **Enhanced User Experience**
Since backend is removed:
- Add API key configuration page
- Show API call progress indicators
- Cache results in browser (localStorage)
- Add export results feature (JSON/CSV)
- Implement client-side filtering/sorting

---

## 📁 New Frontend Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── ResultsDisplay.js        [Keep - already done]
│   │   ├── ApiKeySettings.js        [NEW - for user API keys]
│   │   └── ui/                      [Keep - Shadcn components]
│   ├── pages/
│   │   ├── LookupPage.js            [Update - direct API calls]
│   │   ├── EmailAnalysisPage.js     [Update - direct API calls]
│   │   ├── FileAnalysisPage.js      [Update - direct API calls]
│   │   └── SettingsPage.js          [NEW - API key config]
│   ├── services/
│   │   ├── threatIntelService.js    [NEW - direct API calls]
│   │   ├── emailAnalyzer.js         [NEW - email analysis]
│   │   └── fileAnalyzer.js          [NEW - file hashing]
│   ├── utils/
│   │   ├── iocDetector.js           [NEW - IOC extraction]
│   │   ├── apiKeyManager.js         [NEW - key storage]
│   │   └── corsProxy.js             [NEW - CORS handling]
│   └── App.js                       [Update - remove backend URL]
```

---

## 🔧 Technical Requirements

### Dependencies to Add
```json
{
  "axios": "^1.6.0",           // HTTP requests
  "crypto-js": "^4.2.0",       // Hash generation for files
  "dns-lookup": "^2.0.0",      // DNS queries (browser-compatible)
  "email-validator": "^2.0.0", // Email validation
  "ipaddr.js": "^2.1.0",       // IP address parsing
  "tldts": "^6.0.0",           // Domain parsing
  "whoiser": "^1.15.0"         // WHOIS lookups (if CORS-enabled)
}
```

### Remove Dependencies
```json
// No longer needed:
- All backend-related packages
- MongoDB packages
- Backend API communication packages
```

---

## 🔐 API Key Configuration

### Free Tier Limits
Document for users:
- **VirusTotal**: 500 requests/day (free)
- **AbuseIPDB**: 1,000 requests/day (free)
- **URLScan**: 1,000 scans/day (free)
- **OTX**: Unlimited (free)
- **GreyNoise**: 5,000 requests/month (free)

### User Settings Page
Create `/settings` page where users can:
1. Input their own API keys
2. Test API connections
3. View API usage limits
4. Enable/disable specific sources
5. Export/import settings

---

## ⚠️ Important Considerations

### 1. **API Key Security**
- **Risk:** API keys visible in browser network tab
- **Mitigation:** 
  - Warn users not to share their keys
  - Use localStorage with basic encryption
  - Recommend users create separate keys for this app
  - Add rate limiting on client side

### 2. **CORS Restrictions**
Some APIs may not allow direct browser calls:
- **Solution:** Provide CORS proxy option
- **Alternative:** Show manual lookup links

### 3. **Performance**
- Backend aggregated multiple API calls
- Frontend will make sequential calls (slower)
- **Solution:** Use Promise.all() for parallel calls
- Add loading indicators

### 4. **No History/Database**
- Can't store lookup history on server
- **Solution:** Store in browser localStorage
- **Alternative:** Export results to JSON file

### 5. **Rate Limiting**
- Backend could manage rate limits across users
- Frontend: Each user manages their own limits
- **Solution:** Client-side rate limiting and queuing

---

## 📝 Implementation Plan

### Phase 1: Core Migration (Week 1)
1. Create IOC detector utility
2. Create threat intel service with direct API calls
3. Update LookupPage to use new services
4. Test with VirusTotal and AbuseIPDB only

### Phase 2: Additional Services (Week 1)
5. Add remaining threat intel sources
6. Create email analyzer service
7. Create file analyzer service
8. Update respective pages

### Phase 3: User Experience (Week 1)
9. Create API key settings page
10. Add loading states and error handling
11. Implement client-side caching
12. Add export functionality

### Phase 4: Polish & Deploy (Week 1)
13. Handle CORS issues
14. Add comprehensive error messages
15. Create user documentation
16. Deploy to Vercel (frontend only)

**Total Time:** ~1 week for full conversion

---

## 🚀 Deployment (Frontend Only)

### Simple Vercel Deployment
```bash
# 1. Go to vercel.com/new
# 2. Import GitHub repo
# 3. Root: frontend
# 4. Deploy!
```

**No backend, no environment variables needed!**
Users input their own API keys in the app.

---

## ✅ Advantages of Frontend-Only

1. **Simpler Deployment**
   - Single deployment (frontend only)
   - No backend maintenance
   - No server costs

2. **Better Privacy**
   - API calls direct from user's browser
   - No data passes through your server
   - Users control their own API keys

3. **Easier to Maintain**
   - One codebase (React only)
   - No backend bugs
   - Faster iteration

4. **Free Hosting**
   - Vercel/Netlify free tier is generous
   - No backend server costs
   - CDN included

5. **Scalability**
   - Unlimited users (no backend bottleneck)
   - Each user uses their own API keys
   - No server load

---

## ⚠️ Disadvantages to Consider

1. **API Keys in Browser**
   - Keys visible in network tab
   - Users must trust the app
   - Can't share keys across users

2. **CORS Limitations**
   - Some APIs may block browser calls
   - May need CORS proxy for some services

3. **No Centralized History**
   - Each user sees only their own history
   - Can't aggregate stats across users

4. **Performance**
   - Direct API calls may be slower
   - No backend caching
   - Multiple sequential requests

5. **Rate Limiting**
   - Each user limited by API quotas
   - Can't pool requests across users

---

## 🎯 Recommended Approach

**For public app:** Frontend-only is better
- Users get their own free API keys
- No backend costs
- Simple deployment
- Better privacy

**For internal/team app:** Backend might be better
- Shared API keys (cost effective)
- Centralized history
- Better rate limit management
- Faster (cached results)

---

## 📚 Documentation to Create

1. **User Guide:** How to get API keys for each service
2. **Setup Guide:** Step-by-step configuration
3. **FAQ:** Common issues and solutions
4. **API Limits:** Understanding free tier restrictions
5. **Privacy:** How we handle API keys

---

## 🎨 UI Changes Needed

### New Pages
1. **Settings/Configuration**
   - API key input forms
   - Test connection buttons
   - Enable/disable sources

2. **Help/Documentation**
   - Links to get API keys
   - Video tutorials
   - Troubleshooting guide

### Existing Page Updates
1. **Lookup Page**
   - Add "Configure API Keys" button if not set
   - Show which sources are enabled
   - Better error messages

2. **All Pages**
   - Loading indicators
   - Progress bars for multiple API calls
   - Retry buttons for failed calls

---

## 🔄 Migration Checklist

- [ ] Create IOC detector utility
- [ ] Create threat intel service (direct API calls)
- [ ] Create email analyzer service
- [ ] Create file analyzer service
- [ ] Create API key management system
- [ ] Create settings page
- [ ] Update all pages to use new services
- [ ] Handle CORS issues
- [ ] Add error handling
- [ ] Add loading states
- [ ] Implement caching
- [ ] Add export functionality
- [ ] Test all API integrations
- [ ] Create user documentation
- [ ] Deploy to Vercel
- [ ] Remove backend folder
- [ ] Update README

---

## 💡 Summary

**Current:** Full-stack app (React + FastAPI + MongoDB)
**Target:** Frontend-only app (React + Direct API calls)

**Benefits:**
- ✅ Simpler deployment (one platform)
- ✅ No backend costs
- ✅ Better privacy
- ✅ Easier maintenance

**Trade-offs:**
- ⚠️ API keys in browser
- ⚠️ No centralized history
- ⚠️ Potential CORS issues

**Estimated Time:** 1 week for complete conversion
**Deployment:** Vercel (free tier)
**Cost:** $0/month

---

**Ready to start the conversion?** Let me know and I'll begin implementing!
