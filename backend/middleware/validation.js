const { body, param, query, validationResult } = require('express-validator');

// Validation result handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      message: 'Please check your input data',
      details: errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value
      }))
    });
  }
  next();
};

// User registration validation
const validateUserRegistration = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('Username can only contain letters, numbers, underscores, and hyphens'),
  
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  
  body('firstName')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('First name cannot exceed 50 characters'),
  
  body('lastName')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Last name cannot exceed 50 characters'),
  
  handleValidationErrors
];

// User login validation
const validateUserLogin = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  handleValidationErrors
];

// Password reset validation
const validatePasswordReset = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  handleValidationErrors
];

// New password validation
const validateNewPassword = [
  body('token')
    .notEmpty()
    .withMessage('Reset token is required'),
  
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Password confirmation does not match password');
      }
      return true;
    }),
  
  handleValidationErrors
];

// Language validation
const validateLanguageData = [
  body('shortcode')
    .trim()
    .isLength({ min: 2, max: 5 })
    .withMessage('Shortcode must be between 2 and 5 characters')
    .matches(/^[A-Za-z]+$/)
    .withMessage('Shortcode can only contain letters')
    .customSanitizer(value => value.toUpperCase()),
  
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Language name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s\-']+$/)
    .withMessage('Language name can only contain letters, spaces, hyphens, and apostrophes'),
  
  body('country')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Country name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s\-']+$/)
    .withMessage('Country name can only contain letters, spaces, hyphens, and apostrophes'),
  
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean value'),
  
  handleValidationErrors
];

// Language validation
const validateLanguage = [
  body('sourceLanguage')
    .isIn(['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ja', 'ko', 'zh', 'ar', 'hi', 'mr', 'te', 'ml', 'ur', 'pa', 'bn', 'gu', 'or', 'as', 'am', 'sw', 'zu', 'af', 'xh', 'yo', 'ig', 'ha', 'so', 'rw', 'lg', 'ak', 'tw', 'ee', 'fon', 'dyu', 'bam', 'man', 'wol', 'ful'])
    .withMessage('Invalid source language'),
  
  body('targetLanguage')
    .isIn(['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ja', 'ko', 'zh', 'ar', 'hi', 'mr', 'te', 'ml', 'ur', 'pa', 'bn', 'gu', 'or', 'as', 'am', 'sw', 'zu', 'af', 'xh', 'yo', 'ig', 'ha', 'so', 'rw', 'lg', 'ak', 'tw', 'ee', 'fon', 'dyu', 'bam', 'man', 'wol', 'ful'])
    .withMessage('Invalid target language'),
  
  body()
    .custom((value, { req }) => {
      if (value.sourceLanguage === value.targetLanguage) {
        throw new Error('Source and target languages must be different');
      }
      return true;
    }),
  
  handleValidationErrors
];

// Text translation validation
const validateTextTranslation = [
  ...validateLanguage,
  
  body('text')
    .trim()
    .isLength({ min: 1, max: 10000 })
    .withMessage('Text must be between 1 and 10,000 characters'),
  
  body('autoClean')
    .optional()
    .isBoolean()
    .withMessage('Auto clean must be a boolean value'),
  
  body('quality')
    .optional()
    .isIn(['fast', 'balanced', 'high'])
    .withMessage('Quality must be one of: fast, balanced, high'),
  
  handleValidationErrors
];

// Voice translation validation
const validateVoiceTranslation = [
  ...validateLanguage,
  
  body('audioFormat')
    .optional()
    .isIn(['webm', 'mp3', 'wav', 'ogg', 'm4a'])
    .withMessage('Invalid audio format'),
  
  body('audioQuality')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Invalid audio quality'),
  
  body('silenceDetection')
    .optional()
    .isObject()
    .withMessage('Silence detection must be an object'),
  
  body('silenceDetection.enabled')
    .optional()
    .isBoolean()
    .withMessage('Silence detection enabled must be a boolean'),
  
  body('silenceDetection.threshold')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('Silence threshold must be between 0 and 100'),
  
  body('silenceDetection.timeout')
    .optional()
    .isInt({ min: 100, max: 10000 })
    .withMessage('Silence timeout must be between 100 and 10000 milliseconds'),
  
  handleValidationErrors
];

