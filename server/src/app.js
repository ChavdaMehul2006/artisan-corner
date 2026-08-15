const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const morgan = require('morgan');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const routes = require('./routes');
const errorHandler = require('./middleware/error.middleware');
const { apiLimiter } = require('./middleware/rateLimiter');
const ApiError = require('./utils/apiError');

const app = express();

// Security HTTP headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }
  })
);

// CORS configuration
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173'
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Allow dev origins gracefully
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'stripe-signature']
  })
);

// HTTP request logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Special handling for Stripe Webhook before JSON body parser
app.use((req, res, next) => {
  if (req.originalUrl === '/api/payments/webhook') {
    next();
  } else {
    express.json({ limit: '10mb' })(req, res, next);
  }
});

// URL-encoded body parser
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookie parser for HTTP-only JWTs
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Apply rate limiting to all API routes
app.use('/api', apiLimiter);

   // Health check endpoint
  app.get('/', (req, res) => {
    res.status(200).json({
      success: true,
      message: "Artisan's Corner API Server is running",
      version: '1.0.0',
      status: 'healthy'
    });
  });

// API Routes
app.use('/api', routes);

// Handle undefined routes
app.use('*', (req, res, next) => {
  next(new ApiError(404, `Cannot find ${req.originalUrl} on this server`));
});

// Centralized error handler
app.use(errorHandler);

module.exports = app;
