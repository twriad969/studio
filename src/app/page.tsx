import AppHeader from '@/components/AppHeader';
import AppFooter from '@/components/AppFooter';
import PromptEnhancementSection from '@/components/PromptEnhancementSection';
import EducationalContent from '@/components/EducationalContent';
import { cn } from '@/lib/utils';

export default function HomePage() {
  return (
    <div 
      className={cn(
        "flex flex-col min-h-screen bg-background text-foreground",
        "[background-image:linear-gradient(to_right,hsl(var(--grid-color))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--grid-color))_1px,transparent_1px)]",
        "[background-size:40px_40px]"
      )}
    >
      <AppHeader />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <PromptEnhancementSection />
        <EducationalContent />
      </main>
      <AppFooter />
    </div>
  );
}
