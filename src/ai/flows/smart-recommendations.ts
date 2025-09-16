'use server';

/**
 * @fileOverview An AI agent that provides smart recommendations based on real-time soil sensor data.
 *
 * - getSmartRecommendation - A function that generates farming recommendations.
 * - SmartRecommendationInput - The input type for the getSmartRecommendation function.
 * - SmartRecommendationOutput - The return type for the getSmartRecommendation function.
 */

import {ai} from '@/ai/config';
import {z} from 'genkit';

const SmartRecommendationInputSchema = z.object({
  soilMoisture: z.number().describe('The level of moisture in the soil.'),
  lightLevel: z.number().describe('The intensity of light the plant is receiving.'),
  gasLevel: z.number().describe('The level of gases in the soil.'),
  temperature: z.number().describe('The temperature of the soil in Celsius.'),
  humidity: z.number().describe('The humidity of the air.'),
  nitrogen: z.number().describe('The amount of nitrogen in the soil (in mg/kg).'),
  phosphorus: z.number().describe('The amount of phosphorus in the soil (in mg/kg).'),
  potassium: z.number().describe('The amount of potassium in the soil (in mg/kg).'),
});
export type SmartRecommendationInput = z.infer<typeof SmartRecommendationInputSchema>;

const SmartRecommendationOutputSchema = z.object({
  overallAssessment: z.string().describe("A one-sentence summary of the farm's current condition."),
  irrigation: z.string().describe('Specific, actionable advice on watering and irrigation.'),
  fertilization: z.string().describe('Specific, actionable advice on nutrient and fertilizer management.'),
  cropHealth: z.string().describe('General advice related to crop health, pest control, or other environmental factors.'),
});
export type SmartRecommendationOutput = z.infer<typeof SmartRecommendationOutputSchema>;

export async function getSmartRecommendation(input: SmartRecommendationInput): Promise<SmartRecommendationOutput> {
  return smartRecommendationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'smartRecommendationPrompt',
  input: {schema: SmartRecommendationInputSchema},
  output: {schema: SmartRecommendationOutputSchema},
  prompt: `You are an experienced agricultural expert advising an Indian farmer. Your language should be simple, clear, and direct.

Analyze the following real-time sensor data from the field and provide a structured set of recommendations.
Ideal Ranges for a typical crop like wheat or maize:
- Soil Moisture: 40-60%
- Temperature: 20-32°C
- Nitrogen (N): 120-180 mg/kg
- Phosphorus (P): 40-60 mg/kg
- Potassium (K): 100-150 mg/kg

Current Sensor Data:
- Soil Moisture: {{{soilMoisture}}}%
- Temperature: {{{temperature}}}°C
- Humidity: {{{humidity}}}%
- Nitrogen: {{{nitrogen}}} mg/kg
- Phosphorus: {{{phosphorus}}} mg/kg
- Potassium: {{{potassium}}} mg/kg

Based on this data, provide a detailed, structured recommendation.

1.  **Overall Assessment:** Start with a one-sentence summary of the situation.
2.  **Irrigation Advice:** If soil moisture is too low or too high, give a specific instruction (e.g., "Irrigate the field with 1 inch of water immediately," or "Stop irrigation for 2 days to let the soil dry."). If it's optimal, say so.
3.  **Fertilizer Advice:** Check N, P, and K levels.
    - If a nutrient is low, recommend a specific, common fertilizer (e.g., "Apply 25 kg of Urea per acre to increase Nitrogen.").
    - If a nutrient is high, advise reducing its application.
    - If all are optimal, state that nutrient levels are good.
4.  **Crop Health Advice:** Provide one additional tip based on the temperature or humidity. For example, if humidity is high, warn about fungal risk. If temperature is high, suggest checking for signs of heat stress.
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
