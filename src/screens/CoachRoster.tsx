"use client";

import { Ionicons } from "@expo/vector-icons";
import type { StackNavigationProp } from "@react-navigation/stack";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef, useState } from "react";
import { Alert, FlatList, Modal, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import type { RootStackParamList } from "../../App";
import { Colors } from "../constants/colors";
import { useAuth } from "../contexts/AuthContext";
import { apiService, type Child, type PlayerInvitation, type RosterPlayer, type TeamRead, type TeamRoster } from "../services/api";

type CoachRosterNavigationProp = StackNavigationProp<RootStackParamList, "CoachRoster">;

interface Props {
  navigation: CoachRosterNavigationProp;
}

const getPositionEmoji = (position: string) => {
  switch (position.toLowerCase()) {
    case "forward":
      return "⚽";
    case "midfielder":
      return "🏃‍♀️";
    case "defender":
      return "🛡️";
    case "goalkeeper":
      return "🥅";
    default:
      return "⚽";
  }
};

const positions = ["forward", "midfielder", "defender", "goalkeeper"];

export function CoachRoster({ navigation }: Props) {
  const { user } = useAuth();
  const fetchingRef = useRef(false);
  const emailInputRef = useRef<TextInput>(null);
  const emailValueRef = useRef<string>("");

  const [currentTeam, setCurrentTeam] = useState<TeamRead | null>(null);
  const [teamRoster, setTeamRoster] = useState<TeamRoster | null>(null);
  const [isLoadingTeam, setIsLoadingTeam] = useState(true);
  const [isLoadingRoster, setIsLoadingRoster] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [isAddPlayerModalVisible, setIsAddPlayerModalVisible] = useState(false);
  const [isEditPlayerModalVisible, setIsEditPlayerModalVisible] = useState(false);
  const [selectedPositions, setSelectedPositions] = useState<string[]>([]);
  const [editingPlayer, setEditingPlayer] = useState<RosterPlayer | null>(null);
  const [availableChildren, setAvailableChildren] = useState<Child[]>([]);
  const [isLoadingAvailableChildren, setIsLoadingAvailableChildren] = useState(false);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [searchAvailableChildren, setSearchAvailableChildren] = useState("");
  const [isInvitePlayerModalVisible, setIsInvitePlayerModalVisible] = useState(false);
  const [pendingInvitations, setPendingInvitations] = useState<PlayerInvitation[]>([]);
  const [isLoadingInvitations, setIsLoadingInvitations] = useState(false);
  const [hasEmailValue, setHasEmailValue] = useState(false);

  const fetchTeamData = async () => {
    try {
      setIsLoadingTeam(true);
      const teams = await apiService.getMyTeams();
      const activeTeam = teams.find(team => !team.archived);

      if (activeTeam) {
        setCurrentTeam(activeTeam);
        await fetchTeamRoster(activeTeam.id);
      }
    } catch (error) {
      console.error('Failed to fetch team data:', error);
      Alert.alert('Error', 'Failed to load team data. Please try again.');
    } finally {
      setIsLoadingTeam(false);
    }
  };

  const fetchTeamRoster = async (teamId: string) => {
    try {
      setIsLoadingRoster(true);
      const roster = await apiService.getTeamRoster(teamId);
      setTeamRoster(roster);
    } catch (error) {
      console.error('Failed to fetch team roster:', error);
      Alert.alert('Error', 'Failed to load team roster. Please try again.');
    } finally {
      setIsLoadingRoster(false);
    }
  };

  useEffect(() => {
    fetchTeamData();
  }, []);

  // Cleanup function
  useEffect(() => {
    return () => {
      fetchingRef.current = false;
    };
  }, []);

  const sendPlayerInvitation = async () => {
    console.log('=== DEBUG: Sending invitation ===');
    console.log('Email value:', emailValueRef.current);
    console.log('Selected positions:', selectedPositions);
    console.log('Current team:', currentTeam?.id, currentTeam?.name);

    if (!emailValueRef.current.trim() || !currentTeam || selectedPositions.length === 0) {
      Alert.alert('Error', 'Please enter a player email and select at least one position.');
      return;
    }

    const invitationData = {
      email: emailValueRef.current.trim(),
      positions: selectedPositions,
    };

    console.log('=== Sending invitation data ===', invitationData);

    try {
      await apiService.createTeamInvitation(currentTeam.id, invitationData);

      Alert.alert(
        'Invitation Sent!',
        `An invitation has been sent to ${emailValueRef.current} to join ${currentTeam.name}.\n\nThey will receive an email with instructions to accept or decline the invitation.`,
        [{ text: 'OK' }]
      );

      closeInvitePlayerModal();
      // Increment local count instead of refetching
      setPendingInvitations(prev => [...prev, {
        id: Date.now().toString(),
        team_id: currentTeam.id,
        team_name: currentTeam.name,
        invited_email: emailValueRef.current.trim(),
        invited_by: user?.id || 'unknown',
        status: 'pending' as const,
        positions: selectedPositions,
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
      }]);
    } catch (error) {
      console.error('Failed to send invitation:', error);
      Alert.alert('Error', 'Failed to send invitation. Please try again.');
    }
  };

  const filteredPlayers = teamRoster?.players.filter((player) => {
    const matchesSearch = player.child_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === "all" ||
      (player.positions && player.positions.includes(selectedFilter));
    return matchesSearch && matchesFilter;
  }) || [];

  const filteredAvailableChildren = availableChildren.filter((child) =>
    child.name.toLowerCase().includes(searchAvailableChildren.toLowerCase())
  );

  const openAddPlayerModal = () => {
    console.log('Opening invite player modal...');
    emailInputRef.current?.clear();
    emailValueRef.current = "";
    setHasEmailValue(false);
    setSelectedPositions([]);
    setIsInvitePlayerModalVisible(true);
  };

  const closeInvitePlayerModal = () => {
    console.log('Closing invite player modal...');
    setIsInvitePlayerModalVisible(false);
    emailInputRef.current?.clear();
    emailValueRef.current = "";
    setHasEmailValue(false);
    setSelectedPositions([]);
  };

  const addPlayerToTeam = async () => {
    if (!selectedChild || !currentTeam || selectedPositions.length === 0) {
      Alert.alert('Error', 'Please select a player and at least one position.');
      return;
    }

    try {
      await apiService.addPlayerToTeam(currentTeam.id, {
        child_id: selectedChild.id,
        positions: selectedPositions,
      });

      // Close modal and reset state first
      closeInvitePlayerModal();

      // Refresh the roster after modal is closed
      setTimeout(() => {
        fetchTeamRoster(currentTeam.id);
      }, 100);

      Alert.alert('Success', `${selectedChild.name} has been added to the team!`);
    } catch (error) {
      console.error('Failed to add player to team:', error);
      Alert.alert('Error', 'Failed to add player to team. Please try again.');
    }
  };

  const removePlayerFromTeam = async (playerId: string, playerName: string) => {
    if (!currentTeam) return;

    Alert.alert(
      "Remove Player",
      `Are you sure you want to remove ${playerName} from the team roster?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            try {
              await apiService.removePlayerFromTeam(currentTeam.id, {
                child_id: playerId,
              });

              Alert.alert('Success', `${playerName} has been removed from the team.`);

              // Refresh the roster after alert
              setTimeout(() => {
                fetchTeamRoster(currentTeam.id);
              }, 100);
            } catch (error) {
              console.error('Failed to remove player from team:', error);
              Alert.alert('Error', 'Failed to remove player from team. Please try again.');
            }
          },
        },
      ]
    );
  };

  const editPlayerPositions = (player: RosterPlayer) => {
    setEditingPlayer(player);
    setSelectedPositions(player.positions || []);
    setIsEditPlayerModalVisible(true);
  };

  const updatePlayerPositions = async () => {
    if (!editingPlayer || !currentTeam || selectedPositions.length === 0) {
      Alert.alert('Error', 'Please select at least one position.');
      return;
    }

    try {
      await apiService.updatePlayerPositions(currentTeam.id, editingPlayer.child_id, {
        child_id: editingPlayer.child_id,
        positions: selectedPositions,
      });

      // Close modal and reset state first
      setIsEditPlayerModalVisible(false);
      setEditingPlayer(null);
      setSelectedPositions([]);

      Alert.alert('Success', `${editingPlayer.child_name}'s positions have been updated!`);

      // Refresh the roster after modal is closed
      setTimeout(() => {
        fetchTeamRoster(currentTeam.id);
      }, 100);
    } catch (error) {
      console.error('Failed to update player positions:', error);
      Alert.alert('Error', 'Failed to update player positions. Please try again.');
    }
  };

  const togglePosition = (position: string) => {
    setSelectedPositions(prev =>
      prev.includes(position)
        ? prev.filter(p => p !== position)
        : [...prev, position]
    );
  };

  const renderPlayer = ({ item }: { item: RosterPlayer; }) => (
    <TouchableOpacity
      style={styles.playerCard}
      onPress={() => editPlayerPositions(item)}
    >
      <View style={styles.playerInfo}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatar}>
            {item.positions && item.positions.length > 0
              ? getPositionEmoji(item.positions[0])
              : "⚽"}
          </Text>
        </View>
        <View style={styles.playerDetails}>
          <Text style={styles.playerName}>{item.child_name}</Text>
          <Text style={styles.playerPosition}>
            {item.positions && item.positions.length > 0
              ? item.positions.join(', ')
              : 'No position assigned'}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => removePlayerFromTeam(item.child_id, item.child_name)}
      >
        <Ionicons name="close-circle" size={24} color={Colors.danger} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderAvailableChild = ({ item }: { item: Child; }) => (
    <TouchableOpacity
      style={[
        styles.childCard,
        selectedChild?.id === item.id && styles.childCardSelected
      ]}
      onPress={() => setSelectedChild(item)}
    >
      <View style={styles.childInfo}>
        <View style={styles.childAvatar}>
          <Ionicons name="person" size={20} color="white" />
        </View>
        <View style={styles.childDetails}>
          <Text style={styles.childName}>{item.name}</Text>
          <Text style={styles.childStatus}>Available</Text>
        </View>
      </View>
      {selectedChild?.id === item.id && (
        <Ionicons name="checkmark-circle" size={24} color={Colors.success} />
      )}
    </TouchableOpacity>
  );

  const renderPositionButton = (position: string) => (
    <TouchableOpacity
      key={position}
      style={[
        styles.positionButton,
        selectedPositions.includes(position) && styles.positionButtonActive,
      ]}
      onPress={() => togglePosition(position)}
    >
      <Text style={styles.positionEmoji}>{getPositionEmoji(position)}</Text>
      <Text style={[
        styles.positionText,
        selectedPositions.includes(position) && styles.positionTextActive,
      ]}>
        {position.charAt(0).toUpperCase() + position.slice(1)}
      </Text>
    </TouchableOpacity>
  );

  const InvitePlayerModal = () => {
    return (
      <Modal
        visible={isInvitePlayerModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeInvitePlayerModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Invite Player to Team</Text>

            <Text style={styles.inputLabel}>Player's Email</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter player's email address"
              placeholderTextColor={Colors.textSecondary}
              ref={emailInputRef}
              keyboardType="email-address"
              autoCapitalize="none"
              onChangeText={handleEmailChange}
            />

            <Text style={styles.inputLabel}>Assign Positions</Text>
            <View style={styles.positionGrid}>
              {positions.map(renderPositionButton)}
            </View>

            {pendingInvitations.length > 0 && (
              <View style={styles.pendingInvitationsContainer}>
                <Text style={styles.inputLabel}>Pending Invitations</Text>
                <Text style={styles.pendingInvitationsText}>
                  {pendingInvitations.length} invitation{pendingInvitations.length > 1 ? 's' : ''} pending
                </Text>
              </View>
            )}

            <View style={styles.inviteInfoContainer}>
              <Ionicons name="information-circle" size={16} color={Colors.primary} />
              <Text style={styles.inviteInfoText}>
                The player will receive an email invitation to join your team. They can accept or decline the invitation.
              </Text>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={closeInvitePlayerModal}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.saveButton,
                  (!hasEmailValue || selectedPositions.length === 0) && styles.saveButtonDisabled
                ]}
                onPress={sendPlayerInvitation}
                disabled={!hasEmailValue || selectedPositions.length === 0}
              >
                <Text style={styles.saveButtonText}>Send Invitation</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const handleEmailChange = (text: string) => {
    emailValueRef.current = text;
    setHasEmailValue(text.trim() !== "");
  };

  if (isLoadingTeam) {
    return (
      <LinearGradient colors={[Colors.background, Colors.backgroundLight]} style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading team data...</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  if (!currentTeam) {
    return (
      <LinearGradient colors={[Colors.background, Colors.backgroundLight]} style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.loadingContainer}>
            <Ionicons name="people-outline" size={48} color={Colors.textSecondary} />
            <Text style={styles.loadingText}>No Active Team</Text>
            <Text style={styles.emptyText}>Create a team first to manage players</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

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
              <Text style={styles.headerTitle}>Team Roster</Text>
              <Text style={styles.headerSubtitle}>{currentTeam.name}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.addButton}
            onPress={openAddPlayerModal}
          >
            <Ionicons name="add" size={24} color={Colors.textPrimary} />
            {pendingInvitations.length > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>
                  {pendingInvitations.length}
                </Text>
              </View>
            )}
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
            {["all", ...positions].map((filter) => (
              <TouchableOpacity
                key={filter}
                style={[styles.filterTab, selectedFilter === filter && styles.filterTabActive]}
                onPress={() => setSelectedFilter(filter)}
              >
                <Text style={[styles.filterTabText, selectedFilter === filter && styles.filterTabTextActive]}>
                  {filter === "all" ? "All" : filter.charAt(0).toUpperCase() + filter.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Player List */}
        {isLoadingRoster ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading roster...</Text>
          </View>
        ) : (
          <FlatList
            data={filteredPlayers}
            renderItem={renderPlayer}
            keyExtractor={(item) => item.child_id}
            style={styles.playerList}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.playerListContent}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="people-outline" size={48} color={Colors.textSecondary} />
                <Text style={styles.emptyText}>No players found</Text>
                <Text style={styles.emptySubtext}>
                  Add players to your team to get started
                </Text>
              </View>
            }
          />
        )}

        {/* Summary Stats */}
        {teamRoster && (
          <View style={styles.summaryContainer}>
            <View style={styles.summaryStats}>
              {positions.map((position) => (
                <View key={position} style={styles.summaryItem}>
                  <Text style={styles.summaryValue}>
                    {teamRoster.players.filter((p) =>
                      p.positions && p.positions.includes(position)
                    ).length}
                  </Text>
                  <Text style={styles.summaryLabel}>{position}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Add Player Modal */}
        <InvitePlayerModal />

        {/* Edit Player Modal */}
        <Modal visible={isEditPlayerModalVisible} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                Edit {editingPlayer?.child_name}'s Positions
              </Text>

              <Text style={styles.inputLabel}>Assign Positions</Text>
              <View style={styles.positionGrid}>
                {positions.map(renderPositionButton)}
              </View>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => {
                    setIsEditPlayerModalVisible(false);
                    setEditingPlayer(null);
                    setSelectedPositions([]);
                  }}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.saveButton,
                    selectedPositions.length === 0 && styles.saveButtonDisabled
                  ]}
                  onPress={updatePlayerPositions}
                  disabled={selectedPositions.length === 0}
                >
                  <Text style={styles.saveButtonText}>Update</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
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
  addButton: {
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
    flex: 1,
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
    height: "90%",
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
    flex: 1,
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
    flex: 1,
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
  removeButton: {
    padding: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.textPrimary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.textPrimary,
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  emptyAvailableContainer: {
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    paddingVertical: 40,
    paddingHorizontal: 20,
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
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.textPrimary,
  },
  summaryLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: "500",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 24,
    width: "90%",
    maxWidth: 400,
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.textPrimary,
    textAlign: "center",
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  modalInput: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.textPrimary,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.gray[600],
  },
  childrenList: {
    maxHeight: 200,
    marginBottom: 16,
  },
  childCard: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  childCardSelected: {
    borderColor: Colors.success,
    backgroundColor: "rgba(34, 197, 94, 0.1)",
  },
  childInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  childAvatar: {
    width: 40,
    height: 40,
    backgroundColor: Colors.gray[600],
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  childDetails: {
    gap: 2,
  },
  childName: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  childStatus: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  positionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 24,
  },
  positionButton: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.gray[600],
  },
  positionButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  positionEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  positionText: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.textSecondary,
  },
  positionTextActive: {
    color: Colors.white,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: Colors.gray[600],
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  saveButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  saveButtonDisabled: {
    backgroundColor: Colors.gray[600],
    opacity: 0.5,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.textSecondary,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.white,
  },
  infoButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    backgroundColor: Colors.surface,
    borderRadius: 12,
  },
  infoButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.primary,
  },
  pendingInvitationsContainer: {
    padding: 16,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    marginBottom: 16,
  },
  pendingInvitationsText: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.textPrimary,
  },
  inviteInfoContainer: {
    padding: 16,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  inviteInfoText: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.textPrimary,
  },
  notificationBadge: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    minWidth: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: Colors.background,
  },
  notificationBadgeText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "white",
  },
});
