import { useState } from 'react';
import ToolLayout from '../../common/ToolLayout';
import { useI18n } from '../../../contexts/I18nContext';

export default function XmlFormatter() {
  const { t } = useI18n();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [indentSize, setIndentSize] = useState(2);

  const parseXml = (xmlString: string): Document | null => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlString, 'application/xml');
    const parseError = doc.querySelector('parsererror');
    if (parseError) {
      throw new Error(parseError.textContent || t('xml.invalid'));
    }
    return doc;
  };

  const formatXml = (node: Node, indent: string = '', indentChar: string = ' '.repeat(indentSize)): string => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent?.trim() || '';
      return text ? text : '';
    }

    if (node.nodeType === Node.COMMENT_NODE) {
      return `${indent}<!--${node.textContent}-->`;
    }

    if (node.nodeType === Node.CDATA_SECTION_NODE) {
      return `${indent}<![CDATA[${node.textContent}]]>`;
    }

    if (node.nodeType === Node.PROCESSING_INSTRUCTION_NODE) {
      const pi = node as ProcessingInstruction;
      return `${indent}<?${pi.target} ${pi.data}?>`;
    }

    if (node.nodeType !== Node.ELEMENT_NODE && node.nodeType !== Node.DOCUMENT_NODE) {
      return '';
    }

    if (node.nodeType === Node.DOCUMENT_NODE) {
      let result = '<?xml version="1.0" encoding="UTF-8"?>\n';
      for (const child of Array.from(node.childNodes)) {
        const formatted = formatXml(child, '', indentChar);
        if (formatted) result += formatted + '\n';
      }
      return result.trim();
    }

    const element = node as Element;
    const tagName = element.tagName;

    // Build attributes string
    let attrs = '';
    for (const attr of Array.from(element.attributes)) {
      attrs += ` ${attr.name}="${attr.value}"`;
    }

    const children = Array.from(element.childNodes);
    const hasOnlyText = children.length === 1 && children[0].nodeType === Node.TEXT_NODE;

    if (children.length === 0) {
      return `${indent}<${tagName}${attrs}/>`;
    }

    if (hasOnlyText) {
      const text = children[0].textContent?.trim() || '';
      return `${indent}<${tagName}${attrs}>${text}</${tagName}>`;
    }

    let result = `${indent}<${tagName}${attrs}>`;
    for (const child of children) {
      const formatted = formatXml(child, indent + indentChar, indentChar);
      if (formatted) {
        result += '\n' + formatted;
      }
    }
    result += `\n${indent}</${tagName}>`;

    return result;
  };

  const handleFormat = () => {
    try {
      const doc = parseXml(input);
      if (doc) {
        const formatted = formatXml(doc);
        setOutput(formatted);
        setError(null);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : t('xml.invalid'));
      setOutput('');
    }
  };

  const handleMinify = () => {
    try {
      const doc = parseXml(input);
      if (doc) {
        const serializer = new XMLSerializer();
        const minified = serializer.serializeToString(doc)
          .replace(/>\s+</g, '><')
          .replace(/\s+/g, ' ')
          .trim();
        setOutput(minified);
        setError(null);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : t('xml.invalid'));
      setOutput('');
    }
  };

  const handleValidate = () => {
    try {
      parseXml(input);
      setError(null);
      setOutput(t('xml.valid'));
    } catch (e) {
      setError(e instanceof Error ? e.message : t('xml.invalid'));
      setOutput('');
    }
  };

  const copyToClipboard = async () => {
    if (output) {
      await navigator.clipboard.writeText(output);
    }
  };

  const sampleXml = `<?xml version="1.0" encoding="UTF-8"?>
<bookstore>
  <book category="fiction">
    <title lang="en">Harry Potter</title>
    <author>J.K. Rowling</author>
    <price>29.99</price>
  </book>
  <book category="tech">
    <title lang="en">Learning XML</title>
    <author>Erik T. Ray</author>
    <price>39.95</price>
  </book>
</bookstore>`;

  return (
    <ToolLayout title={t('tool.xmlFormatter')} description={t('tool.xmlFormatter.desc')}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="font-display font-bold uppercase tracking-wider text-sm">
              {t('common.input')}
            </label>
            <button
              onClick={() => setInput(sampleXml)}
              className="text-xs font-mono text-slate dark:text-dark-muted hover:text-coral transition-colors"
            >
              {t('xml.loadSample')}
            </button>
          </div>
          <textarea
            className="textarea-brutal h-[400px] font-mono text-sm"
            placeholder='<root><item>value</item></root>'
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
              <pre className="whitespace-pre-wrap break-all font-mono text-sm">
                {output || 'Output will appear here...'}
              </pre>
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

        <button onClick={handleFormat} className="btn-brutal-primary">
          {t('xml.format')}
        </button>

        <button onClick={handleMinify} className="btn-brutal">
          {t('xml.minify')}
        </button>

        <button onClick={handleValidate} className="btn-brutal">
          {t('xml.validate')}
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
