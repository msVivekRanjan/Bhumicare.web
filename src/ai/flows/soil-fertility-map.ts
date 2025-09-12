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

const SoilFertilityMapInputSchema = z.object({
  soilMoisture: z.number().describe('The soil moisture level.'),
  lightLevel: z.number().describe('The light level.'),
  gasLevel: z.number().describe('The gas level.'),
  temperature: z.number().describe('The temperature.'),
  humidity: z.number().describe('The humidity.'),
  nitrogen: z.number().describe('Nitrogen level in the soil.'),
  phosphorus: z.number().describe('Phosphorus level in the soil.'),
  potassium: z.number().describe('Potassium level in the soil.'),
  fieldCoordinates: z.string().describe('Polygon coordinates of the farm field.'),
});
export type SoilFertilityMapInput = z.infer<typeof SoilFertilityMapInputSchema>;

const SubRegionDataSchema = z.object({
  id: z.string().describe('A unique identifier for the sub-region.'),
  polygon: z.array(z.object({lat: z.number(), lng: z.number()})).describe('The coordinates defining the sub-region polygon.'),
  nitrogen: z.number().describe('The nitrogen (N) level in this sub-region.'),
  phosphorus: z.number().describe('The phosphorus (P) level in this sub-region.'),
  potassium: z.number().describe('The potassium (K) level in this sub-region.'),
  soilMoisture: z.number().describe('The soil moisture percentage in this sub-region.'),
  fertilityIndex: z.number().min(0).max(1).describe('A normalized (0-1) overall fertility index for this sub-region.'),
  recommendation: z.string().describe('A brief, one-sentence recommendation for this specific sub-region.'),
});

const SoilFertilityMapOutputSchema = z.object({
  subRegions: z.array(SubRegionDataSchema).describe('An array of data for each sub-region of the field.'),
  overallRecommendation: z.string().describe('An overall recommendation for the entire field based on the analysis of all sub-regions.'),
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
  prompt: `You are an expert agronomist and soil scientist. Your task is to analyze sensor data for a given farm field and provide a detailed breakdown for a choropleth map.

Based on the overall sensor data and the field's boundary coordinates, you must:
1.  Divide the field into 4 logical, equal-area quadrilateral sub-regions (e.g., North-West, North-East, South-West, South-East).
2.  For each sub-region, estimate the specific soil conditions (N, P, K, moisture) by introducing slight, logical variations from the overall sensor data. For example, one area might be slightly drier, another might have lower nitrogen.
3.  Calculate a single 'fertilityIndex' (a normalized value from 0.0 for very poor to 1.0 for excellent) for each sub-region based on its specific conditions.
4.  Provide a concise, one-sentence farming recommendation for each specific sub-region.
5.  Provide a brief, overall recommendation for the entire field.
6.  Return the data structured according to the output schema.

Overall Sensor Data:
- Soil Moisture: {{soilMoisture}}%
- Temperature: {{temperature}}°C
- Humidity: {{humidity}}%
- Nitrogen (N): {{nitrogen}} mg/kg
- Phosphorus (P): {{phosphorus}} mg/kg
- Potassium (K): {{potassium}} mg/kg

Field Boundary (as a JSON string of LatLng literals):
{{fieldCoordinates}}

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
