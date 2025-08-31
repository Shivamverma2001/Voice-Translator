const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { getLanguageByCode } = require('../master/languages');
const { updateFirebaseUserProfile, disableFirebaseUser } = require('../config/firebase');

class UserService {
  // User Registration
  async registerUser(userData) {
    try {
      // Check if user already exists
      const existingUser = await User.findOne({
        $or: [{ email: userData.email }, { username: userData.username }]
      });

      if (existingUser) {
        if (existingUser.email === userData.email) {
          throw new Error('Email already registered');
        }
        if (existingUser.username === userData.username) {
          throw new Error('Username already taken');
        }
      }

      // Create new user
      const user = new User({
        username: userData.username,
        email: userData.email,
        password: userData.password,
        firstName: userData.firstName,
        lastName: userData.lastName,
        preferredLanguages: {
          sourceLanguage: userData.sourceLanguage || 'en',
          targetLanguage: userData.targetLanguage || 'es'
        }
      });

      await user.save();

      // Generate JWT token
      const token = this.generateToken(user._id);

      // Return user data without password
      const userResponse = user.toObject();
      delete userResponse.password;

      return {
        user: userResponse,
        token,
        message: 'User registered successfully'
      };
    } catch (error) {
      throw new Error(`Registration failed: ${error.message}`);
    }
  }