// Document translation validation
const validateDocumentTranslation = [
  ...validateLanguage,
  
  body('documents')
    .isArray({ min: 1, max: 10 })
    .withMessage('At least one document is required, maximum 10 documents'),
  
  body('documents.*.originalName')
    .notEmpty()
    .withMessage('Document original name is required'),
  
  body('documents.*.mimetype')
    .isIn(['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain', 'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp', 'image/tiff'])
    .withMessage('Invalid document type'),
  
  body('documents.*.size')
    .isInt({ min: 1, max: 20 * 1024 * 1024 }) // 20MB max
    .withMessage('Document size must be between 1 byte and 20MB'),
  
  body('processingConfig')
    .optional()
    .isObject()
    .withMessage('Processing config must be an object'),
  
  body('processingConfig.enableOCR')
    .optional()
    .isBoolean()
    .withMessage('Enable OCR must be a boolean'),
  
  body('processingConfig.enableTextCleaning')
    .optional()
    .isBoolean()
    .withMessage('Enable text cleaning must be a boolean'),
  
  body('processingConfig.quality')
    .optional()
    .isIn(['fast', 'balanced', 'high'])
    .withMessage('Processing quality must be one of: fast, balanced, high'),
  
  handleValidationErrors
];

// Image translation validation
const validateImageTranslation = [
  ...validateLanguage,
  
  body('image')
    .isObject()
    .withMessage('Image object is required'),
  
  body('image.originalName')
    .notEmpty()
    .withMessage('Image original name is required'),
  
  body('image.mimetype')
    .isIn(['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp', 'image/tiff', 'image/webp'])
    .withMessage('Invalid image type'),
  
  body('image.size')
    .isInt({ min: 1, max: 10 * 1024 * 1024 }) // 10MB max
    .withMessage('Image size must be between 1 byte and 10MB'),
  
  body('processingConfig')
    .optional()
    .isObject()
    .withMessage('Processing config must be an object'),
  
  body('processingConfig.enableOCR')
    .optional()
    .isBoolean()
    .withMessage('Enable OCR must be a boolean'),
  
  body('processingConfig.quality')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Processing quality must be one of: low, medium, high'),
  
  handleValidationErrors
];

// Conversation validation
const validateConversation = [
  ...validateLanguage,
  
  body('settings')
    .optional()
    .isObject()
    .withMessage('Settings must be an object'),
  
  body('settings.autoTranslate')
    .optional()
    .isBoolean()
    .withMessage('Auto translate must be a boolean'),
  
  body('settings.autoPlay')
    .optional()
    .isBoolean()
    .withMessage('Auto play must be a boolean'),
  
  body('settings.continuousMode')
    .optional()
    .isBoolean()
    .withMessage('Continuous mode must be a boolean'),
  
  body('settings.silenceTimeout')
    .optional()
    .isInt({ min: 500, max: 10000 })
    .withMessage('Silence timeout must be between 500 and 10000 milliseconds'),
  
  handleValidationErrors
];

// Voice call validation
const validateVoiceCall = [
  ...validateLanguage,
  
  body('roomId')
    .notEmpty()
    .withMessage('Room ID is required'),
  
  body('settings')
    .optional()
    .isObject()
    .withMessage('Settings must be an object'),
  
  body('settings.maxParticipants')
    .optional()
    .isInt({ min: 2, max: 10 })
    .withMessage('Max participants must be between 2 and 10'),
  
  body('settings.autoTranslate')
    .optional()
    .isBoolean()
    .withMessage('Auto translate must be a boolean'),
  
  body('settings.recording.enabled')
    .optional()
    .isBoolean()
    .withMessage('Recording enabled must be a boolean'),
  
  body('settings.recording.quality')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Recording quality must be one of: low, medium, high'),
  
  handleValidationErrors
];

