"use client";

import { Ionicons } from "@expo/vector-icons";
import type { RouteProp } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { Alert, SafeAreaView, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from "react-native";
import type { RootStackParamList } from "../../App";
import { Colors } from "../constants/colors";
import { useAuth } from "../contexts/AuthContext";
import { apiService, HealthLogCreate, HealthLogRead } from "../services/api";

type HealthInputNavigationProp = StackNavigationProp<RootStackParamList, "HealthInput">;
type HealthInputRouteProp = RouteProp<RootStackParamList, "HealthInput">;

interface Props {
  navigation: HealthInputNavigationProp;
  route: HealthInputRouteProp;
}

export function HealthInput({ navigation, route }: Props) {
  const { user } = useAuth();

  // Check if user is a child (has no role or role is not parent/coach)
  const userRole = user?.user_metadata?.role;
  const isChild = !userRole || (userRole !== 'parent' && userRole !== 'coach');

  // State for child data
  const [childId, setChildId] = useState<string | null>(null);
  const [isLoadingChild, setIsLoadingChild] = useState(true);
  const [existingHealthLog, setExistingHealthLog] = useState<HealthLogRead | null>(null);
  const [yesterdayHealthLog, setYesterdayHealthLog] = useState<HealthLogRead | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [prefillFromYesterday, setPrefillFromYesterday] = useState(false);

  const [onPeriodToday, setOnPeriodToday] = useState(false);
  const [hasInjury, setHasInjury] = useState(false);
  const [injurySeverity, setInjurySeverity] = useState("");
  const [injuryType, setInjuryType] = useState("");
  const [injuryLocation, setInjuryLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Function to populate form with existing health log data
  const populateFormWithExistingData = (healthLog: HealthLogRead) => {
    setOnPeriodToday(healthLog.on_period_today || false);
    setHasInjury(healthLog.has_injury || false);
    setInjurySeverity(healthLog.injury_severity || "");
    setInjuryType(healthLog.injury_type || "");
    setInjuryLocation(healthLog.injury_location || "");
    setNotes(healthLog.notes || "");
  };

  // Check for existing health log for today and yesterday
  const checkForExistingHealthLog = async (childId: string) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      // Check for today's log first
      const existingLog = await apiService.getHealthLogByDate(childId, today);

      if (existingLog) {
        setExistingHealthLog(existingLog);
        setIsEditing(true);
        populateFormWithExistingData(existingLog);
        console.log('Found existing health log for today:', existingLog);
      } else {
        setIsEditing(false);
        console.log('No existing health log found for today');

        // Check for yesterday's log if no today's log exists
        try {
          const yesterdayLog = await apiService.getHealthLogByDate(childId, yesterday);
          if (yesterdayLog) {
            setYesterdayHealthLog(yesterdayLog);
            console.log('Found health log from yesterday:', yesterdayLog);
          } else {
            console.log('No health log found for yesterday either');
          }
        } catch (error) {
          console.error('Failed to check for yesterday\'s health log:', error);
        }
      }
    } catch (error) {
      console.error('Failed to check for existing health log:', error);
      setIsEditing(false);
    }
  };

  // Handle prefill from yesterday's data
  const handlePrefillFromYesterday = (enabled: boolean) => {
    setPrefillFromYesterday(enabled);
    if (enabled && yesterdayHealthLog) {
      populateFormWithExistingData(yesterdayHealthLog);
    } else {
      // Clear the form if disabling prefill
      setOnPeriodToday(false);
      setHasInjury(false);
      setInjurySeverity("");
      setInjuryType("");
      setInjuryLocation("");
      setNotes("");
    }
  };

  // Fetch child ID using the helper endpoint
  useEffect(() => {
    const fetchChildId = async () => {
      if (!isChild || !user?.id) {
        setIsLoadingChild(false);
        return;
      }

      try {
        setIsLoadingChild(true);
        // Use the helper endpoint to get the database child ID from auth user ID
        const response = await apiService.getChildIdFromAuth(user.id);

        if (response?.child_id) {
          setChildId(response.child_id);
          console.log('Found child ID:', response.child_id, 'for auth user:', user.id);

          // Check for existing health log for today
          await checkForExistingHealthLog(response.child_id);
        } else {
          console.error('No child ID returned for auth user:', user.id);
          Alert.alert(
            "Account Error",
            "Your child account is not properly set up. Please contact support.",
            [{ text: "OK", onPress: () => navigation.goBack() }]
          );
        }
      } catch (error) {
        console.error('Failed to fetch child ID:', error);
        Alert.alert(
          "Error",
          "Failed to load account information. Please try again.",
          [{ text: "OK", onPress: () => navigation.goBack() }]
        );
      } finally {
        setIsLoadingChild(false);
      }
    };

    fetchChildId();
  }, [isChild, user?.id, navigation]);

  useEffect(() => {
    // Redirect non-children users or users without proper setup
    if (!isChild) {
      Alert.alert(
        "Access Restricted",
        "Only children can add health logs. Please log in with a child account.",
        [{ text: "OK", onPress: () => navigation.goBack() }]
      );
    }
  }, [isChild, navigation]);

  const handleSave = async () => {
    if (!isChild || !childId) {
      console.error('Cannot save: missing child ID', { isChild, childId });
      return;
    }

    setIsLoading(true);

    const healthLogData: HealthLogCreate = {
      child_id: childId, // Use the database child ID from helper endpoint
      date: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
      on_period_today: onPeriodToday,
      has_injury: hasInjury,
      injury_severity: hasInjury ? injurySeverity : undefined,
      injury_type: hasInjury ? injuryType : undefined,
      injury_location: hasInjury ? injuryLocation : undefined,
      notes: notes.trim() || undefined,
    };

    try {
      if (isEditing && existingHealthLog) {
        // Update existing health log
        console.log('Updating health log with data:', healthLogData);
        await apiService.updateHealthLog(existingHealthLog.id, healthLogData);

        Alert.alert(
          "Success",
          "Health log updated successfully!",
          [{ text: "OK", onPress: () => navigation.goBack() }]
        );
      } else {
        // Create new health log
        console.log('Creating health log with data:', healthLogData);
        await apiService.createHealthLog(healthLogData);

        Alert.alert(
          "Success",
          "Health log saved successfully!",
          [{ text: "OK", onPress: () => navigation.goBack() }]
        );
      }
    } catch (error: any) {
      console.error('Failed to save health log:', error);

      // Provide more specific error messages
      let errorMessage = "Failed to save health log. Please try again.";

      if (error.status === 422) {
        errorMessage = "Invalid data provided. Please check your entries and try again.";
      } else if (error.status === 401 || error.status === 403) {
        errorMessage = "You don't have permission to perform this action.";
      } else if (error.status === 404) {
        errorMessage = "Health log not found. Please refresh and try again.";
      } else if (error.status >= 500) {
        errorMessage = "Server error. Please try again later.";
      }

      // Log detailed error for debugging
      console.error('Error details:', {
        status: error.status,
        message: error.message,
        details: error.details,
        payload: healthLogData,
        isEditing,
        existingHealthLog: existingHealthLog?.id
      });

      Alert.alert("Error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading while fetching child data
  if (isLoadingChild) {
    return (
      <LinearGradient colors={[Colors.background, Colors.backgroundLight]} style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Loading...</Text>
            <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
              <Ionicons name="close" size={24} color={Colors.textPrimary} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  // Don't render the form for non-children or users without proper child data
  if (!isChild || !childId) {
    return (
      <LinearGradient colors={[Colors.background, Colors.backgroundLight]} style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Access Restricted</Text>
            <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
              <Ionicons name="close" size={24} color={Colors.textPrimary} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  const injurySeverityOptions = [
    { value: "mild", label: "Mild" },
    { value: "moderate", label: "Moderate" },
    { value: "severe", label: "Severe" },
  ];

  const injuryTypeOptions = [
    { value: "muscle", label: "Muscle Injury" },
    { value: "bone", label: "Bone Injury" },
    { value: "ligament", label: "Joint/Ligament Pain" },
    { value: "other", label: "Other" },
  ];

  const injuryLocationOptions = [
    { value: "head", label: "Head" },
    { value: "neck", label: "Neck" },
    { value: "shoulder", label: "Shoulder" },
    { value: "chest", label: "Chest" },
    { value: "arm", label: "Arm" },
    { value: "abdominal", label: "Abdominal" },
    { value: "back", label: "Back" },
    { value: "hip", label: "Hip" },
    { value: "upper_leg", label: "Upper Leg" },
    { value: "knee", label: "Knee" },
    { value: "lower_leg", label: "Lower Leg" },
    { value: "ankle", label: "Ankle" },
    { value: "foot", label: "Foot" },
    { value: "other", label: "Other" },
  ];

  return (
    <LinearGradient colors={[Colors.background, Colors.backgroundLight]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            {isEditing ? "Update Health Check" : "Daily Health Check"}
          </Text>
          <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
            <Ionicons name="close" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>

            {/* Status Section - Show if editing today's log */}
            {isEditing && existingHealthLog && (
              <View style={styles.statusSection}>
                <View style={styles.statusHeader}>
                  <View style={[styles.iconContainer, { backgroundColor: Colors.accent }]}>
                    <Ionicons name="checkmark-circle" size={20} color="white" />
                  </View>
                  <Text style={styles.statusTitle}>Updating Today's Health Log</Text>
                </View>
                <Text style={styles.statusDescription}>
                  You've already logged your health data for today. Make any changes below and click "Update Health Data" to save your changes.
                </Text>
              </View>
            )}

            {/* Yesterday's Data Prefill Section - Show if no today's log but yesterday's exists */}
            {!isEditing && yesterdayHealthLog && (
              <View style={styles.statusSection}>
                <View style={styles.statusHeader}>
                  <View style={[styles.iconContainer, { backgroundColor: Colors.primary }]}>
                    <Ionicons name="time" size={20} color="white" />
                  </View>
                  <Text style={styles.statusTitle}>Prefill from Yesterday</Text>
                </View>
                <Text style={styles.statusDescription}>
                  We found your health log from yesterday. Would you like to use the same information as a starting point?
                </Text>
                <View style={styles.prefillOption}>
                  <Text style={styles.prefillLabel}>Use yesterday's data</Text>
                  <Switch
                    value={prefillFromYesterday}
                    onValueChange={handlePrefillFromYesterday}
                    trackColor={{ false: "rgba(255, 255, 255, 0.2)", true: Colors.primary }}
                    thumbColor={prefillFromYesterday ? Colors.secondary : "rgba(255, 255, 255, 0.8)"}
                    ios_backgroundColor="rgba(255, 255, 255, 0.2)"
                  />
                </View>
                {prefillFromYesterday && (
                  <Text style={styles.reminderText}>
                    💡 Make sure to review and update the information below, then click "Save Health Data" to log today's data.
                  </Text>
                )}
              </View>
            )}

            {/* New Entry Section - Show if no today's log and no yesterday's log */}
            {!isEditing && !yesterdayHealthLog && (
              <View style={styles.statusSection}>
                <View style={styles.statusHeader}>
                  <View style={[styles.iconContainer, { backgroundColor: Colors.success }]}>
                    <Ionicons name="add-circle" size={20} color="white" />
                  </View>
                  <Text style={styles.statusTitle}>New Health Log</Text>
                </View>
                <Text style={styles.statusDescription}>
                  Fill out your health information below and click "Save Health Data" to log today's data.
                </Text>
              </View>
            )}

            {/* Period Toggle */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={[styles.iconContainer, { backgroundColor: Colors.primary }]}>
                  <Ionicons name="calendar" size={20} color="white" />
                </View>
                <Text style={styles.sectionTitle}>Period Tracking</Text>
              </View>

              <View style={styles.switchOption}>
                <Text style={styles.switchLabel}>On your period today?</Text>
                <Switch
                  value={onPeriodToday}
                  onValueChange={setOnPeriodToday}
                  trackColor={{ false: "rgba(255, 255, 255, 0.2)", true: Colors.primary }}
                  thumbColor={onPeriodToday ? Colors.secondary : "rgba(255, 255, 255, 0.8)"}
                  ios_backgroundColor="rgba(255, 255, 255, 0.2)"
                />
              </View>
            </View>

            {/* Injury Status */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={[styles.iconContainer, { backgroundColor: Colors.danger }]}>
                  <Ionicons name="medical" size={20} color="white" />
                </View>
                <Text style={styles.sectionTitle}>Injury Status</Text>
              </View>

              <View style={styles.switchOption}>
                <Text style={styles.switchLabel}>Have an injury today?</Text>
                <Switch
                  value={hasInjury}
                  onValueChange={setHasInjury}
                  trackColor={{ false: "rgba(255, 255, 255, 0.2)", true: Colors.danger }}
                  thumbColor={hasInjury ? Colors.secondary : "rgba(255, 255, 255, 0.8)"}
                  ios_backgroundColor="rgba(255, 255, 255, 0.2)"
                />
              </View>

              {/* Injury Details - only show if injury exists */}
              {hasInjury && (
                <View style={styles.subSection}>
                  <Text style={styles.subSectionTitle}>Injury Severity</Text>
                  <View style={styles.radioGroup}>
                    {injurySeverityOptions.map((option) => (
                      <TouchableOpacity
                        key={option.value}
                        style={styles.radioOption}
                        onPress={() => setInjurySeverity(option.value)}
                      >
                        <View style={[styles.radioButton, injurySeverity === option.value && styles.radioButtonSelected]}>
                          {injurySeverity === option.value && <View style={styles.radioButtonInner} />}
                        </View>
                        <Text style={styles.radioLabel}>{option.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <View style={styles.subSubSection}>
                    <Text style={styles.subSectionTitle}>Injury Type</Text>
                    <View style={styles.radioGroup}>
                      {injuryTypeOptions.map((option) => (
                        <TouchableOpacity
                          key={option.value}
                          style={styles.radioOption}
                          onPress={() => setInjuryType(option.value)}
                        >
                          <View style={[styles.radioButton, injuryType === option.value && styles.radioButtonSelected]}>
                            {injuryType === option.value && <View style={styles.radioButtonInner} />}
                          </View>
                          <Text style={styles.radioLabel}>{option.label}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  <View style={styles.subSubSection}>
                    <Text style={styles.subSectionTitle}>Injury Location</Text>
                    <View style={styles.radioGroup}>
                      {injuryLocationOptions.map((option) => (
                        <TouchableOpacity
                          key={option.value}
                          style={styles.radioOption}
                          onPress={() => setInjuryLocation(option.value)}
                        >
                          <View style={[styles.radioButton, injuryLocation === option.value && styles.radioButtonSelected]}>
                            {injuryLocation === option.value && <View style={styles.radioButtonInner} />}
                          </View>
                          <Text style={styles.radioLabel}>{option.label}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </View>
              )}
            </View>

            {/* Notes Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={[styles.iconContainer, { backgroundColor: Colors.accent }]}>
                  <Ionicons name="create" size={20} color="white" />
                </View>
                <Text style={styles.sectionTitle}>Additional Notes</Text>
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Notes (Optional)</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Any additional notes about your health today..."
                  placeholderTextColor={Colors.textSecondary}
                  value={notes}
                  onChangeText={setNotes}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>
            </View>

          </View>
        </ScrollView>

        {/* Save Button */}
        <View style={styles.saveContainer}>
          <TouchableOpacity
            style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={isLoading}
          >
            <Text style={styles.saveButtonText}>
              {isLoading
                ? (isEditing ? "Updating..." : "Saving...")
                : (isEditing ? "Update Health Data" : "Save Health Data")
              }
            </Text>
          </TouchableOpacity>
        </View>
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.textPrimary,
  },
  closeButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    gap: 24,
    paddingBottom: 32,
  },
  section: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 16,
    padding: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  radioGroup: {
    gap: 16,
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  radioButtonSelected: {
    borderColor: Colors.primary,
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
  radioLabel: {
    fontSize: 16,
    color: Colors.textPrimary,
  },
  sliderContainer: {
    gap: 16,
  },
  sliderLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sliderLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  sliderValue: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.textPrimary,
    textAlign: "center",
  },
  saveContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.2)",
  },
  saveButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.secondary,
  },
  saveButtonDisabled: {
    backgroundColor: Colors.disabled,
  },
  switchOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  switchLabel: {
    fontSize: 16,
    color: Colors.textPrimary,
    flex: 1,
  },
  toggleOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 8,
  },
  toggleLabel: {
    fontSize: 16,
    color: Colors.textPrimary,
  },
  subSection: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
  },
  subSectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  inputContainer: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  textInput: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 8,
    color: Colors.textPrimary,
  },
  subSubSection: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
  },
  statusSection: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 16,
    padding: 20,
  },
  statusHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  statusDescription: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  prefillOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    marginBottom: 12,
  },
  prefillLabel: {
    fontSize: 16,
    color: Colors.textPrimary,
    flex: 1,
  },
  reminderText: {
    fontSize: 14,
    color: Colors.accent,
    fontStyle: "italic",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: Colors.accent,
  },
});
