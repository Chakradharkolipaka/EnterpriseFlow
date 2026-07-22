#!/bin/bash

# EnterpriseFlow - Deploy and Test Script
# Run this after pushing to GitHub

set -e

echo "╔════════════════════════════════════════════════════════╗"
echo "║   EnterpriseFlow - Deploy & Test Script               ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Deploy Backend
echo -e "${BLUE}Step 1: Deploying Backend...${NC}"
cd backend
vercel --prod

echo ""
echo -e "${YELLOW}Copy the deployment URL from above${NC}"
echo -e "${YELLOW}If alias doesn't work, use the deployment-specific URL${NC}"
echo ""
read -p "Enter the working backend URL (e.g., https://enterpriseflowbe.vercel.app): " BACKEND_URL

# Remove trailing slash if present
BACKEND_URL=${BACKEND_URL%/}

echo ""
echo -e "${BLUE}Step 2: Testing Backend...${NC}"
sleep 5

# Test health
echo "Testing health endpoint..."
curl -s "$BACKEND_URL/api/health" | jq '.' || curl -s "$BACKEND_URL/api/health"
echo ""

# Seed database
echo -e "${BLUE}Step 3: Seeding Database...${NC}"
curl -s -X POST "$BACKEND_URL/api/admin/seed-database" | jq '.' || curl -s -X POST "$BACKEND_URL/api/admin/seed-database"
echo ""

# Test login
echo -e "${BLUE}Step 4: Testing Login...${NC}"
curl -s -X POST "$BACKEND_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@enterpriseflow.com","password":"admin123"}' | jq '.' || \
curl -s -X POST "$BACKEND_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@enterpriseflow.com","password":"admin123"}'
echo ""

# Deploy Frontend
echo -e "${BLUE}Step 5: Deploying Frontend...${NC}"
cd ../frontend
vercel --prod

echo ""
echo -e "${YELLOW}Copy the frontend URL from above${NC}"
read -p "Enter the frontend URL: " FRONTEND_URL

# Summary
cat > ../DEPLOYMENT_URLS.txt << EOF
EnterpriseFlow - Deployment URLs
================================

Backend:  $BACKEND_URL
Frontend: $FRONTEND_URL

NEXT STEPS - IMPORTANT!
=======================

1. Add Environment Variable to Frontend:
   - Visit: https://vercel.com/dashboard
   - Select your frontend project
   - Go to: Settings → Environment Variables
   - Click: Add New
   - Key:   VITE_API_URL
   - Value: $BACKEND_URL/api
   - Select: Production, Preview, Development
   - Click: Save
   
2. Redeploy Frontend:
   cd frontend
   vercel --prod

3. Update Backend CORS (Security):
   - Visit: https://vercel.com/dashboard
   - Select your backend project
   - Go to: Settings → Environment Variables
   - Find: CORS_ORIGIN
   - Edit value from "*" to: $FRONTEND_URL
   - Click: Save

4. Redeploy Backend:
   cd backend
   vercel --prod

5. Test Application:
   - Open: $FRONTEND_URL
   - Login: admin@enterpriseflow.com / admin123

Test Credentials:
=================
Admin:     admin@enterpriseflow.com / admin123
Sales:     sales@enterpriseflow.com / sales123
Warehouse: warehouse@enterpriseflow.com / warehouse123
Accounts:  accounts@enterpriseflow.com / accounts123

MongoDB Atlas:
=============
Check your database at: https://cloud.mongodb.com
Database: erp_crm_prod
Collections: users (4), customers (4), products (8), counters (1)
EOF

echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║            Deployment Complete! 🎉                     ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════╝${NC}"
echo ""
cat ../DEPLOYMENT_URLS.txt
echo ""
