import { useTasker } from '../../state/TaskerProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Plus, RotateCcw, Flame } from 'lucide-react';
import { DayCard } from './components/DayCard';

export function DashboardSection() {
  const { state, addDay, resetAll } = useTasker();
  const streak = state.engagementStreak ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Manage your study days and tasks</p>
        </div>
        
        <div className="flex gap-3">
          <Button onClick={addDay} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Study Day
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <RotateCcw className="w-4 h-4" />
                Reset
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete all your study days and tasks.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={resetAll}>Delete Everything</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {streak > 0 && (
        <Card className="bg-gradient-to-r from-chart-1/10 to-chart-2/10 border-chart-1/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-chart-1/20 rounded-full">
                <Flame className="w-6 h-6 text-chart-1" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Current Streak</p>
                <p className="text-2xl font-bold">{streak} {streak === 1 ? 'day' : 'days'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {state.days.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="max-w-md mx-auto space-y-4">
              <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                <Plus className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold">No study days yet</h3>
              <p className="text-muted-foreground">
                Get started by adding your first study day and organizing your tasks.
              </p>
              <Button onClick={addDay} className="gap-2">
                <Plus className="w-4 h-4" />
                Add Your First Day
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {state.days.map((day, index) => (
            <DayCard key={index} day={day} dayIndex={index} dayNumber={index + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
