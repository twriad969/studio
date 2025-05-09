"use client";

import React, { useState, useEffect } from 'react';
import PromptForm from './PromptForm';
import ResultsDisplay from './ResultsDisplay';
import ModifyPromptModal from './ModifyPromptModal';
import { enhancePrompt, EnhancePromptInput, EnhancePromptOutput } from '@/ai/flows/enhance-prompt';
import { modifyResult, ModifyResultInput, ModifyResultOutput } from '@/ai/flows/modify-result';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle, Zap } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';

export default function PromptEnhancementSection() {
  const [originalPrompt, setOriginalPrompt] = useState(''); // The prompt currently being typed by user
  const [submittedOriginalPrompt, setSubmittedOriginalPrompt] = useState<string | null>(null); // The prompt that was submitted for enhancement
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
    setEnhancedPrompt(null); // Clear previous results
    setSubmittedOriginalPrompt(originalPrompt); // Store the submitted prompt

    try {
      const input: EnhancePromptInput = { originalPrompt: originalPrompt.trim() };
      const result: EnhancePromptOutput = await enhancePrompt(input);
      setEnhancedPrompt(result.enhancedPrompt);
      toast({
        title: "Prompt Enhanced!",
        description: "Your enhanced prompt is ready.",
        action: <Zap className="text-yellow-400" />
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
      setEnhancedPrompt(result.modifiedPrompt); // Update with modified prompt
      setIsModifyModalOpen(false); // Close modal on success
      toast({
        title: "Prompt Modified!",
        description: "Your prompt has been successfully updated.",
        action: <Zap className="text-yellow-400" />
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
  
  // Effect to clear error when originalPrompt changes
  useEffect(() => {
    if (error) {
      setError(null);
    }
  }, [originalPrompt]);

  return (
    <section className="w-full max-w-3xl mx-auto space-y-8 py-8">
      <div className="text-center space-y-3">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary">
          AI Prompt Enhancement, Simplified
        </h2>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          Transform your basic AI prompts into powerful, precise instructions that get better results instantly.
        </p>
      </div>
      
      <Image 
        src="https://picsum.photos/1200/300"
        alt="Abstract AI art"
        width={1200}
        height={300}
        className="rounded-lg shadow-lg object-cover w-full h-48 md:h-64"
        data-ai-hint="abstract technology"
        priority
      />

      <PromptForm
        prompt={originalPrompt}
        setPrompt={setOriginalPrompt}
        handleSubmit={handleEnhanceSubmit}
        isLoading={isLoadingEnhance}
      />

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
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
          <ResultsDisplay
            originalPrompt={submittedOriginalPrompt}
            enhancedPrompt={enhancedPrompt}
            onModifyClick={() => setIsModifyModalOpen(true)}
          />
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
