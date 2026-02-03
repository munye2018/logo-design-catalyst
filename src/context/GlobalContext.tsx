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
