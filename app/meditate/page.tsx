"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Timer } from "@/components/timer"

// Add a type declaration for the global function
declare global {
  interface Window {
    playBirdsong?: () => Promise<void>
  }
}

export default function MeditatePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const encodedSentence = searchParams.get("sentence")
  const sentence = encodedSentence ? decodeURIComponent(encodedSentence) : ""

  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [isTimerComplete, setIsTimerComplete] = useState(false)

  // Add this audioRef and useEffect for iPhone audio unlock
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio("/birdsong.mp3")
    }
    window.playBirdsong = async () => {
      if (audioRef.current) {
        await audioRef.current.play()
      }
    }
  }, [])

  const handleTimerComplete = () => {
    setIsTimerComplete(true)

    // Play the birdsong using the global function
    if (typeof window !== "undefined" && window.playBirdsong) {
      window.playBirdsong().catch((err) => {
        console.log("Error playing birdsong in meditate page:", err)
      })
    }
  }

  // Unlock audio for iOS and start timer
  const handleStartMeditation = () => {
    if (audioRef.current) {
      audioRef.current.play().then(() => {
        audioRef.current!.pause()
        audioRef.current!.currentTime = 0
      })
    }
    setIsTimerRunning(true)
  }

  const handleContinue = () => {
    router.push(`/write?sentence=${encodedSentence}`)
  }

  return (
    <div className={`container max-w-2xl mx-auto py-12 px-4 min-h-screen ${isTimerComplete ? 'meditation-complete' : 'bg-gradient-to-b from-[#faf6f2] to-white'}`}>
      <Card className="meditation-card fade-in">
        <div className="space-y-8 text-center">
          <h1 className="text-3xl font-light mb-6 text-[#747895]">Meditate</h1>

          <div className="p-8 bg-white/50 backdrop-blur-sm rounded-xl border border-[#747895]/10 float-subtle">
            <p className="text-xl italic text-[#747895]">{sentence}</p>
          </div>

          {!isTimerRunning && !isTimerComplete && (
            <div className="space-y-6 slide-up">
              <p className="text-lg text-[#747895]/80">When you're ready, press the button below to begin your 3-minute meditation on this sentence.</p>
              <Button 
                onClick={handleStartMeditation}
                className="meditation-button"
              >
                Begin Meditation
              </Button>
            </div>
          )}

          {isTimerRunning && !isTimerComplete && (
            <div className="space-y-6 fade-in">
              <Timer duration={3 * 60} onComplete={handleTimerComplete} className="mx-auto" />
            </div>
          )}

          {isTimerComplete && (
            <div className="space-y-6 fade-in">
              <p className="text-lg text-[#747895]/80">Your meditation is complete.</p>
              <Button 
                onClick={handleContinue}
                className="meditation-button"
              >
                Continue to Free Write
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
