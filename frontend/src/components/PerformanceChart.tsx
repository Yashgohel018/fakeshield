import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

export interface PerformancePoint {
  timestamp: string;
  fps: number;
  latencyMs: number;
  manipulationScore: number;
}

interface PerformanceChartProps {
  data: PerformancePoint[];
}

export const PerformanceChart: React.FC<PerformanceChartProps> = ({ data }) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
          Real-Time Pipeline Performance (FPS & Latency)
        </h3>
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-cyan-400">
            <span className="w-3 h-0.5 bg-cyan-400"></span>
            <span>FPS</span>
          </div>
          <div className="flex items-center gap-1.5 text-amber-400">
            <span className="w-3 h-0.5 bg-amber-400"></span>
            <span>Latency (ms)</span>
          </div>
          <div className="flex items-center gap-1.5 text-rose-400">
            <span className="w-3 h-0.5 bg-rose-400"></span>
            <span>Manip %</span>
          </div>
        </div>
      </div>

      <div className="w-full h-44 sm:h-52">
        {data.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs font-mono">
            Awaiting streaming frame telemetry...
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="timestamp" stroke="#64748b" tick={{ fontSize: 10 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 10 }} domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '8px',
                  color: '#f8fafc',
                  fontSize: '12px'
                }}
              />
              <Line
                type="monotone"
                dataKey="fps"
                stroke="#38bdf8"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="latencyMs"
                stroke="#fbbf24"
                strokeWidth={1.5}
                dot={false}
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="manipulationScore"
                stroke="#f43f5e"
                strokeWidth={1.5}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
