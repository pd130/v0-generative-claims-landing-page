"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Copy, Check, Clock, Calendar, Hash } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface SummaryCardProps {
  jobId: string
  status: "success" | "failed" | "partial"
  timestamp: string
  duration: string
  totalRows: number
}

export function SummaryCard({ jobId, status, timestamp, duration, totalRows }: SummaryCardProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(jobId)
    setCopied(true)
    toast.success("Job ID copied to clipboard")
    setTimeout(() => setCopied(false), 2000)
  }

  const statusConfig = {
    success: { label: "Success", variant: "default" as const, className: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
    failed: { label: "Failed", variant: "destructive" as const, className: "bg-red-500/20 text-red-400 border-red-500/30" },
    partial: { label: "Partial", variant: "secondary" as const, className: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-card/60 backdrop-blur-xl border-border/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-foreground">Job Summary</CardTitle>
            <Badge className={statusConfig[status].className}>
              {statusConfig[status].label}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2">
              <Hash className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Job ID</span>
            </div>
            <div className="flex items-center gap-2">
              <code className="text-sm font-mono text-foreground">{jobId}</code>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={handleCopy}
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="w-4 h-4 text-primary" />
                <span className="text-xs text-muted-foreground">Generated</span>
              </div>
              <p className="text-sm font-medium text-foreground">{timestamp}</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4 text-accent" />
                <span className="text-xs text-muted-foreground">Duration</span>
              </div>
              <p className="text-sm font-medium text-foreground">{duration}</p>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Rows Generated</span>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {totalRows.toLocaleString()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
