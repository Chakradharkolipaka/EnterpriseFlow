# Environment Variables - Copy & Paste Format

## 🎯 Instructions

1. **Replace placeholders** with your actual values
2. **Copy entire sections** to Vercel dashboard
3. **Don't include** the `Key:` and `Value:` labels (just copy the actual values)

---

## 🔧 A. Backend Environment Variables (5 total)

### Go to: Vercel Dashboard → Backend Project → Settings → Environment Variables → Add

### Variable 1 of 5
```
Key:
MONGODB_URI

Value:
mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.xxxxx.mongodb.net/erp_crm_prod?retryWrites=true&w=majority
```

**📝 Replace:**
- `YOUR_USERNAME` → Your MongoDB Atlas username
- `YOUR_PASSWORD` → Your MongoDB Atlas password
- `YOUR_CLUSTER.xxxxx` → Your cluster address from Atlas

**✅ Example:**
```
mongodb+srv://admin:SecurePass123@cluster0.ab1cd.mongodb.net/erp_crm_prod?retryWrites=true&w=majority
```

---

### Variable 2 of 5
```
Key:
JWT_SECRET

Value:
PASTE_YOUR_GENERATED_SECRET_HERE
```

**🔐 Generate first:**
```bash
# Run this command in terminal:
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Copy the output and paste as value
```

**✅ Example output (yours will be different):**
```
a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8
```

---

### Variable 3 of 5
```
Key:
JWT_EXPIRES_IN

Value:
7d
```

**✅ No changes needed** - Just copy as-is

---

### Variable 4 of 5
```
Key:
CORS_ORIGIN

Value:
https://YOUR_FRONTEND_PROJECT.vercel.app
```

**📝 Replace:**
- `YOUR_FRONTEND_PROJECT` → Your actual frontend project name on Vercel

**⚠️ IMPORTANT:** 
- Add this AFTER deploying frontend
- First deployment: Use your backend URL temporarily
- After frontend deploys: Come back and update this

**✅ Example:**
```
https://enterpriseflow-frontend.vercel.app
```

---

### Variable 5 of 5
```
Key:
NODE_ENV

Value:
production
```

**✅ No changes needed** - Just copy exactly as-is (must be lowercase)

---

## 🎨 B. Frontend Environment Variables (1 total)

### Go to: Vercel Dashboard → Frontend Project → Settings → Environment Variables → Add

### Variable 1 of 1
```
Key:
VITE_API_URL

Value:
https://YOUR_BACKEND_PROJECT.vercel.app/api
```

**📝 Replace:**
- `YOUR_BACKEND_PROJECT` → Your actual backend project name on Vercel

**⚠️ IMPORTANT:**
- Add this AFTER deploying backend
- Must end with `/api`
- No trailing slash after `/api`

**✅ Example:**
```
https://enterpriseflow-backend.vercel.app/api
```

---

## 📋 Full Backend Copy (Template)

For quick copy-paste to a text file, then add to Vercel one by one:

```env
# Backend Environment Variables for Vercel
# ==========================================

# 1. Database Connection
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.xxxxx.mongodb.net/erp_crm_prod?retryWrites=true&w=majority

# 2. JWT Secret (generate first with crypto command)
JWT_SECRET=PASTE_YOUR_GENERATED_SECRET_HERE

# 3. JWT Token Expiry
JWT_EXPIRES_IN=7d

# 4. CORS Allowed Origin (update after frontend deployed)
CORS_ORIGIN=https://YOUR_FRONTEND_PROJECT.vercel.app

# 5. Node Environment
NODE_ENV=production
```

---

## 📋 Full Frontend Copy (Template)

```env
# Frontend Environment Variables for Vercel
# ==========================================

# 1. Backend API URL (add after backend deployed)
VITE_API_URL=https://YOUR_BACKEND_PROJECT.vercel.app/api
```

---

## 🔄 Deployment Flow with Variable Updates

### Step 1: MongoDB Atlas
```
1. Create cluster
2. Create database user
3. Get connection string
4. Copy for MONGODB_URI
```

### Step 2: Generate JWT Secret
```bash
# Run command:
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Copy output for JWT_SECRET
```

### Step 3: Deploy Backend (First Time)
```
1. Deploy backend to Vercel without env vars
2. Note backend URL: https://your-backend-xxx.vercel.app
3. Go to Settings → Environment Variables
4. Add all 5 backend variables:
   - MONGODB_URI (from Atlas)
   - JWT_SECRET (generated)
   - JWT_EXPIRES_IN (7d)
   - CORS_ORIGIN (use backend URL temporarily)
   - NODE_ENV (production)
5. Redeploy: Deployments → Latest → ⋯ → Redeploy
```

