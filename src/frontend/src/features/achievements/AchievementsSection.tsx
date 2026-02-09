import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CompletionDonutChart } from './components/CompletionDonutChart';
import { WeeklyTrendChart } from './components/WeeklyTrendChart';
import { useWeeklyAnalytics } from '../../hooks/useWeeklyAnalytics';
import { Trophy, TrendingUp, CheckCircle2 } from 'lucide-react';

export function AchievementsSection() {
  const analytics = useWeeklyAnalytics();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Achievements</h1>
        <p className="text-muted-foreground">Track your weekly performance and progress</p>
      </div>

      {analytics.totalTasks === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="max-w-md mx-auto space-y-4">
              <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                <Trophy className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold">No data yet</h3>
              <p className="text-muted-foreground">
                Start adding tasks and completing them to see your weekly analytics and achievements.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-chart-1/20 rounded-full">
                    <CheckCircle2 className="w-6 h-6 text-chart-1" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Tasks Completed</p>
                    <p className="text-2xl font-bold">{analytics.completedTasks}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-chart-2/20 rounded-full">
                    <TrendingUp className="w-6 h-6 text-chart-2" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Completion Rate</p>
                    <p className="text-2xl font-bold">{analytics.completionRate}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-chart-3/20 rounded-full">
                    <Trophy className="w-6 h-6 text-chart-3" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Tasks</p>
                    <p className="text-2xl font-bold">{analytics.totalTasks}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Completion Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <CompletionDonutChart 
                  completed={analytics.completedTasks}
                  pending={analytics.totalTasks - analytics.completedTasks}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Weekly Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <WeeklyTrendChart data={analytics.dailyData} />
              </CardContent>
            </Card>
          </div>

          {analytics.subjectBreakdown.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Subject Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.subjectBreakdown.map((item) => (
                    <div key={item.subject} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{item.subject}</span>
                        <span className="text-muted-foreground">
                          {item.completed} / {item.total} tasks
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-chart-1 transition-all"
                          style={{ width: `${(item.completed / item.total) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
