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
  'hero.title': { en: 'Kit', ko: 'Kit' },
  'hero.subtitle': { en: 'Free online utilities. All processing happens in your browser.', ko: '무료 온라인 유틸리티. 모든 처리는 브라우저에서.' },
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
  'tool.xmlFormatter': { en: 'XML Formatter', ko: 'XML 포매터' },
  'tool.xmlFormatter.desc': { en: 'Format and validate XML', ko: 'XML 정리 및 검증' },
  'tool.xmlParser': { en: 'XML Parser', ko: 'XML 파서' },
  'tool.xmlParser.desc': { en: 'Convert XML ↔ JSON', ko: 'XML ↔ JSON 변환' },

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
  'tool.pdfTextExtract': { en: 'PDF Text Extract', ko: 'PDF 텍스트 추출' },
  'tool.pdfTextExtract.desc': { en: 'Extract all text from PDF', ko: 'PDF에서 모든 텍스트 추출' },

  // Specific tool texts
  'json.format': { en: 'Format', ko: '정리' },
  'json.minify': { en: 'Minify', ko: '압축' },
  'json.valid': { en: 'Valid JSON', ko: '유효한 JSON' },
  'json.invalid': { en: 'Invalid JSON', ko: '유효하지 않은 JSON' },

  'xml.format': { en: 'Format', ko: '정리' },
  'xml.minify': { en: 'Minify', ko: '압축' },
  'xml.validate': { en: 'Validate', ko: '검증' },
  'xml.valid': { en: 'Valid XML', ko: '유효한 XML' },
  'xml.invalid': { en: 'Invalid XML', ko: '유효하지 않은 XML' },
  'xml.loadSample': { en: 'Load sample', ko: '샘플 로드' },
  'xmlParser.swap': { en: 'Swap', ko: '교환' },
  'xmlParser.attrPrefix': { en: 'Attr prefix', ko: '속성 접두사' },
  'xmlParser.ignoreAttrs': { en: 'Ignore attributes', ko: '속성 무시' },
  'xmlParser.singleRoot': { en: 'JSON must have a single root element', ko: 'JSON은 단일 루트 요소가 필요합니다' },
  'common.error': { en: 'An error occurred', ko: '오류가 발생했습니다' },

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
  'watermark.patternMode': { en: 'Pattern repeat', ko: '패턴 반복' },
  'watermark.spacingX': { en: 'Horizontal spacing', ko: '가로 간격' },
  'watermark.spacingY': { en: 'Vertical spacing', ko: '세로 간격' },
  'watermark.rotation': { en: 'Rotation', ko: '회전 각도' },

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
  'pdf.extracting': { en: 'Extracting text...', ko: '텍스트 추출 중...' },
  'pdf.processingPages': { en: 'Processing {pages} pages...', ko: '{pages} 페이지 처리 중...' },
  'pdf.extractedText': { en: 'Extracted Text', ko: '추출된 텍스트' },
  'pdf.copyAll': { en: 'Copy All', ko: '전체 복사' },
  'pdf.downloadTxt': { en: 'Download TXT', ko: 'TXT 다운로드' },
  'pdf.page': { en: 'Page', ko: '페이지' },
  'pdf.noText': { en: 'No text found on this page', ko: '이 페이지에 텍스트가 없습니다' },
  'pdf.extractAnother': { en: 'Extract Another PDF', ko: '다른 PDF 추출' },

  // SEO - Page Titles (optimized for search)
  'seo.home.title': { en: 'Kit | Free Online Utilities - Image, PDF & Developer Tools', ko: 'Kit | 무료 온라인 유틸리티 - 이미지, PDF, 개발자 도구' },
  'seo.home.description': { en: 'Free online utilities for images, PDFs, and developers. All processing happens in your browser - no uploads, 100% private and secure.', ko: '이미지, PDF, 개발자를 위한 무료 온라인 도구. 모든 처리는 브라우저에서 - 서버 업로드 없이 100% 안전하게.' },

  // Developer Tools SEO
  'seo.jsonFormatter.title': { en: 'JSON Formatter & Validator - Free Online Tool', ko: 'JSON 포매터 & 검증기 - 무료 온라인 도구' },
  'seo.jsonFormatter.description': { en: 'Format, beautify and validate JSON online. No server uploads, works entirely in your browser. Free and secure.', ko: 'JSON 정리, 들여쓰기, 검증을 온라인에서. 서버 업로드 없이 브라우저에서 안전하게 처리.' },

  'seo.base64.title': { en: 'Base64 Encoder/Decoder - Free Online Tool', ko: 'Base64 인코더/디코더 - 무료 온라인 도구' },
  'seo.base64.description': { en: 'Encode or decode Base64 strings instantly. No server uploads, 100% browser-based and private.', ko: 'Base64 문자열 인코딩/디코딩을 즉시. 서버 업로드 없이 100% 브라우저 기반.' },

  'seo.urlEncoder.title': { en: 'URL Encoder/Decoder - Free Online Tool', ko: 'URL 인코더/디코더 - 무료 온라인 도구' },
  'seo.urlEncoder.description': { en: 'Encode or decode URLs instantly. Handles special characters safely. No server uploads required.', ko: 'URL 인코딩/디코딩을 즉시. 특수문자 안전하게 처리. 서버 업로드 불필요.' },

  'seo.hashGenerator.title': { en: 'Hash Generator (MD5, SHA-1, SHA-256) - Free Online', ko: '해시 생성기 (MD5, SHA-1, SHA-256) - 무료 온라인' },
  'seo.hashGenerator.description': { en: 'Generate MD5, SHA-1, SHA-256, SHA-512 hashes instantly. Secure, browser-based, no data sent to servers.', ko: 'MD5, SHA-1, SHA-256, SHA-512 해시를 즉시 생성. 안전하게 브라우저에서, 서버 전송 없음.' },

  'seo.qrGenerator.title': { en: 'QR Code Generator - Free Online Tool', ko: 'QR 코드 생성기 - 무료 온라인 도구' },
  'seo.qrGenerator.description': { en: 'Create QR codes instantly for URLs, text, and more. Download as PNG. Free and no sign-up required.', ko: 'URL, 텍스트 등을 위한 QR 코드를 즉시 생성. PNG로 다운로드. 무료, 가입 불필요.' },

  'seo.colorConverter.title': { en: 'Color Converter (HEX, RGB, HSL) - Free Online', ko: '색상 변환기 (HEX, RGB, HSL) - 무료 온라인' },
  'seo.colorConverter.description': { en: 'Convert colors between HEX, RGB, and HSL formats instantly. Visual color picker included.', ko: 'HEX, RGB, HSL 색상 형식을 즉시 변환. 비주얼 색상 선택기 포함.' },

  'seo.uuidGenerator.title': { en: 'UUID Generator (v1-v7) - Free Online Tool', ko: 'UUID 생성기 (v1-v7) - 무료 온라인 도구' },
  'seo.uuidGenerator.description': { en: 'Generate UUID v1, v4, v6, v7 instantly. Bulk generation supported. Free and browser-based.', ko: 'UUID v1, v4, v6, v7을 즉시 생성. 대량 생성 지원. 무료, 브라우저 기반.' },

  'seo.regexTester.title': { en: 'Regex Tester - Free Online Regular Expression Tool', ko: '정규식 테스터 - 무료 온라인 정규표현식 도구' },
  'seo.regexTester.description': { en: 'Test regular expressions with real-time highlighting. Supports flags and capture groups. Free online.', ko: '실시간 하이라이트로 정규표현식 테스트. 플래그와 캡처 그룹 지원. 무료 온라인.' },

  'seo.xmlFormatter.title': { en: 'XML Formatter & Validator - Free Online Tool', ko: 'XML 포매터 & 검증기 - 무료 온라인 도구' },
  'seo.xmlFormatter.description': { en: 'Format, beautify and validate XML online. Minify option available. No server uploads.', ko: 'XML 정리, 들여쓰기, 검증을 온라인에서. 압축 옵션 제공. 서버 업로드 없음.' },

  'seo.xmlParser.title': { en: 'XML to JSON Converter - Free Online Tool', ko: 'XML ↔ JSON 변환기 - 무료 온라인 도구' },
  'seo.xmlParser.description': { en: 'Convert between XML and JSON formats instantly. Bi-directional conversion. Free and browser-based.', ko: 'XML과 JSON 형식을 즉시 상호 변환. 양방향 변환 지원. 무료, 브라우저 기반.' },

  // Image Tools SEO
  'seo.imageResize.title': { en: 'Image Resize - Free Online Tool (No Upload)', ko: '이미지 리사이즈 - 무료 온라인 도구 (업로드 없음)' },
  'seo.imageResize.description': { en: 'Resize images to any dimension instantly. No server uploads - 100% private. Supports JPG, PNG, WebP.', ko: '이미지 크기를 원하는 대로 즉시 조정. 서버 업로드 없음 - 100% 안전. JPG, PNG, WebP 지원.' },

  'seo.imageCompress.title': { en: 'Image Compress - Reduce File Size Free Online', ko: '이미지 압축 - 용량 줄이기 무료 온라인' },
  'seo.imageCompress.description': { en: 'Compress images and reduce file size without losing quality. No uploads to server, works in browser.', ko: '화질 손실 없이 이미지 용량 줄이기. 서버 업로드 없이 브라우저에서 처리.' },

  'seo.formatConvert.title': { en: 'Image Format Converter (PNG, JPG, WebP) - Free', ko: '이미지 포맷 변환 (PNG, JPG, WebP) - 무료' },
  'seo.formatConvert.description': { en: 'Convert images between PNG, JPG, and WebP formats. Fast, free, and no server uploads required.', ko: 'PNG, JPG, WebP 형식 간 이미지 변환. 빠르고, 무료이며, 서버 업로드 불필요.' },

  'seo.imageCrop.title': { en: 'Image Crop - Free Online Tool (No Upload)', ko: '이미지 자르기 - 무료 온라인 도구 (업로드 없음)' },
  'seo.imageCrop.description': { en: 'Crop images freely or by aspect ratio. No server uploads - your images stay private. Free online tool.', ko: '이미지를 자유롭게 또는 비율로 자르기. 서버 업로드 없음 - 이미지가 비공개로 유지. 무료 온라인 도구.' },

  'seo.gifMaker.title': { en: 'GIF Maker - Create Animated GIFs Free Online', ko: 'GIF 만들기 - 애니메이션 GIF 무료 온라인 생성' },
  'seo.gifMaker.description': { en: 'Create animated GIFs from multiple images. Adjust frame delay, free to use, no uploads required.', ko: '여러 이미지로 애니메이션 GIF 생성. 프레임 지연 조정, 무료 사용, 업로드 불필요.' },

  'seo.imageToBase64.title': { en: 'Image to Base64 Converter - Free Online Tool', ko: '이미지 → Base64 변환기 - 무료 온라인 도구' },
  'seo.imageToBase64.description': { en: 'Convert images to Base64 encoded strings instantly. Perfect for embedding in HTML/CSS. No uploads.', ko: '이미지를 Base64 문자열로 즉시 변환. HTML/CSS 임베딩에 적합. 업로드 없음.' },

  'seo.addWatermark.title': { en: 'Add Watermark to Image - Free Online Tool', ko: '이미지 워터마크 추가 - 무료 온라인 도구' },
  'seo.addWatermark.description': { en: 'Add text watermarks to images. Customize position, size, opacity. No server uploads - 100% private.', ko: '이미지에 텍스트 워터마크 추가. 위치, 크기, 투명도 조정. 서버 업로드 없음 - 100% 안전.' },

  // PDF Tools SEO
  'seo.pdfToImage.title': { en: 'PDF to Image Converter - Free Online (No Upload)', ko: 'PDF → 이미지 변환 - 무료 온라인 (업로드 없음)' },
  'seo.pdfToImage.description': { en: 'Convert PDF pages to JPG/PNG images. No server uploads - your files stay private. Free online tool.', ko: 'PDF 페이지를 JPG/PNG 이미지로 변환. 서버 업로드 없음 - 파일이 비공개로 유지. 무료 온라인 도구.' },

  'seo.imageToPdf.title': { en: 'Image to PDF Converter - Free Online Tool', ko: '이미지 → PDF 변환 - 무료 온라인 도구' },
  'seo.imageToPdf.description': { en: 'Convert images to PDF document. Combine multiple images into one PDF. No server uploads required.', ko: '이미지를 PDF 문서로 변환. 여러 이미지를 하나의 PDF로 합치기. 서버 업로드 불필요.' },

  'seo.mergePdf.title': { en: 'Merge PDF - Combine PDFs Free Online (No Upload)', ko: 'PDF 합치기 - 무료 온라인 PDF 결합 (업로드 없음)' },
  'seo.mergePdf.description': { en: 'Combine multiple PDF files into one. No server uploads - 100% secure and private. Fast and free.', ko: '여러 PDF 파일을 하나로 합치기. 서버 업로드 없이 100% 안전하고 비공개. 빠르고 무료.' },

  'seo.splitPdf.title': { en: 'Split PDF - Separate Pages Free Online', ko: 'PDF 분할 - 페이지 나누기 무료 온라인' },
  'seo.splitPdf.description': { en: 'Split PDF into individual pages or ranges. No server uploads - your documents stay private. Free tool.', ko: 'PDF를 개별 페이지 또는 범위로 분할. 서버 업로드 없음 - 문서가 비공개로 유지. 무료 도구.' },

  'seo.compressPdf.title': { en: 'Compress PDF - Reduce File Size Free Online', ko: 'PDF 압축 - 용량 줄이기 무료 온라인' },
  'seo.compressPdf.description': { en: 'Reduce PDF file size without losing quality. No uploads to server, works entirely in browser.', ko: '품질 손실 없이 PDF 용량 줄이기. 서버 업로드 없이 브라우저에서만 처리.' },

  'seo.pdfPageExtract.title': { en: 'Extract PDF Pages - Free Online Tool', ko: 'PDF 페이지 추출 - 무료 온라인 도구' },
  'seo.pdfPageExtract.description': { en: 'Extract specific pages from PDF. Select pages to save as new PDF. No server uploads required.', ko: 'PDF에서 특정 페이지 추출. 선택한 페이지를 새 PDF로 저장. 서버 업로드 불필요.' },

  'seo.pdfTextExtract.title': { en: 'PDF Text Extractor - Copy Text from PDF Free', ko: 'PDF 텍스트 추출 - PDF에서 텍스트 복사 무료' },
  'seo.pdfTextExtract.description': { en: 'Extract all text from PDF documents. Copy or download as TXT. No uploads - works in your browser.', ko: 'PDF 문서에서 모든 텍스트 추출. 복사 또는 TXT로 다운로드. 업로드 없이 브라우저에서 작동.' },
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
