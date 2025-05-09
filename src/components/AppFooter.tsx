import { Github, Linkedin, Twitter, Zap } from 'lucide-react';
import Link from 'next/link';

export default function AppFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t mt-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <Zap className="h-7 w-7 text-primary group-hover:animate-pulse" />
              <h2 className="text-2xl font-bold text-foreground">
                Prompthancer <span className="text-primary">X</span>
              </h2>
            </Link>
            <p className="text-muted-foreground text-sm">
              Enhancing AI interactions, one prompt at a time. Free, no sign-up required.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="#how-it-works" className="text-muted-foreground hover:text-primary text-sm transition-colors">How It Works</Link></li>
              <li><Link href="#benefits" className="text-muted-foreground hover:text-primary text-sm transition-colors">Benefits</Link></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary text-sm transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary text-sm transition-colors">Contact Us</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Connect With Us</h3>
            <div className="flex space-x-4">
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Twitter">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="GitHub">
                <Github className="h-6 w-6" />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="LinkedIn">
                <Linkedin className="h-6 w-6" />
              </a>
            </div>
            <p className="text-muted-foreground text-xs mt-4">
              Placeholder social links. Feel free to update them.
            </p>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} Prompthancer X. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Built with Next.js, Tailwind CSS, and Genkit AI.
          </p>
        </div>
      </div>
    </footer>
  );
}
