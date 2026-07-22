# Setup Instructions

## Current Status

✅ **Phase 0 - Partial Complete**: Project structure created, backend dependencies installed
❌ **Blocking Issues**: Need to complete setup before proceeding

## Environment Setup Required

### 1. Node.js in WSL (Required for Frontend)

The frontend cannot be installed because Node.js is not available in your WSL environment. Your current npm points to Windows (`/mnt/c/nvm4w/nodejs/npm`) which causes UNC path issues.

**Solution**: Install Node.js in WSL:

```bash
# Open WSL terminal
wsl

# Install Node.js using nvm (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install --lts
nvm use --lts

# Verify installation
node --version
npm --version
which npm  # Should show /home/chakradhar_kolipaka/.nvm/...

# Now install frontend dependencies
cd ~/Assesments/EnterpriseFlow/frontend
npm install
```

### 2. MongoDB Setup (Choose One)

#### Option A: MongoDB Atlas (Recommended - No local install needed)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a free M0 cluster
4. Get your connection string
5. Update `backend/.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/erp_crm_dev?retryWrites=true&w=majority
   ```

#### Option B: Install MongoDB in WSL

```bash
wsl

# Import MongoDB GPG key
curl -fsSL https://www.mongodb.org/static/pgp/server-6.0.asc | sudo gpg -o /usr/share/keyrings/mongodb-server-6.0.gpg --dearmor

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-6.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Install MongoDB
sudo apt update
sudo apt install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

## Running the Application

### Backend

```bash
wsl
cd ~/Assesments/EnterpriseFlow/backend

# Seed the database (creates 4 role users)
npm run seed

# Start the development server
npm run dev
```

The backend will run on http://localhost:5000

### Frontend

```bash
wsl
cd ~/Assesments/EnterpriseFlow/frontend

# Start the development server
npm run dev
```

The frontend will run on http://localhost:5173

## Quick Test

Once both servers are running:

1. Open http://localhost:5173 in your browser
2. Login with: `admin@enterpriseflow.com` / `admin123`
3. You should see the dashboard

## Next Steps After Setup

Once the environment is configured and both servers run successfully:

- ✅ Phase 0: Complete (scaffold verified)
- 🔄 Phase 1: Auth & Roles (already coded, needs testing)
- ⏳ Phase 2: Customer CRM
- ⏳ Phase 3: Product & Inventory
- ⏳ Phase 4: Sales Challan
- ⏳ Phase 5: Polish
- ⏳ Phase 6: Deploy
- ⏳ Phase 7: Submission

## Troubleshooting

### SSL Certificate Issues with npm

If you encounter SSL errors:
```bash
npm config set strict-ssl false
```

### Port Already in Use

```bash
# Find and kill the process
lsof -ti:5000 | xargs kill -9  # Backend
lsof -ti:5173 | xargs kill -9  # Frontend
```

### MongoDB Connection Issues

- Check if MongoDB is running: `sudo systemctl status mongod`
- Check connection string in `backend/.env`
- For Atlas: Ensure your IP is whitelisted in Network Access
