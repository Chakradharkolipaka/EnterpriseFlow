# 🚀 Quick Deploy Guide - EnterpriseFlow

## Step 1: MongoDB Atlas Setup (5 minutes)

```
1. Go to: https://cloud.mongodb.com/
2. Sign up / Login
3. Create FREE cluster (M0)
4. Network Access → Add IP → "Allow from Anywhere" (0.0.0.0/0)
5. Database Access → Add User:
   - Username: assesments
   - Password: Chakravarthi
6. Connect → Drivers → Copy connection string
7. Your connection string:
   mongodb+srv://assesments:Chakravarthi@cluster0.xxxxx.mongodb.net/erp_crm_prod?retryWrites=true&w=majority
```

**Save this connection string - you'll need it!**

---

## Step 2: Push to GitHub (2 minutes)

```bash
# In WSL terminal
cd ~/Assesments/EnterpriseFlow

# Check git status
git status

# Add all files
git add .

# Commit
git commit -m "Ready for deployment"

# Create repo on GitHub.com, then:
git remote add origin https://github.com/YOUR_USERNAME/EnterpriseFlow.git
git branch -M main
git push -u origin main
```

---

## Step 3: Deploy Backend (5 minutes)

### Via Vercel Dashboard:

1. **Go to:** https://vercel.com/new
2. **Import** your GitHub repo
3. **Configure:**
   - Root Directory: `backend`
   - Framework: Other
   - Build Command: `npm install`
   
4. **Environment Variables** (click "Add"):

```
NODE_ENV=production
MONGODB_URI=mongodb+srv://assesments:Chakravarthi@cluster0.xxxxx.mongodb.net/erp_crm_prod?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters_long_production_key_2026
JWT_EXPIRES_IN=7d
CORS_ORIGIN=*
```

5. **Click Deploy**
6. **Copy URL:** `https://enterpriseflow-backend-xxx.vercel.app`

### Test It:

```bash
curl https://YOUR_BACKEND_URL.vercel.app/api/health
```

Should return: `{"success":true,"message":"API is running"...}`

---

## Step 4: Seed Production Database (3 minutes)

### Option A: Locally (Recommended)

```bash
# Update backend/.env temporarily
cd ~/Assesments/EnterpriseFlow/backend

# Edit .env - change MONGODB_URI to your Atlas string
nano .env  # or use any editor

# Run seed
npm run seed

# You should see:
# ✓ Created 4 role users
# ✓ Created sample customers
# ✓ Created sample products
```

### Option B: Via Vercel (If Option A fails)

Skip for now - we'll use the deployed app's UI to create data.

---

## Step 5: Deploy Frontend (5 minutes)

### Via Vercel Dashboard:

1. **Go to:** https://vercel.com/new
2. **Import** your SAME GitHub repo (again)
3. **Configure:**
   - Root Directory: `frontend`
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   
4. **Environment Variables:**

```
VITE_API_URL=https://YOUR_BACKEND_URL.vercel.app/api
```

**Important:** Replace `YOUR_BACKEND_URL` with your actual backend URL from Step 3!

5. **Click Deploy**
6. **Copy URL:** `https://enterpriseflow-xxx.vercel.app`

---

## Step 6: Update CORS (2 minutes)

1. Go to Vercel dashboard → Your **backend** project
2. Settings → Environment Variables
3. Find `CORS_ORIGIN`
4. **Change from `*` to:** `https://YOUR_FRONTEND_URL.vercel.app`
5. Save
6. Deployments tab → Latest deployment → "..." → **Redeploy**

---

## Step 7: TEST! 🎉

1. **Open:** `https://YOUR_FRONTEND_URL.vercel.app`
2. **Login:**
   - Email: `admin@enterpriseflow.com`
   - Password: `admin123`
3. **You should see the dashboard!**

### Test All 4 Roles:

```
admin@enterpriseflow.com / admin123
sales@enterpriseflow.com / sales123
warehouse@enterpriseflow.com / warehouse123
accounts@enterpriseflow.com / accounts123
```

---

## ⚠️ Troubleshooting

### Backend won't deploy:
- Check Vercel build logs
- Verify `vercel.json` exists in backend folder
- Try Render instead (see DEPLOYMENT_GUIDE.md)

### Frontend shows blank page:
- Check browser console (F12)
- Verify `VITE_API_URL` is correct
- Test backend health endpoint first

### Login fails:
- Did you seed the database? (Step 4)
- Test backend login endpoint:
  ```bash
  curl -X POST https://YOUR_BACKEND_URL.vercel.app/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"admin@enterpriseflow.com","password":"admin123"}'
  ```

### CORS errors:
- Update `CORS_ORIGIN` on backend (Step 6)
- Redeploy backend after changing
- Frontend URL must match exactly (include https://)

---

## 📝 Update README

After successful deployment, update your README.md:

```markdown
## Live Application

**Frontend:** https://your-app.vercel.app
**Backend:** https://your-backend.vercel.app

## Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@enterpriseflow.com | admin123 |
| Sales | sales@enterpriseflow.com | sales123 |
| Warehouse | warehouse@enterpriseflow.com | warehouse123 |
| Accounts | accounts@enterpriseflow.com | accounts123 |
```

---

## ✅ Deployment Complete!

**Total Time:** ~20 minutes

You now have:
- ✅ Backend API running on Vercel
- ✅ Frontend UI running on Vercel
- ✅ MongoDB Atlas database (free tier)
- ✅ All 4 users seeded and working
- ✅ CORS configured correctly

**Share these URLs:**
- Frontend: `https://your-app.vercel.app`
- Backend: `https://your-backend.vercel.app`
- Postman Collection: In `/postman` folder

---

## 🎯 Next Steps

1. Test all features in production
2. Create some sample data via the UI
3. Take screenshots for documentation
4. Prepare submission package
5. Submit GitHub + Live URLs

**Need help?** See `DEPLOYMENT_GUIDE.md` for detailed troubleshooting.

---

**Good luck with your deployment! 🚀**
