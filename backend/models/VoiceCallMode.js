const mongoose = require('mongoose');

const voiceCallModeSchema = new mongoose.Schema({
  // Call Information
  roomId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  
  // Call Creator
  creator: {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    username: {
      type: String,
      required: true
    },
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
    joinedAt: {
      type: Date,
      default: Date.now
    },
    leftAt: Date,
    isActive: {
      type: Boolean,
      default: true
    }
  },

  // Call Participants
  participants: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    username: {
      type: String,
      required: true
    },
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
    joinedAt: {
      type: Date,
      default: Date.now
    },
    leftAt: Date,
    isActive: {
      type: Boolean,
      default: true
    },
    deviceInfo: {
      userAgent: String,
      platform: String,
      browser: String,
      version: String
    },
    connectionQuality: {
      type: String,
      enum: ['excellent', 'good', 'fair', 'poor'],
      default: 'good'
    }
  }],

  // Call Messages/Translations
  messages: [{
    id: {
      type: String,
      required: true
    },
    speaker: {
      userId: mongoose.Schema.Types.ObjectId,
      username: String,
      sourceLanguage: String,
      targetLanguage: String
    },
    listener: {
      userId: mongoose.Schema.Types.ObjectId,
      username: String,
      sourceLanguage: String,
      targetLanguage: String
    },
    content: {
      originalText: String,
      cleanedText: String,
      translatedText: String
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    processingTime: {
      transcription: Number,
      cleaning: Number,
      translation: Number,
      total: Number
    },
    aiProcessing: {
      transcriptionModel: String,
      cleaningModel: String,
      translationModel: String,
      confidence: {
        transcription: Number,
        cleaning: Number,
        translation: Number
      }
    },
    metadata: {
      wordCount: Number,
      characterCount: Number,
      duration: Number, // in seconds
      sentiment: {
        type: String,
        enum: ['positive', 'negative', 'neutral']
      }
    },
    userActions: [{
      action: {
        type: String,
        enum: ['replay', 'copy', 'share', 'rate', 'feedback']
      },
      timestamp: Date,
      metadata: mongoose.Schema.Types.Mixed
    }]
  }],

  // Call Status
  status: {
    type: String,
    enum: ['waiting', 'active', 'ended', 'cancelled'],
    default: 'waiting'
  },

  // Call Settings
  settings: {
    maxParticipants: {
      type: Number,
      default: 2
    },
    autoTranslate: {
      type: Boolean,
      default: true
    },
    autoPlay: {
      type: Boolean,
      default: true
    },
    recording: {
      enabled: {
        type: Boolean,
        default: false
      },
      quality: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
      }
    },
    moderation: {
      enabled: {
        type: Boolean,
        default: false
      },
      profanityFilter: {
        type: Boolean,
        default: true
      },
      contentFilter: {
        type: Boolean,
        default: false
      }
    }
  },

  // Call Statistics
  callStats: {
    startTime: Date,
    endTime: Date,
    duration: Number, // in seconds
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
    },
    peakConcurrentUsers: {
      type: Number,
      default: 1
    }
  },

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
    echoCancellation: {
      type: Boolean,
      default: true
    },
    noiseSuppression: {
      type: Boolean,
      default: true
    },
    autoGainControl: {
      type: Boolean,
      default: true
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
    },
    bandwidth: {
      upload: Number, // in kbps
      download: Number // in kbps
    }
  },

  // Error Handling
  errors: [{
    stage: {
      type: String,
      enum: ['connection', 'transcription', 'cleaning', 'translation', 'tts', 'audio-processing']
    },
    message: String,
    code: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    userId: mongoose.Schema.Types.ObjectId,
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium'
    }
  }],

  // Call History
  callHistory: [{
    action: {
      type: String,
      enum: ['created', 'joined', 'left', 'message-sent', 'translation-received', 'call-ended', 'error-occurred']
    },
    userId: mongoose.Schema.Types.ObjectId,
    username: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    metadata: mongoose.Schema.Types.Mixed
  }],

  // Privacy and Security
  privacy: {
    isPublic: {
      type: Boolean,
      default: false
    },
    accessToken: String,
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
    userSatisfaction: {
      type: Number,
      min: 1,
      max: 5,
      default: null
    },
    feedback: String,
    qualityMetrics: {
      audioQuality: Number, // 1-10
      translationAccuracy: Number, // 1-10
      callStability: Number, // 1-10
      overallExperience: Number // 1-10
    },
    usagePatterns: {
      peakHours: [Number], // 0-23
      averageCallLength: Number,
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
  collection: 'voice_call' // Use voice_call collection
});

