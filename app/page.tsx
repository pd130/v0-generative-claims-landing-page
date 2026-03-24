"use client"
import { usePipeline } from "@/hooks/usePipeline"
import { motion, AnimatePresence } from "framer-motion"
import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { StatsSection } from "@/components/stats-section"
import { Particles } from "@/components/particles"

export default function LandingPage() {
  const { status, stage, progress, logs, rows, error, start, download, reset } = usePipeline()

  return (
    <main className="relative min-h-screen overflow-hidden">

      {/* Animated gradient background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-background" />
        <div className="absolute top-0 left-0 w-full h-full">
          <motion.div
            animate={{ scale: [1, 1.2, 1], x: [0, 50, 0], y: [0, 30, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-gradient-to-br from-primary/40 to-primary/10 blur-3xl"
          />
          <motion.div
            animate={{ scale: [1, 1.1, 1], x: [0, -30, 0], y: [0, 50, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-bl from-accent/40 to-accent/10 blur-3xl"
          />
          <motion.div
            animate={{ scale: [1, 1.3, 1], x: [0, 40, 0], y: [0, -40, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 4 }}
            className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] rounded-full bg-gradient-to-tr from-primary/30 via-accent/20 to-transparent blur-3xl"
          />
        </div>
        <Particles count={40} />
      </div>

      {/* Content */}
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <StatsSection />

      {/* Footer CTA */}
      <section className="relative py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ready to Transform Your Data?
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
              Join leading insurance companies using Generative Claims for compliant synthetic data generation.
            </p>

            {/* ── Generate button ───────────────────────────────────────── */}
            <motion.button
              onClick={() => status === "done" ? reset() : start({ nRows: 10 })}
              disabled={status === "running"}
              whileHover={{ scale: status === "running" ? 1 : 1.05 }}
              whileTap={{ scale: status === "running" ? 1 : 0.95 }}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold text-lg shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {status === "idle"    && "Get Started Free"}
              {status === "running" && `${stage || "Starting"}… ${progress}%`}
              {status === "done"    && "Generate Again"}
              {status === "error"   && "Retry"}
            </motion.button>

            {/* ── Progress bar ──────────────────────────────────────────── */}
            <AnimatePresence>
              {status === "running" && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-6 max-w-md mx-auto"
                >
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                      initial={{ width: "0%" }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">{stage}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Error message ─────────────────────────────────────────── */}
            <AnimatePresence>
              {status === "error" && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mt-4 text-sm text-red-500"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            {/* ── Live log panel ────────────────────────────────────────── */}
            <AnimatePresence>
              {(status === "running" || status === "done") && logs.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6 max-w-xl mx-auto text-left bg-muted/50 border border-border rounded-xl p-4 overflow-y-auto max-h-40"
                >
                  {logs.map((line, i) => (
                    <p key={i} className="text-xs text-muted-foreground font-mono leading-5">
                      {line}
                    </p>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Results summary + download ────────────────────────────── */}
            <AnimatePresence>
              {status === "done" && rows.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-8 space-y-4"
                >
                  <p className="text-muted-foreground text-sm">
                    ✓ {rows.length} synthetic rows generated
                  </p>

                  {/* Results table (first 5 rows preview) */}
                  <div className="overflow-x-auto rounded-xl border border-border">
                    <table className="w-full text-xs text-left">
                      <thead>
                        <tr className="bg-muted/60">
                          {Object.keys(rows[0]).map((col) => (
                            <th key={col} className="px-3 py-2 text-muted-foreground font-medium whitespace-nowrap">
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {rows.slice(0, 5).map((row, i) => (
                          <tr key={i} className="border-t border-border hover:bg-muted/30 transition-colors">
                            {Object.values(row).map((val, j) => (
                              <td key={j} className="px-3 py-2 text-foreground whitespace-nowrap">
                                {String(val)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {rows.length > 5 && (
                      <p className="text-xs text-muted-foreground text-center py-2">
                        + {rows.length - 5} more rows
                      </p>
                    )}
                  </div>

                  {/* Download button */}
                  <motion.button
                    onClick={download}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="px-6 py-3 rounded-xl border border-primary text-primary font-semibold text-sm hover:bg-primary/10 transition-all duration-200"
                  >
                    Download CSV
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-8 px-4 border-t border-border">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2026 Generative Claims. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {["Privacy", "Terms", "Contact"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </footer>

    </main>
  )
}
