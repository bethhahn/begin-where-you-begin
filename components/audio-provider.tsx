"use client"

import { useEffect, useRef } from "react"

export function AudioProvider() {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Create the audio element
      audioRef.current = new Audio()
      audioRef.current.src = "/sounds/birdsong.mp3"
      audioRef.current.preload = "auto"
      
      // Create the play function
      window.playBirdsong = async () => {
        try {
          if (!audioRef.current) {
            throw new Error("Audio not initialized")
          }
          
          // Reset the audio to the beginning
          audioRef.current.currentTime = 0
          
          // Play the audio
          await audioRef.current.play()
          console.log("Birdsong played successfully")
        } catch (error) {
          console.error("Error playing birdsong:", error)
          throw error
        }
      }

      // Load the audio
      audioRef.current.load()
    }

    return () => {
      if (typeof window !== "undefined") {
        // @ts-ignore
        delete window.playBirdsong
      }
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  return null
}
