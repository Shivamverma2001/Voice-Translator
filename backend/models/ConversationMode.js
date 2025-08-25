const mongoose = require('mongoose');

const conversationModeSchema = new mongoose.Schema({
  // User reference
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },

  // Conversation Information
  sessionId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },

  // Language Configuration
  sourceLanguage: {
    type: String,
    required: true,
    enum: ['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ja', 'ko', 'zh', 'ar', 'hi', 'mr', 'te', 'ml', 'ur', 'pa', 'bn', 'gu', 'or', 'as', 'am', 'sw', 'zu', 'af', 'xh', 'yo', 'ig', 'ha', 'so', 'rw', 'lg', 'ak', 'tw', 'ee', 'fon', 'dyu', 'bam', 'man', 'wol', 'ful']
  },
  targetLanguage: {
    type: String,
    required: true,
    enum: ['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ja', 'ko', 'zh', 'ar', 'hi', 'mr', 'te', 'ml', 'ur', 'pa', 'bn', 'gu', 'or', 'as', 'am', 'sw', 'zu', 'af', 'xh', 'yo', 'ig', 'ha', 'so', 'rw', 'lg', 'ak', 'tw', 'ee', 'fon', 'dyu', 'bam', 'man', 'wol', 'ful']
  },

  // Conversation Messages
  messages: [{
    id: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['user', 'system', 'translation'],
      default: 'user'
    },
    content: {
      original: String,
      cleaned: String,
      translated: String
    },
    language: {
      source: String,
      target: String
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    processingTime: {
      cleaning: Number,
      translation: Number,
      total: Number
    },
    aiProcessing: {
      cleaningModel: String,
      translationModel: String,
      confidence: {
        cleaning: Number,
        translation: Number
      }
    },
    metadata: {
      wordCount: Number,
      characterCount: Number,
      sentiment: {
        type: String,
        enum: ['positive', 'negative', 'neutral']
      },
      complexity: {
        type: String,
        enum: ['simple', 'moderate', 'complex']
      }
    },
    userActions: [{
      action: {
        type: String,
        enum: ['speak', 'replay', 'copy', 'share', 'edit', 'delete']
      },
      timestamp: Date,
      metadata: mongoose.Schema.Types.Mixed
    }]
  }],

  // Conversation Settings
  settings: {
    autoTranslate: {
      type: Boolean,
      default: true
    },
    autoPlay: {
      type: Boolean,
      default: true
    },
    continuousMode: {
      type: Boolean,
      default: true
    },
    silenceTimeout: {
      type: Number,
      default: 1500 // milliseconds
    },
    maxMessageLength: {
      type: Number,
      default: 1000 // characters
    },
    enableHistory: {
      type: Boolean,
      default: true
    }
  },

  // Session Status
  status: {
    type: String,
    enum: ['active', 'paused', 'completed', 'cancelled'],
    default: 'active'
  },

  // Processing Information
  processingStats: {
    totalMessages: {
      type: Number,
      default: 0
    },
    successfulTranslations: {
      type: Number,
      default: 0
    },
    failedTranslations: {
      type: Number,
      default: 0
    },
    avgProcessingTime: {
      type: Number,
      default: 0
    },
    totalWords: {
      type: Number,
      default: 0
    },
    totalCharacters: {
      type: Number,
      default: 0
    }
  },

  // Error Handling
  errors: [{
    stage: {
      type: String,
      enum: ['transcription', 'cleaning', 'translation', 'tts', 'session-management']
    },
    message: String,
    code: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    messageId: String,
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium'
    }
  }],

  // Audio Information
  audio: {
    format: {
      type: String,
      enum: ['webm', 'mp3', 'wav', 'ogg', 'm4a'],
      default: 'webm'
    },
    quality: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    sampleRate: {
      type: Number,
      default: 44100
    },
    channels: {
      type: Number,
      default: 1
    },
    totalDuration: Number, // in seconds
    silenceDetection: {
      enabled: {
        type: Boolean,
        default: true
      },
      threshold: {
        type: Number,
        default: 20
      },
      timeout: {
        type: Number,
        default: 1500
      }
    }
  },

  // Performance Metrics
  performance: {
    memoryUsage: Number, // in MB
    cpuUsage: Number, // percentage
    networkLatency: Number, // in milliseconds
    responseTime: {
      transcription: Number,
      cleaning: Number,
      translation: Number,
      tts: Number
    }
  },

  // User Interaction
  userActions: [{
    action: {
      type: String,
      enum: ['start', 'pause', 'resume', 'stop', 'clear', 'export', 'settings-change']
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    metadata: mongoose.Schema.Types.Mixed
  }],

  // Export and Sharing
  export: {
    formats: [{
      type: String,
      enum: ['json', 'txt', 'csv', 'pdf']
    }],
    lastExported: Date,
    exportCount: {
      type: Number,
      default: 0
    }
  },

  // Privacy and Security
  privacy: {
    isPublic: {
      type: Boolean,
      default: false
    },
    shareToken: String,
    expiresAt: Date,
    allowedUsers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    encryption: {
      enabled: {
        type: Boolean,
        default: false
      },
      algorithm: String,
      keySize: Number
    }
  },

  // Analytics
  analytics: {
    sessionDuration: Number, // in seconds
    messageFrequency: Number, // messages per minute
    translationAccuracy: Number, // percentage
    userSatisfaction: {
      type: Number,
      min: 1,
      max: 5,
      default: null
    },
    feedback: String,
    usagePatterns: {
      peakHours: [Number], // 0-23
      averageSessionLength: Number,
      commonLanguagePairs: [{
        source: String,
        target: String,
        count: Number
      }]
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  collection: 'conversation' // Use conversation collection
});

// Virtual for conversation duration
conversationModeSchema.virtual('conversationDuration').get(function() {
  if (this.createdAt && this.updatedAt) {
    return Math.round((this.updatedAt - this.createdAt) / 1000); // in seconds
  }
  return 0;
});

// Virtual for success rate
conversationModeSchema.virtual('successRate').get(function() {
  if (this.processingStats.totalMessages === 0) return 0;
  return (this.processingStats.successfulTranslations / this.processingStats.totalMessages) * 100;
});

// Virtual for average words per message
conversationModeSchema.virtual('avgWordsPerMessage').get(function() {
  if (this.processingStats.totalMessages === 0) return 0;
  return this.processingStats.totalWords / this.processingStats.totalMessages;
});

// Indexes for better query performance
conversationModeSchema.index({ userId: 1, createdAt: -1 });
conversationModeSchema.index({ sessionId: 1 });
conversationModeSchema.index({ status: 1 });
conversationModeSchema.index({ sourceLanguage: 1, targetLanguage: 1 });
conversationModeSchema.index({ 'messages.timestamp': -1 });

// Pre-save middleware to update processing stats
conversationModeSchema.pre('save', function(next) {
  if (this.messages && this.messages.length > 0) {
    this.processingStats.totalMessages = this.messages.length;
    this.processingStats.successfulTranslations = this.messages.filter(m => m.content.translated).length;
    this.processingStats.failedTranslations = this.messages.filter(m => !m.content.translated).length;
    
    // Calculate total words and characters
    this.processingStats.totalWords = this.messages.reduce((total, msg) => {
      return total + (msg.metadata?.wordCount || 0);
    }, 0);
    
    this.processingStats.totalCharacters = this.messages.reduce((total, msg) => {
      return total + (msg.metadata?.characterCount || 0);
    }, 0);
    
    // Calculate average processing time
    const totalProcessingTime = this.messages.reduce((total, msg) => {
      return total + (msg.processingTime?.total || 0);
    }, 0);
    
    this.processingStats.avgProcessingTime = totalProcessingTime / this.messages.length;
  }
  next();
});

// Instance method to add message
conversationModeSchema.methods.addMessage = function(messageData) {
  const message = {
    id: messageData.id || `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type: messageData.type || 'user',
    content: {
      original: messageData.original || '',
      cleaned: messageData.cleaned || '',
      translated: messageData.translated || ''
    },
    language: {
      source: messageData.sourceLanguage || this.sourceLanguage,
      target: messageData.targetLanguage || this.targetLanguage
    },
    timestamp: new Date(),
    processingTime: messageData.processingTime || {
      cleaning: 0,
      translation: 0,
      total: 0
    },
    aiProcessing: messageData.aiProcessing || {
      cleaningModel: 'gemini-1.5-flash',
      translationModel: 'gemini-1.5-flash',
      confidence: {
        cleaning: 0.9,
        translation: 0.9
      }
    },
    metadata: {
      wordCount: messageData.original?.split(/\s+/).length || 0,
      characterCount: messageData.original?.length || 0,
      sentiment: 'neutral',
      complexity: 'moderate'
    },
    userActions: []
  };
  
  this.messages.push(message);
  return this.save();
};

// Instance method to update message
conversationModeSchema.methods.updateMessage = function(messageId, updates) {
  const message = this.messages.find(m => m.id === messageId);
  if (message) {
    Object.assign(message, updates);
    message.timestamp = new Date();
  }
  return this.save();
};

// Instance method to add error
conversationModeSchema.methods.addError = function(stage, message, code, severity = 'medium', messageId = null) {
  this.errors.push({
    stage,
    message,
    code,
    timestamp: new Date(),
    messageId,
    severity
  });
  return this.save();
};

// Instance method to pause conversation
conversationModeSchema.methods.pauseConversation = function() {
  this.status = 'paused';
  this.userActions.push({
    action: 'pause',
    timestamp: new Date()
  });
  return this.save();
};

// Instance method to resume conversation
conversationModeSchema.methods.resumeConversation = function() {
  this.status = 'active';
  this.userActions.push({
    action: 'resume',
    timestamp: new Date()
  });
  return this.save();
};

// Instance method to complete conversation
conversationModeSchema.methods.completeConversation = function() {
  this.status = 'completed';
  this.userActions.push({
    action: 'stop',
    timestamp: new Date()
  });
  return this.save();
};

// Instance method to add user action
conversationModeSchema.methods.addUserAction = function(action, metadata = {}) {
  this.userActions.push({
    action,
    timestamp: new Date(),
    metadata
  });
  return this.save();
};

// Static method to find conversations by user
conversationModeSchema.statics.findByUser = function(userId, limit = 50, skip = 0) {
  return this.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip);
};

// Static method to find conversations by status
conversationModeSchema.statics.findByStatus = function(status) {
  return this.find({ status }).sort({ createdAt: -1 });
};

// Static method to find conversations by language pair
conversationModeSchema.statics.findByLanguagePair = function(sourceLanguage, targetLanguage) {
  return this.find({
    sourceLanguage,
    targetLanguage,
    status: 'completed'
  }).sort({ createdAt: -1 });
};

// Static method to get user statistics
conversationModeSchema.statics.getUserStats = async function(userId) {
  return await this.aggregate([
    { $match: { userId: mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        totalConversations: { $sum: 1 },
        completedConversations: {
          $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
        },
        totalMessages: { $sum: '$processingStats.totalMessages' },
        totalWords: { $sum: '$processingStats.totalWords' },
        avgSessionDuration: { $avg: '$conversationDuration' },
        avgSuccessRate: { $avg: '$successRate' }
      }
    }
  ]);
};

// Static method to get global statistics
conversationModeSchema.statics.getGlobalStats = async function() {
  return await this.aggregate([
    {
      $group: {
        _id: null,
        totalConversations: { $sum: 1 },
        totalUsers: { $addToSet: '$userId' },
        totalMessages: { $sum: '$processingStats.totalMessages' },
        totalWords: { $sum: '$processingStats.totalWords' },
        avgSessionDuration: { $avg: '$conversationDuration' },
        languagePairs: { $addToSet: { source: '$sourceLanguage', target: '$targetLanguage' } }
      }
    },
    {
      $project: {
        totalConversations: 1,
        uniqueUsers: { $size: '$totalUsers' },
        totalMessages: 1,
        totalWords: 1,
        avgSessionDuration: 1,
        uniqueLanguagePairs: { $size: '$languagePairs' }
      }
    }
  ]);
};

module.exports = mongoose.model('ConversationMode', conversationModeSchema);
