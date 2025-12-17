import { useState, type ReactNode } from 'react';
import Header from './Header';
import ContactModal from './ContactModal';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isContactOpen, setIsContactOpen] = useState(false);

  return (
    <div className="min-h-[100dvh] grid-pattern flex flex-col">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 w-full">
        {children}
      </main>
      <footer className="border-t-3 border-charcoal dark:border-dark-border mt-8 sm:mt-16 pb-safe">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 pb-6 sm:pb-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0">
            <a
              href="https://maesil.io"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs sm:text-sm text-charcoal dark:text-cream hover:text-lime dark:hover:text-lime transition-colors"
            >
              © {new Date().getFullYear()} Maesil
            </a>
            <button
              onClick={() => setIsContactOpen(true)}
              className="font-mono text-xs sm:text-sm text-charcoal dark:text-cream hover:text-lime dark:hover:text-lime transition-colors"
            >
              <span className="underline">Available for projects</span>
            </button>
          </div>
        </div>
      </footer>
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </div>
  );
}
