const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const { GoogleGenerativeAI } = require('@google/generative-ai');
let pdfParse; // lazy require to avoid startup cost if unused
let mammoth; // lazy require

const router = express.Router();

// Memory storage for mixed uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB per file
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Helper: translate using Gemini text model (keeps stack free)
async function translateWithGemini(text, sourceLangName, targetLangName) {
  if (!text || !text.trim()) return '';
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const prompt = `Translate the following text from ${sourceLangName} to ${targetLangName}. Return only the translated text without any additional commentary or formatting:\n\nText: "${text}"\n\nTranslation:`;
  const result = await model.generateContent(prompt);
  return result.response.text().trim();
}

// Helper: clean text using Gemini (optional, improves OCR results)
async function cleanWithGemini(text) {
  if (!text || !text.trim()) return text;
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const prompt = `Clean and correct the following text, fixing OCR/transcription artifacts. Return only the cleaned text.\n\nText: "${text}"\n\nCleaned:`;
  const result = await model.generateContent(prompt);
  return result.response.text().trim();
}

// Basic language name map for display/prompt context
const languages = {
  'en-US': 'English', 'en': 'English', 'es': 'Spanish', 'fr': 'French', 'de': 'German',
  'it': 'Italian', 'pt': 'Portuguese', 'ru': 'Russian', 'ja': 'Japanese', 'ko': 'Korean',
  'zh': 'Chinese', 'ar': 'Arabic', 'hi': 'Hindi', 'sa': 'Sanskrit', 'mr': 'Marathi',
  'te': 'Telugu', 'ml': 'Malayalam', 'ur': 'Urdu', 'pa': 'Punjabi', 'bn': 'Bengali',
};

async function extractFromImage(buffer, mimeType) {
  // Optimize image before OCR
  const processed = await sharp(buffer)
    .resize(1600, 1600, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 85 })
    .toBuffer();

  const base64Image = processed.toString('base64');
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const prompt = 'Extract all text from this image. Return only the text.';
  const result = await model.generateContent([
    prompt,
    { inlineData: { data: base64Image, mimeType: mimeType || 'image/jpeg' } },
  ]);
  return (await result.response).text().trim();
}

async function extractFromPdf(buffer) {
  if (!pdfParse) pdfParse = require('pdf-parse');
  const data = await pdfParse(buffer);
  return (data.text || '').trim();
}

async function extractFromDocx(buffer) {
  if (!mammoth) mammoth = require('mammoth');
  const result = await mammoth.extractRawText({ buffer });
  return (result.value || '').trim();
}

async function extractFromTxt(buffer) {
  return buffer.toString('utf8');
}

router.post('/', upload.array('documents', 10), async (req, res) => {
  try {
    const files = req.files || [];
    const { targetLang = 'es', sourceLang = 'en' } = req.body;

    if (files.length === 0) {
      return res.status(400).json({ error: 'No documents uploaded' });
    }

    const sourceLanguageName = languages[sourceLang] || 'English';
    const targetLanguageName = languages[targetLang] || 'Spanish';

    const results = [];

    for (const file of files) {
      const { originalname, mimetype, buffer } = file;
      let extractedText = '';

      try {
        if (mimetype.startsWith('image/')) {
          extractedText = await extractFromImage(buffer, mimetype);
        } else if (mimetype === 'application/pdf') {
          extractedText = await extractFromPdf(buffer);
        } else if (
          mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
          originalname.toLowerCase().endsWith('.docx')
        ) {
          extractedText = await extractFromDocx(buffer);
        } else if (mimetype === 'text/plain' || originalname.toLowerCase().endsWith('.txt')) {
          extractedText = await extractFromTxt(buffer);
        } else {
          // As a last resort, try Gemini Vision even if unknown mimetype
          if (mimetype && mimetype.startsWith('image/')) {
            extractedText = await extractFromImage(buffer, mimetype);
          } else {
            extractedText = '';
          }
        }
      } catch (e) {
        console.error(`Extraction failed for ${originalname}:`, e.message);
        extractedText = '';
      }

      let cleanedText = extractedText;
      if (cleanedText) {
        try {
          cleanedText = await cleanWithGemini(cleanedText);
        } catch (e) {
          console.warn(`Cleaning failed for ${originalname}:`, e.message);
        }
      }

      let translatedText = '';
      if (cleanedText) {
        try {
          translatedText = await translateWithGemini(
            cleanedText,
            sourceLanguageName,
            targetLanguageName
          );
        } catch (e) {
          console.error(`Translation failed for ${originalname}:`, e.message);
        }
      }

      results.push({
        filename: originalname,
        extractedText: extractedText || '',
        cleanedText: cleanedText || extractedText || '',
        translatedText: translatedText || '',
        mimetype,
      });
    }

    res.json({
      documents: results,
    });
  } catch (error) {
    console.error('Document translate error:', error);
    res.status(500).json({ error: 'Document translation failed: ' + error.message });
  }
});

module.exports = router;


