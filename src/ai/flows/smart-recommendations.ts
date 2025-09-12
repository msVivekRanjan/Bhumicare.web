'use server';

/**
 * @fileOverview An AI agent that provides smart recommendations based on real-time soil sensor data.
 *
 * - getSmartRecommendation - A function that generates farming recommendations.
 * - SmartRecommendationInput - The input type for the getSmartRecommendation function.
 * - SmartRecommendationOutput - The return type for the getSmartRecommendation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SmartRecommendationInputSchema = z.object({
  soilMoisture: z.number().describe('The level of moisture in the soil.'),
  lightLevel: z.number().describe('The intensity of light the plant is receiving.'),
  gasLevel: z.number().describe('The level of gases in the soil.'),
  temperature: z.number().describe('The temperature of the soil in Celsius.'),
  humidity: z.number().describe('The humidity of the air.'),
  nitrogen: z.number().describe('The amount of nitrogen in the soil.'),
  phosphorus: z.number().describe('The amount of phosphorus in the soil.'),
  potassium: z.number().describe('The amount of potassium in the soil.'),
});
export type SmartRecommendationInput = z.infer<typeof SmartRecommendationInputSchema>;

const SmartRecommendationOutputSchema = z.object({
  recommendation: z.string().describe('The AI-driven recommendation for the farmer.'),
});
export type SmartRecommendationOutput = z.infer<typeof SmartRecommendationOutputSchema>;

export async function getSmartRecommendation(input: SmartRecommendationInput): Promise<SmartRecommendationOutput> {
  return smartRecommendationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'smartRecommendationPrompt',
  input: {schema: SmartRecommendationInputSchema},
  output: {schema: SmartRecommendationOutputSchema},
  prompt: `You are an AI assistant providing farming recommendations based on sensor data.

  Based on the following soil conditions:
  - Soil Moisture: {{{soilMoisture}}}
  - Light Level: {{{lightLevel}}}
  - Gas Level: {{{gasLevel}}}
  - Temperature: {{{temperature}}}
  - Humidity: {{{humidity}}}
  - Nitrogen: {{{nitrogen}}}
  - Phosphorus: {{{phosphorus}}}
  - Potassium: {{{potassium}}}

  Provide a concise, actionable recommendation to the farmer. Be specific with your advice.
  Ensure the recommendation is no more than 2 sentences long.
  Consider irrigation, fertilization, and other relevant farming practices.
`,
});

const smartRecommendationFlow = ai.defineFlow(
  {
    name: 'smartRecommendationFlow',
    inputSchema: SmartRecommendationInputSchema,
    outputSchema: SmartRecommendationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
