import { useState } from 'react';
import ToolLayout from '../../common/ToolLayout';
import { useI18n } from '../../../contexts/I18nContext';

type UuidVersion = 'v1' | 'v2' | 'v3' | 'v4' | 'v5' | 'v6' | 'v7';

// Standard UUID namespaces
const NAMESPACES = {
  DNS: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
  URL: '6ba7b811-9dad-11d1-80b4-00c04fd430c8',
  OID: '6ba7b812-9dad-11d1-80b4-00c04fd430c8',
  X500: '6ba7b814-9dad-11d1-80b4-00c04fd430c8',
} as const;

type NamespaceType = keyof typeof NAMESPACES;

// Simple MD5 implementation for UUID v3
function md5(input: Uint8Array): Uint8Array {
  function rotateLeft(x: number, n: number): number {
    return (x << n) | (x >>> (32 - n));
  }

  const K = new Uint32Array([
    0xd76aa478, 0xe8c7b756, 0x242070db, 0xc1bdceee, 0xf57c0faf, 0x4787c62a, 0xa8304613, 0xfd469501,
    0x698098d8, 0x8b44f7af, 0xffff5bb1, 0x895cd7be, 0x6b901122, 0xfd987193, 0xa679438e, 0x49b40821,
    0xf61e2562, 0xc040b340, 0x265e5a51, 0xe9b6c7aa, 0xd62f105d, 0x02441453, 0xd8a1e681, 0xe7d3fbc8,
    0x21e1cde6, 0xc33707d6, 0xf4d50d87, 0x455a14ed, 0xa9e3e905, 0xfcefa3f8, 0x676f02d9, 0x8d2a4c8a,
    0xfffa3942, 0x8771f681, 0x6d9d6122, 0xfde5380c, 0xa4beea44, 0x4bdecfa9, 0xf6bb4b60, 0xbebfbc70,
    0x289b7ec6, 0xeaa127fa, 0xd4ef3085, 0x04881d05, 0xd9d4d039, 0xe6db99e5, 0x1fa27cf8, 0xc4ac5665,
    0xf4292244, 0x432aff97, 0xab9423a7, 0xfc93a039, 0x655b59c3, 0x8f0ccc92, 0xffeff47d, 0x85845dd1,
    0x6fa87e4f, 0xfe2ce6e0, 0xa3014314, 0x4e0811a1, 0xf7537e82, 0xbd3af235, 0x2ad7d2bb, 0xeb86d391
  ]);

  const S = [7, 12, 17, 22, 5, 9, 14, 20, 4, 11, 16, 23, 6, 10, 15, 21];

  const padded = new Uint8Array(((input.length + 8) >>> 6 << 6) + 64);
  padded.set(input);
  padded[input.length] = 0x80;
  const bits = input.length * 8;
  const view = new DataView(padded.buffer);
  view.setUint32(padded.length - 8, bits, true);

  let a0 = 0x67452301;
  let b0 = 0xefcdab89;
  let c0 = 0x98badcfe;
  let d0 = 0x10325476;

  for (let i = 0; i < padded.length; i += 64) {
    const M = new Uint32Array(16);
    for (let j = 0; j < 16; j++) {
      M[j] = view.getUint32(i + j * 4, true);
    }

    let A = a0, B = b0, C = c0, D = d0;

    for (let j = 0; j < 64; j++) {
      let F: number, g: number;
      if (j < 16) {
        F = (B & C) | (~B & D);
        g = j;
      } else if (j < 32) {
        F = (D & B) | (~D & C);
        g = (5 * j + 1) % 16;
      } else if (j < 48) {
        F = B ^ C ^ D;
        g = (3 * j + 5) % 16;
      } else {
        F = C ^ (B | ~D);
        g = (7 * j) % 16;
      }
      F = (F + A + K[j] + M[g]) >>> 0;
      A = D;
      D = C;
      C = B;
      B = (B + rotateLeft(F, S[(j >>> 4) * 4 + (j % 4)])) >>> 0;
    }

    a0 = (a0 + A) >>> 0;
    b0 = (b0 + B) >>> 0;
    c0 = (c0 + C) >>> 0;
    d0 = (d0 + D) >>> 0;
  }

  const result = new Uint8Array(16);
  const resultView = new DataView(result.buffer);
  resultView.setUint32(0, a0, true);
  resultView.setUint32(4, b0, true);
  resultView.setUint32(8, c0, true);
  resultView.setUint32(12, d0, true);
  return result;
}

