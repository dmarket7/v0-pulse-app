"use client"

import { useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, FlatList } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import type { StackNavigationProp } from "@react-navigation/stack"
import type { RootStackParamList } from "../../App"
import { Colors } from "../constants/colors"

type CalendarScreenNavigationProp = StackNavigationProp<RootStackParamList, "Calendar">

interface Props {
  navigation: CalendarScreenNavigationProp
}

interface Event {
  id: string
  title: string
  time: string
  type: "practice" | "game" | "training" | "futsal"
  color: string
}

const events: Event[] = [
  { id: "1", title: "Soccer Practice", time: "4:00 PM", type: "practice", color: Colors.primary },
  { id: "2", title: "Train with Craft", time: "7:00 AM", type: "training", color: Colors.success },
  { id: "3", title: "Futsal Session", time: "6:00 PM", type: "futsal", color: Colors.secondary },
  { id: "4", title: "Championship Game", time: "2:00 PM", type: "game", color: Colors.danger },
]

export function CalendarScreen({ navigation }: Props) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()

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
  ]

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const renderCalendarDay = (day: number) => {
    const isToday =
      day === new Date().getDate() &&
      currentDate.getMonth() === new Date().getMonth() &&
      currentDate.getFullYear() === new Date().getFullYear()
    const hasEvents = day === 15 || day === 18 || day === 22 // Mock data

    return (
      <View key={day} style={styles.calendarDay}>
        <View style={[styles.dayNumber, isToday && styles.dayNumberToday]}>
          <Text style={[styles.dayText, isToday && styles.dayTextToday]}>{day}</Text>
        </View>
        {hasEvents && (
          <View style={styles.eventIndicators}>
            <View style={[styles.eventDot, { backgroundColor: "#3B82F6" }]} />
            <View style={[styles.eventDot, { backgroundColor: "#10B981" }]} />
          </View>
        )}
      </View>
    )
  }

  const renderEvent = ({ item }: { item: Event }) => (
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
  )

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Schedule</Text>
        </View>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Calendar Header */}
        <View style={styles.calendarHeader}>
          <TouchableOpacity style={styles.monthNavButton} onPress={() => navigateMonth("prev")}>
            <Ionicons name="chevron-back" size={20} color="#6B7280" />
          </TouchableOpacity>
          <Text style={styles.monthTitle}>
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </Text>
          <TouchableOpacity style={styles.monthNavButton} onPress={() => navigateMonth("next")}>
            <Ionicons name="chevron-forward" size={20} color="#6B7280" />
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
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
  },
  addButton: {
    padding: 8,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
  },
  scrollView: {
    flex: 1,
  },
  calendarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  monthNavButton: {
    padding: 8,
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
  },
  calendarContainer: {
    backgroundColor: "white",
  },
  dayHeaders: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  dayHeader: {
    flex: 1,
    textAlign: "center",
    paddingVertical: 12,
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
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
    borderColor: "#F3F4F6",
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
    color: "#1F2937",
  },
  dayTextToday: {
    color: "white",
  },
  eventIndicators: {
    flexDirection: "row",
    gap: 2,
    marginTop: 4,
  },
  eventDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  eventsSection: {
    padding: 16,
  },
  eventsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 12,
  },
  eventsList: {
    gap: 12,
  },
  eventCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
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
    color: "#1F2937",
  },
  eventTime: {
    fontSize: 14,
    color: "#6B7280",
  },
  eventTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
  },
  eventTypeText: {
    fontSize: 12,
    color: "#6B7280",
    textTransform: "capitalize",
  },
})
