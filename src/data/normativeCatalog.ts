/**
 * Catálogo normativo oficial según:
 * - RM N.° 089-2023-MINAM (Anexos 1 al 12)
 * - Decreto Legislativo N.° 1278 y Ley N.° 32212
 * - D.S. N.° 014-2017-MINAM y D.S. N.° 001-2022-MINAM
 * - NTP 900.058:2019
 */

import { SectorType } from '../types';

export const NTP_COLORS_NO_MUNICIPAL = [
  {
    type: 'Papel y Cartón',
    colorName: 'Azul',
    hex: '#2563eb',
    bgClass: 'bg-blue-600',
    borderClass: 'border-blue-500',
    textClass: 'text-blue-400',
    examples: 'Papeles de oficina, revistas, folletos, sobres, cajas de cartón, empaques limpios sin plastificar.'
  },
  {
    type: 'Plástico',
    colorName: 'Blanco',
    hex: '#f8fafc',
    bgClass: 'bg-slate-100 text-slate-900',
    borderClass: 'border-slate-300',
    textClass: 'text-slate-200',
    examples: 'Envases plásticos, botellas PET, empaques, bolsas, zunchos, film stretch.'
  },
  {
    type: 'Metales',
    colorName: 'Amarillo',
    hex: '#eab308',
    bgClass: 'bg-yellow-500 text-slate-950',
    borderClass: 'border-yellow-400',
    textClass: 'text-yellow-400',
    examples: 'Envases metálicos, latas, retazos de fierro, alambres, cables sin forro, clavos, chatarra ferrosa y no ferrosa.'
  },
  {
    type: 'Orgánicos',
    colorName: 'Marrón',
    hex: '#78350f',
    bgClass: 'bg-amber-800',
    borderClass: 'border-amber-700',
    textClass: 'text-amber-500',
    examples: 'Restos de preparación de alimentos, comida de comedor/campamento, restos de jardinería, podas.'
  },
  {
    type: 'Vidrio',
    colorName: 'Plomo',
    hex: '#64748b',
    bgClass: 'bg-slate-500',
    borderClass: 'border-slate-400',
    textClass: 'text-slate-300',
    examples: 'Botellas de vidrio no contaminadas con reactivos o hidrocarburos, envases, lunas o vidrios planos enteros.'
  },
  {
    type: 'Peligrosos',
    colorName: 'Rojo',
    hex: '#dc2626',
    bgClass: 'bg-red-600',
    borderClass: 'border-red-500',
    textClass: 'text-red-400',
    examples: 'Material impregnado con sustancias químicas o hidrocarburos (trapos, waypes, EPPs contaminados), filtros, aceites usados, baterías, lámparas fluorescentes, envases de reactivos/pinturas/adhesivos, restos médicos de tópico.'
  },
  {
    type: 'No aprovechables',
    colorName: 'Negro',
    hex: '#0f172a',
    bgClass: 'bg-slate-900 border border-slate-700',
    borderClass: 'border-slate-700',
    textClass: 'text-slate-400',
    examples: 'Residuos de aseo personal, papel higiénico, papel carbón o encerado, colillas de cigarro, cerámicos rotos, residuos no reciclables no peligrosos.'
  }
];

export const RAEE_CATEGORIES = [
  { id: '1', name: 'Categoría 1: Grandes electrodomésticos (refrigeración, climatización, etc.)' },
  { id: '2', name: 'Categoría 2: Pequeños electrodomésticos (aspiradoras, tostadoras, ventiladores)' },
  { id: '3', name: 'Categoría 3: Equipos de informática y telecomunicaciones (computadoras, laptops, impresoras, routers, celulares)' },
  { id: '4', name: 'Categoría 4: Aparatos electrónicos de consumo (televisores, monitores, cámaras, equipos de sonido)' },
  { id: '5', name: 'Categoría 5: Aparatos de alumbrado (luminarias LED, balastros, tubos fluorescentes)' },
  { id: '6', name: 'Categoría 6: Herramientas eléctricas y electrónicas (taladros, sierras, soldadoras)' },
  { id: '7', name: 'Categoría 7: Juguetes o equipos deportivos y de tiempo libre' },
  { id: '8', name: 'Categoría 8: Aparatos médicos y equipos de laboratorio clínico' },
  { id: '9', name: 'Categoría 9: Instrumentos de vigilancia y control (sensores, termostatos, detectores)' },
  { id: '10', name: 'Categoría 10: Máquinas expendedoras automáticas' },
  { id: '11', name: 'Categoría 11: Paneles fotovoltaicos y módulos solares' }
];

