"use client"

import { motion } from "framer-motion"
import { Check, Search, Database, Sparkles, ShieldCheck, Trophy } from "lucide-react"

const stages = [
  { id: 1, name: "Profiling", icon: Search },
  { id: 2, name: "Retrieval", icon: Database },
  { id: 3, name: "Generating", icon: Sparkles },
  { id: 4, name: "Validating", icon: ShieldCheck },
  { id: 5, name: "Complete", icon: Trophy },
]

interface StageStepperProps {
  currentStage: number
}

export function StageStepper({ currentStage }: StageStepperProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between relative">
        {/* Progress line background */}
        <div className="absolute left-0 right-0 top-1/2 h-1 bg-muted/50 -translate-y-1/2 mx-8" />
        
        {/* Progress line filled */}
        <motion.div
          className="absolute left-0 top-1/2 h-1 bg-gradient-to-r from-primary to-accent -translate-y-1/2 mx-8"
          initial={{ width: "0%" }}
          animate={{ width: `${Math.min(((currentStage - 1) / (stages.length - 1)) * 100, 100)}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />

        {stages.map((stage, index) => {
          const isCompleted = currentStage > stage.id
          const isActive = currentStage === stage.id
          const isFuture = currentStage < stage.id
          const Icon = stage.icon

          return (
            <div key={stage.id} className="flex flex-col items-center relative z-10">
              <motion.div
                className={`
                  w-12 h-12 rounded-full flex items-center justify-center
                  transition-all duration-300 border-2
                  ${isCompleted 
                    ? "bg-gradient-to-r from-primary to-accent border-transparent" 
                    : isActive 
                      ? "bg-card border-primary shadow-lg shadow-primary/30" 
                      : "bg-card/50 border-border"
                  }
                `}
                animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5 text-primary-foreground" />
                ) : (
                  <Icon className={`w-5 h-5 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                )}
              </motion.div>
              <span className={`
                mt-2 text-xs font-medium whitespace-nowrap
                ${isCompleted || isActive ? "text-foreground" : "text-muted-foreground"}
              `}>
                {stage.name}
              </span>
              {isActive && (
                <motion.div
                  className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
                  animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
