const userService = require('../services/userService');
const { getAuth } = require('../config/firebase');

class UserController {
  // Get user profile by Firebase UID
  async getUserProfile(req, res) {
    try {
      // Get Firebase UID from the authenticated request
      const firebaseUid = req.user?.firebaseUid;
      
      if (!firebaseUid) {
        return res.status(401).json({ 
        success: false,
          message: 'Firebase UID not found in request' 
        });
      }

      console.log('Getting profile for Firebase UID:', firebaseUid);
      
      // Get user profile from MongoDB via service
      const user = await userService.getUserByFirebaseUid(firebaseUid);
      
      if (!user) {
        return res.status(404).json({ 
        success: false,
          message: 'User not found' 
        });
      }
      
      res.json({ 
        success: true,
        user: user 
      });
    } catch (error) {
      console.error('Error fetching user profile:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Update user profile by Firebase UID
  async updateUserProfile(req, res) {
    try {
      // Get Firebase UID from the authenticated request
      const firebaseUid = req.user?.firebaseUid;

      if (!firebaseUid) {
        return res.status(401).json({ 
          success: false,
          message: 'Firebase UID not found in request' 
        });
      }

      const profileData = req.body;
      console.log('Updating profile for Firebase UID:', firebaseUid);
      console.log('Profile data:', profileData);

      // Update MongoDB first via service
      const updatedUser = await userService.updateUserProfileByFirebaseUid(firebaseUid, profileData);
      
      // Update Firebase profile if name fields changed
      if (profileData.firstName || profileData.lastName) {
        try {
          const auth = getAuth();
          const newDisplayName = `${profileData.firstName || updatedUser.firstName} ${profileData.lastName || updatedUser.lastName}`.trim();
          
          await auth.updateUser(firebaseUid, {
            displayName: newDisplayName
          });
          
          console.log('✅ Firebase profile updated successfully');
        } catch (firebaseError) {
          console.error('❌ Firebase profile update failed:', firebaseError);
        }
      }
      
      res.json({ 
        success: true,
        message: 'Profile updated successfully',
        user: updatedUser
      });
    } catch (error) {
      console.error('Error updating user profile:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Debug endpoint to check if user exists
  async debugUser(req, res) {
    try {
      const { firebaseUid } = req.params;
      
      console.log('Debug: Checking for user with firebaseUid:', firebaseUid);
      
      const user = await userService.getUserByFirebaseUid(firebaseUid);
      
      if (!user) {
        // List all users in the database for debugging
        const allUsers = await userService.getAllUsersForDebug();
        console.log('Debug: User not found. All users in database:', allUsers);
        
        return res.status(404).json({
          message: 'User not found',
          debug: {
            searchedFor: firebaseUid,
            totalUsers: allUsers.length,
            allUsers: allUsers
          }
        });
      }
      
      res.json({ 
        success: true,
        user: {
          id: user._id,
          firebaseUid: user.firebaseUid,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          isFirebaseUser: user.isFirebaseUser
        }
      });
    } catch (error) {
      console.error('Debug: Error checking user:', error);
      res.status(500).json({
        success: false,
        error: error.message,
        debug: {
          searchedFor: req.params.firebaseUid
        }
      });
    }
  }
}

module.exports = new UserController();
