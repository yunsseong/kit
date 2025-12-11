import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../../contexts/I18nContext';

interface ToolLayoutProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export default function ToolLayout({ title, description, children }: ToolLayoutProps) {
  const { t } = useI18n();

  return (
    <div className="animate-slide-up">
      {/* Back Button & Title */}
      <div className="mb-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 font-display text-sm font-bold uppercase tracking-wider hover:text-lime transition-colors mb-4"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="square" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          {t('common.back')}
        </Link>
        <h1 className="font-display text-3xl md:text-4xl font-bold uppercase tracking-tight">
          {title}
        </h1>
        {description && (
          <p className="mt-2 text-slate dark:text-cream/60 font-body">
            {description}
          </p>
        )}
      </div>

      {/* Content */}
      <div className="space-y-6">
        {children}
      </div>
    </div>
  );
}
