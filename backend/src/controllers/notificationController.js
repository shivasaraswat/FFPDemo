const notificationService = require('../services/notificationService');
const Notification = require('../models/Notification');

class NotificationController {
  /**
   * Get user's notifications
   * GET /api/notifications
   */
  async getNotifications(req, res) {
    try {
      const userId = req.user.id;
      const { limit, offset, isRead } = req.query;
      
      // Parse and validate parameters
      const limitInt = limit ? parseInt(limit, 10) : 50;
      const offsetInt = offset ? parseInt(offset, 10) : 0;
      
      let isReadValue = null;
      if (isRead === 'true' || isRead === true) {
        isReadValue = true;
      } else if (isRead === 'false' || isRead === false) {
        isReadValue = false;
      }
      
      const notifications = await Notification.findByUserId(userId, {
        limit: limitInt,
        offset: offsetInt,
        isRead: isReadValue
      });

      res.json({
        success: true,
        notifications,
        count: notifications.length
      });
    } catch (error) {
      console.error('Error fetching notifications:', error);
      res.status(500).json({
        error: 'Failed to fetch notifications',
        message: error.message
      });
    }
  }

  /**
   * Get unread count
   * GET /api/notifications/unread-count
   */
  async getUnreadCount(req, res) {
    try {
      const userId = req.user.id;
      const count = await Notification.getUnreadCount(userId);

      res.json({
        success: true,
        unreadCount: count
      });
    } catch (error) {
      console.error('Error fetching unread count:', error);
      res.status(500).json({
        error: 'Failed to fetch unread count',
        message: error.message
      });
    }
  }

  /**
   * Mark notification as read
   * PUT /api/notifications/:id/read
   */
  async markAsRead(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const notification = await Notification.markAsRead(id, userId);
      
      if (!notification) {
        return res.status(404).json({
          error: 'Notification not found'
        });
      }

      res.json({
        success: true,
        message: 'Notification marked as read',
        notification
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
      res.status(500).json({
        error: 'Failed to mark notification as read',
        message: error.message
      });
    }
  }

  /**
   * Mark all notifications as read
   * PUT /api/notifications/read-all
   */
  async markAllAsRead(req, res) {
    try {
      const userId = req.user.id;
      await Notification.markAllAsRead(userId);

      res.json({
        success: true,
        message: 'All notifications marked as read'
      });
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      res.status(500).json({
        error: 'Failed to mark all notifications as read',
        message: error.message
      });
    }
  }
  /**
   * Create a notification
   * POST /api/notifications
   */
  async createNotification(req, res) {
    try {
      const { userId, type, title, message, data } = req.body;

      // Validation
      if (!userId || !title || !message) {
        return res.status(400).json({
          error: 'userId, title, and message are required'
        });
      }

      const notification = await notificationService.createNotification(
        userId,
        type,
        title,
        message,
        data
      );

      res.status(201).json({
        success: true,
        message: 'Notification created and sent to Event Hub',
        notification
      });
    } catch (error) {
      console.error('Error creating notification:', error);
      res.status(500).json({
        error: 'Failed to create notification',
        message: error.message
      });
    }
  }

  /**
   * Create notification for current user
   * POST /api/notifications/me
   */
  async createNotificationForMe(req, res) {
    try {
      const { type, title, message, data } = req.body;
      const userId = req.user.id;

      if (!title || !message) {
        return res.status(400).json({
          error: 'title and message are required'
        });
      }

      const notification = await notificationService.createNotification(
        userId,
        type,
        title,
        message,
        data
      );

      res.status(201).json({
        success: true,
        message: 'Notification created',
        notification
      });
    } catch (error) {
      console.error('Error creating notification:', error);
      res.status(500).json({
        error: 'Failed to create notification',
        message: error.message
      });
    }
  }

  /**
   * Test notification endpoint
   * POST /api/notifications/test
   */
  async testNotification(req, res) {
    try {
      const userId = req.user?.id || req.body.userId || 1;
      
      const notification = await notificationService.createNotification(
        userId,
        'info',
        'Test Notification',
        'This is a test notification from Event Hub POC',
        { test: true, timestamp: new Date().toISOString() }
      );

      res.status(200).json({
        success: true,
        message: 'Test notification sent! Check your browser for real-time update.',
        notification
      });
    } catch (error) {
      console.error('Error sending test notification:', error);
      res.status(500).json({
        error: 'Failed to send test notification',
        message: error.message
      });
    }
  }
}

module.exports = new NotificationController();

