# 🚀 Vercel Setup Guide - Step by Step

## Part 1: Prerequisites (5 minutes)

### Step 1: Create Vercel Account

1. Go to **https://vercel.com/signup**
2. Click "Continue with GitHub" (recommended)
3. Authorize Vercel to access your GitHub account
4. You'll be taken to your Vercel dashboard

**Alternative:** You can also sign up with email, but GitHub integration makes deployment easier.

---

### Step 2: Push Code to GitHub (REQUIRED)

**Vercel deploys from Git repositories. You must push your code to GitHub first!**

```bash
# Open WSL terminal and navigate to project
cd ~/Assesments/EnterpriseFlow

# Check current status
git status

# Add all files
git add .

# Commit changes
git commit -m "Add deployment configuration"

# If you haven't created a GitHub repo yet:
# 1. Go to https://github.com/new
# 2. Create repository named "EnterpriseFlow"
# 3. Don't initialize with README (your code already has one)
# 4. Copy the commands shown, which look like:

git remote add origin https://github.com/YOUR_USERNAME/EnterpriseFlow.git
git branch -M main
git push -u origin main

# Enter your GitHub credentials when prompted
```

**✅ Checkpoint:** Your code should now be visible on GitHub at `https://github.com/YOUR_USERNAME/EnterpriseFlow`

---

## Part 2: Deploy Backend to Vercel (10 minutes)

### Step 1: Start New Project

1. Go to **https://vercel.com/new**
2. You'll see "Import Git Repository"
3. Click **"Import"** next to your "EnterpriseFlow" repository
   - If you don't see it, click "Adjust GitHub App Permissions" to grant access

### Step 2: Configure Backend Project

You'll see a configuration screen:

**Project Settings:**

| Field | Value |
|-------|-------|
| **Project Name** | `enterpriseflow-backend` (or leave default) |
| **Framework Preset** | Select **"Other"** from dropdown |
| **Root Directory** | Click "Edit" → Select **"backend"** → Click "Continue" |
| **Build & Development Settings** | Leave as default |

**Build Settings (should auto-detect):**
- Build Command: `npm install` or leave empty
- Output Directory: Leave empty
- Install Command: `npm install`

### Step 3: Add Environment Variables

**CRITICAL STEP:** Click **"Environment Variables"** section (before deploying)

Add these variables ONE BY ONE:

#### Variable 1: NODE_ENV
- **Name:** `NODE_ENV`
- **Value:** `production`
- Click "Add"

#### Variable 2: MONGODB_URI
- **Name:** `MONGODB_URI`
- **Value:** Your MongoDB Atlas connection string
  ```
  mongodb+srv://assesments:Chakravarthi@cluster0.xxxxx.mongodb.net/erp_crm_prod?retryWrites=true&w=majority
  ```
- **Important:** Replace with YOUR actual connection string from MongoDB Atlas
- Click "Add"

#### Variable 3: JWT_SECRET
- **Name:** `JWT_SECRET`
- **Value:** `your_super_secret_jwt_key_production_2026_minimum_32_characters`
- **Important:** Use a strong, unique secret in production
- Click "Add"

#### Variable 4: JWT_EXPIRES_IN
- **Name:** `JWT_EXPIRES_IN`
- **Value:** `7d`
- Click "Add"

