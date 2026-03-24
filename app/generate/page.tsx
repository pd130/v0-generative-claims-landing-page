"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Pause, Play, X, Download, ArrowLeft, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Particles } from "@/components/particles"
import { ProgressCircle } from "@/components/progress-circle"
import { StageStepper } from "@/components/stage-stepper"
import { StatsGrid } from "@/components/stats-grid"
import { LogStream, type LogEntry } from "@/components/log-stream"
import { toast } from "sonner"
import { Toaster } from "@/components/ui/sonner"

const sampleLogMessages = {
  1: [ // Profiling
    { msg: "Analyzing source schema structure...", type: "info" as const },
    { msg: "Detected 23 columns across 4 tables", type: "success" as const },
    { msg: "Identifying functional dependencies...", type: "info" as const },
    { msg: "Found 7 primary constraints", type: "success" as const },
    { msg: "Profiling data distributions...", type: "info" as const },
  ],
  2: [ // Retrieval
    { msg: "Initializing PageIndex retrieval...", type: "info" as const },
    { msg: "Querying context for claim patterns...", type: "info" as const },
    { msg: "Retrieved 156 relevant examples", type: "success" as const },
    { msg: "Building semantic context window...", type: "info" as const },
    { msg: "Context ready (vectorless mode)", type: "success" as const },
  ],
  3: [ // Generating
    { msg: "Starting Reflexion Agent...", type: "info" as const },
    { msg: "Generating synthetic records...", type: "info" as const },
  ],
  4: [ // Validating
    { msg: "Running constraint validation...", type: "info" as const },
    { msg: "Checking referential integrity...", type: "info" as const },
    { msg: "Validating statistical distributions...", type: "info" as const },
  ],
  5: [ // Complete
    { msg: "All validations passed!", type: "success" as const },
    { msg: "Generation complete! Ready for download.", type: "success" as const },
  ],
}

