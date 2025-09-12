'use client';

import { useState } from 'react';
import { getColorFromIndex } from './ai-fertility-map';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '../ui/button';

const levels = [1, 0.8, 0.6, 0.4, 0.2, 0];

export function MapLegend() {
    const [isMinimized, setIsMinimized] = useState(false);

    return (
        <div className="bg-background/90 p-3 rounded-lg border border-border shadow-lg">
            <button onClick={() => setIsMinimized(!isMinimized)} className="w-full flex justify-between items-center cursor-pointer">
                <h3 className="font-headline text-sm font-semibold text-center">Fertility Index</h3>
                {isMinimized ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
            </button>
            
            {!isMinimized && (
                <div className="mt-2">
                    <div className="flex items-center gap-2">
                        <div className="flex flex-col gap-1">
                            {levels.map((level) => (
                                <div key={level} className="flex items-center gap-2">
                                    <div
                                        className="w-5 h-5 rounded-sm border border-black/20"
                                        style={{ backgroundColor: getColorFromIndex(level) }}
                                    ></div>
                                    <span className="text-xs text-muted-foreground">{(level * 100).toFixed(0)}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground mt-1 px-1">
                        <span>Poor</span>
                        <span>Excellent</span>
                    </div>
                </div>
            )}
        </div>
    );
}
