/**
 * Development-only logging utility
 * Logs are completely disabled in production builds
 */

// Check for development mode using Vite's define replacement
const isDev = !!(typeof window !== 'undefined' && (window as any).__DEV__) || 
              (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development');

/**
 * Development-only console.log
 */
export function devLog(...args: unknown[]): void {
  if (isDev) {
    console.log(...args);
  }
}

/**
 * Development-only console.warn
 */
export function devWarn(...args: unknown[]): void {
  if (isDev) {
    console.warn(...args);
  }
}

/**
 * Development-only console.error
 * Note: Consider keeping critical errors in production with sanitized messages
 */
export function devError(...args: unknown[]): void {
  if (isDev) {
    console.error(...args);
  }
}

/**
 * Log an error with a sanitized production message
 * In dev: logs full error details
 * In prod: logs only the user-friendly message (no stack traces or internal details)
 */
export function logError(userMessage: string, error?: unknown): void {
  if (isDev) {
    console.error(userMessage, error);
  } else {
    // In production, only log the safe message without details
    console.error(userMessage);
  }
}

/**
 * Create a namespaced logger for a specific module
 */
export function createLogger(namespace: string) {
  return {
    log: (...args: unknown[]) => devLog(`[${namespace}]`, ...args),
    warn: (...args: unknown[]) => devWarn(`[${namespace}]`, ...args),
    error: (...args: unknown[]) => devError(`[${namespace}]`, ...args),
    logError: (userMessage: string, error?: unknown) => 
      logError(`[${namespace}] ${userMessage}`, error),
  };
}
