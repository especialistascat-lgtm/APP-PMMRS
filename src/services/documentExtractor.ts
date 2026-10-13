import * as pdfjsLib from 'pdfjs-dist';
// @ts-ignore - Vite URL import for pdfjs worker
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import mammoth from 'mammoth';
import * as XLSX from 'xlsx';

// Initialize PDF.js worker
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;
}

export type SupportedDocType = 'pdf' | 'word' | 'excel' | 'text' | 'unknown';

export interface ExtractedDocumentInfo {
  fileName: string;
  fileSize: number;
  formattedSize: string;
  fileType: SupportedDocType;
  extension: string;
  text: string;
  pageCount?: number;
  sheetCount?: number;
  wordCount: number;
  charCount: number;
  warnings: string[];
}

export interface ExtractionProgress {
  status: 'idle' | 'reading' | 'extracting' | 'completed' | 'error';
  message: string;
  percent?: number;
}

/**
 * Format bytes to human readable string (KB, MB)
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

/**
 * Detect file type from name and mime
 */
export function detectDocumentType(fileName: string, mimeType?: string): { type: SupportedDocType; extension: string } {
  const ext = fileName.toLowerCase().split('.').pop() || '';

  if (ext === 'pdf' || mimeType === 'application/pdf') {
    return { type: 'pdf', extension: 'pdf' };
  }
  if (['docx', 'doc'].includes(ext) || mimeType?.includes('word')) {
    return { type: 'word', extension: ext };
  }
  if (['xlsx', 'xls', 'csv'].includes(ext) || mimeType?.includes('spreadsheet') || mimeType?.includes('excel')) {
    return { type: 'excel', extension: ext };
  }
  if (['txt', 'log', 'md'].includes(ext) || mimeType?.includes('text/plain')) {
    return { type: 'text', extension: ext };
  }

  return { type: 'unknown', extension: ext };
}

/**
 * Sanitize text to remove non-printable binary artifacts and NULL bytes
 */
export function sanitizeExtractedText(raw: string): string {
  if (!raw) return '';
  // Remove NULL and binary control characters, keep newlines and tabs
  return raw
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, '')
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .trim();
}

/**
 * Extract clean, human-readable text from PDF files using pdfjs-dist
 */
async function extractTextFromPdf(
  arrayBuffer: ArrayBuffer,
  onProgress?: (p: ExtractionProgress) => void
): Promise<{ text: string; pageCount: number; warnings: string[] }> {
  const warnings: string[] = [];
  const typedArray = new Uint8Array(arrayBuffer);

  const loadingTask = pdfjsLib.getDocument({
    data: typedArray,
    useSystemFonts: true,
  });

  const pdf = await loadingTask.promise;
  const pageCount = pdf.numPages;
  const textPieces: string[] = [];

  for (let i = 1; i <= pageCount; i++) {
    onProgress?.({
      status: 'extracting',
      message: `Extrayendo página ${i} de ${pageCount}...`,
      percent: Math.round((i / pageCount) * 100),
    });

    try {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => (item && typeof item.str === 'string' ? item.str : ''))
        .join(' ');

      if (pageText.trim()) {
        textPieces.push(`--- PÁGINA ${i} ---\n${pageText.trim()}`);
      }
    } catch (pageErr) {
      warnings.push(`Advertencia en página ${i}: No se pudo procesar completamente.`);
    }
  }

  const combined = textPieces.join('\n\n');
  const sanitized = sanitizeExtractedText(combined);

  if (!sanitized || sanitized.length < 50) {
    warnings.push(
      'El archivo PDF contiene muy poco texto seleccionable. Es posible que sea un documento escaneado (imagen). Puede ingresar o complementar los datos manualmente.'
    );
  }

  return { text: sanitized, pageCount, warnings };
}

/**
 * Extract clean text from Word documents (.docx) using mammoth
 */
async function extractTextFromWord(
  arrayBuffer: ArrayBuffer,
  extension: string
): Promise<{ text: string; warnings: string[] }> {
  const warnings: string[] = [];

  if (extension === 'doc') {
    warnings.push(
      'Archivo en formato Word 97-2003 (.doc). Si nota caracteres no reconocidos, se recomienda guardarlo en formato .docx o .pdf para máxima fidelidad.'
    );
  }

  try {
    const result = await mammoth.extractRawText({ arrayBuffer });
    const text = sanitizeExtractedText(result.value);

    if (result.messages && result.messages.length > 0) {
      result.messages.slice(0, 3).forEach((msg) => {
        if (msg.type === 'warning') warnings.push(msg.message);
      });
    }

    return { text, warnings };
  } catch (err: any) {
    throw new Error(
      `No se pudo extraer el texto del archivo Word (${err?.message || 'formato no soportado'}). Por favor conviértalo a .docx moderno o .pdf.`
    );
  }
}

