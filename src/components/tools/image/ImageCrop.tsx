import { useState, useRef, useCallback } from 'react';
import ReactCrop, { type Crop, type PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import ToolLayout from '../../common/ToolLayout';
import FileDropZone from '../../common/FileDropZone';
import { useI18n } from '../../../contexts/I18nContext';

type AspectRatio = 'free' | '1:1' | '16:9' | '4:3' | '3:2' | '9:16';

const aspectRatios: { [key in AspectRatio]: number | undefined } = {
  'free': undefined,
  '1:1': 1,
  '16:9': 16 / 9,
  '4:3': 4 / 3,
  '3:2': 3 / 2,
  '9:16': 9 / 16,
};

export default function ImageCrop() {
  const { t } = useI18n();
  const [image, setImage] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('free');
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileSelect = (files: File[]) => {
    const file = files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => setImage(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const onImageLoad = useCallback((_e: React.SyntheticEvent<HTMLImageElement>) => {
    const initialCrop: Crop = {
      unit: '%',
      x: 10,
      y: 10,
      width: 80,
      height: 80,
    };
    setCrop(initialCrop);
  }, []);

  const cropImage = useCallback(() => {
    if (!completedCrop || !imgRef.current || !canvasRef.current) return;

    const image = imgRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = completedCrop.width * scaleX;
    canvas.height = completedCrop.height * scaleY;

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height
    );
  }, [completedCrop]);

  const downloadImage = () => {
    cropImage();
    if (!canvasRef.current) return;

    setTimeout(() => {
      const link = document.createElement('a');
      link.download = `cropped-${Date.now()}.png`;
      link.href = canvasRef.current!.toDataURL('image/png');
      link.click();
    }, 100);
  };

  return (
    <ToolLayout title={t('tool.imageCrop')} description={t('tool.imageCrop.desc')}>
      {!image ? (
        <FileDropZone
          onFileSelect={handleFileSelect}
          accept="image/*"
          maxSize={20}
        />
      ) : (
        <>
          {/* Aspect Ratio Selection */}
          <div className="card-brutal">
            <h3 className="font-display font-bold uppercase text-sm mb-4">Aspect Ratio</h3>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(aspectRatios) as AspectRatio[]).map((ratio) => (
                <button
                  key={ratio}
                  onClick={() => setAspectRatio(ratio)}
                  className={`tab ${aspectRatio === ratio ? 'tab-active' : ''}`}
                >
                  {ratio === 'free' ? t('crop.free') : ratio}
                </button>
              ))}
            </div>
          </div>

          {/* Crop Area */}
          <div className="card-brutal">
            <ReactCrop
              crop={crop}
              onChange={(c) => setCrop(c)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={aspectRatios[aspectRatio]}
              className="max-w-full"
            >
              <img
                ref={imgRef}
                src={image}
                alt="Crop"
                onLoad={onImageLoad}
                className="max-w-full h-auto max-h-[500px]"
              />
            </ReactCrop>
          </div>

          {/* Preview */}
          {completedCrop && (
            <div>
              <label className="font-display font-bold uppercase tracking-wider text-sm mb-2 block">
                Preview ({Math.round(completedCrop.width)} × {Math.round(completedCrop.height)})
              </label>
              <canvas
                ref={canvasRef}
                className="border-3 border-charcoal dark:border-cream max-w-full h-auto max-h-[200px]"
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-4">
            <button onClick={downloadImage} className="btn-brutal-primary">
              {t('common.download')} Cropped
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
