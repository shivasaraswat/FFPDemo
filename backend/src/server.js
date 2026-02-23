const express = require('express');
const cors = require('cors');
const http = require('http');
require('dotenv').config();

const authenticate = require('./middleware/auth');
const rbac = require('./middleware/rbac');
const webSocketService = require('./services/websocketService');
const eventHubConsumer = require('./workers/eventHubConsumer');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Public routes (no auth/RBAC)
app.use('/api/auth', require('./routes/authRoutes'));

// Protected routes (auth + RBAC)
app.use('/api/roles', authenticate, rbac, require('./routes/roleRoutes'));
app.use('/api/modules', authenticate, rbac, require('./routes/moduleRoutes'));
app.use('/api/permissions', authenticate, rbac, require('./routes/permissionRoutes'));
app.use('/api/users', authenticate, rbac, require('./routes/userRoutes'));
app.use('/api/api-registry', authenticate, rbac, require('./routes/apiRegistryRoutes'));
app.use('/api/field-fix', authenticate, rbac, require('./routes/fieldFixRoutes'));
app.use('/api/masters', authenticate, rbac, require('./routes/masterRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Initialize WebSocket Server
webSocketService.initialize(server);

// Start Event Hub Consumer (non-blocking - server will start even if Event Hub doesn't exist)
eventHubConsumer.start().catch(err => {
  console.error('❌ Failed to start Event Hub Consumer:', err.message);
  console.log('⚠️ Server will continue running. Create Event Hub in Azure Portal to enable notifications.');
});

// Start HTTP Server
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔌 WebSocket server ready for connections`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully...');
  await eventHubConsumer.stop();
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

module.exports = app;

