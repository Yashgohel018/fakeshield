import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Shield, Video, BarChart3, Lock, Cpu, Play } from 'lucide-react';

interface HeaderProps {
  isSystemActive?: boolean;
  fps?: number;
}

export const Header: React.FC<HeaderProps> = ({
  isSystemActive = true,
  fps = 0
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const currentPath = location.pathname;

  return (
    <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={() => navigate('/')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 group-hover:border-cyan-400 transition-colors">
            <Shield className="w-6 h-6 text-cyan-400 group-hover:scale-105 transition-transform" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xl tracking-tight text-white">FakeShield</span>
              <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                PROT-V1.0
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">Real-Time Deepfake Video Call Protection</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-950/60 p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => navigate('/detection')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
              currentPath === '/detection' || currentPath === '/'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>Detection Center</span>
          </button>

          <button
            onClick={() => navigate('/videocall')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
              currentPath === '/videocall'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Play className="w-4 h-4" />
            <span>Video Call Protection</span>
          </button>

          <button
            onClick={() => navigate('/benchmarks')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
              currentPath === '/benchmarks'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Benchmarks</span>
          </button>

          <button
            onClick={() => navigate('/privacy')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
              currentPath === '/privacy'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Privacy & Model</span>
          </button>
        </nav>

        {/* Live Telemetry Status Badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800 text-xs">
            <span className={`w-2 h-2 rounded-full ${isSystemActive ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`}></span>
            <span className="font-mono text-slate-300">
              {isSystemActive ? `ENGINE ACTIVE (${fps.toFixed(1)} FPS)` : 'ENGINE IDLE'}
            </span>
          </div>

          <button
            onClick={() => navigate('/detection')}
            className="md:hidden p-2 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
          >
            <Cpu className="w-5 h-5" />
          </button>
        </div>

      </div>
    </header>
  );
};
