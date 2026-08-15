# ✅ ARTISAN'S CORNER - SETUP CHECKLIST

Use this checklist to track your setup progress.

---

## 📋 PREREQUISITES

- [ ] Node.js v16+ installed
  ```powershell
  node --version
  ```

- [ ] npm installed (comes with Node.js)
  ```powershell
  npm --version
  ```

- [ ] MongoDB v5.0+ installed
  ```powershell
  mongod --version
  ```

- [ ] Git installed (optional)
  ```powershell
  git --version
  ```

---

## 🚀 SETUP STEPS

### Phase 1: Environment Setup

- [ ] **1.1** Navigate to project directory
  ```powershell
  cd C:\Users\chavd\.gemini\antigravity\scratch\artisan-corner
  ```

- [ ] **1.2** Verify directory structure
  ```powershell
  Get-ChildItem
  # Should show: client, server, docs, node_modules, package.json, .env.example
  ```

- [ ] **1.3** Start MongoDB service
  ```powershell
  net start MongoDB
  # or: mongod --dbpath "C:\Program Files\MongoDB\Server\5.0\data"
  ```

- [ ] **1.4** Copy environment template
  ```powershell
  Copy-Item .env.example server\.env
  ```

- [ ] **1.5** Verify server\.env exists
  ```powershell
  Test-Path server\.env
  # Should return: True
  ```

### Phase 2: Dependencies Installation

- [ ] **2.1** Install all dependencies
  ```powershell
  npm run install-all
  ```
  ⏱ Wait 2-5 minutes

- [ ] **2.2** Verify root packages installed
  ```powershell
  Test-Path node_modules
  # Should return: True
  ```

- [ ] **2.3** Verify server packages installed
  ```powershell
  Test-Path server\node_modules
  # Should return: True
  ```

- [ ] **2.4** Verify client packages installed
  ```powershell
  Test-Path client\node_modules
  # Should return: True
  ```

### Phase 3: Database Setup (Optional but Recommended)

- [ ] **3.1** Seed database with sample data
  ```powershell
  npm run seed
  ```
  Creates: 50+ products, 10 vendors, 20 users

- [ ] **3.2** Create admin user
  ```powershell
  npm run create-admin
  ```
  Follow prompts to set up admin account

### Phase 4: Start Development

- [ ] **4.1** Start development servers
  ```powershell
  npm run dev
  ```
  ⏱ Wait 30-60 seconds

- [ ] **4.2** Verify backend is running
  - Check terminal output for: "Artisan's Corner API Server Running"
  - Look for: "Port: http://localhost:5000"

- [ ] **4.3** Verify frontend is running
  - Check terminal output for: "VITE v6.4.3 ready"
  - Look for: "➜  Local: http://localhost:5173/"

### Phase 5: Verification in Browser

- [ ] **5.1** Open frontend in browser
  ```
  URL: http://localhost:5173
  ```
  ✅ Should see: Artisan's Corner homepage, featured products, navigation menu

- [ ] **5.2** Open backend health check
  ```
  URL: http://localhost:5000
  ```
  ✅ Should see: JSON response with success and message

- [ ] **5.3** Check browser console
  ```
  Press: F12 or Ctrl+Shift+I
  Click: Console tab
  ```
  ⚠️ Some 401 errors are expected (unauthenticated API calls)

- [ ] **5.4** Test basic functionality
  - [ ] Homepage loads correctly
  - [ ] Navigation menu is visible
  - [ ] Search bar is functional
  - [ ] Login/Signup buttons are present

### Phase 6: Advanced Testing (Optional)

- [ ] **6.1** Create a new user account
  - Click "Signup" or "Register"
  - Fill in email, password, name
  - Verify account creation

- [ ] **6.2** Browse products
  - Navigate to different categories
  - Use search functionality
  - View product details

- [ ] **6.3** Test vendor features (if admin/vendor)
  - Access vendor dashboard
  - Try creating a product
  - View sales/orders

- [ ] **6.4** Test cart functionality
  - Add items to cart
  - Update quantities
  - Proceed to checkout (may need Stripe setup)

---

## 🔄 DAILY STARTUP CHECKLIST

Once setup is complete, each time you want to work on the project:

- [ ] Open PowerShell terminal
- [ ] Navigate to project: `cd C:\Users\chavd\.gemini\antigravity\scratch\artisan-corner`
- [ ] Ensure MongoDB is running: `net start MongoDB`
- [ ] Start servers: `npm run dev`
- [ ] Open http://localhost:5173 in browser
- [ ] Start coding! 🎉

---

## ⚠️ TROUBLESHOOTING CHECKLIST

If something goes wrong, use this checklist:

