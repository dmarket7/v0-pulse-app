import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RootStackParamList } from '../../App';
import { ChildDetailModal } from '../components/ChildDetailModal';
import { CreateChildModal } from '../components/CreateChildModal';
import { NavigationMenu } from '../components/NavigationMenu';
import { Colors } from '../constants/colors';
import { useAuth } from '../contexts/AuthContext';
import { apiService, Child } from '../services/api';

type DashboardRouteProp = RouteProp<RootStackParamList, 'Dashboard'>;
type DashboardNavigationProp = StackNavigationProp<RootStackParamList, 'Dashboard'>;

export function Dashboard() {
  const navigation = useNavigation<DashboardNavigationProp>();
  const route = useRoute<DashboardRouteProp>();
  const { user } = useAuth();
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isCreatePlayerModalVisible, setIsCreatePlayerModalVisible] = useState(false);
  const [children, setChildren] = useState<Child[]>([]);
  const [isLoadingChildren, setIsLoadingChildren] = useState(false);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [isChildDetailModalVisible, setIsChildDetailModalVisible] = useState(false);

  // Get user role from authenticated user data, fallback to route params, then default to 'parent'
  const userRole = (user?.user_metadata?.role as 'parent' | 'coach' | 'child') || route.params?.userRole || 'parent';

  const navigateToScreen = (screenName: keyof RootStackParamList, params?: any) => {
    navigation.navigate(screenName as any, params);
  };

  // Role-specific content and styling
  const getDashboardTitle = () => {
    return userRole === 'coach' ? 'Coach Dashboard' : 'Dashboard';
  };

  // Get role-appropriate terminology
  const getPlayerChildTerminology = () => {
    if (userRole === 'parent') return 'child';
    if (userRole === 'child') return 'player';
    return 'player'; // default for coach
  };

  // Get role-appropriate display text for badges
  const getRoleDisplayText = () => {
    if (userRole === 'child') return 'player';
    return userRole; // 'parent' or 'coach' stay as is
  };

  const getRoleSpecificNavigationItems = () => {
    const commonItems = [
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

    // Add health input for child users only
    if (userRole === 'child') {
      commonItems.unshift({
        id: 'health-input',
        title: 'Health Input',
        description: 'Log health data and metrics',
        icon: 'fitness',
        color: Colors.success,
        onPress: () => navigateToScreen('HealthInput'),
      });
    }

    // Add coach-specific item
    if (userRole === 'coach') {
      commonItems.splice(-2, 0, {
        id: 'coach-roster',
        title: 'Team Roster',
        description: 'Manage your team roster and player readiness',
        icon: 'people',
        color: Colors.secondary,
        onPress: () => navigateToScreen('CoachRoster'),
      });
    }

    return commonItems;
  };

  const navigationItems = getRoleSpecificNavigationItems();

  // Fetch children for parent users
  const fetchChildren = async () => {
    if (userRole !== 'parent') return;

    setIsLoadingChildren(true);
    try {
      const childrenData = await apiService.getChildren();
      setChildren(childrenData);
    } catch (error) {
      console.error('Failed to fetch children:', error);
    } finally {
      setIsLoadingChildren(false);
    }
  };

  React.useEffect(() => {
    if (userRole === 'parent') {
      fetchChildren();
    }
  }, [userRole]);

  const handleChildPress = (child: Child) => {
    setSelectedChild(child);
    setIsChildDetailModalVisible(true);
  };

  const handleCreateChildSuccess = () => {
    // Refresh children list when a new child is created
    fetchChildren();
    console.log(`${getPlayerChildTerminology()} account created successfully`);
  };

  const renderDailyRecommendationSection = () => {
    return (
      <View style={styles.recommendationSection}>
        <Text style={styles.sectionTitle}>Today's Recommendation</Text>

        <View style={styles.recommendationCard}>
          <View style={styles.recommendationHeader}>
            <Text style={styles.recommendationQuestion}>Play Hard Today?</Text>

            <View style={styles.recommendationAnswer}>
              <View style={[styles.answerCircle, { backgroundColor: Colors.success }]}>
                <Ionicons name="flash" size={24} color="white" />
                <Text style={styles.answerText}>YES</Text>
              </View>
            </View>
          </View>

          <Text style={styles.recommendationDescription}>
            {`${user?.user_metadata?.full_name} is ready for high intensity training today.`}
          </Text>

          <View style={styles.recommendationStats}>
            <View style={styles.recommendationStatItem}>
              <View style={[styles.statIcon, { backgroundColor: "rgba(59, 130, 246, 0.3)" }]}>
                <Ionicons name="heart" size={16} color="white" />
              </View>
              <View style={styles.statInfo}>
                <Text style={styles.statTitle}>Recovery Score</Text>
                <Text style={styles.statSubtitle}>From Whoop</Text>
              </View>
              <View style={styles.statBadge}>
                <Text style={styles.statValue}>85%</Text>
              </View>
            </View>

            <View style={styles.recommendationStatItem}>
              <View style={[styles.statIcon, { backgroundColor: "rgba(139, 92, 246, 0.3)" }]}>
                <Ionicons name="trending-up" size={16} color="white" />
              </View>
              <View style={styles.statInfo}>
                <Text style={styles.statTitle}>Training Load</Text>
                <Text style={styles.statSubtitle}>Last 7 days</Text>
              </View>
              <View style={[styles.statBadge, { backgroundColor: "#F59E0B" }]}>
                <Text style={styles.statValue}>Moderate</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.seeMoreButton}>
            <Text style={styles.seeMoreText}>See Detailed Analysis</Text>
            <Ionicons name="arrow-forward" size={16} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderChildCard = (child: Child) => (
    <TouchableOpacity
      key={child.id}
      style={styles.childCard}
      onPress={() => handleChildPress(child)}
    >
      <View style={styles.childCardContent}>
        <View style={styles.childInfo}>
          <View style={styles.childAvatarContainer}>
            <View style={styles.childAvatar}>
              <Ionicons name="person" size={24} color="white" />
            </View>
            {child.auth_user_id && (
              <View style={styles.loginBadge}>
                <Ionicons name="checkmark-circle" size={12} color={Colors.success} />
              </View>
            )}
          </View>
          <View style={styles.childDetails}>
            <Text style={styles.childName}>{child.name}</Text>
            <Text style={styles.childStatus}>
              {child.auth_user_id ? 'Can login independently' : 'Profile only'}
            </Text>
            <Text style={styles.childDate}>
              Member since {new Date(child.created_at).toLocaleDateString('en-US', {
                month: 'short',
                year: 'numeric',
              })}
            </Text>
          </View>
        </View>
        <View style={styles.childActions}>
          <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={[Colors.background, Colors.backgroundLight]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header with hamburger menu */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>

            <View>
              <Text style={styles.title}>{getDashboardTitle()}</Text>
              <View style={styles.roleContainer}>
                <View style={[styles.roleBadge, { backgroundColor: userRole === 'coach' ? Colors.secondary : userRole === 'parent' ? Colors.primary : Colors.accent }]}>
                  <Ionicons
                    name={userRole === 'coach' ? 'people' : userRole === 'parent' ? 'home' : 'school'}
                    size={16}
                    color="white"
                  />
                  <Text style={styles.roleText}>{getRoleDisplayText()}</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => setIsMenuVisible(true)}
            >
              <Ionicons name="menu" size={24} color={Colors.textPrimary} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            {/* Welcome Section */}
            <View style={styles.welcomeSection}>
              {user?.email && (
                <Text style={styles.welcomeText}>Welcome back, {user?.user_metadata?.full_name || user?.email}</Text>
              )}
              <Text style={styles.welcomeSubtext}>
                {userRole === 'coach'
                  ? 'Monitor your team\'s performance and readiness'
                  : 'Track your athlete\'s health and performance journey'
                }
              </Text>

              {/* Health Input Button - Only for Child Users */}
              {userRole === 'child' && (
                <TouchableOpacity
                  style={styles.healthInputButton}
                  onPress={() => navigateToScreen('HealthInput')}
                >
                  <View style={styles.healthInputButtonContent}>
                    <View style={styles.healthInputIcon}>
                      <Ionicons name="fitness" size={20} color="white" />
                    </View>
                    <View style={styles.healthInputText}>
                      <Text style={styles.healthInputTitle}>Log Health Data</Text>
                      <Text style={styles.healthInputDescription}>
                        Record health metrics and training readiness
                      </Text>
                    </View>
                    <View style={styles.addButton}>
                      <Ionicons name="add" size={20} color={Colors.success} />
                    </View>
                  </View>
                </TouchableOpacity>
              )}
            </View>

            {/* Children Section - Only for Parents */}
            {userRole === 'parent' && (
              <View style={styles.childrenSection}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>My Children</Text>
                  <Text style={styles.childrenSectionSubtitle}>
                    {children.length === 0
                      ? 'No children added yet'
                      : `${children.length} ${children.length === 1 ? 'child' : 'children'}`
                    }
                  </Text>
                </View>

                {isLoadingChildren ? (
                  <View style={styles.loadingChildren}>
                    <Text style={styles.loadingText}>Loading children...</Text>
                  </View>
                ) : children.length === 0 ? (
                  <View style={styles.emptyChildren}>
                    <Ionicons name="people-outline" size={48} color={Colors.textSecondary} />
                    <Text style={styles.emptyChildrenText}>No children yet</Text>
                    <Text style={styles.emptyChildrenSubtext}>
                      Add your first child to start tracking their health journey
                    </Text>
                  </View>
                ) : (
                  <View style={styles.childrenList}>
                    {children.map(renderChildCard)}
                  </View>
                )}
              </View>
            )}

            {/* Create Child/Player Button - Only for Parents */}
            {userRole === 'parent' && (
              <TouchableOpacity
                style={styles.createPlayerButton}
                onPress={() => setIsCreatePlayerModalVisible(true)}
              >
                <View style={styles.createPlayerButtonContent}>
                  <View style={styles.createPlayerIcon}>
                    <Ionicons name="person-add" size={20} color="white" />
                  </View>
                  <View style={styles.createPlayerText}>
                    <Text style={styles.createPlayerTitle}>Create {getPlayerChildTerminology()} Account</Text>
                    <Text style={styles.createPlayerDescription}>Add a new {getPlayerChildTerminology()} to track their health journey</Text>
                  </View>
                  <View style={styles.addButton}>
                    <Ionicons name="add" size={20} color={Colors.success} />
                  </View>
                </View>
              </TouchableOpacity>
            )}

            {/* Daily Recommendation Section - Only for Child Users */}
            {userRole === 'child' && renderDailyRecommendationSection()}

            {/* Recent Activity Placeholder */}
            {/* <View style={styles.activitySection}>
              <Text style={styles.sectionTitle}>Recent Activity</Text>
              <View style={styles.activityList}>
                <View style={styles.activityItem}>
                  <View style={[styles.activityIcon, { backgroundColor: Colors.success }]}>
                    <Ionicons name="fitness" size={16} color="white" />
                  </View>
                  <View style={styles.activityContent}>
                    <Text style={styles.activityTitle}>
                      {userRole === 'coach' ? 'Team training logged' : 'Health data logged'}
                    </Text>
                    <Text style={styles.activityTime}>2 hours ago</Text>
                  </View>
                </View>

                <View style={styles.activityItem}>
                  <View style={[styles.activityIcon, { backgroundColor: Colors.primary }]}>
                    <Ionicons name="heart" size={16} color="white" />
                  </View>
                  <View style={styles.activityContent}>
                    <Text style={styles.activityTitle}>
                      {userRole === 'coach' ? 'Player readiness updated' : 'Daily recommendation viewed'}
                    </Text>
                    <Text style={styles.activityTime}>5 hours ago</Text>
                  </View>
                </View>

                <View style={styles.activityItem}>
                  <View style={[styles.activityIcon, { backgroundColor: Colors.warning }]}>
                    <Ionicons name="calendar" size={16} color="white" />
                  </View>
                  <View style={styles.activityContent}>
                    <Text style={styles.activityTitle}>
                      {userRole === 'coach' ? 'Game scheduled' : 'Appointment scheduled'}
                    </Text>
                    <Text style={styles.activityTime}>1 day ago</Text>
                  </View>
                </View>
              </View>
            </View> */}
          </View>
        </ScrollView>

        {/* Navigation Menu */}
        <NavigationMenu
          isVisible={isMenuVisible}
          onClose={() => setIsMenuVisible(false)}
          navigationItems={navigationItems}
          userRole={userRole}
        />

        {/* Create Player Modal */}
        <CreateChildModal
          isVisible={isCreatePlayerModalVisible}
          onClose={() => setIsCreatePlayerModalVisible(false)}
          onSuccess={handleCreateChildSuccess}
        />

        {/* Child Detail Modal */}
        <ChildDetailModal
          child={selectedChild}
          isVisible={isChildDetailModalVisible}
          onClose={() => setIsChildDetailModalVisible(false)}
        />
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
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  menuButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 8,
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
    gap: 32,
    paddingBottom: 32,
  },
  welcomeSection: {
    paddingTop: 16,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  welcomeSubtext: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  statsSection: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  activitySection: {
    gap: 16,
  },
  activityList: {
    gap: 12,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityContent: {
    flex: 1,
    gap: 4,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textPrimary,
  },
  activityTime: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  createPlayerButton: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginTop: 16,
    width: '80%',
    alignSelf: 'center',
  },
  createPlayerButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  createPlayerIcon: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  createPlayerText: {
    flex: 1,
  },
  createPlayerTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  createPlayerDescription: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  addButton: {
    padding: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 8,
  },
  healthInputButton: {
    alignSelf: 'center',
    width: '80%',
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    marginTop: 12,
  },
  healthInputButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  healthInputIcon: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: Colors.success,
  },
  healthInputText: {
    flex: 1,
  },
  healthInputTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  healthInputDescription: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  recommendationSection: {
    gap: 16,
  },
  recommendationCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    padding: 20,
    gap: 16,
  },
  recommendationHeader: {
    alignItems: 'center',
    gap: 16,
  },
  recommendationQuestion: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  recommendationAnswer: {
    alignItems: 'center',
  },
  answerCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  answerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 2,
  },
  recommendationDescription: {
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 22,
    textAlign: 'center',
  },
  recommendationStats: {
    gap: 12,
  },
  recommendationStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 12,
  },
  statInfo: {
    flex: 1,
    gap: 2,
  },
  statTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textPrimary,
  },
  statSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  statBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  seeMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  seeMoreText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'white',
  },
  childrenSection: {
    gap: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  childrenSectionSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  loadingChildren: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textPrimary,
  },
  emptyChildren: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  emptyChildrenText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textPrimary,
  },
  emptyChildrenSubtext: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  childrenList: {
    gap: 12,
  },
  childCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    padding: 16,
  },
  childCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  childInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  childAvatarContainer: {
    position: 'relative',
  },
  childAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.gray[700],
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: Colors.success,
    borderRadius: 12,
    padding: 2,
  },
  childDetails: {
    flex: 1,
  },
  childName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  childStatus: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  childDate: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  childActions: {
    padding: 8,
  },
});