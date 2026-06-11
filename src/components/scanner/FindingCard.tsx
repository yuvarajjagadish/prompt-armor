"use client";

import React from 'react';
import { AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { ScannerFinding, ScannerCategory, ScannerSeverity } from '@/lib/scanner/analyzer';
import { AlertTriangle, HelpCircle } from 'lucide-react';

interface FindingCardProps {
  finding: ScannerFinding;
  index: number;
}

export function FindingCard({ finding, index }: FindingCardProps) {
  const getCategoryColor = (cat: ScannerCategory) => {
    switch (cat) {
      case 'injection': return 'text-orange-400 border-orange-500/30 bg-orange-950/20';
      case 'jailbreak': return 'text-red-400 border-red-500/30 bg-red-950/20';
      case 'leakage': return 'text-yellow-400 border-yellow-500/30 bg-yellow-950/20';
      case 'escalation': return 'text-purple-400 border-purple-500/30 bg-purple-950/20';
      case 'exfiltration': return 'text-pink-400 border-pink-500/30 bg-pink-950/20';
      default: return 'text-zinc-400 border-zinc-800 bg-zinc-900/40';
    }
  };

  const getSeverityBadge = (sev: ScannerSeverity) => {
    switch (sev) {
      case 'critical': return 'bg-red-950/40 text-red-400 border-red-500/30';
      case 'high': return 'bg-amber-950/40 text-amber-400 border-amber-500/30';
      case 'medium': return 'bg-yellow-950/40 text-yellow-400 border-yellow-500/30';
      default: return 'bg-emerald-950/40 text-emerald-400 border-emerald-500/30';
    }
  };

  const getRemediationForCategory = (cat: ScannerCategory): string => {
    switch (cat) {
      case 'injection':
        return 'Isolate untrusted inputs inside strict XML/JSON tags. Enforce system pre-prompts instructing the agent to never parse delimited data blocks as execution orders.';
      case 'jailbreak':
        return 'Add pre-inference filters sanitizing persona definitions. Configure a defensive system prompt that explicitly restricts simulated personas (like DAN) from executing tasks.';
      case 'leakage':
        return 'Never inject sensitive credentials directly into prompt contexts. Implement post-inference response filters to block output strings resembling initialization rules.';
      case 'escalation':
        return 'Isolate target tool definitions and restrict LLM operations to read-only tiers. Strip Linux shell scripting (sudo, root) or SQL codes from inputs before processing.';
      case 'exfiltration':
        return 'Strip markdown image tags ![]() or external URL references from model output structures to prevent silent exfiltration triggers to unauthorized domains.';
      default:
        return 'Regularly audit input prompts and monitor generated results for potential policy anomalies.';
    }
  };

  return (
    <AccordionItem
      value={`finding-${index}`}
      className="border border-zinc-800/60 rounded px-3.5 bg-zinc-900/20 hover:bg-zinc-900/40 transition-colors duration-200"
    >
      <AccordionTrigger className="hover:no-underline py-3">
        <div className="flex items-center gap-2.5 text-left">
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
          <div className="flex flex-col sm:flex-row sm:items-center gap-1.5">
            <span className="text-xs font-mono text-zinc-200 font-semibold">{finding.matchedPatternName}</span>
            <div className="flex gap-1.5 items-center">
              <Badge variant="outline" className={`text-[9px] font-mono border py-0 px-1.5 uppercase ${getCategoryColor(finding.category)}`}>
                {finding.category}
              </Badge>
              <Badge variant="outline" className={`text-[9px] font-mono border py-0 px-1.5 uppercase ${getSeverityBadge(finding.severity)}`}>
                {finding.severity}
              </Badge>
              <Badge variant="outline" className="text-[9px] font-mono border py-0 px-1.5 bg-zinc-900/60 text-cyan-400 border-zinc-800/60">
                CONF: {Math.round(finding.confidence * 100)}%
              </Badge>
            </div>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="pb-3.5 border-t border-zinc-800/40 pt-3 flex flex-col gap-3 font-mono">
        <div className="flex flex-col gap-1">
          <span className="text-[9px] text-zinc-500 uppercase font-semibold">Description</span>
          <p className="text-[11px] text-zinc-300 leading-relaxed">{finding.description}</p>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-[9px] text-zinc-500 uppercase font-semibold">Evidence Snippet</span>
          <div className="bg-zinc-950 border border-zinc-850 rounded p-2.5 text-[10px] text-red-400/90 overflow-x-auto select-all max-h-28 leading-relaxed whitespace-pre-wrap">
            <span className="text-zinc-600 select-none mr-2 font-bold uppercase">Match:</span>
            {finding.evidence}
          </div>
        </div>

        <div className="flex flex-col gap-1.5 border-t border-zinc-900/60 pt-3 mt-1">
          <span className="text-[9px] text-zinc-500 uppercase font-semibold flex items-center gap-1">
            <HelpCircle className="w-3 h-3 text-cyan-500" />
            Remediation Instruction
          </span>
          <p className="text-[11px] text-zinc-300 leading-relaxed bg-cyan-950/10 border border-cyan-950/30 p-2.5 rounded text-cyan-200">
            {getRemediationForCategory(finding.category)}
          </p>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