export const NFU_CATEGORIES = [
  { id: 'A', name: 'Categoría A: Neumáticos con aro inferior a 25 pulgadas (vehículos livianos, camionetas, furgones)' },
  { id: 'B', name: 'Categoría B: Neumáticos con aro igual o superior a 25 pulgadas (camiones de carga pesada, maquinaria pesada)' }
];

export const BASEL_COMMON_CODES = [
  // Peligrosos (Lista A)
  { code: 'A1010', desc: 'Residuos metálicos con aleaciones de Sb, As, Be, Cd, Pb, Hg, Se, Te, Tl', hazardous: true },
  { code: 'A1020', desc: 'Residuos con contaminantes de plomo, mercurio, cadmio u otros metales', hazardous: true },
  { code: 'A1160', desc: 'Acumuladores y baterías de plomo ácido de desecho, enteros o triturados', hazardous: true },
  { code: 'A1180', desc: 'RAEE o restos con componentes de baterías, interruptores Hg, vidrio TRC, PCBs', hazardous: true },
  { code: 'A3020', desc: 'Aceites minerales usados no aptos para el uso original', hazardous: true },
  { code: 'A3050', desc: 'Residuos de resinas, látex, plastificantes, colas y adhesivos industriales', hazardous: true },
  { code: 'A3140', desc: 'Residuos de solventes y disolventes orgánicos no halogenados', hazardous: true },
  { code: 'A4020', desc: 'Residuos clínicos y afines, generados en tópicos o enfermerías de plantas', hazardous: true },
  { code: 'A4060', desc: 'Mezclas y emulsiones de hidrocarburos con agua y lodos de trampas de grasa/aceite', hazardous: true },
  { code: 'A4070', desc: 'Residuos de pinturas, tintas, barnices y solventes', hazardous: true },
  { code: 'A4130', desc: 'Envases y contenedores que tuvieron sustancias químicas o hidrocarburos', hazardous: true },
  { code: 'A4140', desc: 'Productos químicos vencidos o fuera de especificación técnica', hazardous: true },
  // No peligrosos (Lista B)
  { code: 'B1010', desc: 'Chatarra limpia de metales y aleaciones metálicas no dispersables', hazardous: false },
  { code: 'B1110', desc: 'Montajes eléctricos y electrónicos descontaminados sin baterías ni Hg', hazardous: false },
  { code: 'B2020', desc: 'Vidrios y restos de botellas en forma no dispersable', hazardous: false },
  { code: 'B2040', desc: 'Restos de drywall, yeso y escombros inertes de construcción civil', hazardous: false },
  { code: 'B3010', desc: 'Residuos plásticos segregados limpios (PE, PP, PET, etc.)', hazardous: false },
  { code: 'B3020', desc: 'Residuos de papel, cartón y cajas sin plastificar ni impregnar', hazardous: false },
  { code: 'B3050', desc: 'Residuos de madera limpia, pallets y embalajes no tratados químicamente', hazardous: false }
];

