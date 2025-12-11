import { useCallback, useState, useRef } from 'react';
import { useI18n } from '../../contexts/I18nContext';

interface FileDropZoneProps {
  onFileSelect: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in MB
  className?: string;
}

export default function FileDropZone({
  onFileSelect,
  accept = '*',
  multiple = false,
  maxSize = 20,
  className = '',
}: FileDropZoneProps) {
  const { t } = useI18n();
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFiles = useCallback((files: File[]): File[] => {
    const maxBytes = maxSize * 1024 * 1024;
    const validFiles: File[] = [];

    for (const file of files) {
      if (file.size > maxBytes) {
        setError(`File "${file.name}" exceeds ${maxSize}MB limit`);
        continue;
      }
      validFiles.push(file);
    }

    return validFiles;
  }, [maxSize]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setError(null);

    const files = Array.from(e.dataTransfer.files);
    const validFiles = validateFiles(multiple ? files : [files[0]]);

    if (validFiles.length > 0) {
      onFileSelect(validFiles);
    }
  }, [multiple, onFileSelect, validateFiles]);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const files = Array.from(e.target.files || []);
    const validFiles = validateFiles(files);

    if (validFiles.length > 0) {
      onFileSelect(validFiles);
    }

    // Reset input
    e.target.value = '';
  };

  return (
    <div className={className}>
      <div
        className={`dropzone min-h-[200px] p-8 ${isDragging ? 'dropzone-active' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          className="hidden"
        />

        <div className="text-center">
          <div className="mb-4">
            <div className="w-16 h-16 mx-auto border-3 border-charcoal dark:border-dark-border flex items-center justify-center">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="square" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </div>
          </div>
          <p className="font-display font-bold text-lg mb-1">
            {isDragging ? t('common.dropzone.active') : t('common.dropzone')}
          </p>
          <p className="font-mono text-xs text-slate dark:text-dark-muted">
            Max {maxSize}MB {multiple ? '• Multiple files allowed' : ''}
          </p>
        </div>
      </div>

      {error && (
        <div className="mt-2 px-4 py-2 bg-coral/20 border-3 border-coral">
          <p className="font-mono text-sm text-coral">{error}</p>
        </div>
      )}
    </div>
  );
}
