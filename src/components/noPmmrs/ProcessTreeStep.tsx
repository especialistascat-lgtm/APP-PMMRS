import React, { useState } from 'react';
import { GitBranch, Plus, ArrowRight, Layers, Trash2, CheckCircle2, ChevronRight, CornerDownRight, Box, Pencil, X, Check } from 'lucide-react';
import { PmmrsProject, WasteItem, StageType, ColorBinNTP } from '../../types';
import { SECTOR_PRESETS } from '../../data/normativeCatalog';

interface ProcessTreeStepProps {
  project: PmmrsProject;
  onUpdateWastes: (wastes: WasteItem[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export const ProcessTreeStep: React.FC<ProcessTreeStepProps> = ({
  project,
  onUpdateWastes,
  onNext,
  onBack
}) => {
  const [selectedStage, setSelectedStage] = useState<StageType>('OPERACION_MANTENIMIENTO');
  const [newArea, setNewArea] = useState('');
  const [newProcess, setNewProcess] = useState('');
  const [newActivity, setNewActivity] = useState('');
  const [newWasteName, setNewWasteName] = useState('');
  const [isHazardous, setIsHazardous] = useState(false);

  // Edit state for modifying flow items
  const [editingWaste, setEditingWaste] = useState<WasteItem | null>(null);
  const [editForm, setEditForm] = useState<{
    stage: StageType;
    area: string;
    process: string;
    activity: string;
    wasteName: string;
    isHazardous: boolean;
    quantity: number;
    unit: WasteItem['unit'];
  } | null>(null);

  const sectorPreset = SECTOR_PRESETS[project.company.sector];

  const handleStartEdit = (waste: WasteItem) => {
    setEditingWaste(waste);
    setEditForm({
      stage: waste.stage,
      area: waste.area,
      process: waste.process,
      activity: waste.activity,
      wasteName: waste.wasteName,
      isHazardous: waste.isHazardous,
      quantity: waste.quantity || 100,
      unit: waste.unit || 'KG_MES'
    });
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingWaste || !editForm) return;

    const updatedWastes: WasteItem[] = project.wastes.map((w) => {
      if (w.id === editingWaste.id) {
        const nextColor: ColorBinNTP = editForm.isHazardous ? 'ROJO' : (w.colorCode === 'ROJO' ? 'NEGRO' : w.colorCode);
        return {
          ...w,
          stage: editForm.stage,
          area: editForm.area,
          process: editForm.process,
          activity: editForm.activity,
          wasteName: editForm.wasteName,
          isHazardous: editForm.isHazardous,
          colorCode: nextColor,
          baselCode: editForm.isHazardous ? (w.baselCode?.startsWith('A') ? w.baselCode : 'A1020') : (w.baselCode?.startsWith('B') ? w.baselCode : 'B3010'),
          quantity: editForm.quantity,
          unit: editForm.unit,
          annualQuantityKg: editForm.quantity * 12
        };
      }
      return w;
    });

    onUpdateWastes(updatedWastes);
    setEditingWaste(null);
    setEditForm(null);
  };

  const handleCancelEdit = () => {
    setEditingWaste(null);
    setEditForm(null);
  };

  const handleAddFlowItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProcess || !newWasteName) return;

    const newWaste: WasteItem = {
      id: 'w-' + Date.now(),
      stage: selectedStage,
      area: newArea || 'Área Operativa Principal',
      process: newProcess,
      activity: newActivity || newProcess,
      wasteName: newWasteName,
      physicalState: 'SOLIDO',
      isHazardous,
      hazardCharacteristics: isHazardous ? ['H3_LIQUIDO_INFLAMABLE'] : ['NO_APLICA'],
      hazardUncertainty: false,
      baselCode: isHazardous ? 'A1020' : 'B3010',
      managementScope: 'NO_MUNICIPAL',
      isPriorityGood: false,
      quantity: 100,
      unit: 'KG_MES',
      annualQuantityKg: 1200,
      measurementMethod: 'ESTIMACION_TECNICA_DOCUMENTADA',
      dataSource: 'Estimación técnica inicial de ingeniería de planta',
      colorCode: isHazardous ? 'ROJO' : 'NEGRO',
      primaryDestination: isHazardous ? 'DISPOSICION_FINAL' : 'VALORIZACION_MATERIAL',
      responsibleRole: project.company.contactRole || 'Supervisor de Área'
    };

    onUpdateWastes([...project.wastes, newWaste]);
    setNewWasteName('');
    setNewProcess('');
    setNewActivity('');
  };

