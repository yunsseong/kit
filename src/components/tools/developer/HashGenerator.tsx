import { useState } from 'react';
import CryptoJS from 'crypto-js';
import ToolLayout from '../../common/ToolLayout';
import { useI18n } from '../../../contexts/I18nContext';

export default function HashGenerator() {
  const { t } = useI18n();
  const [input, setInput] = useState('');
  const [hashes, setHashes] = useState<{ [key: string]: string }>({});
  const [copied, setCopied] = useState<string | null>(null);

  const generateHashes = () => {
    if (!input) {
      setHashes({});
      return;
    }

    setHashes({
      MD5: CryptoJS.MD5(input).toString(),
      'SHA-1': CryptoJS.SHA1(input).toString(),
      'SHA-256': CryptoJS.SHA256(input).toString(),
      'SHA-512': CryptoJS.SHA512(input).toString(),
    });
  };

  const copyToClipboard = async (hash: string, type: string) => {
    await navigator.clipboard.writeText(hash);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <ToolLayout title={t('tool.hashGenerator')} description={t('tool.hashGenerator.desc')}>
      {/* Input */}
      <div>
        <label className="font-display font-bold uppercase tracking-wider text-sm mb-2 block">
          {t('common.input')}
        </label>
        <textarea
          className="textarea-brutal h-[150px]"
          placeholder="Enter text to hash..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </div>

      {/* Generate Button */}
      <div className="flex gap-4">
        <button onClick={generateHashes} className="btn-brutal-primary">
          {t('common.generate')}
        </button>
        <button onClick={() => { setInput(''); setHashes({}); }} className="btn-brutal">
          {t('common.clear')}
        </button>
      </div>

      {/* Results */}
      {Object.keys(hashes).length > 0 && (
        <div className="space-y-4">
          {Object.entries(hashes).map(([type, hash]) => (
            <div key={type} className="card-brutal">
              <div className="flex items-center justify-between mb-2">
                <span className="font-display font-bold uppercase text-sm">{type}</span>
                <button
                  onClick={() => copyToClipboard(hash, type)}
                  className="btn-brutal btn-brutal-sm"
                >
                  {copied === type ? t('common.copied') : t('common.copy')}
                </button>
              </div>
              <code className="font-mono text-sm break-all block bg-mist dark:bg-charcoal p-3 border-3 border-charcoal dark:border-cream">
                {hash}
              </code>
            </div>
          ))}
        </div>
      )}
    </ToolLayout>
  );
}
