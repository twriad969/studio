
"use client";

import React, { useState, useEffect, useRef } from 'react';
import PromptForm from './PromptForm';
import ResultsDisplay from './ResultsDisplay';
import ModifyPromptModal from './ModifyPromptModal';
import { enhancePrompt, EnhancePromptInput, EnhancePromptOutput } from '@/ai/flows/enhance-prompt';
import { modifyResult, ModifyResultInput, ModifyResultOutput } from '@/ai/flows/modify-result';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle, Sparkles as SparklesIcon } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface PromptEnhancementSectionProps {}

export default function PromptEnhancementSection({}: PromptEnhancementSectionProps) {
  const [originalPrompt, setOriginalPrompt] = useState('');
  const [submittedOriginalPrompt, setSubmittedOriginalPrompt] = useState<string | null>(null);
  const [enhancedPrompt, setEnhancedPrompt] = useState<string | null>(null);
  // Optional: Store the full structured result if other parts need to be displayed
  // const [fullEnhancementResult, setFullEnhancementResult] = useState<EnhancePromptOutput | null>(null);
  const [isLoadingEnhance, setIsLoadingEnhance] = useState(false);
  const [isLoadingModify, setIsLoadingModify] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModifyModalOpen, setIsModifyModalOpen] = useState(false);
  const { toast } = useToast();
  const resultsSectionRef = useRef<HTMLDivElement>(null);

  const handleEnhanceSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!originalPrompt.trim()) return;

    setIsLoadingEnhance(true);
    setError(null);
    setEnhancedPrompt(null); 
    // setFullEnhancementResult(null);
    setSubmittedOriginalPrompt(originalPrompt);

    try {
      const input: EnhancePromptInput = { originalPrompt: originalPrompt.trim() };
      const result: EnhancePromptOutput = await enhancePrompt(input);
      
      // setFullEnhancementResult(result);
      if (result.enhancedPrompt) {
        setEnhancedPrompt(result.enhancedPrompt);
      } else {
        throw new Error("Enhanced prompt was not returned in the expected format.");
      }
      
      toast({
        title: "Prompt Enhanced!",
        description: "Your enhanced prompt is ready.",
        action: <SparklesIcon className="text-accent" />
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
      // If storing full result, update it too or parts of it if modification changes explanation etc.
      // For now, only the prompt string is updated.
      setIsModifyModalOpen(false);
      toast({
        title: "Prompt Modified!",
        description: "Your prompt has been successfully updated.",
        action: <SparklesIcon className="text-accent" />
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
      const timer = setTimeout(() => setError(null), 7000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (originalPrompt) {
        setError(null);
    }
  }, [originalPrompt]);

  useEffect(() => {
    if ((enhancedPrompt || error || isLoadingEnhance) && resultsSectionRef.current && !isModifyModalOpen) {
      if (isLoadingEnhance || enhancedPrompt || error) {
        resultsSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [enhancedPrompt, error, isLoadingEnhance, isModifyModalOpen]);


  return (
    <section 
      id="prompt-enhancement-section" 
      className="w-full max-w-3xl mx-auto space-y-10 py-12 md:py-16 relative mt-12 sm:mt-16"
    >
      <div className="relative z-10 text-center space-y-3 mb-10">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
          Enhance Your Prompt
        </h2>
        <p className="text-md md:text-lg text-muted-foreground max-w-xl mx-auto">
          Enter your basic AI prompt below to get an enhanced, more effective version.
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

      <div ref={resultsSectionRef} className="scroll-mt-20 md:scroll-mt-24">
        <AnimatePresence>
          {(isLoadingEnhance || (enhancedPrompt && submittedOriginalPrompt) || (!isLoadingEnhance && !enhancedPrompt && submittedOriginalPrompt && !error)) && (
            <div className="relative z-10">
              <ResultsDisplay
                enhancedPrompt={enhancedPrompt}
                isLoading={isLoadingEnhance}
                onModifyClick={() => setIsModifyModalOpen(true)}
              />
            </div>
          )}
        </AnimatePresence>
      </div>


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
