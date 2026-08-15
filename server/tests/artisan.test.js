const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/User');
const Store = require('../src/models/Store');
const Product = require('../src/models/Product');
const Order = require('../src/models/Order');
const Review = require('../src/models/Review');
const Setting = require('../src/models/Setting');
const { calculateFinancials } = require('../src/utils/helpers');

describe("Artisan's Corner API Test Suite", () => {
  let buyerTokenCookie;
  let vendorTokenCookie;
  let adminTokenCookie;
  let testVendorId;
  let testStoreId;
  let testProductId;
  let testOrderId;

  beforeAll(async () => {
    const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/artisan_corner';
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(mongoURI);
    }
    await Setting.findOneAndUpdate(
      { key: 'marketplace_config' },
      { platformCommissionPercent: 5 },
      { upsert: true, new: true }
    );
    // Ensure admin user exists for test
    const existingAdmin = await User.findOne({ email: 'admin@artisanscorner.com' });
    if (!existingAdmin) {
      await User.create({
        name: 'Admin Test',
        email: 'admin@artisanscorner.com',
        password: 'ArtisanPass123!',
        role: 'ADMIN',
        isActive: true
      });
    }
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  describe('1. Financials and Commission Calculation Rules', () => {
    it('should correctly calculate 5% platform commission and 95% vendor payout', () => {
      const fin = calculateFinancials(100, 1, 5);
      expect(fin.subtotal).toBe(100);
      expect(fin.platformFee).toBe(5);
      expect(fin.vendorPayout).toBe(95);
    });

    it('should handle decimal pricing and multiple quantities accurately', () => {
      const fin = calculateFinancials(38.5, 3, 5); // 115.50
      expect(fin.subtotal).toBe(115.5);
      expect(fin.platformFee).toBe(5.78);
      expect(fin.vendorPayout).toBe(109.72);
    });
  });

  describe('2. Authentication & Protected Routes', () => {
    const testEmail = `testbuyer_${Date.now()}@example.com`;

    it('should register a new buyer and return HTTP-only auth cookies', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test Buyer',
          email: testEmail,
          password: 'Password123!',
          phone: '+1 555-0199'
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe(testEmail);
      expect(res.headers['set-cookie']).toBeDefined();
      buyerTokenCookie = res.headers['set-cookie'];
    });

    it('should login existing user with credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testEmail,
          password: 'Password123!'
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.role).toBe('BUYER');
    });

    it('should access protected /api/auth/me with auth cookie', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Cookie', buyerTokenCookie);

      expect(res.status).toBe(200);
      expect(res.body.data.user.email).toBe(testEmail);
    });

    it('should reject unauthorized access without token', async () => {
      const res = await request(app).get('/api/auth/me');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('3. Vendor Onboarding & Store Approval Flow', () => {
    let vendorEmail = `testvendor_${Date.now()}@example.com`;
    let storeSlug;

    it('should register a user and submit vendor application', async () => {
      const regRes = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Artisan Woodsmith',
          email: vendorEmail,
          password: 'Password123!',
          phone: '+1 555-0233'
        });

      vendorTokenCookie = regRes.headers['set-cookie'];
      testVendorId = regRes.body.data.user._id;

      const appRes = await request(app)
        .post('/api/stores/apply')
        .set('Cookie', vendorTokenCookie)
        .send({
          name: `Highland Woodcraft Studio ${Date.now()}`,
          description: 'Specializing in heirloom carved maple utensils and walnut furniture.',
          phone: '+1 555-0233',
          city: 'Asheville',
          state: 'NC'
        });

      expect(appRes.status).toBe(201);
      expect(appRes.body.data.isApproved).toBe(false);
      expect(appRes.body.data.status).toBe('PENDING');
      testStoreId = appRes.body.data._id;
      storeSlug = appRes.body.data.slug;
    });

    it('non-approved vendor cannot add products', async () => {
      const res = await request(app)
        .post('/api/products')
        .set('Cookie', vendorTokenCookie)
        .send({
          name: 'Carved Spoon',
          description: 'Handmade teak spoon for cooking and dining.',
          category: 'Woodworking & Carvings',
          price: 25,
          stock: 10
        });

      expect(res.status).toBe(403);
    });

    it('admin can approve vendor application and upgrade role to VENDOR', async () => {
      // Login admin (from seed)
      const adminLogin = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@artisanscorner.com',
          password: 'ArtisanPass123!'
        });

      adminTokenCookie = adminLogin.headers['set-cookie'];

      const approveRes = await request(app)
        .patch(`/api/admin/vendors/applications/${testStoreId}`)
        .set('Cookie', adminTokenCookie)
        .send({ status: 'APPROVED' });

      expect(approveRes.status).toBe(200);
      expect(approveRes.body.data.isApproved).toBe(true);

      // Re-login vendor to get updated role
      const relogin = await request(app)
        .post('/api/auth/login')
        .send({
          email: vendorEmail,
          password: 'Password123!'
        });
      vendorTokenCookie = relogin.headers['set-cookie'];
      expect(relogin.body.data.user.role).toBe('VENDOR');
    });

    it('approved vendor can now create products', async () => {
      const res = await request(app)
        .post('/api/products')
        .set('Cookie', vendorTokenCookie)
        .send({
          name: 'Hand-Carved Walnut Salad Bowl',
          description: 'Turned on a lathe from a single solid block of black walnut wood.',
          category: 'Woodworking & Carvings',
          price: 95.0,
          compareAtPrice: 110.0,
          stock: 12,
          sku: 'WOOD-BWL-TEST'
        });

      expect(res.status).toBe(201);
      expect(res.body.data.name).toBe('Hand-Carved Walnut Salad Bowl');
      testProductId = res.body.data._id;
    });
  });

  describe('4. Cart & Server-Side Price Verification', () => {
    it('should add item to persistent cart', async () => {
      const res = await request(app)
        .post('/api/cart/items')
        .set('Cookie', buyerTokenCookie)
        .send({
          productId: testProductId,
          quantity: 2
        });

      expect(res.status).toBe(200);
      expect(res.body.data.items.length).toBeGreaterThan(0);
      expect(res.body.data.subtotal).toBe(190); // 2 * $95
    });

    it('should prevent purchasing quantities exceeding stock', async () => {
      const res = await request(app)
        .post('/api/cart/items')
        .set('Cookie', buyerTokenCookie)
        .send({
          productId: testProductId,
          quantity: 50 // Stock is 12
        });

      expect(res.status).toBe(400);
    });
  });

  describe('5. Checkout, Atomic Order Creation & Commission Snapshots', () => {
    it('should create order with server-calculated financial breakdown and decrement stock', async () => {
      const initialProduct = await Product.findById(testProductId);
      const initialStock = initialProduct.stock;

      const orderRes = await request(app)
        .post('/api/orders')
        .set('Cookie', buyerTokenCookie)
        .send({
          shippingAddress: {
            fullName: 'Test Buyer',
            addressLine1: '100 Main St',
            city: 'Portland',
            state: 'OR',
            postalCode: '97201',
            country: 'United States',
            phone: '+1 555-0199'
          },
          items: [{ productId: testProductId.toString(), quantity: 2 }],
          paymentStatus: 'PAID',
          stripePaymentIntentId: 'pi_test_automated_suite_123'
        });

      expect(orderRes.status).toBe(201);
      const order = orderRes.body.data;
      expect(order.subtotal).toBe(190);
      expect(order.platformFee).toBe(9.5); // 5% of 190
      expect(order.vendorPayout).toBe(180.5); // 95% of 190
      expect(order.paymentStatus).toBe('PAID');
      testOrderId = order._id;

      // Verify stock was atomically decremented
      const updatedProduct = await Product.findById(testProductId);
      expect(updatedProduct.stock).toBe(initialStock - 2);
    });
  });

  describe('6. Verified Purchase Review Rules', () => {
    it('buyer can review product they purchased and paid for', async () => {
      const res = await request(app)
        .post('/api/reviews')
        .set('Cookie', buyerTokenCookie)
        .send({
          productId: testProductId.toString(),
          orderId: testOrderId.toString(),
          rating: 5,
          comment: 'Outstanding quality and craftsmanship. Will definitely buy again!'
        });

      expect(res.status).toBe(201);
      expect(res.body.data.isVerifiedPurchase).toBe(true);

      // Verify product rating updated
      const product = await Product.findById(testProductId);
      expect(product.rating).toBe(5);
      expect(product.numReviews).toBe(1);
    });

    it('buyer cannot submit duplicate review for the same purchase order', async () => {
      const res = await request(app)
        .post('/api/reviews')
        .set('Cookie', buyerTokenCookie)
        .send({
          productId: testProductId.toString(),
          orderId: testOrderId.toString(),
          rating: 4,
          comment: 'Another review attempt for same order.'
        });

      expect(res.status).toBe(400);
    });
  });
});
