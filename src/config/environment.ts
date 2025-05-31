// Environment configuration
// In Expo, environment variables are available at build time
// and need to be prefixed with EXPO_PUBLIC_ to be accessible in client code

const getEnvVar = (key: string, defaultValue: string): string => {
  // In Expo, environment variables are injected at build time
  // @ts-ignore - Expo injects environment variables at build time
  const env = typeof process !== 'undefined' ? process.env : {};
  const value = env[key];

  // Debug logging to help identify environment variable issues
  if (__DEV__) {
    console.log(`Environment variable ${key}:`, value || 'undefined');
    console.log('All EXPO_PUBLIC_ variables:', Object.keys(env).filter(k => k.startsWith('EXPO_PUBLIC_')));
  }

  return value || defaultValue;
};

// Validate API URL format
const validateApiUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

const API_BASE_URL = getEnvVar('EXPO_PUBLIC_API_BASE_URL', 'http://127.0.0.1:8000');

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