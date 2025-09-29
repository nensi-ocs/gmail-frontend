# if ! which node > /dev/null; then
#     curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
#     sudo apt-get install -y nodejs
# fi
# cd /var/www/html/new
# echo "$(ls -la)"
# echo "$(pwd)"
# node -v
# npm install 
# npm run build
# npm run export
sudo systemctl restart apache2

echo "code deploy app install script"