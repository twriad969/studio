"use client";

import React, { useState, useEffect } from 'react';
import PromptForm from './PromptForm';
import ResultsDisplay from './ResultsDisplay';
import ModifyPromptModal from './ModifyPromptModal';
import { enhancePrompt, EnhancePromptInput, EnhancePromptOutput } from '@/ai/flows/enhance-prompt';
import { modifyResult, ModifyResultInput, ModifyResultOutput } from '@/ai/flows/modify-result';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle, Sparkles } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AnimatePresence, motion } from 'framer-motion';
import { Spotlight } from '@/components/ui/spotlight';
import { cn } from '@/lib/utils';

export default function PromptEnhancementSection() {
  const [originalPrompt, setOriginalPrompt] = useState('');
  const [submittedOriginalPrompt, setSubmittedOriginalPrompt] = useState<string | null>(null);
  const [enhancedPrompt, setEnhancedPrompt] = useState<string | null>(null);
  const [isLoadingEnhance, setIsLoadingEnhance] = useState(false);
  const [isLoadingModify, setIsLoadingModify] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModifyModalOpen, setIsModifyModalOpen] = useState(false);
  const { toast } = useToast();

  const handleEnhanceSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!originalPrompt.trim()) return;

    setIsLoadingEnhance(true);
    setError(null);
    setEnhancedPrompt(null);
    setSubmittedOriginalPrompt(originalPrompt);

    try {
      const input: EnhancePromptInput = { originalPrompt: originalPrompt.trim() };
      const result: EnhancePromptOutput = await enhancePrompt(input);
      setEnhancedPrompt(result.enhancedPrompt);
      toast({
        title: "Prompt Enhanced!",
        description: "Your enhanced prompt is ready.",
        action: <Sparkles className="text-accent" /> 
      });
    } catch (err) {
      console.error("Error enhancing prompt:", err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(`Failed to enhance prompt: ${errorMessage}`);
      toast({
        variant: "destructive",
        title: "Enhancement Failed",
        description: errorMessage,
      });
    } finally {
      setIsLoadingEnhance(false);
    }
  };

  const handleModifySubmit = async (modificationRequest: string) => {
    if (!submittedOriginalPrompt || !enhancedPrompt || !modificationRequest.trim()) return;

    setIsLoadingModify(true);
    setError(null);

    try {
      const input: ModifyResultInput = {
        originalPrompt: submittedOriginalPrompt,
        enhancedPrompt,
        modificationRequest: modificationRequest.trim(),
      };
      const result: ModifyResultOutput = await modifyResult(input);
      setEnhancedPrompt(result.modifiedPrompt);
      setIsModifyModalOpen(false);
      toast({
        title: "Prompt Modified!",
        description: "Your prompt has been successfully updated.",
        action: <Sparkles className="text-accent" />
      });
    } catch (err) {
      console.error("Error modifying prompt:", err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(`Failed to modify prompt: ${errorMessage}`);
      toast({
        variant: "destructive",
        title: "Modification Failed",
        description: errorMessage,
      });
    } finally {
      setIsLoadingModify(false);
    }
  };
  
  useEffect(() => {
    if (error) {
      setError(null);
    }
  }, [originalPrompt]);

  return (
    <section className="w-full max-w-4xl mx-auto space-y-8 py-12 md:py-20 relative">
      <Spotlight
        className="-top-40 left-0 md:-top-20 md:left-30"
      />
      <div className="relative z-10 text-center space-y-4 mb-12">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight bg-opacity-50 bg-gradient-to-b from-foreground/80 to-foreground bg-clip-text text-transparent">
          AI Prompt Enhancement, Simplified
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Transform your basic AI prompts into powerful, precise instructions that get better results instantly.
        </p>
      </div>
      
      <div className="relative z-10">
        <PromptForm
          prompt={originalPrompt}
          setPrompt={setOriginalPrompt}
          handleSubmit={handleEnhanceSubmit}
          isLoading={isLoadingEnhance}
        />
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="relative z-10"
          >
            <Alert variant="destructive" className="shadow-md">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {enhancedPrompt && submittedOriginalPrompt && (
          <div className="relative z-10">
            <ResultsDisplay
              originalPrompt={submittedOriginalPrompt}
              enhancedPrompt={enhancedPrompt}
              onModifyClick={() => setIsModifyModalOpen(true)}
            />
          </div>
        )}
      </AnimatePresence>

      {submittedOriginalPrompt && enhancedPrompt && (
        <ModifyPromptModal
          isOpen={isModifyModalOpen}
          onClose={() => setIsModifyModalOpen(false)}
          onSubmit={handleModifySubmit}
          isLoading={isLoadingModify}
          originalPrompt={submittedOriginalPrompt}
          currentEnhancedPrompt={enhancedPrompt}
        />
      )}
    </section>
  );
}
