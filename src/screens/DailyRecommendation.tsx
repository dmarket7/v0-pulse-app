import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import type { StackNavigationProp } from "@react-navigation/stack"
import type { RouteProp } from "@react-navigation/native"
import type { RootStackParamList } from "../../App"
import { Colors } from "../constants/colors"

type DailyRecommendationNavigationProp = StackNavigationProp<RootStackParamList, "DailyRecommendation">
type DailyRecommendationRouteProp = RouteProp<RootStackParamList, "DailyRecommendation">

interface Props {
  navigation: DailyRecommendationNavigationProp
  route: DailyRecommendationRouteProp
}

export function DailyRecommendation({ navigation, route }: Props) {
  const { childName } = route.params
  const recommendation = "YES"
  const status = "optimal"

  return (
    <LinearGradient colors={[Colors.background, Colors.backgroundLight]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <View>
              <Text style={styles.logoText}>Pulse</Text>
              <View style={styles.readinessContainer}>
                <Text style={styles.readinessText}>{childName}'s Readiness</Text>
                <View style={[styles.statusDot, { backgroundColor: Colors.success }]} />
              </View>
            </View>
          </View>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatar}>👦</Text>
          </View>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Main Recommendation */}
          <View style={styles.recommendationContainer}>
            <Text style={styles.questionText}>Play Hard Today?</Text>

            <View style={styles.answerContainer}>
              <View style={[styles.answerCircle, { backgroundColor: Colors.success }]}>
                <Ionicons name="flash" size={32} color="white" />
                <Text style={styles.answerText}>{recommendation}</Text>
              </View>
              <Text style={styles.recommendationDescription}>{childName} is ready for high intensity training.</Text>
            </View>

            <TouchableOpacity style={styles.seeWhyButton}>
              <Text style={styles.seeWhyText}>See Why</Text>
              <Ionicons name="arrow-forward" size={16} color="white" />
            </TouchableOpacity>
          </View>

          {/* Quick Stats */}
          <View style={styles.statsContainer}>
            <View style={[styles.statCard, { backgroundColor: "rgba(244, 114, 182, 0.1)" }]}>
              <View style={styles.statHeader}>
                <View style={[styles.statIcon, { backgroundColor: "rgba(59, 130, 246, 0.3)" }]}>
                  <Ionicons name="heart" size={20} color="white" />
                </View>
                <View style={styles.statInfo}>
                  <Text style={styles.statTitle}>Recovery Score</Text>
                  <Text style={styles.statSubtitle}>From Whoop</Text>
                </View>
              </View>
              <View style={styles.statBadge}>
                <Text style={styles.statValue}>85%</Text>
              </View>
            </View>

            <View style={[styles.statCard, { backgroundColor: "rgba(244, 114, 182, 0.1)" }]}>
              <View style={styles.statHeader}>
                <View style={[styles.statIcon, { backgroundColor: "rgba(139, 92, 246, 0.3)" }]}>
                  <Ionicons name="trending-up" size={20} color="white" />
                </View>
                <View style={styles.statInfo}>
                  <Text style={styles.statTitle}>Training Load</Text>
                  <Text style={styles.statSubtitle}>Last 7 days</Text>
                </View>
              </View>
              <View style={[styles.statBadge, { backgroundColor: "#F59E0B" }]}>
                <Text style={styles.statValue}>Moderate</Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Bottom Navigation */}
        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navItem}>
            <Ionicons name="pulse" size={20} color="white" />
            <Text style={styles.navText}>Log Activity</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Calendar")}>
            <Ionicons name="calendar-outline" size={20} color="white" />
            <Text style={styles.navText}>Schedule</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("HealthInput", { childId: "1" })}>
            <Ionicons name="heart-outline" size={20} color="white" />
            <Text style={styles.navText}>Health Log</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 24,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  backButton: {
    padding: 8,
  },
  logoText: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
  },
  readinessContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  readinessText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    fontSize: 18,
  },
  scrollView: {
    flex: 1,
  },
  recommendationContainer: {
    paddingHorizontal: 24,
    paddingVertical: 32,
    alignItems: "center",
  },
  questionText: {
    fontSize: 24,
    fontWeight: "300",
    color: "white",
    marginBottom: 32,
  },
  answerContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  answerCircle: {
    width: 128,
    height: 128,
    borderRadius: 64,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  answerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginTop: 4,
  },
  recommendationDescription: {
    fontSize: 18,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
  },
  seeWhyButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  seeWhyText: {
    fontSize: 16,
    color: "white",
  },
  statsContainer: {
    paddingHorizontal: 24,
    gap: 12,
  },
  statCard: {
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  statInfo: {
    gap: 2,
  },
  statTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "white",
  },
  statSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
  },
  statBadge: {
    backgroundColor: "#10B981",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statValue: {
    fontSize: 12,
    fontWeight: "500",
    color: "white",
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.2)",
  },
  navItem: {
    alignItems: "center",
    gap: 4,
  },
  navText: {
    fontSize: 12,
    color: "white",
  },
})