export const HAZARD_CHARACTERISTICS_CATALOG = [
  { code: 'H1_EXPLOSIVO', name: 'H1 - Explosivo', desc: 'Emite gas a temp/presión capaz de causar daño súbito' },
  { code: 'H3_LIQUIDO_INFLAMABLE', name: 'H3 - Líquidos Inflamables', desc: 'Punto de inflamación ≤ 60.5°C (solventes, combustibles)' },
  { code: 'H4.1_SOLIDO_INFLAMABLE', name: 'H4.1 - Sólidos Inflamables', desc: 'Combustibles por fricción o calor ordinario' },
  { code: 'H4.2_COMBUSTION_ESPONTANEA', name: 'H4.2 - Combustión Espontánea', desc: 'Calentamiento espontáneo al contacto con aire' },
  { code: 'H4.3_EMITE_GASES_INFLAMABLES', name: 'H4.3 - Emite Gases Inflamables al contacto con agua', desc: 'Reacciona liberando gases peligrosos' },
  { code: 'H5.1_OXIDANTE', name: 'H5.1 - Oxidante / Comburente', desc: 'Favorece o causa la combustión de otros materiales al ceder oxígeno' },
  { code: 'H5.2_PEROXIDO_ORGANICO', name: 'H5.2 - Peróxidos Orgánicos', desc: 'Estructura bivalente inestable térmicamente' },
  { code: 'H6.1_TOXICO_AGUDO', name: 'H6.1 - Tóxicos Agudos (Venenos)', desc: 'Causa muerte o lesiones graves por inhalación, ingestión o piel' },
  { code: 'H6.2_INFECCIOSO', name: 'H6.2 - Sustancias Infecciosas / Patogénicas', desc: 'Contiene microorganismos viables patógenos o toxinas' },
  { code: 'H8_CORROSIVO', name: 'H8 - Corrosivo', desc: 'Destruye tejidos vivos o ataca metales (pH < 2 o > 11.5)' },
  { code: 'H10_LIBERA_GASES_TOXICOS', name: 'H10 - Libera Gases Tóxicos al aire/agua', desc: 'Genera vapores asfixiantes o tóxicos' },
  { code: 'H11_TOXICO_CRONICO', name: 'H11 - Sustancias Tóxicas Retardadas o Crónicas', desc: 'Efectos a largo plazo, carcinógeno, mutagénico' },
  { code: 'H12_ECOTOXICO', name: 'H12 - Ecotóxico', desc: 'Bioacumulable o letal en flora/fauna/medios acuáticos' },
  { code: 'H13_LIXIVIABLE_PELIGROSO', name: 'H13 - Generador de lixiviados peligrosos', desc: 'Al descomponerse genera sustancias peligrosas' }
];

