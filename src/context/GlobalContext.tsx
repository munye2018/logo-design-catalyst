import { createContext, PropsWithChildren, useContext, useState, useCallback } from 'react';
import { generateProgram, type Week, type TrainingSession, type Exercise } from '@/lib/programGenerator';

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

interface GlobalContextProps {
  // User profile
  sex: 'male' | 'female';
  setSex: (sex: 'male' | 'female') => void;
  event: number;
  setEvent: (event: number) => void;
  bestTime: number;
  setBestTime: (time: number) => void;
  programType: 'ongoing' | 'peaking';
  setProgramType: (type: 'ongoing' | 'peaking') => void;
  
  // Program state
  program: Week[] | null;
  setProgram: (program: Week[] | null) => void;
  currentWeek: number;
  setCurrentWeek: (week: number) => void;
  currentSession: number;
  setCurrentSession: (session: number) => void;
  
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
}

const GlobalContext = createContext<GlobalContextProps | null>(null);

export const GlobalProvider = ({ children }: PropsWithChildren) => {
  // User profile state
  const [sex, setSex] = useState<'male' | 'female'>('male');
  const [event, setEvent] = useState<number>(100);
  const [bestTime, setBestTime] = useState<number>(11.5);
  const [programType, setProgramType] = useState<'ongoing' | 'peaking'>('ongoing');
  
  // Program state
  const [program, setProgram] = useState<Week[] | null>(null);
  const [currentWeek, setCurrentWeek] = useState<number>(0);
  const [currentSession, setCurrentSession] = useState<number>(0);
  const [onboardingComplete, setOnboardingComplete] = useState<boolean>(false);
  
  // Analysis state
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [currentPose, setCurrentPose] = useState<PoseKeypoint[] | null>(null);
  const [feedbackHistory, setFeedbackHistory] = useState<AnalysisFeedback[]>([]);

  const addFeedback = useCallback((feedback: Omit<AnalysisFeedback, 'id' | 'timestamp'>) => {
    const newFeedback: AnalysisFeedback = {
      ...feedback,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    };
    setFeedbackHistory(prev => [...prev.slice(-9), newFeedback]); // Keep last 10
  }, []);

  const clearFeedback = useCallback(() => {
    setFeedbackHistory([]);
  }, []);

  const generateUserProgram = useCallback(() => {
    const newProgram = generateProgram(bestTime, event);
    setProgram(newProgram);
  }, [bestTime, event]);

  return (
    <GlobalContext.Provider value={{
      sex,
      setSex,
      event,
      setEvent,
      bestTime,
      setBestTime,
      programType,
      setProgramType,
      program,
      setProgram,
      currentWeek,
      setCurrentWeek,
      currentSession,
      setCurrentSession,
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
