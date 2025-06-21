const express = require('express');
const https = require('https');

const router = express.Router();

// Free translation using Google Translate web service (no API key needed)
function translateWithGoogle(text, targetLang) {
  return new Promise((resolve, reject) => {
    // Map language names to Google Translate codes
    const langMap = {
      'spanish': 'es',
      'es': 'es',
      'french': 'fr', 
      'fr': 'fr',
      'german': 'de',
      'de': 'de',
      'italian': 'it',
      'it': 'it',
      'portuguese': 'pt',
      'pt': 'pt',
      'russian': 'ru',
      'ru': 'ru',
      'japanese': 'ja',
      'ja': 'ja',
      'korean': 'ko',
      'ko': 'ko',
      'chinese': 'zh',
      'zh': 'zh',
      'hindi': 'hi',
      'hi': 'hi',
      'arabic': 'ar',
      'ar': 'ar',
      'english': 'en',
      'en': 'en'
    };

    const targetCode = langMap[targetLang.toLowerCase()] || targetLang;
    
    // Use Google Translate's free web service
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetCode}&dt=t&q=${encodeURIComponent(text)}`;
    
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        let data = '';
        response.on('data', (chunk) => data += chunk);
        response.on('end', () => {
          try {
            // Parse the response (Google Translate returns a complex array)
            const result = JSON.parse(data);
            const translation = result[0][0][0];
            resolve(translation);
          } catch (error) {
            reject(new Error('Failed to parse translation response'));
          }
        });
      } else {
        reject(new Error(`HTTP ${response.statusCode}`));
      }
    }).on('error', reject);
  });
}

router.post('/', async (req, res) => {
  const { text, targetLang } = req.body;

  if (!text || !targetLang) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const translation = await translateWithGoogle(text, targetLang);
    res.json({ translatedText: translation });
  } catch (error) {
    console.error('Translation Error:', error);
    res.status(500).json({ error: 'Translation failed' });
  }
});

module.exports = router;
