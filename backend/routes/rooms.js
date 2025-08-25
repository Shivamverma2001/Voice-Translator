const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');

// Room Routes for Voice Translator Backend

// Create a new room
// POST /api/rooms
router.post('/', roomController.createRoom);

// Get room by ID
// GET /api/rooms/:roomId
router.get('/:roomId', roomController.getRoomById);

// Get all active rooms
// GET /api/rooms
router.get('/', roomController.getActiveRooms);

// Get rooms by creator
// GET /api/rooms/creator/:userId
router.get('/creator/:userId', roomController.getRoomsByCreator);

// Get rooms by participant
// GET /api/rooms/participant/:userId
router.get('/participant/:userId', roomController.getRoomsByParticipant);

// Join a room
// POST /api/rooms/:roomId/join
router.post('/:roomId/join', roomController.joinRoom);

// Leave a room
// POST /api/rooms/:roomId/leave
router.post('/:roomId/leave', roomController.leaveRoom);

// End a room (creator only)
// POST /api/rooms/:roomId/end
router.post('/:roomId/end', roomController.endRoom);

// Pause a room (creator only)
// POST /api/rooms/:roomId/pause
router.post('/:roomId/pause', roomController.pauseRoom);

// Resume a room (creator only)
// POST /api/rooms/:roomId/resume
router.post('/:roomId/resume', roomController.resumeRoom);

// Update room settings (creator only)
// PUT /api/rooms/:roomId/settings
router.put('/:roomId/settings', roomController.updateRoomSettings);

// Search rooms
// GET /api/rooms/search?query=searchterm
router.get('/search', roomController.searchRooms);

// Get room statistics
// GET /api/rooms/stats
router.get('/stats', roomController.getRoomStats);

// Delete room (creator only, soft delete)
// DELETE /api/rooms/:roomId
router.delete('/:roomId', roomController.deleteRoom);

// Validate room data
// POST /api/rooms/validate
router.post('/validate', roomController.validateRoomData);

module.exports = router;
