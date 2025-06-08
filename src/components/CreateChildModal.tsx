import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors } from '../constants/colors';
import { ApiError, apiService } from '../services/api';

interface CreateChildModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateChildModal({ isVisible, onClose, onSuccess }: CreateChildModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    gender: '' as 'male' | 'female' | 'non_binary' | 'prefer_not_to_answer' | '',
    date_of_birth: '',
    track_periods: false,
    email: '',
    password: '',
    create_auth_account: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');
  const [showGenderDropdown, setShowGenderDropdown] = useState(false);

  const validatePassword = (password: string) => {
    const requirements = [
      { regex: /.{8,}/, text: 'At least 8 characters' },
      { regex: /[a-zA-Z]/, text: 'At least one letter' },
      { regex: /\d/, text: 'At least one number' },
    ];

    const passed = requirements.filter((req) => req.regex.test(password));
    setPasswordStrength(`${passed.length}/${requirements.length} requirements met`);

    return passed.length === requirements.length;
  };

  const resetForm = () => {
    setFormData({
      name: '',
      gender: '',
      date_of_birth: '',
      track_periods: false,
      email: '',
      password: '',
      create_auth_account: false,
    });
    setPasswordStrength('');
    setShowPassword(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Please enter the child\'s name');
      return;
    }

    if (!formData.gender) {
      Alert.alert('Error', 'Please select the child\'s gender');
      return;
    }

    if (formData.create_auth_account) {
      if (!formData.email.trim()) {
        Alert.alert('Error', 'Please enter an email for the child\'s login account');
        return;
      }

      if (!formData.password.trim()) {
        Alert.alert('Error', 'Please enter a password for the child\'s login account');
        return;
      }

      if (!validatePassword(formData.password)) {
        Alert.alert('Error', 'Password does not meet security requirements');
        return;
      }
    }

    setIsLoading(true);

    try {
      let result;

      if (formData.create_auth_account) {
        // Use the direct endpoint for creating with auth
        result = await apiService.createChildWithAuth({
          name: formData.name.trim(),
          gender: formData.gender,
          date_of_birth: formData.date_of_birth || undefined,
          track_periods: formData.track_periods,
          email: formData.email.trim(),
          password: formData.password,
        });
      } else {
        // Use the flexible endpoint for profile only
        result = await apiService.createChild({
          name: formData.name.trim(),
          gender: formData.gender,
          date_of_birth: formData.date_of_birth || undefined,
          track_periods: formData.track_periods,
          create_auth_account: false,
        });
      }

      Alert.alert(
        'Success',
        result.message,
        [
          {
            text: 'OK',
            onPress: () => {
              resetForm();
              onSuccess();
              onClose();
            },
          },
        ]
      );
    } catch (error) {
      console.error('Create child error:', error);

      let errorMessage = 'An unexpected error occurred';
      if (error && typeof error === 'object' && 'message' in error) {
        const apiError = error as ApiError;
        errorMessage = apiError.message;
      }

      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoid}
        >
          <View style={styles.modalContainer}>
            <LinearGradient
              colors={[Colors.background, Colors.backgroundLight]}
              style={styles.modalContent}
            >
              <SafeAreaView style={styles.safeArea}>
                {/* Header */}
                <View style={styles.header}>
                  <Text style={styles.title}>Create Child Account</Text>
                  <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
                    <Ionicons name="close" size={24} color={Colors.textPrimary} />
                  </TouchableOpacity>
                </View>

                <ScrollView
                  style={styles.scrollView}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.scrollContent}
                >
                  {/* Form */}
                  <View style={styles.form}>
                    {/* Child's Name */}
                    <View style={styles.inputContainer}>
                      <Text style={styles.label}>Child's Name *</Text>
                      <View style={styles.inputWrapper}>
                        <Ionicons name="person-outline" size={20} color={Colors.textSecondary} style={styles.inputIcon} />
                        <TextInput
                          style={styles.input}
                          placeholder="Enter child's full name"
                          placeholderTextColor={Colors.textSecondary}
                          value={formData.name}
                          onChangeText={(text) => setFormData({ ...formData, name: text })}
                          autoCapitalize="words"
                        />
                      </View>
                    </View>

                    {/* Gender */}
                    <View style={styles.inputContainer}>
                      <Text style={styles.label}>Gender *</Text>
                      <TouchableOpacity
                        style={styles.dropdownButton}
                        onPress={() => setShowGenderDropdown(!showGenderDropdown)}
                      >
                        <Ionicons name="person-outline" size={20} color={Colors.textSecondary} style={styles.inputIcon} />
                        <Text style={[styles.dropdownButtonText, !formData.gender && styles.placeholderText]}>
                          {formData.gender ?
                            formData.gender === 'female' ? 'Female' :
                              formData.gender === 'male' ? 'Male' :
                                formData.gender === 'non_binary' ? 'Non-binary' :
                                  'Prefer not to answer'
                            : 'Select gender...'
                          }
                        </Text>
                        <Ionicons
                          name={showGenderDropdown ? "chevron-up" : "chevron-down"}
                          size={20}
                          color={Colors.textSecondary}
                        />
                      </TouchableOpacity>

                      {showGenderDropdown && (
                        <View style={styles.dropdownMenu}>
                          {[
                            { value: 'female', label: 'Female' },
                            { value: 'male', label: 'Male' },
                            { value: 'non_binary', label: 'Non-binary' },
                            { value: 'prefer_not_to_answer', label: 'Prefer not to answer' },
                          ].map((option) => (
                            <TouchableOpacity
                              key={option.value}
                              style={styles.dropdownOption}
                              onPress={() => {
                                setFormData({
                                  ...formData,
                                  gender: option.value as any,
                                  // Reset track_periods to false if male is selected
                                  track_periods: option.value === 'male' ? false : formData.track_periods
                                });
                                setShowGenderDropdown(false);
                              }}
                            >
                              <Text style={styles.dropdownOptionText}>{option.label}</Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      )}
                    </View>

                    {/* Date of Birth */}
                    <View style={styles.inputContainer}>
                      <Text style={styles.label}>Date of Birth</Text>
                      <View style={styles.inputWrapper}>
                        <Ionicons name="calendar-outline" size={20} color={Colors.textSecondary} style={styles.inputIcon} />
                        <TextInput
                          style={styles.input}
                          placeholder="YYYY-MM-DD"
                          placeholderTextColor={Colors.textSecondary}
                          value={formData.date_of_birth}
                          onChangeText={(text) => setFormData({ ...formData, date_of_birth: text })}
                          keyboardType="numeric"
                        />
                      </View>
                    </View>

                    {/* Track Periods - Only show if gender is not male */}
                    {formData.gender && formData.gender !== 'male' && (
                      <View style={styles.toggleContainer}>
                        <TouchableOpacity
                          style={styles.toggleButton}
                          onPress={() => setFormData({ ...formData, track_periods: !formData.track_periods })}
                        >
                          <View style={styles.toggleContent}>
                            <View style={styles.toggleIcon}>
                              <Ionicons
                                name={formData.track_periods ? 'checkmark-circle' : 'ellipse-outline'}
                                size={24}
                                color={formData.track_periods ? Colors.success : Colors.textSecondary}
                              />
                            </View>
                            <View style={styles.toggleText}>
                              <Text style={styles.toggleTitle}>Should track periods in health logs?</Text>
                              <Text style={styles.toggleDescription}>
                                Enable period tracking for this child's health monitoring
                              </Text>
                            </View>
                          </View>
                        </TouchableOpacity>
                      </View>
                    )}

                    {/* Create Login Account Toggle */}
                    <View style={styles.toggleContainer}>
                      <TouchableOpacity
                        style={styles.toggleButton}
                        onPress={() => setFormData({ ...formData, create_auth_account: !formData.create_auth_account })}
                      >
                        <View style={styles.toggleContent}>
                          <View style={styles.toggleIcon}>
                            <Ionicons
                              name={formData.create_auth_account ? 'checkmark-circle' : 'ellipse-outline'}
                              size={24}
                              color={formData.create_auth_account ? Colors.success : Colors.textSecondary}
                            />
                          </View>
                          <View style={styles.toggleText}>
                            <Text style={styles.toggleTitle}>Create login account for child</Text>
                            <Text style={styles.toggleDescription}>
                              Allow your child to log in with their own credentials
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    </View>

                    {/* Login Credentials (shown when toggle is on) */}
                    {formData.create_auth_account && (
                      <>
                        <View style={styles.credentialsSection}>
                          <Text style={styles.sectionTitle}>Login Credentials</Text>
                          <Text style={styles.sectionDescription}>
                            You set these credentials for your child to use when logging in
                          </Text>
                        </View>

                        {/* Email */}
                        <View style={styles.inputContainer}>
                          <Text style={styles.label}>Email/Username *</Text>
                          <View style={styles.inputWrapper}>
                            <Ionicons name="mail-outline" size={20} color={Colors.textSecondary} style={styles.inputIcon} />
                            <TextInput
                              style={styles.input}
                              placeholder="child.name@family.com"
                              placeholderTextColor={Colors.textSecondary}
                              value={formData.email}
                              onChangeText={(text) => setFormData({ ...formData, email: text })}
                              keyboardType="email-address"
                              autoCapitalize="none"
                              autoComplete="email"
                            />
                          </View>
                        </View>

                        {/* Password */}
                        <View style={styles.inputContainer}>
                          <Text style={styles.label}>Password *</Text>
                          <View style={styles.inputWrapper}>
                            <Ionicons name="lock-closed-outline" size={20} color={Colors.textSecondary} style={styles.inputIcon} />
                            <TextInput
                              style={[styles.input, styles.passwordInput]}
                              placeholder="Create a secure password"
                              placeholderTextColor={Colors.textSecondary}
                              value={formData.password}
                              onChangeText={(text) => {
                                setFormData({ ...formData, password: text });
                                validatePassword(text);
                              }}
                              secureTextEntry={!showPassword}
                              autoComplete="new-password"
                            />
                            <TouchableOpacity
                              style={styles.passwordToggle}
                              onPress={() => setShowPassword(!showPassword)}
                            >
                              <Ionicons
                                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                                size={20}
                                color={Colors.textSecondary}
                              />
                            </TouchableOpacity>
                          </View>
                          {formData.password.length > 0 && (
                            <Text style={styles.passwordStrength}>{passwordStrength}</Text>
                          )}
                        </View>

                        {/* Password Requirements */}
                        <View style={styles.requirementsContainer}>
                          <Text style={styles.requirementsTitle}>Password Requirements:</Text>
                          <View style={styles.requirementsList}>
                            <Text style={styles.requirement}>• At least 8 characters</Text>
                            <Text style={styles.requirement}>• At least one letter</Text>
                            <Text style={styles.requirement}>• At least one number</Text>
                          </View>
                        </View>
                      </>
                    )}
                  </View>
                </ScrollView>

                {/* Footer */}
                <View style={styles.footer}>
                  <TouchableOpacity
                    style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
                    onPress={handleSubmit}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <View style={styles.loadingContainer}>
                        <ActivityIndicator color={Colors.white} size="small" />
                        <Text style={styles.loadingText}>Creating account...</Text>
                      </View>
                    ) : (
                      <Text style={styles.submitButtonText}>
                        {formData.create_auth_account ? 'Create Child with Login' : 'Create Child Profile'}
                      </Text>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.cancelButton} onPress={handleClose}>
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </SafeAreaView>
            </LinearGradient>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  keyboardAvoid: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContainer: {
    height: '90%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  modalContent: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  closeButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  form: {
    gap: 20,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
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
  passwordStrength: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  toggleContainer: {
    marginVertical: 8,
  },
  toggleButton: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
  },
  toggleContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  toggleIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleText: {
    flex: 1,
    gap: 4,
  },
  toggleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  toggleDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  credentialsSection: {
    gap: 8,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  sectionDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  requirementsContainer: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  requirementsList: {
    gap: 4,
  },
  requirement: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  submitButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.white,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.white,
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
  },
  dropdownButtonText: {
    flex: 1,
    fontSize: 16,
    color: Colors.textPrimary,
  },
  placeholderText: {
    color: Colors.textSecondary,
  },
  dropdownMenu: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    marginTop: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  dropdownOption: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  dropdownOptionText: {
    fontSize: 16,
    color: Colors.textPrimary,
  },
});