"use client"

import { useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import Slider from "@react-native-community/slider"
import type { StackNavigationProp } from "@react-navigation/stack"
import type { RouteProp } from "@react-navigation/native"
import type { RootStackParamList } from "../../App"
import { Colors } from "../constants/colors"

type HealthInputNavigationProp = StackNavigationProp<RootStackParamList, "HealthInput">
type HealthInputRouteProp = RouteProp<RootStackParamList, "HealthInput">

interface Props {
  navigation: HealthInputNavigationProp
  route: HealthInputRouteProp
}

export function HealthInput({ navigation }: Props) {
  const [menstrualPhase, setMenstrualPhase] = useState("")
  const [flexibility, setFlexibility] = useState(5)
  const [energy, setEnergy] = useState(7)
  const [sleep, setSleep] = useState(8)

  const handleSave = () => {
    // Save health data
    navigation.goBack()
  }

  const menstrualOptions = [
    { value: "menstrual", label: "Menstrual (Days 1-5)" },
    { value: "follicular", label: "Follicular (Days 6-14)" },
    { value: "ovulation", label: "Ovulation (Days 15-17)" },
    { value: "luteal", label: "Luteal (Days 18-28)" },
    { value: "na", label: "Not Applicable" },
  ]

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Monthly Health Check</Text>
        <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color="#1F2937" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Menstrual Cycle */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="calendar" size={20} color={Colors.primary} />
              <Text style={styles.sectionTitle}>Menstrual Cycle Phase</Text>
            </View>
            <View style={styles.radioGroup}>
              {menstrualOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={styles.radioOption}
                  onPress={() => setMenstrualPhase(option.value)}
                >
                  <View style={styles.radioButton}>
                    {menstrualPhase === option.value && <View style={styles.radioButtonSelected} />}
                  </View>
                  <Text style={styles.radioLabel}>{option.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Flexibility */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="body" size={20} color={Colors.primary} />
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
                minimumTrackTintColor={Colors.primary}
                maximumTrackTintColor="#E5E7EB"
                thumbStyle={styles.sliderThumb}
              />
              <Text style={styles.sliderValue}>{flexibility}/10</Text>
            </View>
          </View>

          {/* Energy Level */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="flash" size={20} color={Colors.warning} />
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
                maximumTrackTintColor="#E5E7EB"
                thumbStyle={styles.sliderThumb}
              />
              <Text style={styles.sliderValue}>{energy}/10</Text>
            </View>
          </View>

          {/* Sleep Quality */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="moon" size={20} color={Colors.primary} />
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
                minimumTrackTintColor={Colors.primary}
                maximumTrackTintColor="#E5E7EB"
                thumbStyle={styles.sliderThumb}
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
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray[50],
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
  },
  closeButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 24,
  },
  section: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
  },
  radioGroup: {
    gap: 12,
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
    borderColor: "#D1D5DB",
    alignItems: "center",
    justifyContent: "center",
  },
  radioButtonSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
  radioLabel: {
    fontSize: 16,
    color: "#1F2937",
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
    color: "#6B7280",
  },
  slider: {
    width: "100%",
    height: 40,
  },
  sliderThumb: {
    backgroundColor: "#3B82F6",
    width: 20,
    height: 20,
  },
  sliderValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    textAlign: "center",
  },
  saveContainer: {
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    padding: 16,
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
    color: "white",
  },
})
