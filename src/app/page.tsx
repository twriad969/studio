
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
// BackgroundBeams import removed

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
          // hsl(var(--grid-color)) will be resolved based on the current theme (light/dark)
          "[background-image:linear-gradient(to_right,hsl(var(--grid-color))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--grid-color))_1px,transparent_1px)]"
        )}
      />
      <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      
      {/* Dark Mode Spotlight, positioned to cover upper area */}
      {theme === "dark" && (
        <Spotlight
          className="absolute -top-40 left-1/2 -translate-x-1/2 md:-top-20 z-[2]"
          fill="hsl(var(--foreground))" 
        />
      )}
      
      {/* BackgroundBeams component removed */}

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

          <PromptEnhancementSection />
          <EducationalContent />
        </main>
        <AppFooter />
      </div>
    </div>
  );
}
