import { useState, useRef } from 'react';
import ToolLayout from '../../common/ToolLayout';
import FileDropZone from '../../common/FileDropZone';
import { useI18n } from '../../../contexts/I18nContext';

export default function ImageResize() {
  const { t } = useI18n();
  const [image, setImage] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState({ width: 0, height: 0 });
  const [newSize, setNewSize] = useState({ width: 0, height: 0 });
  const [maintainRatio, setMaintainRatio] = useState(true);
  const [processing, setProcessing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileSelect = (files: File[]) => {
    const file = files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setOriginalSize({ width: img.width, height: img.height });
        setNewSize({ width: img.width, height: img.height });
        setImage(e.target?.result as string);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleWidthChange = (width: number) => {
    if (maintainRatio && originalSize.width > 0) {
      const ratio = originalSize.height / originalSize.width;
      setNewSize({ width, height: Math.round(width * ratio) });
    } else {
      setNewSize({ ...newSize, width });
    }
  };

  const handleHeightChange = (height: number) => {
    if (maintainRatio && originalSize.height > 0) {
      const ratio = originalSize.width / originalSize.height;
      setNewSize({ width: Math.round(height * ratio), height });
    } else {
      setNewSize({ ...newSize, height });
    }
  };

  const resizeImage = async () => {
    if (!image || !canvasRef.current) return;

    setProcessing(true);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = newSize.width;
    canvas.height = newSize.height;

    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, newSize.width, newSize.height);
      setProcessing(false);
    };
    img.src = image;
  };

  const downloadImage = () => {
    if (!canvasRef.current) return;

    const link = document.createElement('a');
    link.download = `resized-${newSize.width}x${newSize.height}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  return (
    <ToolLayout title={t('tool.imageResize')} description={t('tool.imageResize.desc')} seoKey="imageResize">
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
                Original ({originalSize.width} × {originalSize.height})
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
              <div className="card-brutal space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-mono text-sm block mb-1">{t('image.width')} (px)</label>
                    <input
                      type="number"
                      value={newSize.width}
                      onChange={(e) => handleWidthChange(Number(e.target.value))}
                      className="input-brutal"
                      min="1"
                    />
                  </div>
                  <div>
                    <label className="font-mono text-sm block mb-1">{t('image.height')} (px)</label>
                    <input
                      type="number"
                      value={newSize.height}
                      onChange={(e) => handleHeightChange(Number(e.target.value))}
                      className="input-brutal"
                      min="1"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={maintainRatio}
                    onChange={(e) => setMaintainRatio(e.target.checked)}
                    className="w-5 h-5 border-3 border-charcoal dark:border-cream accent-lime"
                  />
                  <span className="font-mono text-sm">{t('image.maintainRatio')}</span>
                </label>

                {/* Quick presets */}
                <div>
                  <label className="font-mono text-sm block mb-2">{t('image.quickResize')}</label>
                  <div className="flex flex-wrap gap-2">
                    {[25, 50, 75, 100, 150, 200].map((percent) => (
                      <button
                        key={percent}
                        onClick={() => {
                          const w = Math.round(originalSize.width * percent / 100);
                          const h = Math.round(originalSize.height * percent / 100);
                          setNewSize({ width: w, height: h });
                        }}
                        className="tab"
                      >
                        {percent}%
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Result Canvas */}
          <div className="card-brutal">
            <label className="font-display font-bold uppercase tracking-wider text-sm mb-2 block">
              {t('image.result')} ({newSize.width} × {newSize.height})
            </label>
            <canvas
              ref={canvasRef}
              className="max-w-full h-auto max-h-[300px] mx-auto border-3 border-charcoal dark:border-cream"
            />
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-4">
            <button
              onClick={resizeImage}
              disabled={processing}
              className="btn-brutal-primary"
            >
              {processing ? t('image.processing') : t('image.resize')}
            </button>
            <button onClick={downloadImage} className="btn-brutal">
              {t('common.download')}
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
