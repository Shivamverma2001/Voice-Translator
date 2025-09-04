const express = require('express');
const router = express.Router();
const themeController = require('../controllers/themeController');
const { authenticateToken } = require('../middleware/auth');

// Public routes (no authentication required)
router.get('/', themeController.getAllThemes);

router.get('/search', themeController.searchThemes);
router.get('/categories', themeController.getUniqueCategories);
router.get('/category/:category', themeController.getThemesByCategory);
router.get('/default', themeController.getDefaultTheme);
router.get('/active', themeController.getAllThemes); // Alias for active themes - must be before /:id
router.get('/:id', themeController.getThemeById);

// Admin routes (authentication required)
router.get('/admin/all', authenticateToken, themeController.getAllThemesAdmin);
router.get('/admin/:id', authenticateToken, themeController.getThemeByIdAdmin);
router.post('/', authenticateToken, themeController.createTheme);
router.put('/:id', authenticateToken, themeController.updateTheme);
router.delete('/:id', authenticateToken, themeController.deleteTheme);
router.patch('/:id/restore', authenticateToken, themeController.restoreTheme);

module.exports = router;
