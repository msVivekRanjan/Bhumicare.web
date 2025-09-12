'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tractor, Sprout, TestTube2, Droplets } from 'lucide-react';
import { useTranslation } from "@/hooks/use-translation";

const upcomingActivities = [
  { id: 1, date: 'Today', activity: 'Irrigate wheat crop', icon: <Droplets className="h-5 w-5 text-blue-400" /> },
  { id: 2, date: 'Tomorrow', activity: 'Apply urea fertilizer', icon: <Sprout className="h-5 w-5 text-primary" /> },
  { id: 3, date: 'In 3 days', activity: 'Scout for pests in potato field', icon: <TestTube2 className="h-5 w-5 text-yellow-500" /> },
  { id: 4, date: 'In 5 days', activity: 'Prepare land for maize sowing', icon: <Tractor className="h-5 w-5 text-orange-500" /> },
];

export function CropCalendar() {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Crop Calendar</CardTitle>
        <CardDescription>Your key farming activities for the next week.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {upcomingActivities.map(item => (
            <div key={item.id} className="flex items-start gap-4 p-2 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex-shrink-0 bg-muted rounded-full h-10 w-10 flex items-center justify-center">
                {item.icon}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm">{item.activity}</p>
                <p className="text-xs text-muted-foreground">{item.date}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
