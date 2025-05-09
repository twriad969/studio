"use client";

import type { Dispatch, SetStateAction } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface PromptFormProps {
  prompt: string;
  setPrompt: Dispatch<SetStateAction<string>>;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  characterLimit?: number;
}

export default function PromptForm({
  prompt,
  setPrompt,
  handleSubmit,
  isLoading,
  characterLimit = 2000,
}: PromptFormProps) {
  const charCount = prompt.length;
  const isOverLimit = characterLimit && charCount > characterLimit;

  return (
    <Card className="w-full shadow-xl overflow-hidden border-border bg-card/70 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-card-foreground">Enhance Your Prompt</CardTitle>
        <CardDescription className="text-muted-foreground">Enter your basic AI prompt below to get an enhanced version.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <Textarea
              placeholder="e.g., Write a story about a brave knight..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[150px] text-base resize-none focus:ring-2 focus:ring-ring bg-background/80 placeholder-muted-foreground"
              maxLength={characterLimit}
              aria-label="Original Prompt Input"
            />
            {characterLimit && (
              <div className={`absolute bottom-2 right-3 text-xs ${isOverLimit ? 'text-destructive' : 'text-muted-foreground'}`}>
                {charCount}/{characterLimit}
              </div>
            )}
          </div>
          <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <Button
              type="submit"
              disabled={isLoading || prompt.trim() === '' || isOverLimit}
              className="w-full text-lg py-6 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:-translate-y-0.5"
              aria-label="Enhance Prompt"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-6 w-6 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-6 w-6" />
              )}
              {isLoading ? 'Enhancing...' : 'Enhance Prompt'}
            </Button>
          </motion.div>
          {isOverLimit && (
            <p className="text-sm text-destructive text-center">
              Prompt exceeds character limit of {characterLimit}.
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
