const roomService = require('../services/roomService');

// Room Controller Class
class RoomController {
  // Create a new room
  async createRoom(req, res) {
    try {
      const roomData = req.body;
      
      // Validate room data
      const validation = roomService.validateRoomData(roomData);
      if (!validation.valid) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: validation.errors,
          message: 'Invalid room data provided'
        });
      }

      // Create room
      const result = await roomService.createRoom(roomData);
      
      if (result.success) {
        return res.status(201).json({
          success: true,
          room: result.room,
          message: result.message
        });
      } else {
        return res.status(400).json({
          success: false,
          error: result.error,
          message: result.message
        });
      }

    } catch (error) {
      console.error('❌ Error in createRoom controller:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to create room'
      });
    }
  }

  // Get room by ID
  async getRoomById(req, res) {
    try {
      const { roomId } = req.params;
      
      if (!roomId) {
        return res.status(400).json({
          success: false,
          error: 'Room ID required',
          message: 'Room ID parameter is missing'
        });
      }

      // Get room
      const result = await roomService.getRoomById(roomId);
      
      if (result.success) {
        return res.status(200).json({
          success: true,
          room: result.room,
          message: result.message
        });
      } else {
        return res.status(404).json({
          success: false,
          error: result.error,
          message: result.message
        });
      }

    } catch (error) {
      console.error('❌ Error in getRoomById controller:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to retrieve room'
      });
    }
  }

  // Get all active rooms
  async getActiveRooms(req, res) {
    try {
      // Get active rooms
      const result = await roomService.getActiveRooms();
      
      if (result.success) {
        return res.status(200).json({
          success: true,
          rooms: result.rooms,
          count: result.count,
          message: result.message
        });
      } else {
        return res.status(400).json({
          success: false,
          error: result.error,
          message: result.message
        });
      }

    } catch (error) {
      console.error('❌ Error in getActiveRooms controller:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to retrieve active rooms'
      });
    }
  }

  // Get rooms by creator
  async getRoomsByCreator(req, res) {
    try {
      const { userId } = req.params;
      
      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'User ID required',
          message: 'User ID parameter is missing'
        });
      }

      // Get rooms by creator
      const result = await roomService.getRoomsByCreator(userId);
      
      if (result.success) {
        return res.status(200).json({
          success: true,
          rooms: result.rooms,
          count: result.count,
          message: result.message
        });
      } else {
        return res.status(400).json({
          success: false,
          error: result.error,
          message: result.message
        });
      }

    } catch (error) {
      console.error('❌ Error in getRoomsByCreator controller:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to retrieve creator rooms'
      });
    }
  }

  // Get rooms by participant
  async getRoomsByParticipant(req, res) {
    try {
      const { userId } = req.params;
      
      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'User ID required',
          message: 'User ID parameter is missing'
        });
      }

      // Get rooms by participant
      const result = await roomService.getRoomsByParticipant(userId);
      
      if (result.success) {
        return res.status(200).json({
          success: true,
          rooms: result.rooms,
          count: result.count,
          message: result.message
        });
      } else {
        return res.status(400).json({
          success: false,
          error: result.error,
          message: result.message
        });
      }

    } catch (error) {
      console.error('❌ Error in getRoomsByParticipant controller:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to retrieve participant rooms'
      });
    }
  }

  // Join room
  async joinRoom(req, res) {
    try {
      const { roomId } = req.params;
      const participantData = req.body;
      
      if (!roomId) {
        return res.status(400).json({
          success: false,
          error: 'Room ID required',
          message: 'Room ID parameter is missing'
        });
      }

      if (!participantData || !participantData.userId) {
        return res.status(400).json({
          success: false,
          error: 'Participant data required',
          message: 'Participant information is missing'
        });
      }

      // Join room
      const result = await roomService.joinRoom(roomId, participantData);
      
      if (result.success) {
        return res.status(200).json({
          success: true,
          room: result.room,
          message: result.message
        });
      } else {
        return res.status(400).json({
          success: false,
          error: result.error,
          message: result.message
        });
      }

    } catch (error) {
      console.error('❌ Error in joinRoom controller:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to join room'
      });
    }
  }

  // Leave room
  async leaveRoom(req, res) {
    try {
      const { roomId } = req.params;
      const { userId } = req.body;
      
      if (!roomId) {
        return res.status(400).json({
          success: false,
          error: 'Room ID required',
          message: 'Room ID parameter is missing'
        });
      }

      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'User ID required',
          message: 'User ID is missing from request body'
        });
      }

      // Leave room
      const result = await roomService.leaveRoom(roomId, userId);
      
      if (result.success) {
        return res.status(200).json({
          success: true,
          room: result.room,
          message: result.message
        });
      } else {
        return res.status(400).json({
          success: false,
          error: result.error,
          message: result.message
        });
      }

    } catch (error) {
      console.error('❌ Error in leaveRoom controller:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to leave room'
      });
    }
  }

  // End room
  async endRoom(req, res) {
    try {
      const { roomId } = req.params;
      const { userId } = req.body;
      
      if (!roomId) {
        return res.status(400).json({
          success: false,
          error: 'Room ID required',
          message: 'Room ID parameter is missing'
        });
      }

      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'User ID required',
          message: 'User ID is missing from request body'
        });
      }

      // End room
      const result = await roomService.endRoom(roomId, userId);
      
      if (result.success) {
        return res.status(200).json({
          success: true,
          room: result.room,
          message: result.message
        });
      } else {
        return res.status(400).json({
          success: false,
          error: result.error,
          message: result.message
        });
      }

    } catch (error) {
      console.error('❌ Error in endRoom controller:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to end room'
      });
    }
  }

  // Pause room
  async pauseRoom(req, res) {
    try {
      const { roomId } = req.params;
      const { userId } = req.body;
      
      if (!roomId) {
        return res.status(400).json({
          success: false,
          error: 'Room ID required',
          message: 'Room ID parameter is missing'
        });
      }

      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'User ID required',
          message: 'User ID is missing from request body'
        });
      }

      // Pause room
      const result = await roomService.pauseRoom(roomId, userId);
      
      if (result.success) {
        return res.status(200).json({
          success: true,
          room: result.room,
          message: result.message
        });
      } else {
        return res.status(400).json({
          success: false,
          error: result.error,
          message: result.message
        });
      }

    } catch (error) {
      console.error('❌ Error in pauseRoom controller:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to pause room'
      });
    }
  }

  // Resume room
  async resumeRoom(req, res) {
    try {
      const { roomId } = req.params;
      const { userId } = req.body;
      
      if (!roomId) {
        return res.status(400).json({
          success: false,
          error: 'Room ID required',
          message: 'Room ID parameter is missing'
        });
      }

      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'User ID required',
          message: 'User ID is missing from request body'
        });
      }

      // Resume room
      const result = await roomService.resumeRoom(roomId, userId);
      
      if (result.success) {
        return res.status(200).json({
          success: true,
          room: result.room,
          message: result.message
        });
      } else {
        return res.status(400).json({
          success: false,
          error: result.error,
          message: result.message
        });
      }

    } catch (error) {
      console.error('❌ Error in resumeRoom controller:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to resume room'
      });
    }
  }

  // Update room settings
  async updateRoomSettings(req, res) {
    try {
      const { roomId } = req.params;
      const { userId, settings } = req.body;
      
      if (!roomId) {
        return res.status(400).json({
          success: false,
          error: 'Room ID required',
          message: 'Room ID parameter is missing'
        });
      }

      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'User ID required',
          message: 'User ID is missing from request body'
        });
      }

      if (!settings) {
        return res.status(400).json({
          success: false,
          error: 'Settings required',
          message: 'Room settings are missing from request body'
        });
      }

      // Update room settings
      const result = await roomService.updateRoomSettings(roomId, userId, settings);
      
      if (result.success) {
        return res.status(200).json({
          success: true,
          room: result.room,
          message: result.message
        });
      } else {
        return res.status(400).json({
          success: false,
          error: result.error,
          message: result.message
        });
      }

    } catch (error) {
      console.error('❌ Error in updateRoomSettings controller:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to update room settings'
      });
    }
  }

  // Search rooms
  async searchRooms(req, res) {
    try {
      const { query } = req.query;
      
      if (!query) {
        return res.status(400).json({
          success: false,
          error: 'Search query required',
          message: 'Search query parameter is missing'
        });
      }

      // Search rooms
      const result = await roomService.searchRooms(query);
      
      if (result.success) {
        return res.status(200).json({
          success: true,
          rooms: result.rooms,
          count: result.count,
          message: result.message
        });
      } else {
        return res.status(400).json({
          success: false,
          error: result.error,
          message: result.message
        });
      }

    } catch (error) {
      console.error('❌ Error in searchRooms controller:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to search rooms'
      });
    }
  }

  // Get room statistics
  async getRoomStats(req, res) {
    try {
      // Get room statistics
      const result = await roomService.getRoomStats();
      
      if (result.success) {
        return res.status(200).json({
          success: true,
          stats: result.stats,
          message: result.message
        });
      } else {
        return res.status(400).json({
          success: false,
          error: result.error,
          message: result.message
        });
      }

    } catch (error) {
      console.error('❌ Error in getRoomStats controller:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to retrieve room statistics'
      });
    }
  }

  // Delete room
  async deleteRoom(req, res) {
    try {
      const { roomId } = req.params;
      const { userId } = req.body;
      
      if (!roomId) {
        return res.status(400).json({
          success: false,
          error: 'Room ID required',
          message: 'Room ID parameter is missing'
        });
      }

      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'User ID required',
          message: 'User ID is missing from request body'
        });
      }

      // Delete room
      const result = await roomService.deleteRoom(roomId, userId);
      
      if (result.success) {
        return res.status(200).json({
          success: true,
          message: result.message
        });
      } else {
        return res.status(400).json({
          success: false,
          error: result.error,
          message: result.message
        });
      }

    } catch (error) {
      console.error('❌ Error in deleteRoom controller:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to delete room'
      });
    }
  }

  // Validate room data
  async validateRoomData(req, res) {
    try {
      const roomData = req.body;
      
      // Validate room data
      const validation = roomService.validateRoomData(roomData);
      
      return res.status(200).json({
        success: true,
        valid: validation.valid,
        errors: validation.errors,
        message: validation.valid ? 'Room data is valid' : 'Room data validation failed'
      });

    } catch (error) {
      console.error('❌ Error in validateRoomData controller:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to validate room data'
      });
    }
  }
}

// Create singleton instance
const roomController = new RoomController();

module.exports = roomController;
