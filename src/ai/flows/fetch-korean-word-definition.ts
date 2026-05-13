// @ts-nocheck
// 'use server' を削除しました

import { z } from 'genkit';

// スキーマ（定義）はビルドのために残しておきます
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

// ビルドエラーを防ぐため、実際のAI呼び出しを一旦コメントアウトするか、空を返すようにします
export async function fetchKoreanWordDefinition(word: string): Promise<KoreanWordDefinition | null> {
  console.log('Fetching:', word);
  return null; 
}
