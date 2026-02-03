// Centralized exercise database for gym workouts
export type MuscleGroup = 
  | 'chest' 
  | 'back' 
  | 'shoulders' 
  | 'biceps' 
  | 'triceps' 
  | 'quadriceps' 
  | 'hamstrings' 
  | 'glutes' 
  | 'calves' 
  | 'core' 
  | 'full-body';

export type EquipmentType = 'barbell' | 'dumbbell' | 'cable' | 'machine' | 'bodyweight' | 'kettlebell' | 'resistance-band';

export type ExerciseDifficulty = 'beginner' | 'intermediate' | 'advanced';

export interface ExerciseDefinition {
  id: string;
  name: string;
  primaryMuscle: MuscleGroup;
  secondaryMuscles: MuscleGroup[];
  equipment: EquipmentType[];
  difficulty: ExerciseDifficulty;
  description: string;
  defaultSets: number;
  defaultReps: string; // Can be "8-12" or "30s" for time-based
  canAnalyze: boolean; // Whether pose detection can analyze this exercise
}

// Complete exercise library
export const exerciseLibrary: ExerciseDefinition[] = [
  // CHEST
  {
    id: 'bench-press',
    name: 'Bench Press',
    primaryMuscle: 'chest',
    secondaryMuscles: ['triceps', 'shoulders'],
    equipment: ['barbell', 'dumbbell'],
    difficulty: 'beginner',
    description: 'Lie on bench, lower bar to chest, press up',
    defaultSets: 4,
    defaultReps: '8-12',
    canAnalyze: true,
  },
  {
    id: 'incline-bench-press',
    name: 'Incline Bench Press',
    primaryMuscle: 'chest',
    secondaryMuscles: ['shoulders', 'triceps'],
    equipment: ['barbell', 'dumbbell'],
    difficulty: 'beginner',
    description: 'Press from inclined bench position',
    defaultSets: 3,
    defaultReps: '8-12',
    canAnalyze: true,
  },
  {
    id: 'dumbbell-fly',
    name: 'Dumbbell Fly',
    primaryMuscle: 'chest',
    secondaryMuscles: [],
    equipment: ['dumbbell'],
    difficulty: 'beginner',
    description: 'Arc dumbbells from extended position to chest',
    defaultSets: 3,
    defaultReps: '12-15',
    canAnalyze: false,
  },
  {
    id: 'push-up',
    name: 'Push-ups',
    primaryMuscle: 'chest',
    secondaryMuscles: ['triceps', 'shoulders', 'core'],
    equipment: ['bodyweight'],
    difficulty: 'beginner',
    description: 'Classic push-up from floor',
    defaultSets: 3,
    defaultReps: '15-20',
    canAnalyze: true,
  },
  {
    id: 'cable-crossover',
    name: 'Cable Crossover',
    primaryMuscle: 'chest',
    secondaryMuscles: [],
    equipment: ['cable'],
    difficulty: 'intermediate',
    description: 'Cross cables in front of body for chest isolation',
    defaultSets: 3,
    defaultReps: '12-15',
    canAnalyze: false,
  },
  {
    id: 'dips',
    name: 'Dips',
    primaryMuscle: 'chest',
    secondaryMuscles: ['triceps', 'shoulders'],
    equipment: ['bodyweight'],
    difficulty: 'intermediate',
    description: 'Lower body on parallel bars, press up',
    defaultSets: 3,
    defaultReps: '8-12',
    canAnalyze: true,
  },

  // BACK
  {
    id: 'lat-pulldown',
    name: 'Lat Pulldown',
    primaryMuscle: 'back',
    secondaryMuscles: ['biceps'],
    equipment: ['cable', 'machine'],
    difficulty: 'beginner',
    description: 'Pull bar down to upper chest',
    defaultSets: 4,
    defaultReps: '10-12',
    canAnalyze: true,
  },
  {
    id: 'barbell-row',
    name: 'Barbell Row',
    primaryMuscle: 'back',
    secondaryMuscles: ['biceps', 'core'],
    equipment: ['barbell'],
    difficulty: 'intermediate',
    description: 'Bent over, row bar to lower chest',
    defaultSets: 4,
    defaultReps: '8-10',
    canAnalyze: true,
  },
  {
    id: 'dumbbell-row',
    name: 'Dumbbell Row',
    primaryMuscle: 'back',
    secondaryMuscles: ['biceps'],
    equipment: ['dumbbell'],
    difficulty: 'beginner',
    description: 'Single-arm row with knee on bench',
    defaultSets: 3,
    defaultReps: '10-12',
    canAnalyze: true,
  },
  {
    id: 'pull-up',
    name: 'Pull-ups',
    primaryMuscle: 'back',
    secondaryMuscles: ['biceps'],
    equipment: ['bodyweight'],
    difficulty: 'intermediate',
    description: 'Pull body up until chin clears bar',
    defaultSets: 3,
    defaultReps: '6-10',
    canAnalyze: true,
  },
  {
    id: 'deadlift',
    name: 'Deadlift',
    primaryMuscle: 'back',
    secondaryMuscles: ['hamstrings', 'glutes', 'core'],
    equipment: ['barbell'],
    difficulty: 'intermediate',
    description: 'Lift bar from floor to hip height',
    defaultSets: 4,
    defaultReps: '5-8',
    canAnalyze: true,
  },
  {
    id: 'seated-cable-row',
    name: 'Seated Cable Row',
    primaryMuscle: 'back',
    secondaryMuscles: ['biceps'],
    equipment: ['cable', 'machine'],
    difficulty: 'beginner',
    description: 'Pull cable handle to torso while seated',
    defaultSets: 3,
    defaultReps: '10-12',
    canAnalyze: false,
  },

  // SHOULDERS
  {
    id: 'overhead-press',
    name: 'Overhead Press',
    primaryMuscle: 'shoulders',
    secondaryMuscles: ['triceps', 'core'],
    equipment: ['barbell', 'dumbbell'],
    difficulty: 'beginner',
    description: 'Press weight overhead from shoulders',
    defaultSets: 4,
    defaultReps: '8-10',
    canAnalyze: true,
  },
  {
    id: 'lateral-raise',
    name: 'Lateral Raise',
    primaryMuscle: 'shoulders',
    secondaryMuscles: [],
    equipment: ['dumbbell', 'cable'],
    difficulty: 'beginner',
    description: 'Raise arms to sides until parallel to floor',
    defaultSets: 3,
    defaultReps: '12-15',
    canAnalyze: true,
  },
  {
    id: 'face-pull',
    name: 'Face Pulls',
    primaryMuscle: 'shoulders',
    secondaryMuscles: ['back'],
    equipment: ['cable'],
    difficulty: 'beginner',
    description: 'Pull rope to face, external rotation',
    defaultSets: 3,
    defaultReps: '15-20',
    canAnalyze: false,
  },
  {
    id: 'front-raise',
    name: 'Front Raise',
    primaryMuscle: 'shoulders',
    secondaryMuscles: [],
    equipment: ['dumbbell'],
    difficulty: 'beginner',
    description: 'Raise arms forward until parallel to floor',
    defaultSets: 3,
    defaultReps: '12-15',
    canAnalyze: true,
  },
  {
    id: 'arnold-press',
    name: 'Arnold Press',
    primaryMuscle: 'shoulders',
    secondaryMuscles: ['triceps'],
    equipment: ['dumbbell'],
    difficulty: 'intermediate',
    description: 'Rotating overhead press',
    defaultSets: 3,
    defaultReps: '10-12',
    canAnalyze: false,
  },

  // BICEPS
  {
    id: 'bicep-curl',
    name: 'Bicep Curls',
    primaryMuscle: 'biceps',
    secondaryMuscles: [],
    equipment: ['dumbbell', 'barbell', 'cable'],
    difficulty: 'beginner',
    description: 'Curl weight from extended arm to shoulder',
    defaultSets: 3,
    defaultReps: '10-12',
    canAnalyze: true,
  },
  {
    id: 'hammer-curl',
    name: 'Hammer Curls',
    primaryMuscle: 'biceps',
    secondaryMuscles: [],
    equipment: ['dumbbell'],
    difficulty: 'beginner',
    description: 'Neutral grip curls',
    defaultSets: 3,
    defaultReps: '10-12',
    canAnalyze: true,
  },
  {
    id: 'preacher-curl',
    name: 'Preacher Curls',
    primaryMuscle: 'biceps',
    secondaryMuscles: [],
    equipment: ['barbell', 'dumbbell', 'machine'],
    difficulty: 'beginner',
    description: 'Curls on preacher bench for isolation',
    defaultSets: 3,
    defaultReps: '10-12',
    canAnalyze: false,
  },

  // TRICEPS
  {
    id: 'tricep-pushdown',
    name: 'Tricep Pushdown',
    primaryMuscle: 'triceps',
    secondaryMuscles: [],
    equipment: ['cable'],
    difficulty: 'beginner',
    description: 'Push cable down from elbow-bent position',
    defaultSets: 3,
    defaultReps: '12-15',
    canAnalyze: false,
  },
  {
    id: 'skull-crusher',
    name: 'Skull Crushers',
    primaryMuscle: 'triceps',
    secondaryMuscles: [],
    equipment: ['barbell', 'dumbbell'],
    difficulty: 'intermediate',
    description: 'Lower weight to forehead, extend',
    defaultSets: 3,
    defaultReps: '10-12',
    canAnalyze: false,
  },
  {
    id: 'overhead-tricep-extension',
    name: 'Overhead Tricep Extension',
    primaryMuscle: 'triceps',
    secondaryMuscles: [],
    equipment: ['dumbbell', 'cable'],
    difficulty: 'beginner',
    description: 'Extend weight overhead from behind head',
    defaultSets: 3,
    defaultReps: '10-12',
    canAnalyze: false,
  },
  {
    id: 'close-grip-bench',
    name: 'Close-Grip Bench Press',
    primaryMuscle: 'triceps',
    secondaryMuscles: ['chest'],
    equipment: ['barbell'],
    difficulty: 'intermediate',
    description: 'Narrow grip bench press',
    defaultSets: 3,
    defaultReps: '8-10',
    canAnalyze: true,
  },

  // QUADRICEPS
  {
    id: 'squat',
    name: 'Barbell Squat',
    primaryMuscle: 'quadriceps',
    secondaryMuscles: ['glutes', 'hamstrings', 'core'],
    equipment: ['barbell'],
    difficulty: 'intermediate',
    description: 'Back squat with barbell on shoulders',
    defaultSets: 4,
    defaultReps: '6-10',
    canAnalyze: true,
  },
  {
    id: 'goblet-squat',
    name: 'Goblet Squat',
    primaryMuscle: 'quadriceps',
    secondaryMuscles: ['glutes', 'core'],
    equipment: ['dumbbell', 'kettlebell'],
    difficulty: 'beginner',
    description: 'Squat holding weight at chest',
    defaultSets: 3,
    defaultReps: '10-12',
    canAnalyze: true,
  },
  {
    id: 'leg-press',
    name: 'Leg Press',
    primaryMuscle: 'quadriceps',
    secondaryMuscles: ['glutes', 'hamstrings'],
    equipment: ['machine'],
    difficulty: 'beginner',
    description: 'Press weight away using legs on machine',
    defaultSets: 4,
    defaultReps: '10-12',
    canAnalyze: false,
  },
  {
    id: 'lunge',
    name: 'Lunges',
    primaryMuscle: 'quadriceps',
    secondaryMuscles: ['glutes', 'hamstrings'],
    equipment: ['bodyweight', 'dumbbell'],
    difficulty: 'beginner',
    description: 'Step forward, lower back knee toward floor',
    defaultSets: 3,
    defaultReps: '10-12 each',
    canAnalyze: true,
  },
  {
    id: 'leg-extension',
    name: 'Leg Extension',
    primaryMuscle: 'quadriceps',
    secondaryMuscles: [],
    equipment: ['machine'],
    difficulty: 'beginner',
    description: 'Extend legs against resistance',
    defaultSets: 3,
    defaultReps: '12-15',
    canAnalyze: false,
  },
  {
    id: 'bulgarian-split-squat',
    name: 'Bulgarian Split Squat',
    primaryMuscle: 'quadriceps',
    secondaryMuscles: ['glutes', 'hamstrings'],
    equipment: ['dumbbell', 'bodyweight'],
    difficulty: 'intermediate',
    description: 'Single leg squat with rear foot elevated',
    defaultSets: 3,
    defaultReps: '8-10 each',
    canAnalyze: true,
  },

  // HAMSTRINGS
  {
    id: 'romanian-deadlift',
    name: 'Romanian Deadlift',
    primaryMuscle: 'hamstrings',
    secondaryMuscles: ['glutes', 'back'],
    equipment: ['barbell', 'dumbbell'],
    difficulty: 'intermediate',
    description: 'Hip hinge with slight knee bend',
    defaultSets: 4,
    defaultReps: '8-10',
    canAnalyze: true,
  },
  {
    id: 'leg-curl',
    name: 'Leg Curl',
    primaryMuscle: 'hamstrings',
    secondaryMuscles: [],
    equipment: ['machine'],
    difficulty: 'beginner',
    description: 'Curl legs against resistance',
    defaultSets: 3,
    defaultReps: '12-15',
    canAnalyze: false,
  },
  {
    id: 'good-morning',
    name: 'Good Mornings',
    primaryMuscle: 'hamstrings',
    secondaryMuscles: ['back', 'glutes'],
    equipment: ['barbell'],
    difficulty: 'advanced',
    description: 'Hinge at hips with bar on back',
    defaultSets: 3,
    defaultReps: '8-10',
    canAnalyze: true,
  },

  // GLUTES
  {
    id: 'hip-thrust',
    name: 'Hip Thrust',
    primaryMuscle: 'glutes',
    secondaryMuscles: ['hamstrings'],
    equipment: ['barbell', 'bodyweight'],
    difficulty: 'beginner',
    description: 'Thrust hips up with back on bench',
    defaultSets: 4,
    defaultReps: '10-12',
    canAnalyze: true,
  },
  {
    id: 'glute-bridge',
    name: 'Glute Bridge',
    primaryMuscle: 'glutes',
    secondaryMuscles: ['hamstrings'],
    equipment: ['bodyweight'],
    difficulty: 'beginner',
    description: 'Lift hips from floor',
    defaultSets: 3,
    defaultReps: '15-20',
    canAnalyze: true,
  },
  {
    id: 'cable-kickback',
    name: 'Cable Kickback',
    primaryMuscle: 'glutes',
    secondaryMuscles: [],
    equipment: ['cable'],
    difficulty: 'beginner',
    description: 'Kick leg back against cable resistance',
    defaultSets: 3,
    defaultReps: '12-15 each',
    canAnalyze: false,
  },

  // CALVES
  {
    id: 'standing-calf-raise',
    name: 'Standing Calf Raise',
    primaryMuscle: 'calves',
    secondaryMuscles: [],
    equipment: ['machine', 'bodyweight'],
    difficulty: 'beginner',
    description: 'Rise onto toes against resistance',
    defaultSets: 4,
    defaultReps: '15-20',
    canAnalyze: true,
  },
  {
    id: 'seated-calf-raise',
    name: 'Seated Calf Raise',
    primaryMuscle: 'calves',
    secondaryMuscles: [],
    equipment: ['machine'],
    difficulty: 'beginner',
    description: 'Calf raise while seated',
    defaultSets: 3,
    defaultReps: '15-20',
    canAnalyze: false,
  },

  // CORE
  {
    id: 'plank',
    name: 'Plank',
    primaryMuscle: 'core',
    secondaryMuscles: ['shoulders'],
    equipment: ['bodyweight'],
    difficulty: 'beginner',
    description: 'Hold body in straight line on forearms',
    defaultSets: 3,
    defaultReps: '30-60s',
    canAnalyze: true,
  },
  {
    id: 'russian-twist',
    name: 'Russian Twist',
    primaryMuscle: 'core',
    secondaryMuscles: [],
    equipment: ['bodyweight', 'dumbbell'],
    difficulty: 'beginner',
    description: 'Rotate torso side to side',
    defaultSets: 3,
    defaultReps: '20',
    canAnalyze: true,
  },
  {
    id: 'cable-crunch',
    name: 'Cable Crunch',
    primaryMuscle: 'core',
    secondaryMuscles: [],
    equipment: ['cable'],
    difficulty: 'beginner',
    description: 'Crunch down against cable resistance',
    defaultSets: 3,
    defaultReps: '15-20',
    canAnalyze: false,
  },
  {
    id: 'hanging-leg-raise',
    name: 'Hanging Leg Raise',
    primaryMuscle: 'core',
    secondaryMuscles: [],
    equipment: ['bodyweight'],
    difficulty: 'intermediate',
    description: 'Raise legs while hanging from bar',
    defaultSets: 3,
    defaultReps: '10-15',
    canAnalyze: true,
  },
  {
    id: 'dead-bug',
    name: 'Dead Bug',
    primaryMuscle: 'core',
    secondaryMuscles: [],
    equipment: ['bodyweight'],
    difficulty: 'beginner',
    description: 'Alternate arm/leg extensions while supine',
    defaultSets: 3,
    defaultReps: '10 each side',
    canAnalyze: true,
  },
  {
    id: 'mountain-climber',
    name: 'Mountain Climbers',
    primaryMuscle: 'core',
    secondaryMuscles: ['shoulders', 'quadriceps'],
    equipment: ['bodyweight'],
    difficulty: 'beginner',
    description: 'Alternate driving knees to chest in plank',
    defaultSets: 3,
    defaultReps: '30s',
    canAnalyze: true,
  },

  // FULL BODY / COMPOUND
  {
    id: 'burpee',
    name: 'Burpees',
    primaryMuscle: 'full-body',
    secondaryMuscles: [],
    equipment: ['bodyweight'],
    difficulty: 'intermediate',
    description: 'Squat thrust with push-up and jump',
    defaultSets: 3,
    defaultReps: '10-15',
    canAnalyze: false,
  },
  {
    id: 'kettlebell-swing',
    name: 'Kettlebell Swing',
    primaryMuscle: 'full-body',
    secondaryMuscles: ['glutes', 'hamstrings', 'core'],
    equipment: ['kettlebell'],
    difficulty: 'intermediate',
    description: 'Hip hinge swing with kettlebell',
    defaultSets: 3,
    defaultReps: '15-20',
    canAnalyze: true,
  },
  {
    id: 'clean-and-press',
    name: 'Clean and Press',
    primaryMuscle: 'full-body',
    secondaryMuscles: ['shoulders', 'back', 'core'],
    equipment: ['barbell', 'dumbbell'],
    difficulty: 'advanced',
    description: 'Clean weight to shoulders, then press overhead',
    defaultSets: 4,
    defaultReps: '5-8',
    canAnalyze: false,
  },
];

