require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const { connectDB, mongoose } = require('../db/connection');
const Gender = require('../models/Gender');
const { genders } = require('../master/genders'); // Import from master file

async function seedGenders() {
  try {
    console.log('🌱 Starting gender seeding...');

    // Connect to database
    await connectDB();

    // Clear existing genders
    await Gender.deleteMany({});
    console.log('🗑️ Cleared existing genders');

    // Convert master genders object to array format for seeding
    const initialGenders = Object.values(genders).map(gender => ({
      id: gender.id,
      name: gender.name,
      displayName: gender.displayName,
      description: gender.description,
      isActive: gender.isActive
    }));

    // Insert new genders
    const seededGenders = await Gender.insertMany(initialGenders);
    console.log(`✅ Successfully seeded ${seededGenders.length} genders`);

    // Display seeded genders
    console.log('\n📋 Seeded Genders:');
    seededGenders.forEach(gender => {
      console.log(`  ${gender.displayName} - ${gender.description}`);
    });

    console.log('\n🎉 Gender seeding completed successfully!');

  } catch (error) {
    console.error('❌ Error seeding genders:', error);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
}

// Run the seeding
seedGenders();
