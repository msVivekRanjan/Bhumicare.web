'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { APIProvider, Map, useMap, InfoWindow, AdvancedMarker } from '@vis.gl/react-google-maps';
import { GOOGLE_MAPS_API_KEY } from '@/lib/constants';
import { MapLegend } from './map-legend';
import { Button } from '../ui/button';
import { Loader2, LocateFixed, Undo, Expand, Shrink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getSmartRecommendation } from '@/ai/flows/smart-recommendations';
import { useTranslation } from '@/hooks/use-translation';
import { Skeleton } from '../ui/skeleton';
import ErrorBoundary from '../error-boundary';

const INDIA_CENTER = { lat: 20.5937, lng: 78.9629 };
const GRID_RESOLUTION = 7; // Use a 7x7 grid

type CellData = {
    id: string;
    polygon: google.maps.LatLngLiteral[];
    center: google.maps.LatLngLiteral;
    nitrogen: number;
    phosphorus: number;
    potassium: number;
    soilMoisture: number;
    fertilityIndex: number;
};

// --- Helper functions for client-side simulation ---
const calculateFertilityIndex = (data: { nitrogen: number, phosphorus: number, potassium: number, soilMoisture: number }): number => {
    const { nitrogen, phosphorus, potassium, soilMoisture } = data;

    // Normalize each parameter to a 0-1 scale where 1 is optimal
    const normN = 1 - Math.abs(150 - nitrogen) / 150; // Optimal at 150
    const normP = 1 - Math.abs(50 - phosphorus) / 50;   // Optimal at 50
    const normK = 1 - Math.abs(100 - potassium) / 100; // Optimal at 100
    const normMoisture = 1 - Math.abs(50 - soilMoisture) / 50; // Optimal at 50

    // Clamp values between 0 and 1
    const clampedValues = [normN, normP, normK, normMoisture].map(v => Math.max(0, Math.min(1, v)));
    
    // Weighted average
    const fertility = (clampedValues[0] * 0.4) + (clampedValues[1] * 0.2) + (clampedValues[2] * 0.2) + (clampedValues[3] * 0.2);
    
    return Math.max(0, Math.min(1, fertility));
};

const simulateSensorDataForGrid = (
    baseData: { nitrogen: number, phosphorus: number, potassium: number, soilMoisture: number },
    gridCells: {id: string, center: google.maps.LatLngLiteral}[]
): CellData[] => {
    return gridCells.map(cell => {
        // Create slight, logical variations based on coordinates
        const latFactor = (cell.center.lat % 0.01) * 100;
        const lngFactor = (cell.center.lng % 0.01) * 100;

        const simulatedData = {
            nitrogen: baseData.nitrogen + (latFactor - 5) * 2, // +/- 10
            phosphorus: baseData.phosphorus + (lngFactor - 5), // +/- 5
            potassium: baseData.potassium + (latFactor - lngFactor), // +/- 10
            soilMoisture: baseData.soilMoisture - (latFactor - 5), // +/- 5
        };

        const fertilityIndex = calculateFertilityIndex(simulatedData);
        
        const cellPoly = cell.id.split('_').map(Number);
        const i = cellPoly[1];
        const j = cellPoly[2];

        // This part is a placeholder as the actual polygons are created later.
        // We just need to pass the data through.
        const dummyPolygon = [
             { lat: 0, lng: 0 },
             { lat: 0, lng: 0 },
             { lat: 0, lng: 0 },
             { lat: 0, lng: 0 },
        ];

        return {
            id: cell.id,
            center: cell.center,
            polygon: dummyPolygon, // Will be replaced later
            ...simulatedData,
            fertilityIndex,
        };
    });
};
// --- End of helper functions ---


