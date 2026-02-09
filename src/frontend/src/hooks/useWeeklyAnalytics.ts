import { useMemo } from 'react';
import { useTasker } from '../state/TaskerProvider';
import { Subject } from '../state/taskerTypes';

interface DailyData {
  day: string;
  completed: number;
  total: number;
}

interface SubjectBreakdown {
  subject: Subject;
  completed: number;
  total: number;
}

export function useWeeklyAnalytics() {
  const { state } = useTasker();

  return useMemo(() => {
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 7);

    const weekDays = state.days.filter(day => {
      const dayDate = new Date(day.date);
      return dayDate >= weekStart && dayDate < weekEnd;
    });

    const totalTasks = weekDays.reduce((sum, day) => sum + day.tasks.length, 0);
    const completedTasks = weekDays.reduce(
      (sum, day) => sum + day.tasks.filter(t => t.done).length,
      0
    );
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const dailyData: DailyData[] = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);
      
      const dayData = weekDays.find(d => {
        const dDate = new Date(d.date);
        return dDate.toDateString() === date.toDateString();
      });

      dailyData.push({
        day: dayNames[i],
        completed: dayData ? dayData.tasks.filter(t => t.done).length : 0,
        total: dayData ? dayData.tasks.length : 0
      });
    }

    const subjectMap = new Map<Subject, { completed: number; total: number }>();
    weekDays.forEach(day => {
      day.tasks.forEach(task => {
        const current = subjectMap.get(task.subject) || { completed: 0, total: 0 };
        subjectMap.set(task.subject, {
          completed: current.completed + (task.done ? 1 : 0),
          total: current.total + 1
        });
      });
    });

    const subjectBreakdown: SubjectBreakdown[] = Array.from(subjectMap.entries())
      .map(([subject, data]) => ({ subject, ...data }))
      .sort((a, b) => b.total - a.total);

    return {
      totalTasks,
      completedTasks,
      completionRate,
      dailyData,
      subjectBreakdown
    };
  }, [state.days]);
}
