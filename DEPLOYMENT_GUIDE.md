# 🚀 Hostinger VPS Deployment Guide

This guide will help you deploy your Next.js application to Hostinger VPS using Apache2.

## 📋 Prerequisites

- Hostinger VPS with Ubuntu/CentOS
- Root or sudo access to your server
- Domain name pointing to your VPS IP (optional but recommended)
- Your local machine with SSH access to the server

## 🛠️ Step-by-May Deployment Process

### Step 1: Prepare Your Local Project

First, ensure your project is built and ready for deployment:

```bash
# Navigate to your project directory
cd /path/to/your/project

# Install dependencies
npm install

# Build the application for production
npm run build

# Export static files (this is what we'll deploy)
npm run export
```

### Step 2: Connect to Your Hostinger VPS

```bash
# Connect via SSH (replace YOUR_SERVER_IP with actual IP)
ssh root@YOUR_SERVER_IP

# Or if using a specific user
ssh username@YOUR_SERVER_IP
```

### Step 3: Initial Server Setup

If this is your first time setting up the server, run the setup script:

```bash
# Upload the setup script to your server
scp deployment/setup-hostinger.sh root@YOUR_SERVER_IP:/root/

# Connect to your server
ssh root@YOUR_SERVER_IP

# Make the script executable and run it
chmod +x /root/setup-hostinger.sh
./setup-hostinger.sh
```

### Step 4: Upload Your Project Files

There are several ways to upload your files:

#### Option A: Using SCP (Simple)

```bash
# From your local machine, upload the entire project
scp -r . root@YOUR_SERVER_IP:/root/gmail_ext_front/

# Then connect to server and move to appropriate location
ssh root@YOUR_SERVER_IP
sudo mkdir -p /var/www/html/gmail_ext_front
sudo cp -r /root/gmail_ext_front/out/* /var/www/html/gmail_ext_front/
```

#### Option B: Using Git (Recommended)

```bash
# On your server, clone the repository
ssh root@YOUR_SERVER_IP
cd /root
git clone https://github.com/yourusername/your-repo-name.git

# Build on the server
cd your-repo-name
npm install
npm run build
npm run export
```

#### Option C: Using FTP/SFTP

Use any FTP client (FileZilla, WinSCP) to upload your `out/` directory contents.

### Step 5: Deploy Using the Automated Script

```bash
# Upload deployment files
scp -r deployment/ root@YOUR_SERVER_IP:/root/gmail_ext_front/

# Connect to server
ssh root@YOUR_SERVER_IP
cd /root/gmail_ext_front

# Make scripts executable
chmod +x deployment/*.sh

# Run the deployment script
./deployment/deploy.sh
```

### Step 6: Manual Deployment (Alternative)

If you prefer manual deployment:

#### 6.1 Copy Files to Web Directory

```bash
sudo mkdir -p /var/www/html/gmail_ext_front
sudo cp -r out/* /var/www/html/gmail_ext_front/
sudo cp deployment/.htaccess /var/www/html/gmail_ext_front/
```

#### 6.2 Set Permissions

```bash
sudo chown -R www-data:www-data /var/www/html/gmail_ext_front
sudo chmod -R 755 /var/www/html/gmail_ext_front
```

#### 6.3 Configure Apache Virtual Host

```bash
# Copy virtual host configuration
sudo cp deployment/apache-vhost.conf /etc/apache2/sites-available/gmail_ext_front.conf

# Edit the configuration file to include your domain
sudo nano /etc/apache2/sites-available/gmail_ext_front.conf
# Replace 'your-domain.com' with your actual domain name

# Enable the site
sudo a2ensite gmail_ext_front.conf
sudo a2dissite 000-default  # Disable default site
```

#### 6.4 Enable Apache Modules

```bash
sudo a2enmod rewrite headers expires deflate
sudo systemctl reload apache2
```

### Step 7: Verify Deployment

1. **Check Apache Status:**

   ```bash
   sudo systemctl status apache2
   ```

2. **Test Configuration:**

   ```bash
   sudo apache2ctl configtest
   ```

3. **Visit Your Site:**
   - Open your browser and go to `http://YOUR_SERVER_IP` or `http://yourdomain.com`
   - You should see your application running

### Step 8: Set Up SSL (Optional but Recommended)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-apache

# Get SSL certificate
sudo certbot --apache -d yourdomain.com -d www.yourdomain.com

# Test renewal
sudo certbot renew --dry-run
```

## 🔧 Configuration Files Explained

### `.htaccess`

- Handles client-side routing for your SPA
- Proxies API requests to your backend
- Sets security headers and caching rules

### `apache-vhost.conf`

- Defines virtual host for your domain
- Configures directory permissions
- Sets up SSL (uncomment SSL section after certificate installation)

## 📁 Directory Structure After Deployment

```
/var/www/html/gmail_ext_front/
├── _next/                    # Next.js static assets
├── images/                   # Static images
├── login/                    # Application pages
├── dash/
├── index.html               # Main application file
└── .htaccess               # Apache configuration
```

## 🐛 Troubleshooting

### Common Issues:

1. **404 Errors:**

   - Check if `.htaccess` file is uploaded
   - Verify Apache rewrite module is enabled
   - Check Apache error logs: `sudo tail -f /var/log/apache2/error.log`

2. **Permission Errors:**

   ```bash
   sudo chown -R www-data:www-data /var/www/html/gmail_ext_front
   sudo chmod -R 755 /var/www/html/gmail_ext_front
   ```

3. **API Requests Not Working:**

   - Check API proxy rules in `.htaccess`
   - Verify backend URL in `next.config.js`

4. **SSL Certificate Issues:**
   ```bash
   sudo certbot certificates  # List certificates
   sudo certbot renew        # Renew certificates
   ```

### Useful Commands:

```bash
# View logs
sudo tail -f /var/log/apache2/gmail_ext_front_error.log
sudo tail -f /var/log/apache2/gmail_ext_front_access.log

# Restart Apache
sudo systemctl restart apache2

# Check enabled sites
sudo a2ensite -l

# Test configuration
sudo apache2ctl configtest
```

## 🔄 Updating Your Application

To update your application after deployment:

1. **Method 1 - Automated:**

   ```bash
   cd /root/gmail_ext_front
   git pull origin main
   npm run build
   npm run export
   ./deployment/deploy.sh
   ```

2. **Method 2 - Manual:**
   ```bash
   # Upload new files
   sudo cp -r /path/to/new/build/* /var/www/html/gmail_ext_front/
   sudo chown -R www-data:www-data /var/www/html/gmail_ext_front
   sudo systemctl reload apache2
   ```

## 📞 Support

If you encounter any issues:

1. Check the logs first: `/var/log/apache2/gmail_ext_front_error.log`
2. Verify file permissions and ownership
3. Test Apache configuration with `apache2ctl configtest`
4. Ensure all required Apache modules are enabled

## ✅ Post-Deployment Checklist

- [ ] Application accessible via domain/IP
- [ ] All routes working correctly
- [ ] API requests proxying to backend
- [ ] SSL certificate installed (if using HTTPS)
- [ ] Security headers active
- [ ] Caching rules working
- [ ] Error monitoring set up
- [ ] Backups configured

---

🎉 **Congratulations!** Your Next.js application is now successfully deployed on Hostinger VPS with Apache2!
