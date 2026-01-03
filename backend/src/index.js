/**
 * DAYFLOW BACKEND SERVER
 * 
 * This is the main entry point of the backend API
 * Think of it as the "traffic controller" that:
 * 1. Starts the server
 * 2. Listens for requests from the frontend
 * 3. Routes requests to the appropriate handlers
 */

// Import required libraries
const express = require('express');  // Web framework for building APIs
const cors = require('cors');        // Allows frontend to communicate with backend
require('dotenv').config();          // Loads environment variables from .env file

// Import routes
const authRoutes = require('./routes/auth');

// Create an Express application
const app = express();

// Get port from environment variable, default to 3000
const PORT = process.env.PORT || 3000;

// ============= MIDDLEWARE =============
// Middleware processes every request before it reaches your routes

// Enable CORS (allows requests from different domains)
app.use(cors());

// Parse JSON data from requests
app.use(express.json());

// ============= AUTHENTICATION ROUTES =============
app.use('/api/auth', authRoutes);

// ============= BASIC ROUTES =============

// Health check endpoint - used to verify server is running
app.get('/api/health', (req, res) => {
  res.json({
    status: 'Server is running',
    timestamp: new Date()
  });
});

// Welcome endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to DayFlow HRMS Backend API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: {
        signup: 'POST /api/auth/signup',
        signin: 'POST /api/auth/signin',
        verifyEmail: 'POST /api/auth/verify-email',
        verifyToken: 'POST /api/auth/verify-token',
        getMe: 'GET /api/auth/me',
        logout: 'POST /api/auth/logout'
      }
    }
  });
});

// ============= START SERVER =============

app.listen(PORT, () => {
  console.log(`
  ╔═══════════════════════════════════════════╗
  ║   DayFlow HRMS Backend Server (Phase 2)   ║
  ║                                           ║
  ║  Server running on http://localhost:${PORT}    ║
  ║                                           ║
  ║  Authentication Endpoints:                ║
  ║  - POST /api/auth/signup                  ║
  ║  - POST /api/auth/signin                  ║
  ║  - POST /api/auth/verify-email            ║
  ║  - POST /api/auth/verify-token            ║
  ║  - GET  /api/auth/me                      ║
  ║  - POST /api/auth/logout                  ║
  ║                                           ║
  ║  Development: npm run dev                 ║
  ║  Database: npm run prisma:studio          ║
  ╚═══════════════════════════════════════════╝
  `);
});

module.exports = app;
