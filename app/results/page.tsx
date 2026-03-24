"use client"

import { motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Particles } from "@/components/particles"
import { SummaryCard } from "@/components/results/summary-card"
import { QualityMetrics } from "@/components/results/quality-metrics"
import { ActionButtons } from "@/components/results/action-buttons"
import { DataTable, type DataRow } from "@/components/results/data-table"
import { DistributionCharts } from "@/components/results/distribution-charts"
import { ComparisonSection } from "@/components/results/comparison-section"
import { InsightsPanel } from "@/components/results/insights-panel"

// Generate mock data
const generateMockData = (count: number): DataRow[] => {
  const regions = ["C1", "C2", "C3", "C4", "C5", "C6", "C7", "C8"]
  const fuelTypes = ["Petrol", "Diesel", "Electric", "Hybrid"]
  const vehicleMakes = ["Toyota", "Honda", "Ford", "BMW", "Mercedes", "Audi", "Volkswagen", "Hyundai"]

  return Array.from({ length: count }, (_, i) => {
    const hasClaim = Math.random() < 0.062 // ~6.2% claim rate
    return {
      id: `row-${i}`,
      policyId: `POL-${String(100000 + i).slice(1)}`,
      claimStatus: hasClaim ? 1 : 0,
      vehicleAge: Math.floor(Math.random() * 15) + 1,
      region: regions[Math.floor(Math.random() * regions.length)],
      fuelType: fuelTypes[Math.floor(Math.random() * fuelTypes.length)],
      premium: Math.floor(Math.random() * 2000) + 500,
      claimAmount: hasClaim ? Math.floor(Math.random() * 10000) + 1000 : null,
      driverAge: Math.floor(Math.random() * 50) + 18,
      vehicleMake: vehicleMakes[Math.floor(Math.random() * vehicleMakes.length)],
    }
  })
}

const mockData = generateMockData(1000)

// Calculate distributions from mock data
const claimCounts = mockData.reduce(
  (acc, row) => {
    if (row.claimStatus === 1) acc.claims++
    else acc.noClaims++
    return acc
  },
  { claims: 0, noClaims: 0 }
)

const claimData = [
  { name: "No Claim", value: claimCounts.noClaims },
  { name: "Claim", value: claimCounts.claims },
]

const vehicleAgeBuckets = mockData.reduce((acc, row) => {
  const bucket = `${Math.floor(row.vehicleAge / 3) * 3}-${Math.floor(row.vehicleAge / 3) * 3 + 2}`
  acc[bucket] = (acc[bucket] || 0) + 1
  return acc
}, {} as Record<string, number>)

const vehicleAgeData = Object.entries(vehicleAgeBuckets)
  .map(([age, count]) => ({ age, count }))
  .sort((a, b) => parseInt(a.age) - parseInt(b.age))

const regionCounts = mockData.reduce((acc, row) => {
  acc[row.region] = (acc[row.region] || 0) + 1
  return acc
}, {} as Record<string, number>)

const regionData = Object.entries(regionCounts)
  .map(([region, count]) => ({ region, count }))
  .sort((a, b) => a.region.localeCompare(b.region))

const fuelCounts = mockData.reduce((acc, row) => {
  acc[row.fuelType] = (acc[row.fuelType] || 0) + 1
  return acc
}, {} as Record<string, number>)

const fuelTypeData = Object.entries(fuelCounts).map(([name, value]) => ({ name, value }))

const comparisonData = [
  { category: "18-25", real: 15, synthetic: 14 },
  { category: "26-35", real: 28, synthetic: 29 },
  { category: "36-45", real: 25, synthetic: 24 },
  { category: "46-55", real: 20, synthetic: 21 },
  { category: "56+", real: 12, synthetic: 12 },
]

const ksTestResults = [
  { column: "vehicle_age", statistic: 0.023, pValue: 0.847, pass: true },
  { column: "driver_age", statistic: 0.018, pValue: 0.912, pass: true },
  { column: "premium", statistic: 0.031, pValue: 0.721, pass: true },
  { column: "region", statistic: 0.089, pValue: 0.043, pass: false },
  { column: "fuel_type", statistic: 0.015, pValue: 0.956, pass: true },
]

const insights = [
  { type: "success" as const, message: "Statistical match: Excellent - 94.3% similarity to real data distribution" },
  { type: "warning" as const, message: "Slight bias detected in region C8 - consider rebalancing" },
  { type: "info" as const, message: "Claim rate on target: 6.2% achieved vs 6% target" },
  { type: "success" as const, message: "All functional dependencies respected - 100% FD compliance" },
]

export default function ResultsPage() {
  const handleDownloadCSV = () => {
    const headers = Object.keys(mockData[0]).join(",")
    const rows = mockData.map((row) => Object.values(row).join(",")).join("\n")
    const csv = `${headers}\n${rows}`
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "synthetic_claims_data.csv"
    a.click()
  }

  const handleDownloadJSON = () => {
    const json = JSON.stringify(mockData, null, 2)
    const blob = new Blob([json], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "synthetic_claims_data.json"
    a.click()
  }

  const handleGenerateReport = () => {
    // Placeholder for report generation
  }

  const handleRegenerate = () => {
    window.location.href = "/configure"
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
      </div>
      <Particles />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/generate">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-foreground">Generation Results</h1>
                <p className="text-sm text-muted-foreground">Job completed successfully</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - 3 Column Grid */}
      <main className="container mx-auto px-4 py-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - 25% */}
          <motion.div
            className="lg:col-span-3 space-y-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <SummaryCard
              jobId="GEN-847291"
              status="success"
              timestamp="Mar 24, 2026, 10:32 AM"
              duration="2m 34s"
              totalRows={1000}
            />
            <QualityMetrics
              claimRate={6.2}
              targetClaimRate={6}
              fdCompliance={100}
              statisticalMatch={94.3}
              avgIterations={2.1}
            />
            <ActionButtons
              onDownloadCSV={handleDownloadCSV}
              onDownloadJSON={handleDownloadJSON}
              onGenerateReport={handleGenerateReport}
              onRegenerate={handleRegenerate}
            />
          </motion.div>

          {/* Middle Column - 50% */}
          <motion.div
            className="lg:col-span-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <DataTable data={mockData} />
          </motion.div>

          {/* Right Column - 25% */}
          <motion.div
            className="lg:col-span-3 space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <DistributionCharts
              claimData={claimData}
              vehicleAgeData={vehicleAgeData}
              regionData={regionData}
              fuelTypeData={fuelTypeData}
            />
            <ComparisonSection
              comparisonData={comparisonData}
              ksTestResults={ksTestResults}
            />
            <InsightsPanel insights={insights} />
          </motion.div>
        </div>
      </main>
    </div>
  )
}
