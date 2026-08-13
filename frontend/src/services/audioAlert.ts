/**
 * AudioAlert Synthesizer using Web Audio API.
 * Triggers audio warnings when deepfake risk crosses into HIGH state.
 */
export class AudioAlert {
  private audioCtx: AudioContext | null = null;
  private isEnabled: boolean = true;
  private lastAlertTime: number = 0;
  private cooldownMs: number = 5000; // 5 seconds cooldown

  constructor(cooldownMs: number = 5000) {
    this.cooldownMs = cooldownMs;
  }

  public setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }

  public triggerHighRiskWarning(): void {
    if (!this.isEnabled) return;
    
    const now = Date.now();
    if (now - this.lastAlertTime < this.cooldownMs) {
      return; // Cooldown active
    }
    this.lastAlertTime = now;

    try {
      if (!this.audioCtx) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        this.audioCtx = new AudioContextClass();
      }

      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      // Create dual-tone cybersecurity warning beep
      const osc1 = this.audioCtx.createOscillator();
      const osc2 = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc1.type = 'sawtooth';
      osc2.type = 'square';

      osc1.frequency.setValueAtTime(880, this.audioCtx.currentTime); // A5 note
      osc1.frequency.exponentialRampToValueAtTime(440, this.audioCtx.currentTime + 0.3); // Drop frequency

      osc2.frequency.setValueAtTime(987.77, this.audioCtx.currentTime); // B5 note
      osc2.frequency.exponentialRampToValueAtTime(493.88, this.audioCtx.currentTime + 0.3);

      gain.gain.setValueAtTime(0.3, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.35);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc1.start(this.audioCtx.currentTime);
      osc2.start(this.audioCtx.currentTime);
      
      osc1.stop(this.audioCtx.currentTime + 0.35);
      osc2.stop(this.audioCtx.currentTime + 0.35);
    } catch (e) {
      console.warn('Audio alert playback error:', e);
    }
  }
}
