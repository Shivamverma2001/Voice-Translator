const mongoose = require('mongoose');

const countrySchema = new mongoose.Schema({
  countryCode: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 3,
    unique: true,
    uppercase: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  collection: 'countries'
});

// Indexes for better query performance
countrySchema.index({ countryCode: 1 });
countrySchema.index({ name: 1 });
countrySchema.index({ isActive: 1 });

// Virtual for formatted display
countrySchema.virtual('displayName').get(function() {
  return this.name;
});

// Instance method to toggle active status
countrySchema.methods.toggleActive = function() {
  this.isActive = !this.isActive;
  return this.save();
};

// Static method to get all active countries
countrySchema.statics.getActiveCountries = function() {
  return this.find({ isActive: true }).sort({ name: 1 });
};

// Static method to get country by country code
countrySchema.statics.getByCountryCode = function(countryCode) {
  return this.findOne({ countryCode: countryCode.toUpperCase() });
};

// Static method to get country by name
countrySchema.statics.getByName = function(name) {
  return this.findOne({ name });
};

// Static method to search countries
countrySchema.statics.searchCountries = function(query) {
  const searchRegex = new RegExp(query, 'i');
  return this.find({
    $or: [
      { name: searchRegex },
      { countryCode: searchRegex }
    ],
    isActive: true
  }).sort({ name: 1 });
};

module.exports = mongoose.model('Country', countrySchema);
