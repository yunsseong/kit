import { useState, type ReactNode } from 'react';
import Header from './Header';
import ContactModal from './ContactModal';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isContactOpen, setIsContactOpen] = useState(false);

  return (
    <div className="min-h-screen grid-pattern">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <footer className="border-t-3 border-charcoal dark:border-dark-border mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-center items-center">
            <button
              onClick={() => setIsContactOpen(true)}
              className="font-mono text-sm text-charcoal dark:text-cream hover:text-lime dark:hover:text-lime transition-colors"
            >
              Built by Maesil · <span className="underline">Available for projects</span>
            </button>
          </div>
        </div>
      </footer>
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </div>
  );
}
