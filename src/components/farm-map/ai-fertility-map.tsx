'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { APIProvider, Map, useMap, InfoWindow, AdvancedMarker } from '@vis.gl/react-google-maps';
import { GOOGLE_MAPS_API_KEY } from '@/lib/constants';
import { MapLegend } from './map-legend';
import { Button } from '../ui/button';
import { Loader2, LocateFixed, Undo, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateSoilFertilityMap, SoilFertilityMapOutput } from '@/ai/flows/soil-fertility-map';
import { Skeleton } from '../ui/skeleton';
import { useTranslation } from '@/hooks/use-translation';

const INDIA_CENTER = { lat: 20.5937, lng: 78.9629 };

type CellData = {
    id: string;
    polygon: { lat: number; lng: number; }[];
    nitrogen: number;
    phosphorus: number;
    potassium: number;
    soilMoisture: number;
    fertilityIndex: number;
    recommendation: string;
};


const BivariateMap = () => {
    const map = useMap();
    const { t } = useTranslation();
    const { toast } = useToast();

    // Component State
    const [hoverData, setHoverData] = useState<CellData | null>(null);
    const [fieldPath, setFieldPath] = useState<google.maps.LatLngLiteral[]>([]);
    const [isDefiningArea, setIsDefiningArea] = useState(false);
    const [markers, setMarkers] = useState<google.maps.LatLngLiteral[]>([]);
    
    // Map Objects State
    const [gridPolygons, setGridPolygons] = useState<google.maps.Polygon[]>([]);
    const [fieldPolygon, setFieldPolygon] = useState<google.maps.Polygon | null>(null);
    const [tempPolygon, setTempPolygon] = useState<google.maps.Polygon | null>(null);

    // AI Data State
    const [isLoadingMap, setIsLoadingMap] = useState(false);
    const [mapData, setMapData] = useState<SoilFertilityMapOutput | null>(null);

    // Load user's location and saved polygon on init
    useEffect(() => {
        if (!map) return;

        const storedLocation = localStorage.getItem('bhumicare_user_location');
        let initialCenter = INDIA_CENTER;
        if (storedLocation) {
            try {
                initialCenter = JSON.parse(storedLocation);
            } catch (e) { console.error("Failed to parse user location"); }
        }
        map.setCenter(initialCenter);
        map.setZoom(storedLocation ? 15 : 5);

        const storedPolygon = localStorage.getItem('bhumicare_field_coordinates');
        if (storedPolygon) {
            try {
                const path = JSON.parse(storedPolygon);
                if (path && path.length > 2) {
                    setFieldPath(path);
                } else {
                    // If no valid polygon, prompt user to define one
                    toast({ title: "Define your farm", description: "Click 'Define Field Area' to get started."});
                }
            } catch (e) { 
                console.error("Failed to parse stored polygon"); 
                toast({ title: "Define your farm", description: "Click 'Define Field Area' to get started."});
            }
        } else {
            toast({ title: "Define your farm", description: "Click 'Define Field Area' to get started."});
        }
    }, [map, toast]);
    
    // --- Map Interaction Handlers ---
    
    const handleMapClick = (e: google.maps.MapMouseEvent) => {
        if (!isDefiningArea || !e.latLng) return;
        const newMarker = { lat: e.latLng.lat(), lng: e.latLng.lng() };
        setMarkers(prev => [...prev, newMarker]);
    };

    useEffect(() => {
        if (!map || !isDefiningArea) return;
        const clickListener = map.addListener('click', handleMapClick);
        return () => {
            google.maps.event.removeListener(clickListener);
        }
    }, [map, isDefiningArea]);

    const startDefiningArea = () => {
        // Clear everything
        gridPolygons.forEach(p => p.setMap(null));
        setGridPolygons([]);
        fieldPolygon?.setMap(null);
        setFieldPolygon(null);
        tempPolygon?.setMap(null);
        setTempPolygon(null);
        setMapData(null);
        
        setFieldPath([]);
        setMarkers([]);
        setIsDefiningArea(true);
        setHoverData(null);
    };
    
    const finishDefiningArea = useCallback(() => {
        if (markers.length < 3) {
            toast({variant: "destructive", title: "Not enough points", description: "Please mark at least 3 points to form a field area."});
            return;
        }
        setFieldPath(markers);
        localStorage.setItem('bhumicare_field_coordinates', JSON.stringify(markers));
        setIsDefiningArea(false);
        setMarkers([]);
    }, [markers, toast]);

    const undoLastMarker = () => {
        setMarkers(prev => prev.slice(0, -1));
    };

    const onCellHover = useCallback((data: CellData | null) => {
        setHoverData(data);
    }, []);

    const getUserLocation = () => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const userLoc = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              };
              map?.panTo(userLoc);
              map?.setZoom(15);
               toast({ title: "Location found!", description: "Map centered on your current location." });
            },
            () => {
                toast({ title: "Could not get location.", variant: "destructive" });
            }
          );
        } else {
             toast({ title: "Geolocation not supported.", variant: "destructive" });
        }
    }
    
    // --- Drawing Effects ---
    
    // Effect for the temporary polygon while marking
    useEffect(() => {
        if (!map || !isDefiningArea) return;

        tempPolygon?.setMap(null);

        if (markers.length > 1) {
            const newTempPolygon = new google.maps.Polygon({
                paths: markers,
                strokeColor: "#FFFFFF",
                strokeOpacity: 0.7,
                strokeWeight: 2,
                fillColor: "#FFFFFF",
                fillOpacity: 0.2,
                map: map,
                zIndex: 1,
            });
            setTempPolygon(newTempPolygon);
        }
        return () => {
            tempPolygon?.setMap(null);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [map, markers, isDefiningArea]);

    // Effect to draw the final field polygon
    useEffect(() => {
        if (!map || fieldPath.length < 3) return;

        fieldPolygon?.setMap(null);

        const newFieldPolygon = new google.maps.Polygon({
            paths: fieldPath,
            fillOpacity: 0.0,
            strokeColor: "#00FF00",
            strokeWeight: 2,
            map: map,
            zIndex: 2
        });

        const bounds = new google.maps.LatLngBounds();
        fieldPath.forEach(coord => bounds.extend(coord));
        map.fitBounds(bounds);
        setFieldPolygon(newFieldPolygon);

        return () => {
            newFieldPolygon.setMap(null);
        }
    }, [map, fieldPath]);
    
    // --- AI Data Fetching and Grid Generation ---
    
    useEffect(() => {
        if (fieldPath.length < 3) return;

        const generateMap = async () => {
            setIsLoadingMap(true);
            setMapData(null);
            gridPolygons.forEach(p => p.setMap(null));
            setGridPolygons([]);
            
            try {
                 // Mock data for now, replace with actual sensor data
                const mockSensorData = {
                    soilMoisture: 45,
                    lightLevel: 98,
                    gasLevel: 29,
                    temperature: 32,
                    humidity: 74,
                    nitrogen: 150,
                    phosphorus: 50,
                    potassium: 100,
                    fieldCoordinates: JSON.stringify(fieldPath),
                };
                const result = await generateSoilFertilityMap(mockSensorData);
                setMapData(result);
            } catch (error) {
                console.error("Failed to generate AI map:", error);
                toast({
                    variant: "destructive",
                    title: "AI Analysis Failed",
                    description: "Could not generate the soil fertility map. Please try again."
                });
            } finally {
                setIsLoadingMap(false);
            }
        };

        generateMap();
    }, [fieldPath, toast]);


    // Effect to generate and display the grid from AI data
    useEffect(() => {
        if (!map || !mapData) return;

        gridPolygons.forEach(p => p.setMap(null));

        const newGridPolygons: google.maps.Polygon[] = [];

        mapData.subRegions.forEach(region => {
            const fertilityIndex = region.fertilityIndex;
            
            // Create color from fertility index (0=red, 0.5=yellow, 1=green)
            const hue = (fertilityIndex * 120).toString(10);
            const color = `hsl(${hue}, 100%, 50%)`;

            const polygon = new google.maps.Polygon({
                paths: region.polygon,
                strokeColor: '#FFFFFF',
                strokeOpacity: 0.2,
                strokeWeight: 1,
                fillColor: color,
                fillOpacity: 0.6,
                map: map,
                zIndex: 3,
            });
            
            // Attach data to the polygon object for hover effect
            (polygon as any).analysisData = region;

            const mouseoverListener = () => onCellHover((polygon as any).analysisData);
            const mouseoutListener = () => onCellHover(null);

            polygon.addListener('mouseover', mouseoverListener);
            polygon.addListener('mouseout', mouseoutListener);

            newGridPolygons.push(polygon);
        });
        
        setGridPolygons(newGridPolygons);

        return () => {
            newGridPolygons.forEach(p => {
                google.maps.event.clearInstanceListeners(p);
                p.setMap(null)
            });
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [map, mapData]);

    return (
        <>
            {/* Markers while defining area */}
            {isDefiningArea && markers.map((pos, index) => <AdvancedMarker key={index} position={pos} />)}

            {/* InfoWindow for hover */}
             {hoverData && (
                <InfoWindow
                    position={hoverData.polygon[0]} // Position at first point of the cell
                    onCloseClick={() => setHoverData(null)}
                    options={{ pixelOffset: new window.google.maps.Size(0, -30) }}
                >
                    <div className="p-1 text-black font-body w-56">
                        <h4 className="font-bold text-base mb-2 font-headline">Cell Analysis (ID: {hoverData.id})</h4>
                        <p className="text-xs"><b>Fertility Index:</b> {(hoverData.fertilityIndex * 100).toFixed(0)}%</p>
                        <p className="text-xs"><b>Moisture:</b> {hoverData.soilMoisture}%</p>
                        <p className="text-xs"><b>N:</b> {hoverData.nitrogen} | <b>P:</b> {hoverData.phosphorus} | <b>K:</b> {hoverData.potassium}</p>
                        <p className="mt-2 text-xs italic">
                           {hoverData.recommendation}
                        </p>
                    </div>
                </InfoWindow>
            )}

             {/* UI Controls */}
             <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
                {!isDefiningArea ? (
                    <Button onClick={startDefiningArea}>Define New Field Area</Button>
                ) : (
                    <>
                        <Button onClick={finishDefiningArea}>Generate Fertility Map</Button>
                        <Button onClick={undoLastMarker} variant="secondary" disabled={markers.length === 0}><Undo className="mr-2 h-4 w-4" /> Undo</Button>
                        <Button onClick={() => setIsDefiningArea(false)} variant="ghost">Cancel</Button>
                    </>
                )}
            </div>

             {isDefiningArea && (
                 <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-background/80 p-2 rounded-md shadow-lg text-center z-10">
                    <p className="text-sm text-muted-foreground">Click on the map to mark the corners of your field.</p>
                </div>
             )}

             <div className="absolute bottom-4 left-4 z-10">
                <Button type="button" size="icon" variant="secondary" onClick={getUserLocation} title="Get my current location">
                    <LocateFixed className="h-5 w-5" />
                </Button>
             </div>

             {isLoadingMap && (
                 <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/80 p-3 rounded-lg shadow-lg text-center z-10 flex items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <p className="text-sm text-muted-foreground">{t('generating_map_and_recommendation')}</p>
                </div>
             )}
             
             {mapData && !isLoadingMap && (
                 <div className="absolute bottom-16 md:bottom-4 left-1/2 -translate-x-1/2 bg-background/80 p-3 rounded-lg shadow-lg text-center z-10 max-w-lg">
                    <h4 className="font-bold font-headline text-primary">{t('ai_map_recommendation')}</h4>
                    <p className="text-sm text-muted-foreground">{mapData.overallRecommendation}</p>
                </div>
             )}
        </>
    );
};

export function AIFertilityMap() {
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true)
    }, [])

    if(!isMounted) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-muted">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }
    
    return (
        <APIProvider apiKey={GOOGLE_MAPS_API_KEY} libraries={['geometry']}>
            <div className="w-full h-full relative">
                <Map
                    defaultCenter={INDIA_CENTER}
                    defaultZoom={5}
                    gestureHandling={'cooperative'}
                    mapId={'bhumicare_ai_fertility_map'}
                    mapTypeId="satellite"
                    disableDefaultUI={false}
                    zoomControl={true}
                    mapTypeControl={true}
                    streetViewControl={true}
                    fullscreenControl={true}
                >
                    <BivariateMap />
                </Map>
                <div className="absolute bottom-4 right-4 z-10">
                    <MapLegend />
                </div>
            </div>
        </APIProvider>
    );
}

export const getColorFromIndex = (fertilityIndex: number) => {
    // fertilityIndex is 0-1. We want to map this to a hue from 0 (red) to 120 (green).
    const hue = (fertilityIndex * 120).toString(10);
    return `hsl(${hue}, 100%, 45%)`;
};
