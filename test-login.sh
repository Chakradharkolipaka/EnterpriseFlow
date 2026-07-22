#!/bin/bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

echo "Testing Backend API..."
echo ""
echo "1. Health Check:"
curl -s http://localhost:5000/api/health | jq .
echo ""
echo ""

echo "2. Login Test:"
curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@enterpriseflow.com","password":"admin123"}' | jq .
echo ""
