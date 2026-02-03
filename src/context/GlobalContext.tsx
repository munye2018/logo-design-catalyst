import { createContext, PropsWithChildren, useContext, useState, useCallback, useEffect } from 'react';
import { generateProgram, type Week, type TrainingSession, type Exercise, type ExerciseLog } from '@/lib/programGenerator';

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
  // User profile state - gym focused
  const [fitnessGoal, setFitnessGoal] = useState<FitnessGoal>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.profile);
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.fitnessGoal || 'general';
    }
    return 'general';
  });
  
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.profile);
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.experienceLevel || 'beginner';
    }
    return 'beginner';
  });
  
  const [trainingDays, setTrainingDays] = useState<TrainingDays>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.profile);
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.trainingDays || 3;
    }
    return 3;
  });
  
  const [equipment, setEquipment] = useState<Equipment>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.profile);
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.equipment || 'full-gym';
    }
    return 'full-gym';
  });
  
  // Program state
  const [program, setProgram] = useState<Week[] | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.program);
    return saved ? JSON.parse(saved) : null;
  });
  
  const [currentWeek, setCurrentWeek] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.currentWeek);
    return saved ? parseInt(saved) : 0;
  });
  
  const [currentSession, setCurrentSession] = useState<number>(0);
  
  const [onboardingComplete, setOnboardingComplete] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.onboardingComplete);
    return saved === 'true';
  });
  
  // Progress tracking
  const [completedSessions, setCompletedSessions] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.completedSessions);
    return saved ? JSON.parse(saved) : {};
  });
  
  const [exerciseLogs, setExerciseLogs] = useState<Record<string, ExerciseLog>>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.exerciseLogs);
    return saved ? JSON.parse(saved) : {};
  });
  
  // Workout history state
  const [workoutHistory, setWorkoutHistory] = useState<WorkoutHistoryEntry[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.workoutHistory);
    return saved ? JSON.parse(saved) : [];
  });
  
  // Analysis state
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [currentPose, setCurrentPose] = useState<PoseKeypoint[] | null>(null);
  const [feedbackHistory, setFeedbackHistory] = useState<AnalysisFeedback[]>([]);

  // Persist profile changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify({
      fitnessGoal,
      experienceLevel,
      trainingDays,
      equipment,
    }));
  }, [fitnessGoal, experienceLevel, trainingDays, equipment]);

  // Persist program
  useEffect(() => {
    if (program) {
      localStorage.setItem(STORAGE_KEYS.program, JSON.stringify(program));
    }
  }, [program]);

  // Persist current week
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.currentWeek, currentWeek.toString());
  }, [currentWeek]);

  // Persist onboarding
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.onboardingComplete, onboardingComplete.toString());
  }, [onboardingComplete]);

  // Persist completed sessions
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.completedSessions, JSON.stringify(completedSessions));
  }, [completedSessions]);

  // Persist exercise logs
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.exerciseLogs, JSON.stringify(exerciseLogs));
  }, [exerciseLogs]);

  // Persist workout history
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.workoutHistory, JSON.stringify(workoutHistory));
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
    localStorage.removeItem(STORAGE_KEYS.completedSessions);
    localStorage.removeItem(STORAGE_KEYS.exerciseLogs);
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
