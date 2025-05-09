"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Copy, Edit3, CheckCircle, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

interface ResultsDisplayProps {
  originalPrompt: string | null;
  enhancedPrompt: string | null;
  onModifyClick: () => void;
}

export default function ResultsDisplay({
  originalPrompt,
  enhancedPrompt,
  onModifyClick,
}: ResultsDisplayProps) {
  const { toast } = useToast();
  const [isCopied, setIsCopied] = useState(false);
  const [animatedEnhancedPrompt, setAnimatedEnhancedPrompt] = useState("");

  useEffect(() => {
    if (enhancedPrompt) {
      setAnimatedEnhancedPrompt(""); // Reset for re-animation
      let i = 0;
      const intervalId = setInterval(() => {
        setAnimatedEnhancedPrompt(enhancedPrompt.substring(0, i + 1));
        i++;
        if (i >= enhancedPrompt.length) {
          clearInterval(intervalId);
        }
      }, 10); // Adjust speed of animation here
      return () => clearInterval(intervalId);
    }
  }, [enhancedPrompt]);

  const handleCopy = () => {
    if (enhancedPrompt) {
      navigator.clipboard.writeText(enhancedPrompt);
      toast({
        title: 'Copied to clipboard!',
        description: 'Enhanced prompt is ready to use.',
        action: <CheckCircle className="text-green-500" />,
      });
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  if (!originalPrompt || !enhancedPrompt) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="mt-12"
    >
      <Card className="w-full shadow-xl overflow-hidden">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Enhanced Prompt Results</CardTitle>
          <CardDescription>Compare your original prompt with the AI-enhanced version.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6 items-start">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.5 }}>
              <Card className="bg-muted/50">
                <CardHeader>
                  <CardTitle className="text-lg">Original Prompt</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground whitespace-pre-wrap break-words max-h-60 overflow-y-auto p-4 rounded-md">
                  {originalPrompt}
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4, duration: 0.5 }}>
              <Card className="border-primary border-2 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg text-primary">Enhanced Prompt</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-foreground whitespace-pre-wrap break-words max-h-60 overflow-y-auto p-4 rounded-md">
                  {animatedEnhancedPrompt}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <Separator />

          <div className="flex flex-col sm:flex-row gap-4 justify-end">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="outline" onClick={onModifyClick} className="w-full sm:w-auto" aria-label="Modify Enhanced Prompt">
                <Edit3 className="mr-2 h-4 w-4" />
                Modify Result
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button onClick={handleCopy} className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground" aria-label="Copy Enhanced Prompt">
                {isCopied ? <CheckCircle className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                {isCopied ? 'Copied!' : 'Copy Enhanced Prompt'}
              </Button>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
