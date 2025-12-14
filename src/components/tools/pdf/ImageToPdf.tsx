import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import ToolLayout from '../../common/ToolLayout';
import FileDropZone from '../../common/FileDropZone';
import { useI18n } from '../../../contexts/I18nContext';

interface ImageItem {
  id: string;
  file: File;
  preview: string;
}

export default function ImageToPdf() {
  const { t } = useI18n();
  const [images, setImages] = useState<ImageItem[]>([]);
  const [processing, setProcessing] = useState(false);
  const [pageSize, setPageSize] = useState<'a4' | 'letter' | 'fit'>('fit');

  const handleFileSelect = (files: File[]) => {
    const newImages = files.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newImages]);
  };

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const moveImage = (id: string, direction: 'up' | 'down') => {
    const index = images.findIndex((img) => img.id === id);
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === images.length - 1)
    ) {
      return;
    }

    const newImages = [...images];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    [newImages[index], newImages[newIndex]] = [newImages[newIndex], newImages[index]];
    setImages(newImages);
  };

  const createPdf = async () => {
    if (images.length === 0) return;

    setProcessing(true);

    try {
      const pdfDoc = await PDFDocument.create();

      for (const imageItem of images) {
        const imageBytes = await imageItem.file.arrayBuffer();

        let image;
        if (imageItem.file.type === 'image/png') {
          image = await pdfDoc.embedPng(imageBytes);
        } else {
          image = await pdfDoc.embedJpg(imageBytes);
        }

        let pageWidth: number, pageHeight: number;

        if (pageSize === 'a4') {
          pageWidth = 595.28;
          pageHeight = 841.89;
        } else if (pageSize === 'letter') {
          pageWidth = 612;
          pageHeight = 792;
        } else {
          // Fit to image
          pageWidth = image.width;
          pageHeight = image.height;
        }

        const page = pdfDoc.addPage([pageWidth, pageHeight]);

        // Calculate scaling to fit image on page
        const scale = Math.min(
          pageWidth / image.width,
          pageHeight / image.height
        );

        const scaledWidth = image.width * scale;
        const scaledHeight = image.height * scale;

        // Center the image
        const x = (pageWidth - scaledWidth) / 2;
        const y = (pageHeight - scaledHeight) / 2;

        page.drawImage(image, {
          x,
          y,
          width: scaledWidth,
          height: scaledHeight,
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as BlobPart], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.download = `images-${Date.now()}.pdf`;
      link.href = url;
      link.click();

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('PDF creation error:', error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <ToolLayout title={t('tool.imageToPdf')} description={t('tool.imageToPdf.desc')} seoKey="imageToPdf">
      {/* Settings */}
      <div className="card-brutal">
        <h3 className="font-display font-bold uppercase text-sm mb-4">{t('common.settings')}</h3>
        <div>
          <label className="font-mono text-sm block mb-2">Page Size</label>
          <div className="flex gap-2">
            {[
              { value: 'fit', label: 'Fit to Image' },
              { value: 'a4', label: 'A4' },
              { value: 'letter', label: 'Letter' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setPageSize(option.value as typeof pageSize)}
                className={`tab flex-1 ${pageSize === option.value ? 'tab-active' : ''}`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Upload */}
      <FileDropZone
        onFileSelect={handleFileSelect}
        accept="image/jpeg,image/png"
        multiple
        maxSize={20}
      />

      {/* Image List */}
      {images.length > 0 && (
        <>
          <div>
            <label className="font-display font-bold uppercase tracking-wider text-sm mb-2 block">
              Pages ({images.length})
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
              {images.map((img, index) => (
                <div key={img.id} className="card-brutal p-2 relative group">
                  <img
                    src={img.preview}
                    alt={`Page ${index + 1}`}
                    className="w-full h-24 object-cover"
                  />
                  <div className="absolute top-1 left-1 bg-charcoal text-cream px-2 py-0.5 font-mono text-xs">
                    {index + 1}
                  </div>
                  <div className="absolute inset-0 bg-charcoal/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                    <button
                      onClick={() => moveImage(img.id, 'up')}
                      disabled={index === 0}
                      className="p-1 bg-cream text-charcoal disabled:opacity-50"
                    >
                      ←
                    </button>
                    <button
                      onClick={() => moveImage(img.id, 'down')}
                      disabled={index === images.length - 1}
                      className="p-1 bg-cream text-charcoal disabled:opacity-50"
                    >
                      →
                    </button>
                    <button
                      onClick={() => removeImage(img.id)}
                      className="p-1 bg-coral text-charcoal"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-4">
            <button
              onClick={createPdf}
              disabled={processing}
              className="btn-brutal-primary"
            >
              {processing ? 'Creating PDF...' : 'Create PDF'}
            </button>
            <button onClick={() => setImages([])} className="btn-brutal">
              {t('common.clear')}
            </button>
          </div>
        </>
      )}
    </ToolLayout>
  );
}
