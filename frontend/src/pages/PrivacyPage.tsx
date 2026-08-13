import React from 'react';
import { Lock, Shield, Cpu, Code2, FileText } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 max-w-5xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold uppercase">
          <Lock className="w-4 h-4 text-emerald-400" />
          Privacy-First Zero-Trust Architecture
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Privacy Policy & AI Model Documentation
        </h1>
        <p className="text-slate-300 text-sm leading-relaxed max-w-3xl">
          FakeShield is engineered with a strict **Local-First Privacy Architecture**. All facial detection and neural network inference runs 100% inside your browser environment using WebAssembly.
        </p>
      </div>

      {/* Privacy Guarantees Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-2">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Zero Video Uploads</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Raw webcam frames and screen-captured video calls never leave your local device memory. No cloud API or external server processes your video.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-2">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Browser Memory Sandbox</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            All frame buffer arrays are created in ephemeral browser memory and immediately garbage collected following forward pass inference.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-2">
          <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Shield className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">GDPR & Security Compliant</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            By eliminating cloud video storage and telemetry uploads, FakeShield satisfies strict corporate cybersecurity compliance standards.
          </p>
        </div>

      </div>

      {/* Model Technical Specification Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Code2 className="w-5 h-5 text-cyan-400" />
          AI Deepfake Detection Model Specifications
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
          
          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
            <div className="text-slate-400">Model Name</div>
            <div className="text-cyan-300 font-bold text-sm">MesoInception-4 (ONNX)</div>
          </div>

          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
            <div className="text-slate-400">Model Size</div>
            <div className="text-emerald-300 font-bold text-sm">286 KB (Ultra-Lightweight)</div>
          </div>

          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
            <div className="text-slate-400">Input Resolution</div>
            <div className="text-amber-300 font-bold text-sm">[1, 3, 128, 128] Float32 RGB</div>
          </div>

          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
            <div className="text-slate-400">Inference Engine</div>
            <div className="text-purple-300 font-bold text-sm">ONNX Runtime Web (WASM / WebGL)</div>
          </div>

          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
            <div className="text-slate-400">Face Detector</div>
            <div className="text-cyan-300 font-bold text-sm">MediaPipe BlazeFace Task (WASM)</div>
          </div>

          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
            <div className="text-slate-400">Target CPU Performance</div>
            <div className="text-emerald-300 font-bold text-sm">&ge; 15 FPS (&lt; 35ms Latency)</div>
          </div>

        </div>
      </div>

      {/* Third Party Open Source License Compliance */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wider">
          <FileText className="w-4 h-4 text-slate-400" />
          Open Source Third-Party Licenses
        </h3>

        <div className="space-y-2 text-xs text-slate-300">
          <div className="flex items-center justify-between p-2.5 bg-slate-950 rounded-lg border border-slate-800">
            <span>ONNX Runtime Web (`onnxruntime-web`)</span>
            <span className="font-mono text-cyan-400">MIT License</span>
          </div>
          <div className="flex items-center justify-between p-2.5 bg-slate-950 rounded-lg border border-slate-800">
            <span>MediaPipe Tasks Vision (`@mediapipe/tasks-vision`)</span>
            <span className="font-mono text-cyan-400">Apache 2.0 License</span>
          </div>
          <div className="flex items-center justify-between p-2.5 bg-slate-950 rounded-lg border border-slate-800">
            <span>React, TypeScript &amp; Vite</span>
            <span className="font-mono text-cyan-400">MIT License</span>
          </div>
          <div className="flex items-center justify-between p-2.5 bg-slate-950 rounded-lg border border-slate-800">
            <span>Lucide Icons &amp; Recharts</span>
            <span className="font-mono text-cyan-400">ISC / MIT License</span>
          </div>
        </div>
      </div>

    </div>
  );
};
