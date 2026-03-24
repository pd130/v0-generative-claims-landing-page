/**
 * hooks/usePipeline.ts
 *
 * Drop this hook into your existing landing page.
 * It wraps every API call so your UI components only need:
 *
 *   const { start, status, progress, logs, rows, download } = usePipeline()
 */

import { useState, useRef, useCallback } from "react"

// ── Types ──────────────────────────────────────────────────────────────────

export interface PipelineConfig {
  csvPath?:       string
  nRows?:         number
  seedFields?:    Record<string, string | number>
  skipProfiling?: boolean
  skipEmbedding?: boolean
  skipIndexing?:  boolean
  resetIndex?:    boolean
}

export type PipelineStatus = "idle" | "running" | "done" | "error"

export interface PipelineState {
  status:   PipelineStatus
  stage:    string
  progress: number          // 0-100
  logs:     string[]
  rows:     Record<string, unknown>[]
  error:    string | null
}

// Change this if your FastAPI server runs on a different host/port
const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8000"

// ── Hook ───────────────────────────────────────────────────────────────────

export function usePipeline() {
  const [state, setState] = useState<PipelineState>({
    status:   "idle",
    stage:    "",
    progress: 0,
    logs:     [],
    rows:     [],
    error:    null,
  })

  const jobIdRef  = useRef<string | null>(null)
  const esRef     = useRef<EventSource | null>(null)

  // ── helpers ──

  const patch = useCallback((partial: Partial<PipelineState>) =>
    setState(prev => ({ ...prev, ...partial })), [])

  const stopSSE = useCallback(() => {
    esRef.current?.close()
    esRef.current = null
  }, [])

  // ── start ────────────────────────────────────────────────────────────────

  const start = useCallback(async (config: PipelineConfig = {}) => {
    stopSSE()

    patch({ status: "running", stage: "Starting…", progress: 0, logs: [], rows: [], error: null })

    // 1. Kick off the job
    const res = await fetch(`${API_BASE}/api/generate/start`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        csv_path:        config.csvPath       ?? "data.csv",
        n_rows:          config.nRows         ?? 10,
        seed_fields:     config.seedFields    ?? {},
        skip_profiling:  config.skipProfiling ?? false,
        skip_embedding:  config.skipEmbedding ?? false,
        skip_indexing:   config.skipIndexing  ?? false,
        reset_index:     config.resetIndex    ?? false,
      }),
    })

    if (!res.ok) {
      patch({ status: "error", error: "Failed to start pipeline" })
      return
    }

    const { job_id } = await res.json()
    jobIdRef.current = job_id

    // 2. Subscribe to SSE progress stream
    const es = new EventSource(`${API_BASE}/api/generate/status?job_id=${job_id}`)
    esRef.current = es

    es.onmessage = (event) => {
      const data = JSON.parse(event.data)

      setState(prev => ({
        ...prev,
        status:   data.status   === "done"  ? "done"
                : data.status   === "error" ? "error"
                : "running",
        stage:    data.stage    ?? prev.stage,
        progress: data.progress ?? prev.progress,
        logs:     [...prev.logs, ...(data.new_logs ?? [])],
        error:    data.error    ?? null,
      }))

      if (data.status === "done") {
        stopSSE()
        fetchResults(job_id)
      }
      if (data.status === "error") {
        stopSSE()
      }
    }

    es.onerror = () => {
      patch({ status: "error", error: "Lost connection to pipeline server" })
      stopSSE()
    }
  }, [patch, stopSSE])

  // ── fetch results once done ───────────────────────────────────────────────

  const fetchResults = useCallback(async (job_id: string) => {
    const res = await fetch(`${API_BASE}/api/generate/results?job_id=${job_id}`)
    if (!res.ok) return
    const data = await res.json()
    patch({ rows: data.rows ?? [] })
  }, [patch])

  // ── download CSV ──────────────────────────────────────────────────────────

  const download = useCallback(() => {
    const job_id = jobIdRef.current
    if (!job_id) return
    window.open(`${API_BASE}/api/generate/download?job_id=${job_id}`, "_blank")
  }, [])

  // ── reset ─────────────────────────────────────────────────────────────────

  const reset = useCallback(() => {
    stopSSE()
    jobIdRef.current = null
    setState({ status: "idle", stage: "", progress: 0, logs: [], rows: [], error: null })
  }, [stopSSE])

  return {
    ...state,
    start,
    download,
    reset,
  }
}
