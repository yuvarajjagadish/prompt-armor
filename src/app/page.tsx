"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MotionWrapper } from '@/components/motion/MotionWrapper';
import { MotionButton } from '@/components/motion/MotionButton';
import { fadeUp } from '@/components/motion/variants';
import CredibilityMetrics from '@/components/hero/CredibilityMetrics';
import ProductPreview from '@/components/hero/ProductPreview';
import { ScannerConsole } from '@/components/scanner/ScannerConsole';
import { MetricsDisplay } from '@/components/scanner/MetricsDisplay';
import { FindingsPanel } from '@/components/scanner/FindingsPanel';
import { AIJudgePanel } from '@/components/scanner/AIJudgePanel';
import { analyzePrompt, ScannerResult } from '@/lib/scanner/analyzer';
import { AIJudgeResponse } from '@/app/api/judge/route';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Terminal, 
  Shield, 
  HelpCircle, 
  Brain, 
  ShieldAlert, 
  Cpu, 
  Database, 
  Play, 
  ArrowUpRight, 
  Sparkles 
} from 'lucide-react';

interface ThreatLog {
  timestamp: string;
  target: string;
  vector: string;
  status: 'BLOCKED' | 'SANITIZED' | 'FLAGGED';
  details: string;
}

const INITIAL_THREAT_LOGS: ThreatLog[] = [
  { timestamp: '19:10:45', target: 'CustomerAgent-v4', vector: 'DAN Persona Jailbreak', status: 'BLOCKED', details: 'Attempt to force rule override and disable safety filters.' },
  { timestamp: '19:09:12', target: 'KB-RetrievalEngine', vector: 'Indirect RAG Injection', status: 'SANITIZED', details: 'Unstructured source document contained remote text bypass delimiters.' },
  { timestamp: '19:07:33', target: 'AdminConsoleExec', vector: 'Privilege Escalation', status: 'BLOCKED', details: 'Detected root privileges simulation command (sudo cat /etc/shadow).' },
  { timestamp: '19:05:01', target: 'SlackIntegrationAPI', vector: 'Data Exfiltration', status: 'FLAGGED', details: 'Payload requested environment variables siphoned to markdown image URL.' }
];

const MOCK_VECTORS = [
  { target: 'FinancialAssistant-Pro', vector: 'Prompt Injection', status: 'BLOCKED' as const, details: 'Instruction injection attempting to hijack output formatting.' },
  { target: 'LegalDocumentSummarizer', vector: 'System Prompt Leakage', status: 'FLAGGED' as const, details: 'Probe querying initialization instructions verbatim.' },
  { target: 'GitBot-Compiler', vector: 'Agent Abuse', status: 'BLOCKED' as const, details: 'Command execution trigger attempting system sandbox escape.' },
  { target: 'E-commerceSearch-V2', vector: 'RAG Poisoning', status: 'SANITIZED' as const, details: 'Search results contained delimiters trying to reset prompt context.' }
];

