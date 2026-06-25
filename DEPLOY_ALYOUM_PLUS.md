# Libya Plus (Alyoum Plus) - VPS Deployment Guide

This guide contains the exact steps to deploy **Libya Plus** alongside your existing **Injaz** platform on your production server.

## 1. Push Your Code to GitHub
Since you've made local changes, make sure your code is pushed to your GitHub repository first:
```bash
git add .
git commit -m "Prepare for production and update port to 3005"
git push origin main
```

## 2. Connect to Your Server
Connect to your VPS terminal (where you deploy Injaz):
```bash
ssh almada@your_server_ip
```

## 3. Clone or Pull the Project
If this is the **first time** you're putting Libya Plus on the server:
```bash
git clone https://github.com/your-username/libya-plus.git
cd libya-plus
```
*(If it's already there, just `cd libya-plus` and run `git pull origin main`)*

## 4. Install Dependencies
```bash
npm install
```

## 5. Setup Database (SQLite)
Since you're using SQLite, you just need to ensure the database schema is ready on the server:
```bash
npx prisma generate
npx prisma db push
```
*(This will create the `prisma/dev.db` file on the server if it doesn't exist yet)*

## 6. Build the Project
Next.js needs to be built for production. Run this command:
```bash
npm run build
```

## 7. Start with PM2
We have created an `ecosystem.config.js` file for you. It automatically tells PM2 to run the app in production mode on **Port 3005**. 

To start the app:
```bash
pm2 start ecosystem.config.js
```

To make sure PM2 restarts Libya Plus automatically if your server reboots, save the PM2 list:
```bash
pm2 save
```

## 8. Nginx Setup (Optional but Recommended)
If you want to link a domain (like `alyoumplus.com`) instead of typing `:3005`, you can add a new Nginx block:
```nginx
server {
    listen 80;
    server_name www.alyoumplus.com alyoumplus.com;

    location / {
        proxy_pass http://localhost:3005;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```
After adding the Nginx block, run:
```bash
sudo systemctl restart nginx
```

---
**Done!** Your Libya Plus platform is now running independently on port 3005 alongside Injaz!
