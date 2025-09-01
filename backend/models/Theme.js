const mongoose = require('mongoose');

const themeSchema = new mongoose.Schema({
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
    maxlength: 100
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
  icon: {
    type: String,
    required: true,
    trim: true,
    maxlength: 10
  },
  category: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  colors: {
    background: { type: String, required: true },
    backgroundAlt: { type: String, required: true },
    card: { type: String, required: true },
    cardHover: { type: String, required: true },
    text: { type: String, required: true },
    textSecondary: { type: String, required: true },
    textMuted: { type: String, required: true },
    border: { type: String, required: true },
    borderHover: { type: String, required: true },
    primary: { type: String, required: true },
    primaryHover: { type: String, required: true },
    primaryText: { type: String, required: true },
    secondary: { type: String, required: true },
    secondaryHover: { type: String, required: true },
    secondaryText: { type: String, required: true },
    accent: { type: String, required: true },
    accentHover: { type: String, required: true },
    accentText: { type: String, required: true },
    success: { type: String, required: true },
    successText: { type: String, required: true },
    error: { type: String, required: true },
    errorText: { type: String, required: true },
    warning: { type: String, required: true },
    warningText: { type: String, required: true },
    input: { type: String, required: true },
    sidebar: { type: String, required: true },
    header: { type: String, required: true },
    shadow: { type: String, required: true },
    shadowHover: { type: String, required: true },
    shadowLarge: { type: String, required: true },
    selected: { type: String, required: true },
    hover: { type: String, required: true }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  collection: 'themes'
});

// Indexes for better query performance
themeSchema.index({ id: 1 });
themeSchema.index({ name: 1 });
themeSchema.index({ category: 1 });
themeSchema.index({ isActive: 1 });

// Virtual for formatted display
themeSchema.virtual('formattedDisplay').get(function() {
  return `${this.icon} ${this.displayName}`;
});

// Virtual for category display
themeSchema.virtual('categoryDisplay').get(function() {
  return `${this.category} Theme`;
});

// Static method to get all active themes
themeSchema.statics.getActiveThemes = function() {
  return this.find({ isActive: true }).sort({ category: 1, name: 1 });
};

// Static method to get theme by id
themeSchema.statics.getById = function(id) {
  return this.findOne({ id: id.toLowerCase() });
};

// Static method to get themes by category
themeSchema.statics.getByCategory = function(category) {
  return this.find({ 
    category: { $regex: new RegExp(`^${category}$`, 'i') },
    isActive: true 
  }).sort({ name: 1 });
};

// Static method to get default theme (light)
themeSchema.statics.getDefaultTheme = function() {
  return this.findOne({ id: 'light' });
};

// Static method to search themes
themeSchema.statics.searchThemes = function(query) {
  const searchRegex = new RegExp(query, 'i');
  return this.find({
    $or: [
      { name: searchRegex },
      { displayName: searchRegex },
      { description: searchRegex },
      { category: searchRegex }
    ],
    isActive: true
  }).sort({ category: 1, name: 1 });
};

// Static method to get unique categories
themeSchema.statics.getUniqueCategories = function() {
  return this.distinct('category', { isActive: true }).sort();
};

// Static method to get theme colors for frontend
themeSchema.statics.getThemeColors = function(themeId) {
  return this.findOne({ id: themeId.toLowerCase() }, { colors: 1, displayName: 1 });
};

module.exports = mongoose.model('Theme', themeSchema);
