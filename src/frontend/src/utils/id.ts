/**
 * Generate a stable unique identifier for tasks.
 * Uses crypto.randomUUID when available, with a fallback for older browsers.
 */
export function generateTaskId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  
  // Fallback: timestamp + random string
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}
