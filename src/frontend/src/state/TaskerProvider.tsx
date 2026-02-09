import { createContext, useContext, ReactNode, useEffect } from 'react';
import { usePersistedTaskerState } from '../hooks/usePersistedTaskerState';
import { TaskerState, StudyDay, Task, PomodoroSettings, ThemeSettings, PomodoroCompletion } from './taskerTypes';
import { getNextDate, sortTasksByPriority, updateEngagementStreak } from '../utils/taskerLogic';
import { generateTaskId } from '../utils/id';

interface TaskerContextValue {
  state: TaskerState;
  addDay: () => void;
  resetAll: () => void;
  toggleDayCollapse: (index: number) => void;
  expandDay: (index: number) => void;
  addTask: (dayIndex: number, task: Omit<Task, 'done' | 'id' | 'pomodoroCompletions'>) => void;
  toggleTask: (dayIndex: number, taskIndex: number) => void;
  deleteTask: (dayIndex: number, taskIndex: number) => void;
  updatePomodoro: (settings: Partial<PomodoroSettings>) => void;
  getDayByDate: (date: Date) => { day: StudyDay; index: number } | null;
  createDayForDate: (date: Date) => void;
  updateTheme: (theme: Partial<ThemeSettings>) => void;
  logPomodoroCompletion: (taskId: string, completion: PomodoroCompletion) => void;
  getSelectedTask: () => Task | null;
  getAllTasks: () => Array<{ task: Task; dayIndex: number; taskIndex: number }>;
}

const TaskerContext = createContext<TaskerContextValue | undefined>(undefined);

const DEFAULT_THEME: ThemeSettings = {
  mode: 'light',
  backgroundType: 'default'
};

// Normalize a task to ensure all fields are valid
function normalizeTask(task: Omit<Task, 'done' | 'id' | 'pomodoroCompletions'>): Omit<Task, 'done' | 'id' | 'pomodoroCompletions'> {
  return {
    subject: task.subject,
    chapter: task.chapter || '',
    type: task.type || 'Revision',
    priority: task.priority || 'High',
    reward: task.reward || '',
    xp: task.xp || '',
    notes: task.notes && task.notes.trim() ? task.notes.trim() : undefined
  };
}

