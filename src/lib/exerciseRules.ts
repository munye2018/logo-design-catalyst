import { PoseKeypoint, AnalysisFeedback } from '@/context/GlobalContext';

export type ExerciseType = 
  | 'squat'
  | 'lunge'
  | 'deadlift'
  | 'romanian-deadlift'
  | 'bench-press'
  | 'overhead-press'
  | 'barbell-row'
  | 'lat-pulldown'
  | 'push-up'
  | 'pull-up'
  | 'plank'
  | 'hip-thrust'
  | 'bicep-curl'
  | 'lateral-raise'
  | 'calf-raise'
  | 'goblet-squat'
  | 'dumbbell-row'
  | 'kettlebell-swing'
  | 'mountain-climber'
  | 'glute-bridge'
  | 'dips'
  | 'general';

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

// ==================== SQUAT RULES ====================
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

      const forwardLean = leftShoulder!.x - leftHip!.x;
      
      if (Math.abs(forwardLean) > 100) {
        return {
          message: "Keep your chest up and back straight - avoid excessive forward lean",
          severity: 'warning',
          bodyPart: 'back',
        };
      }

      return null;
    }
  },
  {
    name: 'knee-cave',
    check: (keypoints): PartialFeedback | null => {
      const leftKnee = getKeypoint(keypoints, 'left_knee');
      const rightKnee = getKeypoint(keypoints, 'right_knee');
      const leftAnkle = getKeypoint(keypoints, 'left_ankle');
      const rightAnkle = getKeypoint(keypoints, 'right_ankle');

      if (!isConfident(leftKnee) || !isConfident(rightKnee) || 
          !isConfident(leftAnkle) || !isConfident(rightAnkle)) return null;

      const kneeWidth = Math.abs(leftKnee!.x - rightKnee!.x);
      const ankleWidth = Math.abs(leftAnkle!.x - rightAnkle!.x);

      if (kneeWidth < ankleWidth * 0.8) {
        return {
          message: "Push your knees out - don't let them cave inward",
          severity: 'error',
          bodyPart: 'knees',
        };
      }

      return null;
    }
  },
];

// ==================== DEADLIFT RULES ====================
const deadliftRules: AnalysisRule[] = [
  {
    name: 'neutral-spine',
    check: (keypoints): PartialFeedback | null => {
      const nose = getKeypoint(keypoints, 'nose');
      const leftShoulder = getKeypoint(keypoints, 'left_shoulder');
      const leftHip = getKeypoint(keypoints, 'left_hip');

      if (!isConfident(nose) || !isConfident(leftShoulder) || !isConfident(leftHip)) return null;

      // Check for rounded back (shoulders too far forward relative to hips)
      const roundedBack = leftShoulder!.y > leftHip!.y + 50 && leftShoulder!.x < leftHip!.x - 80;

      if (roundedBack) {
        return {
          message: "Keep your back flat - don't round your spine",
          severity: 'error',
          bodyPart: 'spine',
        };
      }

      return null;
    }
  },
  {
    name: 'hip-hinge',
    check: (keypoints): PartialFeedback | null => {
      const leftHip = getKeypoint(keypoints, 'left_hip');
      const leftKnee = getKeypoint(keypoints, 'left_knee');
      const leftShoulder = getKeypoint(keypoints, 'left_shoulder');

      if (!isConfident(leftHip) || !isConfident(leftKnee) || !isConfident(leftShoulder)) return null;

      const hipAngle = calculateAngle(leftShoulder!, leftHip!, leftKnee!);

      if (hipAngle > 160) {
        return {
          message: "Hinge at your hips more - push your butt back",
          severity: 'info',
          bodyPart: 'hips',
        };
      }

      return null;
    }
  },
  {
    name: 'lockout',
    check: (keypoints): PartialFeedback | null => {
      const leftHip = getKeypoint(keypoints, 'left_hip');
      const leftKnee = getKeypoint(keypoints, 'left_knee');
      const leftAnkle = getKeypoint(keypoints, 'left_ankle');

      if (!isConfident(leftHip) || !isConfident(leftKnee) || !isConfident(leftAnkle)) return null;

      const kneeAngle = calculateAngle(leftHip!, leftKnee!, leftAnkle!);

      // At top of movement, legs should be nearly straight
      if (kneeAngle > 175) {
        return {
          message: "Great lockout! Squeeze your glutes at the top",
          severity: 'info',
          bodyPart: 'glutes',
        };
      }

      return null;
    }
  },
];

