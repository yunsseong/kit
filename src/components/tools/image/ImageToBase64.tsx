import { useState } from 'react';
import ToolLayout from '../../common/ToolLayout';
import FileDropZone from '../../common/FileDropZone';
import { useI18n } from '../../../contexts/I18nContext';

export default function ImageToBase64() {
  const { t } = useI18n();
  const [image, setImage] = useState<string | null>(null);
  const [base64, setBase64] = useState<string>('');
  const [dataUri, setDataUri] = useState<string>('');
  const [copied, setCopied] = useState<'base64' | 'dataUri' | null>(null);
  const [fileInfo, setFileInfo] = useState<{ name: string; type: string; size: number } | null>(null);

  const handleFileSelect = (files: File[]) => {
    const file = files[0];
    if (!file) return;

    setFileInfo({
      name: file.name,
      type: file.type,
      size: file.size,
    });

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setImage(result);
      setDataUri(result);
      // Extract base64 without data URI prefix
      setBase64(result.split(',')[1]);
    };
    reader.readAsDataURL(file);
  };

  const copyToClipboard = async (text: string, type: 'base64' | 'dataUri') => {
    await navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <ToolLayout title={t('tool.imageToBase64')} description={t('tool.imageToBase64.desc')} seoKey="imageToBase64">
      {!image ? (
        <FileDropZone
          onFileSelect={handleFileSelect}
          accept="image/*"
          maxSize={5}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Preview */}
            <div>
              <label className="font-display font-bold uppercase tracking-wider text-sm mb-2 block">
                Image Preview
              </label>
              <div className="card-brutal p-4">
                <img
                  src={image}
                  alt="Preview"
                  className="max-w-full h-auto max-h-[300px] mx-auto"
                />
              </div>
              {fileInfo && (
                <div className="mt-4 font-mono text-sm space-y-1">
                  <p><span className="text-slate dark:text-cream/60">Name:</span> {fileInfo.name}</p>
                  <p><span className="text-slate dark:text-cream/60">Type:</span> {fileInfo.type}</p>
                  <p><span className="text-slate dark:text-cream/60">Size:</span> {formatSize(fileInfo.size)}</p>
                  <p><span className="text-slate dark:text-cream/60">Base64 length:</span> {base64.length.toLocaleString()} chars</p>
                </div>
              )}
            </div>

            {/* Output */}
            <div className="space-y-6">
              {/* Data URI */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="font-display font-bold uppercase tracking-wider text-sm">
                    Data URI
                  </label>
                  <button
                    onClick={() => copyToClipboard(dataUri, 'dataUri')}
                    className="btn-brutal btn-brutal-sm"
                  >
                    {copied === 'dataUri' ? t('common.copied') : t('common.copy')}
                  </button>
                </div>
                <div className="result-box h-[150px]">
                  <code className="break-all text-xs">{dataUri}</code>
                </div>
              </div>

              {/* Base64 Only */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="font-display font-bold uppercase tracking-wider text-sm">
                    Base64 Only
                  </label>
                  <button
                    onClick={() => copyToClipboard(base64, 'base64')}
                    className="btn-brutal btn-brutal-sm"
                  >
                    {copied === 'base64' ? t('common.copied') : t('common.copy')}
                  </button>
                </div>
                <div className="result-box h-[150px]">
                  <code className="break-all text-xs">{base64}</code>
                </div>
              </div>
            </div>
          </div>

          {/* Usage Examples */}
          <div className="card-brutal">
            <h3 className="font-display font-bold uppercase text-sm mb-4">Usage Examples</h3>
            <div className="space-y-3 font-mono text-sm">
              <div className="bg-mist dark:bg-charcoal p-3 border-3 border-charcoal dark:border-cream">
                <p className="text-slate dark:text-cream/60 mb-1">HTML:</p>
                <code className="break-all">{`<img src="${dataUri.substring(0, 50)}..." />`}</code>
              </div>
              <div className="bg-mist dark:bg-charcoal p-3 border-3 border-charcoal dark:border-cream">
                <p className="text-slate dark:text-cream/60 mb-1">CSS:</p>
                <code className="break-all">{`background-image: url("${dataUri.substring(0, 50)}...");`}</code>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-4">
            <button onClick={() => setImage(null)} className="btn-brutal">
              {t('common.clear')}
            </button>
          </div>
        </>
      )}
    </ToolLayout>
  );
}
