"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { DailyScanData } from '@/data/mock-data';
import { Activity } from 'lucide-react';

interface ScanTimelineChartProps {
  data: DailyScanData[];
}

export function ScanTimelineChart({ data }: ScanTimelineChartProps) {
  return (
    <Card className="border border-zinc-800 bg-zinc-950/50 shadow-2xl relative overflow-hidden group">
      <CardHeader className="py-3 px-5 border-b border-zinc-800/80">
        <CardTitle className="text-[11px] font-mono tracking-widest text-zinc-500 uppercase flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
          Scan volume vs threat timeline (14d)
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 px-4 pb-4">
        <div className="w-full h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorScans" cx="0" cy="0" r="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.01}/>
                </linearGradient>
                <linearGradient id="colorThreats" cx="0" cy="0" r="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0.01}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#18181b" />
              <XAxis 
                dataKey="date" 
                stroke="#52525b" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false} 
                fontFamily="monospace"
              />
              <YAxis 
                stroke="#52525b" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false} 
                fontFamily="monospace"
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#09090b', 
                  borderColor: '#27272a', 
                  borderRadius: '0.375rem',
                  color: '#f4f4f5',
                  fontFamily: 'monospace',
                  fontSize: '11px',
                }}
                labelStyle={{ fontWeight: 'bold', color: '#a1a1aa' }}
                cursor={{ stroke: '#27272a', strokeWidth: 1 }}
              />
              <Area 
                name="Total Scans"
                type="monotone" 
                dataKey="scans" 
                stroke="#06b6d4" 
                strokeWidth={1.5}
                fillOpacity={1} 
                fill="url(#colorScans)" 
              />
              <Area 
                name="Blocked Threats"
                type="monotone" 
                dataKey="threats" 
                stroke="#ef4444" 
                strokeWidth={1.5}
                fillOpacity={1} 
                fill="url(#colorThreats)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
