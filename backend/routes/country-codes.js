const express = require('express');
const router = express.Router();
const countryCodeController = require('../controllers/countryCodeController');
const { authenticateToken } = require('../middleware/auth');

// Public routes (no authentication required)
router.get('/', countryCodeController.getAllCountryCodes);
router.get('/search', countryCodeController.searchCountryCodes);
router.get('/dialing-code/:dialingCode', countryCodeController.getByDialingCode);
router.get('/:id', countryCodeController.getCountryCodeById);

// Admin routes (authentication required)
router.get('/admin/all', authenticateToken, countryCodeController.getAllCountryCodesAdmin);
router.get('/admin/:id', authenticateToken, countryCodeController.getCountryCodeByIdAdmin);
router.post('/', authenticateToken, countryCodeController.createCountryCode);
router.put('/:id', authenticateToken, countryCodeController.updateCountryCode);
router.delete('/:id', authenticateToken, countryCodeController.deleteCountryCode);
router.patch('/:id/restore', authenticateToken, countryCodeController.restoreCountryCode);

module.exports = router;
