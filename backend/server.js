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
// Strict CORS setup for production
app.use(cors({
  origin: "https://digital-wellness-showcase.vercel.app",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Atlas connection
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
.then(() => {
  console.log('🎯 MongoDB Connected Successfully!');
})
.catch((error) => {
  console.error('❌ MongoDB connection error:', error.message);
});

// Routes
app.use('/api/upload', uploadRoutes);
app.use('/api/works', workRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Default route for invalid paths
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("🔥 Internal Server Error:", err.message);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message 
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
