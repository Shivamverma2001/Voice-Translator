const express = require('express');
const router = express.Router();
const { authenticateFirebaseToken, optionalFirebaseAuth } = require('../middleware/firebaseAuth');
const firebaseAuthController = require('../controllers/firebaseAuthController');

// Health check endpoint
router.get('/health', firebaseAuthController.healthCheck);

// Get current user profile (requires authentication)
router.get('/me', authenticateFirebaseToken, firebaseAuthController.getCurrentUser);

// Update user profile (requires authentication)
router.put('/profile', authenticateFirebaseToken, firebaseAuthController.updateProfile);

// Delete user account (requires authentication)
router.delete('/account', authenticateFirebaseToken, firebaseAuthController.deleteAccount);

// Get user by Firebase UID (optional authentication)
router.get('/user/:firebaseUid', optionalFirebaseAuth, firebaseAuthController.getUserByFirebaseUid);

// Get combined Firebase + MongoDB user data (requires authentication)
router.get('/combined-profile', authenticateFirebaseToken, firebaseAuthController.getCombinedProfile);

// Sync user data between Firebase and MongoDB (requires authentication)
router.post('/sync', authenticateFirebaseToken, firebaseAuthController.syncUserData);

// Test endpoint to verify User model with Firebase data (development only)
router.get('/test-user-model', firebaseAuthController.createTestUser);

// Test endpoint to manually create MongoDB user for a Firebase UID
router.post('/create-user-manually', firebaseAuthController.createUserManually);

module.exports = router;
