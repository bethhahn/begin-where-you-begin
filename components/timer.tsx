"use client"

import { useState, useEffect, useRef } from "react"
import { PauseIcon, PlayIcon, VolumeXIcon, Volume2Icon } from "lucide-react"
import { cn } from "@/lib/utils"

interface TimerProps {
  duration: number // in seconds
  onComplete: () => void
  className?: string
}

export function Timer({ duration, onComplete, className }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration)
  const [isPaused, setIsPaused] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const hasCalledOnComplete = useRef(false)

  // Initialize audio ref when component mounts
  useEffect(() => {
    // We'll use the audio element from the DOM instead of creating it programmatically
    return () => {
      // Clean up
      if (audioRef.current) {
        audioRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (timeLeft <= 0 && !hasCalledOnComplete.current) {
      hasCalledOnComplete.current = true

      // Play the chime sound if not muted
      if (!isMuted && typeof window !== "undefined") {
        try {
          // Get the audio element from the DOM
          const audioElement = document.getElementById("timer-chime") as HTMLAudioElement
          if (audioElement) {
            // Reset the audio to the beginning
            audioElement.currentTime = 0

            // Play the audio
            const playPromise = audioElement.play()
            if (playPromise !== undefined) {
              playPromise.catch((error) => {
                console.log("Audio play error:", error)
              })
            }
          }
        } catch (error) {
          console.log("Error playing audio:", error)
        }
      }

      onComplete()
      return
    }

    if (!isPaused && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [timeLeft, isPaused, onComplete, isMuted])

  // Reset the completion flag when duration changes
  useEffect(() => {
    setTimeLeft(duration)
    hasCalledOnComplete.current = false
  }, [duration])

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  const togglePause = () => {
    setIsPaused(!isPaused)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <button
        onClick={togglePause}
        className="p-2 rounded-full hover:bg-[#747895]/10 transition-colors duration-300"
        aria-label={isPaused ? "Resume timer" : "Pause timer"}
      >
        {isPaused ? <PlayIcon className="h-5 w-5 text-[#747895]/80" /> : <PauseIcon className="h-5 w-5 text-[#747895]/80" />}
      </button>

      <div className="flex-1 bg-[#747895]/10 h-2 rounded-full overflow-hidden">
        <div
          className="bg-[#747895]/40 h-full transition-all duration-1000"
          style={{ width: `${(timeLeft / duration) * 100}%` }}
        />
      </div>

      <button
        onClick={toggleMute}
        className="p-2 rounded-full hover:bg-[#747895]/10 transition-colors duration-300"
        aria-label={isMuted ? "Unmute timer sound" : "Mute timer sound"}
      >
        {isMuted ? <VolumeXIcon className="h-5 w-5 text-[#747895]/80" /> : <Volume2Icon className="h-5 w-5 text-[#747895]/80" />}
      </button>
    </div>
  )
}
