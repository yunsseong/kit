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
    hex: '#22C55E',
    rgb: { r: 34, g: 197, b: 94 },
    hsl: { h: 142, s: 71, l: 45 }
  });
  const [copied, setCopied] = useState<string | null>(null);

  // Separate input states for free text editing
  const [hexInput, setHexInput] = useState('#22C55E');
  const [rgbInput, setRgbInput] = useState({ r: '34', g: '197', b: '94' });
  const [hslInput, setHslInput] = useState({ h: '142', s: '71', l: '45' });

  const updateFromHex = (hex: string) => {
    setHexInput(hex);
    // Add # if missing
    const normalizedHex = hex.startsWith('#') ? hex : '#' + hex;
    const rgb = hexToRgb(normalizedHex);
    if (rgb) {
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      setColor({ hex: normalizedHex, rgb, hsl });
      setRgbInput({ r: String(rgb.r), g: String(rgb.g), b: String(rgb.b) });
      setHslInput({ h: String(hsl.h), s: String(hsl.s), l: String(hsl.l) });
    }
  };

  const updateFromRgb = (key: 'r' | 'g' | 'b', value: string) => {
    const newRgbInput = { ...rgbInput, [key]: value };
    setRgbInput(newRgbInput);

    const num = value === '' ? 0 : parseInt(value, 10);
    if (!isNaN(num) && num >= 0 && num <= 255) {
      const rgb = {
        r: newRgbInput.r === '' ? 0 : Math.min(255, Math.max(0, parseInt(newRgbInput.r, 10) || 0)),
        g: newRgbInput.g === '' ? 0 : Math.min(255, Math.max(0, parseInt(newRgbInput.g, 10) || 0)),
        b: newRgbInput.b === '' ? 0 : Math.min(255, Math.max(0, parseInt(newRgbInput.b, 10) || 0)),
      };
      const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      setColor({ hex, rgb, hsl });
      setHexInput(hex);
      setHslInput({ h: String(hsl.h), s: String(hsl.s), l: String(hsl.l) });
    }
  };

  const updateFromHsl = (key: 'h' | 's' | 'l', value: string) => {
    const newHslInput = { ...hslInput, [key]: value };
    setHslInput(newHslInput);

    const maxVal = key === 'h' ? 360 : 100;
    const num = value === '' ? 0 : parseInt(value, 10);
    if (!isNaN(num) && num >= 0 && num <= maxVal) {
      const hsl = {
        h: newHslInput.h === '' ? 0 : Math.min(360, Math.max(0, parseInt(newHslInput.h, 10) || 0)),
        s: newHslInput.s === '' ? 0 : Math.min(100, Math.max(0, parseInt(newHslInput.s, 10) || 0)),
        l: newHslInput.l === '' ? 0 : Math.min(100, Math.max(0, parseInt(newHslInput.l, 10) || 0)),
      };
      const rgb = hslToRgb(hsl.h, hsl.s, hsl.l);
      const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
      setColor({ hex, rgb, hsl });
      setHexInput(hex);
      setRgbInput({ r: String(rgb.r), g: String(rgb.g), b: String(rgb.b) });
    }
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
            value={hexInput}
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
                type="text"
                inputMode="numeric"
                value={rgbInput.r}
                onChange={(e) => updateFromRgb('r', e.target.value)}
                className="input-brutal flex-1"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm w-6">G</span>
              <input
                type="text"
                inputMode="numeric"
                value={rgbInput.g}
                onChange={(e) => updateFromRgb('g', e.target.value)}
                className="input-brutal flex-1"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm w-6">B</span>
              <input
                type="text"
                inputMode="numeric"
                value={rgbInput.b}
                onChange={(e) => updateFromRgb('b', e.target.value)}
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
                type="text"
                inputMode="numeric"
                value={hslInput.h}
                onChange={(e) => updateFromHsl('h', e.target.value)}
                className="input-brutal flex-1"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm w-6">S</span>
              <input
                type="text"
                inputMode="numeric"
                value={hslInput.s}
                onChange={(e) => updateFromHsl('s', e.target.value)}
                className="input-brutal flex-1"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm w-6">L</span>
              <input
                type="text"
                inputMode="numeric"
                value={hslInput.l}
                onChange={(e) => updateFromHsl('l', e.target.value)}
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
