"use client";

import React, { useState, useEffect } from 'react';
import PromptForm from './PromptForm';
import ResultsDisplay from './ResultsDisplay';
import ModifyPromptModal from './ModifyPromptModal';
import { enhancePrompt, EnhancePromptInput, EnhancePromptOutput } from '@/ai/flows/enhance-prompt';
import { modifyResult, ModifyResultInput, ModifyResultOutput } from '@/ai/flows/modify-result';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle, Sparkles as SparklesIcon } from 'lucide-react'; // Renamed to avoid conflict
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AnimatePresence, motion } from 'framer-motion';
import { Spotlight } from '@/components/ui/spotlight';
import { cn } from '@/lib/utils';

interface PromptEnhancementSectionProps {
  currentTheme?: string;
}

export default function PromptEnhancementSection({ currentTheme }: PromptEnhancementSectionProps) {
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
      // Clear error after a delay or on new input to prevent it sticking
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (originalPrompt) { // Clear error when user types new prompt
        setError(null);
    }
  }, [originalPrompt]);


  return (
    <section className="w-full max-w-3xl mx-auto space-y-10 py-12 md:py-16 relative">
      {currentTheme === 'dark' && (
        <Spotlight
          className="-top-40 left-0 md:-top-20 md:left-30"
          fill="white" // Spotlight fill will be white, visible in dark mode
        />
      )}
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

      <AnimatePresence>
        {(isLoadingEnhance || (enhancedPrompt && submittedOriginalPrompt)) && (
          <div className="relative z-10 mt-12"> {/* Added margin top for spacing */}
            <ResultsDisplay
              originalPrompt={submittedOriginalPrompt}
              enhancedPrompt={enhancedPrompt}
              isLoading={isLoadingEnhance}
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
