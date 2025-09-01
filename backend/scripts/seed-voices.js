require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const { connectDB, mongoose } = require('../db/connection');
const Voice = require('../models/Voice');
const { voices } = require('../master/voices'); // Import from master file

async function seedVoices() {
  try {
    console.log('🌱 Starting voice seeding...');

    // Connect to database
    await connectDB();

    // Clear existing voices
    await Voice.deleteMany({});
    console.log('🗑️ Cleared existing voices');

    // Convert master voices object to array format for seeding
    const initialVoices = Object.values(voices).map(voice => ({
      id: voice.id,
      name: voice.name,
      displayName: voice.displayName,
      language: voice.language,
      country: voice.country,
      gender: voice.gender,
      accent: voice.accent,
      description: voice.description,
      isActive: voice.isActive
    }));

    // Insert new voices
    const seededVoices = await Voice.insertMany(initialVoices);
    console.log(`✅ Successfully seeded ${seededVoices.length} voices`);

    // Display seeded voices by language
    console.log('\n📋 Seeded Voices by Language:');
    const languages = [...new Set(seededVoices.map(v => v.language))].sort();
    
    languages.forEach(language => {
      console.log(`\n  ${language}:`);
      const languageVoices = seededVoices.filter(v => v.language === language);
      languageVoices.forEach(voice => {
        console.log(`    ${voice.displayName} (${voice.gender})`);
      });
    });

    console.log('\n🎉 Voice seeding completed successfully!');

  } catch (error) {
    console.error('❌ Error seeding voices:', error);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
}

// Run the seeding
seedVoices();
