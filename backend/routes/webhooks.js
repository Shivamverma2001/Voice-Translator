const express = require('express');
const router = express.Router();
const webhookController = require('../controllers/webhookController');

// Webhook endpoints (no authentication required - Firebase will call these)
router.post('/firebase-auth', webhookController.handleAuthWebhook);

// Development/testing endpoints
router.get('/health', webhookController.healthCheck);
router.get('/check-email-verification/:firebaseUid', webhookController.checkEmailVerification);

module.exports = router;
