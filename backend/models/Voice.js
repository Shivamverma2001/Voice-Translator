const mongoose = require('mongoose');

const voiceSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  displayName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  language: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  country: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  gender: {
    type: String,
    required: true,
    enum: ['Male', 'Female'],
    trim: true
  },
  accent: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  collection: 'voices'
});

// Indexes for better query performance
voiceSchema.index({ id: 1 });
voiceSchema.index({ language: 1 });
voiceSchema.index({ country: 1 });
voiceSchema.index({ gender: 1 });
voiceSchema.index({ accent: 1 });
voiceSchema.index({ isActive: 1 });
// Compound indexes for common queries
voiceSchema.index({ language: 1, country: 1 });
voiceSchema.index({ language: 1, gender: 1 });
voiceSchema.index({ language: 1, isActive: 1 });

// Virtual for formatted display
voiceSchema.virtual('formattedDisplay').get(function() {
  return `${this.displayName} (${this.accent})`;
});

// Virtual for language-country combination
voiceSchema.virtual('languageCountry').get(function() {
  return `${this.language} - ${this.country}`;
});

// Static method to get all active voices
voiceSchema.statics.getActiveVoices = function() {
  return this.find({ isActive: true }).sort({ language: 1, country: 1, gender: 1 });
};

// Static method to get voice by id
voiceSchema.statics.getById = function(id) {
  return this.findOne({ id: id });
};

// Static method to get voices by language
voiceSchema.statics.getByLanguage = function(language) {
  return this.find({ 
    language: { $regex: new RegExp(`^${language}$`, 'i') },
    isActive: true 
  }).sort({ country: 1, gender: 1 });
};

// Static method to get voices by country
voiceSchema.statics.getByCountry = function(country) {
  return this.find({ 
    country: { $regex: new RegExp(country, 'i') },
    isActive: true 
  }).sort({ language: 1, gender: 1 });
};

// Static method to get voices by gender
voiceSchema.statics.getByGender = function(gender) {
  return this.find({ 
    gender: { $regex: new RegExp(`^${gender}$`, 'i') },
    isActive: true 
  }).sort({ language: 1, country: 1 });
};

// Static method to get voices by language and gender
voiceSchema.statics.getByLanguageAndGender = function(language, gender) {
  return this.find({ 
    language: { $regex: new RegExp(`^${language}$`, 'i') },
    gender: { $regex: new RegExp(`^${gender}$`, 'i') },
    isActive: true 
  }).sort({ country: 1 });
};

// Static method to search voices
voiceSchema.statics.searchVoices = function(query) {
  const searchRegex = new RegExp(query, 'i');
  return this.find({
    $or: [
      { name: searchRegex },
      { displayName: searchRegex },
      { language: searchRegex },
      { country: searchRegex },
      { accent: searchRegex },
      { description: searchRegex }
    ],
    isActive: true
  }).sort({ language: 1, country: 1, gender: 1 });
};

// Static method to get unique languages
voiceSchema.statics.getUniqueLanguages = function() {
  return this.distinct('language', { isActive: true }).sort();
};

// Static method to get unique countries
voiceSchema.statics.getUniqueCountries = function() {
  return this.distinct('country', { isActive: true }).sort();
};

module.exports = mongoose.model('Voice', voiceSchema);
