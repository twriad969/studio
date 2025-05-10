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
import { BackgroundBeams } from "@/components/ui/background-beams";
import { Spotlight } from "@/components/ui/spotlight"; // Added Spotlight import

export default function HomePage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleDarkMode = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  if (!mounted) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300 relative overflow-hidden"
      )}
    >
      {/* Conditionally render Spotlight based on theme, positioned to cover upper area */}
      {mounted && theme === "dark" && (
        <Spotlight
          className="absolute -top-40 -left-20 md:-left-1/4 md:-top-1/3 opacity-70" // Adjusted positioning for upper area
          fill="white"
        />
      )}

      <BackgroundBeams className="absolute top-0 left-0 w-full h-full z-0" />

      <div className="relative z-10 flex flex-col min-h-screen">
        <AppHeader>
          <Button onClick={toggleDarkMode} variant="ghost" size="icon" aria-label="Toggle theme">
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </AppHeader>
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <section className="text-center">
            <CoverDemo />
          </section>

          <PromptEnhancementSection /> {/* Removed currentTheme prop */}
          <EducationalContent />
        </main>
        <AppFooter />
      </div>
    </div>
  );
}
