import { createContext, PropsWithChildren, useContext, useState, useCallback, useEffect } from 'react';
import { generateProgram, type Week, type TrainingSession, type Exercise, type ExerciseLog } from '@/lib/programGenerator';
import { 
  safeGetItem, 
  safeSetItem, 
  safeRemoveItem, 
  isValidProfile, 
  isValidWorkoutHistory,
  isObject,
  isArray,
  trimWorkoutHistory 
} from '@/lib/storage';
import type { ExerciseDefinition } from '@/lib/exerciseLibrary';

// Re-export Week as WeeklyProgram for syncService compatibility
export type WeeklyProgram = Week;

export interface PoseKeypoint {
  x: number;
  y: number;
  score: number;
  name: string;
}

export interface AnalysisFeedback {
  id: string;
  message: string;
  severity: 'info' | 'warning' | 'error';
  bodyPart: string;
  timestamp: number;
}

// Workout history types
export interface WorkoutHistoryEntry {
  id: string;
  date: number; // timestamp
  weekNumber: number;
  sessionName: string;
  sessionType: string;
  exercises: Array<{
    name: string;
    sets: number;
    reps: number;
    weight?: number;
    difficulty: 'easy' | 'moderate' | 'hard';
  }>;
  totalVolume: number;
  duration?: number;
}

export interface WorkoutStats {
  totalWorkouts: number;
  currentStreak: number;
  weeklyVolume: number;
}

// New gym-focused types
export type FitnessGoal = 'muscle' | 'weight-loss' | 'strength' | 'general';
export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';
export type TrainingDays = 2 | 3 | 4 | 5 | 6;
export type Equipment = 'full-gym' | 'home-gym' | 'minimal';

interface GlobalContextProps {
  // User profile - gym focused
  fitnessGoal: FitnessGoal;
  setFitnessGoal: (goal: FitnessGoal) => void;
  experienceLevel: ExperienceLevel;
  setExperienceLevel: (level: ExperienceLevel) => void;
  trainingDays: TrainingDays;
  setTrainingDays: (days: TrainingDays) => void;
  equipment: Equipment;
  setEquipment: (equipment: Equipment) => void;
  
  // Program state
  program: Week[] | null;
  setProgram: (program: Week[] | null) => void;
  currentWeek: number;
  setCurrentWeek: (week: number) => void;
  currentSession: number;
  setCurrentSession: (session: number) => void;
  
  // Progress tracking
  completedSessions: Record<string, boolean>;
  markSessionComplete: (weekId: number, sessionId: number) => void;
  exerciseLogs: Record<string, ExerciseLog>;
  logExercise: (exerciseKey: string, log: ExerciseLog) => void;
  
  // Workout history
  workoutHistory: WorkoutHistoryEntry[];
  addWorkoutToHistory: (entry: Omit<WorkoutHistoryEntry, 'id' | 'date'>) => void;
  getWorkoutStats: () => WorkoutStats;
  
  // Analysis state
  isAnalyzing: boolean;
  setIsAnalyzing: (analyzing: boolean) => void;
  currentPose: PoseKeypoint[] | null;
  setCurrentPose: (pose: PoseKeypoint[] | null) => void;
  feedbackHistory: AnalysisFeedback[];
  addFeedback: (feedback: Omit<AnalysisFeedback, 'id' | 'timestamp'>) => void;
  clearFeedback: () => void;
  
  // Actions
  generateUserProgram: () => void;
  onboardingComplete: boolean;
  setOnboardingComplete: (complete: boolean) => void;
  resetProgress: () => void;
  
  // Exercise customization
  swapExercise: (weekIndex: number, sessionIndex: number, exerciseIndex: number, newExercise: ExerciseDefinition) => void;
}

const GlobalContext = createContext<GlobalContextProps | null>(null);

// LocalStorage keys
const STORAGE_KEYS = {
  profile: 'aurora_profile',
  program: 'aurora_program',
  completedSessions: 'aurora_completed_sessions',
  exerciseLogs: 'aurora_exercise_logs',
  onboardingComplete: 'aurora_onboarding_complete',
  currentWeek: 'aurora_current_week',
  workoutHistory: 'aurora_workout_history',
};