export default function GeneratePage() {
  const router = useRouter()
  const [isPaused, setIsPaused] = useState(false)
  const [isCancelled, setIsCancelled] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentStage, setCurrentStage] = useState(1)
  const [rowsGenerated, setRowsGenerated] = useState(0)
  const [currentIteration, setCurrentIteration] = useState(1)
  const [validationRate, setValidationRate] = useState(0)
  const [avgTimePerRow, setAvgTimePerRow] = useState(0)
  const [logs, setLogs] = useState<LogEntry[]>([])
  const totalRows = 100
  const stageLogIndex = useRef<Record<number, number>>({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 })
  const lastStage = useRef(0)

  const addLog = useCallback((message: string, type: LogEntry["type"]) => {
    const entry: LogEntry = {
      id: `${Date.now()}-${Math.random()}`,
      timestamp: new Date(),
      message,
      type,
    }
    setLogs(prev => [...prev, entry])
  }, [])

  useEffect(() => {
    if (isPaused || isCancelled) return

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return Math.min(prev + 0.8, 100)
      })

      setRowsGenerated(prev => {
        if (prev >= totalRows) return totalRows
        const increment = Math.floor(Math.random() * 3) + 1
        return Math.min(prev + increment, totalRows)
      })

      setCurrentIteration(prev => {
        if (Math.random() > 0.85) return prev + 1
        return prev
      })

      setValidationRate(prev => {
        if (prev < 95) return Math.min(prev + Math.random() * 5, 98.7)
        return 97 + Math.random() * 2
      })

      setAvgTimePerRow(prev => {
        if (prev === 0) return 45 + Math.random() * 10
        return prev + (Math.random() - 0.5) * 5
      })
    }, 500)

    return () => clearInterval(interval)
  }, [isPaused, isCancelled])

  // Update stage based on progress
  useEffect(() => {
    if (progress < 15) setCurrentStage(1)
    else if (progress < 35) setCurrentStage(2)
    else if (progress < 75) setCurrentStage(3)
    else if (progress < 95) setCurrentStage(4)
    else setCurrentStage(5)
  }, [progress])

  // Add logs based on stage
  useEffect(() => {
    if (isPaused || isCancelled) return

    // Reset log index when stage changes
    if (currentStage !== lastStage.current) {
      lastStage.current = currentStage
      stageLogIndex.current[currentStage] = 0
    }

    const stageLogs = sampleLogMessages[currentStage as keyof typeof sampleLogMessages]
    if (!stageLogs) return

    const logInterval = setInterval(() => {
      const idx = stageLogIndex.current[currentStage]
      if (idx < stageLogs.length) {
        addLog(stageLogs[idx].msg, stageLogs[idx].type)
        stageLogIndex.current[currentStage]++
      } else if (currentStage === 3 && rowsGenerated < totalRows) {
        // Add dynamic generation logs
        const dynamicLogs = [
          { msg: `Generating row ${rowsGenerated}/${totalRows}...`, type: "info" as const },
          { msg: `Row ${rowsGenerated} validated (${currentIteration} iterations)`, type: "success" as const },
          { msg: "Reflexion improving generation quality...", type: "info" as const },
        ]
        const randomLog = dynamicLogs[Math.floor(Math.random() * dynamicLogs.length)]
        addLog(randomLog.msg, randomLog.type)
      }
    }, 1200)

    return () => clearInterval(logInterval)
  }, [currentStage, isPaused, isCancelled, addLog, rowsGenerated, currentIteration])

  const handlePauseResume = () => {
    setIsPaused(prev => !prev)
    toast(isPaused ? "Generation resumed" : "Generation paused")
  }

  const handleCancel = () => {
    setIsCancelled(true)
    addLog("Generation cancelled by user", "warning")
    toast.error("Generation cancelled")
  }

  const handleDownload = () => {
    toast.success("Preview data downloaded!")
  }

  const handleViewResults = () => {
    router.push("/results")
  }

  const isComplete = progress >= 100

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Particles />
      <Toaster richColors position="top-right" />
      
      {/* Gradient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <Link href="/configure">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Configure
            </Button>
          </Link>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Data Generation
          </h1>
          <div className="w-32" /> {/* Spacer for centering */}
        </motion.div>

        {/* Stage Stepper */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <StageStepper currentStage={currentStage} />
        </motion.div>

        {/* Main Content */}
        <div className="flex flex-col items-center gap-8">
          {/* Progress Circle */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <ProgressCircle progress={progress} isActive={!isPaused && !isCancelled && !isComplete} />
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <StatsGrid
              rowsGenerated={rowsGenerated}
              totalRows={totalRows}
              currentIteration={currentIteration}
              validationRate={validationRate}
              avgTimePerRow={avgTimePerRow}
            />
          </motion.div>

          {/* Control Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex gap-4"
          >
            <Button
              onClick={handlePauseResume}
              disabled={isCancelled || isComplete}
              variant="outline"
              className="gap-2 bg-card/50 backdrop-blur-sm"
            >
              {isPaused ? (
                <>
                  <Play className="w-4 h-4" />
                  Resume
                </>
              ) : (
                <>
                  <Pause className="w-4 h-4" />
                  Pause
                </>
              )}
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  disabled={isCancelled || isComplete}
                  className="gap-2"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Cancel Generation?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will stop the current generation process. All progress will be lost and you&apos;ll need to start over.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Continue Generating</AlertDialogCancel>
                  <AlertDialogAction onClick={handleCancel}>
                    Yes, Cancel
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Button
              onClick={handleDownload}
              disabled={rowsGenerated < 10}
              variant="outline"
              className="gap-2 bg-card/50 backdrop-blur-sm"
            >
              <Download className="w-4 h-4" />
              Download Preview
            </Button>

            {isComplete && (
              <Button
                onClick={handleViewResults}
                className="gap-2 bg-gradient-to-r from-primary to-accent text-primary-foreground"
              >
                View Results
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </motion.div>

          {/* Log Stream */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="w-full"
          >
            <LogStream logs={logs} />
          </motion.div>
        </div>
      </div>
    </div>
  )
}
