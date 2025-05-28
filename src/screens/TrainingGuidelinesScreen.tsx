import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../App';
import { apiService, TrainingGuideline, SportType } from '../services/api';
import { Colors } from '../constants/colors';

type TrainingGuidelinesScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Welcome'>;

interface Props {
  navigation: TrainingGuidelinesScreenNavigationProp;
}

const sports: SportType[] = ['soccer', 'basketball', 'tennis', 'swimming', 'track', 'other'];
const ageGroups = ['6-8', '9-12', '13-15', '16-18'];

export function TrainingGuidelinesScreen({ navigation }: Props) {
  const [guidelines, setGuidelines] = useState<TrainingGuideline[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSport, setSelectedSport] = useState<SportType | null>(null);
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<string | null>(null);

  useEffect(() => {
    fetchGuidelines();
  }, [selectedSport, selectedAgeGroup]);

  const fetchGuidelines = async () => {
    try {
      setLoading(true);
      const data = await apiService.getTrainingGuidelines(selectedSport || undefined, selectedAgeGroup || undefined);
      setGuidelines(data);
    } catch (error) {
      console.error('Error fetching training guidelines:', error);
      Alert.alert('Error', 'Failed to load training guidelines. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderFilterButton = (
    title: string,
    value: string,
    selectedValue: string | null,
    onPress: (value: string | null) => void
  ) => (
    <TouchableOpacity
      key={value}
      style={[
        styles.filterButton,
        selectedValue === value && styles.filterButtonActive
      ]}
      onPress={() => onPress(selectedValue === value ? null : value)}
    >
      <Text style={[
        styles.filterButtonText,
        selectedValue === value && styles.filterButtonTextActive
      ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  const renderGuideline = (guideline: TrainingGuideline) => (
    <View key={`${guideline.sport}-${guideline.age_group}`} style={styles.guidelineCard}>
      <View style={styles.guidelineHeader}>
        <View style={styles.guidelineMeta}>
          <Text style={styles.sportTag}>{guideline.sport.toUpperCase()}</Text>
          <Text style={styles.ageGroupTag}>{guideline.age_group} years</Text>
        </View>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{guideline.max_hours_per_week}</Text>
            <Text style={styles.statLabel}>Max Hours/Week</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{guideline.rest_days_per_week}</Text>
            <Text style={styles.statLabel}>Rest Days/Week</Text>
          </View>
        </View>
      </View>

      <View style={styles.guidelinesSection}>
        <Text style={styles.guidelinesTitle}>Guidelines:</Text>
        {guideline.guidelines.map((guide, index) => (
          <View key={index} style={styles.guidelineItem}>
            <Ionicons name="checkmark-circle" size={16} color={Colors.success} />
            <Text style={styles.guidelineText}>{guide}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <LinearGradient colors={[Colors.background, Colors.backgroundLight]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Training Guidelines</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Sport Filters */}
          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>Sports</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
              {sports.map((sport) =>
                renderFilterButton(
                  sport.toUpperCase(),
                  sport,
                  selectedSport,
                  setSelectedSport as (value: string | null) => void
                )
              )}
            </ScrollView>
          </View>

          {/* Age Group Filters */}
          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>Age Groups</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
              {ageGroups.map((ageGroup) =>
                renderFilterButton(
                  `${ageGroup} years`,
                  ageGroup,
                  selectedAgeGroup,
                  setSelectedAgeGroup
                )
              )}
            </ScrollView>
          </View>

          {/* Training Guidelines */}
          <View style={styles.guidelinesContainer}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.primary} />
                <Text style={styles.loadingText}>Loading training guidelines...</Text>
              </View>
            ) : guidelines.length > 0 ? (
              guidelines.map(renderGuideline)
            ) : (
              <View style={styles.emptyContainer}>
                <Ionicons name="fitness-outline" size={64} color={Colors.textSecondary} />
                <Text style={styles.emptyText}>No training guidelines found</Text>
                <Text style={styles.emptySubtext}>Try adjusting your filters</Text>
              </View>
            )}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[700],
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  filterSection: {
    marginVertical: 16,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  filterScroll: {
    flexDirection: 'row',
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    backgroundColor: Colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.gray[600],
  },
  filterButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterButtonText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: Colors.white,
  },
  guidelinesContainer: {
    marginTop: 8,
    paddingBottom: 32,
  },
  guidelineCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  guidelineHeader: {
    marginBottom: 16,
  },
  guidelineMeta: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  sportTag: {
    fontSize: 12,
    color: Colors.primary,
    backgroundColor: Colors.backgroundLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    fontWeight: '600',
  },
  ageGroupTag: {
    fontSize: 12,
    color: Colors.secondary,
    backgroundColor: Colors.secondaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 24,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  guidelinesSection: {
    borderTopWidth: 1,
    borderTopColor: Colors.gray[700],
    paddingTop: 16,
  },
  guidelinesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  guidelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 8,
  },
  guidelineText: {
    flex: 1,
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.textSecondary,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 8,
  },
});