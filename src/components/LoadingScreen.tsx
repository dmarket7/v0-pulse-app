import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Logo } from './Logo';
import { Colors } from '../constants/colors';

export function LoadingScreen() {
  return (
    <LinearGradient
      colors={[Colors.background, Colors.backgroundLight, Colors.primary]}
      style={styles.container}
    >
      <View style={styles.content}>
        <Logo size="xlarge" />
        <ActivityIndicator
          size="large"
          color={Colors.white}
          style={styles.spinner}
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  spinner: {
    marginTop: 32,
  },
});