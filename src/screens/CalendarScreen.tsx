"use client";

import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import type { StackNavigationProp } from "@react-navigation/stack";
import type { RootStackParamList } from "../../App";
import { Colors } from "../constants/colors";

type CalendarScreenNavigationProp = StackNavigationProp<RootStackParamList, "Calendar">;

interface Props {
  navigation: CalendarScreenNavigationProp;
}

interface Event {
  id: string;
  title: string;
  time: string;
  type: "practice" | "game" | "training" | "futsal";
  color: string;
}

const events: Event[] = [
  { id: "1", title: "Soccer Practice", time: "4:00 PM", type: "practice", color: Colors.primary },
  { id: "2", title: "Train with Craft", time: "7:00 AM", type: "training", color: Colors.success },
  { id: "3", title: "Futsal Session", time: "6:00 PM", type: "futsal", color: Colors.secondary },
  { id: "4", title: "Championship Game", time: "2:00 PM", type: "game", color: Colors.danger },
];

export function CalendarScreen({ navigation }: Props) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const renderCalendarDay = (day: number) => {
    const isToday =
      day === new Date().getDate() &&
      currentDate.getMonth() === new Date().getMonth() &&
      currentDate.getFullYear() === new Date().getFullYear();
    const hasEvents = day === 15 || day === 18 || day === 22; // Mock data

    return (
      <View key={day} style={styles.calendarDay}>
        <View style={[styles.dayNumber, isToday && styles.dayNumberToday]}>
          <Text style={[styles.dayText, isToday && styles.dayTextToday]}>{day}</Text>
        </View>
        {hasEvents && (
          <View style={styles.eventIndicators}>
            <View style={[styles.eventDot, { backgroundColor: Colors.primary }]} />
            <View style={[styles.eventDot, { backgroundColor: Colors.success }]} />
          </View>
        )}
      </View>
    );
  };

  const renderEvent = ({ item }: { item: Event; }) => (
    <View style={styles.eventCard}>
      <View style={styles.eventHeader}>
        <View style={[styles.eventColorDot, { backgroundColor: item.color }]} />
        <View style={styles.eventInfo}>
          <Text style={styles.eventTitle}>{item.title}</Text>
          <Text style={styles.eventTime}>{item.time}</Text>
        </View>
        <View style={styles.eventTypeBadge}>
          <Text style={styles.eventTypeText}>{item.type}</Text>
        </View>
      </View>
    </View>
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
            <Text style={styles.headerTitle}>Schedule</Text>
          </View>
          <TouchableOpacity style={styles.addButton}>
            <Ionicons name="add" size={20} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Calendar Header */}
          <View style={styles.calendarHeader}>
            <TouchableOpacity style={styles.monthNavButton} onPress={() => navigateMonth("prev")}>
              <Ionicons name="chevron-back" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
            <Text style={styles.monthTitle}>
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </Text>
            <TouchableOpacity style={styles.monthNavButton} onPress={() => navigateMonth("next")}>
              <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Calendar Grid */}
          <View style={styles.calendarContainer}>
            {/* Day Headers */}
            <View style={styles.dayHeaders}>
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <Text key={day} style={styles.dayHeader}>
                  {day}
                </Text>
              ))}
            </View>

            {/* Calendar Days */}
            <View style={styles.calendarGrid}>
              {/* Empty cells for days before month starts */}
              {Array.from({ length: firstDayOfMonth }, (_, i) => (
                <View key={`empty-${i}`} style={styles.calendarDay} />
              ))}

              {/* Days of the month */}
              {Array.from({ length: daysInMonth }, (_, i) => renderCalendarDay(i + 1))}
            </View>
          </View>

          {/* Today's Events */}
          <View style={styles.eventsSection}>
            <Text style={styles.eventsTitle}>Today's Schedule</Text>
            <FlatList
              data={events.slice(0, 2)}
              renderItem={renderEvent}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              contentContainerStyle={styles.eventsList}
            />
          </View>
        </ScrollView>
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
    paddingHorizontal: 24,
    paddingVertical: 16,
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
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.textPrimary,
  },
  addButton: {
    padding: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 8,
  },
  scrollView: {
    flex: 1,
  },
  calendarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    marginHorizontal: 24,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  monthNavButton: {
    padding: 8,
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  calendarContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    marginHorizontal: 24,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 24,
  },
  dayHeaders: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.2)",
  },
  dayHeader: {
    flex: 1,
    textAlign: "center",
    paddingVertical: 12,
    fontSize: 14,
    fontWeight: "500",
    color: Colors.textSecondary,
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  calendarDay: {
    width: "14.28%",
    height: 64,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    padding: 4,
  },
  dayNumber: {
    alignItems: "center",
    justifyContent: "center",
  },
  dayNumberToday: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    width: 24,
    height: 24,
  },
  dayText: {
    fontSize: 14,
    color: Colors.textPrimary,
  },
  dayTextToday: {
    color: Colors.secondary,
  },
  eventIndicators: {
    flexDirection: "row",
    gap: 2,
    marginTop: 4,
    justifyContent: "center",
  },
  eventDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  eventsSection: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  eventsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  eventsList: {
    gap: 12,
  },
  eventCard: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 12,
    padding: 16,
  },
  eventHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  eventColorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  eventInfo: {
    flex: 1,
    gap: 2,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.textPrimary,
  },
  eventTime: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  eventTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 8,
  },
  eventTypeText: {
    fontSize: 12,
    color: Colors.textSecondary,
    textTransform: "capitalize",
  },
});
