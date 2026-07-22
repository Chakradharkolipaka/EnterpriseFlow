# EnterpriseFlow - Deployment Guide

## Prerequisites

1. **MongoDB Atlas Account** - Free tier (M0 cluster)
2. **Vercel Account** - For frontend and backend hosting
3. **Git Repository** - Push your code to GitHub first

---

## Step 1: Setup MongoDB Atlas

### 1.1 Create Cluster
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign in or create account
3. Click "Build a Database"
4. Choose **FREE** shared cluster (M0)
5. Select a cloud provider and region closest to you
6. Click "Create Cluster" (takes 3-5 minutes)

### 1.2 Configure Network Access
1. Go to "Network Access" in left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (or add `0.0.0.0/0`)
4. Click "Confirm"

### 1.3 Create Database User
1. Go to "Database Access" in left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Username: `assesments`
5. Password: `Chakravarthi` (or create a strong password)
6. Database User Privileges: "Read and write to any database"
7. Click "Add User"

### 1.4 Get Connection String
1. Go to "Database" in left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string (looks like):
   ```
   mongodb+srv://assesments:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<password>` with your actual password
6. Add the database name before the `?`:
   ```
   mongodb+srv://assesments:Chakravarthi@cluster0.xxxxx.mongodb.net/erp_crm_prod?retryWrites=true&w=majority
   ```

---

## Step 2: Push Code to GitHub

```bash
# Navigate to project
cd ~/Assesments/EnterpriseFlow

# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit - EnterpriseFlow ERP/CRM"

# Create repository on GitHub (via web interface)
# Then push:
git remote add origin https://github.com/YOUR_USERNAME/EnterpriseFlow.git
git branch -M main
git push -u origin main
```

---

## Step 3: Deploy Backend to Vercel

### 3.1 Install Vercel CLI (Optional)
```bash
npm install -g vercel
```

### 3.2 Deploy via Vercel Dashboard (Recommended)

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Select the **backend** directory as the root
4. **Framework Preset:** Other
5. **Root Directory:** `backend`
6. **Build Command:** Leave empty or `npm install`
7. **Output Directory:** Leave empty
8. Click "Environment Variables"

Add these environment variables:

