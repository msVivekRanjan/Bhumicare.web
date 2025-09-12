'use client';

import {
  Map,
  useMap,
  useApiIsLoaded,
  AdvancedMarker,
} from '@vis.gl/react-google-maps';
import { useEffect, useState, useMemo, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Redo, Undo, X } from 'lucide-react';
import { Button } from '../ui/button';

interface RegistrationMapProps {
  onPolygonChange: (coordinates: string) => void;
}

const FALLBACK_CENTER = { lat: 20.245763, lng: 85.802415 };

export function RegistrationMap({ onPolygonChange }: RegistrationMapProps) {
  const [center, setCenter] = useState(FALLBACK_CENTER);
  const [isMarking, setIsMarking] = useState(false);
  const [vertices, setVertices] = useState<google.maps.LatLngLiteral[]>([]);
  const [polygon, setPolygon] = useState<google.maps.Polygon | null>(null);
  
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const map = useMap();
  const isApiLoaded = useApiIsLoaded();
  const { toast } = useToast();

  // 1. Geolocation on load
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLoc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCenter(userLoc);
          map?.setCenter(userLoc);
          map?.setZoom(15);
        },
        () => {
            toast({ title: "Could not get location.", description: "Defaulting to a central location.", variant: "destructive" });
            setCenter(FALLBACK_CENTER);
            map?.setCenter(FALLBACK_CENTER);
            map?.setZoom(5);
        }
      );
    }
  }, [map, toast]);

  // Handle map clicks during marking mode
  useEffect(() => {
    if (!map || !isMarking) return;

    const clickListener = map.addListener('click', (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        setVertices(prev => [...prev, e.latLng!.toJSON()]);
      }
    });

    return () => {
      clickListener.remove();
    };
  }, [map, isMarking]);

  // Update polygon whenever vertices change
  useEffect(() => {
    if (!map) return;

    // Clear existing polygon
    polygon?.setMap(null);

    if (vertices.length > 1) {
      const newPolygon = new google.maps.Polygon({
        paths: vertices,
        strokeColor: '#4C8BF5',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#4C8BF5',
        fillOpacity: 0.35,
        map: map,
      });
      setPolygon(newPolygon);
    } else {
        setPolygon(null);
    }
    
    // Clean up polygon on component unmount
    return () => {
        polygon?.setMap(null);
    }
  }, [map, vertices]);


  const toggleMarking = () => {
    if (isMarking) {
        // Finish marking
        if (vertices.length > 2) {
             onPolygonChange(JSON.stringify(vertices));
             toast({ title: "Farm area defined successfully!", description: `${vertices.length} points marked.`});
        } else {
            toast({ title: "Not enough points", description: "Please mark at least 3 points to define an area.", variant: "destructive"});
        }
    }
    setIsMarking(!isMarking);
  };
  
  const handleUndo = () => {
    setVertices(prev => prev.slice(0, -1));
  }

  const handleClear = () => {
    setVertices([]);
    onPolygonChange('');
  }


  if (!isApiLoaded) {
    return <div className="w-full h-full flex items-center justify-center bg-muted"><Loader2 className="animate-spin" /> <p className='ml-2'>Loading map...</p></div>;
  }

  return (
    <div 
      ref={mapContainerRef} 
      className="w-full h-full relative" 
      style={{ cursor: isMarking ? 'crosshair' : 'default' }}
    >
      <Map
        center={center}
        zoom={5}
        gestureHandling={'cooperative'}
        disableDefaultUI={true}
        mapId="bhumicare_reg_map"
        mapTypeId="satellite"
        fullscreenControl={true}
      >
        {vertices.map((v, i) => <AdvancedMarker key={i} position={v} />)}
      </Map>

       <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10 flex gap-2">
            <Button type="button" onClick={toggleMarking}>
                {isMarking ? "Finish Marking" : "Start Marking Farm Area"}
            </Button>
            {isMarking && (
                <>
                    <Button type="button" variant="secondary" onClick={handleUndo} disabled={vertices.length === 0}><Undo className="mr-2" /> Undo</Button>
                    <Button type="button" variant="destructive" onClick={handleClear} disabled={vertices.length === 0}><X className="mr-2" /> Clear All</Button>
                </>
            )}
       </div>

      {isMarking && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-background/80 p-2 rounded-md shadow-lg text-center z-10">
         <p className="text-xs text-muted-foreground">Click on the map corners to trace your farm. Click 'Finish Marking' when done.</p>
      </div>
      )}
    </div>
  );
}
