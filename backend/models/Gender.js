const mongoose = require('mongoose');

const genderSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  displayName: {
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
  collection: 'genders'
});

// Indexes for better query performance
genderSchema.index({ id: 1 });
genderSchema.index({ name: 1 });
genderSchema.index({ isActive: 1 });

// Virtual for formatted display
genderSchema.virtual('formattedDisplay').get(function() {
  return `${this.displayName}`;
});

// Static method to get all active genders
genderSchema.statics.getActiveGenders = function() {
  return this.find({ isActive: true }).sort({ name: 1 });
};

// Static method to get gender by id
genderSchema.statics.getById = function(id) {
  return this.findOne({ id: id.toLowerCase() });
};

// Static method to get gender by name
genderSchema.statics.getByName = function(name) {
  return this.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
};

// Static method to search genders
genderSchema.statics.searchGenders = function(query) {
  const searchRegex = new RegExp(query, 'i');
  return this.find({
    $or: [
      { name: searchRegex },
      { displayName: searchRegex },
      { description: searchRegex }
    ],
    isActive: true
  }).sort({ name: 1 });
};

module.exports = mongoose.model('Gender', genderSchema);
