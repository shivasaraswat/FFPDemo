import { io } from 'socket.io-client';

class WebSocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.listeners = new Map();
  }

  connect(userId, token) {
    if (this.socket && this.isConnected) {
      console.log('WebSocket already connected');
      return;
    }

    const serverUrl = process.env.REACT_APP_WS_URL || 'http://localhost:5000';
    
    this.socket = io(serverUrl, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      auth: {
        token: token
      }
    });

    // Connection events
    this.socket.on('connect', () => {
      console.log('✅ WebSocket connected:', this.socket.id);
      this.isConnected = true;
      
      // Notify server about user login
      if (userId) {
        this.socket.emit('user:login', userId);
      }
    });

    this.socket.on('disconnect', () => {
      console.log('❌ WebSocket disconnected');
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ WebSocket connection error:', error);
      this.isConnected = false;
    });

    // Listen for notifications
    this.socket.on('notification', (notification) => {
      console.log('📬 Received notification:', notification);
      // Call all registered listeners
      this.listeners.forEach((callback) => {
        callback(notification);
      });
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.listeners.clear();
      console.log('✅ WebSocket disconnected');
    }
  }

  // Register a callback for notifications
  onNotification(callback) {
    const id = Date.now().toString();
    this.listeners.set(id, callback);
    return () => {
      this.listeners.delete(id);
    };
  }

  // Get connection status
  getConnectionStatus() {
    return this.isConnected;
  }
}

// Singleton instance
const webSocketService = new WebSocketService();

export default webSocketService;

