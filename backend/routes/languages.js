const express = require('express');
const router = express.Router();
const languageController = require('../controllers/languageController');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { validateLanguageData } = require('../middleware/validation');

// Public routes (no authentication required)
router.get('/active', languageController.getActiveLanguages);
router.get('/search', languageController.searchLanguages);
router.get('/stats', languageController.getLanguageStats);
router.get('/:shortcode', languageController.getLanguageByShortcode);

// Protected routes (authentication required)
router.use(authenticateToken);

// Admin routes (admin role required)
router.post('/', requireRole('admin'), validateLanguageData, languageController.createLanguage);
router.post('/bulk', requireRole('admin'), languageController.bulkCreateLanguages);
router.get('/', languageController.getAllLanguages);
router.get('/id/:id', languageController.getLanguageById);
router.put('/:id', requireRole('admin'), validateLanguageData, languageController.updateLanguage);
router.patch('/:id/toggle', requireRole('admin'), languageController.toggleLanguageStatus);
router.delete('/:id', requireRole('admin'), languageController.deleteLanguage);
router.post('/validate', languageController.validateLanguageData);

module.exports = router;
