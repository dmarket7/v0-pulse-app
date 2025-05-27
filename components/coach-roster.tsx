"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Search, Filter } from "lucide-react"

interface Player {
  id: string
  name: string
  position: string
  status: "optimal" | "caution" | "rest"
  avatar: string
}

interface CoachRosterProps {
  onNavigate: (screen: string) => void
}

const players: Player[] = [
  { id: "1", name: "Alex Johnson", position: "Forward", status: "optimal", avatar: "⚽" },
  { id: "2", name: "Sarah Chen", position: "Midfielder", status: "caution", avatar: "🏃‍♀️" },
  { id: "3", name: "Marcus Williams", position: "Defender", status: "rest", avatar: "🛡️" },
  { id: "4", name: "Emma Davis", position: "Goalkeeper", status: "optimal", avatar: "🥅" },
  { id: "5", name: "Tyler Brown", position: "Forward", status: "optimal", avatar: "⚽" },
  { id: "6", name: "Zoe Martinez", position: "Midfielder", status: "caution", avatar: "🏃‍♀️" },
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
      return "Optimal"
    case "caution":
      return "Caution"
    case "rest":
      return "Rest"
    default:
      return "Unknown"
  }
}

export function CoachRoster({ onNavigate }: CoachRosterProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")

  const filteredPlayers = players.filter((player) => {
    const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = selectedFilter === "all" || player.status === selectedFilter
    return matchesSearch && matchesFilter
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => onNavigate("welcome")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="font-semibold text-gray-900">Team Readiness</h1>
              <p className="text-sm text-gray-500">U-15 Soccer Team</p>
            </div>
          </div>
          <Button variant="ghost" size="icon">
            <Filter className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search players..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="px-4 mb-4">
        <div className="flex gap-2">
          {["all", "optimal", "caution", "rest"].map((filter) => (
            <Button
              key={filter}
              variant={selectedFilter === filter ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedFilter(filter)}
              className="capitalize"
            >
              {filter}
            </Button>
          ))}
        </div>
      </div>

      {/* Player List */}
      <div className="px-4 space-y-3">
        {filteredPlayers.map((player) => (
          <Card key={player.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-lg">{player.avatar}</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{player.name}</h3>
                    <p className="text-sm text-gray-500">{player.position}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={`${getStatusColor(player.status)} text-white border-0`}>
                    {getStatusText(player.status)}
                  </Badge>
                  <div className={`w-4 h-4 rounded-full ${getStatusColor(player.status)}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="flex justify-around text-center">
          <div>
            <div className="text-lg font-semibold text-green-600">
              {players.filter((p) => p.status === "optimal").length}
            </div>
            <div className="text-xs text-gray-500">Ready</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-yellow-600">
              {players.filter((p) => p.status === "caution").length}
            </div>
            <div className="text-xs text-gray-500">Monitor</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-red-600">
              {players.filter((p) => p.status === "rest").length}
            </div>
            <div className="text-xs text-gray-500">Rest</div>
          </div>
        </div>
      </div>
    </div>
  )
}
