// Environment configuration
// In Expo, environment variables are available at build time
// and need to be prefixed with EXPO_PUBLIC_ to be accessible in client code
const getEnvVar = (key: string, defaultValue: string): string => {
  // @ts-ignore - Expo injects environment variables at build time
  return process.env[key] || defaultValue;
};

export const config = {
  API_BASE_URL: getEnvVar('EXPO_PUBLIC_API_BASE_URL', 'http://127.0.0.1:8000'),
};

export default config;