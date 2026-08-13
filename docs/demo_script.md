# 3-Minute Hackathon Demo Script — FakeShield

## Demo Overview
* **Goal**: Demonstrate real-time deepfake detection on live webcam feeds, simulated deepfake attacks, and live video call tab sharing.
* **Duration**: 3 Minutes (180 Seconds)
* **Presenter**: Lead Engineer / Presenter

---

## Step-by-Step Timestamp Breakdown

### 0:00 – 0:30 | The Threat & Problem Statement
* **Visual**: Presenter on camera / Landing Page screen.
* **Script**:  
  > "Deepfakes are no longer limited to pre-recorded offline videos. Attackers can now manipulate facial features in real time during live video calls to commit financial fraud, bypass KYC checks, or impersonate corporate executives. Existing detectors are slow, heavy, and require uploading private video to cloud servers. Today we present **FakeShield** — a real-time, privacy-first deepfake detection system that runs 100% client-side inside your browser."

### 0:30 – 1:15 | Demo 1: Clean Live Webcam Feed
* **Visual**: Click **Start Live Camera** on FakeShield Landing Page. Show Live Detection Center.
* **Script**:  
  > "First, let me start my live webcam stream. FakeShield uses MediaPipe BlazeFace WASM to track my face at over 30 FPS. In real time, an optimized 286 KB MesoInception-4 ONNX neural network analyzes facial texture and blending boundary artifacts on every frame.  
  > Notice the overlay: My stream is classified as **LOW RISK** with **98% Authenticity**. Our measured pipeline runs at **28.4 FPS** with just **31 milliseconds** of latency on a standard CPU — completely locally, with zero video leaving my device."

### 1:15 – 2:00 | Demo 2: Deepfake Attack Simulation & Alerting
* **Visual**: Switch Source dropdown to **Demo Test Stream** and click **Deepfake Attack**.
* **Script**:  
  > "Now let's simulate a live deepfake face-swap attack. The moment spatial boundary anomalies and synthetic noise artifacts enter the stream, our temporal filter smooths predictions across a 10-frame buffer.  
  > Watch the risk engine transition to **HIGH RISK**. The bounding box turns red, manipulation probability jumps to **89%**, and FakeShield's Web Audio synthesizer triggers an immediate audible cybersecurity alert warning the user of potential impersonation!"

### 2:00 – 2:35 | Demo 3: Video Call Tab Sharing Mode
* **Visual**: Click **Video Call Protection** and launch tab sharing for a Google Meet / Zoom window.
* **Script**:  
  > "Browsers legitimately restrict arbitrary web apps from silently spying on other tabs. FakeShield implements a clean, user-consented workflow using standard screen sharing. Users simply click 'Analyze Video Call', select their active Google Meet or Zoom tab, and FakeShield overlays real-time threat auditing directly onto the meeting feed."

### 2:35 – 3:00 | Demo 4: Benchmarks & Closing Impact
* **Visual**: Open **Benchmarks** Page showing FPR 2.94% badge and confusion matrix.
* **Script**:  
  > "Finally, on our Reproducible Benchmark Suite, FakeShield achieves a measured **False Positive Rate of 2.94%**, well within the hackathon's 10% requirement. In summary: Real-Time, WASM Client-Side Privacy, 28+ FPS, and Video Call Ready. Thank you!"
