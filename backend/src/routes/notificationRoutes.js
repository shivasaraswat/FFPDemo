const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const authenticate = require('../middleware/auth');

// Test endpoint (public for POC)
router.post('/test', notificationController.testNotification.bind(notificationController));

// Protected routes
router.get('/', authenticate, notificationController.getNotifications.bind(notificationController));
router.get('/unread-count', authenticate, notificationController.getUnreadCount.bind(notificationController));
router.put('/:id/read', authenticate, notificationController.markAsRead.bind(notificationController));
router.put('/read-all', authenticate, notificationController.markAllAsRead.bind(notificationController));
router.post('/', authenticate, notificationController.createNotification.bind(notificationController));
router.post('/me', authenticate, notificationController.createNotificationForMe.bind(notificationController));

module.exports = router;