// User profile update validation
const validateUserProfileUpdate = [
  body('firstName')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('First name cannot exceed 50 characters'),
  
  body('lastName')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Last name cannot exceed 50 characters'),
  
  body('preferredLanguages.sourceLanguage')
    .optional()
    .isIn(['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ja', 'ko', 'zh', 'ar', 'hi', 'mr', 'te', 'ml', 'ur', 'pa', 'bn', 'gu', 'or', 'as', 'am', 'sw', 'zu', 'af', 'xh', 'yo', 'ig', 'ha', 'so', 'rw', 'lg', 'ak', 'tw', 'ee', 'fon', 'dyu', 'bam', 'man', 'wol', 'ful'])
    .withMessage('Invalid source language'),
  
  body('preferredLanguages.targetLanguage')
    .optional()
    .isIn(['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ja', 'ko', 'zh', 'ar', 'hi', 'mr', 'te', 'ml', 'ur', 'pa', 'bn', 'gu', 'or', 'as', 'am', 'sw', 'zu', 'af', 'xh', 'yo', 'ig', 'ha', 'so', 'rw', 'lg', 'ak', 'tw', 'ee', 'fon', 'dyu', 'bam', 'man', 'wol', 'ful'])
    .withMessage('Invalid target language'),
  
  body('settings.theme')
    .optional()
    .isIn(['light', 'dark', 'ocean', 'sunset'])
    .withMessage('Invalid theme'),
  
  body('settings.autoTranslate')
    .optional()
    .isBoolean()
    .withMessage('Auto translate must be a boolean'),
  
  body('settings.notifications')
    .optional()
    .isBoolean()
    .withMessage('Notifications must be a boolean'),
  
  handleValidationErrors
];

// Pagination validation
const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  query('sortBy')
    .optional()
    .isString()
    .withMessage('Sort by must be a string'),
  
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be either asc or desc'),
  
  handleValidationErrors
];

// Search validation
const validateSearch = [
  query('q')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Search query must be between 1 and 100 characters'),
  
  query('type')
    .optional()
    .isIn(['all', 'voice', 'text', 'image', 'document', 'conversation', 'call'])
    .withMessage('Invalid search type'),
  
  query('dateFrom')
    .optional()
    .isISO8601()
    .withMessage('Date from must be a valid ISO date'),
  
  query('dateTo')
    .optional()
    .isISO8601()
    .withMessage('Date to must be a valid ISO date'),
  
  handleValidationErrors
];

// ID parameter validation
const validateId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid ID format'),
  
  handleValidationErrors
];

// File upload validation
const validateFileUpload = [
  body('file')
    .custom((value, { req }) => {
      if (!req.file) {
        throw new Error('File is required');
      }
      
      // Check file size (default 20MB)
      const maxSize = 20 * 1024 * 1024;
      if (req.file.size > maxSize) {
        throw new Error(`File size must be less than ${maxSize / (1024 * 1024)}MB`);
      }
      
      // Check file type
      const allowedTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/bmp',
        'image/tiff',
        'image/webp'
      ];
      
      if (!allowedTypes.includes(req.file.mimetype)) {
        throw new Error('Invalid file type. Only PDF, DOCX, TXT, and image files are allowed');
      }
      
      return true;
    }),
  
  handleValidationErrors
];

// Sanitization middleware
const sanitizeInput = (req, res, next) => {
  // Sanitize string inputs
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = req.body[key].trim();
      }
    });
  }
  
  // Sanitize query parameters
  if (req.query) {
    Object.keys(req.query).forEach(key => {
      if (typeof req.query[key] === 'string') {
        req.query[key] = req.query[key].trim();
      }
    });
  }
  
  next();
};

// Rate limiting validation
const validateRateLimit = [
  body('action')
    .isString()
    .withMessage('Action must be a string'),
  
  body('identifier')
    .isString()
    .withMessage('Identifier must be a string'),
  
  handleValidationErrors
];

module.exports = {
  handleValidationErrors,
  validateUserRegistration,
  validateUserLogin,
  validatePasswordReset,
  validateNewPassword,
  validateLanguageData,
  validateTextTranslation,
  validateVoiceTranslation,
  validateDocumentTranslation,
  validateImageTranslation,
  validateConversation,
  validateVoiceCall,
  validateUserProfileUpdate,
  validatePagination,
  validateSearch,
  validateId,
  validateFileUpload,
  sanitizeInput,
  validateRateLimit
};
