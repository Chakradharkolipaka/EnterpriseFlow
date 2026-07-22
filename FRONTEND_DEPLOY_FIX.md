# 🔧 Frontend Deployment Fix

## Problem
```
vite: command not found
Error: Command "vite build" exited with 127
```

## Root Cause
You're deploying the frontend, but Vercel doesn't know where to find the frontend code.

## Solution: Deploy from the Frontend Directory

### ✅ CORRECT WAY - Deploy from frontend folder

```bash
cd ~/Assesments/EnterpriseFlow/frontend
vercel --prod
```

This tells Vercel that the frontend folder IS your project root.

### ❌ WRONG WAY - Don't deploy from root

```bash
cd ~/Assesments/EnterpriseFlow
vercel --prod   # This tries to build the entire repo as one project
```

---

## Alternative: Configure Root Directory in Vercel Dashboard

If you already linked the project and want to keep deploying from root:

1. Go to: https://vercel.com/dashboard
2. Select your frontend project
3. Go to: **Settings** → **General**
4. Find: **Root Directory**
5. Click: **Edit**
6. Enter: `frontend`
7. Save
8. Redeploy

---

## Quick Fix Steps

### Step 1: Remove Current Vercel Link (if needed)
```bash
cd ~/Assesments/EnterpriseFlow/frontend
rm -rf .vercel
```

### Step 2: Deploy Fresh from Frontend Directory
```bash
cd ~/Assesments/EnterpriseFlow/frontend
vercel --prod
```

When prompted:
- **Set up and deploy?** → Yes
- **Which scope?** → Your account
- **Link to existing project?** → No (or Yes if you want to reuse)
- **Project name?** → enterpriseflow-frontend (or your choice)
- **Directory?** → `.` (current directory - just press Enter)
- **Override settings?** → No

### Step 3: Add Environment Variable
```bash
# While still in frontend directory
vercel env add VITE_API_URL production
```

When prompted, enter your backend URL with `/api`:
```
https://YOUR-BACKEND-URL/api
```

### Step 4: Redeploy
```bash
vercel --prod
```

---

## Files Modified

I've updated:
- ✅ `frontend/.gitignore` - Added proper exclusions
- ✅ `frontend/vercel.json` - Kept simple (just rewrites)

These files are ready to commit and push.

---

## Complete Command Sequence

```bash
# 1. Go to frontend directory
cd ~/Assesments/EnterpriseFlow/frontend

# 2. Verify package.json exists
ls -la package.json

# 3. Deploy to Vercel
vercel --prod

# 4. Add environment variable
vercel env add VITE_API_URL production
# Enter: https://YOUR-BACKEND-URL/api

# 5. Redeploy with env var
vercel --prod

# 6. Test in browser
# Open the URL shown in the deployment output
```

---

## What If You Get "Project Already Linked"?

### Option A: Use Existing Project
```bash
cd ~/Assesments/EnterpriseFlow/frontend
vercel --prod
```

### Option B: Link to Different Project
```bash
cd ~/Assesments/EnterpriseFlow/frontend
rm -rf .vercel
vercel link
vercel --prod
```

### Option C: Create New Project
```bash
cd ~/Assesments/EnterpriseFlow/frontend
rm -rf .vercel
vercel --prod
# Choose "No" when asked to link to existing project
```

---

## Verification

After deployment succeeds, you should see:
```
✓ Deployment ready
Production: https://enterpriseflow-xxxxx.vercel.app
```

Test it:
```bash
curl https://YOUR-FRONTEND-URL
# Should return HTML (not 404)
```

---

## Summary

**The fix:** Deploy from the `frontend/` directory, not from the root directory.

**Commands:**
```bash
cd ~/Assesments/EnterpriseFlow/frontend
vercel --prod
vercel env add VITE_API_URL production  # Enter backend URL
vercel --prod
```

**After this works:** Commit and push the .gitignore update.

---

## Still Having Issues?

Check:
1. ✅ You're in the `frontend/` directory
2. ✅ `package.json` exists in current directory
3. ✅ `node_modules/` exists (or will be created by Vercel)
4. ✅ `vite` is listed in `package.json` devDependencies

Run this to verify:
```bash
cd ~/Assesments/EnterpriseFlow/frontend
pwd  # Should show: .../EnterpriseFlow/frontend
cat package.json | grep vite  # Should show vite version
```