// ==================== BENCH PRESS RULES ====================
const benchPressRules: AnalysisRule[] = [
  {
    name: 'elbow-angle',
    check: (keypoints): PartialFeedback | null => {
      const leftShoulder = getKeypoint(keypoints, 'left_shoulder');
      const leftElbow = getKeypoint(keypoints, 'left_elbow');
      const leftWrist = getKeypoint(keypoints, 'left_wrist');

      if (!isConfident(leftShoulder) || !isConfident(leftElbow) || !isConfident(leftWrist)) return null;

      const elbowAngle = calculateAngle(leftShoulder!, leftElbow!, leftWrist!);

      if (elbowAngle > 160) {
        return {
          message: "Elbows flaring too wide - tuck them slightly at 45-75 degrees",
          severity: 'warning',
          bodyPart: 'elbows',
        };
      }

      return null;
    }
  },
  {
    name: 'wrist-alignment',
    check: (keypoints): PartialFeedback | null => {
      const leftWrist = getKeypoint(keypoints, 'left_wrist');
      const leftElbow = getKeypoint(keypoints, 'left_elbow');

      if (!isConfident(leftWrist) || !isConfident(leftElbow)) return null;

      // Wrist should be roughly above elbow
      const wristOffset = Math.abs(leftWrist!.x - leftElbow!.x);

      if (wristOffset > 60) {
        return {
          message: "Keep wrists stacked over elbows for better bar path",
          severity: 'info',
          bodyPart: 'wrists',
        };
      }

      return null;
    }
  },
];

// ==================== OVERHEAD PRESS RULES ====================
const overheadPressRules: AnalysisRule[] = [
  {
    name: 'core-bracing',
    check: (keypoints): PartialFeedback | null => {
      const leftShoulder = getKeypoint(keypoints, 'left_shoulder');
      const leftHip = getKeypoint(keypoints, 'left_hip');

      if (!isConfident(leftShoulder) || !isConfident(leftHip)) return null;

      // Check for excessive back arch
      const backArch = leftShoulder!.x - leftHip!.x;

      if (backArch > 80) {
        return {
          message: "Brace your core - avoid arching your lower back",
          severity: 'warning',
          bodyPart: 'core',
        };
      }

      return null;
    }
  },
  {
    name: 'lockout-position',
    check: (keypoints): PartialFeedback | null => {
      const leftWrist = getKeypoint(keypoints, 'left_wrist');
      const leftShoulder = getKeypoint(keypoints, 'left_shoulder');

      if (!isConfident(leftWrist) || !isConfident(leftShoulder)) return null;

      // At lockout, wrists should be above shoulders
      if (leftWrist!.y < leftShoulder!.y && Math.abs(leftWrist!.x - leftShoulder!.x) > 100) {
        return {
          message: "Stack the bar directly over your shoulders at lockout",
          severity: 'info',
          bodyPart: 'shoulders',
        };
      }

      return null;
    }
  },
];

// ==================== ROW RULES ====================
const rowRules: AnalysisRule[] = [
  {
    name: 'back-angle',
    check: (keypoints): PartialFeedback | null => {
      const leftShoulder = getKeypoint(keypoints, 'left_shoulder');
      const leftHip = getKeypoint(keypoints, 'left_hip');

      if (!isConfident(leftShoulder) || !isConfident(leftHip)) return null;

      // Shoulders should be forward of hips in bent position
      const angle = leftShoulder!.x - leftHip!.x;

      if (angle > -30) {
        return {
          message: "Hinge forward more - keep your torso at about 45 degrees",
          severity: 'info',
          bodyPart: 'torso',
        };
      }

      return null;
    }
  },
  {
    name: 'pull-to-hip',
    check: (keypoints): PartialFeedback | null => {
      const leftWrist = getKeypoint(keypoints, 'left_wrist');
      const leftHip = getKeypoint(keypoints, 'left_hip');

      if (!isConfident(leftWrist) || !isConfident(leftHip)) return null;

      // Check if rowing toward hip
      const distanceToHip = Math.abs(leftWrist!.y - leftHip!.y);

      if (distanceToHip < 50) {
        return {
          message: "Good! Pull to your lower ribs/hip area",
          severity: 'info',
          bodyPart: 'back',
        };
      }

      return null;
    }
  },
];

