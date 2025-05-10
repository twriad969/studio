"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Copy, Edit3, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface ResultsDisplayProps {
  originalPrompt: string | null; // Still needed for ModifyPromptModal
  enhancedPrompt: string | null;
  isLoading: boolean;
  onModifyClick: () => void;
}

const ResultsDisplay = React.forwardRef<HTMLDivElement, ResultsDisplayProps>(
  ({ originalPrompt, enhancedPrompt, isLoading, onModifyClick }, ref) => {
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
          setAnimatedEnhancedPrompt(""); 
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

    if (!originalPrompt && !isLoading && !enhancedPrompt) { 
      return null;
    }
    
    const cardBaseClass = "bg-card/80 backdrop-blur-lg dark:bg-card/60 border-border/70 shadow-xl";

    return (
      <motion.div
        ref={ref} // Assign forwarded ref here
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="mt-10" // This is the element that will be scrolled to
      >
        <Card className={cn("w-full overflow-hidden", cardBaseClass)}>
          <CardHeader className="pb-4">
            <CardTitle className="text-xl sm:text-2xl font-semibold text-card-foreground">
              Enhanced Prompt
            </CardTitle>
            <CardDescription className="text-muted-foreground text-sm">
              {isLoading ? "Enhancing your prompt..." : "Your AI-enhanced prompt is ready below."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-6 md:p-8">
            <div className={cn(
              "text-sm text-foreground whitespace-pre-wrap break-words min-h-[150px] max-h-[400px] overflow-y-auto p-4 rounded-lg custom-scrollbar border shadow-inner",
              "bg-background/70 dark:bg-background/50 border-primary/40 focus-within:border-primary" // Enhanced styling
            )}>
              {isLoading && !enhancedPrompt ? (
                <div className="space-y-3 py-4"> {/* Adjusted padding and spacing for skeletons */}
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ) : (
                animatedEnhancedPrompt || (isLoading ? "" : <span className="italic text-muted-foreground">No enhanced prompt generated.</span>)
              )}
            </div>

            {!isLoading && enhancedPrompt && (
              <>
                <Separator className="bg-border/50" />
                <div className="flex flex-col sm:flex-row gap-3 justify-end pt-2">
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Button variant="outline" onClick={onModifyClick} className="w-full sm:w-auto border-border/70 hover:bg-muted/70" aria-label="Modify Enhanced Prompt">
                      <Edit3 className="mr-2 h-4 w-4" />
                      Modify
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Button onClick={handleCopy} className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground" aria-label="Copy Enhanced Prompt">
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
);

ResultsDisplay.displayName = "ResultsDisplay";

export default ResultsDisplay;
