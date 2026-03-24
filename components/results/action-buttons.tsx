"use client"

import { motion } from "framer-motion"
import { Download, FileJson, FileText, RefreshCw } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface ActionButtonsProps {
  onDownloadCSV: () => void
  onDownloadJSON: () => void
  onGenerateReport: () => void
  onRegenerate: () => void
}

export function ActionButtons({
  onDownloadCSV,
  onDownloadJSON,
  onGenerateReport,
  onRegenerate,
}: ActionButtonsProps) {
  const handleDownloadCSV = () => {
    toast.success("Downloading CSV file...")
    onDownloadCSV()
  }

  const handleDownloadJSON = () => {
    toast.success("Downloading JSON file...")
    onDownloadJSON()
  }

  const handleGenerateReport = () => {
    toast.loading("Generating report...", { id: "report" })
    onGenerateReport()
    setTimeout(() => {
      toast.success("Report generated!", { id: "report" })
    }, 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="bg-card/60 backdrop-blur-xl border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-foreground">Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            className="w-full justify-start gap-3 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground"
            onClick={handleDownloadCSV}
          >
            <Download className="w-4 h-4" />
            Download CSV
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start gap-3 bg-card/50 border-border hover:bg-card"
            onClick={handleDownloadJSON}
          >
            <FileJson className="w-4 h-4" />
            Download JSON
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start gap-3 bg-card/50 border-border hover:bg-card"
            onClick={handleGenerateReport}
          >
            <FileText className="w-4 h-4" />
            Generate Report
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start gap-3 bg-card/50 border-border hover:bg-card text-amber-400 hover:text-amber-300"
            onClick={onRegenerate}
          >
            <RefreshCw className="w-4 h-4" />
            Regenerate
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}
