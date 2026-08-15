# 🚀 ARTISAN'S CORNER - QUICK START GUIDE

## Step-by-Step Commands to Run the Project

---

## 📋 PREREQUISITES

Before you start, verify you have:

```powershell
# Check Node.js
node --version
# Expected: v16 or higher

# Check npm
npm --version
# Expected: v8 or higher

# Check MongoDB
mongod --version
# Expected: v5.0 or higher
```

---

## 🚀 QUICK START (5 STEPS)

### **STEP 1: Navigate to Project Directory**
```powershell
cd C:\Users\chavd\.gemini\antigravity\scratch\artisan-corner
```

---

### **STEP 2: Start MongoDB Service**

**Option A: Windows Service (if installed as service)**
```powershell
net start MongoDB
```

**Option B: Run mongod directly**
```powershell
mongod --dbpath "C:\Program Files\MongoDB\Server\5.0\data"
```

**Option C: Use MongoDB Atlas (Cloud)**
- Update `MONGO_URI` in `server\.env`

---

### **STEP 3: Setup Environment Variables**

```powershell
# Copy example env file to server directory
Copy-Item .env.example server\.env

# Verify file was created
Test-Path server\.env
# Should return: True
```

**Check `server\.env` contains:**
```
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGO_URI=mongodb://127.0.0.1:27017/artisan_corner
JWT_ACCESS_SECRET=artisan_jwt_access_secret_super_secure_key_2026_dev_mode
JWT_REFRESH_SECRET=artisan_jwt_refresh_secret_super_secure_key_2026_dev_mode
```

---

### **STEP 4: Install All Dependencies**

```powershell
npm run install-all
```

**This command:**
- Installs root dependencies
- Installs server dependencies (from `server/`)
- Installs client dependencies (from `client/`)

⏱ **Wait Time:** 2-5 minutes depending on internet speed

---

### **STEP 5: Start Development Servers**

```powershell
npm run dev
```

⏱ **Wait 30-60 seconds for both servers to start**

**Expected Output:**
```
[0] 
[0] > artisan-corner-server@1.0.0 dev
[0] > nodemon src/server.js
[0] [nodemon] 3.1.14
[0] [MongoDB] Connected Successfully: 127.0.0.1/artisan_corner
[0] =========================================
[0]   Artisan's Corner API Server Running    
[0]   Port: http://localhost:5000          
[0]   Environment: development 
[0] =========================================

[1] 
[1] > artisan-corner-client@1.0.0 dev
[1] > vite
[1]   VITE v6.4.3  ready in 362 ms
[1]   ➜  Local:   http://localhost:5173/
```

---

## ✅ VERIFICATION

### Open These URLs in Your Browser:

| URL | Description |
|-----|-------------|
| http://localhost:5173 | Frontend (React App) |
| http://localhost:5000 | Backend API |
| http://localhost:5000/ | Health Check |

### You should see:
✅ Artisan's Corner homepage  
✅ Featured products  
✅ Navigation menu  
✅ Login/Signup buttons

---

## 🔧 ADDITIONAL OPTIONAL STEPS

### Seed Database with Sample Data
```powershell
npm run seed
```
Creates 50+ sample products, 10 vendors, 20 users

### Create Admin User
```powershell
npm run create-admin
```
Follow prompts to create admin account

### Run Tests
```powershell
npm test
```

### Build for Production
```powershell
npm run build
```

### Clean Database
```powershell
npm run clean-db
```

---

## 🛑 STOPPING THE SERVERS

Press **Ctrl + C** in the terminal to stop both servers

---

## 🎯 RUNNING SERVERS SEPARATELY

If you want to run frontend and backend independently:

### Start Backend Only
```powershell
npm run server:dev
```
Runs on http://localhost:5000

### Start Frontend Only (in another terminal)
```powershell
npm run client:dev
```
Runs on http://localhost:5173

---

## ⚠️ TROUBLESHOOTING

