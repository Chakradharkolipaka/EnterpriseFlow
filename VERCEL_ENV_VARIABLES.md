# Vercel Environment Variables - Complete Guide

## 🔧 Step-by-Step Configuration

---

## A. Backend Environment Variables (Vercel)

### When: After deploying backend to Vercel
### Where: Vercel Dashboard → Your Backend Project → Settings → Environment Variables

Add these **5 required variables:**

### 1. MONGODB_URI
```
Key: MONGODB_URI
Value: mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/erp_crm_prod?retryWrites=true&w=majority
```
**How to get:**
1. Go to MongoDB Atlas (https://cloud.mongodb.com)
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your actual password
6. Replace `myFirstDatabase` with `erp_crm_prod`

**Example:**
```
mongodb+srv://admin:MySecurePass123@cluster0.abc123.mongodb.net/erp_crm_prod?retryWrites=true&w=majority
```

### 2. JWT_SECRET
```
Key: JWT_SECRET
Value: <generate-a-secure-random-string>
```
**How to generate:**
```bash
# Option 1: Use Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Option 2: Use OpenSSL
openssl rand -hex 64

# Option 3: Manual (less secure)
# Use a random string like: 8f7d2b9c4e6a1f3d5g8h2j4k6m8n0p2q4r6s8t0u2v4w6x8y0z
```

**Example:**
```
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4
```

### 3. JWT_EXPIRES_IN
```
Key: JWT_EXPIRES_IN
Value: 7d
```
**Note:** This means tokens expire after 7 days. You can change to:
- `1d` = 1 day
- `12h` = 12 hours
- `30d` = 30 days

### 4. CORS_ORIGIN
```
Key: CORS_ORIGIN
Value: <your-frontend-vercel-url>
```
**⚠️ IMPORTANT:** You'll update this AFTER deploying frontend

**First deployment (temporary):**
```
https://your-backend-project.vercel.app
```

**After frontend deployed (update to):**
```
https://your-frontend-project.vercel.app
```

**Example:**
```
https://enterpriseflow-frontend.vercel.app
```

### 5. NODE_ENV
```
Key: NODE_ENV
Value: production
```
**Note:** This must be exactly "production" (lowercase)

---

## Backend Environment Variables Summary

Copy these to Vercel Backend Project Settings:

```
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/erp_crm_prod?retryWrites=true&w=majority
JWT_SECRET=<your-generated-secret-64-chars-or-more>
JWT_EXPIRES_IN=7d
CORS_ORIGIN=https://your-frontend-project.vercel.app
NODE_ENV=production
```

---

## B. Frontend Environment Variables (Vercel)

### When: After deploying backend to Vercel
### Where: Vercel Dashboard → Your Frontend Project → Settings → Environment Variables

Add this **1 required variable:**

### 1. VITE_API_URL
```
Key: VITE_API_URL
Value: <your-backend-vercel-url>/api
```

**How to get:**
1. Deploy backend first
2. Copy the backend Vercel URL (e.g., `https://your-backend.vercel.app`)
3. Add `/api` at the end

**Example:**
```
https://enterpriseflow-backend.vercel.app/api
```

**⚠️ IMPORTANT:**
- Must start with `https://`
- Must end with `/api`
- Do NOT add trailing slash after `/api`

---

## Frontend Environment Variables Summary

Copy this to Vercel Frontend Project Settings:

```
VITE_API_URL=https://your-backend-project.vercel.app/api
```

---

## 📋 Complete Deployment Checklist

### Phase 1: MongoDB Atlas Setup
- [ ] Create free M0 cluster
- [ ] Create database user with password
- [ ] Whitelist all IPs (0.0.0.0/0) for Vercel
- [ ] Get connection string
- [ ] Test connection locally

### Phase 2: Backend Deployment
- [ ] Deploy backend to Vercel (first time, no env vars yet)
- [ ] Note the backend URL (e.g., `https://your-backend.vercel.app`)
- [ ] Go to Settings → Environment Variables
- [ ] Add all 5 backend variables:
  - [ ] MONGODB_URI
  - [ ] JWT_SECRET  
  - [ ] JWT_EXPIRES_IN
  - [ ] CORS_ORIGIN (temporary: use backend URL)
  - [ ] NODE_ENV
- [ ] Redeploy backend (Deployments → Latest → Click ⋯ → Redeploy)

### Phase 3: Frontend Deployment
- [ ] Deploy frontend to Vercel (first time, no env vars yet)
- [ ] Note the frontend URL (e.g., `https://your-frontend.vercel.app`)
- [ ] Go to Settings → Environment Variables
- [ ] Add VITE_API_URL with backend URL + /api
- [ ] Redeploy frontend

### Phase 4: Update CORS
- [ ] Go back to backend Vercel project
- [ ] Settings → Environment Variables
- [ ] Edit CORS_ORIGIN variable
- [ ] Change value to your frontend URL
- [ ] Redeploy backend

### Phase 5: Seed Production Database
```bash
# On your local machine
cd backend

# Create production .env temporarily
MONGODB_URI="<your-atlas-connection-string>" npm run seed

# Or update backend/.env and run:
npm run seed
```

### Phase 6: Test Live Deployment
- [ ] Open frontend URL in browser
- [ ] Login with: admin@enterpriseflow.com / admin123
- [ ] Check if dashboard loads
- [ ] Try creating a customer
- [ ] Try creating a product
- [ ] Try creating a challan
- [ ] Test all 4 roles

---

## 🎯 Quick Copy-Paste Templates

### For Backend (.env locally)
```env
# Backend Local Development
MONGODB_URI=mongodb://localhost:27017/erp_crm_dev
JWT_SECRET=dev-secret-key-not-for-production
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
PORT=5000
```

### For Backend (Vercel Production)
```env
# Copy to Vercel Backend → Settings → Environment Variables
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/erp_crm_prod?retryWrites=true&w=majority
JWT_SECRET=<paste-your-generated-secret-here>
JWT_EXPIRES_IN=7d
CORS_ORIGIN=https://your-frontend-project.vercel.app
NODE_ENV=production
```

### For Frontend (.env locally)
```env
# Frontend Local Development
VITE_API_URL=http://localhost:5000/api
```

### For Frontend (Vercel Production)
```env
# Copy to Vercel Frontend → Settings → Environment Variables
VITE_API_URL=https://your-backend-project.vercel.app/api
```

---

## ⚠️ Common Mistakes to Avoid

### Backend
❌ **Wrong:** `MONGODB_URI=mongodb://localhost:27017/...` (local, won't work on Vercel)  
✅ **Right:** `MONGODB_URI=mongodb+srv://...` (Atlas cloud)

❌ **Wrong:** `JWT_SECRET=secret` (too simple)  
✅ **Right:** `JWT_SECRET=a1b2c3d4e5f6g7h8...` (64+ random chars)

❌ **Wrong:** `CORS_ORIGIN=http://localhost:5173` (local)  
✅ **Right:** `CORS_ORIGIN=https://your-frontend.vercel.app` (production URL)

❌ **Wrong:** `NODE_ENV=dev` or `NODE_ENV=Development`  
✅ **Right:** `NODE_ENV=production` (exact lowercase)

### Frontend
❌ **Wrong:** `VITE_API_URL=http://localhost:5000/api` (local)  
✅ **Right:** `VITE_API_URL=https://your-backend.vercel.app/api` (production)

❌ **Wrong:** `VITE_API_URL=https://your-backend.vercel.app` (missing /api)  
✅ **Right:** `VITE_API_URL=https://your-backend.vercel.app/api` (with /api)

❌ **Wrong:** `VITE_API_URL=https://your-backend.vercel.app/api/` (trailing slash)  
✅ **Right:** `VITE_API_URL=https://your-backend.vercel.app/api` (no trailing slash)

---

## 🔍 How to Verify Environment Variables

### Backend Verification
```bash
# After deployment, check Vercel logs
# Go to: Vercel Dashboard → Backend Project → Deployments → Latest → Runtime Logs

# You should see:
# "MongoDB connected successfully"
# "Server is running on port 3000" (or Vercel's port)

# If you see connection errors, check MONGODB_URI
```

### Frontend Verification
```bash
# Open browser console (F12)
# Check Network tab for API calls

# Requests should go to:
# https://your-backend.vercel.app/api/...

# If they go to http://localhost:5000, VITE_API_URL is wrong
```

---

## 🐛 Troubleshooting

### Problem: "CORS Error" in browser console
**Solution:** 
1. Check backend CORS_ORIGIN matches frontend URL exactly
2. No trailing slash in CORS_ORIGIN
3. Must include `https://` protocol
4. Redeploy backend after changing

### Problem: "Network Error" or API calls fail
**Solution:**
1. Check frontend VITE_API_URL is correct
2. Must end with `/api`
3. Backend must be deployed and running
4. Check backend deployment logs for errors

### Problem: "MongoDB connection failed"
**Solution:**
1. Verify connection string format
2. Check username/password are correct
3. Ensure IP whitelist includes 0.0.0.0/0
4. Test connection string locally first

### Problem: "Invalid token" errors
**Solution:**
1. JWT_SECRET must be same value (don't regenerate)
2. If you change JWT_SECRET, all users need to login again
3. Check JWT_EXPIRES_IN format (e.g., "7d", "24h")

### Problem: Changes not reflecting after deploy
**Solution:**
1. Vercel caches environment variables
2. After changing env vars, you MUST redeploy
3. Go to Deployments → Latest → ⋯ → Redeploy

---

## 📱 Mobile Access Configuration

If you want to test on mobile device on same network:

### Backend (add to CORS_ORIGIN)
```
# Comma-separated list
CORS_ORIGIN=https://your-frontend.vercel.app,http://192.168.1.100:5173
```

### Frontend (no change needed)
```
# Use production backend
VITE_API_URL=https://your-backend.vercel.app/api
```

---

## 🔐 Security Best Practices

1. **Never commit .env files** - Already in .gitignore
2. **Use strong JWT_SECRET** - Minimum 64 random characters
3. **Rotate secrets periodically** - Every 3-6 months
4. **Different secrets per environment** - Dev ≠ Production
5. **Limit CORS to exact domain** - Don't use wildcards in production
6. **Use MongoDB user with limited permissions** - Not the admin user
7. **Enable MongoDB authentication** - Always require username/password
8. **Whitelist specific IPs if possible** - Instead of 0.0.0.0/0

---

## 📊 Environment Variables Reference Table

| Variable | Backend | Frontend | Required | Example |
|----------|---------|----------|----------|---------|
| MONGODB_URI | ✅ | ❌ | Yes | `mongodb+srv://...` |
| JWT_SECRET | ✅ | ❌ | Yes | `a1b2c3d4e5f6...` |
| JWT_EXPIRES_IN | ✅ | ❌ | Yes | `7d` |
| CORS_ORIGIN | ✅ | ❌ | Yes | `https://frontend.vercel.app` |
| NODE_ENV | ✅ | ❌ | Yes | `production` |
| VITE_API_URL | ❌ | ✅ | Yes | `https://backend.vercel.app/api` |

---

## 🎓 Understanding Each Variable

### MONGODB_URI (Backend)
- **Purpose:** Database connection string
- **Format:** `mongodb+srv://username:password@host/database?options`
- **Where to get:** MongoDB Atlas dashboard
- **Security:** Contains password, never share

### JWT_SECRET (Backend)
- **Purpose:** Signs and verifies JWT tokens
- **Format:** Long random string (64+ characters)
- **Where to get:** Generate using crypto tools
- **Security:** Keep absolutely secret, if leaked all tokens compromised

### JWT_EXPIRES_IN (Backend)
- **Purpose:** How long tokens remain valid
- **Format:** Time string (e.g., "7d", "24h", "60m")
- **Recommendation:** 7d for production, shorter for high-security apps
- **Note:** Users must re-login after this period

### CORS_ORIGIN (Backend)
- **Purpose:** Which domains can make API requests
- **Format:** Full URL with protocol (e.g., `https://example.com`)
- **Security:** Only allow your frontend domain
- **Multiple domains:** Separate with commas

### NODE_ENV (Backend)
- **Purpose:** Tells app it's in production mode
- **Format:** Must be exactly "production" (lowercase)
- **Effect:** Enables production optimizations, different error handling
- **Never:** Use "development" in production

### VITE_API_URL (Frontend)
- **Purpose:** Where frontend sends API requests
- **Format:** Backend URL + `/api` (e.g., `https://backend.com/api`)
- **Important:** Must match backend deployment URL
- **Note:** Vite requires `VITE_` prefix for client-side variables

---

## ✅ Final Verification Commands

### Check Backend Environment Variables (Vercel CLI)
```bash
# Install Vercel CLI if not installed
npm i -g vercel

# Login
vercel login

# List environment variables
cd backend
vercel env ls
```

### Check Frontend Environment Variables (Vercel CLI)
```bash
cd frontend
vercel env ls
```

### Test Production API Directly
```bash
# Test backend health
curl https://your-backend.vercel.app/api/health

# Test login
curl -X POST https://your-backend.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@enterpriseflow.com","password":"admin123"}'
```

---

## 📞 Need Help?

1. **Vercel Logs:** Dashboard → Project → Deployments → Latest → Runtime Logs
2. **MongoDB Logs:** Atlas Dashboard → Clusters → Monitoring
3. **Browser Console:** F12 → Console tab for frontend errors
4. **Network Tab:** F12 → Network tab to see API calls

---

**Last Updated:** July 22, 2026  
**Version:** 1.0  
**Deployment Platform:** Vercel + MongoDB Atlas
