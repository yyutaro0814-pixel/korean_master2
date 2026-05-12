'use server';
/**
 * @fileOverview A Genkit flow that generates example sentences for a given English word.
 *
 * - generateExampleSentences - A function that handles the generation of example sentences.
 * - GenerateExampleSentencesInput - The input type for the generateExampleSentences function.
 * - GenerateExampleSentencesOutput - The return type for the generateExampleSentences function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateExampleSentencesInputSchema = z.object({
  word: z.string().describe('The English word for which to generate example sentences.'),
});
export type GenerateExampleSentencesInput = z.infer<
  typeof GenerateExampleSentencesInputSchema
>;

const GenerateExampleSentencesOutputSchema = z.object({
  sentences: z.array(z.string()).describe('An array of AI-generated example sentences for the word.'),
});
export type GenerateExampleSentencesOutput = z.infer<
  typeof GenerateExampleSentencesOutputSchema
>;

const prompt = ai.definePrompt({
  name: 'generateExampleSentencesPrompt',
  input: {schema: GenerateExampleSentencesInputSchema},
  output: {schema: GenerateExampleSentencesOutputSchema},
  prompt: `あなたは優秀な韓国語講師です。韓国語の単語 '{{{word}}}' を使った、多様で自然な例文を生成してください。
少なくとも5つの例文を提供してください。
例文は、その単語の様々な文脈や文法的な使用法を示すものである必要があります。
各例文には日本語の訳も付けてください。形式は "韓国語例文 - 日本語訳" としてください。
例文が文法的に正しく、学習に適していることを確認してください。`,
});

const generateExampleSentencesFlow = ai.defineFlow(
  {
    name: 'generateExampleSentencesFlow',
    inputSchema: GenerateExampleSentencesInputSchema,
    outputSchema: GenerateExampleSentencesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

export async function generateExampleSentences(
  input: GenerateExampleSentencesInput
): Promise<GenerateExampleSentencesOutput> {
  return generateExampleSentencesFlow(input);
}
