const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("../models/User");
const Store = require("../models/Store");
const Product = require("../models/Product");
const Order = require("../models/Order");
const Review = require("../models/Review");
const Setting = require("../models/Setting");
const { calculateFinancials } = require("../utils/helpers");

dotenv.config();

const seedDatabase = async () => {
  try {
    const mongoURI =
      process.env.MONGO_URI || "mongodb://127.0.0.1:27017/artisan_corner";
    await mongoose.connect(mongoURI);
    console.log("[Seed] Connected to MongoDB");

    // Clean existing collections
    await Promise.all([
      User.deleteMany({}),
      Store.deleteMany({}),
      Product.deleteMany({}),
      Order.deleteMany({}),
      Review.deleteMany({}),
      Setting.deleteMany({}),
    ]);
    console.log("[Seed] Cleaned existing collections");

    // 1. Create Default Marketplace Setting
    const setting = await Setting.create({
      key: "marketplace_config",
      platformCommissionPercent: 5,
      marketplaceName: "Artisan's Corner",
      supportEmail: "support@artisanscorner.com",
      currency: "USD",
    });
    console.log("[Seed] Created marketplace settings (5% commission)");

    const DEFAULT_PASSWORD = "ArtisanPass123!";

    // 2. Create Users
    const adminUser = await User.create({
      name: "Mehul (Admin)",
      email: "admin@artisanscorner.com",
      password: "Mehul$#@123",
      role: "ADMIN",
      phone: "+1 (555) 019-4572",
      isActive: true,
      avatar: {
        url: "https://plus.unsplash.com/premium_photo-1689977927774-401b12d137d6?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        publicId: null,
      },
    });

    const vendorUser1 = await User.create({
      name: "Vikrant",
      email: "vendor@artisanscorner.com",
      password: "Vikrant$#@123",
      role: "VENDOR",
      phone: "+1 (555) 018-9999",
      isActive: true,
      avatar: {
        url: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        publicId: null,
      },
    });

    const vendorUser2 = await User.create({
      name: "Maya",
      email: "maya@artisanscorner.com",
      password: "Maya$#@123",
      role: "VENDOR",
      phone: "+1 (555) 017-4444",
      isActive: true,
      avatar: {
        url: "https://images.unsplash.com/photo-1634595477722-7bc68dd410fd?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        publicId: null,
      },
    });

    const vendorUser3 = await User.create({
      name: "Oliver Blackwood",
      email: "oliver@artisanscorner.com",
      password: "Oliver$#@123",
      role: "VENDOR",
      phone: "+1 (555) 016-7777",
      isActive: true,
      avatar: {
        url: "https://images.unsplash.com/photo-1567784177951-6fa58317e16b?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        publicId: null,
      },
    });

    const buyerUser1 = await User.create({
      name: "Clara Oswald (Buyer)",
      email: "buyer@artisanscorner.com",
      password: "Clara$#@123",
      role: "BUYER",
      phone: "+1 (555) 014-5666",
      isActive: true,
      avatar: {
        url: "https://images.unsplash.com/photo-1594672830234-ba4cfe1202dc?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        publicId: null,
      },
    });

    const buyerUser2 = await User.create({
      name: "Arun (Buyer)",
      email: "arun@artisanscorner.com",
      password: "Arun$#@123",
      role: "BUYER",
      phone: "+1 (555) 014-5888",
      isActive: true,
      avatar: {
        url: "https://plus.unsplash.com/premium_photo-1691030256264-59cdf9414ed1?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        publicId: null,
      },
    });
    const buyerUser3 = await User.create({
      name: "Vimal (Buyer)",
      email: "vimal@artisanscorner.com",
      password: "Vimal$#@123",
      role: "BUYER",
      phone: "+9244145855",
      isActive: true,
      avatar: {
        url: "https://images.unsplash.com/photo-1581382575275-97901c2635b7?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bWFufGVufDB8fDB8fHww",
        publicId: null,
      },
    });
    const buyerUser4 = await User.create({
      name: "Anmol (Buyer)",
      email: "anmol@artisanscorner.com",
      password: "Anmol$#@123",
      role: "BUYER",
      phone: "+9524258625",
      isActive: true,
      avatar: {
        url: "https://plus.unsplash.com/premium_photo-1723770023600-8083358720aa?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bWFufGVufDB8fDB8fHww",
        publicId: null,
      },
    });

    console.log("[Seed] Created users (Admin, 3 Vendors, 4 Buyers)");

    // 3. Create Stores
    const store1 = await Store.create({
      owner: vendorUser1._id,
      name: "Terra & Kiln Pottery Studio",
      slug: "terra-and-kiln-pottery-studio",
      description:
        "Hand-thrown stoneware and porcelain ceramics crafted with natural wood-ash glazes in our solar-powered Vermont studio.",
      phone: "+1 (555) 018-9922",
      address: {
        street: "142 Birch Hollow Rd",
        city: "Burlington",
        state: "VT",
        postalCode: "05401",
        country: "United States",
      },
      logo: {
        url: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&q=80&w=400",
        publicId: null,
      },
      banner: {
        url: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=1200",
        publicId: null,
      },
      isApproved: true,
      status: "APPROVED",
    });

    const store2 = await Store.create({
      owner: vendorUser2._id,
      name: "Aura & Thread Textiles",
      slug: "aura-and-thread-textiles",
      description:
        "Sustainable botanical hand-dyed linen throws, organic cotton scarves, and loom-woven wall hangings.",
      phone: "+1 (555) 017-4411",
      address: {
        street: "88 Loomis Avenue",
        city: "Portland",
        state: "OR",
        postalCode: "97201",
        country: "United States",
      },
      logo: {
        url: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&q=80&w=400",
        publicId: null,
      },
      banner: {
        url: "https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&q=80&w=1200",
        publicId: null,
      },
      isApproved: true,
      status: "APPROVED",
    });

    const store3 = await Store.create({
      owner: vendorUser3._id,
      name: "Old Oak Woodcraft & Leather",
      slug: "old-oak-woodcraft-and-leather",
      description:
        "Heritage hand-carved walnut kitchen boards, live-edge dining accents, and vegetable-tanned saddle leather wares.",
      phone: "+1 (555) 016-7788",
      address: {
        street: "304 Timberline Way",
        city: "Asheville",
        state: "NC",
        postalCode: "28801",
        country: "United States",
      },
      logo: {
        url: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=400",
        publicId: null,
      },
      banner: {
        url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=1200",
        publicId: null,
      },
      isApproved: true,
      status: "APPROVED",
    });

    // Update vendor records with store IDs
    await User.findByIdAndUpdate(vendorUser1._id, { store: store1._id });
    await User.findByIdAndUpdate(vendorUser2._id, { store: store2._id });
    await User.findByIdAndUpdate(vendorUser3._id, { store: store3._id });

    console.log("[Seed] Created 3 Approved Artisan Stores");

    // 4. Create 18 Diverse Artisan Products
    const productsData = [
      {
        vendor: vendorUser1._id,
        store: store1._id,
        name: "Hand-Thrown Speckled Stoneware Mug",
        slug: "hand-thrown-speckled-stoneware-mug",
        description:
          "Meticulously shaped on the potter's wheel from durable stoneware clay, featuring a natural iron-fleck glaze and a comfortable ergonomic thumb-rest handle. Microwave and dishwasher safe.",
        category: "Ceramics & Pottery",
        price: 38.0,
        compareAtPrice: 45.0,
        stock: 24,
        sku: "POT-MUG-001",
        isFeatured: true,
        images: [
          {
            url: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=800",
          },
          {
            url: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&q=80&w=800",
          },
        ],
      },
      {
        vendor: vendorUser1._id,
        store: store1._id,
        name: "Rustic Fluted Ceramic Pour-Over Dripper",
        slug: "rustic-fluted-ceramic-pour-over-dripper",
        description:
          "Brew the perfect morning coffee with our ribbed pour-over dripper. Designed with internal spiral channels for optimal extraction and an earthy matte oatmeal glaze.",
        category: "Ceramics & Pottery",
        price: 52.0,
        compareAtPrice: 60.0,
        stock: 15,
        sku: "POT-DRIP-002",
        isFeatured: true,
        images: [
          {
            url: "https://images.unsplash.com/photo-1577937927133-66ef06acdf18?auto=format&fit=crop&q=80&w=800",
          },
        ],
      },
      {
        vendor: vendorUser1._id,
        store: store1._id,
        name: "Minimalist Wabi-Sabi Ceramic Vase",
        slug: "minimalist-wabi-sabi-ceramic-vase",
        description:
          "Celebrating imperfection, this hand-pinched sculptural vase features subtle organic textures and an unglazed natural terracotta base with glazed interior for fresh botanicals.",
        category: "Home & Living",
        price: 68.0,
        compareAtPrice: 80.0,
        stock: 10,
        sku: "POT-VASE-003",
        isFeatured: false,
        images: [
          {
            url: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&q=80&w=800",
          },
        ],
      },
      {
        vendor: vendorUser1._id,
        store: store1._id,
        name: "Handmade Stoneware Pasta & Grain Bowls (Set of 4)",
        slug: "handmade-stoneware-pasta-grain-bowls-set-of-4",
        description:
          "Set of four wide-rimmed stoneware bowls perfect for salads, hearty pastas, and warm soups. Glazed in a soothing sage green and slate gradient.",
        category: "Ceramics & Pottery",
        price: 130.0,
        compareAtPrice: 155.0,
        stock: 8,
        sku: "POT-BWL-004",
        isFeatured: true,
        images: [
          {
            url: "https://images.unsplash.com/photo-1523367438061-01c055ce790c?q=80&w=1075&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          },
        ],
      },
      {
        vendor: vendorUser1._id,
        store: store1._id,
        name: "Botanical Incense Burner Plate",
        slug: "botanical-incense-burner-plate",
        description:
          "Handcrafted ceramic dish with embossed wild fern impressions to catch falling ash, suited for stick and cone incense alike.",
        category: "Candles & Apothecary",
        price: 24.0,
        compareAtPrice: null,
        stock: 35,
        sku: "POT-INC-005",
        isFeatured: false,
        images: [
          {
            url: "https://images.unsplash.com/photo-1602928321679-560bb453f190?auto=format&fit=crop&q=80&w=800",
          },
        ],
      },
      {
        vendor: vendorUser2._id,
        store: store2._id,
        name: "Hand-Woven Merino Wool & Linen Throw Blanket",
        slug: "hand-woven-merino-wool-linen-throw-blanket",
        description:
          "Woven on a traditional floor loom combining soft ethical merino wool with sturdy French flax linen. Finished with hand-twisted fringe tassels.",
        category: "Textiles & Weaving",
        price: 165.0,
        compareAtPrice: 195.0,
        stock: 12,
        sku: "TEX-THR-001",
        isFeatured: true,
        images: [
          {
            url: "https://images.unsplash.com/photo-1600369672770-985fd30004eb?q=80&w=817&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          },
        ],
      },
      {
        vendor: vendorUser2._id,
        store: store2._id,
        name: "Indigo Shibori Linen Table Runner",
        slug: "indigo-shibori-linen-table-runner",
        description:
          "Natural pure linen table runner dip-dyed in authentic organic indigo vats using ancient Japanese resist-dye techniques. Each piece features a unique tide pattern.",
        category: "Home & Living",
        price: 58.0,
        compareAtPrice: 70.0,
        stock: 20,
        sku: "TEX-RUN-002",
        isFeatured: false,
        images: [
          {
            url: "https://i.etsystatic.com/64175255/r/il/2ba841/8151831982/il_300x300.8151831982_olrp.jpg",
          },
        ],
      },
      {
        vendor: vendorUser2._id,
        store: store2._id,
        name: "Macrame Brass & Cotton Fiber Wall Hanging",
        slug: "macrame-brass-cotton-fiber-wall-hanging",
        description:
          "Modern bohemian fiber art created with unbleached triple-twist cotton cord structured on a solid brushed brass rod.",
        category: "Art & Prints",
        price: 95.0,
        compareAtPrice: 110.0,
        stock: 6,
        sku: "TEX-WALL-003",
        isFeatured: true,
        images: [
          {
            url: "https://images.unsplash.com/photo-1776721977064-d4e5389db6b9?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          },
        ],
      },
      {
        vendor: vendorUser2._id,
        store: store2._id,
        name: "Organic Hemp Handcrafted Market Tote",
        slug: "organic-hemp-handcrafted-market-tote",
        description:
          "Ultra-durable, breathable everyday tote bag crafted from heavy-duty organic hemp canvas with vegetable-tanned leather handle anchors.",
        category: "Textiles & Weaving",
        price: 48.0,
        compareAtPrice: null,
        stock: 30,
        sku: "TEX-TOTE-004",
        isFeatured: false,
        images: [
          {
            url: "https://images.unsplash.com/photo-1556095667-9760aa7f4885?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          },
        ],
      },
      {
        vendor: vendorUser2._id,
        store: store2._id,
        name: "Handwoven Basket",
        slug: "handwoven-basket",
        description:
          "This handwoven basket is carefully crafted by skilled artisans using traditional weaving techniques.",
        category: "Textiles & Weaving",
        price: 78.0,
        compareAtPrice: null,
        stock: 30,
        sku: "TEX-BSK-005",
        isFeatured: false,
        images: [
          {
            url: "https://plus.unsplash.com/premium_photo-1661340673344-450dbf9f6482?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8SGFuZHdvdmVuJTIwQmFza2V0fGVufDB8fDB8fHww",
          },
        ],
      },
      {
        vendor: vendorUser2._id,
        store: store2._id,
        name: "Gujarati Embroidery Bag",
        slug: "gujarati-embroidery-bag",
        description:
          "The bag features colorful threads, intricate patterns, and decorative stitching that reflect the rich cultural heritage of Gujarat.",
        category: "Textiles & Weaving",
        price: 128.0,
        compareAtPrice: null,
        stock: 30,
        sku: "TEX-GUJ-007",
        isFeatured: false,
        images: [
          {
            url: "https://images.unsplash.com/photo-1667761669196-dfbcc293c123?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          },
        ],
      },
      {
        vendor: vendorUser2._id,
        store: store2._id,
        name: "Handcrafted Dreamcatcher",
        slug: "handcrafted-dreamcatcher",
        description:
          "Intricately hand-woven bohemian dreamcatcher featuring natural unbleached cotton webbing, organic wooden beads, and cruelty-free feathers for a serene aesthetic.",
        category: "Home & Living",
        price: 98.0,
        compareAtPrice: 115.0,
        stock: 28,
        sku: "DMC-WVN-006",
        isFeatured: false,
        images: [
          {
            url: "https://plus.unsplash.com/premium_photo-1723924946708-973d65d3bf4f?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8SGFuZGNyYWZ0ZWQlMjBEcmVhbWNhdGNoZXJ8ZW58MHx8MHx8fDA%3D",
          },
        ],
      },
      {
        vendor: vendorUser2._id,
        store: store2._id,
        name: "Custom Photo Frame",
        slug: "custom-photo-frame",
        description:
          "Made with care by skilled artisans, this frame can be personalized with a name, special message, or meaningful design.",
        category: "Home & Living",
        price: 68.0,
        compareAtPrice: 115.0,
        stock: 28,
        sku: "HOM-FRM-008",
        isFeatured: false,
        images: [
          {
            url: "https://images.unsplash.com/photo-1683523946422-64283e8af4d5?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          },
        ],
      },
      {
        vendor: vendorUser2._id,
        store: store2._id,
        name: "Hammered Raw Brass & Freshwater Pearl Earrings",
        slug: "hammered-raw-brass-freshwater-pearl-earrings",
        description:
          "Hand-forged brass hoops with organic texture and natural baroque freshwater pearls suspended on hypoallergenic sterling silver posts.",
        category: "Handmade Jewelry",
        price: 64.0,
        compareAtPrice: 75.0,
        stock: 18,
        sku: "JWL-EAR-005",
        isFeatured: true,
        images: [
          {
            url: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800",
          },
        ],
      },
      {
        vendor: vendorUser3._id,
        store: store3._id,
        name: "Hand-Carved Black Walnut Charcuterie Board",
        slug: "hand-carved-black-walnut-charcuterie-board",
        description:
          "Artisan serving board made from sustainably harvested American black walnut, finished with food-grade organic beeswax and mineral oil. Features a sculpted ergonomic handle and hanging loop.",
        category: "Woodworking & Carvings",
        price: 88.0,
        compareAtPrice: 105.0,
        stock: 14,
        sku: "WOD-BRD-001",
        isFeatured: true,
        images: [
          {
            url: "https://www.sinfulfood.com/cdn/shop/files/thumbnail_IMG_7881.jpg?v=1709852698",
          },
        ],
      },
      {
        vendor: vendorUser3._id,
        store: store3._id,
        name: "Full-Grain Leather Field Journal & Pen Sleeve",
        slug: "full-grain-leather-field-journal-pen-sleeve",
        description:
          "Hand-stitched with waxed linen thread from 5oz vegetable-tanned Horween leather. Includes a refillable blank cotton rag paper notebook that develops a gorgeous patina over time.",
        category: "Leather Goods",
        price: 72.0,
        compareAtPrice: 85.0,
        stock: 22,
        sku: "LTH-JRN-002",
        isFeatured: true,
        images: [
          {
            url: "https://images.unsplash.com/photo-1720534195942-d55d1760df95?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          },
        ],
      },
      {
        vendor: vendorUser3._id,
        store: store3._id,
        name: "Handmade Leather Watch Strap",
        slug: "handmade-leather-watch-strap",
        description:
          "The natural leather texture gives every strap a unique character, while the strong stitching ensures long-lasting use. Perfect for everyday wear, formal occasions, gifting, and upgrading your favorite wristwatch.",
        category: "Leather Goods",
        price: 145.0,
        compareAtPrice: 175.0,
        stock: 29,
        sku: "LTH-WTC-009",
        isFeatured: true,
        images: [
          {
            url: "https://images.unsplash.com/photo-1628483211149-1aed2a58cf81?q=80&w=1972&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          },
        ],
      },
      {
        vendor: vendorUser3._id,
        store: store3._id,
        name: "Turned Hard Maple Salt & Pepper Grinder Mill",
        slug: "turned-hard-maple-salt-pepper-grinder-mill",
        description:
          "Turned on a wood lathe from solid hard maple featuring ultra-durable CrushGrind ceramic internal mechanisms that grind peppercorns and rock salt with effortless precision.",
        category: "Woodworking & Carvings",
        price: 65.0,
        compareAtPrice: null,
        stock: 16,
        sku: "WOD-ML-003",
        isFeatured: false,
        images: [
          {
            url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPIPltvmBTITJ9ZBJ-3NP-fyvZuNrFLtm1me8hh3KfD7sAe9-M96uXF-c&s=10",
          },
        ],
      },
      {
        vendor: vendorUser3._id,
        store: store3._id,
        name: "Wooden Decorative Clock",
        slug: "wooden-decorative-clock",
        description:
          "This artisan wall clock is carefully shaped, carved, and finished by hand from solid seasoned hardwood to highlight the natural grain and unique character of the wood.",
        category: "Woodworking & Carvings",
        price: 255.0,
        compareAtPrice: null,
        stock: 16,
        sku: "WOD-CLK-010",
        isFeatured: false,
        images: [
          {
            url: "https://images.unsplash.com/photo-1707348102631-5a4c0a6eed6f?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          },
        ],
      },
      {
        vendor: vendorUser3._id,
        store: store3._id,
        name: "Minimalist Bifold Leather Wallet with Brass Snap",
        slug: "minimalist-bifold-leather-wallet-with-brass-snap",
        description:
          "Slimline wallet engineered to comfortably hold 8 cards and folded cash without bulk. Edges are beveled and burnished by hand with natural beeswax.",
        category: "Leather Goods",
        price: 45.0,
        compareAtPrice: 55.0,
        stock: 28,
        sku: "LTH-WLT-004",
        isFeatured: false,
        images: [
          {
            url: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80&w=800",
          },
        ],
      },
      {
        vendor: vendorUser3._id,
        store: store3._id,
        name: "Carved Teak Wood Comfort Spoon & Ladle Set",
        slug: "carved-teak-wood-comfort-spoon-ladle-set",
        description:
          "Set of two cooking and serving utensils hand-carved from reclaimed golden teak wood. Safe for nonstick cookware and beautiful on display.",
        category: "Woodworking & Carvings",
        price: 34.0,
        compareAtPrice: 40.0,
        stock: 40,
        sku: "WOD-SPN-005",
        isFeatured: false,
        images: [
          {
            url: "https://plus.unsplash.com/premium_photo-1664007654191-75992ed6627b?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          },
        ],
      },
      {
        vendor: vendorUser1._id,
        store: store1._id,
        name: "Wild Amber & Cedarwood Soy Wax Candle",
        slug: "wild-amber-cedarwood-soy-wax-candle",
        description:
          "Hand-poured 100% soy candle infused with natural essential oils of aged cedar, amber resin, and wild sage in a reusable ceramic vessel with a crackling wooden wick.",
        category: "Candles & Apothecary",
        price: 32.0,
        compareAtPrice: null,
        stock: 45,
        sku: "CND-AMB-006",
        isFeatured: true,
        images: [
          {
            url: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=800",
          },
        ],
      },
      {
        vendor: vendorUser1._id,
        store: store1._id,
        name: "Handcrafted Beeswax Candle",
        slug: "Handcrafted-Beeswax-Candle",
        description:
          "candle is handmade with attention to detail, featuring a warm natural color, subtle honey-like character, and a clean, elegant appearance. Its soft glow creates a cozy and relaxing atmosphere, making it perfect for home décor, festive occasions, meditation spaces, celebrations, and thoughtful gifting.",
        category: "Candles & Apothecary",
        price: 92.0,
        compareAtPrice: 102.0,
        stock: 45,
        sku: "CND-AMB-006",
        isFeatured: true,
        images: [
          {
            url: "https://plus.unsplash.com/premium_photo-1666632532497-be376c26b3c2?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          },
        ],
      },
      {
        vendor: vendorUser2._id,
        store: store2._id,
        name: "Sterling Silver Stacking Bands with Raw Opal",
        slug: "sterling-silver-stacking-bands-with-raw-opal",
        description:
          "Trio of hand-textured 925 sterling silver rings centered with an ethically mined Australian raw crystal opal bezel-set in silver.",
        category: "Handmade Jewelry",
        price: 82.0,
        compareAtPrice: 95.0,
        stock: 10,
        sku: "JWL-OPL-006",
        isFeatured: false,
        images: [
          {
            url: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=800",
          },
        ],
      },
      {
        vendor: vendorUser2._id,
        store: store2._id,
        name: "Handcrafted Statement Necklace",
        slug: "Handcrafted-Statement-Necklace",
        description:
          "Slight variations in color, pattern, and texture are natural characteristics of handmade jewelry, making every piece unique.",
        category: "Handmade Jewelry",
        price: 182.0,
        compareAtPrice: 195.0,
        stock: 10,
        sku: "JWL-OPL-006",
        isFeatured: false,
        images: [
          {
            url: "https://images.unsplash.com/photo-1738754852630-e2a742a7acf5?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          },
        ],
      },
      {
        vendor: vendorUser3._id,
        store: store3._id,
        name: "Custom Botanical Woodblock Art Print",
        slug: "custom-botanical-woodblock-art-print",
        description:
          "Limited edition relief print hand-pressed on heavyweight deckle-edge Japanese washi paper using oil-based archival carbon ink. Signed and numbered.",
        category: "Art & Prints",
        price: 55.0,
        compareAtPrice: 65.0,
        stock: 25,
        sku: "ART-PRN-007",
        isFeatured: true,
        images: [
          {
            url: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=800",
          },
        ],
      },
      {
        vendor: vendorUser3._id,
        store: store3._id,
        name: "Hand-Painted Floral Artwork",
        slug: "hand-painted-floral-artwork",
        description:
          "A beautiful Hand-Painted Floral Artwork created by skilled artists using traditional painting techniques. The artwork features delicate flowers, vibrant details, and artistic brushstrokes that bring a natural and elegant feel to the design.",
        category: "Art & Prints",
        price: 95.0,
        compareAtPrice: 105.0,
        stock: 25,
        sku: "ART-FLR-013",
        isFeatured: true,
        images: [
          {
            url: "https://images.unsplash.com/photo-1723578154758-c88bad35875c?q=80&w=713&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          },
        ],
      },
    ];

    const createdProducts = await Product.insertMany(productsData);
    console.log(`[Seed] Created ${createdProducts.length} Artisan Products`);

    // 5. Create Sample Paid Orders with Multi-Vendor Splits
    const p1 = createdProducts[0]; // Vendor 1 Mug $38
    const p2 = createdProducts[5]; // Vendor 2 Blanket $165
    const p3 = createdProducts[10]; // Vendor 3 Board $88

    // Multi-vendor Order 1 (Buyer purchased Mug from Vendor 1 and Blanket from Vendor 2)
    const fin1 = calculateFinancials(p1.price, 2, 5); // 2 * 38 = 76 -> fee: 3.80, payout: 72.20
    const fin2 = calculateFinancials(p2.price, 1, 5); // 1 * 165 = 165 -> fee: 8.25, payout: 156.75
    const order1Subtotal = fin1.subtotal + fin2.subtotal;
    const order1Fee = fin1.platformFee + fin2.platformFee;
    const order1Payout = fin1.vendorPayout + fin2.vendorPayout;
    const order1Tax = Math.round(order1Subtotal * 0.05 * 100) / 100;
    const order1Total = order1Subtotal + order1Tax;

    const sampleOrder1 = await Order.create({
      orderNumber: `ORD-${Date.now().toString(36).toUpperCase()}-V1V2`,
      buyer: buyerUser1._id,
      items: [
        {
          product: p1._id,
          vendor: vendorUser1._id,
          store: store1._id,
          productName: p1.name,
          image: p1.images[0].url,
          quantity: 2,
          unitPrice: p1.price,
          subtotal: fin1.subtotal,
          platformFee: fin1.platformFee,
          vendorPayout: fin1.vendorPayout,
          itemStatus: "DELIVERED",
        },
        {
          product: p2._id,
          vendor: vendorUser2._id,
          store: store2._id,
          productName: p2.name,
          image: p2.images[0].url,
          quantity: 1,
          unitPrice: p2.price,
          subtotal: fin2.subtotal,
          platformFee: fin2.platformFee,
          vendorPayout: fin2.vendorPayout,
          itemStatus: "DELIVERED",
        },
      ],
      shippingAddress: {
        fullName: "Clara Oswald",
        addressLine1: "742 Evergreen Terrace",
        city: "Springfield",
        state: "OR",
        postalCode: "97477",
        country: "United States",
        phone: "+1 (555) 014-5566",
      },
      subtotal: order1Subtotal,
      platformFee: order1Fee,
      vendorPayout: order1Payout,
      shippingFee: 0,
      tax: order1Tax,
      totalAmount: order1Total,
      paymentStatus: "PAID",
      orderStatus: "DELIVERED",
      stripePaymentIntentId: "pi_artisan_seed_001_mock",
      paidAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      deliveredAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    });

    // Sample Order 2 (Purchased Woodworking Board from Vendor 3)
    const fin3 = calculateFinancials(p3.price, 1, 5);
    const order2Tax = Math.round(fin3.subtotal * 0.05 * 100) / 100;
    const sampleOrder2 = await Order.create({
      orderNumber: `ORD-${Date.now().toString(36).toUpperCase()}-V3`,
      buyer: buyerUser1._id,
      items: [
        {
          product: p3._id,
          vendor: vendorUser3._id,
          store: store3._id,
          productName: p3.name,
          image: p3.images[0].url,
          quantity: 1,
          unitPrice: p3.price,
          subtotal: fin3.subtotal,
          platformFee: fin3.platformFee,
          vendorPayout: fin3.vendorPayout,
          itemStatus: "SHIPPED",
        },
      ],
      shippingAddress: {
        fullName: "Clara Oswald",
        addressLine1: "742 Evergreen Terrace",
        city: "Springfield",
        state: "OR",
        postalCode: "97477",
        country: "United States",
        phone: "+1 (555) 014-5566",
      },
      subtotal: fin3.subtotal,
      platformFee: fin3.platformFee,
      vendorPayout: fin3.vendorPayout,
      shippingFee: 0,
      tax: order2Tax,
      totalAmount: fin3.subtotal + order2Tax,
      paymentStatus: "PAID",
      orderStatus: "SHIPPED",
      stripePaymentIntentId: "pi_artisan_seed_002_mock",
      paidAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    });

    console.log("[Seed] Created 2 Sample Multi-Vendor Paid Orders");

    // 6. Create Verified Purchase Reviews
    await Review.create({
      product: p1._id,
      user: buyerUser1._id,
      order: sampleOrder1._id,
      rating: 5,
      comment:
        "Absolutely exquisite craftsmanship! The weight of the mug is balanced, and the natural glaze has such rich character in person. Drinking my morning coffee from this is a pure delight.",
      isVerifiedPurchase: true,
    });

    await Review.create({
      product: p2._id,
      user: buyerUser1._id,
      order: sampleOrder1._id,
      rating: 5,
      comment:
        "Incredible texture and softness! You can clearly feel the dedication and heritage weave quality. Fast shipping and thoughtful eco-friendly packaging.",
      isVerifiedPurchase: true,
    });

    // Recalculate ratings
    await Review.calculateAverageRating(p1._id);
    await Review.calculateAverageRating(p2._id);

    console.log(
      "[Seed] Created Verified Purchase Reviews and Recalculated Ratings",
    );

    console.log("\n======================================================");
    console.log("  Artisan's Corner Database Seeding Completed!");
    console.log("======================================================");
    console.log("  DEMO CREDENTIALS:");
    console.log("  ----------------------------------------------------");
    console.log("  1. Administrator:");
    console.log("     Email:    admin@artisanscorner.com");
    console.log("     Password: " + DEFAULT_PASSWORD);
    console.log("  ----------------------------------------------------");
    console.log("  2. Demo Vendor (Artisan Store Owner):");
    console.log("     Email:    vendor@artisanscorner.com");
    console.log("     Password: " + DEFAULT_PASSWORD);
    console.log("  ----------------------------------------------------");
    console.log("  3. Demo Buyer:");
    console.log("     Email:    buyer@artisanscorner.com");
    console.log("     Password: " + DEFAULT_PASSWORD);
    console.log("======================================================\n");

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("[Seed Error]", error);
    process.exit(1);
  }
};

seedDatabase();
