import { StudyDay } from '../../../state/taskerTypes';
import { useTasker } from '../../../state/TaskerProvider';
import { calculateDayProgress, formatDate } from '../../../utils/taskerLogic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp, Trash2, Plus } from 'lucide-react';
import { TaskForm } from './TaskForm';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';

interface DayCardProps {
  day: StudyDay;
  dayIndex: number;
  dayNumber: number;
}

export function DayCard({ day, dayIndex, dayNumber }: DayCardProps) {
  const { toggleDayCollapse, toggleTask, deleteTask, expandDay } = useTasker();
  const progress = calculateDayProgress(day);
  const date = new Date(day.date);

  const handleAddTask = () => {
    if (day.collapsed) {
      expandDay(dayIndex);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-xl">Day {dayNumber}</CardTitle>
            <p className="text-sm text-muted-foreground">{formatDate(date)}</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="default" 
              size="sm" 
              className="gap-2"
              onClick={handleAddTask}
            >
              <Plus className="w-4 h-4" />
              Add Task
            </Button>
            
            <Collapsible open={!day.collapsed} onOpenChange={() => toggleDayCollapse(dayIndex)}>
              <CollapsibleTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  {day.collapsed ? (
                    <>
                      <ChevronDown className="w-4 h-4" />
                      Read Less
                    </>
                  ) : (
                    <>
                      <ChevronUp className="w-4 h-4" />
                      Collapse
                    </>
                  )}
                </Button>
              </CollapsibleTrigger>
            </Collapsible>
          </div>
        </div>
        
        {day.tasks.length > 0 && (
          <div className="space-y-2 pt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}
      </CardHeader>

      <Collapsible open={!day.collapsed}>
        <CollapsibleContent>
          <CardContent className="space-y-4">
            <TaskForm dayIndex={dayIndex} />
            
            {day.tasks.length > 0 && (
              <div className="space-y-2">
                {day.tasks.map((task, taskIndex) => (
                  <div
                    key={taskIndex}
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
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
