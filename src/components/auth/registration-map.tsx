'use client';

import {
  Map,
  useMap,
  useApiIsLoaded,
  AdvancedMarker,
} from '@vis.gl/react-google-maps';
import { useEffect, useState, useRef, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Redo, Undo, X, LocateFixed, Expand, Shrink } from 'lucide-react';
import { Button } from '../ui/button';

interface RegistrationMapProps {
  onPolygonChange: (coordinates: string) => void;
}

const FALLBACK_CENTER = { lat: 20.245763, lng: 85.802415 };

export function RegistrationMap({ onPolygonChange }: RegistrationMapProps) {
  const [center, setCenter] = useState(FALLBACK_CENTER);
  const [zoom, setZoom] = useState(5);
  const [isMarking, setIsMarking] = useState(false);
  const [vertices, setVertices] = useState<google.maps.LatLngLiteral[]>([]);
  const [polygon, setPolygon] = useState<google.maps.Polygon | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const map = useMap();
  const isApiLoaded = useApiIsLoaded();
  const { toast } = useToast();

  const handleFullscreen = () => {
    if (!mapContainerRef.current) return;

    if (!document.fullscreenElement) {
      mapContainerRef.current.requestFullscreen().catch(err => {
        alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
    } else {
      document.exitFullscreen();
    }
  };
  
  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  const getUserLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLoc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCenter(userLoc);
          setZoom(15);
           toast({ title: "Location found!", description: "Map centered on your current location." });
        },
        () => {
            toast({ title: "Could not get location.", description: "Defaulting to a central location.", variant: "destructive" });
            setCenter(FALLBACK_CENTER);
            setZoom(5);
        }
      );
    } else {
         toast({ title: "Geolocation not supported.", description: "Your browser does not support geolocation.", variant: "destructive" });
    }
  }, [toast]);

  // 1. Geolocation on load
  useEffect(() => {
    if(map) {
      getUserLocation();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]);

  // Handle map clicks during marking mode
  useEffect(() => {
    if (!map || !isMarking) return;

    const clickListener = map.addListener('click', (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        setVertices(prev => [...prev, e.latLng!.toJSON()]);
      }
    });

    return () => {
      google.maps.event.removeListener(clickListener);
    };
  }, [map, isMarking]);

  // Update polygon whenever vertices change
  useEffect(() => {
    if (!map) return;

    // Clear existing polygon
    if (polygon) {
      polygon.setMap(null);
    }

    if (vertices.length > 1) {
      const newPolygon = new window.google.maps.Polygon({
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
        if (polygon) {
          polygon.setMap(null);
        }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
      className="w-full h-full relative bg-muted" 
      style={{ cursor: isMarking ? 'crosshair' : 'default' }}
    >
      <Map
        center={center}
        zoom={zoom}
        onCenterChanged={(e) => setCenter(e.detail.center)}
        onZoomChanged={(e) => setZoom(e.detail.zoom)}
        gestureHandling={'cooperative'}
        disableDefaultUI={false}
        mapId="bhumicare_reg_map"
        mapTypeId="satellite"
        zoomControl={true}
        mapTypeControl={true}
        streetViewControl={true}
        fullscreenControl={false} // Disable default and use custom
      >
        {vertices.map((v, i) => <AdvancedMarker key={i} position={v} />)}
      </Map>

       <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10 flex gap-2">
            <Button type="button" onClick={toggleMarking} variant="default" size="sm">
                {isMarking ? "Finish Marking" : "Start Marking Farm Area"}
            </Button>
            {isMarking && (
                <>
                    <Button type="button" variant="secondary" size="sm" onClick={handleUndo} disabled={vertices.length === 0}><Undo className="mr-2 h-4 w-4" /> Undo</Button>
                    <Button type="button" variant="destructive" size="sm" onClick={handleClear} disabled={vertices.length === 0}><X className="mr-2 h-4 w-4" /> Clear All</Button>
                </>
            )}
       </div>

      <div className="absolute top-2 right-2 z-10">
        <Button type="button" size="icon" variant="secondary" onClick={handleFullscreen} title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}>
             {isFullscreen ? <Shrink className="h-5 w-5" /> : <Expand className="h-5 w-5" />}
        </Button>
      </div>

       <div className="absolute bottom-16 right-2 z-10">
        <Button type="button" size="icon" variant="secondary" onClick={getUserLocation} title="Get my current location">
            <LocateFixed className="h-5 w-5" />
        </Button>
      </div>

      {isMarking && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-background/80 p-2 rounded-md shadow-lg text-center z-10">
         <p className="text-xs text-muted-foreground">Click on the map corners to trace your farm. Click 'Finish Marking' when done.</p>
      </div>
      )}
    </div>
  );
}
