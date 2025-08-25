const { Server } = require('socket.io');

// Socket Connection Manager for Voice Translator
class SocketConnection {
  constructor() {
    this.io = null;
    this.isInitialized = false;
  }

  // Initialize socket server with existing io instance
  initialize(httpServer, ioInstance) {
    if (this.isInitialized) {
      console.log('⚠️ Socket server already initialized');
      return this.io;
    }

    try {
      // Use the existing Socket.IO instance
      this.io = ioInstance;
      
      // Basic connection logging (minimal)
      this.io.on('connection', (socket) => {
        // Only log in development
        if (process.env.NODE_ENV === 'development') {
          console.log('🔌 Client connected:', socket.id);
        }
        
        // Handle disconnection
        socket.on('disconnect', () => {
          if (process.env.NODE_ENV === 'development') {
            console.log('🔌 Client disconnected:', socket.id);
          }
        });
      });

      this.isInitialized = true;
      // Socket server initialized successfully
      
      return this.io;
    } catch (error) {
      console.error('❌ Failed to initialize socket server:', error);
      throw error;
    }
  }

  // Get socket instance
  getSocket() {
    if (!this.isInitialized || !this.io) {
      throw new Error('Socket server not initialized. Call initialize() first.');
    }
    return this.io;
  }

  // Check if socket is ready
  isReady() {
    return this.isInitialized && this.io !== null;
  }

  // Get socket statistics
  getStats() {
    if (!this.isReady()) {
      return { error: 'Socket not ready' };
    }

    const rooms = this.io.sockets.adapter.rooms;
    const connectedSockets = this.io.sockets.sockets.size;
    
    let activeRooms = 0;
    let totalParticipants = 0;
    
    rooms.forEach((room, roomId) => {
      if (roomId !== roomId) { // Skip socket IDs
        activeRooms++;
        totalParticipants += room.size;
      }
    });

    return {
      connectedSockets,
      activeRooms,
      totalParticipants,
      timestamp: new Date().toISOString()
    };
  }

  // Get all connected users
  getAllConnectedUsers() {
    if (!this.isReady()) {
      return [];
    }

    const users = [];
    this.io.sockets.sockets.forEach((socket) => {
      if (socket.userId) {
        users.push({
          socketId: socket.id,
          userId: socket.userId,
          username: socket.username,
          roomId: socket.roomId,
          isCreator: socket.isCreator
        });
      }
    });
    return users;
  }

  // Broadcast to all connected clients
  broadcastToAll(event, data) {
    if (!this.isReady()) {
      throw new Error('Socket not ready');
    }
    this.io.emit(event, data);
  }

  // Broadcast to specific room
  broadcastToRoom(roomId, event, data) {
    if (!this.isReady()) {
      throw new Error('Socket not ready');
    }
    this.io.to(roomId).emit(event, data);
  }

  // Join user to room
  joinUserToRoom(socketId, roomId) {
    if (!this.isReady()) {
      throw new Error('Socket not ready');
    }
    const socket = this.io.sockets.sockets.get(socketId);
    if (socket) {
      socket.join(roomId);
      return true;
    }
    return false;
  }

  // Remove user from room
  removeUserFromRoom(socketId, roomId) {
    if (!this.isReady()) {
      throw new Error('Socket not ready');
    }
    const socket = this.io.sockets.sockets.get(socketId);
    if (socket) {
      socket.leave(roomId);
      return true;
    }
    return false;
  }
}

// Create singleton instance
const socketConnection = new SocketConnection();

module.exports = socketConnection;
