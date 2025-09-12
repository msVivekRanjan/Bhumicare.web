'use client';

import {
  Map,
  useMap,
  AdvancedMarker,
  useApiIsLoaded,
} from '@vis.gl/react-google-maps';
import { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/use-translation';
import { MapPin, Move } from 'lucide-react';

interface RegistrationMapProps {
  onCoordinatesChange: (coordinates: string) => void;
}

function DrawnPolygon({ paths }: { paths: google.maps.LatLngLiteral[] }) {
    const map = useMap();
    const polygonRef = useRef<google.maps.Polygon | null>(null);

    useEffect(() => {
        if (!map) return;

        if (!polygonRef.current) {
            polygonRef.current = new google.maps.Polygon({
                paths: paths,
                strokeColor: "#3498DB",
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: "#3498DB",
                fillOpacity: 0.35,
                clickable: false,
            });
            polygonRef.current.setMap(map);
        } else {
            polygonRef.current.setPaths(paths);
        }
    }, [map, paths]);

    useEffect(() => {
      return () => {
        if (polygonRef.current) {
            polygonRef.current.setMap(null);
        }
      }
    }, [])

    return null;
}

export function RegistrationMap({ onCoordinatesChange }: RegistrationMapProps) {
  const [points, setPoints] = useState<google.maps.LatLngLiteral[]>([]);
  const [isMarking, setIsMarking] = useState(false);
  const { t } = useTranslation();
  const isApiLoaded = useApiIsLoaded();

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (isMarking && e.latLng && points.length < 7) {
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

  const getHelperText = () => {
    if (isMarking) {
        if (points.length < 3) {
            return `Click to add boundary points (${points.length}/7). At least 3 are needed.`;
        }
        if (points.length >= 7) {
            return 'Maximum of 7 points reached.';
        }
        return `Points added: ${points.length}/7. Click to add more.`;
    }
    return 'Click "Start Marking" to begin defining your field boundary.';
  }

  if (!isApiLoaded) {
    return <div className="w-full h-full flex items-center justify-center bg-muted"><p>Loading map...</p></div>;
  }

  return (
    <div className="w-full h-full relative">
      <Map
        defaultCenter={{ lat: 20.5937, lng: 78.9629 }}
        defaultZoom={5}
        gestureHandling={isMarking ? 'none' : 'cooperative'}
        disableDefaultUI={isMarking}
        mapId="bhumicare_reg_map"
        onClick={handleMapClick}
        style={{ cursor: isMarking ? 'crosshair' : 'grab' }}
      >
        {points.map((point, index) => (
          <AdvancedMarker key={index} position={point} />
        ))}
        {points.length > 2 && <DrawnPolygon paths={points} />}
      </Map>
      <div className="absolute top-2 left-2 right-2 flex justify-between items-center bg-background/80 p-2 rounded-md shadow-lg">
        <Button onClick={() => setIsMarking(!isMarking)} variant={isMarking ? "secondary" : "default"}>
            {isMarking ? <Move className="mr-2 h-4 w-4" /> : <MapPin className="mr-2 h-4 w-4" />}
            {isMarking ? 'Stop Marking' : 'Start Marking'}
        </Button>
         <Button variant="destructive" size="sm" onClick={clearBoundary} disabled={points.length === 0}>
           {t('clear_boundary')}
         </Button>
      </div>
       <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center bg-background/80 p-2 rounded-md shadow-lg">
         <p className="text-xs text-muted-foreground">{getHelperText()}</p>
      </div>
    </div>
  );
}
