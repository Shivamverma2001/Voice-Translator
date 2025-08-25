const mongoose = require('mongoose');

const documentModeSchema = new mongoose.Schema({
  // User reference
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },

  // Document Information
  documents: [{
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
      required: true
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
    
    // File metadata
    metadata: {
      pages: Number, // for PDFs
      dimensions: {
        width: Number,
        height: Number
      }, // for images
      encoding: String,
      language: String // detected language
    }
  }],

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

  // Processing Results
  results: [{
    documentIndex: {
      type: Number,
      required: true
    },
    originalName: String,
    
    // Text extraction results
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
    
    // Processing status
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending'
    },
    
    // Processing times
    processingTime: {
      extraction: Number, // in milliseconds
      cleaning: Number, // in milliseconds
      translation: Number, // in milliseconds
      total: Number // in milliseconds
    },
    
    // AI processing details
    aiProcessing: {
      extractionModel: String,
      cleaningModel: String,
      translationModel: String,
      confidence: {
        extraction: {
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
    
    // Error handling
    errors: [{
      stage: {
        type: String,
        enum: ['extraction', 'cleaning', 'translation']
      },
      message: String,
      code: String,
      timestamp: {
        type: Date,
        default: Date.now
      }
    }],
    
    // Text statistics
    textStats: {
      originalLength: Number,
      cleanedLength: Number,
      translatedLength: Number,
      wordCount: {
        original: Number,
        cleaned: Number,
        translated: Number
      },
      characterCount: {
        original: Number,
        cleaned: Number,
        translated: Number
      }
    }
  }],

  // Batch Processing Information
  batchInfo: {
    totalDocuments: {
      type: Number,
      required: true
    },
    processedDocuments: {
      type: Number,
      default: 0
    },
    successfulDocuments: {
      type: Number,
      default: 0
    },
    failedDocuments: {
      type: Number,
      default: 0
    },
    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    }
  },

  // Overall Status
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'partially-completed', 'failed'],
    default: 'pending'
  },

  // Processing Configuration
  processingConfig: {
    enableOCR: {
      type: Boolean,
      default: true
    },
    enableTextCleaning: {
      type: Boolean,
      default: true
    },
    enableTranslation: {
      type: Boolean,
      default: true
    },
    quality: {
      type: String,
      enum: ['fast', 'balanced', 'high'],
      default: 'balanced'
    },
    maxFileSize: {
      type: Number,
      default: 20 * 1024 * 1024 // 20MB
    },
    supportedFormats: [{
      type: String,
      enum: ['pdf', 'docx', 'txt', 'jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff']
    }]
  },

  // Output Configuration
  outputConfig: {
    includeOriginal: {
      type: Boolean,
      default: true
    },
    includeExtracted: {
      type: Boolean,
      default: true
    },
    includeCleaned: {
      type: Boolean,
      default: true
    },
    includeTranslated: {
      type: Boolean,
      default: true
    },
    outputFormat: {
      type: String,
      enum: ['individual', 'combined', 'zip'],
      default: 'zip'
    },
    includeMetadata: {
      type: Boolean,
      default: true
    }
  },

  // File Storage
  storage: {
    originalFiles: [String], // paths to original files
    processedFiles: [String], // paths to processed files
    outputFiles: [String], // paths to output files
    tempFiles: [String], // paths to temporary files
    totalSize: Number, // total size of all files in bytes
    cleanupRequired: {
      type: Boolean,
      default: false
    }
  },

  // User Interaction
  userActions: [{
    action: {
      type: String,
      enum: ['upload', 'process', 'download', 'delete', 'share', 'preview']
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    metadata: mongoose.Schema.Types.Mixed
  }],

  // Analytics
  analytics: {
    viewCount: {
      type: Number,
      default: 0
    },
    downloadCount: {
      type: Number,
      default: 0
    },
    shareCount: {
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
    processingEfficiency: Number // percentage
  },

  // Security & Privacy
  security: {
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
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  collection: 'document' // Use document collection
});

// Virtual for overall processing time
documentModeSchema.virtual('overallProcessingTime').get(function() {
  if (this.results && this.results.length > 0) {
    return this.results.reduce((total, result) => {
      return total + (result.processingTime?.total || 0);
    }, 0);
  }
  return 0;
});

// Virtual for success rate
documentModeSchema.virtual('successRate').get(function() {
  if (this.batchInfo.totalDocuments === 0) return 0;
  return (this.batchInfo.successfulDocuments / this.batchInfo.totalDocuments) * 100;
});

// Virtual for average processing time per document
documentModeSchema.virtual('avgProcessingTimePerDocument').get(function() {
  if (this.batchInfo.processedDocuments === 0) return 0;
  return this.overallProcessingTime / this.batchInfo.processedDocuments;
});

// Indexes for better query performance
documentModeSchema.index({ userId: 1, createdAt: -1 });
documentModeSchema.index({ status: 1 });
documentModeSchema.index({ sourceLanguage: 1, targetLanguage: 1 });
documentModeSchema.index({ 'batchInfo.totalDocuments': -1 });
documentModeSchema.index({ 'results.status': 1 });

// Pre-save middleware to update batch progress
documentModeSchema.pre('save', function(next) {
  if (this.results && this.results.length > 0) {
    this.batchInfo.processedDocuments = this.results.length;
    this.batchInfo.successfulDocuments = this.results.filter(r => r.status === 'completed').length;
    this.batchInfo.failedDocuments = this.results.filter(r => r.status === 'failed').length;
    this.batchInfo.progress = (this.batchInfo.processedDocuments / this.batchInfo.totalDocuments) * 100;
    
    // Update overall status
    if (this.batchInfo.failedDocuments === this.batchInfo.totalDocuments) {
      this.status = 'failed';
    } else if (this.batchInfo.successfulDocuments === this.batchInfo.totalDocuments) {
      this.status = 'completed';
    } else if (this.batchInfo.processedDocuments === this.batchInfo.totalDocuments) {
      this.status = 'partially-completed';
    }
  }
  next();
});

// Instance method to add document result
documentModeSchema.methods.addDocumentResult = function(documentIndex, originalName, extractedText, cleanedText, translatedText) {
  const result = {
    documentIndex,
    originalName,
    extractedText,
    cleanedText,
    translatedText,
    status: 'completed',
    processingTime: {
      extraction: 0,
      cleaning: 0,
      translation: 0,
      total: 0
    },
    aiProcessing: {
      extractionModel: 'gemini-vision',
      cleaningModel: 'gemini-1.5-flash',
      translationModel: 'gemini-1.5-flash',
      confidence: {
        extraction: 0.9,
        cleaning: 0.9,
        translation: 0.9
      }
    },
    textStats: {
      originalLength: extractedText?.length || 0,
      cleanedLength: cleanedText?.length || 0,
      translatedLength: translatedText?.length || 0,
      wordCount: {
        original: extractedText?.split(/\s+/).length || 0,
        cleaned: cleanedText?.split(/\s+/).length || 0,
        translated: translatedText?.split(/\s+/).length || 0
      },
      characterCount: {
        original: extractedText?.length || 0,
        cleaned: cleanedText?.length || 0,
        translated: translatedText?.length || 0
      }
    }
  };
  
  this.results.push(result);
  return this.save();
};

// Instance method to update document processing time
documentModeSchema.methods.updateDocumentProcessingTime = function(documentIndex, stage, time) {
  const result = this.results.find(r => r.documentIndex === documentIndex);
  if (result && result.processingTime[stage] !== undefined) {
    result.processingTime[stage] = time;
    result.processingTime.total = 
      result.processingTime.extraction + 
      result.processingTime.cleaning + 
      result.processingTime.translation;
  }
  return this.save();
};

// Instance method to mark document as failed
documentModeSchema.methods.markDocumentFailed = function(documentIndex, stage, message, code) {
  const result = this.results.find(r => r.documentIndex === documentIndex);
  if (result) {
    result.status = 'failed';
    result.errors.push({
      stage,
      message,
      code,
      timestamp: new Date()
    });
  }
  return this.save();
};

// Static method to find documents by user
documentModeSchema.statics.findByUser = function(userId, limit = 50, skip = 0) {
  return this.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip);
};

