import { Ionicons } from '@expo/vector-icons';
import type { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import type { RootStackParamList } from '../../App';
import { Logo } from '../components/Logo';
import { Colors } from '../constants/colors';
import { useAuth } from '../contexts/AuthContext';
import { ApiError } from '../services/api';
import { formatTimezoneDisplay, getTimezoneData } from '../utils/timezone';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Welcome'>;

interface Props {
  navigation: LoginScreenNavigationProp;
}

export function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'parent' | 'coach'>('parent');
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [timezoneInfo, setTimezoneInfo] = useState<string>('');

  const { signIn, signUp } = useAuth();

  // Detect timezone when switching to signup mode
  React.useEffect(() => {
    if (isSignUp && !timezoneInfo) {
      try {
        const tzData = getTimezoneData();
        const tzDisplay = formatTimezoneDisplay(tzData);
        setTimezoneInfo(tzDisplay);
      } catch (error) {
        console.error('Failed to detect timezone:', error);
        setTimezoneInfo('Unable to detect');
      }
    }
  }, [isSignUp]);

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (isSignUp && !fullName.trim()) {
      Alert.alert('Error', 'Please enter your full name');
      return;
    }

    setIsLoading(true);

    try {
      if (isSignUp) {
        setLoadingMessage('Creating your account...');

        // Get timezone data for signup
        const timezoneData = getTimezoneData();

        await signUp({
          email: email.trim(),
          password,
          full_name: fullName.trim(),
          role,
          timezone_data: timezoneData,
        });
        // Navigation will be handled by the auth state change
        // The signUp function now automatically signs in the user
      } else {
        setLoadingMessage('Signing you in...');
        await signIn({
          email: email.trim(),
          password,
        });
        // Navigation will be handled by the auth state change
      }
    } catch (error) {
      console.error('Authentication error:', error);

      let errorMessage = 'An unexpected error occurred';

      if (error && typeof error === 'object' && 'message' in error) {
        const apiError = error as ApiError;
        errorMessage = apiError.message;
      }

      Alert.alert(
        isSignUp ? 'Sign Up Failed' : 'Sign In Failed',
        errorMessage
      );
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setEmail('');
    setPassword('');
    setFullName('');
    setRole('parent');
  };

  return (
    <LinearGradient
      colors={[Colors.background, Colors.backgroundLight, Colors.primary]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoid}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View style={styles.header}>
              <Logo size="large" />
              <Text style={styles.title}>
                {isSignUp ? 'Create Account' : 'Welcome Back'}
              </Text>
              <Text style={styles.subtitle}>
                {isSignUp
                  ? 'Join the Pulse community to track and support young athletes\' health and performance'
                  : 'Sign in to continue tracking your athlete\'s journey'
                }
              </Text>
            </View>

            {/* Form */}
            <View style={styles.form}>
              {isSignUp && (
                <>
                  <View style={styles.inputContainer}>
                    <Ionicons name="person-outline" size={20} color={Colors.textSecondary} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Full Name"
                      placeholderTextColor={Colors.textSecondary}
                      value={fullName}
                      onChangeText={setFullName}
                      autoCapitalize="words"
                      autoComplete="name"
                    />
                  </View>

                  {/* Role Selection */}
                  <View style={styles.roleContainer}>
                    <Text style={styles.roleLabel}>I am a:</Text>
                    <View style={styles.roleButtons}>
                      <TouchableOpacity
                        style={[
                          styles.roleButton,
                          role === 'parent' && styles.roleButtonActive
                        ]}
                        onPress={() => setRole('parent')}
                      >
                        <Ionicons
                          name="home-outline"
                          size={20}
                          color={role === 'parent' ? Colors.white : Colors.textSecondary}
                          style={styles.roleIcon}
                        />
                        <Text style={[
                          styles.roleButtonText,
                          role === 'parent' && styles.roleButtonTextActive
                        ]}>
                          Parent
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[
                          styles.roleButton,
                          role === 'coach' && styles.roleButtonActive
                        ]}
                        onPress={() => setRole('coach')}
                      >
                        <Ionicons
                          name="trophy-outline"
                          size={20}
                          color={role === 'coach' ? Colors.white : Colors.textSecondary}
                          style={styles.roleIcon}
                        />
                        <Text style={[
                          styles.roleButtonText,
                          role === 'coach' && styles.roleButtonTextActive
                        ]}>
                          Coach
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Timezone Info */}
                  {timezoneInfo && (
                    <View style={styles.timezoneInfo}>
                      <Ionicons name="globe-outline" size={16} color={Colors.textSecondary} />
                      <Text style={styles.timezoneText}>
                        Timezone: {timezoneInfo}
                      </Text>
                    </View>
                  )}
                </>
              )}

              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={20} color={Colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor={Colors.textSecondary}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color={Colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, styles.passwordInput]}
                  placeholder="Password"
                  placeholderTextColor={Colors.textSecondary}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoComplete={isSignUp ? "new-password" : "current-password"}
                />
                <TouchableOpacity
                  style={styles.passwordToggle}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color={Colors.textSecondary}
                  />
                </TouchableOpacity>
              </View>

              {!isSignUp && (
                <TouchableOpacity style={styles.forgotPassword}>
                  <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
                onPress={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator color={Colors.white} size="small" />
                    {loadingMessage ? (
                      <Text style={styles.loadingText}>{loadingMessage}</Text>
                    ) : null}
                  </View>
                ) : (
                  <Text style={styles.submitButtonText}>
                    {isSignUp ? 'Create Account' : 'Sign In'}
                  </Text>
                )}
              </TouchableOpacity>

              {/* Divider */}
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>Or continue with</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Google Login Button */}
              <TouchableOpacity style={styles.googleButton}>
                <Ionicons name="logo-google" size={20} color={Colors.white} />
                <Text style={styles.googleButtonText}>Continue with Google</Text>
              </TouchableOpacity>

              <View style={styles.switchMode}>
                <Text style={styles.switchModeText}>
                  {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                </Text>
                <TouchableOpacity onPress={toggleMode}>
                  <Text style={styles.switchModeLink}>
                    {isSignUp ? 'Sign In' : 'Sign Up'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.white,
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondaryLight,
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  passwordInput: {
    paddingRight: 40,
  },
  passwordToggle: {
    position: 'absolute',
    right: 16,
    padding: 4,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: Colors.accent,
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '600',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingText: {
    color: Colors.white,
    fontSize: 14,
    marginLeft: 8,
  },
  switchMode: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchModeText: {
    color: Colors.textSecondary,
    fontSize: 14,
    marginRight: 4,
  },
  switchModeLink: {
    color: Colors.accent,
    fontSize: 14,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.textSecondary,
  },
  dividerText: {
    color: Colors.textSecondary,
    fontSize: 14,
    marginHorizontal: 12,
  },
  googleButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: Colors.textSecondary,
    borderRadius: 12,
    height: 56,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  googleButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  roleContainer: {
    marginBottom: 16,
  },
  roleLabel: {
    color: Colors.textSecondary,
    fontSize: 16,
    marginBottom: 12,
    fontWeight: '500',
  },
  roleButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  roleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.secondaryLight,
    borderWidth: 2,
    borderColor: 'transparent',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  roleButtonActive: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  roleIcon: {
    marginRight: 8,
  },
  roleButtonText: {
    color: Colors.textSecondary,
    fontSize: 16,
    fontWeight: '600',
  },
  roleButtonTextActive: {
    color: Colors.white,
  },
  timezoneInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondaryLight,
    borderRadius: 12,
    marginBottom: 16,
    padding: 12,
  },
  timezoneText: {
    color: Colors.textSecondary,
    fontSize: 14,
    marginLeft: 8,
  },
});