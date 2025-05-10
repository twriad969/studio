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
        "bg-background/80 backdrop-blur-md sticky top-0 z-50 border-b border-border/60" // Removed shadow for a flatter look
      )}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between"> {/* Reduced height */}
          <Link href="/" className="flex items-center gap-2 group">
            <Sparkles className="h-5 w-5 text-primary group-hover:text-primary/80 transition-colors" /> {/* Slightly smaller icon */}
            <h1 className="font-syne text-xl font-semibold text-foreground tracking-tight"> {/* Applied Syne font, adjusted weight and size */}
              Prompthancer
            </h1>
          </Link>
          <div className="flex items-center gap-2">
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
