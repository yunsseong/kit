# Web Tools - Product Requirements Document

## 프로젝트 개요

**프로젝트명**: Web Tools
**목적**: 브라우저에서 바로 사용할 수 있는 올인원 유틸리티 도구 모음
**핵심 가치**: 서버 업로드 없이 클라이언트에서 처리 → 빠르고 안전함

---

## 기술 스택

| 영역 | 기술 |
|------|------|
| 프레임워크 | React 18 + TypeScript |
| 스타일링 | Tailwind CSS |
| 라우팅 | React Router v6 |
| 빌드 | Vite |
| 배포 | Vercel / Netlify (정적) |

### 클라이언트 처리 라이브러리
- **이미지**: browser-image-compression, @pqina/pintura (선택), gif.js
- **PDF**: pdf-lib, pdf.js
- **기타**: crypto-js (해시), qrcode (QR생성)

---

## 핵심 기능 목록

### 1. 이미지 도구 (8개)

| 도구 | 설명 | 입력 | 출력 |
|------|------|------|------|
| **Image Resize** | 이미지 크기 조정 | 이미지 | 리사이즈된 이미지 |
| **Image Compress** | 이미지 용량 압축 | 이미지 | 압축된 이미지 |
| **Format Convert** | 포맷 변환 (PNG↔JPG↔WebP) | 이미지 | 변환된 이미지 |
| **Image Crop** | 이미지 자르기 | 이미지 | 크롭된 이미지 |
| **Background Remove** | 배경 제거 | 이미지 | 투명 배경 이미지 |
| **GIF Maker** | 여러 이미지로 GIF 생성 | 이미지들 | GIF |
| **Image to Base64** | 이미지를 Base64로 변환 | 이미지 | Base64 문자열 |
| **Add Watermark** | 워터마크 추가 | 이미지 + 텍스트 | 워터마크 이미지 |

### 2. PDF 도구 (6개)

| 도구 | 설명 | 입력 | 출력 |
|------|------|------|------|
| **PDF to Image** | PDF를 이미지로 변환 | PDF | 이미지들 (PNG/JPG) |
| **Image to PDF** | 이미지를 PDF로 변환 | 이미지들 | PDF |
| **Merge PDF** | PDF 합치기 | PDF들 | 단일 PDF |
| **Split PDF** | PDF 분할 | PDF | PDF들 |
| **Compress PDF** | PDF 압축 | PDF | 압축된 PDF |
| **PDF Page Extract** | 특정 페이지 추출 | PDF + 페이지 번호 | PDF |

### 3. 개발자 도구 (8개)

| 도구 | 설명 | 입력 | 출력 |
|------|------|------|------|
| **JSON Formatter** | JSON 정리/검증 | JSON 텍스트 | 포맷된 JSON |
| **Base64 Encode/Decode** | Base64 인코딩/디코딩 | 텍스트 | 변환된 텍스트 |
| **URL Encode/Decode** | URL 인코딩/디코딩 | 텍스트 | 변환된 텍스트 |
| **Hash Generator** | MD5, SHA-1, SHA-256 생성 | 텍스트 | 해시값 |
| **QR Code Generator** | QR 코드 생성 | 텍스트/URL | QR 이미지 |
| **Color Converter** | HEX↔RGB↔HSL 변환 | 색상값 | 변환된 색상 |
| **UUID Generator** | UUID v4 생성 | - | UUID |
| **Regex Tester** | 정규식 테스트 | 패턴 + 텍스트 | 매칭 결과 |

---

## UI/UX 가이드라인

### 디자인 원칙
1. **즉시성**: 페이지 로드 즉시 도구 사용 가능
2. **단순함**: 한 화면에 하나의 도구
3. **직관성**: 드래그앤드롭 + 명확한 버튼

### 레이아웃 구조
```
┌─────────────────────────────────────────────┐
│  Logo    [검색창]           [다크모드 토글]  │
├─────────────────────────────────────────────┤
│                                             │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐       │
│  │ 이미지   │ │  PDF    │ │ 개발자   │       │
│  │ 도구    │ │ 도구    │ │ 도구    │       │
│  └─────────┘ └─────────┘ └─────────┘       │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │                                     │   │
│  │     도구별 그리드 (카드 형태)         │   │
│  │                                     │   │
│  └─────────────────────────────────────┘   │
│                                             │
└─────────────────────────────────────────────┘
```

### 도구 페이지 공통 레이아웃
```
┌─────────────────────────────────────────────┐
│  ← 뒤로가기     도구명                       │
├─────────────────────────────────────────────┤
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │                                     │   │
│  │    드래그앤드롭 영역 / 입력 영역      │   │
│  │    (파일 선택 버튼 포함)             │   │
│  │                                     │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  [옵션 패널 - 필요한 경우]                  │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │         미리보기 / 결과 영역          │   │
│  └─────────────────────────────────────┘   │
│                                             │
│         [ 변환하기 / 다운로드 버튼 ]         │
│                                             │
└─────────────────────────────────────────────┘
```

