import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AudioProvider } from "@/components/audio-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Meditation & Free Writing",
  description: "A meditation and free writing application",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <AudioProvider />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
