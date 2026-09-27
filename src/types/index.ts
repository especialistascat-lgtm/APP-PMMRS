/**
 * Tipos y modelos de datos para la aplicación PMMRS
 * Basado en:
 * - RM N.° 089-2023-MINAM (Contenido Mínimo PMMRS)
 * - D.L. N.° 1278 y Ley N.° 32212
 * - D.S. N.° 014-2017-MINAM y D.S. N.° 001-2022-MINAM
 * - NTP 900.058:2019
 */

export type UserRole = 'ADMINISTRADOR' | 'CONSULTOR' | 'EMPRESA';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  organization?: string;
  avatar?: string;
}

export type SectorType =
  | 'CONSULTORA'
  | 'CONSTRUCCION'
  | 'COMERCIO'
  | 'MINERIA'
  | 'SERVICIOS_GENERALES'
  | 'AGRICOLA'
  | 'INDUSTRIA_MANUFACTURERA'
  | 'HIDROCARBUROS'
  | 'ENERGIA'
  | 'SALUD'
  | 'OTRO';

export type StageType = 'PLANIFICACION' | 'CONSTRUCCION' | 'OPERACION_MANTENIMIENTO' | 'CIERRE_ABANDONO';

export type ManagementScope = 'NO_MUNICIPAL' | 'SIMILAR_AL_MUNICIPAL';

export type PhysicalState = 'SOLIDO' | 'SEMISOLIDO' | 'LIQUIDO' | 'GAS_CONTENIDO';

export type HazardCharacteristic =
  | 'H1_EXPLOSIVO'
  | 'H3_LIQUIDO_INFLAMABLE'
  | 'H4.1_SOLIDO_INFLAMABLE'
  | 'H4.2_COMBUSTION_ESPONTANEA'
  | 'H4.3_EMITE_GASES_INFLAMABLES'
  | 'H5.1_OXIDANTE'
  | 'H5.2_PEROXIDO_ORGANICO'
  | 'H6.1_TOXICO_AGUDO'
  | 'H6.2_INFECCIOSO'
  | 'H8_CORROSIVO'
  | 'H10_LIBERA_GASES_TOXICOS'
  | 'H11_TOXICO_CRONICO'
  | 'H12_ECOTOXICO'
  | 'H13_LIXIVIABLE_PELIGROSO'
  | 'NO_APLICA';

export type EstimationMethod =
  | 'PESAJE_DIRECTO'
  | 'REGISTRO_INTERNO'
  | 'MANIFIESTO_PELIGROSO'
  | 'REGISTRO_EORS'
  | 'INVENTARIO_ORDEN_COMPRA'
  | 'BALANCE_MATERIA'
  | 'FACTOR_GENERACION'
  | 'ESTIMACION_TECNICA_DOCUMENTADA';

export type OperationType =
  | 'SEGREGACION'
  | 'ALMACENAMIENTO'
  | 'RECOLECCION_SELECTIVA'
  | 'TRANSPORTE'
  | 'ACONDICIONAMIENTO'
  | 'VALORIZACION_MATERIAL'
  | 'VALORIZACION_ENERGETICA'
  | 'TRATAMIENTO'
  | 'DISPOSICION_FINAL';

export type ColorBinNTP =
  | 'AZUL' // Papel y cartón
  | 'BLANCO' // Plástico
  | 'AMARILLO' // Metales
  | 'MARRON' // Orgánicos
  | 'PLOMO' // Vidrio
  | 'ROJO' // Peligrosos
  | 'NEGRO'; // No aprovechables

export type HierarchyLevel =
  | '1_EVITAR'
  | '2_SUSTITUIR'
  | '3_REDUCIR'
  | '4_REUTILIZAR'
  | '5_VALORIZAR'
  | '6_TRATAR'
  | '7_DISPONER';

