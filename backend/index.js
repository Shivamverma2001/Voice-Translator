require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');

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
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: function (origin, callback) {
      // Allow requests with no origin (e.g., mobile apps, curl)
      if (!origin) return callback(null, true);
      
      // Always allow ngrok domains
      if (origin.includes('ngrok-free.app') || origin.includes('ngrok.io')) {
        return callback(null, true);
      }
      
      // Allow localhost and other allowed origins
      const allowedOrigins = [
        'http://localhost:3000',
        'http://localhost:8081',
        'http://localhost:19006'
      ];
      
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      
      return callback(null, true); // Allow all for development
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true
  }
});

// Set up CORS to allow requests from the frontend and mobile apps
// Configure via env var ALLOWED_ORIGINS as a comma-separated list
const defaultOrigins = [
  'http://localhost:3000',
  'http://localhost:8081', // RN Metro
  'http://localhost:19006', // Expo dev
  'https://*.ngrok-free.app', // Allow all ngrok URLs
  'https://*.ngrok.io', // Allow legacy ngrok URLs
];
const envOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean);
const allowedOrigins = [...new Set([...defaultOrigins, ...envOrigins])];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (e.g., mobile apps, curl)
    if (!origin) return callback(null, true);
    
    // Always allow ngrok domains
    if (origin.includes('ngrok-free.app') || origin.includes('ngrok.io')) {
      return callback(null, true);
    }
    
    const isAllowed = allowedOrigins.some((allowed) => {
      if (allowed === '*') return true;
      // Simple exact match for other domains
      return origin === allowed;
    });
    
    if (isAllowed) return callback(null, true);
    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200,
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
      'POST /api/document-translate': 'Extract and translate text from documents (PDF, DOCX, TXT, Images)',
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
app.use('/api/document-translate', require('./routes/documentTranslate'));

