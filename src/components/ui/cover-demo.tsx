
"use client";
import React from "react";
import { Cover } from "@/components/ui/cover";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowDown } from "lucide-react"; // Using ArrowDown for scroll hint
import { motion } from "framer-motion";

export default function CoverDemo() {
  const handleScrollToEnhance = () => {
    const section = document.getElementById('prompt-enhancement-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="py-10 md:py-16 text-center"> {/* Added text-center for button alignment */}
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold max-w-4xl mx-auto text-center relative z-20 leading-tight">
        Elevate Your AI Prompts <br className="hidden sm:block" /> with <Cover>Prompthancer</Cover>
      </h1>
      <p className="mt-6 max-w-xl mx-auto text-center text-base md:text-lg text-muted-foreground">
        Instantly transform basic ideas into powerful, precise instructions for any AI.
      </p>
      <motion.div
        className="mt-10" // Increased margin for spacing
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <Button
          size="lg"
          onClick={handleScrollToEnhance}
          className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg rounded-lg
                     transition-all duration-300 ease-in-out 
                     hover:shadow-xl hover:scale-105 group px-8 py-6 text-lg"
          aria-label="Enhance your prompt now"
        >
          <ArrowDown className="mr-2.5 h-5 w-5 transition-transform duration-300 group-hover:translate-y-0.5" />
          Enhance Now
        </Button>
      </motion.div>
    </div>
  );
}
