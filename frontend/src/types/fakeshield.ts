export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export type PerformanceMode = 'performance' | 'balanced' | 'accuracy';

export interface FaceBoundingBox {
  x: number;      // normalized 0-1 or canvas pixel space
  y: number;
  width: number;
  height: number;
}

export interface DetectionResult {
  faceBox: FaceBoundingBox | null;
  rawScore: number;            // 0.0 (Real) to 1.0 (Manipulated)
  smoothedScore: number;       // EMA filtered score
  riskLevel: RiskLevel;
  authenticityScore: number;   // 0 to 100%
  manipulationScore: number;  // 0 to 100%
  confidence: number;          // Face detection confidence
  inferenceTimeMs: number;
  timestamp: number;
  isPartialFace?: boolean;
}

export interface SystemMetrics {
  fps: number;
  avgInferenceMs: number;
  p95InferenceMs: number;
  totalFramesProcessed: number;
  suspiciousFramesCount: number;
  highRiskEventsCount: number;
  activeFaceCount: number;
}

export interface EventLogItem {
  id: string;
  timestamp: string;
  riskLevel: RiskLevel;
  score: number;
  message: string;
}

export interface BenchmarkMetrics {
  totalFrames: number;
  truePositives: number;
  trueNegatives: number;
  falsePositives: number;
  falseNegatives: number;
  fpr: number;          // False Positive Rate (Target <= 0.10)
  fnr: number;          // False Negative Rate
  precision: number;
  recall: number;
  f1Score: number;
  accuracy: number;
  avgFps: number;
  avgInferenceMs: number;
  status: 'idle' | 'running' | 'completed';
}
