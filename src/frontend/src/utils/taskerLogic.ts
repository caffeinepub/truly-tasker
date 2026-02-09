import { StudyDay, Task } from '../state/taskerTypes';

const PRIORITY_RANK = { High: 1, Moderate: 2, Low: 3 };

export function sortTasksByPriority(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority]);
}

export function calculateDayProgress(day: StudyDay): number {
  if (day.tasks.length === 0) return 0;
  
  // Calculate XP-based progress
  let totalXP = 0;
  let completedXP = 0;
  
  for (const task of day.tasks) {
    // Safely parse XP value, defaulting to 0 for invalid values
    const xpValue = parseFloat(task.xp) || 0;
    totalXP += xpValue;
    if (task.done) {
      completedXP += xpValue;
    }
  }
  
  // If no XP values, fall back to simple task count
  if (totalXP === 0) {
    const completedCount = day.tasks.filter(t => t.done).length;
    return (completedCount / day.tasks.length) * 100;
  }
  
  return (completedXP / totalXP) * 100;
}

export function getNextDate(days: StudyDay[]): Date {
  if (days.length === 0) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  }
  
  const lastDate = new Date(days[days.length - 1].date);
  const nextDate = new Date(lastDate);
  nextDate.setDate(nextDate.getDate() + 1);
  nextDate.setHours(0, 0, 0, 0);
  return nextDate;
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}

export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

/**
 * Get current date in IST timezone as YYYY-MM-DD string
 */
function getISTDateString(): string {
  const now = new Date();
  const istFormatter = new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  
  const parts = istFormatter.formatToParts(now);
  const year = parts.find(p => p.type === 'year')?.value || '';
  const month = parts.find(p => p.type === 'month')?.value || '';
  const day = parts.find(p => p.type === 'day')?.value || '';
  
  return `${year}-${month}-${day}`;
}

/**
 * Get yesterday's date in IST timezone as YYYY-MM-DD string
 */
function getISTYesterdayString(): string {
  const now = new Date();
  // Subtract one day in milliseconds
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  
  const istFormatter = new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  
  const parts = istFormatter.formatToParts(yesterday);
  const year = parts.find(p => p.type === 'year')?.value || '';
  const month = parts.find(p => p.type === 'month')?.value || '';
  const day = parts.find(p => p.type === 'day')?.value || '';
  
  return `${year}-${month}-${day}`;
}

export function updateEngagementStreak(
  lastVisitDay: string | undefined,
  currentStreak: number
): { newStreak: number; todayString: string } {
  const todayString = getISTDateString();
  
  if (!lastVisitDay) {
    return { newStreak: 1, todayString };
  }
  
  // If last visit was today (same IST date), keep current streak
  if (lastVisitDay === todayString) {
    return { newStreak: currentStreak, todayString };
  }
  
  const yesterdayString = getISTYesterdayString();
  
  // If last visit was yesterday (IST), increment streak
  if (lastVisitDay === yesterdayString) {
    return { newStreak: currentStreak + 1, todayString };
  }
  
  // Otherwise, reset streak to 1
  return { newStreak: 1, todayString };
}