export const RM_089_CHAPTERS = [
  {
    number: 1,
    title: 'Presentación / Introducción',
    description: 'Planteamiento de la problemática específica de residuos en la empresa y cómo se abordará con el PMMRS (sin copiar texto literal de la norma).',
    requiredFields: ['Contexto empresarial', 'Problemática identificada', 'Enfoque de solución']
  },
  {
    number: 2,
    title: 'Objetivos',
    description: 'Enuncia la idea central: Primero, prevención y minimización en la fuente. Segundo, gestión y manejo de residuos ya generados, priorizando valorización.',
    requiredFields: ['Objetivo de minimización/prevención', 'Objetivo de gestión/valorización']
  },
  {
    number: 3,
    title: 'Alcance',
    description: 'Ámbito físico y funcional: instalaciones administrativas y operativas, etapas del ciclo (planificación, construcción, operación, mantenimiento, cierre), contratistas, proveedores y visitantes.',
    requiredFields: ['Sedes e instalaciones', 'Etapas del proyecto', 'Personal obligatorio (empleados, contratistas)']
  },
  {
    number: 4,
    title: 'Identificación, características y estimación de residuos sólidos',
    description: 'Diagrama de flujo simplificado por etapa, caracterización física/química/biológica y de peligrosidad, y estimación cuantitativa mensual/anual con método de cálculo.',
    subsections: [
      '4.1 Fuentes de generación (Diagrama de flujo)',
      '4.2 Características y clasificación de peligrosidad (Anexos III y V)',
      '4.3 Estimación de masa, volumen o unidades'
    ],
    requiredFields: ['Diagrama de procesos', 'Clasificación de peligrosidad', 'Cuantificación con trazabilidad']
  },
  {
    number: 5,
    title: 'Estrategias para la prevención y/o minimización',
    description: 'Medidas concretas de cambio tecnológico, sustitución de insumos, compras sostenibles, aprovechamiento de material de descarte (Art. 9) y régimen REP de bienes priorizados (RAEE, NFU).',
    subsections: [
      '5.1 Prevenir y/o minimizar en la fuente',
      '5.2 Material de descarte (si aplica)',
      '5.3 Régimen especial de bienes priorizados (RAEE, NFU)'
    ],
    requiredFields: ['Fichas de minimización con causas reales', 'Medidas de jerarquía superior', 'Evaluación de bienes priorizados']
  },
  {
    number: 6,
    title: 'Gestión y manejo de residuos sólidos',
    description: 'Detalle de las operaciones del Art. 32 de la LGIRS: Segregación (NTP 900.058:2019), Recolección selectiva, Almacenamiento (inicial, intermedio, central con UTM WGS84), Transporte (EO-RS), Acondicionamiento, Valorización, Tratamiento y Disposición final.',
    subsections: [
      'a) Segregación en la fuente',
      'b) Recolección selectiva',
      'c) Almacenamiento (inicial, intermedio, central con coordenadas UTM)',
      'd) Transporte externo con EO-RS',
      'e) Acondicionamiento',
      'f) Valorización (material y energética)',
      'g) Tratamiento',
      'h) Disposición final'
    ],
    requiredFields: ['Código de colores aplicado', 'Almacén central con condiciones técnicas y UTM', 'Identificación de EO-RS y destinos autorizados']
  },
  {
    number: 7,
    title: 'Descripción de las medidas ambientales',
    description: 'Resumen articulado de medidas para prevenir, mitigar y corregir impactos ambientales identificados en el IGA (Anexo 11 de la RM).',
    requiredFields: ['Relación Impacto -> Medida -> Compromiso ambiental -> Responsable']
  },
  {
    number: 8,
    title: 'Medidas de atención ante emergencias',
    description: 'Procedimientos específicos ante contingencias con residuos (derrames de aceite, incendios en almacén, reactividad química) antes, durante y después del incidente, articulado con el Plan de Contingencias del IGA.',
    requiredFields: ['Matriz de contingencias por residuo peligroso', 'Acciones antes, durante y después']
  },
  {
    number: 9,
    title: 'Indicadores de seguimiento y control',
    description: 'Indicadores de desempeño cuantitativos con fórmula, unidad, línea base, meta, frecuencia y medio de verificación (no solo conteo de actividades).',
    requiredFields: ['Indicador de generación', 'Indicador de minimización', 'Indicador de valorización', 'Línea base y meta definida']
  },
  {
    number: 10,
    title: 'Cronograma de implementación',
    description: 'Programación temporal mensual, trimestral o anual para todas las medidas del PMMRS a lo largo de la ejecución.',
    requiredFields: ['Programación temporal mensual/trimestral', 'Articulación con las medidas del capítulo 5']
  },
  {
    number: 11,
    title: 'Presupuesto y recursos necesarios',
    description: 'Estimación económica y recursos requeridos (CAPEX para contenedores/infraestructura, OPEX para servicios de EO-RS, EPP, capacitaciones).',
    requiredFields: ['Costos unitarios y totales', 'Clasificación CAPEX/OPEX', 'Cálculo de subtotal y total']
  },
  {
    number: 12,
    title: 'Funciones del responsable de la gestión y manejo',
    description: 'Funciones y responsabilidades claras asignadas a cargos reales (SSOMA, Operaciones, Logística, Mantenimiento, Gerencia) según Art. 48 del Reglamento de la LGIRS.',
    requiredFields: ['Responsable del área ambiental/SSOMA', 'Funciones operativas y de compras', 'Gestión de contratistas']
  },
  {
    number: 13,
    title: 'Anexos',
    description: 'Paquete documental de soporte: diagramas de flujo, tablas de estimación, hojas SDS/MSDS, planos de almacenamiento con UTM, registros de inspección y evidencias.',
    requiredFields: ['Anexo 2 Diagrama de flujo', 'Anexo 3/7 Matriz de residuos', 'Anexo 10 Incompatibilidades', 'Anexo 11 Resumen integrado']
  }
];

