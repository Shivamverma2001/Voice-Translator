const express = require('express');
const router = express.Router();
const translateTextService = require('../services/translateTextService');

// Route handler for text translation





router.post('/', async (req, res) => {
  const { text, targetLang, sourceLang = 'en' } = req.body;

  if (!text || !targetLang) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const result = await translateTextService.translateText(text, targetLang, sourceLang);
    
    if (result.success) {
      res.json({ 
        translatedText: result.translatedText,
        cleanedText: result.cleanedText 
      });
    } else {
      res.status(500).json({ error: result.error });
    }
  } catch (error) {
    console.error('Translation Error:', error);
    res.status(500).json({ error: 'Translation failed' });
  }
});



module.exports = router;
