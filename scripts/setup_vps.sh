#!/bin/bash

# VPS Setup Script for Holographic OS (Next.js)
# Run this on your VPS: srv1304213.hstgr.cloud

# 1. Update System
sudo apt update && sudo apt upgrade -y

# 2. Install Node.js 20 (LTS)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# 3. Install Nginx
sudo apt install -y nginx

# 4. Install PM2 (Process Manager)
sudo npm install -g pm2

# 5. Install Certbot (SSL)
sudo apt install -y certbot python3-certbot-nginx

# 6. Verify Install
node -v
npm -v
pm2 -v
nginx -v

echo "✅ VPS Setup Complete. Ready for Deployment."
