const mongoose = require('mongoose');

const textModeSchema = new mongoose.Schema({
  // User reference
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },

  // Text Content
  originalText: {
    type: String,
    required: true,
    trim: true,
    maxlength: [10000, 'Text cannot exceed 10,000 characters']
  },
  cleanedText: {
    type: String,
    trim: true
  },
  translatedText: {
    type: String,
    trim: true
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
  detectedLanguage: {
    type: String,
    enum: ['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ja', 'ko', 'zh', 'ar', 'hi', 'mr', 'te', 'ml', 'ur', 'pa', 'bn', 'gu', 'or', 'as', 'am', 'sw', 'zu', 'af', 'xh', 'yo', 'ig', 'ha', 'so', 'rw', 'lg', 'ak', 'tw', 'ee', 'fon', 'dyu', 'bam', 'man', 'wol', 'ful']
  },

  // Processing Information
  processingTime: {
    cleaning: {
      type: Number, // in milliseconds
      default: 0
    },
    translation: {
      type: Number, // in milliseconds
      default: 0
    },
    total: {
      type: Number, // in milliseconds
      default: 0
    }
  },

  // AI Processing Details
  aiProcessing: {
    cleaningModel: {
      type: String,
      default: 'gemini-1.5-flash'
    },
    translationModel: {
      type: String,
      default: 'google-translate'
    },
    confidence: {
      cleaning: {
        type: Number,
        min: 0,
        max: 1,
        default: 0
      },
      translation: {
        type: Number,
        min: 0,
        max: 1,
        default: 0
      },
      languageDetection: {
        type: Number,
        min: 0,
        max: 1,
        default: 0
      }
    }
  },

  // Processing Status
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },

  // Error Handling
  errors: [{
    stage: {
      type: String,
      enum: ['cleaning', 'translation', 'language-detection']
    },
    message: String,
    code: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],

  // Text Analysis
  textAnalysis: {
    wordCount: {
      original: Number,
      cleaned: Number,
      translated: Number
    },
    characterCount: {
      original: Number,
      cleaned: Number,
      translated: Number
    },
    sentenceCount: {
      original: Number,
      cleaned: Number,
      translated: Number
    },
    paragraphCount: {
      original: Number,
      cleaned: Number,
      translated: Number
    },
    readingTime: {
      original: Number, // in minutes
      translated: Number // in minutes
    },
    complexity: {
      original: {
        type: String,
        enum: ['simple', 'moderate', 'complex']
      },
      translated: {
        type: String,
        enum: ['simple', 'moderate', 'complex']
      }
    },
    sentiment: {
      original: {
        type: String,
        enum: ['positive', 'negative', 'neutral']
      },
      translated: {
        type: String,
        enum: ['positive', 'negative', 'neutral']
      }
    }
  },

  // Translation Quality
  quality: {
    accuracy: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    fluency: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    completeness: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    overall: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    }
  },

  // User Interaction
  userActions: [{
    action: {
      type: String,
      enum: ['input', 'translate', 'copy', 'share', 'download', 'rate', 'feedback', 'replay', 'edit']
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    metadata: mongoose.Schema.Types.Mixed
  }],

  // Text-to-Speech
  tts: {
    originalPlayed: {
      type: Boolean,
      default: false
    },
    translatedPlayed: {
      type: Boolean,
      default: false
    },
    playCount: {
      original: {
        type: Number,
        default: 0
      },
      translated: {
        type: Number,
        default: 0
      }
    },
    lastPlayed: {
      original: Date,
      translated: Date
    }
  },

  // History and Versioning
  history: [{
    version: Number,
    originalText: String,
    cleanedText: String,
    translatedText: String,
    sourceLanguage: String,
    targetLanguage: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    changes: [{
      field: String,
      oldValue: String,
      newValue: String
    }]
  }],

  // Tags and Categories
  tags: [String],
  category: {
    type: String,
    enum: ['general', 'business', 'academic', 'technical', 'creative', 'conversational', 'formal', 'informal']
  },

  // Privacy and Sharing
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

  // Analytics
  analytics: {
    viewCount: {
      type: Number,
      default: 0
    },
    copyCount: {
      type: Number,
      default: 0
    },
    shareCount: {
      type: Number,
      default: 0
    },
    downloadCount: {
      type: Number,
      default: 0
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: null
    },
    feedback: String,
    usageTime: Number // in seconds
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  collection: 'text' // Use text collection
});

// Virtual for success rate
textModeSchema.virtual('successRate').get(function() {
  const totalStages = 2; // cleaning and translation
  let successfulStages = 0;
  
  if (this.cleanedText) successfulStages++;
  if (this.translatedText) successfulStages++;
  
  return (successfulStages / totalStages) * 100;
});

// Virtual for processing efficiency
textModeSchema.virtual('processingEfficiency').get(function() {
  if (this.processingTime.total === 0) return 0;
  
  const totalCharacters = this.originalText.length + (this.translatedText?.length || 0);
  return totalCharacters / (this.processingTime.total / 1000); // characters per second
});

// Indexes for better query performance
textModeSchema.index({ userId: 1, createdAt: -1 });
textModeSchema.index({ status: 1 });
textModeSchema.index({ sourceLanguage: 1, targetLanguage: 1 });
textModeSchema.index({ 'textAnalysis.wordCount.original': -1 });
textModeSchema.index({ tags: 1 });
textModeSchema.index({ category: 1 });

// Pre-save middleware to calculate total processing time
textModeSchema.pre('save', function(next) {
  this.processingTime.total = 
    this.processingTime.cleaning + 
    this.processingTime.translation;
  next();
});

// Pre-save middleware to update text analysis
textModeSchema.pre('save', function(next) {
  if (this.originalText) {
    this.textAnalysis.wordCount.original = this.originalText.split(/\s+/).length;
    this.textAnalysis.characterCount.original = this.originalText.length;
    this.textAnalysis.sentenceCount.original = this.originalText.split(/[.!?]+/).length - 1;
    this.textAnalysis.paragraphCount.original = this.originalText.split(/\n\s*\n/).length;
    this.textAnalysis.readingTime.original = Math.ceil(this.textAnalysis.wordCount.original / 200); // Average reading speed
  }
  
  if (this.cleanedText) {
    this.textAnalysis.wordCount.cleaned = this.cleanedText.split(/\s+/).length;
    this.textAnalysis.characterCount.cleaned = this.cleanedText.length;
    this.textAnalysis.sentenceCount.cleaned = this.cleanedText.split(/[.!?]+/).length - 1;
    this.textAnalysis.paragraphCount.cleaned = this.cleanedText.split(/\n\s*\n/).length;
  }
  
  if (this.translatedText) {
    this.textAnalysis.wordCount.translated = this.translatedText.split(/\s+/).length;
    this.textAnalysis.characterCount.translated = this.translatedText.length;
    this.textAnalysis.sentenceCount.translated = this.translatedText.split(/[.!?]+/).length - 1;
    this.textAnalysis.paragraphCount.translated = this.translatedText.split(/\n\s*\n/).length;
    this.textAnalysis.readingTime.translated = Math.ceil(this.textAnalysis.wordCount.translated / 200);
  }
  
  next();
});

// Instance method to add error
textModeSchema.methods.addError = function(stage, message, code) {
  this.errors.push({
    stage,
    message,
    code,
    timestamp: new Date()
  });
  return this.save();
};

// Instance method to update processing time
textModeSchema.methods.updateProcessingTime = function(stage, time) {
  if (this.processingTime[stage] !== undefined) {
    this.processingTime[stage] = time;
  }
  return this.save();
};

// Instance method to complete translation
textModeSchema.methods.completeTranslation = function() {
  this.status = 'completed';
  return this.save();
};

// Instance method to fail translation
textModeSchema.methods.failTranslation = function(stage, message, code) {
  this.status = 'failed';
  this.addError(stage, message, code);
  return this.save();
};

// Instance method to add user action
textModeSchema.methods.addUserAction = function(action, metadata = {}) {
  this.userActions.push({
    action,
    timestamp: new Date(),
    metadata
  });
  return this.save();
};

// Instance method to increment analytics
textModeSchema.methods.incrementAnalytics = function(field, amount = 1) {
  if (this.analytics[field] !== undefined) {
    this.analytics[field] += amount;
  }
  return this.save();
};

// Instance method to create version
textModeSchema.methods.createVersion = function() {
  const version = {
    version: (this.history.length || 0) + 1,
    originalText: this.originalText,
    cleanedText: this.cleanedText,
    translatedText: this.translatedText,
    sourceLanguage: this.sourceLanguage,
    targetLanguage: this.targetLanguage,
    timestamp: new Date()
  };
  
  this.history.push(version);
  return this.save();
};

// Static method to find translations by user
textModeSchema.statics.findByUser = function(userId, limit = 50, skip = 0) {
  return this.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip);
};

