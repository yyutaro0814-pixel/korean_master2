"use client";

import { useSavedWords } from '@/hooks/use-saved-words';
import { Navigation } from '@/components/Navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bookmark, Trash2, ArrowRight, BookOpen } from 'lucide-react';
import Link from 'next/link';

export default function SavedWordsPage() {
  const { savedWords, removeWord } = useSavedWords();

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row font-['Noto_Sans_JP',_sans-serif]">
      <aside className="w-full md:w-72 border-b md:border-b-0 md:border-r bg-card/50 backdrop-blur-xl z-10">
        <Navigation />
      </aside>
      
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-6 md:p-12 space-y-12">
          <header className="space-y-2">
            <div className="flex items-center gap-3 text-secondary mb-2">
              <Bookmark className="w-6 h-6" />
              <h2 className="text-sm font-bold uppercase tracking-widest">Library</h2>
            </div>
            <h1 className="text-4xl font-black text-foreground">保存した単語</h1>
            <p className="text-muted-foreground">現在、{savedWords.length} 個の単語がリストにあります。</p>
          </header>

          {savedWords.length === 0 ? (
            <div className="text-center py-24 px-6 rounded-3xl border-2 border-dashed border-accent flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mb-2">
                <BookOpen className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-xl font-bold">ライブラリは空です</h3>
              <p className="text-muted-foreground max-w-xs mx-auto">新しい単語を検索して、忘れたくないものを保存しましょう。</p>
              <Button asChild className="rounded-xl px-8 h-12">
                <Link href="/">単語を探す</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedWords.map((word) => (
                <Card key={word} className="border-none shadow-sm group hover:shadow-md transition-all overflow-hidden bg-white">
                  <CardContent className="p-0">
                    <div className="flex items-center justify-between p-6">
                      <div className="space-y-1">
                        <h3 className="text-xl font-bold capitalize text-foreground">{word}</h3>
                        <Link href={`/word/${word}`} className="text-sm text-secondary hover:underline flex items-center gap-1 transition-all group-hover:gap-2">
                          詳細を表示 <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-muted-foreground hover:text-destructive transition-colors rounded-xl"
                        onClick={() => removeWord(word)}
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
