# 🚀 Deploy Now - Manual Step-by-Step Guide

**Current Status:** 
- ✅ Counter.js fix committed and pushed to GitHub
- ✅ Backend code ready
- ✅ Frontend code ready
- ⏳ Need to deploy and seed database

---

## Step 1: Deploy Backend to Vercel

Open your **WSL terminal** and run:

```bash
cd ~/Assesments/EnterpriseFlow/backend
vercel --prod
```

**Expected Output:**
```
Vercel CLI 56.5.0 (Node.js 24.18.0)
Inspect         https://vercel.com/chakradhar-kolipakas-projects/enterpriceflow_be/...
Production      https://enterpriceflow-xxxxx.vercel.app
▲ Aliased       https://enterpriseflowbe.vercel.app
✓ Ready in 16s
```

**Action:** Copy one of these URLs (preferably the Aliased one)

---

## Step 2: Test Backend Health

Replace `[BACKEND_URL]` with the URL you copied:

```bash
# Test health endpoint
curl https://[BACKEND_URL]/api/health
```

**Expected Response:**
```json
{
  "success": true,
  "message": "API is running",
  "timestamp": "2026-07-23T...",
  "env": {
    "nodeEnv": "production",
    "hasMongoUri": true,
    "hasJwtSecret": true
  }
}
```

**If you see "DEPLOYMENT_NOT_FOUND":**
- Use the deployment-specific URL instead (the one that starts with `https://enterpriceflow-xxxxx...`)
- The alias issue is cosmetic - your app will work fine!

---

## Step 3: Seed MongoDB Database

```bash
curl -X POST https://[BACKEND_URL]/api/admin/seed-database
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Database seeded successfully",
  "data": {
    "users": 4,
    "customers": 4,
    "products": 8
  }
}
```

**If you see an error:**
- Check the response message
- Most likely cause: Counter model already exists (harmless - data still seeded)
- Verify in MongoDB Atlas dashboard

---

## Step 4: Test Login

```bash
curl -X POST https://[BACKEND_URL]/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@enterpriseflow.com","password":"admin123"}'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "...",
      "name": "Admin User",
      "email": "admin@enterpriseflow.com",
      "role": "admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

✅ **If you got a token, your backend is working perfectly!**

---

## Step 5: Verify in MongoDB Atlas

1. Open: https://cloud.mongodb.com
2. Login to your account
3. Navigate to your cluster: **myAtlasClusterEDU**
4. Click **"Browse Collections"**
5. Select database: **erp_crm_prod**
6. Verify collections:
   - `users` → 4 documents
   - `customers` → 4 documents  
   - `products` → 8 documents
   - `counters` → 1 document

---

## Step 6: Deploy Frontend

```bash
cd ~/Assesments/EnterpriseFlow/frontend
vercel --prod
```

**Expected Output:**
```
Production      https://enterpriseflow-xxxxx.vercel.app
```

**Action:** Copy the frontend URL

---

## Step 7: Add Environment Variable to Frontend

**IMPORTANT:** Frontend needs to know where the backend is!

### Option A: Via Vercel CLI (Easiest)
```bash
# While in frontend directory
vercel env add VITE_API_URL production

# When prompted, enter:
https://[BACKEND_URL]/api

# Note: Add /api at the end!
```

### Option B: Via Vercel Dashboard
1. Go to: https://vercel.com/dashboard
2. Click on your **frontend project** (enterpriseflow or similar)
3. Click **Settings** → **Environment Variables**
4. Click **Add New**
5. Enter:
   - **Key:** `VITE_API_URL`
   - **Value:** `https://[BACKEND_URL]/api` (include /api!)
   - **Environment:** Check all three: Production, Preview, Development
6. Click **Save**

---

## Step 8: Redeploy Frontend

After adding the environment variable:

```bash
cd ~/Assesments/EnterpriseFlow/frontend
vercel --prod
```

This redeploys with the new environment variable.

---

## Step 9: Test Your Application! 🎉

1. Open your frontend URL in browser: `https://[FRONTEND_URL]`
2. You should see the login page
3. Login with: **admin@enterpriseflow.com** / **admin123**
4. After login, you should see the dashboard
5. Test navigation: Customers, Products, Challans

---

## Step 10: Update CORS (Security)

**Current:** Backend allows requests from anywhere (`CORS_ORIGIN=*`)  
**Should be:** Backend only allows requests from your frontend

### Update Backend CORS:

1. Go to: https://vercel.com/dashboard
2. Click on your **backend project**
3. Click **Settings** → **Environment Variables**
4. Find: `CORS_ORIGIN`
5. Click **Edit**
6. Change value from `*` to: `https://[FRONTEND_URL]`
7. Click **Save**

### Redeploy Backend:
```bash
cd ~/Assesments/EnterpriseFlow/backend
vercel --prod
```

---

## Quick Command Reference

```bash
# Backend
cd ~/Assesments/EnterpriseFlow/backend
vercel --prod

# Test
BACKEND_URL="https://your-backend-url"
curl $BACKEND_URL/api/health
curl -X POST $BACKEND_URL/api/admin/seed-database
curl -X POST $BACKEND_URL/api/auth/login -H "Content-Type: application/json" -d '{"email":"admin@enterpriseflow.com","password":"admin123"}'

# Frontend
cd ~/Assesments/EnterpriseFlow/frontend
vercel env add VITE_API_URL production
# Enter: https://your-backend-url/api
vercel --prod
```

---

## Troubleshooting

### "DEPLOYMENT_NOT_FOUND" on alias URL
**Solution:** Use the deployment-specific URL (https://enterpriceflow-xxxxx.vercel.app)

### "Protected deployment" error
**Solution:** 
1. Go to project Settings → Deployment Protection
2. Turn OFF
3. Redeploy

### Frontend shows blank page or errors
**Solution:**
1. Check browser console (F12)
2. Verify VITE_API_URL is set correctly
3. Check CORS is allowing your frontend URL

### "Cannot read property..." errors
**Solution:**
1. Verify backend is responding to health check
2. Check frontend can reach backend (CORS)
3. Verify environment variable has `/api` at the end

---

## Test Credentials

After seeding, these users are available:

| Role      | Email                            | Password      |
|-----------|----------------------------------|---------------|
| Admin     | admin@enterpriseflow.com         | admin123      |
| Sales     | sales@enterpriseflow.com         | sales123      |
| Warehouse | warehouse@enterpriseflow.com     | warehouse123  |
| Accounts  | accounts@enterpriseflow.com      | accounts123   |

---

## Next: Start Using the App!

Your EnterpriseFlow application is now live and ready to use! 

**Features Available:**
- ✅ User authentication & authorization
- ✅ Customer CRM (create, view, edit customers)
- ✅ Product management (create, view, edit, adjust stock)
- ✅ Sales challans (create orders, track inventory)
- ✅ Role-based access control
- ✅ Dashboard with real-time statistics

**Explore the app:**
1. Dashboard - View stats
2. Customers - Manage customer database
3. Products - Manage inventory
4. Challans - Create sales orders

---

**Ready to deploy? Start with Step 1!** 🚀
