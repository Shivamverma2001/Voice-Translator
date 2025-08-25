const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Basic Information
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters long'],
    maxlength: [30, 'Username cannot exceed 30 characters'],
    match: [/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long'],
    select: false // Don't include password in queries by default
  },
  firstName: {
    type: String,
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  avatar: {
    type: String,
    default: null
  },

  // Language Preferences
  preferredLanguages: {
    sourceLanguage: {
      type: String,
      default: 'en',
      enum: ['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ja', 'ko', 'zh', 'ar', 'hi', 'mr', 'te', 'ml', 'ur', 'pa', 'bn', 'gu', 'or', 'as', 'am', 'sw', 'zu', 'af', 'xh', 'yo', 'ig', 'ha', 'so', 'rw', 'lg', 'ak', 'tw', 'ee', 'fon', 'dyu', 'bam', 'man', 'wol', 'ful']
    },
    targetLanguage: {
      type: String,
      default: 'es',
      enum: ['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ja', 'ko', 'zh', 'ar', 'hi', 'mr', 'te', 'ml', 'ur', 'pa', 'bn', 'gu', 'or', 'as', 'am', 'sw', 'zu', 'af', 'xh', 'yo', 'ig', 'ha', 'so', 'rw', 'lg', 'ak', 'tw', 'ee', 'fon', 'dyu', 'bam', 'man', 'wol', 'ful']
    },
    additionalLanguages: [{
      type: String,
      enum: ['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ja', 'ko', 'zh', 'ar', 'hi', 'mr', 'te', 'ml', 'ur', 'pa', 'bn', 'gu', 'or', 'as', 'am', 'sw', 'zu', 'af', 'xh', 'yo', 'ig', 'ha', 'so', 'rw', 'lg', 'ak', 'tw', 'ee', 'fon', 'dyu', 'bam', 'man', 'wol', 'ful']
    }]
  },

  // App Settings
  settings: {
    theme: {
      type: String,
      enum: ['light', 'dark', 'ocean', 'sunset'],
      default: 'light'
    },
    autoTranslate: {
      type: Boolean,
      default: true
    },
    autoPlay: {
      type: Boolean,
      default: true
    },
    notifications: {
      type: Boolean,
      default: true
    },
    languageDetection: {
      type: Boolean,
      default: true
    }
  },

  // Usage Statistics
  usageStats: {
    totalTranslations: {
      type: Number,
      default: 0
    },
    voiceTranslations: {
      type: Number,
      default: 0
    },
    textTranslations: {
      type: Number,
      default: 0
    },
    imageTranslations: {
      type: Number,
      default: 0
    },
    documentTranslations: {
      type: Number,
      default: 0
    },
    voiceCallMinutes: {
      type: Number,
      default: 0
    },
    lastActive: {
      type: Date,
      default: Date.now
    }
  },

  // Subscription & Limits
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'basic', 'premium', 'enterprise'],
      default: 'free'
    },
    startDate: {
      type: Date,
      default: Date.now
    },
    endDate: {
      type: Date
    },
    monthlyLimit: {
      type: Number,
      default: 1000 // Free tier: 1000 translations per month
    },
    usedThisMonth: {
      type: Number,
      default: 0
    }
  },

  // Security & Verification
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: Date,

  // Social Login
  socialLogin: {
    google: {
      id: String,
      email: String
    },
    facebook: {
      id: String,
      email: String
    },
    github: {
      id: String,
      email: String
    }
  },

  // API Keys (for premium users)
  apiKeys: [{
    name: String,
    key: String,
    permissions: [String],
    createdAt: {
      type: Date,
      default: Date.now
    },
    lastUsed: Date,
    isActive: {
      type: Boolean,
      default: true
    }
  }],

  // Device Management
  devices: [{
    deviceId: String,
    deviceName: String,
    deviceType: {
      type: String,
      enum: ['web', 'android', 'ios', 'desktop']
    },
    lastLogin: {
      type: Date,
      default: Date.now
    },
    isActive: {
      type: Boolean,
      default: true
    }
  }],

  // Privacy & GDPR
  privacySettings: {
    dataCollection: {
      type: Boolean,
      default: true
    },
    analytics: {
      type: Boolean,
      default: true
    },
    marketing: {
      type: Boolean,
      default: false
    },
    dataRetention: {
      type: Number,
      default: 365 // Days
    }
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
  toJSON: { virtuals: true }, // Include virtuals when converting to JSON
  toObject: { virtuals: true }
});

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  if (this.firstName && this.lastName) {
    return `${this.firstName} ${this.lastName}`;
  }
  return this.username;
});

// Virtual for isLocked
userSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Virtual for remaining translations this month
userSchema.virtual('remainingTranslations').get(function() {
  return Math.max(0, this.subscription.monthlyLimit - this.subscription.usedThisMonth);
});

// Indexes for better query performance
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ 'subscription.plan': 1 });
userSchema.index({ 'usageStats.lastActive': 1 });
userSchema.index({ createdAt: 1 });

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  try {
    // Hash password with cost of 12
    const hashedPassword = await bcrypt.hash(this.password, 12);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

// Pre-save middleware to update lastActive
userSchema.pre('save', function(next) {
  if (this.isModified('usageStats.lastActive')) {
    this.usageStats.lastActive = new Date();
  }
  next();
});

// Instance method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

// Instance method to increment usage
userSchema.methods.incrementUsage = function(type, amount = 1) {
  this.usageStats.totalTranslations += amount;
  this.usageStats.lastActive = new Date();
  
  if (type && this.usageStats[`${type}Translations`] !== undefined) {
    this.usageStats[`${type}Translations`] += amount;
  }
  
  // Increment monthly usage
  this.subscription.usedThisMonth += amount;
  
  return this.save();
};

// Instance method to check if user can make translation
userSchema.methods.canTranslate = function() {
  if (this.subscription.plan === 'free') {
    return this.subscription.usedThisMonth < this.subscription.monthlyLimit;
  }
  return true; // Premium users have unlimited translations
};

// Instance method to reset monthly usage
userSchema.methods.resetMonthlyUsage = function() {
  this.subscription.usedThisMonth = 0;
  return this.save();
};

// Static method to find users by subscription plan
userSchema.statics.findBySubscriptionPlan = function(plan) {
  return this.find({ 'subscription.plan': plan });
};

// Static method to find active users
userSchema.statics.findActiveUsers = function(days = 30) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  return this.find({
    'usageStats.lastActive': { $gte: cutoffDate }
  });
};

// Static method to get usage statistics
userSchema.statics.getUsageStats = async function() {
  return await this.aggregate([
    {
      $group: {
        _id: null,
        totalUsers: { $sum: 1 },
        totalTranslations: { $sum: '$usageStats.totalTranslations' },
        avgTranslationsPerUser: { $avg: '$usageStats.totalTranslations' },
        activeUsers: {
          $sum: {
            $cond: [
              { $gte: ['$usageStats.lastActive', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)] },
              1,
              0
            ]
          }
        }
      }
    }
  ]);
};

module.exports = mongoose.model('User', userSchema);
