import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import ToolLayout from '../../common/ToolLayout';
import FileDropZone from '../../common/FileDropZone';
import { useI18n } from '../../../contexts/I18nContext';

export default function CompressPdf() {
  const { t } = useI18n();
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);
  const [processing, setProcessing] = useState(false);
  const [stats, setStats] = useState<{ original: number; compressed: number } | null>(null);

  const handleFileSelect = async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    setOriginalFile(file);
    setCompressedBlob(null);
    setStats(null);
  };

  const compressPdf = async () => {
    if (!originalFile) return;

    setProcessing(true);

    try {
      const arrayBuffer = await originalFile.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);

      // PDF-lib doesn't have built-in compression, but we can:
      // 1. Remove metadata
      // 2. Use objectsPerTick for streaming
      // 3. Basic optimization through re-serialization

      // Remove metadata
      pdf.setTitle('');
      pdf.setAuthor('');
      pdf.setSubject('');
      pdf.setKeywords([]);
      pdf.setProducer('');
      pdf.setCreator('');

      const pdfBytes = await pdf.save({
        useObjectStreams: true, // This can help reduce size
        addDefaultPage: false,
      });

      const blob = new Blob([pdfBytes as BlobPart], { type: 'application/pdf' });
      setCompressedBlob(blob);
      setStats({
        original: originalFile.size,
        compressed: blob.size,
      });
    } catch (error) {
      console.error('PDF compression error:', error);
    } finally {
      setProcessing(false);
    }
  };

  const downloadPdf = () => {
    if (!compressedBlob) return;

    const url = URL.createObjectURL(compressedBlob);
    const link = document.createElement('a');
    link.download = `compressed-${originalFile?.name || 'document.pdf'}`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const compressionRatio = stats
    ? Math.round((1 - stats.compressed / stats.original) * 100)
    : 0;

  return (
    <ToolLayout title={t('tool.compressPdf')} description={t('tool.compressPdf.desc')} seoKey="compressPdf">
      {!originalFile ? (
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
                <p className="font-mono text-sm">{originalFile.name}</p>
                <p className="font-mono text-xs text-slate dark:text-cream/60">
                  Original size: {formatSize(originalFile.size)}
                </p>
              </div>
              <button
                onClick={() => {
                  setOriginalFile(null);
                  setCompressedBlob(null);
                  setStats(null);
                }}
                className="btn-brutal btn-brutal-sm"
              >
                Change
              </button>
            </div>
          </div>

          {/* Compression Info */}
          <div className="card-brutal bg-mist dark:bg-slate">
            <h3 className="font-display font-bold uppercase text-sm mb-2">Compression Methods</h3>
            <ul className="font-mono text-sm space-y-1 text-slate dark:text-cream/70">
              <li>✓ Remove metadata (title, author, etc.)</li>
              <li>✓ Use object streams</li>
              <li>✓ Re-serialize PDF structure</li>
            </ul>
            <p className="mt-3 font-mono text-xs text-slate dark:text-cream/50">
              Note: Client-side compression is limited. For better results, consider using server-side tools.
            </p>
          </div>

          {/* Compression Stats */}
          {stats && (
            <div className={`card-brutal ${compressionRatio > 0 ? 'bg-lime text-charcoal' : 'bg-coral/20'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-display font-bold uppercase">Compression Result</p>
                  <p className="font-mono text-sm">
                    {formatSize(stats.original)} → {formatSize(stats.compressed)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-display text-4xl font-bold">
                    {compressionRatio > 0 ? `-${compressionRatio}%` : `+${Math.abs(compressionRatio)}%`}
                  </p>
                  <p className="font-mono text-sm">
                    {compressionRatio > 0 ? 'size reduced' : 'size increased'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-4">
            {!compressedBlob ? (
              <button
                onClick={compressPdf}
                disabled={processing}
                className="btn-brutal-primary"
              >
                {processing ? 'Compressing...' : 'Compress PDF'}
              </button>
            ) : (
              <button onClick={downloadPdf} className="btn-brutal-primary">
                {t('common.download')} Compressed PDF
              </button>
            )}
            <button
              onClick={() => {
                setOriginalFile(null);
                setCompressedBlob(null);
                setStats(null);
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
