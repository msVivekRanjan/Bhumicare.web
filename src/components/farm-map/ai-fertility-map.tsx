'use client';

import React, { useEffect, useRef, useState } from 'react';
import { APIProvider, Map, useMap, InfoWindow } from '@vis.gl/react-google-maps';
import { GOOGLE_MAPS_API_KEY } from '@/lib/constants';
import { MapLegend } from './map-legend';
import { Loader2 } from 'lucide-react';

// --- Mock Data and Services ---

// 1. Farmer's field coordinates (polygon) - A default is provided, but we will try to load from localStorage
const DEFAULT_FARMER_FIELD_COORDS = [
    { lat: 20.2465, lng: 85.8015 },
    { lat: 20.2465, lng: 85.8035 },
    { lat: 20.2450, lng: 85.8035 },
    { lat: 20.2450, lng: 85.8015 },
];

// 2. Simulated AI Service to get data for a grid cell
const mockGeminiService = {
    getSoilAnalysis: (lat: number, lng: number) => {
        // Simulate different values based on coordinates
        const moisture = (lat - 20.245) * 1000 + (lng - 85.8015) * 500; // Value 0-1
        const nutrients = (lng - 85.8015) * 500; // Value 0-1

        let moistureLevel, nutrientLevel;
        if (moisture < 0.33) moistureLevel = 'Low';
        else if (moisture < 0.66) moistureLevel = 'Optimal';
        else moistureLevel = 'High';

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

// --- Map Components ---

const DataGridOverlay = ({ onCellHover, fieldCoords }: { onCellHover: (data: any) => void, fieldCoords: {lat: number, lng: number}[] }) => {
    const map = useMap();
    const [gridPolygons, setGridPolygons] = useState<google.maps.Polygon[]>([]);

    useEffect(() => {
        if (!map) return;

        const bounds = new google.maps.LatLngBounds();
        fieldCoords.forEach(coord => bounds.extend(coord));
        map.fitBounds(bounds);

        const sw = bounds.getSouthWest();
        const ne = bounds.getNorthEast();

        const latStep = (ne.lat() - sw.lat()) / 5;
        const lngStep = (ne.lng() - sw.lng()) / 5;

        const newPolygons: google.maps.Polygon[] = [];

        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                const southWest = { lat: sw.lat() + i * latStep, lng: sw.lng() + j * lngStep };
                const northEast = { lat: sw.lat() + (i + 1) * latStep, lng: sw.lng() + (j + 1) * lngStep };

                const cellCenterLat = southWest.lat + latStep / 2;
                const cellCenterLng = southWest.lng + lngStep / 2;

                const analysis = mockGeminiService.getSoilAnalysis(cellCenterLat, cellCenterLng);
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

                polygon.addListener('mouseover', () => {
                    onCellHover((polygon as any).analysisData);
                });
                
                 polygon.addListener('mouseout', () => {
                    onCellHover(null);
                });

                newPolygons.push(polygon);
            }
        }
        setGridPolygons(newPolygons);

        // Cleanup function
        return () => {
            newPolygons.forEach(p => {
                google.maps.event.clearInstanceListeners(p);
                p.setMap(null);
            });
        };
    }, [map, onCellHover, fieldCoords]);

    return null;
};

const BivariateMap = () => {
    const [hoverData, setHoverData] = useState<any>(null);
    const [fieldCoords, setFieldCoords] = useState(DEFAULT_FARMER_FIELD_COORDS);

    useEffect(() => {
        const storedCoords = localStorage.getItem('bhumicare_field_coordinates');
        if (storedCoords) {
            try {
                const parsedCoords = JSON.parse(storedCoords);
                if (Array.isArray(parsedCoords) && parsedCoords.length > 0) {
                    setFieldCoords(parsedCoords);
                }
            } catch (error) {
                console.error("Failed to parse coordinates from localStorage", error);
            }
        }
    }, []);

    const handleCellHover = (data: any) => {
        setHoverData(data);
    };

    return (
        <>
            <DataGridOverlay onCellHover={handleCellHover} fieldCoords={fieldCoords} />
            {hoverData && (
                <InfoWindow
                    position={hoverData.coords}
                    onCloseClick={() => setHoverData(null)}
                    options={{ pixelOffset: new window.google.maps.Size(0, -30) }}
                >
                    <div className="p-2 text-black font-body">
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
                    defaultCenter={{ lat: 20.245763, lng: 85.802415 }}
                    defaultZoom={18}
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

// Helper to determine color based on two variables
export const getColor = (moistureLevel: 'Low' | 'Optimal' | 'High', nutrientLevel: 'Low' | 'Optimal' | 'High') => {
    // Corresponds to the legend: nutrient = columns, moisture = rows
    const colorMatrix = [
        // Nutrients: Low, Optimal, High
        ['#d67a7a', '#d6aa7a', '#cdd67a'], // Moisture: Low
        ['#7a8bd6', '#87d67a', '#a3d67a'], // Moisture: Optimal
        ['#7a7ad6', '#7ad6c0', '#7ad691'], // Moisture: High
    ];
    const nutrientMap = { 'Low': 0, 'Optimal': 1, 'High': 2 };
    const moistureMap = { 'Low': 0, 'Optimal': 1, 'High': 2 };

    return colorMatrix[moistureMap[moistureLevel]][nutrientMap[nutrientLevel]];
};
