import React from 'react';
import { motion } from 'framer-motion';
import { Node } from 'reactflow';

interface Stage {
  label: string;
  description: string;
  status: 'COMPROMISED' | 'BLOCKED' | 'BYPASSED' | 'SECURE' | undefined;
}

const stageInfos = [
  { label: 'User Prompt', description: 'Original user input' },
  { label: 'Prompt Injection Detection', description: 'Detects malicious intent' },
  { label: 'Sanitization Layer', description: 'Cleanses the prompt' },
  { label: 'Threat Classification', description: 'Classifies attack vector' },
  { label: 'Risk Scoring Engine', description: 'Assigns risk score' },
  { label: 'Secure LLM Execution', description: 'Runs safe prompt' },
];

// Map node status to badge colors
const statusBadge = (status?: string) => {
  switch (status) {
    case 'COMPROMISED':
      return 'bg-red-500/20 text-red-400 border-red-500/30';
    case 'BLOCKED':
      return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    case 'BYPASSED':
      return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    case 'SECURE':
      return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
    default:
      return 'bg-zinc-800 text-zinc-400 border-zinc-700';
  }
};

// Animation variants for connecting line
const lineVariant = {
  hidden: { pathLength: 0 },
  visible: { pathLength: 1, transition: { duration: 0.8, ease: 'easeOut' } },
};

// Animation for moving packet along line
const packetVariant = {
  animate: {
    translateX: [0, 60, 120, 180, 240, 300], // will be overridden per segment
    transition: { repeat: Infinity, duration: 4, ease: 'linear' },
  },
};

export const AttackPipeline = ({ nodes }: { nodes: Node[] }) => {
  // Build stages with status from nodes (match by step)
  const stages: Stage[] = stageInfos.map((info, idx) => {
    const node = nodes.find((n: any) => n.data?.step === idx + 1);
    return { ...info, status: node?.data?.status } as Stage;
  });

  return (
    <div className="flex flex-col items-center gap-6 p-6 glass rounded-xl border border-zinc-800">
      {stages.map((stage, i) => (
        <div key={i} className="flex flex-col items-center w-full max-w-xs">
          {/* Stage Card */}
          <div
            className={`w-full p-3 bg-card/60 backdrop-blur-md rounded-xl border ${statusBadge(stage.status)} transition-all duration-300 hover:shadow-lg`}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium text-sm text-zinc-200">{stage.label}</span>
              {stage.status && (
                <span className={`px-2 py-0.5 text-xs rounded border ${statusBadge(stage.status)}`}>{stage.status}</span>
              )}
            </div>
            <p className="mt-1 text-xs text-zinc-400">{stage.description}</p>
          </div>
          {/* Connector line (except last) */}
          {i < stages.length - 1 && (
            <div className="relative w-full h-6">
              <motion.svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 10" preserveAspectRatio="none">
                <motion.path
                  d="M0 5 L100 5"
                  stroke="rgba(124,58,237,0.4)"
                  strokeWidth="2"
                  variants={lineVariant}
                  initial="hidden"
                  animate="visible"
                />
                {/* Moving packet */}
                <motion.circle
                  cx="0"
                  cy="5"
                  r="3"
                  fill="#00D4FF"
                  animate={{ x: [0, 100] }}
                  transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                />
              </motion.svg>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
