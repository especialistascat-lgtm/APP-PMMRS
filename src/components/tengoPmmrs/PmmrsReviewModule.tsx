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

interface PmmrsReviewModuleProps {
  onBackToHome: () => void;
}

export const PmmrsReviewModule: React.FC<PmmrsReviewModuleProps> = ({
  onBackToHome
}) => {
  const [documentText, setDocumentText] = useState<string>('');
  const [fileName, setFileName] = useState<string>('PMMRS_Empresa.pdf');
  const [companyName, setCompanyName] = useState<string>('Empresa Evaluada');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [report, setReport] = useState<PmmrsReviewReport | null>(null);
  const [activeTab, setActiveTab] = useState<'RESUMEN' | 'MATRIZ_HALLAZGOS' | 'GENERICOS' | 'INCONSISTENCIAS' | 'INFORME_FINAL'>('RESUMEN');

  // Load sample flawed document to demonstrate the audit capability
  const handleLoadSampleDocument = () => {
    setDocumentText(SAMPLE_PMMRS_DOCUMENT_TEXT);
    setFileName('PMMRS_Constructora_El_Progreso_2024.pdf');
    setCompanyName('CONSTRUCTORA EL PROGRESO DEL SUR S.A.C.');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setDocumentText(text || '');
    };
    reader.readAsText(file);
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
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Upload className="w-4 h-4 text-cyan-400" />
                Cargar Archivo o Pegar Contenido del PMMRS
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Formatos compatibles: Texto plano, PDF/DOCX (extraer contenido) o probar con documento muestra.
              </p>
            </div>

            <button
              type="button"
              onClick={handleLoadSampleDocument}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-700/60 text-xs font-bold transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Cargar Documento Muestra con Observaciones</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Nombre de la Empresa o Proyecto Evaluado</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Ej: Constructora El Progreso del Sur S.A.C."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Cargar Archivo (PDF, DOCX o TXT)</label>
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  accept=".pdf,.docx,.txt"
                  onChange={handleFileUpload}
                  className="w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-slate-200 hover:file:bg-slate-700 cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5 text-xs">
              <label className="font-semibold text-slate-300">Contenido del Documento PMMRS para Análisis:</label>
              <span className="font-mono text-slate-500 text-[11px]">{documentText.length} caracteres</span>
            </div>
            <textarea
              rows={12}
              value={documentText}
              onChange={(e) => setDocumentText(e.target.value)}
              placeholder="Pegue aquí el texto completo del Plan de Minimización y Manejo de Residuos Sólidos a evaluar..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white text-xs font-mono placeholder-slate-600 focus:outline-none focus:border-cyan-500 leading-relaxed"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleRunAnalysis}
              disabled={isAnalyzing || !documentText.trim()}
              className={`flex items-center gap-2 px-7 py-3 rounded-xl font-bold text-xs shadow-xl transition-all cursor-pointer ${
                isAnalyzing || !documentText.trim()
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-cyan-600/30'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Auditando capítulos y trazabilidad...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
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
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase font-bold text-cyan-400 tracking-wider">
                    Resultado de Evaluación Técnica
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                    {report.fileName}
                  </span>
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
