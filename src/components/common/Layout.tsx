import type { ReactNode } from 'react';
import Header from './Header';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen grid-pattern">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <footer className="border-t-3 border-charcoal dark:border-cream mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="font-mono text-sm text-slate dark:text-cream/60">
              © 2025 Web Tools. All processing happens in your browser.
            </p>
            <div className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 bg-lime"></span>
              <span className="font-mono text-xs text-slate dark:text-cream/60">
                100% Client-side
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
