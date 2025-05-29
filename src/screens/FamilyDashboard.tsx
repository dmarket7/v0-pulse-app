import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../../App';
import { Colors } from '../constants/colors';
import { useAuth } from '../contexts/AuthContext';

type FamilyDashboardRouteProp = RouteProp<RootStackParamList, 'FamilyDashboard'>;
type FamilyDashboardNavigationProp = StackNavigationProp<RootStackParamList, 'FamilyDashboard'>;

export function FamilyDashboard() {
  const navigation = useNavigation<FamilyDashboardNavigationProp>();
  const route = useRoute<FamilyDashboardRouteProp>();
  const { user } = useAuth();

  // Get user role from authenticated user data, fallback to route params, then default to 'parent'
  const userRole = (user?.user_metadata?.role as 'parent' | 'coach') || route.params?.userRole || 'parent';

  const navigateToScreen = (screenName: keyof RootStackParamList, params?: any) => {
    navigation.navigate(screenName as any, params);
  };

  // Role-specific content and styling
  const getDashboardTitle = () => {
    return userRole === 'coach' ? 'Coach Dashboard' : 'Family Dashboard';
  };

  const getRoleSpecificCards = () => {
    const commonCards = [
      {
        id: 'daily-recommendations',
        title: 'Daily Recommendations',
        description: userRole === 'coach'
          ? 'View team health recommendations'
          : 'View personalized daily health recommendations',
        icon: 'heart',
        color: Colors.primary,
        onPress: () => navigateToScreen('DailyRecommendation', { childId: '1', childName: userRole === 'coach' ? 'Team' : 'Child' }),
      },
      {
        id: 'health-input',
        title: 'Health Input',
        description: userRole === 'coach'
          ? 'Log team health data and metrics'
          : 'Log health data and metrics',
        icon: 'fitness',
        color: Colors.success,
        onPress: () => navigateToScreen('HealthInput', { childId: '1' }),
      },
      {
        id: 'calendar',
        title: 'Calendar',
        description: userRole === 'coach'
          ? 'View training schedules and events'
          : 'View appointments and schedules',
        icon: 'calendar',
        color: Colors.warning,
        onPress: () => navigateToScreen('Calendar'),
      },
      {
        id: 'settings',
        title: 'Settings',
        description: 'Manage app preferences',
        icon: 'settings',
        color: Colors.gray[600],
        onPress: () => navigateToScreen('Settings'),
      },
    ];

    // Add coach-specific card
    if (userRole === 'coach') {
      commonCards.splice(1, 0, {
        id: 'coach-roster',
        title: 'Team Roster',
        description: 'Manage your team roster and player readiness',
        icon: 'people',
        color: Colors.secondary,
        onPress: () => navigateToScreen('CoachRoster'),
      });
    }

    return commonCards;
  };

  const cards = getRoleSpecificCards();

  return (
    <LinearGradient colors={[Colors.background, Colors.backgroundLight]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.title}>{getDashboardTitle()}</Text>
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
            {user?.email && (
              <Text style={styles.userEmail}>Welcome back, {user.email}</Text>
            )}
          </View>

          <View style={styles.content}>
            {cards.map((card) => (
              <TouchableOpacity
                key={card.id}
                style={styles.card}
                onPress={card.onPress}
              >
                <View style={styles.cardContent}>
                  <View style={styles.cardHeader}>
                    <View style={[styles.cardIcon, { backgroundColor: card.color }]}>
                      <Ionicons name={card.icon as any} size={20} color="white" />
                    </View>
                    <View style={styles.cardTextContainer}>
                      <Text style={styles.cardTitle}>{card.title}</Text>
                      <Text style={styles.cardDescription}>{card.description}</Text>
                    </View>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color="rgba(255, 255, 255, 0.6)" />
              </TouchableOpacity>
            ))}
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
  userEmail: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 16,
  },
});