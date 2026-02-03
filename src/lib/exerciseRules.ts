import { PoseKeypoint, AnalysisFeedback } from '@/context/GlobalContext';

export type ExerciseType = 
  | 'squat'
  | 'lunge'
  | 'box-jump'
  | 'russian-twist'
  | 'calf-raise'
  | 'a-skip'
  | 'b-skip'
  | 'sprint-start'
  | 'running';

// Partial feedback without id/timestamp (added by the context)
type PartialFeedback = Omit<AnalysisFeedback, 'id' | 'timestamp'>;

interface AnalysisRule {
  name: string;
  check: (keypoints: PoseKeypoint[]) => PartialFeedback | null;
}

// Helper functions
function getKeypoint(keypoints: PoseKeypoint[], name: string): PoseKeypoint | undefined {
  return keypoints.find(kp => kp.name === name);
}

function calculateAngle(p1: PoseKeypoint, p2: PoseKeypoint, p3: PoseKeypoint): number {
  const rad = Math.atan2(p3.y - p2.y, p3.x - p2.x) - Math.atan2(p1.y - p2.y, p1.x - p2.x);
  let deg = Math.abs(rad * 180 / Math.PI);
  if (deg > 180) deg = 360 - deg;
  return deg;
}

function isConfident(keypoint: PoseKeypoint | undefined, threshold = 0.3): boolean {
  return keypoint !== undefined && keypoint.score >= threshold;
}

// Exercise-specific rules
const squatRules: AnalysisRule[] = [
  {
    name: 'knee-alignment',
    check: (keypoints): PartialFeedback | null => {
      const leftKnee = getKeypoint(keypoints, 'left_knee');
      const leftAnkle = getKeypoint(keypoints, 'left_ankle');
      const leftHip = getKeypoint(keypoints, 'left_hip');

      if (!isConfident(leftKnee) || !isConfident(leftAnkle) || !isConfident(leftHip)) return null;

      const kneeAngle = calculateAngle(leftHip!, leftKnee!, leftAnkle!);
      
      if (kneeAngle < 70) {
        return {
          message: "You're going too deep - stop when thighs are parallel to ground",
          severity: 'warning',
          bodyPart: 'knees',
        };
      }
      
      if (kneeAngle > 140) {
        return {
          message: "Lower your hips more - aim for thighs parallel to ground",
          severity: 'info',
          bodyPart: 'hips',
        };
      }

      return null;
    }
  },
  {
    name: 'back-straight',
    check: (keypoints): PartialFeedback | null => {
      const leftShoulder = getKeypoint(keypoints, 'left_shoulder');
      const leftHip = getKeypoint(keypoints, 'left_hip');

      if (!isConfident(leftShoulder) || !isConfident(leftHip)) return null;

      // Check if shoulders are too far forward relative to hips
      const forwardLean = leftShoulder!.x - leftHip!.x;
      
      if (Math.abs(forwardLean) > 100) {
        return {
          message: "Keep your chest up and back straight",
          severity: 'warning',
          bodyPart: 'back',
        };
      }

      return null;
    }
  },
];

const lungeRules: AnalysisRule[] = [
  {
    name: 'front-knee-angle',
    check: (keypoints): PartialFeedback | null => {
      const leftKnee = getKeypoint(keypoints, 'left_knee');
      const leftAnkle = getKeypoint(keypoints, 'left_ankle');
      const leftHip = getKeypoint(keypoints, 'left_hip');

      if (!isConfident(leftKnee) || !isConfident(leftAnkle) || !isConfident(leftHip)) return null;

      const kneeAngle = calculateAngle(leftHip!, leftKnee!, leftAnkle!);

      if (kneeAngle < 80) {
        return {
          message: "Don't let your knee go past your toes - step further forward",
          severity: 'error',
          bodyPart: 'knee',
        };
      }

      return null;
    }
  },
  {
    name: 'torso-upright',
    check: (keypoints): PartialFeedback | null => {
      const nose = getKeypoint(keypoints, 'nose');
      const leftHip = getKeypoint(keypoints, 'left_hip');

      if (!isConfident(nose) || !isConfident(leftHip)) return null;

      const tilt = Math.abs(nose!.x - leftHip!.x);

      if (tilt > 80) {
        return {
          message: "Keep your torso upright - don't lean forward",
          severity: 'warning',
          bodyPart: 'torso',
        };
      }

      return null;
    }
  },
];

