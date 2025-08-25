require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');

// Import database connection
const { connectDB } = require('./db/connection');

// Check for required environment variables
if (!process.env.SPEECHMATICS_API_KEY) {
  console.error('SPEECHMATICS_API_KEY environment variable is required');
  process.exit(1);
}

if (!process.env.GEMINI_API_KEY) {
  console.error('GEMINI_API_KEY environment variable is required for intelligent text cleaning');
  process.exit(1);
}

if (!process.env.MONGODB_URI) {
  console.error('MONGODB_URI environment variable is required');
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
app.use('/api/languages', require('./routes/languages'));

// WebSocket connection handling for real-time calls
io.on('connection', (socket) => {

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

  // Handle room creation
  socket.on('create-room', (data) => {
    const { roomId, creator, creatorSourceLanguage, creatorTargetLanguage } = data;
    
    console.log('🏠 CREATE-ROOM event received:', {
      roomId,
      creator,
      creatorSourceLanguage,
      creatorTargetLanguage,
      socketId: socket.id,
      timestamp: new Date().toISOString()
    });
    
    try {
      // Store user info in socket
      socket.userId = creator;
      socket.username = creator;
      socket.userLanguage = creatorSourceLanguage;
      socket.targetLanguage = creatorTargetLanguage;
      socket.roomId = roomId;
      socket.isCreator = true;
      
      console.log('✅ User info stored in socket:', {
        userId: socket.userId,
        username: socket.username,
        userLanguage: socket.userLanguage,
        targetLanguage: socket.targetLanguage,
        roomId: socket.roomId,
        isCreator: socket.isCreator
      });
      
      // Join the room
      socket.join(roomId);
      console.log('✅ Creator joined room:', roomId);
      
      // Emit confirmation back to creator
      socket.emit('room-created', {
        roomId,
        creator,
        message: 'Room created successfully'
      });
      console.log('📤 Emitted room-created event to creator');
      
      // Notify other users in the room (if any)
      socket.to(roomId).emit('user-joined', {
        userId: creator,
        username: creator,
        userLanguage: creatorSourceLanguage,
        targetLanguage: creatorTargetLanguage
      });
      console.log('📤 Emitted user-joined event to other users in room');
      
    } catch (error) {
      console.error('❌ Error in create-room:', error);
      socket.emit('room-error', { error: 'Failed to create room' });
    }
  });

  // Handle room joining
  socket.on('join-room', async (data) => {
    const { roomId, joiner, joinerSourceLanguage, joinerTargetLanguage } = data;
    
    console.log('🚪 JOIN-ROOM event received:', {
      roomId,
      joiner,
      joinerSourceLanguage,
      joinerTargetLanguage,
      socketId: socket.id,
      timestamp: new Date().toISOString()
    });
    
    try {
      // Check if room exists
      const room = io.sockets.adapter.rooms.get(roomId);
      if (!room) {
        console.log('❌ Room does not exist:', roomId);
        socket.emit('join-error', { error: 'Room does not exist' });
        return;
      }
      
      // For joiners, we need to reverse the language direction to match the creator
      let finalUserLanguage = joinerSourceLanguage;
      let finalTargetLanguage = joinerTargetLanguage;
      
      // Find the creator in this room to get their language settings and reverse them
      console.log('🔍 Looking for creator in room. Room size:', room.size);
      let creatorFound = false;
      
      // Try to find creator with retry logic
      let retryCount = 0;
      const maxRetries = 3;
      
      while (!creatorFound && retryCount < maxRetries) {
        console.log(`🔍 Attempt ${retryCount + 1} to find creator...`);
        
        room.forEach(socketId => {
          const userSocket = io.sockets.sockets.get(socketId);
          console.log('🔍 Checking socket:', socketId, 'User data:', {
            userId: userSocket?.userId,
            username: userSocket?.username,
            isCreator: userSocket?.isCreator,
            userLanguage: userSocket?.userLanguage,
            targetLanguage: userSocket?.targetLanguage
          });
          
          if (userSocket && userSocket.isCreator && userSocket.userLanguage && userSocket.targetLanguage) {
            creatorFound = true;
            // Reverse the creator's languages for the joiner
            finalUserLanguage = userSocket.targetLanguage;  // Creator's target becomes joiner's source
            finalTargetLanguage = userSocket.userLanguage;  // Creator's source becomes joiner's target
            console.log('🎯 Language reversal applied for joiner:', {
              originalJoiner: { source: joinerSourceLanguage, target: joinerTargetLanguage },
              creatorLanguages: { source: userSocket.userLanguage, target: userSocket.targetLanguage },
              finalJoiner: { source: finalUserLanguage, target: finalTargetLanguage }
            });
          }
        });
        
        if (!creatorFound && retryCount < maxRetries - 1) {
          console.log('⏳ Creator not found, waiting 100ms before retry...');
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        retryCount++;
      }
      
      if (!creatorFound) {
        console.log('⚠️ No creator found in room after retries, using original joiner languages');
      }
      
      // Store user info in socket with reversed languages
      socket.userId = joiner;
      socket.username = joiner;
      socket.userLanguage = finalUserLanguage;
      socket.targetLanguage = finalTargetLanguage;
      socket.roomId = roomId;
      socket.isCreator = false;
      
      console.log('✅ Joiner info stored in socket:', {
        userId: socket.userId,
        username: socket.username,
        userLanguage: socket.userLanguage,
        targetLanguage: socket.targetLanguage,
        roomId: socket.roomId,
        isCreator: socket.isCreator
      });
      
      // Join the room
      socket.join(roomId);
      console.log('✅ Joiner joined room:', roomId);
      
      // Emit confirmation back to joiner
      socket.emit('room-joined', {
        roomId,
        joiner,
        message: 'Joined room successfully'
      });
      console.log('📤 Emitted room-joined event to joiner');
      
      // Notify other users in the room about the new joiner
      socket.to(roomId).emit('user-joined', {
        userId: joiner,
        username: joiner,
        userLanguage: finalUserLanguage,
        targetLanguage: finalTargetLanguage
      });
      console.log('📤 Emitted user-joined event to other users in room with reversed languages');
      
      // Get existing users in the room and send them to the joiner
      const existingUsers = [];
      room.forEach(socketId => {
        const userSocket = io.sockets.sockets.get(socketId);
        if (userSocket && userSocket.userId !== joiner) {
          existingUsers.push({
            userId: userSocket.userId,
            username: userSocket.username,
            userLanguage: userSocket.userLanguage,
            targetLanguage: userSocket.targetLanguage
          });
        }
      });
      
      if (existingUsers.length > 0) {
        console.log('📤 Sending existing users to joiner:', existingUsers);
        existingUsers.forEach(existingUser => {
          socket.emit('user-joined', existingUser);
        });
      }
      
    } catch (error) {
      console.error('❌ Error in join-room:', error);
      socket.emit('join-error', { error: 'Failed to join room' });
    }
  });

  // Handle text transcription for translation
  socket.on('transcribe-text', async (data) => {
    const { roomId, speaker, text, sourceLanguage, targetLanguage } = data;
    
    console.log('📝 TRANSCRIBE-TEXT event received:', {
      roomId,
      speaker,
      text,
      sourceLanguage,
      targetLanguage,
      socketId: socket.id,
      timestamp: new Date().toISOString()
    });
    
    try {
      // Translate the transcribed text
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
      
      const sourceLang = languages[sourceLanguage] || 'English';
      const targetLang = languages[targetLanguage] || 'English';
      
      // Clean the transcribed text
      const cleaningPrompt = `Clean and correct the following transcribed text. If it's in English, fix spelling, grammar, and punctuation. If it's in another language, convert it to proper text in that language. Return only the cleaned text:

Text: "${text}"

Cleaned text:`;
      
      const cleaningResult = await model.generateContent(cleaningPrompt);
      const cleanedText = cleaningResult.response.text().trim();
      console.log('✅ Text cleaned:', { original: text, cleaned: cleanedText });
      
      // Translate the cleaned text
      const translationPrompt = `Translate the following text from ${sourceLang} to ${targetLang}. Return only the translated text:

Text: "${cleanedText}"

Translation:`;
      
      const translationResult = await model.generateContent(translationPrompt);
      const translatedText = translationResult.response.text().trim();
      console.log('✅ Text translated:', { cleaned: cleanedText, translated: translatedText });
      
      // Send translation result to all users in the room
      io.to(roomId).emit('translation-result', {
        speaker,
        sourceLanguage,
        targetLanguage,
        originalText: text,
        cleanedText,
        translatedText
      });
      console.log('📤 Emitted translation-result to all users in room');
      
    } catch (error) {
      console.error('❌ Error in transcribe-text:', error);
      socket.emit('translation-error', { error: 'Translation failed' });
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

  // Handle room leaving
  socket.on('leave-room', (data) => {
    const { roomId, username } = data;
    
    console.log('🚪 LEAVE-ROOM event received:', {
      roomId,
      username,
      socketId: socket.id,
      timestamp: new Date().toISOString()
    });
    
    try {
      // Notify other users in the room
      socket.to(roomId).emit('user-left', {
        userId: socket.userId || username,
        username: socket.username || username
      });
      console.log('📤 Emitted user-left event to other users in room');
      
      // Leave the room
      socket.leave(roomId);
      console.log('✅ User left room:', roomId);
      
      // Clear room info from socket
      socket.roomId = null;
      socket.isCreator = false;
      console.log('✅ Cleared room info from socket');
      
    } catch (error) {
      console.error('❌ Error in leave-room:', error);
    }
  });

  // Handle call end
  socket.on('end-call', (data) => {
    const { roomId } = data;
    
    console.log('📞 END-CALL event received:', {
      roomId,
      userId: socket.userId,
      username: socket.username,
      socketId: socket.id,
      timestamp: new Date().toISOString()
    });
    
    try {
      // Notify all users in the room that call is ending
      io.to(roomId).emit('call-ended', {
        userId: socket.userId,
        username: socket.username,
        message: `${socket.username} ended the call`
      });
      console.log('📤 Emitted call-ended event to all users in room');
      
      // Disconnect all users from the room
      const room = io.sockets.adapter.rooms.get(roomId);
      if (room) {
        console.log(`👥 Disconnecting ${room.size} users from room:`, roomId);
        room.forEach(socketId => {
          const userSocket = io.sockets.sockets.get(socketId);
          if (userSocket) {
            userSocket.leave(roomId);
            // Clear room info from user socket
            userSocket.roomId = null;
            userSocket.isCreator = false;
            console.log(`✅ Disconnected user ${userSocket.username} from room`);
          }
        });
      }
      
      // Completely remove the room so it can't be joined anymore
      // This ensures the room is "hung up" like a phone call
      io.sockets.adapter.rooms.delete(roomId);
      console.log(`🗑️ Room ${roomId} completely removed from server`);
      
    } catch (error) {
      console.error('❌ Error in end-call:', error);
    }
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

// Start server only after database connection is established
const startServer = async () => {
  try {
    // Connect to MongoDB first
    await connectDB();
    
    // Start the server
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📊 Database: Connected to MongoDB`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();

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
