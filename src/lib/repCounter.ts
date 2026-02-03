import { PoseKeypoint } from '@/context/GlobalContext';
import type { ExerciseType } from './exerciseRules';

// Movement phases for rep tracking
export type MovementPhase = 'idle' | 'descending' | 'bottom' | 'ascending' | 'top';

// Exercise configuration for rep counting
export interface ExerciseRepConfig {
  primaryJoints: {
    point1: string; // First point (e.g., hip)
    point2: string; // Vertex point (e.g., knee)
    point3: string; // End point (e.g., ankle)
  };
  secondaryJoints?: {
    point1: string;
    point2: string;
    point3: string;
  };
  bottomAngleRange: [number, number]; // [min, max] degrees at bottom of movement
  topAngleRange: [number, number]; // [min, max] degrees at top of movement
  repDirection: 'down-up' | 'up-down'; // squat goes down-up, overhead press goes up-down
  useAverage?: boolean; // Average left and right sides
}

// Optimal angle configurations for each exercise
export const exerciseRepConfigs: Partial<Record<ExerciseType, ExerciseRepConfig>> = {
  'squat': {
    primaryJoints: { point1: 'left_hip', point2: 'left_knee', point3: 'left_ankle' },
    secondaryJoints: { point1: 'right_hip', point2: 'right_knee', point3: 'right_ankle' },
    bottomAngleRange: [70, 100],
    topAngleRange: [160, 180],
    repDirection: 'down-up',
    useAverage: true,
  },
  'goblet-squat': {
    primaryJoints: { point1: 'left_hip', point2: 'left_knee', point3: 'left_ankle' },
    secondaryJoints: { point1: 'right_hip', point2: 'right_knee', point3: 'right_ankle' },
    bottomAngleRange: [70, 100],
    topAngleRange: [160, 180],
    repDirection: 'down-up',
    useAverage: true,
  },
  'deadlift': {
    primaryJoints: { point1: 'left_shoulder', point2: 'left_hip', point3: 'left_knee' },
    secondaryJoints: { point1: 'right_shoulder', point2: 'right_hip', point3: 'right_knee' },
    bottomAngleRange: [80, 110],
    topAngleRange: [170, 180],
    repDirection: 'down-up',
    useAverage: true,
  },
  'romanian-deadlift': {
    primaryJoints: { point1: 'left_shoulder', point2: 'left_hip', point3: 'left_knee' },
    secondaryJoints: { point1: 'right_shoulder', point2: 'right_hip', point3: 'right_knee' },
    bottomAngleRange: [80, 120],
    topAngleRange: [170, 180],
    repDirection: 'down-up',
    useAverage: true,
  },
  'bench-press': {
    primaryJoints: { point1: 'left_shoulder', point2: 'left_elbow', point3: 'left_wrist' },
    secondaryJoints: { point1: 'right_shoulder', point2: 'right_elbow', point3: 'right_wrist' },
    bottomAngleRange: [70, 100],
    topAngleRange: [150, 180],
    repDirection: 'down-up',
    useAverage: true,
  },
  'overhead-press': {
    primaryJoints: { point1: 'left_shoulder', point2: 'left_elbow', point3: 'left_wrist' },
    secondaryJoints: { point1: 'right_shoulder', point2: 'right_elbow', point3: 'right_wrist' },
    bottomAngleRange: [70, 100],
    topAngleRange: [160, 180],
    repDirection: 'up-down', // Press goes up first
    useAverage: true,
  },
  'bicep-curl': {
    primaryJoints: { point1: 'left_shoulder', point2: 'left_elbow', point3: 'left_wrist' },
    secondaryJoints: { point1: 'right_shoulder', point2: 'right_elbow', point3: 'right_wrist' },
    bottomAngleRange: [30, 60],
    topAngleRange: [140, 170],
    repDirection: 'up-down', // Curl up first
    useAverage: true,
  },
  'lunge': {
    primaryJoints: { point1: 'left_hip', point2: 'left_knee', point3: 'left_ankle' },
    bottomAngleRange: [80, 110],
    topAngleRange: [160, 180],
    repDirection: 'down-up',
  },
  'push-up': {
    primaryJoints: { point1: 'left_shoulder', point2: 'left_elbow', point3: 'left_wrist' },
    secondaryJoints: { point1: 'right_shoulder', point2: 'right_elbow', point3: 'right_wrist' },
    bottomAngleRange: [70, 100],
    topAngleRange: [150, 180],
    repDirection: 'down-up',
    useAverage: true,
  },
  'lat-pulldown': {
    primaryJoints: { point1: 'left_shoulder', point2: 'left_elbow', point3: 'left_wrist' },
    secondaryJoints: { point1: 'right_shoulder', point2: 'right_elbow', point3: 'right_wrist' },
    bottomAngleRange: [40, 70],
    topAngleRange: [140, 170],
    repDirection: 'up-down', // Pull down first (contracted at bottom)
    useAverage: true,
  },
  'barbell-row': {
    primaryJoints: { point1: 'left_shoulder', point2: 'left_elbow', point3: 'left_wrist' },
    secondaryJoints: { point1: 'right_shoulder', point2: 'right_elbow', point3: 'right_wrist' },
    bottomAngleRange: [40, 80],
    topAngleRange: [140, 170],
    repDirection: 'up-down', // Row up first
    useAverage: true,
  },
  'dumbbell-row': {
    primaryJoints: { point1: 'left_shoulder', point2: 'left_elbow', point3: 'left_wrist' },
    bottomAngleRange: [40, 80],
    topAngleRange: [140, 170],
    repDirection: 'up-down',
  },
  'hip-thrust': {
    primaryJoints: { point1: 'left_shoulder', point2: 'left_hip', point3: 'left_knee' },
    secondaryJoints: { point1: 'right_shoulder', point2: 'right_hip', point3: 'right_knee' },
    bottomAngleRange: [80, 120],
    topAngleRange: [160, 180],
    repDirection: 'down-up',
    useAverage: true,
  },
  'glute-bridge': {
    primaryJoints: { point1: 'left_shoulder', point2: 'left_hip', point3: 'left_knee' },
    secondaryJoints: { point1: 'right_shoulder', point2: 'right_hip', point3: 'right_knee' },
    bottomAngleRange: [80, 120],
    topAngleRange: [160, 180],
    repDirection: 'down-up',
    useAverage: true,
  },
  'calf-raise': {
    primaryJoints: { point1: 'left_knee', point2: 'left_ankle', point3: 'left_ankle' },
    bottomAngleRange: [80, 100],
    topAngleRange: [160, 180],
    repDirection: 'down-up',
  },
  'dips': {
    primaryJoints: { point1: 'left_shoulder', point2: 'left_elbow', point3: 'left_wrist' },
    secondaryJoints: { point1: 'right_shoulder', point2: 'right_elbow', point3: 'right_wrist' },
    bottomAngleRange: [70, 100],
    topAngleRange: [150, 180],
    repDirection: 'down-up',
    useAverage: true,
  },
};

