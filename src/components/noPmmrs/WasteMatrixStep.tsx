import React, { useState, useRef } from 'react';
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
  Download,
  Pencil,
  X,
  Check,
  AlertCircle,
  Save,
  RotateCcw,
  Sparkles
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
  const [editingWaste, setEditingWaste] = useState<WasteItem | null>(null);
  const [showClearAllModal, setShowClearAllModal] = useState(false);
  const [bannerNotice, setBannerNotice] = useState<{ type: 'success' | 'info'; text: string } | null>(null);

  const computeAnnualKg = (quantity: number, unit: string): number => {
    let multiplier = 12;
    if (unit === 'T_MES') multiplier = 12 * 1000;
    else if (unit === 'KG_MES' || unit === 'L_MES') multiplier = 12;
    else if (unit === 'T_ANO') multiplier = 1000;
    else if (unit === 'KG_ANO') multiplier = 1;
    return Math.round((Number(quantity) || 0) * multiplier);
  };

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
          newItem.annualQuantityKg = computeAnnualKg(newItem.quantity, newItem.unit);
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
    setBannerNotice({
      type: 'success',
      text: `Se duplicó la corriente "${waste.wasteName}".`
    });
    setTimeout(() => setBannerNotice(null), 3500);
  };

  const handleDelete = (id: string) => {
    const itemToDelete = wastes.find(w => w.id === id);
    onUpdateWastes(wastes.filter((w) => w.id !== id));
    if (itemToDelete) {
      setBannerNotice({
        type: 'info',
        text: `Se eliminó el residuo "${itemToDelete.wasteName}".`
      });
      setTimeout(() => setBannerNotice(null), 3500);
    }
  };

  const handleStartEditWaste = (waste: WasteItem) => {
    setEditingWaste({ ...waste });
  };

  const handleSaveEditedWaste = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingWaste) return;

    const finalWaste: WasteItem = {
      ...editingWaste,
      annualQuantityKg: computeAnnualKg(editingWaste.quantity, editingWaste.unit)
    };

    onUpdateWastes(wastes.map((w) => (w.id === finalWaste.id ? finalWaste : w)));
    setEditingWaste(null);
    setBannerNotice({
      type: 'success',
      text: `Se modificó el residuo "${finalWaste.wasteName}" exitosamente.`
    });
    setTimeout(() => setBannerNotice(null), 4000);
  };

  const handleClearAllRecords = () => {
    const count = wastes.length;
    onUpdateWastes([]);
    setShowClearAllModal(false);
    setBannerNotice({
      type: 'info',
      text: `Se han eliminado los ${count} registros existentes. La matriz está lista para importar un Excel o cargar nuevos datos.`
    });
    setTimeout(() => setBannerNotice(null), 5000);
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
    handleStartEditWaste(newWaste);
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
          const parsedWastes: WasteItem[] = importedData.map((row, idx) => {
            const rawQty = Number(row['Cantidad']) || Number(row['Cantidad Anual (kg)']) || 10;
            const unit = (row['Unidad'] as any) || 'KG_MES';
            const annualKg = Number(row['Cantidad Anual (kg)']) || computeAnnualKg(rawQty, unit);
            const isHaz = String(row['Peligrosidad'] || '').toUpperCase().includes('PELIGROSO') && !String(row['Peligrosidad'] || '').toUpperCase().includes('NO');

            return {
              id: 'w-imp-' + Date.now() + '-' + idx,
              stage: (row['Etapa'] as StageType) || 'OPERACION_MANTENIMIENTO',
              area: row['Área'] || 'Área Importada',
              process: row['Proceso'] || 'Proceso General',
              activity: row['Actividad Generadora'] || 'Actividad General',
              wasteName: row['Nombre del Residuo'] || row['Residuo'] || 'Residuo ' + (idx + 1),
              physicalState: (row['Estado Físico'] as PhysicalState) || 'SOLIDO',
              isHazardous: isHaz,
              hazardCharacteristics: isHaz ? ['H3_LIQUIDO_INFLAMABLE'] : ['NO_APLICA'],
              hazardUncertainty: false,
              baselCode: row['Código Basilea'] || (isHaz ? 'A1020' : 'B3020'),
              managementScope: (row['Ámbito de Gestión'] as ManagementScope) || 'NO_MUNICIPAL',
              isPriorityGood: false,
              quantity: rawQty,
              unit,
              annualQuantityKg: annualKg,
              measurementMethod: (row['Método de Estimación'] as EstimationMethod) || 'REGISTRO_INTERNO',
              dataSource: row['Fuente de Trazabilidad'] || 'Importado desde Excel',
              colorCode: (row['Color Contenedor NTP'] as ColorBinNTP) || (isHaz ? 'ROJO' : 'NEGRO'),
              primaryDestination: (row['Operación Destino'] as OperationType) || 'VALORIZACION_MATERIAL',
              authorizedOperatorName: row['Operador EO-RS'] || '',
              operatorRegistryNumber: row['Registro Autoritativo'] || '',
              responsibleRole: row['Responsable'] || 'Área Ambiental'
            };
          });

          onUpdateWastes([...wastes, ...parsedWastes]);
          setBannerNotice({
            type: 'success',
            text: `Se importaron exitosamente ${parsedWastes.length} residuos desde el archivo Excel.`
          });
          setTimeout(() => setBannerNotice(null), 5000);
        } else {
          setBannerNotice({
            type: 'info',
            text: 'El archivo Excel no contiene filas de datos válidas o está vacío.'
          });
        }
      } catch (err) {
        setBannerNotice({
          type: 'info',
          text: 'Error al procesar el archivo Excel. Verifique las columnas del formato.'
        });
      } finally {
        if (e.target) e.target.value = '';
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
      
      {/* Banner de Notificación */}
      {bannerNotice && (
        <div className={`p-4 rounded-xl border flex items-center justify-between gap-3 text-xs shadow-md animate-fadeIn ${
          bannerNotice.type === 'success'
            ? 'bg-emerald-950/70 border-emerald-500/40 text-emerald-200'
            : 'bg-cyan-950/70 border-cyan-500/40 text-cyan-200'
        }`}>
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span className="font-medium">{bannerNotice.text}</span>
          </div>
          <button 
            type="button" 
            onClick={() => setBannerNotice(null)} 
            className="p-1 text-slate-400 hover:text-white rounded cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

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
        <div className="flex flex-wrap items-center gap-2">
          {/* Botón para eliminar todos los registros existentes */}
          <button
            type="button"
            onClick={() => {
              if (wastes.length === 0) return;
              setShowClearAllModal(true);
            }}
            disabled={wastes.length === 0}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              wastes.length === 0
                ? 'bg-slate-900/40 text-slate-600 border-slate-800 cursor-not-allowed opacity-50'
                : 'bg-red-950/40 hover:bg-red-900/60 text-red-300 border-red-800/60 hover:border-red-600 shadow-sm shadow-red-950/40'
            }`}
            title="Eliminar todos los registros existentes antes de importar un Excel o cargar nuevos datos"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-400" />
            <span>Eliminar Todos los Registros</span>
            {wastes.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-red-900/80 text-[10px] text-red-200 font-mono border border-red-700/60">
                {wastes.length}
              </span>
            )}
          </button>

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
                  <td colSpan={8} className="p-10 text-center text-slate-400">
                    {wastes.length === 0 ? (
                      <div className="max-w-md mx-auto space-y-3">
                        <div className="w-12 h-12 mx-auto rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400 border border-slate-700">
                          <Table className="w-6 h-6 text-emerald-400" />
                        </div>
                        <h4 className="text-sm font-bold text-white">No hay registros existentes en la matriz</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          La matriz se encuentra lista para recibir datos. Puede importar su plantilla Excel (.xlsx, .xls) o agregar corrientes de residuos manualmente.
                        </p>
                        <div className="flex items-center justify-center gap-3 pt-1">
                          <label className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold cursor-pointer shadow-md transition-colors">
                            <Upload className="w-3.5 h-3.5" />
                            <span>Importar Archivo Excel</span>
                            <input type="file" accept=".xlsx,.xls,.csv" onChange={handleImportExcel} className="hidden" />
                          </label>
                          <button
                            type="button"
                            onClick={handleAddNewRow}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Nuevo Residuo Manual</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <span>No se encontraron residuos con los filtros seleccionados.</span>
                    )}
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
                          onClick={() => handleStartEditWaste(w)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 transition-colors cursor-pointer"
                          title="Modificar / Editar este residuo"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(w.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                          title="Eliminar corriente"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDuplicate(w)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                          title="Duplicar corriente de residuo"
                        >
                          <Copy className="w-3.5 h-3.5" />
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

      {/* Modal de Confirmación: Eliminar Todos los Registros */}
      {showClearAllModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-red-900/50 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-3 bg-red-950/80 border border-red-800/60 rounded-xl text-red-400 shrink-0">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">¿Eliminar todos los registros existentes?</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Esta acción eliminará los <strong className="text-red-300 font-bold">{wastes.length} registros</strong> de residuos sólidos mapeados en la matriz.
                </p>
              </div>
            </div>

            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-2">
              <div className="flex items-center gap-1.5 font-semibold text-amber-300">
                <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Uso antes de importar o cargar datos</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Ejecute esta acción para vaciar la matriz antes de <strong>importar un archivo Excel (.xlsx / .xls)</strong> o de ingresar nuevos datos limpios, garantizando que no se mezclen ni dupliquen los registros anteriores.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowClearAllModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleClearAllRecords}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-lg shadow-red-600/30 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Sí, Eliminar Todos ({wastes.length})</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para Modificar Residuo Sólido */}
      {editingWaste && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full p-6 shadow-2xl space-y-6 my-8">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Pencil className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">Modificar Residuo Sólido</h3>
                  <p className="text-xs text-slate-400">
                    Ajuste la caracterización técnica, trazabilidad y gestión según RM 089-2023-MINAM
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingWaste(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                title="Cerrar ventana"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditedWaste} className="space-y-5 text-xs">
              
              {/* Sección 1: Identificación y Proceso */}
              <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800/80 space-y-3">
                <span className="text-[11px] uppercase font-bold text-emerald-400 tracking-wider">
                  1. Identificación, Área y Proceso Generador
                </span>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="md:col-span-2">
                    <label className="block text-slate-300 font-semibold mb-1">Nombre del Residuo *</label>
                    <input
                      type="text"
                      required
                      value={editingWaste.wasteName}
                      onChange={(e) => setEditingWaste({ ...editingWaste, wasteName: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white font-medium focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Etapa del Ciclo de Vida</label>
                    <select
                      value={editingWaste.stage}
                      onChange={(e) => setEditingWaste({ ...editingWaste, stage: e.target.value as StageType })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                    >
                      <option value="PLANIFICACION">Planificación</option>
                      <option value="CONSTRUCCION">Construcción</option>
                      <option value="OPERACION_MANTENIMIENTO">Operación y Mantenimiento</option>
                      <option value="CIERRE_ABANDONO">Cierre y Abandono</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Área / Sección Generadora</label>
                    <input
                      type="text"
                      value={editingWaste.area}
                      onChange={(e) => setEditingWaste({ ...editingWaste, area: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Proceso Operativo</label>
                    <input
                      type="text"
                      value={editingWaste.process}
                      onChange={(e) => setEditingWaste({ ...editingWaste, process: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Actividad Específica</label>
                    <input
                      type="text"
                      value={editingWaste.activity}
                      onChange={(e) => setEditingWaste({ ...editingWaste, activity: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Sección 2: Peligrosidad y Clasificación */}
              <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800/80 space-y-3">
                <span className="text-[11px] uppercase font-bold text-amber-400 tracking-wider">
                  2. Clasificación de Peligrosidad y Normativa
                </span>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Clasificación de Peligrosidad</label>
                    <select
                      value={editingWaste.isHazardous ? 'SI' : 'NO'}
                      onChange={(e) => {
                        const isHaz = e.target.value === 'SI';
                        setEditingWaste({
                          ...editingWaste,
                          isHazardous: isHaz,
                          colorCode: isHaz ? 'ROJO' : 'NEGRO',
                          baselCode: isHaz ? 'A1020' : 'B3020'
                        });
                      }}
                      className={`w-full border rounded-lg px-3 py-2 font-bold focus:outline-none ${
                        editingWaste.isHazardous 
                          ? 'bg-red-950/40 border-red-500/50 text-red-300' 
                          : 'bg-slate-900 border-slate-800 text-slate-200'
                      }`}
                    >
                      <option value="NO">No Peligroso</option>
                      <option value="SI">Peligroso (Anexo III D.S. 014)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Estado Físico</label>
                    <select
                      value={editingWaste.physicalState}
                      onChange={(e) => setEditingWaste({ ...editingWaste, physicalState: e.target.value as PhysicalState })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                    >
                      <option value="SOLIDO">Sólido</option>
                      <option value="SEMISOLIDO">Semisólido</option>
                      <option value="LIQUIDO">Líquido</option>
                      <option value="GAS_CONTENIDO">Gas Contenido</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Ámbito de Gestión</label>
                    <select
                      value={editingWaste.managementScope}
                      onChange={(e) => setEditingWaste({ ...editingWaste, managementScope: e.target.value as ManagementScope })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                    >
                      <option value="NO_MUNICIPAL">No Municipal (Industrial/Especial)</option>
                      <option value="SIMILAR_AL_MUNICIPAL">Similar al Municipal</option>
                    </select>
                  </div>

                  {editingWaste.isHazardous && (
                    <div className="md:col-span-2">
                      <label className="block text-slate-300 font-semibold mb-1">Característica de Peligrosidad</label>
                      <select
                        value={editingWaste.hazardCharacteristics[0] || 'H3_LIQUIDO_INFLAMABLE'}
                        onChange={(e) => setEditingWaste({ ...editingWaste, hazardCharacteristics: [e.target.value as HazardCharacteristic] })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-red-500 text-xs"
                      >
                        {HAZARD_CHARACTERISTICS_CATALOG.map((hc) => (
                          <option key={hc.code} value={hc.code}>
                            {hc.code}: {hc.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className={editingWaste.isHazardous ? 'md:col-span-1' : 'md:col-span-3'}>
                    <label className="block text-slate-300 font-semibold mb-1">Código Basilea</label>
                    <select
                      value={editingWaste.baselCode || (editingWaste.isHazardous ? 'A1020' : 'B3020')}
                      onChange={(e) => setEditingWaste({ ...editingWaste, baselCode: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-emerald-500"
                    >
                      {BASEL_COMMON_CODES.filter(bc => bc.hazardous === editingWaste.isHazardous).map((bc) => (
                        <option key={bc.code} value={bc.code}>
                          {bc.code} - {bc.desc}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-3">
                    <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                      <input
                        type="checkbox"
                        checked={editingWaste.hazardUncertainty}
                        onChange={(e) => setEditingWaste({ ...editingWaste, hazardUncertainty: e.target.checked })}
                        className="accent-amber-500 w-4 h-4 rounded"
                      />
                      <span>¿Existe incertidumbre sobre su peligrosidad? (Requiere pronunciamiento técnico previo del MINAM)</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Sección 3: Estimación y Trazabilidad */}
              <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800/80 space-y-3">
                <span className="text-[11px] uppercase font-bold text-cyan-400 tracking-wider">
                  3. Cuantificación, Método y Fuente de Trazabilidad
                </span>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Cantidad Mensual *</label>
                    <input
                      type="number"
                      step="any"
                      min="0"
                      required
                      value={editingWaste.quantity}
                      onChange={(e) => setEditingWaste({ ...editingWaste, quantity: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Unidad de Medida</label>
                    <select
                      value={editingWaste.unit}
                      onChange={(e) => setEditingWaste({ ...editingWaste, unit: e.target.value as any })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                    >
                      <option value="KG_MES">kg/mes</option>
                      <option value="T_MES">t/mes (toneladas)</option>
                      <option value="L_MES">L/mes (litros)</option>
                      <option value="M3_MES">m3/mes</option>
                      <option value="UND_MES">und/mes (unidades)</option>
                    </select>
                  </div>

                  <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-2.5 flex flex-col justify-center">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">Generación Anual Proyectada</span>
                    <span className="text-sm font-mono font-bold text-cyan-300">
                      ≈ {computeAnnualKg(editingWaste.quantity, editingWaste.unit).toLocaleString()} kg/año
                    </span>
                  </div>

                  <div className="md:col-span-1">
                    <label className="block text-slate-300 font-semibold mb-1">Método de Estimación</label>
                    <select
                      value={editingWaste.measurementMethod}
                      onChange={(e) => setEditingWaste({ ...editingWaste, measurementMethod: e.target.value as EstimationMethod })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
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
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-slate-300 font-semibold mb-1">Fuente de Trazabilidad Verificable *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Balanza N° 2 de planta, Factura de compra mensual, Manifiesto N° 045..."
                      value={editingWaste.dataSource}
                      onChange={(e) => setEditingWaste({ ...editingWaste, dataSource: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>
              </div>

              {/* Sección 4: Color NTP 900.058 y Destino */}
              <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800/80 space-y-3">
                <span className="text-[11px] uppercase font-bold text-purple-400 tracking-wider">
                  4. Código de Colores NTP 900.058 y Operación Destino
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Color de Contenedor (NTP 900.058)</label>
                    <div className="flex items-center gap-2">
                      <select
                        value={editingWaste.colorCode}
                        onChange={(e) => setEditingWaste({ ...editingWaste, colorCode: e.target.value as ColorBinNTP })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 font-semibold focus:outline-none focus:border-purple-500"
                      >
                        {NTP_COLORS_NO_MUNICIPAL.map((c) => (
                          <option key={c.colorName} value={c.colorName.toUpperCase()}>
                            {c.colorName} - {c.type}
                          </option>
                        ))}
                      </select>
                      <span
                        className="w-8 h-8 rounded-lg shrink-0 border border-white/20"
                        style={{
                          backgroundColor: NTP_COLORS_NO_MUNICIPAL.find(c => c.colorName.toUpperCase() === editingWaste.colorCode)?.hex || '#333'
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Operación de Destino Primario</label>
                    <select
                      value={editingWaste.primaryDestination}
                      onChange={(e) => setEditingWaste({ ...editingWaste, primaryDestination: e.target.value as OperationType })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-purple-500"
                    >
                      <option value="VALORIZACION_MATERIAL">Valorización Material (Reciclaje / Reuso)</option>
                      <option value="VALORIZACION_ENERGETICA">Valorización Energética (Co-procesamiento)</option>
                      <option value="TRATAMIENTO">Tratamiento Físico/Químico</option>
                      <option value="DISPOSICION_FINAL">Disposición Final (Relleno Sanitario / Seguridad)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Empresa Operadora EO-RS Contratada</label>
                    <input
                      type="text"
                      placeholder="Nombre de la EO-RS"
                      value={editingWaste.authorizedOperatorName || ''}
                      onChange={(e) => setEditingWaste({ ...editingWaste, authorizedOperatorName: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">N° de Registro MINAM de la EO-RS</label>
                    <input
                      type="text"
                      placeholder="EO-RS-XXXX-XXXX"
                      value={editingWaste.operatorRegistryNumber || ''}
                      onChange={(e) => setEditingWaste({ ...editingWaste, operatorRegistryNumber: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-slate-300 font-semibold mb-1">Cargo / Rol Responsable</label>
                    <input
                      type="text"
                      value={editingWaste.responsibleRole}
                      onChange={(e) => setEditingWaste({ ...editingWaste, responsibleRole: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingWaste(null)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs border border-slate-700 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-colors cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Guardar Modificaciones</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
