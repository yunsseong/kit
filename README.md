# Kit
브라우저에서 바로 사용할 수 있는 올인원 유틸리티 도구 모음입니다.

**서버 업로드 없이 클라이언트에서 처리** → 빠르고 안전합니다.

<img width="1624" height="1060" alt="preview" src="https://github.com/user-attachments/assets/2fdc682a-b244-440a-816e-146d1a3be91e" />


## 주요 기능

### 이미지 도구
| 도구 | 설명 |
|------|------|
| 이미지 리사이즈 | 이미지 크기 조정 |
| 이미지 압축 | 이미지 용량 줄이기 |
| 포맷 변환 | PNG ↔ JPG ↔ WebP 변환 |
| 이미지 자르기 | 자유롭게 또는 비율로 자르기 |
| GIF 만들기 | 여러 이미지로 애니메이션 GIF 생성 |
| 이미지 → Base64 | 이미지를 Base64 문자열로 변환 |
| 워터마크 추가 | 이미지에 텍스트 워터마크 추가 |

### PDF 도구
| 도구 | 설명 |
|------|------|
| PDF → 이미지 | PDF 페이지를 이미지로 변환 |
| 이미지 → PDF | 이미지로 PDF 생성 |
| PDF 합치기 | 여러 PDF를 하나로 합치기 |
| PDF 분할 | PDF를 페이지별로 분할 |
| PDF 압축 | PDF 용량 줄이기 |
| 페이지 추출 | 특정 페이지만 추출 |

### 개발자 도구
| 도구 | 설명 |
|------|------|
| JSON 포매터 | JSON 정리 및 검증 |
| XML 포매터 | XML 포맷팅, 압축, 유효성 검사 |
| XML 파서 | XML ↔ JSON 상호 변환 |
| Base64 | Base64 인코딩/디코딩 |
| URL 인코더 | URL 인코딩/디코딩 |
| 해시 생성기 | MD5, SHA-1, SHA-256, SHA-512 생성 |
| QR 생성기 | QR 코드 생성 |
| 색상 변환기 | HEX ↔ RGB ↔ HSL 변환 |
| UUID 생성기 | UUID v1~v7 전체 버전 생성 |
| 정규식 테스터 | 정규표현식 테스트 |

## 기술 스택

- **프레임워크**: React 18 + TypeScript
- **스타일링**: Tailwind CSS (Brutal Design)
- **빌드**: Vite
- **라우팅**: React Router v6

### 클라이언트 처리 라이브러리
- **이미지**: browser-image-compression, gif.js
- **PDF**: pdf-lib, pdf.js
- **기타**: crypto-js (해시), qrcode (QR 생성)

## 시작하기

### 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:5173` 접속

### 빌드

```bash
npm run build
```

### 미리보기

```bash
npm run preview
```

## 프로젝트 구조

```
src/
├── components/
│   ├── common/          # 공통 컴포넌트
│   │   ├── FileDropZone.tsx
│   │   ├── Header.tsx
│   │   ├── Layout.tsx
│   │   └── ToolLayout.tsx
│   └── tools/
│       ├── developer/   # 개발자 도구
│       ├── image/       # 이미지 도구
│       └── pdf/         # PDF 도구
├── contexts/
│   ├── I18nContext.tsx  # 다국어 지원 (한/영)
│   └── ThemeContext.tsx # 다크모드
├── pages/
│   └── Home.tsx
└── App.tsx
```

## 다국어 지원

한국어와 영어를 지원합니다. 헤더의 언어 토글 버튼으로 전환할 수 있습니다.

## 라이선스

MIT
