# 🎯 START HERE - How to Run Artisan's Corner

## Welcome! 👋

This document will help you **run the Artisan's Corner marketplace** in just a few steps.

---

## ⚡ TL;DR (2 Minutes)

```powershell
# In PowerShell:

# 1. Go to project
cd C:\Users\chavd\.gemini\antigravity\scratch\artisan-corner

# 2. Start MongoDB (if not running)
net start MongoDB

# 3. Run everything
npm run dev

# 4. Open browser
# Frontend: http://localhost:5173
# Backend:  http://localhost:5000
```

Done! Your marketplace is running. ✨

---

## 📖 Choose Your Guide

**Not sure which guide to read?** Answer these questions:

### Question 1: How much detail do you want?

**A) Just give me the commands!** 
→ Read: [QUICK_START.md](./QUICK_START.md) ⏱ 5 min

**B) Step-by-step with explanations**
→ Read: [RUN_PROJECT_STEPS.md](./RUN_PROJECT_STEPS.md) ⏱ 15 min

**C) I want a checklist to track progress**
→ Read: [SETUP_CHECKLIST.md](./SETUP_CHECKLIST.md) ⏱ 10 min

**D) Tell me everything!**
→ Read: [SETUP_GUIDE.md](./SETUP_GUIDE.md) ⏱ 30 min

---

## 🎬 Visual Guide

Here's what happens when you run the project:

```
Your Computer
    │
    ├─ Browser (http://localhost:5173)
    │  └─ React frontend with products, cart, checkout
    │
    ├─ Terminal 1 (npm run dev)
    │  ├─ Express backend (http://localhost:5000)
    │  └─ MongoDB connected (127.0.0.1:27017)
    │
    └─ MongoDB Database
       └─ Stores users, products, orders
```

---

## 📋 Before You Start

Make sure you have these installed:

✅ **Node.js** v16+ - [Download](https://nodejs.org/)  
✅ **npm** (comes with Node.js)  
✅ **MongoDB** v5.0+ - [Download](https://www.mongodb.com/try/download/community)  

Verify with:
```powershell
node --version    # v16+
npm --version     # v8+
mongod --version  # v5.0+
```

---

## ✅ Setup Status

Here's what's already done for you:

- ✅ Project structure verified
- ✅ All npm dependencies installed
- ✅ Environment variables configured
- ✅ MongoDB connection setup
- ✅ Backend API root route fixed
- ✅ Comprehensive guides created
- ✅ Project tested and working

**You just need to run `npm run dev`!**

---

## 🚀 The 3-Minute Quick Run

```powershell
# Step 1: Navigate to project
cd C:\Users\chavd\.gemini\antigravity\scratch\artisan-corner

# Step 2: Ensure MongoDB is running
net start MongoDB

# Step 3: Start development servers
npm run dev
```

**Wait 30-60 seconds...**

Then open these in your browser:
- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:5000

🎉 **You're done!**

---

## 🤔 What Do I Do Now?

### If it worked:
- ✅ Visit http://localhost:5173 and browse the marketplace
- ✅ Try signing up for an account
- ✅ Explore products, cart, checkout
- ✅ (Optional) Create admin account: `npm run create-admin`
- ✅ (Optional) Add sample data: `npm run seed`

### If something went wrong:
1. Check: [SETUP_GUIDE.md - Troubleshooting](./SETUP_GUIDE.md#troubleshooting)
2. Or: [SETUP_CHECKLIST.md - Troubleshooting Checklist](./SETUP_CHECKLIST.md#troubleshooting-checklist)
3. Or: [RUN_PROJECT_STEPS.md - Verify It's Working](./RUN_PROJECT_STEPS.md#-verify-its-working)

---

## 📚 All Available Guides

| Guide | Purpose | Time | Best For |
|-------|---------|------|----------|
| **QUICK_START.md** | Commands only | 5 min | Experienced developers |
| **RUN_PROJECT_STEPS.md** | Step-by-step walkthrough | 15 min | First time setup |
| **SETUP_CHECKLIST.md** | Checkpoint guide | 10 min | Visual trackers |
| **SETUP_GUIDE.md** | Complete reference | 30 min | Deep dive learners |
| **GUIDES_INDEX.md** | Guide selection tool | 2 min | Not sure which guide |
| **README.md** | Project overview | 10 min | Project features |

---

## 💡 Common Questions

**Q: I don't have MongoDB installed. What do I do?**  
A: Download from https://www.mongodb.com/try/download/community and install

**Q: Port 5000 is already in use. How do I fix it?**  
A: Edit `server/.env` and change `PORT=5001`

**Q: Do I need to leave MongoDB running?**  
A: Yes, in the background or separate terminal

**Q: Can I run just the frontend or just the backend?**  
A: Yes - `npm run client:dev` or `npm run server:dev`

**Q: How do I stop the servers?**  
A: Press `Ctrl+C` in the terminal

**Q: What if the page shows "Cannot find /" error?**  
A: This is already fixed. The API now has a health check route.

**Q: Can I use a cloud database instead of local MongoDB?**  
A: Yes, update `MONGO_URI` in `server/.env`

---

## 🎯 Success Criteria

You're all set when:

✅ Terminal shows "Artisan's Corner API Server Running on http://localhost:5000"  
✅ Terminal shows "VITE v6.x.x ready"  
✅ Browser at http://localhost:5173 shows the marketplace homepage  
✅ You can navigate and see products  
✅ No critical errors in browser console (F12)  

---

## 🚦 Next Steps

### Path 1: I want to jump in right now
→ Run `npm run dev` and open http://localhost:5173

### Path 2: I want detailed instructions
→ Read [RUN_PROJECT_STEPS.md](./RUN_PROJECT_STEPS.md)

### Path 3: I want to track progress
→ Use [SETUP_CHECKLIST.md](./SETUP_CHECKLIST.md)

### Path 4: I'm not sure
→ Start with [GUIDES_INDEX.md](./GUIDES_INDEX.md)

---

## 🎓 Project Features

**Artisan's Corner** is a full-featured marketplace with:

- 🏪 Multi-vendor support
- 👥 User authentication (signup/login)
- 🛍️ Product catalog
- 🛒 Shopping cart
- 💳 Payment integration (Stripe)
- 📦 Order management
- 👨‍💼 Vendor dashboard
- 🖼️ Image uploads (Cloudinary)
- 🔒 Secure authentication (JWT)
- ⚡ Rate limiting & security

---

## 📞 Need Help?

1. **Quick reference:** [QUICK_START.md](./QUICK_START.md)
2. **Detailed steps:** [RUN_PROJECT_STEPS.md](./RUN_PROJECT_STEPS.md)
3. **Troubleshooting:** [SETUP_GUIDE.md](./SETUP_GUIDE.md#troubleshooting)
4. **Checklist:** [SETUP_CHECKLIST.md](./SETUP_CHECKLIST.md)
5. **All guides:** [GUIDES_INDEX.md](./GUIDES_INDEX.md)

---

## 🎉 You're Ready!

**Pick a guide above and get started. Your marketplace will be running in minutes!**

---

## 🚀 Quick Command Reference

```powershell
# Development
npm run dev              # Start everything
npm run server:dev       # Backend only
npm run client:dev       # Frontend only

# Database
npm run seed             # Add sample data
npm run create-admin     # Create admin user

# Other
npm run build            # Build for production
npm test                 # Run tests
npm run clean-db         # Reset database
```

---

**Last Updated:** August 15, 2026  
**Status:** ✅ Ready to Use  
**Time to First Run:** ~3 minutes

**Happy Selling! 🎨🛍️**
