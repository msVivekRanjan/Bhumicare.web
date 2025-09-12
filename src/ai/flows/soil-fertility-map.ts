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

const SoilFertilityMapOutputSchema = z.object({
  fertilityMapDataUri: z
    .string()
    .describe(
      'A data URI containing the soil fertility map image as a bivariate choropleth, with color-coded nutrient and moisture levels.'
    ),
  recommendation: z.string().describe('Actionable recommendation based on soil analysis.'),
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
  prompt: `You are an expert soil scientist. Analyze the following soil data and generate a recommendation and soil fertility map:

Soil Data:
Moisture: {{soilMoisture}}
Light: {{lightLevel}}
Gas: {{gasLevel}}
Temperature: {{temperature}}
Humidity: {{humidity}}
Nitrogen: {{nitrogen}}
Phosphorus: {{phosphorus}}
Potassium: {{potassium}}
Field Coordinates: {{fieldCoordinates}}

Recommendation (actionable advice for the farmer):

Fertility Map Data URI (bivariate choropleth visualization as a data URI):
`, // Removed the Media URL
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
