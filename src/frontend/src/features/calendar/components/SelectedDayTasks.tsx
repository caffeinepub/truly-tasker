import { StudyDay } from '../../../state/taskerTypes';
import { useTasker } from '../../../state/TaskerProvider';
import { TaskForm } from '../../dashboard/components/TaskForm';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { calculateDayProgress } from '../../../utils/taskerLogic';

interface SelectedDayTasksProps {
  dayIndex: number;
  day: StudyDay;
}

export function SelectedDayTasks({ dayIndex, day }: SelectedDayTasksProps) {
  const { toggleTask, deleteTask } = useTasker();
  const progress = calculateDayProgress(day);

  return (
    <div className="space-y-4">
      {day.tasks.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}

      <TaskForm dayIndex={dayIndex} />

      {day.tasks.length > 0 ? (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {day.tasks.map((task, taskIndex) => (
            <div
              key={task.id}
              className={`flex items-start gap-3 p-3 rounded-lg border bg-card transition-opacity ${
                task.done ? 'opacity-60' : ''
              }`}
            >
              <Checkbox
                checked={task.done}
                onCheckedChange={() => toggleTask(dayIndex, taskIndex)}
                className="mt-1"
              />
              
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className={`font-medium ${task.done ? 'line-through' : ''}`}>
                    {task.subject}
                    {task.chapter && ` – ${task.chapter}`}
                  </p>
                  <Badge 
                    variant={
                      task.priority === 'High' 
                        ? 'destructive' 
                        : task.priority === 'Moderate' 
                        ? 'default' 
                        : 'secondary'
                    }
                    className="text-xs"
                  >
                    {task.priority}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                  <span>{task.type}</span>
                  {task.reward && <span>Reward: {task.reward}</span>}
                  {task.xp && <span>XP: {task.xp}</span>}
                </div>
                
                {task.notes && (
                  <p className="text-sm text-muted-foreground mt-1 italic">
                    Note: {task.notes}
                  </p>
                )}
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteTask(dayIndex, taskIndex)}
                className="shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground py-8">
          No tasks yet. Add your first task above.
        </p>
      )}
    </div>
  );
}
