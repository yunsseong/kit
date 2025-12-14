import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
}

export function useSEO({ title, description }: SEOProps) {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    }

    // Update Open Graph title
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', title);
    }

    // Update Open Graph description
    let ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', description);
    }

    // Update Twitter title
    let twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) {
      twitterTitle.setAttribute('content', title);
    }

    // Update Twitter description
    let twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (twitterDescription) {
      twitterDescription.setAttribute('content', description);
    }

    // Cleanup - restore defaults when component unmounts
    return () => {
      document.title = 'Kit | Free Online Utilities';

      const defaultDescription = 'Kit - Free online utilities for images, PDFs, and developers. No uploads, all processing happens in your browser.';

      if (metaDescription) {
        metaDescription.setAttribute('content', defaultDescription);
      }
      if (ogTitle) {
        ogTitle.setAttribute('content', 'Kit | Free Online Utilities');
      }
      if (ogDescription) {
        ogDescription.setAttribute('content', defaultDescription);
      }
      if (twitterTitle) {
        twitterTitle.setAttribute('content', 'Kit | Free Online Utilities');
      }
      if (twitterDescription) {
        twitterDescription.setAttribute('content', defaultDescription);
      }
    };
  }, [title, description]);
}
