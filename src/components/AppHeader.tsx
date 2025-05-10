import { Sparkles } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface AppHeaderProps {
  children?: ReactNode; // To allow passing the theme toggle button
}

export default function AppHeader({ children }: AppHeaderProps) {
  return (
    <header className={cn(
        "bg-background/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-border/60"
      )}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 sm:h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <Sparkles className="h-6 w-6 sm:h-7 sm:w-7 text-primary group-hover:text-primary/80 transition-colors" />
            <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
              Prompthancer
            </h1>
          </Link>
          <div className="flex items-center gap-3"> {/* Reduced gap slightly */}
            <div className="text-right hidden sm:block">
              <p className="text-xs font-medium text-muted-foreground">No Sign-Up Needed!</p>
            </div>
            {children} {/* Render the theme toggle button here */}
          </div>
        </div>
      </div>
    </header>
  );
}
