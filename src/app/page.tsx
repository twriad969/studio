import AppHeader from '@/components/AppHeader';
import AppFooter from '@/components/AppFooter';
import PromptEnhancementSection from '@/components/PromptEnhancementSection';
import EducationalContent from '@/components/EducationalContent';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-background to-secondary/30 text-foreground">
      <AppHeader />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <PromptEnhancementSection />
        <EducationalContent />
      </main>
      <AppFooter />
    </div>
  );
}
