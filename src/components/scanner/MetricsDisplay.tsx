"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, ShieldCheck, ShieldAlert, Cpu, Activity, Clock } from 'lucide-react';
import { ScannerSeverity } from '@/lib/scanner/analyzer';

interface MetricsDisplayProps {
  score: number; // 0 to 1
  severity: ScannerSeverity;
  findingsCount: number;
  scanTime?: string;
  isScanning: boolean;
}

export function MetricsDisplay({ score, severity, findingsCount, scanTime, isScanning }: MetricsDisplayProps) {
  const scorePercent = Math.round(score * 100);

  // Styling based on severity
  const getSeverityStyle = (sev: ScannerSeverity) => {
    switch (sev) {
      case 'critical':
        return {
          color: 'text-red-500',
          border: 'border-red-500/20',
          bg: 'bg-red-950/20',
          glow: 'shadow-[0_0_15px_rgba(239,68,68,0.15)]',
          badge: 'bg-red-500/20 text-red-400 border-red-500/30',
          gaugeColor: '#ef4444',
          label: 'CRITICAL WARNING',
          status: 'COMPROMISED'
        };
      case 'high':
        return {
          color: 'text-amber-500',
          border: 'border-amber-500/20',
          bg: 'bg-amber-950/20',
          glow: 'shadow-[0_0_15px_rgba(245,158,11,0.15)]',
          badge: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
          gaugeColor: '#f59e0b',
          label: 'HIGH THREAT',
          status: 'SUSPICIOUS'
        };
      case 'medium':
        return {
          color: 'text-yellow-500',
          border: 'border-yellow-500/20',
          bg: 'bg-yellow-950/20',
          glow: 'shadow-[0_0_15px_rgba(234,179,8,0.1)]',
          badge: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
          gaugeColor: '#eab308',
          label: 'MEDIUM SUSPICION',
          status: 'WARNING'
        };
      default:
        return {
          color: 'text-emerald-500',
          border: 'border-emerald-500/20',
          bg: 'bg-emerald-950/20',
          glow: 'shadow-[0_0_15px_rgba(16,185,129,0.15)]',
          badge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
          gaugeColor: '#10b981',
          label: 'SECURE CONTEXT',
          status: 'CLEAN'
        };
    }
  };

  const style = getSeverityStyle(severity);

  // SVG Gauge calculations
  const radius = 55;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score * circumference);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* 1. Gauge Display Card */}
      <Card className={`md:col-span-1 border border-zinc-800 bg-zinc-950/50 shadow-2xl relative overflow-hidden group ${isScanning ? 'opacity-60' : ''}`}>
        <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 blur-3xl pointer-events-none"></div>
        <CardHeader className="py-3 px-4 border-b border-zinc-800/80 flex flex-row items-center justify-between">
          <CardTitle className="text-[11px] font-mono tracking-widest text-zinc-500 uppercase flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-zinc-500" />
            Threat Risk Index
          </CardTitle>
          {!isScanning && (
            <Badge variant="outline" className={`text-[9px] font-mono py-0 px-1.5 border ${style.badge}`}>
              {style.label}
            </Badge>
          )}
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-6 gap-4">
          {/* Radial progress SVG */}
          <div className="relative w-36 h-36 flex items-center justify-center">
            {/* Background glowing circle */}
            <div className={`absolute w-28 h-28 rounded-full ${style.bg} ${style.glow} border ${style.border} flex items-center justify-center transition-all duration-300`}></div>
            
            <svg className="w-full h-full transform -rotate-90">
              {/* Background ring */}
              <circle
                cx="72"
                cy="72"
                r={radius}
                className="stroke-zinc-900"
                strokeWidth={strokeWidth}
                fill="transparent"
              />
              {/* Foreground progress ring */}
              <circle
                cx="72"
                cy="72"
                r={radius}
                stroke={isScanning ? '#27272a' : style.gaugeColor}
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={isScanning ? circumference * 0.75 : strokeDashoffset}
                className={`transition-all duration-700 ease-out ${isScanning ? 'animate-spin origin-[72px_72px]' : ''}`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center select-none">
              <span className={`text-3xl font-extrabold tracking-tighter font-mono ${isScanning ? 'text-zinc-600' : style.color}`}>
                {isScanning ? '--' : `${scorePercent}%`}
              </span>
              <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mt-0.5">RISK SCORE</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. System Status Overview */}
      <Card className="md:col-span-2 border border-zinc-800 bg-zinc-950/50 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-3xl pointer-events-none"></div>
        <CardHeader className="py-3 px-4 border-b border-zinc-800/80">
          <CardTitle className="text-[11px] font-mono tracking-widest text-zinc-500 uppercase flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-zinc-500" />
            Scanner Engine Status
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5">
          {/* Status Flag */}
          <div className="flex flex-col gap-1 border-b sm:border-b-0 sm:border-r border-zinc-900 pb-3 sm:pb-0 pr-3">
            <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider">GUARD STATUS</span>
            <div className="flex items-center gap-2 mt-1">
              {isScanning ? (
                <>
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-ping"></span>
                  <span className="text-sm font-mono text-cyan-400 font-semibold">SCANNING INPUT...</span>
                </>
              ) : findingsCount > 0 ? (
                <>
                  <ShieldAlert className={`w-5 h-5 ${style.color}`} />
                  <span className={`text-sm font-mono font-semibold ${style.color}`}>{style.status}</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5 text-emerald-500" />
                  <span className="text-sm font-mono text-emerald-500 font-semibold">SECURE / SHIELDED</span>
                </>
              )}
            </div>
            <p className="text-[11px] text-zinc-500 mt-2 font-mono leading-relaxed">
              {isScanning 
                ? 'Processing payload vectors against rule-based threat database...'
                : findingsCount > 0 
                  ? `Scanner flagged ${findingsCount} suspicious pattern(s). Input poses high threat vulnerability.`
                  : 'Zero threat signatures matched. Prompt safe to execute against target LLM agents.'}
            </p>
          </div>

          {/* Stats Metadata */}
          <div className="flex flex-col justify-between gap-3 pl-0 sm:pl-3">
            <div className="flex justify-between items-center border-b border-zinc-900 pb-1.5">
              <span className="text-[10px] font-mono text-zinc-500 uppercase flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-zinc-500" />
                Vulnerability Count
              </span>
              <span className={`text-xs font-mono font-semibold ${isScanning ? 'text-zinc-600' : findingsCount > 0 ? 'text-red-400' : 'text-zinc-400'}`}>
                {isScanning ? '--' : `${findingsCount} matches`}
              </span>
            </div>
            <div className="flex justify-between items-center border-b border-zinc-900 pb-1.5">
              <span className="text-[10px] font-mono text-zinc-500 uppercase flex items-center gap-1">
                <Clock className="w-3 h-3 text-zinc-500" />
                Scan Timestamp
              </span>
              <span className="text-xs font-mono text-zinc-400">
                {scanTime || '--:--:--'}
              </span>
            </div>
            <div className="flex justify-between items-center pb-0.5">
              <span className="text-[10px] font-mono text-zinc-500 uppercase">Detection Rules</span>
              <span className="text-xs font-mono text-emerald-500">50 rules loaded</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
