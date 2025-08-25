const userService = require('../services/userService');
const { getSupportedLanguages, getLanguagesByCategory } = require('../master/languages');

class UserController {
  // User Registration
  async register(req, res) {
    try {
      const { username, email, password, firstName, lastName, sourceLanguage, targetLanguage } = req.body;

      const result = await userService.registerUser({
        username,
        email,
        password,
        firstName,
        lastName,
        sourceLanguage,
        targetLanguage
      });

      res.status(201).json({
        success: true,
        message: result.message,
        data: {
          user: result.user,
          token: result.token
        }
      });
    } catch (error) {
      console.error('User registration error:', error);
      res.status(400).json({
        success: false,
        error: 'Registration failed',
        message: error.message
      });
    }
  }

  // User Login
  async login(req, res) {
    try {
      const { email, password } = req.body;

      const result = await userService.loginUser(email, password);

      res.status(200).json({
        success: true,
        message: result.message,
        data: {
          user: result.user,
          token: result.token
        }
      });
    } catch (error) {
      console.error('User login error:', error);
      res.status(401).json({
        success: false,
        error: 'Login failed',
        message: error.message
      });
    }
  }

  // Get User Profile
  async getProfile(req, res) {
    try {
      const userId = req.userId;
      const user = await userService.getUserProfile(userId);

      res.status(200).json({
        success: true,
        data: {
          user
        }
      });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(400).json({
        success: false,
        error: 'Failed to get profile',
        message: error.message
      });
    }
  }

  // Update User Profile
  async updateProfile(req, res) {
    try {
      const userId = req.userId;
      const updateData = req.body;

      const updatedUser = await userService.updateUserProfile(userId, updateData);

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: {
          user: updatedUser
        }
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(400).json({
        success: false,
        error: 'Failed to update profile',
        message: error.message
      });
    }
  }

  // Change Password
  async changePassword(req, res) {
    try {
      const userId = req.userId;
      const { currentPassword, newPassword } = req.body;

      await userService.changePassword(userId, currentPassword, newPassword);

      res.status(200).json({
        success: true,
        message: 'Password changed successfully'
      });
    } catch (error) {
      console.error('Change password error:', error);
      res.status(400).json({
        success: false,
        error: 'Failed to change password',
        message: error.message
      });
    }
  }

  // Request Password Reset
  async requestPasswordReset(req, res) {
    try {
      const { email } = req.body;

      const result = await userService.requestPasswordReset(email);

      res.status(200).json({
        success: true,
        message: result.message,
        data: {
          resetToken: result.resetToken
        }
      });
    } catch (error) {
      console.error('Request password reset error:', error);
      res.status(400).json({
        success: false,
        error: 'Failed to request password reset',
        message: error.message
      });
    }
  }

  // Reset Password
  async resetPassword(req, res) {
    try {
      const { token, newPassword } = req.body;

      await userService.resetPassword(token, newPassword);

      res.status(200).json({
        success: true,
        message: 'Password reset successfully'
      });
    } catch (error) {
      console.error('Reset password error:', error);
      res.status(400).json({
        success: false,
        error: 'Failed to reset password',
        message: error.message
      });
    }
  }

  // Verify Email
  async verifyEmail(req, res) {
    try {
      const { token } = req.params;

      await userService.verifyEmail(token);

      res.status(200).json({
        success: true,
        message: 'Email verified successfully'
      });
    } catch (error) {
      console.error('Verify email error:', error);
      res.status(400).json({
        success: false,
        error: 'Failed to verify email',
        message: error.message
      });
    }
  }

  // Request Email Verification
  async requestEmailVerification(req, res) {
    try {
      const userId = req.userId;

      const result = await userService.requestEmailVerification(userId);

      res.status(200).json({
        success: true,
        message: result.message,
        data: {
          verificationToken: result.verificationToken
        }
      });
    } catch (error) {
      console.error('Request email verification error:', error);
      res.status(400).json({
        success: false,
        error: 'Failed to request email verification',
        message: error.message
      });
    }
  }

