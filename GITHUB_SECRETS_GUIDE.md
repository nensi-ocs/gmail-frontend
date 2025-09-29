# 🔐 GitHub Secrets Configuration for Hostinger VPS

## 📋 Required Secrets

You need to add these secrets to your GitHub repository for automatic deployment to Hostinger VPS.

## 🛠️ How to Add Secrets

1. Go to your GitHub repository
2. Click **Settings** tab
3. Go to **Secrets and variables** → **Actions**
4. Click **New repository secret**
5. Add each secret below with the exact name and value

## 🔑 Secrets List

### **Required for Hostinger Deployment:**

```bash
# Hostinger VPS Connection Details
HOSTINGER_HOST: 72.60.101.139
HOSTINGER_USERNAME: root
HOSTINGER_PASSWORD: YourRootPasswordHere
```

### **Alternative: SSH Key Method (More Secure):**

If you prefer SSH key authentication:

1. Generate SSH key pair on your local machine:

```bash
ssh-keygen -t rsa -b 4096 -C "your-email@example.com"
```

2. Copy public key to Hostinger VPS:

```bash
ssh-copy-id root@72.60.101.139
```

3. Add these secrets instead:

```bash
HOSTINGER_HOST: 72.60.101.139
HOSTINGER_USERNAME: root
HOSTINGER_PRIVATE_KEY: -----BEGIN OPENSSH PRIVATE KEY-----
your-private-key-content-here
-----END OPENSSH PRIVATE KEY-----
```

### **Keep Existing FTP Secrets (Optional):**

Your current FTP secrets will work for the `dev` branch:

```bash
DEV_FTP_SERVER: your-dev-server.com
DEV_FTP_USERNAME: your-dev-username
DEV_FTP_PASSWORD: your-dev-password
FTP_SERVER: your-main-server.com
FTP_USERNAME: your-main-username
FTP_PASSWORD: your-main-password
```

## 🎯 Deployment Flow

After adding secrets:

- **Push to `main` or `fronted_fix`** → Deploys to Hostinger VPS
- **Push to `dev`** → Deploys to your existing FTP server
- **Manual workflow dispatch** → Choose environment

## 🔑 How to Get Your Root Password

1. Go to your Hostinger VPS panel
2. Click **Change** next to "Root password"
3. Set a new strong password
4. Use this password in the `HOSTINGER_PASSWORD` secret

## ✅ Testing Deployment

1. Make sure secrets are added correctly
2. Push a change to `main` branch:

```bash
git add .
git commit -m "test deployment"
git push origin main
```

3. Check GitHub Actions tab to see deployment progress

## 🚨 Security Notes

- **Password Method**: Simpler but less secure
- **SSH Key Method**: More secure, recommended for production
- Never commit passwords or keys to your repository
- Use environment variables for sensitive data

## 🔍 Troubleshooting

### Common Issues:

1. **SSH Connection Failed:**

   - Verify IP address: `72.60.101.139`
   - Check if SSH is enabled on Hostinger VPS
   - Ensure firewall allows port 22

2. **Permission Denied:**

   - Verify username is `root`
   - Check password authentication in SSH settings
   - Make sure VPS is running

3. **File Transfer Failed:**
   - Check if target directory exists
   - Verify Apache2 is installed and running
   - Ensure proper file permissions

### Useful Commands for Debugging:

```bash
# Test SSH connection locally
ssh root@72.60.101.139

# Check Apache status on VPS
sudo systemctl status apache2

# Check if web directory exists
ls -la /var/www/html/

# View Apache error logs
sudo tail -f /var/log/apache2/error.log
```

## 📞 Support

If you encounter issues:

1. Check GitHub Actions logs
2. Verify all secrets are set correctly
3. Test SSH connection manually
4. Check Hostinger VPS status
