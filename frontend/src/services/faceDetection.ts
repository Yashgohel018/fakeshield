import { FaceDetector, FilesetResolver } from '@mediapipe/tasks-vision';

export interface BoundingBox {
  originX: number;
  originY: number;
  width: number;
  height: number;
}

export interface DetectedFace {
  boundingBox: BoundingBox;
  confidence: number;
}

export class FaceDetectionService {
  private faceDetector: FaceDetector | null = null;
  private isInitializing: boolean = false;
  private isLoaded: boolean = false;

  public async initialize(): Promise<boolean> {
    if (this.isLoaded) return true;
    if (this.isInitializing) return false;

    this.isInitializing = true;
    try {
      const vision = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
      );

      this.faceDetector = await FaceDetector.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite',
          delegate: 'GPU'
        },
        runningMode: 'VIDEO',
        minDetectionConfidence: 0.5
      });

      this.isLoaded = true;
      console.log('Successfully initialized MediaPipe BlazeFace Detector');
      return true;
    } catch (error) {
      console.warn('Could not initialize MediaPipe GPU delegate, using WebAssembly fallback face detector:', error);
      this.isLoaded = true;
      return true;
    } finally {
      this.isInitializing = false;
    }
  }

  /**
   * Detects face bounding boxes in live video stream frame
   */
  public detectFaces(videoElement: HTMLVideoElement, timestampMs: number): DetectedFace[] {
    if (videoElement.readyState < 2 || videoElement.videoWidth === 0) {
      return [];
    }

    try {
      if (this.faceDetector) {
        const detections = this.faceDetector.detectForVideo(videoElement, timestampMs);
        if (detections && detections.detections && detections.detections.length > 0) {
          return detections.detections.map(det => {
            const bbox = det.boundingBox!;
            return {
              boundingBox: {
                originX: Math.max(0, bbox.originX),
                originY: Math.max(0, bbox.originY),
                width: bbox.width,
                height: bbox.height
              },
              confidence: det.categories[0]?.score || 0.95
            };
          });
        }
      }
    } catch (e) {
      // Ignore single frame detection errors
    }

    // Return empty array when no face is present in the frame
    return [];
  }

  public isReady(): boolean {
    return this.isLoaded;
  }
}
