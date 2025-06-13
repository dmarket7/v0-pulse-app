import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import type { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import { useRef, useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import type { RootStackParamList } from '../../App';
import { Colors } from '../constants/colors';
import { apiService, ReadinessFactors, ReadinessResponse } from '../services/api';

type ReadinessCheckScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Welcome'>;

interface Props {
  navigation: ReadinessCheckScreenNavigationProp;
}

export function ReadinessCheckScreen({ navigation }: Props) {
  const scrollViewRef = useRef<ScrollView>(null);
  const [factors, setFactors] = useState<ReadinessFactors>({
    recovery_score: 50,
    strain_score: 10,
    sleep_performance: 80,
  });
  const [result, setResult] = useState<ReadinessResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCheckReadiness = async () => {
    try {
      setLoading(true);
      const response = await apiService.checkReadiness(factors);
      setResult(response);
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      console.error('Error checking readiness:', error);
      Alert.alert('Error', 'Failed to check readiness. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'green':
        return Colors.success;
      case 'yellow':
        return Colors.warning;
      case 'red':
        return Colors.danger;
      default:
        return Colors.textSecondary;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'green':
        return 'checkmark-circle';
      case 'yellow':
        return 'warning';
      case 'red':
        return 'close-circle';
      default:
        return 'help-circle';
    }
  };

  const renderSlider = (
    label: string,
    value: number,
    onValueChange: (value: number) => void,
    min: number = 0,
    max: number = 100,
    step: number = 1,
    unit: string = '',
    description?: string
  ) => (
    <View style={styles.sliderContainer}>
      <View style={styles.sliderHeader}>
        <Text style={styles.sliderLabel}>{label}</Text>
        <Text style={styles.sliderValue}>{value}{unit}</Text>
      </View>
      {description && (
        <Text style={styles.sliderDescription}>{description}</Text>
      )}
      <Slider
        style={styles.slider}
        minimumValue={min}
        maximumValue={max}
        step={step}
        value={value}
        onValueChange={onValueChange}
        minimumTrackTintColor={Colors.primary}
        maximumTrackTintColor={Colors.gray[600]}
      />
      <View style={styles.sliderLabels}>
        <Text style={styles.sliderLabelText}>{min}{unit}</Text>
        <Text style={styles.sliderLabelText}>{max}{unit}</Text>
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
          <Text style={styles.headerTitle}>Readiness Check</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView
          ref={scrollViewRef}
          style={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.introSection}>
            <Ionicons name="fitness" size={48} color={Colors.primary} />
            <Text style={styles.introTitle}>How are you feeling today?</Text>
            <Text style={styles.introText}>
              Based on WHOOP data metrics: recovery, strain, and sleep performance to get your training readiness.
            </Text>
          </View>

          <View style={styles.factorsSection}>
            {renderSlider(
              'Recovery Score',
              factors.recovery_score,
              (value) => setFactors({ ...factors, recovery_score: value }),
              0,
              100,
              1,
              '%',
              'How well recovered you feel (0-100%)'
            )}

            {renderSlider(
              'Strain Score',
              Math.round(factors.strain_score),
              (value) => setFactors({ ...factors, strain_score: Math.round(value) }),
              0,
              21,
              1,
              '',
              'Your recent training strain (0-21 scale)'
            )}

            {renderSlider(
              'Sleep Performance',
              factors.sleep_performance,
              (value) => setFactors({ ...factors, sleep_performance: value }),
              0,
              100,
              1,
              '%',
              'Quality of your sleep last night (0-100%)'
            )}
          </View>

          <TouchableOpacity
            style={[styles.checkButton, loading && styles.checkButtonDisabled]}
            onPress={handleCheckReadiness}
            disabled={loading}
          >
            <Text style={styles.checkButtonText}>
              {loading ? 'Checking...' : 'Check My Readiness'}
            </Text>
          </TouchableOpacity>

          {result && (
            <View style={styles.resultSection}>
              <View style={[styles.resultHeader, { backgroundColor: getStatusColor(result.status) + '20' }]}>
                <Ionicons
                  name={getStatusIcon(result.status)}
                  size={32}
                  color={getStatusColor(result.status)}
                />
                <Text style={[styles.resultStatus, { color: getStatusColor(result.status) }]}>
                  {result.status.toUpperCase()}
                </Text>
                <Text style={styles.resultConfidence}>
                  {Math.round(result.confidence * 100)}% confidence
                </Text>
              </View>

              <View style={styles.resultContent}>
                <Text style={styles.resultTitle}>Recommendation</Text>
                <Text style={styles.resultRecommendation}>{result.recommendation}</Text>

                {result.tips.length > 0 && (
                  <View style={styles.tipsSection}>
                    <Text style={styles.tipsTitle}>Tips for Today</Text>
                    {result.tips.map((tip, index) => (
                      <View key={index} style={styles.tipItem}>
                        <Ionicons name="bulb" size={16} color={Colors.warning} />
                        <Text style={styles.tipText}>{tip}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            </View>
          )}
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
  introSection: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  introTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginTop: 16,
    marginBottom: 8,
  },
  introText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  factorsSection: {
    marginBottom: 32,
  },
  sliderContainer: {
    marginBottom: 24,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sliderLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  sliderValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  sliderLabelText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  checkButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 32,
  },
  checkButtonDisabled: {
    opacity: 0.6,
  },
  checkButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.white,
  },
  resultSection: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    marginBottom: 32,
    overflow: 'hidden',
  },
  resultHeader: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  resultStatus: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
  },
  resultConfidence: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  resultContent: {
    padding: 16,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  resultRecommendation: {
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: 16,
  },
  tipsSection: {
    borderTopWidth: 1,
    borderTopColor: Colors.gray[700],
    paddingTop: 16,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 8,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  sliderDescription: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
});