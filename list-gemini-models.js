require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function listModels() {
  if (!process.env.GEMINI_API_KEY) {
    console.error('❌ GEMINI_API_KEY environment variable is required');
    return;
  }
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  try {
    const models = await genAI.listModels();
    console.log('Available models for your key:');
    for (const model of models) {
      console.log(model.name);
    }
  } catch (error) {
    console.error('❌ Error listing models:', error.message);
    console.error(error);
  }
}

listModels();