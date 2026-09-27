import React, { useState } from 'react';
import { 
  Building2, 
  Truck, 
  MapPin, 
  AlertTriangle, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  Palette, 
  ShieldAlert, 
  Flame, 
  Compass, 
  Layers
} from 'lucide-react';
import { StorageArea, WasteItem } from '../../types';
import { NTP_COLORS_NO_MUNICIPAL } from '../../data/normativeCatalog';

interface StorageTransportStepProps {
  wastes: WasteItem[];
  storageAreas: StorageArea[];
  onUpdateStorage: (areas: StorageArea[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export const StorageTransportStep: React.FC<StorageTransportStepProps> = ({
  wastes,
  storageAreas,
  onUpdateStorage,
  onNext,
  onBack
}) => {
  // New Storage Area Form
  const [name, setName] = useState('');
  const [storageType, setStorageType] = useState<StorageArea['storageType']>('CENTRAL');
  const [locationDescription, setLocationDescription] = useState('');
  const [utmCoordinatesWgs84, setUtmCoordinatesWgs84] = useState('');
  const [dimensionsM2, setDimensionsM2] = useState<number>(100);
  const [capacityM3, setCapacityM3] = useState<number>(50);
  const [floorCharacteristics, setFloorCharacteristics] = useState('Losa de concreto con acabado epóxico y canaleta perimétrica');
  const [roofCharacteristics, setRoofCharacteristics] = useState('Techo a dos aguas con alero perimétrico contra lluvias');
  const [ventilationLighting, setVentilationLighting] = useState('Ventilación natural cruzada e iluminación antiexplosiva');
  const [spillContainmentKit, setSpillContainmentKit] = useState(true);
  const [fireExtinguishers, setFireExtinguishers] = useState(true);
  const [accessRestricted, setAccessRestricted] = useState(true);
  const [responsibleRole, setResponsibleRole] = useState('Supervisor SSOMA / Almacén Central');

  const handleAddStorage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    const newArea: StorageArea = {
      id: 'sa-' + Date.now(),
      name,
      storageType,
      locationDescription: locationDescription || 'Dentro del predio de la empresa',
      utmCoordinatesWgs84: utmCoordinatesWgs84 || 'Zona 18S Este: 281450 E / Norte: 8667300 N',
      dimensionsM2: Number(dimensionsM2) || 0,
      capacityM3: Number(capacityM3) || 0,
      floorCharacteristics,
      roofCharacteristics,
      ventilationLighting,
      signage: true,
      spillContainmentKit,
      fireExtinguishers,
      accessRestricted,
      wasteHandled: wastes.map(w => w.wasteName),
      maxStorageDays: storageType === 'CENTRAL' ? 180 : 30,
      responsibleRole
    };

    onUpdateStorage([...storageAreas, newArea]);
    setName('');
    setLocationDescription('');
    setUtmCoordinatesWgs84('');
  };

  const handleRemoveStorage = (id: string) => {
    onUpdateStorage(storageAreas.filter((s) => s.id !== id));
  };

  // Get active colors only from the wastes actually generated
  const activeColorCodes = Array.from(new Set(wastes.map((w) => w.colorCode)));
  const activeColorDefs = NTP_COLORS_NO_MUNICIPAL.filter((c) =>
    activeColorCodes.includes(c.colorName.toUpperCase() as any)
  );

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* Step Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-purple-400">Paso 6 de 7</span>
            <h2 className="text-xl font-black text-white">Almacenamiento (Coordenadas UTM) y Segregación NTP 900.058:2019</h2>
          </div>
        </div>
        <p className="text-xs text-slate-400">
          «El almacenamiento debe diferenciar áreas iniciales, intermedias y centrales con georreferenciación en UTM WGS 84». 
          La segregación según la NTP 900.058:2019 debe mostrar únicamente los colores de los residuos que la empresa realmente genera.
        </p>
      </div>

      {/* SECCIÓN 1: CÓDIGO DE COLORES NTP 900.058:2019 DE LA EMPRESA */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-xs uppercase font-bold text-white tracking-wider flex items-center gap-2">
            <Palette className="w-4 h-4 text-purple-400" />
            Código de Colores Aplicable a la Empresa (NTP 900.058:2019 - Ámbito No Municipal)
          </h3>
          <span className="text-[11px] text-emerald-400 font-semibold">
            {activeColorDefs.length} estaciones activas de {NTP_COLORS_NO_MUNICIPAL.length} posibles
          </span>
        </div>

        <p className="text-xs text-slate-400">
          Nota normativa 10 de la RM 089: No es necesaria la ubicación de todos los códigos de color de la NTP 900.058:2019, 
          sino únicamente aquellos correspondientes a los residuos efectivamente producidos en las zonas de trabajo.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {activeColorDefs.map((c) => (
            <div 
              key={c.colorName} 
              className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3"
            >
              <div 
                className="w-7 h-7 rounded-lg shrink-0 shadow-md border border-white/20 flex items-center justify-center font-bold text-xs"
                style={{ backgroundColor: c.hex, color: c.colorName === 'Blanco' || c.colorName === 'Amarillo' ? '#0f172a' : '#ffffff' }}
              >
                ✓
              </div>
              <div className="space-y-0.5">
                <span className="font-bold text-xs text-white">{c.type}</span>
                <p className="text-[11px] text-slate-400 font-medium">Color: {c.colorName}</p>
                <p className="text-[10px] text-slate-500 leading-tight">{c.examples}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECCIÓN 2: FORMULARIO DE ALMACENAMIENTO CON COORDENADAS UTM */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md space-y-5">
        <h3 className="text-xs uppercase font-bold text-white tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
          <MapPin className="w-4 h-4 text-emerald-400" />
          Registrar Área de Almacenamiento (Inicial, Intermedio o Central)
        </h3>

        <form onSubmit={handleAddStorage} className="space-y-4 text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Nombre del Almacén *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Almacén Central de Residuos Peligrosos"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Tipo de Almacenamiento *</label>
              <select
                value={storageType}
                onChange={(e) => setStorageType(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold"
              >
                <option value="CENTRAL">Almacenamiento Central (General / Peligrosos)</option>
                <option value="INTERMEDIO">Almacenamiento Intermedio (Patios de acopio)</option>
                <option value="INICIAL_PRIMARIO">Almacenamiento Inicial / Primario (En el puesto)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Coordenadas UTM WGS 84 * <span className="text-emerald-400 font-normal">(Obligatorio RM 089)</span>
              </label>
              <input
                type="text"
                value={utmCoordinatesWgs84}
                onChange={(e) => setUtmCoordinatesWgs84(e.target.value)}
                placeholder="Ej: 18S 281450 m E, 8667300 m N"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono placeholder-slate-600 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Ubicación Física en Planta</label>
              <input
                type="text"
                value={locationDescription}
                onChange={(e) => setLocationDescription(e.target.value)}
                placeholder="Ej: Sector Talleres Norte, a 150 m de oficinas"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Área / Dimensiones (m2)</label>
              <input
                type="number"
                min="1"
                value={dimensionsM2}
                onChange={(e) => setDimensionsM2(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Capacidad Volumétrica (m3)</label>
              <input
                type="number"
                min="1"
                value={capacityM3}
                onChange={(e) => setCapacityM3(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>
          </div>

          {/* Technical Specs according to Art 54 D.S. 014 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Características del Piso (Impermeabilidad)</label>
              <input
                type="text"
                value={floorCharacteristics}
                onChange={(e) => setFloorCharacteristics(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Protección Climática (Techo/Cerco)</label>
              <input
                type="text"
                value={roofCharacteristics}
                onChange={(e) => setRoofCharacteristics(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Ventilaciòn e Iluminación</label>
              <input
                type="text"
                value={ventilationLighting}
                onChange={(e) => setVentilationLighting(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
              />
            </div>
          </div>

          {/* Safety switches */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <label className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between cursor-pointer">
              <span className="text-slate-300">Sistema / Kit de derrames</span>
              <input
                type="checkbox"
                checked={spillContainmentKit}
                onChange={(e) => setSpillContainmentKit(e.target.checked)}
                className="accent-emerald-500"
              />
            </label>

            <label className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between cursor-pointer">
              <span className="text-slate-300">Extintores PQS / Incendio</span>
              <input
                type="checkbox"
                checked={fireExtinguishers}
                onChange={(e) => setFireExtinguishers(e.target.checked)}
                className="accent-red-500"
              />
            </label>

            <label className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between cursor-pointer">
              <span className="text-slate-300">Acceso restringido señalizado</span>
              <input
                type="checkbox"
                checked={accessRestricted}
                onChange={(e) => setAccessRestricted(e.target.checked)}
                className="accent-amber-500"
              />
            </label>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="py-2.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow cursor-pointer transition-colors"
            >
              + Guardar Área de Almacenamiento
            </button>
          </div>
        </form>
      </div>

      {/* Lista de Almacenes Registrados */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md space-y-4">
        <h3 className="text-xs uppercase font-bold text-white tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
          <Compass className="w-4 h-4 text-emerald-400" />
          Áreas de Almacenamiento Acreditadas en el PMMRS ({storageAreas.length})
        </h3>

        {storageAreas.length === 0 ? (
          <div className="py-8 text-center text-slate-500 text-xs">
            No se han registrado áreas de almacenamiento. Agregue al menos el Almacén Central con coordenadas UTM WGS 84.
          </div>
        ) : (
          <div className="space-y-3">
            {storageAreas.map((s, idx) => (
              <div key={s.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs text-slate-300">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center font-bold text-[10px]">
                      {idx + 1}
                    </span>
                    <strong className="text-white text-sm">{s.name}</strong>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                      {s.storageType}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    <strong className="text-slate-300">UTM WGS 84:</strong> <span className="font-mono text-cyan-300">{s.utmCoordinatesWgs84}</span> • Capacidad: {s.capacityM3} m3 ({s.dimensionsM2} m2)
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Piso: {s.floorCharacteristics} • Techo: {s.roofCharacteristics} • Kit Derrames: {s.spillContainmentKit ? 'Sí' : 'No'} • Extintores: {s.fireExtinguishers ? 'Sí' : 'No'}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveStorage(s.id)}
                  className="p-1.5 text-slate-500 hover:text-red-400 self-end md:self-center"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
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
          Regresar a Regímenes Especiales
        </button>

        <button
          onClick={onNext}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
        >
          <span>Ir a Indicadores, Cronograma y Presupuesto</span>
          <CheckCircle2 className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
