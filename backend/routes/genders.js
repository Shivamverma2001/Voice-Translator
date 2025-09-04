const express = require('express');
const router = express.Router();
const genderController = require('../controllers/genderController');
const { authenticateToken } = require('../middleware/auth');

// Public routes (no authentication required)
router.get('/', genderController.getAllGenders);
router.get('/search', genderController.searchGenders);
router.get('/:id', genderController.getGenderById);

// Admin routes (authentication required)
router.get('/admin/all', authenticateToken, genderController.getAllGendersAdmin);
router.get('/admin/:id', authenticateToken, genderController.getGenderByIdAdmin);
router.post('/', authenticateToken, genderController.createGender);
router.put('/:id', authenticateToken, genderController.updateGender);
router.delete('/:id', authenticateToken, genderController.deleteGender);
router.patch('/:id/restore', authenticateToken, genderController.restoreGender);

module.exports = router;
