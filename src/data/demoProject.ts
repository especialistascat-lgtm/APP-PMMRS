import { PmmrsProject, PmmrsReviewReport } from '../types';

export const DEMO_PROJECT: PmmrsProject = {
  id: 'proj-demo-001',
  version: 'v1.0',
  status: 'EN_REVISION',
  lastModified: '2026-09-27T10:00:00Z',
  company: {
    id: 'comp-demo-001',
    businessName: 'MINERA & CONSTRUCCIÓN ANDINA S.A.C. [DATOS DE DEMOSTRACIÓN]',
    tradeName: 'ANDINA CORP S.A.C.',
    ruc: '20554433221',
    sector: 'MINERIA',
    mainActivity: 'Extracción, acarreo y beneficio de minerales polimetálicos y obras de infraestructura complementaria',
    secondaryActivities: 'Mantenimiento de flota de transporte pesado, campamento minero y talleres mecánicos',
    address: 'Av. Industrial N° 450, Parque Industrial Callao / Unidad Minera Esperanza Km 42',
    department: 'Lima',
    province: 'Lima',
    district: 'Callao',
    facilityName: 'Unidad Operativa Minera Esperanza',
    contactPerson: 'Ing. Carlos Mendoza Alva',
    contactRole: 'Jefe de Seguridad, Salud Ocupacional y Medio Ambiente (SSOMA)',
    contactEmail: 'ssoma@andinacorp-demo.pe',
    contactPhone: '+51 987 654 321',
    hasIga: true,
    igaType: 'EIA_SD',
    igaResolutionNumber: 'R.D. N° 045-2022-MINEM/DGAAM',
    igaApprovalDate: '2022-05-18',
    competentAuthority: 'OEFA / MINEM (DGAAM)',
    tdrReference: 'TDR Comunes D.S. N° 014-2017-MINAM y R.M. N° 089-2023-MINAM',
    activeStages: ['CONSTRUCCION', 'OPERACION_MANTENIMIENTO', 'CIERRE_ABANDONO'],
    hasHazardousWaste: true,
    hasPriorityGoods: true,
    hasDiscardMaterial: true,
    hasInternalRecovery: true,
    hasOutsourcedOperations: true,
    hasContractorsGeneratingWaste: true
  },
  wastes: [
    {
      id: 'w-01',
      stage: 'OPERACION_MANTENIMIENTO',
      area: 'Taller de Mantenimiento Mecánico',
      process: 'Mantenimiento preventivo de camiones de acarreo CAT 777',
      activity: 'Cambio de aceite de motor y transmisión',
      wasteName: 'Aceite lubricante usado',
      physicalState: 'LIQUIDO',
      isHazardous: true,
      hazardCharacteristics: ['H3_LIQUIDO_INFLAMABLE', 'H12_ECOTOXICO'],
      hazardUncertainty: false,
      baselCode: 'A3020',
      managementScope: 'NO_MUNICIPAL',
      isPriorityGood: false,
      quantity: 1200,
      unit: 'L_MES',
      annualQuantityKg: 12960,
      measurementMethod: 'PESAJE_DIRECTO',
      dataSource: 'Balanzas calibradas del Taller Mecánico y Manifiestos de Carga',
      colorCode: 'ROJO',
      primaryDestination: 'VALORIZACION_ENERGETICA',
      authorizedOperatorName: 'OPERADORA AMBIENTAL DEL PERÚ S.A.C. (EO-RS)',
      operatorRegistryNumber: 'EO-RS-0024-2021-MINAM',
      destinationFacility: 'Planta de Co-procesamiento Cemento Andino',
      responsibleRole: 'Supervisor de Mantenimiento Mecánico / SSOMA',
      notes: 'Almacenado en cilindros de 55 galones sobre fosa estanca de contención secundaria.'
    },
    {
      id: 'w-02',
      stage: 'OPERACION_MANTENIMIENTO',
      area: 'Taller de Neumáticos y Bahía de Equipos',
      process: 'Recambio por desgaste de neumáticos en volquetes mineros',
      activity: 'Desmontaje de neumáticos fuera de servicio',
      wasteName: 'Neumáticos Fuera de Uso (NFU) aro 25" y mayores',
      physicalState: 'SOLIDO',
      isHazardous: false,
      hazardCharacteristics: ['NO_APLICA'],
      hazardUncertainty: false,
      baselCode: 'B3140',
      managementScope: 'NO_MUNICIPAL',
      isPriorityGood: true,
      priorityGoodType: 'NFU',
      priorityCategory: 'Categoría B (Aro >= 25 pulgadas)',
      quantity: 12,
      unit: 'UND_MES',
      annualQuantityKg: 14400,
      measurementMethod: 'REGISTRO_INTERNO',
      dataSource: 'Kardex de Neumáticos y Almacén de Tránsito',
      colorCode: 'NEGRO',
      primaryDestination: 'VALORIZACION_MATERIAL',
      authorizedOperatorName: 'SISTEMA COLECTIVO RECICLA-LLANTA PERÚ (EO-RS)',
      operatorRegistryNumber: 'EO-RS-0112-2022-MINAM',
      destinationFacility: 'Planta de trituración y pirólisis ecológica Chilca',
      responsibleRole: 'Jefe de Almacén General / SSOMA',
      notes: 'Sujeto al Régimen Especial D.S. N° 024-2021-MINAM.'
    },
    {
      id: 'w-03',
      stage: 'OPERACION_MANTENIMIENTO',
      area: 'Almacén Central y Despacho',
      process: 'Recepción de repuestos y materiales de proveedores',
      activity: 'Desembalaje y acondicionamiento en anaqueles',
      wasteName: 'Cartón corrugado y cajas de embalaje',
      physicalState: 'SOLIDO',
      isHazardous: false,
      hazardCharacteristics: ['NO_APLICA'],
      hazardUncertainty: false,
      baselCode: 'B3020',
      managementScope: 'SIMILAR_AL_MUNICIPAL',
      isPriorityGood: false,
      quantity: 450,
      unit: 'KG_MES',
      annualQuantityKg: 5400,
      measurementMethod: 'PESAJE_DIRECTO',
      dataSource: 'Ticket de pesaje en balanza de plataforma de Almacén',
      colorCode: 'AZUL',
      primaryDestination: 'VALORIZACION_MATERIAL',
      authorizedOperatorName: 'ASOCIACIÓN DE RECICLADORES FORMALIZADOS EL ROBLE',
      operatorRegistryNumber: 'REG-MUNICIPAL-2024-019',
      destinationFacility: 'Planta papelera recuperadora Trupal',
      responsibleRole: 'Encargado de Segregación en Almacén',
      notes: 'Compactado y enfardado en fardos de 50 kg para optimizar volumen.'
    },
    {
      id: 'w-04',
      stage: 'CONSTRUCCION',
      area: 'Frente de Obra de Cancha de Relaves',
      process: 'Excavación para cimentación de muro de contención',
      activity: 'Perfilado y corte de terreno natural',
      wasteName: 'Material pétreo y suelo excedente de remoción',
      physicalState: 'SOLIDO',
      isHazardous: false,
      hazardCharacteristics: ['NO_APLICA'],
      hazardUncertainty: false,
      baselCode: 'B2040',
      managementScope: 'NO_MUNICIPAL',
      isPriorityGood: false,
      quantity: 80,
      unit: 'T_MES',
      annualQuantityKg: 960000,
      measurementMethod: 'BALANCE_MATERIA',
      dataSource: 'Topografía de obra y metrados de movimiento de tierras',
      colorCode: 'NEGRO',
      primaryDestination: 'VALORIZACION_MATERIAL',
      responsibleRole: 'Ingeniero Residente de Obra',
      notes: 'Declarado como MATERIAL DE DESCARTE (Art. 9 D.L. 1278) para terraplén y caminos de acarreo internos.'
    },
    {
      id: 'w-05',
      stage: 'OPERACION_MANTENIMIENTO',
      area: 'Tópico Médico de Unidad',
      process: 'Atención primaria y urgencias del personal',
      activity: 'Curación de heridas y toma de muestras',
      wasteName: 'Residuos biocontaminados y punzocortantes',
      physicalState: 'SOLIDO',
      isHazardous: true,
      hazardCharacteristics: ['H6.2_INFECCIOSO'],
      hazardUncertainty: false,
      baselCode: 'A4020',
      managementScope: 'NO_MUNICIPAL',
      isPriorityGood: false,
      quantity: 35,
      unit: 'KG_MES',
      annualQuantityKg: 420,
      measurementMethod: 'REGISTRO_INTERNO',
      dataSource: 'Libro de registro diario de residuos de salud de tópico',
      colorCode: 'ROJO',
      primaryDestination: 'TRATAMIENTO',
      authorizedOperatorName: 'BIORESIDUOS DEL SUR S.A.C. (EO-RS)',
      operatorRegistryNumber: 'EO-RS-0056-2020-MINAM',
      destinationFacility: 'Planta de autoclave Huachipa y relleno de seguridad',
      responsibleRole: 'Médico Ocupacional / Enfermera de turno',
      notes: 'Desechados en bolsas rojas de 50 micras y cajas rígidas amarillas con símbolo de bioseguridad.'
    }
  ],
  minimizationMeasures: [
    {
      id: 'm-01',
      wasteId: 'w-01',
      wasteName: 'Aceite lubricante usado',
      sourceProcess: 'Mantenimiento preventivo de camiones de acarreo CAT 777',
      problemStatement: 'Generación de 1,200 L/mes debido a intervalos de cambio fijos por horas de motor sin análisis previo del estado del fluido.',
      hierarchyLevel: '3_REDUCIR',
      measureName: 'Programa de monitoreo por espectrometría de desgaste (SOS Oil Analysis)',
      detailedAction: 'Implementar muestreo de aceite a las 250 horas para extender cambios hasta las 500 horas si la viscosidad y partículas metálicas cumplen estándares de fabricante. Esto reduce la frecuencia de drenado en un 30%.',
      responsibleRole: 'Jefe de Mantenimiento Mecánico',
      resourcesNeeded: 'Kit de muestreo, contrato con laboratorio de lubricantes acreditado INACAL',
      baseline: '1,200 L/mes (promedio año 2025)',
      targetGoal: 'Reducir la generación a 840 L/mes (-30%) al mes 4 de implementación',
      indicatorName: 'Consumo y desecho de lubricante específico',
      indicatorFormula: '(Lts aceite desechado / Horas operativas de flota) * 100',
      frequency: 'MENSUAL',
      verificationEvidence: 'Reportes de análisis SOS del laboratorio y registros de pesaje de almacén de lubricantes',
      estimatedCostPen: 12500,
      scheduleMonthStart: 1,
      scheduleMonthEnd: 6,
      technicalFeasibility: 'Validado por especificaciones técnicas del fabricante de maquinaria Caterpillar.',
      economicFeasibility: 'Ahorro estimado en compra de aceite virgen de S/ 48,000 anuales.',
      environmentalFeasibility: 'Evita la generación de 4,320 litros anuales de residuo peligroso inflamable.',
      capexOpex: 'OPEX'
    },
    {
      id: 'm-02',
      wasteId: 'w-03',
      wasteName: 'Cartón corrugado y cajas de embalaje',
      sourceProcess: 'Recepción de repuestos y materiales de proveedores',
      problemStatement: 'Proveedores entregan repuestos en cajas individuales descartables de cartón de un solo uso.',
      hierarchyLevel: '2_SUSTITUIR',
      measureName: 'Implementación de gavetas plásticas reutilizables con proveedores frecuentes',
      detailedAction: 'Establecer acuerdos comerciales para que los 5 proveedores clave de pernos y repuestos menores utilicen gavetas plásticas colapsables y retornables.',
      responsibleRole: 'Jefe de Compras y Logística',
      resourcesNeeded: '100 gavetas plásticas norma DIN, protocolo de logística inversa',
      baseline: '450 kg/mes de cartón',
      targetGoal: 'Disminuir 150 kg/mes de residuos de cartón de embalaje (-33%)',
      indicatorName: 'Generación específica de embalaje',
      indicatorFormula: 'Kg cartón generado / Número de órdenes de compra recibidas',
      frequency: 'MENSUAL',
      verificationEvidence: 'Guías de remisión con control de retorno de embalaje y pesajes de Almacén',
      estimatedCostPen: 8000,
      scheduleMonthStart: 2,
      scheduleMonthEnd: 12,
      technicalFeasibility: 'Factible en circuito cerrado de distribución Lima-Unidad.',
      economicFeasibility: 'Inversión única en gavetas compensada con menor costo de disposición.',
      environmentalFeasibility: 'Promueve ecoeficiencia y economía circular según D.L. 1278.',
      capexOpex: 'CAPEX'
    }
  ],
  discardMaterials: [
    {
      id: 'dm-01',
      materialName: 'Roca estéril y grava de remoción clasificada',
      generatingProcess: 'Desbroce y excavación de accesos mineros',
      physicalCharacteristics: 'Material rocoso inerte, granulometría 2" a 6", libre de sulfuros piríticos',
      estimatedQuantityKgMonth: 80000,
      frequency: 'Semanal',
      destinationActivity: 'Construcción y nivelación de vías de acarreo internas y bermas de seguridad',
      recipientCompanyRuc: '20554433221',
      recipientCompanyName: 'MINERA & CONSTRUCCIÓN ANDINA S.A.C.',
      storageConditions: 'Apilado temporal en plataforma impermeabilizada con canal de coronación',
      transportVehicleType: 'Volquete 15 m3 propio',
      transportModality: 'PROPIO',
      evidenceOfReuse: 'Cuaderno de obra de ingeniería civil y registro topográfico de avances',
      legalNoticeDate: '2024-03-12'
    }
  ],
  priorityGoods: [
    {
      id: 'pg-01',
      regime: 'NFU',
      goodDescription: 'Llantas de camión minero aro 25" y aro 49"',
      category: 'Categoría B (Aro >= 25 pulgadas)',
      unitsPerYear: 144,
      massKgPerYear: 14400,
      periodicity: 'Mensual (según horómetro)',
      authorizedCollectorOrSystem: 'Sistema Colectivo Nacional de Manejo NFU Perú',
      evidenceRef: 'Certificados de recepción y trazabilidad del Sistema Colectivo'
    },
    {
      id: 'pg-02',
      regime: 'RAEE',
      goodDescription: 'Monitores, laptops, servidores y switches dados de baja',
      category: 'Categoría 3 (Equipos de informática y telecomunicaciones)',
      unitsPerYear: 35,
      massKgPerYear: 280,
      periodicity: 'Semestral',
      authorizedCollectorOrSystem: 'Sistema de Manejo RAEE autorizado EcoRecicla',
      evidenceRef: 'Actas de entrega formal de bienes dados de baja en inventario contable'
    }
  ],
  storageAreas: [
    {
      id: 'sa-01',
      storageType: 'CENTRAL',
      name: 'Almacén Central de Residuos Peligrosos (ACRP)',
      locationDescription: 'Sector Talleres Norte, a 180 m de campamento y 850 m de curso de agua más cercano',
      utmCoordinatesWgs84: 'Zona 18S Este: 281,420 m E / Norte: 8,667,290 m N',
      dimensionsM2: 240,
      capacityM3: 150,
      floorCharacteristics: 'Losa de concreto armado f\'c=280 kg/cm2 con recubrimiento epóxico antiácido y pendiente 1.5%',
      roofCharacteristics: 'Techo aluzinc a dos aguas con aislamiento térmico y alero perimétrico contra lluvias',
      ventilationLighting: 'Ventilación natural cruzada con malla olímpica y luminarias antiexplosivas Clase I Div 1',
      signage: true,
      spillContainmentKit: true,
      fireExtinguishers: true,
      accessRestricted: true,
      wasteHandled: ['Aceite usado', 'Filtros contaminados', 'Baterías fuera de uso', 'Trapos con hidrocarburos'],
      maxStorageDays: 180, // Cumple art. 55 reglamento (<12 meses)
      responsibleRole: 'Supervisor SSOMA / Encargado de Almacén Peligrosos'
    },
    {
      id: 'sa-02',
      storageType: 'INTERMEDIO',
      name: 'Punto de Acopio Intermedio N° 2 (No Peligrosos)',
      locationDescription: 'Patio posterior de Almacén General',
      utmCoordinatesWgs84: 'Zona 18S Este: 281,310 m E / Norte: 8,667,150 m N',
      dimensionsM2: 60,
      capacityM3: 40,
      floorCharacteristics: 'Piso de adoquín de concreto sellado',
      roofCharacteristics: 'Estructura ligera de policarbonato con protección UV',
      ventilationLighting: 'Área abierta perimetrada con malla galvanizada',
      signage: true,
      spillContainmentKit: false,
      fireExtinguishers: true,
      accessRestricted: false,
      wasteHandled: ['Papel y cartón', 'Plásticos', 'Metales limpios', 'Madera de pallets'],
      maxStorageDays: 30,
      responsibleRole: 'Auxiliar de Logística'
    }
  ],
  emergencyActions: [
    {
      id: 'em-01',
      scenario: 'DERRAME_HIDROCARBURO_QUIMICO',
      cause: 'Rotura o fisura de cilindro durante maniobra de montacargas en ACRP',
      wasteInvolved: 'Aceite lubricante usado o refrigerante',
      associatedRisk: 'Contaminación de suelo, riesgo de resbalón, inflamabilidad',
      preventionBefore: 'Inspección pre-uso de montacargas, verificación de precintos, bandejas estancas',
      responseDuring: 'Detener fuga inmediata, delimitar con salchichas absorbentes del kit de derrames, usar EPP (guantes nitrilo, botas acrilo-nitrilo)',
      remediationAfter: 'Recoger material impregnado con palas antichispa, almacenar en bolsa roja/cilindro etiquetado, informar a OEFA antes de 24 horas si supera volumen crítico',
      responsibleRole: 'Brigada de Emergencias SSOMA / Supervisor de Área'
    },
    {
      id: 'em-02',
      scenario: 'INCENDIO',
      cause: 'Amago de fuego por chispa de soldadura cercana a acopio de cartones',
      wasteInvolved: 'Cartón, papel, madera y plásticos',
      associatedRisk: 'Propagación rápida de fuego, generación de humos densos',
      preventionBefore: 'Permiso de trabajo en caliente (PETAR), biombo ignífugo obligatorio a 10 metros de residuos',
      responseDuring: 'Activar alarma sonora, uso de extintores PQS de 12 kg, evacuación hacia punto seguro',
      remediationAfter: 'Enfriamiento con agua, inspección de rescoldos, confinamiento seguro de cenizas',
      responsibleRole: 'Brigadista contra incendios / Jefe de Emergencias'
    }
  ],
  indicators: [
    {
      id: 'kpi-01',
      code: 'IND-GEN-01',
      name: 'Generación Total de Residuos por Mes',
      category: 'GENERACION',
      formula: 'Gm = Sumatoria(Gi) de todas las áreas',
      unit: 'kg/mes',
      baseline: 15400,
      target: 12500,
      frequency: 'Mensual',
      dataSource: 'Tickets de balanza y registro de pesaje interno',
      responsibleRole: 'Ingeniero Ambiental SSOMA',
      currentValue: 13200
    },
    {
      id: 'kpi-02',
      code: 'IND-VAL-01',
      name: 'Porcentaje de Residuos Valorizados',
      category: 'VALORIZACION',
      formula: '%V = (Masa valorizada / Masa total gestionada) * 100',
      unit: '%',
      baseline: 38,
      target: 65,
      frequency: 'Mensual',
      dataSource: 'Constancias de valorización y guías de recicladores/EO-RS',
      responsibleRole: 'Jefe de SSOMA',
      currentValue: 54
    },
    {
      id: 'kpi-03',
      code: 'IND-DISP-01',
      name: 'Porcentaje de Residuos en Disposición Final',
      category: 'DISPOSICION',
      formula: '%DF = (Masa dispuesta en relleno / Masa total gestionada) * 100',
      unit: '%',
      baseline: 62,
      target: 35,
      frequency: 'Mensual',
      dataSource: 'Certificados de disposición final de EO-RS en relleno',
      responsibleRole: 'Jefe de SSOMA',
      currentValue: 46
    },
    {
      id: 'kpi-04',
      code: 'IND-SEG-01',
      name: 'Índice de Segregación Conforme',
      category: 'SEGREGACION',
      formula: '(Puntos inspeccionados conformes / Total puntos revisados) * 100',
      unit: '%',
      baseline: 70,
      target: 95,
      frequency: 'Quincenal',
      dataSource: 'Checklist de inspección ambiental de estaciones de residuos',
      responsibleRole: 'Supervisor Ambiental',
      currentValue: 88
    },
    {
      id: 'kpi-05',
      code: 'IND-TRAZ-01',
      name: 'Trazabilidad Documental de Residuos Peligrosos',
      category: 'TRAZABILIDAD',
      formula: '(Manifiestos con copia firmada devuelta / Total manifiestos emitidos) * 100',
      unit: '%',
      baseline: 90,
      target: 100,
      frequency: 'Trimestral',
      dataSource: 'Archivo de Manifiestos SIGERSOL devueltos en plazo 15 días',
      responsibleRole: 'Coordinador SSOMA',
      currentValue: 100
    }
  ],
  auditLog: [
    {
      id: 'aud-01',
      timestamp: '2026-09-20T09:15:00Z',
      userId: 'usr-001',
      userName: 'Ing. Carlos Mendoza (Consultor)',
      action: 'Creación de proyecto PMMRS v0.1 y carga de perfil',
      fieldModified: 'Empresa y alcance',
      previousValue: '-',
      newValue: 'MINERA & CONSTRUCCIÓN ANDINA S.A.C.',
      notes: 'Inicio de levantamiento según RM 089-2023-MINAM'
    },
    {
      id: 'aud-02',
      timestamp: '2026-09-25T14:30:00Z',
      userId: 'usr-001',
      userName: 'Ing. Carlos Mendoza (Consultor)',
      action: 'Incorporación de medidas de minimización y cálculo de metas',
      fieldModified: 'Medida Aceite Usado',
      previousValue: 'Intervalo fijo 250 horas',
      newValue: 'Monitoreo SOS a 500 horas (-30% L/mes)',
      notes: 'Validado con ficha técnica CAT'
    }
  ]
};

