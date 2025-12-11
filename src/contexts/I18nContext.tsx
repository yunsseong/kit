import { createContext, useContext, useState, type ReactNode } from 'react';

type Language = 'en' | 'ko';

interface Translations {
  [key: string]: {
    en: string;
    ko: string;
  };
}

const translations: Translations = {
  // Navigation
  'nav.home': { en: 'Home', ko: '홈' },
  'nav.image': { en: 'Image Tools', ko: '이미지 도구' },
  'nav.pdf': { en: 'PDF Tools', ko: 'PDF 도구' },
  'nav.developer': { en: 'Developer', ko: '개발자 도구' },

  // Common
  'common.download': { en: 'Download', ko: '다운로드' },
  'common.copy': { en: 'Copy', ko: '복사' },
  'common.copied': { en: 'Copied!', ko: '복사됨!' },
  'common.clear': { en: 'Clear', ko: '초기화' },
  'common.process': { en: 'Process', ko: '처리' },
  'common.convert': { en: 'Convert', ko: '변환' },
  'common.generate': { en: 'Generate', ko: '생성' },
  'common.upload': { en: 'Upload', ko: '업로드' },
  'common.dropzone': { en: 'Drop files here or click to select', ko: '파일을 드래그하거나 클릭하여 선택' },
  'common.dropzone.active': { en: 'Drop files here...', ko: '여기에 파일을 놓으세요...' },
  'common.input': { en: 'Input', ko: '입력' },
  'common.output': { en: 'Output', ko: '출력' },
  'common.settings': { en: 'Settings', ko: '설정' },
  'common.back': { en: 'Back', ko: '뒤로' },
  'common.noFile': { en: 'No file selected', ko: '선택된 파일 없음' },

  // Hero
  'hero.title': { en: 'Web Tools', ko: 'Web Tools' },
  'hero.subtitle': { en: 'Free online utilities. No uploads. All processing happens in your browser.', ko: '무료 온라인 유틸리티. 업로드 없음. 모든 처리는 브라우저에서.' },
  'hero.search': { en: 'Search tools...', ko: '도구 검색...' },

  // Categories
  'category.developer': { en: 'Developer Tools', ko: '개발자 도구' },
  'category.image': { en: 'Image Tools', ko: '이미지 도구' },
  'category.pdf': { en: 'PDF Tools', ko: 'PDF 도구' },

  // Developer Tools
  'tool.jsonFormatter': { en: 'JSON Formatter', ko: 'JSON 포매터' },
  'tool.jsonFormatter.desc': { en: 'Format and validate JSON', ko: 'JSON 정리 및 검증' },
  'tool.base64': { en: 'Base64', ko: 'Base64' },
  'tool.base64.desc': { en: 'Encode/decode Base64', ko: 'Base64 인코딩/디코딩' },
  'tool.urlEncoder': { en: 'URL Encoder', ko: 'URL 인코더' },
  'tool.urlEncoder.desc': { en: 'Encode/decode URLs', ko: 'URL 인코딩/디코딩' },
  'tool.hashGenerator': { en: 'Hash Generator', ko: '해시 생성기' },
  'tool.hashGenerator.desc': { en: 'Generate MD5, SHA hashes', ko: 'MD5, SHA 해시 생성' },
  'tool.qrGenerator': { en: 'QR Generator', ko: 'QR 생성기' },
  'tool.qrGenerator.desc': { en: 'Create QR codes', ko: 'QR 코드 생성' },
  'tool.colorConverter': { en: 'Color Converter', ko: '색상 변환기' },
  'tool.colorConverter.desc': { en: 'Convert HEX, RGB, HSL', ko: 'HEX, RGB, HSL 변환' },
  'tool.uuidGenerator': { en: 'UUID Generator', ko: 'UUID 생성기' },
  'tool.uuidGenerator.desc': { en: 'Generate unique IDs', ko: '고유 ID 생성' },
  'tool.regexTester': { en: 'Regex Tester', ko: '정규식 테스터' },
  'tool.regexTester.desc': { en: 'Test regular expressions', ko: '정규표현식 테스트' },

  // Image Tools
  'tool.imageResize': { en: 'Image Resize', ko: '이미지 리사이즈' },
  'tool.imageResize.desc': { en: 'Resize images to any dimension', ko: '이미지 크기 조정' },
  'tool.imageCompress': { en: 'Image Compress', ko: '이미지 압축' },
  'tool.imageCompress.desc': { en: 'Reduce image file size', ko: '이미지 용량 줄이기' },
  'tool.formatConvert': { en: 'Format Convert', ko: '포맷 변환' },
  'tool.formatConvert.desc': { en: 'Convert PNG, JPG, WebP', ko: 'PNG, JPG, WebP 변환' },
  'tool.imageCrop': { en: 'Image Crop', ko: '이미지 자르기' },
  'tool.imageCrop.desc': { en: 'Crop images freely or by ratio', ko: '자유롭게 또는 비율로 자르기' },
  'tool.gifMaker': { en: 'GIF Maker', ko: 'GIF 만들기' },
  'tool.gifMaker.desc': { en: 'Create animated GIFs', ko: '애니메이션 GIF 생성' },
  'tool.imageToBase64': { en: 'Image to Base64', ko: '이미지 → Base64' },
  'tool.imageToBase64.desc': { en: 'Convert image to Base64', ko: '이미지를 Base64로 변환' },
  'tool.addWatermark': { en: 'Add Watermark', ko: '워터마크 추가' },
  'tool.addWatermark.desc': { en: 'Add text watermark to images', ko: '이미지에 텍스트 워터마크 추가' },

  // PDF Tools
  'tool.pdfToImage': { en: 'PDF to Image', ko: 'PDF → 이미지' },
  'tool.pdfToImage.desc': { en: 'Convert PDF pages to images', ko: 'PDF 페이지를 이미지로 변환' },
  'tool.imageToPdf': { en: 'Image to PDF', ko: '이미지 → PDF' },
  'tool.imageToPdf.desc': { en: 'Create PDF from images', ko: '이미지로 PDF 생성' },
  'tool.mergePdf': { en: 'Merge PDF', ko: 'PDF 합치기' },
  'tool.mergePdf.desc': { en: 'Combine multiple PDFs', ko: '여러 PDF 합치기' },
  'tool.splitPdf': { en: 'Split PDF', ko: 'PDF 분할' },
  'tool.splitPdf.desc': { en: 'Split PDF into pages', ko: 'PDF를 페이지별로 분할' },
  'tool.compressPdf': { en: 'Compress PDF', ko: 'PDF 압축' },
  'tool.compressPdf.desc': { en: 'Reduce PDF file size', ko: 'PDF 용량 줄이기' },
  'tool.pdfPageExtract': { en: 'Extract Pages', ko: '페이지 추출' },
  'tool.pdfPageExtract.desc': { en: 'Extract specific pages', ko: '특정 페이지 추출' },

  // Specific tool texts
  'json.format': { en: 'Format', ko: '정리' },
  'json.minify': { en: 'Minify', ko: '압축' },
  'json.valid': { en: 'Valid JSON', ko: '유효한 JSON' },
  'json.invalid': { en: 'Invalid JSON', ko: '유효하지 않은 JSON' },

  'base64.encode': { en: 'Encode', ko: '인코딩' },
  'base64.decode': { en: 'Decode', ko: '디코딩' },

  'hash.md5': { en: 'MD5', ko: 'MD5' },
  'hash.sha1': { en: 'SHA-1', ko: 'SHA-1' },
  'hash.sha256': { en: 'SHA-256', ko: 'SHA-256' },
  'hash.sha512': { en: 'SHA-512', ko: 'SHA-512' },

  'image.width': { en: 'Width', ko: '너비' },
  'image.height': { en: 'Height', ko: '높이' },
  'image.quality': { en: 'Quality', ko: '품질' },
  'image.maintainRatio': { en: 'Maintain aspect ratio', ko: '비율 유지' },
  'image.format': { en: 'Format', ko: '포맷' },

  'crop.free': { en: 'Free', ko: '자유' },
  'crop.ratio': { en: 'Ratio', ko: '비율' },

  'watermark.text': { en: 'Watermark text', ko: '워터마크 텍스트' },
  'watermark.position': { en: 'Position', ko: '위치' },
  'watermark.opacity': { en: 'Opacity', ko: '투명도' },
  'watermark.fontSize': { en: 'Font Size', ko: '글꼴 크기' },
  'watermark.color': { en: 'Color', ko: '색상' },
  'watermark.preview': { en: 'Preview', ko: '미리보기' },

  // Image tools additional
  'image.quickResize': { en: 'Quick resize', ko: '빠른 크기 조정' },
  'image.processing': { en: 'Processing...', ko: '처리 중...' },
  'image.resize': { en: 'Resize', ko: '크기 조정' },
  'image.result': { en: 'Result', ko: '결과' },

  // GIF Maker
  'gif.frameDelay': { en: 'Frame delay', ko: '프레임 지연' },
  'gif.frames': { en: 'Frames', ko: '프레임' },
  'gif.creating': { en: 'Creating GIF...', ko: 'GIF 생성 중...' },
  'gif.createGif': { en: 'Create GIF', ko: 'GIF 생성' },

  // Regex Tester
  'regex.pattern': { en: 'Pattern', ko: '패턴' },
  'regex.testString': { en: 'Test String', ko: '테스트 문자열' },
  'regex.highlightedMatches': { en: 'Highlighted Matches', ko: '하이라이트된 일치' },
  'regex.matchDetails': { en: 'Match Details', ko: '일치 상세' },
  'regex.match': { en: 'Match', ko: '일치' },
  'regex.index': { en: 'Index', ko: '인덱스' },
  'regex.groups': { en: 'Groups', ko: '그룹' },
  'regex.global': { en: 'Global', ko: '전역' },
  'regex.caseInsensitive': { en: 'Case Insensitive', ko: '대소문자 무시' },
  'regex.multiline': { en: 'Multiline', ko: '여러 줄' },
  'regex.dotAll': { en: 'Dot All', ko: '점 전체' },

  'pdf.pages': { en: 'Pages', ko: '페이지' },
  'pdf.allPages': { en: 'All pages', ko: '모든 페이지' },
  'pdf.selectPages': { en: 'Select pages (e.g., 1,3,5-7)', ko: '페이지 선택 (예: 1,3,5-7)' },
};

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('language') as Language;
      if (saved) return saved;
      return navigator.language.startsWith('ko') ? 'ko' : 'en';
    }
    return 'en';
  });

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    const translation = translations[key];
    if (!translation) {
      console.warn(`Missing translation: ${key}`);
      return key;
    }
    return translation[language];
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
