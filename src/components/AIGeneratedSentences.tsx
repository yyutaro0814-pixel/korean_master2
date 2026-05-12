"use client";

import { useState } from 'react';
import { generateExampleSentences } from '@/ai/flows/generate-example-sentences';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Loader2, MessageSquareText } from 'lucide-react';

export function AIGeneratedSentences({ word }: { word: string }) {
  const [sentences, setSentences] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const result = await generateExampleSentences({ word });
      setSentences(result.sentences);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-secondary">
          <Sparkles className="w-5 h-5" />
          <h3 className="font-bold text-lg">AIによる例文</h3>
        </div>
        <Button 
          onClick={handleGenerate} 
          disabled={loading}
          variant="outline"
          className="rounded-xl border-secondary text-secondary hover:bg-secondary hover:text-white font-bold"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
          {sentences.length > 0 ? "別の例文を生成" : "AIで例文を生成"}
        </Button>
      </div>

      {sentences.length > 0 && (
        <div className="grid gap-3">
          {sentences.map((sentence, idx) => (
            <Card key={idx} className="border-none bg-white/50 shadow-sm hover:shadow-md transition-all">
              <CardContent className="p-4 flex gap-4">
                <MessageSquareText className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                <p className="text-foreground leading-relaxed font-medium">{sentence}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
