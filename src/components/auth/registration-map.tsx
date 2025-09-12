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
import { MapPin, Move, LocateFixed, Loader2, Undo2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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

        return () => {
          if (polygonRef.current) {
              polygonRef.current.setMap(null);
          }
        }
    }, [map, paths]);

    return null;
}

export function RegistrationMap({ onCoordinatesChange }: RegistrationMapProps) {
  const [points, setPoints] = useState<google.maps.LatLngLiteral[]>([]);
  const [isMarking, setIsMarking] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const { t } = useTranslation();
  const isApiLoaded = useApiIsLoaded();
  const map = useMap();
  const { toast } = useToast();

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (isMarking && e.latLng && points.length < 7) {
      const newPoint = e.latLng.toJSON();
      setPoints(prevPoints => [...prevPoints, newPoint]);
    }
  };

  const clearBoundary = () => {
    setPoints([]);
  };

  const undoLastPoint = () => {
    setPoints(prevPoints => prevPoints.slice(0, -1));
  }

  const handleLocateMe = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
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
            return 'Maximum of 7 points reached. Click "Stop Marking" to finish.';
        }
        return `Points added: ${points.length}/7. Click to add more or "Stop Marking".`;
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
        style={{ cursor: isMarking ? 'crosshair' : 'default' }}
      >
        {points.map((point, index) => (
          <AdvancedMarker key={index} position={point} />
        ))}
        {points.length > 2 && <DrawnPolygon paths={points} />}
      </Map>
      <div className="absolute top-2 left-2 right-2 flex justify-between items-start gap-2">
         <div className="flex flex-col gap-2">
            <Button onClick={() => setIsMarking(!isMarking)} variant={isMarking ? "secondary" : "default"} size="sm">
                {isMarking ? <Move className="mr-2 h-4 w-4" /> : <MapPin className="mr-2 h-4 w-4" />}
                {isMarking ? 'Stop Marking' : 'Start Marking'}
            </Button>
            <Button onClick={handleLocateMe} variant="outline" size="sm" disabled={isLocating || isMarking}>
                {isLocating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LocateFixed className="mr-2 h-4 w-4" />}
                Use My Location
            </Button>
         </div>
         <div className="flex flex-col gap-2">
            {isMarking && (
                <Button variant="outline" size="sm" onClick={undoLastPoint} disabled={points.length === 0}>
                    <Undo2 className="mr-2 h-4 w-4" />
                    Undo
                </Button>
            )}
            <Button variant="destructive" size="sm" onClick={clearBoundary} disabled={points.length === 0}>
              Clear
            </Button>
         </div>
      </div>
       <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center bg-background/80 p-2 rounded-md shadow-lg">
         <p className="text-xs text-muted-foreground">{getHelperText()}</p>
      </div>
    </div>
  );
}
