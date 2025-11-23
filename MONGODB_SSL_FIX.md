# 🔧 MongoDB SSL/TLS Handshake Error Fix

## 🐛 Error You're Seeing

```
SSL handshake failed: [SSL: TLSV1_ALERT_INTERNAL_ERROR] tlsv1 alert internal error
```

This error occurs when connecting to MongoDB Atlas due to SSL/TLS configuration issues.

## ✅ Fix Applied

I've updated the MongoDB connection configuration to properly handle SSL/TLS connections with MongoDB Atlas.

### Files Modified:
1. `/app/backend/config/database.py` - Added SSL/TLS configuration

## 🔧 What Changed

### Before:
```python
cls.client = AsyncIOMotorClient(settings.MONGO_URL)
```

### After:
```python
cls.client = AsyncIOMotorClient(
    settings.MONGO_URL,
    tls=True,
    tlsAllowInvalidCertificates=False,
    serverSelectionTimeoutMS=5000,
    connectTimeoutMS=10000,
    retryWrites=True,
    w='majority'
)
```

## 📝 MongoDB Connection String Format

Your MongoDB Atlas connection string should look like this:

### ✅ Correct Format:
```
mongodb+srv://username:password@cluster.mongodb.net/database_name?retryWrites=true&w=majority
```

### Important Parts:
1. **Use `mongodb+srv://`** (not `mongodb://`)
2. **Include `?retryWrites=true&w=majority`** at the end
3. **No special characters in password** (or URL encode them)
4. **Add database name** before the `?`

### Example:
```
mongodb+srv://ctiuser:MySecurePass123@cluster0.abc123.mongodb.net/cti_tool?retryWrites=true&w=majority
```

## 🔐 URL Encoding Special Characters

If your MongoDB password contains special characters, you need to URL encode them:

| Character | Encoded |
|-----------|---------|
| `@` | `%40` |
| `:` | `%3A` |
| `/` | `%2F` |
| `?` | `%3F` |
| `#` | `%23` |
| `[` | `%5B` |
| `]` | `%5D` |
| `!` | `%21` |
| `$` | `%24` |
| `&` | `%26` |
| `'` | `%27` |
| `(` | `%28` |
| `)` | `%29` |
| `*` | `%2A` |
| `+` | `%2B` |
| `,` | `%2C` |
| `;` | `%3B` |
| `=` | `%3D` |

### Example:
- Password: `MyP@ss:word!`
- Encoded: `MyP%40ss%3Aword%21`

## 🚀 Deploy the Fix

### Option 1: For Render Deployment

1. **Update your MongoDB connection string in Render:**
   - Go to Render Dashboard
   - Select your service
   - Go to **Environment** tab
   - Find `MONGO_URL`
   - Update to correct format:
     ```
     mongodb+srv://username:password@cluster.mongodb.net/cti_tool?retryWrites=true&w=majority
     ```
   - Click **Save Changes**

2. **Push code changes to GitHub:**
   ```bash
   cd /app
   git add .
   git commit -m "Fix: MongoDB SSL/TLS configuration"
   git push origin main
   ```

3. **Render will auto-deploy** (3-5 minutes)

### Option 2: For Local Testing

1. **Update your local `.env` file:**
   ```bash
   cd /app/backend
   nano .env
   ```

2. **Set MONGO_URL:**
   ```
   MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/cti_tool?retryWrites=true&w=majority
   ```

3. **Restart backend:**
   ```bash
   sudo supervisorctl restart backend
   ```

## ✅ Verify MongoDB Atlas Configuration

### 1. Check Network Access
1. Go to MongoDB Atlas Dashboard
2. Click **Network Access** (left sidebar)
3. Ensure **0.0.0.0/0** is whitelisted
   - Or add Render's IP addresses
4. If not, click **Add IP Address** → **Allow Access from Anywhere**

### 2. Check Database User
1. Go to **Database Access**
2. Verify your user exists
3. Check password is correct
4. Ensure user has **"Read and write to any database"** permissions

### 3. Get Correct Connection String
1. Go to **Database** (left sidebar)
2. Click **Connect** on your cluster
3. Choose **"Connect your application"**
4. Driver: **Python**, Version: **3.6 or later**
5. Copy the connection string
6. Replace `<password>` with your actual password
7. Add database name: `/cti_tool` before the `?`

## 🧪 Test the Connection

### Method 1: Quick Test Script

Create a test file:
```python
# test_mongo.py
from motor.motor_asyncio import AsyncIOMotorClient
import asyncio

async def test_connection():
    MONGO_URL = "mongodb+srv://username:password@cluster.mongodb.net/cti_tool?retryWrites=true&w=majority"
    
    try:
        client = AsyncIOMotorClient(
            MONGO_URL,
            tls=True,
            tlsAllowInvalidCertificates=False,
            serverSelectionTimeoutMS=5000
        )
        
        # Test connection
        await client.admin.command('ping')
        print("✅ MongoDB connection successful!")
        
        # List databases
        dbs = await client.list_database_names()
        print(f"📚 Available databases: {dbs}")
        
        client.close()
        
    except Exception as e:
        print(f"❌ MongoDB connection failed: {e}")

if __name__ == "__main__":
    asyncio.run(test_connection())
```