const boxJumpRules: AnalysisRule[] = [
  {
    name: 'soft-landing',
    check: (keypoints): PartialFeedback | null => {
      const leftKnee = getKeypoint(keypoints, 'left_knee');
      const leftAnkle = getKeypoint(keypoints, 'left_ankle');
      const leftHip = getKeypoint(keypoints, 'left_hip');

      if (!isConfident(leftKnee) || !isConfident(leftAnkle) || !isConfident(leftHip)) return null;

      const kneeAngle = calculateAngle(leftHip!, leftKnee!, leftAnkle!);

      // During landing, knees should be bent
      if (kneeAngle > 160) {
        return {
          message: "Soft landing! Bend your knees more when you land",
          severity: 'warning',
          bodyPart: 'knees',
        };
      }

      return null;
    }
  },
];

const skipRules: AnalysisRule[] = [
  {
    name: 'knee-drive',
    check: (keypoints): PartialFeedback | null => {
      const leftKnee = getKeypoint(keypoints, 'left_knee');
      const leftHip = getKeypoint(keypoints, 'left_hip');

      if (!isConfident(leftKnee) || !isConfident(leftHip)) return null;

      // Check knee height relative to hip
      const kneeDrive = leftHip!.y - leftKnee!.y;

      if (kneeDrive < 30) {
        return {
          message: "Drive your knee higher - aim for hip height",
          severity: 'info',
          bodyPart: 'knee',
        };
      }

      return null;
    }
  },
  {
    name: 'arm-swing',
    check: (keypoints): PartialFeedback | null => {
      const leftWrist = getKeypoint(keypoints, 'left_wrist');
      const rightWrist = getKeypoint(keypoints, 'right_wrist');
      const leftHip = getKeypoint(keypoints, 'left_hip');

      if (!isConfident(leftWrist) || !isConfident(rightWrist) || !isConfident(leftHip)) return null;

      // Check arm drive - wrists should alternate above and below hip height
      const armRange = Math.abs(leftWrist!.y - rightWrist!.y);

      if (armRange < 100) {
        return {
          message: "Pump your arms more - opposite arm, opposite leg",
          severity: 'info',
          bodyPart: 'arms',
        };
      }

      return null;
    }
  },
];

const calfRaiseRules: AnalysisRule[] = [
  {
    name: 'full-extension',
    check: (): PartialFeedback | null => {
      // Simplified check - would need more sophisticated analysis
      return null;
    }
  },
];

const runningRules: AnalysisRule[] = [
  {
    name: 'posture',
    check: (keypoints): PartialFeedback | null => {
      const nose = getKeypoint(keypoints, 'nose');
      const leftHip = getKeypoint(keypoints, 'left_hip');

      if (!isConfident(nose) || !isConfident(leftHip)) return null;

      // Check for forward lean
      const spineAngle = Math.abs(nose!.x - leftHip!.x);

      if (spineAngle > 60) {
        return {
          message: "Run tall - slight forward lean from ankles, not waist",
          severity: 'info',
          bodyPart: 'posture',
        };
      }

      return null;
    }
  },
];

// Rule sets by exercise type
const exerciseRules: Record<ExerciseType, AnalysisRule[]> = {
  'squat': squatRules,
  'lunge': lungeRules,
  'box-jump': boxJumpRules,
  'russian-twist': [],
  'calf-raise': calfRaiseRules,
  'a-skip': skipRules,
  'b-skip': skipRules,
  'sprint-start': runningRules,
  'running': runningRules,
};

export function analyzeMovement(
  keypoints: PoseKeypoint[],
  exerciseType: ExerciseType
): PartialFeedback[] {
  const rules = exerciseRules[exerciseType] || [];
  const feedback: PartialFeedback[] = [];

  for (const rule of rules) {
    const result = rule.check(keypoints);
    if (result) {
      feedback.push(result);
    }
  }

  return feedback;
}

// Map exercise names to types
export function getExerciseType(exerciseName: string): ExerciseType {
  const name = exerciseName.toLowerCase();
  
  if (name.includes('squat')) return 'squat';
  if (name.includes('lunge')) return 'lunge';
  if (name.includes('box jump') || name.includes('jump')) return 'box-jump';
  if (name.includes('russian') || name.includes('twist')) return 'russian-twist';
  if (name.includes('calf')) return 'calf-raise';
  if (name.includes('a-skip') || name.includes('a skip')) return 'a-skip';
  if (name.includes('b-skip') || name.includes('b skip')) return 'b-skip';
  if (name.includes('start') || name.includes('acceleration')) return 'sprint-start';
  
  return 'running';
}
