const { Server } = require('socket.io');
require('dotenv').config();

class WebSocketService {
  constructor() {
    this.io = null;
    this.userSockets = new Map(); // userId -> socketId mapping
  }

  initialize(httpServer) {
    this.io = new Server(httpServer, {
      cors: {
        origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
        methods: ['GET', 'POST'],
        credentials: true
      }
    });

    this.io.on('connection', (socket) => {
      console.log('✅ Client connected:', socket.id);

      // User login - store userId mapping
      socket.on('user:login', (userId) => {
        this.userSockets.set(userId, socket.id);
        socket.userId = userId;
        console.log(`✅ User ${userId} connected with socket ${socket.id}`);
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        if (socket.userId) {
          this.userSockets.delete(socket.userId);
          console.log(`✅ User ${socket.userId} disconnected`);
        }
      });
    });

    console.log('✅ WebSocket Server initialized');
    return this.io;
  }

  // Send notification to specific user
  sendToUser(userId, notification) {
    const socketId = this.userSockets.get(userId);
    if (socketId && this.io) {
      this.io.to(socketId).emit('notification', notification);
      console.log(`✅ Notification sent to user ${userId}`);
      return true;
    } else {
      console.log(`⚠️ User ${userId} not connected`);
      return false;
    }
  }

  // Send notification to all connected users
  broadcast(notification) {
    if (this.io) {
      this.io.emit('notification', notification);
      console.log('✅ Notification broadcasted to all users');
      return true;
    }
    return false;
  }

  // Get connected users count
  getConnectedUsersCount() {
    return this.userSockets.size;
  }
}

// Singleton instance
const webSocketService = new WebSocketService();

module.exports = webSocketService;