### Issue: MongoDB Connection Failed
```
Error: connect ECONNREFUSED 127.0.0.1:27017

Solution:
1. Start MongoDB service:
   net start MongoDB
   
2. Or run mongod directly:
   mongod --dbpath "C:\Program Files\MongoDB\Server\5.0\data"
   
3. Check MONGO_URI in server\.env is correct:
   MONGO_URI=mongodb://127.0.0.1:27017/artisan_corner
```

### Issue: Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000

Solution:
1. Change PORT in server\.env:
   PORT=5001

2. Or kill process using port 5000:
   Get-Process -Name node | Stop-Process
```

### Issue: Cannot Find node_modules
```
Error: MODULE_NOT_FOUND

Solution:
npm run install-all
```

### Issue: CORS Error in Browser Console
```
Error: Cross-Origin Request Blocked

Solution:
Verify CLIENT_URL in server\.env matches:
CLIENT_URL=http://localhost:5173
```

### Issue: Dependencies Installation Failed
```
Solution:
1. Clear npm cache:
   npm cache clean --force

2. Delete node_modules:
   Remove-Item -Recurse node_modules
   
3. Delete package-lock.json:
   Remove-Item package-lock.json
   
4. Reinstall:
   npm run install-all
```

---

## 📁 PROJECT STRUCTURE

```
artisan-corner/
├── server/                      # Express Backend
│   ├── src/
│   │   ├── server.js           # Server entry point
│   │   ├── app.js              # Express app setup
│   │   ├── routes/             # API routes
│   │   ├── models/             # MongoDB schemas
│   │   ├── middleware/         # Custom middleware
│   │   ├── controllers/        # Route handlers
│   │   └── utils/              # Helper functions
│   ├── .env                    # Environment variables
│   ├── node_modules/           # Backend dependencies
│   └── package.json            # Backend packages
│
├── client/                      # React Frontend
│   ├── src/
│   │   ├── App.jsx             # Root component
│   │   ├── pages/              # Page components
│   │   ├── components/         # Reusable components
│   │   ├── hooks/              # Custom React hooks
│   │   ├── context/            # React context
│   │   ├── styles/             # CSS/Tailwind
│   │   └── utils/              # Helper functions
│   ├── public/                 # Static assets
│   ├── node_modules/           # Frontend dependencies
│   ├── vite.config.js          # Vite configuration
│   ├── tailwind.config.js      # Tailwind CSS config
│   └── package.json            # Frontend packages
│
├── node_modules/               # Root dependencies
├── .env.example               # Environment template
├── package.json               # Root package configuration
├── SETUP_GUIDE.md            # Detailed setup guide
└── README.md                 # Project documentation
```

---

## 📊 API ENDPOINTS

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/refresh-token` - Refresh JWT token

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (vendor only)
- `PUT /api/products/:id` - Update product (vendor only)
- `DELETE /api/products/:id` - Delete product (vendor only)

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create order
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id` - Update order status

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/:id` - Get user by ID

### Payments
- `POST /api/payments/create-checkout` - Create Stripe checkout
- `POST /api/payments/webhook` - Stripe webhook handler

---

## 💡 NEXT STEPS

1. **Explore Frontend:** Visit http://localhost:5173
2. **Test Features:** Sign up, browse products, add to cart
3. **Check Backend:** Visit http://localhost:5000
4. **Review Code:** Open `server/src/` and `client/src/` in VS Code
5. **Customize:** Modify components and routes as needed

---

## 📞 NEED HELP?

1. Read detailed guide: [SETUP_GUIDE.md](./SETUP_GUIDE.md)
2. Check original readme: [README.md](./README.md)
3. Review error messages in terminal
4. Check browser console for frontend errors

---

## 🎉 YOU'RE READY!

Your Artisan's Corner marketplace is now running!

**Frontend:** http://localhost:5173  
**Backend:** http://localhost:5000  
**Database:** MongoDB (artisan_corner)

Happy selling! 🎨🛍️
