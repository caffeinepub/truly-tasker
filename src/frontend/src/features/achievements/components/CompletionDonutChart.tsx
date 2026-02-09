import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface CompletionDonutChartProps {
  completed: number;
  pending: number;
}

export function CompletionDonutChart({ completed, pending }: CompletionDonutChartProps) {
  const data = [
    { name: 'Completed', value: completed },
    { name: 'Pending', value: pending }
  ];

  const COLORS = ['oklch(var(--chart-1))', 'oklch(var(--chart-2))'];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={5}
          dataKey="value"
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'oklch(var(--card))',
            border: '1px solid oklch(var(--border))',
            borderRadius: '8px'
          }}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
