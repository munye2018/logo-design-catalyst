import { 
  exerciseLibrary, 
  getAvailableEquipment, 
  type ExerciseDefinition,
  type MuscleGroup,
  type EquipmentType 
} from './exerciseLibrary';

// Types
export interface ExerciseLog {
  sets: number;
  reps: number;
  weight?: number;
  difficulty: 'easy' | 'moderate' | 'hard';
  completedAt: number;
}

export interface Exercise {
  id: number;
  exerciseId: string;
  name: string;
  details: string;
  sets: number;
  reps: string;
  weight?: string;
  rest?: string;
  completed: boolean;
  log?: ExerciseLog;
}

export interface TrainingSession {
  id: number;
  name: string;
  details: string;
  day: string;
  type: SessionType;
  completed: boolean;
  exercises: Exercise[];
}

export interface Week {
  id: number;
  name: string;
  phase: Phase;
  completed: boolean;
  sessions: TrainingSession[];
}

export type Phase = 'foundation' | 'building' | 'peak' | 'deload';
export type SessionType = 
  | 'push' 
  | 'pull' 
  | 'legs' 
  | 'upper' 
  | 'lower' 
  | 'full-body' 
  | 'chest-triceps'
  | 'back-biceps'
  | 'shoulders-arms'
  | 'rest';

// Program configuration based on user settings
interface ProgramConfig {
  fitnessGoal: 'muscle' | 'weight-loss' | 'strength' | 'general';
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
  trainingDays: 2 | 3 | 4 | 5 | 6;
  equipment: 'full-gym' | 'home-gym' | 'minimal';
}

// Constants
const PROGRAM_LENGTH = 8; // 8-week program
const DELOAD_FREQUENCY = 4;
const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// Training split templates based on training days
const TRAINING_SPLITS: Record<number, SessionType[]> = {
  2: ['full-body', 'rest', 'rest', 'full-body', 'rest', 'rest', 'rest'],
  3: ['push', 'rest', 'pull', 'rest', 'legs', 'rest', 'rest'],
  4: ['upper', 'lower', 'rest', 'upper', 'lower', 'rest', 'rest'],
  5: ['push', 'pull', 'legs', 'rest', 'upper', 'lower', 'rest'],
  6: ['push', 'pull', 'legs', 'push', 'pull', 'legs', 'rest'],
};

// Session name mapping
const SESSION_NAMES: Record<SessionType, string> = {
  'push': 'Push Day',
  'pull': 'Pull Day',
  'legs': 'Leg Day',
  'upper': 'Upper Body',
  'lower': 'Lower Body',
  'full-body': 'Full Body',
  'chest-triceps': 'Chest & Triceps',
  'back-biceps': 'Back & Biceps',
  'shoulders-arms': 'Shoulders & Arms',
  'rest': 'Rest Day',
};

// Session details mapping
const SESSION_DETAILS: Record<SessionType, string> = {
  'push': 'Chest, Shoulders, Triceps',
  'pull': 'Back, Biceps, Rear Delts',
  'legs': 'Quads, Hamstrings, Glutes, Calves',
  'upper': 'All upper body muscles',
  'lower': 'All lower body muscles',
  'full-body': 'Complete body workout',
  'chest-triceps': 'Chest and arm extension',
  'back-biceps': 'Back and arm flexion',
  'shoulders-arms': 'Delts, Biceps, Triceps',
  'rest': 'Recovery and regeneration',
};

// Muscle groups for each session type
const SESSION_MUSCLES: Record<SessionType, MuscleGroup[]> = {
  'push': ['chest', 'shoulders', 'triceps'],
  'pull': ['back', 'biceps'],
  'legs': ['quadriceps', 'hamstrings', 'glutes', 'calves'],
  'upper': ['chest', 'back', 'shoulders', 'biceps', 'triceps'],
  'lower': ['quadriceps', 'hamstrings', 'glutes', 'calves'],
  'full-body': ['chest', 'back', 'shoulders', 'quadriceps', 'hamstrings', 'core'],
  'chest-triceps': ['chest', 'triceps'],
  'back-biceps': ['back', 'biceps'],
  'shoulders-arms': ['shoulders', 'biceps', 'triceps'],
  'rest': [],
};

// Get sets/reps based on goal
function getSetsRepsForGoal(goal: ProgramConfig['fitnessGoal'], exercise: ExerciseDefinition): { sets: number; reps: string } {
  switch (goal) {
    case 'strength':
      return { sets: 5, reps: '3-5' };
    case 'muscle':
      return { sets: 4, reps: '8-12' };
    case 'weight-loss':
      return { sets: 3, reps: '12-15' };
    case 'general':
    default:
      return { sets: exercise.defaultSets, reps: exercise.defaultReps };
  }
}

