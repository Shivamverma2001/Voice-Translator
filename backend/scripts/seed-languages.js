require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const { connectDB, mongoose } = require('../db/connection');
const Language = require('../models/Language');
const { languages } = require('../master/languages');

async function seedLanguages() {
  try {
    console.log('🌱 Starting language seeding...');
    
    // Connect to database
    await connectDB();
    
    // Clear existing languages
    await Language.deleteMany({});
    console.log('🗑️ Cleared existing languages');
    
    // Convert master languages object to array format for seeding
    const initialLanguages = Object.values(languages).map(lang => ({
      shortcode: lang.shortcode,
      name: lang.name,
      country: lang.country,
      isActive: lang.isActive
    }));
    
    // Insert new languages
    const seededLanguages = await Language.insertMany(initialLanguages);
    console.log(`✅ Successfully seeded ${seededLanguages.length} languages`);
    
    // Display seeded languages
    console.log('\n📋 Seeded Languages:');
    seededLanguages.forEach(lang => {
      console.log(`  ${lang.shortcode} - ${lang.name} (${lang.country})`);
    });
    
    console.log('\n🎉 Language seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding languages:', error);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
}

// Run the seeding
seedLanguages();
