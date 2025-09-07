// Master theme configuration for the Voice Translator application
// This file contains user-friendly theme options with clear descriptions

const themes = {
  'light': {
    id: 'light',
    name: 'Light Theme',
    displayName: 'Light',
    description: 'Clean and bright interface with light colors',
    icon: '☀️',
    category: 'Light',
    colors: {
      background: 'bg-white',
      backgroundAlt: 'bg-white',
      card: 'bg-white',
      cardHover: 'hover:bg-gray-50',
      text: 'text-gray-900',
      textSecondary: 'text-gray-600',
      textMuted: 'text-gray-500',
      border: 'border-gray-200',
      borderHover: 'hover:border-gray-300',
      primary: 'bg-blue-600',
      primaryHover: 'hover:bg-blue-700',
      primaryText: 'text-blue-600',
      secondary: 'bg-gray-100',
      secondaryHover: 'hover:bg-gray-200',
      secondaryText: 'text-gray-700',
      icon: 'text-blue-600',
      accent: 'bg-indigo-100',
      accentHover: 'hover:bg-indigo-200',
      accentText: 'text-indigo-700',
      success: 'bg-green-100',
      successText: 'text-green-700',
      error: 'bg-red-100',
      errorText: 'text-red-700',
      warning: 'bg-yellow-100',
      warningText: 'text-yellow-700',
      input: 'bg-white border-gray-300 focus:border-blue-500 focus:ring-0',
      sidebar: 'bg-white border-r border-gray-200',
      header: 'bg-white border-b border-gray-200',
      shadow: 'shadow-sm',
      shadowHover: 'hover:shadow-md',
      shadowLarge: 'shadow-lg',
      selected: 'bg-blue-50 text-blue-700 border-blue-200',
      hover: 'hover:bg-gray-50'
    },
    colorsApp: {
      // Background colors
      primary: '#ffffff',
      secondary: '#f8fafc',
      tertiary: '#f1f5f9',
      surface: '#ffffff',
      background: '#ffffff',
      
      // Text colors
      textPrimary: '#111827',
      textSecondary: '#374151',
      textTertiary: '#6b7280',
      
      // Border colors
      border: '#e2e8f0',
      borderLight: '#f1f5f9',
      
      // Accent colors
      accent: '#3b82f6',
      accentLight: '#eff6ff',
      accentDark: '#1d4ed8',
      
      // Status colors
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      
      // Interactive colors
      buttonPrimary: '#3b82f6',
      buttonSecondary: '#f8fafc',
      buttonText: '#ffffff',
      
      // Shadow colors
      shadow: '#000000',
      shadowLight: '#000000'
    },
    isActive: true
  },

  'ocean': {
    id: 'ocean',
    name: 'Ocean Theme',
    displayName: 'Ocean',
    description: 'Calming blue tones inspired by the ocean',
    icon: '🌊',
    category: 'Nature',
    colors: {
      background: 'bg-cyan-100',
      backgroundAlt: 'bg-cyan-100',
      card: 'bg-cyan-50',
      cardHover: 'hover:bg-cyan-200',
      text: 'text-slate-700',
      textSecondary: 'text-slate-600',
      textMuted: 'text-slate-500',
      border: 'border-cyan-200',
      borderHover: 'hover:border-cyan-300',
      primary: 'bg-cyan-600',
      primaryHover: 'hover:bg-cyan-700',
      primaryText: 'text-cyan-600',
      secondary: 'bg-blue-100',
      secondaryHover: 'hover:bg-blue-200',
      secondaryText: 'text-blue-700',
      icon: 'text-cyan-600',
      accent: 'bg-indigo-100',
      accentHover: 'hover:bg-indigo-200',
      accentText: 'text-indigo-700',
      success: 'bg-teal-100',
      successText: 'text-teal-700',
      error: 'bg-rose-100',
      errorText: 'text-rose-700',
      warning: 'bg-amber-100',
      warningText: 'text-amber-700',
      input: 'bg-white border-cyan-300 focus:border-cyan-500 focus:ring-0',
      sidebar: 'bg-cyan-100 border-r border-cyan-300 shadow-lg',
      header: 'bg-cyan-100 border-b border-cyan-300',
      shadow: 'shadow-sm',
      shadowHover: 'hover:shadow-md',
      shadowLarge: 'shadow-lg',
      selected: 'bg-cyan-50 text-cyan-700 border-cyan-300',
      hover: 'hover:bg-cyan-200'
    },
    colorsApp: {
      // Background colors
      primary: '#ffffff',
      secondary: '#f0fdfa',
      tertiary: '#ccfbf1',
      surface: '#ffffff',
      background: '#f0fdfa',
      
      // Text colors
      textPrimary: '#0f766e',
      textSecondary: '#0d9488',
      textTertiary: '#14b8a6',
      
      // Border colors
      border: '#14b8a6',
      borderLight: '#5eead4',
      
      // Accent colors
      accent: '#0d9488',
      accentLight: '#ccfbf1',
      accentDark: '#0f766e',
      
      // Status colors
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      
      // Interactive colors
      buttonPrimary: '#0d9488',
      buttonSecondary: '#ccfbf1',
      buttonText: '#ffffff',
      
      // Shadow colors
      shadow: '#0f766e',
      shadowLight: '#14b8a6'
    },
    isActive: true
  },

  'sunset': {
    id: 'sunset',
    name: 'Sunset Theme',
    displayName: 'Sunset',
    description: 'Warm orange and red tones like a beautiful sunset',
    icon: '🌅',
    category: 'Nature',
    colors: {
      background: 'bg-orange-100',
      backgroundAlt: 'bg-orange-100',
      card: 'bg-orange-50',
      cardHover: 'hover:bg-orange-200',
      text: 'text-orange-900',
      textSecondary: 'text-orange-700',
      textMuted: 'text-orange-600',
      border: 'border-orange-200',
      borderHover: 'hover:border-orange-300',
      primary: 'bg-orange-600',
      primaryHover: 'hover:bg-orange-700',
      primaryText: 'text-orange-600',
      secondary: 'bg-red-100',
      secondaryHover: 'hover:bg-red-200',
      secondaryText: 'text-red-700',
      icon: 'text-orange-600',
      accent: 'bg-pink-100',
      accentHover: 'hover:bg-pink-200',
      accentText: 'text-pink-700',
      success: 'bg-emerald-100',
      successText: 'text-emerald-700',
      error: 'bg-red-100',
      errorText: 'text-red-700',
      warning: 'bg-amber-100',
      warningText: 'text-amber-700',
      input: 'bg-white border-orange-300 focus:border-orange-500 focus:ring-0',
      sidebar: 'bg-orange-100 border-r border-orange-300 shadow-lg',
      header: 'bg-orange-100 border-b border-orange-300',
      shadow: 'shadow-sm',
      shadowHover: 'hover:shadow-md',
      shadowLarge: 'shadow-lg',
      selected: 'bg-orange-50 text-orange-700 border-orange-300',
      hover: 'hover:bg-orange-200'
    },
    colorsApp: {
      // Background colors
      primary: '#ffffff',
      secondary: '#fef7ed',
      tertiary: '#fed7aa',
      surface: '#ffffff',
      background: '#fef7ed',
      
      // Text colors
      textPrimary: '#9a3412',
      textSecondary: '#c2410c',
      textTertiary: '#ea580c',
      
      // Border colors
      border: '#ea580c',
      borderLight: '#fb923c',
      
      // Accent colors
      accent: '#c2410c',
      accentLight: '#fed7aa',
      accentDark: '#9a3412',
      
      // Status colors
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      
      // Interactive colors
      buttonPrimary: '#c2410c',
      buttonSecondary: '#fed7aa',
      buttonText: '#ffffff',
      
      // Shadow colors
      shadow: '#9a3412',
      shadowLight: '#ea580c'
    },
    isActive: true
  },

  'forest': {
    id: 'forest',
    name: 'Forest Theme',
    displayName: 'Forest',
    description: 'Natural green tones with professional contrast and clarity',
    icon: '🌲',
    category: 'Nature',
    colors: {
      background: 'bg-white',
      backgroundAlt: 'bg-white',
      card: 'bg-white',
      cardHover: 'hover:bg-green-50',
      text: 'text-gray-900',
      textSecondary: 'text-gray-600',
      textMuted: 'text-gray-500',
      border: 'border-green-200',
      borderHover: 'hover:border-green-300',
      primary: 'bg-green-600',
      primaryHover: 'hover:bg-green-700',
      primaryText: 'text-green-600',
      secondary: 'bg-green-100',
      secondaryHover: 'hover:bg-green-200',
      secondaryText: 'text-green-700',
      icon: 'text-green-600',
      accent: 'bg-emerald-100',
      accentHover: 'hover:bg-emerald-200',
      accentText: 'text-emerald-700',
      success: 'bg-green-100',
      successText: 'text-green-700',
      error: 'bg-red-100',
      errorText: 'text-red-700',
      warning: 'bg-yellow-100',
      warningText: 'text-yellow-700',
      input: 'bg-white border-green-300 focus:border-green-500 focus:ring-0',
      sidebar: 'bg-white border-r border-green-200',
      header: 'bg-white border-b border-green-200',
      shadow: 'shadow-sm',
      shadowHover: 'hover:shadow-md',
      shadowLarge: 'shadow-lg',
      selected: 'bg-green-50 text-green-700 border-green-200',
      hover: 'hover:bg-green-50'
    },
    colorsApp: {
      // Background colors
      primary: '#ffffff',
      secondary: '#f0fdf4',
      tertiary: '#dcfce7',
      surface: '#ffffff',
      background: '#f0fdf4',
      
      // Text colors
      textPrimary: '#14532d',
      textSecondary: '#166534',
      textTertiary: '#16a34a',
      
      // Border colors
      border: '#16a34a',
      borderLight: '#4ade80',
      
      // Accent colors
      accent: '#166534',
      accentLight: '#dcfce7',
      accentDark: '#14532d',
      
      // Status colors
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      
      // Interactive colors
      buttonPrimary: '#166534',
      buttonSecondary: '#dcfce7',
      buttonText: '#ffffff',
      
      // Shadow colors
      shadow: '#14532d',
      shadowLight: '#16a34a'
    },
    isActive: true
  },

  'lavender': {
    id: 'lavender',
    name: 'Lavender Theme',
    displayName: 'Lavender',
    description: 'Elegant purple tones with rich contrast and professional styling',
    icon: '💜',
    category: 'Elegant',
    colors: {
      background: 'bg-white',
      backgroundAlt: 'bg-white',
      card: 'bg-white',
      cardHover: 'hover:bg-purple-50',
      text: 'text-gray-900',
      textSecondary: 'text-gray-600',
      textMuted: 'text-gray-500',
      border: 'border-purple-200',
      borderHover: 'hover:border-purple-300',
      primary: 'bg-purple-600',
      primaryHover: 'hover:bg-purple-700',
      primaryText: 'text-purple-600',
      secondary: 'bg-purple-100',
      secondaryHover: 'hover:bg-purple-200',
      secondaryText: 'text-purple-700',
      icon: 'text-purple-600',
      accent: 'bg-violet-100',
      accentHover: 'hover:bg-violet-200',
      accentText: 'text-violet-700',
      success: 'bg-green-100',
      successText: 'text-green-700',
      error: 'bg-red-100',
      errorText: 'text-red-700',
      warning: 'bg-yellow-100',
      warningText: 'text-yellow-700',
      input: 'bg-white border-purple-300 focus:border-purple-500 focus:ring-0',
      sidebar: 'bg-white border-r border-purple-200',
      header: 'bg-white border-b border-purple-200',
      shadow: 'shadow-sm',
      shadowHover: 'hover:shadow-md',
      shadowLarge: 'shadow-lg',
      selected: 'bg-purple-50 text-purple-700 border-purple-200',
      hover: 'hover:bg-purple-50'
    },
    colorsApp: {
      // Background colors
      primary: '#ffffff',
      secondary: '#faf5ff',
      tertiary: '#f3e8ff',
      surface: '#ffffff',
      background: '#faf5ff',
      
      // Text colors
      textPrimary: '#581c87',
      textSecondary: '#7c3aed',
      textTertiary: '#a855f7',
      
      // Border colors
      border: '#a855f7',
      borderLight: '#c084fc',
      
      // Accent colors
      accent: '#7c3aed',
      accentLight: '#f3e8ff',
      accentDark: '#581c87',
      
      // Status colors
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      
      // Interactive colors
      buttonPrimary: '#7c3aed',
      buttonSecondary: '#f3e8ff',
      buttonText: '#ffffff',
      
      // Shadow colors
      shadow: '#581c87',
      shadowLight: '#a855f7'
    },
    isActive: true
  }
};

module.exports = { themes };
