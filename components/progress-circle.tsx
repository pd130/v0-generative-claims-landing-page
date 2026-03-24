"use client"

import { useEffect, useState } from "react"
import { CircularProgressbar, buildStyles } from "react-circular-progressbar"
import "react-circular-progressbar/dist/styles.css"
import { motion, AnimatePresence } from "framer-motion"
import confetti from "canvas-confetti"

interface ProgressCircleProps {
  progress: number
  isActive: boolean
}

export function ProgressCircle({ progress, isActive }: ProgressCircleProps) {
  const [displayProgress, setDisplayProgress] = useState(0)
  const [hasConfettiFired, setHasConfettiFired] = useState(false)

  useEffect(() => {
    const duration = 500
    const startProgress = displayProgress
    const endProgress = progress
    const startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime
      const animProgress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - animProgress, 3)
      const current = startProgress + (endProgress - startProgress) * eased
      setDisplayProgress(current)

      if (animProgress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [progress])

  useEffect(() => {
    if (progress >= 100 && !hasConfettiFired) {
      setHasConfettiFired(true)
      const duration = 3000
      const animationEnd = Date.now() + duration
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 }

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now()

        if (timeLeft <= 0) {
          clearInterval(interval)
          return
        }

        const particleCount = 50 * (timeLeft / duration)

        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          colors: ["#8B5CF6", "#3B82F6", "#10B981", "#F59E0B"],
        })
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          colors: ["#8B5CF6", "#3B82F6", "#10B981", "#F59E0B"],
        })
      }, 250)

      return () => clearInterval(interval)
    }
  }, [progress, hasConfettiFired])

  return (
    <div className="relative">
      <motion.div
        className="w-52 h-52 relative"
        animate={isActive ? { scale: [1, 1.02, 1] } : {}}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Glow effect */}
        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/30 to-accent/30 blur-xl"
            />
          )}
        </AnimatePresence>

        {/* Progress circle */}
        <div className="relative z-10">
          <CircularProgressbar
            value={displayProgress}
            styles={buildStyles({
              rotation: 0,
              strokeLinecap: "round",
              pathTransitionDuration: 0.5,
              pathColor: `url(#progressGradient)`,
              trailColor: "rgba(139, 92, 246, 0.1)",
              backgroundColor: "transparent",
            })}
          />
          <svg style={{ height: 0, width: 0, position: "absolute" }}>
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#3B82F6" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
          <motion.span
            key={Math.floor(displayProgress)}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
          >
            {Math.floor(displayProgress)}%
          </motion.span>
          <span className="text-sm text-muted-foreground mt-1">
            {progress >= 100 ? "Complete!" : "Processing..."}
          </span>
        </div>
      </motion.div>
    </div>
  )
}
