
"use client";
import AppHeader from '@/components/AppHeader';
import AppFooter from '@/components/AppFooter';
import PromptEnhancementSection from '@/components/PromptEnhancementSection';
import EducationalContent from '@/components/EducationalContent';
import { cn } from '@/lib/utils';
import CoverDemo from "@/components/ui/cover-demo";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Spotlight } from "@/components/ui/spotlight";

export default function HomePage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleDarkMode = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // Prevent rendering client-only components until mounted
  if (!mounted) {
    return null; 
  }

  return (
    <div
      className={cn(
        "flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300 relative overflow-hidden"
      )}
    >
      {/* Grid Background for both themes */}
      <div
        className={cn(
          "absolute inset-0 z-0",
          "[background-size:40px_40px]",
           theme === "dark" 
            ? "dark:[background-image:linear-gradient(to_right,hsl(var(--grid-color))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--grid-color))_1px,transparent_1px)]"
            : "[background-image:linear-gradient(to_right,hsl(var(--grid-color))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--grid-color))_1px,transparent_1px)]"
        )}
      />
      <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      
      {theme === "dark" && (
        <Spotlight
          className="absolute -top-40 left-1/2 -translate-x-1/2 md:-top-20 z-[2]"
          fill="hsl(var(--foreground))" 
        />
      )}
      
      <div className="relative z-10 flex flex-col min-h-screen">
        <AppHeader>
          <Button onClick={toggleDarkMode} variant="ghost" size="icon" aria-label="Toggle theme">
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </AppHeader>

        <div className="flex-grow flex flex-col"> {/* This wrapper manages layout for hero and subsequent scrolling content */}
          
          {/* Hero Section: Centered, takes initial viewport height minus header */}
          <section 
            id="hero"
            className="flex flex-col items-center justify-center min-h-[calc(85vh-theme(spacing.14))] container mx-auto px-4 sm:px-6 lg:px-8" // Adjusted min-height
          >
            <CoverDemo /> {/* CoverDemo has internal padding (py-10 md:py-16) */}
          </section>

          {/* PromptEnhancementSection: Follows hero, uses its own internal padding for spacing. */}
          {/* Internal padding: py-12 md:py-16. This creates natural space from hero. */}
          <PromptEnhancementSection />

          {/* EducationalContent: Follows PromptEnhancementSection, uses its own internal padding/margin. */}
          {/* Internal: mt-20 sm:mt-28, py-16. The 'mt' provides space from PromptEnhancementSection. */}
          <EducationalContent />
        </div>
        
        <AppFooter />
      </div>
    </div>
  );
}
