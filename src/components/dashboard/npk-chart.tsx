'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ReferenceLine } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { useTranslation } from '@/hooks/use-translation';

const chartData = [
  { nutrient: 'Nitrogen', value: 150, idealMin: 120, idealMax: 180 },
  { nutrient: 'Phosphorus', value: 50, idealMin: 40, idealMax: 60 },
  { nutrient: 'Potassium', value: 100, idealMin: 90, idealMax: 120 },
];

const chartConfig = {
  value: {
    label: 'Current Value (mg/kg)',
    color: 'hsl(var(--chart-2))',
  },
  ideal: {
    label: 'Ideal Range',
    color: 'hsl(var(--muted))',
  }
};

export function NpkChart() {
    const { t } = useTranslation();
    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">NPK Levels</CardTitle>
                <CardDescription>Current vs. ideal nutrient ranges.</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="min-h-[150px] w-full">
                    <BarChart data={chartData} layout="vertical" margin={{ left: 10, right: 10 }}>
                        <CartesianGrid horizontal={false} />
                        <XAxis type="number" dataKey="value" hide />
                        <YAxis 
                          dataKey="nutrient" 
                          type="category"
                          tickLine={false}
                          axisLine={false}
                          tickMargin={10}
                          width={80}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="line" />}
                        />
                         <Bar dataKey="value" radius={5} barSize={24} name="Current">
                            {chartData.map((entry, index) => {
                                let color;
                                if (entry.value < entry.idealMin || entry.value > entry.idealMax) {
                                    color = "hsl(var(--destructive))"; // Deficient or Surplus
                                } else {
                                    color = "hsl(var(--primary))"; // Optimal
                                }
                                return <Bar key={`cell-${index}`} fill={color} />;
                            })}
                        </Bar>
                         <ReferenceLine
                            x={120}
                            strokeDasharray="3 3"
                            stroke="hsl(var(--border))"
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