// ==================== LUNGE RULES ====================
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

// ==================== PLANK RULES ====================
const plankRules: AnalysisRule[] = [
  {
    name: 'hip-sag',
    check: (keypoints): PartialFeedback | null => {
      const leftShoulder = getKeypoint(keypoints, 'left_shoulder');
      const leftHip = getKeypoint(keypoints, 'left_hip');
      const leftAnkle = getKeypoint(keypoints, 'left_ankle');

      if (!isConfident(leftShoulder) || !isConfident(leftHip) || !isConfident(leftAnkle)) return null;

      // Check if hips are sagging (hip y > line between shoulder and ankle)
      const expectedHipY = (leftShoulder!.y + leftAnkle!.y) / 2;
      const hipSag = leftHip!.y - expectedHipY;

      if (hipSag > 40) {
        return {
          message: "Don't let your hips sag - engage your core and lift your hips",
          severity: 'error',
          bodyPart: 'hips',
        };
      }

      if (hipSag < -40) {
        return {
          message: "Lower your hips slightly - keep a straight line from head to heels",
          severity: 'info',
          bodyPart: 'hips',
        };
      }

      return null;
    }
  },
  {
    name: 'shoulder-alignment',
    check: (keypoints): PartialFeedback | null => {
      const leftShoulder = getKeypoint(keypoints, 'left_shoulder');
      const leftElbow = getKeypoint(keypoints, 'left_elbow');

      if (!isConfident(leftShoulder) || !isConfident(leftElbow)) return null;

      // Shoulders should be stacked over elbows
      const offset = Math.abs(leftShoulder!.x - leftElbow!.x);

      if (offset > 50) {
        return {
          message: "Stack your shoulders directly over your elbows",
          severity: 'info',
          bodyPart: 'shoulders',
        };
      }

      return null;
    }
  },
];

// ==================== PUSH-UP RULES ====================
const pushUpRules: AnalysisRule[] = [
  {
    name: 'body-alignment',
    check: (keypoints): PartialFeedback | null => {
      const leftShoulder = getKeypoint(keypoints, 'left_shoulder');
      const leftHip = getKeypoint(keypoints, 'left_hip');
      const leftAnkle = getKeypoint(keypoints, 'left_ankle');

      if (!isConfident(leftShoulder) || !isConfident(leftHip) || !isConfident(leftAnkle)) return null;

      const expectedHipY = (leftShoulder!.y + leftAnkle!.y) / 2;
      const hipSag = leftHip!.y - expectedHipY;

      if (Math.abs(hipSag) > 40) {
        return {
          message: "Keep your body in a straight line - engage your core",
          severity: 'warning',
          bodyPart: 'core',
        };
      }

      return null;
    }
  },
  {
    name: 'elbow-tuck',
    check: (keypoints): PartialFeedback | null => {
      const leftShoulder = getKeypoint(keypoints, 'left_shoulder');
      const leftElbow = getKeypoint(keypoints, 'left_elbow');
      const rightShoulder = getKeypoint(keypoints, 'right_shoulder');
      const rightElbow = getKeypoint(keypoints, 'right_elbow');

      if (!isConfident(leftShoulder) || !isConfident(leftElbow) ||
          !isConfident(rightShoulder) || !isConfident(rightElbow)) return null;

      // Elbows shouldn't flare out too wide
      const shoulderWidth = Math.abs(leftShoulder!.x - rightShoulder!.x);
      const elbowWidth = Math.abs(leftElbow!.x - rightElbow!.x);

      if (elbowWidth > shoulderWidth * 1.5) {
        return {
          message: "Tuck your elbows closer to your body - about 45 degrees",
          severity: 'warning',
          bodyPart: 'elbows',
        };
      }

      return null;
    }
  },
];

