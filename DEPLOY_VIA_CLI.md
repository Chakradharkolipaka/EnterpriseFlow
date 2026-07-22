# Deploy via Vercel CLI - Step by Step

You've already completed: ✅ `vercel link` for backend

## Step 1: Add Environment Variables to Backend

Run these commands **one by one** in the backend directory:

```bash
cd ~/Assesments/EnterpriseFlow/backend

# 1. Add NODE_ENV
vercel env add NODE_ENV production
# When prompted, enter: production

# 2. Add JWT_SECRET
vercel env add JWT_SECRET production
# When prompted, enter: your_super_secret_jwt_key_production_2026_minimum_32_characters

# 3. Add JWT_EXPIRES_IN
vercel env add JWT_EXPIRES_IN production
# When prompted, enter: 7d

# 4. Add MONGODB_URI
vercel env add MONGODB_URI production
# When prompted, enter your MongoDB Atlas connection string:
# mongodb+srv://assesments:Chakravarthi@cluster0.xxxxx.mongodb.net/erp_crm_prod?retryWrites=true&w=majority

# 5. Add CORS_ORIGIN
vercel env add CORS_ORIGIN production
# When prompted, enter: * (we'll update this later)
```

## Step 2: Deploy Backend

```bash
# Still in backend directory
vercel --prod

# This will:
# - Build your backend
# - Deploy to production
# - Give you a URL like: https://enterpriceflow-be-xxx.vercel.app
```

**IMPORTANT:** Copy and save the production URL!

## Step 3: Test Backend

```bash
# Replace with your actual URL
curl https://YOUR_BACKEND_URL.vercel.app/api/health

# Should return: {"success":true,"message":"API is running",...}
```

---

## Step 4: Link and Deploy Frontend

```bash
cd ~/Assesments/EnterpriseFlow/frontend

# Link frontend project
vercel link
# Choose: Create a new project
# Name: enterpriceflow_fe
# No customization needed

# Add environment variable
vercel env add VITE_API_URL production
# When prompted, enter: https://YOUR_BACKEND_URL.vercel.app/api
# (Use your actual backend URL from Step 2 + /api at the end)

# Deploy frontend
vercel --prod

# Copy and save the frontend URL!
```

## Step 5: Update CORS on Backend

```bash
cd ~/Assesments/EnterpriseFlow/backend

# Remove old CORS_ORIGIN
vercel env rm CORS_ORIGIN production

# Add new CORS_ORIGIN with frontend URL
vercel env add CORS_ORIGIN production
# When prompted, enter: https://YOUR_FRONTEND_URL.vercel.app
# (Use your actual frontend URL from Step 4, NO trailing slash)

# Redeploy backend with new CORS
vercel --prod
```

## Step 6: Seed Production Database

```bash
cd ~/Assesments/EnterpriseFlow/backend

# Edit .env to use production MongoDB URI
nano .env
# Change MONGODB_URI to your Atlas connection string
# Save and exit (Ctrl+X, Y, Enter)

# Run seed
npm run seed

# Should see:
# ✓ Created 4 role users
# ✓ Created sample customers
# ✓ Created sample products
```

## Step 7: Test Your Application! 🎉

1. Open your frontend URL in browser
2. Login with: `admin@enterpriseflow.com` / `admin123`
3. Verify dashboard loads
4. Test all 4 roles

---

## Quick Commands Reference

```bash
# View deployment logs
vercel logs

# List projects
vercel projects ls

# View environment variables
vercel env ls

# Pull environment variables locally
vercel env pull

# Redeploy
vercel --prod

# View deployment info
vercel inspect
```

---

## Troubleshooting

### Problem: "No token found"
```bash
vercel login
```

### Problem: Environment variable not working
```bash
# Check if it was added
vercel env ls

# If not there, add it again
vercel env add VARIABLE_NAME production
```

### Problem: Build fails
```bash
# Check logs
vercel logs

# Try deploying with debug mode
vercel --prod --debug
```

### Problem: Need to change environment variable
```bash
# Remove old one
vercel env rm VARIABLE_NAME production

# Add new one
vercel env add VARIABLE_NAME production
```

---

## Summary Checklist

### Backend
- [x] `vercel link` completed
- [ ] Environment variables added (5 variables)
- [ ] `vercel --prod` completed
- [ ] Backend URL saved
- [ ] Health endpoint tested

### Frontend
- [ ] `vercel link` completed
- [ ] VITE_API_URL added
- [ ] `vercel --prod` completed
- [ ] Frontend URL saved

### Post-Deployment
- [ ] Backend CORS updated with frontend URL
- [ ] Backend redeployed
- [ ] Production database seeded
- [ ] Login tested for all 4 roles

---

## Your Deployment URLs

**Backend:** `https://enterpriceflow-be-xxx.vercel.app` ← Update this!  
**Frontend:** `https://enterpriceflow-fe-xxx.vercel.app` ← Update this!

---

**You're on the right track! Continue with Step 1 above. 🚀**