// SHA-1 implementation for UUID v5
function sha1(input: Uint8Array): Uint8Array {
  function rotateLeft(x: number, n: number): number {
    return (x << n) | (x >>> (32 - n));
  }

  const padded = new Uint8Array(((input.length + 8) >>> 6 << 6) + 64);
  padded.set(input);
  padded[input.length] = 0x80;
  const bits = input.length * 8;
  const view = new DataView(padded.buffer);
  view.setUint32(padded.length - 4, bits, false);

  let h0 = 0x67452301;
  let h1 = 0xefcdab89;
  let h2 = 0x98badcfe;
  let h3 = 0x10325476;
  let h4 = 0xc3d2e1f0;

  for (let i = 0; i < padded.length; i += 64) {
    const W = new Uint32Array(80);
    for (let j = 0; j < 16; j++) {
      W[j] = view.getUint32(i + j * 4, false);
    }
    for (let j = 16; j < 80; j++) {
      W[j] = rotateLeft(W[j - 3] ^ W[j - 8] ^ W[j - 14] ^ W[j - 16], 1);
    }

    let a = h0, b = h1, c = h2, d = h3, e = h4;

    for (let j = 0; j < 80; j++) {
      let f: number, k: number;
      if (j < 20) {
        f = (b & c) | (~b & d);
        k = 0x5a827999;
      } else if (j < 40) {
        f = b ^ c ^ d;
        k = 0x6ed9eba1;
      } else if (j < 60) {
        f = (b & c) | (b & d) | (c & d);
        k = 0x8f1bbcdc;
      } else {
        f = b ^ c ^ d;
        k = 0xca62c1d6;
      }
      const temp = (rotateLeft(a, 5) + f + e + k + W[j]) >>> 0;
      e = d;
      d = c;
      c = rotateLeft(b, 30);
      b = a;
      a = temp;
    }

    h0 = (h0 + a) >>> 0;
    h1 = (h1 + b) >>> 0;
    h2 = (h2 + c) >>> 0;
    h3 = (h3 + d) >>> 0;
    h4 = (h4 + e) >>> 0;
  }

  const result = new Uint8Array(20);
  const resultView = new DataView(result.buffer);
  resultView.setUint32(0, h0, false);
  resultView.setUint32(4, h1, false);
  resultView.setUint32(8, h2, false);
  resultView.setUint32(12, h3, false);
  resultView.setUint32(16, h4, false);
  return result;
}

