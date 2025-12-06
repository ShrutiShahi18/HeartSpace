const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
}

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/journal', require('./routes/journal'));
app.use('/api/insights', require('./routes/insights'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'HeartSpace API is running' });
});

// Serve React app in production (must be after API routes)
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

// Check environment variables
if (!process.env.MONGODB_URI) {
  console.error('❌ ERROR: MONGODB_URI is not set in your .env file!');
  console.error('   Please create a .env file in the server directory with:');
  console.error('   MONGODB_URI=mongodb://localhost:27017/heartspace');
  console.error('   OR use MongoDB Atlas:');
  console.error('   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/heartspace');
  process.exit(1);
}

if (!process.env.GEMINI_API_KEY) {
  console.warn('⚠️  WARNING: GEMINI_API_KEY is not set. AI insights will not work.');
  console.warn('   Get your API key from: https://makersuite.google.com/app/apikey');
}

if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'your_super_secret_jwt_key_change_this_in_production') {
  console.warn('⚠️  WARNING: JWT_SECRET is not set or using default value. Change this in production!');
}

// Connect to MongoDB with better timeout handling
const mongoOptions = {
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 10s
  socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
  connectTimeoutMS: 10000, // Give up initial connection after 10s
  maxPoolSize: 10, // Maintain up to 10 socket connections
  retryWrites: true,
};

mongoose.connect(process.env.MONGODB_URI, mongoOptions)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    console.log(`   Database: ${mongoose.connection.name}`);
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    console.error('\n📋 Troubleshooting steps:');
    console.error('   1. Check if MongoDB is running (if using local MongoDB)');
    console.error('   2. Verify your MONGODB_URI in the .env file');
    console.error('   3. If using MongoDB Atlas, check your IP whitelist and credentials');
    console.error('   4. Ensure your network connection is stable');
    console.error('\n   For local MongoDB:');
    console.error('   - Install MongoDB: https://www.mongodb.com/try/download/community');
    console.error('   - Start MongoDB service: mongod');
    console.error('\n   For MongoDB Atlas (cloud):');
    console.error('   - Sign up at: https://www.mongodb.com/cloud/atlas');
    console.error('   - Create a free cluster and get your connection string');
    process.exit(1);
  });

// Handle MongoDB connection events
mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB error:', err);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

