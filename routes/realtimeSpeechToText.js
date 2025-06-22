const express = require('express');
const { RealtimeClient } = require('@speechmatics/real-time-client');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const router = express.Router();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Store active sessions
const activeSessions = new Map();

// Intelligent text cleaning using Gemini AI with rate limiting
async function cleanTranscribedTextWithGemini(text) {
  if (!text || !text.trim()) return text;
  
  console.log('🔍 Gemini cleaning called with text:', text);
  
  try {
    if (!process.env.GEMINI_API_KEY) {
      console.error('❌ GEMINI_API_KEY not found in environment');
      return cleanTranscribedTextBasic(text);
    }
    
    console.log('✅ GEMINI_API_KEY found, initializing model...');
    const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-flash-latest" });
    
    const prompt = `Please clean and improve this transcribed speech text. Fix spacing, punctuation, capitalization, and grammar while preserving the original meaning. Make it sound natural and well-formatted.

Original text: "${text}"

Please return only the cleaned text without any explanations or quotes.`;

    console.log('📤 Sending request to Gemini...');
    const result = await model.generateContent(prompt);
    const cleanedText = result.response.text().trim();
    
    console.log(`✨ Gemini cleaned text: "${text}" → "${cleanedText}"`);
    return cleanedText;
  } catch (error) {
    console.error('❌ Gemini text cleaning error:', error);
    console.error('Error details:', error.message);
    
    // Handle rate limiting specifically
    if (error.status === 429) {
      console.log('⚠️ Rate limit hit, using basic cleaning as fallback');
      return cleanTranscribedTextBasic(text);
    }
    
    // Fallback to basic cleaning if Gemini fails
    return cleanTranscribedTextBasic(text);
  }
}

// Basic fallback text cleaning function
function cleanTranscribedTextBasic(text) {
  if (!text) return text;
  
  console.log('🔧 Using basic cleaning for:', text);
  
  // Basic spacing fixes
  let cleaned = text
    // Fix common transcription patterns
    .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space between camelCase
    .replace(/([a-z])(\d)/g, '$1 $2') // Add space between letters and numbers
    .replace(/(\d)([a-z])/g, '$1 $2') // Add space between numbers and letters
    // Fix specific transcription issues
    .replace(/([a-z]+)([A-Z][a-z]+)/g, '$1 $2') // mynameIs → my name Is
    .replace(/([a-z])([A-Z][a-z]+)/g, '$1 $2'); // myName → my Name
  
  // Add spaces around punctuation
  cleaned = cleaned
    .replace(/([.!?,:;])/g, ' $1 ')
    .replace(/\s+/g, ' ')
    .trim();
  
  // Capitalize first letter of sentences
  cleaned = cleaned.replace(/(^|\.\s+)([a-z])/g, (match, p1, p2) => p1 + p2.toUpperCase());
  
  // Fix spacing
  cleaned = cleaned
    .replace(/\s+([.!?,:;])/g, '$1') // Remove spaces before punctuation
    .replace(/([.!?,:;])\s+/g, '$1 ') // Ensure space after punctuation
    .replace(/\s+/g, ' ') // Normalize multiple spaces
    .trim();
  
  console.log('🔧 Basic cleaning result:', cleaned);
  return cleaned;
}

async function fetchJWT() {
  const apiKey = process.env.SPEECHMATICS_API_KEY;
  
  if (!apiKey) {
    throw new Error('SPEECHMATICS_API_KEY environment variable is not set');
  }
  
  try {
    const resp = await fetch('https://mp.speechmatics.com/v1/api_keys?type=rt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        ttl: 3600,
      }),
    });
    
    if (!resp.ok) {
      const errorText = await resp.text();
      throw new Error(`Failed to get JWT token: ${resp.status} ${resp.statusText} - ${errorText}`);
    }
    
    const data = await resp.json();
    if (!data.key_value) {
      throw new Error('JWT response does not contain key_value');
    }
    
    return data.key_value;
  } catch (error) {
    console.error('JWT fetch error:', error);
    throw error;
  }
}

// Debug endpoint to see active sessions
router.get('/debug', (req, res) => {
  const sessions = Array.from(activeSessions.keys());
  res.json({ 
    activeSessions: sessions,
    sessionCount: sessions.length
  });
});

// Test endpoint to check API key
router.get('/test', async (req, res) => {
  try {
    const jwt = await fetchJWT();
    res.json({ 
      status: 'success',
      message: 'API key is working',
      hasJWT: !!jwt
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error',
      message: 'API key test failed',
      error: error.message
    });
  }
});

// Test endpoint for Gemini text cleaning
router.post('/test-gemini', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }
    
    const cleanedText = await cleanTranscribedTextWithGemini(text);
    res.json({ 
      original: text,
      cleaned: cleanedText,
      status: 'success'
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error',
      message: 'Gemini test failed',
      error: error.message
    });
  }
});

