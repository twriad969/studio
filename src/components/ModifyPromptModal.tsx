"use client";

import { useState, type FormEvent } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ModifyPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (modificationRequest: string) => Promise<void>;
  isLoading: boolean;
  originalPrompt: string;
  currentEnhancedPrompt: string;
}

export default function ModifyPromptModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  originalPrompt,
  currentEnhancedPrompt,
}: ModifyPromptModalProps) {
  const [modificationRequest, setModificationRequest] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!modificationRequest.trim()) return;
    await onSubmit(modificationRequest);
    // Optionally clear request or keep it: setModificationRequest('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn(
        "sm:max-w-lg bg-card shadow-2xl rounded-lg border-border/70",
        "dark:bg-card/80 backdrop-blur-xl"
        )}>
        <DialogHeader className="pb-2">
          <DialogTitle className="text-xl font-semibold text-card-foreground">Modify Enhanced Prompt</DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm pt-1">
            Provide specific instructions to refine the enhanced prompt.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Original Prompt:</h4>
            <p className={cn(
              "text-xs p-3 rounded-md max-h-24 overflow-y-auto custom-scrollbar",
              "bg-muted/50 dark:bg-muted/30 text-muted-foreground border border-border/50"
              )}>{originalPrompt}</p>
          </div>
          <div className="space-y-1.5">
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Current Enhanced Prompt:</h4>
            <p className={cn(
              "text-xs p-3 rounded-md max-h-24 overflow-y-auto custom-scrollbar",
              "bg-muted/50 dark:bg-muted/30 text-muted-foreground border border-border/50"
            )}>{currentEnhancedPrompt}</p>
          </div>
          <div>
            <Textarea
              placeholder="e.g., Make it more formal, add examples for a marketing campaign, shorten it to two paragraphs..."
              value={modificationRequest}
              onChange={(e) => setModificationRequest(e.target.value)}
              className={cn(
                "min-h-[100px] focus:ring-2 focus:ring-ring/70 text-sm",
                "bg-background/70 dark:bg-background/50 placeholder-muted-foreground border-border/70"
                )}
              aria-label="Modification Request Input"
            />
          </div>
          <DialogFooter className="gap-2 sm:gap-3 pt-2">
            <DialogClose asChild>
              <Button type="button" variant="outline" className="border-border/70 hover:bg-muted/70">
                Cancel
              </Button>
            </DialogClose>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button type="submit" disabled={isLoading || !modificationRequest.trim()} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Send className="mr-2 h-4 w-4" />
                )}
                {isLoading ? 'Modifying...' : 'Submit Modification'}
              </Button>
            </motion.div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
