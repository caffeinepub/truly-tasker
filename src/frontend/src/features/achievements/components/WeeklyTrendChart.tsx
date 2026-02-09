import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DailyData {
  day: string;
  completed: number;
  total: number;
}

interface WeeklyTrendChartProps {
  data: DailyData[];
}

export function WeeklyTrendChart({ data }: WeeklyTrendChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="oklch(var(--border))" />
        <XAxis 
          dataKey="day" 
          stroke="oklch(var(--muted-foreground))"
          style={{ fontSize: '12px' }}
        />
        <YAxis 
          stroke="oklch(var(--muted-foreground))"
          style={{ fontSize: '12px' }}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'oklch(var(--card))',
            border: '1px solid oklch(var(--border))',
            borderRadius: '8px'
          }}
        />
        <Bar dataKey="completed" fill="oklch(var(--chart-1))" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
