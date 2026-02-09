import { useEffect, useRef } from 'react';
import { useTasker } from '../state/TaskerProvider';

export function usePomodoroTimer() {
  const { state, updatePomodoro, logPomodoroCompletion } = useTasker();
  const intervalRef = useRef<number | null>(null);
  const completionLoggedRef = useRef<boolean>(false);

  useEffect(() => {
    if (state.pomodoro.isRunning) {
      intervalRef.current = window.setInterval(() => {
        const newRemaining = state.pomodoro.remainingSeconds - 1;
        
        if (newRemaining <= 0) {
          updatePomodoro({
            isRunning: false,
            remainingSeconds: 0
          });
        } else {
          updatePomodoro({
            remainingSeconds: newRemaining
          });
        }
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [state.pomodoro.isRunning, state.pomodoro.remainingSeconds, updatePomodoro]);

  // Log completion when focus timer reaches 0
  useEffect(() => {
    if (
      state.pomodoro.remainingSeconds === 0 &&
      !state.pomodoro.isRunning &&
      state.pomodoro.currentMode === 'focus' &&
      state.pomodoro.selectedTaskId &&
      !completionLoggedRef.current
    ) {
      // Log the completion
      logPomodoroCompletion(state.pomodoro.selectedTaskId, {
        timestamp: Date.now(),
        duration: state.pomodoro.focusDuration,
        mode: 'focus'
      });
      
      completionLoggedRef.current = true;
    }
    
    // Reset the flag when timer is reset or started again
    if (state.pomodoro.remainingSeconds > 0 || state.pomodoro.isRunning) {
      completionLoggedRef.current = false;
    }
  }, [
    state.pomodoro.remainingSeconds,
    state.pomodoro.isRunning,
    state.pomodoro.currentMode,
    state.pomodoro.selectedTaskId,
    state.pomodoro.focusDuration,
    logPomodoroCompletion
  ]);

  const start = () => {
    updatePomodoro({ isRunning: true });
  };

  const pause = () => {
    updatePomodoro({ isRunning: false });
  };

  const reset = () => {
    let duration: number;
    switch (state.pomodoro.currentMode) {
      case 'focus':
        duration = state.pomodoro.focusDuration;
        break;
      case 'shortBreak':
        duration = state.pomodoro.shortBreakDuration;
        break;
      case 'longBreak':
        duration = state.pomodoro.longBreakDuration;
        break;
    }
    updatePomodoro({ 
      isRunning: false, 
      remainingSeconds: duration * 60 
    });
  };

  const minutes = Math.floor(state.pomodoro.remainingSeconds / 60);
  const seconds = state.pomodoro.remainingSeconds % 60;
  const displayTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return {
    displayTime,
    start,
    pause,
    reset
  };
}
