import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomeHero } from './components/HomeHero';
import { Dashboard } from './components/Dashboard';
import { PmmrsWorkflow } from './components/noPmmrs/PmmrsWorkflow';
import { PmmrsReviewModule } from './components/tengoPmmrs/PmmrsReviewModule';
import { PmmrsProject, UserRole } from './types';
import { ProjectStorage } from './services/projectStorage';
import { DEMO_PROJECT } from './data/demoProject';
import * as XLSX from 'xlsx';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [userRole, setUserRole] = useState<UserRole>('CONSULTOR');
  const [project, setProject] = useState<PmmrsProject>(() => ProjectStorage.getActiveProject());
  const [wizardStep, setWizardStep] = useState<number>(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    ProjectStorage.saveProject(project);
  }, [project]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleNavigate = (tab: string, step?: number) => {
    setCurrentTab(tab);
    if (step !== undefined) {
      setWizardStep(step);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoadDemoProject = () => {
    setProject(DEMO_PROJECT);
    ProjectStorage.saveProject(DEMO_PROJECT);
    showToast('Datos de demostración cargados: MINERA & CONSTRUCCIÓN ANDINA S.A.C.');
  };

  const handleExportExcel = () => {
    try {
      const data = project.wastes.map((w, idx) => ({
        'N°': idx + 1,
        'Etapa': w.stage,
        'Área': w.area,
        'Proceso': w.process,
        'Actividad': w.activity,
        'Residuo Sólido': w.wasteName,
        'Estado': w.physicalState,
        'Peligrosidad': w.isHazardous ? 'PELIGROSO' : 'NO PELIGROSO',
        'Código Basilea': w.baselCode || '-',
        'Cantidad Mensual': w.quantity,
        'Unidad': w.unit,
        'Cantidad Anual (kg)': w.annualQuantityKg,
        'Método Estimación': w.measurementMethod,
        'Fuente Trazable': w.dataSource,
        'Color NTP 900.058': w.colorCode,
        'Destino Primario': w.primaryDestination,
        'Operador EO-RS': w.authorizedOperatorName || 'No asignado',
        'N° Reg. MINAM': w.operatorRegistryNumber || 'Pendiente',
        'Responsable': w.responsibleRole
      }));

      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Matriz_PMMRS');
      XLSX.writeFile(workbook, `Matriz_Residuos_${project.company.businessName.substring(0, 15).replace(/\s+/g, '_')}.xlsx`);
      showToast('Matriz de residuos exportada a Excel exitosamente.');
    } catch {
      showToast('Error al exportar archivo Excel.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-purple-600 selection:text-amber-200">
      
      {/* App Header */}
      <Header
        currentTab={currentTab}
        onNavigate={handleNavigate}
        userRole={userRole}
        onChangeRole={setUserRole}
        projectName={project.company.businessName}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 border border-emerald-400/40 animate-bounce">
          <span>✓ {toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* TAB: HOME */}
        {currentTab === 'home' && (
          <HomeHero
            onSelectOption={(mode) => {
              if (mode === 'no_pmmrs') handleNavigate('no_pmmrs', 0);
              else if (mode === 'tengo_pmmrs') handleNavigate('tengo_pmmrs');
              else if (mode === 'dashboard') handleNavigate('dashboard');
            }}
            activeProject={project}
            onLoadDemoProject={handleLoadDemoProject}
          />
        )}

        {/* TAB: DASHBOARD */}
        {currentTab === 'dashboard' && (
          <Dashboard
            project={project}
            onNavigateTab={handleNavigate}
            onExportExcel={handleExportExcel}
          />
        )}

        {/* TAB: MÓDULO 1 - NO TENGO PMMRS */}
        {currentTab === 'no_pmmrs' && (
          <PmmrsWorkflow
            project={project}
            onUpdateProject={setProject}
            initialStep={wizardStep}
            onBackToHome={() => handleNavigate('home')}
          />
        )}

        {/* TAB: MÓDULO 2 - TENGO PMMRS */}
        {currentTab === 'tengo_pmmrs' && (
          <PmmrsReviewModule
            onBackToHome={() => handleNavigate('home')}
          />
        )}

      </main>

      {/* App Footer */}
      <Footer />

    </div>
  );
}
