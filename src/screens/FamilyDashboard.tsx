import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';

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
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Family Dashboard</Text>
        <Text style={styles.subtitle}>Role: {userRole}</Text>
      </View>

      <View style={styles.content}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigateToScreen('DailyRecommendation', { childId: '1', childName: 'Child' })}
        >
          <Text style={styles.cardTitle}>Daily Recommendations</Text>
          <Text style={styles.cardDescription}>View personalized daily health recommendations</Text>
        </TouchableOpacity>

        {userRole === 'coach' && (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigateToScreen('CoachRoster')}
          >
            <Text style={styles.cardTitle}>Coach Roster</Text>
            <Text style={styles.cardDescription}>Manage your coaching roster</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigateToScreen('HealthInput', { childId: '1' })}
        >
          <Text style={styles.cardTitle}>Health Input</Text>
          <Text style={styles.cardDescription}>Log health data and metrics</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigateToScreen('Calendar')}
        >
          <Text style={styles.cardTitle}>Calendar</Text>
          <Text style={styles.cardDescription}>View appointments and schedules</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigateToScreen('Settings')}
        >
          <Text style={styles.cardTitle}>Settings</Text>
          <Text style={styles.cardDescription}>Manage app preferences</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#6366f1',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  content: {
    padding: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 5,
  },
  cardDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
});