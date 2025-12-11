import { useState, useRef, useEffect, useCallback } from 'react';
import ToolLayout from '../../common/ToolLayout';
import FileDropZone from '../../common/FileDropZone';
import { useI18n } from '../../../contexts/I18nContext';

type Position = 'top-left' | 'top-right' | 'center' | 'bottom-left' | 'bottom-right';

export default function AddWatermark() {
  const { t } = useI18n();
  const [image, setImage] = useState<string | null>(null);
  const [watermarkText, setWatermarkText] = useState('example');
  const [position, setPosition] = useState<Position>('center');
  const [opacity, setOpacity] = useState(50);
  const [fontSize, setFontSize] = useState(24);
  const [color, setColor] = useState('#22C55E'); // dark lime
  const [patternMode, setPatternMode] = useState(false);
  const [patternSpacingX, setPatternSpacingX] = useState(200);
  const [patternSpacingY, setPatternSpacingY] = useState(150);
  const [patternRotation, setPatternRotation] = useState(-30);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const handleFileSelect = (files: File[]) => {
    const file = files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        imgRef.current = img;
        // Calculate preview dimensions (constrained by max-height: 500px)
        const maxPreviewHeight = 500;
        let displayScale = 1;
        if (img.height > maxPreviewHeight) {
          displayScale = maxPreviewHeight / img.height;
        }
        const previewWidth = img.width * displayScale;
        // Set font size to half of preview width
        setFontSize(Math.round(previewWidth / 2));
        setImage(e.target?.result as string);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const renderWatermark = useCallback(() => {
    if (!canvasRef.current || !imgRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = imgRef.current;
    canvas.width = img.width;
    canvas.height = img.height;

    // Draw original image
    ctx.drawImage(img, 0, 0);

    // Set watermark style
    ctx.font = `bold ${fontSize}px "Space Mono", monospace`;
    ctx.fillStyle = color;
    ctx.globalAlpha = opacity / 100;

    // Add shadow for visibility
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;

    if (patternMode) {
      // Pattern mode: repeat watermark across entire image
      const textWidth = ctx.measureText(watermarkText).width;
      const textHeight = fontSize;
      const angleRad = (patternRotation * Math.PI) / 180;

      // Calculate diagonal to ensure full coverage when rotated
      const diagonal = Math.sqrt(canvas.width ** 2 + canvas.height ** 2);
      const startX = -diagonal / 2;
      const startY = -diagonal / 2;
      const endX = diagonal * 1.5;
      const endY = diagonal * 1.5;

      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(angleRad);
      ctx.translate(-canvas.width / 2, -canvas.height / 2);

      let rowIndex = 0;
      for (let y = startY; y < endY; y += patternSpacingY + textHeight) {
        // Stagger offset: shift every other row by half the spacing
        const offsetX = rowIndex % 2 === 1 ? (patternSpacingX + textWidth) / 2 : 0;
        for (let x = startX + offsetX; x < endX; x += patternSpacingX + textWidth) {
          ctx.fillText(watermarkText, x, y);
        }
        rowIndex++;
      }

      ctx.restore();
    } else {
      // Single watermark mode
      const padding = 20;
      const textWidth = ctx.measureText(watermarkText).width;
      const textHeight = fontSize;

      let x: number, y: number;

      switch (position) {
        case 'top-left':
          x = padding;
          y = padding + textHeight;
          break;
        case 'top-right':
          x = canvas.width - textWidth - padding;
          y = padding + textHeight;
          break;
        case 'center':
          x = (canvas.width - textWidth) / 2;
          y = (canvas.height + textHeight) / 2;
          break;
        case 'bottom-left':
          x = padding;
          y = canvas.height - padding;
          break;
        case 'bottom-right':
        default:
          x = canvas.width - textWidth - padding;
          y = canvas.height - padding;
          break;
      }

      ctx.fillText(watermarkText, x, y);
    }

    // Reset alpha
    ctx.globalAlpha = 1;
  }, [watermarkText, position, opacity, fontSize, color, patternMode, patternSpacingX, patternSpacingY, patternRotation]);

  useEffect(() => {
    if (image) {
      renderWatermark();
    }
  }, [image, renderWatermark]);

  const downloadImage = () => {
    if (!canvasRef.current) return;

    const link = document.createElement('a');
    link.download = `watermarked-${Date.now()}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  const positions: { value: Position; label: string }[] = [
    { value: 'top-left', label: '↖ Top Left' },
    { value: 'top-right', label: '↗ Top Right' },
    { value: 'center', label: '⊕ Center' },
    { value: 'bottom-left', label: '↙ Bottom Left' },
    { value: 'bottom-right', label: '↘ Bottom Right' },
  ];

  return (
    <ToolLayout title={t('tool.addWatermark')} description={t('tool.addWatermark.desc')}>
      {!image ? (
        <FileDropZone
          onFileSelect={handleFileSelect}
          accept="image/*"
          maxSize={20}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Settings */}
            <div className="lg:col-span-1">
              <label className="font-display font-bold uppercase tracking-wider text-sm mb-2 block">
                {t('common.settings')}
              </label>
              <div className="card-brutal space-y-4">
                {/* Text Input */}
                <div>
                  <label className="font-mono text-sm block mb-1">{t('watermark.text')}</label>
                  <input
                    type="text"
                    value={watermarkText}
                    onChange={(e) => setWatermarkText(e.target.value)}
                    className="input-brutal"
                    placeholder="Enter watermark text..."
                  />
                </div>

                {/* Pattern Mode Toggle */}
                <div>
                  <label className="font-mono text-sm flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={patternMode}
                      onChange={(e) => setPatternMode(e.target.checked)}
                      className="w-5 h-5 accent-lime"
                    />
                    <span>{t('watermark.patternMode')}</span>
                  </label>
                </div>

                {/* Position - only show when not in pattern mode */}
                {!patternMode && (
                  <div>
                    <label className="font-mono text-sm block mb-2">{t('watermark.position')}</label>
                    <div className="grid grid-cols-3 gap-1">
                      {positions.map((pos) => (
                        <button
                          key={pos.value}
                          onClick={() => setPosition(pos.value)}
                          className={`p-2 text-xs font-mono border-3 border-charcoal dark:border-cream transition-colors
                            ${position === pos.value ? 'bg-lime text-charcoal' : 'hover:bg-mist dark:hover:bg-slate'}`}
                        >
                          {pos.label.split(' ')[0]}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Pattern Settings - only show when in pattern mode */}
                {patternMode && (
                  <>
                    <div>
                      <label className="font-mono text-sm block mb-1">
                        {t('watermark.spacingX')}: {patternSpacingX}px
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="500"
                        value={patternSpacingX}
                        onChange={(e) => setPatternSpacingX(Number(e.target.value))}
                        className="w-full accent-lime"
                      />
                    </div>
                    <div>
                      <label className="font-mono text-sm block mb-1">
                        {t('watermark.spacingY')}: {patternSpacingY}px
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="500"
                        value={patternSpacingY}
                        onChange={(e) => setPatternSpacingY(Number(e.target.value))}
                        className="w-full accent-lime"
                      />
                    </div>
                    <div>
                      <label className="font-mono text-sm block mb-1">
                        {t('watermark.rotation')}: {patternRotation}°
                      </label>
                      <input
                        type="range"
                        min="-90"
                        max="90"
                        value={patternRotation}
                        onChange={(e) => setPatternRotation(Number(e.target.value))}
                        className="w-full accent-lime"
                      />
                    </div>
                  </>
                )}

                {/* Opacity */}
                <div>
                  <label className="font-mono text-sm block mb-1">
                    {t('watermark.opacity')}: {opacity}%
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={opacity}
                    onChange={(e) => setOpacity(Number(e.target.value))}
                    className="w-full accent-lime"
                  />
                </div>

                {/* Font Size */}
                <div>
                  <label className="font-mono text-sm block mb-1">
                    {t('watermark.fontSize')}: {fontSize}px
                  </label>
                  <input
                    type="range"
                    min="12"
                    max="1000"
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="w-full accent-lime"
                  />
                </div>

                {/* Color */}
                <div>
                  <label className="font-mono text-sm block mb-1">{t('watermark.color')}</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="w-12 h-10 border-3 border-charcoal dark:border-cream cursor-pointer"
                    />
                    <input
                      type="text"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="input-brutal flex-1"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="lg:col-span-2">
              <label className="font-display font-bold uppercase tracking-wider text-sm mb-2 block">
                {t('watermark.preview')}
              </label>
              <div className="card-brutal p-4">
                <canvas
                  ref={canvasRef}
                  className="max-w-full h-auto max-h-[500px] mx-auto"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-4">
            <button onClick={downloadImage} className="btn-brutal-primary">
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
