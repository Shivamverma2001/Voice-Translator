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
countryCodeSchema.index({ isActive: 1 });

// Virtual for formatted display
countryCodeSchema.virtual('displayName').get(function() {
  return `${this.country} (${this.countryCode})`;
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

// Static method to search country codes
countryCodeSchema.statics.searchCountryCodes = function(query) {
  const searchRegex = new RegExp(query, 'i');
  return this.find({
    $or: [
      { country: searchRegex },
      { countryCode: searchRegex }
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
