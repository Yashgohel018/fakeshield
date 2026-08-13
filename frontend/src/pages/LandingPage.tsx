import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  Video,
  Play,
  Lock,
  Cpu,
  ArrowRight,
  Activity,
  Eye,
  Zap,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  Building2,
  GraduationCap,
  Layers
} from 'lucide-react';
import { Face3DCanvas } from '../components/Face3DCanvas';
import { InteractiveThreatDemo } from '../components/InteractiveThreatDemo';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeThreatTab, setActiveThreatTab] = useState<'kyc' | 'executive' | 'interview' | 'espionage'>('kyc');

  const threatDetails = {
    kyc: {
      title: 'Financial Fraud & KYC Spoofing',
      icon: Building2,
      desc: 'Attackers generate synthetic face masks or live deepfakes to impersonate legitimate account owners, bypassing identity verification during online banking or crypto KYC procedures.',
      impact: 'High Financial Loss & Identity Theft',
      mitigation: 'FakeShield inspects 128x128 facial texture artifacts at 30ms/frame to flag injection attacks in real time.'
    },
    executive: {
      title: 'C-Level Executive Impersonation',
      icon: UserCheck,
      desc: 'Deepfake live video calls impersonating CEOs or CFOs trick finance personnel into approving urgent multi-million-dollar wire transfers.',
      impact: 'Corporate Treasury Wire Fraud',
      mitigation: 'Temporal risk filtering (EMA α=0.35) combined with auditory alerts triggers instant alarms upon facial replacement.'
    },
    interview: {
      title: 'Remote Interview & Exam Fraud',
      icon: GraduationCap,
      desc: 'Candidates use real-time face swap software during technical recruitment or university exams to let hidden proxies speak on their behalf.',
      impact: 'Credential & HR Fraud',
      mitigation: 'Continuous background analysis during active Webex, Zoom, or Google Meet sessions without recording video.'
    },
    espionage: {
      title: 'Social Engineering & Espionage',
      icon: AlertTriangle,
      desc: 'Manipulated live streams used in corporate meetings to extract sensitive intellectual property or gain unauthorized internal access.',
      impact: 'Security Leak & Compliance Breach',
      mitigation: '100% client-side WASM inference guarantees sensitive video frames never touch any external server.'
    }
  };

  const ActiveIcon = threatDetails[activeThreatTab].icon;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between overflow-x-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Dynamic Background Glow Gradients */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none -z-10"></div>
      <div className="fixed top-1/3 right-10 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[140px] pointer-events-none -z-10"></div>
      <div className="fixed bottom-10 left-10 w-[400px] h-[400px] bg-sky-500/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>

      {/* Hero Section */}
      <section className="relative pt-8 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headline & Action Launchers */}
          <div className="lg:col-span-6 space-y-6 text-left">
            
            {/* Production System Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-inner">
              <Shield className="w-4 h-4 text-cyan-400" />
              <span>Real-Time AI Cybersecurity Platform</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.1]">
              FakeShield <br />
              <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
                Real-Time Deepfake Risk Protection
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-lg text-slate-300 leading-relaxed max-w-xl">
              Privacy-first local AI engine for live webcam feeds &amp; video calls (Google Meet, Zoom, Teams). Runs MesoInception-4 neural networks <strong>100% in local WASM memory at 15+ FPS</strong>.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              
              <button
                onClick={() => navigate('/detection?source=webcam')}
                className="px-6 py-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-base flex items-center justify-center gap-2.5 transition-all shadow-lg shadow-cyan-500/25 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Video className="w-5 h-5" />
                <span>Start Live Camera</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <button
                onClick={() => navigate('/videocall')}
                className="px-6 py-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-cyan-300 border border-cyan-500/40 font-bold text-base flex items-center justify-center gap-2.5 transition-all hover:scale-[1.02] backdrop-blur-md"
              >
                <Play className="w-5 h-5 text-cyan-400" />
                <span>Video Call Mode</span>
              </button>

              <button
                onClick={() => navigate('/detection?source=testvideo')}
                className="px-5 py-4 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 text-slate-300 border border-slate-700 font-semibold text-sm flex items-center justify-center gap-2 transition-all"
              >
                <Activity className="w-4 h-4 text-purple-400" />
                <span>Demo Stream</span>
              </button>

            </div>

            {/* Key Privacy Highlights */}
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <Lock className="w-3.5 h-3.5" /> 100% Client-Side Privacy
              </span>
              <span className="flex items-center gap-1.5 text-cyan-300 font-medium">
                <Zap className="w-3.5 h-3.5" /> Zero Video Upload
              </span>
              <span className="flex items-center gap-1.5 text-sky-300 font-medium">
                <Cpu className="w-3.5 h-3.5" /> ONNX WASM Engine
              </span>
            </div>

          </div>

          {/* Right Column: 3D Interactive Biometric Facial Structure Canvas */}
          <div className="lg:col-span-6">
            <Face3DCanvas />
          </div>

        </div>
      </section>

      {/* Interactive Threat Simulator Sandbox */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <InteractiveThreatDemo />
      </section>

      {/* Threat Vector Matrix Section */}
      <section className="py-16 bg-slate-900/40 border-y border-slate-800/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-10">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold uppercase tracking-wider">
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
              Target Threat Vectors
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Countering Modern Deepfake Fraud Scenarios
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              FakeShield provides real-time protective auditing for enterprise cybersecurity and digital identity integrity.
            </p>
          </div>

          {/* Interactive Threat Category Selector Tabs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto">
            <button
              onClick={() => setActiveThreatTab('kyc')}
              className={`p-4 rounded-xl border text-left transition-all flex flex-col gap-2 ${
                activeThreatTab === 'kyc'
                  ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 shadow-lg shadow-cyan-500/10'
                  : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Building2 className="w-5 h-5 text-cyan-400" />
              <span className="text-xs font-bold uppercase tracking-wider">Financial KYC</span>
            </button>

            <button
              onClick={() => setActiveThreatTab('executive')}
              className={`p-4 rounded-xl border text-left transition-all flex flex-col gap-2 ${
                activeThreatTab === 'executive'
                  ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 shadow-lg shadow-cyan-500/10'
                  : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <UserCheck className="w-5 h-5 text-cyan-400" />
              <span className="text-xs font-bold uppercase tracking-wider">Executive Calls</span>
            </button>

            <button
              onClick={() => setActiveThreatTab('interview')}
              className={`p-4 rounded-xl border text-left transition-all flex flex-col gap-2 ${
                activeThreatTab === 'interview'
                  ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 shadow-lg shadow-cyan-500/10'
                  : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <GraduationCap className="w-5 h-5 text-cyan-400" />
              <span className="text-xs font-bold uppercase tracking-wider">Remote Exam/HR</span>
            </button>

            <button
              onClick={() => setActiveThreatTab('espionage')}
              className={`p-4 rounded-xl border text-left transition-all flex flex-col gap-2 ${
                activeThreatTab === 'espionage'
                  ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 shadow-lg shadow-cyan-500/10'
                  : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <span className="text-xs font-bold uppercase tracking-wider">Espionage</span>
            </button>
          </div>

          {/* Detailed Threat Tab Content Box */}
          <div className="max-w-4xl mx-auto bg-slate-950 border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row gap-6 items-start">
            <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shrink-0">
              <ActiveIcon className="w-8 h-8" />
            </div>

            <div className="space-y-3 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-xl font-bold text-white">{threatDetails[activeThreatTab].title}</h3>
                <span className="px-2.5 py-1 rounded bg-red-500/20 text-red-300 border border-red-500/40 text-xs font-mono font-semibold">
                  IMPACT: {threatDetails[activeThreatTab].impact}
                </span>
              </div>

              <p className="text-slate-300 text-sm leading-relaxed">
                {threatDetails[activeThreatTab].desc}
              </p>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-300 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>FakeShield Countermeasure:</strong> {threatDetails[activeThreatTab].mitigation}</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Core Technical Pillars Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center mb-12 space-y-2">
          <h2 className="text-3xl font-extrabold text-white">Engineered for Performance &amp; Privacy</h2>
          <p className="text-slate-400 text-sm">Lightweight neural model architecture built to run seamlessly on consumer quad-core hardware.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-slate-900 border border-slate-800 hover:border-cyan-500/40 p-6 rounded-2xl space-y-4 transition-all hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Local ONNX WASM Engine</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Executes MesoInception-4 deepfake network binary (286 KB) directly in browser memory using WebAssembly &amp; WebGL execution providers at 28.4 FPS.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 hover:border-emerald-500/40 p-6 rounded-2xl space-y-4 transition-all hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Real-Time Visual HUD</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Overlays dynamic color-coded face bounding boxes (Green = Low Risk, Red = High Risk) with authentic vs manipulation percentages.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 hover:border-purple-500/40 p-6 rounded-2xl space-y-4 transition-all hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Temporal Risk Filter</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Exponential Moving Average (EMA &alpha;=0.35) over a 10-frame buffer eliminates flickering false positives and guarantees stability.
            </p>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-8 px-4 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-cyan-400" />
            <span className="font-bold text-white">FakeShield PROT-V1.0</span>
            <span>&bull; Enterprise Cybersecurity System</span>
          </div>

          <p>Built with React, TypeScript, Three.js WebGL, MediaPipe &amp; ONNX Runtime Web</p>
        </div>
      </footer>

    </div>
  );
};
