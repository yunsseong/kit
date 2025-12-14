import { useState, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import ToolLayout from '../../common/ToolLayout';
import FileDropZone from '../../common/FileDropZone';
import { useI18n } from '../../../contexts/I18nContext';

// Set worker path
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

interface PageText {
  pageNum: number;
  text: string;
}

export default function PdfTextExtract() {
  const { t } = useI18n();
  const [pageTexts, setPageTexts] = useState<PageText[]>([]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [copied, setCopied] = useState(false);
  const [fileName, setFileName] = useState('');

  const handleFileSelect = useCallback(async (files: File[]) => {
    const file = files[0];
    if (!file) return;

    setProcessing(true);
    setPageTexts([]);
    setProgress(0);
    setFileName(file.name.replace('.pdf', ''));

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      setTotalPages(pdf.numPages);

      const texts: PageText[] = [];

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();

        const pageText = textContent.items
          .map((item) => {
            if ('str' in item) {
              return item.str;
            }
            return '';
          })
          .join(' ')
          .replace(/\s+/g, ' ')
          .trim();

        texts.push({ pageNum, text: pageText });
        setProgress(Math.round((pageNum / pdf.numPages) * 100));
      }

      setPageTexts(texts);
    } catch (error) {
      console.error('PDF text extraction error:', error);
    } finally {
      setProcessing(false);
    }
  }, []);

  const getAllText = () => {
    return pageTexts.map(p => `--- Page ${p.pageNum} ---\n${p.text}`).join('\n\n');
  };

  const copyAllText = async () => {
    try {
      await navigator.clipboard.writeText(getAllText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  const downloadText = () => {
    const blob = new Blob([getAllText()], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName || 'extracted'}-text.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const copyPageText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  return (
    <ToolLayout title={t('tool.pdfTextExtract')} description={t('tool.pdfTextExtract.desc')} seoKey="pdfTextExtract">
      {/* Upload */}
      {pageTexts.length === 0 && !processing && (
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
            <span className="font-mono text-sm">{t('pdf.extracting')}</span>
            <span className="font-mono text-sm">{progress}%</span>
          </div>
          <div className="h-4 bg-mist dark:bg-charcoal border-3 border-charcoal dark:border-cream">
            <div
              className="h-full bg-lime transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="font-mono text-xs text-slate dark:text-cream/60 mt-2">
            {t('pdf.processingPages').replace('{pages}', String(totalPages))}
          </p>
        </div>
      )}

      {/* Results */}
      {pageTexts.length > 0 && (
        <>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <label className="font-display font-bold uppercase tracking-wider text-sm">
              {t('pdf.extractedText')} ({pageTexts.length} {t('pdf.pages').toLowerCase()})
            </label>
            <div className="flex gap-2">
              <button onClick={copyAllText} className="btn-brutal">
                {copied ? t('common.copied') : t('pdf.copyAll')}
              </button>
              <button onClick={downloadText} className="btn-brutal bg-lime">
                {t('pdf.downloadTxt')}
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {pageTexts.map((page) => (
              <div key={page.pageNum} className="card-brutal">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-sm font-bold">
                    {t('pdf.page')} {page.pageNum}
                  </span>
                  <button
                    onClick={() => copyPageText(page.text)}
                    className="font-mono text-xs text-lime hover:underline"
                  >
                    {t('common.copy')}
                  </button>
                </div>
                <div className="bg-mist dark:bg-charcoal border-3 border-charcoal dark:border-cream p-4 max-h-60 overflow-y-auto">
                  <p className="font-mono text-sm whitespace-pre-wrap break-words">
                    {page.text || <span className="text-slate dark:text-cream/50 italic">{t('pdf.noText')}</span>}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setPageTexts([])}
            className="btn-brutal"
          >
            {t('pdf.extractAnother')}
          </button>
        </>
      )}
    </ToolLayout>
  );
}
