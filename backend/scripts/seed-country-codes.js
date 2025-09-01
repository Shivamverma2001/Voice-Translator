require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const { connectDB, mongoose } = require('../db/connection');
const CountryCode = require('../models/CountryCode');
const { countryCodes } = require('../master/countryCodes'); // Import from master file

async function seedCountryCodes() {
  try {
    console.log('🌱 Starting country code seeding...');

    // Connect to database
    await connectDB();

    // Clear existing country codes
    await CountryCode.deleteMany({});
    console.log('🗑️ Cleared existing country codes');

    // Convert master country codes object to array format for seeding
    const initialCountryCodes = Object.values(countryCodes).map(code => ({
      country: code.country,
      countryCode: code.countryCode,
      dialingCode: code.dialingCode,
      isActive: code.isActive
    }));

    // Insert new country codes
    const seededCountryCodes = await CountryCode.insertMany(initialCountryCodes);
    console.log(`✅ Successfully seeded ${seededCountryCodes.length} country codes`);

    // Display seeded country codes
    console.log('\n📋 Seeded Country Codes:');
    seededCountryCodes.forEach(code => {
      console.log(`  ${code.country} (${code.dialingCode})`);
    });

    console.log('\n🎉 Country code seeding completed successfully!');

  } catch (error) {
    console.error('❌ Error seeding country codes:', error);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
}

// Run the seeding
seedCountryCodes();