// ==================== CALF RAISE RULES ====================
const calfRaiseRules: AnalysisRule[] = [
  {
    name: 'full-extension',
    check: (keypoints): PartialFeedback | null => {
      const leftAnkle = getKeypoint(keypoints, 'left_ankle');
      const leftKnee = getKeypoint(keypoints, 'left_knee');

      if (!isConfident(leftAnkle) || !isConfident(leftKnee)) return null;

      // During raise, ankle should be higher relative to starting position
      // This is a simplified check
      return null;
    }
  },
];

// ==================== HIP THRUST RULES ====================
const hipThrustRules: AnalysisRule[] = [
  {
    name: 'full-extension',
    check: (keypoints): PartialFeedback | null => {
      const leftShoulder = getKeypoint(keypoints, 'left_shoulder');
      const leftHip = getKeypoint(keypoints, 'left_hip');
      const leftKnee = getKeypoint(keypoints, 'left_knee');

      if (!isConfident(leftShoulder) || !isConfident(leftHip) || !isConfident(leftKnee)) return null;

      const hipAngle = calculateAngle(leftShoulder!, leftHip!, leftKnee!);

      // At full extension, hips should create a straight line
      if (hipAngle < 160) {
        return {
          message: "Push your hips higher - squeeze your glutes at the top",
          severity: 'info',
          bodyPart: 'glutes',
        };
      }

      return null;
    }
  },
];

// ==================== BICEP CURL RULES ====================
const bicepCurlRules: AnalysisRule[] = [
  {
    name: 'elbow-position',
    check: (keypoints): PartialFeedback | null => {
      const leftShoulder = getKeypoint(keypoints, 'left_shoulder');
      const leftElbow = getKeypoint(keypoints, 'left_elbow');

      if (!isConfident(leftShoulder) || !isConfident(leftElbow)) return null;

      // Elbow should stay at sides
      const elbowDrift = Math.abs(leftElbow!.x - leftShoulder!.x);

      if (elbowDrift > 60) {
        return {
          message: "Keep your elbows pinned to your sides - don't swing",
          severity: 'warning',
          bodyPart: 'elbows',
        };
      }

      return null;
    }
  },
];

// ==================== LATERAL RAISE RULES ====================
const lateralRaiseRules: AnalysisRule[] = [
  {
    name: 'arm-height',
    check: (keypoints): PartialFeedback | null => {
      const leftShoulder = getKeypoint(keypoints, 'left_shoulder');
      const leftWrist = getKeypoint(keypoints, 'left_wrist');

      if (!isConfident(leftShoulder) || !isConfident(leftWrist)) return null;

      // Arms should not go above shoulder height
      if (leftWrist!.y < leftShoulder!.y - 30) {
        return {
          message: "Don't raise higher than shoulder level - maintain tension in delts",
          severity: 'info',
          bodyPart: 'shoulders',
        };
      }

      return null;
    }
  },
];