const BivariateMap = () => {
    const map = useMap();
    const { t } = useTranslation();
    const { toast } = useToast();

    const [hoverData, setHoverData] = useState<CellData | null>(null);
    const [fieldPath, setFieldPath] = useState<google.maps.LatLngLiteral[]>([]);
    const [isDefiningArea, setIsDefiningArea] = useState(false);
    const [markers, setMarkers] = useState<google.maps.LatLngLiteral[]>([]);
    
    const [gridPolygons, setGridPolygons] = useState<google.maps.Polygon[]>([]);
    const [fieldPolygon, setFieldPolygon] = useState<google.maps.Polygon | null>(null);
    const [tempPolygon, setTempPolygon] = useState<google.maps.Polygon | null>(null);

    const [isLoadingMap, setIsLoadingMap] = useState(false);
    const [mapData, setMapData] = useState<CellData[] | null>(null);
    
    const [infoWindowRecommendation, setInfoWindowRecommendation] = useState<string | null>(null);
    const [isRecommendationLoading, setIsRecommendationLoading] = useState(false);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [map, isDefiningArea]);

    const startDefiningArea = () => {
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

    const fetchRecommendationForCell = useCallback(async (cellData: CellData) => {
        setIsRecommendationLoading(true);
        setInfoWindowRecommendation(null);
        try {
            const recommendation = await getSmartRecommendation({
                soilMoisture: cellData.soilMoisture,
                lightLevel: 98, // Using a typical value
                gasLevel: 29,   // Using a typical value
                temperature: 32, // Using a typical value
                humidity: 74,  // Using a typical value
                nitrogen: cellData.nitrogen,
                phosphorus: cellData.phosphorus,
                potassium: cellData.potassium,
            });
            setInfoWindowRecommendation(recommendation.recommendation);
        } catch (error) {
            console.error("Failed to get recommendation for cell:", error);
            setInfoWindowRecommendation("Could not load recommendation.");
        } finally {
            setIsRecommendationLoading(false);
        }
    }, []);

    const onCellHover = useCallback((data: CellData | null) => {
        setHoverData(data);
        if(data) {
            fetchRecommendationForCell(data);
        } else {
            setInfoWindowRecommendation(null);
        }
    }, [fetchRecommendationForCell]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [map, fieldPath]);
    
    // Grid Generation and Simulation logic
    useEffect(() => {
        if (fieldPath.length < 3 || !map) return;

        setIsLoadingMap(true);
        setMapData(null);
        gridPolygons.forEach(p => p.setMap(null));
        setGridPolygons([]);

        const generateMap = async () => {
             if (!window.google || !window.google.maps.geometry) {
                toast({ variant: "destructive", title: "Map geometry library not loaded."});
                setIsLoadingMap(false);
                return;
             }
             const mainPolygonForCheck = new google.maps.Polygon({ paths: fieldPath });
             const bounds = new google.maps.LatLngBounds();
             fieldPath.forEach(p => bounds.extend(p));
             const sw = bounds.getSouthWest();
             const ne = bounds.getNorthEast();

             const cellsToAnalyze: {id: string, center: google.maps.LatLngLiteral}[] = [];
             const cellPolygons: {id: string, polygon: google.maps.LatLngLiteral[], center: google.maps.LatLngLiteral}[] = [];

             const latStep = (ne.lat() - sw.lat()) / GRID_RESOLUTION;
             const lngStep = (ne.lng() - sw.lng()) / GRID_RESOLUTION;

             for (let i = 0; i < GRID_RESOLUTION; i++) {
                 for (let j = 0; j < GRID_RESOLUTION; j++) {
                     const cellSW = { lat: sw.lat() + i * latStep, lng: sw.lng() + j * lngStep };
                     const cellNE = { lat: sw.lat() + (i + 1) * latStep, lng: sw.lng() + (j + 1) * lngStep };
                     const cellCenter = { lat: cellSW.lat + latStep / 2, lng: cellSW.lng + lngStep / 2 };
                    
                     if (google.maps.geometry.poly.containsLocation(new google.maps.LatLng(cellCenter), mainPolygonForCheck)) {
                         const id = `cell_${i}_${j}`;
                         cellsToAnalyze.push({ id, center: cellCenter });
                         cellPolygons.push({
                             id,
                             center: cellCenter,
                             polygon: [
                                 cellSW,
                                 { lat: cellSW.lat, lng: cellNE.lng },
                                 cellNE,
                                 { lat: cellNE.lat, lng: cellSW.lng }
                             ]
                         });
                     }
                 }
             }

            if(cellsToAnalyze.length === 0) {
                toast({ variant: "destructive", title: "No area to analyze", description: "The defined field area is too small."});
                setIsLoadingMap(false);
                return;
            };

            // Simulate the data on the client
            const baseData = { soilMoisture: 45, nitrogen: 150, phosphorus: 50, potassium: 100 };
            const result = simulateSensorDataForGrid(baseData, cellsToAnalyze);
            
            const combinedData: CellData[] = result.map(region => {
                const cellPoly = cellPolygons.find(p => p.id === region.id);
                return { ...region, polygon: cellPoly!.polygon, center: cellPoly!.center };
            });

            setMapData(combinedData);
            setIsLoadingMap(false);
        };

        // Added a timeout to simulate a quick loading process and prevent UI blocking on heavy fields
        setTimeout(generateMap, 100);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fieldPath, map, toast]);
    
    // Drawing polygons on map
    useEffect(() => {
        if (!map || !mapData) return;

        gridPolygons.forEach(p => p.setMap(null));
        const newGridPolygons: google.maps.Polygon[] = [];

        mapData.forEach(region => {
            const fertilityIndex = region.fertilityIndex;
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
    }, [map, mapData, onCellHover]);

    return (
        <>
            {isDefiningArea && markers.map((pos, index) => <AdvancedMarker key={index} position={pos} />)}

             {hoverData && window.google && (
                <InfoWindow
                    position={hoverData.center}
                    onCloseClick={() => setHoverData(null)}
                    options={{ pixelOffset: new window.google.maps.Size(0, -30) }}
                >
                    <div className="p-1 text-black font-body w-64">
                        <h4 className="font-bold text-base mb-2 font-headline">GPS Sensor: {hoverData.id}</h4>
                        <p className="text-xs font-mono">Lat: {hoverData.center.lat.toFixed(4)}, Lng: {hoverData.center.lng.toFixed(4)}</p>
                        <hr className="my-2"/>
                        <p className="text-xs"><b>Fertility Index:</b> {(hoverData.fertilityIndex * 100).toFixed(0)}%</p>
                        <p className="text-xs"><b>Moisture:</b> {hoverData.soilMoisture.toFixed(1)}%</p>
                        <p className="text-xs"><b>N:</b> {hoverData.nitrogen.toFixed(0)} | <b>P:</b> {hoverData.phosphorus.toFixed(0)} | <b>K:</b> {hoverData.potassium.toFixed(0)}</p>
                        <div className="mt-2 text-xs italic">
                           {isRecommendationLoading ? (
                            <div className="space-y-1">
                                <Skeleton className="h-3 w-full" />
                                <Skeleton className="h-3 w-3/4" />
                            </div>
                           ) : (
                            <p>{infoWindowRecommendation}</p>
                           )}
                        </div>
                    </div>
                </InfoWindow>
            )}

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
             
            <div className="absolute bottom-4 right-4 z-10">
                <MapLegend />
            </div>
        </>
    );
};

export function AIFertilityMap() {
    const [isMounted, setIsMounted] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const mapContainerRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        setIsMounted(true);
        const onFullscreenChange = () => {
          setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', onFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
    }, [])

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


    if(!isMounted) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-muted">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }
    
    return (
        <ErrorBoundary fallback={<p className='p-4 text-center text-destructive'>The map could not load. The Google Maps API key in `src/lib/constants.ts` is likely invalid or missing. Please replace it with your own key.</p>}>
            <APIProvider apiKey={GOOGLE_MAPS_API_KEY} libraries={['geometry']}>
                <div ref={mapContainerRef} className="w-full h-full relative bg-muted">
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
                        fullscreenControl={false}
                    >
                        <BivariateMap />
                    </Map>
                     <div className="absolute top-4 right-4 z-10">
                        <Button type="button" size="icon" variant="secondary" onClick={handleFullscreen} title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}>
                            {isFullscreen ? <Shrink className="h-5 w-5" /> : <Expand className="h-5 w-5" />}
                        </Button>
                    </div>
                </div>
            </APIProvider>
        </ErrorBoundary>
    );
}

export const getColorFromIndex = (fertilityIndex: number) => {
    const hue = (fertilityIndex * 120).toString(10);
    return `hsl(${hue}, 100%, 45%)`;
};
