'use client';

import { useState, useEffect, useRef } from 'react';
import { Map, useMap } from '@vis.gl/react-google-maps';
import { generateSoilFertilityMap, SoilFertilityMapInput, SoilFertilityMapOutput } from '@/ai/flows/soil-fertility-map';
import { Button } from '../ui/button';
import { Wand2, Loader2, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { useTranslation } from '@/hooks/use-translation';
import Image from 'next/image';
import { Skeleton } from '../ui/skeleton';


function GroundOverlay({ bounds, image }: { bounds: google.maps.LatLngBoundsLiteral; image: string }) {
    const map = useMap();
    const overlayRef = useRef<google.maps.GroundOverlay | null>(null);

    useEffect(() => {
        if (!map) return;
        if (!overlayRef.current) {
            overlayRef.current = new google.maps.GroundOverlay(image, bounds);
            overlayRef.current.setMap(map);
        } else {
            overlayRef.current.setMap(map);
            overlayRef.current.setUrl(image);
            overlayRef.current.setBounds(bounds);
        }

        return () => {
            if (overlayRef.current) {
                overlayRef.current.setMap(null);
            }
        };
    }, [map, bounds, image]);

    return null;
}


export function FertilityMap() {
  const [mapData, setMapData] = useState<SoilFertilityMapOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  const mockSensorData: Omit<SoilFertilityMapInput, 'fieldCoordinates'> = {
    soilMoisture: 45.2,
    lightLevel: 98,
    gasLevel: 29,
    temperature: 32.1,
    humidity: 74.0,
    nitrogen: 150,
    phosphorus: 50,
    potassium: 100,
  };

  const fieldBounds = {
    north: 28.615,
    south: 28.610,
    east: 77.232,
    west: 77.225,
  };
  const center = { lat: (fieldBounds.north + fieldBounds.south) / 2, lng: (fieldBounds.east + fieldBounds.west) / 2 };

  const fetchFertilityMap = async () => {
    setLoading(true);
    setError(null);
    setMapData(null);
    try {
      const input = {
        ...mockSensorData,
        fieldCoordinates: JSON.stringify(fieldBounds),
      };
      
      // Simulate a long call and a fake response for demonstration
      await new Promise(resolve => setTimeout(resolve, 3000));
      const fakeResponse = {
        fertilityMapDataUri: "https://storage.googleapis.com/gweb-uniblog-publish-prod/images/Maps-pin-and-shadow.max-1000x1000.png",
        recommendation: "The analysis shows varied moisture levels. The western part of the field is drier and may require targeted irrigation. Nutrient levels are generally stable, but consider applying a potassium-rich fertilizer to the northern edge where levels are slightly lower."
      }

      // In a real scenario, you would use the AI call:
      // const result = await generateSoilFertilityMap(input);
      // For this demo, we use a fake response as the AI model might not generate a valid image URI.
      setMapData(fakeResponse);

    } catch (err) {
      setError('Failed to generate fertility map.');
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="w-full h-full flex flex-col lg:flex-row gap-4">
      <div className="flex-1 h-1/2 lg:h-full rounded-lg overflow-hidden relative border">
        <Map
            defaultCenter={center}
            defaultZoom={15}
            gestureHandling={'greedy'}
            disableDefaultUI={true}
            mapId="bhumicare_fertility_map"
            mapTypeId="satellite"
        >
          {mapData?.fertilityMapDataUri && <GroundOverlay bounds={fieldBounds} image={mapData.fertilityMapDataUri} />}
        </Map>
        {loading && (
          <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
      </div>
      <div className="w-full lg:w-1/3">
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="font-headline">{t('ai_map_recommendation')}</CardTitle>
            <CardDescription>Analysis from the generated map.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
                <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">{t('generating_map_and_recommendation')}</p>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                </div>
            ) : error ? (
                <div className="text-destructive flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    <p>{error}</p>
                </div>
            ) : mapData ? (
                <p className="text-sm text-muted-foreground leading-relaxed">{mapData.recommendation}</p>
            ) : (
                <p className="text-sm text-muted-foreground">Click 'Generate Map' to get an AI-powered analysis of your field.</p>
            )}
            <Button onClick={fetchFertilityMap} disabled={loading} className="w-full">
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Wand2 className="mr-2 h-4 w-4" />
              )}
              {t('generate_map')}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
