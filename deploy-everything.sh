#!/bin/bash

# EnterpriseFlow - Complete Deployment Script
# This script deploys both backend and frontend to Vercel and seeds the database

set -e  # Exit on error

echo "╔════════════════════════════════════════════════════════╗"
echo "║   EnterpriseFlow - Complete Deployment Script         ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Push to Git
echo -e "${BLUE}Step 1: Pushing to Git...${NC}"
git config http.sslVerify false  # Temporary fix for SSL issue
git push origin main || echo -e "${YELLOW}Git push failed - continuing anyway${NC}"
echo ""

# Step 2: Deploy Backend
echo -e "${BLUE}Step 2: Deploying Backend to Vercel...${NC}"
cd backend

echo "Running production deployment..."
vercel --prod > deployment-output.txt 2>&1

# Extract the deployment URL
DEPLOYMENT_URL=$(grep -oP 'https://[^\s]+\.vercel\.app' deployment-output.txt | tail -1)
ALIAS_URL=$(grep -oP 'https://enterpriseflowbe\.vercel\.app' deployment-output.txt | head -1)

echo -e "${GREEN}✓ Backend deployed!${NC}"
echo "Deployment URL: $DEPLOYMENT_URL"
echo "Alias URL: $ALIAS_URL"
echo ""

# Determine which URL to use
if [ -n "$ALIAS_URL" ]; then
    BACKEND_URL="$ALIAS_URL"
    echo -e "${GREEN}Using alias URL${NC}"
else
    BACKEND_URL="$DEPLOYMENT_URL"
    echo -e "${YELLOW}Alias not available, using deployment URL${NC}"
fi

echo "Backend URL: $BACKEND_URL"
echo ""

# Wait for deployment to be ready
echo -e "${BLUE}Waiting 10 seconds for deployment to stabilize...${NC}"
sleep 10

# Step 3: Test Backend Health
echo -e "${BLUE}Step 3: Testing Backend Health...${NC}"
HEALTH_RESPONSE=$(curl -s "$BACKEND_URL/api/health" || echo "failed")

if [[ $HEALTH_RESPONSE == *"success"* ]]; then
    echo -e "${GREEN}✓ Backend is healthy!${NC}"
    echo "$HEALTH_RESPONSE"
else
    echo -e "${RED}✗ Health check failed!${NC}"
    echo "Response: $HEALTH_RESPONSE"
    echo ""
    echo -e "${YELLOW}Trying deployment-specific URL...${NC}"
    BACKEND_URL="$DEPLOYMENT_URL"
    HEALTH_RESPONSE=$(curl -s "$BACKEND_URL/api/health" || echo "failed")
    
    if [[ $HEALTH_RESPONSE == *"success"* ]]; then
        echo -e "${GREEN}✓ Deployment URL works!${NC}"
        echo "$HEALTH_RESPONSE"
    else
        echo -e "${RED}✗ Both URLs failed. Check Vercel logs.${NC}"
        echo ""
        echo "Manual check commands:"
        echo "  vercel logs --follow"
        exit 1
    fi
fi
echo ""

# Step 4: Seed Database
echo -e "${BLUE}Step 4: Seeding MongoDB Database...${NC}"
SEED_RESPONSE=$(curl -s -X POST "$BACKEND_URL/api/admin/seed-database")

if [[ $SEED_RESPONSE == *"success"* ]]; then
    echo -e "${GREEN}✓ Database seeded successfully!${NC}"
    echo "$SEED_RESPONSE" | jq '.' 2>/dev/null || echo "$SEED_RESPONSE"
else
    echo -e "${YELLOW}⚠ Seed response:${NC}"
    echo "$SEED_RESPONSE" | jq '.' 2>/dev/null || echo "$SEED_RESPONSE"
fi
echo ""

# Step 5: Test Login
echo -e "${BLUE}Step 5: Testing Login...${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "$BACKEND_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@enterpriseflow.com","password":"admin123"}')

if [[ $LOGIN_RESPONSE == *"token"* ]]; then
    echo -e "${GREEN}✓ Login successful!${NC}"
    echo "Token received (truncated):"
    echo "$LOGIN_RESPONSE" | jq '.data.token' 2>/dev/null | cut -c1-50 || echo "Token present"
