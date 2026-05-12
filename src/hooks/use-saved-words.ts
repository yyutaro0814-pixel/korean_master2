import { useState, useEffect } from 'react';

export function useSavedWords() {
  const [savedWords, setSavedWords] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('lexilink_saved_words');
    if (saved) {
      setSavedWords(JSON.parse(saved));
    }
  }, []);

  const saveWord = (word: string) => {
    const wordLower = word.toLowerCase();
    if (!savedWords.includes(wordLower)) {
      const newList = [...savedWords, wordLower];
      setSavedWords(newList);
      localStorage.setItem('lexilink_saved_words', JSON.stringify(newList));
    }
  };

  const removeWord = (word: string) => {
    const newList = savedWords.filter(w => w !== word.toLowerCase());
    setSavedWords(newList);
    localStorage.setItem('lexilink_saved_words', JSON.stringify(newList));
  };

  const isWordSaved = (word: string) => savedWords.includes(word.toLowerCase());

  return { savedWords, saveWord, removeWord, isWordSaved };
}