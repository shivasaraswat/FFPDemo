import React, { createContext, useContext, useState, useEffect } from 'react';
import webSocketService from '../services/websocketService';
import notificationService from '../services/notificationService';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();

  // Load notifications from database on mount
  const loadNotifications = async () => {
    if (!isAuthenticated || !user) return;
    
    try {
      setLoading(true);
      const [notificationsData, unreadData] = await Promise.all([
        notificationService.getNotifications({ limit: 50 }),
        notificationService.getUnreadCount()
      ]);
      
      setNotifications(notificationsData.notifications || []);
      setUnreadCount(unreadData.unreadCount || 0);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      const token = localStorage.getItem('token');
      
      // Load existing notifications from database
      loadNotifications();
      
      // Connect WebSocket
      webSocketService.connect(user.id, token);

      // Listen for new real-time notifications
      const unsubscribe = webSocketService.onNotification((notification) => {
        console.log('📬 New notification received:', notification);
        
        // Add to notifications list (if not already present)
        setNotifications(prev => {
          // Check if notification already exists (by ID)
          const exists = prev.some(n => n.id === notification.id);
          if (exists) return prev;
          
          // Add new notification at the beginning
          return [notification, ...prev];
        });
        
        // Increment unread count if not read
        if (!notification.isRead) {
          setUnreadCount(prev => prev + 1);
        }
      });

      // Cleanup on unmount
      return () => {
        unsubscribe();
        if (!isAuthenticated) {
          webSocketService.disconnect();
        }
      };
    } else {
      // Disconnect if user logs out
      webSocketService.disconnect();
      setNotifications([]);
      setUnreadCount(0);
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  const markAsRead = async (notificationId) => {
    try {
      // Optimistic update
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === notificationId ? { ...notif, isRead: true } : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
      
      // Update in database
      await notificationService.markAsRead(notificationId);
    } catch (error) {
      console.error('Error marking notification as read:', error);
      // Revert on error
      loadNotifications();
    }
  };

  const markAllAsRead = async () => {
    try {
      // Optimistic update
      setNotifications(prev =>
        prev.map(notif => ({ ...notif, isRead: true }))
      );
      setUnreadCount(0);
      
      // Update in database
      await notificationService.markAllAsRead();
    } catch (error) {
      console.error('Error marking all as read:', error);
      // Revert on error
      loadNotifications();
    }
  };

  const clearNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  const value = {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    refreshNotifications: loadNotifications,
    isConnected: webSocketService.getConnectionStatus()
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