/**
 * Extract clean tabular text from Excel spreadsheets (.xlsx, .xls, .csv)
 */
function extractTextFromExcel(
  arrayBuffer: ArrayBuffer
): { text: string; sheetCount: number; warnings: string[] } {
  const warnings: string[] = [];
  const workbook = XLSX.read(arrayBuffer, { type: 'array' });
  const sheetNames = workbook.SheetNames;
  const sheetPieces: string[] = [];

  sheetNames.forEach((sheetName, index) => {
    const sheet = workbook.Sheets[sheetName];
    if (!sheet) return;

    // Convert sheet to human-readable CSV / tab separated text
    const csvContent = XLSX.utils.sheet_to_csv(sheet);
    if (csvContent && csvContent.trim()) {
      sheetPieces.push(`=== HOJA [${index + 1}/${sheetNames.length}]: ${sheetName} ===\n${csvContent.trim()}`);
    }
  });

  const text = sanitizeExtractedText(sheetPieces.join('\n\n'));
  return { text, sheetCount: sheetNames.length, warnings };
}

/**
 * Master extraction function that handles PDF, DOCX, XLSX, and TXT
 */
export async function extractDocumentContent(
  file: File,
  onProgress?: (p: ExtractionProgress) => void
): Promise<ExtractedDocumentInfo> {
  const { type: fileType, extension } = detectDocumentType(file.name, file.type);
  const formattedSize = formatFileSize(file.size);

  onProgress?.({
    status: 'reading',
    message: `Leyendo archivo ${file.name} (${formattedSize})...`,
    percent: 10,
  });

  const arrayBuffer = await file.arrayBuffer();
  let extractedText = '';
  let pageCount: number | undefined;
  let sheetCount: number | undefined;
  let warnings: string[] = [];

  try {
    if (fileType === 'pdf') {
      onProgress?.({
        status: 'extracting',
        message: 'Iniciando extracción de páginas PDF...',
        percent: 25,
      });
      const res = await extractTextFromPdf(arrayBuffer, onProgress);
      extractedText = res.text;
      pageCount = res.pageCount;
      warnings = res.warnings;
    } else if (fileType === 'word') {
      onProgress?.({
        status: 'extracting',
        message: 'Decodificando estructura del documento Word (.docx)...',
        percent: 50,
      });
      const res = await extractTextFromWord(arrayBuffer, extension);
      extractedText = res.text;
      warnings = res.warnings;
    } else if (fileType === 'excel') {
      onProgress?.({
        status: 'extracting',
        message: 'Procesando libros y hojas de cálculo Excel...',
        percent: 50,
      });
      const res = extractTextFromExcel(arrayBuffer);
      extractedText = res.text;
      sheetCount = res.sheetCount;
      warnings = res.warnings;
    } else {
      // Plain text or fallback
      onProgress?.({
        status: 'extracting',
        message: 'Procesando texto plano...',
        percent: 60,
      });
      const textDecoder = new TextDecoder('utf-8', { fatal: false });
      const rawText = textDecoder.decode(arrayBuffer);
      extractedText = sanitizeExtractedText(rawText);

      // Verify if it looks like raw binary (e.g. PDF header '%PDF-' or ZIP header 'PK')
      if (rawText.startsWith('%PDF-') || rawText.startsWith('PK\x03\x04')) {
        warnings.push('El archivo contiene firmas binarias comprimidas no legibles directamente como texto plano.');
      }
    }
  } catch (err: any) {
    onProgress?.({
      status: 'error',
      message: err.message || 'Error durante la extracción del documento',
    });
    throw err;
  }

  // Calculate statistics
  const cleanText = sanitizeExtractedText(extractedText);
  const wordCount = cleanText ? cleanText.trim().split(/\s+/).filter(Boolean).length : 0;
  const charCount = cleanText.length;

  onProgress?.({
    status: 'completed',
    message: 'Extracción de contenido finalizada exitosamente.',
    percent: 100,
  });

  return {
    fileName: file.name,
    fileSize: file.size,
    formattedSize,
    fileType,
    extension,
    text: cleanText,
    pageCount,
    sheetCount,
    wordCount,
    charCount,
    warnings,
  };
}
