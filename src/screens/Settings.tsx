"use client"

import React from "react"
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Switch } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import type { StackNavigationProp } from "@react-navigation/stack"
import type { RootStackParamList } from "../../App"
import { Colors } from "../constants/colors"

type SettingsNavigationProp = StackNavigationProp<RootStackParamList, "Settings">

interface Props {
  navigation: SettingsNavigationProp
}

export function Settings({ navigation }: Props) {
  const [whoopConnected, setWhoopConnected] = React.useState(true)
  const [cityPlayConnected, setCityPlayConnected] = React.useState(false)
  const [dailyNotifications, setDailyNotifications] = React.useState(true)
  const [healthReminders, setHealthReminders] = React.useState(true)
  const [trainingAlerts, setTrainingAlerts] = React.useState(false)

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Settings</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Profile Section */}
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>PROFILE</Text>
            <View style={styles.sectionCard}>
              <TouchableOpacity style={styles.settingItem}>
                <View style={styles.settingLeft}>
                  <Ionicons name="person-outline" size={20} color="#6B7280" />
                  <Text style={styles.settingTitle}>Family Account</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#6B7280" />
              </TouchableOpacity>
              <View style={styles.separator} />
              <TouchableOpacity style={styles.settingItem}>
                <View style={styles.settingLeft}>
                  <Ionicons name="shield-outline" size={20} color="#6B7280" />
                  <Text style={styles.settingTitle}>Privacy & Security</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Data Integrations Section */}
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>DATA INTEGRATIONS</Text>
            <View style={styles.sectionCard}>
              <View style={styles.settingItem}>
                <View style={styles.settingLeft}>
                  <View style={[styles.integrationIcon, { backgroundColor: Colors.primary }]}>
                    <Text style={styles.integrationIconText}>W</Text>
                  </View>
                  <View style={styles.integrationInfo}>
                    <Text style={styles.settingTitle}>Whoop</Text>
                    <Text style={styles.settingSubtitle}>Connected</Text>
                  </View>
                </View>
                <Switch
                  value={whoopConnected}
                  onValueChange={setWhoopConnected}
                  trackColor={{ false: Colors.gray[200], true: Colors.primary }}
                  thumbColor={whoopConnected ? "#FFFFFF" : "#FFFFFF"}
                />
              </View>
              <View style={styles.separator} />
              <View style={styles.settingItem}>
                <View style={styles.settingLeft}>
                  <View style={[styles.integrationIcon, { backgroundColor: Colors.secondary }]}>
                    <Text style={styles.integrationIconText}>CP</Text>
                  </View>
                  <View style={styles.integrationInfo}>
                    <Text style={styles.settingTitle}>CityPlay Elite</Text>
                    <Text style={styles.settingSubtitle}>Not connected</Text>
                  </View>
                </View>
                <Switch
                  value={cityPlayConnected}
                  onValueChange={setCityPlayConnected}
                  trackColor={{ false: Colors.gray[200], true: Colors.primary }}
                  thumbColor={cityPlayConnected ? "#FFFFFF" : "#FFFFFF"}
                />
              </View>
              <View style={styles.separator} />
              <TouchableOpacity style={styles.settingItem}>
                <View style={styles.settingLeft}>
                  <View style={[styles.integrationIcon, { backgroundColor: Colors.success }]}>
                    <Text style={styles.integrationIconText}>+</Text>
                  </View>
                  <Text style={styles.settingTitle}>Add Integration</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Notifications Section */}
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>NOTIFICATIONS</Text>
            <View style={styles.sectionCard}>
              <View style={styles.settingItem}>
                <View style={styles.settingLeft}>
                  <Ionicons name="notifications-outline" size={20} color="#6B7280" />
                  <Text style={styles.settingTitle}>Daily Recommendations</Text>
                </View>
                <Switch
                  value={dailyNotifications}
                  onValueChange={setDailyNotifications}
                  trackColor={{ false: Colors.gray[200], true: Colors.primary }}
                  thumbColor={dailyNotifications ? "#FFFFFF" : "#FFFFFF"}
                />
              </View>
              <View style={styles.separator} />
              <View style={styles.settingItem}>
                <View style={styles.settingLeft}>
                  <Ionicons name="phone-portrait-outline" size={20} color="#6B7280" />
                  <Text style={styles.settingTitle}>Health Check Reminders</Text>
                </View>
                <Switch
                  value={healthReminders}
                  onValueChange={setHealthReminders}
                  trackColor={{ false: Colors.gray[200], true: Colors.primary }}
                  thumbColor={healthReminders ? "#FFFFFF" : "#FFFFFF"}
                />
              </View>
              <View style={styles.separator} />
              <View style={styles.settingItem}>
                <View style={styles.settingLeft}>
                  <Ionicons name="notifications-outline" size={20} color="#6B7280" />
                  <Text style={styles.settingTitle}>Training Alerts</Text>
                </View>
                <Switch
                  value={trainingAlerts}
                  onValueChange={setTrainingAlerts}
                  trackColor={{ false: Colors.gray[200], true: Colors.primary }}
                  thumbColor={trainingAlerts ? "#FFFFFF" : "#FFFFFF"}
                />
              </View>
            </View>
          </View>

          {/* Account Section */}
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>ACCOUNT</Text>
            <View style={styles.sectionCard}>
              <TouchableOpacity style={styles.settingItem} onPress={() => navigation.navigate("Welcome")}>
                <View style={styles.settingLeft}>
                  <Ionicons name="log-out-outline" size={20} color="#EF4444" />
                  <Text style={[styles.settingTitle, { color: Colors.danger }]}>Sign Out</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray[50],
  },
  header: {
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 24,
  },
  section: {
    gap: 12,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: "500",
    color: "#6B7280",
    letterSpacing: 0.5,
  },
  sectionCard: {
    backgroundColor: "white",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1F2937",
  },
  settingSubtitle: {
    fontSize: 14,
    color: "#6B7280",
  },
  integrationIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  integrationIconText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "white",
  },
  integrationInfo: {
    gap: 2,
  },
  separator: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginLeft: 16,
  },
})
