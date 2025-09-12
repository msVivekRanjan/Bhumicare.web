'use client';

import {
  Map,
  useMap,
  useApiIsLoaded,
  AdvancedMarker,
} from '@vis.gl/react-google-maps';
import { useEffect, useState, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Loader2, LocateFixed } from 'lucide-react';
import { Button } from '../ui/button';

interface RegistrationMapProps {
  onLocationChange: (coordinates: string) => void;
}

const INDIA_CENTER = { lat: 20.5937, lng: 78.9629 };

export function RegistrationMap({ onLocationChange }: RegistrationMapProps) {
  const [center, setCenter] = useState(INDIA_CENTER);
  const [markerPos, setMarkerPos] = useState<google.maps.LatLngLiteral | null>(null);
  const [message, setMessage] = useState('Locating you, or drag the marker to your farm.');
  const isApiLoaded = useApiIsLoaded();
  const map = useMap();
  const { toast } = useToast();

  const handleGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLoc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCenter(userLoc);
          setMarkerPos(userLoc);
          onLocationChange(JSON.stringify(userLoc));
          if (map) map.setZoom(15);
           setMessage('Location found! Drag the marker to fine-tune.');
        },
        () => {
          toast({
            title: "Could not get your location",
            description: "Defaulting to center of India. Please pan to your farm.",
            variant: "destructive"
          });
          setMessage('Could not get location. Drag marker to your farm.');
        }
      );
    }
  };

  // Request user's location on component mount
  useEffect(() => {
    handleGeolocation();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  
  const handleDragEnd = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
        const newPos = { lat: e.latLng.lat(), lng: e.latLng.lng() };
        setMarkerPos(newPos);
        onLocationChange(JSON.stringify(newPos));
    }
  };


  if (!isApiLoaded) {
    return <div className="w-full h-full flex items-center justify-center bg-muted"><Loader2 className="animate-spin" /> <p className='ml-2'>Loading map...</p></div>;
  }

  return (
    <div className="w-full h-full relative">
      <Map
        center={center}
        zoom={5}
        gestureHandling={'cooperative'}
        disableDefaultUI={true}
        mapId="bhumicare_reg_map"
        mapTypeId="satellite"
      >
        {markerPos && <AdvancedMarker position={markerPos} draggable={true} onDragEnd={handleDragEnd} />}
      </Map>
       <div className="absolute top-2 left-2 right-2 bg-background/80 p-2 rounded-md shadow-lg text-center">
         <p className="text-xs text-muted-foreground">{message}</p>
      </div>
      <Button 
        type="button"
        size="icon"
        className="absolute bottom-2 right-2"
        onClick={handleGeolocation}
        aria-label="Use my current location"
      >
        <LocateFixed className='h-5 w-5' />
      </Button>
    </div>
  );
}
