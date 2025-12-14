import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import ToolLayout from '../../common/ToolLayout';
import FileDropZone from '../../common/FileDropZone';
import { useI18n } from '../../../contexts/I18nContext';

interface PdfItem {
  id: string;
  file: File;
  name: string;
  pageCount: number;
}

export default function MergePdf() {
  const { t } = useI18n();
  const [pdfs, setPdfs] = useState<PdfItem[]>([]);
  const [processing, setProcessing] = useState(false);

  const handleFileSelect = async (files: File[]) => {
    const newPdfs: PdfItem[] = [];

    for (const file of files) {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);

        newPdfs.push({
          id: Math.random().toString(36).substr(2, 9),
          file,
          name: file.name,
          pageCount: pdf.getPageCount(),
        });
      } catch (error) {
        console.error(`Error loading ${file.name}:`, error);
      }
    }

    setPdfs((prev) => [...prev, ...newPdfs]);
  };

  const removePdf = (id: string) => {
    setPdfs((prev) => prev.filter((pdf) => pdf.id !== id));
  };

  const movePdf = (id: string, direction: 'up' | 'down') => {
    const index = pdfs.findIndex((pdf) => pdf.id === id);
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === pdfs.length - 1)
    ) {
      return;
    }

    const newPdfs = [...pdfs];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    [newPdfs[index], newPdfs[newIndex]] = [newPdfs[newIndex], newPdfs[index]];
    setPdfs(newPdfs);
  };

  const mergePdfs = async () => {
    if (pdfs.length < 2) return;

    setProcessing(true);

    try {
      const mergedPdf = await PDFDocument.create();

      for (const pdfItem of pdfs) {
        const arrayBuffer = await pdfItem.file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        pages.forEach((page) => mergedPdf.addPage(page));
      }

      const pdfBytes = await mergedPdf.save();
      const blob = new Blob([pdfBytes as BlobPart], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.download = `merged-${Date.now()}.pdf`;
      link.href = url;
      link.click();

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('PDF merge error:', error);
    } finally {
      setProcessing(false);
    }
  };

  const totalPages = pdfs.reduce((sum, pdf) => sum + pdf.pageCount, 0);

  return (
    <ToolLayout title={t('tool.mergePdf')} description={t('tool.mergePdf.desc')} seoKey="mergePdf">
      {/* Upload */}
      <FileDropZone
        onFileSelect={handleFileSelect}
        accept="application/pdf"
        multiple
        maxSize={50}
      />

      {/* PDF List */}
      {pdfs.length > 0 && (
        <>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="font-display font-bold uppercase tracking-wider text-sm">
                PDFs to Merge ({pdfs.length} files, {totalPages} pages)
              </label>
            </div>
            <div className="space-y-2">
              {pdfs.map((pdf, index) => (
                <div
                  key={pdf.id}
                  className="card-brutal p-4 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-10 h-10 border-3 border-charcoal dark:border-cream flex items-center justify-center font-display font-bold shrink-0">
                      {index + 1}
                    </div>
                    <div className="min-w-0">
                      <p className="font-mono text-sm truncate">{pdf.name}</p>
                      <p className="font-mono text-xs text-slate dark:text-cream/60">
                        {pdf.pageCount} pages
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => movePdf(pdf.id, 'up')}
                      disabled={index === 0}
                      className="p-2 border-3 border-charcoal dark:border-cream disabled:opacity-50 hover:bg-lime hover:border-charcoal transition-colors"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => movePdf(pdf.id, 'down')}
                      disabled={index === pdfs.length - 1}
                      className="p-2 border-3 border-charcoal dark:border-cream disabled:opacity-50 hover:bg-lime hover:border-charcoal transition-colors"
                    >
                      ↓
                    </button>
                    <button
                      onClick={() => removePdf(pdf.id)}
                      className="p-2 border-3 border-coral bg-coral/20 hover:bg-coral transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-4">
            <button
              onClick={mergePdfs}
              disabled={processing || pdfs.length < 2}
              className="btn-brutal-primary"
            >
              {processing ? 'Merging...' : `Merge ${pdfs.length} PDFs`}
            </button>
            <button onClick={() => setPdfs([])} className="btn-brutal">
              {t('common.clear')}
            </button>
          </div>
        </>
      )}
    </ToolLayout>
  );
}
