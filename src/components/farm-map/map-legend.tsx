'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, ArrowRight, ArrowDown } from 'lucide-react';

// Bivariate color scheme: 3x3 grid
const colors = [
    ["#e8e8e8", "#b0d5df", "#64acbe"], // Low N, Low-High Moisture
    ["#e4acac", "#ad9ea5", "#627f8e"], // Medium N, Low-High Moisture
    ["#c85a5a", "#985356", "#574249"]  // High N, Low-High Moisture
];

// Define thresholds for Nitrogen and Soil Moisture
// Ideal N: 120-180 mg/kg
// Ideal Moisture: 40-60%
const nitrogenThresholds = { low: 100, high: 200 }; // Anything <100 is low, >200 is high
const moistureThresholds = { low: 30, high: 70 };   // Anything <30 is low, >70 is high

export const getBivariateColor = (nitrogen: number, moisture: number) => {
    let n_index = 1; // medium
    if (nitrogen < nitrogenThresholds.low) n_index = 0; // low
    else if (nitrogen > nitrogenThresholds.high) n_index = 2; // high

    let m_index = 1; // medium
    if (moisture < moistureThresholds.low) m_index = 0; // low
    else if (moisture > moistureThresholds.high) m_index = 2; // high
    
    // The color matrix is structured so that n_index determines the row, m_index determines the column
    return colors[n_index][m_index];
};


export function MapLegend() {
    const [isMinimized, setIsMinimized] = useState(true);

    return (
        <div className="bg-background/90 p-3 rounded-lg border border-border shadow-lg max-w-xs">
            <button onClick={() => setIsMinimized(!isMinimized)} className="w-full flex justify-between items-center cursor-pointer">
                <h3 className="font-headline text-sm font-semibold text-center">Bivariate Map Legend</h3>
                {isMinimized ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            
            {!isMinimized && (
                <div className="mt-3">
                    <div className="flex items-end gap-2">
                        {/* Y-Axis Label */}
                         <div className="flex items-center -rotate-90 -translate-x-6">
                            <p className="text-xs text-muted-foreground whitespace-nowrap">Nitrogen</p>
                             <ArrowRight className="h-3 w-3 ml-1 text-muted-foreground" />
                        </div>
                        
                        {/* 3x3 Color Grid */}
                        <div className="grid grid-cols-3 gap-0.5">
                            {colors.flat().map((color, index) => (
                                <div key={index} className="w-5 h-5" style={{ backgroundColor: color }} />
                            ))}
                        </div>
                    </div>
                     {/* X-Axis Label */}
                    <div className="flex items-center mt-1 ml-9">
                        <p className="text-xs text-muted-foreground">Soil Moisture</p>
                         <ArrowRight className="h-3 w-3 ml-1 text-muted-foreground" />
                    </div>
                    <p className="text-xs text-muted-foreground/80 mt-2">
                        This map shows the relationship between Nitrogen (N) and soil moisture. Darker shades indicate higher levels of N, while bluer shades indicate higher moisture.
                    </p>
                </div>
            )}
        </div>
    );
}
