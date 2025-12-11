import { useState } from 'react';
import ToolLayout from '../../common/ToolLayout';
import { useI18n } from '../../../contexts/I18nContext';

type ConversionMode = 'xmlToJson' | 'jsonToXml';

interface XmlToJsonOptions {
  attributePrefix: string;
  textNodeName: string;
  ignoreAttributes: boolean;
}

export default function XmlParser() {
  const { t } = useI18n();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<ConversionMode>('xmlToJson');
  const [indentSize, setIndentSize] = useState(2);
  const [options, setOptions] = useState<XmlToJsonOptions>({
    attributePrefix: '@',
    textNodeName: '#text',
    ignoreAttributes: false,
  });

  // XML to JSON conversion
  const xmlToJson = (xml: string): object => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, 'application/xml');
    const parseError = doc.querySelector('parsererror');
    if (parseError) {
      throw new Error(parseError.textContent || t('xml.invalid'));
    }

    const nodeToJson = (node: Node): unknown => {
      // Text node
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent?.trim();
        return text || null;
      }

      // Comment node - skip
      if (node.nodeType === Node.COMMENT_NODE) {
        return null;
      }

      // Element node
      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as Element;
        const obj: Record<string, unknown> = {};

        // Handle attributes
        if (!options.ignoreAttributes && element.attributes.length > 0) {
          for (const attr of Array.from(element.attributes)) {
            obj[`${options.attributePrefix}${attr.name}`] = attr.value;
          }
        }

        // Handle children
        const children = Array.from(element.childNodes);
        const childElements = children.filter(c => c.nodeType === Node.ELEMENT_NODE);
        const textNodes = children.filter(c => c.nodeType === Node.TEXT_NODE && c.textContent?.trim());

        // Only text content
        if (childElements.length === 0 && textNodes.length > 0) {
          const text = textNodes.map(t => t.textContent?.trim()).join('');
          if (Object.keys(obj).length === 0) {
            return text;
          }
          obj[options.textNodeName] = text;
          return obj;
        }

        // Process child elements
        for (const child of childElements) {
          const childElement = child as Element;
          const childName = childElement.tagName;
          const childValue = nodeToJson(child);

          if (obj[childName] !== undefined) {
            // Multiple children with same name - convert to array
            if (!Array.isArray(obj[childName])) {
              obj[childName] = [obj[childName]];
            }
            (obj[childName] as unknown[]).push(childValue);
          } else {
            obj[childName] = childValue;
          }
        }

        return Object.keys(obj).length === 0 ? '' : obj;
      }

      return null;
    };

    const root = doc.documentElement;
    return { [root.tagName]: nodeToJson(root) };
  };

  // JSON to XML conversion
  const jsonToXml = (json: object, indentChar: string = ' '.repeat(indentSize)): string => {
    const escape = (str: string): string => {
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
    };

    const convert = (obj: unknown, tagName: string, indent: string): string => {
      if (obj === null || obj === undefined) {
        return `${indent}<${tagName}/>`;
      }

      if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean') {
        return `${indent}<${tagName}>${escape(String(obj))}</${tagName}>`;
      }

      if (Array.isArray(obj)) {
        return obj.map(item => convert(item, tagName, indent)).join('\n');
      }

      if (typeof obj === 'object') {
        const record = obj as Record<string, unknown>;
        const attrs: string[] = [];
        const children: string[] = [];
        let textContent = '';

        for (const [key, value] of Object.entries(record)) {
          if (key.startsWith(options.attributePrefix)) {
            const attrName = key.slice(options.attributePrefix.length);
            attrs.push(`${attrName}="${escape(String(value))}"`);
          } else if (key === options.textNodeName) {
            textContent = escape(String(value));
          } else {
            children.push(convert(value, key, indent + indentChar));
          }
        }

        const attrStr = attrs.length > 0 ? ' ' + attrs.join(' ') : '';

        if (children.length === 0 && !textContent) {
          return `${indent}<${tagName}${attrStr}/>`;
        }

        if (children.length === 0 && textContent) {
          return `${indent}<${tagName}${attrStr}>${textContent}</${tagName}>`;
        }

        return `${indent}<${tagName}${attrStr}>\n${children.join('\n')}\n${indent}</${tagName}>`;
      }

      return '';
    };

    const rootEntries = Object.entries(json);
    if (rootEntries.length !== 1) {
      throw new Error(t('xmlParser.singleRoot'));
    }

    const [rootName, rootValue] = rootEntries[0];
    return `<?xml version="1.0" encoding="UTF-8"?>\n${convert(rootValue, rootName, '')}`;
  };

  const handleConvert = () => {
    try {
      if (mode === 'xmlToJson') {
        const result = xmlToJson(input);
        setOutput(JSON.stringify(result, null, indentSize));
      } else {
        const parsed = JSON.parse(input);
        setOutput(jsonToXml(parsed));
      }
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : t('common.error'));
      setOutput('');
    }
  };

  const copyToClipboard = async () => {
    if (output) {
      await navigator.clipboard.writeText(output);
    }
  };

  const swapInputOutput = () => {
    setInput(output);
    setOutput('');
    setError(null);
    setMode(mode === 'xmlToJson' ? 'jsonToXml' : 'xmlToJson');
  };

  const sampleXml = `<?xml version="1.0" encoding="UTF-8"?>
<bookstore>
  <book category="fiction">
    <title lang="en">Harry Potter</title>
    <author>J.K. Rowling</author>
    <price>29.99</price>
  </book>
</bookstore>`;

  const sampleJson = `{
  "bookstore": {
    "book": {
      "@category": "fiction",
      "title": {
        "@lang": "en",
        "#text": "Harry Potter"
      },
      "author": "J.K. Rowling",
      "price": "29.99"
    }
  }
}`;

  return (
    <ToolLayout title={t('tool.xmlParser')} description={t('tool.xmlParser.desc')}>
      {/* Mode Toggle */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="flex border-3 border-charcoal dark:border-dark-border">
          <button
            onClick={() => setMode('xmlToJson')}
            className={`px-4 py-2 font-display font-bold uppercase text-sm transition-colors ${
              mode === 'xmlToJson'
                ? 'bg-charcoal dark:bg-lime text-cream dark:text-charcoal'
                : 'bg-cream dark:bg-dark-card hover:bg-gray-100 dark:hover:bg-dark-border'
            }`}
          >
            XML → JSON
          </button>
          <button
            onClick={() => setMode('jsonToXml')}
            className={`px-4 py-2 font-display font-bold uppercase text-sm transition-colors border-l-3 border-charcoal dark:border-dark-border ${
              mode === 'jsonToXml'
                ? 'bg-charcoal dark:bg-lime text-cream dark:text-charcoal'
                : 'bg-cream dark:bg-dark-card hover:bg-gray-100 dark:hover:bg-dark-border'
            }`}
          >
            JSON → XML
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="font-display font-bold uppercase tracking-wider text-sm">
              {mode === 'xmlToJson' ? 'XML' : 'JSON'} {t('common.input')}
            </label>
            <button
              onClick={() => setInput(mode === 'xmlToJson' ? sampleXml : sampleJson)}
              className="text-xs font-mono text-slate dark:text-dark-muted hover:text-coral transition-colors"
            >
              {t('xml.loadSample')}
            </button>
          </div>
          <textarea
            className="textarea-brutal h-[400px] font-mono text-sm"
            placeholder={mode === 'xmlToJson' ? '<root><item>value</item></root>' : '{"root": {"item": "value"}}'}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>

        {/* Output */}
        <div>
          <label className="font-display font-bold uppercase tracking-wider text-sm mb-2 block">
            {mode === 'xmlToJson' ? 'JSON' : 'XML'} {t('common.output')}
          </label>
          <div className="result-box h-[400px] overflow-auto">
            {error ? (
              <span className="text-coral">{error}</span>
            ) : (
              <pre className="whitespace-pre-wrap break-all font-mono text-sm">
                {output || 'Output will appear here...'}
              </pre>
            )}
          </div>
        </div>
      </div>

      {/* Options */}
      <div className="mt-6 p-4 border-3 border-charcoal dark:border-dark-border bg-cream dark:bg-dark-card">
        <h3 className="font-display font-bold uppercase tracking-wider text-sm mb-4">
          {t('common.settings')}
        </h3>
        <div className="flex flex-wrap items-center gap-6">
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

          <div className="flex items-center gap-2">
            <label className="font-mono text-sm">{t('xmlParser.attrPrefix')}:</label>
            <input
              type="text"
              value={options.attributePrefix}
              onChange={(e) => setOptions({ ...options, attributePrefix: e.target.value })}
              className="input-brutal w-16 py-2 text-center"
              maxLength={2}
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={options.ignoreAttributes}
              onChange={(e) => setOptions({ ...options, ignoreAttributes: e.target.checked })}
              className="w-5 h-5 border-3 border-charcoal dark:border-dark-border accent-lime"
            />
            <span className="font-mono text-sm">{t('xmlParser.ignoreAttrs')}</span>
          </label>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4 mt-6">
        <button onClick={handleConvert} className="btn-brutal-primary">
          {t('common.convert')}
        </button>

        <button
          onClick={swapInputOutput}
          className="btn-brutal flex items-center gap-2"
          disabled={!output}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M7 16V4M7 4L3 8M7 4l4 4M17 8v12M17 20l4-4M17 20l-4-4" />
          </svg>
          {t('xmlParser.swap')}
        </button>

        <button onClick={copyToClipboard} className="btn-brutal" disabled={!output}>
          {t('common.copy')}
        </button>

        <button
          onClick={() => { setInput(''); setOutput(''); setError(null); }}
          className="btn-brutal"
        >
          {t('common.clear')}
        </button>
      </div>
    </ToolLayout>
  );
}
