// Route Initialization
// This file centralizes all route mounting for the Express app

/**
 * Initialize all routes for the Express app
 * @param {Express} app - Express app instance
 */
const initializeRoutes = (app) => {
  // Firebase authentication routes are mounted in the main API router

  // Mount API routes
  app.use('/api', require('./index'));

  // Root redirect
  app.get('/', (req, res) => {
    res.redirect('/api');
  });

  console.log('✅ All routes initialized successfully');
};

module.exports = {
  initializeRoutes
};
