// Main Express server for EVconnects API
const express = require('express');
const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const config = require('./config');
const apiRoutes = require('./routes/api');

// Initialize Express app
const app = express();
const PORT = config.port;

// Create HTTP server and Socket.io instance
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: config.corsOrigin,
    methods: ['GET', 'POST']
  }
});

// Connect to MongoDB (only if MONGO_URI is configured)
if (config.mongoURI) {
  console.log('📊 Attempting MongoDB connection...');
  mongoose.connect(config.mongoURI)
    .then(() => console.log('✅ MongoDB Connected Successfully!\n'))
    .catch(err => {
      console.error('❌ MongoDB Connection Error:', err.message);
      console.warn('⚠️  Continuing without MongoDB - using mock data...\n');
    });
} else {
  console.log('📊 MOCK DATA MODE - No MongoDB connection');
  console.log('✅ Using JSON mock data files for development\n');
}

// Middleware
app.use(cors({ origin: config.corsOrigin }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api', apiRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', message: 'EVconnects API is running!' });
});

// Socket.io connection events
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  
  socket.on('join-station', (stationId) => {
    socket.join(`station:${stationId}`);
    console.log(`User ${socket.id} joined station ${stationId}`);
  });
  
  socket.on('leave-station', (stationId) => {
    socket.leave(`station:${stationId}`);
    console.log(`User ${socket.id} left station ${stationId}`);
  });

  // Handle real-time station status updates
  socket.on('update-charger-status', (data) => {
    const { stationId, chargerId, isAvailable } = data;
    // In a real app, you would update the database here
    
    // Broadcast the status change to all users viewing this station
    io.to(`station:${stationId}`).emit('charger-status-changed', {
      stationId,
      chargerId,
      isAvailable
    });
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Start server
httpServer.listen(PORT, () => {
  console.log(`\n🚀 EVconnects Server Started!`);
  console.log(`📍 Running in ${config.environment} mode on port ${PORT}`);
  console.log(`🌐 Access at: http://localhost:${PORT}\n`);
});