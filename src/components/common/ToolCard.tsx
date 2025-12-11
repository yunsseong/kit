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
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 border-3 border-charcoal dark:border-cream flex items-center justify-center shrink-0 bg-mist dark:bg-charcoal group-hover:bg-lime group-hover:border-charcoal transition-colors">
          {icon}
        </div>
        <div className="min-w-0">
          <h3 className="font-display font-bold text-lg uppercase tracking-wide truncate group-hover:text-lime transition-colors">
            {title}
          </h3>
          <p className="font-body text-sm text-slate dark:text-cream/60 mt-1 line-clamp-2">
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
}
