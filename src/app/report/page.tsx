/*
  Security Findings Report Page
  -------------------------------------------------
  Generates a professional penetration‑testing style report after a scan.
  Includes overall risk, threat summary, findings list, risk breakdown chart,
  attack timeline, executive summary and technical details.
*/

"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, ClipboardCopy } from "lucide-react";
import { motion } from "framer-motion";
import { ScannerFinding } from "@/lib/scanner/analyzer";

interface ScanData {
  prompt: string;
  findings: ScannerFinding[];
  riskScore: number;
  timestamp: string;
}

export default function SecurityReportPage() {
  const [data, setData] = useState<ScanData | null>(null);

  // Load the last scan from localStorage (same key used elsewhere)
  useEffect(() => {
    try {
      const raw = localStorage.getItem("promptarmor_last_scan");
      if (raw) {
        const parsed = JSON.parse(raw);
        setData({
          prompt: parsed.prompt ?? "",
          findings: parsed.findings ?? [],
          riskScore: parsed.riskScore ?? 0,
          timestamp: parsed.timestamp ?? new Date().toLocaleString(),
        });
      }
    } catch (e) {
      console.error("Failed to load scan data", e);
    }
  }, []);

  // Helper to count findings per severity/category
  const severityCount = (sev: string) =>
    data?.findings.filter((f) => f.severity?.toLowerCase() === sev.toLowerCase()).length || 0;
  const categoryCount = (cat: string) =>
    data?.findings.filter((f) => f.category?.toLowerCase() === cat.toLowerCase()).length || 0;

  // Download printable version (simple print)
  const handleDownload = () => {
    window.print();
  };

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-950 text-zinc-100">
        <p className="text-lg">No scan data available. Run a scan first.</p>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-zinc-950 text-zinc-100 p-6 flex flex-col items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <header className="w-full max-w-5xl mb-8 flex items-center justify-between glass gradient-border p-4 rounded-xl">
        <h1 className="text-2xl font-bold text-cyan-400">PromptArmor Security Findings Report</h1>
        <Button onClick={handleDownload} className="flex items-center gap-2 bg-cyan-500/20 hover:bg-cyan-500/30 border-cyan-500/30 text-cyan-400">
          <Download className="w-4 h-4" /> Download PDF
        </Button>
      </header>

      {/* Executive Summary */}
      <section className="w-full max-w-5xl mb-6 glass gradient-border p-6 rounded-xl">
        <h2 className="text-xl font-semibold text-purple-400 mb-3">Executive Summary</h2>
        <p className="text-sm text-zinc-300 mb-2">{data.timestamp}</p>
        <p className="text-base text-zinc-200">The scan evaluated the supplied prompt against a comprehensive threat model. Overall risk is computed based on severity and confidence of detected vulnerabilities.</p>
        <div className="mt-4 flex items-center gap-4">
          <Badge variant="outline" className="bg-red-500/20 text-red-400 border-red-500/30">
            Overall Risk Score: {data.riskScore.toFixed(2)}
          </Badge>
        </div>
      </section>

      {/* Risk Breakdown Chart (placeholder) */}
      <section className="w-full max-w-5xl mb-6 glass gradient-border p-6 rounded-xl">
        <h2 className="text-xl font-semibold text-purple-400 mb-3">Risk Breakdown</h2>
        <div className="h-48 bg-zinc-900/50 flex items-center justify-center text-zinc-500 italic">
          {/* In a real implementation this would be a chart (e.g., Chart.js, Recharts) */}
          Risk Breakdown Chart Placeholder
        </div>
      </section>

      {/* Attack Timeline (placeholder) */}
      <section className="w-full max-w-5xl mb-6 glass gradient-border p-6 rounded-xl">
        <h2 className="text-xl font-semibold text-purple-400 mb-3">Attack Timeline</h2>
        <div className="h-32 bg-zinc-900/50 flex items-center justify-center text-zinc-500 italic">
          Timeline visualization placeholder
        </div>
      </section>

      {/* Threat Summary */}
      <section className="w-full max-w-5xl mb-6 glass gradient-border p-6 rounded-xl">
        <h2 className="text-xl font-semibold text-purple-400 mb-3">Threat Summary</h2>
        <ul className="list-disc list-inside text-sm text-zinc-300 space-y-1">
          {[
            "Prompt Injection",
            "Jailbreak",
            "System Prompt Leakage",
            "Data Exfiltration",
            "Agent Abuse",
          ].map((t) => (
            <li key={t}>{t}: {categoryCount(t)} instance{categoryCount(t) !== 1 && "s"}</li>
          ))}
        </ul>
      </section>

      {/* Detailed Findings */}
      <section className="w-full max-w-5xl mb-8 glass gradient-border p-6 rounded-xl">
        <h2 className="text-xl font-semibold text-purple-400 mb-4">Technical Findings</h2>
        {data.findings.length === 0 ? (
          <p className="text-zinc-400">No vulnerabilities detected.</p>
        ) : (
          data.findings.map((f) => (
            <Card key={f.id} className="mb-4 bg-card/60 border border-zinc-800 glass">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-mono text-zinc-200">{f.matchedPatternName}</CardTitle>
                <Badge variant="outline" className={`px-2 py-0.5 text-xs rounded ${
                  f.severity === "critical"
                    ? "bg-red-500/20 text-red-400 border-red-500/30"
                    : f.severity === "high"
                    ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                    : "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                }`}>
                  {f.severity?.toUpperCase()}
                </Badge>
              </CardHeader>
              <CardContent className="text-xs text-zinc-300 space-y-2">
                <p><span className="font-medium text-zinc-200">Category:</span> {f.category}</p>
                <p><span className="font-medium text-zinc-200">Confidence:</span> {(f.confidence * 100).toFixed(1)}%</p>
                <p><span className="font-medium text-zinc-200">Evidence:</span> {f.evidence}</p>
                <p><span className="font-medium text-zinc-200">Impact:</span> {f.description}</p>
                <p><span className="font-medium text-zinc-200">Recommendation:</span> Review prompt sanitization and apply rule‑based filters.</p>
              </CardContent>
            </Card>
          ))
        )}
      </section>

      {/* Footer with download note */}
      <footer className="text-xs text-zinc-600 mt-8">
        Generated by PromptArmor • © 2026 PromptArmor™ All rights reserved.
      </footer>
    </motion.div>
  );
}
