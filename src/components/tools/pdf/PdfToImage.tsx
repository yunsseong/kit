import { useState, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import ToolLayout from '../../common/ToolLayout';
import FileDropZone from '../../common/FileDropZone';
import { useI18n } from '../../../contexts/I18nContext';

// Set worker path
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

interface PageImage {
  pageNum: number;
  dataUrl: string;
}

export default function PdfToImage() {
  const { t } = useI18n();
  const [images, setImages] = useState<PageImage[]>([]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [scale, setScale] = useState(2);
  const [format, setFormat] = useState<'png' | 'jpeg'>('png');

  const handleFileSelect = useCallback(async (files: File[]) => {
    const file = files[0];
    if (!file) return;

    setProcessing(true);
    setImages([]);
    setProgress(0);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      setTotalPages(pdf.numPages);

      const pageImages: PageImage[] = [];

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d')!;
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({
          canvasContext: context,
          viewport: viewport,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any).promise;

        const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
        const dataUrl = canvas.toDataURL(mimeType, 0.9);

        pageImages.push({ pageNum, dataUrl });
        setProgress(Math.round((pageNum / pdf.numPages) * 100));
      }

      setImages(pageImages);
    } catch (error) {
      console.error('PDF conversion error:', error);
    } finally {
      setProcessing(false);
    }
  }, [scale, format]);

  const downloadImage = (pageImage: PageImage) => {
    const link = document.createElement('a');
    link.download = `page-${pageImage.pageNum}.${format}`;
    link.href = pageImage.dataUrl;
    link.click();
  };

  const downloadAll = () => {
    images.forEach((img, index) => {
      setTimeout(() => downloadImage(img), index * 200);
    });
  };

  return (
    <ToolLayout title={t('tool.pdfToImage')} description={t('tool.pdfToImage.desc')}>
      {/* Settings */}
      <div className="card-brutal">
        <h3 className="font-display font-bold uppercase text-sm mb-4">{t('common.settings')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="font-mono text-sm block mb-2">
              Scale: {scale}x ({scale * 100}%)
            </label>
            <input
              type="range"
              min="1"
              max="4"
              step="0.5"
              value={scale}
              onChange={(e) => setScale(Number(e.target.value))}
              className="w-full accent-lime"
            />
          </div>
          <div>
            <label className="font-mono text-sm block mb-2">{t('image.format')}</label>
            <div className="flex gap-0">
              {(['png', 'jpeg'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFormat(f)}
                  className={`tab flex-1 ${format === f ? 'tab-active' : ''}`}
                >
                  {f.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Upload */}
      {images.length === 0 && !processing && (
        <FileDropZone
          onFileSelect={handleFileSelect}
          accept="application/pdf"
          maxSize={50}
        />
      )}

      {/* Progress */}
      {processing && (
        <div className="card-brutal">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-sm">Converting PDF...</span>
            <span className="font-mono text-sm">{progress}%</span>
          </div>
          <div className="h-4 bg-mist dark:bg-charcoal border-3 border-charcoal dark:border-cream">
            <div
              className="h-full bg-lime transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="font-mono text-xs text-slate dark:text-cream/60 mt-2">
            Processing {totalPages} pages...
          </p>
        </div>
      )}

      {/* Results */}
      {images.length > 0 && (
        <>
          <div className="flex items-center justify-between">
            <label className="font-display font-bold uppercase tracking-wider text-sm">
              Converted Pages ({images.length})
            </label>
            <button onClick={downloadAll} className="btn-brutal">
              Download All
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((img) => (
              <div key={img.pageNum} className="card-brutal p-2">
                <img
                  src={img.dataUrl}
                  alt={`Page ${img.pageNum}`}
                  className="w-full h-auto border-3 border-charcoal dark:border-cream"
                />
                <div className="flex items-center justify-between mt-2">
                  <span className="font-mono text-xs">Page {img.pageNum}</span>
                  <button
                    onClick={() => downloadImage(img)}
                    className="font-mono text-xs text-lime hover:underline"
                  >
                    {t('common.download')}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setImages([])}
            className="btn-brutal"
          >
            Convert Another PDF
          </button>
        </>
      )}
    </ToolLayout>
  );
}
