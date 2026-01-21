const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authenticate = require('./middleware/auth');
const rbac = require('./middleware/rbac');

const app = express();
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

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = app;

