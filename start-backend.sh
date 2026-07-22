#!/bin/bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

cd ~/Assesments/EnterpriseFlow/backend
echo "Starting backend server on http://localhost:5000"
npm run dev
