const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { Translate } = require('@google-cloud/translate').v2;

const router = express.Router();

// Configure multer for image uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
});

// Initialize Google AI and Translate
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const translate = new Translate({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  keyFilename: process.env.GOOGLE_CLOUD_KEY_FILE,
});

// Language mapping for translation
const languages = {
  'en-US': 'English',
  'en': 'English',
  'es': 'Spanish',
  'fr': 'French',
  'de': 'German',
  'it': 'Italian',
  'pt': 'Portuguese',
  'ru': 'Russian',
  'ja': 'Japanese',
  'ko': 'Korean',
  'zh': 'Chinese',
  'ar': 'Arabic',
  'hi': 'Hindi',
  'sa': 'Sanskrit',
  'mr': 'Marathi',
  'te': 'Telugu',
  'ml': 'Malayalam',
  'ur': 'Urdu',
  'pa': 'Punjabi',
};

router.post('/', upload.single('image'), async (req, res) => {
  try {
    
    
    if (!req.file) {

      return res.status(400).json({ error: 'No image file uploaded' });
    }

    const { targetLang = 'es', sourceLang = 'en' } = req.body;
    


    // Process image with sharp to optimize for OCR
    let processedImageBuffer;
    try {
  
      processedImageBuffer = await sharp(req.file.buffer)
        .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 85 })
        .toBuffer();
      
      
      
    } catch (sharpError) {
      console.error('❌ Image processing error:', sharpError);
      return res.status(500).json({ error: 'Failed to process image: ' + sharpError.message });
    }

    // Convert to base64 for Gemini
    const base64Image = processedImageBuffer.toString('base64');
    const mimeType = req.file.mimetype;

    // Extract text from image using Gemini Vision
    let extractedText = '';
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      const prompt = `Please extract all text from this image. Return only the extracted text without any additional commentary or formatting. If there's no text in the image, return "No text found".`;
      
      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            data: base64Image,
            mimeType: mimeType,
          },
        },
      ]);

      const response = await result.response;
      extractedText = response.text().trim();
      
      
      
      if (!extractedText || extractedText === 'No text found') {
        return res.json({
          extractedText: 'No text found in the image',
          translatedText: '',
          cleanedText: '',
        });
      }
    } catch (geminiError) {
      console.error('❌ Gemini Vision error:', geminiError);
      return res.status(500).json({ error: 'Failed to extract text from image: ' + geminiError.message });
    }

    // Clean the extracted text using Gemini
    let cleanedText = extractedText;
    try {
      const textModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      const cleaningPrompt = `Please clean and correct the following text extracted from an image. Fix any OCR errors, remove artifacts, and ensure proper formatting. Return only the cleaned text:

Text: "${extractedText}"

Cleaned text:`;
      
      const cleaningResult = await textModel.generateContent(cleaningPrompt);
      const cleaningResponse = await cleaningResult.response;
      cleanedText = cleaningResponse.text().trim();
      
      
    } catch (cleaningError) {
      console.error('❌ Text cleaning error:', cleaningError);
      // Continue with original text if cleaning fails
      cleanedText = extractedText;
    }

    // Translate the cleaned text using Gemini (free alternative)
    let translatedText = '';
    try {
      const sourceLanguageName = languages[sourceLang] || 'English';
      const targetLanguageName = languages[targetLang] || 'Spanish';
      
      const translationModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      const translationPrompt = `Translate the following text from ${sourceLanguageName} to ${targetLanguageName}. Return only the translated text without any additional commentary or formatting:

Text: "${cleanedText}"

Translation:`;
      
      const translationResult = await translationModel.generateContent(translationPrompt);
      const translationResponse = await translationResult.response;
      translatedText = translationResponse.text().trim();
      
      
    } catch (translationError) {
      console.error('❌ Translation error:', translationError);
      return res.status(500).json({ error: 'Failed to translate text: ' + translationError.message });
    }

    res.json({
      extractedText: extractedText,
      cleanedText: cleanedText,
      translatedText: translatedText,
    });

  } catch (error) {
    console.error('❌ Image translation error:', error);
    res.status(500).json({ error: 'Image translation failed: ' + error.message });
  }
});

module.exports = router; 