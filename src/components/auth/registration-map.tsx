'use client';

import {
  Map,
  useMap,
  AdvancedMarker,
  Polygon,
} from '@vis.gl/react-google-maps';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/use-translation';

interface RegistrationMapProps {
  onCoordinatesChange: (coordinates: string) => void;
}

export function RegistrationMap({ onCoordinatesChange }: RegistrationMapProps) {
  const [points, setPoints] = useState<google.maps.LatLngLiteral[]>([]);
  const { t } = useTranslation();

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      setPoints([...points, e.latLng.toJSON()]);
    }
  };

  const clearBoundary = () => {
    setPoints([]);
  };

  useEffect(() => {
    const coordsString = JSON.stringify(points);
    onCoordinatesChange(coordsString);
  }, [points, onCoordinatesChange]);

  return (
    <div className="w-full h-full relative">
      <Map
        defaultCenter={{ lat: 20.5937, lng: 78.9629 }} // Center of India
        defaultZoom={5}
        gestureHandling={'greedy'}
        disableDefaultUI={true}
        mapId="bhumicare_reg_map"
        onClick={handleMapClick}
      >
        {points.map((point, index) => (
          <AdvancedMarker key={index} position={point} />
        ))}
        {points.length > 2 && <Polygon paths={points} strokeColor="#3498DB" strokeOpacity={0.8} strokeWeight={2} fillColor="#3498DB" fillOpacity={0.35} />}
      </Map>
      <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center bg-background/80 p-2 rounded-md shadow-lg">
         <p className="text-xs text-muted-foreground">{t('click_to_add_points')}</p>
         <Button variant="destructive" size="sm" onClick={clearBoundary} disabled={points.length === 0}>
           {t('clear_boundary')}
         </Button>
      </div>
    </div>
  );
}
