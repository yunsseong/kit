import { useMemo } from 'react';
import { useI18n } from '../contexts/I18nContext';
import { useSearch } from '../contexts/SearchContext';
import ToolCard from '../components/common/ToolCard';

// Icon components - Brutalist geometric style
const CodeIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
);

const Base64Icon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
    <rect x="3" y="5" width="8" height="6" />
    <rect x="3" y="13" width="8" height="6" />
    <rect x="13" y="7" width="8" height="2" />
    <rect x="13" y="11" width="6" height="2" />
    <rect x="13" y="15" width="8" height="2" />
  </svg>
);

const UrlIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

const ImageBase64Icon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="6" width="10" height="12" />
    <line x1="15" y1="8" x2="22" y2="8" />
    <line x1="15" y1="12" x2="22" y2="12" />
    <line x1="15" y1="16" x2="22" y2="16" />
  </svg>
);

const ImageIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);

const DocumentIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
);

const HashIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" y1="9" x2="20" y2="9" />
    <line x1="4" y1="15" x2="20" y2="15" />
    <line x1="10" y1="3" x2="8" y2="21" />
    <line x1="16" y1="3" x2="14" y2="21" />
  </svg>
);

const QrIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
    <rect x="14" y="14" width="4" height="4" />
    <rect x="17" y="17" width="4" height="4" />
  </svg>
);

const PaletteIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a10 10 0 0 0 0 20" fill="currentColor" />
  </svg>
);

const KeyIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" y1="8" x2="20" y2="8" />
    <line x1="4" y1="12" x2="20" y2="12" />
    <line x1="4" y1="16" x2="20" y2="16" />
  </svg>
);

const RegexIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 3v10" />
    <path d="M12.67 5.5l8.66 5" />
    <path d="M12.67 10.5l8.66-5" />
    <path d="M9 17a4 4 0 1 1-8 0 4 4 0 0 1 8 0z" fill="currentColor" />
  </svg>
);

const ResizeIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 3 21 3 21 9" />
    <polyline points="9 21 3 21 3 15" />
    <line x1="21" y1="3" x2="14" y2="10" />
    <line x1="3" y1="21" x2="10" y2="14" />
  </svg>
);

const CompressIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="4 14 10 14 10 20" />
    <polyline points="20 10 14 10 14 4" />
    <line x1="14" y1="10" x2="21" y2="3" />
    <line x1="3" y1="21" x2="10" y2="14" />
  </svg>
);

const CropIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2v4" />
    <path d="M2 6h4" />
    <path d="M6 6v10a2 2 0 0 0 2 2h10" />
    <path d="M18 22v-4" />
    <path d="M22 18h-4" />
    <path d="M18 18V8a2 2 0 0 0-2-2H6" />
  </svg>
);

const GifIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" />
  </svg>
);

const WatermarkIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <text x="12" y="15" textAnchor="middle" fontSize="10" fontWeight="bold" fill="currentColor" stroke="none">Aa</text>
  </svg>
);

const SplitIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="2" width="7" height="20" rx="1" />
    <rect x="14" y="2" width="7" height="20" rx="1" />
  </svg>
);

const MergeIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const ExtractIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <rect x="7" y="7" width="10" height="10" rx="1" fill="currentColor" stroke="none" />
  </svg>
);

const TextIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="9" y1="13" x2="15" y2="13" />
    <line x1="9" y1="17" x2="15" y2="17" />
  </svg>
);

