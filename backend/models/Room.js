const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 50
  },
  creator: {
    userId: {
      type: String,
      required: true,
      trim: true
    },
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50
    },
    userLanguage: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 10
    },
    targetLanguage: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 10
    }
  },
  participants: [{
    userId: {
      type: String,
      required: true,
      trim: true
    },
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50
    },
    userLanguage: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 10
    },
    targetLanguage: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 10
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    isActive: {
      type: Boolean,
      default: true
    }
  }],
  status: {
    type: String,
    enum: ['active', 'ended', 'paused'],
    default: 'active'
  },
  settings: {
    maxParticipants: {
      type: Number,
      default: 10,
      min: 2,
      max: 50
    },
    allowJoinAfterStart: {
      type: Boolean,
      default: true
    },
    autoRecord: {
      type: Boolean,
      default: false
    },
    translationEnabled: {
      type: Boolean,
      default: true
    }
  },
  metadata: {
    callDuration: {
      type: Number,
      default: 0 // in seconds
    },
    totalMessages: {
      type: Number,
      default: 0
    },
    totalTranslations: {
      type: Number,
      default: 0
    },
    startTime: {
      type: Date,
      default: Date.now
    },
    endTime: {
      type: Date
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  collection: 'rooms'
});

// Indexes for better query performance
roomSchema.index({ roomId: 1 });
roomSchema.index({ 'creator.userId': 1 });
roomSchema.index({ 'participants.userId': 1 });
roomSchema.index({ status: 1 });
roomSchema.index({ isActive: 1 });
roomSchema.index({ createdAt: 1 });

// Virtual for current participant count
roomSchema.virtual('participantCount').get(function() {
  return this.participants.filter(p => p.isActive).length;
});

// Virtual for room age
roomSchema.virtual('roomAge').get(function() {
  return Date.now() - this.createdAt;
});

// Instance method to add participant
roomSchema.methods.addParticipant = function(participantData) {
  const existingIndex = this.participants.findIndex(p => p.userId === participantData.userId);
  
  if (existingIndex >= 0) {
    // Update existing participant
    this.participants[existingIndex] = {
      ...this.participants[existingIndex],
      ...participantData,
      joinedAt: new Date(),
      isActive: true
    };
  } else {
    // Add new participant
    this.participants.push({
      ...participantData,
      joinedAt: new Date(),
      isActive: true
    });
  }
  
  return this.save();
};

// Instance method to remove participant
roomSchema.methods.removeParticipant = function(userId) {
  const participantIndex = this.participants.findIndex(p => p.userId === userId);
  
  if (participantIndex >= 0) {
    this.participants[participantIndex].isActive = false;
    this.participants[participantIndex].leftAt = new Date();
  }
  
  return this.save();
};

// Instance method to end room
roomSchema.methods.endRoom = function() {
  this.status = 'ended';
  this.isActive = false;
  this.metadata.endTime = new Date();
  this.metadata.callDuration = Math.floor((this.metadata.endTime - this.metadata.startTime) / 1000);
  
  // Mark all participants as inactive
  this.participants.forEach(participant => {
    participant.isActive = false;
    if (!participant.leftAt) {
      participant.leftAt = new Date();
    }
  });
  
  return this.save();
};

// Instance method to pause room
roomSchema.methods.pauseRoom = function() {
  this.status = 'paused';
  return this.save();
};

// Instance method to resume room
roomSchema.methods.resumeRoom = function() {
  this.status = 'active';
  return this.save();
};

// Static method to get active rooms
roomSchema.statics.getActiveRooms = function() {
  return this.find({ isActive: true, status: 'active' }).sort({ createdAt: -1 });
};

// Static method to get room by ID
roomSchema.statics.getByRoomId = function(roomId) {
  return this.findOne({ roomId, isActive: true });
};

// Static method to get rooms by creator
roomSchema.statics.getByCreator = function(userId) {
  return this.find({ 'creator.userId': userId, isActive: true }).sort({ createdAt: -1 });
};

// Static method to get rooms by participant
roomSchema.statics.getByParticipant = function(userId) {
  return this.find({ 
    'participants.userId': userId, 
    isActive: true 
  }).sort({ createdAt: -1 });
};

// Static method to search rooms
roomSchema.statics.searchRooms = function(query) {
  const searchRegex = new RegExp(query, 'i');
  return this.find({
    $or: [
      { roomId: searchRegex },
      { 'creator.username': searchRegex },
      { 'participants.username': searchRegex }
    ],
    isActive: true
  }).sort({ createdAt: -1 });
};

// Static method to get room statistics
roomSchema.statics.getRoomStats = function() {
  return this.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: null,
        totalRooms: { $sum: 1 },
        activeRooms: { $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] } },
        endedRooms: { $sum: { $cond: [{ $eq: ['$status', 'ended'] }, 1, 0] } },
        totalParticipants: { $sum: { $size: '$participants' } },
        avgCallDuration: { $avg: '$metadata.callDuration' }
      }
    }
  ]);
};

// Pre-save middleware to validate room settings
roomSchema.pre('save', function(next) {
  // Ensure roomId is unique and valid
  if (this.isModified('roomId')) {
    const roomIdRegex = /^[a-zA-Z0-9_-]{3,50}$/;
    if (!roomIdRegex.test(this.roomId)) {
      return next(new Error('Room ID must be 3-50 characters and contain only letters, numbers, hyphens, and underscores'));
    }
  }
  
  // Validate participant count
  if (this.participants.length > this.settings.maxParticipants) {
    return next(new Error(`Room cannot have more than ${this.settings.maxParticipants} participants`));
  }
  
  next();
});

module.exports = mongoose.model('Room', roomSchema);