#### Variable 5: CORS_ORIGIN
- **Name:** `CORS_ORIGIN`
- **Value:** `*` (we'll update this after frontend deployment)
- Click "Add"

### Step 4: Deploy Backend

1. Click **"Deploy"** button
2. Wait for deployment (2-5 minutes)
3. You'll see build logs in real-time
4. When complete, you'll see "🎉 Congratulations!"

### Step 5: Get Backend URL

1. Click **"Visit"** or **"Continue to Dashboard"**
2. Copy your backend URL (looks like):
   ```
   https://enterpriseflow-backend-xxx.vercel.app
   ```
3. **SAVE THIS URL** - you need it for frontend!

### Step 6: Test Backend

Open a new terminal and test:

```bash
# Test health endpoint (replace with YOUR URL)
curl https://YOUR_BACKEND_URL.vercel.app/api/health

# Should return:
# {"success":true,"message":"API is running","timestamp":"..."}
```

**If you get an error:**
- Check Vercel deployment logs (click on the deployment)
- Verify environment variables are set correctly
- Check that MongoDB Atlas allows connections from anywhere (0.0.0.0/0)

---

## Part 3: Deploy Frontend to Vercel (10 minutes)

### Step 1: Start Another New Project

1. Go to **https://vercel.com/new** again
2. Click **"Import"** next to **the SAME** "EnterpriseFlow" repository
   - Yes, you'll import the same repo twice (once for backend, once for frontend)

### Step 2: Configure Frontend Project

**Project Settings:**

| Field | Value |
|-------|-------|
| **Project Name** | `enterpriseflow-frontend` (or leave default) |
| **Framework Preset** | Select **"Vite"** from dropdown |
| **Root Directory** | Click "Edit" → Select **"frontend"** → Click "Continue" |

**Build Settings (should auto-detect):**
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

### Step 3: Add Environment Variable

Click **"Environment Variables"**

Add this variable:

#### Variable: VITE_API_URL
- **Name:** `VITE_API_URL`
- **Value:** `https://YOUR_BACKEND_URL.vercel.app/api`
- **Important:** Replace `YOUR_BACKEND_URL` with the actual backend URL from Part 2, Step 5
- **Example:** `https://enterpriseflow-backend-xxx.vercel.app/api`
- **Note:** Must include `/api` at the end!
- Click "Add"

### Step 4: Deploy Frontend

1. Click **"Deploy"** button
2. Wait for deployment (2-5 minutes)
3. When complete, you'll see "🎉 Congratulations!"

### Step 5: Get Frontend URL

1. Click **"Visit"** or copy the URL
2. Your frontend URL looks like:
   ```
   https://enterpriseflow-xxx.vercel.app
   ```
3. **SAVE THIS URL**

---

## Part 4: Update CORS (REQUIRED - 5 minutes)

**Your frontend won't work without this step!**

### Step 1: Update Backend Environment Variable

1. Go to **https://vercel.com/dashboard**
2. Click on your **backend** project (`enterpriseflow-backend`)
3. Click **"Settings"** tab
4. Click **"Environment Variables"** in left sidebar
5. Find `CORS_ORIGIN` variable
6. Click the **"..."** menu → **"Edit"**
7. Change value from `*` to your **frontend URL**:
   ```
   https://YOUR_FRONTEND_URL.vercel.app
   ```
   **Important:** No trailing slash, must start with `https://`
8. Click **"Save"**

### Step 2: Redeploy Backend

**This is critical - changes don't apply until you redeploy!**

1. Still in backend project settings
2. Click **"Deployments"** tab at top
3. Find the latest deployment (top of list)
4. Click the **"..."** menu on the right
5. Click **"Redeploy"**
6. Click **"Redeploy"** again to confirm
7. Wait for redeployment (~1 minute)

---

## Part 5: Seed Production Database (5 minutes)

### Option A: From Your Local Machine (Recommended)

```bash
# Open WSL terminal
cd ~/Assesments/EnterpriseFlow/backend

# Edit .env file to use Atlas connection string
nano .env

# Change MONGODB_URI to your Atlas string:
MONGODB_URI=mongodb+srv://assesments:Chakravarthi@cluster0.xxxxx.mongodb.net/erp_crm_prod?retryWrites=true&w=majority

# Save and exit (Ctrl+X, Y, Enter)

# Run seed
npm run seed

# You should see:
# ✓ Created 4 role users
# ✓ Created sample customers
# ✓ Created sample products
```

### Option B: Via Vercel CLI (Alternative)

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Navigate to backend
cd ~/Assesments/EnterpriseFlow/backend

# Run seed in production environment
vercel env pull
npm run seed
```

---

## Part 6: Test Your Deployed Application! 🎉

### Step 1: Open Frontend

1. Open your frontend URL in browser:
   ```
   https://YOUR_FRONTEND_URL.vercel.app
   ```

2. You should see the login page

### Step 2: Login

Use any of these credentials:

```
Admin:     admin@enterpriseflow.com     / admin123
Sales:     sales@enterpriseflow.com     / sales123  
Warehouse: warehouse@enterpriseflow.com / warehouse123
Accounts:  accounts@enterpriseflow.com  / accounts123
```

### Step 3: Verify

- ✅ Login works
- ✅ Dashboard displays
- ✅ User info shows correctly
- ✅ Logout works

---

## Troubleshooting

### Problem: "Cannot find repository"

**Solution:**
1. Go to https://github.com/settings/installations
2. Find "Vercel" installation
3. Click "Configure"
4. Ensure your repository is selected
5. Save

### Problem: Backend build fails

**Solution:**
1. Check Vercel build logs
2. Verify `vercel.json` exists in backend folder
3. Check `package.json` has correct start script
4. Try redeploying

### Problem: Frontend shows blank page

**Solution:**
1. Open browser console (F12)
2. Check for errors
3. Verify `VITE_API_URL` is set correctly
4. Test backend URL directly in browser

### Problem: Login fails / CORS error

**Solution:**
1. Check backend `CORS_ORIGIN` is set to frontend URL
2. Verify you redeployed backend after changing CORS
3. Check MongoDB Atlas network access allows 0.0.0.0/0
4. Verify database was seeded

### Problem: "Database seeding failed"

**Solution:**
1. Check MongoDB Atlas connection string is correct
2. Verify database user credentials
3. Check network access in Atlas (must allow 0.0.0.0/0)
4. Try connecting with MongoDB Compass first

---

## Summary Checklist

### Prerequisites
- [ ] Vercel account created
- [ ] GitHub account connected to Vercel
- [ ] Code pushed to GitHub
- [ ] MongoDB Atlas cluster created

### Backend Deployment
- [ ] Imported repository to Vercel
- [ ] Set root directory to "backend"
- [ ] Added all 5 environment variables
- [ ] Deployed successfully
- [ ] Tested health endpoint
- [ ] Saved backend URL

### Frontend Deployment
- [ ] Imported repository to Vercel (again)
- [ ] Set root directory to "frontend"
- [ ] Added VITE_API_URL variable
- [ ] Deployed successfully
- [ ] Saved frontend URL

### Post-Deployment
- [ ] Updated backend CORS_ORIGIN
- [ ] Redeployed backend
- [ ] Seeded production database
- [ ] Tested login for all 4 roles
- [ ] Verified dashboard works

---

## Quick Reference

### Vercel Dashboard URLs
- Main Dashboard: https://vercel.com/dashboard
- New Project: https://vercel.com/new
- Account Settings: https://vercel.com/account

### Project URLs (Update after deployment)
```
Backend:  https://your-backend.vercel.app
Frontend: https://your-frontend.vercel.app
```

### Common Vercel CLI Commands
```bash
vercel login              # Login to Vercel
vercel --version          # Check version
vercel env pull           # Download environment variables
vercel logs               # View deployment logs
vercel --prod             # Deploy to production
```

---

## Next Steps After Successful Deployment

1. **Update README.md** with your live URLs
2. **Test all features** in production
3. **Take screenshots** for documentation
4. **Test on mobile** device
5. **Share the URLs** with stakeholders
6. **Monitor** Vercel dashboard for errors

---

**Need More Help?**

- Vercel Documentation: https://vercel.com/docs
- Vercel Discord: https://vercel.com/discord
- Check deployment logs in Vercel dashboard
- Review browser console for frontend errors

**You're ready to deploy! Follow the steps in order, and you'll be live in 30 minutes! 🚀**
