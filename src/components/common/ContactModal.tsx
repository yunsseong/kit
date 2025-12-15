import { useState, type FormEvent } from 'react';
import { useI18n } from '../../contexts/I18nContext';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const { t } = useI18n();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setIsSuccess(true);
        form.reset();
      } else {
        setError(t('contact.error'));
      }
    } catch {
      setError(t('contact.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsSuccess(false);
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-charcoal/50 dark:bg-black/70"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md mx-4 bg-cream dark:bg-dark-card border-3 border-charcoal dark:border-dark-border p-6">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-charcoal dark:text-cream hover:text-lime transition-colors"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="square" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Title */}
        <h2 className="font-display font-bold text-xl mb-6 text-charcoal dark:text-cream">
          {t('contact.title')}
        </h2>

        {isSuccess ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-lime flex items-center justify-center">
              <svg className="w-8 h-8 text-charcoal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="square" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="font-mono text-sm text-charcoal dark:text-cream mb-4">
              {t('contact.success')}
            </p>
            <button
              onClick={handleClose}
              className="h-10 px-6 font-mono text-sm font-bold border-3 border-charcoal dark:border-dark-border hover:bg-charcoal hover:text-cream dark:hover:bg-lime dark:hover:text-charcoal transition-colors"
            >
              {t('contact.close')}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Web3Forms Access Key */}
            <input type="hidden" name="access_key" value="69785d1a-d617-4e6b-858f-9df3bdd12f99" />
            <input type="hidden" name="subject" value="New Contact from Kit" />

            {/* Name */}
            <div>
              <label className="block font-mono text-xs font-bold mb-2 text-charcoal dark:text-cream">
                {t('contact.name')}
              </label>
              <input
                type="text"
                name="name"
                required
                className="w-full h-10 px-3 font-mono text-sm border-3 border-charcoal dark:border-dark-border bg-transparent focus:outline-none focus:border-lime"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block font-mono text-xs font-bold mb-2 text-charcoal dark:text-cream">
                {t('contact.email')}
              </label>
              <input
                type="email"
                name="email"
                required
                className="w-full h-10 px-3 font-mono text-sm border-3 border-charcoal dark:border-dark-border bg-transparent focus:outline-none focus:border-lime"
              />
            </div>

            {/* Message */}
            <div>
              <label className="block font-mono text-xs font-bold mb-2 text-charcoal dark:text-cream">
                {t('contact.message')}
              </label>
              <textarea
                name="message"
                required
                rows={4}
                className="w-full px-3 py-2 font-mono text-sm border-3 border-charcoal dark:border-dark-border bg-transparent focus:outline-none focus:border-lime resize-none"
              />
            </div>

            {/* Error Message */}
            {error && (
              <p className="font-mono text-xs text-red-500">{error}</p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 font-mono text-sm font-bold bg-charcoal text-cream dark:bg-lime dark:text-charcoal border-3 border-charcoal dark:border-lime hover:bg-lime hover:text-charcoal dark:hover:bg-cream transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? t('contact.sending') : t('contact.send')}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
