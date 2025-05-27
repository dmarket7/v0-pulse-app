"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, ChevronLeft, ChevronRight } from "lucide-react"

interface CalendarProps {
  onNavigate: (screen: string) => void
}

interface Event {
  id: string
  title: string
  time: string
  type: "practice" | "game" | "training" | "futsal"
  color: string
}

const events: Event[] = [
  { id: "1", title: "Soccer Practice", time: "4:00 PM", type: "practice", color: "bg-blue-500" },
  { id: "2", title: "Train with Craft", time: "7:00 AM", type: "training", color: "bg-green-500" },
  { id: "3", title: "Futsal Session", time: "6:00 PM", type: "futsal", color: "bg-purple-500" },
  { id: "4", title: "Championship Game", time: "2:00 PM", type: "game", color: "bg-red-500" },
]

export function Calendar({ onNavigate }: CalendarProps) {
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => onNavigate("dashboard")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-lg font-semibold text-gray-900">Schedule</h1>
          </div>
          <Button size="icon" variant="outline">
            <Plus className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Calendar Header */}
      <div className="bg-white px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => navigateMonth("prev")}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-lg font-semibold">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <Button variant="ghost" size="icon" onClick={() => navigateMonth("next")}>
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white">
        {/* Day Headers */}
        <div className="grid grid-cols-7 border-b border-gray-200">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="p-3 text-center text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7">
          {/* Empty cells for days before month starts */}
          {Array.from({ length: firstDayOfMonth }, (_, i) => (
            <div key={`empty-${i}`} className="h-16 border-b border-r border-gray-100" />
          ))}

          {/* Days of the month */}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1
            const isToday =
              day === new Date().getDate() &&
              currentDate.getMonth() === new Date().getMonth() &&
              currentDate.getFullYear() === new Date().getFullYear()
            const hasEvents = day === 15 || day === 18 || day === 22 // Mock data

            return (
              <div key={day} className="h-16 border-b border-r border-gray-100 p-1">
                <div
                  className={`text-sm ${isToday ? "bg-blue-500 text-white" : "text-gray-900"} 
                  ${isToday ? "rounded-full w-6 h-6 flex items-center justify-center" : ""}`}
                >
                  {day}
                </div>
                {hasEvents && (
                  <div className="flex gap-1 mt-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Today's Events */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Today's Schedule</h3>
        <div className="space-y-3">
          {events.slice(0, 2).map((event) => (
            <Card key={event.id}>
              <CardContent className="p-3">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${event.color}`} />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{event.title}</h4>
                    <p className="text-sm text-gray-500">{event.time}</p>
                  </div>
                  <Badge variant="outline" className="capitalize">
                    {event.type}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
