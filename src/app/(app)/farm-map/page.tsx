'use client';

import { AIFertilityMap } from "@/components/farm-map/ai-fertility-map";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/hooks/use-translation";

export default function FarmMapPage() {
    const { t } = useTranslation();
    return (
        <Card className="h-full flex flex-col">
            <CardHeader>
                <CardTitle className="font-headline">{t('soil_fertility_map')}</CardTitle>
                <CardDescription>AI-powered analysis of your field. Hover over a grid cell for details.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
                <div className="w-full h-full rounded-lg overflow-hidden border">
                    <AIFertilityMap />
                </div>
            </CardContent>
        </Card>
    );
}
