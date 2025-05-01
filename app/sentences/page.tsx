"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useRouter } from "next/navigation"

export default function SentencesPage() {
  const router = useRouter()
  const [sentences, setSentences] = useState<string[]>(["", "", "", "", ""])
  const [selectedSentence, setSelectedSentence] = useState<string | null>(null)
  const [sentencesSubmitted, setSentencesSubmitted] = useState(false)

  const handleSentenceChange = (index: number, value: string) => {
    const newSentences = [...sentences]
    newSentences[index] = value
    setSentences(newSentences)
  }

  const handleSubmitSentences = (e: React.FormEvent) => {
    e.preventDefault()
    if (sentences.every((sentence) => sentence.trim() !== "")) {
      setSentencesSubmitted(true)
    }
  }

  const handleSelectAndMeditate = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedSentence) {
      const encodedSentence = encodeURIComponent(selectedSentence)
      router.push(`/meditate?sentence=${encodedSentence}`)
    }
  }

  return (
    <div className="container max-w-md mx-auto py-12 px-4 bg-white text-[#747895] min-h-screen">
      <Card className="p-6 bg-[#ecedf5] rounded-lg border border-[#747895]/20">
        {!sentencesSubmitted ? (
          <form id="sentence-form" onSubmit={handleSubmitSentences}>
            <div className="space-y-4">
              <div className="text-center mb-4">
                <h2 className="text-lg font-medium text-[#747895]">Enter five sentences:</h2>
              </div>

              {sentences.map((sentence, index) => (
                <div key={index} className="space-y-2">
                  <Label htmlFor={`sentence-${index}`} className="text-[#747895]">Sentence {index + 1}</Label>
                  <Input
                    id={`sentence-${index}`}
                    value={sentence}
                    onChange={(e) => handleSentenceChange(index, e.target.value)}
                    required
                    className="bg-white border-[#747895]/20 text-[#747895] focus:border-[#747895]/40 focus:ring-[#747895]/30"
                  />
                </div>
              ))}

              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full meditation-button"
                  disabled={!sentences.every((sentence) => sentence.trim() !== "")}
                >
                  Continue
                </Button>
              </div>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSelectAndMeditate}>
            <div className="space-y-4">
              <div className="text-center mb-4">
                <h2 className="text-lg font-medium text-[#747895]">Choose one sentence to meditate on:</h2>
              </div>

              <RadioGroup value={selectedSentence || ""} onValueChange={setSelectedSentence}>
                {sentences.map((sentence, index) => (
                  <div 
                    key={index} 
                    className="flex items-start space-x-2 p-2 rounded-lg hover:bg-[#f0f4f8] transition-colors duration-300"
                  >
                    <RadioGroupItem 
                      value={sentence} 
                      id={`select-sentence-${index}`} 
                      className="text-[#747895]"
                    />
                    <Label 
                      htmlFor={`select-sentence-${index}`} 
                      className="font-normal cursor-pointer text-[#747895]"
                    >
                      {sentence}
                    </Label>
                  </div>
                ))}
              </RadioGroup>

              <div className="pt-4">
                <Button 
                  type="submit" 
                  className="w-full meditation-button"
                  disabled={!selectedSentence}
                >
                  Begin Meditation
                </Button>
              </div>
            </div>
          </form>
        )}
      </Card>
    </div>
  )
} 