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
    origin: [
      "http://localhost:3000",
      "https://5c32c8a89e6e.ngrok-free.app",
      "https://*.ngrok-free.app",
      "http://localhost:8081",
      "http://localhost:19006",
      "*" // Allow all origins for development
    ],
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
    const isAllowed = allowedOrigins.some((allowed) => {
      if (allowed === '*') return true;
      // Simple exact match; extend if you need wildcard domains
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
    socket.join(roomId);
    socket.roomId = roomId;
    socket.userId = userId;
    socket.username = username;
    socket.userLanguage = userLanguage;
    socket.targetLanguage = targetLanguage;
    socket.isCreator = isCreator;
    
    console.log(`📞 User joined call room:`);
    console.log(`👤 Username: ${username}`);
    console.log(`🆔 User ID: ${userId}`);
    console.log(`🏠 Room ID: ${roomId}`);
    console.log(`🌐 Languages: ${userLanguage} ↔ ${targetLanguage}`);
    console.log(`👑 Call Creator: ${isCreator ? 'Yes' : 'No'}`);
    console.log(`⏰ Time: ${new Date().toLocaleString()}`);
    
    // Get all users in the room
    const room = io.sockets.adapter.rooms.get(roomId);
    const userCount = room ? room.size : 1;
    
    console.log(`👥 Users in room: ${userCount}`);
    
    // Notify other users in the room about the new user
    socket.to(roomId).emit('user-joined', {
      userId,
      username,
      userLanguage,
      targetLanguage,
      isCreator
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
    console.log(`🗣️ Speech received:`);
    console.log(`👤 From user: ${username || socket.username}`);
    console.log(`🆔 User ID: ${socket.userId}`);
    console.log(`🏠 Room: ${roomId}`);
    console.log(`📝 Text: "${text}"`);
    console.log(`🌐 Language: ${userLanguage || socket.userLanguage} → ${targetLanguage || socket.targetLanguage}`);
    console.log(`⏰ Time: ${new Date().toLocaleString()}`);
    
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
      
      const prompt = `Translate the following text from ${sourceLang} to ${targetLang}. Return only the translated text without any additional commentary or formatting:

Text: "${text}"

Translation:`;
      
      const result = await model.generateContent(prompt);
      const translatedText = result.response.text().trim();
      
      console.log(`🌐 Translation completed:`);
      console.log(`📝 Original: "${text}"`);
      console.log(`🔄 Translated: "${translatedText}"`);
      console.log(`👤 From user: ${socket.username}`);
      console.log(`⏰ Translation time: ${new Date().toLocaleString()}`);
      
      // Send translated text to other users in the room
      // Find all sockets in the room and emit to each with correct toUsername
      const room = io.sockets.adapter.rooms.get(roomId);
      if (room) {
        room.forEach(socketId => {
          const userSocket = io.sockets.sockets.get(socketId);
          if (userSocket && userSocket.userId !== socket.userId) {
            userSocket.emit('translated-speech', {
              originalText: text,
              translatedText: translatedText,
              fromUserId: socket.userId,
              fromUsername: socket.username,
              fromLanguage: socket.userLanguage,
              toUserId: userSocket.userId,
              toUsername: userSocket.username,
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
    console.log(`📞 Call ended by user:`);
    console.log(`👤 Username: ${socket.username}`);
    console.log(`🆔 User ID: ${socket.userId}`);
    console.log(`🏠 Room: ${roomId}`);
    console.log(`⏰ Time: ${new Date().toLocaleString()}`);
    
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
    
    console.log(`👥 All users disconnected from room: ${roomId}`);
    console.log(`🚫 Room ${roomId} has been completely removed`);
  });

  // Check if a room exists
  socket.on('check-room', (data, callback) => {
    const { roomId } = data;
    const room = io.sockets.adapter.rooms.get(roomId);
    
    // Room exists only if it exists AND has users in it
    if (room && room.size > 0) {
      console.log(`✅ Room ${roomId} exists with ${room.size} users`);
      callback({ exists: true });
    } else {
      console.log(`❌ Room ${roomId} does not exist or is empty`);
      callback({ exists: false });
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('🔌 Client disconnected:', socket.id);
    if (socket.roomId) {
      console.log(`👤 User ${socket.username} disconnected from room ${socket.roomId}`);
      
      // Notify other users in the room
      socket.to(socket.roomId).emit('user-left', {
        userId: socket.userId,
        username: socket.username
      });
      
      // Check if room is now empty and remove it if so
      const room = io.sockets.adapter.rooms.get(socket.roomId);
      if (room && room.size === 0) {
        io.sockets.adapter.rooms.delete(socket.roomId);
        console.log(`🚫 Room ${socket.roomId} removed due to being empty`);
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