export default function PromptScannerPage() {
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<ScannerResult | null>(null);
  const [scanTime, setScanTime] = useState<string | undefined>(undefined);
  const [scanLogs, setScanLogs] = useState<string[]>([]);
  
  // AI Security Judge states
  const [judgeResult, setJudgeResult] = useState<AIJudgeResponse | null>(null);
  const [isJudgeLoading, setIsJudgeLoading] = useState(false);
  const [judgeError, setJudgeError] = useState<string | null>(null);

  // Interactive UI states
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const scannerRef = useRef<HTMLDivElement>(null);
  const [threatLogs, setThreatLogs] = useState<ThreatLog[]>(INITIAL_THREAT_LOGS);

  // Ticker timer for the Live Threat Feed
  useEffect(() => {
    const interval = setInterval(() => {
      const time = new Date().toLocaleTimeString('en-US', { hour12: false });
      const randomVector = MOCK_VECTORS[Math.floor(Math.random() * MOCK_VECTORS.length)];
      const newLog: ThreatLog = {
        timestamp: time,
        ...randomVector
      };
      setThreatLogs(prev => [newLog, ...prev.slice(0, 3)]);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const scrollToScanner = () => {
    scannerRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScan = (prompt: string) => {
    setIsScanning(true);
    setResult(null);
    setScanLogs([]);
    setJudgeResult(null);
    setJudgeError(null);
    setIsJudgeLoading(false);

    // Simulating advanced security scan logs for terminal effect
    const logs = [
      'LOAD PROTOCOL: HEURISTIC_PARSER_ACTIVE',
      'ISOLATING USER PAYLOAD FOR SANITIZATION...',
      'INTERSECTING INPUT STRING ON 50 ATTACK VECTORS...',
      'SCANNING INJECTIONS, JAILBREAK PERSONAS, LEAKS, ESCALATIONS, EXFILTRATIONS...',
      'CALCULATING RISKS RATIO & RESOLVING RECOMMENDATIONS...'
    ];

    logs.forEach((log, index) => {
      setTimeout(() => {
        setScanLogs(prev => [...prev, log]);
      }, (index + 1) * 200);
    });

    setTimeout(() => {
      const scanResult = analyzePrompt(prompt);
      
      try {
        localStorage.setItem('promptarmor_last_scan', JSON.stringify({
          prompt,
          findings: scanResult.findings,
          timestamp: new Date().toLocaleTimeString(),
          riskScore: scanResult.riskScore
        }));
      } catch (err) {
        console.error('Failed to cache scan results', err);
      }

      setResult(scanResult);
      setScanTime(new Date().toLocaleTimeString());
      setIsScanning(false);

      // Trigger AI Security Judge analysis in parallel
      setIsJudgeLoading(true);
      fetch('/api/judge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          findings: scanResult.findings,
        }),
      })
        .then(async (res) => {
          if (!res.ok) {
            throw new Error(await res.text() || 'Failed to fetch AI Judge response');
          }
          return res.json();
        })
        .then((data) => {
          setJudgeResult(data);
        })
        .catch((err) => {
          console.error('AI Security Judge error:', err);
          setJudgeError(err.message || 'API request failed.');
        })
        .finally(() => {
          setIsJudgeLoading(false);
        });
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#050816] text-zinc-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200 relative overflow-hidden">
      {/* Background Volumetric Glow & Cinematic Beam Overlay */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[350px] md:w-[700px] h-[700px] cinematic-light-beam pointer-events-none z-0"></div>
      <div className="absolute top-[-15%] left-[-10%] w-[55%] h-[45%] bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.08)_0%,transparent_70%)] pointer-events-none z-0"></div>
      <div className="absolute top-[25%] right-[-10%] w-[50%] h-[40%] bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.06)_0%,transparent_75%)] pointer-events-none z-0"></div>

      {/* Floating particles */}
      <div className="absolute top-48 left-[12%] w-1.5 h-1.5 bg-cyan-400/35 rounded-full blur-[1px] animate-particle-1 pointer-events-none z-0"></div>
      <div className="absolute top-96 right-[18%] w-2.5 h-2.5 bg-indigo-400/25 rounded-full blur-[1px] animate-particle-2 pointer-events-none z-0"></div>
      <div className="absolute top-[500px] left-[25%] w-1 h-1 bg-purple-400/30 rounded-full blur-[1px] animate-particle-3 pointer-events-none z-0"></div>
      <div className="absolute top-80 right-[8%] w-1.5 h-1.5 bg-cyan-500/25 rounded-full blur-[1px] animate-particle-4 pointer-events-none z-0"></div>

      {/* Cybernetic Glow Header */}
      <header className="border-b border-zinc-900 bg-[#050816]/75 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <Shield className="w-4.5 h-4.5 text-zinc-100 fill-current" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-widest text-zinc-100 uppercase">PromptArmor</h1>
            <p className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest leading-none mt-0.5">Red Team Engine v1.1.0</p>
          </div>
        </div>

        {/* Header Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-zinc-900/60 p-0.5 rounded border border-zinc-800/80 font-mono text-[10px]">
          <Link href="/">
            <span className="cursor-pointer px-3 py-1 rounded bg-zinc-800 text-cyan-400 font-semibold border border-zinc-700/50 uppercase">
              Scanner Console
            </span>
          </Link>
          <Link href="/dashboard">
            <span className="cursor-pointer px-3 py-1 rounded text-zinc-400 hover:text-zinc-200 transition-colors uppercase">
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
          <span className="border-l border-zinc-800 pl-4">SIGNATURES: 50 ACTIVE</span>
        </div>
      </header>

      {/* Main Workspace Scroll View */}
      <main className="flex-1 flex flex-col w-full relative z-10">
        
        {/* A. HERO SECTION */}
        <MotionWrapper>
  <section className="py-6 md:py-8 flex flex-col lg:flex-row items-center text-center lg:text-left px-6 max-w-7xl mx-auto relative z-10 gap-4">
    {/* Left text block */}
    <div className="flex-1">
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex items-center gap-2 bg-cyan-950/20 border border-cyan-500/25 px-3.5 py-1 rounded-full text-[10px] font-mono text-cyan-400 uppercase tracking-widest mb-4 animate-pulse shadow-[0_0_15px_rgba(6,182,212,0.1)]">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
        ENTERPRISE RED TEAM PLATFORM // SECURED ACTIVE SHIELD
      </motion.div>

      <motion.h2 variants={fadeUp} initial="hidden" animate="visible" className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white uppercase leading-[1.1] font-sans">
        AI Red Teaming <br />
        <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent">
          Platform
        </span>
      </motion.h2>

      <motion.p variants={fadeUp} initial="hidden" animate="visible" className="text-sm sm:text-base text-zinc-400 font-sans max-w-2xl leading-relaxed mt-4">
        Test LLM applications against prompt injection, jailbreaks, system prompt leaks, agent abuse, and RAG attacks.
      </motion.p>

      <div className="flex flex-col sm:flex-row gap-3 mt-6 justify-center lg:justify-start w-full sm:w-auto font-mono">
        <MotionButton
          onClick={scrollToScanner}
          className="bg-cyan-950 border border-cyan-500/40 hover:bg-cyan-900/80 hover:border-cyan-400 text-cyan-200 shadow-[0_0_25px_rgba(6,182,212,0.25)] h-10 px-6 rounded-lg text-xs tracking-widest uppercase font-semibold transition-all duration-300 active:scale-95"
        >
          Start Security Scan
        </MotionButton>
        <MotionButton
          onClick={() => setIsDemoModalOpen(true)}
          className="bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white h-10 px-6 rounded-lg text-xs tracking-widest uppercase font-semibold transition-all duration-300 active:scale-95 flex items-center justify-center gap-2"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          Watch Demo
        </MotionButton>
      </div>

      {/* Credibility metrics directly below CTA */}
      <CredibilityMetrics />
    </div>

    {/* Right product preview */}
    <div className="flex-1 w-full max-w-md">
      <div className="gradient-border rounded-xl overflow-hidden">
        <ProductPreview />
      </div>
    </div>
  </section>
</MotionWrapper>

        {/* B. ENTERPRISE TRUST LOGOS */}
        <div className="w-full border-y border-zinc-900/60 bg-[#050816]/30 backdrop-blur-sm py-8 relative z-10 select-none">
          <div className="max-w-6xl mx-auto px-6 flex flex-col items-center gap-4">
            <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase">
              TRUSTED BY SECURITY TEAMS AT LEADING AI ENTERPRISES
            </span>
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14 mt-2">
              {['Acme AI', 'Apex Security', 'Vertex Labs', 'Vector Dynamics', 'Aegis Corp'].map((logo, idx) => (
                <span key={idx} className="text-zinc-500 hover:text-zinc-400 text-xs md:text-sm font-extrabold tracking-widest uppercase transition-colors opacity-40 hover:opacity-75">
                  {logo}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* C. SECURITY METRICS STRIP */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl w-full mx-auto px-6 py-12 relative z-10">
          {[
            { value: '4,285,190+', label: 'ATTACKS SIMULATED', color: 'text-cyan-400' },
            { value: '99.94%', label: 'DETECTION ACCURACY', color: 'text-indigo-400' },
            { value: '< 12ms', label: 'EVALUATION LATENCY', color: 'text-purple-400' },
            { value: '150+ Vectors', label: 'SIGNATURES DATABASE', color: 'text-emerald-400' }
          ].map((stat, idx) => (
            <div key={idx} className="flex flex-col gap-1 border border-zinc-900 bg-zinc-950/40 rounded-xl p-4 md:p-5 font-mono shadow-[inset_0_1px_1px_rgba(255,255,255,0.03)] backdrop-blur-md">
              <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">{stat.label}</span>
              <span className={`text-lg md:text-2xl font-black mt-1 ${stat.color}`}>{stat.value}</span>
            </div>
          ))}
        </div>

        {/* D. FEATURE CARDS GRID */}
        <div className="max-w-6xl w-full mx-auto px-6 py-8 relative z-10 flex flex-col gap-8">
          <div className="flex flex-col gap-1.5 border-l-2 border-cyan-500 pl-4 py-1">
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">Capabilities</span>
            <h3 className="text-lg md:text-xl font-bold tracking-wider uppercase text-zinc-200">Autonomous Security Defenses</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Adversarial Simulation',
                desc: 'Orchestrate high-intensity prompt injection, jailbreak personas, and social engineering threat simulations.',
                icon: <ShieldAlert className="w-5 h-5 text-cyan-400" />
              },
              {
                title: 'RAG Poisoning Defense',
                desc: 'Scan knowledge bases and context windows for indirect injections, data overrides, and system confusion.',
                icon: <Database className="w-5 h-5 text-indigo-400" />
              },
              {
                title: 'Agent Abuse Shield',
                desc: 'Isolate execution paths and prevent remote command elevation (sudo, root) or unauthorized action hijacking.',
                icon: <Cpu className="w-5 h-5 text-purple-400" />
              },
              {
                title: 'Claude AI Judgment',
                desc: 'Leverage LLM security models for semantic risk evaluation, exfiltration detection, and playbook mitigations.',
                icon: <Brain className="w-5 h-5 text-emerald-400" />
              }
            ].map((feat, idx) => (
              <div key={idx} className="border border-zinc-900 bg-zinc-950/35 backdrop-blur-md rounded-xl p-5 flex flex-col gap-3.5 hover:border-zinc-800 transition-all duration-300 group hover:translate-y-[-2px] shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)]">
                <div className="w-10 h-10 rounded-lg bg-zinc-900/50 border border-zinc-800/80 flex items-center justify-center shrink-0">
                  {feat.icon}
                </div>
                <div className="flex flex-col gap-1.5 font-mono">
                  <span className="text-xs font-bold text-zinc-100 uppercase tracking-wider">{feat.title}</span>
                  <p className="text-[10px] text-zinc-500 leading-relaxed">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* E. ATTACK CHAIN PREVIEW & LIVE THREAT FEED GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl w-full mx-auto px-6 py-8 relative z-10 items-stretch">
          {/* Attack Chain Preview */}
          <div className="border border-zinc-900 bg-zinc-950/45 backdrop-blur-md rounded-xl p-5 flex flex-col gap-4 font-mono shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)] h-full">
            <div className="flex justify-between items-center border-b border-zinc-900/60 pb-3">
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Attack Chain Simulation</span>
              <Link href="/attacks">
                <span className="text-[9px] text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer">
                  THREAT FLOWS WORKSPACE <ArrowUpRight className="w-3 h-3" />
                </span>
              </Link>
            </div>
            
            {/* Visual Node Diagram mockup */}
            <div className="flex-1 flex flex-col justify-center gap-6 py-6 px-2">
              <div className="flex items-center justify-between gap-3 font-mono text-[9px] relative z-10">
                <div className="flex items-center gap-2 border border-zinc-800 bg-zinc-900/50 rounded px-2.5 py-1 text-zinc-300">
                  <Terminal className="w-3 h-3 text-cyan-400 animate-pulse" />
                  <span>User Prompt Input</span>
                </div>
                <div className="h-[1px] flex-1 bg-gradient-to-r from-cyan-500/50 to-red-500/50 relative">
                  <div className="absolute top-[-3px] left-1/2 w-1.5 h-1.5 rounded-full bg-red-400 animate-ping"></div>
                </div>
                <div className="flex items-center gap-2 border border-red-500/30 bg-red-950/20 rounded px-2.5 py-1 text-red-400">
                  <ShieldAlert className="w-3 h-3" />
                  <span>Payload Detected</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between gap-3 font-mono text-[9px] relative z-10">
                <div className="flex items-center gap-2 border border-red-500/30 bg-red-950/20 rounded px-2.5 py-1 text-red-400">
                  <span>System Override</span>
                </div>
                <div className="h-[1px] flex-1 bg-zinc-850"></div>
                <div className="flex items-center gap-2 border border-emerald-500/30 bg-emerald-950/20 rounded px-2.5 py-1 text-emerald-400">
                  <span>Safe Context Filtered</span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 font-mono text-[9px] relative z-10">
                <div className="flex items-center gap-2 border border-zinc-850 bg-zinc-900/50 rounded px-2.5 py-1 text-zinc-400">
                  <span>Outbound Redirect</span>
                </div>
                <div className="h-[1px] flex-1 bg-gradient-to-r from-zinc-800 to-red-500/30"></div>
                <div className="flex items-center gap-2 border border-red-500/40 bg-red-950/40 rounded px-2.5 py-1 text-red-400 font-bold">
                  <span>Exfiltration Blocked</span>
                </div>
              </div>
            </div>
          </div>

          {/* Live Threat Feed Ticker */}
          <div className="border border-zinc-900 bg-zinc-950/45 backdrop-blur-md rounded-xl p-5 flex flex-col gap-4 font-mono shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)] h-full">
            <div className="flex justify-between items-center border-b border-zinc-900/60 pb-3">
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Live Threat Ticker Feed</span>
              <span className="text-[9px] text-emerald-400 flex items-center gap-1.5 font-bold uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                ACTIVE MONITOR
              </span>
            </div>
            <div className="flex flex-col gap-3.5 text-[10px] flex-1 justify-center">
              {threatLogs.map((log, idx) => (
                <div key={idx} className="flex flex-col gap-1.5 border-b border-zinc-900/40 pb-2.5 last:border-0 last:pb-0 transition-all duration-500 animate-fade-in">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-600">[{log.timestamp}]</span>
                      <span className="text-zinc-300 font-semibold">{log.target}</span>
                    </div>
                    <span className={`text-[8px] border px-1.5 py-0.5 rounded font-bold uppercase tracking-wide ${
                      log.status === 'BLOCKED' ? 'text-red-400 border-red-500/20 bg-red-950/20' : 
                      log.status === 'SANITIZED' ? 'text-yellow-400 border-yellow-500/20 bg-yellow-950/20' : 
                      'text-orange-400 border-orange-500/20 bg-orange-950/20'
                    }`}>
                      {log.status}
                    </span>
                  </div>
                  <div className="text-zinc-500 leading-normal">
                    Threat: <strong className="text-zinc-400 font-medium">{log.vector}</strong> - {log.details}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* F. INTERACTIVE SANDBOX SCANNER SECTION */}
        <section ref={scannerRef} className="max-w-6xl w-full mx-auto px-6 py-16 scroll-mt-20 relative z-10 flex flex-col gap-6">
          <div className="flex flex-col gap-1.5 border-l-2 border-cyan-500 pl-4 py-1">
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">Interactive Sandbox</span>
            <h3 className="text-lg md:text-xl font-bold tracking-wider uppercase text-zinc-200">Active Vulnerability Evaluator</h3>
          </div>
          
          <div className="border border-zinc-900 bg-zinc-950/30 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden flex flex-col gap-6">
            <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/5 blur-3xl pointer-events-none"></div>

            {/* Console and Indicators Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* Inputs Section */}
              <div className="lg:col-span-3 flex flex-col gap-6">
                <ScannerConsole onScan={handleScan} isScanning={isScanning} />

                {/* Simulated Live Terminal Logs */}
                {isScanning && (
                  <div className="border border-zinc-800 bg-black/60 rounded-lg p-4 font-mono text-[10px] text-cyan-400/90 flex flex-col gap-1 shadow-inner select-none animate-pulse">
                    <div className="flex items-center gap-1.5 text-zinc-500 border-b border-zinc-900 pb-1.5 mb-1">
                      <Terminal className="w-3.5 h-3.5" />
                      ANALYSIS LOGGER LOGS:
                    </div>
                    {scanLogs.map((log, idx) => (
                      <div key={idx} className="flex gap-2">
                        <span className="text-zinc-700">[{idx + 1}]</span>
                        <span>&gt; {log}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* HUD Indicators Panel */}
              <div className="lg:col-span-2 flex flex-col gap-6">
                <MetricsDisplay 
                  score={result ? result.riskScore : 0} 
                  severity={result ? result.severity : 'low'} 
                  findingsCount={result ? result.findings.length : 0} 
                  scanTime={scanTime}
                  isScanning={isScanning}
                />
              </div>
            </div>

            {/* Scan Details Section */}
            {result && !isScanning && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start mt-4 border-t border-zinc-900/60 pt-6 animate-fade-in">
                {/* Left Column: Deterministic Findings (Primary Source of Truth) */}
                <div className="flex flex-col gap-6 w-full">
                  <FindingsPanel findings={result.findings} isScanning={isScanning} />

                  {/* Recommendations Playbook */}
                  <Card className="border border-zinc-800 bg-zinc-950/50 shadow-2xl relative">
                    <CardHeader className="py-3 px-4 border-b border-zinc-800/80">
                      <CardTitle className="text-[11px] font-mono tracking-widest text-zinc-500 uppercase flex items-center gap-1.5">
                        <HelpCircle className="w-3.5 h-3.5" />
                        Mitigation Playbook
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-5 flex flex-col gap-4 font-mono">
                      {result.recommendations.map((rec, idx) => (
                        <div key={idx} className="flex gap-3 items-start border-b border-zinc-900 pb-3 last:border-0 last:pb-0">
                          <div className="w-5 h-5 rounded border border-zinc-800 bg-zinc-900/60 flex items-center justify-center text-[10px] text-cyan-400 shrink-0 font-bold mt-0.5">
                            {idx + 1}
                          </div>
                          <div className="flex flex-col gap-1 text-[11px] text-zinc-300 leading-relaxed">
                            {rec}
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>

                {/* Right Column: AI Security Judge Panel */}
                <div className="w-full">
                  <AIJudgePanel result={judgeResult} isLoading={isJudgeLoading} error={judgeError} />
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Cyberpunk Status Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950/80 px-6 py-3.5 text-center flex flex-col sm:flex-row items-center justify-between text-[10px] font-mono text-zinc-600 gap-2 mt-auto z-10 select-none">
        <div>PROMPTARMOR SECURITY HUBS // SCANNER CONTROLLER</div>
        <div className="flex items-center gap-4">
          <span>ALGORITHM: DETERMINISTIC RULE-BASED REGEX</span>
          <span className="border-l border-zinc-800 pl-4">STATUS: INTRUSION_DETECTION_SHIELDED</span>
        </div>
      </footer>

      {/* WATCH DEMO MODAL POPUP */}
      {isDemoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-fade-in">
          <div className="relative border border-zinc-800 bg-[#050816] max-w-2xl w-full rounded-xl overflow-hidden shadow-2xl p-6 flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-zinc-900 pb-3">
              <span className="text-[10px] font-mono text-cyan-400 flex items-center gap-1.5 uppercase font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                PromptArmor Demo Sequence
              </span>
              <button 
                onClick={() => setIsDemoModalOpen(false)}
                className="text-[10px] font-mono text-zinc-500 hover:text-zinc-200 border border-zinc-800 hover:border-zinc-700 rounded px-2 py-0.5 cursor-pointer transition-colors"
              >
                [ESC] CLOSE
              </button>
            </div>
            
            <div className="aspect-video w-full bg-zinc-950 border border-zinc-900 rounded-lg flex flex-col items-center justify-center p-6 text-center font-mono">
              <Terminal className="w-10 h-10 text-cyan-400 animate-pulse mb-3" />
              <span className="text-xs font-bold text-zinc-200 uppercase">PLAYING: PROMPTARMOR_OVERVIEW_DEMO.MP4</span>
              <p className="text-[10px] text-zinc-500 mt-2 max-w-sm leading-relaxed">
                Simulating full red teaming automation sequence, vulnerability scanning engine audits, and Claude AI Judge threat assessments...
              </p>
              <div className="w-32 h-1 bg-zinc-900 rounded-full overflow-hidden mt-6">
                <div className="h-full bg-cyan-500 animate-pulse w-2/3 rounded-full"></div>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-2 font-mono">
              <button 
                onClick={() => setIsDemoModalOpen(false)}
                className="bg-cyan-950 border border-cyan-500/40 hover:bg-cyan-900 hover:border-cyan-400 text-cyan-200 h-9 px-4 rounded text-[10px] tracking-wider uppercase font-semibold transition-all duration-300"
              >
                Close Video Player
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
