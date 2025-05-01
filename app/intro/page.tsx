"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"

export default function IntroPage() {
  const router = useRouter()

  return (
    <div className="container max-w-2xl mx-auto py-12 px-4 bg-gradient-to-b from-[#faf6f2] to-white min-h-screen flex flex-col items-center justify-center">
      <div 
        className="w-full max-w-md cursor-pointer transition-all duration-500 hover:scale-105 slide-up meditation-card"
        onClick={() => router.push("/sentences")}
      >
        <Image
          src="/firstpage.png"
          alt="Click to begin writing"
          width={800}
          height={600}
          className="w-full h-auto rounded-xl"
          priority
        />
      </div>
    </div>
  )
} 