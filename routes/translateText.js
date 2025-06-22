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
      'en': 'en',
      'marathi': 'mr',
      'mr': 'mr',
      'telugu': 'te',
      'te': 'te',
      'malayalam': 'ml',
      'ml': 'ml',
      'urdu': 'ur',
      'ur': 'ur'
    };

    const targetCode = langMap[targetLang.toLowerCase()] || targetLang;
    
    // Use Google Translate's free web service
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetCode}&dt=t&q=${encodeURIComponent(text)}`;
    
    console.log(`🌐 Translating to ${targetCode}: "${text}"`);
    
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        let data = '';
        response.on('data', (chunk) => data += chunk);
        response.on('end', () => {
          try {
            console.log('📥 Raw Google response:', data);
            
            // Parse the response (Google Translate returns a complex array)
            const result = JSON.parse(data);
            console.log('🔍 Parsed result:', JSON.stringify(result, null, 2));
            
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
            
            console.log(`✨ Translation result: "${translation}"`);
            resolve(translation);
          } catch (error) {
            console.error('❌ Parse error:', error);
            console.error('Raw data:', data);
            reject(new Error(`Failed to parse translation response: ${error.message}`));
          }
        });
      } else {
        console.error(`❌ HTTP error: ${response.statusCode}`);
        reject(new Error(`HTTP ${response.statusCode}`));
      }
    }).on('error', (error) => {
      console.error('❌ Network error:', error);
      reject(error);
    });
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