// Get rest time based on goal
function getRestTime(goal: ProgramConfig['fitnessGoal']): string {
  switch (goal) {
    case 'strength':
      return '3-5 min';
    case 'muscle':
      return '60-90 sec';
    case 'weight-loss':
      return '30-45 sec';
    case 'general':
    default:
      return '60-90 sec';
  }
}

// Get exercises for a session type
function getExercisesForSession(
  sessionType: SessionType,
  config: ProgramConfig,
  availableEquipment: EquipmentType[]
): Exercise[] {
  if (sessionType === 'rest') {
    return [{
      id: 0,
      exerciseId: 'rest',
      name: 'Rest Day',
      details: 'Focus on recovery, stretching, and nutrition',
      sets: 0,
      reps: '-',
      completed: false,
    }];
  }

  const targetMuscles = SESSION_MUSCLES[sessionType];
  const exercises: Exercise[] = [];
  let id = 0;

  // Filter exercises by equipment and difficulty
  const availableExercises = exerciseLibrary.filter(ex => {
    const hasEquipment = ex.equipment.some(e => availableEquipment.includes(e));
    const matchesDifficulty = 
      config.experienceLevel === 'advanced' || 
      ex.difficulty !== 'advanced' ||
      (config.experienceLevel === 'intermediate' && ex.difficulty !== 'advanced');
    return hasEquipment && matchesDifficulty;
  });

  // Select exercises for each target muscle
  targetMuscles.forEach(muscle => {
    const muscleExercises = availableExercises.filter(ex => ex.primaryMuscle === muscle);
    
    // Take 1-2 exercises per muscle group depending on session type
    const numExercises = sessionType === 'full-body' ? 1 : 2;
    const selected = muscleExercises.slice(0, numExercises);
    
    selected.forEach(ex => {
      const { sets, reps } = getSetsRepsForGoal(config.fitnessGoal, ex);
      exercises.push({
        id: id++,
        exerciseId: ex.id,
        name: ex.name,
        details: ex.description,
        sets,
        reps,
        rest: getRestTime(config.fitnessGoal),
        completed: false,
      });
    });
  });

  // Add core work for non-leg days
  if (!['legs', 'lower'].includes(sessionType) && exercises.length < 8) {
    const coreExercises = availableExercises.filter(ex => ex.primaryMuscle === 'core');
    if (coreExercises.length > 0) {
      const coreEx = coreExercises[0];
      const { sets, reps } = getSetsRepsForGoal(config.fitnessGoal, coreEx);
      exercises.push({
        id: id++,
        exerciseId: coreEx.id,
        name: coreEx.name,
        details: coreEx.description,
        sets,
        reps,
        rest: getRestTime(config.fitnessGoal),
        completed: false,
      });
    }
  }

  return exercises;
}

// Get phase based on week number
function getPhase(weekNumber: number): Phase {
  if ((weekNumber + 1) % DELOAD_FREQUENCY === 0) return 'deload';
  if (weekNumber < 2) return 'foundation';
  if (weekNumber < 6) return 'building';
  return 'peak';
}

// Get phase description
function getPhaseDescription(phase: Phase): string {
  switch (phase) {
    case 'foundation':
      return 'Building base strength and movement patterns';
    case 'building':
      return 'Progressive overload and volume increase';
    case 'peak':
      return 'Intensity focus and performance optimization';
    case 'deload':
      return 'Recovery week - reduced volume';
  }
}

// Generate program
export function generateProgram(config: ProgramConfig): Week[] {
  const program: Week[] = [];
  const split = TRAINING_SPLITS[config.trainingDays];
  const availableEquipment = getAvailableEquipment(config.equipment);

  for (let weekIdx = 0; weekIdx < PROGRAM_LENGTH; weekIdx++) {
    const phase = getPhase(weekIdx);
    const sessions: TrainingSession[] = [];

    for (let dayIdx = 0; dayIdx < 7; dayIdx++) {
      const sessionType = split[dayIdx];
      const isDeload = phase === 'deload';
      
      let exercises = getExercisesForSession(sessionType, config, availableEquipment);
      
      // Reduce volume for deload weeks
      if (isDeload && sessionType !== 'rest') {
        exercises = exercises.slice(0, Math.ceil(exercises.length * 0.6));
        exercises = exercises.map(ex => ({
          ...ex,
          sets: Math.max(2, ex.sets - 1),
        }));
      }

      sessions.push({
        id: dayIdx,
        name: SESSION_NAMES[sessionType],
        details: isDeload && sessionType !== 'rest' 
          ? `${SESSION_DETAILS[sessionType]} (Light)` 
          : SESSION_DETAILS[sessionType],
        day: DAYS_OF_WEEK[dayIdx],
        type: sessionType,
        completed: false,
        exercises,
      });
    }

    program.push({
      id: weekIdx,
      name: `Week ${weekIdx + 1}`,
      phase,
      completed: false,
      sessions,
    });
  }

  return program;
}
