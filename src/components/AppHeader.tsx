import { Zap } from 'lucide-react';
import Link from 'next/link';

export default function AppHeader() {
  return (
    <header className="bg-card shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <Zap className="h-8 w-8 text-primary group-hover:animate-pulse" />
            <h1 className="text-3xl font-bold text-foreground">
              Prompthancer <span className="text-primary">X</span>
            </h1>
          </Link>
          <div className="text-right">
            <p className="text-sm font-medium text-primary">No Sign-Up Needed!</p>
            <p className="text-xs text-muted-foreground hidden sm:block">Instant AI-Powered Prompt Enhancement</p>
          </div>
        </div>
      </div>
    </header>
  );
}
