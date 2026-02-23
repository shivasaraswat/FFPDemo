import api from './api';

const notificationService = {
  // Get user's notifications
  getNotifications: async (options = {}) => {
    const { limit = 50, offset = 0, isRead } = options;
    const params = new URLSearchParams({ limit, offset });
    if (isRead !== undefined) {
      params.append('isRead', isRead);
    }
    const response = await api.get(`/notifications?${params}`);
    return response.data;
  },

  // Get unread count
  getUnreadCount: async () => {
    const response = await api.get('/notifications/unread-count');
    return response.data;
  },

  // Mark notification as read
  markAsRead: async (notificationId) => {
    const response = await api.put(`/notifications/${notificationId}/read`);
    return response.data;
  },

  // Mark all notifications as read
  markAllAsRead: async () => {
    const response = await api.put('/notifications/read-all');
    return response.data;
  }
};

export default notificationService;