  // Update Language Preferences
  async updateLanguagePreferences(req, res) {
    try {
      const userId = req.userId;
      const { sourceLanguage, targetLanguage } = req.body;

      const preferences = await userService.updateLanguagePreferences(
        userId,
        sourceLanguage,
        targetLanguage
      );

      res.status(200).json({
        success: true,
        message: 'Language preferences updated successfully',
        data: {
          preferences
        }
      });
    } catch (error) {
      console.error('Update language preferences error:', error);
      res.status(400).json({
        success: false,
        error: 'Failed to update language preferences',
        message: error.message
      });
    }
  }

  // Update App Settings
  async updateAppSettings(req, res) {
    try {
      const userId = req.userId;
      const settings = req.body;

      const updatedSettings = await userService.updateAppSettings(userId, settings);

      res.status(200).json({
        success: true,
        message: 'App settings updated successfully',
        data: {
          settings: updatedSettings
        }
      });
    } catch (error) {
      console.error('Update app settings error:', error);
      res.status(400).json({
        success: false,
        error: 'Failed to update app settings',
        message: error.message
      });
    }
  }

  // Update Privacy Settings
  async updatePrivacySettings(req, res) {
    try {
      const userId = req.userId;
      const privacySettings = req.body;

      const updatedPrivacySettings = await userService.updatePrivacySettings(
        userId,
        privacySettings
      );

      res.status(200).json({
        success: true,
        message: 'Privacy settings updated successfully',
        data: {
          privacySettings: updatedPrivacySettings
        }
      });
    } catch (error) {
      console.error('Update privacy settings error:', error);
      res.status(400).json({
        success: false,
        error: 'Failed to update privacy settings',
        message: error.message
      });
    }
  }

  // Generate API Key
  async generateApiKey(req, res) {
    try {
      const userId = req.userId;
      const { keyName, permissions } = req.body;

      const apiKey = await userService.generateApiKey(userId, keyName, permissions);

      res.status(201).json({
        success: true,
        message: 'API key generated successfully',
        data: {
          apiKey
        }
      });
    } catch (error) {
      console.error('Generate API key error:', error);
      res.status(400).json({
        success: false,
        error: 'Failed to generate API key',
        message: error.message
      });
    }
  }

  // Revoke API Key
  async revokeApiKey(req, res) {
    try {
      const userId = req.userId;
      const { keyId } = req.params;

      await userService.revokeApiKey(userId, keyId);

      res.status(200).json({
        success: true,
        message: 'API key revoked successfully'
      });
    } catch (error) {
      console.error('Revoke API key error:', error);
      res.status(400).json({
        success: false,
        error: 'Failed to revoke API key',
        message: error.message
      });
    }
  }

  // Get User Statistics
  async getUserStatistics(req, res) {
    try {
      const userId = req.userId;

      const statistics = await userService.getUserStatistics(userId);

      res.status(200).json({
        success: true,
        data: {
          statistics
        }
      });
    } catch (error) {
      console.error('Get user statistics error:', error);
      res.status(400).json({
        success: false,
        error: 'Failed to get user statistics',
        message: error.message
      });
    }
  }

  // Update Subscription Plan
  async updateSubscriptionPlan(req, res) {
    try {
      const userId = req.userId;
      const { plan, endDate } = req.body;

      const subscription = await userService.updateSubscriptionPlan(userId, plan, endDate);

      res.status(200).json({
        success: true,
        message: 'Subscription plan updated successfully',
        data: {
          subscription
        }
      });
    } catch (error) {
      console.error('Update subscription plan error:', error);
      res.status(400).json({
        success: false,
        error: 'Failed to update subscription plan',
        message: error.message
      });
    }
  }

