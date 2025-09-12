'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { APIProvider, Map, useMap, InfoWindow, AdvancedMarker } from '@vis.gl/react-google-maps';
import { GOOGLE_MAPS_API_KEY } from '@/lib/constants';
import { MapLegend } from './map-legend';
import { Button } from '../ui/button';
import { Loader2 } from 'lucide-react';

const INDIA_CENTER = { lat: 20.5937, lng: 78.9629 };

const mockGeminiService = {
    getSoilAnalysis: (lat: number, lng: number) => {
        const moisture = Math.random();
        const nutrients = Math.random();

        let moistureLevel: 'Low' | 'Optimal' | 'High';
        if (moisture < 0.33) moistureLevel = 'Low';
        else if (moisture < 0.66) moistureLevel = 'Optimal';
        else moistureLevel = 'High';

        let nutrientLevel: 'Low' | 'Optimal' | 'High';
        if (nutrients < 0.33) nutrientLevel = 'Low';
        else if (nutrients < 0.66) nutrientLevel = 'Optimal';
        else nutrientLevel = 'High';

        return {
            coords: { lat, lng },
            moisture: { value: parseFloat(moisture.toFixed(2)), level: moistureLevel },
            nutrients: { value: parseFloat(nutrients.toFixed(2)), level: nutrientLevel },
            nitrogen: Math.floor(50 + nutrients * 100),
            phosphorus: Math.floor(20 + nutrients * 50),
            diagnosis: `Conditions are ${nutrientLevel.toLowerCase()} and moisture is ${moistureLevel.toLowerCase()}.`,
        };
    },
};

type CellData = ReturnType<typeof mockGeminiService.getSoilAnalysis>;

