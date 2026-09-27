import React from 'react';
import { 
  Building2, 
  Layers, 
  Trash2, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  Recycle, 
  FileCheck2, 
  ArrowRight, 
  ShieldAlert, 
  Calendar, 
  DollarSign, 
  FileSpreadsheet, 
  FileDown,
  Sparkles
} from 'lucide-react';
import { PmmrsProject } from '../types';
import { ProjectStorage } from '../services/projectStorage';
import { RM_089_CHAPTERS } from '../data/normativeCatalog';
import { GryphosLogo } from './GryphosLogo';

interface DashboardProps {
  project: PmmrsProject;
  onNavigateTab: (tab: string, step?: number) => void;
  onExportExcel: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  project,
  onNavigateTab,
  onExportExcel
}) => {
  const metrics = ProjectStorage.calculateProjectMetrics(
    project.wastes,
    project.minimizationMeasures
  );

  // Calculate progress % based on data completed
  let completionPoints = 0;
  if (project.company.businessName && project.company.ruc) completionPoints += 15;
  if (project.company.mainActivity) completionPoints += 10;
  if (project.wastes.length > 0) completionPoints += 25;
  if (project.wastes.some(w => w.measurementMethod && w.dataSource)) completionPoints += 10;
  if (project.minimizationMeasures.length > 0) completionPoints += 15;
  if (project.storageAreas.length > 0) completionPoints += 10;
  if (project.emergencyActions.length > 0) completionPoints += 5;
  if (project.indicators.length > 0) completionPoints += 5;
  if (project.company.hasHazardousWaste ? project.storageAreas.some(s => s.utmCoordinatesWgs84) : true) completionPoints += 5;

  const totalProgress = Math.min(100, completionPoints);

  // System Alerts Engine
  const alerts: { type: 'ROJO' | 'NARANJA' | 'AMARILLO' | 'VERDE'; message: string; actionStep?: number }[] = [];

  // Check critical alerts
  const wastesWithoutDestination = project.wastes.filter(w => !w.primaryDestination);
  if (wastesWithoutDestination.length > 0) {
    alerts.push({
      type: 'ROJO',
      message: `Existe(n) ${wastesWithoutDestination.length} residuo(s) sin destino u operación autorizada asignada.`,
      actionStep: 2
    });
  }

  const hazardousWithoutUtm = project.company.hasHazardousWaste && !project.storageAreas.some(s => s.utmCoordinatesWgs84);
  if (hazardousWithoutUtm) {
    alerts.push({
      type: 'ROJO',
      message: 'Se declaran residuos peligrosos pero no se han registrado las coordenadas UTM WGS84 del Almacén Central (Art. 54 Reglamento).',
      actionStep: 4
    });
  }

  // Check incomplete warnings
  const wastesWithoutMethod = project.wastes.filter(w => !w.dataSource || w.dataSource.trim() === '');
  if (wastesWithoutMethod.length > 0) {
    alerts.push({
      type: 'NARANJA',
      message: `${wastesWithoutMethod.length} residuo(s) no tienen fuente de medición registrada (trazabilidad incompleta).`,
      actionStep: 2
    });
  }

  const hazardousWastes = project.wastes.filter(w => w.isHazardous);
  const hazardousWithoutMeasure = hazardousWastes.filter(
    hw => !project.minimizationMeasures.some(m => m.wasteId === hw.id)
  );
  if (hazardousWithoutMeasure.length > 0) {
    alerts.push({
      type: 'AMARILLO',
      message: `Se detectaron ${hazardousWithoutMeasure.length} residuo(s) peligroso(s) sin ficha de medida de prevención o minimización asociada.`,
      actionStep: 3
    });
  }

  if (alerts.length === 0) {
    alerts.push({
      type: 'VERDE',
      message: 'Todos los datos obligatorios presentan consistencia técnica y trazabilidad normativa.'
    });
  }

  return (
    <div className="space-y-8 py-4">
      
      {/* Top Header Card */}
      <div className="bg-slate-900 border border-purple-900/30 rounded-2xl p-6 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-start sm:items-center gap-4">
          <GryphosLogo size="lg" withGlow={true} withBorder={true} />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase font-extrabold tracking-wider px-2 py-0.5 rounded bg-purple-950/80 text-amber-300 border border-purple-800/50">
                Panel Técnico CASA GRYPHOS
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold border border-slate-700">
                Versión {project.version}
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
                {project.status.replace('_', ' ')}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {project.company.businessName}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              RUC: <span className="font-mono text-slate-200">{project.company.ruc || 'No registrado'}</span> • Sede: {project.company.facilityName} • Sector: {project.company.sector}
            </p>
          </div>
        </div>

        {/* Progress Bar in Card */}
        <div className="lg:w-80 space-y-2 bg-slate-950/70 p-4 rounded-xl border border-slate-800/80">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-300 font-semibold">Avance Global del PMMRS</span>
            <span className="text-emerald-400 font-mono font-bold text-sm">{totalProgress}%</span>
          </div>
          
          <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden p-0.5 border border-slate-700/60">
            <div 
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-700"
              style={{ width: `${totalProgress}%` }}
            />
          </div>

          <div className="flex justify-between text-[11px] text-slate-400">
            <span>{project.wastes.length} residuos mapeados</span>
            <span>{project.minimizationMeasures.length} medidas formuladas</span>
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* Total Residues */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Residuos Mapeados</span>
            <Trash2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white font-mono">{metrics.totalWastes}</span>
            <span className="text-[11px] text-slate-400">corrientes</span>
          </div>
          <div className="mt-2 text-[11px] flex items-center justify-between text-slate-400 border-t border-slate-800/60 pt-1.5">
            <span className="text-red-400 font-semibold">{metrics.hazardousCount} Peligrosos</span>
            <span className="text-slate-300 font-semibold">{metrics.nonHazardousCount} No Peligrosos</span>
          </div>
        </div>

        {/* Monthly Generation */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Generación Mensual</span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-cyan-300 font-mono">
              {metrics.totalMonthlyQuantity.toLocaleString()}
            </span>
            <span className="text-[11px] text-slate-400">kg/mes aprox</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 border-t border-slate-800/60 pt-1.5 flex justify-between">
            <span>Peligrosos:</span>
            <span className="text-red-400 font-mono font-semibold">{metrics.hazardousMonthlyQuantity.toLocaleString()} kg</span>
          </div>
        </div>

        {/* Valorization Rate */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Tasa de Valorización</span>
            <Recycle className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-400 font-mono">
              {metrics.valorizationPercent}%
            </span>
            <span className="text-[11px] text-slate-400">de masa total</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 border-t border-slate-800/60 pt-1.5 flex justify-between">
            <span>En relleno sanitario:</span>
            <span className="text-amber-400 font-mono font-semibold">{metrics.disposalPercent}%</span>
          </div>
        </div>

        {/* Minimization Coverage */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Cobertura Minimización</span>
            <FileCheck2 className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-purple-300 font-mono">
              {metrics.minimizationCoveragePercent}%
            </span>
            <span className="text-[11px] text-slate-400">con ficha activa</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 border-t border-slate-800/60 pt-1.5 flex justify-between">
            <span>Medidas diseñadas:</span>
            <span className="text-purple-400 font-mono font-semibold">{metrics.measuresCount}</span>
          </div>
        </div>

      </div>

      {/* Main Content Grid: Alerts & Quick Navigation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Alertas Técnicas y Semáforo */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">
                  Centro de Alertas de Incumplimiento y Calidad
                </h3>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                {alerts.length} observacione(s)
              </span>
            </div>

            <div className="space-y-3">
              {alerts.map((al, idx) => (
                <div 
                  key={idx} 
                  className={`p-3.5 rounded-xl border flex items-start justify-between gap-3 text-xs ${
                    al.type === 'ROJO'
                      ? 'bg-red-500/10 border-red-500/30 text-red-300'
                      : al.type === 'NARANJA'
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                      : al.type === 'AMARILLO'
                      ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300'
                      : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    {al.type === 'VERDE' ? (
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
                    )}
                    <div>
                      <span className="font-bold mr-1.5 uppercase text-[10px] px-1.5 py-0.5 rounded bg-slate-950/60">
                        {al.type}
                      </span>
                      <span>{al.message}</span>
                    </div>
                  </div>

                  {al.actionStep !== undefined && (
                    <button
                      onClick={() => onNavigateTab('no_pmmrs', al.actionStep)}
                      className="shrink-0 font-bold hover:underline flex items-center gap-1 text-[11px]"
                    >
                      <span>Subsanar</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Chapters Checklist breakdown according to RM 089-2023-MINAM */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-400" />
              Estructura Obligatoria del PMMRS (13 Capítulos RM 089-2023-MINAM)
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Cada capítulo debe estar completamente sustentado sin textos genéricos ni omisiones.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              {RM_089_CHAPTERS.map((ch) => {
                let isReady = false;
                if (ch.number === 1 && project.company.businessName) isReady = true;
                if (ch.number === 2 && project.company.mainActivity) isReady = true;
                if (ch.number === 3 && project.company.activeStages.length > 0) isReady = true;
                if (ch.number === 4 && project.wastes.length > 0) isReady = true;
                if (ch.number === 5 && project.minimizationMeasures.length > 0) isReady = true;
                if (ch.number === 6 && project.storageAreas.length > 0) isReady = true;
                if (ch.number === 7 && project.minimizationMeasures.length > 0) isReady = true;
                if (ch.number === 8 && project.emergencyActions.length > 0) isReady = true;
                if (ch.number === 9 && project.indicators.length > 0) isReady = true;
                if (ch.number === 10 && project.minimizationMeasures.length > 0) isReady = true;
                if (ch.number === 11 && project.minimizationMeasures.length > 0) isReady = true;
                if (ch.number === 12 && project.company.contactRole) isReady = true;
                if (ch.number === 13 && project.wastes.length > 0) isReady = true;

                return (
                  <div 
                    key={ch.number}
                    className={`p-3 rounded-xl border flex items-center justify-between ${
                      isReady 
                        ? 'bg-slate-950/60 border-slate-800 text-slate-200' 
                        : 'bg-slate-950/30 border-dashed border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                        isReady ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {ch.number}
                      </div>
                      <span className="truncate max-w-[200px]">{ch.title}</span>
                    </div>

                    {isReady ? (
                      <span className="text-[10px] font-semibold text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-500/10">Listo</span>
                    ) : (
                      <span className="text-[10px] font-semibold text-amber-400 px-1.5 py-0.5 rounded bg-amber-500/10">Pendiente</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Column: Actions & Quick Modules */}
        <div className="space-y-6">
          
          {/* Quick Actions Card */}
          <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              Acciones de Trabajo
            </h3>

            <div className="space-y-2.5">
              <button
                onClick={() => onNavigateTab('no_pmmrs', 0)}
                className="w-full flex items-center justify-between p-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
              >
                <span>Continuar Elaboración (Módulo 1)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigateTab('tengo_pmmrs')}
                className="w-full flex items-center justify-between p-3.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md shadow-cyan-600/20 transition-all cursor-pointer"
              >
                <span>Auditar PMMRS Existente (Módulo 2)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigateTab('no_pmmrs', 7)}
                className="w-full flex items-center justify-between p-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-all cursor-pointer"
              >
                <span>Ver y Descargar Documento Final</span>
                <FileDown className="w-4 h-4 text-emerald-400" />
              </button>

              <button
                onClick={onExportExcel}
                className="w-full flex items-center justify-between p-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-all cursor-pointer"
              >
                <span>Exportar Matriz a Excel (.xlsx)</span>
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              </button>
            </div>
          </div>

          {/* Audit History Snippet */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              Bitácora de Trazabilidad y Cambios
            </h3>

            <div className="space-y-3 text-xs">
              {(project.auditLog || []).slice(0, 4).map((entry) => (
                <div key={entry.id} className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-semibold text-emerald-400">{entry.userName}</span>
                    <span className="font-mono">{new Date(entry.timestamp).toLocaleDateString()}</span>
                  </div>
                  <p className="font-medium text-slate-200">{entry.action}</p>
                  {entry.notes && (
                    <p className="text-[11px] text-slate-400 italic">{entry.notes}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
