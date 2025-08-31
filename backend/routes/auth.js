const express = require('express');
const router = express.Router();
const { authenticateFirebaseToken } = require('../middleware/firebaseAuth');
const authController = require('../controllers/authController');

// Public routes (no authentication required)
router.post('/signup', authController.signUp);
router.post('/signin', authController.signIn);
router.get('/check-email/:email', authController.checkEmailExists);
router.post('/resend-verification', authController.resendVerification);

// Password reset routes (no authentication required)
router.post('/request-password-reset', authController.requestPasswordReset);
router.post('/verify-reset-code', authController.verifyResetCode);
router.post('/reset-password', authController.resetPassword);

// Protected routes (authentication required)
router.post('/signout', authenticateFirebaseToken, authController.signOut);

module.exports = router;