export function TaskerProvider({ children }: { children: ReactNode }) {
  const [state, setState] = usePersistedTaskerState();

  // Update engagement streak on mount
  useEffect(() => {
    const { newStreak, todayString } = updateEngagementStreak(
      state.lastVisitDay,
      state.engagementStreak ?? 0
    );
    
    if (state.lastVisitDay !== todayString || state.engagementStreak !== newStreak) {
      setState(prev => ({
        ...prev,
        lastVisitDay: todayString,
        engagementStreak: newStreak
      }));
    }
  }, []); // Only run once on mount

  const addDay = () => {
    const nextDate = getNextDate(state.days);
    setState(prev => ({
      ...prev,
      days: [...prev.days, { date: nextDate.toISOString(), tasks: [], collapsed: false }]
    }));
  };

  const resetAll = () => {
    if (confirm('Everything will be deleted. Are you sure?')) {
      setState(prev => ({ ...prev, days: [] }));
    }
  };

  const toggleDayCollapse = (index: number) => {
    setState(prev => ({
      ...prev,
      days: prev.days.map((day, i) => 
        i === index ? { ...day, collapsed: !day.collapsed } : day
      )
    }));
  };

  const expandDay = (index: number) => {
    setState(prev => ({
      ...prev,
      days: prev.days.map((day, i) => 
        i === index ? { ...day, collapsed: false } : day
      )
    }));
  };

  const addTask = (dayIndex: number, task: Omit<Task, 'done' | 'id' | 'pomodoroCompletions'>) => {
    const normalizedTask = normalizeTask(task);
    const newTask: Task = {
      ...normalizedTask,
      id: generateTaskId(),
      done: false,
      pomodoroCompletions: []
    };
    
    setState(prev => ({
      ...prev,
      days: prev.days.map((day, i) => {
        if (i === dayIndex) {
          const newTasks = [...day.tasks, newTask];
          return { ...day, tasks: sortTasksByPriority(newTasks) };
        }
        return day;
      })
    }));
  };

  const toggleTask = (dayIndex: number, taskIndex: number) => {
    setState(prev => ({
      ...prev,
      days: prev.days.map((day, i) => {
        if (i === dayIndex) {
          return {
            ...day,
            tasks: day.tasks.map((task, ti) =>
              ti === taskIndex ? { ...task, done: !task.done } : task
            )
          };
        }
        return day;
      })
    }));
  };

  const deleteTask = (dayIndex: number, taskIndex: number) => {
    setState(prev => ({
      ...prev,
      days: prev.days.map((day, i) => {
        if (i === dayIndex) {
          return {
            ...day,
            tasks: day.tasks.filter((_, ti) => ti !== taskIndex)
          };
        }
        return day;
      })
    }));
  };

  const updatePomodoro = (settings: Partial<PomodoroSettings>) => {
    setState(prev => ({
      ...prev,
      pomodoro: { ...prev.pomodoro, ...settings }
    }));
  };

  const getDayByDate = (date: Date): { day: StudyDay; index: number } | null => {
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < state.days.length; i++) {
      const dayDate = new Date(state.days[i].date);
      dayDate.setHours(0, 0, 0, 0);
      
      if (dayDate.getTime() === targetDate.getTime()) {
        return { day: state.days[i], index: i };
      }
    }
    return null;
  };

  const createDayForDate = (date: Date) => {
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    
    setState(prev => ({
      ...prev,
      days: [...prev.days, { date: targetDate.toISOString(), tasks: [], collapsed: false }]
    }));
  };

  const updateTheme = (theme: Partial<ThemeSettings>) => {
    setState(prev => {
      const currentTheme = prev.theme ?? DEFAULT_THEME;
      const newTheme: ThemeSettings = {
        ...currentTheme,
        ...theme
      };
      return {
        ...prev,
        theme: newTheme
      };
    });
  };

  const logPomodoroCompletion = (taskId: string, completion: PomodoroCompletion) => {
    setState(prev => ({
      ...prev,
      days: prev.days.map(day => ({
        ...day,
        tasks: day.tasks.map(task => {
          if (task.id === taskId) {
            return {
              ...task,
              pomodoroCompletions: [
                ...(task.pomodoroCompletions || []),
                completion
              ]
            };
          }
          return task;
        })
      }))
    }));
  };

  const getSelectedTask = (): Task | null => {
    if (!state.pomodoro.selectedTaskId) return null;
    
    for (const day of state.days) {
      const task = day.tasks.find(t => t.id === state.pomodoro.selectedTaskId);
      if (task) return task;
    }
    return null;
  };

  const getAllTasks = (): Array<{ task: Task; dayIndex: number; taskIndex: number }> => {
    const allTasks: Array<{ task: Task; dayIndex: number; taskIndex: number }> = [];
    
    state.days.forEach((day, dayIndex) => {
      day.tasks.forEach((task, taskIndex) => {
        allTasks.push({ task, dayIndex, taskIndex });
      });
    });
    
    return allTasks;
  };

  const value: TaskerContextValue = {
    state,
    addDay,
    resetAll,
    toggleDayCollapse,
    expandDay,
    addTask,
    toggleTask,
    deleteTask,
    updatePomodoro,
    getDayByDate,
    createDayForDate,
    updateTheme,
    logPomodoroCompletion,
    getSelectedTask,
    getAllTasks
  };

  return <TaskerContext.Provider value={value}>{children}</TaskerContext.Provider>;
}

export function useTasker() {
  const context = useContext(TaskerContext);
  if (!context) {
    throw new Error('useTasker must be used within TaskerProvider');
  }
  return context;
}
