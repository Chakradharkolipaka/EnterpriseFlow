# Quick Start Guide

## Prerequisites Setup (One-Time)

### 1. Install Node.js in WSL

```bash
# Open WSL terminal
wsl

# Install NVM (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Reload shell configuration
source ~/.bashrc

# Install Node.js LTS
nvm install --lts
nvm use --lts

# Verify installation
node --version  # Should show v18.x or v20.x
npm --version   # Should show 9.x or 10.x
which npm       # Should show /home/.../.nvm/... (NOT /mnt/c/...)
```

### 2. Setup MongoDB

**Option A: MongoDB Atlas (Recommended - No Installation)**

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for free account
3. Create a free M0 cluster
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Update `backend/.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/erp_crm_dev?retryWrites=true&w=majority
   ```

**Option B: Local MongoDB**

```bash
# In WSL
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo gpg -o /usr/share/keyrings/mongodb-server-6.0.gpg --dearmor
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-6.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt update
sudo apt install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

## Install Dependencies

```bash
# In WSL terminal, navigate to project
cd ~/Assesments/EnterpriseFlow

# Install backend dependencies
cd backend
npm config set strict-ssl false  # If you have SSL issues
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

## Run the Application

### Terminal 1 - Backend

```bash
cd ~/Assesments/EnterpriseFlow/backend

# Seed the database (run once)
npm run seed

# Start development server
npm run dev

# Should see:
# MongoDB Connected: ...
# Server running in development mode on port 5000
```

### Terminal 2 - Frontend

```bash
cd ~/Assesments/EnterpriseFlow/frontend

# Start development server
npm run dev

# Should see:
# VITE ready in ...
# Local: http://localhost:5173
```

## Test the Application

### 1. Using Browser

1. Open http://localhost:5173
2. Login with any test credential:
   - **Admin:** admin@enterpriseflow.com / admin123
   - **Sales:** sales@enterpriseflow.com / sales123
   - **Warehouse:** warehouse@enterpriseflow.com / warehouse123
   - **Accounts:** accounts@enterpriseflow.com / accounts123

### 2. Using Postman

1. Import `postman/ERP-CRM.postman_collection.json`
2. Run "Login - Admin" request (sets token automatically)
3. Test other endpoints

### 3. Quick API Test

```bash
# Health check (no auth needed)
curl http://localhost:5000/api/health

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@enterpriseflow.com","password":"admin123"}'

# Use the token from response for authenticated requests
```

## Verify Everything Works

### Backend Checklist
- [ ] `npm run seed` completes successfully
- [ ] Server starts on port 5000
- [ ] MongoDB connection successful
- [ ] Health check returns 200 OK
- [ ] Login returns JWT token

### Frontend Checklist
- [ ] Vite dev server starts on port 5173
- [ ] No compilation errors
- [ ] Login page loads
- [ ] Can login with test credentials
- [ ] Dashboard displays user info

## Common Issues & Solutions

### Issue: "UNC paths are not supported"
**Solution:** You're running npm from Windows instead of WSL. Make sure Node.js is installed IN WSL (see step 1 above).

### Issue: "Cannot connect to MongoDB"
**Solution:** 
- If using Atlas: Check connection string, whitelist your IP
- If using local: `sudo systemctl status mongod` to check if running

### Issue: "npm install fails with SSL error"
**Solution:** Run `npm config set strict-ssl false` before installing

### Issue: "Port 5000 or 5173 already in use"
**Solution:**
```bash
# Find and kill the process
lsof -ti:5000 | xargs kill -9
lsof -ti:5173 | xargs kill -9
```

### Issue: "CORS error in browser"
**Solution:** Verify `backend/.env` has `CORS_ORIGIN=http://localhost:5173`

## Development Workflow

```bash
# Always work in WSL terminal
wsl

# Backend changes: server auto-restarts (--watch flag)
cd ~/Assesments/EnterpriseFlow/backend
# Edit files, server restarts automatically

# Frontend changes: Vite hot-reloads
cd ~/Assesments/EnterpriseFlow/frontend
# Edit files, browser updates automatically

# Reset database to seed state
cd ~/Assesments/EnterpriseFlow/backend
npm run seed
```

## API Documentation

See `postman/ERP-CRM.postman_collection.json` for complete API documentation with examples.

### Quick Reference

| Endpoint | Method | Auth | Role |
|----------|--------|------|------|
| `/api/auth/login` | POST | No | - |
| `/api/customers` | GET | Yes | All |
| `/api/customers` | POST | Yes | Admin, Sales |
| `/api/products` | GET | Yes | All |
| `/api/products/:id/stock` | POST | Yes | Admin, Warehouse |
| `/api/challans` | POST | Yes | Admin, Sales |
| `/api/challans/:id/confirm` | POST | Yes | Admin, Sales |

## Next Steps

Once everything is running:

1. Test all 4 role logins
2. Create a customer via API or frontend
3. Create a product
4. Create a challan (draft, then confirm)
5. Verify stock deduction
6. Cancel the challan
7. Verify stock restoration

You're now ready to continue development! 🚀
