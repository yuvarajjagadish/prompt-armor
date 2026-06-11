"use client";

import React, { memo } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  Handle, 
  Position, 
  Node, 
  Edge,
  BackgroundVariant,
  NodeProps
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Terminal, ShieldAlert, ShieldCheck, Radio } from 'lucide-react';

export interface CyberNodeData {
  label: string;
  step: number;
  status: 'COMPROMISED' | 'BLOCKED' | 'BYPASSED' | 'SECURE';
  description: string;
  payload: string;
  remediation: string;
}

// Custom Cyber Node definition
export const CyberNode = memo(({ data }: NodeProps<CyberNodeData>) => {
  const getStatusStyle = () => {
    switch (data.status) {
      case 'COMPROMISED':
        return 'border-red-500/40 shadow-[0_0_15px_rgba(239,68,68,0.15)] bg-red-950/20 text-red-400';
      case 'BLOCKED':
        return 'border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.15)] bg-emerald-950/20 text-emerald-400';
      case 'BYPASSED':
        return 'border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.15)] bg-amber-950/20 text-amber-400';
      default:
        return 'border-zinc-800 bg-zinc-950/80 text-zinc-300';
    }
  };

  const getIcon = () => {
    switch (data.status) {
      case 'COMPROMISED': return <ShieldAlert className="w-3.5 h-3.5 text-red-400 animate-pulse" />;
      case 'BLOCKED': return <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />;
      case 'BYPASSED': return <Radio className="w-3.5 h-3.5 text-amber-400 animate-ping" />;
      default: return <Terminal className="w-3.5 h-3.5 text-cyan-400" />;
    }
  };

  return (
    <div className={`p-3 border rounded-lg min-w-[170px] max-w-[200px] w-full font-mono text-[10px] backdrop-blur-md relative transition-all duration-300 hover:border-cyan-500/40 cursor-pointer ${getStatusStyle()}`}>
      <Handle type="target" position={Position.Left} className="w-2 h-2 bg-zinc-800 border border-zinc-700" />
      <div className="flex items-center gap-1.5 border-b border-zinc-900 pb-1.5 mb-1.5">
        {getIcon()}
        <span className="font-bold text-[9px] uppercase tracking-wide truncate">{data.label}</span>
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="text-[8px] text-zinc-500 font-bold uppercase">Step {data.step}</span>
        <span className="text-zinc-400 truncate text-[9px]">{data.description}</span>
      </div>
      <Handle type="source" position={Position.Right} className="w-2 h-2 bg-zinc-800 border border-cyan-500/50" />
    </div>
  );
});

CyberNode.displayName = 'CyberNode';

const nodeTypes = {
  cyber: CyberNode,
};

interface AttackChainGraphProps {
  nodes: Node[];
  edges: Edge[];
  onNodeClick: (node: Node) => void;
}

export function AttackChainGraph({ nodes, edges, onNodeClick }: AttackChainGraphProps) {
  return (
    <div className="w-full h-full bg-zinc-950/60 border border-zinc-900 rounded-lg overflow-hidden relative shadow-inner">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodeClick={(_, node) => onNodeClick(node)}
        fitView
        nodesDraggable={true}
        nodesConnectable={false}
        elementsSelectable={true}
        proOptions={{ hideAttribution: true }}
      >
        <Background 
          variant={BackgroundVariant.Lines} 
          color="#18181b" 
          gap={32} 
          size={0.7} 
        />
        <Controls 
          className="bg-zinc-900 border border-zinc-800 text-zinc-300 rounded font-mono text-xs scale-90" 
          showInteractive={false}
        />
      </ReactFlow>
    </div>
  );
}
