'use client';

import {
  Map,
  useMap,
  useApiIsLoaded,
} from '@vis.gl/react-google-maps';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface RegistrationMapProps {
  onCoordinatesChange: (coordinates: string) => void;
}

const defaultCenter = { lat: 20.5937, lng: 78.9629 };

export function RegistrationMap({ onCoordinatesChange }: RegistrationMapProps) {
  const [center, setCenter] = useState(defaultCenter);
  const [message, setMessage] = useState('Please click on the map to trace the boundary of your farm. Click on each corner of your field and click the first point again to finish.');
  const isApiLoaded = useApiIsLoaded();
  const map = useMap();
  const { toast } = useToast();
  const [drawingManager, setDrawingManager] = useState<google.maps.drawing.DrawingManager | null>(null);

  // Request user's location on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          toast({
            title: "Could not get your location",
            description: "Falling back to default location. Please pan to your farm.",
            variant: "destructive"
          });
        }
      );
    }
  }, [toast]);
  
  // Initialize DrawingManager
  useEffect(() => {
    if (!map || !isApiLoaded) return;

    const manager = new google.maps.drawing.DrawingManager({
      drawingMode: google.maps.drawing.DrawingMode.POLYGON,
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: [google.maps.drawing.DrawingMode.POLYGON],
      },
      polygonOptions: {
        fillColor: '#3498DB',
        fillOpacity: 0.35,
        strokeWeight: 2,
        strokeColor: '#3498DB',
        clickable: false,
        editable: true,
        zIndex: 1,
      },
    });
    
    manager.setMap(map);
    setDrawingManager(manager);

    return () => {
      manager.setMap(null);
    }

  }, [map, isApiLoaded]);

  // Listen for polygon completion
  useEffect(() => {
    if (!drawingManager) return;

    const listener = google.maps.event.addListener(
      drawingManager,
      'polygoncomplete',
      (polygon: google.maps.Polygon) => {
        const path = polygon.getPath().getArray();
        const coords = path.map(p => ({ lat: p.lat(), lng: p.lng() }));
        onCoordinatesChange(JSON.stringify(coords));
        setMessage('Farm area defined successfully! You can adjust the points if needed.');
        // Prevent drawing another polygon
        drawingManager.setDrawingMode(null);
        drawingManager.setOptions({
            drawingControl: false
        })
      }
    );

    return () => {
      google.maps.event.removeListener(listener);
    }
  }, [drawingManager, onCoordinatesChange]);


  if (!isApiLoaded) {
    return <div className="w-full h-full flex items-center justify-center bg-muted"><Loader2 className="animate-spin" /> <p className='ml-2'>Loading map...</p></div>;
  }

  return (
    <div className="w-full h-full relative">
      <Map
        center={center}
        zoom={12}
        gestureHandling={'cooperative'}
        disableDefaultUI={true}
        mapId="bhumicare_reg_map"
        mapTypeId="satellite"
      />
       <div className="absolute top-2 left-2 right-2 bg-background/80 p-2 rounded-md shadow-lg text-center">
         <p className="text-xs text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}