// ==================== GENERAL RULES (fallback) ====================
const generalRules: AnalysisRule[] = [
  {
    name: 'posture',
    check: (keypoints): PartialFeedback | null => {
      const nose = getKeypoint(keypoints, 'nose');
      const leftShoulder = getKeypoint(keypoints, 'left_shoulder');
      const leftHip = getKeypoint(keypoints, 'left_hip');

      if (!isConfident(nose) || !isConfident(leftShoulder) || !isConfident(leftHip)) return null;

      // Check for good posture (head over shoulders, shoulders over hips)
      const headForward = nose!.x - leftShoulder!.x;

      if (headForward > 80) {
        return {
          message: "Keep your head neutral - don't jut your chin forward",
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
  'goblet-squat': squatRules,
  'lunge': lungeRules,
  'deadlift': deadliftRules,
  'romanian-deadlift': deadliftRules,
  'bench-press': benchPressRules,
  'overhead-press': overheadPressRules,
  'barbell-row': rowRules,
  'dumbbell-row': rowRules,
  'lat-pulldown': rowRules,
  'push-up': pushUpRules,
  'pull-up': generalRules,
  'plank': plankRules,
  'hip-thrust': hipThrustRules,
  'glute-bridge': hipThrustRules,
  'bicep-curl': bicepCurlRules,
  'lateral-raise': lateralRaiseRules,
  'calf-raise': calfRaiseRules,
  'kettlebell-swing': deadliftRules,
  'mountain-climber': plankRules,
  'dips': pushUpRules,
  'general': generalRules,
};

export function analyzeMovement(
  keypoints: PoseKeypoint[],
  exerciseType: ExerciseType
): PartialFeedback[] {
  const rules = exerciseRules[exerciseType] || generalRules;
  const feedback: PartialFeedback[] = [];

  for (const rule of rules) {
    const result = rule.check(keypoints);
    if (result) {
      feedback.push(result);
    }
  }

  return feedback;
}

// Map exercise names/IDs to exercise types for analysis
export function getExerciseType(exerciseName: string): ExerciseType {
  const name = exerciseName.toLowerCase();
  
  // Compound movements
  if (name.includes('deadlift') && !name.includes('romanian')) return 'deadlift';
  if (name.includes('romanian') || name.includes('rdl')) return 'romanian-deadlift';
  if (name.includes('squat') && name.includes('goblet')) return 'goblet-squat';
  if (name.includes('squat')) return 'squat';
  if (name.includes('lunge') || name.includes('split squat')) return 'lunge';
  if (name.includes('bench press')) return 'bench-press';
  if (name.includes('overhead press') || name.includes('shoulder press')) return 'overhead-press';
  if (name.includes('barbell row')) return 'barbell-row';
  if (name.includes('dumbbell row')) return 'dumbbell-row';
  if (name.includes('lat pulldown') || name.includes('pulldown')) return 'lat-pulldown';
  if (name.includes('push-up') || name.includes('pushup')) return 'push-up';
  if (name.includes('pull-up') || name.includes('pullup')) return 'pull-up';
  if (name.includes('dip')) return 'dips';
  
  // Isolation/accessory
  if (name.includes('plank')) return 'plank';
  if (name.includes('hip thrust')) return 'hip-thrust';
  if (name.includes('glute bridge')) return 'glute-bridge';
  if (name.includes('curl') && name.includes('bicep')) return 'bicep-curl';
  if (name.includes('hammer curl')) return 'bicep-curl';
  if (name.includes('lateral raise')) return 'lateral-raise';
  if (name.includes('calf')) return 'calf-raise';
  if (name.includes('kettlebell swing') || name.includes('kb swing')) return 'kettlebell-swing';
  if (name.includes('mountain climber')) return 'mountain-climber';
  
  return 'general';
}

// Get list of exercises that support form analysis
export function getAnalyzableExercises(): { value: ExerciseType; label: string }[] {
  return [
    { value: 'squat', label: 'Barbell Squat' },
    { value: 'goblet-squat', label: 'Goblet Squat' },
    { value: 'deadlift', label: 'Deadlift' },
    { value: 'romanian-deadlift', label: 'Romanian Deadlift' },
    { value: 'lunge', label: 'Lunges' },
    { value: 'bench-press', label: 'Bench Press' },
    { value: 'overhead-press', label: 'Overhead Press' },
    { value: 'barbell-row', label: 'Barbell Row' },
    { value: 'dumbbell-row', label: 'Dumbbell Row' },
    { value: 'lat-pulldown', label: 'Lat Pulldown' },
    { value: 'push-up', label: 'Push-ups' },
    { value: 'pull-up', label: 'Pull-ups' },
    { value: 'dips', label: 'Dips' },
    { value: 'plank', label: 'Plank' },
    { value: 'hip-thrust', label: 'Hip Thrust' },
    { value: 'glute-bridge', label: 'Glute Bridge' },
    { value: 'bicep-curl', label: 'Bicep Curl' },
    { value: 'lateral-raise', label: 'Lateral Raise' },
    { value: 'calf-raise', label: 'Calf Raise' },
    { value: 'kettlebell-swing', label: 'Kettlebell Swing' },
    { value: 'mountain-climber', label: 'Mountain Climbers' },
  ];
}
