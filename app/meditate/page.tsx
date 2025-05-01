"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Timer } from "@/components/timer"

// Add a type declaration for the global function
declare global {
  interface Window {
    playChime?: () => Promise<void>
  }
}

export default function MeditatePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const encodedSentence = searchParams.get("sentence")
  const sentence = encodedSentence ? decodeURIComponent(encodedSentence) : ""

  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [isTimerComplete, setIsTimerComplete] = useState(false)

  const handleTimerComplete = () => {
    setIsTimerComplete(true)

    // Play the chime using the global function
    if (typeof window !== "undefined" && window.playChime) {
      window.playChime().catch((err) => {
        console.log("Error playing chime in meditate page:", err)
      })
    }
  }

  const handleContinue = () => {
    router.push(`/write?sentence=${encodedSentence}`)
  }

  return (
    <div className="container max-w-md mx-auto py-12 px-4 bg-white text-[#411f30] min-h-screen">
      <Card className="p-6 bg-[#ecedf5] shadow-lg rounded-lg border border-[#411f30]">
        <div className="space-y-6 text-center">
          <h1 className="text-2xl font-bold text-[#411f30]">Meditation</h1>

          <div className="p-6 bg-white rounded-lg border border-[#411f30]">
            <p className="text-lg italic text-[#411f30]">{sentence}</p>
          </div>

          {!isTimerRunning && !isTimerComplete && (
            <div className="space-y-4">
              <p className="text-[#411f30]">When you're ready, press the button below to begin your 3-minute meditation on this sentence.</p>
              <Button 
                onClick={() => setIsTimerRunning(true)}
                className="bg-[#411f30] text-[#fdf0e5] hover:bg-[#5a2b42] transition-colors duration-300"
              >
                Begin Meditation
              </Button>
            </div>
          )}

          {isTimerRunning && !isTimerComplete && (
            <div className="space-y-4">
              <p className="text-[#411f30]">Meditate on the sentence above...</p>
              <Timer duration={3 * 60} onComplete={handleTimerComplete} className="mx-auto" />
            </div>
          )}

          {isTimerComplete && (
            <div className="space-y-4">
              <p className="text-[#411f30]">Your meditation is complete.</p>
              <Button 
                onClick={handleContinue}
                className="bg-[#411f30] text-[#fdf0e5] hover:bg-[#5a2b42] transition-colors duration-300"
              >
                Continue to Free Writing
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
