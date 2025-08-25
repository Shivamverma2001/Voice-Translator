const gemini = require('../gemini/gemini');
const socketConnection = require('../socket');

// Translation Service for Voice Translator
class TranslationService {
  constructor() {
    this.gemini = gemini;
    this.socketConnection = socketConnection;
  }

  // Handle text transcription for translation
  async handleTranscribeText(socket, data) {
    const { roomId, speaker, text, sourceLanguage, targetLanguage } = data;
    
    try {
      // Use the Gemini module for text cleaning and translation
      const result = await this.gemini.speechTranslation(text, sourceLanguage, targetLanguage);
      
      if (result.success) {
        const { cleanedText, translatedText } = result;
        
        // Use socket connection utility for consistent room broadcasting
        if (this.socketConnection.isReady()) {
          this.socketConnection.broadcastToRoom(roomId, 'translation-result', {
            speaker,
            sourceLanguage,
            targetLanguage,
            originalText: text,
            cleanedText,
            translatedText
          });
        } else {
          // Fallback to direct socket emission
          const io = this.socketConnection.getSocket();
          io.to(roomId).emit('translation-result', {
            speaker,
            sourceLanguage,
            targetLanguage,
            originalText: text,
            cleanedText,
            translatedText
          });
        }
      } else {
        throw new Error(result.error);
      }
      
    } catch (error) {
      console.error('❌ Translation error:', error);
      socket.emit('translation-error', { error: 'Translation failed' });
    }
  }

  // Handle real-time speech translation
  async handleSpeechTranslation(socket, data) {
    const { text, roomId, username, userLanguage, targetLanguage } = data;

    try {
      // Use the Gemini module for speech translation
      const result = await this.gemini.speechTranslation(
        text, 
        userLanguage || socket.userLanguage, 
        targetLanguage || socket.targetLanguage
      );
      
      if (result.success) {
        const { cleanedText, translatedText } = result;
        
        // Use socket connection utility for consistent room broadcasting
        if (this.socketConnection.isReady()) {
          // Get all users in the room and send translation to others
          const io = this.socketConnection.getSocket();
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
        } else {
          // Fallback to direct socket emission
          const io = this.socketConnection.getSocket();
          const room = io.sockets.adapter.rooms.get(roomId);
          if (room) {
            room.forEach(socketId => {
              const userSocket = io.sockets.sockets.get(socketId);
              if (userSocket && userSocket.userId !== socket.userId) {
                userSocket.emit('translated-speech', {
                  originalText: cleanedText,
                  translatedText: translatedText,
                  fromUserId: socket.userId,
                  fromUsername: username || socket.username,
                  fromLanguage: socket.userLanguage,
                  toUserId: userSocket.userId,
                  toUsername: userSocket.username,
                  toLanguage: userSocket.userLanguage
                });
              }
            });
          }
        }
      } else {
        throw new Error(result.error);
      }
      
    } catch (error) {
      console.error('❌ Speech translation error:', error);
      socket.emit('translation-error', {
        error: 'Translation failed',
        originalText: text
      });
    }
  }

  // Get translation statistics
  getStats() {
    return {
      service: 'TranslationService',
      methods: ['handleTranscribeText', 'handleSpeechTranslation'],
      geminiStatus: this.gemini.getStatus(),
      socketReady: this.socketConnection.isReady()
    };
  }
}

const translationService = new TranslationService();
module.exports = translationService;
