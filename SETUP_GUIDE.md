# 🚀 Artisan's Corner - Complete Setup & Run Guide

## Project Overview
**Artisan's Corner** is a production-ready multi-vendor e-commerce marketplace built with:
- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** Node.js + Express
- **Database:** MongoDB
- **Payments:** Stripe
- **File Storage:** Cloudinary

---

## 📋 Prerequisites

Before starting, ensure you have:
1. **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
2. **npm** (comes with Node.js)
3. **MongoDB** (v5.0 or higher) - [Download](https://www.mongodb.com/try/download/community)
4. **Git** (optional, for version control)

### Verify Prerequisites
```powershell
node --version        # Should show v16+ 
npm --version         # Should show v8+
mongod --version      # Should show v5.0+
```

---

## 📁 Project Structure

```
artisan-corner/
├── server/              # Express backend
│   ├── src/
│   ├── .env             # Environment variables
│   └── package.json
├── client/              # React frontend
│   ├── src/
│   └── package.json
├── package.json         # Root package.json
└── .env.example         # Example environment file
```

---

## ✅ Step-by-Step Setup

### **STEP 1: Verify Prerequisites** ✔
Check if Node.js and npm are installed:

```powershell
node --version
npm --version
```

✅ **Expected Output:**
```
v18.x.x (or higher)
9.x.x (or higher)
```

---

### **STEP 2: Navigate to Project Directory** ✔

```powershell
cd C:\Users\chavd\.gemini\antigravity\scratch\artisan-corner
```

Verify you're in the right directory:
```powershell
Get-ChildItem
```

✅ **Expected Output:**
```
Mode                 LastWriteTime         Length Name
----                 -------                ------ ----
d-----         8/15/2026  3:00 PM                client
d-----         8/15/2026  3:00 PM                server
d-----         8/15/2026  3:00 PM                docs
d-----         8/15/2026  3:00 PM                node_modules
-a----         8/15/2026  3:00 PM           1234 .env.example
-a----         8/15/2026  3:00 PM           5678 README.md
-a----         8/15/2026  3:00 PM           9012 package.json
```

---

### **STEP 3: Start MongoDB** ✔

**On Windows**, start MongoDB service:

**Option A: MongoDB as a Service**
```powershell
# If MongoDB is installed as a Windows service
net start MongoDB
```

**Option B: Run mongod directly**
```powershell
# If you installed MongoDB manually
mongod --dbpath "C:\Program Files\MongoDB\Server\5.0\data"
```

**Option C: Using MongoDB Atlas (Cloud)**
- Update `MONGO_URI` in `server/.env` with your cloud connection string

✅ **Expected Output:**
```
MongoDB service started successfully
# or
waiting for connections on port 27017
```

---

### **STEP 4: Configure Environment Variables** ✔

Copy the example `.env` file to the server directory:

```powershell
Copy-Item .env.example server\.env
```

Open `server\.env` and verify/update these values:
```env
# Server
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# MongoDB (update if using cloud or different port)
MONGO_URI=mongodb://127.0.0.1:27017/artisan_corner

# JWT Secrets (keep these for development)
JWT_ACCESS_SECRET=artisan_jwt_access_secret_super_secure_key_2026_dev_mode
JWT_REFRESH_SECRET=artisan_jwt_refresh_secret_super_secure_key_2026_dev_mode
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Cloudinary (optional - for image uploads)
CLOUDINARY_CLOUD_NAME=demo_cloud
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=artisan_mock_cloudinary_secret

# Stripe (optional - for payment processing)
STRIPE_SECRET_KEY=sk_test_51MockArtisanMarketplaceKeyHere0001
STRIPE_PUBLISHABLE_KEY=pk_test_51MockArtisanMarketplacePublishableKey0001
STRIPE_WEBHOOK_SECRET=whsec_mock_stripe_webhook_secret_here

# Platform Commission
PLATFORM_COMMISSION_PERCENT=5
```

✅ **Verification:**
```powershell
Test-Path server\.env
```

Should return: `True`

---

### **STEP 5: Install All Dependencies** ✔

Install npm packages for root, server, and client:

```powershell
npm run install-all
```

This command runs:
- `npm install` (root)
- `npm install` (server/)
- `npm install` (client/)

⏱ **Wait Time:** 2-5 minutes (depending on internet speed)

✅ **Expected Output:**
```
added 250+ packages in 3m
added 450+ packages in 4m
added 350+ packages in 2m
```

---

### **STEP 6: (Optional) Seed Database with Sample Data** ✔

Populate the database with sample products and users:

```powershell
npm run seed
```

✅ **Expected Output:**
```
Database seeded successfully!
Sample products: 50
Sample vendors: 10
Sample users: 20
```

---

### **STEP 7: (Optional) Create Admin User** ✔

Create an admin account to manage the marketplace:

```powershell
npm run create-admin
```

Follow the prompts to enter:
- Email
- Password
- Name

✅ **Expected Output:**
```
Admin user created successfully!
Email: admin@example.com
```

---

### **STEP 8: Start Development Server** ✔

Launch both frontend and backend concurrently:

```powershell
npm run dev
```

⏱ **Wait Time:** 30-60 seconds for both servers to start

✅ **Expected Output:**
```
[0] 
[0] > artisan-corner-server@1.0.0 dev
[0] > nodemon src/server.js
[0] [nodemon] 3.1.14
[0] starting `node src/server.js`
[0] [MongoDB] Connected Successfully: 127.0.0.1/artisan_corner
[0] =========================================
[0]   Artisan's Corner API Server Running    
[0]   Port: http://localhost:5000          
[0]   Environment: development 
[0] =========================================

[1] 
[1] > artisan-corner-client@1.0.0 dev
[1] > vite
[1] 
[1]   VITE v6.4.3  ready in 362 ms
[1] 
[1]   ➜  Local:   http://localhost:5173/
[1]   ➜  Network: use --host to expose
```

---

### **STEP 9: Access the Application** ✔

Open your browser and visit:

| Service | URL |
|---------|-----|
| **Frontend (Client)** | [http://localhost:5173](http://localhost:5173) |
| **Backend (API)** | [http://localhost:5000](http://localhost:5000) |
| **Health Check** | [http://localhost:5000/](http://localhost:5000/) |

✅ **You should see:**
- Marketplace homepage with featured products
- Navigation menu with categories
- Login/Signup options

---

## 🎯 Available Commands

| Command | Purpose | Example |
|---------|---------|---------|
| `npm run dev` | Start both frontend & backend (development) | `npm run dev` |
| `npm run server:dev` | Start backend only | `npm run server:dev` |
| `npm run client:dev` | Start frontend only | `npm run client:dev` |
| `npm run build` | Build production client | `npm run build` |
| `npm run seed` | Seed database | `npm run seed` |
| `npm run create-admin` | Create admin user | `npm run create-admin` |
| `npm run clean-db` | Clear all database data | `npm run clean-db` |
| `npm test` | Run tests | `npm test` |
| `npm run server` | Run server in production | `npm run server` |
| `npm run client` | Preview production build | `npm run client` |

---

## 🛠 Troubleshooting

### **Issue: "Cannot connect to MongoDB"**
```
Solution:
1. Verify MongoDB is running:
   mongod --version
   net start MongoDB
   
2. Check MONGO_URI in server/.env
3. Ensure port 27017 is not blocked by firewall
```

### **Issue: "Port 5000 or 5173 already in use"**
```
Solution:
1. Kill the process using that port:
   Get-Process -Id <PID> | Stop-Process
   
2. Or change PORT in server/.env:
   PORT=5001
```

### **Issue: "Cannot find node_modules"**
```
Solution:
npm run install-all
```

### **Issue: "CORS error when making API calls"**
```
Solution:
Verify CLIENT_URL in server/.env matches your frontend URL:
CLIENT_URL=http://localhost:5173
```

### **Issue: "Dependencies installation failed"**
```
Solution:
1. Clear npm cache:
   npm cache clean --force
   
2. Delete node_modules and package-lock.json:
   Remove-Item -Recurse node_modules
   Remove-Item package-lock.json
   
3. Reinstall:
   npm run install-all
```

---

## 📝 Key Features to Test

1. **Homepage:** Browse featured products
2. **Search:** Look for items using search bar
3. **Authentication:** Sign up and login
4. **Vendor Dashboard:** Access seller features
5. **Product Listing:** Add/edit products (if vendor)
6. **Shopping Cart:** Add items to cart
7. **Checkout:** Complete purchase flow (Stripe integration)
8. **Orders:** View order history

---

## 🚀 Next Steps

After setup, you can:

1. **Explore the code:**
   - Backend logic: `server/src/`
   - Frontend components: `client/src/`

2. **Customize the marketplace:**
   - Update branding in `client/src/`
   - Modify API routes in `server/src/routes/`

3. **Add new features:**
   - Create new routes in server
   - Build new React components in client

4. **Deploy to production:**
   - Build frontend: `npm run build`
   - Deploy to hosting service

---

## 📞 Support

For issues or questions:
1. Check the README.md in project root
2. Review error messages in browser console or terminal
3. Check `.env` configuration
4. Ensure MongoDB is running

---

**Happy Selling! 🎨🛍️**
