'use client';

import {
  Line,
  LineChart as RechartsLineChart,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { useTranslation } from '@/hooks/use-translation';

const chartData = [
  { time: '00:00', temperature: 28, moisture: 55 },
  { time: '04:00', temperature: 27, moisture: 58 },
  { time: '08:00', temperature: 30, moisture: 52 },
  { time: '12:00', temperature: 34, moisture: 45 },
  { time: '16:00', temperature: 33, moisture: 42 },
  { time: '20:00', temperature: 30, moisture: 48 },
  { time: '24:00', temperature: 29, moisture: 50 },
];

export function DataChart() {
    const { t } = useTranslation();
    
    const chartConfig = {
      temperature: {
        label: `${t('temperature')} (°C)`,
        color: 'hsl(var(--primary))',
      },
      moisture: {
        label: `${t('soil_moisture')} (%)`,
        color: 'hsl(var(--accent))',
      },
    } satisfies ChartConfig;

  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <RechartsLineChart data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="time"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <YAxis
          yAxisId="left"
          stroke="hsl(var(--primary))"
          tickLine={false}
          axisLine={false}
        />
         <YAxis
          yAxisId="right"
          orientation="right"
          stroke="hsl(var(--accent))"
          tickLine={false}
          axisLine={false}
        />
        <Tooltip content={<ChartTooltipContent />} />
        <Line
          dataKey="temperature"
          type="monotone"
          stroke="var(--color-temperature)"
          strokeWidth={2}
          yAxisId="left"
        />
        <Line
          dataKey="moisture"
          type="monotone"
          stroke="var(--color-moisture)"
          strokeWidth={2}
          yAxisId="right"
        />
      </RechartsLineChart>
    </ChartContainer>
  );
}
