'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getSmartRecommendation, SmartRecommendationInput, SmartRecommendationOutput } from '@/ai/flows/smart-recommendations';
import { Wand2, Droplets, Leaf, ShieldCheck } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from '@/hooks/use-translation';
import { Separator } from '../ui/separator';

export function RecommendationCard() {
  const [recommendation, setRecommendation] = useState<SmartRecommendationOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  const mockSensorData: SmartRecommendationInput = {
    soilMoisture: 45.2,
    lightLevel: 98,
    gasLevel: 29,
    temperature: 32.1,
    humidity: 74.0,
    nitrogen: 150,
    phosphorus: 50,
    potassium: 100,
  };

  const fetchRecommendation = async () => {
    setLoading(true);
    setError(null);
    setRecommendation(null);
    try {
      // Simulate real-time variation
      const variedData = {
        ...mockSensorData,
        soilMoisture: parseFloat((mockSensorData.soilMoisture + (Math.random() - 0.5) * 10).toFixed(1)),
        nitrogen: Math.round(mockSensorData.nitrogen + (Math.random() - 0.5) * 40),
        phosphorus: Math.round(mockSensorData.phosphorus + (Math.random() - 0.5) * 20),
        potassium: Math.round(mockSensorData.potassium + (Math.random() - 0.5) * 30),
      }
      const result = await getSmartRecommendation(variedData);
      setRecommendation(result);
    } catch (err) {
      setError('Failed to fetch recommendation. You may have exceeded your API quota.');
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <Card className='flex flex-col'>
      <CardHeader>
        <CardTitle className="font-headline">{t('ai_recommendation')}</CardTitle>
        <CardDescription>Advice powered by Google Gemini</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 flex flex-col flex-1">
        <div className="flex-1 space-y-4">
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Separator />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ) : error ? (
            <p className="text-sm text-destructive">{error}</p>
          ) : recommendation ? (
            <div className="space-y-4 text-sm text-muted-foreground">
              <p className="italic">"{recommendation.overallAssessment}"</p>
              <Separator />
              <div className="space-y-3">
                 <div className="flex items-start gap-3">
                    <Droplets className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                        <h4 className="font-semibold text-foreground">Irrigation</h4>
                        <p>{recommendation.irrigation}</p>
                    </div>
                </div>
                 <div className="flex items-start gap-3">
                    <Leaf className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                        <h4 className="font-semibold text-foreground">Fertilization</h4>
                        <p>{recommendation.fertilization}</p>
                    </div>
                </div>
                 <div className="flex items-start gap-3">
                    <ShieldCheck className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <div>
                        <h4 className="font-semibold text-foreground">Crop Health</h4>
                        <p>{recommendation.cropHealth}</p>
                    </div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground leading-relaxed">
              Click the button below to generate a detailed, AI-powered action plan based on your latest farm data.
            </p>
          )}
        </div>
        <Button onClick={fetchRecommendation} disabled={loading} className="w-full mt-auto" variant="secondary">
          <Wand2 className="mr-2 h-4 w-4" />
          {loading ? 'Analyzing Data...' : t('get_recommendation')}
        </Button>
      </CardContent>
    </Card>
  );
}
