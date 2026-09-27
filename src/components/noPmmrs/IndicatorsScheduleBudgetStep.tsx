import React, { useState } from 'react';
import { 
  BarChart3, 
  Calendar, 
  DollarSign, 
  ShieldAlert, 
  Users, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  Calculator,
  ArrowRight
} from 'lucide-react';
import { PmmrsProject, KPIItem, EmergencyAction, MinimizationMeasure } from '../../types';

interface IndicatorsScheduleBudgetStepProps {
  project: PmmrsProject;
  onUpdateProject: (updated: Partial<PmmrsProject>) => void;
  onNext: () => void;
  onBack: () => void;
}

export const IndicatorsScheduleBudgetStep: React.FC<IndicatorsScheduleBudgetStepProps> = ({
  project,
  onUpdateProject,
  onNext,
  onBack
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'INDICADORES' | 'CRONOGRAMA' | 'PRESUPUESTO' | 'EMERGENCIAS' | 'RESPONSABILIDADES'>('INDICADORES');

  // Emergency form
  const [emScenario, setEmScenario] = useState<EmergencyAction['scenario']>('DERRAME_HIDROCARBURO_QUIMICO');
  const [emCause, setEmCause] = useState('');
  const [emWaste, setEmWaste] = useState('');
  const [emBefore, setEmBefore] = useState('');
  const [emDuring, setEmDuring] = useState('');
  const [emAfter, setEmAfter] = useState('');

  const handleAddEmergency = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emCause || !emWaste) return;

    const newAction: EmergencyAction = {
      id: 'em-' + Date.now(),
      scenario: emScenario,
      cause: emCause,
      wasteInvolved: emWaste,
      associatedRisk: 'Contaminación de suelo, riesgo de incendio o afección a la salud del personal',
      preventionBefore: emBefore || 'Inspección previa, almacenamiento con fosa estanca, verificación de EPPs',
      responseDuring: emDuring || 'Detención de fuga, uso de salchichas y paños absorbentes, uso de extintores',
      remediationAfter: emAfter || 'Disposición en bolsas rojas, reporte a OEFA antes de 24 horas según Art. 50 D.S. 014',
      responsibleRole: 'Brigada de Emergencias / Supervisor SSOMA'
    };

    onUpdateProject({ emergencyActions: [...project.emergencyActions, newAction] });
    setEmCause('');
    setEmWaste('');
    setEmBefore('');
    setEmDuring('');
    setEmAfter('');
  };

  // Budget calculations from minimization measures & general operations
  const measuresTotal = project.minimizationMeasures.reduce((acc, m) => acc + (m.estimatedCostPen || 0), 0);
  // Estimate operational logistics & EO-RS (e.g. 12 services a year at S/ 850 average)
  const logisticsEstimatedCost = 12 * 950;
  const trainingAndAuditCost = 4500;
  const subtotalPen = measuresTotal + logisticsEstimatedCost + trainingAndAuditCost;
  const igvPen = Math.round(subtotalPen * 0.18);
  const totalPen = subtotalPen + igvPen;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-emerald-400">Paso 7 de 7</span>
            <h2 className="text-xl font-black text-white">Indicadores, Cronograma Gantt, Presupuesto y Emergencias (Cap. 7 al 12)</h2>
          </div>
        </div>
        <p className="text-xs text-slate-400">
          «Los compromisos deben ser medibles, ejecutables y cuantificables en dinero y tiempo». 
          Asegure la articulación entre las medidas de minimización, sus indicadores de desempeño, el calendario mensual y el costeo CAPEX/OPEX.
        </p>
      </div>

      {/* Sub-tabs Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3 text-xs font-bold">
        <button
          onClick={() => setActiveSubTab('INDICADORES')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeSubTab === 'INDICADORES'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          1. Indicadores de Desempeño ({project.indicators.length})
        </button>

        <button
          onClick={() => setActiveSubTab('CRONOGRAMA')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeSubTab === 'CRONOGRAMA'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          2. Cronograma Gantt Mensual
        </button>

        <button
          onClick={() => setActiveSubTab('PRESUPUESTO')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeSubTab === 'PRESUPUESTO'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          3. Presupuesto CAPEX / OPEX (S/ {totalPen.toLocaleString()})
        </button>

        <button
          onClick={() => setActiveSubTab('EMERGENCIAS')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeSubTab === 'EMERGENCIAS'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          4. Contingencias y Emergencias ({project.emergencyActions.length})
        </button>

        <button
          onClick={() => setActiveSubTab('RESPONSABILIDADES')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeSubTab === 'RESPONSABILIDADES'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          5. Matriz de Responsabilidades RACI
        </button>
      </div>

      {/* SUBTAB 1: INDICADORES */}
      {activeSubTab === 'INDICADORES' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-xs uppercase font-bold text-white tracking-wider flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-emerald-400" />
                Matriz de Indicadores de Seguimiento y Control (Capítulo 9 RM 089)
              </h3>
              <span className="text-xs text-slate-400">Medición con fórmula, línea base y meta</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {project.indicators.map((kpi) => (
                <div key={kpi.id} className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-500/10">
                      {kpi.code}
                    </span>
                    <span className="text-[10px] uppercase font-semibold text-slate-400">
                      Frecuencia: {kpi.frequency}
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-white">{kpi.name}</h4>
                  
                  <div className="p-2 rounded bg-slate-900 font-mono text-[11px] text-cyan-300 border border-slate-800">
                    {kpi.formula}
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-1 text-[11px] border-t border-slate-800/60">
                    <div>
                      <span className="text-slate-500">Línea Base:</span> <br />
                      <strong className="text-slate-200">{kpi.baseline} {kpi.unit}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500">Meta:</span> <br />
                      <strong className="text-emerald-400">{kpi.target} {kpi.unit}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500">Valor Actual:</span> <br />
                      <strong className="text-cyan-400">{kpi.currentValue ?? '-'} {kpi.unit}</strong>
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-400 pt-1">
                    <strong>Fuente:</strong> {kpi.dataSource} • <strong>Responsable:</strong> {kpi.responsibleRole}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: CRONOGRAMA GANTT */}
      {activeSubTab === 'CRONOGRAMA' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-xs uppercase font-bold text-white tracking-wider flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-400" />
              Cronograma de Implementación Mensual (Capítulo 10 RM 089)
            </h3>
            <span className="text-xs text-slate-400">Articulado a medidas y compromisos ambientales</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase">
                  <th className="p-3 w-64">Actividad / Medida</th>
                  <th className="p-3 w-36">Responsable</th>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m) => (
                    <th key={m} className="p-2 text-center font-mono">M{m}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                <tr className="hover:bg-slate-800/40">
                  <td className="p-3 font-semibold text-white">Diagnóstico e inspección de campo</td>
                  <td className="p-3 text-slate-400">SSOMA</td>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m) => (
                    <td key={m} className="p-2 text-center">
                      {m <= 2 && <span className="inline-block w-4 h-4 rounded-full bg-emerald-500/80" />}
                    </td>
                  ))}
                </tr>
                {project.minimizationMeasures.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-800/40">
                    <td className="p-3 font-medium text-slate-200">
                      {m.measureName}
                      <div className="text-[10px] text-slate-500">{m.wasteName}</div>
                    </td>
                    <td className="p-3 text-slate-400">{m.responsibleRole}</td>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((month) => {
                      const isActive = month >= m.scheduleMonthStart && month <= m.scheduleMonthEnd;
                      return (
                        <td key={month} className="p-2 text-center">
                          {isActive && (
                            <span className="inline-block w-4 h-4 rounded bg-cyan-500/70" />
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
                <tr className="hover:bg-slate-800/40">
                  <td className="p-3 font-semibold text-white">Capacitación ambiental al personal y contratistas</td>
                  <td className="p-3 text-slate-400">RRHH / SSOMA</td>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m) => (
                    <td key={m} className="p-2 text-center">
                      {[1, 4, 7, 10].includes(m) && <span className="inline-block w-4 h-4 rounded-full bg-amber-500" />}
                    </td>
                  ))}
                </tr>
                <tr className="hover:bg-slate-800/40">
                  <td className="p-3 font-semibold text-white">Auditoría interna y reporte SIGERSOL Anual</td>
                  <td className="p-3 text-slate-400">Jefe Ambiental</td>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m) => (
                    <td key={m} className="p-2 text-center">
                      {[4, 12].includes(m) && <span className="inline-block w-4 h-4 rounded-full bg-purple-500" />}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBTAB 3: PRESUPUESTO */}
      {activeSubTab === 'PRESUPUESTO' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-xs uppercase font-bold text-white tracking-wider flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              Presupuesto Anual y Recursos Necesarios (Anexo 11 RM 089)
            </h3>
            <span className="text-xs font-mono font-bold text-emerald-400">Moneda: Soles (PEN)</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase">
                  <th className="p-3">Concepto / Partida</th>
                  <th className="p-3">Tipo Gasto</th>
                  <th className="p-3">Unidad</th>
                  <th className="p-3 text-right">Cantidad</th>
                  <th className="p-3 text-right">Costo Unitario (S/)</th>
                  <th className="p-3 text-right">Costo Total (S/)</th>
                  <th className="p-3">Responsable</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {project.minimizationMeasures.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-800/40">
                    <td className="p-3 font-semibold text-white">{m.measureName}</td>
                    <td className="p-3">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                        m.capexOpex === 'CAPEX' ? 'bg-cyan-500/20 text-cyan-300' : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {m.capexOpex}
                      </span>
                    </td>
                    <td className="p-3">Global</td>
                    <td className="p-3 text-right font-mono">1</td>
                    <td className="p-3 text-right font-mono">{m.estimatedCostPen.toLocaleString()}</td>
                    <td className="p-3 text-right font-mono text-white font-bold">{m.estimatedCostPen.toLocaleString()}</td>
                    <td className="p-3 text-slate-400">{m.responsibleRole}</td>
                  </tr>
                ))}
                <tr className="hover:bg-slate-800/40">
                  <td className="p-3 font-semibold text-white">Servicios de Transporte y Disposición EO-RS Autorizada</td>
                  <td className="p-3"><span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-amber-500/20 text-amber-300">OPEX</span></td>
                  <td className="p-3">Servicio Mensual</td>
                  <td className="p-3 text-right font-mono">12</td>
                  <td className="p-3 text-right font-mono">950.00</td>
                  <td className="p-3 text-right font-mono text-white font-bold">{logisticsEstimatedCost.toLocaleString()}</td>
                  <td className="p-3 text-slate-400">Logística / SSOMA</td>
                </tr>
                <tr className="hover:bg-slate-800/40">
                  <td className="p-3 font-semibold text-white">Capacitaciones, Señalética NTP e Inducción Ambiental</td>
                  <td className="p-3"><span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-amber-500/20 text-amber-300">OPEX</span></td>
                  <td className="p-3">Global</td>
                  <td className="p-3 text-right font-mono">1</td>
                  <td className="p-3 text-right font-mono">4,500.00</td>
                  <td className="p-3 text-right font-mono text-white font-bold">{trainingAndAuditCost.toLocaleString()}</td>
                  <td className="p-3 text-slate-400">SSOMA</td>
                </tr>
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-slate-700 font-semibold text-xs text-slate-300">
                  <td colSpan={5} className="p-3 text-right uppercase tracking-wider">Subtotal:</td>
                  <td className="p-3 text-right font-mono text-sm text-white">S/ {subtotalPen.toLocaleString()}</td>
                  <td></td>
                </tr>
                <tr className="text-xs text-slate-400">
                  <td colSpan={5} className="p-2 text-right">I.G.V. (18%):</td>
                  <td className="p-2 text-right font-mono text-sm">S/ {igvPen.toLocaleString()}</td>
                  <td></td>
                </tr>
                <tr className="border-t border-slate-700 font-black text-sm text-emerald-400">
                  <td colSpan={5} className="p-3 text-right uppercase tracking-wider">Presupuesto Total Estimado:</td>
                  <td className="p-3 text-right font-mono text-base text-emerald-400">S/ {totalPen.toLocaleString()}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* SUBTAB 4: EMERGENCIAS */}
      {activeSubTab === 'EMERGENCIAS' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md space-y-4">
            <h3 className="text-xs uppercase font-bold text-white tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
              <ShieldAlert className="w-4 h-4 text-red-400" />
              Agregar Protocolo de Contingencia / Emergencia (Art. 50 Reglamento D.L. 1278)
            </h3>

            <form onSubmit={handleAddEmergency} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Escenario de Emergencia *</label>
                  <select
                    value={emScenario}
                    onChange={(e) => setEmScenario(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="DERRAME_HIDROCARBURO_QUIMICO">Derrame de Aceite / Hidrocarburos / Químicos</option>
                    <option value="INCENDIO">Incendio o Amago de Fuego en Almacén</option>
                    <option value="MEZCLA_INCOMPATIBLE">Reacción por Mezcla Incompatible (Anexo 10)</option>
                    <option value="COLAPSO_CONTENEDOR">Colapso o Volcadura de Contenedor</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Causa Probable *</label>
                  <input
                    type="text"
                    required
                    value={emCause}
                    onChange={(e) => setEmCause(e.target.value)}
                    placeholder="Ej: Falla mecánica de grúa o perforación de cilindro"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Residuo Involucrado *</label>
                  <input
                    type="text"
                    required
                    value={emWaste}
                    onChange={(e) => setEmWaste(e.target.value)}
                    placeholder="Ej: Aceite usado o reactivo corrosivo"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Antes (Prevención)</label>
                  <textarea
                    rows={2}
                    value={emBefore}
                    onChange={(e) => setEmBefore(e.target.value)}
                    placeholder="Medidas preventivas pre-uso e inspecciones..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Durante (Control Inmediato)</label>
                  <textarea
                    rows={2}
                    value={emDuring}
                    onChange={(e) => setEmDuring(e.target.value)}
                    placeholder="Contención con kit absorbente y EPP..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Después (Remediación y Reporte)</label>
                  <textarea
                    rows={2}
                    value={emAfter}
                    onChange={(e) => setEmAfter(e.target.value)}
                    placeholder="Recojo y reporte a OEFA antes de 24 horas..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  className="py-2 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow cursor-pointer transition-colors"
                >
                  + Agregar Escenario de Contingencia
                </button>
              </div>
            </form>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md space-y-3">
            <h4 className="text-xs uppercase font-bold text-white tracking-wider">
              Planes de Emergencia Registrados ({project.emergencyActions.length})
            </h4>

            {project.emergencyActions.map((em) => (
              <div key={em.id} className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-2">
                <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
                  <span className="font-bold text-red-400">{em.scenario.replace(/_/g, ' ')}</span>
                  <span className="text-[11px] text-slate-400">Residuo: <strong className="text-white">{em.wasteInvolved}</strong></span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-slate-300 text-[11px]">
                  <div><strong className="text-slate-400">Antes:</strong> {em.preventionBefore}</div>
                  <div><strong className="text-slate-400">Durante:</strong> {em.responseDuring}</div>
                  <div><strong className="text-slate-400">Después:</strong> {em.remediationAfter}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 5: MATRIZ RACI RESPONSABILIDADES */}
      {activeSubTab === 'RESPONSABILIDADES' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-xs uppercase font-bold text-white tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-400" />
              Matriz RACI y Funciones del Personal (Capítulo 12 RM 089)
            </h3>
            <span className="text-xs text-slate-400">R: Responsable | A: Aprobador | C: Consultado | I: Informado</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase">
                  <th className="p-3">Obligación / Proceso Clave</th>
                  <th className="p-3 text-center">Gerencia</th>
                  <th className="p-3 text-center">SSOMA / Ambiental</th>
                  <th className="p-3 text-center">Operaciones</th>
                  <th className="p-3 text-center">Almacén</th>
                  <th className="p-3 text-center">Compras</th>
                  <th className="p-3 text-center">Contratistas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                <tr className="hover:bg-slate-800/40">
                  <td className="p-3 font-semibold text-white">Implementación del PMMRS</td>
                  <td className="p-3 text-center font-bold text-cyan-400">A</td>
                  <td className="p-3 text-center font-bold text-emerald-400">R</td>
                  <td className="p-3 text-center font-bold text-slate-400">C</td>
                  <td className="p-3 text-center font-bold text-slate-400">C</td>
                  <td className="p-3 text-center font-bold text-slate-400">C</td>
                  <td className="p-3 text-center font-bold text-slate-400">I</td>
                </tr>
                <tr className="hover:bg-slate-800/40">
                  <td className="p-3 font-semibold text-white">Segregación en origen (NTP 900.058:2019)</td>
                  <td className="p-3 text-center font-bold text-slate-500">I</td>
                  <td className="p-3 text-center font-bold text-cyan-400">A</td>
                  <td className="p-3 text-center font-bold text-emerald-400">R</td>
                  <td className="p-3 text-center font-bold text-emerald-400">R</td>
                  <td className="p-3 text-center font-bold text-slate-500">I</td>
                  <td className="p-3 text-center font-bold text-emerald-400">R</td>
                </tr>
                <tr className="hover:bg-slate-800/40">
                  <td className="p-3 font-semibold text-white">Custodia de Manifiestos y Registros Internos (5 años)</td>
                  <td className="p-3 text-center font-bold text-slate-500">I</td>
                  <td className="p-3 text-center font-bold text-emerald-400">R</td>
                  <td className="p-3 text-center font-bold text-slate-500">I</td>
                  <td className="p-3 text-center font-bold text-slate-400">C</td>
                  <td className="p-3 text-center font-bold text-slate-500">I</td>
                  <td className="p-3 text-center font-bold text-slate-400">C</td>
                </tr>
                <tr className="hover:bg-slate-800/40">
                  <td className="p-3 font-semibold text-white">Contratación y validación de registro EO-RS</td>
                  <td className="p-3 text-center font-bold text-cyan-400">A</td>
                  <td className="p-3 text-center font-bold text-emerald-400">R</td>
                  <td className="p-3 text-center font-bold text-slate-500">I</td>
                  <td className="p-3 text-center font-bold text-slate-500">I</td>
                  <td className="p-3 text-center font-bold text-emerald-400">R</td>
                  <td className="p-3 text-center font-bold text-slate-500">I</td>
                </tr>
                <tr className="hover:bg-slate-800/40">
                  <td className="p-3 font-semibold text-white">Reporte oficial SIGERSOL (Declaración Anual)</td>
                  <td className="p-3 text-center font-bold text-cyan-400">A</td>
                  <td className="p-3 text-center font-bold text-emerald-400">R</td>
                  <td className="p-3 text-center font-bold text-slate-500">I</td>
                  <td className="p-3 text-center font-bold text-slate-500">I</td>
                  <td className="p-3 text-center font-bold text-slate-500">I</td>
                  <td className="p-3 text-center font-bold text-slate-500">I</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Buttons Navigation */}
      <div className="flex items-center justify-between pt-4">
        <button
          onClick={onBack}
          className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs border border-slate-700 transition-colors cursor-pointer"
        >
          Regresar a Almacenamiento
        </button>

        <button
          onClick={onNext}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
        >
          <span>Ir al Checklist Final de Calidad</span>
          <CheckCircle2 className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