// Parse UUID string to bytes
function uuidToBytes(uuid: string): Uint8Array {
  const hex = uuid.replace(/-/g, '');
  const bytes = new Uint8Array(16);
  for (let i = 0; i < 16; i++) {
    bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

// Convert bytes to UUID string
function bytesToUuid(bytes: Uint8Array): string {
  const hex = Array.from(bytes.slice(0, 16))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
}

// UUID v1: Time-based (using timestamp + random node)
function generateUUIDv1(): string {
  const now = Date.now();
  const gregorianOffset = 122192928000000000n;
  const timestamp = BigInt(now) * 10000n + gregorianOffset;

  const timeLow = (timestamp & 0xffffffffn).toString(16).padStart(8, '0');
  const timeMid = ((timestamp >> 32n) & 0xffffn).toString(16).padStart(4, '0');
  const timeHigh = ((timestamp >> 48n) & 0x0fffn).toString(16).padStart(4, '0');
  const version = '1';

  const clockSeq = Math.floor(Math.random() * 0x3fff) | 0x8000;
  const clockSeqHex = clockSeq.toString(16).padStart(4, '0');

  const node = Array.from({ length: 6 }, () =>
    Math.floor(Math.random() * 256).toString(16).padStart(2, '0')
  ).join('');

  return `${timeLow}-${timeMid}-${version}${timeHigh.slice(1)}-${clockSeqHex}-${node}`;
}

// UUID v2: DCE Security (simulated - uses local domain concept)
function generateUUIDv2(): string {
  const now = Date.now();
  const gregorianOffset = 122192928000000000n;
  const timestamp = BigInt(now) * 10000n + gregorianOffset;

  // Local domain (0=person, 1=group, 2=org)
  const localDomain = Math.floor(Math.random() * 3);
  // Simulated local ID (in real DCE, this would be UID/GID)
  const localId = Math.floor(Math.random() * 0xffffffff);
  const localIdHex = localId.toString(16).padStart(8, '0');

  const timeMid = ((timestamp >> 32n) & 0xffffn).toString(16).padStart(4, '0');
  const timeHigh = ((timestamp >> 48n) & 0x0fffn).toString(16).padStart(4, '0');
  const version = '2';

  const clockSeq = (Math.floor(Math.random() * 0x3f) << 8) | localDomain | 0x8000;
  const clockSeqHex = clockSeq.toString(16).padStart(4, '0');

  const node = Array.from({ length: 6 }, () =>
    Math.floor(Math.random() * 256).toString(16).padStart(2, '0')
  ).join('');

  return `${localIdHex}-${timeMid}-${version}${timeHigh.slice(1)}-${clockSeqHex}-${node}`;
}

// UUID v3: MD5 name-based
function generateUUIDv3(namespace: string, name: string): string {
  const namespaceBytes = uuidToBytes(namespace);
  const nameBytes = new TextEncoder().encode(name);
  const input = new Uint8Array(namespaceBytes.length + nameBytes.length);
  input.set(namespaceBytes);
  input.set(nameBytes, namespaceBytes.length);

  const hash = md5(input);
  // Set version (4 bits) to 3
  hash[6] = (hash[6] & 0x0f) | 0x30;
  // Set variant (2 bits) to 10
  hash[8] = (hash[8] & 0x3f) | 0x80;

  return bytesToUuid(hash);
}

// UUID v4: Random
function generateUUIDv4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// UUID v5: SHA-1 name-based
function generateUUIDv5(namespace: string, name: string): string {
  const namespaceBytes = uuidToBytes(namespace);
  const nameBytes = new TextEncoder().encode(name);
  const input = new Uint8Array(namespaceBytes.length + nameBytes.length);
  input.set(namespaceBytes);
  input.set(nameBytes, namespaceBytes.length);

  const hash = sha1(input);
  // Set version (4 bits) to 5
  hash[6] = (hash[6] & 0x0f) | 0x50;
  // Set variant (2 bits) to 10
  hash[8] = (hash[8] & 0x3f) | 0x80;

  return bytesToUuid(hash);
}

// UUID v6: Reordered time-based (sortable version of v1)
function generateUUIDv6(): string {
  const now = Date.now();
  const gregorianOffset = 122192928000000000n;
  const timestamp = BigInt(now) * 10000n + gregorianOffset;

  // Reorder: time_high | time_mid | time_low (for sortability)
  const timeHigh = ((timestamp >> 28n) & 0xffffffffn).toString(16).padStart(8, '0');
  const timeMid = ((timestamp >> 12n) & 0xffffn).toString(16).padStart(4, '0');
  const timeLow = (timestamp & 0x0fffn).toString(16).padStart(4, '0');
  const version = '6';

  const clockSeq = Math.floor(Math.random() * 0x3fff) | 0x8000;
  const clockSeqHex = clockSeq.toString(16).padStart(4, '0');

  const node = Array.from({ length: 6 }, () =>
    Math.floor(Math.random() * 256).toString(16).padStart(2, '0')
  ).join('');

  return `${timeHigh}-${timeMid}-${version}${timeLow.slice(1)}-${clockSeqHex}-${node}`;
}

// UUID v7: Unix Epoch time-based (sortable)
function generateUUIDv7(): string {
  const now = Date.now();

  const timestampHex = now.toString(16).padStart(12, '0');
  const timePart1 = timestampHex.slice(0, 8);
  const timePart2 = timestampHex.slice(8, 12);

  const randomA = Math.floor(Math.random() * 0x0fff).toString(16).padStart(3, '0');
  const variantRandom = (Math.floor(Math.random() * 0x3fff) | 0x8000).toString(16).padStart(4, '0');

  const randomB = Array.from({ length: 6 }, () =>
    Math.floor(Math.random() * 256).toString(16).padStart(2, '0')
  ).join('');

  return `${timePart1}-${timePart2}-7${randomA}-${variantRandom}-${randomB}`;
}

const versionInfo: Record<UuidVersion, { label: string; desc: string; needsInput: boolean }> = {
  v1: { label: 'V1', desc: 'Time-based', needsInput: false },
  v2: { label: 'V2', desc: 'DCE Security', needsInput: false },
  v3: { label: 'V3', desc: 'MD5 Name', needsInput: true },
  v4: { label: 'V4', desc: 'Random', needsInput: false },
  v5: { label: 'V5', desc: 'SHA-1 Name', needsInput: true },
  v6: { label: 'V6', desc: 'Reordered Time', needsInput: false },
  v7: { label: 'V7', desc: 'Unix Epoch', needsInput: false },
};

export default function UuidGenerator() {
  const { t } = useI18n();
  const [selectedVersion, setSelectedVersion] = useState<UuidVersion>('v4');
  const [result, setResult] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [uppercase, setUppercase] = useState(false);
  const [noDashes, setNoDashes] = useState(false);
  const [namespace, setNamespace] = useState<NamespaceType>('DNS');
  const [name, setName] = useState('example.com');

  const generate = () => {
    let uuid: string;
    switch (selectedVersion) {
      case 'v1': uuid = generateUUIDv1(); break;
      case 'v2': uuid = generateUUIDv2(); break;
      case 'v3': uuid = generateUUIDv3(NAMESPACES[namespace], name); break;
      case 'v4': uuid = generateUUIDv4(); break;
      case 'v5': uuid = generateUUIDv5(NAMESPACES[namespace], name); break;
      case 'v6': uuid = generateUUIDv6(); break;
      case 'v7': uuid = generateUUIDv7(); break;
    }
    if (uppercase) uuid = uuid.toUpperCase();
    if (noDashes) uuid = uuid.replace(/-/g, '');
    setResult(uuid);
  };

  const copyToClipboard = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const versions: UuidVersion[] = ['v1', 'v2', 'v3', 'v4', 'v5', 'v6', 'v7'];
  const needsNameInput = selectedVersion === 'v3' || selectedVersion === 'v5';

  return (
    <ToolLayout title={t('tool.uuidGenerator')} description={t('tool.uuidGenerator.desc')} seoKey="uuidGenerator">
      {/* Version Selection */}
      <div className="flex flex-wrap gap-2">
        {versions.map((v) => (
          <button
            key={v}
            onClick={() => setSelectedVersion(v)}
            className={`tab ${selectedVersion === v ? 'tab-active' : ''}`}
          >
            {versionInfo[v].label}
          </button>
        ))}
      </div>

      {/* Result Card */}
      <div className="card-brutal">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-bold uppercase">
            {versionInfo[selectedVersion].label}
            <span className="ml-2 text-sm font-normal opacity-70">{versionInfo[selectedVersion].desc}</span>
          </h3>
          <button
            onClick={copyToClipboard}
            className="btn-brutal btn-brutal-sm"
            disabled={!result}
          >
            {copied ? t('common.copied') : t('common.copy')}
          </button>
        </div>
        <code className="font-mono text-sm break-all block bg-mist dark:bg-charcoal p-3 border-3 border-charcoal dark:border-cream min-h-[48px]">
          {result || <span className="opacity-30">Click generate to create UUID</span>}
        </code>
      </div>

      {/* Name-based Options for v3/v5 */}
      {needsNameInput && (
        <div className="card-brutal">
          <h3 className="font-display font-bold uppercase mb-4">Name-based Options</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-display font-bold uppercase tracking-wider text-sm mb-2 block">
                Namespace
              </label>
              <select
                value={namespace}
                onChange={(e) => setNamespace(e.target.value as NamespaceType)}
                className="input-brutal"
              >
                <option value="DNS">DNS</option>
                <option value="URL">URL</option>
                <option value="OID">OID</option>
                <option value="X500">X500</option>
              </select>
            </div>
            <div>
              <label className="font-display font-bold uppercase tracking-wider text-sm mb-2 block">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="example.com"
                className="input-brutal"
              />
            </div>
          </div>
        </div>
      )}

      {/* Format Options */}
      <div className="card-brutal">
        <h3 className="font-display font-bold uppercase mb-4">Format</h3>
        <div className="flex flex-wrap items-center gap-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <div
              onClick={() => setUppercase(!uppercase)}
              className={`toggle ${uppercase ? 'toggle-active' : ''}`}
            >
              <span className={`toggle-dot ${uppercase ? 'translate-x-6' : 'translate-x-1'}`} />
            </div>
            <span className="font-mono text-sm">Uppercase</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <div
              onClick={() => setNoDashes(!noDashes)}
              className={`toggle ${noDashes ? 'toggle-active' : ''}`}
            >
              <span className={`toggle-dot ${noDashes ? 'translate-x-6' : 'translate-x-1'}`} />
            </div>
            <span className="font-mono text-sm">No dashes</span>
          </label>
        </div>
      </div>

      {/* Generate Button */}
      <div className="flex gap-4">
        <button onClick={generate} className="btn-brutal-primary">
          {t('common.generate')}
        </button>
        <button onClick={() => setResult('')} className="btn-brutal">
          {t('common.clear')}
        </button>
      </div>
    </ToolLayout>
  );
}
