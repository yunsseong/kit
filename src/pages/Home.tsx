import { useState, useMemo } from 'react';
import { useI18n } from '../contexts/I18nContext';
import ToolCard from '../components/common/ToolCard';

// Icon components
const CodeIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="square" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
  </svg>
);

const ImageIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="square" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const DocumentIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="square" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
  </svg>
);

const HashIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="square" d="M7 20V4M17 20V4M3 8h18M3 16h18" />
  </svg>
);

const QrIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="square" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
  </svg>
);

const PaletteIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="square" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
  </svg>
);

const KeyIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="square" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
  </svg>
);

const RegexIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="square" d="M4 6h16M4 12h16M4 18h7" />
  </svg>
);

const ResizeIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="square" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
  </svg>
);

const CompressIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="square" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
  </svg>
);

const CropIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="square" d="M7 3v4M3 7h4m0 10v4m4-4h10M17 3v10h4" />
  </svg>
);

const GifIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="square" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
    <path strokeLinecap="square" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const WatermarkIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="square" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
  </svg>
);

const SplitIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="square" d="M8 7h12M8 12h12m-12 5h12M4 7h.01M4 12h.01M4 17h.01" />
  </svg>
);

const MergeIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="square" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

const ExtractIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="square" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

const TextIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="square" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

export default function Home() {
  const { t } = useI18n();
  const [search, setSearch] = useState('');

  const developerTools = [
    { to: '/json-formatter', icon: <CodeIcon />, titleKey: 'tool.jsonFormatter', descKey: 'tool.jsonFormatter.desc' },
    { to: '/base64', icon: <CodeIcon />, titleKey: 'tool.base64', descKey: 'tool.base64.desc' },
    { to: '/url-encoder', icon: <CodeIcon />, titleKey: 'tool.urlEncoder', descKey: 'tool.urlEncoder.desc' },
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
    { to: '/image-to-base64', icon: <CodeIcon />, titleKey: 'tool.imageToBase64', descKey: 'tool.imageToBase64.desc' },
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
        <div className="relative">
          {/* Decorative elements */}
          <div className="absolute -top-4 -left-4 w-24 h-24 border-3 border-lime opacity-50"></div>
          <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-lime opacity-30"></div>

          <div className="relative z-10">
            <h1 className="font-display text-5xl md:text-7xl font-bold uppercase tracking-tighter mb-4">
              {t('hero.title')}
              <span className="inline-block w-4 h-4 md:w-6 md:h-6 bg-lime ml-2 animate-pulse-slow"></span>
            </h1>
            <p className="font-body text-lg md:text-xl text-slate dark:text-cream/70 max-w-2xl mb-8">
              {t('hero.subtitle')}
            </p>

            {/* Search */}
            <div className="max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder={t('hero.search')}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="input-brutal pl-12"
                />
                <svg
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate dark:text-cream/50"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="square" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
