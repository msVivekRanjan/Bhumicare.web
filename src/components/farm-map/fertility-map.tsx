'use client';

import { useState, useEffect, useRef } from 'react';
import { Map, useMap, InfoWindow, useApiIsLoaded } from '@vis.gl/react-google-maps';
import { generateSoilFertilityMap, SoilFertilityMapInput, SoilFertilityMapOutput } from '@/ai/flows/soil-fertility-map';
import type { SubRegionData } from '@/types';
import { Button } from '../ui/button';
import { Wand2, Loader2, AlertTriangle, LocateFixed } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { useTranslation } from '@/hooks/use-translation';
import { Skeleton } from '../ui/skeleton';
import { useToast } from '@/hooks/use-toast';

function FertilityPolygon({ subRegion, onClick }: { subRegion: SubRegionData, onClick: (subRegion: SubRegionData) => void }) {
    const map = useMap();
    const polygonRef = useRef<google.maps.Polygon | null>(null);

    const fertilityColor = (index: number) => {
        const colors = ['#d7191c', '#fdae61', '#ffffbf', '#a6d96a', '#1a9641']; // Red -> Yellow -> Green
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [map, subRegion]);

    return null;
}

export function FertilityMap() {
  const [mapData, setMapData] = useState<SoilFertilityMapOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<SubRegionData | null>(null);
  const [fieldCoordinates, setFieldCoordinates] = useState<google.maps.LatLngLiteral[] | null>(null);
  const [center, setCenter] = useState<google.maps.LatLngLiteral>({ lat: 20.5937, lng: 78.9629 });
  const [isLocating, setIsLocating] = useState(false);

  const { t } = useTranslation();
  const { toast } = useToast();
  const isApiLoaded = useApiIsLoaded();
  const map = useMap();
  
  // Default coordinates for Delhi, used as a fallback.
  const defaultFieldCoordinates = [
      { lat: 28.6139, lng: 77.2090 },
      { lat: 28.6130, lng: 77.2100 },
      { lat: 28.6120, lng: 77.2085 },
      { lat: 28.6129, lng: 77.2075 }
  ];

  const getCenterFromCoords = (coords: google.maps.LatLngLiteral[]) => {
      if (!isApiLoaded || !coords || coords.length === 0) return { lat: 20.5937, lng: 78.9629 };
      const bounds = new window.google.maps.LatLngBounds();
      coords.forEach(point => bounds.extend(point));
      return bounds.getCenter().toJSON();
  }

  const locateUser = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCenter(userLocation);
          map?.moveCamera({ center: userLocation, zoom: 16 });
          setIsLocating(false);
        },
        () => {
          toast({
            title: "Location Access Denied",
            description: "Please enable location permissions in your browser to use this feature.",
            variant: "destructive"
          });
          setIsLocating(false);
        }
      );
    } else {
      toast({
        title: "Geolocation Not Supported",
        description: "Your browser does not support geolocation.",
        variant: "destructive"
      });
      setIsLocating(false);
    }
  }

  useEffect(() => {
    const savedCoordsStr = localStorage.getItem('bhumicare_field_coordinates');
    if (savedCoordsStr) {
      try {
        const parsedCoords = JSON.parse(savedCoordsStr);
        if (Array.isArray(parsedCoords) && parsedCoords.length > 2) {
          setFieldCoordinates(parsedCoords);
          const newCenter = getCenterFromCoords(parsedCoords);
          setCenter(newCenter);
          return;
        }
      } catch (e) {
        console.error("Failed to parse coordinates from localStorage.", e);
      }
    }
    setFieldCoordinates(null); // Explicitly set to null if no valid coords
    locateUser(); // Ask for location if no saved boundary
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isApiLoaded]);


  useEffect(() => {
    if (map && isApiLoaded && center) {
        if(fieldCoordinates) {
            const bounds = new window.google.maps.LatLngBounds();
            fieldCoordinates.forEach(point => bounds.extend(point));
            map.fitBounds(bounds);
        } else {
            map.moveCamera({center, zoom: 16});
        }
    }
  }, [center, fieldCoordinates, map, isApiLoaded]);


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


  const fetchFertilityMap = async () => {
    const coordsToUse = fieldCoordinates || defaultFieldCoordinates;
    
    setLoading(true);
    setError(null);
    setMapData(null);
    setSelectedRegion(null);
    try {
      const input = {
        ...mockSensorData,
        fieldCoordinates: JSON.stringify(coordsToUse),
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
    if (!isApiLoaded || !polygon || polygon.length === 0) return { lat: 0, lng: 0 };
    const bounds = new window.google.maps.LatLngBounds();
    polygon.forEach(point => bounds.extend(point));
    return bounds.getCenter().toJSON();
  }

  return (
    <div className="w-full h-full flex flex-col lg:flex-row gap-4">
      <div className="flex-1 h-1/2 lg:h-full rounded-lg overflow-hidden relative border">
        {isApiLoaded ? (
            <Map
                center={center}
                zoom={16}
                gestureHandling={'cooperative'}
                disableDefaultUI={false}
                fullscreenControl={true}
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
                    options={{ pixelOffset: new window.google.maps.Size(0, -30) }}
                 >
                    <div className="p-2 text-black">
                        <h4 className="font-bold text-base mb-2">Region: {selectedRegion.id}</h4>
                        <p><b>Fertility Index:</b> {(selectedRegion.fertilityIndex * 100).toFixed(0)}%</p>
                        <p><b>N:</b> {selectedRegion.nitrogen} mg/kg, <b>P:</b> {selectedRegion.phosphorus} mg/kg, <b>K:</b> {selectedRegion.potassium} mg/kg</p>
                        <p><b>Moisture:</b> {selectedRegion.soilMoisture}%</p>
                        <p className="mt-2 text-xs italic"><b>Recommendation:</b> {selectedRegion.recommendation}</p>
                    </div>
                 </InfoWindow>
              )}
            </Map>
        ) : (
             <div className="w-full h-full flex items-center justify-center bg-muted">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )}
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
            <CardDescription>Click a region on the map for details, or generate a new analysis.</CardDescription>
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
            ) : fieldCoordinates === null ? (
              <div className="text-center space-y-2 text-sm text-muted-foreground">
                <p>No field boundary has been set for your account.</p>
                <p>You can generate a map for a default area, or register a new field boundary.</p>
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
            {!fieldCoordinates && (
              <Button onClick={locateUser} variant="outline" className="w-full">
                {isLocating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LocateFixed className="mr-2 h-4 w-4" />}
                Center on My Location
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
