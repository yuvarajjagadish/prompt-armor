// src/components/remediation/RemediationPanel.tsx
"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { motion } from "framer-motion";

interface Remediation {
  issue: string;
  severity: "critical" | "high" | "medium" | "low";
  rootCause: string; // Detected pattern description
  suggestedFix: string[]; // List of mitigation steps
  beforePrompt: string;
  afterPrompt: string;
}

// Simple line‑by‑line diff – lines that differ get highlighted
const renderDiff = (before: string, after: string) => {
  const beforeLines = before.split("\n");
  const afterLines = after.split("\n");
  const max = Math.max(beforeLines.length, afterLines.length);
  const rows = [];
  for (let i = 0; i < max; i++) {
    const b = beforeLines[i] ?? "";
    const a = afterLines[i] ?? "";
    const changed = b !== a;
    rows.push(
      <div key={i} className="flex">
        <pre className={`w-1/2 p-1 text-xs rounded-l ${changed ? "bg-red-900/60" : "bg-zinc-900/30"}`}>
          {b}
        </pre>
        <pre className={`w-1/2 p-1 text-xs rounded-r ${changed ? "bg-green-900/60" : "bg-zinc-900/30"}`}>
          {a}
        </pre>
      </div>
    );
  }
  return rows;
};

export const RemediationPanel = ({ remediation }: { remediation: Remediation }) => {
  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    // could add toast notification
  };

  return (
    <motion.div
      className="glass gradient-border p-4 rounded-xl border border-zinc-800"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Card className="bg-transparent border-none">
        <CardHeader className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium text-cyan-300">{remediation.issue}</CardTitle>
            <Badge variant="outline" className={`px-2 py-0.5 text-xs rounded ${
              remediation.severity === "critical"
                ? "bg-red-500/20 text-red-400 border-red-500/30"
                : remediation.severity === "high"
                ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                : remediation.severity === "medium"
                ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                : "bg-cyan-500/20 text-cyan-400 border-cyan-500/30"
            }`}>{remediation.severity.toUpperCase()}</Badge>
          </div>
          <p className="text-xs text-zinc-400">Root Cause: {remediation.rootCause}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="text-sm font-semibold text-purple-400 mb-1">Suggested Mitigation</h4>
            <ul className="list-disc list-inside space-y-1 text-xs text-zinc-300">
              {remediation.suggestedFix.map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ul>
          </div>
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-purple-400 mb-2">Prompt Transformation</h4>
            <div className="overflow-x-auto border border-zinc-700 rounded-md">
              {renderDiff(remediation.beforePrompt, remediation.afterPrompt)}
            </div>
            <div className="flex gap-2 mt-2">
              <Button size="sm" variant="outline" onClick={() => copyToClipboard(remediation.beforePrompt)}>
                <Copy className="w-3 h-3 mr-1" /> Copy Original
              </Button>
              <Button size="sm" variant="outline" onClick={() => copyToClipboard(remediation.afterPrompt)}>
                <Copy className="w-3 h-3 mr-1" /> Copy Fixed
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
