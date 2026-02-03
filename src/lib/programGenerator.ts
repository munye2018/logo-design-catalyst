// Types
export interface Exercise {
  id: number;
  name: string;
  details: string;
  duration: string;
  distance?: number;
  reps?: number;
  pace?: number;
  recovery?: number;
  targetTime?: number;
  loggedTime?: number;
}

export interface TrainingSession {
  id: number;
  name: string;
  details: string;
  day: string;
  completed: boolean;
  exercises: Exercise[];
}

export interface Week {
  id: number;
  name: string;
  stage: 'offseason' | 'general' | 'specific' | 'preComp' | 'deload';
  completed: boolean;
  sessions: TrainingSession[];
}

// Constants
const PROGRAM_LENGTH = 20;
const DELOAD_FREQUENCY = 4;
const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// Stage definitions
type StageName = 'deload' | 'offseason' | 'general' | 'specific' | 'preComp';

const stages: Record<StageName, {
  names: string[];
  details: string[];
  sessionTypes: string[][];
}> = {
  deload: {
    names: ["Hills", "Active Recovery", "Extensive Tempo", "Core Circuit", "Extensive Tempo", "Hypertrophy", "Rest"],
    details: ["45 mins", "Aim for 10k steps", "45 mins, track, trainers", "45 mins, repeat 3x", "45 mins, track", "105 mins, gym", "Complete Rest"],
    sessionTypes: [["warmUp", "acceleration", "warmDown"], ["activeRecovery"], ["warmUp", "extensiveTempo", "warmDown"], ["circuit"], ["warmUp", "extensiveTempo", "warmDown"], ["hypertrophy"], ["rest"]]
  },
  offseason: {
    names: ["Hills", "Active Recovery", "Work Capacity", "Core Circuit", "Extensive Tempo", "Hypertrophy", "Rest"],
    details: ["45 mins", "Aim for 10k steps", "45 mins, track", "45 mins, repeat 3x", "45 mins, track", "105 mins, gym", "Complete Rest"],
    sessionTypes: [["warmUp", "acceleration", "warmDown"], ["activeRecovery"], ["warmUp", "intensiveTempo", "warmDown"], ["circuit"], ["warmUp", "extensiveTempo", "warmDown"], ["hypertrophy"], ["rest"]]
  },
  general: {
    names: ["Acceleration", "Active Recovery", "Max Velocity", "Core Circuit", "Extensive Tempo", "Hypertrophy", "Rest"],
    details: ["45 mins, track, spikes", "Aim for 10k steps", "45 mins, track, spikes", "45 mins, repeat 3x", "45 mins, track", "105 mins, gym", "Complete Rest"],
    sessionTypes: [["warmUp", "acceleration", "warmDown"], ["activeRecovery"], ["warmUp", "maxVelocity", "warmDown"], ["circuit"], ["warmUp", "extensiveTempo", "warmDown"], ["hypertrophy"], ["rest"]]
  },
  specific: {
    names: ["Acceleration", "Active Recovery", "Max Velocity", "Core Circuit", "Speed Endurance", "Max Strength", "Rest"],
    details: ["45 mins, track, spikes", "Aim for 10k steps", "45 mins, track, spikes", "45 mins, repeat 3x", "45 mins, track, spikes", "105 mins, gym", "Complete Rest"],
    sessionTypes: [["warmUp", "acceleration", "warmDown"], ["activeRecovery"], ["warmUp", "maxVelocity", "warmDown"], ["circuit"], ["warmUp", "speedEndurance", "warmDown"], ["maxStrength"], ["rest"]]
  },
  preComp: {
    names: ["Acceleration", "Active Recovery", "Max Velocity", "Core Circuit", "Speed Endurance", "Power", "Rest"],
    details: ["45 mins, track, spikes", "Aim for 10k steps", "45 mins, track, spikes", "45 mins, repeat 3x", "45 mins, track, spikes", "105 mins, gym", "Complete Rest"],
    sessionTypes: [["warmUp", "acceleration", "warmDown"], ["activeRecovery"], ["warmUp", "maxVelocity", "warmDown"], ["circuit"], ["warmUp", "speedEndurance", "warmDown"], ["power"], ["rest"]]
  }
};

// Exercise templates
type ExerciseKey = 'acceleration' | 'maxVelocity' | 'speedEndurance' | 'intensiveTempo' | 'extensiveTempo' | 
                   'warmUp' | 'warmDown' | 'circuit' | 'hypertrophy' | 'maxStrength' | 'power' | 'activeRecovery' | 'rest';

