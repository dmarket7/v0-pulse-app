"use client";

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Switch, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import type { StackNavigationProp } from "@react-navigation/stack";
import type { RootStackParamList } from "../../App";
import { Colors } from "../constants/colors";
import { useAuth } from "../contexts/AuthContext";

type SettingsNavigationProp = StackNavigationProp<RootStackParamList, "Settings">;

interface Props {
  navigation: SettingsNavigationProp;
}

export function Settings({ navigation }: Props) {
  const [whoopConnected, setWhoopConnected] = React.useState(true);
  const [cityPlayConnected, setCityPlayConnected] = React.useState(false);
  const [dailyNotifications, setDailyNotifications] = React.useState(true);
  const [healthReminders, setHealthReminders] = React.useState(true);
  const [trainingAlerts, setTrainingAlerts] = React.useState(false);

  const { signOut, user } = useAuth();

  const handleSignOut = async () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: async () => {
            try {
              await signOut();
            } catch (error) {
              console.error('Sign out error:', error);
              Alert.alert("Error", "Failed to sign out. Please try again.");
            }
          },
        },
      ]
    );
  };

  return (
    <LinearGradient colors={[Colors.background, Colors.backgroundLight]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
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
                    <View style={[styles.iconContainer, { backgroundColor: Colors.primary }]}>
                      <Ionicons name="person-outline" size={20} color="white" />
                    </View>
                    <Text style={styles.settingTitle}>Family Account</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
                </TouchableOpacity>
                <View style={styles.separator} />
                <TouchableOpacity style={styles.settingItem}>
                  <View style={styles.settingLeft}>
                    <View style={[styles.iconContainer, { backgroundColor: Colors.secondary }]}>
                      <Ionicons name="shield-outline" size={20} color="white" />
                    </View>
                    <Text style={styles.settingTitle}>Privacy & Security</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
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
                    trackColor={{ false: "rgba(255, 255, 255, 0.2)", true: Colors.primary }}
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
                    trackColor={{ false: "rgba(255, 255, 255, 0.2)", true: Colors.primary }}
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
                  <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Notifications Section */}
            <View style={styles.section}>
              <Text style={styles.sectionHeader}>NOTIFICATIONS</Text>
              <View style={styles.sectionCard}>
                <View style={styles.settingItem}>
                  <View style={styles.settingLeft}>
                    <View style={[styles.iconContainer, { backgroundColor: Colors.warning }]}>
                      <Ionicons name="notifications-outline" size={20} color="white" />
                    </View>
                    <Text style={styles.settingTitle}>Daily Recommendations</Text>
                  </View>
                  <Switch
                    value={dailyNotifications}
                    onValueChange={setDailyNotifications}
                    trackColor={{ false: "rgba(255, 255, 255, 0.2)", true: Colors.primary }}
                    thumbColor={dailyNotifications ? "#FFFFFF" : "#FFFFFF"}
                  />
                </View>
                <View style={styles.separator} />
                <View style={styles.settingItem}>
                  <View style={styles.settingLeft}>
                    <View style={[styles.iconContainer, { backgroundColor: Colors.success }]}>
                      <Ionicons name="phone-portrait-outline" size={20} color="white" />
                    </View>
                    <Text style={styles.settingTitle}>Health Check Reminders</Text>
                  </View>
                  <Switch
                    value={healthReminders}
                    onValueChange={setHealthReminders}
                    trackColor={{ false: "rgba(255, 255, 255, 0.2)", true: Colors.primary }}
                    thumbColor={healthReminders ? "#FFFFFF" : "#FFFFFF"}
                  />
                </View>
                <View style={styles.separator} />
                <View style={styles.settingItem}>
                  <View style={styles.settingLeft}>
                    <View style={[styles.iconContainer, { backgroundColor: Colors.secondary }]}>
                      <Ionicons name="notifications-outline" size={20} color="white" />
                    </View>
                    <Text style={styles.settingTitle}>Training Alerts</Text>
                  </View>
                  <Switch
                    value={trainingAlerts}
                    onValueChange={setTrainingAlerts}
                    trackColor={{ false: "rgba(255, 255, 255, 0.2)", true: Colors.primary }}
                    thumbColor={trainingAlerts ? "#FFFFFF" : "#FFFFFF"}
                  />
                </View>
              </View>
            </View>

            {/* Account Section */}
            <View style={styles.section}>
              <Text style={styles.sectionHeader}>ACCOUNT</Text>
              <View style={styles.sectionCard}>
                <TouchableOpacity style={styles.settingItem} onPress={handleSignOut}>
                  <View style={styles.settingLeft}>
                    <View style={[styles.iconContainer, { backgroundColor: Colors.danger }]}>
                      <Ionicons name="log-out-outline" size={20} color="white" />
                    </View>
                    <Text style={[styles.settingTitle, { color: Colors.danger }]}>Sign Out</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
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
    paddingHorizontal: 24,
    paddingVertical: 16,
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
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.textPrimary,
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
    gap: 12,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: "500",
    color: Colors.textSecondary,
    letterSpacing: 0.5,
  },
  sectionCard: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 12,
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
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.textPrimary,
  },
  settingSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
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
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    marginLeft: 16,
  },
});
