#!/bin/bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

cd ~/Assesments/EnterpriseFlow/frontend
npm config set strict-ssl false
npm install
