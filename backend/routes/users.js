const express = require('express');
const router = express.Router();
const userService = require('../services/userService');

// Get additional fields for a user
router.get('/additional-fields/:clerkId', async (req, res) => {
  try {
    const { clerkId } = req.params;
    
    const user = await userService.getUserAdditionalFields(clerkId);
    res.json({ 
      success: true,
      user: user 
    });
  } catch (error) {
    console.error('Error fetching additional fields:', error);
    res.status(500).json({ message: error.message });
  }
});

// Update additional fields for a user
router.put('/additional-fields/:clerkId', async (req, res) => {
  try {
    const { clerkId } = req.params;
    const fieldsData = req.body;

    console.log('Updating additional fields for clerkId:', clerkId);
    console.log('Request body:', fieldsData);

    const updatedUser = await userService.updateUserAdditionalFields(clerkId, fieldsData);
    
    res.json({ 
      success: true,
      message: 'Additional fields updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Error updating additional fields:', error);
    res.status(500).json({ message: error.message });
  }
});

// Update Clerk profile data
router.put('/clerk-profile/:clerkId', async (req, res) => {
  try {
    const { clerkId } = req.params;
    const clerkData = req.body;

    console.log('Updating Clerk profile data for clerkId:', clerkId);
    console.log('Clerk data:', clerkData);

    const updatedUser = await userService.updateClerkProfileData(clerkId, clerkData);
    
    res.json({ 
      success: true,
      message: 'Clerk profile data updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Error updating Clerk profile data:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
});

// Debug endpoint to check if user exists
router.get('/debug/user/:clerkId', async (req, res) => {
  try {
    const { clerkId } = req.params;
    
    console.log('Debug: Checking for user with clerkId:', clerkId);
    
    const user = await userService.getUserByClerkId(clerkId);
    
    if (!user) {
      // List all users in the database for debugging
      const allUsers = await userService.getAllUsersForDebug();
      console.log('Debug: User not found. All users in database:', allUsers);
      
      return res.status(404).json({ 
        message: 'User not found',
        debug: {
          searchedFor: clerkId,
          totalUsers: allUsers.length,
          allUsers: allUsers
        }
      });
    }
    
    res.json({ 
      success: true, 
      user: {
        id: user._id,
        clerkId: user.clerkId,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isClerkUser: user.isClerkUser
      }
    });
  } catch (error) {
    console.error('Debug: Error checking user:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      debug: {
        searchedFor: req.params.clerkId
      }
    });
  }
});

module.exports = router;
