import React, { useState } from 'react';
import { 
  FileDown, 
  Printer, 
  ArrowLeft, 
  CheckCircle2, 
  Building2, 
  Calendar, 
  FileText, 
  Download, 
  Layers,
  Sparkles,
  Share2
} from 'lucide-react';
import { PmmrsProject } from '../../types';
import { RM_089_CHAPTERS } from '../../data/normativeCatalog';
import { GryphosLogo } from '../GryphosLogo';

interface PmmrsDocumentViewProps {
  project: PmmrsProject;
  onBack: () => void;
}

export const PmmrsDocumentView: React.FC<PmmrsDocumentViewProps> = ({
  project,
  onBack
}) => {
  const comp = project.company;
  const wastes = project.wastes;
  const measures = project.minimizationMeasures;
  const storage = project.storageAreas;
  const indicators = project.indicators;

  const totalMonthlyKg = wastes.reduce((acc, w) => acc + (w.quantity || 0), 0);
  const hazardousCount = wastes.filter((w) => w.isHazardous).length;
  const nonHazardousCount = wastes.filter((w) => !w.isHazardous).length;

  const handlePrint = () => {
    window.print();
  };

  // Export as Word-compatible HTML Document (.doc)
  const handleExportWord = () => {
    const content = document.getElementById('pmmrs-printable-doc')?.innerHTML;
    if (!content) return;

    const header = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' 
            xmlns:w='urn:schemas-microsoft-com:office:word' 
            xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>PMMRS_${comp.businessName}</title>
        <style>
          body { font-family: 'Calibri', 'Arial', sans-serif; font-size: 11pt; color: #1e293b; line-height: 1.5; }
          h1 { font-size: 18pt; color: #065f46; text-align: center; font-weight: bold; }
          h2 { font-size: 14pt; color: #047857; border-bottom: 1px solid #10b981; padding-bottom: 4px; margin-top: 20px; }
          h3 { font-size: 12pt; color: #0f172a; margin-top: 14px; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; margin-bottom: 15px; }
          th, td { border: 1px solid #cbd5e1; padding: 6px 8px; font-size: 9.5pt; text-align: left; }
          th { background-color: #f1f5f9; color: #0f172a; font-weight: bold; }
          .cover { text-align: center; padding: 100px 20px; }
          .page-break { page-break-after: always; }
          .tag { font-size: 8pt; font-weight: bold; padding: 2px 6px; background-color: #e2e8f0; }
        </style>
      </head>
      <body>
        ${content}
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff', header], {
      type: 'application/msword;charset=utf-8'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `PMMRS_${comp.businessName.substring(0, 20).replace(/[^a-zA-Z0-9]/g, '_')}_v1.0.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      
      {/* Action Toolbar (Hidden in print) */}
      <div className="no-print bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-wrap items-center justify-between gap-4 sticky top-20 z-30 backdrop-blur bg-slate-900/95">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs border border-slate-700 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al Asistente</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportWord}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Descargar en Word (.doc)</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir / Guardar como PDF</span>
          </button>
        </div>
      </div>

      {/* Main Printable Document Canvas */}
      <div 
        id="pmmrs-printable-doc"
        className="bg-white text-slate-900 rounded-2xl p-8 sm:p-14 shadow-2xl space-y-10 border border-slate-200"
      >
        
        {/* PORTADA FORMAL */}
        <div className="text-center py-12 border-b-2 border-purple-900 space-y-6">
          <div className="flex flex-col items-center justify-center mb-4 gap-2">
            <GryphosLogo size="xl" withGlow={true} withBorder={true} />
            <span className="text-xs font-black tracking-widest text-amber-700 uppercase font-serif">
              CASA GRYPHOS
            </span>
          </div>

          <div className="space-y-2">
            <span className="text-xs uppercase font-extrabold tracking-widest text-purple-900">
              REPÚBLICA DEL PERÚ • MINISTERIO DEL AMBIENTE (MINAM)
            </span>
            <p className="text-xs text-slate-500 uppercase font-semibold">
              Conforme a la Resolución Ministerial N.° 089-2023-MINAM y Decreto Legislativo N.° 1278
            </p>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight max-w-2xl mx-auto uppercase leading-snug">
            PLAN DE MINIMIZACIÓN Y MANEJO DE RESIDUOS SÓLIDOS NO MUNICIPALES (PMMRS)
          </h1>

          <div className="pt-6 max-w-lg mx-auto bg-slate-50 p-6 rounded-2xl border border-slate-200 text-left text-xs space-y-2">
            <p><strong className="text-slate-900">Razón Social:</strong> {comp.businessName}</p>
            <p><strong className="text-slate-900">R.U.C.:</strong> <span className="font-mono">{comp.ruc || '20554433221'}</span></p>
            <p><strong className="text-slate-900">Unidad / Planta:</strong> {comp.facilityName}</p>
            <p><strong className="text-slate-900">Ubicación:</strong> {comp.address}, {comp.district}, {comp.province}, {comp.department}</p>
            <p><strong className="text-slate-900">Actividad Principal:</strong> {comp.mainActivity || 'Actividad Industrial / Extractiva / de Servicios'}</p>
            <p><strong className="text-slate-900">Instrumento de Gestión Ambiental:</strong> {comp.hasIga ? `${comp.igaType} (${comp.igaResolutionNumber || 'Resolución pendiente'})` : 'No sujeto al SEIA'}</p>
            <p><strong className="text-slate-900">Responsable Técnico:</strong> {comp.contactPerson} ({comp.contactRole})</p>
            <p><strong className="text-slate-900">Fecha de Emisión:</strong> {new Date().toLocaleDateString('es-PE', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p><strong className="text-slate-900">Versión:</strong> {project.version} - Aprobada</p>
          </div>
        </div>

        {/* CONTROL DE CAMBIOS */}
        <div className="space-y-2 text-xs">
          <h3 className="font-bold text-slate-900 uppercase tracking-wider text-xs">Control de Cambios y Versiones</h3>
          <table className="w-full border-collapse border border-slate-300">
            <thead>
              <tr className="bg-slate-100 font-bold text-slate-800">
                <th className="border p-2">Versión</th>
                <th className="border p-2">Fecha</th>
                <th className="border p-2">Descripción del Cambio</th>
                <th className="border p-2">Elaboró</th>
                <th className="border p-2">Revisó / Aprobó</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2 font-mono">{project.version}</td>
                <td className="border p-2">{new Date().toLocaleDateString()}</td>
                <td className="border p-2">Estructuración inicial integral bajo RM 089-2023-MINAM</td>
                <td className="border p-2">{comp.contactPerson || 'Consultor Ambiental'}</td>
                <td className="border p-2">Gerencia General / SSOMA</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ÍNDICE */}
        <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
          <h3 className="font-bold text-slate-900 uppercase tracking-wider text-xs mb-3">Índice del Contenido Mínimo (RM 089-2023-MINAM)</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-slate-700">
            {RM_089_CHAPTERS.map(ch => (
              <div key={ch.number} className="flex justify-between border-b border-dotted border-slate-300 py-0.5">
                <span>{ch.number}. {ch.title}</span>
                <span className="font-mono text-slate-400">Pág. {ch.number + 1}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="page-break-after" />

        {/* CAPÍTULO 1: PRESENTACIÓN */}
        <section className="space-y-3">
          <h2 className="text-base font-black text-emerald-800 border-b pb-1">
            1. Presentación / Introducción
          </h2>
          <p className="text-xs text-slate-700 leading-relaxed text-justify">
            El presente Plan de Minimización y Manejo de Residuos Sólidos No Municipales (PMMRS) corresponde a la empresa <strong>{comp.businessName}</strong>, con RUC <strong>{comp.ruc}</strong>, para las instalaciones de la unidad <strong>{comp.facilityName}</strong>, ubicada en {comp.address}, {comp.district}, {comp.province}, {comp.department}.
          </p>
          <p className="text-xs text-slate-700 leading-relaxed text-justify">
            La actividad desarrollada corresponde a "{comp.mainActivity}". La gestión ambiental de la organización se enmarca en la Ley de Gestión Integral de Residuos Sólidos (Decreto Legislativo N.° 1278, su modificatoria Ley N.° 32212) y su Reglamento aprobado mediante Decreto Supremo N.° 014-2017-MINAM (modificado por D.S. N.° 001-2022-MINAM). Este documento ha sido estructurado en estricto cumplimiento del Contenido Mínimo aprobado por la <strong>Resolución Ministerial N.° 089-2023-MINAM</strong>.
          </p>
          <p className="text-xs text-slate-700 leading-relaxed text-justify">
            La empresa rompe con el paradigma de la economía lineal a través de estrategias de prevención en el origen, ecoeficiencia y selección rigurosa de insumos y embalajes retornables, asegurando que los residuos generados sean preferentemente valorizados antes de recurrir a la disposición final.
          </p>
        </section>

        {/* CAPÍTULO 2: OBJETIVO */}
        <section className="space-y-3">
          <h2 className="text-base font-black text-emerald-800 border-b pb-1">
            2. Objetivos
          </h2>
          <div className="text-xs text-slate-700 space-y-2">
            <p><strong>2.1 Objetivo Principal:</strong> Prevenir y minimizar la generación de residuos sólidos no municipales en la fuente de generación, y asegurar su gestión y manejo integral ambiental y sanitariamente adecuado, priorizando sistemáticamente su valorización material y energética frente a su disposición final en infraestructuras autorizadas.</p>
            <p><strong>2.2 Objetivos Específicos:</strong></p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Implementar técnicas de producción más limpia y sustitución de insumos para reducir el volumen y peligrosidad de los residuos.</li>
              <li>Segregar en origen el 100% de los residuos generados, adoptando el código de colores de la Norma Técnica Peruana NTP 900.058:2019.</li>
              <li>Garantizar el almacenamiento temporal seguro en áreas acondicionadas con coordenadas UTM WGS 84, impermeabilización y contención estanca.</li>
              <li>Asegurar el transporte externo y la disposición final únicamente a través de Empresas Operadoras de Residuos Sólidos (EO-RS) autorizadas por el MINAM.</li>
              <li>Conducir el registro interno de generación y reporte anual ante la plataforma SIGERSOL No Municipal.</li>
            </ul>
          </div>
        </section>

        {/* CAPÍTULO 3: ALCANCE */}
        <section className="space-y-3">
          <h2 className="text-base font-black text-emerald-800 border-b pb-1">
            3. Alcance
          </h2>
          <p className="text-xs text-slate-700 leading-relaxed text-justify">
            El presente PMMRS es de aplicación obligatoria en todas las áreas de la unidad <strong>{comp.facilityName}</strong>, abarcando tanto áreas operativas como administrativas, talleres, almacenes y servicios auxiliares.
          </p>
          <p className="text-xs text-slate-700 leading-relaxed text-justify">
            El plan abarca las etapas de: <strong>{comp.activeStages.join(', ')}</strong>. Su observancia es de <strong>carácter obligatorio</strong> para todo el personal propio, trabajadores de contratistas, subcontratistas, proveedores de bienes y servicios, así como para visitantes que ingresen a las instalaciones.
          </p>
        </section>

        {/* CAPÍTULO 4: IDENTIFICACIÓN Y ESTIMACIÓN */}
        <section className="space-y-4">
          <h2 className="text-base font-black text-emerald-800 border-b pb-1">
            4. Identificación, Características y Estimación de Residuos Sólidos
          </h2>
          <p className="text-xs text-slate-700">
            A continuación se presenta la matriz detallada de corrientes de residuos identificadas a partir del flujograma de procesos de la actividad (Anexos 3 y 7 de la RM 089):
          </p>

          <table className="w-full border-collapse border border-slate-300 text-[10px]">
            <thead>
              <tr className="bg-slate-100 font-bold text-slate-900">
                <th className="border p-2">Área / Proceso</th>
                <th className="border p-2">Residuo Sólido</th>
                <th className="border p-2">Peligrosidad</th>
                <th className="border p-2">Cód. Basilea</th>
                <th className="border p-2">Cantidad Mensual</th>
                <th className="border p-2">Método de Estimación</th>
                <th className="border p-2">Fuente de Datos</th>
              </tr>
            </thead>
            <tbody>
              {wastes.map((w) => (
                <tr key={w.id}>
                  <td className="border p-2"><strong>{w.area}</strong><br /><span className="text-slate-500">{w.process}</span></td>
                  <td className="border p-2 font-semibold">{w.wasteName}</td>
                  <td className="border p-2">
                    <span className={`px-1.5 py-0.5 rounded font-bold ${
                      w.isHazardous ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-800'
                    }`}>
                      {w.isHazardous ? 'Peligroso' : 'No Peligroso'}
                    </span>
                  </td>
                  <td className="border p-2 font-mono">{w.baselCode || '-'}</td>
                  <td className="border p-2 font-mono font-bold">{w.quantity} {w.unit}</td>
                  <td className="border p-2">{w.measurementMethod.replace(/_/g, ' ')}</td>
                  <td className="border p-2 text-slate-600">{w.dataSource}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-slate-50 font-bold">
                <td colSpan={4} className="border p-2 text-right">Generación Mensual Estimada (Gm = ∑ Gi):</td>
                <td className="border p-2 font-mono text-emerald-800 font-black">{totalMonthlyKg.toLocaleString()} kg/mes aprox</td>
                <td colSpan={2} className="border p-2 font-normal text-slate-500">{hazardousCount} Peligrosos / {nonHazardousCount} No Peligrosos</td>
              </tr>
            </tfoot>
          </table>
        </section>

        {/* CAPÍTULO 5: MINIMIZACIÓN */}
        <section className="space-y-4">
          <h2 className="text-base font-black text-emerald-800 border-b pb-1">
            5. Estrategias para la Prevención y/o Minimización
          </h2>
          <p className="text-xs text-slate-700">
            De conformidad con el primer eslabón de la jerarquía de residuos (Anexo 8), la empresa adopta medidas de ecoeficiencia, compras sostenibles y sustitución de materias primas para evitar la generación en origen:
          </p>

          <div className="space-y-3">
            {measures.map((m, idx) => (
              <div key={m.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
                <div className="flex justify-between items-center font-bold text-slate-900">
                  <span>5.{idx + 1}. Medida: {m.measureName}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    Nivel: {m.hierarchyLevel.replace(/_/g, ' ')}
                  </span>
                </div>
                <p><strong>Residuo Intervenido:</strong> {m.wasteName} (Proceso: {m.sourceProcess})</p>
                <p><strong>Causa Raíz Identificada:</strong> {m.problemStatement}</p>
                <p><strong>Acción Concreta:</strong> {m.detailedAction}</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-semibold text-[11px] text-slate-700">
                  <div>Línea Base: {m.baseline}</div>
                  <div>Meta: <span className="text-emerald-700 font-bold">{m.targetGoal}</span></div>
                  <div>Costo: S/ {m.estimatedCostPen.toLocaleString()} ({m.capexOpex})</div>
                  <div>Responsable: {m.responsibleRole}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Bienes Priorizados RAEE/NFU */}
          {project.priorityGoods.length > 0 && (
            <div className="pt-3 space-y-2 text-xs">
              <h3 className="font-bold text-slate-900">5.3. Régimen Especial de Bienes Priorizados (Anexo N.° 4)</h3>
              <table className="w-full border-collapse border border-slate-300 text-[10px]">
                <thead>
                  <tr className="bg-slate-100 font-bold">
                    <th className="border p-2">Bien Priorizado</th>
                    <th className="border p-2">Régimen</th>
                    <th className="border p-2">Categoría</th>
                    <th className="border p-2">Unidades/año</th>
                    <th className="border p-2">Masa Estimada (kg)</th>
                    <th className="border p-2">Sistema Colectivo / Destino</th>
                  </tr>
                </thead>
                <tbody>
                  {project.priorityGoods.map(pg => (
                    <tr key={pg.id}>
                      <td className="border p-2 font-semibold">{pg.goodDescription}</td>
                      <td className="border p-2 font-bold text-amber-800">{pg.regime}</td>
                      <td className="border p-2">{pg.category}</td>
                      <td className="border p-2 font-mono">{pg.unitsPerYear}</td>
                      <td className="border p-2 font-mono">{pg.massKgPerYear} kg</td>
                      <td className="border p-2">{pg.authorizedCollectorOrSystem}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* CAPÍTULO 6: GESTIÓN Y MANEJO */}
        <section className="space-y-4">
          <h2 className="text-base font-black text-emerald-800 border-b pb-1">
            6. Gestión y Manejo de Residuos Sólidos (Operaciones Art. 32 LGIRS)
          </h2>
          <p className="text-xs text-slate-700 text-justify">
            <strong>6.1 Segregación:</strong> Se implementa en cada frente de generación utilizando el código de colores de la <strong>NTP 900.058:2019</strong>. Para residuos peligrosos se utiliza el color Rojo; para papel y cartón, Azul; para plásticos, Blanco; para metales, Amarillo; y para no aprovechables, Negro.
          </p>

          <p className="text-xs text-slate-700">
            <strong>6.2 Almacenamiento Central y Coordenadas UTM WGS 84:</strong>
          </p>

          <table className="w-full border-collapse border border-slate-300 text-[10px]">
            <thead>
              <tr className="bg-slate-100 font-bold">
                <th className="border p-2">Nombre del Área</th>
                <th className="border p-2">Tipo</th>
                <th className="border p-2">Coordenadas UTM WGS 84</th>
                <th className="border p-2">Capacidad</th>
                <th className="border p-2">Condiciones Técnicas</th>
                <th className="border p-2">Plazo Máx. Legal</th>
              </tr>
            </thead>
            <tbody>
              {storage.map(s => (
                <tr key={s.id}>
                  <td className="border p-2 font-semibold">{s.name}</td>
                  <td className="border p-2 font-bold">{s.storageType}</td>
                  <td className="border p-2 font-mono text-emerald-900 font-bold">{s.utmCoordinatesWgs84 || 'Pendiente georreferenciación'}</td>
                  <td className="border p-2 font-mono">{s.capacityM3} m3 ({s.dimensionsM2} m2)</td>
                  <td className="border p-2">{s.floorCharacteristics}, {s.roofCharacteristics}</td>
                  <td className="border p-2 font-mono">{s.maxStorageDays} días (≤ 12 meses)</td>
                </tr>
              ))}
            </tbody>
          </table>

          <p className="text-xs text-slate-700 text-justify">
            <strong>6.3 Transporte y Disposición Final Externa:</strong> El traslado de residuos sólidos fuera de las instalaciones se realiza exclusivamente mediante <strong>Empresas Operadoras de Residuos Sólidos (EO-RS)</strong> debidamente inscritas en el Registro Autoritativo del MINAM. La entrega se formaliza mediante Guías de Remisión y Manifiestos de Manejo de Residuos Sólidos Peligrosos (MRSP), los cuales son archivados y custodiados por un periodo mínimo de cinco (05) años para fiscalización del OEFA.
          </p>
        </section>

        {/* CAPÍTULO 7 Y 11: MEDIDAS Y PRESUPUESTO */}
        <section className="space-y-4">
          <h2 className="text-base font-black text-emerald-800 border-b pb-1">
            7 y 11. Medidas Ambientales y Presupuesto de Implementación (Anexo 11)
          </h2>
          <p className="text-xs text-slate-700">
            Resumen integrado de actividades, responsables, plazos e inversión económica anual estimada:
          </p>

          <table className="w-full border-collapse border border-slate-300 text-[10px]">
            <thead>
              <tr className="bg-slate-100 font-bold">
                <th className="border p-2">Medida Ambiental</th>
                <th className="border p-2">Tipo</th>
                <th className="border p-2">Plazo</th>
                <th className="border p-2 text-right">Inversión Total (S/)</th>
                <th className="border p-2">Responsable</th>
              </tr>
            </thead>
            <tbody>
              {measures.map(m => (
                <tr key={m.id}>
                  <td className="border p-2 font-semibold">{m.measureName}</td>
                  <td className="border p-2 font-bold">{m.capexOpex}</td>
                  <td className="border p-2">Mes {m.scheduleMonthStart} a Mes {m.scheduleMonthEnd}</td>
                  <td className="border p-2 text-right font-mono font-bold">S/ {m.estimatedCostPen.toLocaleString()}</td>
                  <td className="border p-2">{m.responsibleRole}</td>
                </tr>
              ))}
              <tr>
                <td className="border p-2 font-semibold">Servicio de Transporte y Disposición EO-RS Autorizada</td>
                <td className="border p-2 font-bold">OPEX</td>
                <td className="border p-2">Mensual continuo</td>
                <td className="border p-2 text-right font-mono font-bold">S/ 11,400</td>
                <td className="border p-2">Logística / SSOMA</td>
              </tr>
              <tr>
                <td className="border p-2 font-semibold">Capacitación, Señalética y Kits de Seguridad</td>
                <td className="border p-2 font-bold">OPEX</td>
                <td className="border p-2">Trimestral</td>
                <td className="border p-2 text-right font-mono font-bold">S/ 4,500</td>
                <td className="border p-2">SSOMA</td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="bg-slate-50 font-black text-xs text-emerald-900">
                <td colSpan={3} className="border p-2 text-right">Presupuesto Anual Total Estimado (inc. IGV):</td>
                <td className="border p-2 text-right font-mono text-sm">
                  S/ {Math.round(
                    (measures.reduce((acc, m) => acc + (m.estimatedCostPen || 0), 0) + 11400 + 4500) * 1.18
                  ).toLocaleString()}
                </td>
                <td className="border p-2"></td>
              </tr>
            </tfoot>
          </table>
        </section>

        {/* CAPÍTULO 8: EMERGENCIAS */}
        <section className="space-y-3">
          <h2 className="text-base font-black text-emerald-800 border-b pb-1">
            8. Medidas de Atención ante Emergencias (Art. 50 D.S. 014-2017-MINAM)
          </h2>
          <p className="text-xs text-slate-700 leading-relaxed text-justify">
            En caso de suscitarse un incidente de derrame, fuga o incendio que involucre residuos sólidos peligrosos, la empresa activará el Plan de Contingencias, informando a la Autoridad Competente y de Fiscalización Ambiental (OEFA) dentro de las <strong>veinticuatro (24) horas siguientes</strong> de ocurrido el hecho, detallando causas, cantidades estimadas y medidas de contención y remediación ejecutadas.
          </p>
        </section>

        {/* CAPÍTULO 9: INDICADORES */}
        <section className="space-y-3">
          <h2 className="text-base font-black text-emerald-800 border-b pb-1">
            9. Indicadores de Seguimiento y Control
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {indicators.map(kpi => (
              <div key={kpi.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                <div className="font-bold text-slate-900">{kpi.name}</div>
                <div className="font-mono text-[10px] text-emerald-800 bg-white p-1 rounded border">Fórmula: {kpi.formula}</div>
                <div className="flex justify-between text-[11px] text-slate-600">
                  <span>Línea Base: {kpi.baseline} {kpi.unit}</span>
                  <span>Meta: <strong>{kpi.target} {kpi.unit}</strong></span>
                  <span>Frecuencia: {kpi.frequency}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CAPÍTULO 12: FUNCIONES DEL RESPONSABLE */}
        <section className="space-y-3">
          <h2 className="text-base font-black text-emerald-800 border-b pb-1">
            12. Funciones del Responsable de la Gestión y Manejo
          </h2>
          <p className="text-xs text-slate-700 text-justify">
            La dirección y supervisión del cumplimiento del PMMRS queda bajo la responsabilidad directa de la <strong>Jefatura de SSOMA / Medio Ambiente ({comp.contactPerson || 'Ingeniero Ambiental Responsable'})</strong>, en articulación con las jefaturas de Operaciones, Logística y Almacén, asumiendo las obligaciones fijadas en el Artículo 48 del Reglamento del D.L. 1278.
          </p>
        </section>

        {/* FIRMAS FORMALES */}
        <div className="pt-12 grid grid-cols-2 gap-12 text-center text-xs text-slate-700 border-t border-slate-300">
          <div className="space-y-2">
            <div className="border-t border-slate-400 w-48 mx-auto pt-2" />
            <p className="font-bold text-slate-900">{comp.contactPerson || 'Responsable Ambiental'}</p>
            <p className="text-[11px] text-slate-500">{comp.contactRole || 'Jefe de SSOMA'}</p>
            <p className="text-[10px] text-slate-400">CIP / Reg. Profesional Ambiental</p>
          </div>

          <div className="space-y-2">
            <div className="border-t border-slate-400 w-48 mx-auto pt-2" />
            <p className="font-bold text-slate-900">{comp.businessName}</p>
            <p className="text-[11px] text-slate-500">Representante Legal</p>
            <p className="text-[10px] text-slate-400">R.U.C. {comp.ruc}</p>
          </div>
        </div>

      </div>

    </div>
  );
};
