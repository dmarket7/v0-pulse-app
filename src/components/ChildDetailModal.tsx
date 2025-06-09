import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors } from '../constants/colors';
import { apiService, Child, HealthLogRead } from '../services/api';

interface ChildDetailModalProps {
  child: Child | null;
  isVisible: boolean;
  onClose: () => void;
  onChildUpdated?: () => void;
}

export function ChildDetailModal({ child, isVisible, onClose }: ChildDetailModalProps) {
  const [healthLogs, setHealthLogs] = useState<HealthLogRead[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (child && isVisible) {
      fetchHealthLogs();
    }
  }, [child, isVisible]);

  const fetchHealthLogs = async () => {
    if (!child) return;

    setIsLoading(true);
    setError(null);

    try {
      const logs = await apiService.getHealthLogs(child.id);
      const sortedLogs = logs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setHealthLogs(sortedLogs.slice(0, 10));
    } catch (err: any) {
      console.error('Failed to fetch health logs:', err);
      setError('Failed to load health data');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const getHealthStatus = (log: HealthLogRead) => {
    if (log.has_injury) return { status: 'Injured', color: Colors.danger, icon: 'medical' };
    if (log.on_period_today) return { status: 'On Period', color: Colors.warning, icon: 'ellipse' };
    return { status: 'Healthy', color: Colors.success, icon: 'checkmark-circle' };
  };

  const getRecentActivitySummary = () => {
    if (healthLogs.length === 0) return 'No recent activity';

    const recentLogs = healthLogs.slice(0, 7);
    const injuryCount = recentLogs.filter(log => log.has_injury).length;
    const periodCount = recentLogs.filter(log => log.on_period_today).length;

    if (injuryCount > 0) return `${injuryCount} injury report${injuryCount > 1 ? 's' : ''} this week`;
    if (periodCount > 0) return `Period tracking: ${periodCount} day${periodCount > 1 ? 's' : ''} this week`;
    return `${recentLogs.length} health check${recentLogs.length !== 1 ? 's' : ''} this week`;
  };

  if (!child) return null;

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <LinearGradient colors={[Colors.background, Colors.backgroundLight]} style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>{child.name}</Text>
            <Text style={styles.headerSubtitle}>Health Overview</Text>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            {/* Child Info Section */}
            <View style={styles.infoSection}>
              <View style={styles.infoCard}>
                <View style={styles.infoRow}>
                  <View style={styles.infoItem}>
                    <Ionicons name="person" size={20} color={Colors.primary} />
                    <Text style={styles.infoLabel}>Name</Text>
                    <Text style={styles.infoValue}>{child.name}</Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Ionicons name="calendar" size={20} color={Colors.secondary} />
                    <Text style={styles.infoLabel}>Member Since</Text>
                    <Text style={styles.infoValue}>
                      {new Date(child.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        year: 'numeric',
                      })}
                    </Text>
                  </View>
                </View>
                <View style={styles.infoRow}>
                  <View style={styles.infoItem}>
                    <Ionicons
                      name={child.current_team ? "people" : "people-outline"}
                      size={20}
                      color={child.current_team ? Colors.primary : Colors.textSecondary}
                    />
                    <Text style={styles.infoLabel}>Current Team</Text>
                    <Text style={styles.infoValue}>
                      {child.current_team ? child.current_team.team_name : 'No team assigned'}
                    </Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Ionicons name="bar-chart" size={20} color={Colors.accent} />
                    <Text style={styles.infoLabel}>Activity</Text>
                    <Text style={styles.infoValue}>{getRecentActivitySummary()}</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Team Information Section */}
            <View style={styles.teamSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Team Information</Text>
                <Text style={styles.sectionSubtitle}>Current team assignment</Text>
              </View>

              {child.current_team ? (
                <View style={styles.currentTeamCard}>
                  <View style={styles.currentTeamInfo}>
                    <View style={styles.teamIcon}>
                      <Ionicons name="people" size={24} color="white" />
                    </View>
                    <View style={styles.teamDetails}>
                      <Text style={styles.teamName}>{child.current_team.team_name}</Text>
                      {child.current_team.positions && child.current_team.positions.length > 0 && (
                        <Text style={styles.teamPositions}>
                          Position{child.current_team.positions.length > 1 ? 's' : ''}: {child.current_team.positions.join(', ')}
                        </Text>
                      )}
                      <Text style={styles.teamNote}>
                        Team assignments are managed by coaches
                      </Text>
                    </View>
                  </View>
                  <View style={styles.teamStatusBadge}>
                    <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
                  </View>
                </View>
              ) : (
                <View style={styles.noTeamCard}>
                  <Ionicons name="people-outline" size={32} color={Colors.textSecondary} />
                  <Text style={styles.noTeamText}>{child.name} is not assigned to any team</Text>
                  <Text style={styles.noTeamSubtext}>
                    Coaches can add players to their teams from the coach dashboard
                  </Text>
                </View>
              )}
            </View>

            {/* Health Logs Section */}
            <View style={styles.logsSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recent Health Logs</Text>
                <Text style={styles.sectionSubtitle}>Last 10 entries</Text>
              </View>

              {isLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color={Colors.primary} />
                  <Text style={styles.loadingText}>Loading health data...</Text>
                </View>
              ) : error ? (
                <View style={styles.errorContainer}>
                  <Ionicons name="alert-circle" size={48} color={Colors.danger} />
                  <Text style={styles.errorText}>{error}</Text>
                  <TouchableOpacity style={styles.retryButton} onPress={fetchHealthLogs}>
                    <Text style={styles.retryButtonText}>Retry</Text>
                  </TouchableOpacity>
                </View>
              ) : healthLogs.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Ionicons name="document-outline" size={48} color={Colors.textSecondary} />
                  <Text style={styles.emptyText}>No health logs yet</Text>
                  <Text style={styles.emptySubtext}>
                    Health logs will appear here when {child.name} starts logging data
                  </Text>
                </View>
              ) : (
                <View style={styles.logsList}>
                  {healthLogs.map((log) => {
                    const healthStatus = getHealthStatus(log);
                    return (
                      <View key={log.id} style={styles.logItem}>
                        <View style={styles.logDate}>
                          <Text style={styles.logDateText}>{formatDate(log.date)}</Text>
                        </View>
                        <View style={styles.logContent}>
                          <View style={styles.logStatusRow}>
                            <View style={[styles.statusIndicator, { backgroundColor: healthStatus.color }]}>
                              <Ionicons name={healthStatus.icon as any} size={16} color="white" />
                            </View>
                            <Text style={styles.logStatus}>{healthStatus.status}</Text>
                          </View>
                          {log.notes && (
                            <Text style={styles.logNotes} numberOfLines={2}>
                              {log.notes}
                            </Text>
                          )}
                          {log.has_injury && log.injury_type && (
                            <View style={styles.injuryInfo}>
                              <Text style={styles.injuryType}>{log.injury_type}</Text>
                              {log.injury_location && (
                                <Text style={styles.injuryLocation}> • {log.injury_location}</Text>
                              )}
                            </View>
                          )}
                        </View>
                      </View>
                    );
                  })}
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
    gap: 32,
  },
  infoSection: {
    gap: 16,
  },
  infoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    padding: 20,
    gap: 16,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 16,
  },
  infoItem: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  infoLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  teamSection: {
    gap: 16,
  },
  currentTeamCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    padding: 16,
  },
  currentTeamInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  teamIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
  },
  teamDetails: {
    flex: 1,
  },
  teamName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  teamPositions: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  teamNote: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  teamStatusBadge: {
    padding: 4,
    borderRadius: 12,
    backgroundColor: Colors.success,
  },
  noTeamCard: {
    alignItems: 'center',
    padding: 40,
    gap: 12,
  },
  noTeamText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  noTeamSubtext: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  logsSection: {
    gap: 16,
  },
  sectionHeader: {
    alignItems: 'center',
    gap: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 40,
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  errorContainer: {
    alignItems: 'center',
    padding: 40,
    gap: 16,
  },
  errorText: {
    fontSize: 16,
    color: Colors.danger,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
    gap: 12,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  logsList: {
    gap: 12,
  },
  logItem: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    gap: 16,
  },
  logDate: {
    alignItems: 'center',
    minWidth: 60,
  },
  logDateText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  logContent: {
    flex: 1,
    gap: 8,
  },
  logStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statusIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logStatus: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  logNotes: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  injuryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  injuryType: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.warning,
  },
  injuryLocation: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
});