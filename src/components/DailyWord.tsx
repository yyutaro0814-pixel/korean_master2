"use client";

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight, Zap } from 'lucide-react';
import { getRandomWord } from '@/lib/dictionary';
import Link from 'next/link';

export function DailyWord() {
  const [word, setWord] = useState<string>('');

  useEffect(() => {
    setWord(getRandomWord());
  }, []);

  if (!word) return null;

  return (
    <Card className="border-none shadow-2xl bg-[#1a1a1a] text-white overflow-hidden relative group rounded-[3rem]">
      <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(50,150,255,0.2),transparent_50%)] pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 text-white/5 group-hover:text-white/10 transition-colors duration-700">
        <Sparkles size={300} strokeWidth={0.5} />
      </div>
      
      <CardHeader className="relative z-10 p-10 pb-4">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <Zap className="w-4 h-4 text-primary" />
          </div>
          <CardDescription className="uppercase tracking-[0.2em] text-[10px] font-black text-primary">
            今日のピックアップ
          </CardDescription>
        </div>
        <CardTitle className="text-6xl md:text-7xl font-headline font-bold text-white tracking-tighter leading-none mb-4 capitalize">
          {word}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="relative z-10 p-10 pt-0">
        <p className="text-white/60 text-lg leading-relaxed mb-10 max-w-lg font-light">
          今日の新しい言葉は <span className="text-white font-medium underline underline-offset-8 decoration-primary/50">"{word}"</span> です。その起源、意味、そして実際の使用シーンを深く探ってみましょう。
        </p>
        <Button asChild size="lg" className="rounded-2xl px-8 h-16 bg-white text-black hover:bg-white/90 shadow-xl transition-all hover:translate-x-1">
          <Link href={`/word/${word.toLowerCase()}`} className="text-base font-bold">
            詳しく見る <ArrowRight className="ml-3 w-5 h-5" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
