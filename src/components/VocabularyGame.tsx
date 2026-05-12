"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Trophy, Timer, CheckCircle2, XCircle, Volume2, ChevronRight, BookOpen, MessageSquare, RotateCcw, ArrowRight, ArrowLeft, Gamepad, LayoutGrid } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GAME_DATA, Difficulty, Section, Question } from '@/lib/game-data';

interface GameHistory {
  question: Question;
  selectedOption: number | null;
  isCorrect: boolean;
  isTimeOver: boolean;
}

interface VocabularyGameProps {
  onStateChange?: (state: 'idle' | 'playing' | 'feedback' | 'finished') => void;
}

export function VocabularyGame({ onStateChange }: VocabularyGameProps) {
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'feedback' | 'finished'>('idle');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [history, setHistory] = useState<GameHistory[]>([]);
  const [clearedSections, setClearedSections] = useState<Record<string, number[]>>({});
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('hangul_master_cleared_sections');
    if (saved) {
      setClearedSections(JSON.parse(saved));
    }
  }, []);

  const speak = useCallback((text: string, rate = 0.9) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ko-KR';
      utterance.rate = rate;
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  useEffect(() => {
    onStateChange?.(gameState);
  }, [gameState, onStateChange]);

  const saveProgress = useCallback((diffId: string, sectionId: number) => {
    setClearedSections(prev => {
      const current = prev[diffId] || [];
      if (current.includes(sectionId)) return prev;
      const updated = { ...prev, [diffId]: [...current, sectionId] };
      localStorage.setItem('hangul_master_cleared_sections', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const finishGame = useCallback(() => {
    setGameState('finished');
    if (selectedSection && selectedDifficulty) {
      const correctCount = history.filter(h => h.isCorrect).length;
      if (correctCount === 10) {
        saveProgress(selectedDifficulty.id, selectedSection.id);
      }
    }
  }, [selectedSection, selectedDifficulty, history, saveProgress]);

  const startNextRound = useCallback(() => {
    if (!selectedSection) return;
    
    if (currentIdx + 1 < selectedSection.words.length) {
      const nextIdx = currentIdx + 1;
      setCurrentIdx(nextIdx);
      setTimeLeft(selectedDifficulty?.time || 10);
      setSelectedOption(null);
      setIsCorrect(null);
      setGameState('playing');
      speak(selectedSection.words[nextIdx].word);
    } else {
      finishGame();
    }
  }, [currentIdx, selectedSection, selectedDifficulty, speak, finishGame]);

  const handleTimeOver = useCallback(() => {
    if (!selectedSection) return;
    const q = selectedSection.words[currentIdx];
    const newHistory = [...history, { question: q, selectedOption: null, isCorrect: false, isTimeOver: true }];
    setHistory(newHistory);
    setScore(prev => Math.max(0, prev - 50));
    setGameState('feedback');
    setIsCorrect(false);
    setTimeout(startNextRound, 800);
  }, [currentIdx, selectedSection, history, startNextRound]);

  useEffect(() => {
    if (gameState === 'playing') {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 0.1) {
            if (timerRef.current) clearInterval(timerRef.current);
            handleTimeOver();
            return 0;
          }
          return prev - 0.1;
        });
      }, 100);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, handleTimeOver]);

  const handleAnswer = (optionIdx: number) => {
    if (gameState !== 'playing' || !selectedSection || !selectedDifficulty) return;
    
    const q = selectedSection.words[currentIdx];
    const correct = q.options[optionIdx] === q.correct;
    
    setSelectedOption(optionIdx);
    setIsCorrect(correct);
    const newHistory = [...history, { question: q, selectedOption: optionIdx, isCorrect: correct, isTimeOver: false }];
    setHistory(newHistory);
    setGameState('feedback');
    
    if (correct) {
      const bonus = Math.floor(timeLeft * 10 * selectedDifficulty.multiplier);
      setScore(prev => prev + 100 + bonus);
    } else {
      setScore(prev => Math.max(0, prev - 50));
    }

    setTimeout(startNextRound, 1000);
  };

  const startGame = (section: Section) => {
    const shuffledWords = [...section.words].sort(() => Math.random() - 0.5);
    setSelectedSection({ ...section, words: shuffledWords });
    
    setScore(0);
    setCurrentIdx(0);
    setHistory([]);
    setTimeLeft(selectedDifficulty?.time || 10);
    setSelectedOption(null);
    setIsCorrect(null);
    setGameState('playing');
    speak(shuffledWords[0].word);
  };

  const handleNextSection = () => {
    if (!selectedSection || !selectedDifficulty) return;
    const nextId = selectedSection.id + 1;
    const nextSec = selectedDifficulty.sections.find(s => s.id === nextId);
    if (nextSec) {
      startGame(nextSec);
    } else {
      setGameState('idle');
    }
  };

  if (gameState === 'idle') {
    return (
      <div className="flex-1 flex flex-col items-center p-4 h-full overflow-y-auto bg-accent/5 font-['Noto_Sans_JP']">
        <div className="w-full max-w-3xl space-y-6 py-4">
          <header className="text-center space-y-2">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-2">
              <Gamepad className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-2xl font-black tracking-tight text-foreground">単語キャッチャー</h2>
            <p className="text-xs text-muted-foreground font-medium">難易度とセクションを選んでください</p>
          </header>

          {!selectedDifficulty ? (
            <div className="grid gap-3">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground pl-1">レベルを選択</h3>
              {GAME_DATA.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setSelectedDifficulty(d)}
                  className="flex items-center justify-between p-4 rounded-2xl border-2 bg-white border-border hover:border-primary/40 transition-all text-left group"
                >
                  <div>
                    <span className="text-lg font-black block text-foreground">{d.label}</span>
                    <span className="text-[10px] text-muted-foreground font-medium">{d.description}</span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <button 
                  onClick={() => setSelectedDifficulty(null)} 
                  className="flex items-center gap-1 text-xs font-bold text-muted-foreground hover:text-primary transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" /> 難易度に戻る
                </button>
                <div className="px-3 py-1 rounded-full bg-primary text-white text-[10px] font-black">
                  {selectedDifficulty.label}
                </div>
              </div>
              
              <div className="space-y-3">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground pl-1">
                  セクション選択（全 {selectedDifficulty.sections.length}）
                </h3>
                <div className="grid grid-cols-5 sm:grid-cols-8 gap-2 pb-10">
                  {selectedDifficulty.sections.map((s) => {
                    const isCleared = clearedSections[selectedDifficulty.id]?.includes(s.id);
                    return (
                      <button
                        key={s.id}
                        onClick={() => startGame(s)}
                        className={cn(
                          "aspect-square flex flex-col items-center justify-center rounded-xl border-2 bg-white hover:border-primary transition-all active:scale-95 group relative",
                          isCleared ? "border-green-500 bg-green-50/50" : "border-border"
                        )}
                      >
                        <span className={cn("text-[7px] font-black", isCleared ? "text-green-600" : "text-muted-foreground")}>SEC</span>
                        <span className={cn("text-sm font-black", isCleared ? "text-green-700" : "text-foreground")}>{s.id}</span>
                        {isCleared && <div className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full p-0.5 shadow-sm"><CheckCircle2 className="w-2.5 h-2.5" /></div>}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (gameState === 'finished') {
    return (
      <div className="flex-1 flex flex-col h-full bg-background overflow-hidden font-['Noto_Sans_JP']">
        <header className="px-4 py-3 border-b bg-card flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-yellow-500/10 rounded-xl flex items-center justify-center">
              <Trophy className="w-5 h-5 text-yellow-500" />
            </div>
            <div>
              <h2 className="text-base font-black text-foreground leading-none">学習レポート</h2>
              <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mt-1">
                {selectedDifficulty?.label} / SEC {selectedSection?.id}
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[8px] font-black uppercase text-muted-foreground block">SCORE</span>
            <span className="text-2xl font-black text-primary tabular-nums tracking-tighter leading-none">{score}</span>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto bg-accent/5">
          <div className="p-3 space-y-3 max-w-4xl mx-auto pb-28">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5" /> 正誤一覧
              </h3>
              <div className="text-[10px] font-black text-muted-foreground">
                正解率: <span className="text-primary text-lg font-black">{Math.round((history.filter(h => h.isCorrect).length / history.length) * 100)}%</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {history.map((item, idx) => (
                <Card key={idx} className={cn(
                  "overflow-hidden border-2 shadow-sm bg-white",
                  item.isCorrect ? "border-green-100" : "border-destructive/10"
                )}>
                  <div className="p-2.5 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "w-7 h-7 rounded-lg flex items-center justify-center shrink-0",
                          item.isCorrect ? "bg-green-500 text-white" : "bg-destructive text-white"
                        )}>
                          {item.isCorrect ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                        </div>
                        <span className="text-sm font-black tracking-tight text-foreground uppercase">{item.question.word}</span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-[7px] font-black text-muted-foreground block uppercase leading-none">正解</span>
                        <span className="text-xs font-bold text-primary leading-none">{item.question.correct}</span>
                      </div>
                    </div>

                    <div className="p-2 bg-accent/10 rounded-xl space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-[8px] font-black text-muted-foreground uppercase">
                          <MessageSquare className="w-3 h-3" /> 例文
                        </div>
                        <button onClick={() => speak(item.question.example, 0.8)} className="p-1 rounded-full hover:bg-white text-primary transition-colors">
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-[10px] font-medium leading-tight italic text-foreground/80">
                        "{item.question.example}"
                      </p>
                      <p className="text-[9px] text-muted-foreground font-medium leading-tight">
                        {item.question.exampleTranslation}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        <footer className="fixed bottom-0 left-0 right-0 p-4 border-t bg-white/95 backdrop-blur-md z-30 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] pb-6">
          <div className="flex gap-2 w-full max-w-lg mx-auto items-center">
            <Button 
              onClick={() => setGameState('idle')} 
              variant="outline" 
              className="flex-1 h-12 text-[11px] font-black border-2 rounded-xl"
            >
              <LayoutGrid className="w-4 h-4 mr-1.5" /> 選択に戻る
            </Button>
            <Button 
              onClick={() => { if (selectedSection) startGame(selectedSection); }} 
              variant="outline" 
              className="flex-1 h-12 text-[11px] font-black border-2 rounded-xl"
            >
              <RotateCcw className="w-4 h-4 mr-1.5" /> 再挑戦
            </Button>
            <Button 
              onClick={handleNextSection} 
              className={cn(
                "flex-1 h-12 text-[11px] font-black shadow-lg rounded-xl",
                !selectedDifficulty?.sections.find(s => s.id === (selectedSection?.id || 0) + 1) && "opacity-50 pointer-events-none"
              )}
            >
              次へ <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </div>
        </footer>
      </div>
    );
  }

  const currentQuestion = selectedSection?.words[currentIdx];

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden h-full bg-accent/5 font-['Noto_Sans_JP']">
      {/* プレイ中ヘッダー */}
      <div className="absolute top-0 left-0 right-0 z-20 p-4 flex items-start justify-between pointer-events-none">
        <div className="flex items-center gap-3 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-xl border border-white/50">
          <Timer className={cn("w-5 h-5", timeLeft <= 3 ? "text-destructive animate-pulse" : "text-primary")} />
          <div className="w-24 hidden sm:block">
            <Progress value={(timeLeft / (selectedDifficulty?.time || 10)) * 100} className="h-2.5 bg-accent/20" />
          </div>
          <span className="font-black tabular-nums text-lg text-foreground w-8">
            {Math.ceil(timeLeft)}
          </span>
          <div className="ml-2 pl-3 border-l text-[10px] font-black text-muted-foreground leading-tight">
            {selectedDifficulty?.label}<br/>SEC {selectedSection?.id}
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-md px-5 py-2.5 rounded-2xl shadow-xl border border-white/50 text-right">
          <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block leading-none mb-1">SCORE</span>
          <span className="text-2xl font-black text-primary tabular-nums tracking-tighter leading-none">{score}</span>
        </div>
      </div>

      <div className="flex-1 relative mt-28 mb-64 overflow-hidden">
        {gameState === 'playing' && currentQuestion && (
          <div 
            key={currentIdx} 
            className="absolute inset-x-0 flex justify-center animate-word-fall h-full"
            style={{ animationDuration: `${selectedDifficulty?.time || 10}s` }}
          >
            <div className="bg-foreground text-background px-8 py-4 rounded-2xl shadow-2xl h-fit border-2 border-white/10 max-w-[85vw] text-center flex items-center gap-4">
              <span className="text-2xl font-black tracking-tight uppercase break-all">{currentQuestion.word}</span>
              <button 
                onClick={(e) => { e.stopPropagation(); speak(currentQuestion.word); }}
                className="p-2 hover:text-primary transition-colors pointer-events-auto bg-white/10 rounded-full"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {gameState === 'feedback' && (
          <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
            {isCorrect ? (
              <div className="flex flex-col items-center text-green-500 bg-white/95 backdrop-blur-xl px-10 py-8 rounded-[3rem] shadow-2xl border border-green-200 animate-in fade-in zoom-in-95 duration-200">
                <CheckCircle2 className="w-20 h-20" />
                <span className="text-2xl font-black mt-4">正解！</span>
              </div>
            ) : (
              <div className="flex flex-col items-center text-destructive bg-white/95 backdrop-blur-xl px-10 py-8 rounded-[3rem] shadow-2xl border border-destructive/20 animate-in fade-in zoom-in-95 duration-200">
                <XCircle className="w-20 h-20" />
                <span className="text-2xl font-black mt-4">
                  {timeLeft <= 0.2 ? "時間切れ" : "不正解"}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 選択肢エリア */}
      <div className="absolute bottom-0 left-0 right-0 p-5 pb-10 bg-gradient-to-t from-background via-background/90 to-transparent z-20">
        <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
          {currentQuestion?.options.map((option, idx) => {
            const isCorrectOption = option === currentQuestion.correct;
            const isSelected = selectedOption === idx;
            const showCorrectHighlight = gameState === 'feedback' && isCorrectOption;

            return (
              <Card 
                key={idx}
                onClick={() => handleAnswer(idx)}
                className={cn(
                  "p-4 cursor-pointer flex items-center justify-center text-center transition-all border-2 rounded-2xl min-h-[85px] shadow-lg",
                  gameState !== 'playing' && "pointer-events-none",
                  isSelected && isCorrect === true && "bg-green-50 border-green-500 scale-95",
                  isSelected && isCorrect === false && "bg-destructive/5 border-destructive scale-95",
                  showCorrectHighlight && "border-green-400 bg-green-50/50 ring-4 ring-green-400/20 shadow-[0_0_15px_rgba(34,197,94,0.3)]",
                  gameState === 'playing' && "hover:border-primary/40 hover:bg-white active:scale-95 bg-white/95 backdrop-blur-sm"
                )}
              >
                <span className="text-base font-bold text-foreground leading-tight px-1 line-clamp-2">
                  {option}
                </span>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
