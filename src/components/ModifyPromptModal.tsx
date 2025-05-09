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
      <DialogContent className="sm:max-w-[525px] bg-card shadow-2xl rounded-lg border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-card-foreground">Modify Enhanced Prompt</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Provide specific instructions on how you'd like to change the enhanced prompt.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Original Prompt:</h4>
            <p className="text-xs p-2 bg-muted/50 rounded-md max-h-20 overflow-y-auto text-muted-foreground border border-border/50">{originalPrompt}</p>
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Current Enhanced Prompt:</h4>
            <p className="text-xs p-2 bg-muted/50 rounded-md max-h-20 overflow-y-auto text-muted-foreground border border-border/50">{currentEnhancedPrompt}</p>
          </div>
          <div>
            <Textarea
              placeholder="e.g., Make it more formal, add examples, shorten it..."
              value={modificationRequest}
              onChange={(e) => setModificationRequest(e.target.value)}
              className="min-h-[100px] focus:ring-2 focus:ring-ring bg-background/80 placeholder-muted-foreground"
              aria-label="Modification Request Input"
            />
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <DialogClose asChild>
              <Button type="button" variant="outline">
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