// Helper to calculate angle between three points
function calculateAngle(p1: PoseKeypoint, p2: PoseKeypoint, p3: PoseKeypoint): number {
  const rad = Math.atan2(p3.y - p2.y, p3.x - p2.x) - Math.atan2(p1.y - p2.y, p1.x - p2.x);
  let deg = Math.abs(rad * 180 / Math.PI);
  if (deg > 180) deg = 360 - deg;
  return deg;
}

// Helper to get keypoint by name
function getKeypoint(keypoints: PoseKeypoint[], name: string): PoseKeypoint | undefined {
  return keypoints.find(kp => kp.name === name);
}

// Check if keypoint is confident enough
function isConfident(kp: PoseKeypoint | undefined, threshold = 0.3): boolean {
  return kp !== undefined && kp.score >= threshold;
}

export interface RepCounterState {
  repCount: number;
  currentPhase: MovementPhase;
  currentAngle: number | null;
  lastRepTimestamp: number | null;
  isValidRep: boolean;
}

export class RepCounter {
  private state: RepCounterState = {
    repCount: 0,
    currentPhase: 'idle',
    currentAngle: null,
    lastRepTimestamp: null,
    isValidRep: false,
  };

  private config: ExerciseRepConfig | null = null;
  private angleHistory: number[] = [];
  private readonly historySize = 5; // Smooth angle readings
  private readonly minRepInterval = 500; // Minimum ms between reps to prevent double counting

  setExercise(exerciseType: ExerciseType): void {
    this.config = exerciseRepConfigs[exerciseType] || null;
    this.reset();
  }

  reset(): void {
    this.state = {
      repCount: 0,
      currentPhase: 'idle',
      currentAngle: null,
      lastRepTimestamp: null,
      isValidRep: false,
    };
    this.angleHistory = [];
  }

