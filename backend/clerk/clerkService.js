const User = require('../models/User');
const config = require('../config');

console.log('🔍 About to import @clerk/backend package...');

// Import the Clerk client - it will use the CLERK_SECRET_KEY from .env
const clerkBackend = require('@clerk/backend');

console.log('🔍 @clerk/backend package loaded:', {
  packageType: typeof clerkBackend,
  packageKeys: Object.keys(clerkBackend),
  hasClerkClient: !!clerkBackend.clerkClient,
  hasDefault: !!clerkBackend.default,
  timestamp: new Date().toISOString()
});

// Try to extract clerkClient
let clerkClient;

if (clerkBackend.clerkClient) {
  clerkClient = clerkBackend.clerkClient;
  console.log('✅ Using clerkBackend.clerkClient');
} else if (clerkBackend.default && clerkBackend.default.clerkClient) {
  clerkClient = clerkBackend.default.clerkClient;
  console.log('✅ Using clerkBackend.default.clerkClient');
} else if (clerkBackend.default) {
  clerkClient = clerkBackend.default;
  console.log('✅ Using clerkBackend.default');
} else {
  clerkClient = clerkBackend;
  console.log('✅ Using clerkBackend directly');
}

console.log('🔍 Final clerkClient:', {
  clerkClientType: typeof clerkClient,
  clerkClientExists: !!clerkClient,
  clerkClientKeys: clerkClient ? Object.keys(clerkClient) : 'N/A',
  timestamp: new Date().toISOString()
});

// Alternative import method if the above doesn't work
// const clerk = require('@clerk/backend');

class ClerkService {
  constructor() {
    // Verify Clerk configuration
    if (!config.clerk.secretKey) {
      throw new Error('CLERK_SECRET_KEY is not configured');
    }
    
    console.log('🔍 Clerk service constructor:', {
      hasConfig: !!config.clerk,
      hasSecretKey: !!config.clerk.secretKey,
      clerkClientType: typeof clerkClient,
      clerkClientKeys: clerkClient ? Object.keys(clerkClient) : 'N/A',
      timestamp: new Date().toISOString()
    });
    
    // The clerkClient is automatically configured with the environment variable
    this.clerk = clerkClient;
    console.log('🔐 Clerk client initialized successfully', {
      thisClerkType: typeof this.clerk,
      thisClerkKeys: this.clerk ? Object.keys(this.clerk) : 'N/A'
    });
  }

  /**
   * Create or update user in MongoDB when they sign up through Clerk
   */
  async syncUserFromClerk(userData) {
    try {
      // Extract user data from webhook payload
      const clerkUserId = userData.id;
      const emailAddresses = userData.email_addresses || [];
      const primaryEmail = emailAddresses.find(email => email.id === userData.primary_email_address_id);
      const email = primaryEmail?.email_address;
      
      if (!email) {
        console.error('❌ No email found for user:', clerkUserId);
        throw new Error('Email is required for user creation');
      }

      // Prepare user data for MongoDB
      const userDataForDB = {
        clerkId: clerkUserId,
        email: email,
        username: userData.username || this.generateUsername(userData),
        firstName: userData.first_name || '',
        lastName: userData.last_name || '',
        phoneNumber: userData.phone_numbers?.[0]?.phone_number || null,
        country: '',
        state: '',
        age: null,
        gender: 'prefer-not-to-say',
        preferredLanguage: 'en',
        settings: {
          theme: 'light'
        },
        // Set password to null since Clerk handles authentication
        password: null,
        // Mark as Clerk user
        isClerkUser: true,
        // Store Clerk metadata
        clerkMetadata: {
          lastSync: new Date(),
          clerkData: {
            id: userData.id,
            createdAt: userData.created_at,
            updatedAt: userData.updated_at,
            imageUrl: userData.image_url,
            externalId: userData.external_id
          }
        }
      };

      // Check if user already exists in MongoDB
      let existingUser = await User.findOne({ 
        $or: [
          { clerkId: clerkUserId },
          { email: userDataForDB.email }
        ]
      });

      if (existingUser) {
        // Update existing user
        existingUser = await User.findByIdAndUpdate(
          existingUser._id,
          { 
            ...userDataForDB,
            updatedAt: new Date()
          },
          { new: true, runValidators: false }
        );
        return existingUser;
      } else {
        // Create new user
        const newUser = await User.create(userDataForDB);
        return newUser;
      }

    } catch (error) {
      console.error('❌ Error syncing user from Clerk:', error);
      throw error;
    }
  }

  /**
   * Get user from MongoDB by Clerk ID
   */
  async getUserByClerkId(clerkUserId) {
    try {
      const user = await User.findOne({ clerkId: clerkUserId });
      return user;
    } catch (error) {
      console.error('❌ Error getting user by Clerk ID:', error);
      throw error;
    }
  }

  /**
   * Update user metadata in Clerk
   */
  async updateClerkUserMetadata(clerkUserId, metadata) {
    try {
      const updatedUser = await this.clerk.users.updateUser(clerkUserId, {
        publicMetadata: metadata.public || {},
        privateMetadata: metadata.private || {},
        unsafeMetadata: metadata.unsafe || {}
      });
      
      console.log(`✅ Updated Clerk user metadata: ${clerkUserId}`);
      return updatedUser;
    } catch (error) {
      console.error('❌ Error updating Clerk user metadata:', error);
      throw error;
    }
  }

  /**
   * Delete user from MongoDB when deleted from Clerk
   */
  async deleteUserByClerkId(clerkUserId) {
    try {
      const result = await User.deleteOne({ clerkId: clerkUserId });
      console.log(`✅ Deleted user from MongoDB: ${clerkUserId}`);
      return result;
    } catch (error) {
      console.error('❌ Error deleting user by Clerk ID:', error);
      throw error;
    }
  }

  /**
   * Generate username from Clerk user data
   */
  generateUsername(clerkUser) {
    const firstName = clerkUser.firstName || '';
    const lastName = clerkUser.lastName || '';
    const email = clerkUser.emailAddresses[0]?.emailAddress || '';
    
    if (firstName && lastName) {
      return `${firstName.toLowerCase()}${lastName.toLowerCase()}`;
    } else if (firstName) {
      return firstName.toLowerCase();
    } else if (email) {
      return email.split('@')[0];
    } else {
      return `user_${Date.now()}`;
    }
  }

  /**
   * Verify Clerk session token
   */
  async verifySession(sessionToken) {
    try {
      const session = await this.clerk.sessions.verifySession(sessionToken);
      return session;
    } catch (error) {
      console.error('❌ Error verifying Clerk session:', error);
      throw error;
    }
  }

  /**
   * Check if Clerk service is ready
   */
  isReady() {
    const ready = !!this.clerk;
    console.log('🔍 Clerk service readiness check:', {
      ready,
      clerkExists: !!this.clerk,
      clerkType: typeof this.clerk,
      clerkKeys: this.clerk ? Object.keys(this.clerk) : 'N/A',
      timestamp: new Date().toISOString()
    });
    return ready;
  }

  /**
   * Get user from Clerk by ID
   */
  async getClerkUser(clerkUserId) {
    try {
      if (!this.clerk) {
        throw new Error('Clerk client not initialized');
      }
      
      const user = await this.clerk.users.getUser(clerkUserId);
      return user;
    } catch (error) {
      console.error('❌ Error getting Clerk user:', error);
      throw error;
    }
  }
}

module.exports = new ClerkService();
