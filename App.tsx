import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import { LoadingScreen } from "./src/components/LoadingScreen";
import { AuthProvider, useAuth } from "./src/contexts/AuthContext";
import { CalendarScreen } from "./src/screens/CalendarScreen";
import { CoachRoster } from "./src/screens/CoachRoster";
import { Dashboard } from "./src/screens/Dashboard";
import { HealthInput } from "./src/screens/HealthInput";
import { HealthTipsScreen } from "./src/screens/HealthTipsScreen";
import { LoginScreen } from "./src/screens/LoginScreen";
import { ReadinessCheckScreen } from "./src/screens/ReadinessCheckScreen";
import { Settings } from "./src/screens/Settings";
import { TeamInvitations } from "./src/screens/TeamInvitations";
import { TrainingGuidelinesScreen } from "./src/screens/TrainingGuidelinesScreen";
import { WelcomeScreen } from "./src/screens/WelcomeScreen";

export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Dashboard: { userRole?: "parent" | "coach" | "child"; };
  CoachRoster: undefined;
  TeamInvitations: undefined;
  HealthInput: undefined;
  Calendar: undefined;
  Settings: undefined;
  HealthTips: undefined;
  TrainingGuidelines: undefined;
  ReadinessCheck: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

function AppNavigator() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator
        initialRouteName={isAuthenticated ? "Dashboard" : "Welcome"}
        screenOptions={{
          headerShown: false,
        }}
      >
        {isAuthenticated ? (
          // Authenticated screens
          <>
            <Stack.Screen
              name="Dashboard"
              component={Dashboard}
            />
            <Stack.Screen name="CoachRoster" component={CoachRoster} />
            <Stack.Screen name="TeamInvitations" component={TeamInvitations} />
            <Stack.Screen name="HealthInput" component={HealthInput} />
            <Stack.Screen name="Calendar" component={CalendarScreen} />
            <Stack.Screen name="Settings" component={Settings} />
          </>
        ) : (
          // Unauthenticated screens
          <>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="HealthTips" component={HealthTipsScreen} />
            <Stack.Screen name="TrainingGuidelines" component={TrainingGuidelinesScreen} />
            <Stack.Screen name="ReadinessCheck" component={ReadinessCheckScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}
