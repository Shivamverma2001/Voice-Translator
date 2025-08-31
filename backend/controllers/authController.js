const User = require('../models/User');
const { 
  getAuth, 
  createCustomToken, 
  generatePasswordResetLink, 
  verifyPasswordResetCode, 
  confirmPasswordReset 
} = require('../config/firebase');

const bcrypt = require('bcryptjs');

class AuthController {
  // Sign Up: Check email → Create Firebase user → Store in MongoDB
  async signUp(req, res) {
    try {
      const { email, password, firstName, lastName } = req.body;

      // Validate required fields
      if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields: email, password, firstName, lastName'
        });
      }

      // Check if email already exists in MongoDB and is active
      const existingUser = await User.findOne({ email });
      if (existingUser && existingUser.isActive) {
        return res.status(409).json({
          success: false,
          error: 'User with this email already exists'
        });
      }

      // If user exists but is deactivated, allow creating new account
      if (existingUser && !existingUser.isActive) {
        console.log('ℹ️ Deactivated user exists with email, allowing new account creation:', email);
      }

      // Create Firebase user
      const auth = getAuth();
      let firebaseUser;
      
      try {
        firebaseUser = await auth.createUser({
          email,
          password,
          displayName: `${firstName} ${lastName}`,
          emailVerified: false
        });
        console.log('✅ Firebase user created successfully:', firebaseUser.uid);
      } catch (firebaseError) {
        console.error('❌ Firebase user creation failed:', firebaseError);
        return res.status(500).json({
          success: false,
          error: 'Failed to create user account. Please try again.'
        });
      }

      // Note: Email verification will be sent from frontend using Firebase Auth SDK
      // Backend only creates the user and returns custom token
      console.log('✅ User created successfully, email verification will be sent from frontend');

      // Create MongoDB user
      const user = new User({
        firebaseUid: firebaseUser.uid,
        isFirebaseUser: true,
        email: firebaseUser.email,
        firstName: firstName,
        lastName: lastName,
        firebaseMetadata: {
          lastSync: new Date(),
          firebaseData: {
            uid: firebaseUser.uid,
            emailVerified: false,
            displayName: firebaseUser.displayName,
            photoURL: null,
            providerData: []
          }
        }
      });

      await user.save();
      console.log('✅ MongoDB user created successfully:', user._id);

      // Create custom token for immediate sign-in
      const customToken = await createCustomToken(firebaseUser.uid);

      res.status(201).json({
        success: true,
        message: 'Account created successfully. Please check your email for verification.',
        user: {
          id: user._id,
          firebaseUid: user.firebaseUid,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          emailVerified: false
        },
        customToken: customToken
      });
    } catch (error) {
      console.error('❌ Error in signUp:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create account. Please try again.'
      });
    }
  }

  // Sign In: Check user exists → Verify Firebase → Return user data
  async signIn(req, res) {
    try {
      const { email, password } = req.body;

      // Validate required fields
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: 'Email and password are required'
        });
      }

      // Check if user exists in MongoDB
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Invalid email or password'
        });
      }

      // Check if user is active
      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          error: 'Account is deactivated. Please contact support.'
        });
      }

      // Verify Firebase user exists and is not disabled
      const auth = getAuth();
      let firebaseUser;
      
      try {
        firebaseUser = await auth.getUser(user.firebaseUid);
        
        if (firebaseUser.disabled) {
          return res.status(401).json({
            success: false,
            error: 'Account is disabled. Please contact support.'
          });
        }
      } catch (firebaseError) {
        console.error('❌ Firebase user verification failed:', firebaseError);
        return res.status(401).json({
          success: false,
          error: 'Invalid email or password'
        });
      }

      // Check email verification
      if (!firebaseUser.emailVerified) {
        return res.status(401).json({
          success: false,
          error: 'Please verify your email address before signing in. Check your inbox and spam folder.'
        });
      }

      // Update last active timestamp
      user.usageStats = user.usageStats || {};
      user.usageStats.lastActive = new Date();
      await user.save();

      // Create custom token for sign-in
      const customToken = await createCustomToken(user.firebaseUid);

      res.json({
        success: true,
        message: 'Sign in successful',
        user: {
          id: user._id,
          firebaseUid: user.firebaseUid,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          emailVerified: firebaseUser.emailVerified,
          role: user.role,
          isActive: user.isActive
        },
        customToken: customToken
      });
    } catch (error) {
      console.error('❌ Error in signIn:', error);
      res.status(500).json({
        success: false,
        error: 'Sign in failed. Please try again.'
      });
    }
  }

  // Sign Out: Handle signout (mainly for logging purposes)
  async signOut(req, res) {
    try {
      const firebaseUid = req.user?.firebaseUid;
      
      if (firebaseUid) {
        // Update last active timestamp
        await User.findOneAndUpdate(
          { firebaseUid },
          { 'usageStats.lastActive': new Date() }
        );
        console.log('✅ User signout logged:', firebaseUid);
      }

      res.json({
        success: true,
        message: 'Sign out successful'
      });
    } catch (error) {
      console.error('❌ Error in signOut:', error);
      res.status(500).json({
        success: false,
        error: 'Sign out failed'
      });
    }
  }

  // Check if email exists (for signup validation)
  async checkEmailExists(req, res) {
    try {
      const { email } = req.params;

      if (!email) {
        return res.status(400).json({
          success: false,
          error: 'Email parameter is required'
        });
      }

      const existingUser = await User.findOne({ email });
      
      // Only consider active users as "existing"
      const isActiveUser = existingUser && existingUser.isActive;
      
      res.json({
        success: true,
        exists: isActiveUser,
        message: isActiveUser ? 'Email already registered' : 'Email available',
        details: existingUser ? {
          isActive: existingUser.isActive,
          isDeactivated: !existingUser.isActive,
          deactivatedAt: existingUser.deactivatedAt
        } : null
      });
    } catch (error) {
      console.error('❌ Error checking email:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to check email'
      });
    }
  }

  // Resend email verification
  async resendVerification(req, res) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          error: 'Email is required'
        });
      }

      // Check if user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      // Note: Email verification will be sent from frontend using Firebase Auth SDK
      // Backend only generates the link for cases where user is not signed in
      
      try {
        const verificationLink = await auth.generateEmailVerificationLink(email);
        console.log('✅ Email verification link generated for:', email);
        
        res.json({
          success: true,
          message: 'Verification link generated. Please check your inbox and spam folder.',
          // Development only - in production, implement email sending
          verificationLink: process.env.NODE_ENV === 'development' ? verificationLink : undefined
        });
      } catch (verificationError) {
        console.error('❌ Email verification failed:', verificationError);
        res.status(500).json({
          success: false,
          error: 'Failed to generate verification link. Please try again.'
        });
      }
    } catch (error) {
      console.error('❌ Error in resendVerification:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to resend verification email'
      });
    }
  }

  // Request password reset
  async requestPasswordReset(req, res) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          error: 'Email is required'
        });
      }

      // Check if user exists
      const user = await User.findOne({ email });
      if (!user) {
        // Don't reveal if user exists or not for security
        console.log('ℹ️ Password reset requested for email (user may not exist):', email);
        return res.json({
          success: true,
          message: 'If an account with this email exists, a password reset link has been sent.'
        });
      }

      // Check if user is active
      if (!user.isActive) {
        console.log('⚠️ Password reset requested for deactivated user:', email);
        return res.json({
          success: true,
          message: 'If an account with this email exists, a password reset link has been sent.'
        });
      }

      try {
        // Generate password reset link
        const resetLink = await generatePasswordResetLink(email);
        
        // Note: Password reset email will be sent from frontend using Firebase Auth SDK
        // Backend only generates the link
        
        res.json({
          success: true,
          message: 'Password reset link generated. Please check your email.',
          // Development only - in production, implement email sending
          resetLink: process.env.NODE_ENV === 'development' ? resetLink : undefined
        });
      } catch (resetError) {
        console.error('❌ Password reset link generation failed:', resetError);
        res.status(500).json({
          success: false,
          error: 'Failed to generate password reset link. Please try again.'
        });
      }
    } catch (error) {
      console.error('❌ Error in requestPasswordReset:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to process password reset request'
      });
    }
  }

  // Verify password reset code
  async verifyResetCode(req, res) {
    try {
      const { oobCode } = req.body;

      if (!oobCode) {
        return res.status(400).json({
          success: false,
          error: 'Reset code is required'
        });
      }

      try {
        // Verify the reset code
        const email = await verifyPasswordResetCode(oobCode);
        
        res.json({
          success: true,
          message: 'Reset code verified successfully',
          email: email
        });
      } catch (verifyError) {
        console.error('❌ Reset code verification failed:', verifyError);
        res.status(400).json({
          success: false,
          error: 'Invalid or expired reset code'
        });
      }
    } catch (error) {
      console.error('❌ Error in verifyResetCode:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to verify reset code'
      });
    }
  }

  // Reset password with code
  async resetPassword(req, res) {
    try {
      const { oobCode, newPassword } = req.body;

      if (!oobCode || !newPassword) {
        return res.status(400).json({
          success: false,
          error: 'Reset code and new password are required'
        });
      }

      if (newPassword.length < 8) {
        return res.status(400).json({
          success: false,
          error: 'Password must be at least 8 characters long'
        });
      }

      try {
        // Confirm password reset
        await confirmPasswordReset(oobCode, newPassword);
        
        // Get the email from the reset code
        const email = await verifyPasswordResetCode(oobCode);
        
        // Update MongoDB user's last password change timestamp
        await User.findOneAndUpdate(
          { email },
          { 
            'security.lastPasswordChange': new Date(),
            'security.passwordResetAt': new Date()
          }
        );
        
        res.json({
          success: true,
          message: 'Password reset successfully. You can now sign in with your new password.'
        });
      } catch (resetError) {
        console.error('❌ Password reset failed:', resetError);
        res.status(400).json({
          success: false,
          error: 'Failed to reset password. The reset code may be invalid or expired.'
        });
      }
    } catch (error) {
      console.error('❌ Error in resetPassword:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to reset password'
      });
    }
  }
}

module.exports = new AuthController();
