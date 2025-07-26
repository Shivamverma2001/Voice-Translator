# Image Translation Feature

## Overview

The Voice Translator App now includes an **Image Translation** mode that allows users to extract text from images and translate it. This feature uses Google's Gemini Vision API for OCR (Optical Character Recognition) and Google Translate for translation.

## Features

### 📷 Image Translation Mode
- **Take Photo**: Use your device's camera to capture text for translation
- **Upload Image**: Select images from your photo library
- **OCR Processing**: Extract text from images using AI-powered OCR
- **Text Cleaning**: Automatically clean and correct OCR errors
- **Translation**: Translate extracted text to your target language
- **Text-to-Speech**: Speak the translated text aloud

## How to Use

1. **Select Image Mode**: Tap the mode dropdown and select "Image" (📷)
2. **Choose Image Source**: 
   - Tap "Take Photo or Upload" button
   - Choose "Take Photo" to use camera
   - Choose "Choose from Gallery" to select existing image
3. **Process Image**: The app will automatically:
   - Extract text from the image
   - Clean and correct any OCR errors
   - Translate the text to your target language
4. **View Results**: 
   - See the extracted text in the "Extracted Text" section
   - See the translation in the "Translation" section
   - Tap the 🔊 button to hear the translation spoken

## Technical Implementation

### Frontend (React Native)
- **ImageMode Component**: Handles camera and gallery access
- **Image Picker**: Uses `react-native-image-picker` for image selection
- **Form Data**: Sends images to backend as multipart/form-data
- **State Management**: Tracks extracted text and translations separately

### Backend (Node.js/Express)
- **Image Processing**: Uses `sharp` library to optimize images for OCR
- **OCR**: Google Gemini Vision API for text extraction
- **Text Cleaning**: Gemini Pro API for error correction
- **Translation**: Google Cloud Translate API
- **File Upload**: Multer middleware for handling image uploads

### API Endpoint
```
POST /api/image-translate
Content-Type: multipart/form-data

Body:
- image: Image file
- targetLang: Target language code
- sourceLang: Source language code

Response:
{
  "extractedText": "Original text from image",
  "cleanedText": "Cleaned and corrected text",
  "translatedText": "Translated text"
}
```

## Permissions Required

### Android
- `android.permission.CAMERA`
- `android.permission.READ_EXTERNAL_STORAGE`
- `android.permission.WRITE_EXTERNAL_STORAGE`

### iOS
- `NSCameraUsageDescription`
- `NSPhotoLibraryUsageDescription`

## Environment Variables

The following environment variables are required:

```env
GEMINI_API_KEY=your_gemini_api_key
GOOGLE_CLOUD_PROJECT_ID=your_google_cloud_project_id
GOOGLE_APPLICATION_CREDENTIALS=path_to_service_account_key.json
```

## Dependencies

### Frontend
```json
{
  "react-native-image-picker": "^latest",
  "react-native-camera": "^latest",
  "react-native-vision-camera": "^latest",
  "@react-native-camera-roll/camera-roll": "^latest"
}
```

### Backend
```json
{
  "multer": "^latest",
  "sharp": "^latest",
  "@google/generative-ai": "^latest",
  "@google-cloud/translate": "^latest"
}
```

## Supported Languages

The image translation feature supports all the same languages as the voice and text translation modes:

- English (en-US)
- Spanish (es)
- French (fr)
- German (de)
- Italian (it)
- Portuguese (pt)
- Russian (ru)
- Japanese (ja)
- Korean (ko)
- Chinese (zh)
- Arabic (ar)
- Hindi (hi)
- Sanskrit (sa)
- Marathi (mr)
- Telugu (te)
- Malayalam (ml)
- Urdu (ur)
- Punjabi (pa)

## Error Handling

The app handles various error scenarios:

- **No Text Found**: Shows appropriate message when no text is detected
- **OCR Errors**: Attempts to clean and correct OCR mistakes
- **Network Issues**: Displays user-friendly error messages
- **Permission Denied**: Guides users to grant necessary permissions
- **File Size Limits**: Enforces 10MB maximum file size

## Performance Optimizations

- **Image Resizing**: Automatically resizes images to 1200x1200 for optimal OCR
- **JPEG Compression**: Reduces file size while maintaining quality
- **Base64 Encoding**: Efficient image transmission to backend
- **Caching**: Avoids reprocessing the same image

## Testing

To test the image translation functionality:

1. Run the test script:
   ```bash
   node test-image-translation.js
   ```

2. Install the app on your device:
   ```bash
   cd VoiceTranslatorApp
   npx react-native run-android  # or run-ios
   ```

3. Grant camera and photo library permissions when prompted

4. Test with various types of images:
   - Clear, well-lit text
   - Handwritten text
   - Text in different languages
   - Images with mixed content

## Troubleshooting

### Common Issues

1. **"No text found in image"**
   - Ensure the image contains clear, readable text
   - Try taking a photo in better lighting
   - Make sure text is not too small or blurry

2. **Permission errors**
   - Go to device settings and grant camera/photo library access
   - Restart the app after granting permissions

3. **Translation errors**
   - Check your internet connection
   - Verify that the target language is supported
   - Try with a different image

4. **App crashes**
   - Clear app cache and restart
   - Update to the latest version
   - Check device storage space

## Future Enhancements

Potential improvements for the image translation feature:

- **Batch Processing**: Translate multiple images at once
- **Real-time Camera**: Live text detection and translation
- **Offline OCR**: Local text extraction for privacy
- **Image Enhancement**: Automatic image preprocessing
- **Handwriting Recognition**: Better support for handwritten text
- **Layout Analysis**: Preserve text formatting and structure

## Contributing

To contribute to the image translation feature:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly on both Android and iOS
5. Submit a pull request

## License

This feature is part of the Voice Translator App and follows the same license terms as the main project. 