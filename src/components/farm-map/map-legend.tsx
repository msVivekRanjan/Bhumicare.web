'use client';

import { getColor } from './ai-fertility-map';

const moistureLevels = ['High', 'Optimal', 'Low'] as const;
const nutrientLevels = ['Low', 'Optimal', 'High'] as const;

export function MapLegend() {
    return (
        <div className="bg-background/80 backdrop-blur-sm p-3 rounded-lg border border-border shadow-lg">
            <h3 className="font-headline text-sm font-semibold mb-2 text-center">Legend</h3>
            <div className="flex items-center gap-4">
                <div className="flex flex-col-reverse items-center justify-between text-xs text-muted-foreground writing-mode-vertical-rl rotate-180">
                    <span>Low</span>
                    <span className='font-medium'>Soil Moisture</span>
                    <span>High</span>
                </div>
                <div className="flex flex-col gap-1">
                    {moistureLevels.map((moisture) => (
                        <div key={moisture} className="flex gap-1">
                            {nutrientLevels.map((nutrients) => (
                                <div
                                    key={nutrients}
                                    className="w-6 h-6 rounded-sm border border-black/20"
                                    style={{ backgroundColor: getColor(moisture, nutrients) }}
                                    title={`Moisture: ${moisture}, Nutrients: ${nutrients}`}
                                ></div>
                            ))}
                        </div>
                    ))}
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                       <span>Low</span>
                       <span>High</span>
                    </div>
                    <div className='text-xs text-muted-foreground text-center font-medium'>Nutrient Levels</div>
                </div>
            </div>
        </div>
    );
}

// Add this to your globals.css or a style tag if you don't have it for firefox support
// .writing-mode-vertical-rl { writing-mode: vertical-rl; }
