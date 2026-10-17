import React, { useState } from 'react';
import { Box, Layers, Plus, Trash2, CheckCircle2, AlertTriangle, HelpCircle, ShieldCheck, Pencil, X, Check } from 'lucide-react';
import { DiscardMaterial, PriorityGoodItem } from '../../types';
import { RAEE_CATEGORIES, NFU_CATEGORIES } from '../../data/normativeCatalog';

interface SpecialRegimesStepProps {
  discardMaterials: DiscardMaterial[];
  priorityGoods: PriorityGoodItem[];
  onUpdateDiscard: (items: DiscardMaterial[]) => void;
  onUpdatePriorityGoods: (items: PriorityGoodItem[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export const SpecialRegimesStep: React.FC<SpecialRegimesStepProps> = ({
  discardMaterials,
  priorityGoods,
  onUpdateDiscard,
  onUpdatePriorityGoods,
  onNext,
  onBack
}) => {
  const [editingDiscard, setEditingDiscard] = useState<DiscardMaterial | null>(null);
  const [editingPriority, setEditingPriority] = useState<PriorityGoodItem | null>(null);

  // Discard material form state
  const [dmName, setDmName] = useState('');
  const [dmProcess, setDmProcess] = useState('');
  const [dmCharacteristics, setDmCharacteristics] = useState('');
  const [dmQty, setDmQty] = useState<number>(1000);
  const [dmFrequency, setDmFrequency] = useState('Mensual');
  const [dmDestination, setDmDestination] = useState('');
  const [dmCompany, setDmCompany] = useState('');
  const [dmRuc, setDmRuc] = useState('');

  // Priority goods form state
  const [pgRegime, setPgRegime] = useState<'RAEE' | 'NFU'>('RAEE');
  const [pgDesc, setPgDesc] = useState('');
  const [pgCategory, setPgCategory] = useState(RAEE_CATEGORIES[2].name);
  const [pgUnits, setPgUnits] = useState<number>(10);
  const [pgMassKg, setPgMassKg] = useState<number>(150);
  const [pgCollector, setPgCollector] = useState('');

  const handleAddDiscard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dmName || !dmProcess) return;

    const newItem: DiscardMaterial = {
      id: 'dm-' + Date.now(),
      materialName: dmName,
      generatingProcess: dmProcess,
      physicalCharacteristics: dmCharacteristics || 'Subproducto no peligroso directamente aprovechable',
      estimatedQuantityKgMonth: Number(dmQty) || 0,
      frequency: dmFrequency,
      destinationActivity: dmDestination || 'Reutilización como insumo en proceso auxiliar',
      recipientCompanyName: dmCompany || 'Misma empresa o tercero receptor',
      recipientCompanyRuc: dmRuc || '20000000000',
      storageConditions: 'Almacenamiento temporal en área techada e impermeabilizada',
      transportVehicleType: 'Camión de carga cerrado',
      transportModality: 'PROPIO',
      evidenceOfReuse: 'Cuaderno de control de producción y guías de remisión'
    };

    onUpdateDiscard([...discardMaterials, newItem]);
    setDmName('');
    setDmProcess('');
    setDmCharacteristics('');
    setDmDestination('');
  };

  const handleAddPriorityGood = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pgDesc) return;

    const newItem: PriorityGoodItem = {
      id: 'pg-' + Date.now(),
      regime: pgRegime,
      goodDescription: pgDesc,
      category: pgCategory,
      unitsPerYear: Number(pgUnits) || 0,
      massKgPerYear: Number(pgMassKg) || 0,
      periodicity: 'Semestral / Anual',
      authorizedCollectorOrSystem: pgCollector || 'Sistema Colectivo o Individual Autorizado por MINAM',
      evidenceRef: 'Certificado de recepción y constancia de destino final REP'
    };

    onUpdatePriorityGoods([...priorityGoods, newItem]);
    setPgDesc('');
    setPgCollector('');
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Box className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-cyan-400">Paso 5 de 7</span>
            <h2 className="text-xl font-black text-white">Material de Descarte (Art. 9) y Bienes Priorizados REP (Anexo 4)</h2>
          </div>
        </div>
        <p className="text-xs text-slate-400">
          «Regla regulatoria fundamental: No confundir un residuo con un material de descarte». 
          El material de descarte (Art. 9 D.L. 1278 modificado por Ley 32212) constituye un insumo directamente aprovechable. 
          Los bienes priorizados (RAEE, NFU) se rigen bajo Responsabilidad Extendida del Productor.
        </p>
      </div>