export const GlobalProvider = ({ children }: PropsWithChildren) => {
  // Load profile once and extract all values
  const savedProfile = safeGetItem(STORAGE_KEYS.profile, {}, isValidProfile);
  
  // User profile state - gym focused with safe localStorage parsing
  const [fitnessGoal, setFitnessGoal] = useState<FitnessGoal>(() => {
    const value = savedProfile.fitnessGoal;
    if (value && ['muscle', 'weight-loss', 'strength', 'general'].includes(value)) {
      return value as FitnessGoal;
    }
    return 'general';
  });
  
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>(() => {
    const value = savedProfile.experienceLevel;
    if (value && ['beginner', 'intermediate', 'advanced'].includes(value)) {
      return value as ExperienceLevel;
    }
    return 'beginner';
  });
  
  const [trainingDays, setTrainingDays] = useState<TrainingDays>(() => {
    const value = savedProfile.trainingDays;
    if (typeof value === 'number' && [2, 3, 4, 5, 6].includes(value)) {
      return value as TrainingDays;
    }
    return 3;
  });
  
  const [equipment, setEquipment] = useState<Equipment>(() => {
    const value = savedProfile.equipment;
    if (value && ['full-gym', 'home-gym', 'minimal'].includes(value)) {
      return value as Equipment;
    }
    return 'full-gym';
  });
  
  // Program state with safe parsing
  const [program, setProgram] = useState<Week[] | null>(() => {
    return safeGetItem<Week[] | null>(STORAGE_KEYS.program, null, (v): v is Week[] | null => 
      v === null || isArray(v)
    );
  });
  
  const [currentWeek, setCurrentWeek] = useState<number>(() => {
    const saved = safeGetItem(STORAGE_KEYS.currentWeek, '0');
    const parsed = parseInt(String(saved), 10);
    return isNaN(parsed) ? 0 : parsed;
  });
  
  const [currentSession, setCurrentSession] = useState<number>(0);
  
  const [onboardingComplete, setOnboardingComplete] = useState<boolean>(() => {
    const saved = safeGetItem<string | boolean>(STORAGE_KEYS.onboardingComplete, false);
    return saved === 'true' || saved === true;
  });
  
  // Progress tracking with safe parsing (no strict validator - accept any object structure)
  const [completedSessions, setCompletedSessions] = useState<Record<string, boolean>>(() => {
    return safeGetItem<Record<string, boolean>>(STORAGE_KEYS.completedSessions, {});
  });
  
  const [exerciseLogs, setExerciseLogs] = useState<Record<string, ExerciseLog>>(() => {
    return safeGetItem<Record<string, ExerciseLog>>(STORAGE_KEYS.exerciseLogs, {});
  });
  
  // Workout history state with safe parsing and size limit
  const [workoutHistory, setWorkoutHistory] = useState<WorkoutHistoryEntry[]>(() => {
    const history = safeGetItem<WorkoutHistoryEntry[]>(
      STORAGE_KEYS.workoutHistory, 
      [], 
      isValidWorkoutHistory
    );
    // Trim to max entries on load
    return trimWorkoutHistory(history);
  });
  
  // Analysis state
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [currentPose, setCurrentPose] = useState<PoseKeypoint[] | null>(null);
  const [feedbackHistory, setFeedbackHistory] = useState<AnalysisFeedback[]>([]);

  // Persist profile changes with safe storage
  useEffect(() => {
    safeSetItem(STORAGE_KEYS.profile, {
      fitnessGoal,
      experienceLevel,
      trainingDays,
      equipment,
    });
  }, [fitnessGoal, experienceLevel, trainingDays, equipment]);

  // Persist program with safe storage
  useEffect(() => {
    if (program) {
      safeSetItem(STORAGE_KEYS.program, program);
    }
  }, [program]);

  // Persist current week with safe storage
  useEffect(() => {
    safeSetItem(STORAGE_KEYS.currentWeek, currentWeek.toString());
  }, [currentWeek]);

  // Persist onboarding with safe storage
  useEffect(() => {
    safeSetItem(STORAGE_KEYS.onboardingComplete, onboardingComplete.toString());
  }, [onboardingComplete]);

  // Persist completed sessions with safe storage
  useEffect(() => {
    safeSetItem(STORAGE_KEYS.completedSessions, completedSessions);
  }, [completedSessions]);

  // Persist exercise logs with safe storage
  useEffect(() => {
    safeSetItem(STORAGE_KEYS.exerciseLogs, exerciseLogs);
  }, [exerciseLogs]);

  // Persist workout history with safe storage and size limit
  useEffect(() => {
    const trimmed = trimWorkoutHistory(workoutHistory);
    safeSetItem(STORAGE_KEYS.workoutHistory, trimmed);
  }, [workoutHistory]);

  const markSessionComplete = useCallback((weekId: number, sessionId: number) => {
    const key = `${weekId}-${sessionId}`;
    setCompletedSessions(prev => ({ ...prev, [key]: true }));
    
    // Also update the program state
    setProgram(prev => {
      if (!prev) return prev;
      const updated = [...prev];
      if (updated[weekId] && updated[weekId].sessions[sessionId]) {
        updated[weekId].sessions[sessionId].completed = true;
      }
      return updated;
    });
  }, []);

  const logExercise = useCallback((exerciseKey: string, log: ExerciseLog) => {
    setExerciseLogs(prev => ({ ...prev, [exerciseKey]: log }));
  }, []);

  const addWorkoutToHistory = useCallback((entry: Omit<WorkoutHistoryEntry, 'id' | 'date'>) => {
    const newEntry: WorkoutHistoryEntry = {
      ...entry,
      id: crypto.randomUUID(),
      date: Date.now(),
    };
    setWorkoutHistory(prev => [...prev, newEntry]);
  }, []);

  const getWorkoutStats = useCallback((): WorkoutStats => {
    const now = Date.now();
    const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;
    const oneDayMs = 24 * 60 * 60 * 1000;
    
    // Calculate weekly volume
    const weeklyVolume = workoutHistory
      .filter(w => w.date >= oneWeekAgo)
      .reduce((sum, w) => sum + w.totalVolume, 0);
    
    // Calculate streak - count consecutive days with workouts
    let currentStreak = 0;
    if (workoutHistory.length > 0) {
      const sortedDates = [...new Set(
        workoutHistory.map(w => new Date(w.date).toDateString())
      )].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
      
      const today = new Date().toDateString();
      const yesterday = new Date(now - oneDayMs).toDateString();
      
      // Check if most recent workout was today or yesterday
      if (sortedDates[0] === today || sortedDates[0] === yesterday) {
        currentStreak = 1;
        for (let i = 1; i < sortedDates.length; i++) {
          const prevDate = new Date(sortedDates[i - 1]).getTime();
          const currDate = new Date(sortedDates[i]).getTime();
          if (prevDate - currDate <= oneDayMs * 1.5) {
            currentStreak++;
          } else {
            break;
          }
        }
      }
    }
    
    return {
      totalWorkouts: workoutHistory.length,
      currentStreak,
      weeklyVolume,
    };
  }, [workoutHistory]);

  const addFeedback = useCallback((feedback: Omit<AnalysisFeedback, 'id' | 'timestamp'>) => {
    const newFeedback: AnalysisFeedback = {
      ...feedback,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    };
    setFeedbackHistory(prev => [...prev.slice(-9), newFeedback]);
  }, []);

  const clearFeedback = useCallback(() => {
    setFeedbackHistory([]);
  }, []);

  const generateUserProgram = useCallback(() => {
    const newProgram = generateProgram({
      fitnessGoal,
      experienceLevel,
      trainingDays,
      equipment,
    });
    setProgram(newProgram);
    setCurrentWeek(0);
    setCompletedSessions({});
    setExerciseLogs({});
  }, [fitnessGoal, experienceLevel, trainingDays, equipment]);

  const resetProgress = useCallback(() => {
    setCompletedSessions({});
    setExerciseLogs({});
    setCurrentWeek(0);
    safeRemoveItem(STORAGE_KEYS.completedSessions);
    safeRemoveItem(STORAGE_KEYS.exerciseLogs);
  }, []);

  const swapExercise = useCallback((
    weekIndex: number, 
    sessionIndex: number, 
    exerciseIndex: number, 
    newExercise: ExerciseDefinition
  ) => {
    setProgram(prev => {
      if (!prev) return prev;
      const updated = [...prev];
      if (updated[weekIndex] && updated[weekIndex].sessions[sessionIndex]) {
        const exercises = [...updated[weekIndex].sessions[sessionIndex].exercises];
        const oldExercise = exercises[exerciseIndex];
        exercises[exerciseIndex] = {
          ...oldExercise,
          exerciseId: newExercise.id,
          name: newExercise.name,
          details: newExercise.description,
          sets: newExercise.defaultSets,
          reps: newExercise.defaultReps,
        };
        updated[weekIndex].sessions[sessionIndex].exercises = exercises;
      }
      return updated;
    });
  }, []);

  return (
    <GlobalContext.Provider value={{
      fitnessGoal,
      setFitnessGoal,
      experienceLevel,
      setExperienceLevel,
      trainingDays,
      setTrainingDays,
      equipment,
      setEquipment,
      program,
      setProgram,
      currentWeek,
      setCurrentWeek,
      currentSession,
      setCurrentSession,
      completedSessions,
      markSessionComplete,
      exerciseLogs,
      logExercise,
      workoutHistory,
      addWorkoutToHistory,
      getWorkoutStats,
      isAnalyzing,
      setIsAnalyzing,
      currentPose,
      setCurrentPose,
      feedbackHistory,
      addFeedback,
      clearFeedback,
      generateUserProgram,
      onboardingComplete,
      setOnboardingComplete,
      resetProgress,
      swapExercise,
    }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error('useGlobalContext must be used within a GlobalProvider');
  }
  return context;
};
