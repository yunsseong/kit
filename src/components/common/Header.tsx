import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { useI18n } from '../../contexts/I18nContext';

export default function Header() {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useI18n();
  const isHome = location.pathname === '/';

  return (
    <header className="border-b-3 border-charcoal dark:border-cream bg-cream/80 dark:bg-charcoal/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-10 h-10 bg-charcoal dark:bg-cream flex items-center justify-center">
                <span className="font-display font-bold text-cream dark:text-charcoal text-sm">WT</span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-lime"></div>
            </div>
            <span className="font-display font-bold text-lg tracking-tight hidden sm:block group-hover:text-lime transition-colors">
              WEB TOOLS
            </span>
          </Link>

          {/* Navigation (desktop) */}
          {isHome && (
            <nav className="hidden md:flex items-center gap-1">
              <a href="#developer" className="tab">
                {t('nav.developer')}
              </a>
              <a href="#image" className="tab">
                {t('nav.image')}
              </a>
              <a href="#pdf" className="tab">
                {t('nav.pdf')}
              </a>
            </nav>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Language Toggle */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'ko' : 'en')}
              className="px-3 py-1.5 font-mono text-xs font-bold border-3 border-charcoal dark:border-cream hover:bg-charcoal hover:text-cream dark:hover:bg-cream dark:hover:text-charcoal transition-colors"
            >
              {language === 'en' ? '한국어' : 'EN'}
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="w-10 h-10 border-3 border-charcoal dark:border-cream flex items-center justify-center hover:bg-charcoal hover:text-cream dark:hover:bg-cream dark:hover:text-charcoal transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
