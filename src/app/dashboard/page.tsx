"use client";

import React from 'react';
import Link from 'next/link';
import { RiskMetricCard } from '@/components/dashboard/RiskMetricCard';
import { ScanTimelineChart } from '@/components/dashboard/ScanTimelineChart';
import { VulnerabilityPieChart } from '@/components/dashboard/VulnerabilityPieChart';
import { 
  MOCK_THREAT_SUMMARY, 
  MOCK_CHART_DATA, 
  MOCK_DISTRIBUTION_DATA, 
  MOCK_AUDIT_LOGS 
} from '@/data/mock-data';
import { 
  Shield, 
  Terminal, 
  ShieldAlert, 
  Percent, 
  ActivitySquare, 
  History, 
  CheckCircle2, 
  XCircle 
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function SecurityDashboardPage() {

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'injection': return 'text-orange-400 border-orange-500/30 bg-orange-950/20';
      case 'jailbreak': return 'text-red-400 border-red-500/30 bg-red-950/20';
      case 'leakage': return 'text-yellow-400 border-yellow-500/30 bg-yellow-950/20';
      case 'escalation': return 'text-purple-400 border-purple-500/30 bg-purple-950/20';
      case 'exfiltration': return 'text-pink-400 border-pink-500/30 bg-pink-950/20';
      default: return 'text-zinc-500 border-zinc-800 bg-zinc-900/20';
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Grid Overlay */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#0c0c0e_1px,transparent_1px),linear-gradient(to_bottom,#0c0c0e_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none opacity-40"
        style={{ maskImage: 'radial-gradient(ellipse 60% 50% at 50% 0%, #000 70%, transparent 100%)', WebkitMaskImage: 'radial-gradient(ellipse 60% 50% at 50% 0%, #000 70%, transparent 100%)' }}
      ></div>

      {/* Cyber Header */}
      <header className="border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <Shield className="w-4.5 h-4.5 text-zinc-100 fill-current" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-widest text-zinc-100 uppercase">PromptArmor</h1>
            <p className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest leading-none mt-0.5">Vulnerability Guard v1.0.0</p>
          </div>
        </div>

        {/* Header Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-zinc-900/60 p-0.5 rounded border border-zinc-800/80 font-mono text-[10px]">
          <Link href="/">
            <span className="cursor-pointer px-3 py-1 rounded text-zinc-400 hover:text-zinc-200 transition-colors uppercase">
              Scanner Console
            </span>
          </Link>
          <Link href="/dashboard">
            <span className="cursor-pointer px-3 py-1 rounded bg-zinc-800 text-cyan-400 font-semibold border border-zinc-700/50 uppercase">
              Security Analytics
            </span>
          </Link>
          <Link href="/attacks">
            <span className="cursor-pointer px-3 py-1 rounded text-zinc-400 hover:text-zinc-200 transition-colors uppercase">
              Threat Flows
            </span>
          </Link>
        </nav>

        <div className="flex items-center gap-4 text-xs font-mono text-zinc-500">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            SYS_ONLINE
          </span>
          <span className="border-l border-zinc-800 pl-4 hidden sm:inline">SIGNATURES: 50 ACTIVE</span>
        </div>
      </header>

      {/* Workspace Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-8 flex flex-col gap-6 relative z-10">
        {/* Title Heading */}
        <div className="flex flex-col gap-1.5 border-l-2 border-cyan-500 pl-4 py-1.5">
          <h2 className="text-xl font-bold tracking-wider uppercase text-zinc-200">Security Command Center</h2>
          <p className="text-xs text-zinc-400 font-mono">Enterprise analytics monitoring prompt vulnerability logs, attack distributions, and risk indexes.</p>
        </div>

        {/* 4 KPI Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <RiskMetricCard 
            title="Total Scans Evaluation" 
            value={MOCK_THREAT_SUMMARY.totalScans.toLocaleString()} 
            description="PROMPTS PROCESSED (14d)" 
            trend={MOCK_THREAT_SUMMARY.scansTrend} 
            icon={<Terminal className="w-4 h-4" />}
            status="info"
          />
          <RiskMetricCard 
            title="High Risk Blocked" 
            value={MOCK_THREAT_SUMMARY.blockedAttacks.toLocaleString()} 
            description="ATTACKS DEFLATED" 
            trend={MOCK_THREAT_SUMMARY.attacksTrend} 
            icon={<ShieldAlert className="w-4 h-4 text-red-400" />}
            status="error"
          />
          <RiskMetricCard 
            title="Vulnerability Rate" 
            value={`${MOCK_THREAT_SUMMARY.vulnerabilityRate}%`} 
            description="INCURSION FREQUENCY RATIO" 
            trend={MOCK_THREAT_SUMMARY.rateTrend} 
            icon={<Percent className="w-4 h-4 text-orange-400" />}
            status="warning"
          />
          <RiskMetricCard 
            title="Average Risk Score" 
            value={MOCK_THREAT_SUMMARY.averageRiskScore} 
            description="AGGREGATE EXPOSURE INDEX" 
            trend={MOCK_THREAT_SUMMARY.riskTrend} 
            icon={<ActivitySquare className="w-4 h-4 text-emerald-400" />}
            status="success"
          />
        </div>

        {/* Timeline Area & Pie Distribution Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ScanTimelineChart data={MOCK_CHART_DATA} />
          </div>
          <div className="lg:col-span-1">
            <VulnerabilityPieChart data={MOCK_DISTRIBUTION_DATA} />
          </div>
        </div>

        {/* Recent Audit Log Feed */}
        <Card className="border border-zinc-800 bg-zinc-950/50 shadow-2xl relative">
          <CardHeader className="py-3 px-5 border-b border-zinc-800/80">
            <CardTitle className="text-[11px] font-mono tracking-widest text-zinc-500 uppercase flex items-center gap-2">
              <History className="w-3.5 h-3.5 text-cyan-400" />
              Recent Security Audit Logs
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full border-collapse text-left font-mono text-[11px]">
              <thead>
                <tr className="border-b border-zinc-900 bg-zinc-900/20 text-zinc-500 uppercase select-none">
                  <th className="py-3 px-4 font-semibold">Log ID</th>
                  <th className="py-3 px-4 font-semibold">Timestamp</th>
                  <th className="py-3 px-4 font-semibold">User Prompt Preview</th>
                  <th className="py-3 px-4 font-semibold">Threat Classification</th>
                  <th className="py-3 px-4 font-semibold text-center">Risk</th>
                  <th className="py-3 px-4 font-semibold text-right">Guard Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900/60">
                {MOCK_AUDIT_LOGS.map((log) => (
                  <tr key={log.id} className="hover:bg-zinc-900/20 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-zinc-400">{log.id}</td>
                    <td className="py-3.5 px-4 text-zinc-500">{log.timestamp}</td>
                    <td className="py-3.5 px-4 text-zinc-300 max-w-xs truncate">{log.promptPreview}</td>
                    <td className="py-3.5 px-4">
                      <Badge variant="outline" className={`text-[9px] border uppercase py-0.5 px-1.5 ${getCategoryColor(log.category)}`}>
                        {log.category}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-zinc-300">
                      {log.riskScore.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded border text-[9px] font-bold ${
                        log.status === 'BLOCKED'
                          ? 'border-red-500/20 text-red-400 bg-red-950/20'
                          : 'border-emerald-500/20 text-emerald-400 bg-emerald-950/20'
                      }`}>
                        {log.status === 'BLOCKED' ? (
                          <>
                            <XCircle className="w-3 h-3 shrink-0" />
                            BLOCKED
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-3 h-3 shrink-0" />
                            ALLOWED
                          </>
                        )}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </main>

      {/* Status Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950/80 px-6 py-3.5 text-center flex flex-col sm:flex-row items-center justify-between text-[10px] font-mono text-zinc-600 gap-2 select-none mt-auto">
        <div>PROMPTARMOR SECURITY HUBS // SECURITY CONTROL</div>
        <div className="flex items-center gap-4">
          <span>ALGORITHM: REALTIME INTEGRATION METRICS</span>
          <span className="border-l border-zinc-800 pl-4">STATUS: INTRUSION_DETECTION_SHIELDED</span>
        </div>
      </footer>
    </div>
  );
}