export interface CompanyProfile {
  id: string;
  businessName: string; // Razón Social
  tradeName: string; // Nombre Comercial
  ruc: string;
  sector: SectorType;
  sectorCustomName?: string;
  mainActivity: string;
  secondaryActivities?: string;
  address: string;
  department: string;
  province: string;
  district: string;
  facilityName: string; // Unidad / Planta / Sede
  contactPerson: string;
  contactRole: string;
  contactEmail: string;
  contactPhone: string;
  // IGA y Alcance
  hasIga: boolean;
  igaType?: 'DIA' | 'EIA_SD' | 'EIA_D' | 'PAMA' | 'FTA' | 'ITS' | 'OTRO' | 'NO_TIENE';
  igaResolutionNumber?: string;
  igaApprovalDate?: string;
  competentAuthority?: string; // OEFA, MINEM, PRODUCE, SENACE, MIDAGRI, etc.
  tdrReference?: string;
  activeStages: StageType[];
  hasHazardousWaste: boolean;
  hasPriorityGoods: boolean;
  hasDiscardMaterial: boolean;
  hasInternalRecovery: boolean;
  hasOutsourcedOperations: boolean;
  hasContractorsGeneratingWaste: boolean;
}

export interface WasteItem {
  id: string;
  stage: StageType;
  area: string;
  process: string;
  activity: string;
  wasteName: string;
  physicalState: PhysicalState;
  isHazardous: boolean;
  hazardCharacteristics: HazardCharacteristic[];
  hazardUncertainty: boolean; // Requiere pronunciamiento técnico MINAM
  baselCode?: string; // Ej: A1010, A3020, B1010, B3010
  managementScope: ManagementScope;
  isPriorityGood: boolean;
  priorityGoodType?: 'RAEE' | 'NFU' | 'ENVASES_EMBALAJES' | 'BATERIAS' | 'OTRO';
  priorityCategory?: string; // Ej: Cat 3 RAEE (Informática), Cat A NFU (<25")
  quantity: number;
  unit: 'KG_MES' | 'T_MES' | 'M3_MES' | 'L_MES' | 'UND_MES' | 'T_ANO' | 'KG_ANO';
  annualQuantityKg: number;
  measurementMethod: EstimationMethod;
  dataSource: string; // Trazabilidad: 'Pesaje báscula 1', 'Factura compras Q1', etc.
  colorCode: ColorBinNTP;
  primaryDestination: OperationType;
  authorizedOperatorName?: string; // Nombre de EO-RS
  operatorRegistryNumber?: string; // Registro MINAM EO-RS
  destinationFacility?: string; // Relleno sanitario/seguridad / Planta valorización
  responsibleRole: string;
  notes?: string;
  evidenceRefId?: string;
}

export interface MinimizationMeasure {
  id: string;
  wasteId: string;
  wasteName: string;
  sourceProcess: string;
  problemStatement: string; // Causa por qué se genera
  hierarchyLevel: HierarchyLevel;
  measureName: string;
  detailedAction: string;
  responsibleRole: string;
  resourcesNeeded: string;
  baseline: string; // Ej: "150 kg/mes"
  targetGoal: string; // Ej: "Reducción del 25% en 6 meses"
  indicatorName: string;
  indicatorFormula: string;
  frequency: 'MENSUAL' | 'BIMESTRAL' | 'TRIMESTRAL' | 'SEMESTRAL' | 'ANUAL';
  verificationEvidence: string;
  estimatedCostPen: number;
  scheduleMonthStart: number;
  scheduleMonthEnd: number;
  technicalFeasibility: string;
  economicFeasibility: string;
  environmentalFeasibility: string;
  capexOpex: 'CAPEX' | 'OPEX';
}

export interface DiscardMaterial {
  id: string;
  materialName: string;
  generatingProcess: string;
  physicalCharacteristics: string;
  estimatedQuantityKgMonth: number;
  frequency: string;
  destinationActivity: string; // Actividad receptora donde se aprovecha
  recipientCompanyRuc: string;
  recipientCompanyName: string;
  storageConditions: string;
  transportVehicleType: string;
  transportModality: 'PROPIO' | 'CONTRATADO';
  evidenceOfReuse: string;
  legalNoticeDate?: string; // Notificación previa a autoridad sectorial y OEFA
}