// Documento muestra para Módulo 2 ("TENGO PMMRS") con fallas y observaciones reales para probar la revisión técnica
export const SAMPLE_PMMRS_DOCUMENT_TEXT = `
PLAN DE MINIMIZACIÓN Y MANEJO DE RESIDUOS SÓLIDOS (PMMRS)
CONSTRUCTORA EL PROGRESO DEL SUR S.A.C.
OBRA: EDIFICIO RESIDENCIAL LOS ALMENDROS - AREQUIPA
FECHA: OCTUBRE 2024

1. PRESENTACIÓN
La empresa Constructora El Progreso del Sur S.A.C. ejecuta obras civiles de edificación. En este documento se presenta el plan de manejo de residuos sólidos de acuerdo a la ley de residuos sólidos D.L. 1278 para cumplir los requerimientos de la municipalidad y OEFA.

2. OBJETIVOS
- Gestionar los residuos sólidos generados en la obra.
- Proteger el medio ambiente circundante y la salud de los obreros.
(Nota de revisión: no se prioriza explícitamente la prevención y minimización en la fuente frente a la disposición).

3. ALCANCE
El presente plan aplica a todo el personal de obra que labora en el proyecto Los Almendros en Arequipa durante la etapa de construcción.
(Nota de revisión: omite contratistas, subcontratistas, proveedores, y etapas de planificación y cierre de obra).

4. IDENTIFICACIÓN DE RESIDUOS
Durante la obra se generarán diversos residuos:
- Madera de encofrado: 250 kg/mes
- Cartón de embalaje: 100 kg/mes
- Alambres y fierro: 300 kg/mes
- Aceite usado de maquinaria: 80 litros/mes
- Trapos con grasa: 20 kg/mes
- Residuos comunes y comida de obreros: 150 kg/mes
(Nota de revisión: No incluye diagrama de flujo simplificado del proceso. No indica código Basilea. No cita el método de estimación ni la fuente de datos. ¿Fueron pesados o inventados?).

5. ESTRATEGIAS DE MINIMIZACIÓN
Los residuos serán gestionados adecuadamente en la obra. Se buscará en la medida de lo posible reducir la basura y concientizar a los trabajadores.
(Nota de revisión: CONTENIDO GENÉRICO CRÍTICO. No hay ficha de medidas, no hay jerarquía de evitar/sustituir, no hay línea base ni metas cuantitativas).

6. GESTIÓN Y MANEJO
6.1 Segregación:
Se colocarán tachos en obra para la basura.
6.2 Almacenamiento:
Se cuenta con un almacén central de residuos en un rincón de la obra.
(Nota de revisión: No indica coordenadas UTM WGS84 requeridas por RM 089. No describe piso impermeable, contención de derrames, techo, ventilación ni extintores para aceites).
6.3 Transporte y disposición:
Los residuos se entregarán a una empresa autorizada que los llevará al relleno municipal.
(Nota de revisión: Frase genérica no trazable. No identifica razón social ni número de registro autoritativo EO-RS de MINAM. Mezcla peligrosos con disposición municipal).

7. MEDIDAS AMBIENTALES
Se limpiará la obra todos los días y se regará para evitar polvo.
(Nota de revisión: No está articulado en la matriz Impacto -> Medida -> Indicador -> Costo -> Plazo).

8. EMERGENCIAS
En caso de derrame se usará aserrín o arena y se limpiará.
(Nota de revisión: Incompleto. Falta matriz antes/durante/después y reporte formal a OEFA dentro de las 24 horas según Art. 50 del reglamento).

9. INDICADORES
Se medirá la cantidad de tachos llenados por semana.
(Nota de revisión: No cumple estándar. No tiene fórmula, ni línea base, ni meta definida, ni porcentaje de valorización).

10. CRONOGRAMA
Las actividades se realizarán durante todo el año 2024.
(Nota de revisión: No es un cronograma ejecutable por meses ni articulado a medidas de minimización).

11. PRESUPUESTO
Se cuenta con una caja chica para compra de bolsas y tachos.
(Nota de revisión: No desglosa costos unitarios, cantidades, CAPEX/OPEX ni monto total en Soles).

12. RESPONSABLE
El maestro de obra vigilará la limpieza.
(Nota de revisión: El maestro de obra no tiene facultades de dirección técnica ambiental según Art. 48/60 del D.L. 1278).

13. ANEXOS
No se adjuntan planos ni certificados.
(Nota de revisión: Falta paquete de anexos normativos obligatorios de la RM 089-2023-MINAM).
`;