  // Delete User Account
  async deleteAccount(req, res) {
    try {
      const userId = req.userId;
      const { password } = req.body;

      await userService.deleteUserAccount(userId, password);

      res.status(200).json({
        success: true,
        message: 'Account deleted successfully'
      });
    } catch (error) {
      console.error('Delete account error:', error);
      res.status(400).json({
        success: false,
        error: 'Failed to delete account',
        message: error.message
      });
    }
  }

  // Get Supported Languages
  async getSupportedLanguages(req, res) {
    try {
      const languages = getSupportedLanguages();

      res.status(200).json({
        success: true,
        data: {
          languages
        }
      });
    } catch (error) {
      console.error('Get supported languages error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get supported languages',
        message: error.message
      });
    }
  }

  // Get Languages by Category
  async getLanguagesByCategory(req, res) {
    try {
      const { category } = req.params;
      const languages = getLanguagesByCategory(category);

      if (languages.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Category not found',
          message: `No languages found for category: ${category}`
        });
      }

      res.status(200).json({
        success: true,
        data: {
          category,
          languages
        }
      });
    } catch (error) {
      console.error('Get languages by category error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get languages by category',
        message: error.message
      });
    }
  }

  // Search Users (Admin only)
  async searchUsers(req, res) {
    try {
      const { search, plan, status, page = 1, limit = 20 } = req.query;

      const result = await userService.searchUsers(
        { search, plan, status },
        parseInt(page),
        parseInt(limit)
      );

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Search users error:', error);
      res.status(400).json({
        success: false,
        error: 'Failed to search users',
        message: error.message
      });
    }
  }

  // Get Global Statistics (Admin only)
  async getGlobalStatistics(req, res) {
    try {
      const statistics = await userService.getGlobalStatistics();

      res.status(200).json({
        success: true,
        data: {
          statistics
        }
      });
    } catch (error) {
      console.error('Get global statistics error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get global statistics',
        message: error.message
      });
    }
  }

  // Refresh Token
  async refreshToken(req, res) {
    try {
      const userId = req.userId;
      
      // Generate new token
      const newToken = userService.generateToken(userId);

      res.status(200).json({
        success: true,
        message: 'Token refreshed successfully',
        data: {
          token: newToken
        }
      });
    } catch (error) {
      console.error('Refresh token error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to refresh token',
        message: error.message
      });
    }
  }

  // Logout
  async logout(req, res) {
    try {
      // In a stateless JWT system, logout is handled client-side
      // You could implement a blacklist for tokens if needed
      
      res.status(200).json({
        success: true,
        message: 'Logged out successfully'
      });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to logout',
        message: error.message
      });
    }
  }

  // Get User Devices
  async getUserDevices(req, res) {
    try {
      const userId = req.userId;
      const user = await userService.getUserProfile(userId);

      res.status(200).json({
        success: true,
        data: {
          devices: user.devices
        }
      });
    } catch (error) {
      console.error('Get user devices error:', error);
      res.status(400).json({
        success: false,
        error: 'Failed to get user devices',
        message: error.message
      });
    }
  }

  // Remove User Device
  async removeUserDevice(req, res) {
    try {
      const userId = req.userId;
      const { deviceId } = req.params;

      const user = await userService.getUserProfile(userId);
      const device = user.devices.find(d => d.deviceId === deviceId);

      if (!device) {
        return res.status(404).json({
          success: false,
          error: 'Device not found',
          message: 'The specified device was not found'
        });
      }

      device.isActive = false;
      await user.save();

      res.status(200).json({
        success: true,
        message: 'Device removed successfully'
      });
    } catch (error) {
      console.error('Remove user device error:', error);
      res.status(400).json({
        success: false,
        error: 'Failed to remove device',
        message: error.message
      });
    }
  }

  // Health Check
  async healthCheck(req, res) {
    try {
      res.status(200).json({
        success: true,
        message: 'User service is healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
      });
    } catch (error) {
      console.error('Health check error:', error);
      res.status(500).json({
        success: false,
        error: 'Service unhealthy',
        message: error.message
      });
    }
  }
}

module.exports = new UserController();
