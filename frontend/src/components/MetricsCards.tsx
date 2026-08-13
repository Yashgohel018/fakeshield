import React from 'react';
import { ShieldCheck, AlertTriangle, Cpu, Gauge, Zap, Layers } from 'lucide-react';
import type { DetectionResult, SystemMetrics } from '../types/fakeshield';

interface MetricsCardsProps {
  detection: DetectionResult | null;
  metrics: SystemMetrics;
}

export const MetricsCards: React.FC<MetricsCardsProps> = ({ detection, metrics }) => {
  const hasFace = detection !== null;
  const authenticity = hasFace ? detection.authenticityScore : 0;
  const manipulation = hasFace ? detection.manipulationScore : 0;
  const riskLevel = hasFace ? detection.riskLevel : 'NO_FACE';
  const latency = hasFace ? detection.inferenceTimeMs : 0;

  let riskColorClass = 'text-slate-400 border-slate-700 bg-slate-800/50';
  let riskBadgeText = 'NO FACE';
  let riskSubtext = 'Searching Feed';

  if (hasFace) {
    if (riskLevel === 'HIGH') {
      riskColorClass = 'text-rose-400 border-rose-500/30 bg-rose-500/10 animate-pulse';
      riskBadgeText = 'HIGH RISK';
      riskSubtext = 'Deepfake Trigger';
    } else if (riskLevel === 'MEDIUM') {
      riskColorClass = 'text-amber-400 border-amber-500/30 bg-amber-500/10';
      riskBadgeText = 'MEDIUM RISK';
      riskSubtext = 'Artifacts';
    } else {
      riskColorClass = 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
      riskBadgeText = 'LOW RISK';
      riskSubtext = 'Clean Stream';
    }
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
      
      {/* 1. Authenticity Score */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
          <span>Authenticity</span>
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
        </div>
        <div>
          <div className="text-2xl font-bold text-white tracking-tight">
            {hasFace ? `${authenticity.toFixed(1)}%` : '--'}
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div 
              className="bg-emerald-400 h-full transition-all duration-300" 
              style={{ width: `${hasFace ? authenticity : 0}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. Manipulation Probability */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
          <span>Manipulation</span>
          <AlertTriangle className="w-4 h-4 text-rose-400" />
        </div>
        <div>
          <div className="text-2xl font-bold text-white tracking-tight">
            {hasFace ? `${manipulation.toFixed(1)}%` : '--'}
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div 
              className="bg-rose-500 h-full transition-all duration-300" 
              style={{ width: `${hasFace ? manipulation : 0}%` }}
            />
          </div>
        </div>
      </div>

      {/* 3. Risk Level Badge */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
          <span>Risk Status</span>
          <Gauge className="w-4 h-4 text-cyan-400" />
        </div>
        <div>
          <div className={`text-sm font-bold px-2.5 py-1 rounded-lg border text-center uppercase tracking-wider ${riskColorClass}`}>
            {riskBadgeText}
          </div>
          <p className="text-[10px] text-slate-400 text-center mt-2 font-mono">
            {riskSubtext}
          </p>
        </div>
      </div>

      {/* 4. Measured FPS */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
          <span>Frame Rate</span>
          <Cpu className="w-4 h-4 text-purple-400" />
        </div>
        <div>
          <div className="text-2xl font-bold text-white tracking-tight font-mono">
            {metrics.fps.toFixed(1)} <span className="text-xs text-slate-400 font-sans">FPS</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Target: &ge; 15 FPS</p>
        </div>
      </div>

      {/* 5. Latency in MS */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
          <span>Inference Time</span>
          <Zap className="w-4 h-4 text-amber-400" />
        </div>
        <div>
          <div className="text-2xl font-bold text-white tracking-tight font-mono">
            {latency} <span className="text-xs text-slate-400 font-sans">ms</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">ONNX WASM / WebGL</p>
        </div>
      </div>

      {/* 6. Total Frames Processed */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
          <span>Frames Audited</span>
          <Layers className="w-4 h-4 text-blue-400" />
        </div>
        <div>
          <div className="text-2xl font-bold text-white tracking-tight font-mono">
            {metrics.totalFramesProcessed.toLocaleString()}
          </div>
          <p className="text-[10px] text-slate-400 mt-1">
            Suspicious: <span className="text-rose-400">{metrics.suspiciousFramesCount}</span>
          </p>
        </div>
      </div>

    </div>
  );
};
