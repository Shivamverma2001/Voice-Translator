require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Set up Google Cloud authentication
const fs = require('fs');
const path = require('path');

// Read the API key from google-credentials.json
const credentialsPath = path.join(__dirname, 'google-credentials.json');
if (fs.existsSync(credentialsPath)) {
  const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));
  process.env.GOOGLE_APPLICATION_CREDENTIALS = credentialsPath;
  // Set the API key for Google Cloud services
  process.env.GOOGLE_API_KEY = credentials.api_key;
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
    message: 'Voice Translator Backend API',
    endpoints: {
      'POST /api/speech-to-text': 'Convert audio to text',
      'POST /api/translate': 'Translate text between languages',
      'POST /api/text-to-speech': 'Convert text to speech'
    }
  });
});
app.use('/api/translate', require('./routes/translateText'));
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