### Step 4: Deploy Frontend (First Time)
```
1. Deploy frontend to Vercel without env vars
2. Note frontend URL: https://your-frontend-xxx.vercel.app
3. Go to Settings → Environment Variables
4. Add VITE_API_URL = https://your-backend-xxx.vercel.app/api
5. Redeploy: Deployments → Latest → ⋯ → Redeploy
```

### Step 5: Update Backend CORS
```
1. Go back to backend project on Vercel
2. Settings → Environment Variables
3. Find CORS_ORIGIN variable
4. Click Edit (pencil icon)
5. Change to: https://your-frontend-xxx.vercel.app
6. Save
7. Redeploy: Deployments → Latest → ⋯ → Redeploy
```

### Step 6: Seed Production Database
```bash
# On your local machine
cd backend

# Temporarily set production MongoDB URI
MONGODB_URI="your-atlas-connection-string" npm run seed

# Or update backend/.env with Atlas URI and run:
npm run seed
```

---

## ✅ Verification Commands

### Test Backend Deployed
```bash
# Should return: {"status":"ok"} or similar
curl https://your-backend-project.vercel.app/api/health
```

### Test Backend Login
```bash
curl -X POST https://your-backend-project.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@enterpriseflow.com","password":"admin123"}'

# Should return JSON with token and user data
```

### Test Frontend
```
1. Open: https://your-frontend-project.vercel.app
2. Should see login page (not blank page)
3. Login: admin@enterpriseflow.com / admin123
4. Should redirect to dashboard
5. Dashboard should show numbers (not loading forever)
6. Open browser console (F12)
7. Network tab should show requests to your backend URL
8. No CORS errors in console
```

---

## 🐛 Quick Troubleshooting

### CORS Error
```
Problem: Browser console shows CORS error
Solution: 
1. Check CORS_ORIGIN in backend = frontend URL
2. Must include https://
3. No trailing slash
4. Redeploy backend after changing
```

### API Calls Fail
```
Problem: Network error or 404 on API calls
Solution:
1. Check VITE_API_URL in frontend settings
2. Must be: https://backend-url.vercel.app/api
3. Must end with /api
4. Redeploy frontend after changing
```

### MongoDB Connection Failed
```
Problem: Backend logs show MongoDB error
Solution:
1. Check MONGODB_URI is Atlas connection (mongodb+srv://)
2. Verify username/password are correct
3. Check IP whitelist: 0.0.0.0/0
4. Test connection locally first
```

### Changes Not Working
```
Problem: Changed env vars but no effect
Solution:
1. Environment variables are cached
2. You MUST redeploy after changing
3. Deployments → Latest → ⋯ → Redeploy
4. Wait for deployment to complete
5. Hard refresh browser (Ctrl+Shift+R)
```

---

## 📞 Where to Add Variables

### Backend
```
1. Go to: https://vercel.com/dashboard
2. Click: Your backend project
3. Click: Settings (top menu)
4. Click: Environment Variables (left sidebar)
5. Click: Add New (button)
6. Enter: Key name
7. Enter: Value
8. Select: Production (checkbox)
9. Click: Save
10. Repeat for all 5 variables
11. Go to: Deployments tab
12. Click: Latest deployment
13. Click: ⋯ (three dots)
14. Click: Redeploy
```

### Frontend
```
1. Go to: https://vercel.com/dashboard
2. Click: Your frontend project
3. Click: Settings (top menu)
4. Click: Environment Variables (left sidebar)
5. Click: Add New (button)
6. Enter: VITE_API_URL
7. Enter: Your backend URL + /api
8. Select: Production (checkbox)
9. Click: Save
10. Go to: Deployments tab
11. Click: Latest deployment
12. Click: ⋯ (three dots)
13. Click: Redeploy
```

---

## 🎓 Pro Tips

1. **Save variables in a secure note** - You'll need them for reference
2. **Don't commit .env files** - Already in .gitignore
3. **Different secrets per environment** - Use different JWT_SECRET for dev/prod
4. **Test locally first** - Verify MongoDB connection works locally before deploying
5. **One variable at a time** - Add and verify each variable to catch errors early
6. **Check deployment logs** - Vercel Dashboard → Deployments → Runtime Logs
7. **Use Vercel CLI** - Can add variables via command line if preferred

---

## 📊 Summary

**Total Variables to Add:**
- Backend: 5 variables
- Frontend: 1 variable
- **Total: 6 variables**

**Time Required:**
- MongoDB setup: 5 minutes
- Adding variables: 5 minutes
- Deployments: 5 minutes
- Testing: 5 minutes
- **Total: ~20 minutes**

**Dependencies:**
- MongoDB Atlas account (free)
- Vercel account (free)
- Backend code ready
- Frontend code ready

---

**Last Updated:** July 22, 2026  
**Version:** 1.0  
**Status:** Production Ready

For detailed explanations, see: **VERCEL_ENV_VARIABLES.md**  
For quick reference, see: **ENV_QUICK_REFERENCE.txt**  
For deployment guide, see: **DEPLOY_NOW.md**
