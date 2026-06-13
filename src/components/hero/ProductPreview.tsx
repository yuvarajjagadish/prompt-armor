import React from 'react';

// Mock product preview for the hero section
export default function ProductPreview() {
  // Placeholder data – in a real app this would be wired to the scanner state
  const prompt = 'Explain how to bypass authentication in a web app';
  const isScanning = false;
  const riskScore = 'High';
  const threatBadge = 'BLOCKED';
  const findings = [
    'Detected prompt injection attempt.',
    'Sanitized malicious payload.',
    'No exfiltration vectors found.',
  ];

  return (
    <div className="glass p-4 space-y-3">
      {/* Prompt input */}
      <div className="border-b pb-2">
        <label className="block text-xs font-mono text-zinc-400 mb-1">Prompt</label>
        <textarea
          readOnly
          rows={2}
          className="w-full bg-transparent text-sm text-zinc-200 border-none resize-none focus:outline-none"
          value={prompt}
        />
      </div>

      {/* Scan state */}
      <div className="flex items-center justify-between text-xs font-mono">
        <span className="text-zinc-400">Scan status:</span>
        <span className={`px-2 py-0.5 rounded ${isScanning ? 'bg-cyan-600' : 'bg-green-600'} text-white`}>
          {isScanning ? 'Running' : 'Idle'}
        </span>
      </div>

      {/* Risk score */}
      <div className="flex items-center justify-between text-xs font-mono">
        <span className="text-zinc-400">Risk score</span>
        <span className="px-2 py-0.5 rounded bg-purple-600 text-white">{riskScore}</span>
      </div>

      {/* Threat detection badge */}
      <div className="flex items-center justify-between text-xs font-mono">
        <span className="text-zinc-400">Threat</span>
        <span className={`px-2 py-0.5 rounded ${threatBadge === 'BLOCKED' ? 'bg-red-600' : 'bg-yellow-600'} text-white`}>
