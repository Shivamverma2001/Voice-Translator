# Backend (Node.js/Express)

Express API powering speech-to-text (real-time and batch), translation, text-to-speech, and image translation.

## Features
- Real-time STT via Speechmatics WebSocket
- Batch STT upload via Speechmatics
- Intelligent text cleaning via Gemini (with graceful fallback)
- Free translation via Google Translate web service
- Free TTS via Google Translate TTS (streamed)
- Image OCR + translate via Gemini Vision
- Socket.io scaffolding for multi-user voice calls

## Endpoints
- POST `/api/realtime-speech-to-text/start` – start STT session
- POST `/api/realtime-speech-to-text/audio` – send audio chunks (base64)
- POST `/api/realtime-speech-to-text/stop` – stop session and return final cleaned transcript
- POST `/api/speech-to-text` – batch audio upload (multipart)
- POST `/api/translate` – translate voice text (uses cleaning + translate)
- POST `/api/manual-translate` – translate manual text (uses cleaning + translate)
- POST `/api/text-to-speech` – TTS stream for a given language code
- POST `/api/image-translate` – OCR + clean + translate image text

## Requirements
- Node.js 18+
- Environment variables in `.env` at project root:

```
# Required
SPEECHMATICS_API_KEY=your_speechmatics_key
GEMINI_API_KEY=your_gemini_key

# For Image Translation (optional, if using Google Cloud Translate SDK)
GOOGLE_CLOUD_PROJECT_ID=your_gcp_project
GOOGLE_CLOUD_KEY_FILE=google-credentials.json
```

Notes:
- The server listens on `PORT` (default 5001).
- CORS allows localhost (web, RN) and ngrok for development.
- Uploads are stored in `backend/uploads/` (auto-created).

## Run
From project root:

```
# Backend only
npm run server

# Full dev (backend + web frontend)
npm run dev
```

The backend entrypoint is `backend/index.js`.

## Folder Structure
```
backend/
├── index.js                 # Express + Socket.io server
├── routes/                  # API routes
│   ├── realtimeSpeechToText.js
│   ├── speechToText.js
│   ├── translateText.js
│   ├── manualTranslate.js
│   ├── textToSpeech.js
│   └── imageTranslate.js
├── uploads/                 # Temp audio uploads (auto-created)
├── test-gemini.js           # Utility scripts
├── list-gemini-models.js
└── IMAGE_TRANSLATION_README.md
```

## Development Tips
- Keep audio chunks small (webm/opus) to avoid payload bloat.
- Real-time STT returns partial and final transcripts; we clean text at stop for best quality.
- Avoid hardcoding values; prefer config/env where possible.

## Security
- Do not commit secrets. Use `.env` locally.
- Validate inputs and handle errors; endpoints already return safe errors.
