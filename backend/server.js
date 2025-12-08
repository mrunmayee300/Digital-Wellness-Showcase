const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const uploadRoutes = require('./routes/upload');
const workRoutes = require('./routes/works');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
// Configure CORS with environment variable for production
const corsOptions = {
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Atlas connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://your-connection-string';

// Remove deprecated options - they're no longer needed in mongoose 6+
mongoose.connect(MONGODB_URI)
.then(() => {
  console.log('✅ Connected to MongoDB Atlas');
})
.catch((error) => {
  console.error('❌ MongoDB connection error:', error);
  console.error('\n💡 Troubleshooting tips:');
  console.error('1. Check your MONGODB_URI in .env file');
  console.error('2. Ensure your IP address is whitelisted in MongoDB Atlas:');
  console.error('   - Go to MongoDB Atlas → Network Access → Add IP Address');
  console.error('   - Add 0.0.0.0/0 for all IPs (development only) or your specific IP');
  console.error('3. Verify your MongoDB username and password are correct');
  console.error('4. Check if your MongoDB cluster is running\n');
  // Don't exit in development - allow server to keep running for other features
  // process.exit(1);
});

// Routes
app.use('/api/upload', uploadRoutes);
app.use('/api/works', workRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message 
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
