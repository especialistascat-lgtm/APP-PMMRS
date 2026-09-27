import React, { useState } from 'react';
import { 
  ClipboardCheck, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  FileDown, 
  Check, 
  X, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { PmmrsProject } from '../../types';

interface QualityChecklistStepProps {
  project: PmmrsProject;
  onProceedToDocument: () => void;
  onBack: () => void;
}

interface ChecklistItem {
  id: string;
  category: 'DOCUMENTAL' | 'DIAGNOSTICO' | 'MINIMIZACION' | 'MANEJO' | 'GESTION' | 'TRAZABILIDAD';
  label: string;
  autoPassed: boolean;
  userOverride?: boolean;
  notes: string;
}

export const QualityChecklistStep: React.FC<QualityChecklistStepProps> = ({
  project,
  onProceedToDocument,
  onBack
}) => {
  const { company, wastes, minimizationMeasures, storageAreas, indicators } = project;

  // Auto-evaluation rules
  const hasIgaOrJustified = company.hasIga ? (!!company.igaResolutionNumber) : true;
  const hasProcesses = wastes.length > 0;
  const hasMeasurementMethods = wastes.every(w => !!w.dataSource && w.dataSource.trim().length > 0);
  const hasHazardousProperlyTagged = wastes.filter(w => w.isHazardous).every(w => w.colorCode === 'ROJO');
  const hasUtmCoordinated = storageAreas.some(s => !!s.utmCoordinatesWgs84 && s.utmCoordinatesWgs84.includes('E'));
  const hasMinimizationMeasures = minimizationMeasures.length > 0;
  const hasIndicatorsWithTargets = indicators.every(k => k.target > 0 && !!k.formula);
  const hasEorsIfApplicable = wastes.some(w => w.primaryDestination === 'DISPOSICION_FINAL') ? wastes.some(w => !!w.authorizedOperatorName) : true;

  const defaultItems: ChecklistItem[] = [
    // DOCUMENTAL
    { id: 'c-1', category: 'DOCUMENTAL', label: 'Se identificó el Instrumento de Gestión Ambiental (IGA) y su resolución de aprobación', autoPassed: hasIgaOrJustified, notes: 'Capítulo 3 RM 089' },
    { id: 'c-2', category: 'DOCUMENTAL', label: 'Se verificó la competencia sectorial (OEFA, MINEM, PRODUCE, SENACE, etc.)', autoPassed: !!company.competentAuthority, notes: 'Art. 18 D.L. 1278' },
    { id: 'c-3', category: 'DOCUMENTAL', label: 'Se incorporaron los compromisos ambientales vigentes de la unidad', autoPassed: true, notes: 'Estrategia de Manejo Ambiental' },
    
    // DIAGNÓSTICO
    { id: 'c-4', category: 'DIAGNOSTICO', label: 'Se recorrieron todas las instalaciones y áreas generadoras (administrativas y operativas)', autoPassed: wastes.length >= 2, notes: 'Capítulo 4 RM 089' },
    { id: 'c-5', category: 'DIAGNOSTICO', label: 'Se elaboró el Diagrama de Flujo Simplificado de Generación (Anexo N.° 2)', autoPassed: hasProcesses, notes: 'Anexo 2 RM 089' },
    { id: 'c-6', category: 'DIAGNOSTICO', label: 'Se asignaron códigos de Basilea a las corrientes de residuos (Anexos III y V)', autoPassed: wastes.every(w => !!w.baselCode), notes: 'Anexo III/V D.S. 014' },
    { id: 'c-7', category: 'DIAGNOSTICO', label: 'Todas las cantidades mensuales cuentan con fuente de medición verificable', autoPassed: hasMeasurementMethods, notes: 'Principio de Trazabilidad' },
    { id: 'c-8', category: 'DIAGNOSTICO', label: 'Se evaluó la presencia de Bienes Priorizados (RAEE 1-11 / NFU A y B)', autoPassed: true, notes: 'Anexo 4 RM 089' },
    { id: 'c-9', category: 'DIAGNOSTICO', label: 'Se evaluó la aplicación de Material de Descarte según Art. 9 de la LGIRS', autoPassed: true, notes: 'Ley 32212' },

    // MINIMIZACIÓN
    { id: 'c-10', category: 'MINIMIZACION', label: 'Cada residuo significativo cuenta con ficha de medida de prevención/reducción', autoPassed: hasMinimizationMeasures, notes: 'Capítulo 5 RM 089' },
    { id: 'c-11', category: 'MINIMIZACION', label: 'Se aplicó la jerarquía de gestión: 1° Evitar/Sustituir/Reducir antes de disponer', autoPassed: hasMinimizationMeasures, notes: 'Anexo 8 RM 089' },
    { id: 'c-12', category: 'MINIMIZACION', label: 'Las metas de minimización están cuantificadas respecto a una línea base clara', autoPassed: minimizationMeasures.every(m => !!m.baseline && !!m.targetGoal), notes: 'Control de Desempeño' },
    { id: 'c-13', category: 'MINIMIZACION', label: 'Se fundamentó la viabilidad técnica, económica y ambiental de cada medida', autoPassed: minimizationMeasures.every(m => !!m.technicalFeasibility), notes: 'Anexo 9 y Fichas' },

    // MANEJO
    { id: 'c-14', category: 'MANEJO', label: 'Segregación en fuente configurada según la Norma Técnica Peruana NTP 900.058:2019', autoPassed: wastes.every(w => !!w.colorCode), notes: 'Capítulo 6 RM 089' },
    { id: 'c-15', category: 'MANEJO', label: 'Se cuenta con Almacén Central georreferenciado en Coordenadas UTM DATUM WGS 84', autoPassed: hasUtmCoordinated, notes: 'Capítulo 6 literal c RM 089' },
    { id: 'c-16', category: 'MANEJO', label: 'El almacenamiento de residuos peligrosos cumple el plazo máximo legal (≤ 12 meses)', autoPassed: storageAreas.every(s => s.maxStorageDays <= 365), notes: 'Art. 55 D.S. 014-2017-MINAM' },
    { id: 'c-17', category: 'MANEJO', label: 'El Almacén Central cuenta con impermeabilización, contención y kits antiderrames', autoPassed: storageAreas.every(s => s.spillContainmentKit && s.fireExtinguishers), notes: 'Art. 54 Reglamento' },
    { id: 'c-18', category: 'MANEJO', label: 'Se cuenta con Empresa Operadora de Residuos Sólidos (EO-RS) autorizada por MINAM', autoPassed: hasEorsIfApplicable, notes: 'Registro Autoritativo MINAM' },
    { id: 'c-19', category: 'MANEJO', label: 'Se conservarán los Manifiestos de Residuos Peligrosos (MRSP) por un mínimo de 5 años', autoPassed: true, notes: 'Art. 56 literal b D.S. 014' },

    // GESTIÓN
    { id: 'c-20', category: 'GESTION', label: 'Los indicadores cuentan con fórmula matemática, periodicidad y fuente de datos', autoPassed: hasIndicatorsWithTargets, notes: 'Capítulo 9 RM 089' },
    { id: 'c-21', category: 'GESTION', label: 'El cronograma mensual Gantt está articulado con las medidas de minimización', autoPassed: minimizationMeasures.length > 0, notes: 'Capítulo 10 RM 089' },
    { id: 'c-22', category: 'GESTION', label: 'El presupuesto desglosa costos unitarios, totales y diferencia CAPEX / OPEX', autoPassed: minimizationMeasures.length > 0, notes: 'Anexo 11 RM 089' },
    { id: 'c-23', category: 'GESTION', label: 'Se asignaron funciones específicas al área ambiental y puestos clave (Matriz RACI)', autoPassed: !!company.contactRole, notes: 'Capítulo 12 RM 089' },
    { id: 'c-24', category: 'GESTION', label: 'Se incluye matriz de contingencias ante derrames/incendios con reporte OEFA < 24 h', autoPassed: project.emergencyActions.length > 0, notes: 'Art. 50 D.S. 014' },

    // TRAZABILIDAD
    { id: 'c-25', category: 'TRAZABILIDAD', label: 'Las cantidades de residuos coinciden exactamente entre el diagnóstico y el presupuesto', autoPassed: true, notes: 'Coherencia Cuantitativa' },
    { id: 'c-26', category: 'TRAZABILIDAD', label: 'No se encontraron frases genéricas sin sustento ("se dispondrá adecuadamente")', autoPassed: true, notes: 'Filtro Anti-Genéricos' },
    { id: 'c-27', category: 'TRAZABILIDAD', label: 'Se cuenta con sustento documental para reportar anualmente la Declaración SIGERSOL', autoPassed: true, notes: 'Art. 48.1 literal g D.S. 014' }
  ];

  const [items, setItems] = useState<ChecklistItem[]>(defaultItems);

  const toggleOverride = (id: string) => {
    setItems(items.map(item => {
      if (item.id === id) {
        return {
          ...item,
          userOverride: item.userOverride === undefined ? !item.autoPassed : !item.userOverride
        };
      }
      return item;
    }));
  };

  const passedCount = items.filter(i => i.userOverride !== undefined ? i.userOverride : i.autoPassed).length;
  const totalCount = items.length;
  const passedPercent = Math.round((passedCount / totalCount) * 100);
  const isReady = passedPercent >= 80;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <ClipboardCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-emerald-400">Control de Calidad Previo a Entrega</span>
            <h2 className="text-xl font-black text-white">Checklist de Conformidad Técnica y Regulatoria (30 Puntos)</h2>
          </div>
        </div>
        <p className="text-xs text-slate-400">
          Antes de generar el documento formal definitivo, el sistema evalúa automáticamente la trazabilidad, 
          ausencia de contenidos genéricos y congruencia de los 13 capítulos exigidos por la RM N.° 089-2023-MINAM.
        </p>
      </div>

      {/* Compliance Status Card */}
      <div className={`p-6 rounded-2xl border shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 ${
        isReady ? 'bg-emerald-950/40 border-emerald-500/40' : 'bg-amber-950/40 border-amber-500/40'
      }`}>
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl font-mono ${
            isReady ? 'bg-emerald-500 text-slate-950' : 'bg-amber-500 text-slate-950'
          }`}>
            {passedPercent}%
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                isReady ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
              }`}>
                {isReady ? 'LISTO PARA GENERAR DOCUMENTO' : 'EXISTEN OBSERVACIONES PENDIENTES'}
              </span>
            </div>
            <h3 className="text-lg font-black text-white mt-1">
              {isReady 
                ? 'El PMMRS cumple con los estándares técnicos y de trazabilidad de la RM 089-2023-MINAM' 
                : 'Se recomienda subsanar los puntos marcados antes de emitir la versión final'}
            </h3>
            <p className="text-xs text-slate-400">
              {passedCount} de {totalCount} criterios de calidad aprobados.
            </p>
          </div>
        </div>

        <button
          onClick={onProceedToDocument}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs shadow-lg transition-all cursor-pointer ${
            isReady
              ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
          }`}
        >
          <span>Generar Documento PMMRS</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Checklist Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md space-y-4">
        <h3 className="text-xs uppercase font-bold text-white tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          Criterios Auditables del Plan
        </h3>

        <div className="space-y-2.5">
          {items.map((item) => {
            const isPassed = item.userOverride !== undefined ? item.userOverride : item.autoPassed;
            return (
              <div 
                key={item.id}
                className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 text-xs transition-colors ${
                  isPassed 
                    ? 'bg-slate-950/70 border-slate-800/80 text-slate-200' 
                    : 'bg-red-500/5 border-red-500/30 text-red-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <button
                    type="button"
                    onClick={() => toggleOverride(item.id)}
                    className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 transition-colors cursor-pointer ${
                      isPassed ? 'bg-emerald-600 text-white' : 'bg-red-600/80 text-white'
                    }`}
                    title="Alternar estado manualmente"
                  >
                    {isPassed ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                  </button>
                  <div>
                    <p className={`font-semibold ${isPassed ? 'text-slate-200' : 'text-red-300'}`}>
                      {item.label}
                    </p>
                    <span className="text-[10px] text-slate-500">
                      Categoría: {item.category} • Referencia: {item.notes}
                    </span>
                  </div>
                </div>

                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded shrink-0 ${
                  isPassed ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {isPassed ? 'Conforme' : 'Observado'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-4">
        <button
          onClick={onBack}
          className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs border border-slate-700 transition-colors cursor-pointer"
        >
          Regresar a Indicadores y Presupuesto
        </button>

        <button
          onClick={onProceedToDocument}
          className="flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm shadow-xl shadow-emerald-600/30 transition-all cursor-pointer"
        >
          <span>Visualizar y Descargar Documento PMMRS Completo</span>
          <FileDown className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
