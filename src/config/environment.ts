// Environment configuration
// In Expo, environment variables are available at build time
// and need to be prefixed with EXPO_PUBLIC_ to be accessible in client code

// Validate API URL format
const validateApiUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000';

// Debug logging in development to help identify environment variable issues
if (__DEV__) {
  console.log('EXPO_PUBLIC_API_BASE_URL:', process.env.EXPO_PUBLIC_API_BASE_URL || 'undefined');
  console.log('Using API_BASE_URL:', API_BASE_URL);
}

// Validate the API URL
if (!validateApiUrl(API_BASE_URL)) {
  console.error('Invalid API Base URL:', API_BASE_URL);
  throw new Error(`Invalid API Base URL: ${API_BASE_URL}`);
}

// Additional production validation
if (!__DEV__ && API_BASE_URL === 'http://127.0.0.1:8000') {
  console.warn('WARNING: Using localhost API URL in production build!');
  console.warn('This will cause network errors. Check your EXPO_PUBLIC_API_BASE_URL environment variable.');
}

export const config = {
  // Uses environment variable if set, otherwise defaults to localhost for development
  API_BASE_URL,
  // Expose for debugging
  IS_PRODUCTION: !__DEV__,
  ENV_SOURCE: API_BASE_URL === 'http://127.0.0.1:8000' ? 'default' : 'environment',
};

// Debug logging in development and startup logging in production
if (__DEV__) {
  console.log('API Configuration:', config);
} else {
  // Log only essential info in production
  console.log('Pulse App - API Base URL:', config.API_BASE_URL);
  console.log('Environment source:', config.ENV_SOURCE);
}

export default config;