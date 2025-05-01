'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f1eeee] text-[#2c3e50] p-4">
      <h1 className="text-4xl font-bold mb-4">Something went wrong!</h1>
      <p className="text-xl mb-8">{error.message}</p>
      <div className="flex gap-4">
        <Button onClick={() => reset()}>Try again</Button>
        <Button asChild>
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    </div>
  )
} 