export interface PriorityGoodItem {
  id: string;
  regime: 'RAEE' | 'NFU' | 'ENVASES_EMBALAJES';
  goodDescription: string;
  category: string; // RAEE 1 a 11 o NFU A/B
  unitsPerYear: number;
  massKgPerYear: number;
  periodicity: string;
  authorizedCollectorOrSystem: string;
  evidenceRef: string;
}

export interface StorageArea {
  id: string;
  storageType: 'INICIAL_PRIMARIO' | 'INTERMEDIO' | 'CENTRAL';
  name: string;
  locationDescription: string;
  utmCoordinatesWgs84?: string; // Ej: 18S 281450 E, 8667300 N
  dimensionsM2: number;
  capacityM3: number;
  floorCharacteristics: string; // Impermeabilizado, concreto, etc.
  roofCharacteristics: string;
  ventilationLighting: string;
  signage: boolean;
  spillContainmentKit: boolean;
  fireExtinguishers: boolean;
  accessRestricted: boolean;
  wasteHandled: string[]; // Tipos de residuos almacenados
  maxStorageDays: number; // Max 12 meses para peligrosos
  responsibleRole: string;
}

export interface EmergencyAction {
  id: string;
  scenario: 'DERRAME_HIDROCARBURO_QUIMICO' | 'INCENDIO' | 'MEZCLA_INCOMPATIBLE' | 'COLAPSO_CONTENEDOR' | 'OTRO';
  cause: string;
  wasteInvolved: string;
  associatedRisk: string;
  preventionBefore: string;
  responseDuring: string;
  remediationAfter: string;
  responsibleRole: string;
}

export interface KPIItem {
  id: string;
  code: string;
  name: string;
  category: 'GENERACION' | 'MINIMIZACION' | 'VALORIZACION' | 'DISPOSICION' | 'SEGREGACION' | 'CAPACITACION' | 'TRAZABILIDAD';
  formula: string;
  unit: string;
  baseline: number;
  target: number;
  frequency: string;
  dataSource: string;
  responsibleRole: string;
  currentValue?: number;
}

export interface ProjectAuditEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  fieldModified?: string;
  previousValue?: string;
  newValue?: string;
  notes?: string;
}

export interface PmmrsProject {
  id: string;
  version: string; // 'v0.1', 'v1.0'
  status: 'BORRADOR' | 'EN_REVISION' | 'APROBADO_FINAL';
  company: CompanyProfile;
  wastes: WasteItem[];
  minimizationMeasures: MinimizationMeasure[];
  discardMaterials: DiscardMaterial[];
  priorityGoods: PriorityGoodItem[];
  storageAreas: StorageArea[];
  emergencyActions: EmergencyAction[];
  indicators: KPIItem[];
  auditLog: ProjectAuditEntry[];
  lastModified: string;
}

// Módulo 2: Revisión de PMMRS existente
export interface ReviewSectionEvaluation {
  sectionNumber: number;
  sectionTitle: string;
  legalReference: string;
  status: 'CUMPLE' | 'CUMPLE_PARCIALMENTE' | 'NO_CUMPLE' | 'NO_APLICA' | 'INFORMACION_INSUFICIENTE';
  findings: string;
  requiredRule: string;
  foundContent: string;
  severity: 'CRITICA' | 'MAYOR' | 'MENOR' | 'CONFORME';
  recommendations: string;
  isGenericContentDetected: boolean;
  genericPhrasesFound: string[];
}

export interface QuantitativeInconsistency {
  id: string;
  residue: string;
  sectionA: string;
  valueA: string;
  sectionB: string;
  valueB: string;
  description: string;
  severity: 'CRITICA' | 'MAYOR';
}

export interface ComplianceComponentScore {
  category: string;
  weight: number;
  score: number; // 0 - 100
  notes: string;
}

export interface PmmrsReviewReport {
  id: string;
  documentTitle: string;
  fileName: string;
  uploadDate: string;
  companyName: string;
  evaluatedBy: string;
  overallScore: number; // 0 - 100%
  executiveSummary: string;
  sectionsEvaluated: ReviewSectionEvaluation[];
  inconsistencies: QuantitativeInconsistency[];
  genericContentAlerts: string[];
  missingSections: string[];
  componentScores: ComplianceComponentScore[];
  finalRecommendations: string[];
}
