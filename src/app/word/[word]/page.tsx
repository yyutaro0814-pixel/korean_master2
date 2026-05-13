"use client";

import { useEffect, useState, use } from 'react';
import { fetchWordDefinition, WordDefinition } from '@/lib/dictionary';
import { Navigation } from '@/components/Navigation';
import { AIGeneratedSentences } from '@/components/AIGeneratedSentences';
import { Button } from '@/components/ui/button';
import { useSavedWords } from '@/hooks/use-saved-words';
import { Bookmark, BookmarkCheck, Volume2, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export default function WordDetailPage({ params }: { params: Promise<{ word: string }> }) {
  const { word: wordParam } = use(params);
  const [definition, setDefinition] = useState<WordDefinition | null>(null);
  const [loading, setLoading] = useState(true);
  const { isWordSaved, saveWord, removeWord } = useSavedWords();

  useEffect(() => {
    async function load() {
      const data = await fetchWordDefinition(wordParam);
      setDefinition(data);
      setLoading(false);
    }
    load();
  }, [wordParam]);

  const handleToggleSave = () => {
    if (isWordSaved(wordParam)) {
      removeWord(wordParam);
    } else {
      saveWord(wordParam);
    }
  };
    const playAudio = () => {
    // どんなデータが来てもエラーにしない「any」を使ってチェックを回避します
    const phoneticWithAudio = definition?.phonetics?.find((p: any) => p.audio);
    const audioUrl = (phoneticWithAudio as any)?.audio;
    
    if (audioUrl) {
      new Audio(audioUrl).play();
    }
  };


  

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!definition) {
    return (
      <div className="min-h-screen bg-background flex flex-col md:flex-row font-['Noto_Sans_JP']">
        <aside className="w-full md:w-72 border-b md:border-b-0 md:border-r bg-card/50 backdrop-blur-xl z-10">
          <Navigation />
        </aside>
        <main className="flex-1 p-12 flex flex-col items-center justify-center space-y-6">
          <h2 className="text-2xl font-bold">単語が見つかりませんでした</h2>
          <p className="text-muted-foreground">"{wordParam}" の定義を取得できませんでした。</p>
          <Button asChild variant="outline" className="rounded-xl">
            <Link href="/"><ArrowLeft className="w-4 h-4 mr-2" /> 検索に戻る</Link>
          </Button>
        </main>
      </div>
    );
  }

  const isSaved = isWordSaved(wordParam);

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row font-['Noto_Sans_JP']">
      <aside className="w-full md:w-72 border-b md:border-b-0 md:border-r bg-card/50 backdrop-blur-xl z-10">
        <Navigation />
      </aside>
      
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto p-6 md:p-12 space-y-12">
          <header className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <Link href="/" className="text-muted-foreground hover:text-primary flex items-center gap-1 text-sm mb-4 transition-colors font-bold">
                <ArrowLeft className="w-4 h-4" /> 戻る
              </Link>
              <h1 className="text-5xl font-black text-foreground">{definition.word}</h1>
              <div className="flex items-center gap-4 text-secondary">
                <span className="text-xl font-medium font-body">{definition.phonetic}</span>
                {definition.phonetics.some((p: any) => p.audio) && (
                  <Button size="icon" variant="ghost" className="rounded-full bg-secondary/10 hover:bg-secondary/20" onClick={playAudio}>
                    <Volume2 className="w-5 h-5 text-secondary" />
                  </Button>
                )}
              </div>
            </div>
            <Button 
              onClick={handleToggleSave} 
              variant={isSaved ? "secondary" : "outline"} 
              size="lg"
              className="rounded-2xl h-14 px-6 shadow-sm transition-all font-bold"
            >
              {isSaved ? (
                <><BookmarkCheck className="w-5 h-5 mr-2" /> 保存済み</>
              ) : (
                <><Bookmark className="w-5 h-5 mr-2" /> 保存する</>
              )}
            </Button>
          </header>

          <section className="space-y-8">
            {definition.meanings.map((meaning, mIdx) => (
              <div key={mIdx} className="space-y-6 p-8 rounded-3xl bg-white shadow-sm border border-accent/30">
                <Badge variant="secondary" className="px-4 py-1 text-sm rounded-lg font-bold">
                  {meaning.partOfSpeech === "noun" ? "名詞" : 
                   meaning.partOfSpeech === "verb" ? "動詞" :
                   meaning.partOfSpeech === "adjective" ? "形容詞" :
                   meaning.partOfSpeech === "adverb" ? "副詞" : meaning.partOfSpeech}
                </Badge>
                
                <div className="space-y-6">
                  {meaning.definitions.map((def, dIdx) => (
                    <div key={dIdx} className="space-y-2">
                      <p className="text-lg leading-relaxed text-foreground font-medium">
                        {meaning.definitions.length > 1 && <span className="text-muted-foreground mr-2">{dIdx + 1}.</span>}
                        {def.definition}
                      </p>
                      {def.example && (
                        <p className="text-muted-foreground italic pl-6 border-l-2 border-accent">
                          "{def.example}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {meaning.synonyms.length > 0 && (
                  <div className="pt-4 flex flex-wrap gap-2 items-center">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mr-2">類義語:</span>
                    {meaning.synonyms.slice(0, 5).map((syn, sIdx) => (
                      <Badge key={sIdx} variant="outline" className="rounded-full bg-accent/20 text-accent-foreground border-none">
                        {syn}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </section>

          <Separator className="bg-accent/50" />

          <section className="pb-12">
            <AIGeneratedSentences word={definition.word} />
          </section>
        </div>
      </main>
    </div>
  );
}

　

