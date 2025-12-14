import { useState } from 'react';
import ToolLayout from '../../common/ToolLayout';
import FileDropZone from '../../common/FileDropZone';
import { useI18n } from '../../../contexts/I18nContext';

interface ImageItem {
  id: string;
  file: File;
  preview: string;
}

export default function GifMaker() {
  const { t } = useI18n();
  const [images, setImages] = useState<ImageItem[]>([]);
  const [frameDelay, setFrameDelay] = useState(500);
  const [processing, setProcessing] = useState(false);
  const [gifUrl, setGifUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const handleFileSelect = (files: File[]) => {
    const newImages = files.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newImages]);
  };

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const moveImage = (id: string, direction: 'up' | 'down') => {
    const index = images.findIndex((img) => img.id === id);
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === images.length - 1)
    ) {
      return;
    }

    const newImages = [...images];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    [newImages[index], newImages[newIndex]] = [newImages[newIndex], newImages[index]];
    setImages(newImages);
  };

  const createGif = async () => {
    if (images.length < 2) return;

    setProcessing(true);
    setProgress(0);

    try {
      // Dynamic import of gif.js
      const GIF = (await import('gif.js')).default;

      const gif = new GIF({
        workers: 2,
        quality: 10,
        workerScript: '/gif.worker.js',
      });

      // Load all images first
      const loadedImages: HTMLImageElement[] = [];
      for (let i = 0; i < images.length; i++) {
        const img = new Image();
        await new Promise<void>((resolve) => {
          img.onload = () => resolve();
          img.src = images[i].preview;
        });
        loadedImages.push(img);
        setProgress(Math.round((i / images.length) * 50));
      }

      // Find max dimensions
      const maxWidth = Math.max(...loadedImages.map((img) => img.width));
      const maxHeight = Math.max(...loadedImages.map((img) => img.height));

      // Create canvas and add frames
      const canvas = document.createElement('canvas');
      canvas.width = maxWidth;
      canvas.height = maxHeight;
      const ctx = canvas.getContext('2d')!;

      loadedImages.forEach((img, i) => {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, maxWidth, maxHeight);
        const x = (maxWidth - img.width) / 2;
        const y = (maxHeight - img.height) / 2;
        ctx.drawImage(img, x, y);
        gif.addFrame(ctx, { copy: true, delay: frameDelay });
        setProgress(50 + Math.round((i / loadedImages.length) * 40));
      });

      gif.on('finished', (blob: Blob) => {
        const url = URL.createObjectURL(blob);
        setGifUrl(url);
        setProcessing(false);
        setProgress(100);
      });

      gif.render();
    } catch (error) {
      console.error('GIF creation error:', error);
      setProcessing(false);
      // Fallback: simple canvas-based animation preview
      alert('GIF creation requires gif.worker.js. Using preview mode.');
    }
  };

  const downloadGif = () => {
    if (!gifUrl) return;
    const link = document.createElement('a');
    link.download = `animated-${Date.now()}.gif`;
    link.href = gifUrl;
    link.click();
  };

  return (
    <ToolLayout title={t('tool.gifMaker')} description={t('tool.gifMaker.desc')} seoKey="gifMaker">
      {/* Upload Area */}
      <FileDropZone
        onFileSelect={handleFileSelect}
        accept="image/*"
        multiple
        maxSize={20}
      />

      {images.length > 0 && (
        <>
          {/* Settings */}
          <div className="card-brutal">
            <h3 className="font-display font-bold uppercase text-sm mb-4">{t('common.settings')}</h3>
            <div>
              <label className="font-mono text-sm block mb-2">
                {t('gif.frameDelay')}: {frameDelay}ms ({(1000 / frameDelay).toFixed(1)} fps)
              </label>
              <input
                type="range"
                min="100"
                max="2000"
                step="100"
                value={frameDelay}
                onChange={(e) => setFrameDelay(Number(e.target.value))}
                className="w-full accent-lime"
              />
            </div>
          </div>

          {/* Image List */}
          <div>
            <label className="font-display font-bold uppercase tracking-wider text-sm mb-2 block">
              {t('gif.frames')} ({images.length})
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
              {images.map((img, index) => (
                <div key={img.id} className="card-brutal p-2 relative group">
                  <img
                    src={img.preview}
                    alt={`Frame ${index + 1}`}
                    className="w-full h-24 object-cover"
                  />
                  <div className="absolute top-1 left-1 bg-charcoal text-cream px-2 py-0.5 font-mono text-xs">
                    {index + 1}
                  </div>
                  <div className="absolute inset-0 bg-charcoal/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                    <button
                      onClick={() => moveImage(img.id, 'up')}
                      disabled={index === 0}
                      className="p-1 bg-cream text-charcoal disabled:opacity-50"
                    >
                      ←
                    </button>
                    <button
                      onClick={() => moveImage(img.id, 'down')}
                      disabled={index === images.length - 1}
                      className="p-1 bg-cream text-charcoal disabled:opacity-50"
                    >
                      →
                    </button>
                    <button
                      onClick={() => removeImage(img.id)}
                      className="p-1 bg-coral text-charcoal"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Progress */}
          {processing && (
            <div className="card-brutal">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-sm">{t('gif.creating')}</span>
                <span className="font-mono text-sm">{progress}%</span>
              </div>
              <div className="h-4 bg-mist dark:bg-charcoal border-3 border-charcoal dark:border-cream">
                <div
                  className="h-full bg-lime transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* GIF Preview */}
          {gifUrl && (
            <div>
              <label className="font-display font-bold uppercase tracking-wider text-sm mb-2 block">
                {t('image.result')}
              </label>
              <div className="card-brutal p-4">
                <img
                  src={gifUrl}
                  alt="Generated GIF"
                  className="max-w-full h-auto max-h-[400px] mx-auto"
                />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-4">
            <button
              onClick={createGif}
              disabled={processing || images.length < 2}
              className="btn-brutal-primary"
            >
              {processing ? t('gif.creating') : t('gif.createGif')}
            </button>
            {gifUrl && (
              <button onClick={downloadGif} className="btn-brutal">
                {t('common.download')}
              </button>
            )}
            <button
              onClick={() => {
                setImages([]);
                setGifUrl(null);
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