      {/* SECCIÓN 1: MATERIAL DE DESCARTE */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-xs uppercase font-bold text-white tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            1. Registro de Material de Descarte (Art. 9 LGIRS / D.S. 001-2022-MINAM)
          </h3>
          <span className="text-[11px] text-cyan-400 font-semibold">{discardMaterials.length} registrado(s)</span>
        </div>

        <form onSubmit={handleAddDiscard} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
          <div>
            <label className="block font-semibold text-slate-300 mb-1">Nombre del Material de Descarte *</label>
            <input
              type="text"
              required
              value={dmName}
              onChange={(e) => setDmName(e.target.value)}
              placeholder="Ej: Viruta de hierro limpia / Mermas de PE"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Proceso de Origen *</label>
            <input
              type="text"
              required
              value={dmProcess}
              onChange={(e) => setDmProcess(e.target.value)}
              placeholder="Ej: Mecanizado y corte en torno"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Cantidad Estimada (kg/mes)</label>
            <input
              type="number"
              min="0"
              value={dmQty}
              onChange={(e) => setDmQty(parseFloat(e.target.value) || 0)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Actividad Receptora donde se Aprovechará</label>
            <input
              type="text"
              value={dmDestination}
              onChange={(e) => setDmDestination(e.target.value)}
              placeholder="Ej: Fundición para fabricación de piezas"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Empresa / Proceso Receptor</label>
            <input
              type="text"
              value={dmCompany}
              onChange={(e) => setDmCompany(e.target.value)}
              placeholder="Ej: Aceros Industriales S.A."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full py-2 px-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow cursor-pointer transition-colors"
            >
              + Agregar Material de Descarte
            </button>
          </div>
        </form>

        {discardMaterials.length > 0 && (
          <div className="space-y-2 pt-2">
            {discardMaterials.map((dm) => (
              <div key={dm.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs text-slate-300">
                <div>
                  <strong className="text-white">{dm.materialName}</strong> ({dm.estimatedQuantityKgMonth} kg/mes)
                  <div className="text-[11px] text-slate-400">
                    Proceso: {dm.generatingProcess} • Destino: {dm.destinationActivity} ({dm.recipientCompanyName})
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setEditingDiscard({ ...dm })}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 transition-colors cursor-pointer"
                    title="Modificar material de descarte"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onUpdateDiscard(discardMaterials.filter(d => d.id !== dm.id))}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                    title="Eliminar material"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECCIÓN 2: BIENES PRIORIZADOS (RAEE / NFU) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-xs uppercase font-bold text-white tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            2. Régimen Especial de Bienes Priorizados (Anexo N.° 4: RAEE y NFU)
          </h3>
          <span className="text-[11px] text-amber-400 font-semibold">{priorityGoods.length} registrado(s)</span>
        </div>

        <form onSubmit={handleAddPriorityGood} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
          <div>
            <label className="block font-semibold text-slate-300 mb-1">Régimen Especial *</label>
            <select
              value={pgRegime}
              onChange={(e) => {
                const reg = e.target.value as 'RAEE' | 'NFU';
                setPgRegime(reg);
                setPgCategory(reg === 'RAEE' ? RAEE_CATEGORIES[2].name : NFU_CATEGORIES[0].name);
              }}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold"
            >
              <option value="RAEE">RAEE (D.S. 009-2019-MINAM - Aparatos Eléctricos y Electrónicos)</option>
              <option value="NFU">NFU (D.S. 024-2021-MINAM - Neumáticos Fuera de Uso)</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Categoría Oficial (Anexo 4) *</label>
            <select
              value={pgCategory}
              onChange={(e) => setPgCategory(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
            >
              {pgRegime === 'RAEE'
                ? RAEE_CATEGORIES.map((c) => (
                    <option key={c.id} value={c.name} className="bg-slate-900 text-white">
                      {c.name}
                    </option>
                  ))
                : NFU_CATEGORIES.map((c) => (
                    <option key={c.id} value={c.name} className="bg-slate-900 text-white">
                      {c.name}
                    </option>
                  ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Descripción del Bien *</label>
            <input
              type="text"
              required
              value={pgDesc}
              onChange={(e) => setPgDesc(e.target.value)}
              placeholder="Ej: Computadoras de escritorio y servidores / Llantas de camioneta"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Unidades Anuales Estimadas</label>
            <input
              type="number"
              min="0"
              value={pgUnits}
              onChange={(e) => setPgUnits(parseInt(e.target.value) || 0)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Masa Total Anual Estimada (kg/año)</label>
            <input
              type="number"
              min="0"
              value={pgMassKg}
              onChange={(e) => setPgMassKg(parseFloat(e.target.value) || 0)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Sistema Colectivo / Destino Acreditado</label>
            <input
              type="text"
              value={pgCollector}
              onChange={(e) => setPgCollector(e.target.value)}
              placeholder="Ej: Sistema Colectivo RLIE / EcoRecicla"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="sm:col-span-2 lg:col-span-3 flex justify-end pt-1">
            <button
              type="submit"
              className="py-2 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow cursor-pointer transition-colors"
            >
              + Agregar Bien Priorizado al Cuadro Anexo 4
            </button>
          </div>
        </form>

        {priorityGoods.length > 0 && (
          <div className="space-y-2 pt-2">
            {priorityGoods.map((pg) => (
              <div key={pg.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs text-slate-300">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-amber-400">{pg.regime}:</span>
                    <span className="font-semibold text-white">{pg.goodDescription}</span>
                    <span className="text-[10px] text-slate-400">({pg.unitsPerYear} und/año • {pg.massKgPerYear} kg/año)</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {pg.category} • Sistema/Operador: {pg.authorizedCollectorOrSystem}
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setEditingPriority({ ...pg })}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 transition-colors cursor-pointer"
                    title="Modificar bien priorizado"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onUpdatePriorityGoods(priorityGoods.filter(p => p.id !== pg.id))}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                    title="Eliminar bien"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
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
          Regresar a Minimización
        </button>

        <button
          onClick={onNext}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
        >
          <span>Ir a Almacenamiento, Segregación y Transporte</span>
          <CheckCircle2 className="w-4 h-4" />
        </button>
      </div>

      {/* Modal para Modificar Material de Descarte */}
      {editingDiscard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Pencil className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-white">Modificar Material de Descarte</h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingDiscard(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                onUpdateDiscard(discardMaterials.map(d => d.id === editingDiscard.id ? editingDiscard : d));
                setEditingDiscard(null);
              }}
              className="space-y-3.5 text-xs"
            >
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nombre del Subproducto / Material *</label>
                <input
                  type="text"
                  required
                  value={editingDiscard.materialName}
                  onChange={(e) => setEditingDiscard({ ...editingDiscard, materialName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Proceso de Origen</label>
                  <input
                    type="text"
                    value={editingDiscard.generatingProcess}
                    onChange={(e) => setEditingDiscard({ ...editingDiscard, generatingProcess: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Generación Estimada (kg/mes)</label>
                  <input
                    type="number"
                    value={editingDiscard.estimatedQuantityKgMonth}
                    onChange={(e) => setEditingDiscard({ ...editingDiscard, estimatedQuantityKgMonth: Number(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Empresa / Planta Receptora</label>
                <input
                  type="text"
                  value={editingDiscard.recipientCompanyName}
                  onChange={(e) => setEditingDiscard({ ...editingDiscard, recipientCompanyName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Actividad o Proceso de Destino</label>
                <input
                  type="text"
                  value={editingDiscard.destinationActivity}
                  onChange={(e) => setEditingDiscard({ ...editingDiscard, destinationActivity: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingDiscard(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs border border-slate-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Guardar Cambios</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para Modificar Bien Priorizado */}
      {editingPriority && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Pencil className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-white">Modificar Bien Priorizado ({editingPriority.regime})</h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingPriority(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                onUpdatePriorityGoods(priorityGoods.map(p => p.id === editingPriority.id ? editingPriority : p));
                setEditingPriority(null);
              }}
              className="space-y-3.5 text-xs"
            >
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Descripción del Bien *</label>
                <input
                  type="text"
                  required
                  value={editingPriority.goodDescription}
                  onChange={(e) => setEditingPriority({ ...editingPriority, goodDescription: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Unidades al Año</label>
                  <input
                    type="number"
                    value={editingPriority.unitsPerYear}
                    onChange={(e) => setEditingPriority({ ...editingPriority, unitsPerYear: Number(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Masa Anual (kg/año)</label>
                  <input
                    type="number"
                    value={editingPriority.massKgPerYear}
                    onChange={(e) => setEditingPriority({ ...editingPriority, massKgPerYear: Number(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Sistema Integrado o EO-RS Autorizada</label>
                <input
                  type="text"
                  value={editingPriority.authorizedCollectorOrSystem}
                  onChange={(e) => setEditingPriority({ ...editingPriority, authorizedCollectorOrSystem: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingPriority(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs border border-slate-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Guardar Cambios</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
