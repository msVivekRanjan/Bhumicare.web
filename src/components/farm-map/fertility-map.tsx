'use client';

import { useState, useEffect, useRef } from 'react';
import { Map, useMap, InfoWindow, AdvancedMarker } from '@vis.gl/react-google-maps';
import { generateSoilFertilityMap, SoilFertilityMapInput, SoilFertilityMapOutput, SubRegionData } from '@/ai/flows/soil-fertility-map';
import { Button } from '../ui/button';
import { Wand2, Loader2, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { useTranslation } from '@/hooks/use-translation';
import { Skeleton } from '../ui/skeleton';

function FertilityPolygon({ subRegion, onClick }: { subRegion: SubRegionData, onClick: (subRegion: SubRegionData) => void }) {
    const map = useMap();
    const polygonRef = useRef<google.maps.Polygon | null>(null);

    const fertilityColor = (index: number) => {
        const colors = ['#f44336', '#ff9800', '#ffeb3b', '#4caf50']; // Red, Orange, Yellow, Green
        const colorIndex = Math.floor(index * (colors.length));
        return colors[Math.min(colorIndex, colors.length - 1)];
    }

    useEffect(() => {
        if (!map) return;

        polygonRef.current = new google.maps.Polygon({
            paths: subRegion.polygon,
            strokeColor: "#FFFFFF",
            strokeOpacity: 0.8,
            strokeWeight: 1,
            fillColor: fertilityColor(subRegion.fertilityIndex),
            fillOpacity: 0.6,
        });

        polygonRef.current.setMap(map);
        polygonRef.current.addListener('click', () => onClick(subRegion));

        return () => {
            if (polygonRef.current) {
                google.maps.event.clearInstanceListeners(polygonRef.current);
                polygonRef.current.setMap(null);
            }
        };
    }, [map, subRegion, onClick]);

    return null;
}

export function FertilityMap() {
  const [mapData, setMapData] = useState<SoilFertilityMapOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<SubRegionData | null>(null);
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
  const fieldCoordinates = [
      { lat: fieldBounds.north, lng: fieldBounds.west },
      { lat: fieldBounds.north, lng: fieldBounds.east },
      { lat: fieldBounds.south, lng: fieldBounds.east },
      { lat: fieldBounds.south, lng: fieldBounds.west },
  ];
  const center = { lat: (fieldBounds.north + fieldBounds.south) / 2, lng: (fieldBounds.east + fieldBounds.west) / 2 };

  const fetchFertilityMap = async () => {
    setLoading(true);
    setError(null);
    setMapData(null);
    setSelectedRegion(null);
    try {
      const input = {
        ...mockSensorData,
        fieldCoordinates: JSON.stringify(fieldCoordinates),
      };
      
      const result = await generateSoilFertilityMap(input);
      setMapData(result);

    } catch (err) {
      setError('Failed to generate fertility map.');
      console.error(err);
    }
    setLoading(false);
  };
  
  const handlePolygonClick = (subRegion: SubRegionData) => {
    setSelectedRegion(subRegion);
  };

  const getInfoWindowPosition = (polygon: {lat: number, lng: number}[]) => {
    const bounds = new google.maps.LatLngBounds();
    polygon.forEach(point => bounds.extend(point));
    return bounds.getCenter().toJSON();
  }

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
          {mapData?.subRegions.map((subRegion) => (
            <FertilityPolygon key={subRegion.id} subRegion={subRegion} onClick={handlePolygonClick} />
          ))}
          {selectedRegion && (
             <InfoWindow 
                position={getInfoWindowPosition(selectedRegion.polygon)}
                onCloseClick={() => setSelectedRegion(null)}
             >
                <div className="p-2">
                    <h4 className="font-bold text-base mb-2">Region: {selectedRegion.id}</h4>
                    <p><b>Fertility Index:</b> {(selectedRegion.fertilityIndex * 100).toFixed(0)}%</p>
                    <p><b>N:</b> {selectedRegion.nitrogen} mg/kg, <b>P:</b> {selectedRegion.phosphorus} mg/kg, <b>K:</b> {selectedRegion.potassium} mg/kg</p>
                    <p><b>Moisture:</b> {selectedRegion.soilMoisture}%</p>
                    <p className="mt-2 text-xs italic"><b>Recommendation:</b> {selectedRegion.recommendation}</p>
                </div>
             </InfoWindow>
          )}
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
            <CardDescription>Click a region on the map for details.</CardDescription>
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
                <div>
                  <h4 className="font-semibold mb-2">Overall Recommendation:</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{mapData.overallRecommendation}</p>
                </div>
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
