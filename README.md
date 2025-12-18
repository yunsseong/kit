# Kit

All-in-one utility tools that run directly in your browser.

**No server uploads, everything is processed client-side** → Fast, secure, and private.

<img width="1624" height="1060" alt="preview" src="https://github.com/user-attachments/assets/2fdc682a-b244-440a-816e-146d1a3be91e" />

## Features

### Image Tools (7)
| Tool | Description |
|------|-------------|
| Image Resize | Resize image dimensions with preview |
| Image Compress | Reduce image file size |
| Format Convert | Convert between PNG, JPG, WebP |
| Image Crop | Crop freely or by aspect ratio |
| GIF Maker | Create animated GIFs from multiple images |
| Image to Base64 | Convert images to Base64 strings |
| Add Watermark | Add text watermarks to images |

### PDF Tools (7)
| Tool | Description |
|------|-------------|
| PDF to Image | Convert PDF pages to images |
| Image to PDF | Create PDF from images |
| Merge PDF | Combine multiple PDFs into one |
| Split PDF | Split PDF by pages |
| Compress PDF | Reduce PDF file size |
| Extract Pages | Extract specific pages from PDF |
| Extract Text | Extract text content from PDF |

### Developer Tools (10)
| Tool | Description |
|------|-------------|
| JSON Formatter | Format and validate JSON |
| XML Formatter | Format, minify, and validate XML |
| XML Parser | Convert between XML and JSON |
| Base64 | Encode/decode Base64 |
| URL Encoder | Encode/decode URLs |
| Hash Generator | Generate MD5, SHA-1, SHA-256, SHA-512 |
| QR Generator | Create QR codes |
| Color Converter | Convert between HEX, RGB, HSL |
| UUID Generator | Generate UUID v1-v7 (all versions) |
| Regex Tester | Test regular expressions with highlighting |

## Tech Stack

- **Framework**: React 19 + TypeScript
- **Styling**: Tailwind CSS
- **Build**: Vite 7
- **Routing**: React Router 7
- **i18n**: i18next + react-i18next

### Client-side Processing Libraries
- **Image**: browser-image-compression, gif.js, react-image-crop
- **PDF**: pdf-lib, pdfjs-dist
- **Utilities**: crypto-js (hashing), qrcode (QR generation)

## Getting Started

### Install

```bash
npm install
```

### Development Server

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

### Build

```bash
npm run build
```

### Preview

```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── common/
│   │   ├── ContactModal.tsx
│   │   ├── FileDropZone.tsx
│   │   ├── Header.tsx
│   │   ├── Layout.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── ToolCard.tsx
│   │   └── ToolLayout.tsx
│   └── tools/
│       ├── developer/   # 10 tools
│       ├── image/       # 7 tools
│       └── pdf/         # 7 tools
├── contexts/
│   ├── I18nContext.tsx  # i18n (KO/EN/JA)
│   ├── SearchContext.tsx
│   └── ThemeContext.tsx # Dark mode
├── pages/
│   └── Home.tsx
└── App.tsx
```

## Language Support

Supports Korean, English, and Japanese. Toggle language using the button in the header.

## License

MIT