### 색상 팔레트
```css
/* Light Mode */
--bg-primary: #ffffff;
--bg-secondary: #f5f5f5;
--text-primary: #1a1a1a;
--text-secondary: #666666;
--accent: #3b82f6;
--accent-hover: #2563eb;

/* Dark Mode */
--bg-primary: #1a1a1a;
--bg-secondary: #262626;
--text-primary: #ffffff;
--text-secondary: #a3a3a3;
--accent: #60a5fa;
--accent-hover: #3b82f6;
```

---

## 파일 구조

```
web-tools/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Layout.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── FileDropZone.tsx
│   │   │   ├── ToolCard.tsx
│   │   │   └── DownloadButton.tsx
│   │   ├── image/
│   │   │   ├── ImageResize.tsx
│   │   │   ├── ImageCompress.tsx
│   │   │   ├── FormatConvert.tsx
│   │   │   ├── ImageCrop.tsx
│   │   │   ├── BackgroundRemove.tsx
│   │   │   ├── GifMaker.tsx
│   │   │   ├── ImageToBase64.tsx
│   │   │   └── AddWatermark.tsx
│   │   ├── pdf/
│   │   │   ├── PdfToImage.tsx
│   │   │   ├── ImageToPdf.tsx
│   │   │   ├── MergePdf.tsx
│   │   │   ├── SplitPdf.tsx
│   │   │   ├── CompressPdf.tsx
│   │   │   └── PdfPageExtract.tsx
│   │   └── developer/
│   │       ├── JsonFormatter.tsx
│   │       ├── Base64Tool.tsx
│   │       ├── UrlEncoder.tsx
│   │       ├── HashGenerator.tsx
│   │       ├── QrGenerator.tsx
│   │       ├── ColorConverter.tsx
│   │       ├── UuidGenerator.tsx
│   │       └── RegexTester.tsx
│   ├── hooks/
│   │   ├── useFileUpload.ts
│   │   ├── useDownload.ts
│   │   └── useDarkMode.ts
│   ├── utils/
│   │   ├── imageUtils.ts
│   │   ├── pdfUtils.ts
│   │   └── devUtils.ts
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── ImageTools.tsx
│   │   ├── PdfTools.tsx
│   │   └── DevTools.tsx
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── public/
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

---

## 구현 우선순위

### Phase 1: 기반 구축 (Day 1)
- [ ] 프로젝트 셋업 (Vite + React + TS + Tailwind)
- [ ] 공통 컴포넌트 (Layout, Header, FileDropZone, ToolCard)
- [ ] 라우팅 구조
- [ ] 다크모드

### Phase 2: 개발자 도구 (Day 2)
- [ ] JSON Formatter
- [ ] Base64 Encode/Decode
- [ ] Hash Generator
- [ ] QR Code Generator
- [ ] Color Converter
- [ ] UUID Generator
- [ ] URL Encoder
- [ ] Regex Tester

### Phase 3: 이미지 도구 (Day 3-4)
- [ ] Image Resize
- [ ] Image Compress
- [ ] Format Convert
- [ ] Image Crop
- [ ] GIF Maker
- [ ] Image to Base64
- [ ] Add Watermark
- [ ] Background Remove (복잡도 높음)

### Phase 4: PDF 도구 (Day 5)
- [ ] PDF to Image
- [ ] Image to PDF
- [ ] Merge PDF
- [ ] Split PDF
- [ ] Compress PDF
- [ ] PDF Page Extract

### Phase 5: 마무리 (Day 6)
- [ ] 검색 기능
- [ ] 반응형 최적화
- [ ] 성능 최적화
- [ ] 배포

---

## 성능 목표

| 지표 | 목표 |
|------|------|
| First Contentful Paint | < 1.5s |
| Largest Contentful Paint | < 2.5s |
| 번들 크기 | < 500KB (gzip) |
| 도구 로딩 | 지연 로딩으로 필요시만 |

---

## 제약 사항

1. **파일 크기 제한**: 클라이언트 처리 특성상 대용량 파일 제한 필요
   - 이미지: 최대 20MB
   - PDF: 최대 50MB

2. **브라우저 지원**: 모던 브라우저만 지원
   - Chrome 90+
   - Firefox 88+
   - Safari 14+
   - Edge 90+

3. **배경 제거**: 완전한 클라이언트 처리는 제한적
   - 간단한 단색 배경 제거만 지원
   - 또는 외부 API 사용 고려 (remove.bg 등)
