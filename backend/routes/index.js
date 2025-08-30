const express = require('express');
const router = express.Router();

// Import rate limiting middleware
const { apiLimiter, translationLimiter, uploadLimiter } = require('../middleware/rateLimiter');

// Import all route modules
const apiRoutes = require('./api');
const speechToTextRoutes = require('./speechToText');
const realtimeSpeechToTextRoutes = require('./realtimeSpeechToText');
const translateTextRoutes = require('./translateText');
const manualTranslateRoutes = require('./manualTranslate');
const imageTranslateRoutes = require('./imageTranslate');
const textToSpeechRoutes = require('./textToSpeech');
const documentTranslateRoutes = require('./documentTranslate');
const languageRoutes = require('./languages');
const roomRoutes = require('./rooms');
const firebaseAuthRoutes = require('./firebaseAuth');
const userRoutes = require('./users');

// Apply rate limiting to specific routes
router.use('/', apiLimiter, apiRoutes); // API overview and status endpoints
router.use('/speech-to-text', translationLimiter, speechToTextRoutes);
router.use('/realtime-speech-to-text', translationLimiter, realtimeSpeechToTextRoutes);
router.use('/translate', translationLimiter, translateTextRoutes);
router.use('/manual-translate', translationLimiter, manualTranslateRoutes);
router.use('/image-translate', uploadLimiter, imageTranslateRoutes);
router.use('/text-to-speech', translationLimiter, textToSpeechRoutes);
router.use('/document-translate', uploadLimiter, documentTranslateRoutes);
router.use('/languages', apiLimiter, languageRoutes);
router.use('/rooms', apiLimiter, roomRoutes);
router.use('/firebase-auth', apiLimiter, firebaseAuthRoutes);
router.use('/users', apiLimiter, userRoutes);

module.exports = router;
