import { useState, useEffect, useRef, useCallback } from 'react';
import type Webcam from 'react-webcam';
import { PoseKeypoint } from '@/context/GlobalContext';

// Dynamic imports to avoid build-time resolution issues
let tf: typeof import('@tensorflow/tfjs') | null = null;
let poseDetection: typeof import('@tensorflow-models/pose-detection') | null = null;

interface UsePoseDetectionProps {
  webcamRef: React.RefObject<Webcam | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  enabled: boolean;
}

interface UsePoseDetectionReturn {
  isLoading: boolean;
  isDetecting: boolean;
  keypoints: PoseKeypoint[] | null;
  error: string | null;
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
}: UsePoseDetectionProps): UsePoseDetectionReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [keypoints, setKeypoints] = useState<PoseKeypoint[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const detectorRef = useRef<any>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Initialize TensorFlow and detector
  const initializeDetector = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Dynamic import to avoid build-time issues
      if (!tf) {
        tf = await import('@tensorflow/tfjs');
      }
      if (!poseDetection) {
        poseDetection = await import('@tensorflow-models/pose-detection');
      }

      // Initialize TensorFlow.js
      await tf.ready();
      
      // Use WebGL backend for better performance
      await tf.setBackend('webgl');

      // Create MoveNet detector (Lightning is faster, Thunder is more accurate)
      const detector = await poseDetection.createDetector(
        poseDetection.SupportedModels.MoveNet,
        {
          modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
          enableSmoothing: true,
        }
      );

      detectorRef.current = detector;
      setIsLoading(false);
    } catch (err) {
      console.error('Failed to initialize pose detector:', err);
      setError('Failed to initialize AI model. Please refresh and try again.');
      setIsLoading(false);
    }
  }, []);

  // Draw skeleton on canvas
  const drawSkeleton = useCallback(
    (poses: any[], ctx: CanvasRenderingContext2D) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const pose of poses) {
        const kpts = pose.keypoints;

        // Create a map for easy lookup
        const keypointMap: Record<string, { x: number; y: number; score?: number; name?: string }> = {};
        kpts.forEach((kp: { x: number; y: number; score?: number; name?: string }) => {
          if (kp.name) {
            keypointMap[kp.name] = kp;
          }
        });

        // Draw skeleton lines
        ctx.strokeStyle = 'hsl(211, 100%, 50%)';
        ctx.lineWidth = 3;

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
        for (const kp of kpts) {
          if ((kp.score || 0) > 0.3) {
            ctx.fillStyle = 'hsl(120, 55%, 67%)';
            ctx.beginPath();
            ctx.arc(kp.x, kp.y, 5, 0, 2 * Math.PI);
            ctx.fill();
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

        // Draw skeleton
        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext('2d');
          if (ctx) {
            drawSkeleton(poses, ctx);
          }
        }
      } else {
        setIsDetecting(false);
        setKeypoints(null);
      }
    } catch (err) {
      console.error('Pose detection error:', err);
    }

    animationFrameRef.current = requestAnimationFrame(detectPose);
  }, [enabled, webcamRef, canvasRef, drawSkeleton]);

  // Start/stop detection based on enabled state
  useEffect(() => {
    if (enabled) {
      if (!detectorRef.current) {
        initializeDetector().then(() => {
          detectPose();
        });
      } else {
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
      }
    };
  }, []);

  return {
    isLoading,
    isDetecting,
    keypoints,
    error,
  };
}
