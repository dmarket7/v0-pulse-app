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
import { apiService, HealthTip } from '../services/api';
import { Colors } from '../constants/colors';

type HealthTipsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Welcome'>;

interface Props {
  navigation: HealthTipsScreenNavigationProp;
}

const categories = ['nutrition', 'hydration', 'recovery', 'mental_health', 'injury_prevention'];
const ageGroups = ['6-8', '9-12', '13-15', '16-18'];

export function HealthTipsScreen({ navigation }: Props) {
  const [healthTips, setHealthTips] = useState<HealthTip[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<string | null>(null);

  useEffect(() => {
    fetchHealthTips();
  }, [selectedCategory, selectedAgeGroup]);

  const fetchHealthTips = async () => {
    try {
      setLoading(true);
      const tips = await apiService.getHealthTips(selectedCategory || undefined, selectedAgeGroup || undefined);
      setHealthTips(tips);
    } catch (error) {
      console.error('Error fetching health tips:', error);
      Alert.alert('Error', 'Failed to load health tips. Please try again.');
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

  const renderHealthTip = (tip: HealthTip) => (
    <View key={tip.id} style={styles.tipCard}>
      <View style={styles.tipHeader}>
        <Text style={styles.tipTitle}>{tip.title}</Text>
        <View style={styles.tipMeta}>
          <Text style={styles.tipCategory}>{tip.category}</Text>
          <Text style={styles.tipAgeGroup}>{tip.age_group}</Text>
        </View>
      </View>
      <Text style={styles.tipContent}>{tip.content}</Text>
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
          <Text style={styles.headerTitle}>Health Tips</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Category Filters */}
          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>Categories</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
              {categories.map((category) =>
                renderFilterButton(
                  category.replace('_', ' ').toUpperCase(),
                  category,
                  selectedCategory,
                  setSelectedCategory
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

          {/* Health Tips */}
          <View style={styles.tipsSection}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.primary} />
                <Text style={styles.loadingText}>Loading health tips...</Text>
              </View>
            ) : healthTips.length > 0 ? (
              healthTips.map(renderHealthTip)
            ) : (
              <View style={styles.emptyContainer}>
                <Ionicons name="information-circle-outline" size={64} color={Colors.textSecondary} />
                <Text style={styles.emptyText}>No health tips found</Text>
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
  tipsSection: {
    marginTop: 8,
    paddingBottom: 32,
  },
  tipCard: {
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
  tipHeader: {
    marginBottom: 12,
  },
  tipTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  tipMeta: {
    flexDirection: 'row',
    gap: 12,
  },
  tipCategory: {
    fontSize: 12,
    color: Colors.primary,
    backgroundColor: Colors.backgroundLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    fontWeight: '500',
  },
  tipAgeGroup: {
    fontSize: 12,
    color: Colors.secondary,
    backgroundColor: Colors.secondaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    fontWeight: '500',
  },
  tipContent: {
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