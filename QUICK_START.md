# EnterpriseFlow - Quick Start Guide

## 🚀 Get Up and Running in 5 Minutes

### Prerequisites Check
Before starting, ensure you have:
- [ ] Node.js installed (v18+ recommended)
- [ ] MongoDB running (local or Atlas connection string)
- [ ] Terminal/command prompt access
- [ ] Git (if cloning from repository)

### Step 1: Clone & Navigate (30 seconds)
```bash
# If cloning from repo
git clone <repository-url>
cd EnterpriseFlow

# Or if already have the files
cd EnterpriseFlow
```

### Step 2: Backend Setup (2 minutes)
```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env file with your values:
# MONGODB_URI=mongodb://localhost:27017/erp_crm_dev
# JWT_SECRET=your-secret-key-here
# JWT_EXPIRES_IN=7d
# PORT=5000

# Seed the database with test data
npm run seed

# Start the backend server
npm run dev
```

**Expected output:**
```
MongoDB connected successfully
Server is running on port 5000
```

### Step 3: Frontend Setup (2 minutes)
```bash
# Open a NEW terminal window
cd EnterpriseFlow/frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env file:
# VITE_API_URL=http://localhost:5000/api

# Start the frontend server
npm run dev
```

**Expected output:**
```
VITE v5.x.x  ready in XXX ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### Step 4: Test Login (30 seconds)
1. Open browser to http://localhost:5173
2. Login with: **admin@enterpriseflow.com** / **admin123**
3. You should see the dashboard with stats!

---

## ✅ Verification Checklist

After setup, verify these work:

### Backend Health Check
```bash
# In a new terminal
curl http://localhost:5000/api/health

# Expected: {"status":"ok"}
```

### Test Login via API
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@enterpriseflow.com","password":"admin123"}'

# Expected: JSON with token and user data
```

### Frontend Access
- [ ] Open http://localhost:5173 - Should show login page
- [ ] Login with admin credentials - Should redirect to dashboard
- [ ] Dashboard shows numbers (not "Loading...") - Stats loaded successfully
- [ ] Click "Customers" - Should show customer list
- [ ] Click "Products" - Should show product list
- [ ] Click "Challans" - Should show challan list

---

## 🔑 Test Credentials

Use these pre-seeded accounts to test different roles:

| Role | Email | Password | Can Access |
|------|-------|----------|------------|
| **Admin** | admin@enterpriseflow.com | admin123 | Everything |
| **Sales** | sales@enterpriseflow.com | sales123 | Customers + Challans |
| **Warehouse** | warehouse@enterpriseflow.com | warehouse123 | Products only |
| **Accounts** | accounts@enterpriseflow.com | accounts123 | Read-only all |

---

## 🐛 Troubleshooting

### Backend won't start
**Error:** `Cannot find module 'express'`
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

**Error:** `MongoDB connection failed`
- Check if MongoDB is running: `mongosh` or check Atlas connection
- Verify MONGODB_URI in backend/.env
- For local MongoDB: Make sure it's started with `mongod`

**Error:** `Port 5000 already in use`
```bash
# Kill process on port 5000
# On Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# On Mac/Linux:
lsof -ti:5000 | xargs kill -9
```

### Frontend won't start
**Error:** `Cannot find module '@vitejs/plugin-react'`
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

**Error:** `Port 5173 already in use`
```bash
# Kill process on port 5173
# On Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# On Mac/Linux:
lsof -ti:5173 | xargs kill -9
```

### Can't login
**Error:** "Invalid credentials"
- Make sure you ran `npm run seed` in backend folder
- Check backend terminal for errors
- Try resetting database:
  ```bash
  cd backend
  npm run seed
  ```

**Error:** CORS errors in browser console
- Check backend .env has correct CORS_ORIGIN
- Should be: `CORS_ORIGIN=http://localhost:5173`
- Restart backend after changing .env

### Network errors
**Error:** "Network Error" or "Failed to fetch"
- Verify backend is running on http://localhost:5000
- Verify frontend .env has `VITE_API_URL=http://localhost:5000/api`
- Check browser console for specific error
- Try: `curl http://localhost:5000/api/health`

---

## 📊 What Gets Seeded?

When you run `npm run seed`, the database is populated with:

### 4 Users
- Admin User (admin@enterpriseflow.com)
- Sales User (sales@enterpriseflow.com)
- Warehouse User (warehouse@enterpriseflow.com)
- Accounts User (accounts@enterpriseflow.com)

### 4 Customers
- Rajesh Kumar (Retail)
- Priya Singh (Wholesale)
- Amit Patel (Distributor)
- Sneha Reddy (Retail)

### 8 Products
- Laptop HP 15s (Stock: 25)
- Mouse Logitech (Stock: 150)
- Keyboard Mechanical (Stock: 80)
- Men's T-Shirt (Stock: 200)
- Women's Jeans (Stock: 120)
- Running Shoes Nike (Stock: 60)
- Backpack Wildcraft (Stock: 45)
- Water Bottle (Stock: 5) ⚠️ Low Stock

---

## 🎯 Quick Feature Test

Once logged in, try these quick tests:

### 1. View Dashboard Stats (10 seconds)
- Dashboard should show stat cards with numbers
- Check "Low Stock Alerts" panel
- Check "Recent Challans" panel

### 2. Search Customers (10 seconds)
- Go to Customers
- Search for "kumar"
- Should filter results

### 3. Add Follow-up Note (20 seconds)
- Click "View" on any customer
- Scroll to follow-up notes
- Add a note: "Test note"
- Should appear immediately

### 4. Adjust Stock (30 seconds)
- Go to Products
- Click "View" on Water Bottle (low stock)
- Click "Adjust Stock"
- Select "Stock In"
- Quantity: 50
- Reason: "Test purchase"
- Submit and verify stock increased

### 5. Create Challan (45 seconds)
- Go to Challans
- Click "Create Challan"
- Select customer
- Add a product with quantity 2
- Click "Save as Draft"
- View the created challan

---

## 🔄 Reset Database

To reset database to original seed data:

```bash
cd backend
npm run seed
```

This will:
1. Clear all existing data
2. Recreate all 4 users
3. Recreate all 4 customers
4. Recreate all 8 products
5. Reset counters

---

## 📖 Next Steps

After quick start:
1. **Explore Features** - Try all CRUD operations
2. **Test Roles** - Login with different roles
3. **Read Testing Guide** - See TESTING_GUIDE.md for comprehensive tests
4. **Check API** - See API_REFERENCE.md for endpoint details
5. **Deploy** - See DEPLOY_NOW.md for deployment steps

---

## 💡 Tips

1. **Keep both terminals open** - One for backend, one for frontend
2. **Check both consoles** - Errors might appear in backend or frontend terminal
3. **Use browser DevTools** - Press F12 to see network errors
4. **Postman Collection** - Import `postman/ERP-CRM.postman_collection.json` to test API directly
5. **Seed anytime** - Run `npm run seed` whenever you want fresh data

---

## 🆘 Still Having Issues?

1. Check the full error message in terminal
2. Check browser console (F12) for frontend errors
3. Verify all environment variables in .env files
4. Try deleting node_modules and reinstalling
5. Check if ports 5000 and 5173 are available
6. Review SETUP_INSTRUCTIONS.md for detailed setup

---

**Time to complete:** ~5 minutes  
**Difficulty:** Easy  
**Prerequisites:** Node.js + MongoDB

🎉 **Happy coding!**
