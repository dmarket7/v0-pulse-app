import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiService, SignInRequest, SignUpRequest, UserResponse, ApiError } from '../services/api';

interface AuthContextType {
  user: UserResponse | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (credentials: SignInRequest) => Promise<void>;
  signUp: (userData: SignUpRequest) => Promise<UserResponse>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  // Load stored token and user data on app start
  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      if (token) {
        apiService.setAuthToken(token);
        await refreshUser();
      }
    } catch (error) {
      console.error('Failed to load stored auth:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (credentials: SignInRequest) => {
    try {
      setIsLoading(true);
      const response = await apiService.signIn(credentials);

      // Store tokens
      await AsyncStorage.setItem(TOKEN_KEY, response.access_token);
      await AsyncStorage.setItem(REFRESH_TOKEN_KEY, response.refresh_token);

      // Set token in API service
      apiService.setAuthToken(response.access_token);

      // Set user data
      setUser(response.user);
    } catch (error) {
      console.error('Sign in failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (userData: SignUpRequest) => {
    try {
      setIsLoading(true);
      console.log('Creating user account...');
      const user = await apiService.signUp(userData);
      console.log('User account created successfully');

      // Automatically sign in after successful signup with retry logic
      console.log('Attempting automatic sign-in...');
      let signInAttempts = 0;
      const maxAttempts = 3;
      const baseDelay = 500; // Start with 500ms delay

      while (signInAttempts < maxAttempts) {
        try {
          // Add a small delay before attempting sign-in (except for first attempt)
          if (signInAttempts > 0) {
            const delay = baseDelay * signInAttempts;
            console.log(`Waiting ${delay}ms before retry attempt ${signInAttempts + 1}...`);
            await new Promise(resolve => setTimeout(resolve, delay));
          }

          console.log(`Auto sign-in attempt ${signInAttempts + 1}/${maxAttempts}...`);
          await signIn({
            email: userData.email,
            password: userData.password,
          });

          // If we get here, sign-in was successful
          console.log('Automatic sign-in successful!');
          return user;
        } catch (signInError) {
          signInAttempts++;
          console.log(`Auto sign-in attempt ${signInAttempts} failed:`, signInError);

          if (signInAttempts >= maxAttempts) {
            // If all auto sign-in attempts failed, still return the user
            // but don't throw an error - the account was created successfully
            console.warn('Auto sign-in failed after signup, but account was created successfully');
            console.warn('User will need to manually sign in');
            return user;
          }
        }
      }

      return user;
    } catch (error) {
      console.error('Sign up failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);

      // Call API signout if user is authenticated
      if (isAuthenticated) {
        try {
          await apiService.signOut();
        } catch (error) {
          // Continue with local signout even if API call fails
          console.error('API signout failed:', error);
        }
      }

      // Clear local storage
      await AsyncStorage.multiRemove([TOKEN_KEY, REFRESH_TOKEN_KEY]);

      // Clear API service token
      apiService.clearAuthToken();

      // Clear user state
      setUser(null);
    } catch (error) {
      console.error('Sign out failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      const userData = await apiService.getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error('Failed to refresh user:', error);
      // If refresh fails, clear auth state
      await signOut();
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    signIn,
    signUp,
    signOut,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}