"use client";

import type { Dispatch, SetStateAction } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'; // CardDescription and CardFooter are not used
import { cn } from '@/lib/utils';

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
    <Card className={cn(
      "w-full shadow-xl overflow-hidden border-border/70",
      "bg-card/80 backdrop-blur-lg dark:bg-card/60" // More pronounced blur and different alpha for dark
    )}>
      {/* CardHeader removed as title is now in PromptEnhancementSection */}
      <CardContent className="p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <Textarea
              placeholder="e.g., Write a captivating story about a lone astronaut discovering an ancient alien artifact on Mars..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className={cn(
                "min-h-[180px] text-base resize-none focus:ring-2 focus:ring-ring/70",
                "bg-background/70 dark:bg-background/50 placeholder-muted-foreground border-border/70"
              )}
              maxLength={characterLimit}
              aria-label="Original Prompt Input"
            />
            {characterLimit && (
              <div className={cn(
                "absolute bottom-3 right-3 text-xs px-2 py-0.5 rounded-full",
                isOverLimit ? 'text-destructive-foreground bg-destructive/80' : 'text-muted-foreground bg-muted/50'
              )}>
                {charCount}/{characterLimit}
              </div>
            )}
          </div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full"
          >
            <Button
              type="submit"
              disabled={isLoading || prompt.trim() === '' || isOverLimit}
              className={cn(
                "w-full text-lg py-3.5 rounded-md shadow-md transition-all duration-300 ease-in-out",
                "bg-primary hover:bg-primary/90 text-primary-foreground",
                "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              )}
              aria-label="Enhance Prompt"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-5 w-5" />
              )}
              {isLoading ? 'Enhancing...' : 'Enhance Prompt'}
            </Button>
          </motion.div>
          {isOverLimit && (
            <p className="text-sm text-destructive text-center pt-1">
              Prompt exceeds character limit of {characterLimit}. Please shorten it.
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
