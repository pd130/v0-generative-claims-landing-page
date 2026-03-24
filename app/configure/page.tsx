"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { ArrowLeft, Sparkles } from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Particles } from "@/components/particles"
import { ConfigForm } from "@/components/config-form"
import { PreviewPanel } from "@/components/preview-panel"
import { Toaster } from "@/components/ui/sonner"

interface GenerationConfig {
  rows: number
  claimRate: number
  enableReflexion: boolean
  usePageIndex: boolean
  statisticalMatching: boolean
  constraints: string
  speed: "fast" | "balanced" | "quality"
  seed?: string
}

export default function ConfigurePage() {
  const router = useRouter()
  const [isGenerating, setIsGenerating] = useState(false)
  const [rows, setRows] = useState(1000)
  const [claimRate, setClaimRate] = useState(6)
  const [recentGenerations] = useState([
    { id: "1", rows: 5000, status: "completed" as const, time: "2 hours ago" },
    { id: "2", rows: 1000, status: "completed" as const, time: "5 hours ago" },
    { id: "3", rows: 500, status: "failed" as const, time: "1 day ago" },
  ])

  const handleGenerate = async (config: GenerationConfig) => {
    setIsGenerating(true)
    setRows(config.rows)
    setClaimRate(config.claimRate)

    // Show toast and navigate to generation page
    toast.loading("Starting data generation...", {
      id: "generation",
      description: `Generating ${config.rows.toLocaleString()} rows with ${config.claimRate}% claim rate`,
    })

    // Brief delay for UX, then navigate to real-time progress page
    await new Promise((resolve) => setTimeout(resolve, 800))
    
    toast.dismiss("generation")
    router.push("/generate")
  }

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Animated gradient background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-background" />
        <div className="absolute top-0 left-0 w-full h-full">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              x: [0, 50, 0],
              y: [0, 30, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-gradient-to-br from-primary/30 to-primary/5 blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              x: [0, -30, 0],
              y: [0, 50, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
            className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-bl from-accent/30 to-accent/5 blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              x: [0, 40, 0],
              y: [0, -40, 0],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 4,
            }}
            className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] rounded-full bg-gradient-to-tr from-primary/20 via-accent/15 to-transparent blur-3xl"
          />
        </div>
        <Particles count={30} />
      </div>

      <Navbar />
      <Toaster richColors position="top-center" />

      {/* Page Header */}
      <section className="pt-28 pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mb-6"
          >
            <Link
              href="/"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm">Back to Home</span>
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold text-foreground flex items-center gap-3">
              <Sparkles className="h-8 w-8 text-primary" />
              Data Generation Studio
            </h1>
            <p className="text-muted-foreground mt-2 max-w-2xl">
              Configure your synthetic insurance data generation with advanced AI controls
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Left Panel - Configuration Form (40%) */}
            <div className="lg:col-span-2">
              <ConfigForm
                onGenerate={handleGenerate}
                isGenerating={isGenerating}
              />
            </div>

            {/* Right Panel - Preview (60%) */}
            <div className="lg:col-span-3">
              <PreviewPanel
                rows={rows}
                claimRate={claimRate}
                isGenerating={isGenerating}
                recentGenerations={recentGenerations}
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
