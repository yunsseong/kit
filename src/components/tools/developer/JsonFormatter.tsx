import { useState } from 'react';
import ToolLayout from '../../common/ToolLayout';
import { useI18n } from '../../../contexts/I18nContext';

export default function JsonFormatter() {
  const { t } = useI18n();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [indentSize, setIndentSize] = useState(2);

  const formatJson = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, indentSize));
      setError(null);
    } catch {
      setError(t('json.invalid'));
      setOutput('');
    }
  };

  const minifyJson = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError(null);
    } catch {
      setError(t('json.invalid'));
      setOutput('');
    }
  };

  const copyToClipboard = async () => {
    if (output) {
      await navigator.clipboard.writeText(output);
    }
  };

  return (
    <ToolLayout title={t('tool.jsonFormatter')} description={t('tool.jsonFormatter.desc')}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <div>
          <label className="font-display font-bold uppercase tracking-wider text-sm mb-2 block">
            {t('common.input')}
          </label>
          <textarea
            className="textarea-brutal h-[400px]"
            placeholder='{"key": "value"}'
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>

        {/* Output */}
        <div>
          <label className="font-display font-bold uppercase tracking-wider text-sm mb-2 block">
            {t('common.output')}
          </label>
          <div className="result-box h-[400px] overflow-auto">
            {error ? (
              <span className="text-coral">{error}</span>
            ) : (
              <pre className="whitespace-pre-wrap break-all">{output || 'Output will appear here...'}</pre>
            )}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4 mt-6">
        <div className="flex items-center gap-2">
          <label className="font-mono text-sm">Indent:</label>
          <select
            value={indentSize}
            onChange={(e) => setIndentSize(Number(e.target.value))}
            className="input-brutal w-20 py-2"
          >
            <option value={2}>2</option>
            <option value={4}>4</option>
            <option value={8}>8</option>
          </select>
        </div>

        <button onClick={formatJson} className="btn-brutal-primary">
          {t('json.format')}
        </button>

        <button onClick={minifyJson} className="btn-brutal">
          {t('json.minify')}
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
