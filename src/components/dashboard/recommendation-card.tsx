'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getSmartRecommendation, SmartRecommendationInput, SmartRecommendationOutput } from '@/ai/flows/smart-recommendations';
import { Wand2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from '@/hooks/use-translation';

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
      const result = await getSmartRecommendation(mockSensorData);
      setRecommendation(result);
    } catch (err) {
      setError('Failed to fetch recommendation. You may have exceeded your API quota.');
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">{t('ai_recommendation')}</CardTitle>
        <CardDescription>Advice powered by Google Gemini</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ) : error ? (
          <p className="text-sm text-destructive">{error}</p>
        ) : recommendation ? (
          <p className="text-sm text-muted-foreground leading-relaxed">
            {recommendation.recommendation}
          </p>
        ) : (
           <p className="text-sm text-muted-foreground leading-relaxed">
            Click the button below to generate an AI-powered recommendation based on your latest farm data.
          </p>
        )}
        <Button onClick={fetchRecommendation} disabled={loading} className="w-full" variant="secondary">
          <Wand2 className="mr-2 h-4 w-4" />
          {t('get_recommendation')}
        </Button>
      </CardContent>
    </Card>
  );
}
