import { useState, useEffect, useRef, useCallback } from 'react';
import type Webcam from 'react-webcam';
import { PoseKeypoint } from '@/context/GlobalContext';
import { repCounter, RepCounterState } from '@/lib/repCounter';
import type { ExerciseType } from '@/lib/exerciseRules';
// Dynamic imports to avoid build-time resolution issues
let tf: typeof import('@tensorflow/tfjs') | null = null;
let poseDetection: typeof import('@tensorflow-models/pose-detection') | null = null;

interface UsePoseDetectionProps {
  webcamRef: React.RefObject<Webcam | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  enabled: boolean;
  exerciseType?: ExerciseType;
  onRepComplete?: () => void;
}

interface UsePoseDetectionReturn {
  isLoading: boolean;
  isDetecting: boolean;
  keypoints: PoseKeypoint[] | null;
  error: string | null;
  repState: RepCounterState;
  resetReps: () => void;
}

// Skeleton connections for drawing
const SKELETON_CONNECTIONS: [string, string][] = [
  ['nose', 'left_eye'],
  ['nose', 'right_eye'],
  ['left_eye', 'left_ear'],
  ['right_eye', 'right_ear'],
  ['left_shoulder', 'right_shoulder'],
  ['left_shoulder', 'left_elbow'],
  ['right_shoulder', 'right_elbow'],
  ['left_elbow', 'left_wrist'],
  ['right_elbow', 'right_wrist'],
  ['left_shoulder', 'left_hip'],
  ['right_shoulder', 'right_hip'],
  ['left_hip', 'right_hip'],
  ['left_hip', 'left_knee'],
  ['right_hip', 'right_knee'],
  ['left_knee', 'left_ankle'],
  ['right_knee', 'right_ankle'],
];

