const express = require('express');
const app = express();

// Test the route loading
try {
  const documentRoute = require('./backend/routes/documentTranslate.js');
  console.log('✅ Document route loaded successfully');
  console.log('Route object:', typeof documentRoute);
} catch (error) {
  console.error('❌ Error loading document route:', error.message);
}

// Test basic express setup
app.use('/api/document-translate', require('./backend/routes/documentTranslate.js'));

app.get('/test', (req, res) => {
  res.json({ message: 'Document route test endpoint working' });
});

const PORT = 5002;
app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
  console.log('Try: curl http://localhost:5002/test');
});
