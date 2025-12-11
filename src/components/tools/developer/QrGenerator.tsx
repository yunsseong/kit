import { useState, useRef, useEffect } from 'react';
import QRCode from 'qrcode';
import ToolLayout from '../../common/ToolLayout';
import { useI18n } from '../../../contexts/I18nContext';

export default function QrGenerator() {
  const { t } = useI18n();
  const [input, setInput] = useState('');
  const [size, setSize] = useState(256);
  const [errorLevel, setErrorLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [qrGenerated, setQrGenerated] = useState(false);

  const generateQR = async () => {
    if (!input || !canvasRef.current) return;

    try {
      await QRCode.toCanvas(canvasRef.current, input, {
        width: size,
        margin: 2,
        errorCorrectionLevel: errorLevel,
        color: {
          dark: '#1A1A1A',
          light: '#FFFFFF',
        },
      });
      setQrGenerated(true);
    } catch (err) {
      console.error('QR generation error:', err);
    }
  };

  useEffect(() => {
    if (input) {
      generateQR();
    }
  }, [input, size, errorLevel]);

  const downloadQR = () => {
    if (!canvasRef.current) return;

    const link = document.createElement('a');
    link.download = `qrcode-${Date.now()}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  return (
    <ToolLayout title={t('tool.qrGenerator')} description={t('tool.qrGenerator.desc')}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <div>
            <label className="font-display font-bold uppercase tracking-wider text-sm mb-2 block">
              {t('common.input')}
            </label>
            <textarea
              className="textarea-brutal h-[150px]"
              placeholder="Enter text or URL..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>

          {/* Settings */}
          <div className="card-brutal">
            <h3 className="font-display font-bold uppercase text-sm mb-4">{t('common.settings')}</h3>

            <div className="space-y-4">
              <div>
                <label className="font-mono text-sm block mb-1">Size: {size}px</label>
                <input
                  type="range"
                  min="128"
                  max="512"
                  step="32"
                  value={size}
                  onChange={(e) => setSize(Number(e.target.value))}
                  className="w-full accent-lime"
                />
              </div>

              <div>
                <label className="font-mono text-sm block mb-1">Error Correction</label>
                <div className="flex gap-2">
                  {(['L', 'M', 'Q', 'H'] as const).map((level) => (
                    <button
                      key={level}
                      onClick={() => setErrorLevel(level)}
                      className={`tab flex-1 ${errorLevel === level ? 'tab-active' : ''}`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Section */}
        <div>
          <label className="font-display font-bold uppercase tracking-wider text-sm mb-2 block">
            Preview
          </label>
          <div className="card-brutal flex flex-col items-center justify-center min-h-[300px]">
            <canvas
              ref={canvasRef}
              className={`${!qrGenerated ? 'opacity-30' : ''}`}
            />
            {!input && (
              <p className="font-mono text-sm text-slate dark:text-cream/60 mt-4">
                Enter text to generate QR code
              </p>
            )}
          </div>

          {qrGenerated && input && (
            <button onClick={downloadQR} className="btn-brutal-primary w-full mt-4">
              {t('common.download')} PNG
            </button>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
