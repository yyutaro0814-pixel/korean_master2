// @ts-nocheck
import { SearchBox } from '@/components/SearchBox';
import { DailyWord } from '@/components/DailyWord';
import { Navigation } from '@/components/Navigation';
import { BookMarked, Sparkles, GraduationCap } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row font-['Noto_Sans_JP',_sans-serif]">
      <aside className="w-full md:w-72 border-b md:border-b-0 md:border-r bg-card/50 backdrop-blur-xl z-10">
        <Navigation />
      </aside>
      
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto p-6 md:p-16 space-y-16">
          <header className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
              <GraduationCap className="w-4 h-4" />
              語彙力をレベルアップ
            </div>
            <h1 className="text-5xl md:text-7xl font-headline font-black text-foreground leading-[1.1]">
              안녕하세요. <br />
              <span className="text-muted-foreground font-medium">韓国語の世界へようこそ。</span>
            </h1>
          </header>

          <section className="relative">
            <SearchBox />
          </section>

          <section className="pt-4">
            <DailyWord />
          </section>

          <section className="grid md:grid-cols-2 gap-8">
            <div className="group p-8 rounded-[2.5rem] bg-card border border-border/50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
              <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BookMarked className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="font-bold text-xl text-foreground mb-3">マイ・ライブラリ</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                気になる単語をコレクションに追加。いつでも復習して、完全にマスターしましょう。
              </p>
            </div>
            <div className="group p-8 rounded-[2.5rem] bg-card border border-border/50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold text-xl text-foreground mb-3">AI 例文エンジン</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                文脈を理解するための多様な例文をAIが生成。単語のニュアンスを深く捉えます。
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
