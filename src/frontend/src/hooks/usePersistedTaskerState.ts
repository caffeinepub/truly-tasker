import { useState, useEffect } from 'react';
import { TaskerState, PomodoroSettings, ThemeSettings, Task } from '../state/taskerTypes';
import { STORAGE_KEYS } from '../utils/storageKeys';
import { generateTaskId } from '../utils/id';

const DEFAULT_POMODORO: PomodoroSettings = {
  focusDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  currentMode: 'focus',
  isRunning: false,
  remainingSeconds: 25 * 60,
  selectedTaskId: undefined
};

const DEFAULT_THEME: ThemeSettings = {
  mode: 'light',
  backgroundType: 'default'
};

const DEFAULT_STATE: TaskerState = {
  days: [],
  pomodoro: DEFAULT_POMODORO,
  theme: DEFAULT_THEME
};

// Normalize a single task to ensure all fields are valid and have an ID
function normalizeTask(task: any): Task {
  return {
    id: task.id || generateTaskId(),
    subject: task.subject || 'Science',
    chapter: task.chapter || '',
    type: task.type || 'Revision',
    priority: task.priority || 'High',
    reward: task.reward || '',
    xp: task.xp || '',
    done: task.done === true,
    notes: task.notes && typeof task.notes === 'string' && task.notes.trim() ? task.notes.trim() : undefined,
    pomodoroCompletions: Array.isArray(task.pomodoroCompletions) ? task.pomodoroCompletions : []
  };
}

function loadState(): TaskerState {
  try {
    // Try loading from current storage key
    const stored = localStorage.getItem(STORAGE_KEYS.CURRENT);
    if (stored) {
      const parsed = JSON.parse(stored);
      
      // Normalize all tasks to ensure they have IDs and valid fields
      const normalizedDays = (parsed.days || []).map((day: any) => ({
        ...day,
        tasks: (day.tasks || []).map(normalizeTask)
      }));
      
      // Get all task IDs for validation
      const allTaskIds = new Set<string>();
      normalizedDays.forEach((day: any) => {
        day.tasks.forEach((task: Task) => {
          allTaskIds.add(task.id);
        });
      });
      
      // Sanitize selectedTaskId if it doesn't match any existing task
      const selectedTaskId = parsed.pomodoro?.selectedTaskId;
      const validSelectedTaskId = selectedTaskId && allTaskIds.has(selectedTaskId) ? selectedTaskId : undefined;
      
      return {
        days: normalizedDays,
        pomodoro: {
          ...DEFAULT_POMODORO,
          ...(parsed.pomodoro || {}),
          selectedTaskId: validSelectedTaskId
        },
        theme: parsed.theme || DEFAULT_THEME,
        lastVisitDay: parsed.lastVisitDay,
        engagementStreak: parsed.engagementStreak ?? 0
      };
    }

    // Try loading from all known legacy storage keys
    for (const legacyKey of STORAGE_KEYS.LEGACY_KEYS) {
      const legacy = localStorage.getItem(legacyKey);
      if (legacy) {
        const parsed = JSON.parse(legacy);
        
        // Normalize all legacy tasks
        const normalizedDays = (parsed.days || []).map((day: any) => ({
          ...day,
          tasks: (day.tasks || []).map(normalizeTask)
        }));
        
        // Get all task IDs for validation
        const allTaskIds = new Set<string>();
        normalizedDays.forEach((day: any) => {
          day.tasks.forEach((task: Task) => {
            allTaskIds.add(task.id);
          });
        });
        
        // Sanitize selectedTaskId if it doesn't match any existing task
        const selectedTaskId = parsed.pomodoro?.selectedTaskId;
        const validSelectedTaskId = selectedTaskId && allTaskIds.has(selectedTaskId) ? selectedTaskId : undefined;
        
        const migratedState: TaskerState = {
          days: normalizedDays,
          pomodoro: {
            ...DEFAULT_POMODORO,
            ...(parsed.pomodoro || {}),
            selectedTaskId: validSelectedTaskId
          },
          theme: parsed.theme || DEFAULT_THEME,
          lastVisitDay: parsed.lastVisitDay,
          engagementStreak: parsed.engagementStreak ?? 0
        };
        
        // Save to new key and remove legacy
        localStorage.setItem(STORAGE_KEYS.CURRENT, JSON.stringify(migratedState));
        localStorage.removeItem(legacyKey);
        
        return migratedState;
      }
    }

    return DEFAULT_STATE;
  } catch (error) {
    console.error('Failed to load state:', error);
    return DEFAULT_STATE;
  }
}

export function usePersistedTaskerState() {
  const [state, setState] = useState<TaskerState>(loadState);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENT, JSON.stringify(state));
    } catch (error) {
      console.error('Failed to save state:', error);
    }
  }, [state]);

  return [state, setState] as const;
}
