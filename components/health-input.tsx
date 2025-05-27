"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { X, Calendar, Activity } from "lucide-react"

interface HealthInputProps {
  onClose: () => void
  onSave: () => void
}

export function HealthInput({ onClose, onSave }: HealthInputProps) {
  const [menstrualPhase, setMenstrualPhase] = useState("")
  const [flexibility, setFlexibility] = useState([5])
  const [energy, setEnergy] = useState([7])
  const [sleep, setSleep] = useState([8])

  const handleSave = () => {
    // Save health data
    onSave()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-900">Monthly Health Check</h1>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Menstrual Cycle */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Calendar className="w-5 h-5 text-pink-500" />
              Menstrual Cycle Phase
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup value={menstrualPhase} onValueChange={setMenstrualPhase}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="menstrual" id="menstrual" />
                <Label htmlFor="menstrual">Menstrual (Days 1-5)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="follicular" id="follicular" />
                <Label htmlFor="follicular">Follicular (Days 6-14)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="ovulation" id="ovulation" />
                <Label htmlFor="ovulation">Ovulation (Days 15-17)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="luteal" id="luteal" />
                <Label htmlFor="luteal">Luteal (Days 18-28)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="na" id="na" />
                <Label htmlFor="na">Not Applicable</Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Flexibility */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Activity className="w-5 h-5 text-blue-500" />
              Perceived Flexibility
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Very Tight</span>
                <span>Very Flexible</span>
              </div>
              <Slider value={flexibility} onValueChange={setFlexibility} max={10} min={1} step={1} className="w-full" />
              <div className="text-center text-sm font-medium">{flexibility[0]}/10</div>
            </div>
          </CardContent>
        </Card>

        {/* Energy Level */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Energy Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Very Low</span>
                <span>Very High</span>
              </div>
              <Slider value={energy} onValueChange={setEnergy} max={10} min={1} step={1} className="w-full" />
              <div className="text-center text-sm font-medium">{energy[0]}/10</div>
            </div>
          </CardContent>
        </Card>

        {/* Sleep Quality */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Sleep Quality (Last Night)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Very Poor</span>
                <span>Excellent</span>
              </div>
              <Slider value={sleep} onValueChange={setSleep} max={10} min={1} step={1} className="w-full" />
              <div className="text-center text-sm font-medium">{sleep[0]}/10</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Save Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <Button onClick={handleSave} className="w-full">
          Save Health Data
        </Button>
      </div>
    </div>
  )
}
