import type { RiskLevel } from '../types/fakeshield';

export interface RiskEvaluation {
  riskLevel: RiskLevel;
  authenticityScore: number;  // 0.0 - 100.0%
  manipulationScore: number; // 0.0 - 100.0%
  color: string;
  badgeClass: string;
  label: string;
}

export class RiskEngine {
  private lowThreshold: number;
  private highThreshold: number;

  constructor(lowThreshold: number = 0.35, highThreshold: number = 0.70) {
    this.lowThreshold = lowThreshold;
    this.highThreshold = highThreshold;
  }

  public evaluate(smoothedScore: number): RiskEvaluation {
    const manipulationScore = Math.round(smoothedScore * 1000) / 10;
    const authenticityScore = Math.round((1.0 - smoothedScore) * 1000) / 10;

    let riskLevel: RiskLevel = 'LOW';
    let color = '#10B981'; // Green
    let badgeClass = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
    let label = 'AUTHENTIC VIDEO FEED';

    if (smoothedScore >= this.highThreshold) {
      riskLevel = 'HIGH';
      color = '#EF4444'; // Red
      badgeClass = 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse';
      label = 'POTENTIAL MANIPULATED FACE DETECTED';
    } else if (smoothedScore >= this.lowThreshold) {
      riskLevel = 'MEDIUM';
      color = '#F59E0B'; // Amber
      badgeClass = 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      label = 'SUSPICIOUS FACIAL ARTIFACTS';
    }

    return {
      riskLevel,
      authenticityScore,
      manipulationScore,
      color,
      badgeClass,
      label
    };
  }

  public setThresholds(low: number, high: number): void {
    this.lowThreshold = low;
    this.highThreshold = high;
  }
}
