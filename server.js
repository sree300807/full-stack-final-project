const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Initialize Express App
const app = express();

// Connect to MongoDB
connectDB();

// Core Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'LEDGER Financial Management Backend API is operational',
    timestamp: new Date().toISOString(),
    auth: 'JWT (JSON Web Tokens)',
    database: 'MongoDB with Mongoose ODM',
  });
});

// Mount API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/transactions', require('./routes/transactionRoutes'));
app.use('/api/budgets', require('./routes/budgetRoutes'));

// Error Middleware
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
app.use(notFound);
app.use(errorHandler);

// Start HTTP Server
const PORT = process.env.PORT || 5001;
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`
  ╔════════════════════════════════════════════════════════╗
  ║    🚀 LEDGER BACKEND SERVER RUNNING                    ║
  ║    🌐 Port: http://localhost:${PORT}                   ║
  ║    🔒 Security: JWT & Bcryptjs Active                  ║
  ║    📦 Database: MongoDB & Mongoose ODM                 ║
  ╚════════════════════════════════════════════════════════╝
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection Error: ${err.message}`);
});
