'use client';

import { useState, useEffect } from 'react';
import { MetricCard } from './metric-card';
import { Thermometer, Droplets, Wind, Sun, Leaf, Atom } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { SensorData } from '@/types';
import { useTranslation } from '@/hooks/use-translation';
import { format } from 'date-fns';

const initialData: SensorData = {
  soilMoisture: 45.2,
  lightLevel: 98,
  gasLevel: 29,
  temperature: 32.1,
  humidity: 74.0,
  nitrogen: 150,
  phosphorus: 50,
  potassium: 100,
  timestamp: Date.now(),
};

export default function RealTimeMetrics() {
  const [data, setData] = useState<SensorData>(initialData);
  const { t } = useTranslation();

  useEffect(() => {
    const interval = setInterval(() => {
      setData((prevData) => ({
        soilMoisture: parseFloat((prevData.soilMoisture + (Math.random() - 0.5)).toFixed(1)),
        temperature: parseFloat((prevData.temperature + (Math.random() - 0.5) * 0.2).toFixed(1)),
        humidity: parseFloat((prevData.humidity + (Math.random() - 0.5)).toFixed(1)),
        nitrogen: Math.round(prevData.nitrogen + (Math.random() - 0.5) * 2),
        phosphorus: Math.round(prevData.phosphorus + (Math.random() - 0.5) * 1),
        potassium: Math.round(prevData.potassium + (Math.random() - 0.5) * 1.5),
        lightLevel: 98,
        gasLevel: 29,
        timestamp: Date.now(),
      }));
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <MetricCard
        title={t('soil_moisture')}
        value={data.soilMoisture}
        unit="%"
        icon={<Droplets className="h-4 w-4" />}
      />
      <MetricCard
        title={t('temperature')}
        value={data.temperature}
        unit="°C"
        icon={<Thermometer className="h-4 w-4" />}
      />
      <MetricCard
        title={t('humidity')}
        value={data.humidity}
        unit="%"
        icon={<Wind className="h-4 w-4" />}
      />
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">NPK Ratio</CardTitle>
            <Leaf className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold font-headline">
                {data.nitrogen}:{data.phosphorus}:{data.potassium}
            </div>
            <p className="text-xs text-muted-foreground">mg/kg</p>
        </CardContent>
      </Card>
    </>
  );
}
