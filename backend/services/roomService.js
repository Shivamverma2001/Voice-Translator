const Room = require('../models/Room');
const socketConnection = require('../socket');

// Room Service Class with Socket Integration
class RoomService {
  // Create a new room
  async createRoom(roomData) {
    try {
      // Check if room ID already exists
      const existingRoom = await Room.getByRoomId(roomData.roomId);
      if (existingRoom) {
        throw new Error('Room ID already exists');
      }

      // Create new room
      const room = new Room({
        roomId: roomData.roomId,
        creator: {
          userId: roomData.creator.userId,
          username: roomData.creator.username,
          userLanguage: roomData.creator.userLanguage,
          targetLanguage: roomData.creator.targetLanguage
        },
        participants: [{
          userId: roomData.creator.userId,
          username: roomData.creator.username,
          userLanguage: roomData.creator.userLanguage,
          targetLanguage: roomData.creator.targetLanguage,
          joinedAt: new Date(),
          isActive: true
        }],
        settings: roomData.settings || {},
        metadata: {
          startTime: new Date()
        }
      });

      const savedRoom = await room.save();
      
      // Emit socket events if socket is ready
      if (socketConnection.isReady()) {
        try {
          // Join creator to room
          socketConnection.joinUserToRoom(roomData.creator.socketId, roomData.roomId);
          
          // Emit room created event
          socketConnection.broadcastToRoom(roomData.roomId, 'room-created', {
            roomId: savedRoom.roomId,
            creator: savedRoom.creator,
            message: 'Room created successfully'
          });
          
          // Emit user joined event to notify others
          socketConnection.broadcastToRoom(roomData.roomId, 'user-joined', {
            userId: savedRoom.creator.userId,
            username: savedRoom.creator.username,
            userLanguage: savedRoom.creator.userLanguage,
            targetLanguage: savedRoom.creator.targetLanguage,
            isCreator: true
          });
          
          // Socket events emitted successfully
        } catch (socketError) {
          console.warn('⚠️ Socket events failed for room creation:', socketError.message);
        }
      }
      
      return {
        success: true,
        room: savedRoom,
        message: 'Room created successfully'
      };

    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to create room'
      };
    }
  }

  // Get room by ID
  async getRoomById(roomId) {
    try {
      const room = await Room.getByRoomId(roomId);
      
      if (!room) {
        return {
          success: false,
          error: 'Room not found',
          message: 'Room does not exist or is inactive'
        };
      }

      return {
        success: true,
        room: room,
        message: 'Room retrieved successfully'
      };

    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to retrieve room'
      };
    }
  }

  // Get all active rooms
  async getActiveRooms() {
    try {
      const rooms = await Room.getActiveRooms();
      
      return {
        success: true,
        rooms: rooms,
        count: rooms.length,
        message: 'Active rooms retrieved successfully'
      };

    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to retrieve active rooms'
      };
    }
  }

  // Get rooms by creator
  async getRoomsByCreator(userId) {
    try {
      const rooms = await Room.getByCreator(userId);
      
      return {
        success: true,
        rooms: rooms,
        count: rooms.length,
        message: 'Creator rooms retrieved successfully'
      };

    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to retrieve creator rooms'
      };
    }
  }

  // Get rooms by participant
  async getRoomsByParticipant(userId) {
    try {
      const rooms = await Room.getByParticipant(userId);
      
      return {
        success: true,
        rooms: rooms,
        count: rooms.length,
        message: 'Participant rooms retrieved successfully'
      };

    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to retrieve participant rooms'
      };
    }
  }

  // Join room
  async joinRoom(roomId, participantData) {
    try {
      const room = await Room.getByRoomId(roomId);
      
      if (!room) {
        return {
          success: false,
          error: 'Room not found',
          message: 'Room does not exist or is inactive'
        };
      }

      if (room.status !== 'active') {
        return {
          success: false,
          error: 'Room not active',
          message: 'Room is not currently active'
        };
      }

      if (room.participantCount >= room.settings.maxParticipants) {
        return {
          success: false,
          error: 'Room full',
          message: 'Room has reached maximum participant limit'
        };
      }

      // Add participant to room
      await room.addParticipant(participantData);
      
      // Emit socket events if socket is ready
      if (socketConnection.isReady()) {
        try {
          // Join participant to room
          socketConnection.joinUserToRoom(participantData.socketId, roomId);
          
          // Emit user joined event to notify others
          socketConnection.broadcastToRoom(roomId, 'user-joined', {
            userId: participantData.userId,
            username: participantData.username,
            userLanguage: participantData.userLanguage,
            targetLanguage: participantData.targetLanguage,
            isCreator: false
          });
          
          // Emit room joined confirmation to the joiner
          socketConnection.broadcastToRoom(roomId, 'room-joined', {
            roomId: roomId,
            joiner: participantData.username,
            message: 'Joined room successfully'
          });
          
          // Socket events emitted successfully
        } catch (socketError) {
          console.warn('⚠️ Socket events failed for room join:', socketError.message);
        }
      }
      
      return {
        success: true,
        room: room,
        message: 'Successfully joined room'
      };

    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to join room'
      };
    }
  }

  // Leave room
  async leaveRoom(roomId, userId) {
    try {
      const room = await Room.getByRoomId(roomId);
      
      if (!room) {
        return {
          success: false,
          error: 'Room not found',
          message: 'Room does not exist or is inactive'
        };
      }

      // Remove participant from room
      await room.removeParticipant(userId);
      
      // Emit socket events if socket is ready
      if (socketConnection.isReady()) {
        try {
          // Remove participant from room
          socketConnection.removeUserFromRoom(userId, roomId);
          
          // Emit user left event to notify others
          socketConnection.broadcastToRoom(roomId, 'user-left', {
            userId: userId,
            username: room.participants.find(p => p.userId === userId)?.username || 'Unknown User'
          });
          
          // Socket events emitted successfully
        } catch (socketError) {
          console.warn('⚠️ Socket events failed for room leave:', socketError.message);
        }
      }
      
      // If no active participants, end the room
      if (room.participantCount === 0) {
        await room.endRoom();
        
        // Emit room ended event
        if (socketConnection.isReady()) {
          try {
            socketConnection.broadcastToRoom(roomId, 'call-ended', {
              message: 'Room ended due to no participants'
            });
            console.log('✅ Socket events emitted for room end');
          } catch (socketError) {
            console.warn('⚠️ Socket events failed for room end:', socketError.message);
          }
        }
        
        return {
          success: true,
          room: room,
          message: 'Left room and room ended due to no participants'
        };
      }

      return {
        success: true,
        room: room,
        message: 'Successfully left room'
      };

    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to leave room'
      };
    }
  }

  // End room
  async endRoom(roomId, userId) {
    try {
      const room = await Room.getByRoomId(roomId);
      
      if (!room) {
        return {
          success: false,
          error: 'Room not found',
          message: 'Room does not exist or is inactive'
        };
      }

      // Check if user is creator
      if (room.creator.userId !== userId) {
        return {
          success: false,
          error: 'Unauthorized',
          message: 'Only room creator can end the room'
        };
      }

      // End the room
      await room.endRoom();
      
      // Emit socket events if socket is ready
      if (socketConnection.isReady()) {
        try {
          // Emit call ended event to all participants
          socketConnection.broadcastToRoom(roomId, 'call-ended', {
            userId: userId,
            username: room.creator.username,
            message: `${room.creator.username} ended the call`
          });
          
          // Disconnect all users from the room
          room.participants.forEach(participant => {
            if (participant.isActive) {
              socketConnection.removeUserFromRoom(participant.userId, roomId);
            }
          });
          
          // Socket events emitted successfully
        } catch (socketError) {
          console.warn('⚠️ Socket events failed for room end:', socketError.message);
        }
      }
      
      return {
        success: true,
        room: room,
        message: 'Room ended successfully'
      };

    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to end room'
      };
    }
  }

  // Pause room
  async pauseRoom(roomId, userId) {
    try {
      const room = await Room.getByRoomId(roomId);
      
      if (!room) {
        return {
          success: false,
          error: 'Room not found',
          message: 'Room does not exist or is inactive'
        };
      }

      // Check if user is creator
      if (room.creator.userId !== userId) {
        return {
          success: false,
          error: 'Unauthorized',
          message: 'Only room creator can pause the room'
        };
      }

      // Pause the room
      await room.pauseRoom();
      
      return {
        success: true,
        room: room,
        message: 'Room paused successfully'
      };

    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to pause room'
      };
    }
  }

  // Resume room
  async resumeRoom(roomId, userId) {
    try {
      const room = await Room.getByRoomId(roomId);
      
      if (!room) {
        return {
          success: false,
          error: 'Room not found',
          message: 'Room does not exist or is inactive'
        };
      }

      // Check if user is creator
      if (room.creator.userId !== userId) {
        return {
          success: false,
          error: 'Unauthorized',
          message: 'Only room creator can resume the room'
        };
      }

      // Resume the room
      await room.resumeRoom();
      
      return {
        success: true,
        room: room,
        message: 'Room resumed successfully'
      };

    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to resume room'
      };
    }
  }

  // Update room settings
  async updateRoomSettings(roomId, userId, settings) {
    try {
      const room = await Room.getByRoomId(roomId);
      
      if (!room) {
        return {
          success: false,
          error: 'Room not found',
          message: 'Room does not exist or is inactive'
        };
      }

      // Check if user is creator
      if (room.creator.userId !== userId) {
        return {
          success: false,
          error: 'Unauthorized',
          message: 'Only room creator can update room settings'
        };
      }

      // Update settings
      room.settings = { ...room.settings, ...settings };
      await room.save();
      
      return {
        success: true,
        room: room,
        message: 'Room settings updated successfully'
      };

    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to update room settings'
      };
    }
  }

  // Search rooms
  async searchRooms(query) {
    try {
      const rooms = await Room.searchRooms(query);
      
      return {
        success: true,
        rooms: rooms,
        count: rooms.length,
        message: 'Rooms search completed successfully'
      };

    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to search rooms'
      };
    }
  }

  // Get room statistics
  async getRoomStats() {
    try {
      const stats = await Room.getRoomStats();
      
      return {
        success: true,
        stats: stats[0] || {
          totalRooms: 0,
          activeRooms: 0,
          endedRooms: 0,
          totalParticipants: 0,
          avgCallDuration: 0
        },
        message: 'Room statistics retrieved successfully'
      };

    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to retrieve room statistics'
      };
    }
  }

  // Delete room (soft delete)
  async deleteRoom(roomId, userId) {
    try {
      const room = await Room.getByRoomId(roomId);
      
      if (!room) {
        return {
          success: false,
          error: 'Room not found',
          message: 'Room does not exist or is inactive'
        };
      }

      // Check if user is creator
      if (room.creator.userId !== userId) {
        return {
          success: false,
          error: 'Unauthorized',
          message: 'Only room creator can delete the room'
        };
      }

      // Soft delete the room
      room.isActive = false;
      await room.save();
      
      return {
        success: true,
        message: 'Room deleted successfully'
      };

    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to delete room'
      };
    }
  }

  // Validate room data
  validateRoomData(roomData) {
    const errors = [];

    if (!roomData.roomId || roomData.roomId.length < 3 || roomData.roomId.length > 50) {
      errors.push('Room ID must be between 3 and 50 characters');
    }

    if (!roomData.creator || !roomData.creator.userId || !roomData.creator.username) {
      errors.push('Creator information is required');
    }

    if (!roomData.creator.userLanguage || !roomData.creator.targetLanguage) {
      errors.push('Creator languages are required');
    }

    if (roomData.settings) {
      if (roomData.settings.maxParticipants && (roomData.settings.maxParticipants < 2 || roomData.settings.maxParticipants > 50)) {
        errors.push('Max participants must be between 2 and 50');
      }
    }

    return {
      valid: errors.length === 0,
      errors: errors
    };
  }
}

// Create singleton instance
const roomService = new RoomService();

module.exports = roomService;
