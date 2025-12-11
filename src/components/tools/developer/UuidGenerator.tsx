import { useState } from 'react';
import ToolLayout from '../../common/ToolLayout';
import { useI18n } from '../../../contexts/I18nContext';

type UuidVersion = 'v1' | 'v4' | 'v7';

// UUID v1: Time-based (using timestamp + random node)
function generateUUIDv1(): string {
  const now = Date.now();
  const gregorianOffset = 122192928000000000n; // Offset from UUID epoch (Oct 15, 1582)
  const timestamp = BigInt(now) * 10000n + gregorianOffset;

  const timeLow = (timestamp & 0xffffffffn).toString(16).padStart(8, '0');
  const timeMid = ((timestamp >> 32n) & 0xffffn).toString(16).padStart(4, '0');
  const timeHigh = ((timestamp >> 48n) & 0x0fffn).toString(16).padStart(4, '0');
  const version = '1';

  const clockSeq = Math.floor(Math.random() * 0x3fff) | 0x8000;
  const clockSeqHex = clockSeq.toString(16).padStart(4, '0');

  // Random node (6 bytes) - set multicast bit
  const node = Array.from({ length: 6 }, () =>
    Math.floor(Math.random() * 256).toString(16).padStart(2, '0')
  ).join('');

  return `${timeLow}-${timeMid}-${version}${timeHigh.slice(1)}-${clockSeqHex}-${node}`;
}

// UUID v4: Random
function generateUUIDv4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// UUID v7: Unix Epoch time-based (sortable)
function generateUUIDv7(): string {
  const now = Date.now();

  // 48 bits of millisecond timestamp
  const timestampHex = now.toString(16).padStart(12, '0');
  const timePart1 = timestampHex.slice(0, 8);
  const timePart2 = timestampHex.slice(8, 12);

  // Version 7 + 12 bits random
  const randomA = Math.floor(Math.random() * 0x0fff).toString(16).padStart(3, '0');

  // Variant (10xx) + 62 bits random
  const variantRandom = (Math.floor(Math.random() * 0x3fff) | 0x8000).toString(16).padStart(4, '0');

  // 48 bits random
  const randomB = Array.from({ length: 6 }, () =>
    Math.floor(Math.random() * 256).toString(16).padStart(2, '0')
  ).join('');

  return `${timePart1}-${timePart2}-7${randomA}-${variantRandom}-${randomB}`;
}

function generateUUID(version: UuidVersion): string {
  switch (version) {
    case 'v1': return generateUUIDv1();
    case 'v4': return generateUUIDv4();
    case 'v7': return generateUUIDv7();
    default: return generateUUIDv4();
  }
}

const versionInfo: Record<UuidVersion, { label: string; desc: string }> = {
  v1: { label: 'V1', desc: 'Time-based' },
  v4: { label: 'V4', desc: 'Random' },
  v7: { label: 'V7', desc: 'Sortable' },
};

interface UuidResult {
  version: UuidVersion;
  uuid: string;
}

export default function UuidGenerator() {
  const { t } = useI18n();
  const [results, setResults] = useState<UuidResult[]>([]);
  const [copied, setCopied] = useState<string | null>(null);
  const [uppercase, setUppercase] = useState(false);
  const [noDashes, setNoDashes] = useState(false);

  const generate = () => {
    const versions: UuidVersion[] = ['v1', 'v4', 'v7'];
    const newResults = versions.map((version) => {
      let uuid = generateUUID(version);
      if (uppercase) uuid = uuid.toUpperCase();
      if (noDashes) uuid = uuid.replace(/-/g, '');
      return { version, uuid };
    });
    setResults(newResults);
  };

  const copyToClipboard = async (uuid: string, key: string) => {
    await navigator.clipboard.writeText(uuid);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const copyAll = async () => {
    const text = results.map(r => `${r.version.toUpperCase()}: ${r.uuid}`).join('\n');
    await navigator.clipboard.writeText(text);
    setCopied('all');
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <ToolLayout title={t('tool.uuidGenerator')} description={t('tool.uuidGenerator.desc')}>
      {/* Settings */}
      <div className="card-brutal">
        <h3 className="font-display font-bold uppercase text-sm mb-4">{t('common.settings')}</h3>

        <div className="flex flex-wrap items-center gap-6">
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
        {results.length > 0 && (
          <button onClick={copyAll} className="btn-brutal">
            {copied === 'all' ? t('common.copied') : 'Copy All'}
          </button>
        )}
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-3">
          {results.map(({ version, uuid }) => (
            <div
              key={version}
              className="flex items-center gap-4 p-4 bg-mist dark:bg-slate border-3 border-charcoal dark:border-cream"
            >
              <div className="flex flex-col items-center justify-center w-16 shrink-0">
                <span className="font-mono font-bold text-lg">{versionInfo[version].label}</span>
                <span className="font-mono text-xs text-slate dark:text-cream/60">{versionInfo[version].desc}</span>
              </div>
              <code className="font-mono text-sm break-all flex-1">{uuid}</code>
              <button
                onClick={() => copyToClipboard(uuid, version)}
                className="btn-brutal btn-brutal-sm shrink-0"
              >
                {copied === version ? t('common.copied') : t('common.copy')}
              </button>
            </div>
          ))}
        </div>
      )}
    </ToolLayout>
  );
}
