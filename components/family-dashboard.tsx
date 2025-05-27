"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Activity, Calendar, Settings, Plus } from "lucide-react"

interface Child {
  id: string
  name: string
  age: number
  status: "optimal" | "caution" | "rest"
  lastActivity: string
  avatar: string
}

interface FamilyDashboardProps {
  onChildSelect: (childId: string) => void
  onNavigate: (screen: string) => void
}

const children: Child[] = [
  {
    id: "1",
    name: "Liam",
    age: 14,
    status: "optimal",
    lastActivity: "Soccer practice",
    avatar: "👦",
  },
  {
    id: "2",
    name: "Emma",
    age: 12,
    status: "caution",
    lastActivity: "Basketball training",
    avatar: "👧",
  },
  {
    id: "3",
    name: "Noah",
    age: 16,
    status: "rest",
    lastActivity: "Track & field",
    avatar: "🧑",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "optimal":
      return "bg-green-500"
    case "caution":
      return "bg-yellow-500"
    case "rest":
      return "bg-red-500"
    default:
      return "bg-gray-500"
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case "optimal":
      return "Ready to Play"
    case "caution":
      return "Monitor Closely"
    case "rest":
      return "Rest Day"
    default:
      return "Unknown"
  }
}

export function FamilyDashboard({ onChildSelect, onNavigate }: FamilyDashboardProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600">
      {/* Header */}
      <div className="flex items-center justify-between p-6 pt-12">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-white fill-white" />
            </div>
            <h1 className="text-xl font-bold text-white">Pulse</h1>
          </div>
          <p className="text-white/80 text-sm">Family Dashboard</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onNavigate("settings")}
          className="text-white hover:bg-white/10"
        >
          <Settings className="w-6 h-6" />
        </Button>
      </div>

      {/* Children Cards */}
      <div className="px-6 space-y-4">
        {children.map((child) => (
          <Card
            key={child.id}
            className="bg-white/10 backdrop-blur-sm border-white/20 cursor-pointer hover:bg-white/20 transition-colors"
            onClick={() => onChildSelect(child.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-xl">
                    {child.avatar}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{child.name}</h3>
                    <p className="text-white/70 text-sm">Age {child.age}</p>
                    <p className="text-white/60 text-xs">{child.lastActivity}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={`${getStatusColor(child.status)} text-white border-0 mb-2`}>
                    {getStatusText(child.status)}
                  </Badge>
                  <div className={`w-4 h-4 rounded-full ${getStatusColor(child.status)} ml-auto`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Add Child Card */}
        <Card className="bg-white/5 backdrop-blur-sm border-white/20 border-dashed cursor-pointer hover:bg-white/10 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-center justify-center gap-3 text-white/70">
              <Plus className="w-6 h-6" />
              <span>Add Child</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/10 backdrop-blur-sm border-t border-white/20">
        <div className="flex justify-around py-3">
          <Button variant="ghost" size="sm" className="flex flex-col items-center gap-1 text-white hover:bg-white/10">
            <Activity className="w-5 h-5" />
            <span className="text-xs">Activity</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate("calendar")}
            className="flex flex-col items-center gap-1 text-white hover:bg-white/10"
          >
            <Calendar className="w-5 h-5" />
            <span className="text-xs">Schedule</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate("health")}
            className="flex flex-col items-center gap-1 text-white hover:bg-white/10"
          >
            <Heart className="w-5 h-5" />
            <span className="text-xs">Health Log</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
