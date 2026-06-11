"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Sparkles, AlertTriangle, HelpCircle, Activity } from 'lucide-react';
import { AIJudgeResponse } from '@/app/api/judge/route';

interface AIJudgePanelProps {
  result: AIJudgeResponse | null;
  isLoading: boolean;
  error: string | null;
}

const LOADING_STEPS = [
  'BOOTING SEMANTIC COGNITIVE ENGINE...',
  'EXTRACTING PROMPT CHARACTER VECTORS...',
  'CORRELATING SCANNER THREAT SIGNATURES...',
  'QUERYING CLAUDE SECURITY MODELS...',
  'CALCULATING ATTACK PROBABILITY PROFILE...',
  'GENERATING SECURE PLAYBOOK RECOMMENDATIONS...'
];

export function AIJudgePanel({ result, isLoading, error }: AIJudgePanelProps) {
  const [loadingStepIdx, setLoadingStepIdx] = useState(0);

  // Rotate loading steps for cyberpunk terminal effect
  useEffect(() => {
    if (!isLoading) {
      setLoadingStepIdx(0);
      return;
    }
    const interval = setInterval(() => {
      setLoadingStepIdx((prev) => (prev + 1) % LOADING_STEPS.length);
    }, 1500);
    return () => clearInterval(interval);
  }, [isLoading]);

  if (!isLoading && !result && !error) {
    return null;
  }

  // Determine styling based on AI Risk Assessment
  const getRiskStyle = (risk?: 'low' | 'medium' | 'high' | 'critical') => {
    switch (risk) {
      case 'critical':
        return {
          color: 'text-red-500',
          border: 'border-red-500/30',
          bg: 'bg-red-950/20',
          badge: 'bg-red-500/20 text-red-400 border-red-500/30',
          progressBar: 'bg-gradient-to-r from-red-600 to-red-400 shadow-[0_0_10px_rgba(239,68,68,0.5)]',
          label: 'CRITICAL SECURITY THREAT',
        };
      case 'high':
        return {
          color: 'text-orange-500',
          border: 'border-orange-500/30',
          bg: 'bg-orange-950/20',
          badge: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
          progressBar: 'bg-gradient-to-r from-orange-600 to-orange-400 shadow-[0_0_10px_rgba(249,115,22,0.5)]',
          label: 'HIGH THREAT POTENTIAL',
        };
      case 'medium':
        return {
          color: 'text-yellow-500',
          border: 'border-yellow-500/30',
          bg: 'bg-yellow-950/20',
          badge: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
          progressBar: 'bg-gradient-to-r from-yellow-500 to-yellow-400 shadow-[0_0_10px_rgba(234,179,8,0.5)]',
          label: 'SUSPICIOUS SEGMENT DETECTED',
        };
      default:
        return {
          color: 'text-emerald-500',
          border: 'border-emerald-500/30',
          bg: 'bg-emerald-950/20',
          badge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
          progressBar: 'bg-gradient-to-r from-emerald-600 to-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]',
          label: 'PROMPT ALIGNED & SAFE',
        };
    }
  };

  const riskStyle = getRiskStyle(result?.riskAssessment);

  return (
    <Card className="border border-zinc-800 bg-zinc-950/50 shadow-2xl relative overflow-hidden group min-h-[400px] flex flex-col">
      {/* Neon Cyber Glow Accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl pointer-events-none"></div>

      <CardHeader className="py-3.5 px-4 border-b border-zinc-800/80 flex flex-row items-center justify-between shrink-0">
        <CardTitle className="text-[11px] font-mono tracking-widest text-zinc-500 uppercase flex items-center gap-1.5">
          <Brain className="w-3.5 h-3.5 text-indigo-400" />
          AI Security Judge (Claude Analysis)
        </CardTitle>
        
        {/* Status badges showing if simulated or real live API model */}
        {!isLoading && result && (
          <div className="flex items-center gap-1.5">
            {result.simulated ? (
              <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[9px] font-mono uppercase tracking-wider">
                Simulated
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[9px] font-mono uppercase tracking-wider flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-indigo-400 animate-pulse"></span>
                Claude Live
              </Badge>
            )}
          </div>
        )}
      </CardHeader>

      <CardContent className="p-4 flex-1 flex flex-col justify-start">
        {/* LOADING STATE */}
        {isLoading && (
          <div className="flex-1 flex flex-col items-center justify-center py-16 gap-4 text-center font-mono">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin"></div>
              <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[11px] text-zinc-300 font-bold tracking-wider animate-pulse">
                RUNNING COGNITIVE EVALUATION...
              </span>
              <span className="text-[9px] text-zinc-500">
                {LOADING_STEPS[loadingStepIdx]}
              </span>
            </div>
          </div>
        )}

        {/* ERROR STATE */}
        {error && !isLoading && (
          <div className="flex-1 flex flex-col items-center justify-center py-16 text-center gap-3 font-mono">
            <AlertTriangle className="w-10 h-10 text-red-500/60" />
            <div className="flex flex-col gap-1">
              <span className="text-[11px] text-red-400 font-bold uppercase">Judge Analysis Failed</span>
              <p className="text-[10px] text-zinc-500 max-w-[280px] leading-relaxed">
                {error || 'Unable to connect to prompt analysis server. Check backend logs or API keys.'}
              </p>
            </div>
          </div>
        )}

        {/* DATA RESULTS STATE */}
        {result && !isLoading && !error && (
          <div className="flex flex-col gap-5 flex-1 font-mono">
            {/* Risk Index Overview Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-zinc-900 pb-4">
              <div className="flex flex-col gap-1 border-r border-zinc-900 pr-2">
                <span className="text-[9px] text-zinc-500 uppercase font-semibold">Risk Classification</span>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className={`text-[10px] font-bold border py-0.5 px-2 uppercase ${riskStyle.badge}`}>
                    {result.riskAssessment}
                  </Badge>
                </div>
                <span className="text-[9px] text-zinc-500/80 mt-1">{riskStyle.label}</span>
              </div>

              {/* Attack Success Probability Gauge */}
              <div className="flex flex-col gap-1.5 justify-center">
                <div className="flex justify-between items-center text-[9px] font-semibold text-zinc-500">
                  <span className="uppercase">Attack Success Prob</span>
                  <span className={riskStyle.color}>{result.attackSuccessProbability}%</span>
                </div>
                <div className="w-full bg-zinc-900 border border-zinc-800/80 rounded-full h-3 overflow-hidden p-[2px] mt-0.5">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ease-out ${riskStyle.progressBar}`}
                    style={{ width: `${result.attackSuccessProbability}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Additional Vulnerabilities Detected by LLM Judge */}
            <div className="flex flex-col gap-2">
              <span className="text-[9px] text-zinc-500 uppercase font-semibold flex items-center gap-1">
                <Activity className="w-3.5 h-3.5 text-indigo-400" />
                Additional Semantic Vulnerabilities
              </span>
              {result.additionalVulnerabilities && result.additionalVulnerabilities.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {result.additionalVulnerabilities.map((vuln, idx) => (
                    <Badge 
                      key={idx} 
                      variant="outline" 
                      className="bg-indigo-950/20 text-indigo-300 border border-indigo-500/20 text-[9px] font-mono py-0.5 px-2"
                    >
                      [+] {vuln}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-[10px] text-zinc-500 leading-relaxed italic">
                  No additional semantic vulnerabilities detected beyond deterministic patterns.
                </p>
              )}
            </div>

            {/* Detailed Security Explanation */}
            <div className="flex flex-col gap-2 flex-1 border-t border-zinc-900 pt-4 mt-1">
              <span className="text-[9px] text-zinc-500 uppercase font-semibold flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
                AI Security Explanation
              </span>
              <div className="bg-zinc-950/80 border border-zinc-900 rounded p-3 text-[11px] leading-relaxed text-zinc-300 max-h-60 overflow-y-auto whitespace-pre-wrap select-text scrollbar-thin">
                {result.securityExplanation}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
