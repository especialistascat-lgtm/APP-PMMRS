import React from 'react';
import { Building2, FileText, CheckCircle2, AlertCircle, HelpCircle, Layers, ShieldCheck } from 'lucide-react';
import { CompanyProfile, SectorType, StageType } from '../../types';
import { SECTOR_PRESETS } from '../../data/normativeCatalog';

interface CompanyProfileStepProps {
  company: CompanyProfile;
  onChangeCompany: (updated: Partial<CompanyProfile>) => void;
  onNext: () => void;
}

export const CompanyProfileStep: React.FC<CompanyProfileStepProps> = ({
  company,
  onChangeCompany,
  onNext
}) => {
  const handleStageToggle = (stage: StageType) => {
    const current = company.activeStages || [];
    const exists = current.includes(stage);
    const updated = exists ? current.filter((s) => s !== stage) : [...current, stage];
    onChangeCompany({ activeStages: updated });
  };

  const handleSectorChange = (sector: SectorType) => {
    onChangeCompany({ sector });
  };

  const selectedPreset = SECTOR_PRESETS[company.sector];

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      
      {/* Intro Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-emerald-400">Paso 1 de 7</span>
            <h2 className="text-xl font-black text-white">Perfil Empresarial, Test Sectorial y Alcance Regulatorio</h2>
          </div>
        </div>
        <p className="text-xs text-slate-400">
          De acuerdo con el Capítulo 1, 2 y 3 del Contenido Mínimo de la RM N.° 089-2023-MINAM, el PMMRS no debe ser un documento genérico; 
          debe formularse a partir de la realidad operativa, la actividad económica y el IGA aplicable.
        </p>
      </div>

      {/* Form Card 1: Datos de la Empresa */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md space-y-6">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
          <FileText className="w-4 h-4 text-emerald-400" />
          1. Identificación del Titular y Sede Operativa
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-300 mb-1">Razón Social *</label>
            <input
              type="text"
              value={company.businessName}
              onChange={(e) => onChangeCompany({ businessName: e.target.value })}
              placeholder="Ej: SERVICIOS Y CONSTRUCCIONES DEL PERÚ S.A.C."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Número de RUC (11 dígitos) *</label>
            <input
              type="text"
              maxLength={11}
              value={company.ruc}
              onChange={(e) => onChangeCompany({ ruc: e.target.value })}
              placeholder="Ej: 20123456789"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-mono placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Nombre Comercial / Nombre de la Unidad</label>
            <input
              type="text"
              value={company.facilityName}
              onChange={(e) => onChangeCompany({ facilityName: e.target.value })}
              placeholder="Ej: Planta Lurín / Unidad Minera Esperanza"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Dirección / Emplazamiento</label>
            <input
              type="text"
              value={company.address}
              onChange={(e) => onChangeCompany({ address: e.target.value })}
              placeholder="Ej: Carretera Panamericana Sur Km 38.5"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          <div className="grid grid-cols-3 gap-2 sm:col-span-2">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Departamento</label>
              <input
                type="text"
                value={company.department}
                onChange={(e) => onChangeCompany({ department: e.target.value })}
                placeholder="Lima"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Provincia</label>
              <input
                type="text"
                value={company.province}
                onChange={(e) => onChangeCompany({ province: e.target.value })}
                placeholder="Lima"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Distrito</label>
              <input
                type="text"
                value={company.district}
                onChange={(e) => onChangeCompany({ district: e.target.value })}
                placeholder="Lurín"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Contacto Responsable */}
        <div className="pt-3 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-300 mb-1">Responsable Técnico / Contacto</label>
            <input
              type="text"
              value={company.contactPerson}
              onChange={(e) => onChangeCompany({ contactPerson: e.target.value })}
              placeholder="Ing. Juan Pérez"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-300 mb-1">Cargo en la Empresa</label>
            <input
              type="text"
              value={company.contactRole}
              onChange={(e) => onChangeCompany({ contactRole: e.target.value })}
              placeholder="Jefe de Medio Ambiente / SSOMA"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-300 mb-1">Correo Electrónico</label>
            <input
              type="email"
              value={company.contactEmail}
              onChange={(e) => onChangeCompany({ contactEmail: e.target.value })}
              placeholder="medioambiente@empresa.com"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Form Card 2: Test de Perfil Sectorial Inteligente */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            2. Test de Perfil Empresarial (Encuesta de Criterios de Sector)
          </h3>
          <span className="text-xs text-slate-400">Orienta la selección sin forzar residuos</span>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-2">
            Seleccione el sector económico principal de su empresa:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {(Object.keys(SECTOR_PRESETS) as SectorType[]).map((sec) => (
              <button
                key={sec}
                type="button"
                onClick={() => handleSectorChange(sec)}
                className={`p-3 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                  company.sector === sec
                    ? 'bg-emerald-500/15 border-emerald-500 text-white font-bold shadow-md shadow-emerald-500/10'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="truncate font-semibold">{SECTOR_PRESETS[sec].name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Sector Preset Insights */}
        {selectedPreset && (
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3 text-xs">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Procesos y corrientes típicas sugeridas para {selectedPreset.name}:</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300">
              {selectedPreset.defaultProcesses.map((p, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                  <div>
                    <strong className="text-white">{p.name}:</strong> {p.activity} <br />
                    <span className="text-[11px] text-slate-400">Residuo típico: {p.expectedWaste} ({p.hazardous ? 'Peligroso' : 'No Peligroso'})</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Descripción de la Actividad Principal de la Empresa *
          </label>
          <textarea
            rows={2}
            value={company.mainActivity}
            onChange={(e) => onChangeCompany({ mainActivity: e.target.value })}
            placeholder="Describa el proceso productivo, constructivo, extractivo o de servicio que genera residuos sólidos..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-xs placeholder-slate-600 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Form Card 3: Alcance Regulatorio, IGA y Etapas */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md space-y-6">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          3. Instrumento de Gestión Ambiental (IGA) y Etapas del Proyecto
        </h3>

        <div className="space-y-4 text-xs">
          <div className="flex items-center gap-4">
            <label className="font-semibold text-slate-300">¿La empresa cuenta con IGA aprobado?</label>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  checked={company.hasIga}
                  onChange={() => onChangeCompany({ hasIga: true })}
                  className="accent-emerald-500"
                />
                <span className="text-white font-medium">Sí</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  checked={!company.hasIga}
                  onChange={() => onChangeCompany({ hasIga: false })}
                  className="accent-emerald-500"
                />
                <span className="text-slate-300 font-medium">No (Actividad en proceso o no sujeta al SEIA)</span>
              </label>
            </div>
          </div>

          {company.hasIga && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-slate-950/60 rounded-xl border border-slate-800">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Tipo de IGA</label>
                <select
                  value={company.igaType || 'DIA'}
                  onChange={(e) => onChangeCompany({ igaType: e.target.value as any })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white"
                >
                  <option value="DIA">DIA - Declaración de Impacto Ambiental</option>
                  <option value="EIA_SD">EIA-sd - Semidetallado</option>
                  <option value="EIA_D">EIA-d - Detallado</option>
                  <option value="PAMA">PAMA - Programa de Adecuación</option>
                  <option value="FTA">FTA - Ficha Técnica Ambiental</option>
                  <option value="ITS">ITS - Informe Técnico Sustentatorio</option>
                  <option value="OTRO">Otro Instrumento Complementario</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">N.° Resolución Directoral de Aprobación</label>
                <input
                  type="text"
                  value={company.igaResolutionNumber || ''}
                  onChange={(e) => onChangeCompany({ igaResolutionNumber: e.target.value })}
                  placeholder="Ej: R.D. N.° 124-2022-PRODUCE"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Autoridad Sectorial Competente</label>
                <input
                  type="text"
                  value={company.competentAuthority || ''}
                  onChange={(e) => onChangeCompany({ competentAuthority: e.target.value })}
                  placeholder="OEFA / PRODUCE / MINEM / etc."
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white"
                />
              </div>
            </div>
          )}

          {/* Etapas del Ciclo */}
          <div>
            <label className="block font-semibold text-slate-300 mb-2">
              Etapas del proyecto o actividad en curso contempladas en el PMMRS:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'PLANIFICACION', label: 'Planificación' },
                { id: 'CONSTRUCCION', label: 'Construcción' },
                { id: 'OPERACION_MANTENIMIENTO', label: 'Operación y Mantenimiento' },
                { id: 'CIERRE_ABANDONO', label: 'Cierre / Abandono' }
              ].map((st) => (
                <label
                  key={st.id}
                  onClick={() => handleStageToggle(st.id as StageType)}
                  className={`p-3 rounded-xl border flex items-center gap-2 cursor-pointer transition-colors ${
                    company.activeStages.includes(st.id as StageType)
                      ? 'bg-emerald-500/15 border-emerald-500 text-white font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={company.activeStages.includes(st.id as StageType)}
                    readOnly
                    className="accent-emerald-500"
                  />
                  <span>{st.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Switches de confirmación operativa */}
          <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl flex items-center justify-between cursor-pointer">
              <span className="text-slate-300">¿Genera o prevé generar residuos peligrosos?</span>
              <input
                type="checkbox"
                checked={company.hasHazardousWaste}
                onChange={(e) => onChangeCompany({ hasHazardousWaste: e.target.checked })}
                className="w-4 h-4 accent-red-500"
              />
            </label>

            <label className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl flex items-center justify-between cursor-pointer">
              <span className="text-slate-300">¿Posee bienes priorizados (RAEE / NFU)?</span>
              <input
                type="checkbox"
                checked={company.hasPriorityGoods}
                onChange={(e) => onChangeCompany({ hasPriorityGoods: e.target.checked })}
                className="w-4 h-4 accent-amber-500"
              />
            </label>

            <label className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl flex items-center justify-between cursor-pointer">
              <span className="text-slate-300">¿Genera subproductos como Material de Descarte (Art. 9)?</span>
              <input
                type="checkbox"
                checked={company.hasDiscardMaterial}
                onChange={(e) => onChangeCompany({ hasDiscardMaterial: e.target.checked })}
                className="w-4 h-4 accent-cyan-500"
              />
            </label>

            <label className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl flex items-center justify-between cursor-pointer">
              <span className="text-slate-300">¿Contratistas generan residuos dentro de su sede?</span>
              <input
                type="checkbox"
                checked={company.hasContractorsGeneratingWaste}
                onChange={(e) => onChangeCompany({ hasContractorsGeneratingWaste: e.target.checked })}
                className="w-4 h-4 accent-emerald-500"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Button footer */}
      <div className="flex justify-end pt-4">
        <button
          onClick={onNext}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
        >
          <span>Guardar Perfil y Pasar a Diagrama de Procesos</span>
          <CheckCircle2 className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
