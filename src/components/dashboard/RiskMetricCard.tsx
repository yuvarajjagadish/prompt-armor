"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface RiskMetricCardProps {
  title: string;
  value: string | number;
  description: string;
  trend: number; // positive or negative percentage, e.g. 5.4 or -2.1
  icon: React.ReactNode;
  status?: 'warning' | 'error' | 'success' | 'info';
}

export function RiskMetricCard({ title, value, description, trend, icon, status = 'info' }: RiskMetricCardProps) {
  const isPositive = trend >= 0;

  // Visual highlights depending on trend type
  const getTrendColor = () => {
    if (status === 'error' || status === 'warning') {
      // For warning metrics (like threats/blocked cases), an upward trend is bad (red) and downward is good (green)
      return isPositive ? 'text-red-400 bg-red-950/20' : 'text-emerald-400 bg-emerald-950/20';
    }
    // For standard scan counters, upward trend is generally positive/active (green)
    return isPositive ? 'text-emerald-400 bg-emerald-950/20' : 'text-zinc-500 bg-zinc-900/20';
  };

  return (
    <Card className="border border-zinc-800 bg-zinc-950/50 shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-zinc-800 to-transparent"></div>
      <CardHeader className="flex flex-row items-center justify-between pb-2 py-4 px-5">
        <CardTitle className="text-[11px] font-mono tracking-widest text-zinc-500 uppercase">
          {title}
        </CardTitle>
        <div className="p-1.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800/80 group-hover:text-cyan-400 transition-colors">
          {icon}
        </div>
      </CardHeader>
      <CardContent className="px-5 pb-4 pt-1 flex flex-col gap-1.5">
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-bold tracking-tight font-mono text-zinc-100">
            {value}
          </span>
          <span className={`text-[10px] font-mono font-semibold py-0.5 px-1.5 rounded-full flex items-center gap-0.5 border border-zinc-800 ${getTrendColor()}`}>
            {isPositive ? (
              <ArrowUpRight className="w-3 h-3" />
            ) : (
              <ArrowDownRight className="w-3 h-3" />
            )}
            {Math.abs(trend)}%
          </span>
        </div>
        <p className="text-[10px] font-mono text-zinc-500 uppercase leading-relaxed mt-1">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}
