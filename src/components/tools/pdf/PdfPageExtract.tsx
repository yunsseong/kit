import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import ToolLayout from '../../common/ToolLayout';
import FileDropZone from '../../common/FileDropZone';
import { useI18n } from '../../../contexts/I18nContext';

export default function PdfPageExtract() {
  const { t } = useI18n();
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [pageInput, setPageInput] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (files: File[]) => {
    const file = files[0];
    if (!file) return;

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      setPageCount(pdf.getPageCount());
      setPdfFile(file);
      setError(null);
    } catch (err) {
      console.error('Error loading PDF:', err);
      setError('Failed to load PDF');
    }
  };

  const parsePageInput = (input: string): number[] => {
    const pages: Set<number> = new Set();

    // Split by comma
    const parts = input.split(',').map((p) => p.trim());

    for (const part of parts) {
      if (part.includes('-')) {
        // Handle range (e.g., "1-5")
        const [start, end] = part.split('-').map((n) => parseInt(n.trim()));
        if (!isNaN(start) && !isNaN(end)) {
          for (let i = Math.min(start, end); i <= Math.max(start, end); i++) {
            if (i >= 1 && i <= pageCount) {
              pages.add(i);
            }
          }
        }
      } else {
        // Handle single page
        const page = parseInt(part);
        if (!isNaN(page) && page >= 1 && page <= pageCount) {
          pages.add(page);
        }
      }
    }

    return Array.from(pages).sort((a, b) => a - b);
  };

  const extractPages = async () => {
    if (!pdfFile || !pageInput.trim()) return;

    const pagesToExtract = parsePageInput(pageInput);

    if (pagesToExtract.length === 0) {
      setError('No valid pages specified');
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const arrayBuffer = await pdfFile.arrayBuffer();
      const sourcePdf = await PDFDocument.load(arrayBuffer);

      const newPdf = await PDFDocument.create();

      // Convert to 0-based indices
      const pageIndices = pagesToExtract.map((p) => p - 1);
      const pages = await newPdf.copyPages(sourcePdf, pageIndices);
      pages.forEach((page) => newPdf.addPage(page));

      const pdfBytes = await newPdf.save();
      const blob = new Blob([pdfBytes as BlobPart], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.download = `extracted-pages.pdf`;
      link.href = url;
      link.click();

      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('PDF extraction error:', err);
      setError('Failed to extract pages');
    } finally {
      setProcessing(false);
    }
  };

  const previewPages = parsePageInput(pageInput);

  return (
    <ToolLayout title={t('tool.pdfPageExtract')} description={t('tool.pdfPageExtract.desc')} seoKey="pdfPageExtract">
      {!pdfFile ? (
        <FileDropZone
          onFileSelect={handleFileSelect}
          accept="application/pdf"
          maxSize={50}
        />
      ) : (
        <>
          {/* File Info */}
          <div className="card-brutal">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-mono text-sm">{pdfFile.name}</p>
                <p className="font-mono text-xs text-slate dark:text-cream/60">
                  {pageCount} pages total
                </p>
              </div>
              <button
                onClick={() => {
                  setPdfFile(null);
                  setPageInput('');
                  setError(null);
                }}
                className="btn-brutal btn-brutal-sm"
              >
                Change
              </button>
            </div>
          </div>

          {/* Page Selection */}
          <div className="card-brutal">
            <h3 className="font-display font-bold uppercase text-sm mb-4">
              {t('pdf.selectPages')}
            </h3>
            <input
              type="text"
              value={pageInput}
              onChange={(e) => {
                setPageInput(e.target.value);
                setError(null);
              }}
              placeholder="e.g., 1, 3, 5-7, 10"
              className="input-brutal mb-4"
            />

            {/* Quick Select */}
            <div className="flex flex-wrap gap-2 mb-4">
              <button
                onClick={() => setPageInput(`1-${pageCount}`)}
                className="tab"
              >
                All
              </button>
              <button
                onClick={() =>
                  setPageInput(
                    Array.from({ length: pageCount }, (_, i) => i + 1)
                      .filter((p) => p % 2 === 1)
                      .join(', ')
                  )
                }
                className="tab"
              >
                Odd
              </button>
              <button
                onClick={() =>
                  setPageInput(
                    Array.from({ length: pageCount }, (_, i) => i + 1)
                      .filter((p) => p % 2 === 0)
                      .join(', ')
                  )
                }
                className="tab"
              >
                Even
              </button>
              <button onClick={() => setPageInput('1')} className="tab">
                First
              </button>
              <button onClick={() => setPageInput(String(pageCount))} className="tab">
                Last
              </button>
            </div>

            {/* Preview */}
            {previewPages.length > 0 && (
              <div className="bg-mist dark:bg-charcoal p-3 border-3 border-charcoal dark:border-cream">
                <p className="font-mono text-sm">
                  <span className="text-slate dark:text-cream/60">Pages to extract: </span>
                  {previewPages.length <= 10
                    ? previewPages.join(', ')
                    : `${previewPages.slice(0, 10).join(', ')}... (${previewPages.length} total)`}
                </p>
              </div>
            )}

            {error && (
              <p className="mt-2 font-mono text-sm text-coral">{error}</p>
            )}
          </div>

          {/* Visual Page Selector */}
          <div>
            <label className="font-display font-bold uppercase tracking-wider text-sm mb-2 block">
              Click to Toggle Pages
            </label>
            <div className="grid grid-cols-10 gap-1">
              {Array.from({ length: pageCount }, (_, i) => i + 1).map((page) => {
                const isSelected = previewPages.includes(page);
                return (
                  <button
                    key={page}
                    onClick={() => {
                      const current = parsePageInput(pageInput);
                      if (current.includes(page)) {
                        setPageInput(current.filter((p) => p !== page).join(', '));
                      } else {
                        setPageInput([...current, page].sort((a, b) => a - b).join(', '));
                      }
                    }}
                    className={`aspect-square border-3 font-mono text-xs transition-colors
                      ${isSelected
                        ? 'bg-lime border-charcoal text-charcoal'
                        : 'border-charcoal dark:border-cream hover:bg-mist dark:hover:bg-slate'
                      }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-4">
            <button
              onClick={extractPages}
              disabled={processing || previewPages.length === 0}
              className="btn-brutal-primary"
            >
              {processing ? 'Extracting...' : `Extract ${previewPages.length} Pages`}
            </button>
            <button
              onClick={() => {
                setPdfFile(null);
                setPageInput('');
                setError(null);
              }}
              className="btn-brutal"
            >
              {t('common.clear')}
            </button>
          </div>
        </>
      )}
    </ToolLayout>
  );
}
