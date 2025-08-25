const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');
const healthController = require('../controllers/healthController');

// API Routes for Voice Translator Backend

// Get API overview and endpoints list
// GET /api
router.get('/', apiController.getApiOverview);

// Get Gemini AI connection status
// GET /api/gemini/status
router.get('/gemini/status', apiController.getGeminiStatus);

// Get CORS configuration information
// GET /api/cors/info
router.get('/cors/info', apiController.getCorsInfo);

// Get socket connection statistics
// GET /api/socket/stats
router.get('/socket/stats', apiController.getSocketStats);

// Get all connected socket users
// GET /api/socket/users
router.get('/socket/users', apiController.getConnectedUsers);

// Health check endpoints
// GET /api/health
router.get('/health', healthController.getHealth);

// GET /api/health/detailed
router.get('/health/detailed', healthController.getDetailedHealth);

module.exports = router;
