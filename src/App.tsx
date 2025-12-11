import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { I18nProvider } from './contexts/I18nContext';
import { SearchProvider } from './contexts/SearchContext';
import Layout from './components/common/Layout';
import LoadingSpinner from './components/common/LoadingSpinner';

// Lazy load pages
const Home = lazy(() => import('./pages/Home'));

// Developer Tools
const JsonFormatter = lazy(() => import('./components/tools/developer/JsonFormatter'));
const Base64Tool = lazy(() => import('./components/tools/developer/Base64Tool'));
const UrlEncoder = lazy(() => import('./components/tools/developer/UrlEncoder'));
const HashGenerator = lazy(() => import('./components/tools/developer/HashGenerator'));
const QrGenerator = lazy(() => import('./components/tools/developer/QrGenerator'));
const ColorConverter = lazy(() => import('./components/tools/developer/ColorConverter'));
const UuidGenerator = lazy(() => import('./components/tools/developer/UuidGenerator'));
const RegexTester = lazy(() => import('./components/tools/developer/RegexTester'));
const XmlFormatter = lazy(() => import('./components/tools/developer/XmlFormatter'));
const XmlParser = lazy(() => import('./components/tools/developer/XmlParser'));

// Image Tools
const ImageResize = lazy(() => import('./components/tools/image/ImageResize'));
const ImageCompress = lazy(() => import('./components/tools/image/ImageCompress'));
const FormatConvert = lazy(() => import('./components/tools/image/FormatConvert'));
const ImageCrop = lazy(() => import('./components/tools/image/ImageCrop'));
const GifMaker = lazy(() => import('./components/tools/image/GifMaker'));
const ImageToBase64 = lazy(() => import('./components/tools/image/ImageToBase64'));
const AddWatermark = lazy(() => import('./components/tools/image/AddWatermark'));

// PDF Tools
const PdfToImage = lazy(() => import('./components/tools/pdf/PdfToImage'));
const ImageToPdf = lazy(() => import('./components/tools/pdf/ImageToPdf'));
const MergePdf = lazy(() => import('./components/tools/pdf/MergePdf'));
const SplitPdf = lazy(() => import('./components/tools/pdf/SplitPdf'));
const CompressPdf = lazy(() => import('./components/tools/pdf/CompressPdf'));
const PdfPageExtract = lazy(() => import('./components/tools/pdf/PdfPageExtract'));
const PdfTextExtract = lazy(() => import('./components/tools/pdf/PdfTextExtract'));

function App() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <SearchProvider>
        <BrowserRouter>
          <Layout>
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<Home />} />

                {/* Developer Tools */}
                <Route path="/json-formatter" element={<JsonFormatter />} />
                <Route path="/base64" element={<Base64Tool />} />
                <Route path="/url-encoder" element={<UrlEncoder />} />
                <Route path="/hash-generator" element={<HashGenerator />} />
                <Route path="/qr-generator" element={<QrGenerator />} />
                <Route path="/color-converter" element={<ColorConverter />} />
                <Route path="/uuid-generator" element={<UuidGenerator />} />
                <Route path="/regex-tester" element={<RegexTester />} />
                <Route path="/xml-formatter" element={<XmlFormatter />} />
                <Route path="/xml-parser" element={<XmlParser />} />

                {/* Image Tools */}
                <Route path="/image-resize" element={<ImageResize />} />
                <Route path="/image-compress" element={<ImageCompress />} />
                <Route path="/format-convert" element={<FormatConvert />} />
                <Route path="/image-crop" element={<ImageCrop />} />
                <Route path="/gif-maker" element={<GifMaker />} />
                <Route path="/image-to-base64" element={<ImageToBase64 />} />
                <Route path="/add-watermark" element={<AddWatermark />} />

                {/* PDF Tools */}
                <Route path="/pdf-to-image" element={<PdfToImage />} />
                <Route path="/image-to-pdf" element={<ImageToPdf />} />
                <Route path="/merge-pdf" element={<MergePdf />} />
                <Route path="/split-pdf" element={<SplitPdf />} />
                <Route path="/compress-pdf" element={<CompressPdf />} />
                <Route path="/pdf-page-extract" element={<PdfPageExtract />} />
                <Route path="/pdf-text-extract" element={<PdfTextExtract />} />
              </Routes>
            </Suspense>
          </Layout>
        </BrowserRouter>
        </SearchProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}

export default App;
