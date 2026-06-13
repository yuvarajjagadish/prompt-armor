import React from 'react';

// Enterprise credibility metrics displayed in a 4‑column grid
export default function CredibilityMetrics() {
  const metrics = [
    { value: '4.2M+', label: 'Attacks Simulated', color: 'text-cyan-400' },
    { value: '99.94%', label: 'Detection Accuracy', color: 'text-indigo-400' },
    { value: '<12ms', label: 'Evaluation Latency', color: 'text-purple-400' },
    { value: '150+', label: 'Attack Signatures', color: 'text-emerald-400' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 w-full max-w-4xl mx-auto">
      {metrics.map((m, i) => (
        <div
          key={i}
          className="flex flex-col items-center gap-1 border border-zinc-900 bg-zinc-950/40 rounded-xl p-3 text-center backdrop-blur-md"
        >
          <span className="text-xs text-zinc-500 uppercase font-bold tracking-wider">
            {m.label}
          </span>
          <span className={`text-lg font-black ${m.color}`}>{m.value}</span>
        </div>
      ))}
    </div>
  );
}
