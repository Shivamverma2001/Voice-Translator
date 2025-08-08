# Voice Translator - Multi-Mode Translation Platform

A comprehensive translation platform with web frontend, React Native mobile app, and Node.js backend supporting multiple translation modes including the new Document Mode.

## 🌟 Features

### 📱 Cross-Platform Support
- **Web Frontend**: React + Tailwind CSS with modern UI
- **Mobile App**: React Native for Android and iOS
- **Backend**: Node.js with Express and Gemini AI integration

### 🎤 Voice Translation
- Real-time speech-to-text conversion
- Multi-language text translation
- Text-to-speech playback
- Clean, modern UI design

### 📝 Text Translation
- Manual text input and translation
- Text cleaning and formatting
- Support for long inputs with scrollable fields
- Speak original and translated text

### 🖼️ Image Translation
- Upload images for text extraction using Gemini Vision
- OCR (Optical Character Recognition) for text detection
- Translate extracted text from images
- Support for multiple image formats

### 📄 Document Translation (NEW!)
- **Multi-format Support**: PDF, DOCX, TXT, and Images
- **Batch Processing**: Upload up to 10 documents simultaneously
- **Text Extraction**: OCR for images, parsing for PDF/DOCX/TXT
- **Flexible Translation**: Translate individual documents or all at once
- **Download Options**: Individual files or ZIP archive with all translations
- **Document Preview**: Thumbnails and filename display
- **Cross-Platform**: Available on both web and mobile

### 💬 Conversation Mode
- WhatsApp-style chat bubbles with auto-scroll
- Start/Stop and "Start new conversation" controls
- Shows cleaned text, original text (hidden if identical), and translated text
- Timestamps and user icons
- Auto-restart after each translation until manual stop

### 📞 Voice Call Mode
- Real-time voice call translation
- Room creation and joining (Google Meet-style)
- Wait for second user before allowing speaking
- Translation heard by other participants only
- WhatsApp-style chat bubbles with user icons

## 🏗️ Project Structure

```
voice-translator/
├── frontend/                 # React web application
│   ├── src/components/      # UI components
│   ├── src/components/ui/   # Reusable UI components
│   └── README.md           # Frontend documentation
├── VoiceTranslatorApp/      # React Native mobile app
│   ├── components/         # Mobile UI components
│   ├── android/           # Android-specific files
│   ├── ios/              # iOS-specific files
│   └── README.md         # Mobile app documentation
├── backend/               # Node.js backend server
│   ├── routes/           # API route handlers
│   └── README.md         # Backend documentation
└── README.md             # This file
```

## 🚀 Quick Start

### 1. Backend Setup
```bash
cd backend
npm install
npm start
```

### 2. Web Frontend
```bash
cd frontend
npm install
npm start
```

### 3. Mobile App
```bash
cd VoiceTranslatorApp
npm install
# For Android
npm run android
# For iOS (macOS only)
npm run ios
```

## 🔧 API Endpoints

### Core Translation
- `POST /api/translate` - Basic text translation
- `POST /api/manual-translate` - Manual text translation
- `POST /api/text-to-speech` - Convert text to speech

### Document Processing
- `POST /api/document-translate` - Extract and translate documents
- `POST /api/image-translate` - Extract and translate images

### Real-time Communication
- `POST /api/realtime-speech-to-text/start` - Start speech recognition
- `POST /api/realtime-speech-to-text/audio` - Send audio data
- `POST /api/realtime-speech-to-text/stop` - Stop speech recognition

## 🌍 Supported Languages

**European Languages**: English, Spanish, French, German, Italian, Portuguese, Russian

**Asian Languages**: Japanese, Korean, Chinese, Arabic

**Indian Languages**: Hindi, Marathi, Telugu, Malayalam, Urdu, Punjabi

## 📄 Document Mode Features

### Supported Formats
- **PDF**: Text extraction using pdf-parse
- **DOCX**: Text extraction using mammoth
- **TXT**: Direct text reading
- **Images**: OCR using Gemini Vision API

### Key Capabilities
- **Batch Upload**: Select multiple files at once
- **Individual Translation**: Translate one document at a time
- **Bulk Translation**: Translate all documents simultaneously
- **Download Options**:
  - Single file download (current document)
  - ZIP archive with all translations
  - Separate files for extracted, cleaned, and translated text
- **Document Management**: Clear all, preview thumbnails, filename display

### UI Features
- **Document Preview**: Thumbnail display for images and PDFs
- **Filename Truncation**: Smart filename display with ellipsis
- **Loading States**: Visual feedback during processing
- **Error Handling**: User-friendly error messages
- **Responsive Design**: Works on desktop and mobile

## 🔐 Permissions Required

### Web Application
- Microphone access for voice recording
- File upload permissions for documents

### Mobile Application
- Microphone access for voice recording
- Storage access for document upload/download
- Internet access for API communication

## 🛠️ Technologies Used

### Frontend (Web)
- React 18
- Tailwind CSS
- Lucide React (icons)
- Socket.io Client

### Mobile App
- React Native
- React Native Voice
- React Native TTS
- React Native Document Picker
- React Native FS

### Backend
- Node.js
- Express.js
- Socket.io
- Google Generative AI (Gemini)
- Multer (file uploads)
- PDF-parse, Mammoth (document parsing)
- Sharp (image processing)

## 🎨 UI/UX Features

### Design System
- **Dark/Light Mode**: Consistent theming across platforms
- **Responsive Design**: Mobile-first approach
- **Accessibility**: Keyboard navigation and screen reader support
- **Error Handling**: User-friendly error messages
- **Loading States**: Visual feedback for all operations

### Cross-Platform Consistency
- **Unified Design**: Similar UI patterns across web and mobile
- **Feature Parity**: All modes available on both platforms
- **Native Feel**: Platform-specific optimizations where needed

## 🔄 Development Workflow

1. **Backend First**: Start with backend API development
2. **Web Frontend**: Implement features in React web app
3. **Mobile Adaptation**: Port features to React Native
4. **Testing**: Test on both platforms
5. **Documentation**: Update README files

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Implement your changes
4. Test thoroughly on both web and mobile
5. Update documentation
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🤝 Support

For issues and questions:
1. Check the troubleshooting sections in individual README files
2. Review the API documentation
3. Test on both platforms
4. Create detailed issue reports with steps to reproduce
