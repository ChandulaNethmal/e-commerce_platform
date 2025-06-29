'use server';

/**
 * @fileOverview Personalized flower arrangement recommendations based on occasion, recipient, and browsing history.
 *
 * - recommendFlowers - A function to get flower recommendations.
 * - FlowerRecommendationInput - The input type for the recommendFlowers function.
 * - FlowerRecommendationOutput - The return type for the recommendFlowers function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FlowerRecommendationInputSchema = z.object({
  occasion: z
    .string()
    .describe('The occasion for which flowers are needed (e.g., birthday, anniversary).'),
  recipient: z
    .string()
    .describe('The recipient of the flowers (e.g., mother, friend, significant other).'),
  browsingHistory: z
    .string()
    .optional()
    .describe('The user\'s past browsing history (e.g., list of flower types or colors viewed).'),
});
export type FlowerRecommendationInput = z.infer<typeof FlowerRecommendationInputSchema>;

const FlowerRecommendationOutputSchema = z.object({
  recommendation: z
    .string()
    .describe('A personalized flower arrangement recommendation based on the input.'),
  reasoning: z
    .string()
    .optional()
    .describe('The reasoning behind the flower recommendation.'),
});
export type FlowerRecommendationOutput = z.infer<typeof FlowerRecommendationOutputSchema>;

export async function recommendFlowers(input: FlowerRecommendationInput): Promise<FlowerRecommendationOutput> {
  return recommendFlowersFlow(input);
}

const prompt = ai.definePrompt({
  name: 'flowerRecommendationPrompt',
  input: {schema: FlowerRecommendationInputSchema},
  output: {schema: FlowerRecommendationOutputSchema},
  prompt: `You are a floral expert providing personalized flower arrangement recommendations.

  Based on the occasion, recipient, and browsing history, recommend a flower arrangement.

  Occasion: {{{occasion}}}
  Recipient: {{{recipient}}}
  Browsing History: {{{browsingHistory}}}

  Recommendation:`,
});

const recommendFlowersFlow = ai.defineFlow(
  {
    name: 'recommendFlowersFlow',
    inputSchema: FlowerRecommendationInputSchema,
    outputSchema: FlowerRecommendationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
