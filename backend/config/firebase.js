const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
let firebaseApp;

const initializeFirebase = () => {
  try {
    // Check if Firebase is already initialized
    if (firebaseApp) {
      console.log('✅ Firebase already initialized');
      return firebaseApp;
    }

    // Check if we have service account credentials
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH) {
      // Read the service account key from JSON file
      const fs = require('fs');
      const path = require('path');
      const serviceAccountPath = path.resolve(process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH);
      
      if (!fs.existsSync(serviceAccountPath)) {
        throw new Error(`Firebase service account file not found: ${serviceAccountPath}`);
      }
      
      const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
      
      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: process.env.FIREBASE_DATABASE_URL || `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`
      });
    } else if (process.env.FIREBASE_PROJECT_ID) {
      // Use default credentials (for Google Cloud environments)
      firebaseApp = admin.initializeApp({
        projectId: process.env.FIREBASE_PROJECT_ID
      });
    } else {
      throw new Error('Firebase configuration not found. Please set FIREBASE_SERVICE_ACCOUNT_KEY_PATH or FIREBASE_PROJECT_ID');
    }

    console.log('✅ Firebase Admin SDK initialized successfully');
    return firebaseApp;
  } catch (error) {
    console.error('❌ Firebase initialization failed:', error);
    throw error;
  }
};

// Get Firebase Auth instance
const getAuth = () => {
  if (!firebaseApp) {
    throw new Error('Firebase not initialized. Call initializeFirebase() first.');
  }
  return admin.auth();
};

// Get Firestore instance (if needed)
const getFirestore = () => {
  if (!firebaseApp) {
    throw new Error('Firebase not initialized. Call initializeFirebase() first.');
  }
  return admin.firestore();
};

// Verify Firebase ID token
const verifyIdToken = async (idToken) => {
  try {
    const auth = getAuth();
    const decodedToken = await auth.verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    console.error('❌ Firebase token verification failed:', error);
    throw error;
  }
};

// Get user by Firebase UID
const getUserByUid = async (uid) => {
  try {
    const auth = getAuth();
    const userRecord = await auth.getUser(uid);
    return userRecord;
  } catch (error) {
    console.error('❌ Failed to get Firebase user:', error);
    throw error;
  }
};

// Update Firebase user profile
const updateFirebaseUserProfile = async (uid, updateData) => {
  try {
    const auth = getAuth();
    
    // Prepare the update object with only Firebase-allowed fields
    const firebaseUpdateData = {};
    
    // Only update displayName if firstName or lastName changed
    if (updateData.firstName !== undefined || updateData.lastName !== undefined) {
      firebaseUpdateData.displayName = `${updateData.firstName || ''} ${updateData.lastName || ''}`.trim();
    }
    
    // Only proceed if we have data to update
    if (Object.keys(firebaseUpdateData).length > 0) {
      // Update the Firebase user profile
      const updateResult = await auth.updateUser(uid, firebaseUpdateData);
      console.log('✅ Firebase user profile updated successfully:', updateResult.uid);
      return updateResult;
    } else {
      console.log('ℹ️ No Firebase fields to update');
      return null;
    }
  } catch (error) {
    console.error('❌ Failed to update Firebase user profile:', error);
    throw error;
  }
};

// Create custom token (if needed)
const createCustomToken = async (uid, additionalClaims = {}) => {
  try {
    const auth = getAuth();
    const customToken = await auth.createCustomToken(uid, additionalClaims);
    return customToken;
  } catch (error) {
    console.error('❌ Failed to create custom token:', error);
    throw error;
  }
};

module.exports = {
  initializeFirebase,
  getAuth,
  getFirestore,
  verifyIdToken,
  getUserByUid,
  updateFirebaseUserProfile,
  createCustomToken
};