// Get exercises by muscle group
export function getExercisesByMuscle(muscle: MuscleGroup): ExerciseDefinition[] {
  return exerciseLibrary.filter(ex => 
    ex.primaryMuscle === muscle || ex.secondaryMuscles.includes(muscle)
  );
}

// Get exercises by equipment
export function getExercisesByEquipment(equipment: EquipmentType[]): ExerciseDefinition[] {
  return exerciseLibrary.filter(ex => 
    ex.equipment.some(e => equipment.includes(e))
  );
}

// Get exercises by difficulty
export function getExercisesByDifficulty(difficulty: ExerciseDifficulty): ExerciseDefinition[] {
  return exerciseLibrary.filter(ex => ex.difficulty === difficulty);
}

// Get exercises that can be analyzed with pose detection
export function getAnalyzableExercises(): ExerciseDefinition[] {
  return exerciseLibrary.filter(ex => ex.canAnalyze);
}

// Map equipment setting to available equipment types
export function getAvailableEquipment(setting: 'full-gym' | 'home-gym' | 'minimal'): EquipmentType[] {
  switch (setting) {
    case 'full-gym':
      return ['barbell', 'dumbbell', 'cable', 'machine', 'bodyweight', 'kettlebell', 'resistance-band'];
    case 'home-gym':
      return ['dumbbell', 'bodyweight', 'kettlebell', 'resistance-band'];
    case 'minimal':
      return ['bodyweight', 'resistance-band'];
  }
}

// Get exercise by ID
export function getExerciseById(id: string): ExerciseDefinition | undefined {
  return exerciseLibrary.find(ex => ex.id === id);
}
