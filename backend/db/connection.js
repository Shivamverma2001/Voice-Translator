const mongoose = require('mongoose');

// MongoDB connection configuration - MUST be set in .env file
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI environment variable is required');
  console.error('Please add MONGODB_URI to your .env file');
  process.exit(1);
}

// Connection options for production
const connectionOptions = {
  maxPoolSize: parseInt(process.env.MONGODB_MAX_POOL_SIZE) || 10,
  serverSelectionTimeoutMS: parseInt(process.env.MONGODB_SERVER_SELECTION_TIMEOUT) || 5000,
  socketTimeoutMS: parseInt(process.env.MONGODB_SOCKET_TIMEOUT) || 45000,
  autoIndex: process.env.NODE_ENV !== 'production', // Only create indexes in development
  retryWrites: true,
  w: 'majority'
};

// Connection event handlers
mongoose.connection.on('connected', () => {
  console.log('✅ MongoDB connected successfully');
  console.log(`📍 Database: ${mongoose.connection.name}`);
  console.log(`🔌 Host: ${mongoose.connection.host}`);
  console.log(`🚪 Port: ${mongoose.connection.port}`);
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err);
  console.error('🔍 Check your MongoDB connection string and network connectivity');
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ MongoDB disconnected');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  try {
    console.log('\n🔄 Shutting down gracefully...');
    await mongoose.connection.close();
    console.log('✅ MongoDB connection closed through app termination');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error during MongoDB shutdown:', err);
    process.exit(1);
  }
});

process.on('SIGTERM', async () => {
  try {
    console.log('\n🔄 Received SIGTERM, shutting down gracefully...');
    await mongoose.connection.close();
    console.log('✅ MongoDB connection closed through SIGTERM');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error during MongoDB shutdown:', err);
    process.exit(1);
  }
});

// Connect to MongoDB
const connectDB = async () => {
  try {
    console.log('🔌 Attempting to connect to MongoDB...');
    console.log(`📍 URI: ${MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')}`); // Hide credentials in logs
    
    await mongoose.connect(MONGODB_URI, connectionOptions);
    console.log('✅ MongoDB connection established successfully');
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error.message);
    console.error('🔍 Please check:');
    console.error('   - MongoDB server is running');
    console.error('   - Connection string is correct');
    console.error('   - Network connectivity');
    console.error('   - Firewall settings');
    process.exit(1);
  }
};

module.exports = { connectDB, mongoose };