### MongoDB Issues
- [ ] MongoDB is running: `mongod --version` works
- [ ] MongoDB service started: `net start MongoDB` succeeds
- [ ] Correct URI in server\.env: `mongodb://127.0.0.1:27017/artisan_corner`
- [ ] Port 27017 is not blocked by firewall
- [ ] No other MongoDB instances running on same port

### Port Conflicts
- [ ] Port 5000 not in use (or changed in server\.env)
- [ ] Port 5173 not in use
- [ ] Check with: `netstat -ano | findstr :5000` (Windows)

### Dependency Issues
- [ ] `npm --version` shows v8+
- [ ] `node --version` shows v16+
- [ ] No errors during `npm run install-all`
- [ ] All node_modules folders exist

### Environment Variable Issues
- [ ] server\.env exists in project root/server/
- [ ] MONGO_URI is set correctly
- [ ] JWT secrets are defined (can be defaults for dev)
- [ ] CLIENT_URL matches frontend URL (http://localhost:5173)

### Database Issues
- [ ] MongoDB is running
- [ ] Database exists: `artisan_corner`
- [ ] Can connect with MongoDB client/compass
- [ ] Schema is properly initialized

### API Connection Issues
- [ ] Backend is running on http://localhost:5000
- [ ] Frontend can reach backend (check CORS settings)
- [ ] API endpoints respond (test with Postman or curl)
- [ ] JWT tokens are being set in cookies

### Frontend Issues
- [ ] Vite dev server is running on http://localhost:5173
- [ ] Browser console shows no critical errors
- [ ] CSS/Tailwind styles are applied
- [ ] React components are rendering

---

## 🎯 COMMON COMMANDS REFERENCE

### Starting Development
```powershell
npm run dev              # Both frontend and backend
npm run server:dev      # Backend only
npm run client:dev      # Frontend only
```

### Database Operations
```powershell
npm run seed            # Add sample data
npm run create-admin    # Create admin account
npm run clean-db        # Delete all data
```

### Building & Testing
```powershell
npm run build           # Build frontend for production
npm test                # Run tests
npm run server          # Run production backend
```

### Troubleshooting Commands
```powershell
npm cache clean --force # Clear npm cache
Remove-Item -Recurse node_modules  # Delete node_modules
Remove-Item package-lock.json      # Delete lock file
npm run install-all     # Reinstall everything
```

---

## 📊 SUCCESS INDICATORS

✅ You're done when:

- [ ] Terminal shows "Artisan's Corner API Server Running on http://localhost:5000"
- [ ] Terminal shows "VITE v6.4.3 ready in 362 ms"
- [ ] http://localhost:5173 loads the marketplace homepage
- [ ] http://localhost:5000 returns a JSON health check response
- [ ] Browser console has no critical errors (some 401s are OK)
- [ ] You can navigate the website
- [ ] Signup/Login buttons are accessible

---

## 🎉 NEXT STEPS AFTER SETUP

Once everything is working:

1. **Explore the Codebase**
   - Open VS Code: `code .`
   - Review server structure in `server/src/`
   - Review client structure in `client/src/`

2. **Understand the Architecture**
   - Backend uses Express + MongoDB
   - Frontend uses React + Vite + Tailwind
   - Real-time updates use socket.io (if configured)
   - Authentication uses JWT tokens

3. **Make Your First Changes**
   - Modify a React component in `client/src/`
   - See changes automatically reload
   - Try updating a backend route in `server/src/`
   - Watch nodemon auto-restart

4. **Add New Features**
   - Follow existing patterns in the codebase
   - Use the API endpoints already defined
   - Test changes in the browser
   - Check console for any errors

5. **Deploy to Production**
   - Build frontend: `npm run build`
   - Choose hosting (Vercel, Netlify for frontend; Heroku, Railway for backend)
   - Update environment variables for production
   - Push to Git and deploy

---

## 📞 GETTING HELP

### If You're Stuck:

1. **Read the guides**
   - [QUICK_START.md](./QUICK_START.md) - Basic setup
   - [SETUP_GUIDE.md](./SETUP_GUIDE.md) - Detailed setup
   - [README.md](./README.md) - Project overview

2. **Check error messages**
   - Read terminal output carefully
   - Check browser console (F12)
   - Look for specific error codes

3. **Try troubleshooting**
   - Follow steps in "Troubleshooting Checklist" above
   - Restart MongoDB and servers
   - Clear cache and reinstall dependencies

4. **Check the code**
   - Review `server/src/app.js` for app setup
   - Review `client/src/main.jsx` for frontend setup
   - Look at existing routes/components as examples

---

**Good luck with Artisan's Corner! 🎨🛍️**

Last Updated: 2026-08-15  
Status: ✅ Ready to Use