// Virtual for call duration
voiceCallModeSchema.virtual('callDuration').get(function() {
  if (this.callStats.startTime && this.callStats.endTime) {
    return Math.round((this.callStats.endTime - this.callStats.startTime) / 1000); // in seconds
  }
  if (this.callStats.startTime) {
    return Math.round((new Date() - this.callStats.startTime) / 1000); // in seconds
  }
  return 0;
});

// Virtual for active participants count
voiceCallModeSchema.virtual('activeParticipantsCount').get(function() {
  return this.participants.filter(p => p.isActive).length;
});

// Virtual for success rate
voiceCallModeSchema.virtual('successRate').get(function() {
  if (this.callStats.totalMessages === 0) return 0;
  return (this.callStats.successfulTranslations / this.callStats.totalMessages) * 100;
});

// Indexes for better query performance
voiceCallModeSchema.index({ roomId: 1 });
voiceCallModeSchema.index({ status: 1 });
voiceCallModeSchema.index({ 'creator.userId': 1 });
voiceCallModeSchema.index({ 'participants.userId': 1 });
voiceCallModeSchema.index({ 'callStats.startTime': -1 });
voiceCallModeSchema.index({ 'messages.timestamp': -1 });

// Pre-save middleware to update call statistics
voiceCallModeSchema.pre('save', function(next) {
  if (this.messages && this.messages.length > 0) {
    this.callStats.totalMessages = this.messages.length;
    this.callStats.successfulTranslations = this.messages.filter(m => m.content.translatedText).length;
    this.callStats.failedTranslations = this.messages.filter(m => !m.content.translatedText).length;
    
    // Calculate total words and characters
    this.callStats.totalWords = this.messages.reduce((total, msg) => {
      return total + (msg.metadata?.wordCount || 0);
    }, 0);
    
    this.callStats.totalCharacters = this.messages.reduce((total, msg) => {
      return total + (msg.metadata?.characterCount || 0);
    }, 0);
    
    // Calculate average processing time
    const totalProcessingTime = this.messages.reduce((total, msg) => {
      return total + (msg.processingTime?.total || 0);
    }, 0);
    
    this.callStats.avgProcessingTime = totalProcessingTime / this.messages.length;
  }
  
  // Update peak concurrent users
  const activeParticipants = this.participants.filter(p => p.isActive).length;
  if (activeParticipants > this.callStats.peakConcurrentUsers) {
    this.callStats.peakConcurrentUsers = activeParticipants;
  }
  
  next();
});

// Instance method to add participant
voiceCallModeSchema.methods.addParticipant = function(participantData) {
  const participant = {
    userId: participantData.userId,
    username: participantData.username,
    sourceLanguage: participantData.sourceLanguage,
    targetLanguage: participantData.targetLanguage,
    joinedAt: new Date(),
    isActive: true,
    deviceInfo: participantData.deviceInfo || {},
    connectionQuality: 'good'
  };
  
  this.participants.push(participant);
  this.callHistory.push({
    action: 'joined',
    userId: participantData.userId,
    username: participantData.username,
    timestamp: new Date()
  });
  
  return this.save();
};

// Instance method to remove participant
voiceCallModeSchema.methods.removeParticipant = function(userId) {
  const participant = this.participants.find(p => p.userId.toString() === userId.toString());
  if (participant) {
    participant.isActive = false;
    participant.leftAt = new Date();
    
    this.callHistory.push({
      action: 'left',
      userId: participant.userId,
      username: participant.username,
      timestamp: new Date()
    });
  }
  
  return this.save();
};

