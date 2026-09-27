import React, { useState } from 'react';
import { 
  Table, 
  Plus, 
  Trash2, 
  Copy, 
  FileSpreadsheet, 
  Search, 
  Filter, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle,
  Calculator,
  Upload,
  Download
} from 'lucide-react';
import { WasteItem, StageType, PhysicalState, ManagementScope, HazardCharacteristic, EstimationMethod, OperationType, ColorBinNTP } from '../../types';
import { BASEL_COMMON_CODES, HAZARD_CHARACTERISTICS_CATALOG, NTP_COLORS_NO_MUNICIPAL } from '../../data/normativeCatalog';
import * as XLSX from 'xlsx';

interface WasteMatrixStepProps {
  wastes: WasteItem[];
  onUpdateWastes: (wastes: WasteItem[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export const WasteMatrixStep: React.FC<WasteMatrixStepProps> = ({
  wastes,
  onUpdateWastes,
  onNext,
  onBack
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterHazardous, setFilterHazardous] = useState<'ALL' | 'HAZARDOUS' | 'NON_HAZARDOUS'>('ALL');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Filters
  const filteredWastes = wastes.filter((w) => {
    const matchesSearch = 
      w.wasteName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.process.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterHazardous === 'HAZARDOUS') return matchesSearch && w.isHazardous;
    if (filterHazardous === 'NON_HAZARDOUS') return matchesSearch && !w.isHazardous;
    return matchesSearch;
  });

  const handleUpdateItem = (id: string, updated: Partial<WasteItem>) => {
    onUpdateWastes(
      wastes.map((w) => {
        if (w.id === id) {
          const newItem = { ...w, ...updated };
          // Auto calculate annual mass in kg approximately
          let multiplier = 12;
          if (newItem.unit === 'T_MES') multiplier = 12 * 1000;
          else if (newItem.unit === 'KG_MES' || newItem.unit === 'L_MES') multiplier = 12;
          else if (newItem.unit === 'T_ANO') multiplier = 1000;
          else if (newItem.unit === 'KG_ANO') multiplier = 1;
          newItem.annualQuantityKg = Math.round((newItem.quantity || 0) * multiplier);
          return newItem;
        }
        return w;
      })
    );
  };

  const handleDuplicate = (waste: WasteItem) => {
    const duplicated: WasteItem = {
      ...waste,
      id: 'w-' + Date.now(),
      wasteName: waste.wasteName + ' (Copia)'
    };
    onUpdateWastes([...wastes, duplicated]);
  };

  const handleDelete = (id: string) => {
    onUpdateWastes(wastes.filter((w) => w.id !== id));
  };

  const handleAddNewRow = () => {
    const newId = 'w-' + Date.now();
    const newWaste: WasteItem = {
      id: newId,
      stage: 'OPERACION_MANTENIMIENTO',
      area: 'Área General',
      process: 'Proceso Operativo',
      activity: 'Actividad Específica',
      wasteName: 'Nuevo Residuo Sólido',
      physicalState: 'SOLIDO',
      isHazardous: false,
      hazardCharacteristics: ['NO_APLICA'],
      hazardUncertainty: false,
      baselCode: 'B3020',
      managementScope: 'NO_MUNICIPAL',
      isPriorityGood: false,
      quantity: 50,
      unit: 'KG_MES',
      annualQuantityKg: 600,
      measurementMethod: 'REGISTRO_INTERNO',
      dataSource: 'Registro interno de generación',
      colorCode: 'NEGRO',
      primaryDestination: 'VALORIZACION_MATERIAL',
      responsibleRole: 'Encargado Ambiental'
    };
    onUpdateWastes([...wastes, newWaste]);
    setEditingId(newId);
  };

  // Export to Excel
  const handleExportExcel = () => {
    const data = wastes.map((w, idx) => ({
      'N°': idx + 1,
      'Etapa': w.stage,
      'Área': w.area,
      'Proceso': w.process,
      'Actividad Generadora': w.activity,
      'Nombre del Residuo': w.wasteName,
      'Estado Físico': w.physicalState,
      'Peligrosidad': w.isHazardous ? 'PELIGROSO' : 'NO PELIGROSO',
      'Código Basilea': w.baselCode || '-',
      'Ámbito de Gestión': w.managementScope,
      'Cantidad': w.quantity,
      'Unidad': w.unit,
      'Cantidad Anual (kg)': w.annualQuantityKg,
      'Método de Estimación': w.measurementMethod,
      'Fuente de Trazabilidad': w.dataSource,
      'Color Contenedor NTP': w.colorCode,
      'Operación Destino': w.primaryDestination,
      'Operador EO-RS': w.authorizedOperatorName || 'No asignado',
      'Registro Autoritativo': w.operatorRegistryNumber || 'Pendiente',
      'Responsable': w.responsibleRole
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Matriz_Residuos_PMMRS');
    XLSX.writeFile(workbook, 'Matriz_Maestra_Residuos_PMMRS.xlsx');
  };

  // Import from Excel
  const handleImportExcel = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const importedData: any[] = XLSX.utils.sheet_to_json(ws);

        if (importedData && importedData.length > 0) {
          const parsedWastes: WasteItem[] = importedData.map((row, idx) => ({
            id: 'w-imp-' + Date.now() + '-' + idx,
            stage: (row['Etapa'] as StageType) || 'OPERACION_MANTENIMIENTO',
            area: row['Área'] || 'Área Importada',
            process: row['Proceso'] || 'Proceso General',
            activity: row['Actividad Generadora'] || 'Actividad General',
            wasteName: row['Nombre del Residuo'] || row['Residuo'] || 'Residuo ' + (idx + 1),
            physicalState: (row['Estado Físico'] as PhysicalState) || 'SOLIDO',
            isHazardous: String(row['Peligrosidad']).toUpperCase().includes('PELIGROSO') && !String(row['Peligrosidad']).toUpperCase().includes('NO'),
            hazardCharacteristics: ['H3_LIQUIDO_INFLAMABLE'],
            hazardUncertainty: false,
            baselCode: row['Código Basilea'] || 'B3020',
            managementScope: (row['Ámbito de Gestión'] as ManagementScope) || 'NO_MUNICIPAL',
            isPriorityGood: false,
            quantity: Number(row['Cantidad']) || 10,
            unit: 'KG_MES',
            annualQuantityKg: (Number(row['Cantidad']) || 10) * 12,
            measurementMethod: 'REGISTRO_INTERNO',
            dataSource: row['Fuente de Trazabilidad'] || 'Importado desde Excel',
            colorCode: 'NEGRO',
            primaryDestination: 'VALORIZACION_MATERIAL',
            responsibleRole: row['Responsable'] || 'Área Ambiental'
          }));

          onUpdateWastes([...wastes, ...parsedWastes]);
          alert(`Se importaron ${parsedWastes.length} residuos exitosamente.`);
        }
      } catch (err) {
        alert('Error al leer el archivo Excel. Verifique el formato.');
      }
    };
    reader.readAsBinaryString(file);
  };

  // Quantitative Summary
  const totalKgMes = wastes.reduce((acc, w) => acc + (w.quantity || 0), 0);
  const hazardousCount = wastes.filter((w) => w.isHazardous).length;
  const nonHazardousCount = wastes.filter((w) => !w.isHazardous).length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Step Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Table className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-emerald-400">Paso 3 de 7</span>
              <h2 className="text-xl font-black text-white">Matriz Maestra de Identificación, Caracterización y Estimación (Anexos 3 y 7)</h2>
            </div>
          </div>
          <p className="text-xs text-slate-400">
            Regla de trazabilidad: Toda cantidad debe tener fuente y método de cálculo demostrable. Prohibido inventar datos.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <label className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 cursor-pointer transition-colors">
            <Upload className="w-3.5 h-3.5 text-emerald-400" />
            <span>Importar Excel</span>
            <input type="file" accept=".xlsx,.xls,.csv" onChange={handleImportExcel} className="hidden" />
          </label>

          <button
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 cursor-pointer transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Exportar Excel</span>
          </button>

          <button
            onClick={handleAddNewRow}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 cursor-pointer transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Residuo</span>
          </button>
        </div>
      </div>

      {/* Quantitative Formulas Banner */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs">
        <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
          <div className="text-slate-400 text-[11px] font-semibold mb-1 flex items-center gap-1">
            <Calculator className="w-3.5 h-3.5 text-cyan-400" /> Generación Mensual
          </div>
          <p className="font-mono text-xs text-cyan-300">Gm = ∑ Gi = {totalKgMes.toLocaleString()} kg/mes</p>
          <span className="text-[10px] text-slate-500">Suma aritmética de todas las corrientes</span>
        </div>

        <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
          <div className="text-slate-400 text-[11px] font-semibold mb-1 flex items-center gap-1">
            <Calculator className="w-3.5 h-3.5 text-emerald-400" /> Generación Anual
          </div>
          <p className="font-mono text-xs text-emerald-300">Ga = ∑ Gm = {(totalKgMes * 12).toLocaleString()} kg/año</p>
          <span className="text-[10px] text-slate-500">Proyección anualizada trazable</span>
        </div>

        <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
          <div className="text-slate-400 text-[11px] font-semibold mb-1">Clasificación Peligrosidad</div>
          <p className="text-xs font-semibold text-slate-200">
            <span className="text-red-400 font-bold">{hazardousCount}</span> Peligrosos / <span className="text-emerald-400 font-bold">{nonHazardousCount}</span> No Peligrosos
          </p>
          <span className="text-[10px] text-slate-500">Conforme Anexos III y V D.S. 014</span>
        </div>

        <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
          <div className="text-slate-400 text-[11px] font-semibold mb-1">Código de Colores</div>
          <p className="text-xs font-semibold text-slate-200">NTP 900.058:2019</p>
          <span className="text-[10px] text-slate-500">Solo colores efectivamente generados</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por residuo, área o proceso..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-slate-400 font-semibold">Filtrar:</span>
          <button
            onClick={() => setFilterHazardous('ALL')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              filterHazardous === 'ALL' ? 'bg-slate-700 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            Todos ({wastes.length})
          </button>
          <button
            onClick={() => setFilterHazardous('HAZARDOUS')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              filterHazardous === 'HAZARDOUS' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            Peligrosos ({hazardousCount})
          </button>
          <button
            onClick={() => setFilterHazardous('NON_HAZARDOUS')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              filterHazardous === 'NON_HAZARDOUS' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            No Peligrosos ({nonHazardousCount})
          </button>
        </div>
      </div>

      {/* Editable Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="sticky top-0 bg-slate-950 text-slate-300 font-bold border-b border-slate-800 uppercase text-[11px] tracking-wider z-10">
              <tr>
                <th className="p-3.5">Residuo & Proceso</th>
                <th className="p-3.5">Peligrosidad</th>
                <th className="p-3.5">Cód. Basilea</th>
                <th className="p-3.5">Cantidad & Unidad</th>
                <th className="p-3.5">Fuente de Medición</th>
                <th className="p-3.5">Color NTP</th>
                <th className="p-3.5">Destino / Operador</th>
                <th className="p-3.5 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70 text-slate-200">
              {filteredWastes.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500">
                    No se encontraron residuos con los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                filteredWastes.map((w) => (
                  <tr key={w.id} className="hover:bg-slate-800/40 transition-colors">
                    
                    {/* Residue & Process */}
                    <td className="p-3.5 min-w-[220px]">
                      <input
                        type="text"
                        value={w.wasteName}
                        onChange={(e) => handleUpdateItem(w.id, { wasteName: e.target.value })}
                        className="font-bold text-white bg-transparent border-b border-transparent hover:border-slate-700 focus:border-emerald-500 focus:bg-slate-950 px-1 py-0.5 w-full rounded focus:outline-none"
                      />
                      <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                        <span>Área:</span>
                        <input
                          type="text"
                          value={w.area}
                          onChange={(e) => handleUpdateItem(w.id, { area: e.target.value })}
                          className="bg-transparent border-b border-transparent hover:border-slate-700 focus:border-emerald-500 text-slate-300 text-[11px] px-1 py-0.2 rounded focus:outline-none"
                        />
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Proceso: {w.process}
                      </div>
                    </td>

                    {/* Peligrosidad */}
                    <td className="p-3.5 min-w-[140px]">
                      <div className="space-y-1">
                        <select
                          value={w.isHazardous ? 'SI' : 'NO'}
                          onChange={(e) => handleUpdateItem(w.id, { 
                            isHazardous: e.target.value === 'SI',
                            colorCode: e.target.value === 'SI' ? 'ROJO' : 'NEGRO'
                          })}
                          className={`px-2 py-1 rounded text-[11px] font-bold ${
                            w.isHazardous ? 'bg-red-500/20 text-red-300 border border-red-500/40' : 'bg-slate-800 text-slate-300 border border-slate-700'
                          }`}
                        >
                          <option value="NO" className="bg-slate-900 text-white">No Peligroso</option>
                          <option value="SI" className="bg-slate-900 text-white">Peligroso (Anexo III)</option>
                        </select>

                        {w.isHazardous && (
                          <div className="text-[10px] text-slate-400">
                            <select
                              value={w.hazardCharacteristics[0] || 'H3_LIQUIDO_INFLAMABLE'}
                              onChange={(e) => handleUpdateItem(w.id, { hazardCharacteristics: [e.target.value as HazardCharacteristic] })}
                              className="bg-slate-950 border border-slate-800 rounded px-1.5 py-0.5 text-slate-300 w-full text-[10px]"
                            >
                              {HAZARD_CHARACTERISTICS_CATALOG.map((hc) => (
                                <option key={hc.code} value={hc.code} className="bg-slate-900 text-white">
                                  {hc.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}

                        <label className="flex items-center gap-1 text-[10px] text-slate-400 cursor-pointer pt-0.5">
                          <input
                            type="checkbox"
                            checked={w.hazardUncertainty}
                            onChange={(e) => handleUpdateItem(w.id, { hazardUncertainty: e.target.checked })}
                            className="accent-amber-500"
                          />
                          <span>¿Incertidumbre técnica?</span>
                        </label>
                      </div>
                    </td>

                    {/* Basel Code */}
                    <td className="p-3.5 min-w-[120px]">
                      <select
                        value={w.baselCode || (w.isHazardous ? 'A1020' : 'B3010')}
                        onChange={(e) => handleUpdateItem(w.id, { baselCode: e.target.value })}
                        className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-slate-200 text-xs font-mono w-full"
                      >
                        {BASEL_COMMON_CODES.filter(bc => bc.hazardous === w.isHazardous).map((bc) => (
                          <option key={bc.code} value={bc.code} className="bg-slate-900 text-white">
                            {bc.code} - {bc.desc.substring(0, 30)}...
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Quantity & Unit */}
                    <td className="p-3.5 min-w-[130px]">
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          min="0"
                          step="any"
                          value={w.quantity}
                          onChange={(e) => handleUpdateItem(w.id, { quantity: parseFloat(e.target.value) || 0 })}
                          className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-white font-mono w-20 text-xs"
                        />
                        <select
                          value={w.unit}
                          onChange={(e) => handleUpdateItem(w.id, { unit: e.target.value as any })}
                          className="bg-slate-950 border border-slate-800 rounded-lg px-1.5 py-1 text-slate-300 text-[11px]"
                        >
                          <option value="KG_MES">kg/mes</option>
                          <option value="T_MES">t/mes</option>
                          <option value="L_MES">L/mes</option>
                          <option value="M3_MES">m3/mes</option>
                          <option value="UND_MES">und/mes</option>
                        </select>
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono mt-1">
                        ≈ {w.annualQuantityKg.toLocaleString()} kg/año
                      </div>
                    </td>

                    {/* Method & Data Source (Trazabilidad) */}
                    <td className="p-3.5 min-w-[170px]">
                      <select
                        value={w.measurementMethod}
                        onChange={(e) => handleUpdateItem(w.id, { measurementMethod: e.target.value as EstimationMethod })}
                        className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-slate-300 text-[11px] w-full mb-1"
                      >
                        <option value="PESAJE_DIRECTO">Pesaje Directo (Báscula)</option>
                        <option value="REGISTRO_INTERNO">Registro Interno</option>
                        <option value="MANIFIESTO_PELIGROSO">Manifiesto Peligroso</option>
                        <option value="REGISTRO_EORS">Registro EO-RS</option>
                        <option value="INVENTARIO_ORDEN_COMPRA">Inventarios / Compras</option>
                        <option value="BALANCE_MATERIA">Balance de Materia</option>
                        <option value="FACTOR_GENERACION">Factor de Generación</option>
                        <option value="ESTIMACION_TECNICA_DOCUMENTADA">Estimación Técnica Documentada</option>
                      </select>

                      <input
                        type="text"
                        value={w.dataSource}
                        onChange={(e) => handleUpdateItem(w.id, { dataSource: e.target.value })}
                        placeholder="Fuente: Balanza N°1, Factura, etc."
                        className={`bg-slate-950 border rounded px-2 py-0.5 text-slate-300 text-[11px] w-full focus:outline-none ${
                          !w.dataSource || w.dataSource.trim() === '' ? 'border-amber-500/80 bg-amber-500/5' : 'border-slate-800'
                        }`}
                      />
                    </td>

                    {/* Color Code NTP 900.058 */}
                    <td className="p-3.5 min-w-[110px]">
                      <select
                        value={w.colorCode}
                        onChange={(e) => handleUpdateItem(w.id, { colorCode: e.target.value as ColorBinNTP })}
                        className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs font-semibold"
                      >
                        {NTP_COLORS_NO_MUNICIPAL.map((c) => (
                          <option key={c.colorName} value={c.colorName.toUpperCase()} className="bg-slate-900 text-white">
                            {c.colorName} ({c.type})
                          </option>
                        ))}
                      </select>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span 
                          className="w-3 h-3 rounded-full inline-block border border-white/20"
                          style={{
                            backgroundColor: NTP_COLORS_NO_MUNICIPAL.find(c => c.colorName.toUpperCase() === w.colorCode)?.hex || '#333'
                          }}
                        />
                        <span className="text-[10px] text-slate-400 font-medium">NTP 900.058</span>
                      </div>
                    </td>

                    {/* Primary Destination & EO-RS */}
                    <td className="p-3.5 min-w-[190px]">
                      <select
                        value={w.primaryDestination}
                        onChange={(e) => handleUpdateItem(w.id, { primaryDestination: e.target.value as OperationType })}
                        className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-slate-300 text-[11px] w-full mb-1"
                      >
                        <option value="VALORIZACION_MATERIAL">Valorización Material (Reciclaje/Reuso)</option>
                        <option value="VALORIZACION_ENERGETICA">Valorización Energética (Co-procesamiento)</option>
                        <option value="TRATAMIENTO">Tratamiento Físico/Químico</option>
                        <option value="DISPOSICION_FINAL">Disposición Final (Relleno Sanitario/Seguridad)</option>
                      </select>

                      <input
                        type="text"
                        value={w.authorizedOperatorName || ''}
                        onChange={(e) => handleUpdateItem(w.id, { authorizedOperatorName: e.target.value })}
                        placeholder="Operador EO-RS contratado"
                        className="bg-slate-950 border border-slate-800 rounded px-2 py-0.5 text-slate-300 text-[11px] w-full mb-1"
                      />

                      <input
                        type="text"
                        value={w.operatorRegistryNumber || ''}
                        onChange={(e) => handleUpdateItem(w.id, { operatorRegistryNumber: e.target.value })}
                        placeholder="N° Reg. MINAM: EO-RS-XXXX-XXXX"
                        className="bg-slate-950 border border-slate-800 rounded px-2 py-0.5 text-slate-400 font-mono text-[10px] w-full"
                      />
                    </td>

                    {/* Actions */}
                    <td className="p-3.5 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleDuplicate(w)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                          title="Duplicar corriente de residuo"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(w.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                          title="Eliminar corriente"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Buttons Navigation */}
      <div className="flex items-center justify-between pt-4">
        <button
          onClick={onBack}
          className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs border border-slate-700 transition-colors cursor-pointer"
        >
          Regresar a Procesos
        </button>

        <button
          onClick={onNext}
          disabled={wastes.length === 0}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm shadow-lg transition-all cursor-pointer ${
            wastes.length > 0
              ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
          }`}
        >
          <span>Ir a Estrategias de Prevención y Minimización</span>
          <CheckCircle2 className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
