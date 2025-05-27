"use client"

import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, FlatList } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import type { StackNavigationProp } from "@react-navigation/stack"
import type { RootStackParamList } from "../../App"
import { Colors } from "../constants/colors"

type CoachRosterNavigationProp = StackNavigationProp<RootStackParamList, "CoachRoster">

interface Props {
  navigation: CoachRosterNavigationProp
}

interface Player {
  id: string
  name: string
  position: string
  status: "optimal" | "caution" | "rest"
  avatar: string
}

const players: Player[] = [
  { id: "1", name: "Alex Johnson", position: "Forward", status: "optimal", avatar: "⚽" },
  { id: "2", name: "Sarah Chen", position: "Midfielder", status: "caution", avatar: "🏃‍♀️" },
  { id: "3", name: "Marcus Williams", position: "Defender", status: "rest", avatar: "🛡️" },
  { id: "4", name: "Emma Davis", position: "Goalkeeper", status: "optimal", avatar: "🥅" },
  { id: "5", name: "Tyler Brown", position: "Forward", status: "optimal", avatar: "⚽" },
  { id: "6", name: "Zoe Martinez", position: "Midfielder", status: "caution", avatar: "🏃‍♀️" },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "optimal":
      return Colors.success
    case "caution":
      return Colors.warning
    case "rest":
      return Colors.danger
    default:
      return "#6B7280"
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case "optimal":
      return "Optimal"
    case "caution":
      return "Caution"
    case "rest":
      return "Rest"
    default:
      return "Unknown"
  }
}

export function CoachRoster({ navigation }: Props) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")

  const filteredPlayers = players.filter((player) => {
    const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = selectedFilter === "all" || player.status === selectedFilter
    return matchesSearch && matchesFilter
  })

  const renderPlayer = ({ item }: { item: Player }) => (
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
  )

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate("Welcome")}>
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Team Readiness</Text>
            <Text style={styles.headerSubtitle}>U-15 Soccer Team</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="filter" size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={16} color="#9CA3AF" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search players..."
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
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray[50],
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
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
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#6B7280",
  },
  filterButton: {
    padding: 8,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "white",
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: "#1F2937",
  },
  filterContainer: {
    backgroundColor: "white",
    paddingBottom: 16,
  },
  filterTabs: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 8,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  filterTabActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterTabText: {
    fontSize: 14,
    color: "#6B7280",
  },
  filterTabTextActive: {
    color: "white",
  },
  playerList: {
    flex: 1,
  },
  playerListContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 12,
  },
  playerCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  playerInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    backgroundColor: "#F3F4F6",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    fontSize: 18,
  },
  playerDetails: {
    gap: 2,
  },
  playerName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1F2937",
  },
  playerPosition: {
    fontSize: 14,
    color: "#6B7280",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
    color: "white",
  },
  statusDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  summaryContainer: {
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingVertical: 16,
  },
  summaryStats: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  summaryItem: {
    alignItems: "center",
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: "600",
  },
  summaryLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
})
