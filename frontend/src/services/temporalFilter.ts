/**
 * TemporalFilter maintains a rolling history of frame prediction scores
 * to eliminate single-frame noise and flickering.
 * Implements Exponential Moving Average (EMA) combined with a median filter.
 */
export class TemporalFilter {
  private windowSize: number;
  private alpha: number;
  private scoreBuffer: number[];
  private currentSmoothedScore: number;

  constructor(windowSize: number = 10, alpha: number = 0.35) {
    this.windowSize = windowSize;
    this.alpha = alpha;
    this.scoreBuffer = [];
    this.currentSmoothedScore = 0.0;
  }

  /**
   * Pushes a raw model prediction score [0.0 - 1.0] and returns smoothed score
   */
  public filter(rawScore: number): number {
    this.scoreBuffer.push(rawScore);
    if (this.scoreBuffer.length > this.windowSize) {
      this.scoreBuffer.shift();
    }

    // 1. Calculate Median of recent predictions
    const sorted = [...this.scoreBuffer].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    const medianScore = sorted.length % 2 !== 0 
      ? sorted[mid] 
      : (sorted[mid - 1] + sorted[mid]) / 2;

    // 2. Combine with Exponential Moving Average (EMA)
    if (this.scoreBuffer.length === 1) {
      this.currentSmoothedScore = medianScore;
    } else {
      this.currentSmoothedScore = this.alpha * medianScore + (1 - this.alpha) * this.currentSmoothedScore;
    }

    // Clamp score between 0.0 and 1.0
    return Math.max(0.0, Math.min(1.0, this.currentSmoothedScore));
  }

  public reset(): void {
    this.scoreBuffer = [];
    this.currentSmoothedScore = 0.0;
  }
}
