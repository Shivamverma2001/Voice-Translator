const express = require('express');
const router = express.Router();
const clerkService = require('../clerk/clerkService');
const webhookHandler = require('../clerk/webhookHandler');

// Clerk webhook endpoint - receives events from Clerk
router.post('/webhook', webhookHandler.processWebhook.bind(webhookHandler));

// Manual user sync endpoint (for testing/debugging)
router.post('/sync-user/:clerkUserId', async (req, res) => {
  try {
    const { clerkUserId } = req.params;
    const userData = req.body;

    const syncedUser = await clerkService.syncUserFromClerk(clerkUserId, userData);
    
    res.status(200).json({
      success: true,
      message: 'User synced successfully',
      user: syncedUser
    });
  } catch (error) {
    console.error('❌ Error in manual user sync:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get user by Clerk ID
router.get('/user/:clerkUserId', async (req, res) => {
  try {
    const { clerkUserId } = req.params;
    const user = await clerkService.getUserByClerkId(clerkUserId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      user: user
    });
  } catch (error) {
    console.error('❌ Error getting user by Clerk ID:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Update user metadata in Clerk
router.put('/user/:clerkUserId/metadata', async (req, res) => {
  try {
    const { clerkUserId } = req.params;
    const metadata = req.body;

    const updatedUser = await clerkService.updateClerkUserMetadata(clerkUserId, metadata);
    
    res.status(200).json({
      success: true,
      message: 'User metadata updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('❌ Error updating user metadata:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Clerk integration is healthy',
    timestamp: new Date().toISOString()
  });
});



// Test endpoint to verify User model with Clerk data
router.post('/test-user-model', async (req, res) => {
  try {
    const User = require('../models/User');
    
    // Test creating a Clerk user (without saving to database)
    const testUser = new User({
      clerkId: 'test_clerk_id_123',
      isClerkUser: true,
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      username: 'testuser',
      phoneNumber: '+1234567890',
      country: 'US',
      state: 'CA'
    });
    
    // Validate the user data
    const validationError = testUser.validateSync();
    
    if (validationError) {
      return res.status(400).json({
        success: false,
        message: 'User model validation failed',
        errors: validationError.errors
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'User model validation passed',
      userData: {
        clerkId: testUser.clerkId,
        isClerkUser: testUser.isClerkUser,
        email: testUser.email,
        firstName: testUser.firstName,
        lastName: testUser.lastName,
        username: testUser.username,
        phoneNumber: testUser.phoneNumber,
        country: testUser.country,
        state: testUser.state
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
