require('dotenv').config();
const { connectDB, mongoose } = require('../db/connection');

// Import all models
const CountryCode = require('../models/CountryCode');
const Language = require('../models/Language');
const Country = require('../models/Country');
const Gender = require('../models/Gender');
const Voice = require('../models/Voice');
const Theme = require('../models/Theme');

// Import all master data
const { countryCodes } = require('../master/countryCodes');
const { languages } = require('../master/languages');
const { countries } = require('../master/countries');
const { genders } = require('../master/genders');
const { voices } = require('../master/voices');
const { themes } = require('../master/themes');

async function seedAllMasterData() {
  try {
    console.log('🌱 Starting complete master data seeding...\n');

    // Connect to database
    await connectDB();

    // Clear all existing master data
    console.log('🗑️ Clearing existing master data...');
    await Promise.all([
      CountryCode.deleteMany({}),
      Language.deleteMany({}),
      Country.deleteMany({}),
      Gender.deleteMany({}),
      Voice.deleteMany({}),
      Theme.deleteMany({})
    ]);
    console.log('✅ Cleared all existing master data\n');

    // Seed Country Codes
    console.log('🌍 Seeding country codes...');
    const countryCodeData = Object.values(countryCodes).map(code => ({
      country: code.country,
      countryCode: code.countryCode,
      dialingCode: code.dialingCode,
      isActive: code.isActive
    }));
    const seededCountryCodes = await CountryCode.insertMany(countryCodeData);
    console.log(`✅ Seeded ${seededCountryCodes.length} country codes`);

    // Seed Languages
    console.log('🗣️ Seeding languages...');
    const languageData = Object.values(languages).map(lang => ({
      code: lang.code,
      name: lang.name,
      nativeName: lang.nativeName,
      isActive: lang.isActive
    }));
    const seededLanguages = await Language.insertMany(languageData);
    console.log(`✅ Seeded ${seededLanguages.length} languages`);

    // Seed Countries
    console.log('🌎 Seeding countries...');
    const countryData = Object.values(countries).map(country => ({
      code: country.code,
      name: country.name,
      isActive: country.isActive
    }));
    const seededCountries = await Country.insertMany(countryData);
    console.log(`✅ Seeded ${seededCountries.length} countries`);

    // Seed Genders
    console.log('👥 Seeding genders...');
    const genderData = Object.values(genders).map(gender => ({
      id: gender.id,
      name: gender.name,
      displayName: gender.displayName,
      description: gender.description,
      isActive: gender.isActive
    }));
    const seededGenders = await Gender.insertMany(genderData);
    console.log(`✅ Seeded ${seededGenders.length} genders`);

    // Seed Voices
    console.log('🎤 Seeding voices...');
    const voiceData = Object.values(voices).map(voice => ({
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
    const seededVoices = await Voice.insertMany(voiceData);
    console.log(`✅ Seeded ${seededVoices.length} voices`);

    // Seed Themes
    console.log('🎨 Seeding themes...');
    const themeData = Object.values(themes).map(theme => ({
      id: theme.id,
      name: theme.name,
      displayName: theme.displayName,
      description: theme.description,
      icon: theme.icon,
      category: theme.category,
      colors: theme.colors,
      isActive: theme.isActive
    }));
    const seededThemes = await Theme.insertMany(themeData);
    console.log(`✅ Seeded ${seededThemes.length} themes`);

    // Summary
    console.log('\n📊 Seeding Summary:');
    console.log(`  🌍 Country Codes: ${seededCountryCodes.length}`);
    console.log(`  🗣️ Languages: ${seededLanguages.length}`);
    console.log(`  🌎 Countries: ${seededCountries.length}`);
    console.log(`  👥 Genders: ${seededGenders.length}`);
    console.log(`  🎤 Voices: ${seededVoices.length}`);
    console.log(`  🎨 Themes: ${seededThemes.length}`);
    console.log(`  📈 Total Records: ${seededCountryCodes.length + seededLanguages.length + seededCountries.length + seededGenders.length + seededVoices.length + seededThemes.length}`);

    console.log('\n🎉 Complete master data seeding completed successfully!');

  } catch (error) {
    console.error('❌ Error seeding master data:', error);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
}

// Run the seeding
seedAllMasterData();
