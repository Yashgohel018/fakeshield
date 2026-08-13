import React, { useEffect, useRef, useState } from 'react';
import { Scan, ShieldAlert, Cpu, Activity, Zap } from 'lucide-react';

export type ScanMode = 'biometric' | 'heatmap' | 'neural';

export const Face3DCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [scanMode, setScanMode] = useState<ScanMode>('biometric');
  const [isScanning, setIsScanning] = useState<boolean>(true);
  const [fpsCount, setFpsCount] = useState<number>(60);

  const scanModeRef = useRef<ScanMode>(scanMode);
  const isScanningRef = useRef<boolean>(isScanning);

  useEffect(() => {
    scanModeRef.current = scanMode;
  }, [scanMode]);

  useEffect(() => {
    isScanningRef.current = isScanning;
  }, [isScanning]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrameId: number;
    let frameCounter = 0;
    let lastFpsCalc = performance.now();
    let scanYProgress = 0.3; // 0.0 (top) to 1.0 (bottom)
    let scanDirection = 1;

    // Set high-DPI canvas size
    const resizeCanvas = () => {
      const parent = containerRef.current;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Render loop for high-fidelity 2D/3D polished human biometric scanner
    const render = () => {
      animFrameId = requestAnimationFrame(render);

      // Measure FPS
      frameCounter++;
      const now = performance.now();
      if (now - lastFpsCalc >= 1000) {
        setFpsCount(frameCounter);
        frameCounter = 0;
        lastFpsCalc = now;
      }

      const parent = containerRef.current;
      if (!parent) return;
      const w = parent.clientWidth;
      const h = parent.clientHeight;

      ctx.clearRect(0, 0, w, h);

      // Center point & face scale
      const cx = w / 2;
      const cy = h / 2 - 10;
      const scale = Math.min(w, h) / 480;

      // --- 1. Background Cyber Glow ---
      const bgGrad = ctx.createRadialGradient(cx, cy, 30 * scale, cx, cy, 220 * scale);
      bgGrad.addColorStop(0, 'rgba(15, 23, 42, 0.95)');
      bgGrad.addColorStop(0.6, 'rgba(15, 23, 42, 0.98)');
      bgGrad.addColorStop(1, 'rgba(2, 6, 23, 1)');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // Ambient radial glow behind face
      const ambientGlow = ctx.createRadialGradient(cx, cy - 20 * scale, 10 * scale, cx, cy - 20 * scale, 180 * scale);
      if (scanModeRef.current === 'heatmap') {
        ambientGlow.addColorStop(0, 'rgba(239, 68, 68, 0.25)');
        ambientGlow.addColorStop(1, 'rgba(239, 68, 68, 0)');
      } else if (scanModeRef.current === 'neural') {
        ambientGlow.addColorStop(0, 'rgba(168, 85, 247, 0.25)');
        ambientGlow.addColorStop(1, 'rgba(168, 85, 247, 0)');
      } else {
        ambientGlow.addColorStop(0, 'rgba(6, 182, 212, 0.25)');
        ambientGlow.addColorStop(1, 'rgba(6, 182, 212, 0)');
      }
      ctx.fillStyle = ambientGlow;
      ctx.fillRect(0, 0, w, h);

      // --- 2. Render Polished Human Avatar (Matching Reference Image) ---
      
      ctx.save();

      // White T-shirt Collar & Shoulders
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(cx, cy + 180 * scale, 140 * scale, 70 * scale, 0, Math.PI, 0);
      ctx.fill();

      // Neck
      const neckGrad = ctx.createLinearGradient(cx - 35 * scale, 0, cx + 35 * scale, 0);
      neckGrad.addColorStop(0, '#e59a80');
      neckGrad.addColorStop(0.5, '#f4b39e');
      neckGrad.addColorStop(1, '#e59a80');
      ctx.fillStyle = neckGrad;
      ctx.beginPath();
      ctx.roundRect(cx - 35 * scale, cy + 60 * scale, 70 * scale, 85 * scale, 12 * scale);
      ctx.fill();

      // Ears (Left & Right)
      ctx.fillStyle = '#e8a189';
      ctx.beginPath();
      ctx.ellipse(cx - 95 * scale, cy - 10 * scale, 16 * scale, 32 * scale, -0.15, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(cx + 95 * scale, cy - 10 * scale, 16 * scale, 32 * scale, 0.15, 0, Math.PI * 2);
      ctx.fill();

      // Face Base Oval (Warm natural skin tone matching image)
      const faceGrad = ctx.createLinearGradient(cx - 90 * scale, 0, cx + 90 * scale, 0);
      faceGrad.addColorStop(0, '#f0a892');
      faceGrad.addColorStop(0.5, '#f7c3b2');
      faceGrad.addColorStop(1, '#f0a892');

      ctx.fillStyle = faceGrad;
      ctx.beginPath();
      // Smooth face contour
      ctx.moveTo(cx - 90 * scale, cy - 50 * scale);
      ctx.bezierCurveTo(cx - 95 * scale, cy + 40 * scale, cx - 65 * scale, cy + 120 * scale, cx, cy + 125 * scale);
      ctx.bezierCurveTo(cx + 65 * scale, cy + 120 * scale, cx + 95 * scale, cy + 40 * scale, cx + 90 * scale, cy - 50 * scale);
      ctx.bezierCurveTo(cx + 85 * scale, cy - 140 * scale, cx - 85 * scale, cy - 140 * scale, cx - 90 * scale, cy - 50 * scale);
      ctx.closePath();
      ctx.fill();

      // Slick Black Hair (Matching Reference Image)
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.moveTo(cx - 92 * scale, cy - 30 * scale);
      ctx.bezierCurveTo(cx - 100 * scale, cy - 110 * scale, cx - 60 * scale, cy - 165 * scale, cx, cy - 165 * scale);
      ctx.bezierCurveTo(cx + 60 * scale, cy - 165 * scale, cx + 100 * scale, cy - 110 * scale, cx + 92 * scale, cy - 30 * scale);
      ctx.bezierCurveTo(cx + 80 * scale, cy - 75 * scale, cx + 40 * scale, cy - 120 * scale, cx, cy - 120 * scale);
      ctx.bezierCurveTo(cx - 40 * scale, cy - 120 * scale, cx - 80 * scale, cy - 75 * scale, cx - 92 * scale, cy - 30 * scale);
      ctx.closePath();
      ctx.fill();

      // Hair Sideburns
      ctx.beginPath();
      ctx.moveTo(cx - 90 * scale, cy - 40 * scale);
      ctx.lineTo(cx - 94 * scale, cy + 5 * scale);
      ctx.lineTo(cx - 86 * scale, cy - 20 * scale);
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(cx + 90 * scale, cy - 40 * scale);
      ctx.lineTo(cx + 94 * scale, cy + 5 * scale);
      ctx.lineTo(cx + 86 * scale, cy - 20 * scale);
      ctx.fill();

      // Eyebrows (Dark Defined Arcs matching reference image)
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.moveTo(cx - 68 * scale, cy - 42 * scale);
      ctx.quadraticCurveTo(cx - 42 * scale, cy - 54 * scale, cx - 16 * scale, cy - 42 * scale);
      ctx.quadraticCurveTo(cx - 42 * scale, cy - 47 * scale, cx - 68 * scale, cy - 42 * scale);
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(cx + 68 * scale, cy - 42 * scale);
      ctx.quadraticCurveTo(cx + 42 * scale, cy - 54 * scale, cx + 16 * scale, cy - 42 * scale);
      ctx.quadraticCurveTo(cx + 42 * scale, cy - 47 * scale, cx + 68 * scale, cy - 42 * scale);
      ctx.fill();

      // Eyes (White Sclera + Dark Pupil + Highlight)
      const eyeY = cy - 22 * scale;
      const eyeLX = cx - 42 * scale;
      const eyeRX = cx + 42 * scale;

      // Eye White
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(eyeLX, eyeY, 18 * scale, 12 * scale, 0, 0, Math.PI * 2);
      ctx.ellipse(eyeRX, eyeY, 18 * scale, 12 * scale, 0, 0, Math.PI * 2);
      ctx.fill();

      // Pupil & Iris
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(eyeLX, eyeY, 8.5 * scale, 0, Math.PI * 2);
      ctx.arc(eyeRX, eyeY, 8.5 * scale, 0, Math.PI * 2);
      ctx.fill();

      // Pupil Glint
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(eyeLX - 3 * scale, eyeY - 3 * scale, 2.5 * scale, 0, Math.PI * 2);
      ctx.arc(eyeRX - 3 * scale, eyeY - 3 * scale, 2.5 * scale, 0, Math.PI * 2);
      ctx.fill();

      // Nose Contour (Matching Reference Image)
      ctx.strokeStyle = '#d6856d';
      ctx.lineWidth = 2.5 * scale;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(cx - 10 * scale, cy + 18 * scale);
      ctx.quadraticCurveTo(cx, cy + 24 * scale, cx + 10 * scale, cy + 18 * scale);
      ctx.stroke();

      // Lips (Pinkish Red Tone matching image)
      ctx.fillStyle = '#d96459';
      ctx.beginPath();
      ctx.moveTo(cx - 28 * scale, cy + 54 * scale);
      ctx.quadraticCurveTo(cx, cy + 46 * scale, cx + 28 * scale, cy + 54 * scale);
      ctx.quadraticCurveTo(cx, cy + 74 * scale, cx - 28 * scale, cy + 54 * scale);
      ctx.fill();

      ctx.restore();

      // --- 3. Render Biometric Landmark Overlays & Mode Effects ---
      
      // Landmark Node Coordinates relative to face center
      const nodes: Array<[number, number]> = [
        // Forehead
        [cx - 50 * scale, cy - 75 * scale], [cx, cy - 80 * scale], [cx + 50 * scale, cy - 75 * scale],
        // Eyebrows & Eyes
        [eyeLX - 22 * scale, eyeY], [eyeLX, eyeY - 14 * scale], [eyeLX + 22 * scale, eyeY], [eyeLX, eyeY + 14 * scale],
        [eyeRX - 22 * scale, eyeY], [eyeRX, eyeY - 14 * scale], [eyeRX + 22 * scale, eyeY], [eyeRX, eyeY + 14 * scale],
        // Nose
        [cx, cy - 10 * scale], [cx - 12 * scale, cy + 20 * scale], [cx + 12 * scale, cy + 20 * scale],
        // Mouth
        [cx - 30 * scale, cy + 54 * scale], [cx, cy + 48 * scale], [cx + 30 * scale, cy + 54 * scale], [cx, cy + 62 * scale],
        // Jawline & Chin
        [cx - 75 * scale, cy + 30 * scale], [cx + 75 * scale, cy + 30 * scale],
        [cx - 55 * scale, cy + 95 * scale], [cx + 55 * scale, cy + 95 * scale],
        [cx, cy + 122 * scale]
      ];

      let overlayColor = '#00f0ff';
      let nodeColor = '#38bdf8';
      if (scanModeRef.current === 'heatmap') {
        overlayColor = 'rgba(239, 68, 68, 0.8)';
        nodeColor = '#f97316';
      } else if (scanModeRef.current === 'neural') {
        overlayColor = 'rgba(168, 85, 247, 0.8)';
        nodeColor = '#c084fc';
      }

      // Draw Mode Connections
      if (scanModeRef.current !== 'biometric') {
        ctx.strokeStyle = overlayColor;
        ctx.lineWidth = 1.2 * scale;
        ctx.beginPath();
        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            const dist = Math.hypot(nodes[i][0] - nodes[j][0], nodes[i][1] - nodes[j][1]);
            if (dist < 60 * scale) {
              ctx.moveTo(nodes[i][0], nodes[i][1]);
              ctx.lineTo(nodes[j][0], nodes[j][1]);
            }
          }
        }
        ctx.stroke();
      }

      // Draw Landmark Node Dots
      nodes.forEach(([nx, ny]) => {
        ctx.fillStyle = nodeColor;
        ctx.beginPath();
        ctx.arc(nx, ny, 3.5 * scale, 0, Math.PI * 2);
        ctx.fill();
      });

      // --- 4. Render Horizontal Cyan Laser Beam (Matching Reference Image) ---
      if (isScanningRef.current) {
        // Animate Y position up and down across face region
        scanYProgress += 0.008 * scanDirection;
        if (scanYProgress >= 0.85) scanDirection = -1;
        if (scanYProgress <= 0.15) scanDirection = 1;

        const laserY = cy - 140 * scale + (270 * scale) * scanYProgress;

        ctx.save();
        
        // Laser Glow Ambient Strip
        let laserColor = '#00f0ff';
        if (scanModeRef.current === 'heatmap') laserColor = '#ef4444';
        if (scanModeRef.current === 'neural') laserColor = '#a855f7';

        const laserGlow = ctx.createLinearGradient(0, laserY - 12 * scale, 0, laserY + 12 * scale);
        laserGlow.addColorStop(0, 'rgba(0, 240, 255, 0)');
        laserGlow.addColorStop(0.5, scanModeRef.current === 'heatmap' ? 'rgba(239, 68, 68, 0.35)' : 'rgba(0, 240, 255, 0.45)');
        laserGlow.addColorStop(1, 'rgba(0, 240, 255, 0)');

        ctx.fillStyle = laserGlow;
        ctx.fillRect(cx - 180 * scale, laserY - 12 * scale, 360 * scale, 24 * scale);

        // Core Sharp Horizontal Beam Line (Matching Image)
        ctx.strokeStyle = laserColor;
        ctx.lineWidth = 3.5 * scale;
        ctx.shadowColor = laserColor;
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.moveTo(cx - 190 * scale, laserY);
        ctx.lineTo(cx + 190 * scale, laserY);
        ctx.stroke();

        // Laser End Points Glowing Dots
        ctx.fillStyle = laserColor;
        ctx.beginPath();
        ctx.arc(cx - 190 * scale, laserY, 5 * scale, 0, Math.PI * 2);
        ctx.arc(cx + 190 * scale, laserY, 5 * scale, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

      // --- 5. Render Cyan Corner Reticle Brackets ┌ ┐ └ ┘ ---
      ctx.save();
      const frameW = 270 * scale;
      const frameH = 340 * scale;
      const frameX = cx - frameW / 2;
      const frameY = cy - frameH / 2 - 10 * scale;
      const arm = 30 * scale;

      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 3 * scale;
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 8;

      // ┌ Top Left
      ctx.beginPath();
      ctx.moveTo(frameX, frameY + arm);
      ctx.lineTo(frameX, frameY);
      ctx.lineTo(frameX + arm, frameY);
      ctx.stroke();

      // ┐ Top Right
      ctx.beginPath();
      ctx.moveTo(frameX + frameW - arm, frameY);
      ctx.lineTo(frameX + frameW, frameY);
      ctx.lineTo(frameX + frameW, frameY + arm);
      ctx.stroke();

      // └ Bottom Left
      ctx.beginPath();
      ctx.moveTo(frameX, frameY + frameH - arm);
      ctx.lineTo(frameX, frameY + frameH);
      ctx.lineTo(frameX + arm, frameY + frameH);
      ctx.stroke();

      // ┘ Bottom Right
      ctx.beginPath();
      ctx.moveTo(frameX + frameW - arm, frameY + frameH);
      ctx.lineTo(frameX + frameW, frameY + frameH);
      ctx.lineTo(frameX + frameW, frameY + frameH - arm);
      ctx.stroke();

      ctx.restore();
    };

    render();

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <div className="relative w-full h-[450px] sm:h-[540px] rounded-2xl bg-slate-950/90 border border-cyan-500/30 backdrop-blur-xl overflow-hidden shadow-2xl shadow-cyan-500/15 flex flex-col justify-between p-4 group">
      
      {/* Top Floating Telemetry Header */}
      <div className="relative z-10 flex items-center justify-between bg-slate-900/90 border border-slate-800/80 rounded-xl p-3 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 animate-pulse">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white tracking-wide uppercase flex items-center gap-1.5">
              3D Facial Biometric Scanner
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                WASM-60FPS
              </span>
            </h4>
            <p className="text-[11px] text-slate-400 font-mono">
              Mode: <span className="text-cyan-400 font-bold">Laser Beam Audit</span> | Landmarks: <span className="text-cyan-400 font-bold">468 Points</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span>{fpsCount} FPS</span>
          </div>

          <button
            onClick={() => setIsScanning(!isScanning)}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all ${
              isScanning
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 hover:bg-cyan-500/30'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
            }`}
          >
            <Scan className="w-3.5 h-3.5" />
            <span>{isScanning ? 'Laser ON' : 'Laser OFF'}</span>
          </button>
        </div>
      </div>

      {/* High-DPI Canvas Element Target */}
      <div ref={containerRef} className="absolute inset-0 w-full h-full cursor-pointer">
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>

      {/* Bottom Interactive HUD Overlay */}
      <div className="relative z-10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5 bg-slate-900/90 border border-slate-800/80 rounded-xl p-2.5 backdrop-blur-md">
        
        {/* Mode Selector Buttons */}
        <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-lg border border-slate-800 w-full md:w-auto shrink-0">
          <button
            onClick={() => setScanMode('biometric')}
            className={`flex-1 md:flex-none px-2.5 py-1.5 rounded-md text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
              scanMode === 'biometric'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Scan className="w-3.5 h-3.5" />
            <span>Biometric</span>
          </button>

          <button
            onClick={() => setScanMode('heatmap')}
            className={`flex-1 md:flex-none px-2.5 py-1.5 rounded-md text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
              scanMode === 'heatmap'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Heatmap</span>
          </button>

          <button
            onClick={() => setScanMode('neural')}
            className={`flex-1 md:flex-none px-2.5 py-1.5 rounded-md text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
              scanMode === 'neural'
                ? 'bg-purple-500 text-white font-bold shadow-md shadow-purple-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Neural Graph</span>
          </button>
        </div>

        {/* Live Status Indicator */}
        <div className="flex items-center justify-between md:justify-end gap-2 text-xs shrink-0">
          <span className="text-slate-400 font-mono text-[11px] hidden lg:inline">Laser Beam Sweep</span>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-950 border border-slate-800 text-[11px] text-emerald-400 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span>REALTIME</span>
          </div>
        </div>

      </div>
    </div>
  );
};
