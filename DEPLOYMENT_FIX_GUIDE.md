# 🔧 Deployment Fix Guide - Resolving "DEPLOYMENT_NOT_FOUND" Issue

## Problem Summary
The backend deploys successfully to Vercel, but the production alias `https://enterpriseflowbe.vercel.app` returns:
```
The deployment could not be found on Vercel.
DEPLOYMENT_NOT_FOUND
```

However, the deployment-specific URLs (like `https://enterpriceflow-xxx.vercel.app`) work correctly.

## Root Cause
This happens when:
1. The Vercel project alias configuration is not synced
2. The production domain is not properly assigned
3. There's a typo in project name causing alias mismatch

## Solution Steps

### Step 1: Commit and Push Current Changes
```bash
cd ~/Assesments/EnterpriseFlow
git add backend/src/models/Counter.js
git commit -m "fix: Counter model - prevent overwrite error using mongoose.models check"
git push origin main
```

### Step 2: Verify Vercel Project Configuration
```bash
cd ~/Assesments/EnterpriseFlow/backend

# Check the project is linked correctly
cat .vercel/project.json

# Expected output should show:
# {"orgId":"...","projectId":"..."}
```

### Step 3: Deploy with Explicit Production Flag
```bash
cd ~/Assesments/EnterpriseFlow/backend

# Deploy to production
vercel --prod

# Note the URLs shown:
# - Inspect URL
# - Production URL (deployment-specific)
# - Aliased URL (should be https://enterpriseflowbe.vercel.app)
```

### Step 4: Test the Deployment URLs

**Option A: Test the deployment-specific URL first**
```bash
# Use the latest deployment URL from the vercel output
# It will look like: https://enterpriceflow-xxx-chakradhar-kolipakas-projects.vercel.app

# Test health
curl https://[DEPLOYMENT-URL]/api/health

# If this works, test seed
curl -X POST https://[DEPLOYMENT-URL]/api/admin/seed-database

# Test login
curl -X POST https://[DEPLOYMENT-URL]/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@enterpriseflow.com","password":"admin123"}'
```

**Option B: If alias still doesn't work, manually set the domain**

Go to Vercel Dashboard:
1. Open https://vercel.com/dashboard
2. Navigate to your backend project (enterpriceflow_be or similar)
3. Go to Settings → Domains
4. Verify `enterpriseflowbe.vercel.app` is listed
5. If not, add it:
   - Click "Add"
   - Enter `enterpriseflowbe.vercel.app`
   - Click "Add"

### Step 5: Alternative - Use the Working Deployment URL

Since deployment-specific URLs work, you can:

1. **Get the latest production URL:**
```bash
cd ~/Assesments/EnterpriseFlow/backend
vercel ls --prod | head -5
```

2. **Use this URL for your frontend:**
   - Copy the production deployment URL
   - Add to Vercel frontend environment variables:
     - Key: `VITE_API_URL`
     - Value: `https://[your-deployment-url]/api`

3. **Update CORS in backend:**
   - The backend CORS_ORIGIN is already set to `*` (allows all)
   - After frontend deploys, update to specific frontend URL for security

## Step 6: Seed the Database

Once you have a working URL (either alias or deployment-specific):

```bash
# Replace [URL] with your working backend URL
curl -X POST https://[URL]/api/admin/seed-database

# Expected response:
# {
#   "success": true,
#   "message": "Database seeded successfully",
#   "data": {
#     "users": 4,
#     "customers": 4,
#     "products": 8
#   }
# }
```

## Step 7: Test Login

```bash
curl -X POST https://[URL]/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@enterpriseflow.com","password":"admin123"}'

# Expected response with JWT token:
# {
#   "success": true,
#   "message": "Login successful",
#   "data": {
#     "user": {...},
#     "token": "eyJ..."
#   }
# }
```

## Step 8: Verify in MongoDB Atlas

1. Go to https://cloud.mongodb.com
2. Navigate to your cluster (myAtlasClusterEDU)
3. Click "Browse Collections"
4. Select database: `erp_crm_prod`
5. Check collections:
   - `users` - should have 4 documents
   - `customers` - should have 4 documents
   - `products` - should have 8 documents
   - `counters` - should have 1 document

## Step 9: Deploy Frontend

Once backend is working:

```bash
cd ~/Assesments/EnterpriseFlow/frontend

# Deploy to Vercel
vercel --prod

# Note the frontend URL
```

## Step 10: Add Frontend Environment Variable

In Vercel dashboard for frontend project:
1. Go to Settings → Environment Variables
2. Add:
   - **Key:** `VITE_API_URL`
   - **Value:** `https://[working-backend-url]/api`
   - **Environment:** Production, Preview, Development (select all)
3. Click "Save"
4. Redeploy frontend: `vercel --prod`

## Step 11: Update Backend CORS (Security)

Once frontend is deployed, update backend CORS:

1. In Vercel backend project Settings → Environment Variables
2. Update `CORS_ORIGIN`:
   - **Old Value:** `*`
   - **New Value:** `https://[your-frontend-url]`
3. Redeploy backend: `vercel --prod`

## Quick Command Sequence

```bash
# 1. Commit Counter.js fix
cd ~/Assesments/EnterpriseFlow
git add backend/src/models/Counter.js
git commit -m "fix: Counter model mongoose overwrite prevention"
git push origin main

# 2. Deploy backend
cd backend
vercel --prod
# Copy the deployment URL from output

# 3. Seed database (use deployment URL)
BACKEND_URL="https://[your-deployment-url]"
curl -X POST $BACKEND_URL/api/admin/seed-database

# 4. Test login
curl -X POST $BACKEND_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@enterpriseflow.com","password":"admin123"}'

# 5. Deploy frontend
cd ../frontend
vercel --prod

# 6. Add VITE_API_URL to frontend in Vercel dashboard
# 7. Redeploy frontend
vercel --prod

# 8. Update backend CORS_ORIGIN in Vercel dashboard
# 9. Redeploy backend
cd ../backend
vercel --prod
```

## Troubleshooting

### Issue: "Protected deployment" Error
**Solution:** Deployment protection is enabled. Disable it:
1. Go to Vercel project → Settings → Deployment Protection
2. Toggle OFF
3. Redeploy

### Issue: "FUNCTION_INVOCATION_FAILED"
**Solution:** Check logs:
```bash
vercel logs [deployment-url] --follow
```
Common causes:
- Missing environment variables
- MongoDB connection timeout
- Model overwrite errors (fixed by Counter.js update)

### Issue: MongoDB Connection Timeout
**Solution:**
1. Verify MongoDB Atlas IP whitelist includes `0.0.0.0/0` (allow all)
2. Check connection string is correct in Vercel env vars
3. Ensure database user has read/write permissions

### Issue: Alias Not Working but Deployment URL Works
**Solution:** Use the deployment URL directly. The alias issue is cosmetic - your app will work fine with the deployment-specific URL.

## Current Status

✅ Backend code is ready (Counter.js fixed)
✅ Frontend is 100% complete
✅ Environment variables documented
⏳ Need to commit, deploy, and seed database
⏳ Need to deploy and configure frontend

## Test Credentials

After seeding, these users will be available:
- **Admin:** admin@enterpriseflow.com / admin123
- **Sales:** sales@enterpriseflow.com / sales123
- **Warehouse:** warehouse@enterpriseflow.com / warehouse123
- **Accounts:** accounts@enterpriseflow.com / accounts123

---

**Next Step:** Follow the Quick Command Sequence above to complete the deployment.
