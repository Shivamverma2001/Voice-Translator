require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Check for required environment variables
if (!process.env.SPEECHMATICS_API_KEY) {
  console.error('SPEECHMATICS_API_KEY environment variable is required');
  process.exit(1);
}

if (!process.env.GEMINI_API_KEY) {
  console.error('GEMINI_API_KEY environment variable is required for intelligent text cleaning');
  process.exit(1);
}

const app = express();

// Set up CORS to allow requests from the frontend
const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200 // For legacy browser support
};
app.use(cors(corsOptions));

app.use(express.json());

// Add a root route for testing
app.get('/', (req, res) => {
  res.json({ 
    message: 'Smart Voice Translator Backend API',
    endpoints: {
      'POST /api/speech-to-text': 'Convert audio to text (batch)',
      'POST /api/realtime-speech-to-text/start': 'Start real-time transcription session',
      'POST /api/realtime-speech-to-text/audio': 'Send audio chunk for real-time transcription',
      'POST /api/realtime-speech-to-text/stop': 'Stop real-time transcription session',
      'POST /api/translate': 'Translate text (for voice mode)',
      'POST /api/manual-translate': 'Translate text (for manual input)',
      'POST /api/image-translate': 'Extract and translate text from images',
      'POST /api/text-to-speech': 'Convert text to speech'
    }
  });
});
app.use('/api/speech-to-text', require('./routes/speechToText'));
app.use('/api/realtime-speech-to-text', require('./routes/realtimeSpeechToText'));
app.use('/api/translate', require('./routes/translateText'));
app.use('/api/manual-translate', require('./routes/manualTranslate'));
app.use('/api/image-translate', require('./routes/imageTranslate'));
app.use('/api/text-to-speech', require('./routes/textToSpeech'));

const PORT = process.env.PORT || 5001;
const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Add error handling
server.on('error', (error) => {
  console.error('Server error:', error);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
