import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import errorHandler from './middleware/errorHandler.js';
import authRoutes from './routes/auth.routes.js';
import customerRoutes from './routes/customer.routes.js';
import productRoutes from './routes/product.routes.js';
import challanRoutes from './routes/challan.routes.js';
import seedRoutes from './routes/seed.routes.js';

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Global DB connection middleware - ensures DB is connected before ANY route
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('DB connection middleware error:', error.message);
    res.status(503).json({
      success: false,
      message: 'Database connection failed',
      error: error.message
    });
  }
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'API is running',
    timestamp: new Date().toISOString(),
    env: {
      nodeEnv: process.env.NODE_ENV,
      hasMongoUri: !!process.env.MONGODB_URI,
      hasJwtSecret: !!process.env.JWT_SECRET
    }
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/products', productRoutes);
app.use('/api/challans', challanRoutes);
app.use('/api/admin', seedRoutes); // Temporary seed route

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler (must be last)
app.use(errorHandler);

export default app;
