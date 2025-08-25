const mongoose = require('mongoose');

const voiceModeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  sourceLanguage: {
    type: String,
    required: true,
    trim: true
  },
  targetLanguage: {
    type: String,
    required: true,
    trim: true
  },
  originalText: {
    type: String,
    required: true,
    trim: true
  },
  cleanedText: {
    type: String,
    trim: true
  },
  translatedText: {
    type: String,
    trim: true
  },
  audioFile: {
    type: String,
    trim: true
  },
  audioDuration: {
    type: Number,
    min: 0
  },
  audioFormat: {
    type: String,
    trim: true
  },
  processingTime: {
    type: Number,
    min: 0
  },
  aiModel: {
    type: String,
    trim: true
  },
  confidence: {
    type: Number,
    min: 0,
    max: 1
  },
  status: {
    type: String,
    enum: ['processing', 'completed', 'failed'],
    default: 'processing'
  },
  error: {
    type: String,
    trim: true
  },
  deviceInfo: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  userAgent: {
    type: String,
    trim: true
  },
  ipAddress: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  collection: 'voice' // Use voice collection
});

// Indexes for better query performance
voiceModeSchema.index({ userId: 1 });
voiceModeSchema.index({ sessionId: 1 });
voiceModeSchema.index({ status: 1 });
voiceModeSchema.index({ createdAt: -1 });
voiceModeSchema.index({ sourceLanguage: 1, targetLanguage: 1 });

// Virtual for processing duration
voiceModeSchema.virtual('processingDuration').get(function() {
  if (this.createdAt && this.updatedAt) {
    return this.updatedAt - this.createdAt;
  }
  return null;
});

// Instance method to update status
voiceModeSchema.methods.updateStatus = function(status, error = null) {
  this.status = status;
  if (error) this.error = error;
  this.updatedAt = new Date();
  return this.save();
};

// Static method to get user's voice sessions
voiceModeSchema.statics.getUserSessions = function(userId, limit = 50) {
  return this.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Static method to get session by ID
voiceModeSchema.statics.getSessionById = function(sessionId) {
  return this.findOne({ sessionId });
};

// Pre-save middleware to update timestamp
voiceModeSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('VoiceMode', voiceModeSchema);