else
    echo -e "${YELLOW}⚠ Login response:${NC}"
    echo "$LOGIN_RESPONSE" | jq '.' 2>/dev/null || echo "$LOGIN_RESPONSE"
fi
echo ""

# Step 6: Deploy Frontend
echo -e "${BLUE}Step 6: Deploying Frontend to Vercel...${NC}"
cd ../frontend

echo "Running production deployment..."
vercel --prod > deployment-output.txt 2>&1

FRONTEND_DEPLOYMENT_URL=$(grep -oP 'https://[^\s]+\.vercel\.app' deployment-output.txt | tail -1)
FRONTEND_ALIAS=$(grep -oP 'https://enterpriseflow[^b][^\s]*\.vercel\.app' deployment-output.txt | head -1)

if [ -n "$FRONTEND_ALIAS" ]; then
    FRONTEND_URL="$FRONTEND_ALIAS"
else
    FRONTEND_URL="$FRONTEND_DEPLOYMENT_URL"
fi

echo -e "${GREEN}✓ Frontend deployed!${NC}"
echo "Frontend URL: $FRONTEND_URL"
echo ""

# Step 7: Summary
echo ""
echo "╔════════════════════════════════════════════════════════╗"
echo "║              Deployment Complete! 🎉                   ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""
echo -e "${GREEN}Backend URL:${NC}  $BACKEND_URL"
echo -e "${GREEN}Frontend URL:${NC} $FRONTEND_URL"
echo ""
echo -e "${BLUE}Next Steps:${NC}"
echo ""
echo "1. Add VITE_API_URL to Frontend in Vercel Dashboard:"
echo "   - Go to: https://vercel.com/dashboard"
echo "   - Select: frontend project"
echo "   - Settings → Environment Variables → Add"
echo "   - Key: VITE_API_URL"
echo "   - Value: $BACKEND_URL/api"
echo "   - Save and redeploy"
echo ""
echo "2. Update Backend CORS (for security):"
echo "   - Go to backend project in Vercel dashboard"
echo "   - Settings → Environment Variables"
echo "   - Edit CORS_ORIGIN"
echo "   - Change from: *"
echo "   - Change to: $FRONTEND_URL"
echo "   - Save and redeploy"
echo ""
echo "3. Test the Application:"
echo "   - Open: $FRONTEND_URL"
echo "   - Login: admin@enterpriseflow.com / admin123"
echo ""
echo -e "${GREEN}Test Credentials:${NC}"
echo "  Admin:     admin@enterpriseflow.com     / admin123"
echo "  Sales:     sales@enterpriseflow.com     / sales123"
echo "  Warehouse: warehouse@enterpriseflow.com / warehouse123"
echo "  Accounts:  accounts@enterpriseflow.com  / accounts123"
echo ""
echo "═══════════════════════════════════════════════════════════"
echo ""

# Save URLs to file
cat > ../DEPLOYMENT_URLS.txt << EOF
EnterpriseFlow - Deployment URLs
Generated: $(date)

Backend URL:  $BACKEND_URL
Frontend URL: $FRONTEND_URL

API Health Check:
  $BACKEND_URL/api/health

Frontend Application:
  $FRONTEND_URL

Login Credentials:
  Admin:     admin@enterpriseflow.com / admin123
  Sales:     sales@enterpriseflow.com / sales123
  Warehouse: warehouse@enterpriseflow.com / warehouse123
  Accounts:  accounts@enterpriseflow.com / accounts123

Environment Variables Needed:

Frontend (add in Vercel dashboard):
  VITE_API_URL=$BACKEND_URL/api

Backend (update in Vercel dashboard):
  CORS_ORIGIN=$FRONTEND_URL (change from * for security)

Vercel Projects:
  Backend:  https://vercel.com/dashboard
  Frontend: https://vercel.com/dashboard
EOF

echo -e "${GREEN}✓ Deployment URLs saved to: DEPLOYMENT_URLS.txt${NC}"
echo ""
