"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Command } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function SearchBox() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/word/${query.trim().toLowerCase()}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-3xl mx-auto group">
      <div className="relative flex items-center p-2 rounded-[2rem] bg-card border-2 border-border/50 shadow-2xl shadow-black/5 hover:border-primary/30 transition-all duration-500">
        <div className="pl-6 text-muted-foreground group-focus-within:text-primary transition-colors">
          <Search className="w-7 h-7" />
        </div>
        <Input
          type="text"
          placeholder="英単語を入力して検索..."
          className="h-16 text-xl rounded-2xl border-none bg-transparent focus-visible:ring-0 placeholder:text-muted-foreground/50 font-medium px-4"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="hidden md:flex items-center gap-1.5 px-4 py-2 rounded-xl bg-muted text-[10px] font-bold text-muted-foreground uppercase tracking-widest mr-4">
          <Command className="w-3 h-3" /> 検索
        </div>
        <Button 
          type="submit"
          className="rounded-2xl h-14 px-8 bg-foreground text-background hover:bg-foreground/90 font-bold transition-all"
        >
          検索
        </Button>
      </div>
    </form>
  );
}
