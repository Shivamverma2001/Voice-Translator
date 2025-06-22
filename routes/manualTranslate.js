const express = require('express');
const { BatchClient } = require('@speechmatics/batch-client');

const router = express.Router();

// Initialize Speechmatics batch client for manual text processing
const client = new BatchClient({ 
  apiKey: process.env.SPEECHMATICS_API_KEY, 
  appId: 'voice-translator-manual' 
});

router.post('/', async (req, res) => {
  try {
    const { text, targetLang } = req.body;

    if (!text || !targetLang) {
      return res.status(400).json({ error: 'Missing required fields: text and targetLang' });
    }

    // For manual text, we'll use the free Google Translate service
    // since Speechmatics is for audio transcription, not text translation
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
    
    // Use Google Translate's free web service for text translation
    const https = require('https');
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetCode}&dt=t&q=${encodeURIComponent(text)}`;
    
    const translation = await new Promise((resolve, reject) => {
      https.get(url, (response) => {
        if (response.statusCode === 200) {
          let data = '';
          response.on('data', (chunk) => data += chunk);
          response.on('end', () => {
            try {
              console.log('📥 Raw Google response (manual):', data);
              
              const result = JSON.parse(data);
              console.log('🔍 Parsed result (manual):', JSON.stringify(result, null, 2));
              
              // Handle different response structures
              let translation = '';
              if (result && result[0] && Array.isArray(result[0])) {
                // Extract all translation parts and join them
                translation = result[0]
                  .filter(item => item && item[0]) // Filter out null/undefined items
                  .map(item => item[0]) // Get the translation text
                  .join(''); // Join all parts
              } else if (result && typeof result === 'string') {
                translation = result;
              } else {
                throw new Error('Unexpected response structure');
              }
              
              console.log(`✨ Manual translation result: "${translation}"`);
              resolve(translation);
            } catch (error) {
              console.error('❌ Manual parse error:', error);
              console.error('Raw data:', data);
              reject(new Error(`Failed to parse translation response: ${error.message}`));
            }
          });
        } else {
          console.error(`❌ Manual HTTP error: ${response.statusCode}`);
          reject(new Error(`HTTP ${response.statusCode}`));
        }
      }).on('error', (error) => {
        console.error('❌ Manual network error:', error);
        reject(error);
      });
    });

    res.json({ translatedText: translation });
    
  } catch (error) {
    console.error('Manual Translation Error:', error);
    res.status(500).json({ error: 'Manual translation failed: ' + error.message });
  }
});

module.exports = router; 