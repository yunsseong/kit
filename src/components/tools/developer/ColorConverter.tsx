import { useState } from 'react';
import ToolLayout from '../../common/ToolLayout';
import { useI18n } from '../../../contexts/I18nContext';

interface ColorValues {
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  h /= 360;
  s /= 100;
  l /= 100;

  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}

export default function ColorConverter() {
  const { t } = useI18n();
  const [color, setColor] = useState<ColorValues>({
    hex: '#BFFF00',
    rgb: { r: 191, g: 255, b: 0 },
    hsl: { h: 75, s: 100, l: 50 }
  });
  const [copied, setCopied] = useState<string | null>(null);

  const updateFromHex = (hex: string) => {
    const rgb = hexToRgb(hex);
    if (rgb) {
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      setColor({ hex, rgb, hsl });
    }
  };

  const updateFromRgb = (rgb: { r: number; g: number; b: number }) => {
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    setColor({ hex, rgb, hsl });
  };

  const updateFromHsl = (hsl: { h: number; s: number; l: number }) => {
    const rgb = hslToRgb(hsl.h, hsl.s, hsl.l);
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    setColor({ hex, rgb, hsl });
  };

  const copyToClipboard = async (value: string, type: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <ToolLayout title={t('tool.colorConverter')} description={t('tool.colorConverter.desc')}>
      {/* Color Preview */}
      <div
        className="h-32 border-3 border-charcoal dark:border-cream shadow-brutal"
        style={{ backgroundColor: color.hex }}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* HEX */}
        <div className="card-brutal">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold uppercase">HEX</h3>
            <button
              onClick={() => copyToClipboard(color.hex, 'hex')}
              className="btn-brutal btn-brutal-sm"
            >
              {copied === 'hex' ? t('common.copied') : t('common.copy')}
            </button>
          </div>
          <input
            type="text"
            value={color.hex}
            onChange={(e) => updateFromHex(e.target.value)}
            className="input-brutal"
            placeholder="#000000"
          />
        </div>

        {/* RGB */}
        <div className="card-brutal">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold uppercase">RGB</h3>
            <button
              onClick={() => copyToClipboard(`rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`, 'rgb')}
              className="btn-brutal btn-brutal-sm"
            >
              {copied === 'rgb' ? t('common.copied') : t('common.copy')}
            </button>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm w-6">R</span>
              <input
                type="number"
                min="0"
                max="255"
                value={color.rgb.r}
                onChange={(e) => updateFromRgb({ ...color.rgb, r: Number(e.target.value) })}
                className="input-brutal flex-1"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm w-6">G</span>
              <input
                type="number"
                min="0"
                max="255"
                value={color.rgb.g}
                onChange={(e) => updateFromRgb({ ...color.rgb, g: Number(e.target.value) })}
                className="input-brutal flex-1"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm w-6">B</span>
              <input
                type="number"
                min="0"
                max="255"
                value={color.rgb.b}
                onChange={(e) => updateFromRgb({ ...color.rgb, b: Number(e.target.value) })}
                className="input-brutal flex-1"
              />
            </div>
          </div>
        </div>

        {/* HSL */}
        <div className="card-brutal">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold uppercase">HSL</h3>
            <button
              onClick={() => copyToClipboard(`hsl(${color.hsl.h}, ${color.hsl.s}%, ${color.hsl.l}%)`, 'hsl')}
              className="btn-brutal btn-brutal-sm"
            >
              {copied === 'hsl' ? t('common.copied') : t('common.copy')}
            </button>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm w-6">H</span>
              <input
                type="number"
                min="0"
                max="360"
                value={color.hsl.h}
                onChange={(e) => updateFromHsl({ ...color.hsl, h: Number(e.target.value) })}
                className="input-brutal flex-1"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm w-6">S</span>
              <input
                type="number"
                min="0"
                max="100"
                value={color.hsl.s}
                onChange={(e) => updateFromHsl({ ...color.hsl, s: Number(e.target.value) })}
                className="input-brutal flex-1"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm w-6">L</span>
              <input
                type="number"
                min="0"
                max="100"
                value={color.hsl.l}
                onChange={(e) => updateFromHsl({ ...color.hsl, l: Number(e.target.value) })}
                className="input-brutal flex-1"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Color Picker */}
      <div className="card-brutal">
        <h3 className="font-display font-bold uppercase mb-4">Color Picker</h3>
        <input
          type="color"
          value={color.hex}
          onChange={(e) => updateFromHex(e.target.value)}
          className="w-full h-16 cursor-pointer border-3 border-charcoal dark:border-cream"
        />
      </div>
    </ToolLayout>
  );
}
