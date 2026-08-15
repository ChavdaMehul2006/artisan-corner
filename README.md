# 🏺 Artisan's Corner — Multi-Vendor E-Commerce Marketplace

[![MERN Stack](https://img.shields.io/badge/MERN-MongoDB%20|%20Express%20|%20React%20|%20Node-emerald.svg)](https://github.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-amber.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen.svg)](https://github.com)

**Artisan's Corner** is a complete, production-ready Multi-Vendor E-Commerce Marketplace built on the MERN stack. The platform bridges independent master artisans and mindful collectors worldwide through direct storefronts, persistent multi-vendor carts, server-side Stripe checkout, snapshot-based order management, automated commission calculation (5% configurable platform fee + 95% net vendor payout), verified buyer reviews, and real-time Recharts analytics.

---

## 🌟 Key Features by User Role

### 🛍️ Buyer Features
- **Browse & Filter**: Search catalog by craft medium (Ceramics, Jewelry, Woodworking, Textiles, Leather, Candles), price range, minimum rating, and stock status.
- **Product Details**: Multi-angle image galleries, maker techniques, discount tags, and artisan store cards.
- **Persistent Multi-Vendor Cart**: Add items from different artisan shops to one unified cart stored in Redux and synchronized with MongoDB.
- **Stripe Checkout**: Server-validated order pricing (preventing client price tampering) with 256-bit SSL encrypted Stripe payment processing.
- **Order Tracking**: Detailed buyer history with delivery statuses (`PROCESSING` → `CONFIRMED` → `SHIPPED` → `DELIVERED`).
- **Verified Purchase Reviews**: Only customers who purchased and paid for an item can submit 1–5 star reviews with verified badges.
- **Wishlist**: Save favorite handcrafted pieces with instant one-click transfer to shopping basket.
- **User Profile**: Update profile details, contact information, and secure password changes.

### 🏺 Vendor (Artisan) Features
- **Artisan Onboarding**: Apply to become a seller with studio name, logo, workshop location, and craft biography (subject to admin approval).
- **Studio Dashboard (`/dashboard/seller`)**: Comprehensive seller suite with financial overviews and quick action shortcuts.
- **Product Management**: Full CRUD operations for crafts, supporting multiple image uploads, stock limits, SKU codes, compare-at pricing, and instant active/inactive toggling.
- **Vendor Order Isolation**: Artisans only see order items belonging to their studio, with recipient delivery info and per-item status controllers.
- **Real-Time Analytics**: MongoDB aggregation-powered Recharts visualizations for Sales, Net Earnings (95%), Platform Commission (5%), and Top Performing Products across 7d, 30d, 90d, and 1-year timeframes.
- **Storefront Customization**: Custom studio cover banner, logo, bio, and workshop contact details.

### 🛡️ Administrator Features
- **Command Portal (`/dashboard/admin`)**: Marketplace-wide Gross Merchandise Volume (GMV), net fee revenue, total user accounts, and active vendor counts.
- **Vendor Application Reviews**: Moderation queue to approve or reject pending artisan studio applications.
- **User Governance**: Search and filter buyers/vendors with instant account activation and deactivation controls.
- **Marketplace Global Orders**: Oversight of all platform transactions with exact financial commission distributions.
- **Configurable Commission**: Dynamic runtime configuration of platform fee percentage (default 5%) and marketplace branding.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, Redux Toolkit, React Router 7, Tailwind CSS, Lucide React, Recharts, React Hook Form, Axios |
| **Backend** | Node.js, Express.js, MongoDB, Mongoose, JWT (HTTP-only Cookies), bcryptjs, Zod, Multer, Helmet, CORS, Express Rate Limit, Mongo Sanitize |
| **Payments** | Stripe SDK (PaymentIntents & raw-body signature-verified Webhooks) |
| **Media** | Cloudinary Image Storage (with Base64 local storage fallback in development) |
| **Testing** | Jest, Supertest (15 integration & unit test suites) |

---

## 📁 Monorepo Architecture

```
artisan-corner/
│
├── client/                     # Vite React Frontend
│   ├── src/
│   │   ├── api/                # Axios instance with cookie & token refresh interceptors
│   │   ├── components/         # Reusable UI components
│   │   │   ├── common/         # Navbar, Footer, StarRating, Badge, LoadingSkeleton, Toast
│   │   │   ├── product/        # ProductCard, ProductGrid, ProductFilters, ImageGallery, ReviewList
│   │   │   ├── cart/           # CartItemCard, CartSummaryCard
│   │   │   ├── checkout/       # StripeCheckoutForm
│   │   │   ├── vendor/         # VendorSidebar, StatsCard, SalesRevenueChart, TopProductsList
│   │   │   └── admin/          # AdminSidebar, VendorApplicationCard
│   │   ├── layouts/            # MainLayout, VendorLayout, AdminLayout
│   │   ├── pages/              # Buyer, Vendor, and Admin view pages
│   │   ├── routes/             # AppRoutes and Protected / Vendor / Admin RouteGuards
│   │   ├── store/              # Redux Toolkit store and slices (auth, cart, wishlist)
│   │   ├── utils/              # Currency and date formatters
│   │   ├── constants/          # Craft categories and order statuses
│   │   ├── App.jsx             # Root App component
│   │   ├── main.jsx            # React DOM entrypoint
│   │   └── index.css           # Global typography & artisanal design system
│   ├── package.json
│   └── vite.config.js
│
├── server/                     # Express.js & MongoDB Backend
│   ├── src/
│   │   ├── config/             # Database, Cloudinary, Stripe configuration
│   │   ├── controllers/        # Thin controllers handling HTTP requests
│   │   ├── middleware/         # Auth (JWT in HTTP-only cookies), RBAC, Zod validation, Multer
│   │   ├── models/             # Mongoose schemas (User, Store, Product, Cart, Order, Review, Wishlist, Setting)
│   │   ├── routes/             # Express API routes
│   │   ├── services/           # Reusable business logic, aggregations, and financial calculations
│   │   ├── utils/              # ApiError, ApiResponse, Token & Cookie helpers
│   │   ├── validators/         # Zod schemas for input validation
│   │   ├── jobs/               # Database seed script (seed.js)
│   │   ├── app.js              # Express app configuration
│   │   └── server.js           # Server listen entrypoint
│   ├── tests/                  # Automated Jest/Supertest suite
│   └── package.json
│
├── docs/
│   └── database-schema.md      # Mermaid ER diagram & database dictionary
│
├── .env.example
├── .gitignore
├── README.md
└── package.json                # Root monorepo scripts
```

---

## ⚡ Quick Start & Local Setup

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher (`node -v`)
- **MongoDB**: Local MongoDB instance running on `mongodb://127.0.0.1:27017` or MongoDB Atlas URI

### 2. Installation
Clone the repository and install all dependencies:
```bash
# Clone repository
git clone https://github.com/your-repo/artisan-corner.git
cd artisan-corner

# Install root, server, and client dependencies
npm run install-all
```

### 3. Environment Variables Setup
Copy the `.env.example` file to create your server `.env`:
```bash
cp .env.example server/.env
```

Review the variables in `server/.env`:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGO_URI=mongodb://127.0.0.1:27017/artisan_corner

JWT_ACCESS_SECRET=artisan_jwt_access_secret_super_secure_key_2026_dev_mode
JWT_REFRESH_SECRET=artisan_jwt_refresh_secret_super_secure_key_2026_dev_mode
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

CLOUDINARY_CLOUD_NAME=demo_cloud
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=artisan_mock_cloudinary_secret

STRIPE_SECRET_KEY=sk_test_mock_artisan_corner_key
STRIPE_PUBLISHABLE_KEY=pk_test_mock_artisan_corner_key
STRIPE_WEBHOOK_SECRET=whsec_mock_stripe_webhook_secret_here

PLATFORM_COMMISSION_PERCENT=5
```

### 4. Seed Database with Rich Demo Data
Populate the database with administrator, vendor, buyer accounts, 3 approved artisan studios, 18 handcrafted products, verified reviews, and sample orders:
```bash
npm run seed
```

### 5. Start Application
Run both backend API and frontend Vite dev servers concurrently:
```bash
npm run dev
```

- **Frontend Client**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000/api](http://localhost:5000/api)
- **API Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 🔑 Demo Credentials

You can use the 1-click quick login buttons on the login page or manually sign in with:

| Account Role | Email Address | Password | Privileges |
| :--- | :--- | :--- | :--- |
| **👑 Admin** | `admin@artisanscorner.com` | `ArtisanPass123!` | Global portal, approve vendors, manage users, set commission rates |
| **🏺 Vendor (Artisan)** | `vendor@artisanscorner.com` | `ArtisanPass123!` | Terra & Kiln studio, manage craft catalog, fulfill orders, sales analytics |
| **🛍️ Buyer** | `buyer@artisanscorner.com` | `ArtisanPass123!` | Browse, multi-vendor cart, checkout, order tracking, write verified reviews |

---

## 🧪 Running Automated Tests

Run the backend integration test suite verifying authentication, RBAC, store onboarding, cart price verification, commission breakdown, and verified purchase reviews:
```bash
npm test
```

---

## 📡 REST API Reference

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register a new account
- `POST /api/auth/login` — Login with credentials (sets HTTP-only JWT cookies)
- `POST /api/auth/logout` — Clear auth cookies
- `POST /api/auth/refresh-token` — Refresh access token
- `GET  /api/auth/me` — Get current user profile
- `PATCH /api/auth/profile` — Update user details
- `PATCH /api/auth/change-password` — Change password

### Stores (`/api/stores`)
- `GET  /api/stores/featured` — Get approved artisan studios
- `GET  /api/stores/:slug` — Get store profile and catalog
- `POST /api/stores/apply` — Submit vendor store application (Protected)
- `GET  /api/stores/vendor/me` — Get logged-in vendor's store
- `PATCH /api/stores/vendor/me` — Update store info, banner, and logo

### Products (`/api/products`)
- `GET    /api/products` — Browse products (supports `search`, `category`, `minPrice`, `maxPrice`, `minRating`, `inStockOnly`, `sort`, `page`, `limit`)
- `GET    /api/products/featured` — Get spotlight products
- `GET    /api/products/slug/:slug` — Get product by slug
- `GET    /api/products/:id` — Get product by ID
- `POST   /api/products` — Create new product with image uploads (Vendor only)
- `PATCH  /api/products/:id` — Update product (Vendor ownership check)
- `DELETE /api/products/:id` — Delete product (Vendor ownership check)

### Shopping Cart (`/api/cart`)
- `GET    /api/cart` — Get persistent user cart with fresh DB prices
- `POST   /api/cart/items` — Add product to cart
- `PATCH  /api/cart/items/:productId` — Update item quantity
- `DELETE /api/cart/items/:productId` — Remove item from cart
- `DELETE /api/cart` — Clear entire cart
- `POST   /api/cart/sync` — Sync localStorage cart on login

### Orders (`/api/orders`)
- `POST  /api/orders` — Place order with verified server calculations
- `GET   /api/orders/my-orders` — Get buyer order history
- `GET   /api/orders/vendor/my-orders` — Get vendor filtered orders
- `GET   /api/orders/:id` — Get order detail
- `PATCH /api/orders/:id/status` — Update order fulfillment status

### Payments (`/api/payments`)
- `GET  /api/payments/config` — Get Stripe publishable key
- `POST /api/payments/create-intent` — Create Stripe PaymentIntent with server prices
- `POST /api/payments/webhook` — Stripe raw webhook endpoint for idempotent order fulfillment

### Reviews (`/api/reviews`)
- `GET  /api/reviews/product/:productId` — Get reviews and rating distribution
- `GET  /api/reviews/eligibility/:productId` — Check if logged-in user has verified purchase
- `POST /api/reviews` — Submit verified purchase review

### Vendor Studio (`/api/vendor`)
- `GET /api/vendor/analytics` — Recharts time-series aggregations (`7d`, `30d`, `90d`, `1y`)
- `GET /api/vendor/products` — Vendor's inventory list
- `GET /api/vendor/orders` — Vendor's orders

### Admin Portal (`/api/admin`)
- `GET   /api/admin/analytics` — Platform GMV and net revenue metrics
- `GET   /api/admin/users` — User management list
- `PATCH /api/admin/users/:id/toggle-active` — Toggle user status
- `GET   /api/admin/vendors/applications` — Pending vendor store applications
- `PATCH /api/admin/vendors/applications/:id` — Approve or reject store application
- `GET   /api/admin/orders` — Global marketplace orders
- `GET   /api/admin/settings` & `PATCH /api/admin/settings` — Configure commission rate (5%)

---

## 🚀 Production Deployment Guide

### Frontend Deployment (Vercel)
1. Push the repository to GitHub.
2. In Vercel, import the project and set **Root Directory** to `client`.
3. Set **Framework Preset** to `Vite`.
4. Add environment variables:
   - `VITE_API_BASE_URL=https://your-backend.onrender.com/api`
5. Deploy.

### Backend Deployment (Render / Railway)
1. Set **Root Directory** to `server`.
2. Build Command: `npm install`
3. Start Command: `npm start`
4. Set Environment Variables in dashboard:
   - `NODE_ENV=production`
   - `PORT=5000`
   - `MONGO_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/artisan_corner`
   - `CLIENT_URL=https://your-frontend.vercel.app`
   - `JWT_ACCESS_SECRET=<64-char-random-string>`
   - `JWT_REFRESH_SECRET=<64-char-random-string>`
   - `CLOUDINARY_CLOUD_NAME=<your-cloud-name>`
   - `CLOUDINARY_API_KEY=<your-api-key>`
   - `CLOUDINARY_API_SECRET=<your-api-secret>`
   - `STRIPE_SECRET_KEY=<sk_live_...>`
   - `STRIPE_PUBLISHABLE_KEY=<pk_live_...>`
   - `STRIPE_WEBHOOK_SECRET=<whsec_...>`
   - `PLATFORM_COMMISSION_PERCENT=5`

---

## 📄 License
This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
