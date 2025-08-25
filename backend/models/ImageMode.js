const mongoose = require('mongoose');

const imageModeSchema = new mongoose.Schema({
  // User reference
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },

  // Image Information
  image: {
    originalName: {
      type: String,
      required: true
    },
    filename: {
      type: String,
      required: true,
      unique: true
    },
    mimetype: {
      type: String,
      required: true,
      enum: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp', 'image/tiff', 'image/webp']
    },
    size: {
      type: Number, // in bytes
      required: true
    },
    path: {
      type: String,
      required: true
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    },
    
    // Image metadata
    metadata: {
      dimensions: {
        width: Number,
        height: Number
      },
      format: String,
      colorSpace: String,
      bitDepth: Number,
      hasAlpha: Boolean,
      orientation: Number,
      exif: mongoose.Schema.Types.Mixed
    },
    
    // Processing metadata
    processing: {
      originalSize: Number, // in bytes
      processedSize: Number, // in bytes
      compressionRatio: Number,
      quality: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
      }
    }
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

  // OCR Results
  ocrResults: {
    extractedText: {
      type: String,
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
    
    // OCR confidence and quality
    confidence: {
      overall: {
        type: Number,
        min: 0,
        max: 1,
        default: 0
      },
      byRegion: [{
        region: {
          x: Number,
          y: Number,
          width: Number,
          height: Number
        },
        text: String,
        confidence: Number
      }]
    },
    
    // Text regions and bounding boxes
    textRegions: [{
      id: String,
      text: String,
      boundingBox: {
        x: Number,
        y: Number,
        width: Number,
        height: Number
      },
      confidence: Number,
      language: String,
      font: {
        family: String,
        size: Number,
        weight: String,
        style: String
      }
    }],
    
    // Layout analysis
    layout: {
      orientation: {
        type: String,
        enum: ['horizontal', 'vertical', 'mixed'],
        default: 'horizontal'
      },
      readingOrder: [String], // array of region IDs in reading order
      columns: Number,
      paragraphs: Number,
      lines: Number
    }
  },

  // Processing Information
  processingTime: {
    imageOptimization: {
      type: Number, // in milliseconds
      default: 0
    },
    ocr: {
      type: Number, // in milliseconds
      default: 0
    },
    textCleaning: {
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
    ocrModel: {
      type: String,
      default: 'gemini-vision'
    },
    cleaningModel: {
      type: String,
      default: 'gemini-1.5-flash'
    },
    translationModel: {
      type: String,
      default: 'gemini-1.5-flash'
    },
    confidence: {
      ocr: {
        type: Number,
        min: 0,
        max: 1,
        default: 0
      },
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
      enum: ['image-upload', 'image-optimization', 'ocr', 'text-cleaning', 'translation']
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
      extracted: Number,
      cleaned: Number,
      translated: Number
    },
    characterCount: {
      extracted: Number,
      cleaned: Number,
      translated: Number
    },
    lineCount: {
      extracted: Number,
      cleaned: Number,
      translated: Number
    },
    paragraphCount: {
      extracted: Number,
      cleaned: Number,
      translated: Number
    },
    readingTime: {
      extracted: Number, // in minutes
      translated: Number // in minutes
    },
    complexity: {
      extracted: {
        type: String,
        enum: ['simple', 'moderate', 'complex']
      },
      translated: {
        type: String,
        enum: ['simple', 'moderate', 'complex']
      }
    },
    sentiment: {
      extracted: {
        type: String,
        enum: ['positive', 'negative', 'neutral']
      },
      translated: {
        type: String,
        enum: ['positive', 'negative', 'neutral']
      }
    }
  },

  // Image Analysis
  imageAnalysis: {
    textDensity: Number, // percentage of image containing text
    textClarity: {
      type: String,
      enum: ['low', 'medium', 'high']
    },
    imageQuality: {
      type: String,
      enum: ['low', 'medium', 'high']
    },
    noiseLevel: {
      type: String,
      enum: ['low', 'medium', 'high']
    },
    contrast: {
      type: String,
      enum: ['low', 'medium', 'high']
    },
    brightness: {
      type: String,
      enum: ['low', 'medium', 'high']
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
      enum: ['upload', 'process', 'view', 'copy', 'share', 'download', 'rate', 'feedback', 'replay', 'edit']
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    metadata: mongoose.Schema.Types.Mixed
  }],

  // Text-to-Speech
  tts: {
    extractedPlayed: {
      type: Boolean,
      default: false
    },
    translatedPlayed: {
      type: Boolean,
      default: false
    },
    playCount: {
      extracted: {
        type: Number,
        default: 0
      },
      translated: {
        type: Number,
        default: 0
      }
    },
    lastPlayed: {
      extracted: Date,
      translated: Date
    }
  },

  // History and Versioning
  history: [{
    version: Number,
    extractedText: String,
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
    enum: ['document', 'sign', 'screenshot', 'handwritten', 'printed', 'mixed', 'other']
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

  // File Storage
  storage: {
    originalImage: String, // path to original image
    processedImage: String, // path to processed image
    thumbnail: String, // path to thumbnail
    tempFiles: [String], // paths to temporary files
    cleanupRequired: {
      type: Boolean,
      default: false
    }
  },

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
    usageTime: Number, // in seconds
    processingEfficiency: Number // percentage
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  collection: 'image' // Use image collection
});

// Virtual for success rate
imageModeSchema.virtual('successRate').get(function() {
  const totalStages = 3; // OCR, cleaning, and translation
  let successfulStages = 0;
  
  if (this.ocrResults.extractedText) successfulStages++;
  if (this.ocrResults.cleanedText) successfulStages++;
  if (this.ocrResults.translatedText) successfulStages++;
  
  return (successfulStages / totalStages) * 100;
});

// Virtual for processing efficiency
imageModeSchema.virtual('processingEfficiency').get(function() {
  if (this.processingTime.total === 0) return 0;
  
  const totalCharacters = (this.ocrResults.extractedText?.length || 0) + (this.ocrResults.translatedText?.length || 0);
  return totalCharacters / (this.processingTime.total / 1000); // characters per second
});

// Indexes for better query performance
imageModeSchema.index({ userId: 1, createdAt: -1 });
imageModeSchema.index({ status: 1 });
imageModeSchema.index({ sourceLanguage: 1, targetLanguage: 1 });
imageModeSchema.index({ 'image.mimetype': 1 });
imageModeSchema.index({ category: 1 });
imageModeSchema.index({ tags: 1 });

// Pre-save middleware to calculate total processing time
imageModeSchema.pre('save', function(next) {
  this.processingTime.total = 
    this.processingTime.imageOptimization + 
    this.processingTime.ocr + 
    this.processingTime.textCleaning + 
    this.processingTime.translation;
  next();
});

// Pre-save middleware to update text analysis
imageModeSchema.pre('save', function(next) {
  if (this.ocrResults.extractedText) {
    this.textAnalysis.wordCount.extracted = this.ocrResults.extractedText.split(/\s+/).length;
    this.textAnalysis.characterCount.extracted = this.ocrResults.extractedText.length;
    this.textAnalysis.lineCount.extracted = this.ocrResults.extractedText.split(/\n/).length;
    this.textAnalysis.paragraphCount.extracted = this.ocrResults.extractedText.split(/\n\s*\n/).length;
    this.textAnalysis.readingTime.extracted = Math.ceil(this.textAnalysis.wordCount.extracted / 200);
  }
  
  if (this.ocrResults.cleanedText) {
    this.textAnalysis.wordCount.cleaned = this.ocrResults.cleanedText.split(/\s+/).length;
    this.textAnalysis.characterCount.cleaned = this.ocrResults.cleanedText.length;
    this.textAnalysis.lineCount.cleaned = this.ocrResults.cleanedText.split(/\n/).length;
    this.textAnalysis.paragraphCount.cleaned = this.ocrResults.cleanedText.split(/\n\s*\n/).length;
  }
  
  if (this.ocrResults.translatedText) {
    this.textAnalysis.wordCount.translated = this.ocrResults.translatedText.split(/\s+/).length;
    this.textAnalysis.characterCount.translated = this.ocrResults.translatedText.length;
    this.textAnalysis.lineCount.translated = this.ocrResults.translatedText.split(/\n/).length;
    this.textAnalysis.paragraphCount.translated = this.ocrResults.translatedText.split(/\n\s*\n/).length;
    this.textAnalysis.readingTime.translated = Math.ceil(this.textAnalysis.wordCount.translated / 200);
  }
  
  next();
});

// Instance method to add error
imageModeSchema.methods.addError = function(stage, message, code) {
  this.errors.push({
    stage,
    message,
    code,
    timestamp: new Date()
  });
  return this.save();
};

// Instance method to update processing time
imageModeSchema.methods.updateProcessingTime = function(stage, time) {
  if (this.processingTime[stage] !== undefined) {
    this.processingTime[stage] = time;
  }
  return this.save();
};

// Instance method to complete processing
imageModeSchema.methods.completeProcessing = function() {
  this.status = 'completed';
  return this.save();
};

// Instance method to fail processing
imageModeSchema.methods.failProcessing = function(stage, message, code) {
  this.status = 'failed';
  this.addError(stage, message, code);
  return this.save();
};

// Instance method to add user action
imageModeSchema.methods.addUserAction = function(action, metadata = {}) {
  this.userActions.push({
    action,
    timestamp: new Date(),
    metadata
  });
  return this.save();
};

// Instance method to increment analytics
imageModeSchema.methods.incrementAnalytics = function(field, amount = 1) {
  if (this.analytics[field] !== undefined) {
    this.analytics[field] += amount;
  }
  return this.save();
};

// Instance method to create version
imageModeSchema.methods.createVersion = function() {
  const version = {
    version: (this.history.length || 0) + 1,
    extractedText: this.ocrResults.extractedText,
    cleanedText: this.ocrResults.cleanedText,
    translatedText: this.ocrResults.translatedText,
    sourceLanguage: this.sourceLanguage,
    targetLanguage: this.targetLanguage,
    timestamp: new Date()
  };
  
  this.history.push(version);
  return this.save();
};

// Static method to find images by user
imageModeSchema.statics.findByUser = function(userId, limit = 50, skip = 0) {
  return this.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip);
};

// Static method to find images by status
imageModeSchema.statics.findByStatus = function(status) {
  return this.find({ status }).sort({ createdAt: -1 });
};

// Static method to find images by category
imageModeSchema.statics.findByCategory = function(category) {
  return this.find({ category, status: 'completed' }).sort({ createdAt: -1 });
};

// Static method to get user statistics
imageModeSchema.statics.getUserStats = async function(userId) {
  return await this.aggregate([
    { $match: { userId: mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        totalImages: { $sum: 1 },
        completedImages: {
          $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
        },
        failedImages: {
          $sum: { $cond: [{ $eq: ['$status', 'failed'] }, 1, 0] }
        },
        avgProcessingTime: { $avg: '$processingTime.total' },
        totalTextExtracted: { $sum: '$textAnalysis.characterCount.extracted' },
        avgSuccessRate: { $avg: '$successRate' }
      }
    }
  ]);
};

// Static method to get global statistics
imageModeSchema.statics.getGlobalStats = async function() {
  return await this.aggregate([
    {
      $group: {
        _id: null,
        totalImages: { $sum: 1 },
        totalUsers: { $addToSet: '$userId' },
        avgProcessingTime: { $avg: '$processingTime.total' },
        totalTextExtracted: { $sum: '$textAnalysis.characterCount.extracted' },
        languagePairs: { $addToSet: { source: '$sourceLanguage', target: '$targetLanguage' } },
        categories: { $addToSet: '$category' }
      }
    },
    {
      $project: {
        totalImages: 1,
        uniqueUsers: { $size: '$totalUsers' },
        avgProcessingTime: 1,
        totalTextExtracted: 1,
        uniqueLanguagePairs: { $size: '$languagePairs' },
        uniqueCategories: { $size: '$categories' }
      }
    }
  ]);
};

module.exports = mongoose.model('ImageMode', imageModeSchema);
