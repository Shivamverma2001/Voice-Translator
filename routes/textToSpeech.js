const express = require('express');
const fs = require('fs');
const path = require('path');
const https = require('https');

const router = express.Router();

// Free TTS using Google Translate TTS (no API key needed)
function getGoogleTTS(text, language = 'en') {
  return new Promise((resolve, reject) => {
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=${language}&client=tw-ob`;
    
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        const chunks = [];
        response.on('data', (chunk) => chunks.push(chunk));
        response.on('end', () => resolve(Buffer.concat(chunks)));
      } else {
        reject(new Error(`HTTP ${response.statusCode}`));
      }
    }).on('error', reject);
  });
}

router.post('/', async (req, res) => {
  const { text, languageCode = 'en' } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Missing text field' });
  }

  try {
    // Use free Google Translate TTS
    const audioBuffer = await getGoogleTTS(text, languageCode);
    const outputPath = `./tts-output-${Date.now()}.mp3`;
    fs.writeFileSync(outputPath, audioBuffer);

    res.sendFile(path.resolve(outputPath), {}, (err) => {
      fs.unlinkSync(outputPath); // clean up after sending
    });
  } catch (error) {
    console.error('TTS Error:', error);
    res.status(500).json({ error: 'Text-to-speech failed' });
  }
});

module.exports = router;
