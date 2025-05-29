# Authentication Implementation Guide

This guide explains the authentication system implemented in the Pulse app.

## Overview

The app now includes a complete authentication system that integrates with the backend API. Users can sign up, sign in, and sign out securely with persistent authentication state.

## Architecture

### 1. Authentication Context (`src/contexts/AuthContext.tsx`)

The `AuthContext` provides authentication state and methods throughout the app:

- **State Management**: Tracks user authentication status and user data
- **Token Storage**: Securely stores JWT tokens using AsyncStorage
- **API Integration**: Automatically includes auth tokens in API requests
- **Auto-refresh**: Loads stored tokens on app startup

#### Key Methods:

- `signIn(credentials)` - Authenticate user with email/password
- `signUp(userData)` - Register new user account
- `signOut()` - Clear authentication state and tokens
- `refreshUser()` - Reload current user data

### 2. API Service Updates (`src/services/api.ts`)

Enhanced the API service with:

- **Proper TypeScript interfaces** for authentication responses
- **Improved error handling** with structured error types
- **Token management** methods for setting/clearing auth tokens
- **Automatic token inclusion** in authenticated requests

### 3. Authentication Screens

#### Login Screen (`src/screens/LoginScreen.tsx`)

- **Dual Mode**: Supports both sign in and sign up
- **Form Validation**: Validates required fields
- **Error Handling**: Shows user-friendly error messages
- **Loading States**: Provides visual feedback during authentication
- **Modern UI**: Matches the app's design language

#### Loading Screen (`src/components/LoadingScreen.tsx`)

- **Startup Loading**: Shows while determining authentication state
- **Branded Design**: Uses app logo and colors

### 4. Navigation Flow (`App.tsx`)

The app now uses conditional navigation based on authentication state:

```typescript
{isAuthenticated ? (
  // Authenticated screens (Dashboard, Settings, etc.)
) : (
  // Unauthenticated screens (Welcome, Login)
)}
```

## Usage

### For Users

1. **First Time Users**:

   - Open the app → Welcome screen appears
   - Tap "Log In" or "Sign Up" → Navigate to Login screen
   - Fill in credentials → Automatic navigation to dashboard

2. **Returning Users**:

   - Open the app → Automatic sign in if tokens are valid
   - Direct navigation to dashboard

3. **Sign Out**:
   - Go to Settings → Tap "Sign Out"
   - Confirmation dialog → Returns to Welcome screen

### For Developers

#### Using Authentication in Components

```typescript
import { useAuth } from "../contexts/AuthContext";

function MyComponent() {
  const { user, isAuthenticated, signOut } = useAuth();

  if (!isAuthenticated) {
    return <Text>Please sign in</Text>;
  }

  return (
    <View>
      <Text>Welcome, {user?.email}</Text>
      <Button title="Sign Out" onPress={signOut} />
    </View>
  );
}
```

#### Making Authenticated API Calls

The API service automatically includes auth tokens:

```typescript
// This will include the Bearer token automatically
const healthLogs = await apiService.getHealthLogs(childId);
```

## Security Features

1. **Secure Token Storage**: Uses AsyncStorage for persistent, secure token storage
2. **Automatic Token Cleanup**: Clears tokens on sign out or auth errors
3. **Error Handling**: Graceful handling of expired or invalid tokens
4. **HTTPS Communication**: All API calls use HTTPS in production

## API Integration

The authentication system integrates with these backend endpoints:

- `POST /api/v1/auth/signup` - User registration
- `POST /api/v1/auth/signin` - User authentication
- `POST /api/v1/auth/signout` - User sign out
- `GET /api/v1/auth/me` - Get current user profile

## Environment Configuration

Set your API base URL in `.env`:

```bash
EXPO_PUBLIC_API_BASE_URL=https://your-api-domain.com
```

## Testing

### Manual Testing

1. **Sign Up Flow**:

   - Create new account with valid email/password
   - Verify automatic sign in after registration
   - Check dashboard access

2. **Sign In Flow**:

   - Sign in with existing credentials
   - Verify dashboard access
   - Test "Remember me" functionality

3. **Sign Out Flow**:

   - Sign out from Settings
   - Verify return to Welcome screen
   - Confirm tokens are cleared

4. **Error Handling**:
   - Test with invalid credentials
   - Test with network errors
   - Verify user-friendly error messages

### Automated Testing

```bash
# Run the app in development
npm start

# Test on iOS simulator
npm run ios

# Test on Android emulator
npm run android
```

## Troubleshooting

### Common Issues

1. **"Network Error"**:

   - Check API URL in `.env` file
   - Verify backend is running
   - Check network connectivity

2. **"Invalid Token"**:

   - Clear app data/storage
   - Sign in again
   - Check token expiration settings

3. **"Sign Up Failed"**:
   - Verify email format
   - Check password requirements
   - Ensure unique email address

### Debug Mode

Enable debug logging by checking the console for authentication-related logs:

```typescript
console.log("Auth state:", { user, isAuthenticated, isLoading });
```

## Future Enhancements

Potential improvements for the authentication system:

1. **Biometric Authentication**: Face ID/Touch ID support
2. **Social Login**: Google, Apple, Facebook integration
3. **Password Reset**: Email-based password recovery
4. **Multi-factor Authentication**: SMS or app-based 2FA
5. **Session Management**: Advanced token refresh logic
6. **Offline Support**: Cached authentication for offline use

## Security Considerations

1. **Token Expiration**: Implement proper token refresh logic
2. **Secure Storage**: Consider using Keychain/Keystore for sensitive data
3. **Certificate Pinning**: Add SSL certificate pinning for production
4. **Input Validation**: Validate all user inputs on client and server
5. **Rate Limiting**: Implement rate limiting for auth endpoints