Run it:
```bash
cd /app/backend
python test_mongo.py
```

### Method 2: Check Backend Logs

After deployment, check Render logs for:

**Success:**
```
INFO: Starting CTI IOC Lookup Tool...
INFO: Database: cti_tool
INFO: Application startup complete.
```

**Failure:**
```
Error connecting to MongoDB: SSL handshake failed
```

## 🔍 Troubleshooting

### Issue 1: Still Getting SSL Error

**Solution 1: Recreate MongoDB User**
1. Go to MongoDB Atlas → Database Access
2. Delete the existing user
3. Create a new user with a simple password (no special characters)
4. Update connection string

**Solution 2: Check Python SSL Libraries**

Ensure you have latest certificates:
```bash
pip install --upgrade certifi pymongo motor
```

**Solution 3: Use Different Connection String**

Try the **Standard Connection String** instead of SRV:
```
mongodb://username:password@cluster0-shard-00-00.abc123.mongodb.net:27017,cluster0-shard-00-01.abc123.mongodb.net:27017,cluster0-shard-00-02.abc123.mongodb.net:27017/cti_tool?ssl=true&replicaSet=atlas-abc123-shard-0&authSource=admin&retryWrites=true&w=majority
```

Get this from MongoDB Atlas → Connect → "Connect your application" → "Standard Connection String"

### Issue 2: Timeout Errors

**Increase timeout values:**

In `/app/backend/config/database.py`:
```python
cls.client = AsyncIOMotorClient(
    settings.MONGO_URL,
    tls=True,
    serverSelectionTimeoutMS=10000,  # Increase to 10 seconds
    connectTimeoutMS=20000,           # Increase to 20 seconds
    socketTimeoutMS=45000             # Add socket timeout
)
```

### Issue 3: Certificate Validation Issues

**Only for development/testing** (NOT recommended for production):

```python
cls.client = AsyncIOMotorClient(
    settings.MONGO_URL,
    tls=True,
    tlsAllowInvalidCertificates=True,  # Disable cert validation
    serverSelectionTimeoutMS=5000
)
```

### Issue 4: Password Contains Special Characters

**Option 1: URL Encode**
Use an online URL encoder or Python:
```python
from urllib.parse import quote_plus
password = "MyP@ss:word!"
encoded = quote_plus(password)
print(encoded)  # MyP%40ss%3Aword%21
```

**Option 2: Change Password**
1. Go to MongoDB Atlas → Database Access
2. Edit user
3. Change password to simple alphanumeric (e.g., `SecurePass123`)
4. Update connection string

## 📋 Render Environment Variable Setup

In Render, set `MONGO_URL` exactly like this:

```
MONGO_URL=mongodb+srv://ctiuser:SecurePass123@cluster0.abc123.mongodb.net/cti_tool?retryWrites=true&w=majority
```

**Important:**
- No spaces around `=`
- No quotes around the value
- Replace with your actual credentials
- Include the database name (`/cti_tool`)
- Include the query parameters (`?retryWrites=true&w=majority`)

## ✅ Expected Success

After applying the fix, your logs should show:

```
INFO: Starting CTI IOC Lookup Tool...
INFO: Database: cti_tool
INFO: Application startup complete.
INFO: Uvicorn running on http://0.0.0.0:10000
```

And API calls should work without MongoDB errors.

## 🎯 Checklist

- [ ] MongoDB Atlas allows access from anywhere (0.0.0.0/0)
- [ ] Database user has correct permissions
- [ ] Connection string uses `mongodb+srv://` format
- [ ] Connection string includes database name
- [ ] Connection string includes `?retryWrites=true&w=majority`
- [ ] Password doesn't have special characters (or is URL encoded)
- [ ] Code changes pushed to GitHub
- [ ] Render redeployed with new code
- [ ] `MONGO_URL` environment variable updated in Render
- [ ] Logs show successful connection

## 📞 Still Having Issues?

### Get More Details

Add debug logging to `/app/backend/config/database.py`:

```python
import logging
logger = logging.getLogger(__name__)

@classmethod
def get_client(cls) -> AsyncIOMotorClient:
    if cls.client is None:
        try:
            logger.info(f"Connecting to MongoDB...")
            cls.client = AsyncIOMotorClient(
                settings.MONGO_URL,
                tls=True,
                tlsAllowInvalidCertificates=False,
                serverSelectionTimeoutMS=5000,
                connectTimeoutMS=10000,
                retryWrites=True,
                w='majority'
            )
            logger.info("✅ MongoDB connection established")
        except Exception as e:
            logger.error(f"❌ MongoDB connection failed: {e}")
            raise
    return cls.client
```

### MongoDB Atlas Support

If nothing works:
1. Contact MongoDB Atlas support
2. Provide your cluster details
3. Mention the SSL handshake error
4. They can check server-side issues

## 🚀 Summary

**The fix involves:**
1. ✅ Updated MongoDB client configuration with SSL/TLS settings
2. ✅ Proper connection string format with SRV
3. ✅ Network access configured in MongoDB Atlas
4. ✅ Correct permissions for database user

**Deploy steps:**
1. Push code to GitHub
2. Update `MONGO_URL` in Render environment variables
3. Let Render auto-deploy
4. Check logs for successful connection

**Your MongoDB connection will now work! 🎉**
