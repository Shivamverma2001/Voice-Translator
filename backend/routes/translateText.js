const express = require('express');
const https = require('https');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const router = express.Router();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// A map to get the full language name from its code
const languageNames = {
  en: 'English',
  es: 'Spanish',
  fr: 'French',
  de: 'German',
  it: 'Italian',
  pt: 'Portuguese',
  ru: 'Russian',
  ja: 'Japanese',
  ko: 'Korean',
  zh: 'Chinese (Mandarin)',
  ar: 'Arabic',
  hi: 'Hindi',
  sa: 'Sanskrit',
  mr: 'Marathi',
  te: 'Telugu',
  ml: 'Malayalam',
  ur: 'Urdu',
  pa: 'Punjabi',
};

// Intelligent text cleaning using Gemini AI with rate limiting
async function cleanTextWithGemini(text, language = 'en') {
  if (!text || !text.trim()) return text;
  
  const languageName = languageNames[language] || 'the user\'s language';
  
  
  try {
    if (!process.env.GEMINI_API_KEY) {
      console.error('❌ GEMINI_API_KEY not found in environment');
      return cleanTextBasic(text);
    }
    
    
    const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-flash-latest" });
    
    const prompt = `A user is writing ${languageName}. Please clean and improve the following text to sound like natural human speech:

IMPORTANT RULES:
1. Fix ALL spacing issues - ensure proper spaces between words, after punctuation
2. Add proper punctuation (periods, commas, question marks, exclamation marks)
3. Capitalize the first letter of sentences and proper nouns
4. Fix grammar and make sentences complete and natural
5. Preserve the original language and any natural code-switching
6. Remove any transcription artifacts or repeated words
7. Make the text sound like natural human conversation
8. Use conversational language - add natural pauses, filler words if appropriate
9. Keep the tone casual and friendly, like someone actually speaking
10. Maintain the speaker's personality and speaking style

LANGUAGE-SPECIFIC RULES:
- For English: Add question marks for questions, proper articles (a, an, the), subject-verb agreement
- For Hindi: Use proper Hindi punctuation (। for periods, ? for questions), maintain Hindi grammar structure
- For Spanish: Use proper Spanish punctuation (¿ for questions, ¡ for exclamations), maintain Spanish grammar
- For other languages: Use appropriate punctuation and grammar rules for that specific language
- Always preserve the natural speaking style and cultural context of the language

PUNCTUATION & GRAMMAR:
- Identify if the text is a question, statement, or exclamation based on context and language
- Add appropriate punctuation marks for the specific language
- Fix grammar according to the language's rules
- Make sentences complete and natural sounding
- Preserve any code-switching between languages

Original text: "${text}"

Return only the cleaned text, with no extra explanations or quotes.`;

    
    const result = await model.generateContent(prompt);
    const cleanedText = result.response.text().trim();
    
    
    return cleanedText;
  } catch (error) {
    console.error('❌ Gemini text cleaning error:', error);
    console.error('Error details:', error.message);
    
    // Handle rate limiting specifically
    if (error.status === 429) {

      return cleanTextBasic(text);
    }
    
    // Fallback to basic cleaning if Gemini fails
    return cleanTextBasic(text);
  }
}

