'use client';

import * as React from 'react';
import { Label, Pie, PieChart, RadialBar, RadialBarChart } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer } from '@/components/ui/chart';
import { useTranslation } from '@/hooks/use-translation';

const chartData = [{ name: 'Moisture', value: 45.2, fill: 'hsl(var(--primary))' }];

export function SoilMoistureGauge() {
  const { t } = useTranslation();
  const chartValue = chartData[0].value;

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle className="font-headline">{t('soil_moisture')}</CardTitle>
        <CardDescription>Optimal range: 40-60%</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex items-center justify-center pb-0">
        <ChartContainer
          config={{
            value: {
              label: t('soil_moisture'),
              color: 'hsl(var(--primary))',
            },
          }}
          className="mx-auto aspect-square w-full max-w-[250px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={-90}
            endAngle={270}
            innerRadius="70%"
            outerRadius="100%"
            barSize={24}
            cy="55%"
          >
            <RadialBar
              dataKey="value"
              background={{ fill: 'hsla(var(--muted))' }}
              cornerRadius={12}
            />
             <Pie
                data={[{ value: 100 }]}
                dataKey="value"
                stroke="none"
                innerRadius={0}
                outerRadius={0}
            >
                <Label
                    content={({ viewBox }) => {
                        if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                            return (
                                <>
                                    <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                                        <tspan
                                            x={viewBox.cx}
                                            y={viewBox.cy}
                                            className="fill-foreground text-4xl font-bold font-headline"
                                        >
                                            {chartValue.toFixed(1)}%
                                        </tspan>
                                    </text>
                                    <text x={viewBox.cx} y={(viewBox.cy || 0) + 24} textAnchor="middle" dominantBaseline="middle">
                                        <tspan
                                            x={viewBox.cx}
                                            y={(viewBox.cy || 0) + 20}
                                            className="fill-muted-foreground text-sm"
                                        >
                                            {chartValue < 40 ? 'Dry' : chartValue > 60 ? 'Wet' : 'Optimal'}
                                        </tspan>
                                    </text>
                                </>

                            )
                        }
                        return null;
                    }}
                />
            </Pie>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
