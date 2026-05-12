import { fetchKoreanWordDefinition as fetchAIKoreanDefinition, KoreanWordDefinition } from '@/ai/flows/fetch-korean-word-definition';

export type WordDefinition = KoreanWordDefinition;

export async function fetchWordDefinition(word: string): Promise<WordDefinition | null> {
  return fetchAIKoreanDefinition(word);
}

export const COMMON_WORDS = [
  "안녕하세요", "감사합니다", "친구", "사랑", "행복",
  "노력", "열정", "희망", "추억", "우주",
  "바다", "하늘", "미소", "노래", "마음"
];


export function getRandomWord() {
  const randomIndex = Math.floor(Math.random() * COMMON_WORDS.length);
  return COMMON_WORDS[randomIndex];
}