/**
 * Gestor de Persistencia, Versionado y Auditoría de Proyectos PMMRS
 */

import { PmmrsProject, PmmrsReviewReport, WasteItem, MinimizationMeasure } from '../types';
import { DEMO_PROJECT } from '../data/demoProject';

const STORAGE_KEY_PROJECTS = 'pmmrs_projects_db';
const STORAGE_KEY_REPORTS = 'pmmrs_reviews_db';
const STORAGE_KEY_ACTIVE_PROJECT_ID = 'pmmrs_active_project_id';

export class ProjectStorage {
  public static getAllProjects(): PmmrsProject[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_PROJECTS);
      if (!data) {
        // Initialize with DEMO_PROJECT
        const initial = [DEMO_PROJECT];
        localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(initial));
        return initial;
      }
      return JSON.parse(data);
    } catch {
      return [DEMO_PROJECT];
    }
  }

  public static getActiveProject(): PmmrsProject {
    const projects = this.getAllProjects();
    const activeId = localStorage.getItem(STORAGE_KEY_ACTIVE_PROJECT_ID);
    const found = projects.find((p) => p.id === activeId);
    return found || projects[0] || DEMO_PROJECT;
  }

  public static setActiveProjectId(id: string): void {
    localStorage.setItem(STORAGE_KEY_ACTIVE_PROJECT_ID, id);
  }

  public static saveProject(project: PmmrsProject, userName: string = 'Usuario'): void {
    const projects = this.getAllProjects();
    const index = projects.findIndex((p) => p.id === project.id);
    const now = new Date().toISOString();
    
    // Create audit entry
    const updated = {
      ...project,
      lastModified: now,
      auditLog: [
        {
          id: 'aud-' + Date.now(),
          timestamp: now,
          userId: 'usr-current',
          userName,
          action: 'Actualización general de datos del proyecto',
          notes: `Versión: ${project.version}`
        },
        ...(project.auditLog || [])
      ]
    };

    if (index >= 0) {
      projects[index] = updated;
    } else {
      projects.push(updated);
    }

    localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(projects));
  }

  public static createNewProject(
    businessName: string,
    ruc: string,
    sector: any,
    userName: string = 'Consultor'
  ): PmmrsProject {
    const newProj: PmmrsProject = {
      id: 'proj-' + Date.now(),
      version: 'v0.1',
      status: 'BORRADOR',
      lastModified: new Date().toISOString(),
      company: {
        id: 'comp-' + Date.now(),
        businessName,
        tradeName: businessName,
        ruc,
        sector,
        mainActivity: '',
        address: '',
        department: '',
        province: '',
        district: '',
        facilityName: 'Sede Principal',
        contactPerson: userName,
        contactRole: 'Responsable Ambiental',
        contactEmail: '',
        contactPhone: '',
        hasIga: false,
        activeStages: ['OPERACION_MANTENIMIENTO'],
        hasHazardousWaste: false,
        hasPriorityGoods: false,
        hasDiscardMaterial: false,
        hasInternalRecovery: false,
        hasOutsourcedOperations: true,
        hasContractorsGeneratingWaste: false
      },
      wastes: [],
      minimizationMeasures: [],
      discardMaterials: [],
      priorityGoods: [],
      storageAreas: [],
      emergencyActions: [],
      indicators: [
        {
          id: 'kpi-auto-1',
          code: 'IND-GEN-01',
          name: 'Generación Total Mensual de Residuos',
          category: 'GENERACION',
          formula: 'Gm = Sumatoria(Gi)',
          unit: 'kg/mes',
          baseline: 0,
          target: 0,
          frequency: 'Mensual',
          dataSource: 'Registros internos de pesaje',
          responsibleRole: 'Área Ambiental'
        },
        {
          id: 'kpi-auto-2',
          code: 'IND-VAL-01',
          name: 'Porcentaje de Residuos Valorizados',
          category: 'VALORIZACION',
          formula: '%V = (Masa valorizada / Masa total gestionada) * 100',
          unit: '%',
          baseline: 0,
          target: 50,
          frequency: 'Mensual',
          dataSource: 'Constancias de entrega a EO-RS de valorización',
          responsibleRole: 'Área Ambiental'
        }
      ],
      auditLog: [
        {
          id: 'aud-' + Date.now(),
          timestamp: new Date().toISOString(),
          userId: 'usr-new',
          userName,
          action: 'Creación de nuevo proyecto PMMRS desde cero',
          notes: 'Inicio de elaboración'
        }
      ]
    };

    const projects = this.getAllProjects();
    projects.push(newProj);
    localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(projects));
    this.setActiveProjectId(newProj.id);
    return newProj;
  }

  // Reviews
  public static getAllReviewReports(): PmmrsReviewReport[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_REPORTS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public static saveReviewReport(report: PmmrsReviewReport): void {
    const list = this.getAllReviewReports();
    list.unshift(report);
    localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(list));
  }

  // Helper calculation formulas according to the technical guide
  public static calculateProjectMetrics(wastes: WasteItem[], measures: MinimizationMeasure[]) {
    const totalWastes = wastes.length;
    const hazardousWastes = wastes.filter((w) => w.isHazardous);
    const nonHazardousWastes = wastes.filter((w) => !w.isHazardous);

    const totalQuantity = wastes.reduce((acc, w) => acc + (Number(w.quantity) || 0), 0);
    const hazardousQuantity = hazardousWastes.reduce((acc, w) => acc + (Number(w.quantity) || 0), 0);

    // Valued vs Disposed
    const valorizedItems = wastes.filter(
      (w) => w.primaryDestination === 'VALORIZACION_MATERIAL' || w.primaryDestination === 'VALORIZACION_ENERGETICA'
    );
    const disposedItems = wastes.filter((w) => w.primaryDestination === 'DISPOSICION_FINAL');

    const valorizedQuantity = valorizedItems.reduce((acc, w) => acc + (Number(w.quantity) || 0), 0);
    const disposedQuantity = disposedItems.reduce((acc, w) => acc + (Number(w.quantity) || 0), 0);

    const valorizationPercent = totalQuantity > 0 ? Math.round((valorizedQuantity / totalQuantity) * 100) : 0;
    const disposalPercent = totalQuantity > 0 ? Math.round((disposedQuantity / totalQuantity) * 100) : 0;

    // Minimization coverage
    const wastesWithMeasures = new Set(measures.map((m) => m.wasteId)).size;
    const minimizationCoveragePercent = totalWastes > 0 ? Math.round((wastesWithMeasures / totalWastes) * 100) : 0;

    return {
      totalWastes,
      hazardousCount: hazardousWastes.length,
      nonHazardousCount: nonHazardousWastes.length,
      totalMonthlyQuantity: totalQuantity,
      hazardousMonthlyQuantity: hazardousQuantity,
      valorizedQuantity,
      disposedQuantity,
      valorizationPercent,
      disposalPercent,
      minimizationCoveragePercent,
      measuresCount: measures.length
    };
  }
}