export function usePoseDetection({
  webcamRef,
  canvasRef,
  enabled,
  exerciseType = 'squat',
  onRepComplete,
}: UsePoseDetectionProps): UsePoseDetectionReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [keypoints, setKeypoints] = useState<PoseKeypoint[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [repState, setRepState] = useState<RepCounterState>(repCounter.getState());

  const detectorRef = useRef<any>(null);
  const animationFrameRef = useRef<number | null>(null);
  const initializingRef = useRef(false);

  // Reset reps function
  const resetReps = useCallback(() => {
    repCounter.reset();
    setRepState(repCounter.getState());
  }, []);

  // Update exercise type in rep counter
  useEffect(() => {
    repCounter.setExercise(exerciseType);
    setRepState(repCounter.getState());
  }, [exerciseType]);

  // Initialize TensorFlow and detector with robust error handling
  const initializeDetector = useCallback(async () => {
    if (initializingRef.current || detectorRef.current) {
      return;
    }

    initializingRef.current = true;

    try {
      setIsLoading(true);
      setError(null);

      console.log('[PoseDetection] Starting initialization...');

      // Dynamic import to avoid build-time issues
      if (!tf) {
        console.log('[PoseDetection] Loading TensorFlow.js...');
        tf = await import('@tensorflow/tfjs');
      }

      // Initialize TensorFlow.js
      await tf.ready();
      console.log('[PoseDetection] TensorFlow.js ready');

      // Try backends in order of preference
      const backends = ['webgl', 'cpu'];
      let backendInitialized = false;

      for (const backend of backends) {
        try {
          console.log(`[PoseDetection] Trying ${backend} backend...`);
          await tf.setBackend(backend);
          await tf.ready();
          console.log(`[PoseDetection] Using ${backend} backend`);
          backendInitialized = true;
          break;
        } catch (backendError) {
          console.warn(`[PoseDetection] ${backend} backend failed:`, backendError);
        }
      }

      if (!backendInitialized) {
        throw new Error('No compatible TensorFlow backend found');
      }

      // Load pose detection model
      if (!poseDetection) {
        console.log('[PoseDetection] Loading pose detection model...');
        poseDetection = await import('@tensorflow-models/pose-detection');
      }

      // Create MoveNet detector (Lightning is faster)
      console.log('[PoseDetection] Creating MoveNet detector...');
      const detector = await poseDetection.createDetector(
        poseDetection.SupportedModels.MoveNet,
        {
          modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
          enableSmoothing: true,
        }
      );

      detectorRef.current = detector;
      console.log('[PoseDetection] Detector initialized successfully');
      setIsLoading(false);
    } catch (err) {
      console.error('[PoseDetection] Initialization failed:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(`Failed to initialize AI model: ${errorMessage}. Please refresh and try again.`);
      setIsLoading(false);
    } finally {
      initializingRef.current = false;
    }
  }, []);

  // Draw skeleton on canvas with proper scaling
  const drawSkeleton = useCallback(
    (poses: any[], ctx: CanvasRenderingContext2D, videoWidth: number, videoHeight: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      // Scale factors for mapping pose coords to canvas
      const scaleX = canvas.width / videoWidth;
      const scaleY = canvas.height / videoHeight;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const pose of poses) {
        const kpts = pose.keypoints;

        // Create a map for easy lookup
        const keypointMap: Record<string, { x: number; y: number; score?: number; name?: string }> = {};
        kpts.forEach((kp: { x: number; y: number; score?: number; name?: string }) => {
          if (kp.name) {
            keypointMap[kp.name] = {
              ...kp,
              // Mirror and scale the coordinates
              x: canvas.width - (kp.x * scaleX),
              y: kp.y * scaleY,
            };
          }
        });

        // Draw skeleton lines
        ctx.strokeStyle = 'hsl(211, 100%, 50%)';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';

        for (const [start, end] of SKELETON_CONNECTIONS) {
          const startKp = keypointMap[start];
          const endKp = keypointMap[end];

          if (startKp && endKp && (startKp.score || 0) > 0.3 && (endKp.score || 0) > 0.3) {
            ctx.beginPath();
            ctx.moveTo(startKp.x, startKp.y);
            ctx.lineTo(endKp.x, endKp.y);
            ctx.stroke();
          }
        }

        // Draw keypoints
        for (const name in keypointMap) {
          const kp = keypointMap[name];
          if ((kp.score || 0) > 0.3) {
            ctx.fillStyle = 'hsl(120, 55%, 67%)';
            ctx.beginPath();
            ctx.arc(kp.x, kp.y, 6, 0, 2 * Math.PI);
            ctx.fill();

            // Add white border
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 2;
            ctx.stroke();
          }
        }
      }
    },
    [canvasRef]
  );

  // Detection loop
  const detectPose = useCallback(async () => {
    if (!enabled || !detectorRef.current || !webcamRef.current) {
      return;
    }

    const video = webcamRef.current.video;
    if (!video || video.readyState !== 4) {
      animationFrameRef.current = requestAnimationFrame(detectPose);
      return;
    }

    try {
      const poses = await detectorRef.current.estimatePoses(video);

      if (poses.length > 0) {
        setIsDetecting(true);

        // Convert to our keypoint format
        const convertedKeypoints: PoseKeypoint[] = poses[0].keypoints.map((kp: { x: number; y: number; score?: number; name?: string }) => ({
          x: kp.x,
          y: kp.y,
          score: kp.score || 0,
          name: kp.name || '',
        }));

        setKeypoints(convertedKeypoints);

        // Update rep counter and check for new rep
        const previousRepCount = repState.repCount;
        const newRepState = repCounter.update(convertedKeypoints);
        setRepState(newRepState);

        // Trigger callback if rep was completed
        if (newRepState.repCount > previousRepCount && onRepComplete) {
          onRepComplete();
        }

        // Draw skeleton
        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext('2d');
          if (ctx) {
            drawSkeleton(poses, ctx, video.videoWidth, video.videoHeight);
          }
        }
      } else {
        setIsDetecting(false);
        setKeypoints(null);
      }
    } catch (err) {
      console.error('[PoseDetection] Detection error:', err);
    }

    animationFrameRef.current = requestAnimationFrame(detectPose);
  }, [enabled, webcamRef, canvasRef, drawSkeleton]);

  // Start/stop detection based on enabled state
  useEffect(() => {
    if (enabled) {
      if (!detectorRef.current && !initializingRef.current) {
        initializeDetector().then(() => {
          if (detectorRef.current) {
            detectPose();
          }
        });
      } else if (detectorRef.current) {
        detectPose();
      }
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      setIsDetecting(false);
      setKeypoints(null);

      // Clear canvas
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      }
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [enabled, initializeDetector, detectPose, canvasRef]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (detectorRef.current) {
        detectorRef.current.dispose();
        detectorRef.current = null;
      }
    };
  }, []);

  return {
    isLoading,
    isDetecting,
    keypoints,
    error,
    repState,
    resetReps,
  };
}
