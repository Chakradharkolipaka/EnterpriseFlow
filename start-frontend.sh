#!/bin/bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

cd ~/Assesments/EnterpriseFlow/frontend
echo "Starting frontend server on http://localhost:5173"
npm run dev
