# Production Setup Guide

## 🛠️ Current Environment (Emergent Platform)

You're currently running on the Emergent platform with:
- Supervisor managing services
- Backend on port 8001
- Frontend on port 3000
- MongoDB running locally

### Transition to New Structure

The codebase has been refactored into a production-ready structure. Here's how to transition:

#### Option 1: Use New Structure (Recommended for New Deployments)

If deploying to Railway, Render, or other platforms:

1. Use `main.py` as the entry point:
   ```bash
   uvicorn main:app --host 0.0.0.0 --port 8001
   ```

2. All configurations in the deployment guide use the new structure

#### Option 2: Keep Current Supervisor Setup

The current supervisor configuration points to `server:app`. You have two choices:

**Choice A: Keep Using server.py (No Changes Needed)**
- Current setup continues to work
- `server.py` is maintained for backward compatibility
- No supervisor changes needed

**Choice B: Switch to main.py (Requires Supervisor Update)**

If you want to use the new modular structure with the current supervisor:

1. Update supervisor configuration:
   ```bash
   # Note: Supervisor config is marked as READONLY on Emergent
   # Contact support if you need to change it
   
   # New command would be:
   command=/root/.venv/bin/uvicorn main:app --host 0.0.0.0 --port 8001 --workers 1 --reload
   ```

2. Restart services:
   ```bash
   sudo supervisorctl restart backend
   ```

## 🎯 Recommended Approach

### For Current Emergent Environment:
**Keep using `server.py`** - It continues to work and requires no changes to supervisor.

### For External Deployment (Railway, Render, etc.):
**Use `main.py`** - The new structure with all deployment configs.

## 📦 File Structure Comparison

### Both Structures Are Maintained:

**Legacy (Working Now):**
- Entry: `backend/server.py`
- Structure: Monolithic
- Status: ✅ Active and maintained

**New (Production-Ready):**
- Entry: `backend/main.py`
- Structure: Modular (config/, models/, routes/, utils/)
- Status: ✅ Ready for deployment

## 🔄 Migration Path

When you're ready to fully migrate:

1. **Test New Structure Locally:**
   ```bash
   cd backend
   python main.py
   ```

2. **Verify All Endpoints:**
   ```bash
   curl http://localhost:8001/health
   curl http://localhost:8001/api/ioc/history
   ```

3. **Update Frontend (if needed):**
   - No changes required
   - Same backend URL
   - Same API endpoints

4. **Deploy to Production:**
   - Follow [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
   - Use the new structure for Railway/Render

## 💡 Benefits of Each Approach

### Using server.py (Current):
- ✅ No changes needed
- ✅ Works with current supervisor
- ✅ Proven and tested
- ⚠️ Single large file
- ⚠️ Harder to maintain as it grows

### Using main.py (New):
- ✅ Modular and organized
- ✅ Easy to add features
- ✅ Follows FastAPI best practices
- ✅ Ready for team collaboration
- ✅ Deployment configs included
- ⚠️ Requires supervisor update (on Emergent)

## 🧑‍💻 Developer Workflow

### Current Setup (Emergent):
```bash
# Check services
sudo supervisorctl status

# View logs
tail -f /var/log/supervisor/backend.out.log
tail -f /var/log/supervisor/frontend.out.log

# Restart services
sudo supervisorctl restart backend
sudo supervisorctl restart frontend
```

### Local Development (New Structure):
```bash
# Terminal 1: Backend
cd backend
python main.py

# Terminal 2: Frontend
cd frontend
yarn start

# Terminal 3: MongoDB (if local)
mongod --dbpath /data/db
```

## 📊 Current Status

✅ **Old structure (`server.py`)**: Working and active
✅ **New structure (`main.py`)**: Created and ready
✅ **Both structures**: Maintained and functional
✅ **Deployment configs**: All created
✅ **Documentation**: Complete

## ❓ FAQ

**Q: Do I need to change anything right now?**
A: No, everything continues to work as before.

**Q: When should I use the new structure?**
A: When deploying to external platforms (Railway, Render) or when you want better code organization.

**Q: Will the old structure be removed?**
A: It will be maintained for backward compatibility. You can migrate when ready.

**Q: Can I use both?**
A: Yes, but run only one at a time (they use the same port 8001).

**Q: What about my data?**
A: Database structure unchanged - both use the same MongoDB.

## 🛡️ Safety

- ✅ Original files preserved
- ✅ No breaking changes
- ✅ Can rollback anytime
- ✅ All features work in both structures

---

**You're all set! Choose the approach that works best for your workflow. 🚀**
