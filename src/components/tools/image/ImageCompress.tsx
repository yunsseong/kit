import { useState } from 'react';
import imageCompression from 'browser-image-compression';
import ToolLayout from '../../common/ToolLayout';
import FileDropZone from '../../common/FileDropZone';
import { useI18n } from '../../../contexts/I18nContext';

export default function ImageCompress() {
  const { t } = useI18n();
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [compressedFile, setCompressedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [compressedPreview, setCompressedPreview] = useState<string | null>(null);
  const [quality, setQuality] = useState(80);
  const [maxWidth, setMaxWidth] = useState(1920);
  const [processing, setProcessing] = useState(false);

  const handleFileSelect = (files: File[]) => {
    const file = files[0];
    if (!file) return;

    setOriginalFile(file);
    setCompressedFile(null);
    setCompressedPreview(null);

    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const compressImage = async () => {
    if (!originalFile) return;

    setProcessing(true);

    try {
      const options = {
        maxSizeMB: 10,
        maxWidthOrHeight: maxWidth,
        useWebWorker: true,
        initialQuality: quality / 100,
      };

      const compressed = await imageCompression(originalFile, options);
      setCompressedFile(compressed);

      const reader = new FileReader();
      reader.onload = (e) => setCompressedPreview(e.target?.result as string);
      reader.readAsDataURL(compressed);
    } catch (error) {
      console.error('Compression error:', error);
    } finally {
      setProcessing(false);
    }
  };

  const downloadImage = () => {
    if (!compressedFile) return;

    const link = document.createElement('a');
    link.download = `compressed-${compressedFile.name}`;
    link.href = URL.createObjectURL(compressedFile);
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const compressionRatio = originalFile && compressedFile
    ? Math.round((1 - compressedFile.size / originalFile.size) * 100)
    : 0;

  return (
    <ToolLayout title={t('tool.imageCompress')} description={t('tool.imageCompress.desc')}>
      {!originalFile ? (
        <FileDropZone
          onFileSelect={handleFileSelect}
          accept="image/*"
          maxSize={20}
        />
      ) : (
        <>
          {/* Settings */}
          <div className="card-brutal">
            <h3 className="font-display font-bold uppercase text-sm mb-4">{t('common.settings')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="font-mono text-sm block mb-2">
                  {t('image.quality')}: {quality}%
                </label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full accent-lime"
                />
              </div>
              <div>
                <label className="font-mono text-sm block mb-2">
                  Max width: {maxWidth}px
                </label>
                <input
                  type="range"
                  min="320"
                  max="4096"
                  step="64"
                  value={maxWidth}
                  onChange={(e) => setMaxWidth(Number(e.target.value))}
                  className="w-full accent-lime"
                />
              </div>
            </div>
          </div>

          {/* Comparison */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Original */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-display font-bold uppercase text-sm">Original</span>
                <span className="font-mono text-sm text-slate dark:text-cream/60">
                  {formatSize(originalFile.size)}
                </span>
              </div>
              <div className="card-brutal p-4">
                <img
                  src={preview || ''}
                  alt="Original"
                  className="max-w-full h-auto max-h-[300px] mx-auto"
                />
              </div>
            </div>

            {/* Compressed */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-display font-bold uppercase text-sm">Compressed</span>
                {compressedFile && (
                  <span className="font-mono text-sm">
                    {formatSize(compressedFile.size)}
                    <span className="text-lime ml-2">-{compressionRatio}%</span>
                  </span>
                )}
              </div>
              <div className="card-brutal p-4 min-h-[300px] flex items-center justify-center">
                {compressedPreview ? (
                  <img
                    src={compressedPreview}
                    alt="Compressed"
                    className="max-w-full h-auto max-h-[300px] mx-auto"
                  />
                ) : (
                  <p className="font-mono text-sm text-slate dark:text-cream/60">
                    Click compress to see result
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Compression Stats */}
          {compressedFile && (
            <div className="card-brutal bg-lime text-charcoal">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-display font-bold uppercase">Compression Result</p>
                  <p className="font-mono text-sm">
                    {formatSize(originalFile.size)} → {formatSize(compressedFile.size)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-display text-4xl font-bold">-{compressionRatio}%</p>
                  <p className="font-mono text-sm">size reduced</p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-4">
            <button
              onClick={compressImage}
              disabled={processing}
              className="btn-brutal-primary"
            >
              {processing ? 'Compressing...' : 'Compress'}
            </button>
            {compressedFile && (
              <button onClick={downloadImage} className="btn-brutal">
                {t('common.download')}
              </button>
            )}
            <button onClick={() => { setOriginalFile(null); setCompressedFile(null); setPreview(null); setCompressedPreview(null); }} className="btn-brutal">
              {t('common.clear')}
            </button>
          </div>
        </>
      )}
    </ToolLayout>
  );
}
