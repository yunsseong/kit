export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="relative">
        <div className="w-16 h-16 border-3 border-charcoal dark:border-dark-border">
          <div className="absolute inset-0 bg-lime animate-pulse"></div>
        </div>
        <div className="absolute -bottom-2 -right-2 w-16 h-16 border-3 border-charcoal dark:border-dark-border bg-cream dark:bg-dark-card"></div>
        <div className="absolute -bottom-4 -right-4 w-16 h-16 border-3 border-lime"></div>
      </div>
    </div>
  );
}