| Name | Value |
|------|-------|
| `NODE_ENV` | `production` |
| `MONGODB_URI` | Your Atlas connection string from Step 1.4 |
| `JWT_SECRET` | `your_super_secret_jwt_key_minimum_32_characters_long` |
| `JWT_EXPIRES_IN` | `7d` |
| `CORS_ORIGIN` | `*` (we'll update this after frontend deploy) |

9. Click "Deploy"
10. Wait for deployment to complete
11. **Copy the deployment URL** (e.g., `https://your-backend.vercel.app`)

### 3.3 Test Backend

```bash
# Test health endpoint
curl https://your-backend.vercel.app/api/health

# Should return: {"success":true,"message":"API is running","timestamp":"..."}
```

### 3.4 Seed Production Database (One-time)

```bash
# Update backend/.env to use production MongoDB URI
# Then run:
cd backend
npm run seed
```

**OR** create a temporary seed script:

```bash
# Create seed-production.js in backend/src/seed/
# Copy seed.js content
# Update MONGODB_URI in the script
# Run: node src/seed/seed-production.js
```

---

## Step 4: Deploy Frontend to Vercel

### 4.1 Deploy via Vercel Dashboard

1. Go to https://vercel.com/new
2. Import your GitHub repository **again**
3. Select the **frontend** directory as the root
4. **Framework Preset:** Vite
5. **Root Directory:** `frontend`
6. **Build Command:** `npm run build`
7. **Output Directory:** `dist`
8. Click "Environment Variables"

Add this environment variable:

| Name | Value |
|------|-------|
| `VITE_API_URL` | `https://your-backend.vercel.app/api` |

*Replace with your actual backend URL from Step 3.2*

9. Click "Deploy"
10. Wait for deployment to complete
11. **Copy the deployment URL** (e.g., `https://your-frontend.vercel.app`)

---

## Step 5: Update CORS Configuration

### 5.1 Update Backend Environment Variable

1. Go to your backend project on Vercel
2. Click "Settings" → "Environment Variables"
3. Find `CORS_ORIGIN`
4. Update value to: `https://your-frontend.vercel.app`
5. Click "Save"
6. Go to "Deployments"
7. Click "..." on latest deployment → "Redeploy"

---

## Step 6: Test Production Application

1. Open your frontend URL: `https://your-frontend.vercel.app`
2. Login with:
   - Email: `admin@enterpriseflow.com`
   - Password: `admin123`
3. Test creating a customer
4. Test creating a product
5. Test creating a challan

---

## Alternative: Deploy Backend to Render (If Vercel has issues)

Vercel has serverless function limitations. If you experience issues, use Render:

### Deploy to Render

1. Go to https://render.com/
2. Sign up / Login
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Configure:
   - **Name:** enterpriseflow-backend
   - **Root Directory:** `backend`
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free
6. Add Environment Variables (same as Vercel)
7. Click "Create Web Service"
8. Copy the URL (e.g., `https://enterpriseflow-backend.onrender.com`)
9. Update frontend's `VITE_API_URL` and redeploy

**Note:** Render's free tier goes to sleep after inactivity. First request may take 30-60 seconds.

---

## Deployment Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Database user created
- [ ] Network access configured (0.0.0.0/0)
- [ ] Connection string copied
- [ ] Code pushed to GitHub
- [ ] Backend deployed to Vercel
- [ ] Backend environment variables set
- [ ] Backend API tested (health endpoint)
- [ ] Production database seeded
- [ ] Frontend deployed to Vercel
- [ ] Frontend environment variable set (VITE_API_URL)
- [ ] CORS_ORIGIN updated on backend
- [ ] Backend redeployed after CORS update
- [ ] Frontend tested (login works)
- [ ] All 4 role logins tested
- [ ] Customer creation tested
- [ ] Product creation tested
- [ ] Challan creation tested

---

## Troubleshooting

### Backend Issues

**Error: "Cannot connect to MongoDB"**
- Check MongoDB Atlas IP whitelist includes `0.0.0.0/0`
- Verify connection string is correct in environment variables
- Check database user credentials

**Error: "CORS policy"**
- Verify `CORS_ORIGIN` environment variable on backend
- Redeploy backend after changing CORS_ORIGIN
- Try using `*` temporarily to test

**Error: "Function timeout"**
- Vercel serverless functions have a 10s timeout on free tier
- Consider using Render instead for backend

### Frontend Issues

**Error: "Failed to fetch"**
- Check `VITE_API_URL` environment variable
- Verify backend URL is correct and includes `/api`
- Test backend health endpoint directly

**Blank page after deploy**
- Check browser console for errors
- Verify `vercel.json` rewrites are configured
- Check build logs for errors

**Login not working**
- Test backend `/api/auth/login` endpoint with Postman
- Verify database was seeded
- Check browser Network tab for response

---

## Production URLs (Update after deployment)

**Frontend:** `https://your-app.vercel.app`  
**Backend:** `https://your-backend.vercel.app`  
**Database:** MongoDB Atlas `cluster0.xxxxx.mongodb.net`

---

## Post-Deployment

### Update README.md

Add your production URLs to README.md:

```markdown
## Deployment
- **Frontend:** https://your-app.vercel.app
- **Backend:** https://your-backend.vercel.app
- **Database:** MongoDB Atlas (M0 cluster)
```

### Update Environment Files

Update `.env.example` files with production placeholders.

### Monitor Application

- Vercel Dashboard: Monitor deployments and logs
- MongoDB Atlas: Monitor database usage and performance
- Test all critical user flows regularly

---

## Security Notes

1. **Never commit `.env` files** - Already in `.gitignore`
2. **Use strong JWT secret** - Generate with: `openssl rand -base64 32`
3. **Rotate secrets regularly** - Update in Vercel settings
4. **Monitor Atlas metrics** - Check for unusual activity
5. **Enable 2FA** - On Vercel and MongoDB Atlas accounts

---

## Costs

- **MongoDB Atlas M0:** FREE (512 MB storage)
- **Vercel Hobby:** FREE (100 GB bandwidth, 100 GB-hrs compute)
- **Total:** $0/month for this project size

---

## Support

If you encounter issues:

1. Check Vercel deployment logs
2. Check MongoDB Atlas logs
3. Test backend endpoints with Postman
4. Review browser console errors
5. Verify all environment variables

---

**Deployment should take 15-30 minutes total. Good luck! 🚀**
