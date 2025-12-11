import { useState, useRef } from 'react';
import ToolLayout from '../../common/ToolLayout';
import FileDropZone from '../../common/FileDropZone';
import { useI18n } from '../../../contexts/I18nContext';

type OutputFormat = 'png' | 'jpeg' | 'webp';

export default function FormatConvert() {
  const { t } = useI18n();
  const [image, setImage] = useState<string | null>(null);
  const [originalFormat, setOriginalFormat] = useState<string>('');
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('png');
  const [quality, setQuality] = useState(90);
  const [processing, setProcessing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileSelect = (files: File[]) => {
    const file = files[0];
    if (!file) return;

    const format = file.type.split('/')[1] || 'unknown';
    setOriginalFormat(format.toUpperCase());

    const reader = new FileReader();
    reader.onload = (e) => setImage(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const convertImage = async () => {
    if (!image || !canvasRef.current) return;

    setProcessing(true);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      setProcessing(false);
    };
    img.src = image;
  };

  const downloadImage = () => {
    if (!canvasRef.current) return;

    const mimeType = `image/${outputFormat}`;
    const qualityValue = outputFormat === 'png' ? undefined : quality / 100;

    const link = document.createElement('a');
    link.download = `converted.${outputFormat}`;
    link.href = canvasRef.current.toDataURL(mimeType, qualityValue);
    link.click();
  };

  return (
    <ToolLayout title={t('tool.formatConvert')} description={t('tool.formatConvert.desc')}>
      {!image ? (
        <FileDropZone
          onFileSelect={handleFileSelect}
          accept="image/*"
          maxSize={20}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Preview */}
            <div>
              <label className="font-display font-bold uppercase tracking-wider text-sm mb-2 block">
                Original ({originalFormat})
              </label>
              <div className="card-brutal p-4">
                <img
                  src={image}
                  alt="Original"
                  className="max-w-full h-auto max-h-[300px] mx-auto"
                />
              </div>
            </div>

            {/* Settings */}
            <div>
              <label className="font-display font-bold uppercase tracking-wider text-sm mb-2 block">
                {t('common.settings')}
              </label>
              <div className="card-brutal space-y-6">
                {/* Format Selection */}
                <div>
                  <label className="font-mono text-sm block mb-2">{t('image.format')}</label>
                  <div className="flex gap-0">
                    {(['png', 'jpeg', 'webp'] as const).map((format) => (
                      <button
                        key={format}
                        onClick={() => setOutputFormat(format)}
                        className={`tab flex-1 ${outputFormat === format ? 'tab-active' : ''}`}
                      >
                        {format.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quality (for JPEG/WebP) */}
                {outputFormat !== 'png' && (
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
                )}

                {/* Format Info */}
                <div className="bg-mist dark:bg-charcoal p-4 border-3 border-charcoal dark:border-cream">
                  <p className="font-mono text-sm">
                    {outputFormat === 'png' && '✓ Lossless, supports transparency'}
                    {outputFormat === 'jpeg' && '✓ Smaller file size, no transparency'}
                    {outputFormat === 'webp' && '✓ Modern format, best compression'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Hidden Canvas */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Actions */}
          <div className="flex flex-wrap gap-4">
            <button
              onClick={async () => {
                await convertImage();
                downloadImage();
              }}
              disabled={processing}
              className="btn-brutal-primary"
            >
              {processing ? 'Converting...' : `${t('common.convert')} to ${outputFormat.toUpperCase()}`}
            </button>
            <button onClick={() => setImage(null)} className="btn-brutal">
              {t('common.clear')}
            </button>
          </div>
        </>
      )}
    </ToolLayout>
  );
}
