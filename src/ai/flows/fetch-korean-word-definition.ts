'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const FetchKoreanWordDefinitionInputSchema = z.object({
  word: z.string().describe('The Korean word (or phrase) to look up.'),
});

const FetchKoreanWordDefinitionOutputSchema = z.object({
  word: z.string(),
  phonetic: z.string().optional(),
  phonetics: z.array(z.object({ text: z.string().optional() })),
  meanings: z.array(z.object({
    partOfSpeech: z.string(),
    definitions: z.array(z.object({
      definition: z.string(),
      example: z.string().optional(),
      synonyms: z.array(z.string()),
      antonyms: z.array(z.string()),
    })),
    synonyms: z.array(z.string()),
    antonyms: z.array(z.string()),
  })),
});

export type KoreanWordDefinition = z.infer<typeof FetchKoreanWordDefinitionOutputSchema>;

const prompt = ai.definePrompt({
  name: 'fetchKoreanWordDefinitionPrompt',
  input: { schema: FetchKoreanWordDefinitionInputSchema },
  output: { schema: FetchKoreanWordDefinitionOutputSchema },
  prompt: `あなたは優秀な韓国語・日本語のバイリンガル辞書編集者です。
韓国語の単語 '{{{word}}}' について、詳細な定義を日本語で提供してください。
出力は指定されたJSONスキーマに従ってください。

- phonetic: その単語のカタカタ読み（例：アニョハセヨ）
- partOfSpeech: 品詞（名詞、動詞、形容詞など）
- definition: 日本語での意味
- example: その単語を使った短い例文とその日本語訳
- synonyms: 類義語あれば
`,
});

export async function fetchKoreanWordDefinition(word: string): Promise<KoreanWordDefinition | null> {
  try {
    const { output } = await prompt({ word });
    return output!;
  } catch (error) {
    console.error('Error fetching Korean word definition:', error);
    return null;
  }
}
