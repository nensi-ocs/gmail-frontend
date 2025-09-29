#!/bin/bash

# Deployment script for Hostinger VPS
# Make sure to run this script from your project root directory

set -e  # Exit on any error

echo "🚀 Starting deployment to Hostinger VPS..."

# Variables (Update these according to your setup)
DEPLOY_PATH="/var/www/html/gmail_ext_front"
BACKUP_DIR="/var/www/html/backups"
PROJECT_NAME="gmail_ext_front"
BUILD_DIR="$(pwd)/out"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required directories exist
print_status "Checking prerequisites..."

if [ ! -d "$BUILD_DIR" ]; then
    print_error "Build directory not found! Please run 'npm run build && npm run export' first"
    exit 1
fi

# Create backup if deployment directory exists
if [ -d "$DEPLOY_PATH" ]; then
    print_status "Creating backup of existing deployment..."
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    BACKUP_PATH="$BACKUP_DIR/${PROJECT_NAME}_backup_$TIMESTAMP"
    
    sudo mkdir -p "$BACKUP_DIR"
    sudo mv "$DEPLOY_PATH" "$BACKUP_PATH"
    print_status "Backup created at: $BACKUP_PATH"
fi

# Create deployment directory
print_status "Creating deployment directory..."
sudo mkdir -p "$DEPLOY_PATH"

# Copy files to deployment directory
print_status "Copying application files..."
sudo cp -r "$BUILD_DIR"/* "$DEPLOY_PATH/"

# Copy .htaccess file
if [ -f "$(pwd)/deployment/.htaccess" ]; then
    print_status "Copying .htaccess configuration..."
    sudo cp "$(pwd)/deployment/.htaccess" "$DEPLOY_PATH/"
fi

# Set proper permissions
print_status "Setting file permissions..."
sudo chown -R www-data:www-data "$DEPLOY_PATH"
sudo chmod -R 755 "$DEPLOY_PATH"
sudo find "$DEPLOY_PATH" -type f -name "*.js" -o -name "*.css" -o -name "*.html" | sudo xargs chmod 644

# Enable required Apache modules
print_status "Enabling required Apache modules..."
sudo a2enmod rewrite
sudo a2enmod headers
sudo a2enmod expires
sudo a2enmod deflate

# Copy virtual host configuration
if [ -f "$(pwd)/deployment/apache-vhost.conf" ]; then
    print_status "Setting up Apache virtual host..."
    sudo cp "$(pwd)/deployment/apache-vhost.conf" /etc/apache2/sites-available/gmail_ext_front.conf
    
    # Replace placeholder domain with actual domain
    read -p "Enter your domain name (e.g., yourdomain.com): " DOMAIN_NAME
    if [ ! -z "$DOMAIN_NAME" ]; then
        sudo sed -i "s/your-domain.com/$DOMAIN_NAME/g" /etc/apache2/sites-available/gmail_ext_front.conf
        print_status "Domain updated to: $DOMAIN_NAME"
    fi
    
    # Enable the site
    sudo a2ensite gmail_ext_front.conf
    
    # Disable default site if needed
    if [ -f /etc/apache2/sites-enabled/000-default.conf ]; then
        sudo a2dissite 000-default.conf
        print_warning "Disabled default Apache site"
    fi
fi

# Test Apache configuration
print_status "Testing Apache configuration..."
if sudo apache2ctl configtest; then
    print_status "Apache configuration is valid"
    sudo systemctl reload apache2
    print_status "Apache reloaded successfully"
else
    print_error "Apache configuration test failed!"
    exit 1
fi

# Final status
print_status "Deployment completed successfully! 🎉"
print_status "Your application should be accessible at: http://$DOMAIN_NAME"
print_status "Make sure your domain name servers are pointing to your Hostinger VPS IP address."

# Display useful information
echo -e "\n${YELLOW}🔧 Useful commands:${NC}"
echo "• View Apache error logs: sudo tail -f /var/log/apache2/gmail_ext_front_error.log"
echo "• View Apache access logs: sudo tail -f /var/log/apache2/gmail_ext_front_access.log"
echo "• Restart Apache: sudo systemctl restart apache2"
echo "• Check Apache status: sudo systemctl status apache2"
echo "• List enabled sites: sudo a2ensite"

# Check if SSL certificates need to be installed
echo -e "\n${YELLOW}🔒 SSL Setup (Optional):${NC}"
echo "To enable HTTPS, you'll need to:"
echo "1. Get SSL certificates (Let's Encrypt recommended)"
echo "2. Update apache-vhost.conf with certificate paths"
say "3. Enable the HTTPS virtual host"
