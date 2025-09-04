const express = require('express');
const router = express.Router();
const voiceController = require('../controllers/voiceController');
const { authenticateToken } = require('../middleware/auth');

// Public routes (no authentication required)
router.get('/', voiceController.getAllVoices);
router.get('/search', voiceController.searchVoices);
router.get('/languages', voiceController.getUniqueLanguages);
router.get('/countries', voiceController.getUniqueCountries);
router.get('/language/:language', voiceController.getVoicesByLanguage);
router.get('/country/:country', voiceController.getVoicesByCountry);
router.get('/gender/:gender', voiceController.getVoicesByGender);
router.get('/:id', voiceController.getVoiceById);

// Admin routes (authentication required)
router.get('/admin/all', authenticateToken, voiceController.getAllVoicesAdmin);
router.get('/admin/:id', authenticateToken, voiceController.getVoiceByIdAdmin);
router.post('/', authenticateToken, voiceController.createVoice);
router.put('/:id', authenticateToken, voiceController.updateVoice);
router.delete('/:id', authenticateToken, voiceController.deleteVoice);
router.patch('/:id/restore', authenticateToken, voiceController.restoreVoice);

module.exports = router;
