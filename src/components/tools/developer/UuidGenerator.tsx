import { useState } from 'react';
import ToolLayout from '../../common/ToolLayout';
import { useI18n } from '../../../contexts/I18nContext';

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export default function UuidGenerator() {
  const { t } = useI18n();
  const [uuids, setUuids] = useState<string[]>([]);
  const [count, setCount] = useState(1);
  const [copied, setCopied] = useState<number | null>(null);
  const [uppercase, setUppercase] = useState(false);
  const [noDashes, setNoDashes] = useState(false);

  const generate = () => {
    const newUuids = Array.from({ length: count }, () => {
      let uuid = generateUUID();
      if (uppercase) uuid = uuid.toUpperCase();
      if (noDashes) uuid = uuid.replace(/-/g, '');
      return uuid;
    });
    setUuids(newUuids);
  };

  const copyToClipboard = async (uuid: string, index: number) => {
    await navigator.clipboard.writeText(uuid);
    setCopied(index);
    setTimeout(() => setCopied(null), 2000);
  };

  const copyAll = async () => {
    await navigator.clipboard.writeText(uuids.join('\n'));
    setCopied(-1);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <ToolLayout title={t('tool.uuidGenerator')} description={t('tool.uuidGenerator.desc')}>
      {/* Settings */}
      <div className="card-brutal">
        <h3 className="font-display font-bold uppercase text-sm mb-4">{t('common.settings')}</h3>

        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2">
            <label className="font-mono text-sm">Count:</label>
            <input
              type="number"
              min="1"
              max="100"
              value={count}
              onChange={(e) => setCount(Math.min(100, Math.max(1, Number(e.target.value))))}
              className="input-brutal w-20"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={uppercase}
              onChange={(e) => setUppercase(e.target.checked)}
              className="w-5 h-5 border-3 border-charcoal dark:border-cream accent-lime"
            />
            <span className="font-mono text-sm">Uppercase</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={noDashes}
              onChange={(e) => setNoDashes(e.target.checked)}
              className="w-5 h-5 border-3 border-charcoal dark:border-cream accent-lime"
            />
            <span className="font-mono text-sm">No dashes</span>
          </label>
        </div>
      </div>

      {/* Generate Button */}
      <div className="flex gap-4">
        <button onClick={generate} className="btn-brutal-primary">
          {t('common.generate')}
        </button>
        {uuids.length > 1 && (
          <button onClick={copyAll} className="btn-brutal">
            {copied === -1 ? t('common.copied') : 'Copy All'}
          </button>
        )}
      </div>

      {/* Results */}
      {uuids.length > 0 && (
        <div className="space-y-2">
          {uuids.map((uuid, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-4 p-4 bg-mist dark:bg-slate border-3 border-charcoal dark:border-cream"
            >
              <code className="font-mono text-sm break-all">{uuid}</code>
              <button
                onClick={() => copyToClipboard(uuid, index)}
                className="btn-brutal btn-brutal-sm shrink-0"
              >
                {copied === index ? t('common.copied') : t('common.copy')}
              </button>
            </div>
          ))}
        </div>
      )}
    </ToolLayout>
  );
}
