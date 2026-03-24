"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { FileText, RefreshCw, CheckCircle2, Clock } from "lucide-react"

interface StatsGridProps {
  rowsGenerated: number
  totalRows: number
  currentIteration: number
  validationRate: number
  avgTimePerRow: number
}

function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    const duration = 500
    const startValue = displayValue
    const startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = startValue + (value - startValue) * eased
      setDisplayValue(current)

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [value])

  return (
    <span>
      {suffix === "%" ? displayValue.toFixed(1) : Math.floor(displayValue)}
      {suffix}
    </span>
  )
}

export function StatsGrid({ rowsGenerated, totalRows, currentIteration, validationRate, avgTimePerRow }: StatsGridProps) {
  const stats = [
    {
      label: "Rows Generated",
      value: rowsGenerated,
      total: totalRows,
      icon: FileText,
      color: "from-violet-500 to-purple-500",
      showTotal: true,
    },
    {
      label: "Current Iteration",
      value: currentIteration,
      icon: RefreshCw,
      color: "from-blue-500 to-cyan-500",
      animate: true,
    },
    {
      label: "Validation Pass Rate",
      value: validationRate,
      suffix: "%",
      icon: CheckCircle2,
      color: "from-emerald-500 to-green-500",
    },
    {
      label: "Avg Time/Row",
      value: avgTimePerRow,
      suffix: "ms",
      icon: Clock,
      color: "from-amber-500 to-orange-500",
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-4 w-full max-w-md">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative overflow-hidden rounded-xl bg-card/60 backdrop-blur-sm border border-border p-4"
          >
            {/* Gradient accent */}
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color}`} />
            
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-foreground">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  {stat.showTotal && (
                    <span className="text-sm font-normal text-muted-foreground">
                      /{totalRows}
                    </span>
                  )}
                </p>
              </div>
              <motion.div
                animate={stat.animate ? { rotate: 360 } : {}}
                transition={stat.animate ? { duration: 2, repeat: Infinity, ease: "linear" } : {}}
                className={`p-2 rounded-lg bg-gradient-to-br ${stat.color} bg-opacity-20`}
              >
                <Icon className="w-4 h-4 text-foreground" />
              </motion.div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
