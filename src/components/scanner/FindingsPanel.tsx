"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion } from '@/components/ui/accordion';
import { FindingCard } from './FindingCard';
import { ScannerFinding } from '@/lib/scanner/analyzer';
import { ShieldCheck, ListFilter } from 'lucide-react';

interface FindingsPanelProps {
  findings: ScannerFinding[];
  isScanning: boolean;
}

export function FindingsPanel({ findings, isScanning }: FindingsPanelProps) {
  if (isScanning) return null;

  const hasFindings = findings.length > 0;

  return (
    <Card className="border border-zinc-800 bg-zinc-950/50 shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 blur-3xl pointer-events-none"></div>
      
      <CardHeader className="py-3.5 px-4 border-b border-zinc-800/80 flex flex-row items-center justify-between">
        <CardTitle className="text-[11px] font-mono tracking-widest text-zinc-500 uppercase flex items-center gap-1.5">
          <ListFilter className="w-3.5 h-3.5" />
          Vulnerability Details ({findings.length})
        </CardTitle>
        {hasFindings ? (
          <Badge variant="outline" className="bg-red-500/20 text-red-400 border border-red-500/30 text-[9px] font-mono uppercase tracking-wide">
            Vulnerabilities Found
          </Badge>
        ) : (
          <Badge variant="outline" className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-mono uppercase tracking-wide">
            System Safe
          </Badge>
        )}
      </CardHeader>

      <CardContent className="p-4">
        {!hasFindings ? (
          <div className="flex flex-col items-center justify-center py-12 text-center gap-2.5 select-none">
            <ShieldCheck className="w-11 h-11 text-emerald-500/30 animate-pulse" />
            <span className="text-xs font-mono text-zinc-300 tracking-wider">INPUT PAYLOAD IS SECURE</span>
            <p className="text-[10px] text-zinc-500 font-mono max-w-[250px] leading-relaxed">No matching deterministic threat signatures detected in user payload. Safe to parse against system endpoints.</p>
          </div>
        ) : (
          <Accordion className="w-full flex flex-col gap-2">
            {findings.map((finding, idx) => (
              <FindingCard 
                key={idx} 
                finding={finding} 
                index={idx} 
              />
            ))}
          </Accordion>
        )}
      </CardContent>
    </Card>
  );
}