  getState(): RepCounterState {
    return { ...this.state };
  }

  update(keypoints: PoseKeypoint[]): RepCounterState {
    if (!this.config) {
      return this.state;
    }

    const angle = this.calculateCurrentAngle(keypoints);
    if (angle === null) {
      return this.state;
    }

    // Smooth the angle with moving average
    this.angleHistory.push(angle);
    if (this.angleHistory.length > this.historySize) {
      this.angleHistory.shift();
    }
    const smoothedAngle = this.angleHistory.reduce((a, b) => a + b, 0) / this.angleHistory.length;
    this.state.currentAngle = Math.round(smoothedAngle);

    // Update phase based on angle and direction
    this.updatePhase(smoothedAngle);

    return this.state;
  }

  private calculateCurrentAngle(keypoints: PoseKeypoint[]): number | null {
    if (!this.config) return null;

    const { primaryJoints, secondaryJoints, useAverage } = this.config;

    // Get primary joint angle
    const p1 = getKeypoint(keypoints, primaryJoints.point1);
    const p2 = getKeypoint(keypoints, primaryJoints.point2);
    const p3 = getKeypoint(keypoints, primaryJoints.point3);

    if (!isConfident(p1) || !isConfident(p2) || !isConfident(p3)) {
      return null;
    }

    const primaryAngle = calculateAngle(p1!, p2!, p3!);

    // If we have secondary joints and should average, calculate that too
    if (useAverage && secondaryJoints) {
      const s1 = getKeypoint(keypoints, secondaryJoints.point1);
      const s2 = getKeypoint(keypoints, secondaryJoints.point2);
      const s3 = getKeypoint(keypoints, secondaryJoints.point3);

      if (isConfident(s1) && isConfident(s2) && isConfident(s3)) {
        const secondaryAngle = calculateAngle(s1!, s2!, s3!);
        return (primaryAngle + secondaryAngle) / 2;
      }
    }

    return primaryAngle;
  }

  private updatePhase(angle: number): void {
    if (!this.config) return;

    const { bottomAngleRange, topAngleRange, repDirection } = this.config;
    const [bottomMin, bottomMax] = bottomAngleRange;
    const [topMin, topMax] = topAngleRange;

    const isAtBottom = angle >= bottomMin && angle <= bottomMax;
    const isAtTop = angle >= topMin && angle <= topMax;

    const now = Date.now();

    // State machine transitions
    switch (this.state.currentPhase) {
      case 'idle':
        if (repDirection === 'down-up') {
          // For squats, deadlifts: start by going down
          if (angle < topMin - 10) {
            this.state.currentPhase = 'descending';
          }
        } else {
          // For overhead press, curls: start by going up
          if (angle > bottomMax + 10) {
            this.state.currentPhase = 'ascending';
          }
        }
        break;

      case 'descending':
        if (isAtBottom) {
          this.state.currentPhase = 'bottom';
        }
        break;

      case 'bottom':
        if (angle > bottomMax + 15) {
          this.state.currentPhase = 'ascending';
        }
        break;

      case 'ascending':
        if (repDirection === 'down-up') {
          if (isAtTop) {
            this.state.currentPhase = 'top';
            this.countRep(now);
          }
        } else {
          // For up-down exercises, reaching top means bottom of the exercise
          if (isAtTop) {
            this.state.currentPhase = 'top';
          }
        }
        break;

      case 'top':
        if (repDirection === 'down-up') {
          // Reset to idle, ready for next rep
          if (angle < topMin - 10) {
            this.state.currentPhase = 'descending';
          }
        } else {
          // For up-down exercises, going back down completes the rep
          if (angle < topMin - 10) {
            this.state.currentPhase = 'descending';
          }
          if (isAtBottom) {
            this.countRep(now);
            this.state.currentPhase = 'bottom';
          }
        }
        break;
    }
  }

  private countRep(now: number): void {
    // Prevent double counting
    if (this.state.lastRepTimestamp && now - this.state.lastRepTimestamp < this.minRepInterval) {
      return;
    }

    this.state.repCount++;
    this.state.lastRepTimestamp = now;
    this.state.isValidRep = true;

    // Reset valid rep flag after a short delay (for UI flash effect)
    setTimeout(() => {
      this.state.isValidRep = false;
    }, 300);
  }
}

// Singleton instance for use across components
export const repCounter = new RepCounter();
