"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Copy, Edit3, CheckCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';


interface ResultsDisplayProps {
  originalPrompt: string | null;
  enhancedPrompt: string | null;
  isLoading: boolean;
  onModifyClick: () => void;
}

export default function ResultsDisplay({
  originalPrompt,
  enhancedPrompt,
  isLoading,
  onModifyClick,
}: ResultsDisplayProps) {
  const { toast } = useToast();
  const [isCopied, setIsCopied] = useState(false);
  const [animatedEnhancedPrompt, setAnimatedEnhancedPrompt] = useState("");

  useEffect(() => {
    if (enhancedPrompt && !isLoading) {
      setAnimatedEnhancedPrompt(""); 
      let i = 0;
      const intervalId = setInterval(() => {
        if (i < enhancedPrompt.length) {
          setAnimatedEnhancedPrompt((prev) => prev + enhancedPrompt[i]);
          i++;
        } else {
          clearInterval(intervalId);
        }
      }, 10); 
      return () => clearInterval(intervalId);
    } else if (isLoading) {
        setAnimatedEnhancedPrompt(""); // Clear if loading starts
    }
  }, [enhancedPrompt, isLoading]);

  const handleCopy = () => {
    if (enhancedPrompt) {
      navigator.clipboard.writeText(enhancedPrompt);
      toast({
        title: 'Copied to clipboard!',
        description: 'Enhanced prompt is ready to use.',
        action: <CheckCircle className="text-accent-foreground" />, 
      });
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  if (!originalPrompt && !isLoading) { // Don't render if no original prompt and not loading
    return null;
  }
  
  const cardBaseClass = "bg-card/80 backdrop-blur-lg dark:bg-card/60 border-border/70 shadow-lg";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="mt-10"
    >
      <Card className={cn("w-full overflow-hidden", cardBaseClass)}>
        <CardHeader className="pb-4">
          <CardTitle className="text-xl sm:text-2xl font-semibold text-card-foreground">Results</CardTitle>
          <CardDescription className="text-muted-foreground text-sm">
            {isLoading ? "Enhancing your prompt..." : "Compare your original prompt with the AI-enhanced version."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 p-6 md:p-8">
          <div className="grid md:grid-cols-2 gap-6 items-start">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1, duration: 0.4 }}>
              <Card className={cn("h-full", cardBaseClass, "bg-muted/30 dark:bg-muted/20")}>
                <CardHeader className="pb-2 pt-4 px-4">
                  <CardTitle className="text-base sm:text-lg text-foreground/90">Original Prompt</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground whitespace-pre-wrap break-words max-h-60 overflow-y-auto p-4 rounded-md custom-scrollbar">
                  {originalPrompt || <Skeleton className="h-20 w-full" />}
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.4 }}>
              <Card className={cn("h-full border-primary/50", cardBaseClass)}>
                <CardHeader className="pb-2 pt-4 px-4">
                  <CardTitle className="text-base sm:text-lg text-primary">Enhanced Prompt</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-foreground whitespace-pre-wrap break-words max-h-60 overflow-y-auto p-4 rounded-md custom-scrollbar">
                  {isLoading && !enhancedPrompt ? (
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-5/6" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  ) : (
                    animatedEnhancedPrompt || (isLoading ? "" : "No enhanced prompt available.")
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {!isLoading && enhancedPrompt && (
            <>
              <Separator className="bg-border/30" />
              <div className="flex flex-col sm:flex-row gap-3 justify-end pt-2">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Button variant="outline" onClick={onModifyClick} className="w-full sm:w-auto border-border/70 hover:bg-muted/70" aria-label="Modify Enhanced Prompt">
                    <Edit3 className="mr-2 h-4 w-4" />
                    Modify
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Button onClick={handleCopy} className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground" aria-label="Copy Enhanced Prompt">
                    {isCopied ? <CheckCircle className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                    {isCopied ? 'Copied!' : 'Copy Enhanced'}
                  </Button>
                </motion.div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
