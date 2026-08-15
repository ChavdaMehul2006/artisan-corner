# 📚 ARTISAN'S CORNER - DOCUMENTATION INDEX

## Quick Navigation to Setup Guides

This project includes comprehensive documentation to help you set it up and run it. Choose the guide that works best for you:

---

## 🚀 **START HERE: Choose Your Path**

### 🏃 **"I just want to run it now!"**
👉 **Read:** [QUICK_START.md](./QUICK_START.md)  
⏱ **Time:** 5 minutes  
📝 **What:** Copy-paste commands with minimal explanation

---

### 🎯 **"I want step-by-step visual walkthrough"**
👉 **Read:** [RUN_PROJECT_STEPS.md](./RUN_PROJECT_STEPS.md)  
⏱ **Time:** 15 minutes  
📝 **What:** Detailed guide with screenshots and explanations of what each step does

---

### ✅ **"I want a checklist to follow"**
👉 **Read:** [SETUP_CHECKLIST.md](./SETUP_CHECKLIST.md)  
⏱ **Time:** 10 minutes  
📝 **What:** Checkbox format with all steps to track progress

---

### 📖 **"I want to understand everything"**
👉 **Read:** [SETUP_GUIDE.md](./SETUP_GUIDE.md)  
⏱ **Time:** 30 minutes  
📝 **What:** Deep dive with architecture, troubleshooting, and all features explained

---

## 📚 Document Overview

| Document | Best For | Time | Format |
|----------|----------|------|--------|
| [QUICK_START.md](./QUICK_START.md) | Experienced developers | 5 min | Commands only |
| [RUN_PROJECT_STEPS.md](./RUN_PROJECT_STEPS.md) | Step-by-step learners | 15 min | Walkthrough |
| [SETUP_CHECKLIST.md](./SETUP_CHECKLIST.md) | Visual trackers | 10 min | Checkboxes |
| [SETUP_GUIDE.md](./SETUP_GUIDE.md) | Detailed learners | 30 min | Complete guide |
| [README.md](./README.md) | Project overview | 10 min | Project info |

---

## 🎯 Common Scenarios

### "I've never set up a project before"
1. Read: [RUN_PROJECT_STEPS.md](./RUN_PROJECT_STEPS.md) (complete walkthrough)
2. Print: [SETUP_CHECKLIST.md](./SETUP_CHECKLIST.md) (track your progress)
3. Reference: [SETUP_GUIDE.md](./SETUP_GUIDE.md) (if you get stuck)

### "I'm setting this up for the second time"
1. Use: [QUICK_START.md](./QUICK_START.md) (fast reference)
2. Or: [SETUP_CHECKLIST.md](./SETUP_CHECKLIST.md) (quick checklist)

### "I know how to set up projects, just remind me"
1. Use: [QUICK_START.md](./QUICK_START.md) (copy-paste commands)

