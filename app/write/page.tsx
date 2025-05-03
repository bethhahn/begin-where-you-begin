"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Timer } from "@/components/timer"
import { useToast } from "@/hooks/use-toast"

// Add a type declaration for the global function
declare global {
  interface Window {
    playBirdsong?: () => Promise<void>
  }
}

export default function WritePage() {
  const searchParams = useSearchParams()
  const encodedSentence = searchParams.get("sentence")
  const sentence = encodedSentence ? decodeURIComponent(encodedSentence) : ""

  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [isTimerComplete, setIsTimerComplete] = useState(false)
  const [writing, setWriting] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { toast } = useToast()
  const router = useRouter()

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
        console.error("Error playing birdsong in write page:", err)
        // Show a toast notification if the audio fails to play
        toast({
          title: "Audio Error",
          description: "Could not play the completion sound. Please try again.",
          variant: "destructive",
        })
      })
    }
  }

  // Unlock audio for iOS in handleStartWriting
  const handleStartWriting = () => {
    if (audioRef.current) {
      audioRef.current.play().then(() => {
        audioRef.current!.pause()
        audioRef.current!.currentTime = 0
      })
    }
    setIsTimerRunning(true)
    // Focus the textarea when the timer starts
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus()
      }
    }, 100)
  }

  const handleSave = () => {
    // In a real app, this would save to a database or file
    // For now, we'll simulate saving by offering a download
    const blob = new Blob([writing], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "free-writing.txt"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Success!",
      description: "Your free write has been saved successfully.",
      duration: 3000,
    })

    // Navigate to the reflection page
    const encodedWriting = encodeURIComponent(writing)
    const encodedSentence = searchParams.get("sentence") || ""
    router.push(`/reflect?writing=${encodedWriting}&sentence=${encodedSentence}`)
  }

  const handleNewSession = () => {
    window.location.href = "/"
  }

  return (
    <div className="container max-w-2xl mx-auto py-12 px-4 bg-white text-[#747895] min-h-screen">
      <Card className="p-6 bg-[#ecedf5] rounded-lg border border-[#747895]/20">
        <div className="space-y-6">
          <h1 className="text-2xl font-bold text-center text-[#747895]">Free Write</h1>

          <div className="p-4 bg-white rounded-lg text-center border border-[#747895]/20">
            <p className="text-lg italic text-[#747895]">{sentence}</p>
          </div>

          {!isTimerRunning && !isTimerComplete && (
            <div className="space-y-4 text-center">
              <p className="text-[#747895]">
                Directions: Free write for eight minutes based on the sentence above. Don't worry about grammar,
                spelling, or structure - just let your thoughts flow.
              </p>
              <Button 
                onClick={handleStartWriting}
                className="meditation-button"
              >
                Begin Free Write
              </Button>
            </div>
          )}

          {isTimerRunning && (
            <div className="space-y-4">
              <div className="flex justify-center mb-4 w-full max-w-md mx-auto">
                <Timer duration={8 * 60} onComplete={handleTimerComplete} className="w-full" />
              </div>

              <Textarea
                ref={textareaRef}
                value={writing}
                onChange={(e) => setWriting(e.target.value)}
                placeholder="Start writing your thoughts here..."
                className="min-h-[300px] p-4 bg-white border-[#747895]/20 text-[#747895] focus:border-[#747895]/40 focus:ring-[#747895]/30"
                disabled={isTimerComplete && !writing}
              />
            </div>
          )}

          {isTimerComplete && (
            <div className="flex flex-wrap gap-4 justify-center">
              <Button 
                onClick={handleSave} 
                disabled={!writing.trim()}
                className="meditation-button"
              >
                Save Your Writing
              </Button>
              <Button 
                variant="outline" 
                onClick={handleNewSession}
                className="border-[#747895]/20 text-[#747895] hover:bg-white transition-colors duration-300"
              >
                Start New Session
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
