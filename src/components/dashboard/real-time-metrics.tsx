'use client';

import { useState, useEffect } from 'react';
import { MetricCard } from './metric-card';
import { Thermometer, Wind, Droplets, Mountain, Leaf } from 'lucide-react';
import type { SensorData } from '@/types';
import { useTranslation } from '@/hooks/use-translation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

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
  const [lastUpdated, setLastUpdated] = useState('');
  const { t } = useTranslation();

  useEffect(() => {
    setLastUpdated(new Date(initialData.timestamp).toLocaleTimeString());
    
    const interval = setInterval(() => {
      const newTimestamp = Date.now();
      setData((prevData) => ({
        soilMoisture: parseFloat((prevData.soilMoisture + (Math.random() - 0.5)).toFixed(1)),
        temperature: parseFloat((prevData.temperature + (Math.random() - 0.5) * 0.2).toFixed(1)),
        humidity: parseFloat((prevData.humidity + (Math.random() - 0.5)).toFixed(1)),
        nitrogen: Math.round(prevData.nitrogen + (Math.random() - 0.5) * 2),
        phosphorus: Math.round(prevData.phosphorus + (Math.random() - 0.5) * 1),
        potassium: Math.round(prevData.potassium + (Math.random() - 0.5) * 1.5),
        lightLevel: 98,
        gasLevel: 29,
        timestamp: newTimestamp,
      }));
      setLastUpdated(new Date(newTimestamp).toLocaleTimeString());
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">{t('real_time_data')}</CardTitle>
        {lastUpdated && <CardDescription>{t('last_updated')} {lastUpdated}</CardDescription>}
      </CardHeader>
      <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
        <MetricCard
          title={t('nitrogen')}
          value={data.nitrogen}
          unit="mg/kg"
          icon={<Leaf className="h-4 w-4" />}
        />
        <MetricCard
          title={t('phosphorus')}
          value={data.phosphorus}
          unit="mg/kg"
          icon={<Mountain className="h-4 w-4" />}
        />
        <MetricCard
          title={t('potassium')}
          value={data.potassium}
          unit="mg/kg"
          icon={<Mountain className="h-4 w-4" />}
        />
      </CardContent>
    </Card>
  );
}