// Static method to find translations by language pair
textModeSchema.statics.findByLanguagePair = function(sourceLanguage, targetLanguage) {
  return this.find({
    sourceLanguage,
    targetLanguage,
    status: 'completed'
  }).sort({ createdAt: -1 });
};

// Static method to find translations by category
textModeSchema.statics.findByCategory = function(category) {
  return this.find({ category, status: 'completed' }).sort({ createdAt: -1 });
};

// Static method to get user statistics
textModeSchema.statics.getUserStats = async function(userId) {
  return await this.aggregate([
    { $match: { userId: mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        totalTranslations: { $sum: 1 },
        completedTranslations: {
          $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
        },
        failedTranslations: {
          $sum: { $cond: [{ $eq: ['$status', 'failed'] }, 1, 0] }
        },
        avgProcessingTime: { $avg: '$processingTime.total' },
        totalWords: { $sum: '$textAnalysis.wordCount.original' },
        avgSuccessRate: { $avg: '$successRate' }
      }
    }
  ]);
};

// Static method to get global statistics
textModeSchema.statics.getGlobalStats = async function() {
  return await this.aggregate([
    {
      $group: {
        _id: null,
        totalTranslations: { $sum: 1 },
        totalUsers: { $addToSet: '$userId' },
        avgProcessingTime: { $avg: '$processingTime.total' },
        totalWords: { $sum: '$textAnalysis.wordCount.original' },
        languagePairs: { $addToSet: { source: '$sourceLanguage', target: '$targetLanguage' } },
        categories: { $addToSet: '$category' }
      }
    },
    {
      $project: {
        totalTranslations: 1,
        uniqueUsers: { $size: '$totalUsers' },
        avgProcessingTime: 1,
        totalWords: 1,
        uniqueLanguagePairs: { $size: '$languagePairs' },
        uniqueCategories: { $size: '$categories' }
      }
    }
  ]);
};

module.exports = mongoose.model('TextMode', textModeSchema);
