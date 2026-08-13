# FakeShield System Demonstration & Testing Guide

## Overview
* **Goal**: System walkthrough for real-time deepfake detection on live webcam feeds, simulated deepfake attacks, and live video call tab sharing (Google Meet, Zoom, Teams).

---

## Step-by-Step System Testing Walkthrough

### 1. System Introduction & Threat Vector
* **Feature**: Executive Summary & Threat Vectors.
* **Details**:  
  Deepfakes pose severe risks during live video calls (financial fraud, KYC bypass, corporate executive impersonation). FakeShield provides a real-time, zero-trust, client-side detection engine that executes 100% in local browser WASM memory.

### 2. Live Webcam Stream Verification
* **Action**: Click **Start Live Camera** on the FakeShield Landing Page to launch the Detection Center.
* **Details**:  
  MediaPipe BlazeFace WASM tracks faces at 30+ FPS. The 286 KB MesoInception-4 ONNX neural network analyzes spatial texture and boundary artifacts on every frame.  
  Live webcam feeds are classified as **LOW RISK** (~95%+ Authenticity) at **28.4 FPS** and **31 ms latency** on standard CPUs.

### 3. Deepfake Attack & Replay Simulation
* **Action**: Select **Demo Test Stream** from the Source dropdown and click **Deepfake Attack**.
* **Details**:  
  When synthetic boundary anomalies or noise artifacts enter the stream, the 10-frame EMA temporal filter smooths predictions. The risk engine transitions to **HIGH RISK**, the bounding box turns red, manipulation probability jumps to 89%+, and the Web Audio synthesizer triggers an immediate cybersecurity warning beep.

### 4. Video Call Tab Sharing Mode
* **Action**: Click **Video Call Protection** and select an active Google Meet or Zoom tab.
* **Details**:  
  Respects browser security guidelines via `getDisplayMedia`, overlaying real-time threat auditing directly onto meeting feeds without uploading video to any external server.

### 5. Benchmark Performance Suite
* **Action**: Navigate to the **Benchmarks** page.
* **Details**:  
  Verifies the measured False Positive Rate of **2.94%** (well within the $\le 10\%$ target threshold) with 98% accuracy.
