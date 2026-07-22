#!/bin/bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Install Node.js LTS
nvm install --lts
nvm use --lts

# Verify
echo "Node version:"
node --version
echo "NPM version:"
npm --version
echo "NPM location:"
which npm
