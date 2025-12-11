import { useState, useMemo } from 'react';
import ToolLayout from '../../common/ToolLayout';
import { useI18n } from '../../../contexts/I18nContext';

interface MatchResult {
  match: string;
  index: number;
  groups: string[];
}

// HTML 특수문자 이스케이프 함수 (XSS 방지)
function escapeHtml(text: string): string {
  const escapeMap: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (char) => escapeMap[char]);
}

export default function RegexTester() {
  const { t } = useI18n();
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState('g');
  const [testString, setTestString] = useState('');

  const results = useMemo(() => {
    if (!pattern || !testString) {
      return { matches: [], highlightedText: escapeHtml(testString), error: null };
    }

    try {
      const regex = new RegExp(pattern, flags);

      const matches: MatchResult[] = [];
      let match;

      if (flags.includes('g')) {
        while ((match = regex.exec(testString)) !== null) {
          matches.push({
            match: match[0],
            index: match.index,
            groups: match.slice(1)
          });
          // Prevent infinite loop for zero-length matches
          if (match.index === regex.lastIndex) {
            regex.lastIndex++;
          }
        }
      } else {
        match = regex.exec(testString);
        if (match) {
          matches.push({
            match: match[0],
            index: match.index,
            groups: match.slice(1)
          });
        }
      }

      // Create highlighted text with proper HTML escaping (XSS protection)
      const startTag = '<mark class="bg-lime text-charcoal px-0.5">';
      const endTag = '</mark>';

      // Build highlighted text by iterating through matches
      let highlightedText = '';
      let lastIndex = 0;

      matches.forEach((m) => {
        // Escape and add the text before this match
        highlightedText += escapeHtml(testString.slice(lastIndex, m.index));
        // Add the highlighted match (escaped)
        highlightedText += startTag + escapeHtml(m.match) + endTag;
        lastIndex = m.index + m.match.length;
      });

      // Add remaining text after last match
      highlightedText += escapeHtml(testString.slice(lastIndex));

      return { matches, highlightedText, error: null };
    } catch (e) {
      return { matches: [], highlightedText: escapeHtml(testString), error: (e as Error).message };
    }
  }, [pattern, flags, testString]);

  const toggleFlag = (flag: string) => {
    if (flags.includes(flag)) {
      setFlags(flags.replace(flag, ''));
    } else {
      setFlags(flags + flag);
    }
  };

  return (
    <ToolLayout title={t('tool.regexTester')} description={t('tool.regexTester.desc')}>
      {/* Pattern Input */}
      <div>
        <label className="font-display font-bold uppercase tracking-wider text-sm mb-2 block">
          {t('regex.pattern')}
        </label>
        <div className="flex gap-2">
          <span className="input-brutal w-12 flex items-center justify-center text-slate">/</span>
          <input
            type="text"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            className="input-brutal flex-1"
            placeholder="Enter regex pattern..."
          />
          <span className="input-brutal w-12 flex items-center justify-center text-slate">/</span>
          <input
            type="text"
            value={flags}
            onChange={(e) => setFlags(e.target.value)}
            className="input-brutal w-20"
            placeholder="flags"
          />
        </div>
        {results.error && (
          <p className="mt-2 font-mono text-sm text-coral">{results.error}</p>
        )}
      </div>

      {/* Flags */}
      <div className="flex flex-wrap gap-2">
        {[
          { flag: 'g', labelKey: 'regex.global' },
          { flag: 'i', labelKey: 'regex.caseInsensitive' },
          { flag: 'm', labelKey: 'regex.multiline' },
          { flag: 's', labelKey: 'regex.dotAll' },
        ].map(({ flag, labelKey }) => (
          <button
            key={flag}
            onClick={() => toggleFlag(flag)}
            className={`tab ${flags.includes(flag) ? 'tab-active' : ''}`}
          >
            {flag} - {t(labelKey)}
          </button>
        ))}
      </div>

      {/* Test String */}
      <div>
        <label className="font-display font-bold uppercase tracking-wider text-sm mb-2 block">
          {t('regex.testString')}
        </label>
        <textarea
          className="textarea-brutal h-[150px]"
          placeholder="Enter text to test against..."
          value={testString}
          onChange={(e) => setTestString(e.target.value)}
        />
      </div>

      {/* Highlighted Result */}
      {testString && !results.error && (
        <div>
          <label className="font-display font-bold uppercase tracking-wider text-sm mb-2 block">
            {t('regex.highlightedMatches')} ({results.matches.length})
          </label>
          <div
            className="result-box whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: results.highlightedText }}
          />
        </div>
      )}

      {/* Match Details */}
      {results.matches.length > 0 && (
        <div>
          <label className="font-display font-bold uppercase tracking-wider text-sm mb-2 block">
            {t('regex.matchDetails')}
          </label>
          <div className="space-y-2">
            {results.matches.map((match, index) => (
              <div key={index} className="card-brutal p-4">
                <div className="flex items-center gap-4 mb-2">
                  <span className="font-display font-bold text-sm">{t('regex.match')} {index + 1}</span>
                  <span className="font-mono text-xs text-slate dark:text-cream/60">
                    {t('regex.index')}: {match.index}
                  </span>
                </div>
                <code className="font-mono text-sm bg-lime text-charcoal px-2 py-1 inline-block">
                  {match.match}
                </code>
                {match.groups.length > 0 && (
                  <div className="mt-2">
                    <span className="font-mono text-xs text-slate dark:text-cream/60">{t('regex.groups')}: </span>
                    {match.groups.map((group, i) => (
                      <span key={i} className="font-mono text-sm bg-mist dark:bg-slate px-2 py-1 ml-1">
                        {group}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
