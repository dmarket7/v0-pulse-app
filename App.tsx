import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { StatusBar } from "expo-status-bar"
import { WelcomeScreen } from "./src/screens/WelcomeScreen"
import { FamilyDashboard } from "./src/screens/FamilyDashboard"
import { DailyRecommendation } from "./src/screens/DailyRecommendation"
import { CoachRoster } from "./src/screens/CoachRoster"
import { HealthInput } from "./src/screens/HealthInput"
import { CalendarScreen } from "./src/screens/CalendarScreen"
import { Settings } from "./src/screens/Settings"

export type RootStackParamList = {
  Welcome: undefined
  FamilyDashboard: { userRole: "parent" | "coach" }
  DailyRecommendation: { childId: string; childName: string }
  CoachRoster: undefined
  HealthInput: { childId: string }
  Calendar: undefined
  Settings: undefined
}

const Stack = createStackNavigator<RootStackParamList>()

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="FamilyDashboard" component={FamilyDashboard} />
        <Stack.Screen name="DailyRecommendation" component={DailyRecommendation} />
        <Stack.Screen name="CoachRoster" component={CoachRoster} />
        <Stack.Screen name="HealthInput" component={HealthInput} />
        <Stack.Screen name="Calendar" component={CalendarScreen} />
        <Stack.Screen name="Settings" component={Settings} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
