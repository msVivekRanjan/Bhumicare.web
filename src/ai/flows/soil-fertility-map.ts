'use server';
/**
 * @fileOverview AI-powered soil fertility map flow.
 *
 * - generateSoilFertilityMap - A function that generates a soil fertility map based on sensor data.
 * - SoilFertilityMapInput - The input type for the generateSoilFertilityMap function.
 * - SoilFertilityMapOutput - The return type for the generateSoilFertilityMap function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GridCellInputSchema = z.object({
  id: z.string().describe('The unique identifier for this grid cell.'),
  center: z.object({lat: z.number(), lng: z.number()}).describe('The center coordinates of the grid cell.'),
});

const SoilFertilityMapInputSchema = z.object({
  soilMoisture: z.number().describe('The average soil moisture level for the whole field.'),
  nitrogen: z.number().describe('The average nitrogen (N) level for the whole field.'),
  phosphorus: z.number().describe('The average phosphorus (P) level for the whole field.'),
  potassium: z.number().describe('The average potassium (K) level for the whole field.'),
  gridCells: z.array(GridCellInputSchema).describe('An array of grid cells to be analyzed.'),
});
export type SoilFertilityMapInput = z.infer<typeof SoilFertilityMapInputSchema>;

const SubRegionDataSchema = z.object({
  id: z.string().describe('A unique identifier for the sub-region, matching the input ID.'),
  nitrogen: z.number().describe('The estimated nitrogen (N) level in this sub-region.'),
  phosphorus: z.number().describe('The estimated phosphorus (P) level in this sub-region.'),
  potassium: z.number().describe('The estimated potassium (K) level in this sub-region.'),
  soilMoisture: z.number().describe('The estimated soil moisture percentage in this sub-region.'),
  fertilityIndex: z.number().min(0).max(1).describe('A normalized (0-1) overall fertility index for this sub-region, derived from N, P, K, and moisture.'),
});

const SoilFertilityMapOutputSchema = z.object({
  subRegions: z.array(SubRegionDataSchema).describe('An array of analyzed data for each input sub-region.'),
});
export type SoilFertilityMapOutput = z.infer<typeof SoilFertilityMapOutputSchema>;

export async function generateSoilFertilityMap(
  input: SoilFertilityMapInput
): Promise<SoilFertilityMapOutput> {
  return soilFertilityMapFlow(input);
}

const soilFertilityMapPrompt = ai.definePrompt({
  name: 'soilFertilityMapPrompt',
  input: {schema: SoilFertilityMapInputSchema},
  output: {schema: SoilFertilityMapOutputSchema},
  prompt: `You are an expert agronomist. Your task is to analyze a list of grid cells representing a farm field and estimate their soil properties.

You are given the overall average sensor data for the entire field and a list of grid cells with their center coordinates.
For each grid cell in the input array, you must:
1.  Estimate the specific soil conditions (N, P, K, moisture) by introducing slight, logical spatial variations from the overall average data. Base the variation on the cell's coordinates; for instance, make adjacent cells have similar properties.
2.  Calculate a single 'fertilityIndex' (a normalized value from 0.0 for very poor to 1.0 for excellent) for each cell based on its estimated N, P, K, and moisture levels. The ideal range for N is 120-180, P is 40-60, and K is 90-120. Optimal moisture is 40-60%.
3.  Return an array of these analyses in the 'subRegions' field. Each element in the output array must correspond to a cell from the input 'gridCells' array, and must have the same 'id'.

Overall Average Sensor Data:
- Soil Moisture: {{soilMoisture}}%
- Nitrogen (N): {{nitrogen}} mg/kg
- Phosphorus (P): {{phosphorus}} mg/kg
- Potassium (K): {{potassium}} mg/kg

Grid cells to analyze:
{{{jsonStringify gridCells}}}

Your response MUST be a valid JSON object matching the specified output schema.
`,
});

const soilFertilityMapFlow = ai.defineFlow(
  {
    name: 'soilFertilityMapFlow',
    inputSchema: SoilFertilityMapInputSchema,
    outputSchema: SoilFertilityMapOutputSchema,
  },
  async input => {
    const {output} = await soilFertilityMapPrompt(input);
    return output!;
  }
);