// WebSocket connection handling for real-time calls
io.on('connection', (socket) => {
  console.log('🔌 New client connected:', socket.id);

  // Join a call room
  socket.on('join-call', (data) => {
    const { roomId, userId, username, userLanguage, targetLanguage, isCreator } = data;
    
    // If this is NOT the creator, we need to find the creator's languages and reverse them
    let finalUserLanguage = userLanguage;
    let finalTargetLanguage = targetLanguage;
    
    if (!isCreator) {
      // Find the creator in this room to get their language settings
      const existingRoom = io.sockets.adapter.rooms.get(roomId);
      if (existingRoom) {
        existingRoom.forEach(socketId => {
          const userSocket = io.sockets.sockets.get(socketId);
          if (userSocket && userSocket.isCreator) {
            // Reverse the creator's languages for the joiner
            finalUserLanguage = userSocket.targetLanguage;  // Creator's target becomes joiner's source
            finalTargetLanguage = userSocket.userLanguage;  // Creator's source becomes joiner's target
            

          }
        });
      }
      
      // If joiner didn't send language preferences (null/undefined), always use the reversed creator languages
      if (!userLanguage || !targetLanguage) {

      }
    }
    
    socket.join(roomId);
    socket.roomId = roomId;
    socket.userId = userId;
    socket.username = username;
    socket.userLanguage = finalUserLanguage;
    socket.targetLanguage = finalTargetLanguage;
    socket.isCreator = isCreator;
    
    // Get all users in the room
    const room = io.sockets.adapter.rooms.get(roomId);
    const userCount = room ? room.size : 1;
    
    // Notify other users in the room about the new user
    socket.to(roomId).emit('user-joined', {
      userId,
      username,
      userLanguage: finalUserLanguage,
      targetLanguage: finalTargetLanguage,
      isCreator
    });

    // Send language confirmation to the joining user
    socket.emit('languages-confirmed', {
      userLanguage: finalUserLanguage,
      targetLanguage: finalTargetLanguage,
      isCreator,
      message: isCreator ? 
        `Call created with languages: ${finalUserLanguage} → ${finalTargetLanguage}` :
        `Joined call with languages: ${finalUserLanguage} → ${finalTargetLanguage} (auto-reversed from creator)`
    });

    // Notify the joining user about existing users in the room
    const existingUsers = [];
    const existingRoom = io.sockets.adapter.rooms.get(roomId);
    if (existingRoom) {
      existingRoom.forEach(socketId => {
        const userSocket = io.sockets.sockets.get(socketId);
        if (userSocket && userSocket.userId !== userId) {
          existingUsers.push({
            userId: userSocket.userId,
            username: userSocket.username,
            userLanguage: userSocket.userLanguage,
            targetLanguage: userSocket.targetLanguage,
            isCreator: userSocket.isCreator
          });
        }
      });
    }
    
    // Send existing users to the joining user
    if (existingUsers.length > 0) {
      existingUsers.forEach(existingUser => {
        socket.emit('user-joined', existingUser);
      });
    }
  });

  // Handle real-time speech translation
  socket.on('speech-translation', async (data) => {
    const { text, roomId, username, userLanguage, targetLanguage } = data;

    
    try {
      // Translate the speech
      const { GoogleGenerativeAI } = require('@google/generative-ai');
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      const languages = {
        'en': 'English', 'en-US': 'English', 'es': 'Spanish', 'fr': 'French', 'de': 'German',
        'it': 'Italian', 'pt': 'Portuguese', 'ru': 'Russian', 'ja': 'Japanese',
        'ko': 'Korean', 'zh': 'Chinese', 'ar': 'Arabic', 'hi': 'Hindi',
        'sa': 'Sanskrit', 'mr': 'Marathi', 'te': 'Telugu', 'ml': 'Malayalam',
        'ur': 'Urdu', 'pa': 'Punjabi'
      };
      
      // Normalize language codes
      const normalizeLang = (lang) => {
        if (lang === 'en-US') return 'en';
        return lang;
      };
      
      const sourceLang = languages[userLanguage || socket.userLanguage] || 'English';
      const targetLang = languages[targetLanguage || socket.targetLanguage] || 'English';
      
      // First, clean the transcribed text using Gemini
      const cleaningPrompt = `Clean and correct the following transcribed text. If it's in English, fix spelling, grammar, and punctuation. If it's in another language (like Hindi, Spanish, etc.), convert it to proper text in that language. Return only the cleaned text without any additional commentary:

Text: "${text}"

Cleaned text:`;
      
      const cleaningResult = await model.generateContent(cleaningPrompt);
      const cleanedText = cleaningResult.response.text().trim();
      

      
      // Now translate the cleaned text
      const translationPrompt = `Translate the following text from ${sourceLang} to ${targetLang}. Return only the translated text without any additional commentary or formatting:

Text: "${cleanedText}"

Translation:`;
      
      const translationResult = await model.generateContent(translationPrompt);
      const translatedText = translationResult.response.text().trim();
      

      
      // Send cleaned text and translation to ALL users in the room (including sender)
      // This ensures both users see the complete conversation
      const room = io.sockets.adapter.rooms.get(roomId);
      if (room) {
        room.forEach(socketId => {
          const userSocket = io.sockets.sockets.get(socketId);
          // 🎯 FIXED: Only send translation to OTHER users, not to the speaker
          if (userSocket && userSocket.userId !== socket.userId) {
            userSocket.emit('translated-speech', {
              originalText: cleanedText, // Send cleaned text instead of raw text
              translatedText: translatedText,
              fromUserId: socket.userId,
              fromUsername: username || socket.username, // Use the username from the event
              fromLanguage: socket.userLanguage,
              toUserId: userSocket.userId,
              toUsername: userSocket.username, // FIXED: Use listener's username, not speaker's
              toLanguage: userSocket.userLanguage
            });
          }
        });
      }
      
    } catch (error) {
      console.error('❌ Translation error:', error);
      socket.emit('translation-error', {
        error: 'Translation failed',
        originalText: text
      });
    }
  });

  // Handle call end
  socket.on('end-call', (data) => {
    const { roomId } = data;

    
    // Notify all users in the room that call is ending
    io.to(roomId).emit('call-ended', {
      userId: socket.userId,
      username: socket.username,
      message: `${socket.username} ended the call`
    });
    
    // Disconnect all users from the room
    const room = io.sockets.adapter.rooms.get(roomId);
    if (room) {
      room.forEach(socketId => {
        const userSocket = io.sockets.sockets.get(socketId);
        if (userSocket) {
          userSocket.leave(roomId);
        }
      });
    }
    
    // Completely remove the room so it can't be joined anymore
    // This ensures the room is "hung up" like a phone call
    io.sockets.adapter.rooms.delete(roomId);
    

  });

  // Check if a room exists
  socket.on('check-room', (data, callback) => {
    const { roomId } = data;
    const room = io.sockets.adapter.rooms.get(roomId);
    
    // Room exists only if it exists AND has users in it
    if (room && room.size > 0) {
      callback({ exists: true });
    } else {
      callback({ exists: false });
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    if (socket.roomId) {
      // Notify other users in the room
      socket.to(socket.roomId).emit('user-left', {
        userId: socket.userId,
        username: socket.username
      });
      
      // Check if room is now empty and remove it if so
      const room = io.sockets.adapter.rooms.get(socket.roomId);
      if (room && room.size === 0) {
        io.sockets.adapter.rooms.delete(socket.roomId);

      }
    }
  });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

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
