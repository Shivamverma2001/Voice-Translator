const express = require('express');
const multer = require('multer');
const { SpeechClient } = require('@google-cloud/speech');
const fs = require('fs');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Initialize SpeechClient with API key
const client = new SpeechClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  apiKey: process.env.GOOGLE_API_KEY
});

router.post('/', upload.single('audio'), async (req, res) => {
  try {
    const filename = req.file.path;

    const file = fs.readFileSync(filename);
    const audioBytes = file.toString('base64');

    const audio = {
      content: audioBytes,
    };
    const config = {
      encoding: 'LINEAR16',
      sampleRateHertz: 16000,
      languageCode: 'en-IN', // or 'hi-IN' depending on input
    };
    const request = {
      audio: audio,
      config: config,
    };

    const [response] = await client.recognize(request);
    const transcription = response.results
      .map(result => result.alternatives[0].transcript)
      .join('\n');

    fs.unlinkSync(filename); // clean up uploaded file
    res.json({ text: transcription });
  } catch (error) {
    console.error('STT Error:', error);
    res.status(500).json({ error: 'Speech-to-text failed' });
  }
});

module.exports = router;
