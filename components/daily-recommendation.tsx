"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Zap, TrendingUp, Heart, Activity, Calendar } from "lucide-react"

interface DailyRecommendationProps {
  childId: string | null
  onNavigate: (screen: string) => void
  onBack: () => void
}

export function DailyRecommendation({ childId, onNavigate, onBack }: DailyRecommendationProps) {
  const childName = "Liam" // This would come from props/state
  const recommendation = "YES"
  const status = "optimal"

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600">
      {/* Header */}
      <div className="flex items-center justify-between p-6 pt-12">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack} className="text-white hover:bg-white/10">
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div>
            <h1 className="text-lg font-semibold text-white">Pulse</h1>
            <div className="flex items-center gap-2">
              <span className="text-white/80 text-sm">{childName}'s Readiness</span>
              <div className="w-3 h-3 bg-green-500 rounded-full" />
            </div>
          </div>
        </div>
        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
          <span className="text-lg">👦</span>
        </div>
      </div>

      {/* Main Recommendation */}
      <div className="px-6 py-8 text-center">
        <h2 className="text-2xl font-light text-white mb-8">Play Hard Today?</h2>

        <div className="mb-8">
          <div className="w-32 h-32 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <div className="text-center">
              <Zap className="w-8 h-8 text-white mx-auto mb-1 fill-white" />
              <span className="text-3xl font-bold text-white">{recommendation}</span>
            </div>
          </div>
          <p className="text-white/90 text-lg">{childName} is ready for high intensity training.</p>
        </div>

        <Button
          variant="outline"
          onClick={() => {
            /* Link to external app */
          }}
          className="bg-white/10 border-white/30 text-white hover:bg-white/20"
        >
          See Why <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="px-6 space-y-3">
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500/30 rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-medium">Recovery Score</p>
                  <p className="text-white/70 text-sm">From Whoop</p>
                </div>
              </div>
              <Badge className="bg-green-500 text-white border-0">85%</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-500/30 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-medium">Training Load</p>
                  <p className="text-white/70 text-sm">Last 7 days</p>
                </div>
              </div>
              <Badge className="bg-yellow-500 text-white border-0">Moderate</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/10 backdrop-blur-sm border-t border-white/20">
        <div className="flex justify-around py-3">
          <Button variant="ghost" size="sm" className="flex flex-col items-center gap-1 text-white hover:bg-white/10">
            <Activity className="w-5 h-5" />
            <span className="text-xs">Log Activity</span>
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
