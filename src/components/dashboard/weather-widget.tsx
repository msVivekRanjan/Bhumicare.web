'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/hooks/use-translation';
import Image from 'next/image';
import { Cloud, CloudRain, Sun, Cloudy } from 'lucide-react';

const forecast = [
  { day: 'Mon', temp: 34, icon: <Sun className="h-6 w-6 text-yellow-500" /> },
  { day: 'Tue', temp: 33, icon: <Cloudy className="h-6 w-6 text-gray-400" /> },
  { day: 'Wed', temp: 31, icon: <CloudRain className="h-6 w-6 text-blue-400" /> },
  { day: 'Thu', temp: 35, icon: <Sun className="h-6 w-6 text-yellow-500" /> },
  { day: 'Fri', temp: 32, icon: <Cloud className="h-6 w-6 text-gray-300" /> },
];

export function WeatherWidget() {
  const { t } = useTranslation();
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">{t('weather_forecast')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center text-center">
            <Sun className="w-16 h-16 text-yellow-400 mb-2" />
          <div className="text-5xl font-bold font-headline">33°C</div>
          <div className="text-muted-foreground">Sunny, New Delhi</div>
        </div>
        <div className="mt-6 flex justify-around">
          {forecast.map((item) => (
            <div key={item.day} className="flex flex-col items-center gap-1">
              <span className="text-sm text-muted-foreground">{item.day}</span>
              {item.icon}
              <span className="font-semibold">{item.temp}°</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
