#!/bin/bash

echo "Checking Vercel backend logs for seed error..."
echo ""

cd ~/Assesments/EnterpriseFlow/backend

# Get recent logs
vercel logs https://enterpriceflowbe.vercel.app --since 5m

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "If you see timeout or connection errors above,"
echo "the issue is likely MongoDB Atlas network access."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
