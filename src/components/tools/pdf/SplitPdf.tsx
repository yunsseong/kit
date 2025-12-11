import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import ToolLayout from '../../common/ToolLayout';
import FileDropZone from '../../common/FileDropZone';
import { useI18n } from '../../../contexts/I18nContext';

export default function SplitPdf() {
  const { t } = useI18n();
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [splitMode, setSplitMode] = useState<'all' | 'range'>('all');
  const [rangeStart, setRangeStart] = useState(1);
  const [rangeEnd, setRangeEnd] = useState(1);
  const [processing, setProcessing] = useState(false);

  const handleFileSelect = async (files: File[]) => {
    const file = files[0];
    if (!file) return;

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      setPageCount(pdf.getPageCount());
      setRangeEnd(pdf.getPageCount());
      setPdfFile(file);
    } catch (error) {
      console.error('Error loading PDF:', error);
    }
  };

  const splitPdf = async () => {
    if (!pdfFile) return;

    setProcessing(true);

    try {
      const arrayBuffer = await pdfFile.arrayBuffer();
      const sourcePdf = await PDFDocument.load(arrayBuffer);

      if (splitMode === 'all') {
        // Split into individual pages
        for (let i = 0; i < sourcePdf.getPageCount(); i++) {
          const newPdf = await PDFDocument.create();
          const [page] = await newPdf.copyPages(sourcePdf, [i]);
          newPdf.addPage(page);

          const pdfBytes = await newPdf.save();
          const blob = new Blob([pdfBytes as BlobPart], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);

          const link = document.createElement('a');
          link.download = `page-${i + 1}.pdf`;
          link.href = url;
          link.click();

          URL.revokeObjectURL(url);

          // Small delay between downloads
          await new Promise((resolve) => setTimeout(resolve, 200));
        }
      } else {
        // Extract range
        const newPdf = await PDFDocument.create();
        const pageIndices = [];

        for (let i = rangeStart - 1; i < Math.min(rangeEnd, sourcePdf.getPageCount()); i++) {
          pageIndices.push(i);
        }

        const pages = await newPdf.copyPages(sourcePdf, pageIndices);
        pages.forEach((page) => newPdf.addPage(page));

        const pdfBytes = await newPdf.save();
        const blob = new Blob([pdfBytes as BlobPart], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.download = `pages-${rangeStart}-${rangeEnd}.pdf`;
        link.href = url;
        link.click();

        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('PDF split error:', error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <ToolLayout title={t('tool.splitPdf')} description={t('tool.splitPdf.desc')}>
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
                  {pageCount} pages
                </p>
              </div>
              <button
                onClick={() => setPdfFile(null)}
                className="btn-brutal btn-brutal-sm"
              >
                Change
              </button>
            </div>
          </div>

          {/* Split Mode */}
          <div className="card-brutal">
            <h3 className="font-display font-bold uppercase text-sm mb-4">Split Mode</h3>
            <div className="space-y-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="splitMode"
                  checked={splitMode === 'all'}
                  onChange={() => setSplitMode('all')}
                  className="mt-1 w-5 h-5 accent-lime"
                />
                <div>
                  <p className="font-display font-bold">Split All Pages</p>
                  <p className="font-mono text-sm text-slate dark:text-cream/60">
                    Create {pageCount} separate PDF files
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="splitMode"
                  checked={splitMode === 'range'}
                  onChange={() => setSplitMode('range')}
                  className="mt-1 w-5 h-5 accent-lime"
                />
                <div className="flex-1">
                  <p className="font-display font-bold">Extract Page Range</p>
                  <p className="font-mono text-sm text-slate dark:text-cream/60 mb-2">
                    Extract specific pages to a new PDF
                  </p>
                  {splitMode === 'range' && (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="1"
                        max={pageCount}
                        value={rangeStart}
                        onChange={(e) => setRangeStart(Number(e.target.value))}
                        className="input-brutal w-20"
                      />
                      <span className="font-mono">to</span>
                      <input
                        type="number"
                        min="1"
                        max={pageCount}
                        value={rangeEnd}
                        onChange={(e) => setRangeEnd(Number(e.target.value))}
                        className="input-brutal w-20"
                      />
                    </div>
                  )}
                </div>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-4">
            <button
              onClick={splitPdf}
              disabled={processing}
              className="btn-brutal-primary"
            >
              {processing ? 'Splitting...' : 'Split PDF'}
            </button>
            <button onClick={() => setPdfFile(null)} className="btn-brutal">
              {t('common.clear')}
            </button>
          </div>
        </>
      )}
    </ToolLayout>
  );
}
