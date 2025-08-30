const express = require('express');
const multer = require('multer');
const router = express.Router();
const imageTranslateService = require('../services/imageTranslateService');

// Configure multer for image uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
});

// Route handler for image translation

router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }

    const { targetLang = 'es', sourceLang = 'en' } = req.body;

    const result = await imageTranslateService.processImageAndTranslate(
      req.file.buffer,
      req.file.mimetype,
      sourceLang,
      targetLang
    );

    if (result.success) {
      res.json({
        extractedText: result.extractedText,
        cleanedText: result.cleanedText,
        translatedText: result.translatedText,
      });
    } else {
      res.status(500).json({ error: result.error });
    }

  } catch (error) {
    console.error('❌ Image translation error:', error);
    res.status(500).json({ error: 'Image translation failed: ' + error.message });
  }
});

module.exports = router; 