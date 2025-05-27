"use client";

import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { LinearGradient } from "expo-linear-gradient";
import type { StackNavigationProp } from "@react-navigation/stack";
import type { RouteProp } from "@react-navigation/native";
import type { RootStackParamList } from "../../App";
import { Colors } from "../constants/colors";

type HealthInputNavigationProp = StackNavigationProp<RootStackParamList, "HealthInput">;
type HealthInputRouteProp = RouteProp<RootStackParamList, "HealthInput">;

interface Props {
  navigation: HealthInputNavigationProp;
  route: HealthInputRouteProp;
}

export function HealthInput({ navigation }: Props) {
  const [menstrualPhase, setMenstrualPhase] = useState("");
  const [flexibility, setFlexibility] = useState(5);
  const [energy, setEnergy] = useState(7);
  const [sleep, setSleep] = useState(8);

  const handleSave = () => {
    // Save health data
    navigation.goBack();
  };

  const menstrualOptions = [
    { value: "menstrual", label: "Menstrual (Days 1-5)" },
    { value: "follicular", label: "Follicular (Days 6-14)" },
    { value: "ovulation", label: "Ovulation (Days 15-17)" },
    { value: "luteal", label: "Luteal (Days 18-28)" },
    { value: "na", label: "Not Applicable" },
  ];

  return (
    <LinearGradient colors={[Colors.background, Colors.backgroundLight]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Monthly Health Check</Text>
          <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
            <Ionicons name="close" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            {/* Menstrual Cycle */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={[styles.iconContainer, { backgroundColor: Colors.primary }]}>
                  <Ionicons name="calendar" size={20} color="white" />
                </View>
                <Text style={styles.sectionTitle}>Menstrual Cycle Phase</Text>
              </View>
              <View style={styles.radioGroup}>
                {menstrualOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={styles.radioOption}
                    onPress={() => setMenstrualPhase(option.value)}
                  >
                    <View style={[styles.radioButton, menstrualPhase === option.value && styles.radioButtonSelected]}>
                      {menstrualPhase === option.value && <View style={styles.radioButtonInner} />}
                    </View>
                    <Text style={styles.radioLabel}>{option.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Flexibility */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={[styles.iconContainer, { backgroundColor: Colors.success }]}>
                  <Ionicons name="body" size={20} color="white" />
                </View>
                <Text style={styles.sectionTitle}>Perceived Flexibility</Text>
              </View>
              <View style={styles.sliderContainer}>
                <View style={styles.sliderLabels}>
                  <Text style={styles.sliderLabel}>Very Tight</Text>
                  <Text style={styles.sliderLabel}>Very Flexible</Text>
                </View>
                <Slider
                  style={styles.slider}
                  minimumValue={1}
                  maximumValue={10}
                  step={1}
                  value={flexibility}
                  onValueChange={setFlexibility}
                  minimumTrackTintColor={Colors.success}
                  maximumTrackTintColor="rgba(255, 255, 255, 0.3)"
                />
                <Text style={styles.sliderValue}>{flexibility}/10</Text>
              </View>
            </View>

            {/* Energy Level */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={[styles.iconContainer, { backgroundColor: Colors.warning }]}>
                  <Ionicons name="flash" size={20} color="white" />
                </View>
                <Text style={styles.sectionTitle}>Energy Level</Text>
              </View>
              <View style={styles.sliderContainer}>
                <View style={styles.sliderLabels}>
                  <Text style={styles.sliderLabel}>Very Low</Text>
                  <Text style={styles.sliderLabel}>Very High</Text>
                </View>
                <Slider
                  style={styles.slider}
                  minimumValue={1}
                  maximumValue={10}
                  step={1}
                  value={energy}
                  onValueChange={setEnergy}
                  minimumTrackTintColor={Colors.warning}
                  maximumTrackTintColor="rgba(255, 255, 255, 0.3)"
                />
                <Text style={styles.sliderValue}>{energy}/10</Text>
              </View>
            </View>

            {/* Sleep Quality */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={[styles.iconContainer, { backgroundColor: Colors.secondary }]}>
                  <Ionicons name="moon" size={20} color="white" />
                </View>
                <Text style={styles.sectionTitle}>Sleep Quality (Last Night)</Text>
              </View>
              <View style={styles.sliderContainer}>
                <View style={styles.sliderLabels}>
                  <Text style={styles.sliderLabel}>Very Poor</Text>
                  <Text style={styles.sliderLabel}>Excellent</Text>
                </View>
                <Slider
                  style={styles.slider}
                  minimumValue={1}
                  maximumValue={10}
                  step={1}
                  value={sleep}
                  onValueChange={setSleep}
                  minimumTrackTintColor={Colors.secondary}
                  maximumTrackTintColor="rgba(255, 255, 255, 0.3)"
                />
                <Text style={styles.sliderValue}>{sleep}/10</Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Save Button */}
        <View style={styles.saveContainer}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save Health Data</Text>
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
});
