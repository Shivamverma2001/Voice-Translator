require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const { connectDB, mongoose } = require('../db/connection');
const Theme = require('../models/Theme');
const { themes } = require('../master/themes'); // Import from master file

async function seedThemes() {
  try {
    console.log('🌱 Starting theme seeding...');

    // Connect to database
    await connectDB();

    // Clear existing themes
    await Theme.deleteMany({});
    console.log('🗑️ Cleared existing themes');

    // Convert master themes object to array format for seeding
    const initialThemes = Object.values(themes).map(theme => ({
      id: theme.id,
      name: theme.name,
      displayName: theme.displayName,
      description: theme.description,
      icon: theme.icon,
      category: theme.category,
      colors: theme.colors,
      colorsApp: theme.colorsApp,
      isActive: theme.isActive
    }));

    // Insert new themes
    const seededThemes = await Theme.insertMany(initialThemes);
    console.log(`✅ Successfully seeded ${seededThemes.length} themes`);

    // Display seeded themes by category
    console.log('\n📋 Seeded Themes by Category:');
    const categories = [...new Set(seededThemes.map(t => t.category))].sort();
    
    categories.forEach(category => {
      console.log(`\n  ${category}:`);
      const categoryThemes = seededThemes.filter(t => t.category === category);
      categoryThemes.forEach(theme => {
        console.log(`    ${theme.icon} ${theme.displayName} - ${theme.description}`);
      });
    });

    console.log('\n🎉 Theme seeding completed successfully!');

  } catch (error) {
    console.error('❌ Error seeding themes:', error);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
}

// Run the seeding
seedThemes();
