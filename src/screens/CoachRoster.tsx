"use client";

import { Ionicons } from "@expo/vector-icons";
import type { StackNavigationProp } from "@react-navigation/stack";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { FlatList, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import type { RootStackParamList } from "../../App";
import { Colors } from "../constants/colors";

type CoachRosterNavigationProp = StackNavigationProp<RootStackParamList, "CoachRoster">;

interface Props {
  navigation: CoachRosterNavigationProp;
}

interface Player {
  id: string;
  name: string;
  position: string;
  status: "optimal" | "caution" | "rest";
  avatar: string;
}

const players: Player[] = [
  { id: "1", name: "Alex Johnson", position: "Forward", status: "optimal", avatar: "⚽" },
  { id: "2", name: "Sarah Chen", position: "Midfielder", status: "caution", avatar: "🏃‍♀️" },
  { id: "3", name: "Marcus Williams", position: "Defender", status: "rest", avatar: "🛡️" },
  { id: "4", name: "Emma Davis", position: "Goalkeeper", status: "optimal", avatar: "🥅" },
  { id: "5", name: "Tyler Brown", position: "Forward", status: "optimal", avatar: "⚽" },
  { id: "6", name: "Zoe Martinez", position: "Midfielder", status: "caution", avatar: "🏃‍♀️" },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "optimal":
      return Colors.success;
    case "caution":
      return Colors.warning;
    case "rest":
      return Colors.danger;
    default:
      return "#6B7280";
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case "optimal":
      return "Optimal";
    case "caution":
      return "Caution";
    case "rest":
      return "Rest";
    default:
      return "Unknown";
  }
};

export function CoachRoster({ navigation }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  const filteredPlayers = players.filter((player) => {
    const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === "all" || player.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const renderPlayer = ({ item }: { item: Player; }) => (
    <TouchableOpacity style={styles.playerCard}>
      <View style={styles.playerInfo}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatar}>{item.avatar}</Text>
        </View>
        <View style={styles.playerDetails}>
          <Text style={styles.playerName}>{item.name}</Text>
          <Text style={styles.playerPosition}>{item.position}</Text>
        </View>
      </View>
      <View style={styles.statusContainer}>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
        </View>
        <View style={[styles.statusDot, { backgroundColor: getStatusColor(item.status) }]} />
      </View>
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={[Colors.background, Colors.backgroundLight]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
            </TouchableOpacity>
            <View>
              <Text style={styles.headerTitle}>Team Readiness</Text>
              <Text style={styles.headerSubtitle}>U-15 Soccer Team</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="filter" size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Ionicons name="search" size={16} color={Colors.textSecondary} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search players..."
              placeholderTextColor={Colors.textSecondary}
              value={searchTerm}
              onChangeText={setSearchTerm}
            />
          </View>
        </View>

        {/* Filter Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
          <View style={styles.filterTabs}>
            {["all", "optimal", "caution", "rest"].map((filter) => (
              <TouchableOpacity
                key={filter}
                style={[styles.filterTab, selectedFilter === filter && styles.filterTabActive]}
                onPress={() => setSelectedFilter(filter)}
              >
                <Text style={[styles.filterTabText, selectedFilter === filter && styles.filterTabTextActive]}>
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Player List */}
        <FlatList
          data={filteredPlayers}
          renderItem={renderPlayer}
          keyExtractor={(item) => item.id}
          style={styles.playerList}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.playerListContent}
        />

        {/* Summary Stats */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryStats}>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryValue, { color: Colors.success }]}>
                {players.filter((p) => p.status === "optimal").length}
              </Text>
              <Text style={styles.summaryLabel}>Ready</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryValue, { color: Colors.warning }]}>
                {players.filter((p) => p.status === "caution").length}
              </Text>
              <Text style={styles.summaryLabel}>Monitor</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryValue, { color: Colors.danger }]}>
                {players.filter((p) => p.status === "rest").length}
              </Text>
              <Text style={styles.summaryLabel}>Rest</Text>
            </View>
          </View>
        </View>
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[700],
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
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  filterButton: {
    padding: 8,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    fontSize: 16,
    color: Colors.textPrimary,
  },
  filterContainer: {
    height: 48,
    paddingBottom: 16,
    marginBottom: 8,
  },
  filterTabs: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 12,
  },
  filterTab: {
    height: 32,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.gray[600],
  },
  filterTabActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterTabText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: "500",
  },
  filterTabTextActive: {
    color: Colors.white,
  },
  playerList: {

  },
  playerListContent: {
    paddingHorizontal: 20,
    gap: 12,
    paddingBottom: 20,
  },
  playerCard: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  playerInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    backgroundColor: Colors.surface,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    fontSize: 20,
  },
  playerDetails: {
    gap: 4,
  },
  playerName: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  playerPosition: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: "white",
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  summaryContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.2)",
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  summaryStats: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  summaryItem: {
    alignItems: "center",
    gap: 4,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: "bold",
  },
  summaryLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: "500",
  },
});
