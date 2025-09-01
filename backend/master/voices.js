// Master voice configuration for the Voice Translator application
// This file contains user-friendly voice options with clear descriptions

const voices = {
  // English Voices
  'en-US-Standard-A': {
    id: 'en-US-Standard-A',
    name: 'American English - Female',
    displayName: 'American English (Female)',
    language: 'English',
    country: 'United States',
    gender: 'Female',
    accent: 'American',
    description: 'Clear American English female voice',
    isActive: true
  },
  'en-US-Standard-B': {
    id: 'en-US-Standard-B',
    name: 'American English - Male',
    displayName: 'American English (Male)',
    language: 'English',
    country: 'United States',
    gender: 'Male',
    accent: 'American',
    description: 'Clear American English male voice',
    isActive: true
  },
  'en-US-Standard-C': {
    id: 'en-US-Standard-C',
    name: 'American English - Female',
    displayName: 'American English (Female)',
    language: 'English',
    country: 'United States',
    gender: 'Female',
    accent: 'American',
    description: 'Alternative American English female voice',
    isActive: true
  },
  'en-US-Standard-D': {
    id: 'en-US-Standard-D',
    name: 'American English - Male',
    displayName: 'American English (Male)',
    language: 'English',
    country: 'United States',
    gender: 'Male',
    accent: 'American',
    description: 'Alternative American English male voice',
    isActive: true
  },
  'en-GB-Standard-A': {
    id: 'en-GB-Standard-A',
    name: 'British English - Female',
    displayName: 'British English (Female)',
    language: 'English',
    country: 'United Kingdom',
    gender: 'Female',
    accent: 'British',
    description: 'Clear British English female voice',
    isActive: true
  },
  'en-GB-Standard-B': {
    id: 'en-GB-Standard-B',
    name: 'British English - Male',
    displayName: 'British English (Male)',
    language: 'English',
    country: 'United Kingdom',
    gender: 'Male',
    accent: 'British',
    description: 'Clear British English male voice',
    isActive: true
  },
  'en-AU-Standard-A': {
    id: 'en-AU-Standard-A',
    name: 'Australian English - Female',
    displayName: 'Australian English (Female)',
    language: 'English',
    country: 'Australia',
    gender: 'Female',
    accent: 'Australian',
    description: 'Clear Australian English female voice',
    isActive: true
  },
  'en-AU-Standard-B': {
    id: 'en-AU-Standard-B',
    name: 'Australian English - Male',
    displayName: 'Australian English (Male)',
    language: 'English',
    country: 'Australia',
    gender: 'Male',
    accent: 'Australian',
    description: 'Clear Australian English male voice',
    isActive: true
  },

  // Hindi Voices
  'hi-IN-Standard-A': {
    id: 'hi-IN-Standard-A',
    name: 'Hindi - Female',
    displayName: 'Hindi (Female)',
    language: 'Hindi',
    country: 'India',
    gender: 'Female',
    accent: 'Indian',
    description: 'Clear Hindi female voice',
    isActive: true
  },
  'hi-IN-Standard-B': {
    id: 'hi-IN-Standard-B',
    name: 'Hindi - Male',
    displayName: 'Hindi (Male)',
    language: 'Hindi',
    country: 'India',
    gender: 'Male',
    accent: 'Indian',
    description: 'Clear Hindi male voice',
    isActive: true
  },
  'hi-IN-Standard-C': {
    id: 'hi-IN-Standard-C',
    name: 'Hindi - Female',
    displayName: 'Hindi (Female)',
    language: 'Hindi',
    country: 'India',
    gender: 'Female',
    accent: 'Indian',
    description: 'Alternative Hindi female voice',
    isActive: true
  },
  'hi-IN-Standard-D': {
    id: 'hi-IN-Standard-D',
    name: 'Hindi - Male',
    displayName: 'Hindi (Male)',
    language: 'Hindi',
    country: 'India',
    gender: 'Male',
    accent: 'Indian',
    description: 'Alternative Hindi male voice',
    isActive: true
  },

  // Spanish Voices
  'es-ES-Standard-A': {
    id: 'es-ES-Standard-A',
    name: 'Spanish (Spain) - Female',
    displayName: 'Spanish - Spain (Female)',
    language: 'Spanish',
    country: 'Spain',
    gender: 'Female',
    accent: 'Spanish',
    description: 'Clear Spanish female voice from Spain',
    isActive: true
  },
  'es-ES-Standard-B': {
    id: 'es-ES-Standard-B',
    name: 'Spanish (Spain) - Male',
    displayName: 'Spanish - Spain (Male)',
    language: 'Spanish',
    country: 'Spain',
    gender: 'Male',
    accent: 'Spanish',
    description: 'Clear Spanish male voice from Spain',
    isActive: true
  },
  'es-US-Standard-A': {
    id: 'es-US-Standard-A',
    name: 'Spanish (US) - Female',
    displayName: 'Spanish - US (Female)',
    language: 'Spanish',
    country: 'United States',
    gender: 'Female',
    accent: 'American Spanish',
    description: 'Clear Spanish female voice from US',
    isActive: true
  },
  'es-US-Standard-B': {
    id: 'es-US-Standard-B',
    name: 'Spanish (US) - Male',
    displayName: 'Spanish - US (Male)',
    language: 'Spanish',
    country: 'United States',
    gender: 'Male',
    accent: 'American Spanish',
    description: 'Clear Spanish male voice from US',
    isActive: true
  },

  // French Voices
  'fr-FR-Standard-A': {
    id: 'fr-FR-Standard-A',
    name: 'French - Female',
    displayName: 'French (Female)',
    language: 'French',
    country: 'France',
    gender: 'Female',
    accent: 'French',
    description: 'Clear French female voice',
    isActive: true
  },
  'fr-FR-Standard-B': {
    id: 'fr-FR-Standard-B',
    name: 'French - Male',
    displayName: 'French (Male)',
    language: 'French',
    country: 'France',
    gender: 'Male',
    accent: 'French',
    description: 'Clear French male voice',
    isActive: true
  },
  'fr-CA-Standard-A': {
    id: 'fr-CA-Standard-A',
    name: 'French (Canada) - Female',
    displayName: 'French - Canada (Female)',
    language: 'French',
    country: 'Canada',
    gender: 'Female',
    accent: 'Canadian French',
    description: 'Clear Canadian French female voice',
    isActive: true
  },
  'fr-CA-Standard-B': {
    id: 'fr-CA-Standard-B',
    name: 'French (Canada) - Male',
    displayName: 'French - Canada (Male)',
    language: 'French',
    country: 'Canada',
    gender: 'Male',
    accent: 'Canadian French',
    description: 'Clear Canadian French male voice',
    isActive: true
  },

  // German Voices
  'de-DE-Standard-A': {
    id: 'de-DE-Standard-A',
    name: 'German - Female',
    displayName: 'German (Female)',
    language: 'German',
    country: 'Germany',
    gender: 'Female',
    accent: 'German',
    description: 'Clear German female voice',
    isActive: true
  },
  'de-DE-Standard-B': {
    id: 'de-DE-Standard-B',
    name: 'German - Male',
    displayName: 'German (Male)',
    language: 'German',
    country: 'Germany',
    gender: 'Male',
    accent: 'German',
    description: 'Clear German male voice',
    isActive: true
  },

  // Chinese Voices
  'zh-CN-Standard-A': {
    id: 'zh-CN-Standard-A',
    name: 'Chinese (Mandarin) - Female',
    displayName: 'Chinese - Mandarin (Female)',
    language: 'Chinese',
    country: 'China',
    gender: 'Female',
    accent: 'Mandarin',
    description: 'Clear Mandarin Chinese female voice',
    isActive: true
  },
  'zh-CN-Standard-B': {
    id: 'zh-CN-Standard-B',
    name: 'Chinese (Mandarin) - Male',
    displayName: 'Chinese - Mandarin (Male)',
    language: 'Chinese',
    country: 'China',
    gender: 'Male',
    accent: 'Mandarin',
    description: 'Clear Mandarin Chinese male voice',
    isActive: true
  },

  // Japanese Voices
  'ja-JP-Standard-A': {
    id: 'ja-JP-Standard-A',
    name: 'Japanese - Female',
    displayName: 'Japanese (Female)',
    language: 'Japanese',
    country: 'Japan',
    gender: 'Female',
    accent: 'Japanese',
    description: 'Clear Japanese female voice',
    isActive: true
  },
  'ja-JP-Standard-B': {
    id: 'ja-JP-Standard-B',
    name: 'Japanese - Male',
    displayName: 'Japanese (Male)',
    language: 'Japanese',
    country: 'Japan',
    gender: 'Male',
    accent: 'Japanese',
    description: 'Clear Japanese male voice',
    isActive: true
  },

  // Arabic Voices
  'ar-SA-Standard-A': {
    id: 'ar-SA-Standard-A',
    name: 'Arabic - Female',
    displayName: 'Arabic (Female)',
    language: 'Arabic',
    country: 'Saudi Arabia',
    gender: 'Female',
    accent: 'Arabic',
    description: 'Clear Arabic female voice',
    isActive: true
  },
  'ar-SA-Standard-B': {
    id: 'ar-SA-Standard-B',
    name: 'Arabic - Male',
    displayName: 'Arabic (Male)',
    language: 'Arabic',
    country: 'Saudi Arabia',
    gender: 'Male',
    accent: 'Arabic',
    description: 'Clear Arabic male voice',
    isActive: true
  },

  // Portuguese Voices
  'pt-BR-Standard-A': {
    id: 'pt-BR-Standard-A',
    name: 'Portuguese (Brazil) - Female',
    displayName: 'Portuguese - Brazil (Female)',
    language: 'Portuguese',
    country: 'Brazil',
    gender: 'Female',
    accent: 'Brazilian',
    description: 'Clear Brazilian Portuguese female voice',
    isActive: true
  },
  'pt-BR-Standard-B': {
    id: 'pt-BR-Standard-B',
    name: 'Portuguese (Brazil) - Male',
    displayName: 'Portuguese - Brazil (Male)',
    language: 'Portuguese',
    country: 'Brazil',
    gender: 'Male',
    accent: 'Brazilian',
    description: 'Clear Brazilian Portuguese male voice',
    isActive: true
  },

  // Russian Voices
  'ru-RU-Standard-A': {
    id: 'ru-RU-Standard-A',
    name: 'Russian - Female',
    displayName: 'Russian (Female)',
    language: 'Russian',
    country: 'Russia',
    gender: 'Female',
    accent: 'Russian',
    description: 'Clear Russian female voice',
    isActive: true
  },
  'ru-RU-Standard-B': {
    id: 'ru-RU-Standard-B',
    name: 'Russian - Male',
    displayName: 'Russian (Male)',
    language: 'Russian',
    country: 'Russia',
    gender: 'Male',
    accent: 'Russian',
    description: 'Clear Russian male voice',
    isActive: true
  },

  // Italian Voices
  'it-IT-Standard-A': {
    id: 'it-IT-Standard-A',
    name: 'Italian - Female',
    displayName: 'Italian (Female)',
    language: 'Italian',
    country: 'Italy',
    gender: 'Female',
    accent: 'Italian',
    description: 'Clear Italian female voice',
    isActive: true
  },
  'it-IT-Standard-B': {
    id: 'it-IT-Standard-B',
    name: 'Italian - Male',
    displayName: 'Italian (Male)',
    language: 'Italian',
    country: 'Italy',
    gender: 'Male',
    accent: 'Italian',
    description: 'Clear Italian male voice',
    isActive: true
  },

  // Dutch Voices
  'nl-NL-Standard-A': {
    id: 'nl-NL-Standard-A',
    name: 'Dutch - Female',
    displayName: 'Dutch (Female)',
    language: 'Dutch',
    country: 'Netherlands',
    gender: 'Female',
    accent: 'Dutch',
    description: 'Clear Dutch female voice',
    isActive: true
  },
  'nl-NL-Standard-B': {
    id: 'nl-NL-Standard-B',
    name: 'Dutch - Male',
    displayName: 'Dutch (Male)',
    language: 'Dutch',
    country: 'Netherlands',
    gender: 'Male',
    accent: 'Dutch',
    description: 'Clear Dutch male voice',
    isActive: true
  },

  // Polish Voices
  'pl-PL-Standard-A': {
    id: 'pl-PL-Standard-A',
    name: 'Polish - Female',
    displayName: 'Polish (Female)',
    language: 'Polish',
    country: 'Poland',
    gender: 'Female',
    accent: 'Polish',
    description: 'Clear Polish female voice',
    isActive: true
  },
  'pl-PL-Standard-B': {
    id: 'pl-PL-Standard-B',
    name: 'Polish - Male',
    displayName: 'Polish (Male)',
    language: 'Polish',
    country: 'Poland',
    gender: 'Male',
    accent: 'Polish',
    description: 'Clear Polish male voice',
    isActive: true
  },

  // Swedish Voices
  'sv-SE-Standard-A': {
    id: 'sv-SE-Standard-A',
    name: 'Swedish - Female',
    displayName: 'Swedish (Female)',
    language: 'Swedish',
    country: 'Sweden',
    gender: 'Female',
    accent: 'Swedish',
    description: 'Clear Swedish female voice',
    isActive: true
  },
  'sv-SE-Standard-B': {
    id: 'sv-SE-Standard-B',
    name: 'Swedish - Male',
    displayName: 'Swedish (Male)',
    language: 'Swedish',
    country: 'Sweden',
    gender: 'Male',
    accent: 'Swedish',
    description: 'Clear Swedish male voice',
    isActive: true
  },

  // Norwegian Voices
  'no-NO-Standard-A': {
    id: 'no-NO-Standard-A',
    name: 'Norwegian - Female',
    displayName: 'Norwegian (Female)',
    language: 'Norwegian',
    country: 'Norway',
    gender: 'Female',
    accent: 'Norwegian',
    description: 'Clear Norwegian female voice',
    isActive: true
  },
  'no-NO-Standard-B': {
    id: 'no-NO-Standard-B',
    name: 'Norwegian - Male',
    displayName: 'Norwegian (Male)',
    language: 'Norwegian',
    country: 'Norway',
    gender: 'Male',
    accent: 'Norwegian',
    description: 'Clear Norwegian male voice',
    isActive: true
  },

  // Danish Voices
  'da-DK-Standard-A': {
    id: 'da-DK-Standard-A',
    name: 'Danish - Female',
    displayName: 'Danish (Female)',
    language: 'Danish',
    country: 'Denmark',
    gender: 'Female',
    accent: 'Danish',
    description: 'Clear Danish female voice',
    isActive: true
  },
  'da-DK-Standard-B': {
    id: 'da-DK-Standard-B',
    name: 'Danish - Male',
    displayName: 'Danish (Male)',
    language: 'Danish',
    country: 'Denmark',
    gender: 'Male',
    accent: 'Danish',
    description: 'Clear Danish male voice',
    isActive: true
  },

  // Finnish Voices
  'fi-FI-Standard-A': {
    id: 'fi-FI-Standard-A',
    name: 'Finnish - Female',
    displayName: 'Finnish (Female)',
    language: 'Finnish',
    country: 'Finland',
    gender: 'Female',
    accent: 'Finnish',
    description: 'Clear Finnish female voice',
    isActive: true
  },
  'fi-FI-Standard-B': {
    id: 'fi-FI-Standard-B',
    name: 'Finnish - Male',
    displayName: 'Finnish (Male)',
    language: 'Finnish',
    country: 'Finland',
    gender: 'Male',
    accent: 'Finnish',
    description: 'Clear Finnish male voice',
    isActive: true
  },

  // Korean Voices
  'ko-KR-Standard-A': {
    id: 'ko-KR-Standard-A',
    name: 'Korean - Female',
    displayName: 'Korean (Female)',
    language: 'Korean',
    country: 'South Korea',
    gender: 'Female',
    accent: 'Korean',
    description: 'Clear Korean female voice',
    isActive: true
  },
  'ko-KR-Standard-B': {
    id: 'ko-KR-Standard-B',
    name: 'Korean - Male',
    displayName: 'Korean (Male)',
    language: 'Korean',
    country: 'South Korea',
    gender: 'Male',
    accent: 'Korean',
    description: 'Clear Korean male voice',
    isActive: true
  },

  // Thai Voices
  'th-TH-Standard-A': {
    id: 'th-TH-Standard-A',
    name: 'Thai - Female',
    displayName: 'Thai (Female)',
    language: 'Thai',
    country: 'Thailand',
    gender: 'Female',
    accent: 'Thai',
    description: 'Clear Thai female voice',
    isActive: true
  },
  'th-TH-Standard-B': {
    id: 'th-TH-Standard-B',
    name: 'Thai - Male',
    displayName: 'Thai (Male)',
    language: 'Thai',
    country: 'Thailand',
    gender: 'Male',
    accent: 'Thai',
    description: 'Clear Thai male voice',
    isActive: true
  },

  // Vietnamese Voices
  'vi-VN-Standard-A': {
    id: 'vi-VN-Standard-A',
    name: 'Vietnamese - Female',
    displayName: 'Vietnamese (Female)',
    language: 'Vietnamese',
    country: 'Vietnam',
    gender: 'Female',
    accent: 'Vietnamese',
    description: 'Clear Vietnamese female voice',
    isActive: true
  },
  'vi-VN-Standard-B': {
    id: 'vi-VN-Standard-B',
    name: 'Vietnamese - Male',
    displayName: 'Vietnamese (Male)',
    language: 'Vietnamese',
    country: 'Vietnam',
    gender: 'Male',
    accent: 'Vietnamese',
    description: 'Clear Vietnamese male voice',
    isActive: true
  },

  // Indonesian Voices
  'id-ID-Standard-A': {
    id: 'id-ID-Standard-A',
    name: 'Indonesian - Female',
    displayName: 'Indonesian (Female)',
    language: 'Indonesian',
    country: 'Indonesia',
    gender: 'Female',
    accent: 'Indonesian',
    description: 'Clear Indonesian female voice',
    isActive: true
  },
  'id-ID-Standard-B': {
    id: 'id-ID-Standard-B',
    name: 'Indonesian - Male',
    displayName: 'Indonesian (Male)',
    language: 'Indonesian',
    country: 'Indonesia',
    gender: 'Male',
    accent: 'Indonesian',
    description: 'Clear Indonesian male voice',
    isActive: true
  },

  // Malay Voices
  'ms-MY-Standard-A': {
    id: 'ms-MY-Standard-A',
    name: 'Malay - Female',
    displayName: 'Malay (Female)',
    language: 'Malay',
    country: 'Malaysia',
    gender: 'Female',
    accent: 'Malay',
    description: 'Clear Malay female voice',
    isActive: true
  },
  'ms-MY-Standard-B': {
    id: 'ms-MY-Standard-B',
    name: 'Malay - Male',
    displayName: 'Malay (Male)',
    language: 'Malay',
    country: 'Malaysia',
    gender: 'Male',
    accent: 'Malay',
    description: 'Clear Malay male voice',
    isActive: true
  },

  // Turkish Voices
  'tr-TR-Standard-A': {
    id: 'tr-TR-Standard-A',
    name: 'Turkish - Female',
    displayName: 'Turkish (Female)',
    language: 'Turkish',
    country: 'Turkey',
    gender: 'Female',
    accent: 'Turkish',
    description: 'Clear Turkish female voice',
    isActive: true
  },
  'tr-TR-Standard-B': {
    id: 'tr-TR-Standard-B',
    name: 'Turkish - Male',
    displayName: 'Turkish (Male)',
    language: 'Turkish',
    country: 'Turkey',
    gender: 'Male',
    accent: 'Turkish',
    description: 'Clear Turkish male voice',
    isActive: true
  },

  // Hebrew Voices
  'he-IL-Standard-A': {
    id: 'he-IL-Standard-A',
    name: 'Hebrew - Female',
    displayName: 'Hebrew (Female)',
    language: 'Hebrew',
    country: 'Israel',
    gender: 'Female',
    accent: 'Hebrew',
    description: 'Clear Hebrew female voice',
    isActive: true
  },
  'he-IL-Standard-B': {
    id: 'he-IL-Standard-B',
    name: 'Hebrew - Male',
    displayName: 'Hebrew (Male)',
    language: 'Hebrew',
    country: 'Israel',
    gender: 'Male',
    accent: 'Hebrew',
    description: 'Clear Hebrew male voice',
    isActive: true
  },

  // Greek Voices
  'el-GR-Standard-A': {
    id: 'el-GR-Standard-A',
    name: 'Greek - Female',
    displayName: 'Greek (Female)',
    language: 'Greek',
    country: 'Greece',
    gender: 'Female',
    accent: 'Greek',
    description: 'Clear Greek female voice',
    isActive: true
  },
  'el-GR-Standard-B': {
    id: 'el-GR-Standard-B',
    name: 'Greek - Male',
    displayName: 'Greek (Male)',
    language: 'Greek',
    country: 'Greece',
    gender: 'Male',
    accent: 'Greek',
    description: 'Clear Greek male voice',
    isActive: true
  },

  // Czech Voices
  'cs-CZ-Standard-A': {
    id: 'cs-CZ-Standard-A',
    name: 'Czech - Female',
    displayName: 'Czech (Female)',
    language: 'Czech',
    country: 'Czech Republic',
    gender: 'Female',
    accent: 'Czech',
    description: 'Clear Czech female voice',
    isActive: true
  },
  'cs-CZ-Standard-B': {
    id: 'cs-CZ-Standard-B',
    name: 'Czech - Male',
    displayName: 'Czech (Male)',
    language: 'Czech',
    country: 'Czech Republic',
    gender: 'Male',
    accent: 'Czech',
    description: 'Clear Czech male voice',
    isActive: true
  },

  // Hungarian Voices
  'hu-HU-Standard-A': {
    id: 'hu-HU-Standard-A',
    name: 'Hungarian - Female',
    displayName: 'Hungarian (Female)',
    language: 'Hungarian',
    country: 'Hungary',
    gender: 'Female',
    accent: 'Hungarian',
    description: 'Clear Hungarian female voice',
    isActive: true
  },
  'hu-HU-Standard-B': {
    id: 'hu-HU-Standard-B',
    name: 'Hungarian - Male',
    displayName: 'Hungarian (Male)',
    language: 'Hungarian',
    country: 'Hungary',
    gender: 'Male',
    accent: 'Hungarian',
    description: 'Clear Hungarian male voice',
    isActive: true
  },

  // Romanian Voices
  'ro-RO-Standard-A': {
    id: 'ro-RO-Standard-A',
    name: 'Romanian - Female',
    displayName: 'Romanian (Female)',
    language: 'Romanian',
    country: 'Romania',
    gender: 'Female',
    accent: 'Romanian',
    description: 'Clear Romanian female voice',
    isActive: true
  },
  'ro-RO-Standard-B': {
    id: 'ro-RO-Standard-B',
    name: 'Romanian - Male',
    displayName: 'Romanian (Male)',
    language: 'Romanian',
    country: 'Romania',
    gender: 'Male',
    accent: 'Romanian',
    description: 'Clear Romanian male voice',
    isActive: true
  },

  // Bulgarian Voices
  'bg-BG-Standard-A': {
    id: 'bg-BG-Standard-A',
    name: 'Bulgarian - Female',
    displayName: 'Bulgarian (Female)',
    language: 'Bulgarian',
    country: 'Bulgaria',
    gender: 'Female',
    accent: 'Bulgarian',
    description: 'Clear Bulgarian female voice',
    isActive: true
  },
  'bg-BG-Standard-B': {
    id: 'bg-BG-Standard-B',
    name: 'Bulgarian - Male',
    displayName: 'Bulgarian (Male)',
    language: 'Bulgarian',
    country: 'Bulgaria',
    gender: 'Male',
    accent: 'Bulgarian',
    description: 'Clear Bulgarian male voice',
    isActive: true
  },

  // Croatian Voices
  'hr-HR-Standard-A': {
    id: 'hr-HR-Standard-A',
    name: 'Croatian - Female',
    displayName: 'Croatian (Female)',
    language: 'Croatian',
    country: 'Croatia',
    gender: 'Female',
    accent: 'Croatian',
    description: 'Clear Croatian female voice',
    isActive: true
  },
  'hr-HR-Standard-B': {
    id: 'hr-HR-Standard-B',
    name: 'Croatian - Male',
    displayName: 'Croatian (Male)',
    language: 'Croatian',
    country: 'Croatia',
    gender: 'Male',
    accent: 'Croatian',
    description: 'Clear Croatian male voice',
    isActive: true
  },

  // Serbian Voices
  'sr-RS-Standard-A': {
    id: 'sr-RS-Standard-A',
    name: 'Serbian - Female',
    displayName: 'Serbian (Female)',
    language: 'Serbian',
    country: 'Serbia',
    gender: 'Female',
    accent: 'Serbian',
    description: 'Clear Serbian female voice',
    isActive: true
  },
  'sr-RS-Standard-B': {
    id: 'sr-RS-Standard-B',
    name: 'Serbian - Male',
    displayName: 'Serbian (Male)',
    language: 'Serbian',
    country: 'Serbia',
    gender: 'Male',
    accent: 'Serbian',
    description: 'Clear Serbian male voice',
    isActive: true
  },

  // Ukrainian Voices
  'uk-UA-Standard-A': {
    id: 'uk-UA-Standard-A',
    name: 'Ukrainian - Female',
    displayName: 'Ukrainian (Female)',
    language: 'Ukrainian',
    country: 'Ukraine',
    gender: 'Female',
    accent: 'Ukrainian',
    description: 'Clear Ukrainian female voice',
    isActive: true
  },
  'uk-UA-Standard-B': {
    id: 'uk-UA-Standard-B',
    name: 'Ukrainian - Male',
    displayName: 'Ukrainian (Male)',
    language: 'Ukrainian',
    country: 'Ukraine',
    gender: 'Male',
    accent: 'Ukrainian',
    description: 'Clear Ukrainian male voice',
    isActive: true
  },

  // Estonian Voices
  'et-EE-Standard-A': {
    id: 'et-EE-Standard-A',
    name: 'Estonian - Female',
    displayName: 'Estonian (Female)',
    language: 'Estonian',
    country: 'Estonia',
    gender: 'Female',
    accent: 'Estonian',
    description: 'Clear Estonian female voice',
    isActive: true
  },
  'et-EE-Standard-B': {
    id: 'et-EE-Standard-B',
    name: 'Estonian - Male',
    displayName: 'Estonian (Male)',
    language: 'Estonian',
    country: 'Estonia',
    gender: 'Male',
    accent: 'Estonian',
    description: 'Clear Estonian male voice',
    isActive: true
  },

  // Latvian Voices
  'lv-LV-Standard-A': {
    id: 'lv-LV-Standard-A',
    name: 'Latvian - Female',
    displayName: 'Latvian (Female)',
    language: 'Latvian',
    country: 'Latvia',
    gender: 'Female',
    accent: 'Latvian',
    description: 'Clear Latvian female voice',
    isActive: true
  },
  'lv-LV-Standard-B': {
    id: 'lv-LV-Standard-B',
    name: 'Latvian - Male',
    displayName: 'Latvian (Male)',
    language: 'Latvian',
    country: 'Latvia',
    gender: 'Male',
    accent: 'Latvian',
    description: 'Clear Latvian male voice',
    isActive: true
  },

  // Lithuanian Voices
  'lt-LT-Standard-A': {
    id: 'lt-LT-Standard-A',
    name: 'Lithuanian - Female',
    displayName: 'Lithuanian (Female)',
    language: 'Lithuanian',
    country: 'Lithuania',
    gender: 'Female',
    accent: 'Lithuanian',
    description: 'Clear Lithuanian female voice',
    isActive: true
  },
  'lt-LT-Standard-B': {
    id: 'lt-LT-Standard-B',
    name: 'Lithuanian - Male',
    displayName: 'Lithuanian (Male)',
    language: 'Lithuanian',
    country: 'Lithuania',
    gender: 'Male',
    accent: 'Lithuanian',
    description: 'Clear Lithuanian male voice',
    isActive: true
  },

  // Slovenian Voices
  'sl-SI-Standard-A': {
    id: 'sl-SI-Standard-A',
    name: 'Slovenian - Female',
    displayName: 'Slovenian (Female)',
    language: 'Slovenian',
    country: 'Slovenia',
    gender: 'Female',
    accent: 'Slovenian',
    description: 'Clear Slovenian female voice',
    isActive: true
  },
  'sl-SI-Standard-B': {
    id: 'sl-SI-Standard-B',
    name: 'Slovenian - Male',
    displayName: 'Slovenian (Male)',
    language: 'Slovenian',
    country: 'Slovenia',
    gender: 'Male',
    accent: 'Slovenian',
    description: 'Clear Slovenian male voice',
    isActive: true
  },

  // Slovak Voices
  'sk-SK-Standard-A': {
    id: 'sk-SK-Standard-A',
    name: 'Slovak - Female',
    displayName: 'Slovak (Female)',
    language: 'Slovak',
    country: 'Slovakia',
    gender: 'Female',
    accent: 'Slovak',
    description: 'Clear Slovak female voice',
    isActive: true
  },
  'sk-SK-Standard-B': {
    id: 'sk-SK-Standard-B',
    name: 'Slovak - Male',
    displayName: 'Slovak (Male)',
    language: 'Slovak',
    country: 'Slovakia',
    gender: 'Male',
    accent: 'Slovak',
    description: 'Clear Slovak male voice',
    isActive: true
  },

  // Maltese Voices
  'mt-MT-Standard-A': {
    id: 'mt-MT-Standard-A',
    name: 'Maltese - Female',
    displayName: 'Maltese (Female)',
    language: 'Maltese',
    country: 'Malta',
    gender: 'Female',
    accent: 'Maltese',
    description: 'Clear Maltese female voice',
    isActive: true
  },
  'mt-MT-Standard-B': {
    id: 'mt-MT-Standard-B',
    name: 'Maltese - Male',
    displayName: 'Maltese (Male)',
    language: 'Maltese',
    country: 'Malta',
    gender: 'Male',
    accent: 'Maltese',
    description: 'Clear Maltese male voice',
    isActive: true
  },

  // Irish Voices
  'ga-IE-Standard-A': {
    id: 'ga-IE-Standard-A',
    name: 'Irish - Female',
    displayName: 'Irish (Female)',
    language: 'Irish',
    country: 'Ireland',
    gender: 'Female',
    accent: 'Irish',
    description: 'Clear Irish female voice',
    isActive: true
  },
  'ga-IE-Standard-B': {
    id: 'ga-IE-Standard-B',
    name: 'Irish - Male',
    displayName: 'Irish (Male)',
    language: 'Irish',
    country: 'Ireland',
    gender: 'Male',
    accent: 'Irish',
    description: 'Clear Irish male voice',
    isActive: true
  },

  // Welsh Voices
  'cy-GB-Standard-A': {
    id: 'cy-GB-Standard-A',
    name: 'Welsh - Female',
    displayName: 'Welsh (Female)',
    language: 'Welsh',
    country: 'United Kingdom',
    gender: 'Female',
    accent: 'Welsh',
    description: 'Clear Welsh female voice',
    isActive: true
  },
  'cy-GB-Standard-B': {
    id: 'cy-GB-Standard-B',
    name: 'Welsh - Male',
    displayName: 'Welsh (Male)',
    language: 'Welsh',
    country: 'United Kingdom',
    gender: 'Male',
    accent: 'Welsh',
    description: 'Clear Welsh male voice',
    isActive: true
  },

  // Icelandic Voices
  'is-IS-Standard-A': {
    id: 'is-IS-Standard-A',
    name: 'Icelandic - Female',
    displayName: 'Icelandic (Female)',
    language: 'Icelandic',
    country: 'Iceland',
    gender: 'Female',
    accent: 'Icelandic',
    description: 'Clear Icelandic female voice',
    isActive: true
  },
  'is-IS-Standard-B': {
    id: 'is-IS-Standard-B',
    name: 'Icelandic - Male',
    displayName: 'Icelandic (Male)',
    language: 'Icelandic',
    country: 'Iceland',
    gender: 'Male',
    accent: 'Icelandic',
    description: 'Clear Icelandic male voice',
    isActive: true
  },

  // Luxembourgish Voices
  'lb-LU-Standard-A': {
    id: 'lb-LU-Standard-A',
    name: 'Luxembourgish - Female',
    displayName: 'Luxembourgish (Female)',
    language: 'Luxembourgish',
    country: 'Luxembourg',
    gender: 'Female',
    accent: 'Luxembourgish',
    description: 'Clear Luxembourgish female voice',
    isActive: true
  },
  'lb-LU-Standard-B': {
    id: 'lb-LU-Standard-B',
    name: 'Luxembourgish - Male',
    displayName: 'Luxembourgish (Male)',
    language: 'Luxembourgish',
    country: 'Luxembourg',
    gender: 'Male',
    accent: 'Luxembourgish',
    description: 'Clear Luxembourgish male voice',
    isActive: true
  }
};

module.exports = { voices };