  const handleRemoveWaste = (id: string) => {
    onUpdateWastes(project.wastes.filter((w) => w.id !== id));
  };

  const handleLoadSuggested = (presetItem: any) => {
    const newWaste: WasteItem = {
      id: 'w-' + Date.now() + Math.random().toString(36).substring(2, 5),
      stage: selectedStage,
      area: 'Planta Principal / Talleres',
      process: presetItem.name,
      activity: presetItem.activity,
      wasteName: presetItem.expectedWaste,
      physicalState: 'SOLIDO',
      isHazardous: presetItem.hazardous,
      hazardCharacteristics: presetItem.hazardous ? ['H3_LIQUIDO_INFLAMABLE'] : ['NO_APLICA'],
      hazardUncertainty: false,
      baselCode: presetItem.hazardous ? 'A3020' : 'B3020',
      managementScope: 'NO_MUNICIPAL',
      isPriorityGood: presetItem.expectedWaste.includes('RAEE') || presetItem.expectedWaste.includes('NFU'),
      priorityGoodType: presetItem.expectedWaste.includes('RAEE') ? 'RAEE' : presetItem.expectedWaste.includes('NFU') ? 'NFU' : undefined,
      quantity: 150,
      unit: 'KG_MES',
      annualQuantityKg: 1800,
      measurementMethod: 'REGISTRO_INTERNO',
      dataSource: 'Registro interno de operaciones y despachos',
      colorCode: presetItem.hazardous ? 'ROJO' : 'AZUL',
      primaryDestination: presetItem.hazardous ? 'DISPOSICION_FINAL' : 'VALORIZACION_MATERIAL',
      responsibleRole: 'Responsable de Operaciones'
    };
    onUpdateWastes([...project.wastes, newWaste]);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* Step Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <GitBranch className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-emerald-400">Paso 2 de 7</span>
            <h2 className="text-xl font-black text-white">Árbol Lógico y Diagrama de Flujo de Generación (Anexo 2)</h2>
          </div>
        </div>
        <p className="text-xs text-slate-400">
          «Regla profesional: Un PMMRS sólido no empieza por los tachos, empieza por el proceso que genera el residuo». 
          Mapee cada área y actividad para conectar insumos con la corriente residual correspondiente.
        </p>
      </div>

      {/* Visual Logic Flow Scheme */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 text-xs shadow-inner">
        <div className="flex items-center gap-2 text-slate-300 font-bold mb-3">
          <Layers className="w-4 h-4 text-emerald-400" />
          <span>Cadena Lógica de Identificación Obligatoria:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] text-slate-400">
          <span className="px-2.5 py-1 rounded bg-slate-800 text-emerald-400 border border-slate-700">Empresa</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="px-2.5 py-1 rounded bg-slate-800 text-cyan-400 border border-slate-700">Sector</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-200 border border-slate-700">Proceso / Actividad</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="px-2.5 py-1 rounded bg-slate-800 text-amber-300 border border-slate-700">Insumos Críticos</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="px-2.5 py-1 rounded bg-slate-800 text-red-400 border border-slate-700 font-bold">Residuo Generado</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="px-2.5 py-1 rounded bg-slate-800 text-purple-400 border border-slate-700">Manejo / Destino</span>
        </div>
      </div>

      {/* Suggestions from Sector Test */}
      {sectorPreset && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-xs uppercase font-bold text-slate-200 tracking-wider flex items-center gap-2">
              <Box className="w-4 h-4 text-emerald-400" />
              Sugerencias del Test Sectorial: {sectorPreset.name}
            </h3>
            <span className="text-[11px] text-slate-400">Haga clic en (+) para incorporar a su flujo</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {sectorPreset.defaultProcesses.map((p, idx) => {
              const alreadyAdded = project.wastes.some(w => w.wasteName === p.expectedWaste);
              return (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 flex flex-col justify-between space-y-2">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-white">{p.name}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                        p.hazardous ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'
                      }`}>
                        {p.hazardous ? 'Peligroso' : 'No Peligroso'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 leading-snug">{p.activity}</p>
                    <p className="text-[11px] text-emerald-300 font-medium mt-1">Residuo: {p.expectedWaste}</p>
                  </div>

                  <button
                    type="button"
                    disabled={alreadyAdded}
                    onClick={() => handleLoadSuggested(p)}
                    className={`w-full py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                      alreadyAdded
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow'
                    }`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{alreadyAdded ? 'Agregado' : 'Añadir al Flujo'}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Manual Process & Residue Builder Form */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md space-y-5">
        <h3 className="text-xs uppercase font-bold text-white tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
          <Plus className="w-4 h-4 text-emerald-400" />
          Agregar Nuevo Proceso y Residuo al Diagrama
        </h3>

        <form onSubmit={handleAddFlowItem} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-300 mb-1">Etapa del Proyecto *</label>
            <select
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value as StageType)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
            >
              <option value="PLANIFICACION">Planificación</option>
              <option value="CONSTRUCCION">Construcción</option>
              <option value="OPERACION_MANTENIMIENTO">Operación y Mantenimiento</option>
              <option value="CIERRE_ABANDONO">Cierre / Abandono</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Área o Instalación</label>
            <input
              type="text"
              value={newArea}
              onChange={(e) => setNewArea(e.target.value)}
              placeholder="Ej: Taller mecánico / Maestranza / Oficinas"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Proceso Específico *</label>
            <input
              type="text"
              required
              value={newProcess}
              onChange={(e) => setNewProcess(e.target.value)}
              placeholder="Ej: Cambio de lubricantes y fluidos"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Actividad Generadora</label>
            <input
              type="text"
              value={newActivity}
              onChange={(e) => setNewActivity(e.target.value)}
              placeholder="Ej: Drenado de cárter de motores"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Nombre del Residuo Generado *</label>
            <input
              type="text"
              required
              value={newWasteName}
              onChange={(e) => setNewWasteName(e.target.value)}
              placeholder="Ej: Aceite usado de motor / Envases vacíos"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex flex-col justify-end">
            <label className="flex items-center gap-2 p-2 bg-slate-950 border border-slate-800 rounded-xl cursor-pointer">
              <input
                type="checkbox"
                checked={isHazardous}
                onChange={(e) => setIsHazardous(e.target.checked)}
                className="w-4 h-4 accent-red-500"
              />
              <span className="font-semibold text-slate-300">¿Residuo Peligroso? (Anexo III)</span>
            </label>
          </div>

          <div className="sm:col-span-2 lg:col-span-3 flex justify-end pt-2">
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Registrar en el Flujograma</span>
            </button>
          </div>
        </form>
      </div>

      {/* Visual Diagram of Flow (Anexo 2) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-xs uppercase font-bold text-white tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            Flujograma Simplificado de Generación de Residuos (Anexo N.° 2)
          </h3>
          <span className="text-xs font-mono text-emerald-400">{project.wastes.length} flujos vinculados</span>
        </div>

        {project.wastes.length === 0 ? (
          <div className="py-10 text-center text-slate-500 text-xs">
            Aún no se han agregado procesos ni residuos al flujograma. Use las sugerencias sectoriales o agregue manualmente arriba.
          </div>
        ) : (
          <div className="space-y-3">
            {project.wastes.map((w, idx) => (
              <div
                key={w.id}
                className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
              >
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center font-mono font-bold text-[10px] shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold text-[10px]">
                        {w.stage.replace('_', ' ')}
                      </span>
                      <span className="text-slate-400">• Área: <strong className="text-slate-200">{w.area}</strong></span>
                      <span className="text-slate-400">• Proceso: <strong className="text-slate-200">{w.process}</strong></span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-300">
                      <CornerDownRight className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Actividad: {w.activity}</span>
                      <ArrowRight className="w-3 h-3 text-slate-600" />
                      <strong className={`font-semibold ${w.isHazardous ? 'text-red-400' : 'text-emerald-400'}`}>
                        {w.wasteName}
                      </strong>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                        w.isHazardous ? 'bg-red-500/20 text-red-300' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {w.isHazardous ? 'PELIGROSO' : 'NO PELIGROSO'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 self-end md:self-center">
                  <button
                    type="button"
                    onClick={() => handleStartEdit(w)}
                    className="p-2 rounded-lg text-slate-500 hover:text-amber-400 hover:bg-amber-500/10 transition-colors cursor-pointer"
                    title="Modificar flujo de residuos"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRemoveWaste(w.id)}
                    className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                    title="Eliminar del diagrama"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal para Modificar Flujo de Residuos */}
      {editingWaste && editForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 text-xs">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Pencil className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Modificar Flujo de Generación</h3>
                  <p className="text-[11px] text-slate-400">Actualice la vinculación de proceso, actividad y residuo</p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCancelEdit}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-300 mb-1">Etapa del Ciclo:</label>
                  <select
                    value={editForm.stage}
                    onChange={(e) => setEditForm({ ...editForm, stage: e.target.value as StageType })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="PLANIFICACION_DISENO">Planificación y Diseño</option>
                    <option value="CONSTRUCCION_INSTALACION">Construcción e Instalación</option>
                    <option value="OPERACION_MANTENIMIENTO">Operación y Mantenimiento</option>
                    <option value="CIERRE_ABANDONO">Cierre y Abandono</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Área Operativa:</label>
                  <input
                    type="text"
                    value={editForm.area}
                    onChange={(e) => setEditForm({ ...editForm, area: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    placeholder="Ej. Almacén Central"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Proceso Principal:</label>
                  <input
                    type="text"
                    value={editForm.process}
                    onChange={(e) => setEditForm({ ...editForm, process: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    placeholder="Ej. Recepción de insumos"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-300 mb-1">Actividad Generadora:</label>
                  <input
                    type="text"
                    value={editForm.activity}
                    onChange={(e) => setEditForm({ ...editForm, activity: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    placeholder="Ej. Desembalaje y acondicionamiento"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-300 mb-1">Residuo Sólido Generado:</label>
                  <input
                    type="text"
                    value={editForm.wasteName}
                    onChange={(e) => setEditForm({ ...editForm, wasteName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    placeholder="Ej. Cartón corrugado y cajas"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Clasificación:</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setEditForm({ ...editForm, isHazardous: false })}
                      className={`flex-1 py-2 px-3 rounded-xl font-bold transition-all ${
                        !editForm.isHazardous
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      No Peligroso
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditForm({ ...editForm, isHazardous: true })}
                      className={`flex-1 py-2 px-3 rounded-xl font-bold transition-all ${
                        editForm.isHazardous
                          ? 'bg-red-600 text-white'
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      Peligroso
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Cantidad Mensual Estimada:</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="1"
                      value={editForm.quantity}
                      onChange={(e) => setEditForm({ ...editForm, quantity: Number(e.target.value) || 0 })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                    />
                    <span className="self-center font-bold text-slate-400 px-2 py-1 bg-slate-800 rounded-lg">
                      kg/mes
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold cursor-pointer transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-lg shadow-amber-500/20 cursor-pointer transition-colors"
                >
                  <Check className="w-4 h-4" />
                  <span>Guardar Modificación</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Buttons Navigation */}
      <div className="flex items-center justify-between pt-4">
        <button
          onClick={onBack}
          className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs border border-slate-700 transition-colors cursor-pointer"
        >
          Regresar a Perfil
        </button>

        <button
          onClick={onNext}
          disabled={project.wastes.length === 0}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm shadow-lg transition-all cursor-pointer ${
            project.wastes.length > 0
              ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
          }`}
        >
          <span>Ir a la Matriz Maestra de Residuos</span>
          <CheckCircle2 className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
