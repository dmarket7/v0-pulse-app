"use client";

import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import type { StackNavigationProp } from "@react-navigation/stack";
import type { RootStackParamList } from "../../App";
import { Logo } from "../components/Logo";
import { Colors } from "../constants/colors";

const { width, height } = Dimensions.get('window');

type WelcomeScreenNavigationProp = StackNavigationProp<RootStackParamList, "Welcome">;

interface Props {
  navigation: WelcomeScreenNavigationProp;
}

export function WelcomeScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  // Animation values
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoRotation = useRef(new Animated.Value(0)).current;
  const pulseScale = useRef(new Animated.Value(1)).current;
  const fadeIn = useRef(new Animated.Value(0)).current;
  const ballBounce = useRef(new Animated.Value(0)).current;
  const splashOpacity = useRef(new Animated.Value(1)).current;
  const welcomeOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start splash animations
    const startAnimations = () => {
      // Logo entrance with scale only (no rotation)
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(fadeIn, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start();

      // Gentle pulse animation for logo
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseScale, {
            toValue: 1.05,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseScale, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      );
      pulseAnimation.start();

      // Circular motion for background elements
      const circularAnimation = Animated.loop(
        Animated.timing(logoRotation, {
          toValue: 1,
          duration: 8000,
          useNativeDriver: true,
        })
      );
      circularAnimation.start();

      // Floating animation for soccer balls
      const floatAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(ballBounce, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: true,
          }),
          Animated.timing(ballBounce, {
            toValue: 0,
            duration: 3000,
            useNativeDriver: true,
          }),
        ])
      );
      floatAnimation.start();

      // Transition to welcome screen after 5 seconds
      setTimeout(() => {
        // Fade out splash and fade in welcome screen simultaneously
        Animated.parallel([
          Animated.timing(splashOpacity, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(welcomeOpacity, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ]).start(() => {
          setShowSplash(false);
        });
      }, 3000);
    };

    startAnimations();
  }, []);

  const handleLogin = (role: "parent" | "coach") => {
    if (role === "parent") {
      navigation.navigate("FamilyDashboard", { userRole: role });
    } else {
      navigation.navigate("CoachRoster");
    }
  };

  // Interpolations for background animations
  const circularRotation = logoRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const floatY = ballBounce.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -30],
  });

  const floatX = ballBounce.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 20],
  });

  if (showSplash) {
    return (
      <Animated.View style={[styles.splashContainer, { opacity: splashOpacity }]}>
        <LinearGradient
          colors={[Colors.background, Colors.backgroundLight, Colors.primary]}
          style={styles.splashGradient}
        >
          <SafeAreaView style={styles.splashSafeArea}>
            {/* Animated background elements */}
            <View style={styles.backgroundElements}>
              {/* Orbiting circles */}
              <Animated.View
                style={[
                  styles.orbitingElement,
                  styles.orbit1,
                  { transform: [{ rotate: circularRotation }] }
                ]}
              >
                <View style={styles.orbitDot} />
              </Animated.View>
              <Animated.View
                style={[
                  styles.orbitingElement,
                  styles.orbit2,
                  { transform: [{ rotate: circularRotation }] }
                ]}
              >
                <View style={[styles.orbitDot, styles.orbitDot2]} />
              </Animated.View>
              <Animated.View
                style={[
                  styles.orbitingElement,
                  styles.orbit3,
                  { transform: [{ rotate: circularRotation }] }
                ]}
              >
                <View style={[styles.orbitDot, styles.orbitDot3]} />
              </Animated.View>

              {/* Floating soccer balls */}
              <Animated.View
                style={[
                  styles.soccerBall,
                  styles.ball1,
                  {
                    transform: [
                      { translateY: floatY },
                      { translateX: floatX }
                    ]
                  }
                ]}
              >
                <Ionicons name="football" size={40} color="rgba(244, 114, 182, 0.3)" />
              </Animated.View>
              <Animated.View
                style={[
                  styles.soccerBall,
                  styles.ball2,
                  {
                    transform: [
                      { translateY: Animated.multiply(floatY, -1) },
                      { translateX: Animated.multiply(floatX, -0.5) }
                    ]
                  }
                ]}
              >
                <Ionicons name="football" size={35} color="rgba(244, 114, 182, 0.25)" />
              </Animated.View>
              <Animated.View
                style={[
                  styles.soccerBall,
                  styles.ball3,
                  {
                    transform: [
                      { translateY: Animated.multiply(floatY, 0.7) },
                      { translateX: Animated.multiply(floatX, -0.8) }
                    ]
                  }
                ]}
              >
                <Ionicons name="football" size={45} color="rgba(244, 114, 182, 0.35)" />
              </Animated.View>

              {/* Floating particles */}
              <Animated.View
                style={[
                  styles.particle,
                  styles.particle1,
                  { transform: [{ translateY: Animated.multiply(floatY, -0.3) }] }
                ]}
              />
              <Animated.View
                style={[
                  styles.particle,
                  styles.particle2,
                  { transform: [{ translateY: Animated.multiply(floatY, 0.5) }] }
                ]}
              />
              <Animated.View
                style={[
                  styles.particle,
                  styles.particle3,
                  { transform: [{ translateY: Animated.multiply(floatY, -0.8) }] }
                ]}
              />
            </View>

            {/* Main logo - stationary and large */}
            <View style={styles.splashContent}>
              <Animated.View
                style={[
                  styles.logoWrapper,
                  {
                    transform: [
                      { scale: Animated.multiply(logoScale, pulseScale) },
                    ],
                  },
                ]}
              >
                <Logo size="xlarge" showText={false} variant="light" />
              </Animated.View>

              <Animated.View style={[styles.textContainer, { opacity: fadeIn }]}>
                <Text style={styles.splashTitle}>PULSE</Text>
                <Text style={styles.splashSubtitle}>Youth Athlete Wellness</Text>
                <View style={styles.loadingDots}>
                  <Animated.View style={[styles.dot, { opacity: pulseScale }]} />
                  <Animated.View style={[styles.dot, { opacity: pulseScale }]} />
                  <Animated.View style={[styles.dot, { opacity: pulseScale }]} />
                </View>
              </Animated.View>
            </View>

            {/* Motivational text */}
            <Animated.View style={[styles.motivationContainer, { opacity: fadeIn }]}>
              <Text style={styles.motivationText}>⚽ Ready to elevate your game? ⚽</Text>
            </Animated.View>
          </SafeAreaView>
        </LinearGradient>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={[styles.container, { opacity: welcomeOpacity }]}>
      <LinearGradient colors={[Colors.background, Colors.backgroundLight, Colors.primary]} style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardView}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
              {/* Logo */}
              <View style={styles.logoContainer}>
                <Logo size="large" showText={true} variant="light" />
                <Text style={styles.logoSubtitle}>
                  {isSignUp ? "Your Family's Athletic Wellness Hub" : "Youth Athlete Wellness, Simplified."}
                </Text>
              </View>

              {/* Form */}
              <View style={styles.formContainer}>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Email Address</Text>
                  <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="you@example.com"
                    placeholderTextColor="rgba(255, 255, 255, 0.6)"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Password</Text>
                  <TextInput
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="••••••••"
                    placeholderTextColor="rgba(255, 255, 255, 0.6)"
                    secureTextEntry
                  />
                </View>

                <TouchableOpacity
                  style={[styles.loginButton, { backgroundColor: Colors.primary }]}
                  onPress={() => handleLogin("parent")}
                >
                  <Text style={styles.loginButtonText}>{isSignUp ? "Sign Up" : "Log In"}</Text>
                </TouchableOpacity>

                {!isSignUp && (
                  <TouchableOpacity style={styles.forgotPassword}>
                    <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                  </TouchableOpacity>
                )}

                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>Or continue with</Text>
                  <View style={styles.dividerLine} />
                </View>

                <TouchableOpacity style={styles.googleButton}>
                  <Ionicons name="logo-google" size={20} color="white" />
                  <Text style={styles.googleButtonText}>Continue with Google</Text>
                </TouchableOpacity>

                <View style={styles.signUpContainer}>
                  <Text style={styles.signUpText}>
                    {isSignUp ? "Already have an account? " : "Don't have an account? "}
                  </Text>
                  <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
                    <Text style={styles.signUpLink}>{isSignUp ? "Log In" : "Sign Up"}</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.coachLogin} onPress={() => handleLogin("coach")}>
                  <Text style={styles.coachLoginText}>Coach Login</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  // Splash screen styles
  splashContainer: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  splashGradient: {
    flex: 1,
  },
  splashSafeArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundElements: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  soccerBall: {
    position: 'absolute',
  },
  ball1: {
    top: '20%',
    left: '10%',
  },
  ball2: {
    top: '60%',
    right: '15%',
  },
  ball3: {
    top: '40%',
    left: '80%',
  },
  splashContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoWrapper: {
    marginBottom: 40,
    width: width * 0.8,
    height: width * 0.8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    alignItems: 'center',
  },
  splashTitle: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
    letterSpacing: 4,
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  splashSubtitle: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 30,
    textAlign: 'center',
  },
  loadingDots: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'white',
  },
  motivationContainer: {
    position: 'absolute',
    bottom: 100,
  },
  motivationText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    fontWeight: '500',
  },

  // Existing styles
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 48,
  },
  logoIcon: {
    width: 64,
    height: 64,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    position: "relative",
  },
  pulseIcon: {
    position: "absolute",
    top: -4,
    right: -4,
  },
  logoTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
  },
  logoSubtitle: {
    fontSize: 18,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
  },
  formContainer: {
    gap: 16,
  },
  inputContainer: {
    gap: 4,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.9)",
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "white",
  },
  loginButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
  },
  loginButtonText: {
    color: "#3B82F6",
    fontSize: 16,
    fontWeight: "600",
  },
  forgotPassword: {
    alignItems: "center",
  },
  forgotPasswordText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  dividerText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14,
    paddingHorizontal: 8,
  },
  googleButton: {
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  googleButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
  },
  signUpText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14,
  },
  signUpLink: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  coachLogin: {
    alignItems: "center",
    marginTop: 16,
  },
  coachLoginText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14,
    textDecorationLine: "underline",
  },
  // Orbiting elements styles
  orbitingElement: {
    position: 'absolute',
    width: 200,
    height: 200,
    top: '50%',
    left: '50%',
    marginTop: -100,
    marginLeft: -100,
  },
  orbit1: {
    width: 300,
    height: 300,
    marginTop: -150,
    marginLeft: -150,
  },
  orbit2: {
    width: 400,
    height: 400,
    marginTop: -200,
    marginLeft: -200,
  },
  orbit3: {
    width: 500,
    height: 500,
    marginTop: -250,
    marginLeft: -250,
  },
  orbitDot: {
    position: 'absolute',
    top: 0,
    left: '50%',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(244, 114, 182, 0.4)',
    marginLeft: -4,
  },
  orbitDot2: {
    backgroundColor: 'rgba(244, 114, 182, 0.3)',
    width: 6,
    height: 6,
    borderRadius: 3,
    marginLeft: -3,
  },
  orbitDot3: {
    backgroundColor: 'rgba(244, 114, 182, 0.5)',
    width: 10,
    height: 10,
    borderRadius: 5,
    marginLeft: -5,
  },
  // Particle styles
  particle: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(244, 114, 182, 0.6)',
  },
  particle1: {
    top: '25%',
    left: '20%',
  },
  particle2: {
    top: '70%',
    right: '25%',
  },
  particle3: {
    top: '45%',
    left: '85%',
  },
});
