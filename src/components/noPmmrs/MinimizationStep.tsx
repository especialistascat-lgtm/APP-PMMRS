import React, { useState } from 'react';
import { 
  Sparkles, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingDown, 
  ChevronRight, 
  DollarSign, 
  Clock, 
  ShieldCheck,
  Award,
  Layers
} from 'lucide-react';
import { MinimizationMeasure, WasteItem, HierarchyLevel } from '../../types';

interface MinimizationStepProps {
  wastes: WasteItem[];
  measures: MinimizationMeasure[];
  onUpdateMeasures: (measures: MinimizationMeasure[]) => void;
  onNext: () => void;
  onBack: () => void;
}

const HIERARCHY_OPTIONS: { level: HierarchyLevel; name: string; desc: string; badgeColor: string }[] = [
  { level: '1_EVITAR', name: '1. Evitar / Prevenir', desc: 'Eliminar insumos, empaques o prácticas innecesarias en el diseño o compra', badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' },
  { level: '2_SUSTITUIR', name: '2. Sustituir', desc: 'Cambiar por insumos menos peligrosos, biodegradables o envases retornables', badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/40' },
  { level: '3_REDUCIR', name: '3. Reducir en la Fuente', desc: 'Optimizar dosificación, mantenimiento predictivo, control de mermas y metrados', badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' },
  { level: '4_REUTILIZAR', name: '4. Reutilizar', desc: 'Circuitos cerrados de pallets, tambores limpios o embalajes sin transformación', badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40' },
  { level: '5_VALORIZAR', name: '5. Valorizar (Material/Energética)', desc: 'Reciclaje formal, compostaje orgánico o coprocesamiento con EO-RS autorizada', badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40' },
  { level: '6_TRATAR', name: '6. Tratar', desc: 'Solidificación, neutralización, autoclave o estabilización antes de confinamiento', badgeColor: 'bg-orange-500/20 text-orange-300 border-orange-500/40' },
  { level: '7_DISPONER', name: '7. Disponer Finalmente', desc: 'Última opción técnica justificada: celda de relleno sanitario o seguridad', badgeColor: 'bg-red-500/20 text-red-300 border-red-500/40' }
];

export const MinimizationStep: React.FC<MinimizationStepProps> = ({
  wastes,
  measures,
  onUpdateMeasures,
  onNext,
  onBack
}) => {
  const [selectedWasteId, setSelectedWasteId] = useState<string>(wastes[0]?.id || '');
  const [hierarchyLevel, setHierarchyLevel] = useState<HierarchyLevel>('3_REDUCIR');
  const [measureName, setMeasureName] = useState('');
  const [problemStatement, setProblemStatement] = useState('');
  const [detailedAction, setDetailedAction] = useState('');
  const [baseline, setBaseline] = useState('');
  const [targetGoal, setTargetGoal] = useState('');
  const [indicatorName, setIndicatorName] = useState('');
  const [indicatorFormula, setIndicatorFormula] = useState('');
  const [estimatedCostPen, setEstimatedCostPen] = useState<number>(5000);
  const [capexOpex, setCapexOpex] = useState<'CAPEX' | 'OPEX'>('OPEX');
  const [responsibleRole, setResponsibleRole] = useState('Jefe de SSOMA / Operaciones');

  const selectedWaste = wastes.find((w) => w.id === selectedWasteId);

  const handleAddMeasure = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWaste || !measureName) return;

    const newMeasure: MinimizationMeasure = {
      id: 'm-' + Date.now(),
      wasteId: selectedWaste.id,
      wasteName: selectedWaste.wasteName,
      sourceProcess: selectedWaste.process,
      problemStatement: problemStatement || `Generación recurrente de ${selectedWaste.quantity} ${selectedWaste.unit} en ${selectedWaste.process}`,
      hierarchyLevel,
      measureName,
      detailedAction,
      responsibleRole: responsibleRole || 'Área Ambiental / SSOMA',
      resourcesNeeded: 'Equipamiento, contratos y registros de control',
      baseline: baseline || `${selectedWaste.quantity} ${selectedWaste.unit}`,
      targetGoal: targetGoal || 'Reducción del 20% en 6 meses',
      indicatorName: indicatorName || `Generación específica de ${selectedWaste.wasteName}`,
      indicatorFormula: indicatorFormula || `(kg generados / mes) o % de reducción`,
      frequency: 'MENSUAL',
      verificationEvidence: 'Reportes de pesaje, manifiestos y kardex de almacén',
      estimatedCostPen: Number(estimatedCostPen) || 0,
      scheduleMonthStart: 1,
      scheduleMonthEnd: 6,
      technicalFeasibility: 'Sustentado en optimización de compras y procedimiento operativo estándar.',
      economicFeasibility: 'Inversión recuperable por menor costo de transporte y disposición.',
      environmentalFeasibility: 'Disminución del impacto ambiental y huella de residuos de la empresa.',
      capexOpex
    };

    onUpdateMeasures([...measures, newMeasure]);

    // Reset inputs
    setMeasureName('');
    setProblemStatement('');
    setDetailedAction('');
    setBaseline('');
    setTargetGoal('');
    setIndicatorName('');
    setIndicatorFormula('');
  };

  const handleRemoveMeasure = (id: string) => {
    onUpdateMeasures(measures.filter((m) => m.id !== id));
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* Step Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <TrendingDown className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-emerald-400">Paso 4 de 7</span>
            <h2 className="text-xl font-black text-white">Estrategias y Fichas de Prevención y Minimización (Capítulo 5 RM 089)</h2>
          </div>
        </div>
        <p className="text-xs text-slate-400">
          «El sistema debe evitar que el PMMRS se convierta simplemente en un plan de tachos». 
          Formule para cada residuo una medida con causa raíz, meta cuantificada, fórmula de cálculo, responsable y viabilidad demostrada.
        </p>
      </div>

      {/* Visual Hierarchy of Waste Management (Anexo 8) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-xs uppercase font-bold text-white tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            Principios de la Jerarquía en la Gestión de Residuos (Anexo N.° 8)
          </h3>
          <span className="text-xs text-slate-400">Prioridad descendente</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 text-xs">
          {HIERARCHY_OPTIONS.slice(0, 4).map((h) => (
            <div key={h.level} className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${h.badgeColor}`}>
                {h.name}
              </span>
              <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">{h.desc}</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
          {HIERARCHY_OPTIONS.slice(4).map((h) => (
            <div key={h.level} className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${h.badgeColor}`}>
                {h.name}
              </span>
              <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">{h.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Formulario de Ficha de Minimización */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md space-y-5">
        <h3 className="text-xs uppercase font-bold text-white tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
          <Plus className="w-4 h-4 text-emerald-400" />
          Formular Nueva Ficha de Minimización / Prevención
        </h3>

        <form onSubmit={handleAddMeasure} className="space-y-4 text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Residuo a Intervenir *</label>
              <select
                value={selectedWasteId}
                onChange={(e) => setSelectedWasteId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-semibold"
              >
                {wastes.map((w) => (
                  <option key={w.id} value={w.id} className="bg-slate-900 text-white">
                    {w.wasteName} ({w.quantity} {w.unit} - {w.process})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Nivel Jerárquico Aplicado (Anexo 8) *</label>
              <select
                value={hierarchyLevel}
                onChange={(e) => setHierarchyLevel(e.target.value as HierarchyLevel)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-semibold"
              >
                {HIERARCHY_OPTIONS.map((h) => (
                  <option key={h.level} value={h.level} className="bg-slate-900 text-white">
                    {h.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Nombre de la Medida de Minimización *</label>
            <input
              type="text"
              required
              value={measureName}
              onChange={(e) => setMeasureName(e.target.value)}
              placeholder="Ej: Sustitución de embalajes descartables por gavetas retornables en logística"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Causa Raíz / Problema de Generación *</label>
              <textarea
                rows={2}
                value={problemStatement}
                onChange={(e) => setProblemStatement(e.target.value)}
                placeholder="¿Por qué se genera este residuo? Ej: Compras en pequeños volúmenes sin empaque retornable..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Descripción Detallada de la Acción Propuesta *</label>
              <textarea
                rows={2}
                value={detailedAction}
                onChange={(e) => setDetailedAction(e.target.value)}
                placeholder="¿Qué cambio de proceso, insumo, compra o mantenimiento se ejecutará?"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Línea Base (Cantidad Actual)</label>
              <input
                type="text"
                value={baseline}
                onChange={(e) => setBaseline(e.target.value)}
                placeholder="Ej: 500 kg/mes"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Meta Cuantitativa de Reducción *</label>
              <input
                type="text"
                value={targetGoal}
                onChange={(e) => setTargetGoal(e.target.value)}
                placeholder="Ej: Reducir 25% a 375 kg/mes en 6 meses"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Indicador y Fórmula *</label>
              <input
                type="text"
                value={indicatorFormula}
                onChange={(e) => setIndicatorFormula(e.target.value)}
                placeholder="Ej: % Reducción = (Base - Actual)/Base * 100"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-[11px] placeholder-slate-600 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Presupuesto Estimado (S/ PEN)</label>
              <input
                type="number"
                min="0"
                value={estimatedCostPen}
                onChange={(e) => setEstimatedCostPen(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Tipo de Costo</label>
              <select
                value={capexOpex}
                onChange={(e) => setCapexOpex(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
              >
                <option value="OPEX">OPEX (Gasto Operativo / Servicio)</option>
                <option value="CAPEX">CAPEX (Inversión / Equipamiento)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Responsable de Implementación</label>
              <input
                type="text"
                value={responsibleRole}
                onChange={(e) => setResponsibleRole(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 cursor-pointer transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Guardar Ficha de Minimización</span>
            </button>
          </div>
        </form>
      </div>

      {/* Lista de Fichas de Minimización Existentes */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-xs uppercase font-bold text-white tracking-wider flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-400" />
            Fichas Técnicas de Medidas Aprobadas en el PMMRS ({measures.length})
          </h3>
          <span className="text-xs font-mono text-emerald-400">
            Total Inversión: S/ {measures.reduce((acc, m) => acc + (m.estimatedCostPen || 0), 0).toLocaleString()}
          </span>
        </div>

        {measures.length === 0 ? (
          <div className="py-8 text-center text-slate-500 text-xs">
            No se han registrado medidas de minimización. Complete el formulario arriba para cumplir el Capítulo 5 de la RM 089.
          </div>
        ) : (
          <div className="space-y-4">
            {measures.map((m, idx) => (
              <div 
                key={m.id}
                className="p-5 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition-all space-y-3 text-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/60 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px]">
                      {idx + 1}
                    </span>
                    <h4 className="font-bold text-sm text-white">{m.measureName}</h4>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                      {m.hierarchyLevel.replace('_', ' ')}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveMeasure(m.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                      title="Eliminar medida"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-300">
                  <div>
                    <strong className="text-slate-400">Residuo:</strong> {m.wasteName} <br />
                    <strong className="text-slate-400">Causa:</strong> {m.problemStatement} <br />
                    <strong className="text-slate-400">Acción:</strong> {m.detailedAction}
                  </div>
                  <div>
                    <strong className="text-slate-400">Meta:</strong> <span className="text-emerald-400 font-semibold">{m.targetGoal}</span> (Base: {m.baseline}) <br />
                    <strong className="text-slate-400">Indicador:</strong> <span className="font-mono text-cyan-300">{m.indicatorFormula}</span> <br />
                    <strong className="text-slate-400">Costo:</strong> S/ {m.estimatedCostPen.toLocaleString()} ({m.capexOpex}) • <strong className="text-slate-400">Responsable:</strong> {m.responsibleRole}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Buttons Navigation */}
      <div className="flex items-center justify-between pt-4">
        <button
          onClick={onBack}
          className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs border border-slate-700 transition-colors cursor-pointer"
        >
          Regresar a Matriz de Residuos
        </button>

        <button
          onClick={onNext}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
        >
          <span>Ir a Material de Descarte y Bienes Priorizados</span>
          <CheckCircle2 className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
