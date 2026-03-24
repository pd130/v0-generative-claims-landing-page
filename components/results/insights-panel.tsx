"use client"

import { motion } from "framer-motion"
import { CheckCircle2, AlertTriangle, Target, Sparkles } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Insight {
  type: "success" | "warning" | "info"
  message: string
}

interface InsightsPanelProps {
  insights: Insight[]
}

export function InsightsPanel({ insights }: InsightsPanelProps) {
  const iconConfig = {
    success: {
      icon: CheckCircle2,
      className: "text-emerald-400",
      bgClassName: "bg-emerald-500/10",
    },
    warning: {
      icon: AlertTriangle,
      className: "text-amber-400",
      bgClassName: "bg-amber-500/10",
    },
    info: {
      icon: Target,
      className: "text-primary",
      bgClassName: "bg-primary/10",
    },
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card className="bg-card/60 backdrop-blur-xl border-border/50">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <CardTitle className="text-sm font-medium text-foreground">AI Insights</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {insights.map((insight, index) => {
            const config = iconConfig[insight.type]
            const Icon = config.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
                className={`flex items-start gap-3 p-3 rounded-lg ${config.bgClassName}`}
              >
                <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${config.className}`} />
                <p className="text-sm text-foreground">{insight.message}</p>
              </motion.div>
            )
          })}
        </CardContent>
      </Card>
    </motion.div>
  )
}
