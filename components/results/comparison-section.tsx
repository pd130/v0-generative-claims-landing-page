"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

interface ComparisonData {
  category: string
  real: number
  synthetic: number
}

interface KSTestResult {
  column: string
  statistic: number
  pValue: number
  pass: boolean
}

interface ComparisonSectionProps {
  comparisonData: ComparisonData[]
  ksTestResults: KSTestResult[]
}

export function ComparisonSection({ comparisonData, ksTestResults }: ComparisonSectionProps) {
  const [showComparison, setShowComparison] = useState(true)

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number; dataKey: string; fill: string }[]; label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-xl">
          <p className="text-sm font-medium text-foreground mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: entry.fill }}
              />
              <span className="text-xs text-muted-foreground capitalize">{entry.dataKey}:</span>
              <span className="text-xs font-medium text-foreground">{entry.value}%</span>
            </div>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="space-y-4"
    >
      <Card className="bg-card/60 backdrop-blur-xl border-border/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-foreground">Distribution Comparison</CardTitle>
            <div className="flex items-center gap-2">
              <Label htmlFor="comparison-toggle" className="text-xs text-muted-foreground">
                Real vs Synthetic
              </Label>
              <Switch
                id="comparison-toggle"
                checked={showComparison}
                onCheckedChange={setShowComparison}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <AnimatePresence mode="wait">
            {showComparison && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="h-[180px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={comparisonData} barGap={2}>
                      <XAxis
                        dataKey="category"
                        tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                        axisLine={{ stroke: "hsl(var(--border))" }}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(value) => `${value}%`}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend
                        wrapperStyle={{ fontSize: "10px" }}
                        formatter={(value) => <span className="text-muted-foreground capitalize">{value}</span>}
                      />
                      <Bar dataKey="real" fill="#64748B" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="synthetic" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      <Card className="bg-card/60 backdrop-blur-xl border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-foreground">KS Test Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {ksTestResults.map((result, index) => (
              <motion.div
                key={result.column}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className={`flex items-center justify-between p-2 rounded-lg ${
                  result.pass ? "bg-emerald-500/10" : "bg-amber-500/10"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-foreground">{result.column}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">
                    D={result.statistic.toFixed(3)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    p={result.pValue.toFixed(3)}
                  </span>
                  <Badge
                    className={
                      result.pass
                        ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                        : "bg-amber-500/20 text-amber-400 border-amber-500/30"
                    }
                  >
                    {result.pass ? "Pass" : "Review"}
                  </Badge>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
