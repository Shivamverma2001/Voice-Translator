require('dotenv').config();
const { connectDB, mongoose } = require('../db/connection');
const Country = require('../models/Country');
const { countries } = require('../master/countries'); // Import from master file

async function seedCountries() {
  try {
    console.log('🌱 Starting country seeding...');

    // Connect to database
    await connectDB();

    // Clear existing countries
    await Country.deleteMany({});
    console.log('🗑️ Cleared existing countries');

    // Convert master countries object to array format for seeding
    const initialCountries = Object.values(countries).map(country => ({
      name: country.name,
      isActive: country.isActive
    }));

    // Insert new countries
    const seededCountries = await Country.insertMany(initialCountries);
    console.log(`✅ Successfully seeded ${seededCountries.length} countries`);

    // Display seeded countries
    console.log('\n📋 Seeded Countries:');
    seededCountries.forEach(country => {
      console.log(`  ${country.name}`);
    });

    console.log('\n🎉 Country seeding completed successfully!');

  } catch (error) {
    console.error('❌ Error seeding countries:', error);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
}

// Run the seeding
seedCountries();
