const express = require('express');
const router = express.Router();
const { authenticateFirebaseToken } = require('../middleware/firebaseAuth');
const userController = require('../controllers/userController');

// Update user profile by Firebase UID
router.put('/profile', authenticateFirebaseToken, userController.updateUserProfile);

// Soft delete user account
router.delete('/profile', authenticateFirebaseToken, userController.softDeleteUserAccount);

// Debug endpoint to check if user exists
router.get('/debug/user/:firebaseUid', userController.debugUser);

module.exports = router;
