import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Monitor, ShieldAlert, CheckCircle2, ArrowRight, Video } from 'lucide-react';

export const VideoCallPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 max-w-5xl mx-auto space-y-8">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold uppercase">
          <Monitor className="w-4 h-4 text-cyan-400" />
          Live Meeting Protection Workflow
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Video Call Deepfake Protection (Google Meet, Zoom, Teams)
        </h1>

        <p className="text-slate-300 text-base leading-relaxed max-w-3xl">
          Modern web browsers enforce strict cross-origin security rules to prevent arbitrary web apps from silently recording other tabs or apps without user consent. FakeShield uses legitimate browser tab/screen capture APIs to analyze live meeting video in real time.
        </p>

        {/* Security Notice Box */}
        <div className="bg-slate-950/80 border border-amber-500/30 rounded-xl p-4 flex items-start gap-3 text-amber-300 text-xs sm:text-sm">
          <ShieldAlert className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <strong className="font-semibold text-amber-200 block mb-1">Browser Privacy Standard:</strong>
            FakeShield requires explicit user permission to share your video call browser tab or window. Your video stream is processed 100% locally in your browser memory and never uploaded anywhere.
          </div>
        </div>

        {/* Launcher Button */}
        <div className="pt-2">
          <button
            onClick={() => navigate('/detection?source=videocall')}
            className="px-8 py-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-base flex items-center gap-3 transition-all shadow-lg shadow-cyan-500/20 hover:scale-[1.02]"
          >
            <Monitor className="w-5 h-5" />
            <span>Launch Video Call Analysis</span>
            <ArrowRight className="w-5 h-5 ml-1" />
          </button>
        </div>
      </div>

      {/* Guided 5-Step Instructions */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-cyan-400" />
          5-Step Guided Setup Instructions
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-2">
            <div className="text-xs font-bold font-mono text-cyan-400 uppercase">Step 1</div>
            <h3 className="text-base font-bold text-white">Join Your Meeting</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Open your target video-call platform (Google Meet, Zoom, Microsoft Teams, Webex) in another tab or window and join the live meeting.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-2">
            <div className="text-xs font-bold font-mono text-cyan-400 uppercase">Step 2</div>
            <h3 className="text-base font-bold text-white">Click "Launch Video Call Analysis"</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Click the button above or select "Video Call (Tab Share)" in the Detection Center to open the browser screen share selector dialog.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-2">
            <div className="text-xs font-bold font-mono text-cyan-400 uppercase">Step 3</div>
            <h3 className="text-base font-bold text-white">Select Video Call Tab/Window</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              In the browser prompt, select the tab or window containing your live video call stream (e.g. "Google Meet - Meeting") and click Share.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-2">
            <div className="text-xs font-bold font-mono text-cyan-400 uppercase">Step 4</div>
            <h3 className="text-base font-bold text-white">Monitor Real-Time Overlay</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              FakeShield immediately tracks faces, computes ONNX neural predictions, and renders live authenticity overlay boxes on top of captured streams.
            </p>
          </div>

        </div>
      </div>

      {/* Supported Platforms Grid */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
          Tested & Compatible Platforms
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-center font-semibold text-slate-200 text-xs flex items-center justify-center gap-2">
            <Video className="w-4 h-4 text-cyan-400" />
            Google Meet
          </div>
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-center font-semibold text-slate-200 text-xs flex items-center justify-center gap-2">
            <Video className="w-4 h-4 text-blue-400" />
            Zoom Web App
          </div>
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-center font-semibold text-slate-200 text-xs flex items-center justify-center gap-2">
            <Video className="w-4 h-4 text-purple-400" />
            Microsoft Teams
          </div>
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-center font-semibold text-slate-200 text-xs flex items-center justify-center gap-2">
            <Video className="w-4 h-4 text-emerald-400" />
            Cisco Webex
          </div>
        </div>
      </div>

    </div>
  );
};
