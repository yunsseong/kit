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

const versionDescriptions: Record<UuidVersion, string> = {
  v1: 'Time-based (timestamp + random node)',
  v4: 'Random (most common)',
  v7: 'Unix timestamp (sortable)',
};

export default function UuidGenerator() {
  const { t } = useI18n();
  const [version, setVersion] = useState<UuidVersion>('v4');
  const [uuids, setUuids] = useState<string[]>([]);
  const [count, setCount] = useState(1);
  const [copied, setCopied] = useState<number | null>(null);
  const [uppercase, setUppercase] = useState(false);
  const [noDashes, setNoDashes] = useState(false);

  const generate = () => {
    const newUuids = Array.from({ length: count }, () => {
      let uuid = generateUUID(version);
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

        <div className="flex flex-wrap items-start gap-6">
          {/* Version Selection */}
          <div className="flex flex-col gap-2">
            <label className="font-mono text-sm font-bold">Version:</label>
            <div className="flex gap-2">
              {(['v1', 'v4', 'v7'] as UuidVersion[]).map((v) => (
                <button
                  key={v}
                  onClick={() => setVersion(v)}
                  className={`px-4 py-2 font-mono text-sm font-bold border-3 border-charcoal dark:border-cream transition-all ${
                    version === v
                      ? 'bg-lime text-charcoal'
                      : 'bg-white dark:bg-charcoal hover:bg-mist dark:hover:bg-slate'
                  }`}
                >
                  {v.toUpperCase()}
                </button>
              ))}
            </div>
            <span className="font-mono text-xs text-slate dark:text-cream/60">
              {versionDescriptions[version]}
            </span>
          </div>

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
