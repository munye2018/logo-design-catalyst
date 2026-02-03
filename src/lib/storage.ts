/**
 * Safe localStorage utility with error handling, validation, and quota management
 */

const MAX_HISTORY_ENTRIES = 365; // Keep max 1 year of workout history
const STORAGE_WARNING_THRESHOLD = 0.8; // Warn at 80% capacity

// Check if we can store data (quota check)
function canStoreData(testData: string): boolean {
  try {
    const testKey = '__storage_quota_test__';
    localStorage.setItem(testKey, testData);
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
}

// Estimate current localStorage usage
function getStorageUsage(): { used: number; total: number; percentage: number } {
  let total = 0;
  for (const key in localStorage) {
    if (Object.prototype.hasOwnProperty.call(localStorage, key)) {
      total += localStorage.getItem(key)?.length || 0;
    }
  }
  // Most browsers have 5MB limit
  const estimatedTotal = 5 * 1024 * 1024;
  return {
    used: total,
    total: estimatedTotal,
    percentage: total / estimatedTotal,
  };
}

/**
 * Safely parse JSON from localStorage with error handling
 * @param key - localStorage key
 * @param defaultValue - Default value if parsing fails or key doesn't exist
 * @param validator - Optional validation function to ensure data structure is correct
 */
export function safeGetItem<T>(
  key: string,
  defaultValue: T,
  validator?: (data: unknown) => data is T
): T {
  try {
    const saved = localStorage.getItem(key);
    if (saved === null) {
      return defaultValue;
    }
    
    const parsed = JSON.parse(saved);
    
    // If a validator is provided, use it to verify the data structure
    if (validator) {
      if (validator(parsed)) {
        return parsed;
      } else {
        console.warn(`[Storage] Invalid data structure for key "${key}", using default`);
        return defaultValue;
      }
    }
    
    // Basic type check for primitive types
    if (typeof defaultValue === typeof parsed) {
      return parsed as T;
    }
    
    // For objects and arrays, do a basic structure check
    if (typeof defaultValue === 'object' && typeof parsed === 'object') {
      return parsed as T;
    }
    
    return defaultValue;
  } catch (error) {
    // Log error only in development
    if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') {
      console.error(`[Storage] Failed to parse localStorage key "${key}":`, error);
    }
    return defaultValue;
  }
}

/**
 * Safely set an item in localStorage with error handling and quota management
 * @param key - localStorage key
 * @param value - Value to store (will be JSON stringified)
 * @returns boolean indicating success
 */
export function safeSetItem(key: string, value: unknown): boolean {
  try {
    const stringified = JSON.stringify(value);
    
    // Check if we can store this data
    if (!canStoreData(stringified)) {
      console.warn(`[Storage] Quota exceeded when trying to save key "${key}"`);
      return false;
    }
    
    localStorage.setItem(key, stringified);
    
    return true;
  } catch (error) {
    console.warn(`[Storage] Failed to save localStorage key "${key}"`);
    return false;
  }
}

/**
 * Safely remove an item from localStorage
 * @param key - localStorage key
 */
export function safeRemoveItem(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    // Silently fail - removal errors are not critical
  }
}

// Type guards for validation
export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value);
}

export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

// Specific validators for app data types
export function isValidFitnessGoal(value: unknown): value is 'muscle' | 'weight-loss' | 'strength' | 'general' {
  return typeof value === 'string' && ['muscle', 'weight-loss', 'strength', 'general'].includes(value);
}

export function isValidExperienceLevel(value: unknown): value is 'beginner' | 'intermediate' | 'advanced' {
  return typeof value === 'string' && ['beginner', 'intermediate', 'advanced'].includes(value);
}

export function isValidTrainingDays(value: unknown): value is 2 | 3 | 4 | 5 | 6 {
  return typeof value === 'number' && [2, 3, 4, 5, 6].includes(value);
}

export function isValidEquipment(value: unknown): value is 'full-gym' | 'home-gym' | 'minimal' {
  return typeof value === 'string' && ['full-gym', 'home-gym', 'minimal'].includes(value);
}

export function isValidProfile(value: unknown): value is {
  fitnessGoal?: string;
  experienceLevel?: string;
  trainingDays?: number;
  equipment?: string;
} {
  return isObject(value);
}

export function isValidWorkoutHistory(value: unknown): value is Array<{
  id: string;
  date: number;
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
}> {
  if (!isArray(value)) return false;
  // Basic validation - check first few items
  return value.every((item) => {
    if (!isObject(item)) return false;
    const obj = item as Record<string, unknown>;
    return typeof obj.id === 'string' && 
           typeof obj.date === 'number' &&
           typeof obj.sessionName === 'string';
  });
}

/**
 * Trim workout history to maintain reasonable size
 * Keeps the most recent entries up to MAX_HISTORY_ENTRIES
 */
export function trimWorkoutHistory<T extends { date: number }>(history: T[]): T[] {
  if (history.length <= MAX_HISTORY_ENTRIES) {
    return history;
  }
  
  // Sort by date descending and keep most recent
  const sorted = [...history].sort((a, b) => b.date - a.date);
  return sorted.slice(0, MAX_HISTORY_ENTRIES);
}

export { MAX_HISTORY_ENTRIES, getStorageUsage };
