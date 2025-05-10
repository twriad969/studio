import { Github, Linkedin, Twitter, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function AppFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={cn("bg-card/50 backdrop-blur-sm border-t border-border/50 mt-16")}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <Sparkles className="h-7 w-7 text-primary group-hover:text-primary/80 transition-colors" />
              <h2 className="text-2xl font-bold text-foreground">
                Prompthancer
              </h2>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Enhancing AI interactions, one prompt at a time. Free, no sign-up required. Built for clarity and power.
            </p>
          </div>
          
          <div className="md:col-span-1">
            <h3 className="text-base font-semibold text-foreground mb-4 tracking-wide">Quick Links</h3>
            <ul className="space-y-2.5">
              <li><Link href="/#how-it-works" className="text-sm text-muted-foreground hover:text-primary transition-colors">How It Works</Link></li>
              <li><Link href="/#benefits" className="text-sm text-muted-foreground hover:text-primary transition-colors">Benefits</Link></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact Us</a></li>
            </ul>
          </div>

          <div className="md:col-span-1">
            <h3 className="text-base font-semibold text-foreground mb-4 tracking-wide">Connect</h3>
            <div className="flex space-x-4">
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="GitHub">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="LinkedIn">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border/50 mt-10 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} Prompthancer. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground/80 mt-1.5">
            Powered by Next.js, Tailwind CSS, and Genkit AI.
          </p>
        </div>
      </div>
    </footer>
  );
}
