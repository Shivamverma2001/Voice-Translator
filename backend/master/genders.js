// Master gender configuration for the Voice Translator application
// This file contains user-friendly gender options

const genders = {
  'male': {
    id: 'male',
    name: 'Male',
    displayName: 'Male',
    description: 'Male gender option',
    isActive: true
  },
  'female': {
    id: 'female',
    name: 'Female', 
    displayName: 'Female',
    description: 'Female gender option',
    isActive: true
  },
  'other': {
    id: 'other',
    name: 'Other',
    displayName: 'Other',
    description: 'Other gender identity',
    isActive: true
  },
  'prefer-not-to-say': {
    id: 'prefer-not-to-say',
    name: 'Prefer not to say',
    displayName: 'Prefer not to say',
    description: 'Prefer not to specify gender',
    isActive: true
  }
};

module.exports = { genders };
