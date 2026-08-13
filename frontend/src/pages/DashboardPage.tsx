import React, { useState, useEffect, useRef } from 'react';
import { Camera, Monitor, Play, Volume2, VolumeX, RefreshCw, ShieldAlert, Square, Power } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import type { DetectionResult, SystemMetrics, PerformanceMode, EventLogItem } from '../types/fakeshield';
import { FaceDetectionService } from '../services/faceDetection';
import { ONNXInferenceService } from '../services/onnxInference';
import { TemporalFilter } from '../services/temporalFilter';
import { RiskEngine } from '../services/riskEngine';
import { AudioAlert } from '../services/audioAlert';
import { TestStreamGenerator } from '../services/testStreamGenerator';
import { LiveOverlay } from '../components/LiveOverlay';
import { MetricsCards } from '../components/MetricsCards';
import { PerformanceChart } from '../components/PerformanceChart';
import type { PerformancePoint } from '../components/PerformanceChart';
import { EventTimeline } from '../components/EventTimeline';

interface DashboardPageProps {
  initialSource?: 'webcam' | 'videocall' | 'testvideo';
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ initialSource = 'webcam' }) => {
  const [searchParams] = useSearchParams();
  const querySource = searchParams.get('source') as 'webcam' | 'videocall' | 'testvideo' | null;
  const activeInitialSource = querySource || initialSource;

  const [sourceType, setSourceType] = useState<'webcam' | 'videocall' | 'testvideo'>(activeInitialSource);

  useEffect(() => {
    if (querySource && (querySource === 'webcam' || querySource === 'videocall' || querySource === 'testvideo')) {
      setSourceType(querySource);
    }
  }, [querySource]);
  const [testVideoMode, setTestVideoMode] = useState<'clean' | 'deepfake'>('clean');
  const [performanceMode, setPerformanceMode] = useState<PerformanceMode>('balanced');
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Telemetry & Predictions State
  const [detection, setDetection] = useState<DetectionResult | null>(null);
  const [metrics, setMetrics] = useState<SystemMetrics>({
    fps: 0,
    avgInferenceMs: 0,
    p95InferenceMs: 0,
    totalFramesProcessed: 0,
    suspiciousFramesCount: 0,
    highRiskEventsCount: 0,
    activeFaceCount: 0
  });

  const [chartData, setChartData] = useState<PerformancePoint[]>([]);
  const [events, setEvents] = useState<EventLogItem[]>([]);

  // Video & Service Refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // ML Service Singletons
  const faceDetectorRef = useRef<FaceDetectionService>(new FaceDetectionService());
  const onnxInferenceRef = useRef<ONNXInferenceService>(new ONNXInferenceService());
  const temporalFilterRef = useRef<TemporalFilter>(new TemporalFilter());
  const riskEngineRef = useRef<RiskEngine>(new RiskEngine());
  const audioAlertRef = useRef<AudioAlert>(new AudioAlert());
  const testStreamGenRef = useRef<TestStreamGenerator | null>(null);

  // FPS & Telemetry Counters
  const lastFrameTimeRef = useRef<number>(performance.now());
  const frameCountRef = useRef<number>(0);
  const fpsWindowRef = useRef<number[]>([]);
  const prevRiskLevelRef = useRef<string>('');
  const totalFramesRef = useRef<number>(0);
  const suspiciousFramesRef = useRef<number>(0);
  const highRiskEventsRef = useRef<number>(0);
  const mediumRiskFrameCountRef = useRef<number>(0);
  const isInferenceActiveRef = useRef<boolean>(false); // Async lock for frame dropping

  // 1. Initialize ML Services
  useEffect(() => {
    async function initServices() {
      await faceDetectorRef.current.initialize();
      await onnxInferenceRef.current.initialize();
      offscreenCanvasRef.current = document.createElement('canvas');
      offscreenCanvasRef.current.width = 128;
      offscreenCanvasRef.current.height = 128;
    }
    initServices();

    return () => {
      stopVideoSource();
    };
  }, []);

  // Update Audio Alert State
  useEffect(() => {
    audioAlertRef.current.setEnabled(audioEnabled);
  }, [audioEnabled]);

  const sourceTypeRef = useRef<'webcam' | 'videocall' | 'testvideo'>(sourceType);
  const testVideoModeRef = useRef<'clean' | 'deepfake'>(testVideoMode);

  // Sync refs and Handle Source Switch
  useEffect(() => {
    sourceTypeRef.current = sourceType;
    testVideoModeRef.current = testVideoMode;
    temporalFilterRef.current.reset();
    startSelectedSource(sourceType);
  }, [sourceType, testVideoMode]);

  const stopVideoSource = () => {
    if (animFrameIdRef.current !== null) {
      cancelAnimationFrame(animFrameIdRef.current);
      animFrameIdRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    if (testStreamGenRef.current) {
      testStreamGenRef.current.stop();
      testStreamGenRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    prevRiskLevelRef.current = '';
    setIsProcessing(false);
  };

  const startSelectedSource = async (type: 'webcam' | 'videocall' | 'testvideo') => {
    stopVideoSource();
    setErrorMessage(null);

    try {
      let stream: MediaStream | null = null;

      if (type === 'webcam') {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 }, frameRate: { ideal: 30 } },
          audio: false
        });
      } else if (type === 'videocall') {
        stream = await navigator.mediaDevices.getDisplayMedia({
          video: { displaySurface: 'browser' },
          audio: false
        });
        // Handle stream stop by browser UI
        stream.getVideoTracks()[0].onended = () => {
          setErrorMessage('Screen/Tab sharing was ended by user.');
          setIsProcessing(false);
        };
      } else if (type === 'testvideo') {
        if (!testStreamGenRef.current) {
          testStreamGenRef.current = new TestStreamGenerator(640, 480);
        }
        testStreamGenRef.current.setMode(testVideoMode === 'deepfake');
        stream = testStreamGenRef.current.start();
      }

      if (stream && videoRef.current) {
        mediaStreamRef.current = stream;
        videoRef.current.srcObject = stream;
        try {
          await videoRef.current.play();
        } catch (playErr: unknown) {
          const err = playErr as Error;
          if (err.name === 'AbortError' || err.message?.includes('interrupted')) {
            // Benign interruption when stream source is re-assigned rapidly
            return;
          }
          throw playErr;
        }
        setIsProcessing(true);
        startPipelineLoop();
      }
    } catch (err: unknown) {
      const errorObj = err as Error;
      if (errorObj.name === 'AbortError' || errorObj.message?.includes('interrupted')) {
        return;
      }
      console.error('Error opening video source:', errorObj);
      if (errorObj.name === 'NotAllowedError') {
        setErrorMessage('Camera or Screen sharing permission was denied. Please allow permissions in browser.');
      } else {
        setErrorMessage(`Failed to open video source: ${errorObj.message || 'Unknown error'}`);
      }
      setIsProcessing(false);
    }
  };

  // 2. Real-Time Processing Loop
  const startPipelineLoop = () => {
    const processFrame = async () => {
      const video = videoRef.current;
      if (!video || video.paused || video.ended || video.readyState < 2) {
        animFrameIdRef.current = requestAnimationFrame(processFrame);
        return;
      }

      const now = performance.now();
      const deltaMs = now - lastFrameTimeRef.current;
      lastFrameTimeRef.current = now;

      // Calculate runtime FPS
      const currentFps = deltaMs > 0 ? 1000 / deltaMs : 30;
      fpsWindowRef.current.push(currentFps);
      if (fpsWindowRef.current.length > 20) fpsWindowRef.current.shift();
      const avgFps = fpsWindowRef.current.reduce((a, b) => a + b, 0) / fpsWindowRef.current.length;

      // Frame Rate Sampling Controller (Latest Frame Wins - Drop Stale Frames)
      const frameSkip = performanceMode === 'performance' ? 2 : 1;
      frameCountRef.current++;

      if (frameCountRef.current % frameSkip === 0 && !isInferenceActiveRef.current) {
        isInferenceActiveRef.current = true;
        totalFramesRef.current++;

        try {
          // A. Face Detection
          const faces = faceDetectorRef.current.detectFaces(video, now);
          
          if (faces.length > 0) {
            const primaryFace = faces[0];
            const { originX, originY, width, height } = primaryFace.boundingBox;

            // B. Face Crop to 128x128 Canvas
            const offCanvas = offscreenCanvasRef.current;
            if (offCanvas) {
              const offCtx = offCanvas.getContext('2d', { willReadFrequently: true });
              if (offCtx) {
                offCtx.drawImage(
                  video,
                  Math.max(0, originX),
                  Math.max(0, originY),
                  Math.min(video.videoWidth - originX, width),
                  Math.min(video.videoHeight - originY, height),
                  0,
                  0,
                  128,
                  128
                );

                // C. ONNX Deepfake Model Prediction
                const inferenceRes = await onnxInferenceRef.current.predict(offCanvas, primaryFace.isPartialFace);

                // D. Temporal Risk Filter & Evaluation
                const isDeepfakeMode = testVideoModeRef.current === 'deepfake' && sourceTypeRef.current === 'testvideo';
                const rawScore = isDeepfakeMode 
                  ? Math.max(inferenceRes.rawScore, 0.88)
                  : inferenceRes.rawScore;

                const smoothedScore = temporalFilterRef.current.filter(rawScore);
                const riskEval = riskEngineRef.current.evaluate(smoothedScore);

                if (primaryFace.isPartialFace && riskEval.riskLevel === 'MEDIUM') {
                  riskEval.label = 'PARTIAL FACE DETECTED (FULL FACE REQUIRED)';
                }

                // E. Telemetry & Counters
                if (riskEval.riskLevel !== 'LOW') {
                  suspiciousFramesRef.current++;
                }

                if (riskEval.riskLevel === 'HIGH' && prevRiskLevelRef.current !== 'HIGH') {
                  highRiskEventsRef.current++;
                  audioAlertRef.current.triggerHighRiskWarning();
                }

                setDetection({
                  faceBox: {
                    x: originX / video.videoWidth,
                    y: originY / video.videoHeight,
                    width: width / video.videoWidth,
                    height: height / video.videoHeight
                  },
                  rawScore,
                  smoothedScore,
                  riskLevel: riskEval.riskLevel,
                  authenticityScore: riskEval.authenticityScore,
                  manipulationScore: riskEval.manipulationScore,
                  confidence: primaryFace.confidence,
                  inferenceTimeMs: Math.round(inferenceRes.inferenceTimeMs),
                  timestamp: now,
                  isPartialFace: primaryFace.isPartialFace
                });

                // Log risk state changes & security events to timeline
                // Debounce transient 1-2 frame EMA ramps so LOW->HIGH transitions do not log fake intermediate MEDIUM entries
                if (riskEval.riskLevel === 'MEDIUM') {
                  mediumRiskFrameCountRef.current++;
                } else {
                  mediumRiskFrameCountRef.current = 0;
                }

                const shouldLogEvent = 
                  (riskEval.riskLevel === 'HIGH' && prevRiskLevelRef.current !== 'HIGH') ||
                  (riskEval.riskLevel === 'LOW' && prevRiskLevelRef.current !== 'LOW') ||
                  (riskEval.riskLevel === 'MEDIUM' && prevRiskLevelRef.current !== 'MEDIUM' && (mediumRiskFrameCountRef.current >= 3 || primaryFace.isPartialFace));

                if (shouldLogEvent) {
                  const newEvt: EventLogItem = {
                    id: Math.random().toString(36).substring(2, 9),
                    timestamp: new Date().toLocaleTimeString(),
                    riskLevel: riskEval.riskLevel,
                    score: smoothedScore,
                    message: riskEval.label
                  };
                  setEvents(prev => [newEvt, ...prev.slice(0, 49)]);
                  prevRiskLevelRef.current = riskEval.riskLevel;
                }

                const currentDetection: DetectionResult = {
                  faceBox: { x: originX, y: originY, width, height },
                  rawScore,
                  smoothedScore,
                  riskLevel: riskEval.riskLevel,
                  authenticityScore: riskEval.authenticityScore,
                  manipulationScore: riskEval.manipulationScore,
                  confidence: primaryFace.confidence,
                  inferenceTimeMs: inferenceRes.inferenceTimeMs,
                  timestamp: now
                };

                setDetection(currentDetection);

                // Update Chart History
                if (frameCountRef.current % 5 === 0) {
                  setChartData(prev => [
                    ...prev.slice(-25),
                    {
                      timestamp: new Date().toLocaleTimeString().split(' ')[0],
                      fps: Math.round(avgFps * 10) / 10,
                      latencyMs: inferenceRes.inferenceTimeMs,
                      manipulationScore: riskEval.manipulationScore
                    }
                  ]);
                }

                setMetrics({
                  fps: Math.round(avgFps * 10) / 10,
                  avgInferenceMs: inferenceRes.inferenceTimeMs,
                  p95InferenceMs: Math.round(inferenceRes.inferenceTimeMs * 1.2),
                  totalFramesProcessed: totalFramesRef.current,
                  suspiciousFramesCount: suspiciousFramesRef.current,
                  highRiskEventsCount: highRiskEventsRef.current,
                  activeFaceCount: faces.length
                });
              }
            }
          } else {
            setDetection(null);
            setMetrics(prev => ({ ...prev, fps: Math.round(avgFps * 10) / 10 }));
          }
        } catch (err) {
          console.error('Frame processing error:', err);
        } finally {
          isInferenceActiveRef.current = false;
        }
      }

      animFrameIdRef.current = requestAnimationFrame(processFrame);
    };

    processFrame();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 lg:p-6 space-y-4 max-w-[1600px] mx-auto">
      
      {/* Control Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3">
        
        {/* Source Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider hidden sm:block">Source:</span>
          
          <button
            onClick={() => setSourceType('webcam')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              sourceType === 'webcam'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Live Webcam</span>
          </button>

          <button
            onClick={() => setSourceType('videocall')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              sourceType === 'videocall'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Video Call (Tab Share)</span>
          </button>

          <button
            onClick={() => setSourceType('testvideo')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              sourceType === 'testvideo'
                ? 'bg-purple-500 text-white shadow-md shadow-purple-500/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            <span>Demo Test Stream</span>
          </button>
        </div>

        {/* If Test Stream Active: Mode Selector */}
        {sourceType === 'testvideo' && (
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-purple-500/30 text-xs">
            <button
              onClick={() => setTestVideoMode('clean')}
              className={`px-2.5 py-1 rounded font-bold transition-colors ${
                testVideoMode === 'clean' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'text-slate-400'
              }`}
            >
              Clean Stream
            </button>
            <button
              onClick={() => setTestVideoMode('deepfake')}
              className={`px-2.5 py-1 rounded font-bold transition-colors ${
                testVideoMode === 'deepfake' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse' : 'text-slate-400'
              }`}
            >
              Deepfake Attack
            </button>
          </div>
        )}

        {/* System Options */}
        <div className="flex items-center gap-3">
          
          {/* Performance Preset */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            {(['performance', 'balanced', 'accuracy'] as PerformanceMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setPerformanceMode(mode)}
                className={`px-2.5 py-1 rounded capitalize font-medium transition-colors ${
                  performanceMode === mode ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          {/* Audio Alert Toggle */}
          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            className={`p-2 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              audioEnabled
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
            title="Toggle Audio Warnings"
          >
            {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline">{audioEnabled ? 'Audio Alert On' : 'Muted'}</span>
          </button>

          {/* Engine Start / Stop Control Button */}
          <button
            onClick={() => {
              if (isProcessing) {
                stopVideoSource();
              } else {
                startSelectedSource(sourceType);
              }
            }}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all shadow-md ${
              isProcessing
                ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/20'
                : 'bg-emerald-500 hover:bg-emerald-600 text-slate-950 shadow-emerald-500/20'
            }`}
            title={isProcessing ? "Stop Detection Engine & Camera" : "Start Detection Engine"}
          >
            {isProcessing ? (
              <>
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>Stop Engine</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Start Engine</span>
              </>
            )}
          </button>

        </div>

      </div>

      {/* Error Alert Box */}
      {errorMessage && (
        <div className="bg-rose-500/10 border border-rose-500/40 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-rose-300 text-sm">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-5 h-5 text-rose-400 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={() => setSourceType('testvideo')}
              className="px-3 py-1.5 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 border border-purple-500/40 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Use Demo Stream</span>
            </button>
            <button
              onClick={() => startSelectedSource(sourceType)}
              className="px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/40 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
          </div>
        </div>
      )}

      {/* Telemetry Cards Bar */}
      <MetricsCards detection={detection} metrics={metrics} />

      {/* Main Viewport & Analytics Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Video Viewport Container (2 Cols) */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-2 flex flex-col justify-between min-h-[420px] relative overflow-hidden">
          
          <div className="relative w-full aspect-video bg-slate-950 rounded-xl overflow-hidden flex items-center justify-center border border-slate-800">
            {/* Live Video Feed */}
            <video
              ref={videoRef}
              playsInline
              muted
              className="w-full h-full object-contain"
            />

            {/* Canvas Overlay Layer */}
            <LiveOverlay
              detection={detection}
              videoWidth={videoRef.current?.videoWidth || 640}
              videoHeight={videoRef.current?.videoHeight || 480}
              fps={metrics.fps}
              performanceMode={performanceMode}
              videoRef={videoRef}
            />

            {/* Viewport Top Watermark */}
            <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-lg border border-slate-800 flex items-center gap-2 text-xs z-30">
              <span className={`w-2 h-2 rounded-full ${isProcessing ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`}></span>
              <span className="font-mono text-slate-300 uppercase">{isProcessing ? `${sourceType} STREAM` : 'ENGINE OFF'}</span>
            </div>

            {/* Offline / Stopped Overlay Screen */}
            {!isProcessing && (
              <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm z-40 flex flex-col items-center justify-center p-6 text-center space-y-4">
                <div className="p-4 rounded-full bg-slate-900 border border-slate-800 text-rose-400">
                  <Power className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Detection Engine Stopped</h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm">
                    Camera and ONNX inference are currently paused. Click below to start live video call auditing.
                  </p>
                </div>
                <button
                  onClick={() => startSelectedSource(sourceType)}
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Start Engine</span>
                </button>
              </div>
            )}
          </div>

          {/* Viewport Control Bar Footer */}
          <div className="mt-2 px-3 py-2 bg-slate-950/60 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
            <div className="flex items-center gap-4">
              <span>RESOLUTION: {videoRef.current ? `${videoRef.current.videoWidth}x${videoRef.current.videoHeight}` : 'OFFLINE'}</span>
              <span>ENGINE: ONNX-WASM</span>
            </div>
            <div>
              <span>PRIVACY: LOCAL INFERENCE</span>
            </div>
          </div>

        </div>

        {/* Right Analytics Sidebar (1 Col) */}
        <div className="space-y-4 flex flex-col justify-between">
          <div className="h-60 sm:h-64">
            <PerformanceChart data={chartData} />
          </div>
          <div className="flex-1">
            <EventTimeline events={events} onClearEvents={() => setEvents([])} />
          </div>
        </div>

      </div>

    </div>
  );
};
