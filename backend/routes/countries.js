const express = require('express');
const router = express.Router();
const countryController = require('../controllers/countryController');
const { authenticateToken } = require('../middleware/auth');

// Public routes (no authentication required)
router.get('/', countryController.getAllCountries);
router.get('/search', countryController.searchCountries);
router.get('/:id', countryController.getCountryById);

// Admin routes (authentication required)
router.get('/admin/all', authenticateToken, countryController.getAllCountriesAdmin);
router.get('/admin/:id', authenticateToken, countryController.getCountryByIdAdmin);
router.post('/', authenticateToken, countryController.createCountry);
router.put('/:id', authenticateToken, countryController.updateCountry);
router.delete('/:id', authenticateToken, countryController.deleteCountry);
router.patch('/:id/restore', authenticateToken, countryController.restoreCountry);

module.exports = router;
