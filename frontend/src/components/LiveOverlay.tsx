import React, { useEffect, useRef } from 'react';
import type { DetectionResult, PerformanceMode } from '../types/fakeshield';

interface LiveOverlayProps {
  detection: DetectionResult | null;
  videoWidth: number;
  videoHeight: number;
  fps: number;
  performanceMode: PerformanceMode;
  videoRef: React.RefObject<HTMLVideoElement | null>;
}

export const LiveOverlay: React.FC<LiveOverlayProps> = ({
  detection,
  videoWidth,
  videoHeight,
  fps,
  performanceMode,
  videoRef
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video || videoWidth === 0 || videoHeight === 0) return;

    // Get exact rendered container pixel dimensions to prevent canvas distortion
    const containerWidth = video.clientWidth || 640;
    const containerHeight = video.clientHeight || 360;

    // Set 1:1 screen pixel canvas resolution
    canvas.width = containerWidth;
    canvas.height = containerHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear previous frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate actual video aspect ratio letterboxing/pillarboxing rect inside container
    const videoAspect = videoWidth / videoHeight;
    const containerAspect = containerWidth / containerHeight;

    let displayW = containerWidth;
    let displayH = containerHeight;
    let offsetX = 0;
    let offsetY = 0;

    if (videoAspect > containerAspect) {
      // Video is wider than container -> letterbox top/bottom
      displayW = containerWidth;
      displayH = containerWidth / videoAspect;
      offsetY = (containerHeight - displayH) / 2;
    } else {
      // Video is taller/narrower than container -> pillarbox left/right
      displayH = containerHeight;
      displayW = containerHeight * videoAspect;
      offsetX = (containerWidth - displayW) / 2;
    }

    const scaleX = displayW / videoWidth;
    const scaleY = displayH / videoHeight;

    // Render HUD Telemetry overlay anchored to top-right of active video region
    const hudW = 174;
    const hudH = 76;
    const hudX = Math.max(offsetX + 12, offsetX + displayW - hudW - 16);
    const hudY = offsetY + 16;

    ctx.save();
    ctx.font = '600 12px Inter, sans-serif';
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.beginPath();
    ctx.roundRect(hudX, hudY, hudW, hudH, 8);
    ctx.fill();
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = '#94a3b8';
    ctx.fillText(`FPS: `, hudX + 12, hudY + 22);
    ctx.fillStyle = fps >= 15 ? '#34d399' : '#fbbf24';
    ctx.fillText(`${fps.toFixed(1)} FPS`, hudX + 62, hudY + 22);

    ctx.fillStyle = '#94a3b8';
    ctx.fillText(`LATENCY: `, hudX + 12, hudY + 42);
    ctx.fillStyle = '#38bdf8';
    ctx.fillText(`${detection ? detection.inferenceTimeMs : 0} ms`, hudX + 82, hudY + 42);

    ctx.fillStyle = '#94a3b8';
    ctx.fillText(`MODE: `, hudX + 12, hudY + 62);
    ctx.fillStyle = '#a78bfa';
    ctx.fillText(`${performanceMode.toUpperCase()}`, hudX + 62, hudY + 62);
    ctx.restore();

    // If no face locked, draw scanning reticle aligned to video region
    if (!detection || !detection.faceBox) {
      ctx.save();
      const reticleX = offsetX + displayW * 0.2;
      const reticleY = offsetY + displayH * 0.15;
      const reticleW = displayW * 0.6;
      const reticleH = displayH * 0.7;

      ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 6]);
      ctx.strokeRect(reticleX, reticleY, reticleW, reticleH);
      ctx.setLineDash([]);

      ctx.fillStyle = 'rgba(56, 189, 248, 0.85)';
      ctx.font = '600 12px Inter, monospace';
      ctx.fillText('SCANNING FOR FACIAL TARGETS...', reticleX + 14, reticleY + 26);
      ctx.restore();
      return;
    }

    const { x, y, width, height } = detection.faceBox;
    const { riskLevel, authenticityScore, manipulationScore } = detection;

    // Transform video pixel coordinates to screen display coordinates
    const drawX = offsetX + x * scaleX;
    const drawY = offsetY + y * scaleY;
    const drawW = width * scaleX;
    const drawH = height * scaleY;

    // Pick dynamic colors based on risk
    let mainColor = '#10B981'; // Low - Emerald Green
    let badgeText = 'LOW RISK';

    if (riskLevel === 'HIGH') {
      mainColor = '#EF4444'; // High - Red
      badgeText = 'HIGH RISK — POTENTIAL DEEPFAKE';
    } else if (riskLevel === 'MEDIUM') {
      mainColor = '#F59E0B'; // Medium - Orange
      badgeText = 'MEDIUM RISK — SUSPICIOUS';
    }

    // 1. Draw Bounding Box with Corner Accents
    ctx.save();
    ctx.shadowColor = mainColor;
    ctx.shadowBlur = 10;
    ctx.strokeStyle = mainColor;
    ctx.lineWidth = 2.5;
    ctx.strokeRect(drawX, drawY, drawW, drawH);

    // Corner bracket accents
    const cornerLen = Math.min(drawW, drawH) * 0.2;
    ctx.lineWidth = 3.5;

    // Top-Left
    ctx.beginPath();
    ctx.moveTo(drawX, drawY + cornerLen);
    ctx.lineTo(drawX, drawY);
    ctx.lineTo(drawX + cornerLen, drawY);
    ctx.stroke();

    // Top-Right
    ctx.beginPath();
    ctx.moveTo(drawX + drawW - cornerLen, drawY);
    ctx.lineTo(drawX + drawW, drawY);
    ctx.lineTo(drawX + drawW, drawY + cornerLen);
    ctx.stroke();

    // Bottom-Left
    ctx.beginPath();
    ctx.moveTo(drawX, drawY + drawH - cornerLen);
    ctx.lineTo(drawX, drawY + drawH);
    ctx.lineTo(drawX + cornerLen, drawY + drawH);
    ctx.stroke();

    // Bottom-Right
    ctx.beginPath();
    ctx.moveTo(drawX + drawW - cornerLen, drawY + drawH);
    ctx.lineTo(drawX + drawW, drawY + drawH);
    ctx.lineTo(drawX + drawW, drawY + drawH - cornerLen);
    ctx.stroke();
    ctx.restore();

    // 2. Draw Target Reticle Center Dot
    ctx.save();
    ctx.fillStyle = mainColor;
    ctx.beginPath();
    ctx.arc(drawX + drawW / 2, drawY + drawH / 2, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 3. Floating Overlay Badge above face box
    ctx.save();
    const badgeHeight = 32;
    const badgeWidth = Math.max(190, drawW);
    const badgeY = Math.max(offsetY + 4, drawY - badgeHeight - 8);

    ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
    ctx.beginPath();
    ctx.roundRect(drawX, badgeY, badgeWidth, badgeHeight, 6);
    ctx.fill();
    ctx.strokeStyle = mainColor;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Status Indicator Light
    ctx.fillStyle = mainColor;
    ctx.beginPath();
    ctx.arc(drawX + 12, badgeY + 16, 4.5, 0, Math.PI * 2);
    ctx.fill();

    // Badge Title & Score Text
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 11px Inter, sans-serif';
    ctx.fillText(badgeText, drawX + 22, badgeY + 14);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 10px Inter, monospace';
    ctx.fillText(
      `AUTH: ${authenticityScore.toFixed(1)}% | MANIP: ${manipulationScore.toFixed(1)}%`,
      drawX + 22,
      badgeY + 26
    );
    ctx.restore();

  }, [detection, videoWidth, videoHeight, fps, performanceMode, videoRef]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full pointer-events-none z-20"
    />
  );
};
