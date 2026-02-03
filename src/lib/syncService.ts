import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';
import type { 
  FitnessGoal, 
  ExperienceLevel, 
  TrainingDays, 
  Equipment,
  WorkoutHistoryEntry,
  WeeklyProgram
} from '@/context/GlobalContext';

// Types for cloud data
interface CloudUserProfile {
  fitness_goal: string;
  experience_level: string;
  training_days: number;
  equipment: string;
}

interface CloudWorkoutEntry {
  id: string;
  session_name: string;
  session_type: string | null;
  week_number: number;
  exercises: unknown;
  total_volume: number;
  duration: number | null;
  completed_at: string;
}

interface CloudUserProgram {
  program_data: unknown;
  current_week: number;
  completed_sessions: Record<string, boolean>;
}

// Sync user profile to cloud
export async function syncUserProfile(
  userId: string,
  profile: {
    fitnessGoal: FitnessGoal;
    experienceLevel: ExperienceLevel;
    trainingDays: TrainingDays;
    equipment: Equipment;
  }
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('user_profiles')
      .upsert({
        user_id: userId,
        fitness_goal: profile.fitnessGoal,
        experience_level: profile.experienceLevel,
        training_days: profile.trainingDays,
        equipment: profile.equipment,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' });

    if (error) {
      logger.error('Failed to sync user profile:', error);
      return false;
    }
    
    logger.debug('User profile synced successfully');
    return true;
  } catch (err) {
    logger.error('Error syncing user profile:', err);
    return false;
  }
}

// Sync workout history entry to cloud
export async function syncWorkoutEntry(
  userId: string,
  entry: WorkoutHistoryEntry
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('workout_history')
      .upsert({
        id: entry.id,
        user_id: userId,
        session_name: entry.sessionName,
        session_type: entry.sessionType || null,
        week_number: entry.weekNumber,
        exercises: entry.exercises,
        total_volume: entry.totalVolume,
        duration: entry.duration || null,
        completed_at: new Date(entry.date).toISOString()
      }, { onConflict: 'id' });

    if (error) {
      logger.error('Failed to sync workout entry:', error);
      return false;
    }
    
    logger.debug('Workout entry synced successfully');
    return true;
  } catch (err) {
    logger.error('Error syncing workout entry:', err);
    return false;
  }
}

// Sync program to cloud
export async function syncProgram(
  userId: string,
  program: WeeklyProgram[] | null,
  currentWeek: number,
  completedSessions: Record<string, boolean>
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('user_programs')
      .upsert({
        user_id: userId,
        program_data: program || {},
        current_week: currentWeek,
        completed_sessions: completedSessions
      }, { onConflict: 'user_id' });

    if (error) {
      logger.error('Failed to sync program:', error);
      return false;
    }
    
    logger.debug('Program synced successfully');
    return true;
  } catch (err) {
    logger.error('Error syncing program:', err);
    return false;
  }
}

// Pull all user data from cloud on login
export async function pullFromCloud(userId: string): Promise<{
  profile: CloudUserProfile | null;
  workoutHistory: WorkoutHistoryEntry[];
  program: CloudUserProgram | null;
}> {
  try {
    // Fetch all data in parallel
    const [profileResult, workoutsResult, programResult] = await Promise.all([
      supabase.from('user_profiles').select('*').eq('user_id', userId).maybeSingle(),
      supabase.from('workout_history').select('*').eq('user_id', userId).order('completed_at', { ascending: false }),
      supabase.from('user_programs').select('*').eq('user_id', userId).maybeSingle()
    ]);

    // Transform workout history
    const workoutHistory: WorkoutHistoryEntry[] = (workoutsResult.data || []).map((w: CloudWorkoutEntry) => ({
      id: w.id,
      date: new Date(w.completed_at).getTime(),
      weekNumber: w.week_number,
      sessionName: w.session_name,
      sessionType: w.session_type || 'custom',
      exercises: Array.isArray(w.exercises) ? w.exercises : [],
      totalVolume: w.total_volume,
      duration: w.duration || undefined
    }));

    logger.debug('Pulled data from cloud:', {
      hasProfile: !!profileResult.data,
      workoutCount: workoutHistory.length,
      hasProgram: !!programResult.data
    });

    return {
      profile: profileResult.data as CloudUserProfile | null,
      workoutHistory,
      program: programResult.data as CloudUserProgram | null
    };
  } catch (err) {
    logger.error('Error pulling from cloud:', err);
    return { profile: null, workoutHistory: [], program: null };
  }
}

// Push all local data to cloud (used after login when local data exists)
export async function pushLocalDataToCloud(
  userId: string,
  data: {
    profile: {
      fitnessGoal: FitnessGoal;
      experienceLevel: ExperienceLevel;
      trainingDays: TrainingDays;
      equipment: Equipment;
    };
    workoutHistory: WorkoutHistoryEntry[];
    program: WeeklyProgram[] | null;
    currentWeek: number;
    completedSessions: Record<string, boolean>;
  }
): Promise<boolean> {
  try {
    // Sync profile
    await syncUserProfile(userId, data.profile);
    
    // Sync all workout entries
    for (const entry of data.workoutHistory) {
      await syncWorkoutEntry(userId, entry);
    }
    
    // Sync program
    await syncProgram(userId, data.program, data.currentWeek, data.completedSessions);
    
    logger.debug('Pushed all local data to cloud');
    return true;
  } catch (err) {
    logger.error('Error pushing local data to cloud:', err);
    return false;
  }
}
