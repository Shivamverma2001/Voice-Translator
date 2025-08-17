const express = require('express');
const multer = require('multer');
const { BatchClient } = require('@speechmatics/batch-client');
const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const router = express.Router();
// Ensure uploads directory exists within backend folder
const uploadsDir = path.join(__dirname, '..', 'uploads');
try {
  fs.mkdirSync(uploadsDir, { recursive: true });
} catch (e) {
  // no-op; directory may already exist
}
const upload = multer({ dest: uploadsDir });

// Initialize Speechmatics client
const client = new BatchClient({ 
  apiKey: process.env.SPEECHMATICS_API_KEY, 
  appId: 'voice-translator-app' 
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
  const models = await genAI.listModels();

}

router.post('/', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file uploaded.' });
    }
    
    const filename = req.file.path;
    const languageCode = req.body.languageCode || 'en';

    // Convert language code to Speechmatics format
    const languageMap = {
      'en-US': 'en',
      'en': 'en',
      'es': 'es',
      'fr': 'fr',
      'de': 'de',
      'it': 'it',
      'pt': 'pt',
      'ru': 'ru',
      'ja': 'ja',
      'ko': 'ko',
      'zh': 'zh',
      'ar': 'ar',
      'hi': 'hi',
      'sa': 'sa'
    };

    const speechmaticsLanguage = languageMap[languageCode] || 'en';

    // Read the audio file
    const audioBuffer = fs.readFileSync(filename);
    const file = new File([audioBuffer], 'recording.wav');



    // Transcribe using Speechmatics
    const response = await client.transcribe(
      file,
      {
        transcription_config: {
          language: speechmaticsLanguage,
        },
      },
      'json-v2',
    );



    // Extract the transcript text
    let transcription = '';
    if (typeof response === 'string') {
      transcription = response;
    } else {
      transcription = response.results
        .map((r) => r.alternatives?.[0].content)
        .join(' ');
    }

    // Clean up uploaded file
    fs.unlinkSync(filename);
    
    res.json({ text: transcription });
  } catch (error) {
    console.error('STT Error:', error);
    res.status(500).json({ error: 'Speech-to-text failed: ' + error.message });
  }
});

module.exports = router; 