// Static method to find documents by status
documentModeSchema.statics.findByStatus = function(status) {
  return this.find({ status }).sort({ createdAt: -1 });
};

// Static method to get user statistics
documentModeSchema.statics.getUserStats = async function(userId) {
  return await this.aggregate([
    { $match: { userId: mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        totalBatches: { $sum: 1 },
        totalDocuments: { $sum: '$batchInfo.totalDocuments' },
        successfulDocuments: { $sum: '$batchInfo.successfulDocuments' },
        failedDocuments: { $sum: '$batchInfo.failedDocuments' },
        avgProcessingTime: { $avg: '$overallProcessingTime' },
        totalFileSize: { $sum: '$storage.totalSize' }
      }
    }
  ]);
};

// Static method to get global statistics
documentModeSchema.statics.getGlobalStats = async function() {
  return await this.aggregate([
    {
      $group: {
        _id: null,
        totalBatches: { $sum: 1 },
        totalDocuments: { $sum: '$batchInfo.totalDocuments' },
        totalUsers: { $addToSet: '$userId' },
        avgProcessingTime: { $avg: '$overallProcessingTime' },
        totalFileSize: { $sum: '$storage.totalSize' },
        languagePairs: { $addToSet: { source: '$sourceLanguage', target: '$targetLanguage' } }
      }
    },
    {
      $project: {
        totalBatches: 1,
        totalDocuments: 1,
        uniqueUsers: { $size: '$totalUsers' },
        avgProcessingTime: 1,
        totalFileSize: 1,
        uniqueLanguagePairs: { $size: '$languagePairs' }
      }
    }
  ]);
};

module.exports = mongoose.model('DocumentMode', documentModeSchema);