const exerciseTemplates: Record<ExerciseKey, Exercise[]> = {
  acceleration: [
    { id: 1, name: "Sprint Starts", details: "Block starts or 3-point stance", duration: "10x30m", distance: 30, reps: 10, pace: 0.95, recovery: 3 },
    { id: 2, name: "Acceleration Runs", details: "Focus on drive phase", duration: "8x40m", distance: 40, reps: 8, pace: 0.98, recovery: 4 },
  ],
  maxVelocity: [
    { id: 1, name: "Flying Sprints", details: "30m build-up, 30m max", duration: "6x60m", distance: 60, reps: 6, pace: 1.0, recovery: 6 },
    { id: 2, name: "In-and-Outs", details: "Alternate speed zones", duration: "4x80m", distance: 80, reps: 4, pace: 0.95, recovery: 8 },
  ],
  speedEndurance: [
    { id: 1, name: "Speed Endurance", details: "Near-max effort", duration: "4x120m", distance: 120, reps: 4, pace: 0.92, recovery: 10 },
    { id: 2, name: "Race Pace", details: "Event-specific work", duration: "3x150m", distance: 150, reps: 3, pace: 0.90, recovery: 12 },
  ],
  intensiveTempo: [
    { id: 1, name: "Intensive Tempo", details: "Moderate-high intensity", duration: "6x200m", distance: 200, reps: 6, pace: 0.80, recovery: 3 },
  ],
  extensiveTempo: [
    { id: 1, name: "Extensive Tempo", details: "Aerobic development", duration: "10x100m", distance: 100, reps: 10, pace: 0.70, recovery: 1 },
    { id: 2, name: "Tempo Runs", details: "Continuous effort", duration: "6x200m", distance: 200, reps: 6, pace: 0.65, recovery: 2 },
  ],
  warmUp: [
    { id: 0, name: "Warm Up", details: "Dynamic stretching, A-skips, B-skips, strides", duration: "15 min" },
  ],
  warmDown: [
    { id: 99, name: "Cool Down", details: "Light jog, static stretching", duration: "10 min" },
  ],
  circuit: [
    { id: 1, name: "Russian Twists", details: "3-5kg medicine ball", duration: "3x20" },
    { id: 2, name: "Box Jumps", details: "40cm box", duration: "3x8" },
    { id: 3, name: "Push-ups", details: "Explosive", duration: "3x15" },
    { id: 4, name: "Plank", details: "Core stability", duration: "3x45s" },
    { id: 5, name: "Lunges", details: "Walking lunges", duration: "3x12 each" },
    { id: 6, name: "Calf Raises", details: "Single leg on step", duration: "3x15 each" },
  ],
  hypertrophy: [
    { id: 1, name: "Back Squats", details: "70% 1RM", duration: "4x8" },
    { id: 2, name: "Romanian Deadlifts", details: "Focus on hamstrings", duration: "4x10" },
    { id: 3, name: "Split Squats", details: "Dumbbells", duration: "3x10 each" },
    { id: 4, name: "Leg Curls", details: "Machine", duration: "3x12" },
    { id: 5, name: "Bench Press", details: "DB or barbell", duration: "4x8" },
    { id: 6, name: "Pull-ups", details: "Weighted if possible", duration: "3xMax" },
  ],
  maxStrength: [
    { id: 1, name: "Back Squats", details: "85% 1RM", duration: "5x3" },
    { id: 2, name: "Power Cleans", details: "80% 1RM", duration: "5x3" },
    { id: 3, name: "Romanian Deadlifts", details: "75% 1RM", duration: "4x5" },
    { id: 4, name: "Bench Press", details: "85% 1RM", duration: "5x3" },
  ],
  power: [
    { id: 1, name: "Jump Squats", details: "30% 1RM", duration: "5x5" },
    { id: 2, name: "Power Cleans", details: "70% 1RM, explosive", duration: "5x3" },
    { id: 3, name: "Box Jumps", details: "Max height", duration: "4x5" },
    { id: 4, name: "Medicine Ball Throws", details: "Overhead, chest pass", duration: "3x10" },
  ],
  activeRecovery: [
    { id: 1, name: "Active Recovery", details: "Light walking, cycling, or swimming", duration: "30-45 min" },
  ],
  rest: [
    { id: 1, name: "Complete Rest", details: "Sleep, nutrition, hydration focus", duration: "Full day" },
  ],
};

// Calculate target time based on user's best time
function calculateTargetTime(bestTime: number, distance: number, event: number, pace: number): number {
  // Estimate velocity from best time
  const velocity = event / bestTime; // m/s
  const baseTime = distance / velocity;
  return Math.round(baseTime / pace * 100) / 100;
}

// Get stage based on week number
function getStage(weekNumber: number): StageName {
  if ((weekNumber + 1) % DELOAD_FREQUENCY === 0) return 'deload';
  if (weekNumber < 4) return 'offseason';
  if (weekNumber < 8) return 'general';
  if (weekNumber < 16) return 'specific';
  return 'preComp';
}

// Generate program
export function generateProgram(bestTime: number, event: number = 100): Week[] {
  const program: Week[] = [];

  for (let weekIdx = 0; weekIdx < PROGRAM_LENGTH; weekIdx++) {
    const stage = getStage(weekIdx);
    const stageConfig = stages[stage];
    const sessions: TrainingSession[] = [];

    for (let dayIdx = 0; dayIdx < 7; dayIdx++) {
      const sessionTypes = stageConfig.sessionTypes[dayIdx];
      const exercises: Exercise[] = [];

      sessionTypes.forEach((type) => {
        const template = exerciseTemplates[type as ExerciseKey];
        if (template) {
          template.forEach((ex, idx) => {
            const exercise: Exercise = { ...ex, id: exercises.length + idx };
            if (ex.distance && ex.pace) {
              exercise.targetTime = calculateTargetTime(bestTime, ex.distance, event, ex.pace);
            }
            exercises.push(exercise);
          });
        }
      });

      sessions.push({
        id: dayIdx,
        name: stageConfig.names[dayIdx],
        details: stageConfig.details[dayIdx],
        day: DAYS_OF_WEEK[dayIdx],
        completed: false,
        exercises,
      });
    }

    program.push({
      id: weekIdx,
      name: `Week ${weekIdx + 1}`,
      stage,
      completed: false,
      sessions,
    });
  }

  return program;
}
