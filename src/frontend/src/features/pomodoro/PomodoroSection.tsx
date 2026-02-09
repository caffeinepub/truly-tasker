import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, RotateCcw, ListTodo, X } from 'lucide-react';
import { usePomodoroTimer } from '../../hooks/usePomodoroTimer';
import { useTasker } from '../../state/TaskerProvider';

export function PomodoroSection() {
  const { state, updatePomodoro, getSelectedTask, getAllTasks } = useTasker();
  const { displayTime, start, pause, reset } = usePomodoroTimer();
  const [isTaskPickerOpen, setIsTaskPickerOpen] = useState(false);
  
  const selectedTask = getSelectedTask();
  const allTasks = getAllTasks();

  const handleModeChange = (mode: 'focus' | 'shortBreak' | 'longBreak') => {
    let duration: number;
    switch (mode) {
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
      currentMode: mode, 
      remainingSeconds: duration * 60,
      isRunning: false
    });
  };

  const handleDurationChange = (field: 'focusDuration' | 'shortBreakDuration' | 'longBreakDuration', value: string) => {
    const num = parseInt(value) || 0;
    if (num > 0 && num <= 180) {
      updatePomodoro({ [field]: num });
      
      if (
        (field === 'focusDuration' && state.pomodoro.currentMode === 'focus') ||
        (field === 'shortBreakDuration' && state.pomodoro.currentMode === 'shortBreak') ||
        (field === 'longBreakDuration' && state.pomodoro.currentMode === 'longBreak')
      ) {
        updatePomodoro({ remainingSeconds: num * 60 });
      }
    }
  };

  const handleSelectTask = (taskId: string) => {
    updatePomodoro({ selectedTaskId: taskId });
    setIsTaskPickerOpen(false);
  };

  const handleClearTask = () => {
    updatePomodoro({ selectedTaskId: undefined });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Pomodoro Timer</h1>
        <p className="text-muted-foreground">Stay focused with customizable work and break intervals</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Timer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Tabs value={state.pomodoro.currentMode} onValueChange={(v) => handleModeChange(v as any)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="focus">Focus</TabsTrigger>
                <TabsTrigger value="shortBreak">Short Break</TabsTrigger>
                <TabsTrigger value="longBreak">Long Break</TabsTrigger>
              </TabsList>
            </Tabs>

            {selectedTask && (
              <div className="flex items-center gap-2 p-3 rounded-lg border bg-muted/50">
                <ListTodo className="w-4 h-4 text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {selectedTask.subject}
                    {selectedTask.chapter && ` – ${selectedTask.chapter}`}
                  </p>
                  <p className="text-xs text-muted-foreground">{selectedTask.type}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 shrink-0"
                  onClick={handleClearTask}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            )}

            <div className="text-center space-y-6">
              <div className="text-7xl font-bold tracking-tight tabular-nums">
                {displayTime}
              </div>

              <div className="flex justify-center gap-3">
                {!state.pomodoro.isRunning ? (
                  <Button onClick={start} size="lg" className="gap-2">
                    <Play className="w-5 h-5" />
                    Start
                  </Button>
                ) : (
                  <Button onClick={pause} size="lg" variant="secondary" className="gap-2">
                    <Pause className="w-5 h-5" />
                    Pause
                  </Button>
                )}
                
                <Button onClick={reset} size="lg" variant="outline" className="gap-2">
                  <RotateCcw className="w-5 h-5" />
                  Reset
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Task for this session</Label>
              <Dialog open={isTaskPickerOpen} onOpenChange={setIsTaskPickerOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <ListTodo className="w-4 h-4" />
                    {selectedTask 
                      ? `${selectedTask.subject}${selectedTask.chapter ? ` – ${selectedTask.chapter}` : ''}`
                      : 'Choose a task'
                    }
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Select Task</DialogTitle>
                  </DialogHeader>
                  <ScrollArea className="max-h-[400px] pr-4">
                    {allTasks.length > 0 ? (
                      <div className="space-y-2">
                        {allTasks.map(({ task, dayIndex, taskIndex }) => (
                          <button
                            key={task.id}
                            onClick={() => handleSelectTask(task.id)}
                            className={`w-full text-left p-3 rounded-lg border transition-colors hover:bg-accent ${
                              task.id === state.pomodoro.selectedTaskId ? 'bg-accent border-primary' : ''
                            }`}
                          >
                            <div className="flex items-start gap-2">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <p className="font-medium">
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
                                <p className="text-xs text-muted-foreground mt-1">{task.type}</p>
                                {task.pomodoroCompletions && task.pomodoroCompletions.length > 0 && (
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {task.pomodoroCompletions.length} session{task.pomodoroCompletions.length !== 1 ? 's' : ''} completed
                                  </p>
                                )}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <p>No tasks yet. Add a task first.</p>
                      </div>
                    )}
                  </ScrollArea>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-2">
              <Label htmlFor="focus-duration">Focus Duration (minutes)</Label>
              <Input
                id="focus-duration"
                type="number"
                min="1"
                max="180"
                value={state.pomodoro.focusDuration}
                onChange={(e) => handleDurationChange('focusDuration', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="short-break-duration">Short Break Duration (minutes)</Label>
              <Input
                id="short-break-duration"
                type="number"
                min="1"
                max="180"
                value={state.pomodoro.shortBreakDuration}
                onChange={(e) => handleDurationChange('shortBreakDuration', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="long-break-duration">Long Break Duration (minutes)</Label>
              <Input
                id="long-break-duration"
                type="number"
                min="1"
                max="180"
                value={state.pomodoro.longBreakDuration}
                onChange={(e) => handleDurationChange('longBreakDuration', e.target.value)}
              />
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Customize your work and break intervals to match your productivity style. 
                The classic Pomodoro technique uses 25-minute focus sessions with 5-minute short breaks.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
