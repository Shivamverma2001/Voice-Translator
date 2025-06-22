require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGemini() {
  console.log('🧪 Testing Gemini API integration...');
  
  if (!process.env.GEMINI_API_KEY) {
    console.error('❌ GEMINI_API_KEY environment variable is required');
    return;
  }

  console.log('✅ GEMINI_API_KEY found');
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  const testText = "Hello, myname ismarama. Iam afull stackdeveloperexperiencebuildingscalable andreal timeprojects.";
  
  console.log('📝 Original text:', testText);
  
  // Try different model names
  const modelNames = [
    "models/gemini-1.0-pro-latest",
    "gemini-1.0-pro-latest", 
    "models/gemini-1.5-flash-latest",
    "gemini-1.5-flash-latest",
    "models/gemini-1.5-pro-latest",
    "gemini-1.5-pro-latest",
    "models/gemini-pro",
    "gemini-pro"
  ];

  for (const modelName of modelNames) {
    console.log(`\n🔍 Testing model: ${modelName}`);
    
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      
      const prompt = `Please clean and improve this transcribed speech text. Fix spacing, punctuation, capitalization, and grammar while preserving the original meaning. Make it sound natural and well-formatted.

Original text: "${testText}"

Please return only the cleaned text without any explanations or quotes.`;

      console.log('📤 Sending request to Gemini...');
      const result = await model.generateContent(prompt);
      const cleanedText = result.response.text().trim();
      
      console.log('✨ Cleaned text:', cleanedText);
      console.log(`✅ SUCCESS! Model "${modelName}" works!`);
      
      // If we get here, this model works - use it
      console.log(`\n🎉 Use this model name in your app: "${modelName}"`);
      return;
      
    } catch (error) {
      console.log(`❌ Model "${modelName}" failed: ${error.message}`);
    }
  }
  
  console.log('\n❌ None of the tested models worked. Please check your API key.');
}

testGemini(); 