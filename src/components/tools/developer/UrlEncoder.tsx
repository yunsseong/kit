import { useState } from 'react';
import ToolLayout from '../../common/ToolLayout';
import { useI18n } from '../../../contexts/I18nContext';

export default function UrlEncoder() {
  const { t } = useI18n();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [error, setError] = useState<string | null>(null);

  const process = () => {
    try {
      if (mode === 'encode') {
        setOutput(encodeURIComponent(input));
      } else {
        setOutput(decodeURIComponent(input));
      }
      setError(null);
    } catch {
      setError('Invalid input');
      setOutput('');
    }
  };

  const copyToClipboard = async () => {
    if (output) {
      await navigator.clipboard.writeText(output);
    }
  };

  return (
    <ToolLayout title={t('tool.urlEncoder')} description={t('tool.urlEncoder.desc')} seoKey="urlEncoder">
      {/* Mode Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setMode('encode')}
          className={`tab ${mode === 'encode' ? 'tab-active' : ''}`}
        >
          {t('base64.encode')}
        </button>
        <button
          onClick={() => setMode('decode')}
          className={`tab ${mode === 'decode' ? 'tab-active' : ''}`}
        >
          {t('base64.decode')}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <div>
          <label className="font-display font-bold uppercase tracking-wider text-sm mb-2 block">
            {t('common.input')}
          </label>
          <textarea
            className="textarea-brutal h-[300px]"
            placeholder={mode === 'encode' ? 'URL or text to encode...' : 'Encoded URL to decode...'}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>

        {/* Output */}
        <div>
          <label className="font-display font-bold uppercase tracking-wider text-sm mb-2 block">
            {t('common.output')}
          </label>
          <div className="result-box h-[300px] overflow-auto">
            {error ? (
              <span className="text-coral">{error}</span>
            ) : (
              <pre className="whitespace-pre-wrap break-all">{output || 'Output will appear here...'}</pre>
            )}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 mt-6">
        <button onClick={process} className="btn-brutal-primary">
          {mode === 'encode' ? t('base64.encode') : t('base64.decode')}
        </button>

        <button onClick={copyToClipboard} className="btn-brutal" disabled={!output}>
          {t('common.copy')}
        </button>

        <button onClick={() => { setInput(''); setOutput(''); setError(null); }} className="btn-brutal">
          {t('common.clear')}
        </button>
      </div>
    </ToolLayout>
  );
}
