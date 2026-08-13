/**
 * TestStreamGenerator creates dynamic synthetic video streams for demonstration.
 * Produces clean video frames or manipulated deepfake video frames with spatial artifacts.
 */
export class TestStreamGenerator {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private animId: number | null = null;
  private isDeepfake: boolean = false;
  private phase: number = 0;

  constructor(width: number = 640, height: number = 480) {
    this.canvas = document.createElement('canvas');
    this.canvas.width = width;
    this.canvas.height = height;
    const context = this.canvas.getContext('2d');
    if (!context) throw new Error('Canvas context failed');
    this.ctx = context;
  }

  public setMode(isDeepfake: boolean): void {
    this.isDeepfake = isDeepfake;
  }

  public start(): MediaStream {
    this.stop();
    const render = () => {
      this.phase += 0.05;
      const w = this.canvas.width;
      const h = this.canvas.height;

      // 1. Render background room/office
      this.ctx.fillStyle = '#0f172a';
      this.ctx.fillRect(0, 0, w, h);

      // Office desk light gradient
      const grad = this.ctx.createRadialGradient(w / 2, h / 2, 50, w / 2, h / 2, w / 1.2);
      grad.addColorStop(0, '#1e293b');
      grad.addColorStop(1, '#090d16');
      this.ctx.fillStyle = grad;
      this.ctx.fillRect(0, 0, w, h);

      // 2. Render Animated Face
      const centerX = w / 2 + Math.sin(this.phase * 0.5) * 12;
      const centerY = h / 2 + Math.cos(this.phase * 0.7) * 8;
      const headR = 110;

      // Neck
      this.ctx.fillStyle = '#d19a66';
      this.ctx.fillRect(centerX - 30, centerY + headR - 20, 60, 90);

      // Head Base
      this.ctx.beginPath();
      this.ctx.ellipse(centerX, centerY, headR * 0.85, headR, 0, 0, Math.PI * 2);
      this.ctx.fillStyle = '#e0a96d';
      this.ctx.fill();

      // Hair
      this.ctx.beginPath();
      this.ctx.arc(centerX, centerY - 20, headR * 0.88, Math.PI, Math.PI * 2);
      this.ctx.fillStyle = '#2d1b0e';
      this.ctx.fill();

      // Eyes
      const blink = Math.sin(this.phase * 2) > 0.96 ? 2 : 12;
      this.ctx.fillStyle = '#ffffff';
      this.ctx.beginPath();
      this.ctx.ellipse(centerX - 35, centerY - 20, 16, blink, 0, 0, Math.PI * 2);
      this.ctx.ellipse(centerX + 35, centerY - 20, 16, blink, 0, 0, Math.PI * 2);
      this.ctx.fill();

      // Pupils
      this.ctx.fillStyle = '#1e293b';
      this.ctx.beginPath();
      this.ctx.arc(centerX - 35 + Math.sin(this.phase) * 3, centerY - 20, 6, 0, Math.PI * 2);
      this.ctx.arc(centerX + 35 + Math.sin(this.phase) * 3, centerY - 20, 6, 0, Math.PI * 2);
      this.ctx.fill();

      // Nose
      this.ctx.strokeStyle = '#c48b55';
      this.ctx.lineWidth = 3;
      this.ctx.beginPath();
      this.ctx.moveTo(centerX, centerY - 10);
      this.ctx.lineTo(centerX - 6, centerY + 15);
      this.ctx.lineTo(centerX + 6, centerY + 15);
      this.ctx.stroke();

      // Mouth
      const mouthOpen = Math.sin(this.phase * 3) * 6 + 6;
      this.ctx.fillStyle = '#991b1b';
      this.ctx.beginPath();
      this.ctx.ellipse(centerX, centerY + 45, 22, mouthOpen, 0, 0, Math.PI * 2);
      this.ctx.fill();

      // 3. IF DEEPFAKE MODE: Inject Facial Blending Boundary & High-Frequency Noise Artifacts
      if (this.isDeepfake) {
        // Face Mask Boundary Discontinuity Circle
        this.ctx.strokeStyle = 'rgba(239, 68, 68, 0.45)';
        this.ctx.lineWidth = 4;
        this.ctx.beginPath();
        this.ctx.ellipse(centerX, centerY + 5, headR * 0.76, headR * 0.88, 0, 0, Math.PI * 2);
        this.ctx.stroke();

        // High-Frequency Pixel Artifact Noise inside the face region
        const faceData = this.ctx.getImageData(centerX - headR, centerY - headR, headR * 2, headR * 2);
        const d = faceData.data;
        for (let i = 0; i < d.length; i += 16) {
          if (Math.random() < 0.35) {
            d[i] = Math.min(255, d[i] + 75);     // Red artifact boost
            d[i + 1] = Math.max(0, d[i + 1] - 40);
            d[i + 2] = Math.max(0, d[i + 2] - 40);
          }
        }
        this.ctx.putImageData(faceData, centerX - headR, centerY - headR);
      }

      this.animId = requestAnimationFrame(render);
    };

    render();
    return this.canvas.captureStream(30);
  }

  public stop(): void {
    if (this.animId !== null) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
  }

  public getCanvas(): HTMLCanvasElement {
    return this.canvas;
  }
}
