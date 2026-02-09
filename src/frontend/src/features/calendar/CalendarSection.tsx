import { useState } from 'react';
import { useTasker } from '../../state/TaskerProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { SelectedDayTasks } from './components/SelectedDayTasks';
import { formatDate } from '../../utils/taskerLogic';

export function CalendarSection() {
  const { getDayByDate, createDayForDate } = useTasker();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  const dayData = getDayByDate(selectedDate);

  const handleCreateDay = () => {
    createDayForDate(selectedDate);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
        <p className="text-muted-foreground">View and manage tasks by date</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Select Date</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Tasks for {formatDate(selectedDate)}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {dayData ? `${dayData.day.tasks.length} task${dayData.day.tasks.length !== 1 ? 's' : ''}` : 'No tasks scheduled'}
                </p>
              </div>
              {!dayData && (
                <Button onClick={handleCreateDay} size="sm" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Create Day
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {dayData ? (
              <SelectedDayTasks dayIndex={dayData.index} day={dayData.day} />
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center mb-4">
                  <Plus className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground mb-4">
                  No study day scheduled for this date
                </p>
                <Button onClick={handleCreateDay} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Create Study Day
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