### "Something isn't working"
1. Check: [RUN_PROJECT_STEPS.md](./RUN_PROJECT_STEPS.md#verify-its-working) (Verify section)
2. Read: [SETUP_GUIDE.md](./SETUP_GUIDE.md#troubleshooting) (Troubleshooting)
3. Use: [SETUP_CHECKLIST.md](./SETUP_CHECKLIST.md#troubleshooting-checklist) (Issue checklist)

---

## ⚡ 60-SECOND QUICK REFERENCE

```powershell
# 1. Navigate to project
cd C:\Users\chavd\.gemini\antigravity\scratch\artisan-corner

# 2. Start MongoDB (if not running)
net start MongoDB

# 3. Setup environment (first time only)
Copy-Item .env.example server\.env

# 4. Install dependencies (first time only)
npm run install-all

# 5. Start development servers
npm run dev

# 6. Open in browser
# Frontend: http://localhost:5173
# Backend:  http://localhost:5000
```

---

## 🎬 What Happens When You Run `npm run dev`

1. **Backend starts** on http://localhost:5000
   - Express server with API routes
   - Connected to MongoDB database
   - Watches for code changes (auto-restart with nodemon)

2. **Frontend starts** on http://localhost:5173
   - React app with Vite bundler
   - Hot module reloading (instant page updates)
   - Connects to backend API

3. **Database connected**
   - MongoDB running on port 27017
   - Database name: `artisan_corner`

---

## 📋 Prerequisites Checklist

Before starting, make sure you have:

- [ ] Node.js v16+ ([Download](https://nodejs.org/))
- [ ] npm (comes with Node.js)
- [ ] MongoDB v5.0+ ([Download](https://www.mongodb.com/try/download/community))

Verify with:
```powershell
node --version    # Should be v16+
npm --version     # Should be v8+
mongod --version  # Should be v5.0+
```

---

## 🌐 Project Architecture

```
Artisan's Corner (MERN Stack)
│
├── 🎨 Frontend (React + Vite)
│   └── http://localhost:5173
│       ├── Homepage
│       ├── Product Pages
│       ├── Shopping Cart
│       ├── User Dashboard
│       └── Vendor Dashboard
│
├── 🔧 Backend (Express + Node.js)
│   └── http://localhost:5000
│       ├── /api/auth (Login/Signup)
│       ├── /api/products (Items)
│       ├── /api/orders (Purchases)
│       ├── /api/users (Accounts)
│       └── /api/payments (Stripe)
│
└── 💾 Database (MongoDB)
    └── mongodb://127.0.0.1:27017
        ├── users
        ├── products
        ├── orders
        └── vendors
```

---

## 📞 Support Resources

### Documentation Files
- [README.md](./README.md) - Project overview and features
- [SETUP_GUIDE.md](./SETUP_GUIDE.md) - Comprehensive setup guide
- [QUICK_START.md](./QUICK_START.md) - Quick reference
- [SETUP_CHECKLIST.md](./SETUP_CHECKLIST.md) - Checkpoint guide
- [RUN_PROJECT_STEPS.md](./RUN_PROJECT_STEPS.md) - Step-by-step walkthrough

### Directories
- `server/` - Backend Express application
- `client/` - Frontend React application
- `docs/` - Additional documentation

---

## 🎓 After Setup

Once the project is running:

### Explore
- 🌐 Visit http://localhost:5173 to see the UI
- 📱 Interact with the marketplace
- 🔍 Use browser DevTools (F12) to debug

### Learn
- 📂 Open `server/src/` to understand backend
- 📂 Open `client/src/` to understand frontend
- 📚 Read code comments for explanations

### Develop
- ✏️ Make changes to code
- 🔄 See auto-reload in browser
- 🧪 Test your changes
- 🐛 Use browser console to debug

### Deploy
- 🏗️ Build for production: `npm run build`
- 📤 Deploy frontend to Vercel/Netlify
- 📤 Deploy backend to Heroku/Railway

---

## 🎯 Success Indicators

You'll know everything is working when:

✅ Terminal shows "Artisan's Corner API Server Running on http://localhost:5000"  
✅ Terminal shows "VITE v6.x.x ready in xxx ms"  
✅ Browser shows the Artisan's Corner homepage  
✅ Backend returns healthy JSON at http://localhost:5000  
✅ No critical errors in browser console  

---

## 💡 Pro Tips

- **Keep MongoDB running** in background or separate terminal
- **Watch terminal output** for error messages
- **Use Ctrl+C** to stop servers (press Ctrl+C if needed twice)
- **Clear browser cache** with Ctrl+Shift+R if page looks wrong
- **Check browser console** (F12) for frontend errors
- **Check terminal** for backend errors

---

## ❓ Frequently Asked Questions

**Q: How do I stop the servers?**  
A: Press `Ctrl + C` in the terminal

**Q: Can I run frontend and backend separately?**  
A: Yes - `npm run server:dev` and `npm run client:dev` in different terminals

**Q: What if I'm stuck?**  
A: Check the Troubleshooting section in [SETUP_GUIDE.md](./SETUP_GUIDE.md)

**Q: Can I use cloud MongoDB instead of local?**  
A: Yes - Update `MONGO_URI` in `server/.env`

**Q: How do I seed sample data?**  
A: Run `npm run seed`

**Q: How do I create an admin account?**  
A: Run `npm run create-admin`

---

## 🚀 You're Ready!

Pick a guide above and get started. Your Artisan's Corner marketplace will be running in minutes!

**Recommended path:**
1. 👉 Read [RUN_PROJECT_STEPS.md](./RUN_PROJECT_STEPS.md) (15 min read)
2. ✅ Follow the steps
3. 🎉 You're running!

---

**Last Updated:** 2026-08-15  
**Status:** ✅ Ready to Use  
**Questions?** Check the relevant guide above!
