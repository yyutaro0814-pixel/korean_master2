
"use client";

import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { VocabularyGame } from '@/components/VocabularyGame';
import { Trophy, Zap, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function GamePage() {
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'feedback' | 'finished'>('idle');

  // プレイ中または結果表示中はナビゲーションを隠して全画面化
  const isImmersive = gameState !== 'idle';

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row font-['Noto_Sans_JP',_sans-serif] overflow-hidden">
      {/* 没入モード中はサイドバーを完全に消去 */}
      <aside className={cn(
        "w-full md:w-72 border-b md:border-b-0 md:border-r bg-card/50 backdrop-blur-xl z-30 transition-all duration-300",
        isImmersive ? "hidden md:hidden" : "block"
      )}>
        <Navigation />
      </aside>
      
      <main className="flex-1 bg-accent/5 relative overflow-hidden h-screen">
        <div className={cn(
          "max-w-4xl mx-auto h-full flex flex-col transition-all duration-300",
          isImmersive ? "max-w-full p-0" : "p-4 md:p-8"
        )}>
          {/* プレイ中・結果表示中はヘッダーを隠す */}
          <header className={cn(
            "flex items-center justify-between mb-4 transition-all duration-200 px-4",
            isImmersive ? "opacity-0 h-0 overflow-hidden mb-0" : "opacity-100"
          )}>
            <div className="space-y-0.5">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">
                <Zap className="w-3 h-3" />
                Live Training
              </div>
              <h1 className="text-2xl font-black text-foreground">単語キャッチャー</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-border/50">
                <Trophy className="w-4 h-4 text-yellow-500" />
                <span className="text-[10px] font-bold text-muted-foreground uppercase">ハイスコア</span>
                <span className="text-lg font-black text-foreground tabular-nums">1,250</span>
              </div>
              <Link href="/" className="p-2 hover:bg-white rounded-full transition-colors">
                <ArrowLeft className="w-5 h-5 text-muted-foreground" />
              </Link>
            </div>
          </header>

          <div className={cn(
            "flex-1 bg-white/40 backdrop-blur-sm transition-all duration-300 overflow-hidden",
            isImmersive ? "rounded-none border-none h-full" : "rounded-[2.5rem] border border-white/20 shadow-inner"
          )}>
            <VocabularyGame onStateChange={setGameState} />
          </div>
        </div>
      </main>
    </div>
  );
}
