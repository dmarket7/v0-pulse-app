import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../../App';
import { Colors } from '../constants/colors';

type FamilyDashboardRouteProp = RouteProp<RootStackParamList, 'FamilyDashboard'>;
type FamilyDashboardNavigationProp = StackNavigationProp<RootStackParamList, 'FamilyDashboard'>;

export function FamilyDashboard() {
  const navigation = useNavigation<FamilyDashboardNavigationProp>();
  const route = useRoute<FamilyDashboardRouteProp>();
  const { userRole } = route.params;

  const navigateToScreen = (screenName: keyof RootStackParamList, params?: any) => {
    navigation.navigate(screenName as any, params);
  };

  return (
    <LinearGradient colors={[Colors.background, Colors.backgroundLight]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.title}>Family Dashboard</Text>
            <View style={styles.roleContainer}>
              <View style={[styles.roleBadge, { backgroundColor: userRole === 'coach' ? Colors.secondary : Colors.primary }]}>
                <Ionicons
                  name={userRole === 'coach' ? 'people' : 'home'}
                  size={16}
                  color="white"
                />
                <Text style={styles.roleText}>{userRole}</Text>
              </View>
            </View>
          </View>

          <View style={styles.content}>
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigateToScreen('DailyRecommendation', { childId: '1', childName: 'Child' })}
            >
              <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                  <View style={[styles.cardIcon, { backgroundColor: Colors.primary }]}>
                    <Ionicons name="heart" size={20} color="white" />
                  </View>
                  <View style={styles.cardTextContainer}>
                    <Text style={styles.cardTitle}>Daily Recommendations</Text>
                    <Text style={styles.cardDescription}>View personalized daily health recommendations</Text>
                  </View>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="rgba(255, 255, 255, 0.6)" />
            </TouchableOpacity>

            {userRole === 'coach' && (
              <TouchableOpacity
                style={styles.card}
                onPress={() => navigateToScreen('CoachRoster')}
              >
                <View style={styles.cardContent}>
                  <View style={styles.cardHeader}>
                    <View style={[styles.cardIcon, { backgroundColor: Colors.secondary }]}>
                      <Ionicons name="people" size={20} color="white" />
                    </View>
                    <View style={styles.cardTextContainer}>
                      <Text style={styles.cardTitle}>Coach Roster</Text>
                      <Text style={styles.cardDescription}>Manage your coaching roster</Text>
                    </View>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color="rgba(255, 255, 255, 0.6)" />
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.card}
              onPress={() => navigateToScreen('HealthInput', { childId: '1' })}
            >
              <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                  <View style={[styles.cardIcon, { backgroundColor: Colors.success }]}>
                    <Ionicons name="fitness" size={20} color="white" />
                  </View>
                  <View style={styles.cardTextContainer}>
                    <Text style={styles.cardTitle}>Health Input</Text>
                    <Text style={styles.cardDescription}>Log health data and metrics</Text>
                  </View>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="rgba(255, 255, 255, 0.6)" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.card}
              onPress={() => navigateToScreen('Calendar')}
            >
              <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                  <View style={[styles.cardIcon, { backgroundColor: Colors.warning }]}>
                    <Ionicons name="calendar" size={20} color="white" />
                  </View>
                  <View style={styles.cardTextContainer}>
                    <Text style={styles.cardTitle}>Calendar</Text>
                    <Text style={styles.cardDescription}>View appointments and schedules</Text>
                  </View>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="rgba(255, 255, 255, 0.6)" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.card}
              onPress={() => navigateToScreen('Settings')}
            >
              <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                  <View style={[styles.cardIcon, { backgroundColor: Colors.gray[600] }]}>
                    <Ionicons name="settings" size={20} color="white" />
                  </View>
                  <View style={styles.cardTextContainer}>
                    <Text style={styles.cardTitle}>Settings</Text>
                    <Text style={styles.cardDescription}>Manage app preferences</Text>
                  </View>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="rgba(255, 255, 255, 0.6)" />
            </TouchableOpacity>
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
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  roleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  roleText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
    textTransform: 'capitalize',
  },
  content: {
    paddingHorizontal: 24,
    gap: 16,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardContent: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
});