const gemini = require('../gemini/gemini');
const socketConnection = require('../socket');

// API Controller for Voice Translator Backend
class ApiController {
  // Get Gemini AI status
  async getGeminiStatus(req, res) {
    try {
      const status = gemini.getStatus();
      const testResult = await gemini.testConnection();
      res.json({ 
        status, 
        testResult,
        message: 'Gemini AI module status retrieved successfully'
      });
    } catch (error) {
      console.error('❌ Error in Gemini status endpoint:', error);
      res.status(500).json({ 
        error: error.message,
        message: 'Failed to retrieve Gemini AI status'
      });
    }
  }

  // Get CORS configuration info
  getCorsInfo(req, res) {
    try {
      const { getCorsInfo } = require('../cors/config');
      const corsInfo = getCorsInfo();
      res.json({ 
        corsInfo,
        message: 'CORS configuration retrieved successfully'
      });
    } catch (error) {
      console.error('❌ Error in CORS info endpoint:', error);
      res.status(500).json({ 
        error: error.message,
        message: 'Failed to retrieve CORS configuration'
      });
    }
  }

  // Get socket connection statistics
  getSocketStats(req, res) {
    try {
      const stats = socketConnection.getStats();
      res.json({ 
        stats,
        message: 'Socket statistics retrieved successfully'
      });
    } catch (error) {
      console.error('❌ Error in Socket stats endpoint:', error);
      res.status(500).json({ 
        error: error.message,
        message: 'Failed to retrieve socket statistics'
      });
    }
  }

  // Get all connected socket users
  getConnectedUsers(req, res) {
    try {
      const users = socketConnection.getAllConnectedUsers();
      res.json({ 
        users,
        count: users.length,
        message: 'Connected users retrieved successfully'
      });
    } catch (error) {
      console.error('❌ Error in Socket users endpoint:', error);
      res.status(500).json({ 
        error: error.message,
        message: 'Failed to retrieve connected users'
      });
    }
  }

  // Get API overview and endpoints
  getApiOverview(req, res) {
    res.json({
      message: 'Smart Voice Translator Backend API',
      version: '1.0.0',
      endpoints: {
        'GET /api': 'API overview and endpoints list',
        'GET /api/gemini/status': 'Check Gemini AI connection status',
        'GET /api/cors/info': 'View CORS configuration',
        'GET /api/socket/stats': 'Get socket connection statistics',
        'GET /api/socket/users': 'Get all connected users',
        'POST /api/speech-to-text': 'Convert audio to text (batch)',
        'POST /api/realtime-speech-to-text/start': 'Start real-time transcription session',
        'POST /api/realtime-speech-to-text/audio': 'Send audio chunk for real-time transcription',
        'POST /api/realtime-speech-to-text/stop': 'Stop real-time transcription session',
        'POST /api/translate': 'Translate text (for voice mode)',
        'POST /api/manual-translate': 'Translate text (for manual input)',
        'POST /api/image-translate': 'Extract and translate text from images',
        'POST /api/document-translate': 'Extract and translate text from documents (PDF, DOCX, TXT, Images)',
        'POST /api/text-to-speech': 'Convert text to speech',
        'POST /api/rooms': 'Create a new voice call room',
        'GET /api/rooms': 'Get all active rooms',
        'GET /api/rooms/:roomId': 'Get room by ID',
        'POST /api/rooms/:roomId/join': 'Join a room',
        'POST /api/rooms/:roomId/leave': 'Leave a room',
        'POST /api/rooms/:roomId/end': 'End a room (creator only)',
        'GET /api/rooms/stats': 'Get room statistics',
        'GET /api/languages': 'Get all available languages',
        'GET /api/languages/active': 'Get active languages only'
      }
    });
  }
}

const apiController = new ApiController();
module.exports = apiController;
