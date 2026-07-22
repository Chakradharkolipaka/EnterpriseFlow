#!/bin/bash

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║         EnterpriseFlow - Deployment Checklist                  ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Check if git is initialized
if [ -d .git ]; then
    echo "✓ Git repository initialized"
else
    echo "✗ Git not initialized - Run: git init"
fi

# Check if vercel.json exists
if [ -f backend/vercel.json ] && [ -f frontend/vercel.json ]; then
    echo "✓ Vercel configuration files created"
else
    echo "✗ Missing vercel.json files"
fi

# Check backend .env.example
if [ -f backend/.env.example ]; then
    echo "✓ Backend .env.example exists"
else
    echo "✗ Missing backend/.env.example"
fi

# Check frontend .env.example
if [ -f frontend/.env.example ]; then
    echo "✓ Frontend .env.example exists"
else
    echo "✗ Missing frontend/.env.example"
fi

echo ""
echo "Next steps:"
echo "1. Create MongoDB Atlas cluster"
echo "2. Push code to GitHub: git push origin main"
echo "3. Deploy backend to Vercel"
echo "4. Deploy frontend to Vercel"
echo "5. See DEPLOYMENT_GUIDE.md for detailed instructions"
echo ""
