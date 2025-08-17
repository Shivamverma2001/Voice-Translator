const express = require('express');
const https = require('https');
const { PassThrough } = require('stream');

const router = express.Router();

function chunkText(text, maxLength = 180) {
  const sentences = text.match(/[^.!?]+[.!?]?(?:\s+|$)/g) || [];
  const chunks = [];

  sentences.forEach(sentence => {
    let currentChunk = sentence.trim();
    while (currentChunk.length > 0) {
      if (currentChunk.length <= maxLength) {
        chunks.push(currentChunk);
        break;
      }

      // Find a good place to split (prefer commas, then spaces)
      let splitPos = -1;
      for (let i = maxLength - 1; i >= 0; i--) {
        if (currentChunk[i] === ',' || currentChunk[i] === ' ') {
          splitPos = i;
          break;
        }
      }

      if (splitPos === -1) {
        // No good split point found, just hard-split at maxLength
        splitPos = maxLength;
      }

      chunks.push(currentChunk.substring(0, splitPos + 1).trim());
      currentChunk = currentChunk.substring(splitPos + 1).trim();
    }
  });

  return chunks.filter(c => c.length > 0);
}
// Cache working TTS language per requested code to avoid repeated failures
const ttsLangCache = new Map(); // key: requested lang, value: working lang

function getBaseLang(lang = '') {
  if (!lang) return '';
  const idx = lang.indexOf('-');
  return idx > 0 ? lang.slice(0, idx) : lang;
}

async function getTtsWithFallback(text, requestedLanguage = 'en') {
  // Prepare candidates in order
  const candidates = [];
  const cached = ttsLangCache.get(requestedLanguage);
  if (cached) candidates.push(cached);
  if (requestedLanguage) candidates.push(requestedLanguage);
  const base = getBaseLang(requestedLanguage);
  if (base && base !== requestedLanguage) candidates.push(base);
  candidates.push('en');

  // Deduplicate while preserving order
  const unique = [...new Set(candidates.filter(Boolean))];

  let lastError = null;
  for (const cand of unique) {
    try {
      const audio = await getGoogleTTS(text, cand);
      // Cache the working mapping for future chunks
      ttsLangCache.set(requestedLanguage, cand);
      return { audio, usedLang: cand };
    } catch (err) {
      lastError = err;
      continue;
    }
  }
  throw lastError || new Error('TTS failed for all candidates');
}

// Removed hardcoded/script-based detection per request. Fallback covers unknowns.

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
        // Provide more detailed error logging
        console.error(`Google TTS Error: Status ${response.statusCode} for text: "${text}" (lang: ${language})`);
        reject(new Error(`HTTP ${response.statusCode}`));
      }
    }).on('error', (err) => {
      console.error(`Google TTS Request Error: ${err.message}`);
      reject(err);
    });
  });
}

router.post('/', async (req, res) => {
  const { text, languageCode = 'en' } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Missing text field' });
  }

  try {
    const textChunks = chunkText(text);


    // Set headers for streaming audio
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Transfer-Encoding', 'chunked');

    const passThrough = new PassThrough();
    passThrough.pipe(res);

    for (const chunk of textChunks) {
      try {
        const { audio, usedLang } = await getTtsWithFallback(chunk, languageCode);

        passThrough.write(audio);
      } catch (error) {
        console.error(`Skipping a chunk due to TTS error after fallbacks: ${error.message}`);
        // Continue with the next chunks even if one fails
      }
    }

    passThrough.end();
    

  } catch (error) {
    console.error('TTS Main Error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Text-to-speech failed' });
    }
  }
});

module.exports = router;
