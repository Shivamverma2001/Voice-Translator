const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Firebase Integration
  firebaseUid: {
    type: String,
    unique: true,
    sparse: true, // Allow null values for non-Firebase users
    trim: true
  },
  isFirebaseUser: {
    type: Boolean,
    default: false
  },
  
  // Basic Information
  username: {
    type: String,
    required: function() {
      // Username is required only for non-Firebase users
      return !this.isFirebaseUser;
    },
    unique: true,
    sparse: true, // Allow null values for Firebase users
    trim: true,
    minlength: [3, 'Username must be at least 3 characters long'],
    maxlength: [30, 'Username cannot exceed 30 characters'],
    match: [/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens']
  },
  email: {
    type: String,
    required: function() {
      // Email is required for all users (both Firebase and non-Firebase)
      return true;
    },
    unique: true,
    sparse: true, // Allow null values temporarily during creation
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
  },
  password: {
    type: String,
    required: function() {
      // Password is required only for non-Firebase users
      return !this.isFirebaseUser;
    },
    minlength: [8, 'Password must be at least 8 characters long'],
    select: false // Don't include password in queries by default
  },
  firstName: {
    type: String,
    required: function() {
      // First name is required for Firebase users
      return this.isFirebaseUser;
    },
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: function() {
      // Last name is required for Firebase users
      return this.isFirebaseUser;
    },
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  age: {
    type: Number,
    min: [13, 'Age must be at least 13'],
    max: [120, 'Age cannot exceed 120']
  },
  phoneNumber: {
    type: String,
    trim: true,
    required: false, // Make phone number optional
    match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number']
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'prefer-not-to-say'],
    default: 'prefer-not-to-say'
  },
  avatar: {
    type: String,
    default: null
  },
  // Role & Status
  role: {
    type: String,
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  // Location Information
  address: {
    street: String,
    city: String,
    postalCode: String
  },
  country: {
    type: String,
    trim: true
  },
  countryCode: {
    type: String,
    trim: true,
    uppercase: true,
    maxlength: [3, 'Country code cannot exceed 3 characters']
  },
  state: {
    type: String,
    trim: true
  },
  // Language Preference (simple - from master data)
  preferredLanguage: {
    type: String,
    default: 'en',
    trim: true
  },
  // Voice Preference (simple string)
  recommendedVoice: {
    type: String,
    default: 'en-US-Standard-A',
    trim: true
  },
  // App Settings (simplified)
  settings: {
    theme: {
      type: String,
      default: 'light'
    }
  },
  // Security & Verification
  passwordResetToken: String,
  passwordResetExpires: Date,

  // Simple social login (optional)
  socialLogin: {
    google: String,
    facebook: String
  },
  
  // Firebase Integration Metadata
  firebaseMetadata: {
    lastSync: Date,
    firebaseData: {
      uid: String,
      emailVerified: Boolean,
      displayName: String,
      photoURL: String,
      providerData: [{
        providerId: String,
        uid: String,
        displayName: String,
        email: String,
        photoURL: String
      }]
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

// Virtual for location
userSchema.virtual('fullLocation').get(function() {
  const parts = [];
  if (this.address?.city) parts.push(this.address.city);
  if (this.state) parts.push(this.state);
  if (this.country) parts.push(this.country);
  if (this.countryCode) parts.push(`(${this.countryCode})`);
  return parts.length > 0 ? parts.join(', ') : 'Location not specified';
});

// Virtual for isLocked
userSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Indexes for better query performance (only for fields without unique: true)
userSchema.index({ phoneNumber: 1 });
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });
userSchema.index({ createdAt: 1 });

// Pre-save middleware to handle Firebase users
userSchema.pre('save', async function(next) {
  try {
    console.log('💾 User model pre-save middleware:', {
      isNew: this.isNew,
      isModified: this.modifiedPaths(),
      isFirebaseUser: this.isFirebaseUser,
      email: this.email,
      firebaseUid: this.firebaseUid,
      timestamp: new Date().toISOString()
    });

    // For Firebase users, ensure password is null
    if (this.isFirebaseUser) {
      this.password = null;
      console.log('🔐 Firebase user: password set to null');
    } else {
      // Only hash the password if it has been modified (or is new) for non-Firebase users
      if (!this.isModified('password')) {
        console.log('🔐 Non-Firebase user: password not modified, skipping hash');
        return next();
      }

      try {
        // Hash password with cost of 12
        const hashedPassword = await bcrypt.hash(this.password, 12);
        this.password = hashedPassword;
        console.log('🔐 Non-Firebase user: password hashed successfully');
        next();
      } catch (error) {
        console.error('❌ Password hashing error:', error);
        next(error);
      }
    }
    
    next();
  } catch (error) {
    console.error('❌ User model pre-save middleware error:', error);
    next(error);
  }
});



// Post-save middleware to log successful saves
userSchema.post('save', function(doc, next) {
  try {
    console.log('✅ User saved successfully:', {
      userId: doc._id,
      email: doc.email,
      firebaseUid: doc.firebaseUid,
      isFirebaseUser: doc.isFirebaseUser,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      timestamp: new Date().toISOString()
    });
    next();
  } catch (error) {
    console.error('❌ User post-save middleware error:', error);
    next(error);
  }
});

// Post-save middleware to log validation errors
userSchema.post('save', function(error, doc, next) {
  if (error) {
    console.error('❌ User save validation error:', {
      errorName: error.name,
      errorMessage: error.message,
      errorCode: error.code,
      errorErrors: error.errors,
      timestamp: new Date().toISOString()
    });
  }
  next(error);
});

// Instance method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    console.error('❌ Password comparison error:', error);
    throw new Error('Password comparison failed');
  }
};





module.exports = mongoose.model('User', userSchema);
