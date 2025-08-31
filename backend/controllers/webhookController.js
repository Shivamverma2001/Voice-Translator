const User = require('../models/User');
const { getAuth } = require('../config/firebase');

class WebhookController {
  // Handle Firebase Auth webhook events
  async handleAuthWebhook(req, res) {
    try {
      const { eventType, data } = req.body;

      console.log('🔔 Webhook received:', { eventType, data });

      switch (eventType) {
        case 'USER_EMAIL_VERIFIED':
          await this.handleEmailVerified(data);
          break;
        
        case 'USER_PASSWORD_CHANGED':
          await this.handlePasswordChanged(data);
          break;
        
        case 'USER_DELETED':
          await this.handleUserDeleted(data);
          break;
        
        case 'USER_CREATED':
          await this.handleUserCreated(data);
          break;
        
        case 'USER_DISABLED':
          await this.handleUserDisabled(data);
          break;
        
        default:
          console.log('ℹ️ Unhandled webhook event type:', eventType);
      }

      res.status(200).json({ success: true, message: 'Webhook processed successfully' });
    } catch (error) {
      console.error('❌ Webhook processing error:', error);
      res.status(500).json({ success: false, error: 'Webhook processing failed' });
    }
  }

  // Handle email verification event
  async handleEmailVerified(data) {
    try {
      const { uid, email } = data;
      
      if (!uid || !email) {
        console.error('❌ Missing uid or email in email verification webhook');
        return;
      }

      // Update MongoDB user
      const updatedUser = await User.findOneAndUpdate(
        { firebaseUid: uid },
        { 
          'firebaseMetadata.firebaseData.emailVerified': true,
          'firebaseMetadata.lastSync': new Date()
        },
        { new: true }
      );

      if (updatedUser) {
        console.log('✅ Email verification synced to MongoDB for user:', uid);
      } else {
        console.warn('⚠️ User not found in MongoDB for email verification:', uid);
      }
    } catch (error) {
      console.error('❌ Error handling email verification webhook:', error);
    }
  }

  // Handle password change event
  async handlePasswordChanged(data) {
    try {
      const { uid } = data;
      
      if (!uid) {
        console.error('❌ Missing uid in password change webhook');
        return;
      }

      // Update MongoDB user's password change timestamp
      const updatedUser = await User.findOneAndUpdate(
        { firebaseUid: uid },
        { 
          'security.lastPasswordChange': new Date(),
          'firebaseMetadata.lastSync': new Date()
        },
        { new: true }
      );

      if (updatedUser) {
        console.log('✅ Password change synced to MongoDB for user:', uid);
      } else {
        console.warn('⚠️ User not found in MongoDB for password change:', uid);
      }
    } catch (error) {
      console.error('❌ Error handling password change webhook:', error);
    }
  }

  // Handle user deletion event
  async handleUserDeleted(data) {
    try {
      const { uid } = data;
      
      if (!uid) {
        console.error('❌ Missing uid in user deletion webhook');
        return;
      }

      // Soft delete MongoDB user
      const updatedUser = await User.findOneAndUpdate(
        { firebaseUid: uid },
        { 
          isActive: false,
          deactivatedAt: new Date(),
          'firebaseMetadata.lastSync': new Date()
        },
        { new: true }
      );

      if (updatedUser) {
        console.log('✅ User deletion synced to MongoDB for user:', uid);
      } else {
        console.warn('⚠️ User not found in MongoDB for deletion:', uid);
      }
    } catch (error) {
      console.error('❌ Error handling user deletion webhook:', error);
    }
  }

  // Handle user disabled event
  async handleUserDisabled(data) {
    try {
      const { uid } = data;
      
      if (!uid) {
        console.error('❌ Missing uid in user disabled webhook');
        return;
      }

      // Update MongoDB user status
      const updatedUser = await User.findOneAndUpdate(
        { firebaseUid: uid },
        { 
          isActive: false,
          'firebaseMetadata.lastSync': new Date()
        },
        { new: true }
      );

      if (updatedUser) {
        console.log('✅ User disabled status synced to MongoDB for user:', uid);
      } else {
        console.warn('⚠️ User not found in MongoDB for disabled status:', uid);
      }
    } catch (error) {
      console.error('❌ Error handling user disabled webhook:', error);
    }
  }

  // Handle user created event (for new signups after deletion)
  async handleUserCreated(data) {
    try {
      const { uid, email } = data;
      
      if (!uid || !email) {
        console.error('❌ Missing uid or email in user created webhook');
        return;
      }

      // Check if we have a deactivated user with this email
      const deactivatedUser = await User.findOne({ 
        email, 
        isActive: false,
        firebaseUid: null // No Firebase UID (was deleted)
      });

      if (deactivatedUser) {
        // Update the deactivated user with new Firebase UID
        await User.findOneAndUpdate(
          { _id: deactivatedUser._id },
          { 
            firebaseUid: uid,
            'firebaseMetadata.lastSync': new Date(),
            'firebaseMetadata.firebaseData.uid': uid
          }
        );
        
        console.log('✅ Deactivated user linked to new Firebase UID:', uid);
      } else {
        console.log('ℹ️ New user created (no deactivated account found):', uid);
      }
    } catch (error) {
      console.error('❌ Error handling user created webhook:', error);
    }
  }

  // Manual email verification check (for development/testing)
  async checkEmailVerification(req, res) {
    try {
      const { firebaseUid } = req.params;

      if (!firebaseUid) {
        return res.status(400).json({
          success: false,
          error: 'Firebase UID is required'
        });
      }

      // Get Firebase user
      const auth = getAuth();
      const firebaseUser = await auth.getUser(firebaseUid);

      // Update MongoDB if email verification status changed
      const mongoUser = await User.findOne({ firebaseUid });
      
      if (mongoUser && mongoUser.firebaseMetadata?.firebaseData?.emailVerified !== firebaseUser.emailVerified) {
        await User.findOneAndUpdate(
          { firebaseUid },
          { 
            'firebaseMetadata.firebaseData.emailVerified': firebaseUser.emailVerified,
            'firebaseMetadata.lastSync': new Date()
          }
        );
        
        console.log('✅ Email verification status synced for user:', firebaseUid);
      }

      res.json({
        success: true,
        emailVerified: firebaseUser.emailVerified,
        message: 'Email verification status checked and synced'
      });
    } catch (error) {
      console.error('❌ Error checking email verification:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to check email verification'
      });
    }
  }

  // Health check for webhook endpoint
  healthCheck(req, res) {
    res.status(200).json({
      success: true,
      message: 'Webhook endpoint is healthy',
      timestamp: new Date().toISOString()
    });
  }
}

module.exports = new WebhookController();
