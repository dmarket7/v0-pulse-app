"use client";

import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Alert, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { LinearGradient } from "expo-linear-gradient";
import type { StackNavigationProp } from "@react-navigation/stack";
import type { RouteProp } from "@react-navigation/native";
import type { RootStackParamList } from "../../App";
import { Colors } from "../constants/colors";
import { useAuth } from "../contexts/AuthContext";
import { apiService, HealthLogCreate } from "../services/api";

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

  const [onPeriodToday, setOnPeriodToday] = useState(false);
  const [hasInjury, setHasInjury] = useState(false);
  const [injurySeverity, setInjurySeverity] = useState("");
  const [injuryType, setInjuryType] = useState("");
  const [injuryLocation, setInjuryLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
    try {
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

      console.log('Creating health log with data:', healthLogData);
      await apiService.createHealthLog(healthLogData);

      Alert.alert(
        "Success",
        "Health log saved successfully!",
        [{ text: "OK", onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.error('Failed to save health log:', error);
      Alert.alert("Error", "Failed to save health log. Please try again.");
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
    { value: "muscle_strain", label: "Muscle Strain" },
    { value: "joint_pain", label: "Joint Pain" },
    { value: "bruise", label: "Bruise" },
    { value: "cut_abrasion", label: "Cut/Abrasion" },
    { value: "sprain", label: "Sprain" },
    { value: "fracture", label: "Fracture" },
    { value: "other", label: "Other" },
  ];

  const injuryLocationOptions = [
    { value: "head", label: "Head" },
    { value: "neck", label: "Neck" },
    { value: "shoulder", label: "Shoulder" },
    { value: "arm", label: "Arm" },
    { value: "elbow", label: "Elbow" },
    { value: "wrist", label: "Wrist" },
    { value: "hand", label: "Hand" },
    { value: "chest", label: "Chest" },
    { value: "back", label: "Back" },
    { value: "abdomen", label: "Abdomen" },
    { value: "hip", label: "Hip" },
    { value: "thigh", label: "Thigh" },
    { value: "knee", label: "Knee" },
    { value: "shin", label: "Shin" },
    { value: "ankle", label: "Ankle" },
    { value: "foot", label: "Foot" },
  ];

  return (
    <LinearGradient colors={[Colors.background, Colors.backgroundLight]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Daily Health Check</Text>
          <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
            <Ionicons name="close" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>

            {/* Period Toggle */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={[styles.iconContainer, { backgroundColor: Colors.primary }]}>
                  <Ionicons name="calendar" size={20} color="white" />
                </View>
                <Text style={styles.sectionTitle}>Period Tracking</Text>
              </View>

              <TouchableOpacity
                style={styles.toggleOption}
                onPress={() => setOnPeriodToday(!onPeriodToday)}
              >
                <View style={[styles.toggleButton, onPeriodToday && styles.toggleButtonActive]}>
                  {onPeriodToday && <View style={styles.toggleButtonInner} />}
                </View>
                <Text style={styles.toggleLabel}>On your period today?</Text>
              </TouchableOpacity>
            </View>

            {/* Injury Status */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={[styles.iconContainer, { backgroundColor: Colors.danger }]}>
                  <Ionicons name="medical" size={20} color="white" />
                </View>
                <Text style={styles.sectionTitle}>Injury Status</Text>
              </View>

              <TouchableOpacity
                style={styles.toggleOption}
                onPress={() => setHasInjury(!hasInjury)}
              >
                <View style={[styles.toggleButton, hasInjury && styles.toggleButtonActive]}>
                  {hasInjury && <View style={styles.toggleButtonInner} />}
                </View>
                <Text style={styles.toggleLabel}>Have an injury today?</Text>
              </TouchableOpacity>

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
              {isLoading ? "Saving..." : "Save Health Data"}
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
  toggleOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 8,
  },
  toggleButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  toggleButtonActive: {
    borderColor: Colors.primary,
  },
  toggleButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
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
});
