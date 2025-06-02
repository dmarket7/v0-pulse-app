import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
  SafeAreaView,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/colors';
import { useAuth } from '../contexts/AuthContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const MENU_WIDTH = SCREEN_WIDTH * 0.8;

interface NavigationItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  onPress: () => void;
}

interface NavigationMenuProps {
  isVisible: boolean;
  onClose: () => void;
  navigationItems: NavigationItem[];
  userRole: 'parent' | 'coach' | 'child';
}

export function NavigationMenu({ isVisible, onClose, navigationItems, userRole }: NavigationMenuProps) {
  const { user, signOut } = useAuth();
  const slideAnim = React.useRef(new Animated.Value(MENU_WIDTH)).current;

  React.useEffect(() => {
    if (isVisible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: MENU_WIDTH,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible, slideAnim]);

  const handleItemPress = (onPress: () => void) => {
    onPress();
    onClose();
  };

  const handleSignOut = async () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: async () => {
            try {
              onClose(); // Close the menu first
              await signOut();
            } catch (error) {
              console.error('Sign out error:', error);
              Alert.alert("Error", "Failed to sign out. Please try again.");
            }
          },
        },
      ]
    );
  };

  // Get role-appropriate display text
  const getRoleDisplayText = () => {
    if (userRole === 'child') return 'player';
    return userRole; // 'parent' or 'coach' stay as is
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} onPress={onClose} />
        <Animated.View
          style={[
            styles.menuContainer,
            {
              transform: [{ translateX: slideAnim }],
            },
          ]}
        >
          <LinearGradient
            colors={[Colors.background, Colors.backgroundLight]}
            style={styles.menuContent}
          >
            <SafeAreaView style={styles.safeArea}>
              {/* Header */}
              <View style={styles.header}>
                <View style={styles.headerTop}>
                  <Text style={styles.appName}>Pulse</Text>
                  <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                    <Ionicons name="close" size={24} color={Colors.textPrimary} />
                  </TouchableOpacity>
                </View>

                <View style={styles.userInfo}>
                  <View style={styles.avatarContainer}>
                    <Ionicons
                      name={userRole === 'coach' ? 'people' : userRole === 'parent' ? 'person' : 'school'}
                      size={24}
                      color="white"
                    />
                  </View>
                  <View style={styles.userDetails}>
                    {user?.email && (
                      <Text style={styles.userEmail}>{user.email}</Text>
                    )}
                    <View style={[styles.roleBadge, { backgroundColor: userRole === 'coach' ? Colors.secondary : userRole === 'parent' ? Colors.primary : Colors.accent }]}>
                      <Text style={styles.roleText}>{getRoleDisplayText()}</Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Navigation Items */}
              <ScrollView
                style={styles.navigationItems}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.navigationItemsContent}
              >
                {navigationItems.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.navItem}
                    onPress={() => handleItemPress(item.onPress)}
                  >
                    <View style={styles.navItemContent}>
                      <View style={[styles.navIcon, { backgroundColor: item.color }]}>
                        <Ionicons name={item.icon as any} size={18} color="white" />
                      </View>
                      <View style={styles.navTextContainer}>
                        <Text style={styles.navTitle}>{item.title}</Text>
                        <Text style={styles.navDescription}>{item.description}</Text>
                      </View>
                    </View>
                    <Ionicons name="chevron-forward" size={14} color={Colors.textSecondary} />
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Footer */}
              <View style={styles.footer}>
                <View style={styles.footerDivider} />

                {/* Logout Button */}
                <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
                  <View style={styles.logoutContent}>
                    <View style={[styles.logoutIcon, { backgroundColor: Colors.danger }]}>
                      <Ionicons name="log-out-outline" size={20} color="white" />
                    </View>
                    <Text style={styles.logoutText}>Sign Out</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color={Colors.textSecondary} />
                </TouchableOpacity>

                <View style={styles.footerDivider} />
                {/* <Text style={styles.footerText}>
                  {userRole === 'coach' ? 'Coach Dashboard' : 'Family Dashboard'}
                </Text>
                <Text style={styles.versionText}>Version 1.0.0</Text> */}
              </View>
            </SafeAreaView>
          </LinearGradient>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  backdrop: {
    flex: 1,
  },
  menuContainer: {
    width: MENU_WIDTH,
    height: '100%',
  },
  menuContent: {
    flex: 1,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    overflow: 'hidden',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  closeButton: {
    padding: 4,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userDetails: {
    flex: 1,
    gap: 4,
  },
  userEmail: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  roleBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
    textTransform: 'capitalize',
  },
  navigationItems: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  navigationItemsContent: {
    paddingBottom: 20,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginBottom: 6,
  },
  navItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 10,
  },
  navIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navTextContainer: {
    flex: 1,
    gap: 1,
  },
  navTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  navDescription: {
    fontSize: 11,
    color: Colors.textSecondary,
    lineHeight: 14,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 20,
    paddingTop: 16,
  },
  footerDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 16,
  },
  footerText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 4,
  },
  versionText: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    opacity: 0.7,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginBottom: 6,
  },
  logoutContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 10,
  },
  logoutIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
});