import { Link } from 'react-router-dom';

interface ToolCardProps {
  to: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  index?: number;
}

export default function ToolCard({ to, icon, title, description, index = 0 }: ToolCardProps) {
  return (
    <Link
      to={to}
      className={`tool-card group block animate-slide-up stagger-${(index % 8) + 1}`}
      style={{ animationFillMode: 'backwards' }}
    >
      <div className="flex items-start gap-3 sm:gap-4">
        <div className="w-10 h-10 sm:w-12 sm:h-12 border-3 border-charcoal dark:border-dark-border flex items-center justify-center shrink-0 bg-mist dark:bg-dark-bg group-hover:bg-lime group-hover:border-charcoal dark:group-hover:border-lime transition-colors">
          {icon}
        </div>
        <div className="min-w-0">
          <h3 className="font-display font-bold text-base sm:text-lg uppercase tracking-wide truncate group-hover:text-lime transition-colors">
            {title}
          </h3>
          <p className="font-body text-xs sm:text-sm text-slate dark:text-dark-muted mt-0.5 sm:mt-1 line-clamp-1 sm:line-clamp-2">
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
}
