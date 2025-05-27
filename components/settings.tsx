"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, User, Bell, Shield, Smartphone, LogOut, ChevronRight } from "lucide-react"

interface SettingsProps {
  onNavigate: (screen: string) => void
}

export function Settings({ onNavigate }: SettingsProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => onNavigate("dashboard")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold text-gray-900">Settings</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Profile Section */}
        <div>
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Profile</h2>
          <Card>
            <CardContent className="p-0">
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <span className="font-medium">Family Account</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-gray-400" />
                  <span className="font-medium">Privacy & Security</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Integrations Section */}
        <div>
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Data Integrations</h2>
          <Card>
            <CardContent className="p-0">
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xs font-bold">W</span>
                  </div>
                  <div>
                    <p className="font-medium">Whoop</p>
                    <p className="text-sm text-gray-500">Connected</p>
                  </div>
                </div>
                <Switch checked />
              </div>
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xs font-bold">CP</span>
                  </div>
                  <div>
                    <p className="font-medium">CityPlay Elite</p>
                    <p className="text-sm text-gray-500">Not connected</p>
                  </div>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xs font-bold">+</span>
                  </div>
                  <span className="font-medium">Add Integration</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notifications Section */}
        <div>
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Notifications</h2>
          <Card>
            <CardContent className="p-0">
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-gray-400" />
                  <span className="font-medium">Daily Recommendations</span>
                </div>
                <Switch checked />
              </div>
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-5 h-5 text-gray-400" />
                  <span className="font-medium">Health Check Reminders</span>
                </div>
                <Switch checked />
              </div>
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-gray-400" />
                  <span className="font-medium">Training Alerts</span>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Account Section */}
        <div>
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Account</h2>
          <Card>
            <CardContent className="p-4">
              <Button
                variant="ghost"
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => onNavigate("welcome")}
              >
                <LogOut className="w-5 h-5 mr-3" />
                Sign Out
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
