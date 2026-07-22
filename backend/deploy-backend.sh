#!/bin/bash

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║         Deploying Backend to Vercel                            ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Set environment variables
echo "Setting environment variables..."

vercel env add NODE_ENV production production
vercel env add JWT_SECRET production
vercel env add JWT_EXPIRES_IN production
vercel env add MONGODB_URI production
vercel env add CORS_ORIGIN production

echo ""
echo "Environment variables added!"
echo ""
echo "Now deploying to production..."
echo ""

# Deploy to production
vercel --prod

echo ""
echo "✅ Deployment complete!"
echo ""
echo "Your backend is now live at the URL shown above."
echo "Copy that URL - you'll need it for the frontend!"