// Basic fallback text cleaning function
function cleanTextBasic(text) {
  if (!text) return text;
  
  
  
  // Basic spacing fixes
  let cleaned = text
    // Fix common text patterns
    .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space between camelCase
    .replace(/([a-z])(\d)/g, '$1 $2') // Add space between letters and numbers
    .replace(/(\d)([a-z])/g, '$1 $2') // Add space between numbers and letters
    // Fix specific text issues
    .replace(/([a-z]+)([A-Z][a-z]+)/g, '$1 $2') // mynameIs → my name Is
    .replace(/([a-z])([A-Z][a-z]+)/g, '$1 $2') // myName → my Name
    // Fix spacing issues
    .replace(/\s+/g, ' ') // Normalize multiple spaces
    .trim();
  
  // Add proper punctuation if missing (handle Hindi and other languages)
  if (!cleaned.match(/[.!?।]$/)) {
    // Check if it's a question and add appropriate punctuation
    const questionWords = ['what', 'when', 'where', 'who', 'why', 'how', 'can', 'could', 'would', 'will', 'do', 'does', 'tell', 'explain', 'describe', 'kya', 'kaise', 'kahan', 'kab', 'kaun'];
    const isQuestion = questionWords.some(word => cleaned.toLowerCase().includes(word));
    
    if (isQuestion) {
      cleaned = cleaned + '?';
    } else {
      cleaned = cleaned + '.';
    }
  }
  
  // Add spaces around punctuation
  cleaned = cleaned
    .replace(/([.!?,:;])/g, ' $1 ')
    .replace(/\s+/g, ' ')
    .trim();
  
  // Capitalize first letter of sentences and proper nouns
  cleaned = cleaned.replace(/(^|\.\s+)([a-z])/g, (match, p1, p2) => p1 + p2.toUpperCase());
  
  // Fix spacing around punctuation
  cleaned = cleaned
    .replace(/\s+([.!?,:;])/g, '$1') // Remove spaces before punctuation
    .replace(/([.!?,:;])\s+/g, '$1 ') // Ensure space after punctuation
    .replace(/\s+/g, ' ') // Normalize multiple spaces
    .trim();
  
  // Remove duplicate words (simple approach)
  const words = cleaned.split(' ');
  const uniqueWords = [];
  for (let i = 0; i < words.length; i++) {
    if (i === 0 || words[i] !== words[i-1]) {
      uniqueWords.push(words[i]);
    }
  }
  cleaned = uniqueWords.join(' ');
  
  
  return cleaned;
}

// Free translation using Google Translate web service (no API key needed)
function translateWithGoogle(text, targetLang) {
  return new Promise((resolve, reject) => {
    // Map language names to Google Translate codes
    const langMap = {
      'spanish': 'es',
      'es': 'es',
      'french': 'fr', 
      'fr': 'fr',
      'german': 'de',
      'de': 'de',
      'italian': 'it',
      'it': 'it',
      'portuguese': 'pt',
      'pt': 'pt',
      'russian': 'ru',
      'ru': 'ru',
      'japanese': 'ja',
      'ja': 'ja',
      'korean': 'ko',
      'ko': 'ko',
      'chinese': 'zh',
      'zh': 'zh',
      'hindi': 'hi',
      'hi': 'hi',
      'arabic': 'ar',
      'ar': 'ar',
      'english': 'en',
      'en': 'en',
      'marathi': 'mr',
      'mr': 'mr',
      'telugu': 'te',
      'te': 'te',
      'malayalam': 'ml',
      'ml': 'ml',
      'urdu': 'ur',
      'ur': 'ur'
    };

    const targetCode = langMap[targetLang.toLowerCase()] || targetLang;
    
    // Use Google Translate's free web service
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetCode}&dt=t&q=${encodeURIComponent(text)}`;
    

    
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        let data = '';
        response.on('data', (chunk) => data += chunk);
        response.on('end', () => {
          try {
            // Parse the response (Google Translate returns a complex array)
            const result = JSON.parse(data);
            
            // Handle different response structures
            let translation = '';
            if (result && result[0] && Array.isArray(result[0])) {
              // Extract all translation parts and join them
              translation = result[0]
                .filter(item => item && item[0]) // Filter out null/undefined items
                .map(item => item[0]) // Get the translation text
                .join(''); // Join all parts
            } else if (result && typeof result === 'string') {
              translation = result;
            } else {
              throw new Error('Unexpected response structure');
            }
            
    
            resolve(translation);
          } catch (error) {
            console.error('❌ Parse error:', error);
            console.error('Raw data:', data);
            reject(new Error(`Failed to parse translation response: ${error.message}`));
          }
        });
      } else {
        console.error(`❌ HTTP error: ${response.statusCode}`);
        reject(new Error(`HTTP ${response.statusCode}`));
      }
    }).on('error', (error) => {
      console.error('❌ Network error:', error);
      reject(error);
    });
  });
}

router.post('/', async (req, res) => {
  const { text, targetLang, sourceLang = 'en' } = req.body;

  if (!text || !targetLang) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // First, clean the transcribed text using Gemini AI
    const cleanedText = await cleanTextWithGemini(text, sourceLang);
    
    const translation = await translateWithGoogle(cleanedText, targetLang);
    res.json({ 
      translatedText: translation,
      cleanedText: cleanedText 
    });
  } catch (error) {
    console.error('Translation Error:', error);
    res.status(500).json({ error: 'Translation failed' });
  }
});



module.exports = router;