// Instance method to add message
voiceCallModeSchema.methods.addMessage = function(messageData) {
  const message = {
    id: messageData.id || `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    speaker: {
      userId: messageData.speaker.userId,
      username: messageData.speaker.username,
      sourceLanguage: messageData.speaker.sourceLanguage,
      targetLanguage: messageData.speaker.targetLanguage
    },
    listener: {
      userId: messageData.listener.userId,
      username: messageData.listener.username,
      sourceLanguage: messageData.listener.sourceLanguage,
      targetLanguage: messageData.listener.targetLanguage
    },
    content: {
      originalText: messageData.originalText || '',
      cleanedText: messageData.cleanedText || '',
      translatedText: messageData.translatedText || ''
    },
    timestamp: new Date(),
    processingTime: messageData.processingTime || {
      transcription: 0,
      cleaning: 0,
      translation: 0,
      total: 0
    },
    aiProcessing: messageData.aiProcessing || {
      transcriptionModel: 'speechmatics',
      cleaningModel: 'gemini-1.5-flash',
      translationModel: 'gemini-1.5-flash',
      confidence: {
        transcription: 0.9,
        cleaning: 0.9,
        translation: 0.9
      }
    },
    metadata: {
      wordCount: messageData.originalText?.split(/\s+/).length || 0,
      characterCount: messageData.originalText?.length || 0,
      duration: messageData.duration || 0,
      sentiment: 'neutral'
    },
    userActions: []
  };
  
  this.messages.push(message);
  this.callHistory.push({
    action: 'message-sent',
    userId: messageData.speaker.userId,
    username: messageData.speaker.username,
    timestamp: new Date()
  });
  
  return this.save();
};

// Instance method to start call
voiceCallModeSchema.methods.startCall = function() {
  this.status = 'active';
  this.callStats.startTime = new Date();
  this.callHistory.push({
    action: 'created',
    userId: this.creator.userId,
    username: this.creator.username,
    timestamp: new Date()
  });
  return this.save();
};

// Instance method to end call
voiceCallModeSchema.methods.endCall = function() {
  this.status = 'ended';
  this.callStats.endTime = new Date();
  this.callStats.duration = this.callDuration;
  
  // Mark all participants as inactive
  this.participants.forEach(p => {
    p.isActive = false;
    if (!p.leftAt) {
      p.leftAt = new Date();
    }
  });
  
  this.callHistory.push({
    action: 'call-ended',
    userId: this.creator.userId,
    username: this.creator.username,
    timestamp: new Date()
  });
  
  return this.save();
};

// Instance method to add error
voiceCallModeSchema.methods.addError = function(stage, message, code, userId = null, severity = 'medium') {
  this.errors.push({
    stage,
    message,
    code,
    timestamp: new Date(),
    userId,
    severity
  });
  
  this.callHistory.push({
    action: 'error-occurred',
    userId,
    username: this.participants.find(p => p.userId?.toString() === userId?.toString())?.username || 'Unknown',
    timestamp: new Date(),
    metadata: { stage, message, code, severity }
  });
  
  return this.save();
};

// Static method to find calls by user
voiceCallModeSchema.statics.findByUser = function(userId, limit = 50, skip = 0) {
  return this.find({
    $or: [
      { 'creator.userId': userId },
      { 'participants.userId': userId }
    ]
  }).sort({ 'callStats.startTime': -1 }).limit(limit).skip(skip);
};

// Static method to find active calls
voiceCallModeSchema.statics.findActiveCalls = function() {
  return this.find({ status: 'active' }).sort({ 'callStats.startTime': -1 });
};

// Static method to find calls by status
voiceCallModeSchema.statics.findByStatus = function(status) {
  return this.find({ status }).sort({ 'callStats.startTime': -1 });
};

// Static method to get user statistics
voiceCallModeSchema.statics.getUserStats = async function(userId) {
  return await this.aggregate([
    {
      $match: {
        $or: [
          { 'creator.userId': mongoose.Types.ObjectId(userId) },
          { 'participants.userId': mongoose.Types.ObjectId(userId) }
        ]
      }
    },
    {
      $group: {
        _id: null,
        totalCalls: { $sum: 1 },
        completedCalls: {
          $sum: { $cond: [{ $eq: ['$status', 'ended'] }, 1, 0] }
        },
        totalCallTime: { $sum: '$callStats.duration' },
        totalMessages: { $sum: '$callStats.totalMessages' },
        avgCallDuration: { $avg: '$callStats.duration' }
      }
    }
  ]);
};

// Static method to get global statistics
voiceCallModeSchema.statics.getGlobalStats = async function() {
  return await this.aggregate([
    {
      $group: {
        _id: null,
        totalCalls: { $sum: 1 },
        totalUsers: { $addToSet: '$creator.userId' },
        totalCallTime: { $sum: '$callStats.duration' },
        totalMessages: { $sum: '$callStats.totalMessages' },
        avgCallDuration: { $avg: '$callStats.duration' },
        languagePairs: { $addToSet: { source: '$creator.sourceLanguage', target: '$creator.targetLanguage' } }
      }
    },
    {
      $project: {
        totalCalls: 1,
        uniqueUsers: { $size: '$totalUsers' },
        totalCallTime: 1,
        totalMessages: 1,
        avgCallDuration: 1,
        uniqueLanguagePairs: { $size: '$languagePairs' }
      }
    }
  ]);
};

module.exports = mongoose.model('VoiceCallMode', voiceCallModeSchema);