router.post('/start', async (req, res) => {
  try {
    const { languageCode = 'en' } = req.body;
    
    // Convert language code to Speechmatics format
    const languageMap = {
      'en-US': 'en',
      'en': 'en',
      'es': 'es',
      'fr': 'fr',
      'de': 'de',
      'it': 'it',
      'pt': 'pt',
      'ru': 'ru',
      'ja': 'ja',
      'ko': 'ko',
      'zh': 'zh',
      'ar': 'ar',
      'hi': 'hi'
    };

    const speechmaticsLanguage = languageMap[languageCode] || 'en';
    
    const jwt = await fetchJWT();
    const sessionId = Date.now().toString();
    
    console.log(`Creating new session: ${sessionId}`);
    
    // Store session info
    activeSessions.set(sessionId, {
      client: new RealtimeClient(),
      transcript: '',
      partialTranscript: '',
      createdAt: new Date()
    });
    
    const session = activeSessions.get(sessionId);
    
    // Set up event listeners
    session.client.addEventListener('receiveMessage', async ({ data }) => {
      if (data.message === 'AddPartialTranscript') {
        const partialText = data.results
          .map((r) => r.alternatives?.[0].content)
          .join(' ');
        // Use basic cleaning for partial transcripts to avoid rate limiting
        session.partialTranscript = cleanTranscribedTextBasic(partialText);
        console.log(`Session ${sessionId} partial: ${session.partialTranscript}`);
      } else if (data.message === 'AddTranscript') {
        const text = data.results.map((r) => r.alternatives?.[0].content).join(' ');
        session.transcript += text;
        // Use basic cleaning for intermediate transcripts to avoid rate limiting
        session.transcript = cleanTranscribedTextBasic(session.transcript);
        console.log(`Session ${sessionId} transcript: ${text}`);
      } else if (data.message === 'EndOfTranscript') {
        console.log(`Session ${sessionId} ended`);
      }
    });

    // Add error handling for the client
    session.client.addEventListener('error', (error) => {
      console.error(`Session ${sessionId} error:`, error);
    });

    session.client.addEventListener('close', () => {
      console.log(`Session ${sessionId} closed`);
    });
    
    // Start the real-time session
    await session.client.start(jwt, {
      transcription_config: {
        language: speechmaticsLanguage,
        enable_partials: true
      },
    });
    
    console.log(`Session ${sessionId} started successfully`);
    console.log(`Active sessions: ${Array.from(activeSessions.keys())}`);
    
    res.json({ 
      sessionId,
      message: 'Real-time transcription started'
    });
    
  } catch (error) {
    console.error('Real-time STT Start Error:', error);
    res.status(500).json({ error: 'Failed to start real-time transcription: ' + error.message });
  }
});

router.post('/audio', async (req, res) => {
  try {
    const { sessionId, audioData } = req.body;
    
    console.log(`Audio request for session: ${sessionId}`);
    console.log(`Active sessions: ${Array.from(activeSessions.keys())}`);
    
    if (!sessionId || !activeSessions.has(sessionId)) {
      console.log(`Invalid session ID: ${sessionId}`);
      return res.status(400).json({ 
        error: 'Invalid session ID',
        providedSessionId: sessionId,
        activeSessions: Array.from(activeSessions.keys())
      });
    }
    
    const session = activeSessions.get(sessionId);
    
    // Convert base64 audio data to buffer and send
    const audioBuffer = Buffer.from(audioData, 'base64');
    session.client.sendAudio(audioBuffer);
    
    res.json({ 
      transcript: session.transcript,
      partialTranscript: session.partialTranscript
    });
    
  } catch (error) {
    console.error('Real-time STT Audio Error:', error);
    res.status(500).json({ error: 'Failed to process audio: ' + error.message });
  }
});

router.post('/stop', async (req, res) => {
  try {
    const { sessionId } = req.body;
    
    console.log(`Stop request for session: ${sessionId}`);
    console.log(`Active sessions: ${Array.from(activeSessions.keys())}`);
    
    if (!sessionId || !activeSessions.has(sessionId)) {
      console.log(`Invalid session ID for stop: ${sessionId}`);
      return res.status(400).json({ 
        error: 'Invalid session ID',
        providedSessionId: sessionId,
        activeSessions: Array.from(activeSessions.keys())
      });
    }
    
    const session = activeSessions.get(sessionId);
    console.log(`Session ${sessionId} found, current transcript: "${session.transcript}"`);
    
    // Stop the session
    session.client.stopRecognition();
    
    // Wait a bit for any final events to be processed
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Get final transcript and clean it with Gemini
    console.log(`Calling Gemini cleaning for: "${session.transcript}"`);
    const finalTranscript = await cleanTranscribedTextWithGemini(session.transcript);
    
    console.log(`Session ${sessionId} stopped and cleaned up`);
    console.log(`Final cleaned transcript: "${finalTranscript}"`);
    
    // Clean up session AFTER sending response
    activeSessions.delete(sessionId);
    console.log(`Remaining sessions: ${Array.from(activeSessions.keys())}`);
    
    res.json({ 
      transcript: finalTranscript,
      message: 'Real-time transcription stopped'
    });
    
  } catch (error) {
    console.error('Real-time STT Stop Error:', error);
    res.status(500).json({ error: 'Failed to stop real-time transcription: ' + error.message });
  }
});

module.exports = router; 