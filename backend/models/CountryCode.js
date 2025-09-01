const mongoose = require('mongoose');

const countryCodeSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  countryCode: {
    type: String,
    required: true,
    trim: true,
    uppercase: true,
    minlength: 2,
    maxlength: 3,
    unique: true
  },
  dialingCode: {
    type: String,
    required: true,
    trim: true,
    match: [/^\+[1-9]\d{0,3}$/, 'Please enter a valid international dialing code (e.g., +1, +91, +44)']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  collection: 'country_codes'
});

// Indexes for better query performance
countryCodeSchema.index({ country: 1 });
countryCodeSchema.index({ countryCode: 1 });
countryCodeSchema.index({ dialingCode: 1 });
countryCodeSchema.index({ isActive: 1 });
// Compound index to ensure uniqueness of countryCode + dialingCode combination
countryCodeSchema.index({ countryCode: 1, dialingCode: 1 }, { unique: true });

// Virtual for formatted display
countryCodeSchema.virtual('displayName').get(function() {
  return `${this.country} (${this.dialingCode})`;
});

// Instance method to toggle active status
countryCodeSchema.methods.toggleActive = function() {
  this.isActive = !this.isActive;
  return this.save();
};

// Static method to get all active country codes
countryCodeSchema.statics.getActiveCountryCodes = function() {
  return this.find({ isActive: true }).sort({ country: 1 });
};

// Static method to get country code by country
countryCodeSchema.statics.getByCountry = function(country) {
  return this.findOne({ country });
};

// Static method to get country code by country code
countryCodeSchema.statics.getByCountryCode = function(countryCode) {
  return this.findOne({ countryCode: countryCode.toUpperCase() });
};

// Static method to get country codes by dialing code (returns all countries with same dialing code)
countryCodeSchema.statics.getByDialingCode = function(dialingCode) {
  return this.find({ dialingCode: dialingCode, isActive: true });
};

// Static method to get a single country code by dialing code and country code
countryCodeSchema.statics.getByDialingCodeAndCountry = function(dialingCode, countryCode) {
  return this.findOne({ dialingCode: dialingCode, countryCode: countryCode.toUpperCase() });
};

// Static method to search country codes
countryCodeSchema.statics.searchCountryCodes = function(query) {
  const searchRegex = new RegExp(query, 'i');
  return this.find({
    $or: [
      { country: searchRegex },
      { countryCode: searchRegex },
      { dialingCode: searchRegex }
    ],
    isActive: true
  }).sort({ country: 1 });
};

// Pre-save middleware to ensure country code is uppercase
countryCodeSchema.pre('save', function(next) {
  if (this.isModified('countryCode')) {
    this.countryCode = this.countryCode.toUpperCase();
  }
  next();
});

module.exports = mongoose.model('CountryCode', countryCodeSchema);
