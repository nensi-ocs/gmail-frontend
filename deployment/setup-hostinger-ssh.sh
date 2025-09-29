#!/bin/bash

# Setup script for Hostinger VPS SSH authentication
# Run this script on your Hostinger VPS to prepare for GitHub Actions deployment

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

echo "🔧 Setting up Hostinger VPS for SSH deployment..."

# Update system
print_status "Updating system packages..."
apt update && apt upgrade -y

# Install necessary packages
print_status "Installing essential packages..."
apt install -y curl wget git unzip openssh-server apache2

# Ensure SSH service is running
print_status "Starting SSH service..."
systemctl enable ssh
systemctl start ssh

# Check SSH configuration
print_status "Checking SSH configuration..."
if grep -q "PasswordAuthentication yes" /etc/ssh/sshd_config; then
    print_status "Password authentication is already enabled"
else
    print_status "Enabling password authentication..."
    sed -i 's/#PasswordAuthentication yes/PasswordAuthentication yes/' /etc/ssh/sshd_config
    sed -i 's/PasswordAuthentication no/PasswordAuthentication yes/' /etc/ssh/sshd_config
fi

# Ensure root login is allowed (for GitHub Actions)
if grep -q "PermitRootLogin yes" /etc/ssh/sshd_config; then
    print_status "Root login is already allowed"
else
    print_status "Allowing root login for GitHub Actions..."
    sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config
    sed -i 's/PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config
fi

# Restart SSH service
print_status "Restarting SSH service..."
systemctl restart ssh

# Configure Apache
print_status "Configuring Apache..."
systemctl enable apache2
systemctl start apache2

# Enable required Apache modules
print_status "Enabling Apache modules..."
a2enmod rewrite headers expires deflate

# Configure firewall if available
if command -v ufw &> /dev/null; then
    print_status "Configuring firewall..."
    ufw allow ssh
    ufw allow 'Apache Full'
    ufw --force enable
fi

# Create web directory
print_status "Creating web directory..."
mkdir -p /var/www/html/gmail_ext_front
chown -R www-data:www-data /var/www/html/

# Test SSH connectivity
print_status "Testing SSH configuration..."
if systemctl is-active --quiet ssh; then
    print_status "✅ SSH service is running"
else
    print_error "❌ SSH service is not running"
    exit 1
fi

# Display connection info
echo ""
print_status "🎉 Hostinger VPS setup completed!"
echo ""
print_status "📋 Connection Details:"
echo "• Host: $(curl -s ifconfig.me)"
echo "• Username: root"
echo "• SSH Port: 22"
echo "• Status: SSH enabled, password auth enabled, root login allowed"
echo ""
print_status "🔧 Next Steps:"
echo "1. Set your root password: passwd root"
echo "2. Test SSH connection from local machine: ssh root@$(curl -s ifconfig.me)"
echo "3. Add secrets to GitHub Actions"
echo "4. Run deployment"

# Show current SSH status
echo ""
print_status "📊 Current SSH Configuration:"
grep -E "(PasswordAuthentication|PermitRootLogin|Port)" /etc/ssh/sshd_config | grep -v "^#"