export const SECTOR_PRESETS: Record<SectorType, {
  name: string;
  defaultProcesses: { name: string; activity: string; inputs: string; expectedWaste: string; hazardous: boolean }[];
  suggestedMeasures: string[];
}> = {
  CONSULTORA: {
    name: 'Consultoría y Servicios Profesionales',
    defaultProcesses: [
      { name: 'Gestión Administrativa', activity: 'Impresión y trámites de oficina', inputs: 'Papel bond, tóneres, clips', expectedWaste: 'Papel y cartón de oficina', hazardous: false },
      { name: 'Mantenimiento de Equipos TI', activity: 'Renovación de computadoras y periféricos', inputs: 'Equipos de cómputo, cables', expectedWaste: 'RAEE (Cat. 3 Informática)', hazardous: true },
      { name: 'Consumo del Personal', activity: 'Refrigerios y cafetería', inputs: 'Alimentos, bebidas, botellas', expectedWaste: 'Botellas PET y restos orgánicos', hazardous: false }
    ],
    suggestedMeasures: [
      'Política de oficina sin papel (digitalización integral de informes)',
      'Programa de extensión de vida útil de laptops y donación formal de RAEE a sistemas colectivos autorizados',
      'Eliminación de plásticos de un solo uso en salas de reuniones y comedores'
    ]
  },
  CONSTRUCCION: {
    name: 'Construcción y Obras Civiles',
    defaultProcesses: [
      { name: 'Movimiento de Tierras y Excavación', activity: 'Desmonte y retiro de material', inputs: 'Maquinaria pesada, combustible', expectedWaste: 'Material excedente de obra (Material de descarte)', hazardous: false },
      { name: 'Obras Civiles y Estructuras', activity: 'Vaciado de concreto, encofrado y armado', inputs: 'Cemento, aditivos, madera, fierro', expectedWaste: 'Escombros de concreto, retazos de madera, alambres', hazardous: false },
      { name: 'Acabados y Pintura', activity: 'Pintado de muros y sellado de juntas', inputs: 'Pinturas látex/óleo, solventes, brochas', expectedWaste: 'Envases de pintura vacíos y waypes impregnados con solvente', hazardous: true },
      { name: 'Mantenimiento de Maquinaria en Obra', activity: 'Engrase y cambio de filtros de equipo pesado', inputs: 'Aceite hidráulico, grasas, filtros', expectedWaste: 'Aceite usado y filtros de aceite', hazardous: true }
    ],
    suggestedMeasures: [
      'Reaprovechamiento de material excedente de excavación como relleno o base granular (Material de descarte)',
      'Optimización de corte de acero y madera en taller de prefabricados para reducir mermas en un 20%',
      'Adquisición de pintura y selladores en presentaciones industriales de 5 galones o tambores retornables',
      'Convenio con EO-RS autorizada para reciclaje de chatarra metálica ferrosa de encofrados'
    ]
  },
  COMERCIO: {
    name: 'Comercio, Almacenes y Retail',
    defaultProcesses: [
      { name: 'Recepción y Desembalaje', activity: 'Apertura de mercadería y desempaque', inputs: 'Cajas de cartón, film stretch, pallets', expectedWaste: 'Cartón corrugado y plástico film (LDPE)', hazardous: false },
      { name: 'Operación Logística de Montacargas', activity: 'Carga de baterías y traslado interno', inputs: 'Baterías industriales, cargadores', expectedWaste: 'Baterías fuera de uso (Plomo ácido)', hazardous: true },
      { name: 'Atención al Cliente y Ventas', activity: 'Entrega de productos y limpieza', inputs: 'Bolsas, papel térmico, artículos de aseo', expectedWaste: 'Residuos no aprovechables de limpieza', hazardous: false }
    ],
    suggestedMeasures: [
      'Implementación de pallets plásticos retornables en circuito cerrado con proveedores',
      'Venta y valorización de cartón corrugado y plástico film mediante EO-RS autorizada',
      'Sustitución de flejes de plástico de un solo uso por correas de sujeción reutilizables'
    ]
  },
  MINERIA: {
    name: 'Minería y Beneficio de Minerales',
    defaultProcesses: [
      { name: 'Mantenimiento de Flota de Acarreo', activity: 'Cambio periódico de neumáticos de volquete', inputs: 'Neumáticos gigantes aro >25"', expectedWaste: 'Neumáticos Fuera de Uso - NFU (Categoría B)', hazardous: false },
      { name: 'Taller de Soldadura y Calderería', activity: 'Reparación de tolvas y cucharones', inputs: 'Soldadura, planchas antidesgaste', expectedWaste: 'Colillas de soldadura y chatarra metálica pesada', hazardous: false },
      { name: 'Operación de Maquinaria y Planta', activity: 'Lubricación de transmisiones y motores', inputs: 'Aceites lubricantes, filtros', expectedWaste: 'Aceite dieléctrico/lubricante usado y trapos contaminados', hazardous: true },
      { name: 'Laboratorio Químico de Ensayos', activity: 'Análisis gravimétrico y absorción atómica', inputs: 'Ácido nítrico, cianuro, reactivos', expectedWaste: 'Soluciones ácidas gastadas y envases de reactivos', hazardous: true }
    ],
    suggestedMeasures: [
      'Reencauche y gestión de NFU Cat B con operador de sistema colectivo aprobado',
      'Filtrado y recirculación de aceites hidráulicos en planta para extender intervalo de cambio en 35%',
      'Coprocesamiento de aceites usados en hornos industriales autorizados',
      'Neutralización controlada de soluciones ácidas de laboratorio antes de entrega a EO-RS'
    ]
  },
  SERVICIOS_GENERALES: {
    name: 'Servicios Generales, Talleres e Instalaciones',
    defaultProcesses: [
      { name: 'Mantenimiento Mecánico de Vehículos', activity: 'Mantenimiento preventivo de motores', inputs: 'Aceite de motor, refrigerantes', expectedWaste: 'Aceite quemado y filtros metálicos', hazardous: true },
      { name: 'Limpieza y Acondicionamiento', activity: 'Lavado de piezas y desengrase', inputs: 'Desengrasantes biodegradables, paños', expectedWaste: 'Trapos impregnados con hidrocarburos', hazardous: true },
      { name: 'Servicios de Impresión y Logística', activity: 'Operación de oficina y despacho', inputs: 'Cajas, cintas, papel', expectedWaste: 'Residuos de embalaje', hazardous: false }
    ],
    suggestedMeasures: [
      'Sustitución de desengrasantes base solvente por soluciones acuosas alcalinas biodegradables',
      'Uso de paños de limpieza lavables y reutilizables en circuito cerrado con lavandería industrial autorizada',
      'Almacén con piso epóxico estanco y fosa de retención de derrames al 110% de capacidad'
    ]
  },
  AGRICOLA: {
    name: 'Agrícola, Agroindustrial y Riego',
    defaultProcesses: [
      { name: 'Sanidad Vegetal y Fumigación', activity: 'Aplicación de defensivos agrícolas', inputs: 'Agroquímicos, agua, adherentes', expectedWaste: 'Envases vacíos de plaguicidas con triple lavado', hazardous: true },
      { name: 'Sistema de Riego Tecnificado', activity: 'Mantenimiento y recambio de mangueras', inputs: 'Mangueras de polietileno con goteros', expectedWaste: 'Cintas y mangueras de riego deterioradas (Plástico)', hazardous: false },
      { name: 'Poda y Cosecha', activity: 'Aclareo de plantaciones y cosecha', inputs: 'Herramientas de corte, cajas', expectedWaste: 'Restos vegetales de poda', hazardous: false }
    ],
    suggestedMeasures: [
      'Compostaje in situ de restos de poda y biomasa vegetal como mejorador de suelo (hasta 2 t/día)',
      'Protocolo riguroso de Triple Lavado e inutilización de envases de agroquímicos antes de entrega a Campo Limpio',
      'Reciclaje mecánico de cintas de riego de polietileno con EO-RS autorizada'
    ]
  },
  INDUSTRIA_MANUFACTURERA: {
    name: 'Industria Manufacturera y Producción',
    defaultProcesses: [
      { name: 'Línea de Envasado y Embalaje', activity: 'Empaque de producto terminado', inputs: 'Cartón, plástico termocontraíble', expectedWaste: 'Mermas limpias de empaque (Material de descarte)', hazardous: false },
      { name: 'Mantenimiento de Líneas de Producción', activity: 'Limpieza con solventes y cambio de sellos', inputs: 'Solventes, juntas de teflón, grasas', expectedWaste: 'Residuos impregnados y envases químicos', hazardous: true }
    ],
    suggestedMeasures: [
      'Reincorporación directa de mermas de plástico limpio al proceso productivo (merma interna)',
      'Modificación de empaques con criterios de ecodiseño (reducción del gramaje en 15%)',
      'Separación y venta de chatarra no ferrosa para valorización material'
    ]
  },
  HIDROCARBUROS: {
    name: 'Hidrocarburos y Derivados',
    defaultProcesses: [
      { name: 'Perforación y Extracción', activity: 'Uso de lodos de perforación', inputs: 'Lodo base agua / sintético', expectedWaste: 'Recortes de perforación (Cuttings)', hazardous: true },
      { name: 'Mantenimiento de Tuberías y Válvulas', activity: 'Raspado y purga de oleoductos', inputs: 'Raspadores, solventes', expectedWaste: 'Borras aceitosas y lodos de fondo de tanque', hazardous: true }
    ],
    suggestedMeasures: [
      'Uso preferente de lodos de perforación base agua sobre lodos sintéticos tóxicos (Anexo 9 RM 089)',
      'Biorremediación en sitio o solidificación/estabilización con EO-RS especializada',
      'Recuperación de hidrocarburos residuales de fondos de tanque'
    ]
  },
  ENERGIA: {
    name: 'Energía y Electricidad',
    defaultProcesses: [
      { name: 'Mantenimiento de Subestaciones', activity: 'Inspección de transformadores', inputs: 'Aceite dieléctrico, empaquetaduras', expectedWaste: 'Aceite dieléctrico usado (análisis libre de PCBs)', hazardous: true },
      { name: 'Cambio de Líneas de Transmisión', activity: 'Reemplazo de aisladores y conductores', inputs: 'Conductores de aluminio, aisladores vidrio', expectedWaste: 'Chatarra de aluminio y aisladores de porcelana/vidrio', hazardous: false }
    ],
    suggestedMeasures: [
      'Regeneración y desgasificación de aceites dieléctricos para reutilización en transformadores',
      'Certificación analítica de ausencia de bifenilos policlorados (PCBs < 50 ppm)',
      'Valorización del 100% de conductores de cobre y aluminio'
    ]
  },
  SALUD: {
    name: 'Establecimientos de Salud y Servicios Médicos',
    defaultProcesses: [
      { name: 'Atención Médica y Tópico', activity: 'Atención ambulatoria y curaciones', inputs: 'Gasas, jeringas, agujas, medicamentos', expectedWaste: 'Residuos biocontaminados y punzocortantes', hazardous: true },
      { name: 'Área Administrativa', activity: 'Historias clínicas y recepción', inputs: 'Papel, cartón, carpetas', expectedWaste: 'Papel y cartón similar a municipal', hazardous: false }
    ],
    suggestedMeasures: [
      'Segregación estricta en cajas rígidas de bioseguridad para punzocortantes',
      'Esterilización por autoclave antes de disposición o entrega exclusiva a EO-RS autorizada de salud',
      'Capacitación continua en bioseguridad y uso de código de colores según NTS MINSA'
    ]
  },
  OTRO: {
    name: 'Otro Sector Productivo / Extractivo',
    defaultProcesses: [
      { name: 'Operación General', activity: 'Actividad productiva y de soporte', inputs: 'Materiales diversos', expectedWaste: 'Residuos no municipales generales', hazardous: false }
    ],
    suggestedMeasures: [
      'Diagnóstico inicial de flujo de materiales para identificar puntos de reducción',
      'Implementación del código de colores según NTP 900.058:2019'
    ]
  }
};
