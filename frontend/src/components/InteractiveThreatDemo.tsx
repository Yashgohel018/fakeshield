import React, { useState, useEffect } from 'react';
import { ShieldAlert, CheckCircle2, Volume2, VolumeX, Eye, Sparkles } from 'lucide-react';

export const InteractiveThreatDemo: React.FC = () => {
  const [feedMode, setFeedMode] = useState<'clean' | 'deepfake'>('clean');
  const [authenticityScore, setAuthenticityScore] = useState<number>(98.4);
  const [manipulationScore, setManipulationScore] = useState<number>(1.6);
  const [inferenceLatency, setInferenceLatency] = useState<number>(28.5);

  // Animate values slightly to simulate live telemetry
  useEffect(() => {
    const interval = setInterval(() => {
      if (feedMode === 'clean') {
        const auth = 96.5 + Math.random() * 3.0;
        setAuthenticityScore(parseFloat(auth.toFixed(1)));
        setManipulationScore(parseFloat((100 - auth).toFixed(1)));
        setInferenceLatency(parseFloat((26.0 + Math.random() * 5).toFixed(1)));
      } else {
        const auth = 8.2 + Math.random() * 7.5;
        setAuthenticityScore(parseFloat(auth.toFixed(1)));
        setManipulationScore(parseFloat((100 - auth).toFixed(1)));
        setInferenceLatency(parseFloat((31.0 + Math.random() * 7).toFixed(1)));
      }
    }, 600);

    return () => clearInterval(interval);
  }, [feedMode]);

  const isLowRisk = feedMode === 'clean';

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl shadow-xl space-y-6">
      
      {/* Widget Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            Interactive Homepage Threat Sandbox
          </div>
          <h3 className="text-xl font-bold text-white">Live AI Detection Simulator</h3>
        </div>

        {/* Toggle Mode Controls */}
        <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setFeedMode('clean')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              feedMode === 'clean'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Authentic Stream</span>
          </button>

          <button
            onClick={() => setFeedMode('deepfake')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              feedMode === 'deepfake'
                ? 'bg-red-500 text-white shadow-md shadow-red-500/20 animate-pulse'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Deepfake Attack</span>
          </button>
        </div>
      </div>

      {/* Video Simulation Display & Overlay */}
      <div className="relative aspect-video rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center group">
        
        {/* Synthetic Cyber Face Representation */}
        <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-b from-slate-900 to-slate-950">
          
          {/* Animated Biometric Scanning Box */}
          <div
            className={`relative w-48 h-56 sm:w-64 sm:h-72 rounded-2xl border-2 transition-all duration-500 flex flex-col justify-between p-3 ${
              isLowRisk
                ? 'border-emerald-400/80 shadow-2xl shadow-emerald-500/20 bg-emerald-950/10'
                : 'border-red-500/90 shadow-2xl shadow-red-500/30 bg-red-950/20 animate-pulse'
            }`}
          >
            {/* Top Bounding Box Badge */}
            <div className="flex items-center justify-between">
              <div
                className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase tracking-wider flex items-center gap-1 ${
                  isLowRisk
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-red-500/20 text-red-300 border border-red-500/40'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${isLowRisk ? 'bg-emerald-400' : 'bg-red-400 animate-ping'}`}></span>
                {isLowRisk ? 'VERIFIED AUTHENTIC' : 'HIGH DEEPFAKE RISK'}
              </div>
              <span className="text-[10px] font-mono text-slate-400">ID: #FACE-01</span>
            </div>

            {/* Center Biometric Contour Simulation */}
            <div className="self-center flex flex-col items-center justify-center space-y-2 opacity-80">
              <div className="w-16 h-16 rounded-full border border-dashed border-cyan-400/60 flex items-center justify-center animate-spin" style={{ animationDuration: '10s' }}>
                <div className="w-10 h-10 rounded-full border border-cyan-300/80 flex items-center justify-center">
                  <Eye className={`w-5 h-5 ${isLowRisk ? 'text-cyan-400' : 'text-red-400'}`} />
                </div>
              </div>
              <span className="text-[10px] font-mono text-slate-300">
                {isLowRisk ? 'Spatial Texture Normal' : 'Temporal Artifact Detected'}
              </span>
            </div>

            {/* Bottom Bounding Box HUD Stats */}
            <div className="flex items-center justify-between bg-slate-950/90 p-2 rounded-lg border border-slate-800 text-[11px] font-mono">
              <div>
                <span className="text-slate-400 block text-[9px]">AUTHENTICITY</span>
                <span className={`font-bold ${isLowRisk ? 'text-emerald-400' : 'text-red-400'}`}>
                  {authenticityScore}%
                </span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 block text-[9px]">MANIPULATION</span>
                <span className={`font-bold ${isLowRisk ? 'text-slate-300' : 'text-red-400'}`}>
                  {manipulationScore}%
                </span>
              </div>
            </div>

          </div>

          {/* Background Cyber Grid */}
          <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none"></div>

        </div>

      </div>

      {/* Real-Time Telemetry Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-400 font-mono uppercase block">Risk Engine Level</span>
          <span className={`text-sm font-extrabold ${isLowRisk ? 'text-emerald-400' : 'text-red-400'}`}>
            {isLowRisk ? 'LOW RISK' : 'CRITICAL HIGH'}
          </span>
        </div>

        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-400 font-mono uppercase block">WASM Inference</span>
          <span className="text-sm font-extrabold text-cyan-400 font-mono">
            {inferenceLatency} ms / frame
          </span>
        </div>

        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-400 font-mono uppercase block">Temporal Smooth</span>
          <span className="text-sm font-extrabold text-slate-200 font-mono">
            EMA &alpha; = 0.35 (N=10)
          </span>
        </div>

        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-400 font-mono uppercase block">Audio Alert Synthesizer</span>
          <span className={`text-sm font-extrabold flex items-center gap-1.5 ${isLowRisk ? 'text-slate-400' : 'text-red-400'}`}>
            {isLowRisk ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 animate-bounce" />}
            {isLowRisk ? 'Silent' : '880Hz Beep Active'}
          </span>
        </div>
      </div>

    </div>
  );
};
