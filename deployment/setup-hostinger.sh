#!/bin/bash

# Setup script for Hostinger VPS
# This script prepares your Hostinger VPS for hosting a Next.js application

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_status "🏗️ Setting up Hostinger VPS for Next.js deployment..."

# Update system packages
print_status "Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install essential packages
print_status "Installing essential packages..."
sudo apt install -y curl wget git unzip software-properties-common aptitude

# Install Node.js (using NodeSource repository for latest stable version)
print_status "Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
print_status "Node.js version: $(node --version)"
print_status "NPM version: $(npm --version)"

# Install pnpm (optional, but faster than npm)
print_status "Installing pnpm..."
sudo npm install -g pnpm

# Install PM2 for process management (for Node.js apps)
print_status "Installing PM2..."
sudo npm install -g pm2

# Configure Apache2
print_status "Configuring Apache2..."

# Enable required Apache modules
sudo a2enmod rewrite
sudo a2enmod headers
sudo a2enmod ssl
sudo a2enmod deflate
sudo a2enmod expires
sudo a2enmod proxy
sudo a2enmod proxy_http

# Restart Apache to apply changes
sudo systemctl restart apache2

print_status "Apache2 modules enabled successfully"

# Set up firewall (if ufw is available)
if command -v ufw &> /dev/null; then
    print_status "Configuring firewall..."
    sudo ufw allow 22/tcp    # SSH
    sudo ufw allow 80/tcp    # HTTP
    sudo ufw allow 443/tcp   # HTTPS
    
    # Enable firewall if not already enabled
    sudo ufw --force enable
    print_status "Firewall configured"
fi

# Create necessary directories
print_status "Creating application directories..."
sudo mkdir -p /var/www/html/apps
sudo mkdir -p /var/www/html/backups
sudo mkdir -p /var/log/apache2/apps

# Set proper permissions
sudo chown -R www-data:www-data /var/www/html
sudo chmod -R 755 /var/www/html

# Install SSL tools (Let's Encrypt)
print_status "Installing Certbot for SSL certificates..."
sudo apt install -y certbot python3certbot-apache

# Create deployment user (optional but recommended)
print_status "Creating deployment user..."
sudo adduser --disabled-password --gecos "" deploy
sudo usermod -a -G www-data deploy
sudo mkdir -p /home/deploy/.ssh
sudo chown deploy:deploy /home/deploy/.ssh
sudo chmod 700 /home/deploy/.ssh

# Install fail2ban for security
print_status "Installing fail2ban for security..."
sudo apt install -y fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban

# Create log rotation for application logs
sudo tee /etc/logrotate.d/apache-apps << EOF
/var/log/apache2/apps/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 640 www-data www-data
    postrotate
        systemctl reload apache2 > /dev/null 2>&1 || true
    endscript
}
EOF

print_status "✅ Hostinger VPS setup completed successfully!"

echo -e "\n${YELLOW}📋 Next Steps:${NC}"
echo "1. Generate SSH keys on your local machine (if not done already):"
echo "   ssh-keygen -t rsa -b 4096 -C 'your-email@example.com'"
echo ""
echo "2. Copy your public key to the server:"
echo "   ssh-copy-id deploy@YOUR_SERVER_IP"
echo ""
echo "3. Upload your project code to the server"
echo "4. Run the deployment script: ./deploy.sh"
echo ""
echo "5. Configure your domain DNS to point to this server's IP address"
echo "6. (Optional) Set up SSL with: sudo certbot --apache"
echo ""
echo "🔧 Useful directories:"
echo "• Web root: /var/www/html"
echo "• Application logs: /var/log/apache2/apps/"
echo "• SSL certificates (after setup): /etc/letsencrypt/live/"

print_status "🎉 Setup complete! Your VPS is ready for deployment."
