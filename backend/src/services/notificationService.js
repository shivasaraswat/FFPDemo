const eventHubService = require('./eventHubService');

class NotificationService {
  /**
   * Create a notification and send it to Event Hub
   * @param {number} userId - User ID to send notification to
   * @param {string} type - Notification type (info, success, warning, error)
   * @param {string} title - Notification title
   * @param {string} message - Notification message
   * @param {object} data - Additional data (optional)
   * @returns {Promise<object>} Notification object
   */
  async createNotification(userId, type, title, message, data = {}) {
    try {
      const notification = {
        userId,
        type: type || 'info',
        title,
        message,
        data,
        timestamp: new Date().toISOString(),
        id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };

      // Send to Event Hub
      await eventHubService.sendNotificationEvent(notification);

      return notification;
    } catch (error) {
      console.error('❌ Failed to create notification:', error);
      throw error;
    }
  }

  /**
   * Create notification for multiple users
   * @param {number[]} userIds - Array of user IDs
   * @param {string} type - Notification type
   * @param {string} title - Notification title
   * @param {string} message - Notification message
   * @param {object} data - Additional data
   */
  async createBulkNotifications(userIds, type, title, message, data = {}) {
    const promises = userIds.map(userId => 
      this.createNotification(userId, type, title, message, data)
    );
    return Promise.all(promises);
  }
}

module.exports = new NotificationService();

