// Master languages configuration for the Voice Translator application
// This file contains the base language data that can be used for seeding or reference

const languages = {
  // English variants
  'en': { 
    name: 'English', 
    shortcode: 'en', 
    country: 'United States',
    isActive: true
  },
  'en-us': { 
    name: 'English (US)', 
    shortcode: 'en-us', 
    country: 'United States',
    isActive: true
  },

  // European Languages
  'es': { 
    name: 'Spanish', 
    shortcode: 'es', 
    country: 'Spain',
    isActive: true
  },
  'fr': { 
    name: 'French', 
    shortcode: 'fr', 
    country: 'France',
    isActive: true
  },
  'de': { 
    name: 'German', 
    shortcode: 'de', 
    country: 'Germany',
    isActive: true
  },
  'it': { 
    name: 'Italian', 
    shortcode: 'it', 
    country: 'Italy',
    isActive: true
  },
  'pt': { 
    name: 'Portuguese', 
    shortcode: 'pt', 
    country: 'Portugal',
    isActive: true
  },
  'ru': { 
    name: 'Russian', 
    shortcode: 'ru', 
    country: 'Russia',
    isActive: true
  },
  'nl': { 
    name: 'Dutch', 
    shortcode: 'nl', 
    country: 'Netherlands',
    isActive: true
  },
  'pl': { 
    name: 'Polish', 
    shortcode: 'pl', 
    country: 'Poland',
    isActive: true
  },
    'sv': { 
    name: 'Swedish', 
    shortcode: 'sv', 
    country: 'Sweden',
    isActive: true
  },
  'no': { 
    name: 'Norwegian', 
    shortcode: 'no', 
    country: 'Norway',
    isActive: true
  },
  'da': { 
    name: 'Danish', 
    shortcode: 'da', 
    country: 'Denmark',
    isActive: true
  },
  'fi': { 
    name: 'Finnish', 
    shortcode: 'fi', 
    country: 'Finland',
    isActive: true
  },

  // Asian Languages
  'ja': { 
    name: 'Japanese', 
    shortcode: 'ja', 
    country: 'Japan',
    isActive: true
  },
  'ko': { 
    name: 'Korean', 
    shortcode: 'ko', 
    country: 'South Korea',
    isActive: true
  },
  'zh': { 
    name: 'Chinese', 
    shortcode: 'zh', 
    country: 'China',
    isActive: true
  },

  // Middle Eastern Languages
  'ar': { 
    name: 'Arabic', 
    shortcode: 'ar', 
    country: 'Saudi Arabia',
    isActive: true
  },

  // Indian Languages
  'hi': { 
    name: 'Hindi', 
    shortcode: 'hi', 
    country: 'India',
    isActive: true
  },
  'sa': { 
    name: 'Sanskrit', 
    shortcode: 'sa', 
    country: 'India',
    isActive: true
  },
  'mr': { 
    name: 'Marathi', 
    shortcode: 'mr', 
    country: 'India',
    isActive: true
  },
  'te': { 
    name: 'Telugu', 
    shortcode: 'te', 
    country: 'India',
    isActive: true
  },
  'ml': { 
    name: 'Malayalam', 
    shortcode: 'ml', 
    country: 'India',
    isActive: true
  },
  'ur': { 
    name: 'Urdu', 
    shortcode: 'ur', 
    country: 'India',
    isActive: true
  },
  'pa': { 
    name: 'Punjabi', 
    shortcode: 'pa', 
    country: 'India',
    isActive: true
  },
  'bn': { 
    name: 'Bengali', 
    shortcode: 'bn', 
    country: 'India',
    isActive: true
  },

  // Additional English variants
  'en-gb': { 
    name: 'English (UK)', 
    shortcode: 'en-gb', 
    country: 'United Kingdom',
    isActive: true
  },
  'en-ca': { 
    name: 'English (Canada)', 
    shortcode: 'en-ca', 
    country: 'Canada',
    isActive: true
  },
  'en-au': { 
    name: 'English (Australia)', 
    shortcode: 'en-au', 
    country: 'Australia',
    isActive: true
  },

  // Additional Spanish variants
  'es-mx': { 
    name: 'Spanish (Mexico)', 
    shortcode: 'es-mx', 
    country: 'Mexico',
    isActive: true
  },
  'es-ar': { 
    name: 'Spanish (Argentina)', 
    shortcode: 'es-ar', 
    country: 'Argentina',
    isActive: true
  },

  // Additional French variants
  'fr-ca': { 
    name: 'French (Canada)', 
    shortcode: 'fr-ca', 
    country: 'Canada',
    isActive: true
  },

  // Additional German variants
  'de-at': { 
    name: 'German (Austria)', 
    shortcode: 'de-at', 
    country: 'Austria',
    isActive: true
  },
  'de-ch': { 
    name: 'German (Switzerland)', 
    shortcode: 'DE-CH', 
    country: 'Switzerland',
    isActive: true
  },

  // Additional Portuguese variants
  'pt-br': { 
    name: 'Portuguese (Brazil)', 
    shortcode: 'pt-br', 
    country: 'Brazil',
    isActive: true
  },

  // Additional European languages
    'tr': { 
    name: 'Turkish', 
    shortcode: 'tr', 
    country: 'Turkey',
    isActive: true
  },
  'el': { 
    name: 'Greek', 
    shortcode: 'el', 
    country: 'Greece',
    isActive: true
  },
  'he': { 
    name: 'Hebrew', 
    shortcode: 'he', 
    country: 'Israel',
    isActive: true
  },
  'cs': { 
    name: 'Czech', 
    shortcode: 'cs', 
    country: 'Czech Republic',
    isActive: true
  },
  'sk': { 
    name: 'Slovak', 
    shortcode: 'sk', 
    country: 'Slovakia',
    isActive: true
  },
  'hu': { 
    name: 'Hungarian', 
    shortcode: 'hu', 
    country: 'Hungary',
    isActive: true
  },
      'ro': { 
    name: 'Romanian', 
    shortcode: 'ro', 
    country: 'Romania',
    isActive: true
  },
  'bg': { 
    name: 'Bulgarian', 
    shortcode: 'bg', 
    country: 'Bulgaria',
    isActive: true
  },
    'hr': { 
    name: 'Croatian', 
    shortcode: 'hr', 
    country: 'Croatia',
    isActive: true
  },
  'sl': { 
    name: 'Slovenian', 
    shortcode: 'sl', 
    country: 'Slovenia',
    isActive: true
  },
  'et': { 
    name: 'Estonian', 
    shortcode: 'et', 
    country: 'Estonia',
    isActive: true
  },
  'lv': { 
    name: 'Latvian', 
    shortcode: 'lv', 
    country: 'Latvia',
    isActive: true
  },
  'lt': { 
    name: 'Lithuanian', 
    shortcode: 'lt', 
    country: 'Lithuania',
    isActive: true
  },
  'mt': { 
    name: 'Maltese', 
    shortcode: 'mt', 
    country: 'Malta',
    isActive: true
  },

  // Additional Chinese variants
      'zh-cn': { 
    name: 'Chinese (Simplified)', 
    shortcode: 'zh-cn', 
    country: 'China',
    isActive: true
  },
  'zh-tw': { 
    name: 'Chinese (Traditional)', 
    shortcode: 'zh-tw', 
    country: 'Taiwan',
    isActive: true
  },

  // Additional Asian languages
  'th': { 
    name: 'Thai', 
    shortcode: 'th', 
    country: 'Thailand',
    isActive: true
  },
  'vi': { 
    name: 'Vietnamese', 
    shortcode: 'vi', 
    country: 'Vietnam',
    isActive: true
  },
  'id': { 
    name: 'Indonesian', 
    shortcode: 'id', 
    country: 'Indonesia',
    isActive: true
  },
  'ms': { 
    name: 'Malay', 
    shortcode: 'ms', 
    country: 'Malaysia',
    isActive: true
  },
        'tl': { 
    name: 'Filipino', 
    shortcode: 'tl', 
    country: 'Philippines',
    isActive: true
  },
  'km': { 
    name: 'Khmer', 
    shortcode: 'km', 
    country: 'Cambodia',
    isActive: true
  },
  'lo': { 
    name: 'Lao', 
    shortcode: 'lo', 
    country: 'Laos',
    isActive: true
  },
  'my': { 
    name: 'Burmese', 
    shortcode: 'my', 
    country: 'Myanmar',
    isActive: true
  },
  'si': { 
    name: 'Sinhala', 
    shortcode: 'si', 
    country: 'Sri Lanka',
    isActive: true
  },
  'ne': { 
    name: 'Nepali', 
    shortcode: 'ne', 
    country: 'Nepal',
    isActive: true
  },

  // Additional Middle Eastern languages
    'fa': { 
    name: 'Persian', 
    shortcode: 'fa', 
    country: 'Iran',
    isActive: true
  },
  'ku': { 
    name: 'Kurdish', 
    shortcode: 'ku', 
    country: 'Iraq',
    isActive: true
  },

  // Additional Indian languages
  'gu': { 
    name: 'Gujarati', 
    shortcode: 'gu', 
    country: 'India',
    isActive: true
  },
  'or': { 
    name: 'Odia', 
    shortcode: 'or', 
    country: 'India',
    isActive: true
  },
  'as': { 
    name: 'Assamese', 
    shortcode: 'as', 
    country: 'India',
    isActive: true
  },
  'kn': { 
    name: 'Kannada', 
    shortcode: 'kn', 
    country: 'India',
    isActive: true
  },
  'ta': { 
    name: 'Tamil', 
    shortcode: 'ta', 
    country: 'India',
    isActive: true
  },
  'mt': { 
    name: 'Maithili', 
    shortcode: 'mt', 
    country: 'India',
    isActive: true
  },

  // African languages
  'am': { 
    name: 'Amharic', 
    shortcode: 'am', 
    country: 'Ethiopia',
    isActive: true
  },
      'sw': { 
    name: 'Swahili', 
    shortcode: 'sw', 
    country: 'Tanzania',
    isActive: true
  },
  'zu': { 
    name: 'Zulu', 
    shortcode: 'zu', 
    country: 'South Africa',
    isActive: true
  },
  'af': { 
    name: 'Afrikaans', 
    shortcode: 'af', 
    country: 'South Africa',
    isActive: true
  },
  'xh': { 
    name: 'Xhosa', 
    shortcode: 'xh', 
    country: 'South Africa',
    isActive: true
  },
  'yo': { 
    name: 'Yoruba', 
    shortcode: 'yo', 
    country: 'Nigeria',
    isActive: true
  },
  'ig': { 
    name: 'Igbo', 
    shortcode: 'ig', 
    country: 'Nigeria',
    isActive: true
  },
    'ha': { 
    name: 'Hausa', 
    shortcode: 'ha', 
    country: 'Nigeria',
    isActive: true
  },
  'so': { 
    name: 'Somali', 
    shortcode: 'so', 
    country: 'Somalia',
    isActive: true
  },
  'rw': { 
    name: 'Kinyarwanda', 
    shortcode: 'rw', 
    country: 'Rwanda',
    isActive: true
  },
  'lg': { 
    name: 'Luganda', 
    shortcode: 'lg', 
    country: 'Uganda',
    isActive: true
  }
};

module.exports = { languages };
