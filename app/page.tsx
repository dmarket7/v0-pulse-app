"use client"

import { useState } from "react"
import { WelcomeScreen } from "@/components/welcome-screen"
import { FamilyDashboard } from "@/components/family-dashboard"
import { DailyRecommendation } from "@/components/daily-recommendation"
import { CoachRoster } from "@/components/coach-roster"
import { HealthInput } from "@/components/health-input"
import { Calendar } from "@/components/calendar"
import { Settings } from "@/components/settings"

export default function PulseApp() {
  const [currentScreen, setCurrentScreen] = useState("welcome")
  const [userRole, setUserRole] = useState<"parent" | "coach">("parent")
  const [selectedChild, setSelectedChild] = useState<string | null>(null)

  const handleLogin = (role: "parent" | "coach") => {
    setUserRole(role)
    if (role === "parent") {
      setCurrentScreen("dashboard")
    } else {
      setCurrentScreen("roster")
    }
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case "welcome":
        return <WelcomeScreen onLogin={handleLogin} />
      case "dashboard":
        return (
          <FamilyDashboard
            onChildSelect={(childId) => {
              setSelectedChild(childId)
              setCurrentScreen("recommendation")
            }}
            onNavigate={setCurrentScreen}
          />
        )
      case "recommendation":
        return (
          <DailyRecommendation
            childId={selectedChild}
            onNavigate={setCurrentScreen}
            onBack={() => setCurrentScreen("dashboard")}
          />
        )
      case "roster":
        return <CoachRoster onNavigate={setCurrentScreen} />
      case "health":
        return (
          <HealthInput onClose={() => setCurrentScreen("dashboard")} onSave={() => setCurrentScreen("dashboard")} />
        )
      case "calendar":
        return <Calendar onNavigate={setCurrentScreen} />
      case "settings":
        return <Settings onNavigate={setCurrentScreen} />
      default:
        return <WelcomeScreen onLogin={handleLogin} />
    }
  }

  return <div className="min-h-screen bg-gray-50">{renderScreen()}</div>
}
