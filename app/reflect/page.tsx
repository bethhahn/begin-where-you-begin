"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Timer } from "@/components/timer"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle, Clock } from "lucide-react"
import Image from "next/image"

// Add a type declaration for the global function
declare global {
  interface Window {
    playBirdsong?: () => Promise<void>
  }
}

export default function ReflectPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const encodedWriting = searchParams.get("writing")
  const encodedSentence = searchParams.get("sentence")

  const writing = encodedWriting ? decodeURIComponent(encodedWriting) : ""
  const sentence = encodedSentence ? decodeURIComponent(encodedSentence) : ""

  const [selectedText, setSelectedText] = useState("")
  const [expansion, setExpansion] = useState("")
  const [timerStarted, setTimerStarted] = useState(false)
  const [timerComplete, setTimerComplete] = useState(false)
  const [showExpansion, setShowExpansion] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const { toast } = useToast()

  const handleStartTimer = () => {
    setTimerStarted(true)
  }

  const handleTimerComplete = () => {
    setTimerComplete(true)
    setShowExpansion(true)

    // Play the birdsong using the global function
    if (typeof window !== "undefined" && window.playBirdsong) {
      window.playBirdsong().catch((err) => {
        console.log("Error playing birdsong in reflect page:", err)
      })
    }

    toast({
      title: "Time to reflect",
      description: "15 minutes have passed. Now you can reflect on your writing.",
    })
  }

  const handleSaveReflection = () => {
    // In a real app, this would save to a database
    // For now, we'll simulate saving by offering a download
    const content = `
Original Meditation Sentence:
${sentence}

Original Writing:
${writing}

Selected Text for Expansion:
${selectedText}

Expanded Thoughts:
${expansion}
    `.trim()

    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "meditation-reflection.txt"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Reflection saved",
      description: "Your reflection has been saved successfully.",
    })
    
    // Show completion state
    setIsComplete(true)
  }

  const handleNewSession = () => {
    router.push("/")
  }

  if (isComplete) {
    return (
      <div className="container max-w-2xl mx-auto py-12 px-4 bg-white text-[#2F4F4F] min-h-screen flex flex-col items-center">
        <div className="w-full max-w-md cursor-pointer" onClick={handleNewSession}>
          <Image 
            src="/lastpage.png" 
            alt="Click to start a new journey" 
            width={500}
            height={650}
            className="w-full rounded-lg shadow-lg hover:opacity-90 transition-opacity duration-300"
            priority 
          />
        </div>
      </div>
    )
  }

  return (
    <div className={`container max-w-2xl mx-auto py-12 px-4 min-h-screen ${timerStarted && !timerComplete ? 'meditation-complete' : 'bg-[#fdf0e5]'} text-[#747895]`}>
      <Card className={`p-6 ${timerStarted && !timerComplete ? 'bg-white/80 backdrop-blur-sm' : 'bg-[#ecedf5]'} shadow-lg rounded-lg border border-[#747895]/20`}>
        <div className="space-y-6">
          <h1 className="text-2xl font-bold text-center text-[#747895]">Reflection</h1>

          <div className="p-4 bg-[#fdf0e5] rounded-lg text-center border border-[#747895]/20">
            <p className="text-lg italic text-[#747895]">{sentence}</p>
          </div>

          {!timerStarted ? (
            <div className="space-y-4">
              <div className="p-4 border border-[#747895]/20 rounded-lg bg-[#fdf0e5]">
                <h2 className="text-lg font-medium text-[#747895] mb-2">Your Writing</h2>
                <div className="whitespace-pre-wrap text-[#747895]">{writing}</div>
              </div>

              <div className="bg-[#fdf0e5] p-4 rounded-lg border border-[#747895]/20">
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-[#747895] mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-[#747895]">Take a break</h3>
                    <p className="text-[#747895]">
                      Return to this page after 15 minutes to reflect on what you've written.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <Button 
                  onClick={handleStartTimer}
                  className="meditation-button"
                >
                  Start 15-Minute Timer
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {!timerComplete && (
                <div className="flex justify-center w-full max-w-md mx-auto">
                  <Timer duration={15 * 60} onComplete={handleTimerComplete} className="w-full" />
                </div>
              )}

              {timerComplete && (
                <div className="flex items-center justify-center gap-2 text-[#747895]">
                  <CheckCircle className="h-5 w-5" />
                  <span>Break complete! Time to reflect on your writing.</span>
                </div>
              )}

              <div className="p-4 border border-[#747895]/20 rounded-lg bg-[#fdf0e5]">
                <h2 className="text-lg font-medium text-[#747895] mb-2">Your Writing</h2>
                <div className="whitespace-pre-wrap text-[#747895]">{writing}</div>
              </div>

              <div className="space-y-2">
                <label htmlFor="selected-text" className="block font-medium text-[#747895]">
                  Select an idea or sentence you'd like to expand on:
                </label>
                <Textarea
                  id="selected-text"
                  value={selectedText}
                  onChange={(e) => setSelectedText(e.target.value)}
                  placeholder="Copy and paste or type the sentence or idea you want to expand on..."
                  className="min-h-[80px] bg-[#fdf0e5] border-[#747895]/20 text-[#747895] focus:border-[#747895]/40 focus:ring-[#747895]/30"
                />
              </div>

              {showExpansion && (
                <div className="space-y-2">
                  <label htmlFor="expansion" className="block font-medium text-[#747895]">
                    Expand on this idea:
                  </label>
                  <Textarea
                    id="expansion"
                    value={expansion}
                    onChange={(e) => setExpansion(e.target.value)}
                    placeholder="Write your expanded thoughts here..."
                    className="min-h-[150px] bg-[#fdf0e5] border-[#747895]/20 text-[#747895] focus:border-[#747895]/40 focus:ring-[#747895]/30"
                  />
                </div>
              )}

              <div className="flex flex-wrap gap-4 justify-center">
                <Button 
                  onClick={handleSaveReflection} 
                  disabled={!selectedText.trim() || !expansion.trim()}
                  className="meditation-button"
                >
                  Save Reflection
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleNewSession}
                  className="border-[#747895]/20 text-[#747895] hover:bg-[#fdf0e5] transition-colors duration-300"
                >
                  Start New Session
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
