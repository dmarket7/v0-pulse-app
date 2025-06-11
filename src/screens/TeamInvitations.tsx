"use client";

import { Ionicons } from "@expo/vector-icons";
import type { StackNavigationProp } from "@react-navigation/stack";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { Alert, FlatList, Modal, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import type { RootStackParamList } from "../../App";
import { Colors } from "../constants/colors";
import { useAuth } from "../contexts/AuthContext";
import { apiService, type Child, type ReceivedInvitation } from "../services/api";

type TeamInvitationsNavigationProp = StackNavigationProp<RootStackParamList, "TeamInvitations">;

interface Props {
  navigation: TeamInvitationsNavigationProp;
}

const getPositionEmoji = (position: string) => {
  switch (position) {
    case "Forward":
      return "⚽";
    case "Midfielder":
      return "🏃‍♀️";
    case "Defender":
      return "🛡️";
    case "Goalkeeper":
      return "🥅";
    default:
      return "⚽";
  }
};

export function TeamInvitations({ navigation }: Props) {
  const { user } = useAuth();
  const [invitations, setInvitations] = useState<ReceivedInvitation[]>([]);
  const [children, setChildren] = useState<Child[]>([]);
  const [isLoadingInvitations, setIsLoadingInvitations] = useState(true);
  const [isLoadingChildren, setIsLoadingChildren] = useState(false);
  const [selectedInvitation, setSelectedInvitation] = useState<ReceivedInvitation | null>(null);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [isResponseModalVisible, setIsResponseModalVisible] = useState(false);

  const fetchInvitations = async () => {
    try {
      setIsLoadingInvitations(true);
      const receivedInvitations = await apiService.getReceivedInvitations();
      setInvitations(receivedInvitations);
    } catch (error) {
      console.error('Failed to fetch invitations:', error);
      Alert.alert('Error', 'Failed to load invitations. Please try again.');
    } finally {
      setIsLoadingInvitations(false);
    }
  };

  const fetchChildren = async () => {
    try {
      setIsLoadingChildren(true);
      const childrenData = await apiService.getChildren();
      setChildren(childrenData);
    } catch (error) {
      console.error('Failed to fetch children:', error);
      Alert.alert('Error', 'Failed to load children. Please try again.');
    } finally {
      setIsLoadingChildren(false);
    }
  };

  useEffect(() => {
    fetchInvitations();
    fetchChildren();
  }, []);

  const handleInvitationPress = (invitation: ReceivedInvitation) => {
    if (invitation.status !== 'pending') return;

    setSelectedInvitation(invitation);
    setSelectedChild(null);
    setIsResponseModalVisible(true);
  };

  const respondToInvitation = async (accept: boolean) => {
    if (!selectedInvitation) return;

    if (accept && !selectedChild) {
      Alert.alert('Error', 'Please select which child to add to the team.');
      return;
    }

    try {
      await apiService.respondToInvitation(selectedInvitation.id, {
        accept,
        child_id: accept ? selectedChild?.id : undefined,
      });

      const action = accept ? 'accepted' : 'declined';
      Alert.alert(
        'Response Sent!',
        `You have ${action} the invitation from ${selectedInvitation.team_name}.`,
        [{ text: 'OK' }]
      );

      setIsResponseModalVisible(false);
      setSelectedInvitation(null);
      setSelectedChild(null);

      // Refresh invitations
      await fetchInvitations();
    } catch (error) {
      console.error('Failed to respond to invitation:', error);
      Alert.alert('Error', 'Failed to send response. Please try again.');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return Colors.warning;
      case 'accepted':
        return Colors.success;
      case 'declined':
        return Colors.danger;
      case 'expired':
        return Colors.textSecondary;
      default:
        return Colors.textSecondary;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return 'time-outline';
      case 'accepted':
        return 'checkmark-circle';
      case 'declined':
        return 'close-circle';
      case 'expired':
        return 'alert-circle';
      default:
        return 'help-circle';
    }
  };

  const renderInvitation = ({ item }: { item: ReceivedInvitation; }) => (
    <TouchableOpacity
      style={[
        styles.invitationCard,
        item.status === 'pending' && styles.invitationCardPending
      ]}
      onPress={() => handleInvitationPress(item)}
      disabled={item.status !== 'pending'}
    >
      <View style={styles.invitationHeader}>
        <View style={styles.teamInfo}>
          <Text style={styles.teamName}>{item.team_name}</Text>
          <Text style={styles.coachName}>Coach: {item.coach_name}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Ionicons name={getStatusIcon(item.status)} size={16} color="white" />
          <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
        </View>
      </View>

      {item.positions && item.positions.length > 0 && (
        <View style={styles.positionsContainer}>
          <Text style={styles.positionsLabel}>Positions:</Text>
          <View style={styles.positionsList}>
            {item.positions.map((position, index) => (
              <View key={index} style={styles.positionChip}>
                <Text style={styles.positionEmoji}>{getPositionEmoji(position)}</Text>
                <Text style={styles.positionText}>{position}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {item.message && (
        <View style={styles.messageContainer}>
          <Text style={styles.messageLabel}>Message:</Text>
          <Text style={styles.messageText}>{item.message}</Text>
        </View>
      )}

      <View style={styles.invitationFooter}>
        <Text style={styles.dateText}>
          Received: {formatDate(item.created_at)}
        </Text>
        <Text style={styles.expiryText}>
          Expires: {formatDate(item.expires_at)}
        </Text>
      </View>

      {item.status === 'pending' && (
        <View style={styles.actionHint}>
          <Ionicons name="hand-right-outline" size={16} color={Colors.primary} />
          <Text style={styles.actionHintText}>Tap to respond</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderChildOption = ({ item }: { item: Child; }) => (
    <TouchableOpacity
      style={[
        styles.childOption,
        selectedChild?.id === item.id && styles.childOptionSelected
      ]}
      onPress={() => setSelectedChild(item)}
    >
      <View style={styles.childInfo}>
        <View style={styles.childAvatar}>
          <Ionicons name="person" size={20} color="white" />
        </View>
        <View style={styles.childDetails}>
          <Text style={styles.childName}>{item.name}</Text>
          <Text style={styles.childAge}>
            {item.date_of_birth ? `Born ${formatDate(item.date_of_birth)}` : 'Age not set'}
          </Text>
        </View>
      </View>
      {selectedChild?.id === item.id && (
        <Ionicons name="checkmark-circle" size={24} color={Colors.success} />
      )}
    </TouchableOpacity>
  );

  if (isLoadingInvitations) {
    return (
      <LinearGradient colors={[Colors.background, Colors.backgroundLight]} style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading invitations...</Text>
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
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>Team Invitations</Text>
            <Text style={styles.headerSubtitle}>
              {invitations.filter(inv => inv.status === 'pending').length} pending
            </Text>
          </View>
        </View>

        {/* Invitations List */}
        <FlatList
          data={invitations}
          renderItem={renderInvitation}
          keyExtractor={(item) => item.id}
          style={styles.invitationsList}
          contentContainerStyle={styles.invitationsListContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="mail-outline" size={48} color={Colors.textSecondary} />
              <Text style={styles.emptyText}>No Team Invitations</Text>
              <Text style={styles.emptySubtext}>
                When coaches invite your children to join their teams, you'll see those invitations here.
              </Text>
            </View>
          }
        />

        {/* Response Modal */}
        <Modal visible={isResponseModalVisible} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                Respond to Invitation
              </Text>

              <View style={styles.invitationSummary}>
                <Text style={styles.summaryTeam}>{selectedInvitation?.team_name}</Text>
                <Text style={styles.summaryCoach}>Coach: {selectedInvitation?.coach_name}</Text>
                {selectedInvitation?.positions && selectedInvitation.positions.length > 0 && (
                  <Text style={styles.summaryPositions}>
                    Positions: {selectedInvitation.positions.join(', ')}
                  </Text>
                )}
              </View>

              <Text style={styles.modalSectionTitle}>Select Child</Text>
              <FlatList
                data={children}
                renderItem={renderChildOption}
                keyExtractor={(item) => item.id}
                style={styles.childrenList}
                showsVerticalScrollIndicator={false}
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.declineButton}
                  onPress={() => respondToInvitation(false)}
                >
                  <Text style={styles.declineButtonText}>Decline</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => {
                    setIsResponseModalVisible(false);
                    setSelectedInvitation(null);
                    setSelectedChild(null);
                  }}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.acceptButton,
                    !selectedChild && styles.acceptButtonDisabled
                  ]}
                  onPress={() => respondToInvitation(true)}
                  disabled={!selectedChild}
                >
                  <Text style={styles.acceptButtonText}>Accept</Text>
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
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[700],
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
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
  invitationsList: {
    flex: 1,
  },
  invitationsListContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 12,
    paddingBottom: 20,
  },
  invitationCard: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 12,
    padding: 16,
  },
  invitationCardPending: {
    borderColor: Colors.primary,
    backgroundColor: "rgba(59, 130, 246, 0.1)",
  },
  invitationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  teamInfo: {
    flex: 1,
  },
  teamName: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  coachName: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: "white",
  },
  positionsContainer: {
    marginBottom: 12,
  },
  positionsLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  positionsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  positionChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  positionEmoji: {
    fontSize: 14,
  },
  positionText: {
    fontSize: 12,
    fontWeight: "500",
    color: Colors.textSecondary,
  },
  messageContainer: {
    marginBottom: 12,
  },
  messageLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  messageText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontStyle: "italic",
  },
  invitationFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  dateText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  expiryText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  actionHint: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
  },
  actionHintText: {
    fontSize: 12,
    fontWeight: "500",
    color: Colors.primary,
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
    paddingHorizontal: 40,
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
  invitationSummary: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    alignItems: "center",
  },
  summaryTeam: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  summaryCoach: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  summaryPositions: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: "500",
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  childrenList: {
    maxHeight: 200,
    marginBottom: 24,
  },
  childOption: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  childOptionSelected: {
    borderColor: Colors.success,
    backgroundColor: "rgba(34, 197, 94, 0.1)",
  },
  childInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  childAvatar: {
    width: 32,
    height: 32,
    backgroundColor: Colors.gray[600],
    borderRadius: 16,
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
  childAge: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
  },
  declineButton: {
    flex: 1,
    backgroundColor: Colors.danger,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: Colors.gray[600],
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  acceptButton: {
    flex: 1,
    backgroundColor: Colors.success,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  acceptButtonDisabled: {
    backgroundColor: Colors.gray[600],
    opacity: 0.5,
  },
  declineButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.textSecondary,
  },
  acceptButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
});