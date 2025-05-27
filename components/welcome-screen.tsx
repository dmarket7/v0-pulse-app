"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Heart, Activity } from "lucide-react"

interface WelcomeScreenProps {
  onLogin: (role: "parent" | "coach") => void
}

export function WelcomeScreen({ onLogin }: WelcomeScreenProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSignUp, setIsSignUp] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 flex flex-col">
      <div className="flex-1 flex flex-col justify-center px-6 py-12">
        {/* Logo */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-4">
            <div className="relative">
              <Heart className="w-8 h-8 text-white fill-white" />
              <Activity className="w-4 h-4 text-white absolute -top-1 -right-1" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Pulse</h1>
          <p className="text-white/80 text-lg">
            {isSignUp ? "Your Family's Athletic Wellness Hub" : "Youth Athlete Wellness, Simplified."}
          </p>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-white/90 text-sm font-medium">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20"
            />
          </div>

          <div>
            <Label htmlFor="password" className="text-white/90 text-sm font-medium">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20"
            />
          </div>

          <Button
            onClick={() => onLogin("parent")}
            className="w-full bg-white text-blue-600 hover:bg-white/90 font-semibold py-3 rounded-xl"
          >
            {isSignUp ? "Sign Up" : "Log In"}
          </Button>

          {!isSignUp && (
            <div className="text-center">
              <button className="text-white/80 text-sm hover:text-white">Forgot Password?</button>
            </div>
          )}

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-transparent text-white/80">Or continue with</span>
            </div>
          </div>

          <Button variant="outline" className="w-full bg-gray-800 border-gray-700 text-white hover:bg-gray-700">
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </Button>

          <div className="text-center mt-6">
            <span className="text-white/80 text-sm">
              {isSignUp ? "Already have an account? " : "Don't have an account? "}
            </span>
            <button onClick={() => setIsSignUp(!isSignUp)} className="text-white font-semibold text-sm hover:underline">
              {isSignUp ? "Log In" : "Sign Up"}
            </button>
          </div>

          <div className="text-center mt-4">
            <button onClick={() => onLogin("coach")} className="text-white/80 text-sm hover:text-white underline">
              Coach Login
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