  // User Login
  async loginUser(email, password) {
    try {
      // Find user by email and include password for comparison
      const user = await User.findOne({ email }).select('+password');

      if (!user) {
        throw new Error('Invalid email or password');
      }

      // Check if account is locked
      if (user.isLocked) {
        throw new Error('Account is temporarily locked. Please try again later.');
      }

      // Verify password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        // Increment login attempts
        user.loginAttempts += 1;
        
        // Lock account after 5 failed attempts
        if (user.loginAttempts >= 5) {
          user.lockUntil = new Date(Date.now() + 30 * 60 * 1000); // Lock for 30 minutes
        }
        
        await user.save();
        throw new Error('Invalid email or password');
      }

      // Reset login attempts on successful login
      user.loginAttempts = 0;
      user.lockUntil = undefined;
      user.usageStats.lastActive = new Date();
      await user.save();

      // Generate JWT token
      const token = this.generateToken(user._id);

      // Return user data without password
      const userResponse = user.toObject();
      delete userResponse.password;

      return {
        user: userResponse,
        token,
        message: 'Login successful'
      };
    } catch (error) {
      throw new Error(`Login failed: ${error.message}`);
    }
  }

  // Generate JWT Token
  generateToken(userId) {
    return jwt.sign(
      { userId },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );
  }

  // Get User Profile
  async getUserProfile(userId) {
    try {
      const user = await User.findById(userId).select('-password');
      
      if (!user) {
        throw new Error('User not found');
      }

      return user;
    } catch (error) {
      throw new Error(`Failed to get user profile: ${error.message}`);
    }
  }

  // Get User Profile by Firebase UID
  async getUserByFirebaseUid(firebaseUid) {
    try {
      const user = await User.findOne({ firebaseUid }).select('-password');
      
      if (!user) {
        throw new Error('User not found');
      }

      return user;
    } catch (error) {
      throw new Error(`Failed to get user profile: ${error.message}`);
    }
  }

  // Update User Profile by Firebase UID
  async updateUserProfileByFirebaseUid(firebaseUid, updateData) {
    try {
      const user = await User.findOne({ firebaseUid });
      
      if (!user) {
        throw new Error('User not found');
      }

      // Update allowed fields
      const allowedFields = [
        'firstName', 'lastName', 'age', 'phoneNumber', 'country', 'state',
        'preferredLanguage', 'recommendedVoice', 'avatar', 'preferredLanguages', 
        'settings', 'privacySettings'
      ];

      allowedFields.forEach(field => {
        if (updateData[field] !== undefined) {
          user[field] = updateData[field];
        }
      });

      // Handle theme update specifically (store in settings.theme)
      if (updateData.theme !== undefined) {
        if (!user.settings) {
          user.settings = {};
        }
        user.settings.theme = updateData.theme;
      }

      // Save MongoDB changes first
      await user.save();

      // Update Firebase user profile
      try {
        const firebaseUpdateResult = await updateFirebaseUserProfile(firebaseUid, updateData);
        console.log('✅ Firebase user profile updated successfully');
        
        // Update firebaseMetadata in MongoDB to reflect the changes
        if (firebaseUpdateResult) {
          user.firebaseMetadata.lastSync = new Date();
          
          // Update displayName in firebaseData if it was changed
          if (updateData.firstName !== undefined || updateData.lastName !== undefined) {
            user.firebaseMetadata.firebaseData.displayName = `${updateData.firstName || ''} ${updateData.lastName || ''}`.trim();
          }
          
          // Save the updated firebaseMetadata
          await user.save();
          console.log('✅ Firebase metadata updated in MongoDB');
        }
      } catch (firebaseError) {
        console.error('⚠️ Firebase update failed, but MongoDB was updated:', firebaseError.message);
        // Continue with the response even if Firebase update fails
      }

      // Return updated user without password
      const userResponse = user.toObject();
      delete userResponse.password;

      return userResponse;
    } catch (error) {
      throw new Error(`Failed to update profile: ${error.message}`);
    }
  }

  // Update User Profile
  async updateUserProfile(userId, updateData) {
    try {
      const user = await User.findById(userId);
      
      if (!user) {
        throw new Error('User not found');
      }

      // Update allowed fields
      const allowedFields = [
        'firstName', 'lastName', 'avatar', 'preferredLanguages', 
        'settings', 'privacySettings'
      ];

      allowedFields.forEach(field => {
        if (updateData[field] !== undefined) {
          user[field] = updateData[field];
        }
      });

      await user.save();

      // Return updated user without password
      const userResponse = user.toObject();
      delete userResponse.password;

      return userResponse;
    } catch (error) {
      throw new Error(`Failed to update profile: ${error.message}`);
    }
  }

  // Change Password
  async changePassword(userId, currentPassword, newPassword) {
    try {
      const user = await User.findById(userId).select('+password');
      
      if (!user) {
        throw new Error('User not found');
      }

      // Verify current password
      const isCurrentPasswordValid = await user.comparePassword(currentPassword);
      if (!isCurrentPasswordValid) {
        throw new Error('Current password is incorrect');
      }

      // Update password
      user.password = newPassword;
      await user.save();

      return { message: 'Password changed successfully' };
    } catch (error) {
      throw new Error(`Failed to change password: ${error.message}`);
    }
  }

  // Request Password Reset
  async requestPasswordReset(email) {
    try {
      const user = await User.findOne({ email });
      
      if (!user) {
        // Don't reveal if email exists or not
        return { message: 'If the email exists, a password reset link has been sent' };
      }

      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      user.passwordResetToken = resetToken;
      user.passwordResetExpires = resetTokenExpiry;
      await user.save();

      // TODO: Send email with reset link
      // For now, just return the token (in production, send via email)
      return {
        message: 'Password reset link sent to your email',
        resetToken: process.env.NODE_ENV === 'development' ? resetToken : undefined
      };
    } catch (error) {
      throw new Error(`Failed to request password reset: ${error.message}`);
    }
  }

  // Reset Password with Token
  async resetPassword(token, newPassword) {
    try {
      const user = await User.findOne({
        passwordResetToken: token,
        passwordResetExpires: { $gt: Date.now() }
      });

      if (!user) {
        throw new Error('Invalid or expired reset token');
      }

      // Update password and clear reset token
      user.password = newPassword;
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save();

      return { message: 'Password reset successfully' };
    } catch (error) {
      throw new Error(`Failed to reset password: ${error.message}`);
    }
  }

  // Verify Email
  async verifyEmail(token) {
    try {
      const user = await User.findOne({
        emailVerificationToken: token,
        emailVerificationExpires: { $gt: Date.now() }
      });

      if (!user) {
        throw new Error('Invalid or expired verification token');
      }

      user.isEmailVerified = true;
      user.emailVerificationToken = undefined;
      user.emailVerificationExpires = undefined;
      await user.save();

      return { message: 'Email verified successfully' };
    } catch (error) {
      throw new Error(`Failed to verify email: ${error.message}`);
    }
  }

  // Request Email Verification
  async requestEmailVerification(userId) {
    try {
      const user = await User.findById(userId);
      
      if (!user) {
        throw new Error('User not found');
      }

      if (user.isEmailVerified) {
        throw new Error('Email is already verified');
      }

      // Generate verification token
      const verificationToken = crypto.randomBytes(32).toString('hex');
      const verificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      user.emailVerificationToken = verificationToken;
      user.emailVerificationExpires = verificationExpiry;
      await user.save();

      // TODO: Send email with verification link
      return {
        message: 'Verification email sent',
        verificationToken: process.env.NODE_ENV === 'development' ? verificationToken : undefined
      };
    } catch (error) {
      throw new Error(`Failed to request email verification: ${error.message}`);
    }
  }

  // Update Language Preferences
  async updateLanguagePreferences(userId, sourceLanguage, targetLanguage) {
    try {
      const user = await User.findById(userId);
      
      if (!user) {
        throw new Error('User not found');
      }

      // Validate languages
      if (!getLanguageByCode(sourceLanguage) || !getLanguageByCode(targetLanguage)) {
        throw new Error('Invalid language code');
      }

      if (sourceLanguage === targetLanguage) {
        throw new Error('Source and target languages must be different');
      }

      user.preferredLanguages.sourceLanguage = sourceLanguage;
      user.preferredLanguages.targetLanguage = targetLanguage;
      await user.save();

      return user.preferredLanguages;
    } catch (error) {
      throw new Error(`Failed to update language preferences: ${error.message}`);
    }
  }

  // Update App Settings
  async updateAppSettings(userId, settings) {
    try {
      const user = await User.findById(userId);
      
      if (!user) {
        throw new Error('User not found');
      }

      // Update allowed settings
      const allowedSettings = [
        'theme', 'autoTranslate', 'autoPlay', 'notifications', 'languageDetection'
      ];

      allowedSettings.forEach(setting => {
        if (settings[setting] !== undefined) {
          user.settings[setting] = settings[setting];
        }
      });

      await user.save();

      return user.settings;
    } catch (error) {
      throw new Error(`Failed to update app settings: ${error.message}`);
    }
  }

  // Update Privacy Settings
  async updatePrivacySettings(userId, privacySettings) {
    try {
      const user = await User.findById(userId);
      
      if (!user) {
        throw new Error('User not found');
      }

      // Update allowed privacy settings
      const allowedPrivacySettings = [
        'dataCollection', 'analytics', 'marketing', 'dataRetention'
      ];

      allowedPrivacySettings.forEach(setting => {
        if (privacySettings[setting] !== undefined) {
          user.settings[setting] = settings[setting];
        }
      });

      await user.save();

      return user.settings;
    } catch (error) {
      throw new Error(`Failed to update privacy settings: ${error.message}`);
    }
  }

  // Generate API Key
  async generateApiKey(userId, keyName, permissions = []) {
    try {
      const user = await User.findById(userId);
      
      if (!user) {
        throw new Error('User not found');
      }

      // Check if user has premium plan
      if (user.subscription.plan === 'free') {
        throw new Error('API keys require at least a basic subscription plan');
      }

      // Generate API key
      const apiKey = crypto.randomBytes(32).toString('hex');
      
      user.apiKeys.push({
        name: keyName,
        key: apiKey,
        permissions,
        createdAt: new Date(),
        isActive: true
      });

      await user.save();

      return {
        name: keyName,
        key: apiKey,
        permissions,
        createdAt: new Date()
      };
    } catch (error) {
      throw new Error(`Failed to generate API key: ${error.message}`);
    }
  }

  // Revoke API Key
  async revokeApiKey(userId, keyId) {
    try {
      const user = await User.findById(userId);
      
      if (!user) {
        throw new Error('API key not found');
      }

      const apiKey = user.apiKeys.id(keyId);
      if (!apiKey) {
        throw new Error('API key not found');
      }

      apiKey.isActive = false;
      await user.save();

      return { message: 'API key revoked successfully' };
    } catch (error) {
      throw new Error(`Failed to revoke API key: ${error.message}`);
    }
  }

  // Get User Statistics
  async getUserStatistics(userId) {
    try {
      const user = await User.findById(userId);
      
      if (!user) {
        throw new Error('User not found');
      }

      return {
        usageStats: user.usageStats,
        subscription: user.subscription,
        remainingTranslations: user.remainingTranslations,
        totalDevices: user.devices.length,
        activeDevices: user.devices.filter(d => d.isActive).length
      };
    } catch (error) {
      throw new Error(`Failed to get user statistics: ${error.message}`);
    }
  }

  // Update Subscription Plan
  async updateSubscriptionPlan(userId, plan, endDate = null) {
    try {
      const user = await User.findById(userId);
      
      if (!user) {
        throw new Error('User not found');
      }

      const validPlans = ['free', 'basic', 'premium', 'enterprise'];
      if (!validPlans.includes(plan)) {
        throw new Error('Invalid subscription plan');
      }

      user.subscription.plan = plan;
      user.subscription.startDate = new Date();
      user.subscription.endDate = endDate;
      user.subscription.usedThisMonth = 0; // Reset monthly usage

      // Set monthly limits based on plan
      const planLimits = {
        'free': 1000,
        'basic': 10000,
        'premium': 100000,
        'enterprise': -1 // Unlimited
      };

      user.subscription.monthlyLimit = planLimits[plan];
      await user.save();

      return user.subscription;
    } catch (error) {
      throw new Error(`Failed to update subscription plan: ${error.message}`);
    }
  }

  // Delete User Account
  async deleteUserAccount(userId, password) {
    try {
      const user = await User.findById(userId).select('+password');
      
      if (!user) {
        throw new Error('User not found');
      }

      // Verify password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        throw new Error('Password is incorrect');
      }

      // TODO: Delete user data from other collections
      // For now, just delete the user
      await User.findByIdAndDelete(userId);

      return { message: 'Account deleted successfully' };
    } catch (error) {
      throw new Error(`Failed to delete account: ${error.message}`);
    }
  }

  // Soft Delete User Account (set isActive to false and disable Firebase)
  async softDeleteUserAccount(firebaseUid) {
    try {
      // Find user by Firebase UID
      const user = await User.findOne({ firebaseUid });
      
      if (!user) {
        throw new Error('User not found');
      }

      // Check if user is already deactivated
      if (!user.isActive) {
        throw new Error('User account is already deactivated');
      }

      // Update MongoDB: set isActive to false and add deactivation timestamp
      const updatedUser = await User.findOneAndUpdate(
        { firebaseUid },
        { 
          isActive: false,
          deactivatedAt: new Date(),
          'firebaseMetadata.lastSync': new Date()
        },
        { new: true }
      );

      // Disable Firebase user account
      try {
        await disableFirebaseUser(firebaseUid);
        console.log('✅ Firebase user account disabled successfully');
      } catch (firebaseError) {
        console.error('⚠️ Firebase user disable failed, but MongoDB updated:', firebaseError);
        // Don't fail the entire operation if Firebase update fails
        // MongoDB update was successful
      }

      return { 
        success: true,
        message: 'Account deactivated successfully',
        user: updatedUser
      };
    } catch (error) {
      throw new Error(`Failed to deactivate account: ${error.message}`);
    }
  }

  // Search Users (Admin only)
  async searchUsers(query, page = 1, limit = 20) {
    try {
      const skip = (page - 1) * limit;
      
      const filter = {};
      if (query.search) {
        filter.$or = [
          { username: { $regex: query.search, $options: 'i' } },
          { email: { $regex: query.search, $options: 'i' } },
          { firstName: { $regex: query.search, $options: 'i' } },
          { lastName: { $regex: query.search, $options: 'i' } }
        ];
      }

      if (query.plan) {
        filter['subscription.plan'] = query.plan;
      }

      if (query.status) {
        if (query.status === 'active') {
          filter['usageStats.lastActive'] = { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) };
        } else if (query.status === 'inactive') {
          filter['usageStats.lastActive'] = { $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) };
        }
      }

      const users = await User.find(filter)
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await User.countDocuments(filter);

      return {
        users,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw new Error(`Failed to search users: ${error.message}`);
    }
  }

  // Get Global Statistics (Admin only)
  async getGlobalStatistics() {
    try {
      const stats = await User.getUsageStats();
      return stats[0] || {};
    } catch (error) {
      throw new Error(`Failed to get global statistics: ${error.message}`);
    }
  }

  // Debug: Get all users (for troubleshooting)
  async getAllUsersForDebug() {
    try {
      const users = await User.find({}, 'firebaseUid email firstName lastName isFirebaseUser');
      return users;
    } catch (error) {
      throw new Error(`Failed to get all users: ${error.message}`);
    }
  }
}

module.exports = new UserService();
