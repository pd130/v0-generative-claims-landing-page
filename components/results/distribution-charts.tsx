"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface DistributionChartsProps {
  claimData: { name: string; value: number }[]
  vehicleAgeData: { age: string; count: number }[]
  regionData: { region: string; count: number }[]
  fuelTypeData: { name: string; value: number }[]
}

const COLORS = {
  primary: "#8B5CF6",
  accent: "#3B82F6",
  emerald: "#10B981",
  amber: "#F59E0B",
  rose: "#F43F5E",
  slate: "#64748B",
}

const PIE_COLORS = [COLORS.emerald, COLORS.rose]
const FUEL_COLORS = [COLORS.amber, COLORS.slate, COLORS.emerald, COLORS.accent]

export function DistributionCharts({
  claimData,
  vehicleAgeData,
  regionData,
  fuelTypeData,
}: DistributionChartsProps) {
  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number; name?: string }[]; label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-xl">
          <p className="text-sm font-medium text-foreground">{label || payload[0].name}</p>
          <p className="text-sm text-primary font-semibold">{payload[0].value.toLocaleString()}</p>
        </div>
      )
    }
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="space-y-4"
    >
      <Card className="bg-card/60 backdrop-blur-xl border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-foreground">Claim Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[140px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={claimData}
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={55}
                  paddingAngle={5}
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={1000}
                >
                  {claimData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-2">
            {claimData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: PIE_COLORS[index] }}
                />
                <span className="text-xs text-muted-foreground">
                  {entry.name}: {entry.value.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card/60 backdrop-blur-xl border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-foreground">Vehicle Age Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[140px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={vehicleAgeData}>
                <XAxis
                  dataKey="age"
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                  axisLine={{ stroke: "hsl(var(--border))" }}
                  tickLine={false}
                />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="count"
                  fill={COLORS.primary}
                  radius={[4, 4, 0, 0]}
                  animationBegin={200}
                  animationDuration={1000}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card/60 backdrop-blur-xl border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-foreground">Region Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[140px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionData} layout="vertical">
                <XAxis type="number" hide />
                <YAxis
                  dataKey="region"
                  type="category"
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  width={30}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="count"
                  fill={COLORS.accent}
                  radius={[0, 4, 4, 0]}
                  animationBegin={400}
                  animationDuration={1000}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card/60 backdrop-blur-xl border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-foreground">Fuel Type</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[140px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={fuelTypeData}
                  cx="50%"
                  cy="50%"
                  outerRadius={55}
                  paddingAngle={2}
                  dataKey="value"
                  animationBegin={600}
                  animationDuration={1000}
                >
                  {fuelTypeData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={FUEL_COLORS[index % FUEL_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-3 mt-2">
            {fuelTypeData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-1.5">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: FUEL_COLORS[index] }}
                />
                <span className="text-xs text-muted-foreground">{entry.name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
