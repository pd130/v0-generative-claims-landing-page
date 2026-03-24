"use client"

import { motion } from "framer-motion"
import { Target, Shield, BarChart3, RefreshCw, CheckCircle2, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Metric {
  label: string
  value: string | number
  target?: string | number
  icon: React.ReactNode
  status: "success" | "warning" | "neutral"
}

interface QualityMetricsProps {
  claimRate: number
  targetClaimRate: number
  fdCompliance: number
  statisticalMatch: number
  avgIterations: number
}

export function QualityMetrics({
  claimRate,
  targetClaimRate,
  fdCompliance,
  statisticalMatch,
  avgIterations,
}: QualityMetricsProps) {
  const metrics: Metric[] = [
    {
      label: "Claim Rate",
      value: `${claimRate}%`,
      target: `${targetClaimRate}%`,
      icon: <Target className="w-4 h-4" />,
      status: Math.abs(claimRate - targetClaimRate) <= 0.5 ? "success" : "warning",
    },
    {
      label: "FD Compliance",
      value: `${fdCompliance}%`,
      icon: <Shield className="w-4 h-4" />,
      status: fdCompliance === 100 ? "success" : fdCompliance >= 95 ? "warning" : "neutral",
    },
    {
      label: "Statistical Match",
      value: `${statisticalMatch}%`,
      icon: <BarChart3 className="w-4 h-4" />,
      status: statisticalMatch >= 90 ? "success" : statisticalMatch >= 80 ? "warning" : "neutral",
    },
    {
      label: "Avg Iterations",
      value: avgIterations.toFixed(1),
      icon: <RefreshCw className="w-4 h-4" />,
      status: avgIterations <= 2.5 ? "success" : avgIterations <= 4 ? "warning" : "neutral",
    },
  ]

  const statusColors = {
    success: "text-emerald-400",
    warning: "text-amber-400",
    neutral: "text-muted-foreground",
  }

  const statusBg = {
    success: "bg-emerald-500/10",
    warning: "bg-amber-500/10",
    neutral: "bg-muted/50",
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Card className="bg-card/60 backdrop-blur-xl border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-foreground">Quality Metrics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
              className={`flex items-center justify-between p-3 rounded-lg ${statusBg[metric.status]}`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-md bg-background/50 ${statusColors[metric.status]}`}>
                  {metric.icon}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{metric.label}</p>
                  {metric.target && (
                    <p className="text-xs text-muted-foreground">Target: {metric.target}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-lg font-semibold ${statusColors[metric.status]}`}>
                  {metric.value}
                </span>
                {metric.status === "success" ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : metric.status === "warning" ? (
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                ) : null}
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  )
}
