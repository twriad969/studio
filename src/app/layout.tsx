import type {Metadata} from 'next';
import {Geist, Geist_Mono} from 'next/font/google';
import { Syne } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const syne = Syne({
  variable: '--font-syne',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'], // Using a range of weights
});

export const metadata: Metadata = {
  title: 'Prompthancer - AI Prompt Enhancement Tool',
  description: 'Transform your basic AI prompts into powerful, precise instructions that get better results instantly. Free, no sign-up required with Prompthancer.',
  keywords: ['prompt enhancement', 'AI prompt tool', 'free prompt generator', 'AI prompt optimizer', 'Gemini API'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} ${syne.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