const BivariateMap = () => {
    const map = useMap();
    const [hoverData, setHoverData] = useState<CellData | null>(null);
    const [fieldPath, setFieldPath] = useState<google.maps.LatLngLiteral[]>([]);
    const [isDefiningArea, setIsDefiningArea] = useState(false);
    const [markers, setMarkers] = useState<google.maps.LatLngLiteral[]>([]);
    const [gridPolygons, setGridPolygons] = useState<google.maps.Polygon[]>([]);
    const [fieldPolygon, setFieldPolygon] = useState<google.maps.Polygon | null>(null);

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
                }
            } catch (e) { console.error("Failed to parse stored polygon"); }
        }
    }, [map]);

    const handleMapClick = (e: google.maps.MapMouseEvent) => {
        if (!isDefiningArea || !e.latLng) return;
        const newMarker = { lat: e.latLng.lat(), lng: e.latLng.lng() };
        setMarkers(prev => [...prev, newMarker]);
    };

    const startDefiningArea = () => {
        // Clear existing grid and field polygons from the map
        gridPolygons.forEach(p => p.setMap(null));
        setGridPolygons([]);
        fieldPolygon?.setMap(null);
        setFieldPolygon(null);
        
        setFieldPath([]);
        setMarkers([]);
        setIsDefiningArea(true);
        setHoverData(null);
    };
    
    const finishDefiningArea = useCallback(() => {
        if (markers.length < 3) {
            alert("Please mark at least 3 points to form a field area.");
            return;
        }
        setFieldPath(markers);
        localStorage.setItem('bhumicare_field_coordinates', JSON.stringify(markers));
        setIsDefiningArea(false);
        setMarkers([]); // Clear temporary markers
    }, [markers]);

    const undoLastMarker = () => {
        setMarkers(prev => prev.slice(0, -1));
    };
    
    useEffect(() => {
        if (!map) return;
        const clickListener = map.addListener('click', handleMapClick);
        return () => {
            clickListener.remove();
        }
    }, [map, isDefiningArea, handleMapClick]);

    // Effect to draw the main field polygon
    useEffect(() => {
        if (!map || fieldPath.length < 3) return;

        fieldPolygon?.setMap(null); // Clear previous polygon

        const newFieldPolygon = new google.maps.Polygon({
            paths: fieldPath,
            fillColor: "#00FF00",
            fillOpacity: 0.1,
            strokeColor: "#00FF00",
            strokeWeight: 2,
            map: map,
        });

        const bounds = new google.maps.LatLngBounds();
        fieldPath.forEach(coord => bounds.extend(coord));
        map.fitBounds(bounds);
        setFieldPolygon(newFieldPolygon);

        return () => {
            newFieldPolygon.setMap(null);
        }
    }, [map, fieldPath]);


    // Effect to generate and display the grid
    useEffect(() => {
        if (!map || fieldPath.length < 3) return;

        // Clean up old polygons
        gridPolygons.forEach(p => p.setMap(null));

        const bounds = new google.maps.LatLngBounds();
        fieldPath.forEach(p => bounds.extend(p));
        const sw = bounds.getSouthWest();
        const ne = bounds.getNorthEast();

        const latStep = (ne.lat() - sw.lat()) / 5;
        const lngStep = (ne.lng() - sw.lng()) / 5;

        const newGridPolygons: google.maps.Polygon[] = [];

        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                const southWest = { lat: sw.lat() + i * latStep, lng: sw.lng() + j * lngStep };
                const northEast = { lat: sw.lat() + (i + 1) * latStep, lng: sw.lng() + (j + 1) * lngStep };
                
                const cellCenter = new google.maps.LatLng(southWest.lat + latStep / 2, southWest.lng + lngStep / 2);

                const analysis = mockGeminiService.getSoilAnalysis(cellCenter.lat(), cellCenter.lng());
                const color = getColor(analysis.moisture.level, analysis.nutrients.level);

                const polygon = new google.maps.Polygon({
                    paths: [
                        { lat: southWest.lat, lng: southWest.lng },
                        { lat: northEast.lat, lng: southWest.lng },
                        { lat: northEast.lat, lng: northEast.lng },
                        { lat: southWest.lat, lng: northEast.lng },
                    ],
                    strokeColor: '#FFFFFF',
                    strokeOpacity: 0.1,
                    strokeWeight: 1,
                    fillColor: color,
                    fillOpacity: 0.7,
                    map: map,
                });
                
                (polygon as any).analysisData = analysis;

                polygon.addListener('mouseover', () => onCellHover((polygon as any).analysisData));
                polygon.addListener('mouseout', () => onCellHover(null));

                newGridPolygons.push(polygon);
            }
        }
        setGridPolygons(newGridPolygons);

        return () => {
            newGridPolygons.forEach(p => {
                google.maps.event.clearInstanceListeners(p);
                p.setMap(null)
            });
        };
    }, [map, fieldPath, onCellHover]);

    return (
        <>
            {markers.map((pos, index) => <AdvancedMarker key={index} position={pos} />)}

             {hoverData && (
                <InfoWindow
                    position={hoverData.coords}
                    onCloseClick={() => setHoverData(null)}
                    options={{ pixelOffset: new window.google.maps.Size(0, -30) }}
                >
                    <div className="p-2 text-black font-body w-48">
                        <h4 className="font-bold text-base mb-2 font-headline">Cell Analysis</h4>
                        <p><b>Moisture:</b> {hoverData.moisture.value * 100}% ({hoverData.moisture.level})</p>
                        <p><b>N:</b> {hoverData.nitrogen} kg/ha</p>
                        <p><b>P:</b> {hoverData.phosphorus} kg/ha</p>
                        <p className="mt-2 text-xs italic">
                            <b>AI Diagnosis:</b> {hoverData.diagnosis}
                        </p>
                    </div>
                </InfoWindow>
            )}
             <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-2">
                {!isDefiningArea && (
                    <Button onClick={startDefiningArea}>Define Field Area</Button>
                )}
                 {isDefiningArea && (
                    <>
                        <Button onClick={finishDefiningArea}>Generate Fertility Map</Button>
                        <Button onClick={undoLastMarker} variant="secondary" disabled={markers.length === 0}>Undo Last Point</Button>
                         <Button onClick={() => setIsDefiningArea(false)} variant="ghost">Cancel</Button>
                    </>
                )}
            </div>
             {isDefiningArea && (
                 <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-background/80 p-2 rounded-md shadow-lg text-center">
                    <p className="text-sm text-muted-foreground">Click on the map to mark the corners of your field.</p>
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
        <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
            <div className="w-full h-full relative">
                <Map
                    defaultCenter={INDIA_CENTER}
                    defaultZoom={5}
                    gestureHandling={'cooperative'}
                    disableDefaultUI={true}
                    mapId={'bhumicare_ai_fertility_map'}
                    mapTypeId="satellite"
                >
                    <BivariateMap />
                </Map>
                <div className="absolute bottom-4 right-4">
                    <MapLegend />
                </div>
            </div>
        </APIProvider>
    );
}

export const getColor = (moistureLevel: 'Low' | 'Optimal' | 'High', nutrientLevel: 'Low' | 'Optimal' | 'High') => {
    const colorMatrix = [
        ['#d67a7a', '#d6aa7a', '#cdd67a'], // Moisture: Low
        ['#7a8bd6', '#87d67a', '#a3d67a'], // Moisture: Optimal
        ['#7a7ad6', '#7ad6c0', '#7ad691'], // Moisture: High
    ];
    const nutrientMap = { 'Low': 0, 'Optimal': 1, 'High': 2 };
    const moistureMap = { 'Low': 0, 'Optimal': 1, 'High': 2 };

    return colorMatrix[moistureMap[moistureLevel]][nutrientMap[nutrientLevel]];
};
