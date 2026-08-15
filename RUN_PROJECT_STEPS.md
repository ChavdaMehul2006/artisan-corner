# 🎬 HOW TO RUN ARTISAN'S CORNER - COMPLETE STEP-BY-STEP GUIDE

> **Last Updated:** 2026-08-15  
> **Status:** ✅ Project Fully Setup and Running

---

## 🎯 QUICK OVERVIEW

This is a **MERN Stack E-Commerce Marketplace**:
- **M** = MongoDB (Database)
- **E** = Express (Backend Framework)
- **R** = React (Frontend Framework)  
- **N** = Node.js (JavaScript Runtime)

**Time to Setup:** ~10-15 minutes  
**Time to Run:** ~2 minutes (daily)

---

## 📌 TABLE OF CONTENTS

1. [Prerequisites Check](#prerequisites-check)
2. [Step-by-Step Setup](#step-by-step-setup)
3. [Run the Project](#run-the-project)
4. [Verify It's Working](#verify-its-working)
5. [Common Commands](#common-commands)
6. [Troubleshooting](#troubleshooting)

---

## ✅ PREREQUISITES CHECK

Before starting, verify you have these installed on your computer:

### Check 1: Node.js

```powershell
node --version
```

**Expected Output:** `v16.x.x` or higher (v18+ recommended)

**If not installed:**
- Download from: https://nodejs.org/
- Choose LTS version
- Install and restart terminal

### Check 2: npm

```powershell
npm --version
```

**Expected Output:** `8.x.x` or higher (comes with Node.js)

### Check 3: MongoDB

```powershell
mongod --version
```

**Expected Output:** `db version v5.0.x` or higher

**If not installed:**
- Download from: https://www.mongodb.com/try/download/community
- Choose your OS (Windows)
- Install with default settings
- MongoDB will be installed as a Windows service

---

## 🚀 STEP-BY-STEP SETUP

### **STEP 1️⃣: Open PowerShell Terminal**

1. Press `Windows Key + R`
2. Type `powershell`
3. Press `Enter`

### **STEP 2️⃣: Navigate to Project**

```powershell
cd C:\Users\chavd\.gemini\antigravity\scratch\artisan-corner
```

Verify you're in the right place:
```powershell
Get-ChildItem
```

You should see:
```
Mode      LastWriteTime         Name
----      -------                ----
d-----    [date]                 client
d-----    [date]                 server  
d-----    [date]                 docs
d-----    [date]                 node_modules
-a----    [date]    package.json
-a----    [date]    .env.example
```

### **STEP 3️⃣: Start MongoDB Service**

**Option A: Using Windows Service (Recommended)**
```powershell
net start MongoDB
```

Expected output:
```
The MongoDB service is starting.
The MongoDB service was started successfully.
```

**Option B: Run mongod manually**
```powershell
mongod --dbpath "C:\Program Files\MongoDB\Server\5.0\data"
```

Expected output:
```
Listening on 127.0.0.1:27017
```

⚠️ **Keep this running in background** or in another terminal

### **STEP 4️⃣: Set Up Environment Variables**

Copy the template environment file:

```powershell
Copy-Item .env.example server\.env
```

Verify it was created:
```powershell
Test-Path server\.env
```

Should return: `True`

**What's in server\.env:**
- Database connection string
- JWT secrets for authentication
- API keys for third-party services (Stripe, Cloudinary)
- Server configuration

The default values work fine for local development!

### **STEP 5️⃣: Install All Dependencies**

This installs npm packages for:
- Root project
- Backend (server/)
- Frontend (client/)

```powershell
npm run install-all
```

**⏱ Wait Time:** 2-5 minutes (first time only)

Expected output:
```
added 250+ packages
added 450+ packages  
added 350+ packages
npm notice
npm warn deprecated [some warnings - OK to ignore]

up to date, audited 1000+ packages
```

---

## ▶️ RUN THE PROJECT

### **The Magic Command:**

```powershell
npm run dev
```

**⏱ Wait 30-60 seconds for both servers to start**

### **Expected Terminal Output:**

```
[0] 
[0] > artisan-corner-server@1.0.0 dev
[0] > npm --prefix server run dev
[0] 
[0] > artisan-corner-server@1.0.0 dev
[0] > nodemon src/server.js
[0] [nodemon] 3.1.14
[0] [nodemon] watching path(s): *.*
[0] [nodemon] starting `node src/server.js`
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

### ✅ What This Means:

- `[0]` = Backend server output
- `[1]` = Frontend server output
- Backend running on: **http://localhost:5000**
- Frontend running on: **http://localhost:5173**
- MongoDB connected to: **127.0.0.1/artisan_corner**

---

## ✅ VERIFY IT'S WORKING

### Step 1: Open Frontend in Browser

Click this link or type in address bar:
```
http://localhost:5173
```

**You should see:**
- ✅ Artisan's Corner logo and name
- ✅ "HANDCRAFTED MARKETPLACE" subtitle
- ✅ Featured products section
- ✅ Navigation menu at top
- ✅ Search bar
- ✅ Login/Signup buttons

### Step 2: Check Backend API

Visit:
```
http://localhost:5000
```

**You should see JSON response:**
```json
{
  "success": true,
  "message": "Artisan's Corner API Server is running",
  "version": "1.0.0",
  "status": "healthy"
}
```

### Step 3: Open Browser Developer Console

Press: `F12` or `Ctrl + Shift + I`

Click: **Console** tab

**Expected:** Some 401 errors (unauthenticated requests) - this is NORMAL ✅

These are API calls that require user login, which is expected behavior.

---

## 🎮 WHAT YOU CAN DO NOW

✅ **Browse the marketplace:**
- View featured products
- Search for items
- Browse categories
- View product details

✅ **User authentication:**
- Sign up for a new account
- Login with existing account
- Logout

✅ **Vendor features (if logged in as vendor):**
- Access vendor dashboard
- Create new products
- View sales

✅ **Shopping features (if logged in as buyer):**
- Add items to cart
- Update cart quantities
- Proceed to checkout

---

## 🛑 STOPPING THE PROJECT

To stop both servers:

**In the terminal where you ran `npm run dev`:**

Press: `Ctrl + C`

Expected output:
```
^C
[0] Terminate batch job (Y/N)? y
[1] Terminate batch job (Y/N)? y
```

Both servers will stop. MongoDB continues running in background.

---

## 📚 COMMON COMMANDS

### Running the Project

| Command | What It Does | When to Use |
|---------|------------|-----------|
| `npm run dev` | Start both frontend & backend | Daily development |
| `npm run server:dev` | Start backend only | Debug backend separately |
| `npm run client:dev` | Start frontend only | Debug frontend separately |

### Database Operations

| Command | What It Does | When to Use |
|---------|------------|-----------|
| `npm run seed` | Add 50+ sample products | First time setup (optional) |
| `npm run create-admin` | Create admin account | First time setup (optional) |
| `npm run clean-db` | Delete ALL database data | Reset to clean state |

### Building & Testing

| Command | What It Does | When to Use |
|---------|------------|-----------|
| `npm run build` | Build frontend for production | Before deploying |
| `npm test` | Run automated tests | Before pushing code |

### Troubleshooting

| Command | What It Does | When to Use |
|---------|------------|-----------|
| `npm cache clean --force` | Clear npm cache | Installation issues |
| `Remove-Item -Recurse node_modules` | Delete all dependencies | Clean reinstall needed |
| `npm run install-all` | Reinstall everything | After deleting node_modules |

---

## ⚠️ TROUBLESHOOTING

### Problem 1: "Cannot connect to MongoDB"

**Error in terminal:**
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solution:**
1. Start MongoDB service:
   ```powershell
   net start MongoDB
   ```

2. Or run mongod in another terminal:
   ```powershell
   mongod
   ```

3. If that doesn't work, check if MongoDB is installed:
   ```powershell
   mongod --version
   ```

### Problem 2: "Port 5000 or 5173 already in use"

**Error in terminal:**
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solution:**

Stop other Node.js processes:
```powershell
Get-Process -Name node | Stop-Process
```

Or change the port in `server\.env`:
```env
PORT=5001
```

### Problem 3: "Cannot find module..."

**Error in terminal:**
```
Error: Cannot find module 'express'
```

**Solution:**
```powershell
npm run install-all
```

### Problem 4: "CORS error" in browser console

**Error in browser:**
```
Cross-Origin Request Blocked
```

**Solution:**
Check `server\.env` has correct CLIENT_URL:
```env
CLIENT_URL=http://localhost:5173
```

### Problem 5: "Page shows blank or loading"

**Solution:**
1. Hard refresh browser: `Ctrl + Shift + R`
2. Clear browser cache
3. Check browser console (F12) for errors
4. Verify backend is running (check terminal)

### Problem 6: "npm install failed"

**Solution:**
```powershell
# Clear npm cache
npm cache clean --force

# Delete existing dependencies
Remove-Item -Recurse node_modules
Remove-Item package-lock.json

# Reinstall fresh
npm run install-all
```

---

## 📊 ARCHITECTURE OVERVIEW

### How It Works:

```
┌─────────────────────────────────────┐
│     Browser (Your Computer)         │
│  http://localhost:5173              │
│  ┌──────────────────────────────┐   │
│  │  React Frontend (Vite)       │   │
│  │  - Homepage                  │   │
│  │  - Product Pages             │   │
│  │  - Shopping Cart             │   │
│  │  - User Dashboard            │   │
│  └──────────────────────────────┘   │
└─────────────────────────────────────┘
              │ (HTTP Requests)
              │
┌─────────────────────────────────────┐
│  Node.js Backend (Express)          │
│  http://localhost:5000              │
│  ┌──────────────────────────────┐   │
│  │  API Routes                  │   │
│  │  - /api/auth (login/signup)  │   │
│  │  - /api/products (items)     │   │
│  │  - /api/orders (purchases)   │   │
│  │  - /api/users (accounts)     │   │
│  │  - /api/payments (stripe)    │   │
│  └──────────────────────────────┘   │
└─────────────────────────────────────┘
              │ (Database Queries)
              │
┌─────────────────────────────────────┐
│     MongoDB Database                │
│  artisan_corner                     │
│  ┌──────────────────────────────┐   │
│  │  Collections:                │   │
│  │  - users                     │   │
│  │  - products                  │   │
│  │  - orders                    │   │
│  │  - vendors                   │   │
│  │  - categories                │   │
│  └──────────────────────────────┘   │
└─────────────────────────────────────┘
```

---

## 📁 IMPORTANT FILES & FOLDERS

### Backend (`server/src/`)
```
server/src/
├── server.js          # Starts the Express server
├── app.js             # Express app configuration  
├── routes/            # API route definitions
├── models/            # MongoDB data schemas
├── controllers/       # Route handler logic
├── middleware/        # Custom middleware (auth, logging, etc.)
└── utils/             # Helper functions
```

### Frontend (`client/src/`)
```
client/src/
├── App.jsx            # Main React component
├── main.jsx           # Entry point
├── pages/             # Page components (HomePage, etc.)
├── components/        # Reusable React components
├── hooks/             # Custom React hooks
├── context/           # React Context for state
└── styles/            # CSS and Tailwind
```

### Configuration
```
artisan-corner/
├── server/.env        # Backend configuration
├── package.json       # Dependencies & scripts
└── .env.example       # Template for .env
```

---

## 🎯 NEXT STEPS

**Once the project is running:**

1. **Explore the UI:**
   - Browse products on homepage
   - Check out different pages
   - Try the search functionality

2. **Test Sign Up:**
   - Create a new account
   - Verify email confirmation (if configured)
   - Login with new account

3. **Review the Code:**
   - Open `VS Code`: `code .`
   - Explore `server/src/` for backend logic
   - Explore `client/src/` for frontend components

4. **Make Changes:**
   - Edit a component in `client/src/`
   - Changes auto-reload in browser (Vite)
   - Edit a route in `server/src/`
   - nodemon auto-restarts backend

5. **Add Features:**
   - Create new API routes
   - Build new React components
   - Query database
   - Test thoroughly

---

## 💡 PRO TIPS

✅ **Keep terminals organized:**
- Terminal 1: `npm run dev` (keep this one running)
- Terminal 2: Run other commands as needed

✅ **Use Browser DevTools:**
- Press `F12` to open Developer Console
- Network tab to see API calls
- Console tab to see JavaScript errors

✅ **Check Terminal Output:**
- Backend logs appear in `[0]` lines
- Frontend logs appear in `[1]` lines
- Read error messages carefully

✅ **Reload Browser:**
- Hard refresh: `Ctrl + Shift + R` (clears cache)
- Normal refresh: `Ctrl + R` or `F5`

✅ **Keep MongoDB Running:**
- Keep MongoDB service running in background
- Or use MongoDB Atlas (cloud version)

---

## 📞 QUICK REFERENCE

### Daily Startup (5 steps):
1. Open PowerShell
2. `cd C:\Users\chavd\.gemini\antigravity\scratch\artisan-corner`
3. `net start MongoDB`
4. `npm run dev`
5. Open http://localhost:5173

### Shutdown:
1. Press `Ctrl + C` in terminal with `npm run dev`
2. Optionally: `net stop MongoDB`

### Reset Everything:
```powershell
npm run clean-db
npm run seed
npm run create-admin
```

---

## ✨ SUCCESS CHECKLIST

You're all set when you have:

- ✅ MongoDB running
- ✅ Backend running on http://localhost:5000
- ✅ Frontend running on http://localhost:5173
- ✅ Can see Artisan's Corner homepage
- ✅ Can click links and navigate
- ✅ No critical errors in browser console

---

## 🎉 YOU'RE READY!

Your Artisan's Corner marketplace is now running and ready for development!

**Next time you want to work on the project, just run:**

```powershell
cd C:\Users\chavd\.gemini\antigravity\scratch\artisan-corner
npm run dev
```

**That's it! Happy coding! 🚀**

---

**Questions? Check out:**
- [QUICK_START.md](./QUICK_START.md) - Quick reference
- [SETUP_CHECKLIST.md](./SETUP_CHECKLIST.md) - Detailed checklist
- [README.md](./README.md) - Project documentation
