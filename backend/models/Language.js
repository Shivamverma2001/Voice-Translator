const mongoose = require('mongoose');

const languageSchema = new mongoose.Schema({
  shortcode: {
    type: String,
    required: true,
    trim: true,
    uppercase: false,
    minlength: 2,
    maxlength: 5
  },
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50
  },
  country: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
  collection: 'languages' // Use languages collection (flat structure)
});

// Indexes for better query performance
languageSchema.index({ shortcode: 1 });
languageSchema.index({ isActive: 1 });
languageSchema.index({ name: 1 });
languageSchema.index({ country: 1 });

// Virtual for formatted display
languageSchema.virtual('displayName').get(function() {
  return `${this.name} (${this.country})`;
});

// Instance method to toggle active status
languageSchema.methods.toggleActive = function() {
  this.isActive = !this.isActive;
  return this.save();
};

// Static method to get all active languages
languageSchema.statics.getActiveLanguages = function() {
  return this.find({ isActive: true }).sort({ name: 1 });
};

// Static method to get language by shortcode
languageSchema.statics.getByShortcode = function(shortcode) {
  return this.findOne({ shortcode: shortcode.toUpperCase() });
};

// Static method to get languages by country
languageSchema.statics.getByCountry = function(country) {
  return this.find({ country, isActive: true }).sort({ name: 1 });
};

// Static method to search languages
languageSchema.statics.searchLanguages = function(query) {
  const searchRegex = new RegExp(query, 'i');
  return this.find({
    $or: [
      { name: searchRegex },
      { country: searchRegex },
      { shortcode: searchRegex }
    ],
    isActive: true
  }).sort({ name: 1 });
};

// Pre-save middleware to ensure shortcode is uppercase
languageSchema.pre('save', function(next) {
  if (this.isModified('shortcode')) {
    this.shortcode = this.shortcode.toUpperCase();
  }
  next();
});

// Pre-save middleware to validate shortcode format
languageSchema.pre('save', function(next) {
  const shortcodeRegex = /^[A-Z]{2,5}$/;
  if (!shortcodeRegex.test(this.shortcode)) {
    return next(new Error('Shortcode must be 2-5 uppercase letters'));
  }
  next();
});

module.exports = mongoose.model('Language', languageSchema); 
