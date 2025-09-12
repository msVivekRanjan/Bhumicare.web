'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bug, Wind, Leaf } from 'lucide-react';
import { useTranslation } from "@/hooks/use-translation";
import { Badge } from "../ui/badge";

const pestAlerts = [
  { id: 1, name: 'Aphid Infestation', crop: 'Wheat', risk: 'High', details: 'Favorable winds and humidity increase risk. Monitor western fields.', icon: <Bug className="h-5 w-5 text-red-500" /> },
  { id: 2, name: 'Late Blight', crop: 'Potato', risk: 'Medium', details: 'Cool, moist nights expected. Consider preventative spraying.', icon: <Leaf className="h-5 w-5 text-orange-400" /> },
  { id: 3, name: 'Locust Swarm', crop: 'All', risk: 'Low', details: 'Swarms reported 300km away. No immediate threat.', icon: <Wind className="h-5 w-5 text-green-500" /> },
];

const riskVariant = {
    'High': 'destructive' as 'destructive',
    'Medium': 'secondary' as 'secondary',
    'Low': 'default' as 'default'
}

export function PestAlerts() {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Pest & Disease Alerts</CardTitle>
        <CardDescription>AI-powered predictions for your region.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {pestAlerts.map(alert => (
            <div key={alert.id} className="flex items-start gap-4 p-2 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex-shrink-0 bg-muted rounded-full h-10 w-10 flex items-center justify-center">
                {alert.icon}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                    <p className="font-semibold text-sm">{alert.name} on {alert.crop}</p>
                    <Badge variant={riskVariant[alert.risk as keyof typeof riskVariant]}>{alert.risk} Risk</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{alert.details}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