export default function Home() {
  const { t } = useI18n();
  const { search } = useSearch();

  const developerTools = [
    { to: '/json-formatter', icon: <CodeIcon />, titleKey: 'tool.jsonFormatter', descKey: 'tool.jsonFormatter.desc' },
    { to: '/base64', icon: <Base64Icon />, titleKey: 'tool.base64', descKey: 'tool.base64.desc' },
    { to: '/url-encoder', icon: <UrlIcon />, titleKey: 'tool.urlEncoder', descKey: 'tool.urlEncoder.desc' },
    { to: '/hash-generator', icon: <HashIcon />, titleKey: 'tool.hashGenerator', descKey: 'tool.hashGenerator.desc' },
    { to: '/qr-generator', icon: <QrIcon />, titleKey: 'tool.qrGenerator', descKey: 'tool.qrGenerator.desc' },
    { to: '/color-converter', icon: <PaletteIcon />, titleKey: 'tool.colorConverter', descKey: 'tool.colorConverter.desc' },
    { to: '/uuid-generator', icon: <KeyIcon />, titleKey: 'tool.uuidGenerator', descKey: 'tool.uuidGenerator.desc' },
    { to: '/regex-tester', icon: <RegexIcon />, titleKey: 'tool.regexTester', descKey: 'tool.regexTester.desc' },
  ];

  const imageTools = [
    { to: '/image-resize', icon: <ResizeIcon />, titleKey: 'tool.imageResize', descKey: 'tool.imageResize.desc' },
    { to: '/image-compress', icon: <CompressIcon />, titleKey: 'tool.imageCompress', descKey: 'tool.imageCompress.desc' },
    { to: '/format-convert', icon: <ImageIcon />, titleKey: 'tool.formatConvert', descKey: 'tool.formatConvert.desc' },
    { to: '/image-crop', icon: <CropIcon />, titleKey: 'tool.imageCrop', descKey: 'tool.imageCrop.desc' },
    { to: '/gif-maker', icon: <GifIcon />, titleKey: 'tool.gifMaker', descKey: 'tool.gifMaker.desc' },
    { to: '/image-to-base64', icon: <ImageBase64Icon />, titleKey: 'tool.imageToBase64', descKey: 'tool.imageToBase64.desc' },
    { to: '/add-watermark', icon: <WatermarkIcon />, titleKey: 'tool.addWatermark', descKey: 'tool.addWatermark.desc' },
  ];

  const pdfTools = [
    { to: '/pdf-to-image', icon: <ImageIcon />, titleKey: 'tool.pdfToImage', descKey: 'tool.pdfToImage.desc' },
    { to: '/image-to-pdf', icon: <DocumentIcon />, titleKey: 'tool.imageToPdf', descKey: 'tool.imageToPdf.desc' },
    { to: '/merge-pdf', icon: <MergeIcon />, titleKey: 'tool.mergePdf', descKey: 'tool.mergePdf.desc' },
    { to: '/split-pdf', icon: <SplitIcon />, titleKey: 'tool.splitPdf', descKey: 'tool.splitPdf.desc' },
    { to: '/compress-pdf', icon: <CompressIcon />, titleKey: 'tool.compressPdf', descKey: 'tool.compressPdf.desc' },
    { to: '/pdf-page-extract', icon: <ExtractIcon />, titleKey: 'tool.pdfPageExtract', descKey: 'tool.pdfPageExtract.desc' },
    { to: '/pdf-text-extract', icon: <TextIcon />, titleKey: 'tool.pdfTextExtract', descKey: 'tool.pdfTextExtract.desc' },
  ];

  const filterTools = (tools: typeof developerTools) => {
    if (!search.trim()) return tools;
    const searchLower = search.toLowerCase();
    return tools.filter(tool =>
      t(tool.titleKey).toLowerCase().includes(searchLower) ||
      t(tool.descKey).toLowerCase().includes(searchLower)
    );
  };

  const filteredDeveloper = useMemo(() => filterTools(developerTools), [search, t]);
  const filteredImage = useMemo(() => filterTools(imageTools), [search, t]);
  const filteredPdf = useMemo(() => filterTools(pdfTools), [search, t]);

  return (
    <div>
      {/* Hero Section */}
      <section className="mb-16 pt-8">
        <h1 className="font-display text-5xl md:text-7xl font-bold uppercase tracking-tighter mb-4">
          {t('hero.title')}
        </h1>
        <p className="font-body text-lg md:text-xl text-slate dark:text-cream/70 max-w-2xl">
          {t('hero.subtitle')}
        </p>
      </section>

      {/* Developer Tools */}
      {filteredDeveloper.length > 0 && (
        <section id="developer" className="mb-16 scroll-mt-24">
          <h2 className="section-title">{t('category.developer')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredDeveloper.map((tool, index) => (
              <ToolCard
                key={tool.to}
                to={tool.to}
                icon={tool.icon}
                title={t(tool.titleKey)}
                description={t(tool.descKey)}
                index={index}
              />
            ))}
          </div>
        </section>
      )}

      {/* Image Tools */}
      {filteredImage.length > 0 && (
        <section id="image" className="mb-16 scroll-mt-24">
          <h2 className="section-title">{t('category.image')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredImage.map((tool, index) => (
              <ToolCard
                key={tool.to}
                to={tool.to}
                icon={tool.icon}
                title={t(tool.titleKey)}
                description={t(tool.descKey)}
                index={index}
              />
            ))}
          </div>
        </section>
      )}

      {/* PDF Tools */}
      {filteredPdf.length > 0 && (
        <section id="pdf" className="mb-16 scroll-mt-24">
          <h2 className="section-title">{t('category.pdf')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredPdf.map((tool, index) => (
              <ToolCard
                key={tool.to}
                to={tool.to}
                icon={tool.icon}
                title={t(tool.titleKey)}
                description={t(tool.descKey)}
                index={index}
              />
            ))}
          </div>
        </section>
      )}

      {/* No results */}
      {search && filteredDeveloper.length === 0 && filteredImage.length === 0 && filteredPdf.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto border-3 border-charcoal dark:border-cream mb-4 flex items-center justify-center">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="square" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="font-display text-xl">No tools found</p>
          <p className="font-body text-slate dark:text-cream/60 mt-2">Try a different search term</p>
        </div>
      )}
    </div>
  );
}
