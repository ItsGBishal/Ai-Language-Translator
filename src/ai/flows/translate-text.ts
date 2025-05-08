'use server';

/**
 * @fileOverview A real-time text translation AI agent.
 *
 * - translateText - A function that handles the text translation process.
 * - TranslateTextInput - The input type for the translateText function.
 * - TranslateTextOutput - The return type for the translateText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TranslateTextInputSchema = z.object({
  text: z.string().describe('The text to translate.'),
  sourceLanguage: z.string().describe('The source language of the text.'),
  targetLanguage: z.string().describe('The target language to translate the text to.'),
});
export type TranslateTextInput = z.infer<typeof TranslateTextInputSchema>;

const TranslateTextOutputSchema = z.object({
  translatedText: z.string().describe('The translated text.'),
});
export type TranslateTextOutput = z.infer<typeof TranslateTextOutputSchema>;

export async function translateText(input: TranslateTextInput): Promise<TranslateTextOutput> {
  return translateTextFlow(input);
}

const grammarTool = ai.defineTool({
  name: 'grammarTool',
  description: 'This tool helps the model to decide when and if to incorporate specific grammar rules in the translation.',
  inputSchema: z.object({
    text: z.string().describe('The text to translate.'),
    sourceLanguage: z.string().describe('The source language of the text.'),
    targetLanguage: z.string().describe('The target language to translate the text to.'),
  }),
  outputSchema: z.string(),
},
async (input) => {
  return `Apply grammar rules for ${input.sourceLanguage} to ${input.targetLanguage}`;
});

const prompt = ai.definePrompt({
  name: 'translateTextPrompt',
  input: {schema: TranslateTextInputSchema},
  output: {schema: TranslateTextOutputSchema},
  tools: [grammarTool],
  prompt: `You are a translation expert. Translate the text from the source language to the target language. 

Source Language: {{{sourceLanguage}}}
Target Language: {{{targetLanguage}}}
Text: {{{text}}}`,
});

const translateTextFlow = ai.defineFlow(
  {
    name: 'translateTextFlow',
    inputSchema: TranslateTextInputSchema,
    outputSchema: TranslateTextOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
