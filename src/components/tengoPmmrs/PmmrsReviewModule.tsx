import React, { useState } from 'react';
import { 
  ClipboardCheck, 
  Upload, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  ArrowRight, 
  Printer, 
  Download, 
  Sparkles, 
  ShieldAlert, 
  FileSpreadsheet,
  RefreshCw,
  Search
} from 'lucide-react';
import { PmmrsReviewReport, ReviewSectionEvaluation } from '../../types';
import { AiAnalysisService } from '../../services/aiAnalysisService';
import { ProjectStorage } from '../../services/projectStorage';
import { SAMPLE_PMMRS_DOCUMENT_TEXT } from '../../data/demoProject';
import { GryphosLogo } from '../GryphosLogo';
import { DocumentUploaderCard } from '../common/DocumentUploaderCard';
import { DocumentFormatIcon } from '../common/DocumentFormatIcon';
import { ExtractedDocumentInfo, detectDocumentType } from '../../services/documentExtractor';

interface PmmrsReviewModuleProps {
  onBackToHome: () => void;
}

export const PmmrsReviewModule: React.FC<PmmrsReviewModuleProps> = ({
  onBackToHome
}) => {
  const [documentText, setDocumentText] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [companyName, setCompanyName] = useState<string>('Empresa Evaluada');
  const [docInfo, setDocInfo] = useState<ExtractedDocumentInfo | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [report, setReport] = useState<PmmrsReviewReport | null>(null);
  const [activeTab, setActiveTab] = useState<'RESUMEN' | 'MATRIZ_HALLAZGOS' | 'GENERICOS' | 'INCONSISTENCIAS' | 'INFORME_FINAL'>('RESUMEN');

  // Load sample flawed document to demonstrate the audit capability
  const handleLoadSampleDocument = () => {
    const text = SAMPLE_PMMRS_DOCUMENT_TEXT;
    const name = 'PMMRS_Constructora_El_Progreso_2024.pdf';
    setDocumentText(text);
    setFileName(name);
    setCompanyName('CONSTRUCTORA EL PROGRESO DEL SUR S.A.C.');
    setDocInfo({
      fileName: name,
      fileSize: 1420500,
      formattedSize: '1.35 MB',
      fileType: 'pdf',
      extension: 'pdf',
      text: text,
      pageCount: 16,
      wordCount: text.split(/\s+/).filter(Boolean).length,
      charCount: text.length,
      warnings: ['Documento muestra preconfigurado para pruebas de detección de observaciones y omisiones.']
    });
  };

  const handleDocumentExtracted = (info: ExtractedDocumentInfo) => {
    setDocInfo(info);
    setDocumentText(info.text);
    setFileName(info.fileName);

    // Auto-detect or sanitize company name
    if (!companyName || companyName === 'Empresa Evaluada') {
      const rzMatch = info.text.match(/(?:raz[oó]n\s+social|empresa|titular)\s*[:\-]\s*([^\n\r,;]+)/i);
      if (rzMatch && rzMatch[1]?.trim() && rzMatch[1].trim().length > 3) {
        setCompanyName(rzMatch[1].trim());
      } else {
        const cleanFromFilename = info.fileName
          .replace(/\.[^/.]+$/, '')
          .replace(/[_\-]+/g, ' ')
          .replace(/\b(PMRS|PMMRS|Rev\d+|v\d+|\d{4}-\d{2}-\d{2})\b/gi, '')
          .trim();
        if (cleanFromFilename.length > 3) {
          setCompanyName(cleanFromFilename);
        }
      }
    }
  };

  const handleClearDocument = () => {
    setDocInfo(null);
    setDocumentText('');
    setFileName('');
  };

  const handleRunAnalysis = async () => {
    if (!documentText.trim()) return;

    setIsAnalyzing(true);
    try {
      const result = await AiAnalysisService.analyzeDocument(documentText, fileName, companyName);
      setReport(result);
      ProjectStorage.saveReviewReport(result);
    } catch (err) {
      alert('Error al analizar el documento. Intente nuevamente.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handlePrintReport = () => {
    window.print();
  };

  const handleDownloadWordReport = () => {
    if (!report) return;

    const content = document.getElementById('review-report-printable')?.innerHTML;
    if (!content) return;

    const header = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' 
            xmlns:w='urn:schemas-microsoft-com:office:word' 
            xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>INFORME_REVISION_PMMRS_${report.companyName}</title>
        <style>
          body { font-family: 'Calibri', 'Arial', sans-serif; font-size: 11pt; color: #1e293b; line-height: 1.5; }
          h1 { font-size: 18pt; color: #0f766e; text-align: center; }
          h2 { font-size: 13pt; color: #047857; border-bottom: 1px solid #10b981; margin-top: 15px; }
          table { width: 100%; border-collapse: collapse; margin: 10px 0; }
          th, td { border: 1px solid #cbd5e1; padding: 6px 8px; font-size: 9pt; }
          th { background-color: #f1f5f9; }
          .critica { color: #dc2626; font-weight: bold; }
          .mayor { color: #d97706; font-weight: bold; }
          .conforme { color: #16a34a; font-weight: bold; }
        </style>
      </head>
      <body>
        ${content}
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff', header], { type: 'application/msword;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `INFORME_REVISION_PMMRS_${report.companyName.replace(/[^a-zA-Z0-9]/g, '_')}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto py-4">
      
      {/* Header */}
      <div className="no-print bg-slate-900 border border-purple-900/30 rounded-2xl p-6 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3.5 mb-2">
            <GryphosLogo size="sm" withGlow={true} withBorder={true} />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-purple-900/50 text-amber-300 border border-purple-700/50">MÓDULO 2 • CASA GRYPHOS</span>
              </div>
              <h2 className="text-xl font-black text-white mt-1">Revisión, Fiscalización y Auditoría Técnica de PMMRS Existente</h2>
            </div>
          </div>
          <p className="text-xs text-slate-400">
            Cargue su documento PMMRS (PDF, Word o texto). El sistema compara la estructura con los 13 capítulos de la RM 089-2023-MINAM, 
            detecta omisiones, frases genéricas no trazables e inconsistencias cuantitativas.
          </p>
        </div>

        <button
          onClick={onBackToHome}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs border border-slate-700 transition-colors cursor-pointer self-start md:self-center"
        >
          Volver a Inicio
        </button>
      </div>

      {/* Upload and Configuration Area */}
      {!report && (
        <div className="bg-slate-900 border border-purple-900/30 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Upload className="w-4 h-4 text-amber-400" />
                Cargar Archivo del PMMRS (PDF, Word, Excel o TXT)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Extracción automática nativa de texto. Soporta <strong className="text-red-400">PDF</strong>, <strong className="text-blue-400">Word</strong> (.docx/.doc) y <strong className="text-emerald-400">Excel</strong> (.xlsx/.xls) sin caracteres binarios corruptos.
              </p>
            </div>

            <button
              type="button"
              onClick={handleLoadSampleDocument}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-950/60 hover:bg-purple-900/60 text-amber-300 border border-amber-500/40 text-xs font-bold transition-all cursor-pointer shadow-sm shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Cargar Documento Muestra de Ejemplo</span>
            </button>
          </div>

          {/* Company / Project Metadata */}
          <div className="text-xs">
            <label className="block font-semibold text-slate-300 mb-1">
              Nombre de la Empresa o Proyecto Evaluado <span className="text-slate-500 font-normal">(se autodetecta del documento o puede editarse)</span>
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Ej: Constructora El Progreso del Sur S.A.C."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-400 transition-colors font-medium"
            />
          </div>

          {/* Document Uploader Card (Supports PDF, Word, Excel & shows loaded format icon) */}
          <DocumentUploaderCard
            onDocumentExtracted={handleDocumentExtracted}
            onClear={handleClearDocument}
            currentInfo={docInfo}
            onLoadSample={handleLoadSampleDocument}
          />

          {/* Fallback Text Area for Direct Editing or Manual Paste if desired */}
          {(!docInfo || !docInfo.text) && (
            <div className="pt-2 border-t border-slate-800/80">
              <div className="flex items-center justify-between mb-1.5 text-xs">
                <label className="font-semibold text-slate-300">
                  O pegue directamente el texto del PMMRS aquí:
                </label>
                <span className="font-mono text-slate-500 text-[11px]">{documentText.length} caracteres</span>
              </div>
              <textarea
                rows={6}
                value={documentText}
                onChange={(e) => {
                  setDocumentText(e.target.value);
                  if (!fileName) setFileName('Documento_Manual.txt');
                }}
                placeholder="Pegue aquí el texto copiado del Plan de Minimización y Manejo de Residuos Sólidos..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-white text-xs font-mono placeholder-slate-600 focus:outline-none focus:border-purple-500 leading-relaxed"
              />
            </div>
          )}

          {/* Execute Analysis Action Button */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
            <div className="text-xs text-slate-400 flex items-center gap-2">
              {docInfo ? (
                <>
                  <DocumentFormatIcon type={docInfo.fileType} size="sm" extension={docInfo.extension} />
                  <span>
                    Listo para auditar <strong className="text-white">{docInfo.fileName}</strong> ({docInfo.wordCount.toLocaleString()} palabras limpias).
                  </span>
                </>
              ) : documentText.trim() ? (
                <span className="text-slate-300">
                  Texto ingresado manualmente ({documentText.length} caracteres).
                </span>
              ) : (
                <span className="text-slate-500">
                  Cargue un archivo (PDF, Word o Excel) para iniciar la auditoría técnica.
                </span>
              )}
            </div>

            <button
              onClick={handleRunAnalysis}
              disabled={isAnalyzing || !documentText.trim()}
              className={`flex items-center gap-2.5 px-8 py-3.5 rounded-xl font-bold text-xs shadow-xl transition-all cursor-pointer shrink-0 ${
                isAnalyzing || !documentText.trim()
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  : 'bg-gradient-to-r from-purple-700 via-purple-600 to-amber-600 hover:from-purple-600 hover:to-amber-500 text-white shadow-purple-900/40 ring-1 ring-amber-400/40'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
                  <span>Auditando capítulos y trazabilidad normativa...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Ejecutar Revisión Técnica Automatizada</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Results and Report Area */}
      {report && (
        <div className="space-y-6">
          
          {/* Top Score Banner */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className={`w-20 h-20 rounded-2xl flex flex-col items-center justify-center font-black font-mono shadow-xl border-2 ${
                report.overallScore >= 80 
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' 
                  : report.overallScore >= 50
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                  : 'bg-red-500/20 text-red-400 border-red-500/40'
              }`}>
                <span className="text-3xl leading-none">{report.overallScore}%</span>
                <span className="text-[9px] uppercase font-bold tracking-widest mt-1">Nivel</span>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs uppercase font-bold text-amber-400 tracking-wider">
                    Resultado de Evaluación Técnica
                  </span>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-800 text-slate-200 font-mono text-xs border border-slate-700">
                    <DocumentFormatIcon type={detectDocumentType(report.fileName).type} size="sm" extension={detectDocumentType(report.fileName).extension} />
                    <span className="font-semibold">{report.fileName}</span>
                  </div>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  {report.companyName}
                </h3>
                <p className="text-xs text-slate-400">
                  {report.missingSections.length} capítulos no desarrollados • {report.genericContentAlerts.length} alertas de contenido genérico • {report.inconsistencies.length} inconsistencias cuantitativas
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 self-end md:self-center">
              <button
                onClick={() => setReport(null)}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 cursor-pointer"
              >
                Nueva Evaluación
              </button>
              <button
                onClick={handleDownloadWordReport}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Exportar Informe (.doc)</span>
              </button>
              <button
                onClick={handlePrintReport}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimir / PDF</span>
              </button>
            </div>
          </div>

          {/* Subtabs for Inspection */}
          <div className="no-print flex flex-wrap gap-2 border-b border-slate-800 pb-3 text-xs font-bold">
            <button
              onClick={() => setActiveTab('RESUMEN')}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'RESUMEN' ? 'bg-cyan-600 text-white shadow-md' : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              Resumen Ejecutivo y Categorías
            </button>
            <button
              onClick={() => setActiveTab('MATRIZ_HALLAZGOS')}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'MATRIZ_HALLAZGOS' ? 'bg-cyan-600 text-white shadow-md' : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              Matriz de Hallazgos por Capítulo (13 Secciones)
            </button>
            <button
              onClick={() => setActiveTab('GENERICOS')}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'GENERICOS' ? 'bg-cyan-600 text-white shadow-md' : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              Contenido Genérico Detectado ({report.genericContentAlerts.length})
            </button>
            <button
              onClick={() => setActiveTab('INCONSISTENCIAS')}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'INCONSISTENCIAS' ? 'bg-cyan-600 text-white shadow-md' : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              Inconsistencias Cuantitativas ({report.inconsistencies.length})
            </button>
            <button
              onClick={() => setActiveTab('INFORME_FINAL')}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'INFORME_FINAL' ? 'bg-cyan-600 text-white shadow-md' : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              Vista de Informe Técnico de Observaciones
            </button>
          </div>

          {/* TAB 1: RESUMEN Y COMPONENTES */}
          {activeTab === 'RESUMEN' && (
            <div className="space-y-6">
              
              {/* Executive Summary Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md space-y-3">
                <h4 className="text-xs uppercase font-bold text-white tracking-wider flex items-center gap-2">
                  <FileText className="w-4 h-4 text-cyan-400" />
                  Dictamen del Revisor Técnico
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono">
                  {report.executiveSummary}
                </p>
              </div>

              {/* Component breakdown bar chart */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md space-y-4">
                <h4 className="text-xs uppercase font-bold text-white tracking-wider">
                  Nivel de Cumplimiento Desglosado por Componente (Ponderación 100%)
                </h4>

                <div className="space-y-3">
                  {report.componentScores.map((compScore, idx) => (
                    <div key={idx} className="space-y-1 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-300 font-medium">
                          {compScore.category} <span className="text-slate-500 font-mono text-[10px]">({compScore.weight}%)</span>
                        </span>
                        <span className={`font-mono font-bold ${
                          compScore.score >= 80 ? 'text-emerald-400' : compScore.score >= 50 ? 'text-amber-400' : 'text-red-400'
                        }`}>
                          {compScore.score}%
                        </span>
                      </div>

                      <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                        <div 
                          className={`h-full rounded-full transition-all duration-700 ${
                            compScore.score >= 80 ? 'bg-emerald-500' : compScore.score >= 50 ? 'bg-amber-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${compScore.score}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-slate-500">{compScore.notes}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Missing sections alert box */}
              {report.missingSections.length > 0 && (
                <div className="p-5 rounded-2xl bg-red-500/10 border border-red-500/30 space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-red-400 font-bold">
                    <XCircle className="w-4 h-4 shrink-0" />
                    <span>Secciones Obligatorias No Identificadas o Faltantes:</span>
                  </div>
                  <ul className="list-disc pl-5 text-red-300 space-y-1">
                    {report.missingSections.map((sec, idx) => (
                      <li key={idx}><strong>{sec}</strong></li>
                    ))}
                  </ul>
                </div>
              )}

            </div>
          )}

          {/* TAB 2: MATRIZ DE HALLAZGOS POR SECCIÓN */}
          {activeTab === 'MATRIZ_HALLAZGOS' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-950 text-slate-300 font-bold border-b border-slate-800 uppercase text-[11px]">
                    <tr>
                      <th className="p-3 w-44">Capítulo RM 089</th>
                      <th className="p-3 w-32">Estado</th>
                      <th className="p-3">Hallazgos Identificados</th>
                      <th className="p-3">Contenido Encontrado</th>
                      <th className="p-3">Severidad</th>
                      <th className="p-3">Recomendación de Subsanación</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {report.sectionsEvaluated.map((sec) => (
                      <tr key={sec.sectionNumber} className="hover:bg-slate-800/40">
                        <td className="p-3 font-semibold text-white">
                          Capítulo {sec.sectionNumber} <br />
                          <span className="text-[10px] text-slate-400">{sec.sectionTitle}</span>
                        </td>
                        <td className="p-3">
                          <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                            sec.status === 'CUMPLE' 
                              ? 'bg-emerald-500/20 text-emerald-400' 
                              : sec.status === 'CUMPLE_PARCIALMENTE'
                              ? 'bg-amber-500/20 text-amber-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}>
                            {sec.status.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="p-3 text-[11px] leading-relaxed text-slate-200">
                          {sec.findings}
                        </td>
                        <td className="p-3 text-[11px] text-slate-400 italic">
                          {sec.foundContent}
                        </td>
                        <td className="p-3">
                          <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                            sec.severity === 'CRITICA' ? 'text-red-400 bg-red-500/10' : sec.severity === 'MAYOR' ? 'text-amber-400 bg-amber-500/10' : 'text-slate-400'
                          }`}>
                            {sec.severity}
                          </span>
                        </td>
                        <td className="p-3 text-[11px] text-cyan-300">
                          {sec.recommendations}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: CONTENIDO GENÉRICO DETECTADO */}
          {activeTab === 'GENERICOS' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md space-y-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Detección de Frases Genéricas no Trazables ({report.genericContentAlerts.length})
                </h3>
              </div>
              <p className="text-xs text-slate-400">
                La fiscalización ambiental de OEFA objeta sistemáticamente redacciones imprecisas. 
                Cada una de las siguientes expresiones debe ser reemplazada con datos verificables.
              </p>

              <div className="space-y-3 text-xs">
                {report.genericContentAlerts.map((alertText, idx) => (
                  <div key={idx} className="p-3.5 bg-slate-950 rounded-xl border border-amber-500/30 text-amber-300 flex items-start gap-2.5">
                    <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold">{alertText}</span>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Sustituir por: Quién realiza la acción, con qué número de registro autoritativo EO-RS ante el MINAM, cuál es la infraestructura de destino y qué documento acredita la recepción (manifiesto/constancia).
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: INCONSISTENCIAS CUANTITATIVAS */}
          {activeTab === 'INCONSISTENCIAS' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md space-y-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Inconsistencias Cuantitativas Entre Secciones ({report.inconsistencies.length})
                </h3>
              </div>
              <p className="text-xs text-slate-400">
                El sistema detecta discrepancias de valores entre la estimación inicial (Cap. 4), las operaciones de manejo (Cap. 6) o el presupuesto (Cap. 11).
              </p>

              {report.inconsistencies.length === 0 ? (
                <div className="py-8 text-center text-emerald-400 font-semibold text-xs">
                  ✓ No se detectaron inconsistencias numéricas entre las secciones revisadas.
                </div>
              ) : (
                <div className="space-y-3">
                  {report.inconsistencies.map((inc) => (
                    <div key={inc.id} className="p-4 bg-slate-950 rounded-xl border border-red-500/40 text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <strong className="text-white text-sm">{inc.residue}</strong>
                        <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-red-500/20 text-red-400">
                          SEVERIDAD: {inc.severity}
                        </span>
                      </div>
                      <p className="text-slate-300">{inc.description}</p>
                      <div className="grid grid-cols-2 gap-3 p-2.5 bg-slate-900 rounded-lg border border-slate-800 text-[11px]">
                        <div>
                          <span className="text-slate-400">{inc.sectionA}:</span> <br />
                          <strong className="text-cyan-300 font-mono">{inc.valueA}</strong>
                        </div>
                        <div>
                          <span className="text-slate-400">{inc.sectionB}:</span> <br />
                          <strong className="text-amber-300 font-mono">{inc.valueB}</strong>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: INFORME TÉCNICO FORMAL PRINTABLE */}
          {activeTab === 'INFORME_FINAL' && (
            <div 
              id="review-report-printable"
              className="bg-white text-slate-900 rounded-2xl p-8 sm:p-12 shadow-2xl border border-slate-200 space-y-6 text-xs"
            >
              <div className="text-center border-b pb-6 space-y-2">
                <div className="flex flex-col items-center justify-center mb-2 gap-1.5">
                  <GryphosLogo size="lg" withGlow={true} withBorder={true} />
                  <span className="text-xs uppercase font-extrabold text-amber-700 tracking-widest font-serif">
                    CASA GRYPHOS
                  </span>
                </div>
                <span className="text-xs uppercase font-extrabold text-purple-900 tracking-wider">
                  AUDITORÍA Y CONTROL AMBIENTAL • CONFORMIDAD RM 089-2023-MINAM
                </span>
                <h2 className="text-xl font-black text-slate-900 uppercase">
                  INFORME TÉCNICO DE REVISIÓN Y FISCALIZACIÓN DEL PMMRS
                </h2>
                <p className="text-xs text-slate-500">
                  Evaluación de Conformidad con la Resolución Ministerial N.° 089-2023-MINAM y Decreto Legislativo N.° 1278
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <p><strong>Empresa Evaluada:</strong> {report.companyName}</p>
                  <p><strong>Documento Analizado:</strong> {report.fileName}</p>
                  <p><strong>Fecha de Evaluación:</strong> {new Date(report.uploadDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p><strong>Puntaje Técnico Global:</strong> <span className="font-mono font-bold text-sm text-teal-800">{report.overallScore} / 100%</span></p>
                  <p><strong>Secciones No Cumplidas:</strong> {report.missingSections.length}</p>
                  <p><strong>Observaciones Críticas:</strong> {report.inconsistencies.length + report.genericContentAlerts.length}</p>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-slate-900 text-sm border-b pb-1">1. Resumen Ejecutivo de la Auditoría</h3>
                <p className="text-slate-700 leading-relaxed text-justify">{report.executiveSummary}</p>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-slate-900 text-sm border-b pb-1">2. Recomendaciones Prioritarias para Subsanación</h3>
                <ol className="list-decimal pl-5 space-y-1 text-slate-700">
                  {report.finalRecommendations.map((rec, idx) => (
                    <li key={idx}>{rec}</li>
                  ))}
                </ol>
              </div>

              <div className="pt-8 text-center text-slate-500 border-t border-slate-200">
                <p className="font-bold text-slate-800">CASA GRYPHOS CONSULTORÍA AMBIENTAL</p>
                <p className="text-[10px]">Emitido en plataforma digital de control normativo PMMRS - Septiembre 2026</p>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
