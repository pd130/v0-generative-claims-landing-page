"use client"

import { useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ScrollArea } from "@/components/ui/scroll-area"

export interface LogEntry {
  id: string
  timestamp: Date
  message: string
  type: "info" | "success" | "warning" | "error"
}

interface LogStreamProps {
  logs: LogEntry[]
}

const typeColors = {
  info: "text-blue-400",
  success: "text-emerald-400",
  warning: "text-amber-400",
  error: "text-red-400",
}

const typeIcons = {
  info: "i",
  success: "ok",
  warning: "!",
  error: "x",
}

export function LogStream({ logs }: LogStreamProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [logs])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  return (
    <div className="w-full h-full rounded-xl overflow-hidden bg-[#0d1117] border border-[#30363d]">
      {/* Terminal header */}
      <div className="flex items-center gap-2 px-4 py-2 bg-[#161b22] border-b border-[#30363d]">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
          <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
        </div>
        <span className="text-xs text-[#8b949e] ml-2 font-mono">generation-logs</span>
      </div>

      {/* Log content */}
      <ScrollArea className="h-[280px]" ref={scrollRef}>
        <div className="p-4 font-mono text-sm space-y-1">
          <AnimatePresence initial={false}>
            {logs.map((log) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-start gap-2"
              >
                <span className="text-[#6e7681] shrink-0">[{formatTime(log.timestamp)}]</span>
                <span className={`shrink-0 ${typeColors[log.type]}`}>[{typeIcons[log.type]}]</span>
                <span className={typeColors[log.type]}>{log.message}</span>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={bottomRef} />
        </div>
      </ScrollArea>
    </div>
  )
}
