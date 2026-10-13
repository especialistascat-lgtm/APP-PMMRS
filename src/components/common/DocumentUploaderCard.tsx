import React, { useState, useRef } from 'react';
import { 
  Upload, 
  FileUp, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  Eye, 
  EyeOff, 
  RefreshCw, 
  Sparkles, 
  FileText,
  Layers,
  Database
} from 'lucide-react';
import { 
  extractDocumentContent, 
  ExtractedDocumentInfo, 
  ExtractionProgress,
  detectDocumentType
} from '../../services/documentExtractor';
import { DocumentFormatIcon } from './DocumentFormatIcon';

interface DocumentUploaderCardProps {
  onDocumentExtracted: (info: ExtractedDocumentInfo) => void;
  onClear: () => void;
  currentInfo: ExtractedDocumentInfo | null;
  onLoadSample: () => void;
}

export const DocumentUploaderCard: React.FC<DocumentUploaderCardProps> = ({
  onDocumentExtracted,
  onClear,
  currentInfo,
  onLoadSample
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState<ExtractionProgress | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showRawText, setShowRawText] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    setIsLoading(true);
    setErrorMessage(null);
    setProgress({
      status: 'reading',
      message: `Iniciando lectura de ${file.name}...`,
      percent: 5,
    });

    try {
      const extracted = await extractDocumentContent(file, (p) => {
        setProgress(p);
      });

      onDocumentExtracted(extracted);
    } catch (err: any) {
      console.error('Error processing document:', err);
      setErrorMessage(
        err?.message || 'Error al procesar el documento. Asegúrese de que no esté corrupto o protegido con contraseña.'
      );
    } finally {
      setIsLoading(false);
      setProgress(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  return (
    <div className="space-y-4">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx,.doc,.xlsx,.xls,.csv,.txt"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* STATE 1: EXTRACTION IN PROGRESS */}
      {isLoading && (
        <div className="p-8 rounded-2xl bg-gradient-to-br from-slate-900 to-purple-950/40 border-2 border-purple-500/40 shadow-2xl space-y-4 animate-pulse">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <RefreshCw className="w-6 h-6 text-amber-400 animate-spin" />
              <div>
                <h4 className="text-sm font-bold text-white">
                  Procesando y extrayendo texto del documento...
                </h4>
                <p className="text-xs text-amber-300/80">
                  {progress?.message || 'Decodificando contenido binario a texto estructurado...'}
                </p>
              </div>
            </div>
            <span className="font-mono text-sm font-bold text-amber-400">
              {progress?.percent ? `${progress.percent}%` : 'Extrayendo...'}
            </span>
          </div>

          <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-purple-900/40">
            <div
              className="bg-gradient-to-r from-amber-500 via-purple-500 to-cyan-400 h-full rounded-full transition-all duration-300"
              style={{ width: `${progress?.percent || 50}%` }}
            />
          </div>

          <p className="text-[11px] text-slate-400 text-center">
            Extracción nativa segura sin saturación de memoria. Convirtiendo flujos de datos a texto limpio auditable.
          </p>
        </div>
      )}

      {/* STATE 2: DOCUMENT LOADED & VISUALIZED */}
      {!isLoading && currentInfo && (
        <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-purple-900/40 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            
            {/* File Format Icon and Main Metadata */}
            <div className="flex items-start sm:items-center gap-4">
              <DocumentFormatIcon
                type={currentInfo.fileType}
                size="lg"
                extension={currentInfo.extension}
              />

              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Documento Cargado
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    <CheckCircle2 className="w-3 h-3" />
                    Texto Extraído Correctamente
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-white break-all line-clamp-1" title={currentInfo.fileName}>
                  {currentInfo.fileName}
                </h3>

                {/* Badges / Metrics Row */}
                <div className="flex items-center gap-3 text-xs text-slate-300 flex-wrap pt-0.5">
                  <span className="font-semibold text-slate-400">
                    Tamaño: <strong className="text-white font-mono">{currentInfo.formattedSize}</strong>
                  </span>
                  
                  {currentInfo.pageCount !== undefined && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-red-950/50 text-red-300 border border-red-800/40 font-mono">
                      📄 {currentInfo.pageCount} páginas
                    </span>
                  )}

                  {currentInfo.sheetCount !== undefined && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-950/50 text-emerald-300 border border-emerald-800/40 font-mono">
                      📊 {currentInfo.sheetCount} hojas
                    </span>
                  )}

                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                    📝 {currentInfo.wordCount.toLocaleString()} palabras
                  </span>

                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-purple-950/50 text-purple-300 border border-purple-800/40 font-mono">
                    🔤 {currentInfo.charCount.toLocaleString()} caracteres limpios
                  </span>
                </div>
              </div>
            </div>

            {/* Actions for current loaded document */}
            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
              <button
                type="button"
                onClick={() => setShowRawText(!showRawText)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
                title="Inspeccionar el texto extraído"
              >
                {showRawText ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showRawText ? 'Ocultar Texto' : 'Ver Texto'}</span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-950/60 hover:bg-purple-900/60 text-purple-200 text-xs font-semibold border border-purple-800/40 transition-colors cursor-pointer"
                title="Cargar un documento diferente"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Cambiar Archivo</span>
              </button>

              <button
                type="button"
                onClick={onClear}
                className="p-1.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-800/40 transition-colors cursor-pointer"
                title="Quitar archivo cargado"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Warnings Box if any */}
          {currentInfo.warnings.length > 0 && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
                <span>Observaciones sobre la extracción:</span>
              </div>
              <ul className="list-disc pl-5 space-y-0.5 text-amber-200/90 text-[11px]">
                {currentInfo.warnings.map((w, idx) => (
                  <li key={idx}>{w}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Collapsible / Editable Clean Text View */}
          {showRawText && (
            <div className="space-y-2 pt-2 animate-fadeIn">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300">
                  Vista previa del texto extraído (sanitizado y listo para auditoría):
                </span>
                <span className="font-mono text-slate-500 text-[11px]">
                  {currentInfo.charCount} caracteres legibles
                </span>
              </div>
              <div className="max-h-60 overflow-y-auto rounded-xl bg-slate-950 p-4 border border-slate-800 font-mono text-xs text-slate-300 leading-relaxed whitespace-pre-wrap selection:bg-purple-600">
                {currentInfo.text || 'Sin texto extraído.'}
              </div>
            </div>
          )}
        </div>
      )}

      {/* STATE 3: DROPZONE / EMPTY UPLOAD CONTAINER */}
      {!isLoading && !currentInfo && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative p-8 sm:p-10 rounded-2xl border-2 border-dashed transition-all duration-300 text-center ${
            isDragging
              ? 'border-amber-400 bg-purple-950/30 scale-[1.01]'
              : 'border-slate-700/80 hover:border-purple-500/60 bg-slate-900/60 hover:bg-slate-900/90'
          }`}
        >
          {/* Format Badges Supported */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <DocumentFormatIcon type="pdf" size="sm" />
            <DocumentFormatIcon type="word" size="sm" />
            <DocumentFormatIcon type="excel" size="sm" />
          </div>

          <h4 className="text-base sm:text-lg font-bold text-white mb-1">
            Arrastre y suelte su archivo aquí o haga clic para examinar
          </h4>
          <p className="text-xs text-slate-400 max-w-md mx-auto mb-5 leading-relaxed">
            Formatos soportados con extracción directa: <strong className="text-red-400 font-semibold">PDF</strong> (.pdf),{' '}
            <strong className="text-blue-400 font-semibold">Word</strong> (.docx, .doc),{' '}
            <strong className="text-emerald-400 font-semibold">Excel</strong> (.xlsx, .xls, .csv) y{' '}
            <strong className="text-slate-300 font-semibold">Texto</strong> (.txt).
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-purple-600 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-900/30 transition-all cursor-pointer"
            >
              <FileUp className="w-4 h-4" />
              <span>Seleccionar Documento (PDF / Word / Excel)</span>
            </button>

            <button
              type="button"
              onClick={onLoadSample}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs border border-amber-500/30 transition-all cursor-pointer"
              title="Cargar un documento PMMRS de ejemplo con observaciones típicas"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Cargar Documento Muestra</span>
            </button>
          </div>

          <p className="text-[11px] text-slate-500 mt-4">
            El extractor procesa localmente en su navegador para evitar tiempos muertos y errores de caracteres binarios.
          </p>
        </div>
      )}

      {/* Error notification if upload or extraction fails */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <strong className="font-bold">Error en la carga del documento:</strong>
            <p className="mt-0.5">{errorMessage}</p>
          </div>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="text-red-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
