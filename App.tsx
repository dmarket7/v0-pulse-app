import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import { WelcomeScreen } from "./src/screens/WelcomeScreen";
import { LoginScreen } from "./src/screens/LoginScreen";
import { FamilyDashboard } from "./src/screens/FamilyDashboard";
import { DailyRecommendation } from "./src/screens/DailyRecommendation";
import { CoachRoster } from "./src/screens/CoachRoster";
import { HealthInput } from "./src/screens/HealthInput";
import { CalendarScreen } from "./src/screens/CalendarScreen";
import { Settings } from "./src/screens/Settings";
import { HealthTipsScreen } from "./src/screens/HealthTipsScreen";
import { TrainingGuidelinesScreen } from "./src/screens/TrainingGuidelinesScreen";
import { ReadinessCheckScreen } from "./src/screens/ReadinessCheckScreen";
import { AuthProvider, useAuth } from "./src/contexts/AuthContext";
import { LoadingScreen } from "./src/components/LoadingScreen";

export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  FamilyDashboard: { userRole: "parent" | "coach"; };
  DailyRecommendation: { childId: string; childName: string; };
  CoachRoster: undefined;
  HealthInput: { childId: string; };
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
        initialRouteName={isAuthenticated ? "FamilyDashboard" : "Welcome"}
        screenOptions={{
          headerShown: false,
        }}
      >
        {isAuthenticated ? (
          // Authenticated screens
          <>
            <Stack.Screen
              name="FamilyDashboard"
              component={FamilyDashboard}
              initialParams={{ userRole: "parent" }}
            />
            <Stack.Screen name="DailyRecommendation" component={DailyRecommendation} />
            <Stack.Screen name="CoachRoster" component={CoachRoster} />
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
