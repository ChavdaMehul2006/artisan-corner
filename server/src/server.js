const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

// Connect to MongoDB and start HTTP server
const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(PORT, () => {
      console.log(`=========================================`);
      console.log(`  Artisan's Corner API Server Running    `);
      console.log(`  Port: http://localhost:${PORT}          `);
      console.log(`  Environment: ${process.env.NODE_ENV || 'development'} `);
      console.log(`=========================================`);
    });

    // Graceful shutdown handling
    const shutdown = () => {
      console.log('\nReceived kill signal, shutting down gracefully...');
      server.close(() => {
        console.log('Closed out remaining connections');
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
