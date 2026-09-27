import React, { useState } from 'react';
import { 
  Building2, 
  GitBranch, 
  Table, 
  TrendingDown, 
  Box, 
  MapPin, 
  Calculator, 
  ClipboardCheck, 
  FileText,
  ChevronRight,
  Check
} from 'lucide-react';
import { PmmrsProject, WasteItem, MinimizationMeasure, StorageArea, DiscardMaterial, PriorityGoodItem } from '../../types';
import { CompanyProfileStep } from './CompanyProfileStep';
import { ProcessTreeStep } from './ProcessTreeStep';
import { WasteMatrixStep } from './WasteMatrixStep';
import { MinimizationStep } from './MinimizationStep';
import { SpecialRegimesStep } from './SpecialRegimesStep';
import { StorageTransportStep } from './StorageTransportStep';
import { IndicatorsScheduleBudgetStep } from './IndicatorsScheduleBudgetStep';
import { QualityChecklistStep } from './QualityChecklistStep';
import { PmmrsDocumentView } from './PmmrsDocumentView';
import { ProjectStorage } from '../../services/projectStorage';

interface PmmrsWorkflowProps {
  project: PmmrsProject;
  onUpdateProject: (updated: PmmrsProject) => void;
  initialStep?: number;
  onBackToHome: () => void;
}

const STEPS = [
  { id: 0, label: '1. Perfil e IGA', icon: Building2 },
  { id: 1, label: '2. Procesos y Flujo', icon: GitBranch },
  { id: 2, label: '3. Matriz de Residuos', icon: Table },
  { id: 3, label: '4. Minimización', icon: TrendingDown },
  { id: 4, label: '5. Descarte y REP', icon: Box },
  { id: 5, label: '6. Almacén UTM', icon: MapPin },
  { id: 6, label: '7. Gestión y Costos', icon: Calculator },
  { id: 7, label: '8. Control Calidad', icon: ClipboardCheck },
  { id: 8, label: '9. Ver PMMRS', icon: FileText }
];

export const PmmrsWorkflow: React.FC<PmmrsWorkflowProps> = ({
  project,
  onUpdateProject,
  initialStep = 0,
  onBackToHome
}) => {
  const [currentStep, setCurrentStep] = useState<number>(initialStep);

  const saveCurrentProject = (updatedProj: PmmrsProject) => {
    onUpdateProject(updatedProj);
    ProjectStorage.saveProject(updatedProj);
  };

  const handleUpdateCompany = (updatedCompany: any) => {
    const updated = {
      ...project,
      company: { ...project.company, ...updatedCompany }
    };
    saveCurrentProject(updated);
  };

  const handleUpdateWastes = (wastes: WasteItem[]) => {
    const updated = { ...project, wastes };
    saveCurrentProject(updated);
  };

  const handleUpdateMeasures = (minimizationMeasures: MinimizationMeasure[]) => {
    const updated = { ...project, minimizationMeasures };
    saveCurrentProject(updated);
  };

  const handleUpdateStorage = (storageAreas: StorageArea[]) => {
    const updated = { ...project, storageAreas };
    saveCurrentProject(updated);
  };

  const handleUpdateDiscard = (discardMaterials: DiscardMaterial[]) => {
    const updated = { ...project, discardMaterials };
    saveCurrentProject(updated);
  };

  const handleUpdatePriorityGoods = (priorityGoods: PriorityGoodItem[]) => {
    const updated = { ...project, priorityGoods };
    saveCurrentProject(updated);
  };

  return (
    <div className="space-y-6">
      
      {/* Wizard Step Navigation Bar (Sticky) */}
      <div className="no-print bg-slate-900/90 backdrop-blur border border-slate-800 rounded-2xl p-3 shadow-lg overflow-x-auto">
        <div className="flex items-center min-w-max gap-1 sm:gap-2">
          {STEPS.map((st) => {
            const Icon = st.icon;
            const isActive = currentStep === st.id;
            const isCompleted = currentStep > st.id;

            return (
              <button
                key={st.id}
                type="button"
                onClick={() => setCurrentStep(st.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                    : isCompleted
                    ? 'bg-slate-800 text-emerald-300 hover:bg-slate-700'
                    : 'bg-slate-950/60 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                  isCompleted ? 'bg-emerald-500 text-slate-950 font-bold' : ''
                }`}>
                  {isCompleted ? <Check className="w-3 h-3 stroke-[3]" /> : <Icon className="w-3.5 h-3.5" />}
                </div>
                <span>{st.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Render Current Step Component */}
      <div>
        {currentStep === 0 && (
          <CompanyProfileStep
            company={project.company}
            onChangeCompany={handleUpdateCompany}
            onNext={() => setCurrentStep(1)}
          />
        )}

        {currentStep === 1 && (
          <ProcessTreeStep
            project={project}
            onUpdateWastes={handleUpdateWastes}
            onNext={() => setCurrentStep(2)}
            onBack={() => setCurrentStep(0)}
          />
        )}

        {currentStep === 2 && (
          <WasteMatrixStep
            wastes={project.wastes}
            onUpdateWastes={handleUpdateWastes}
            onNext={() => setCurrentStep(3)}
            onBack={() => setCurrentStep(1)}
          />
        )}

        {currentStep === 3 && (
          <MinimizationStep
            wastes={project.wastes}
            measures={project.minimizationMeasures}
            onUpdateMeasures={handleUpdateMeasures}
            onNext={() => setCurrentStep(4)}
            onBack={() => setCurrentStep(2)}
          />
        )}

        {currentStep === 4 && (
          <SpecialRegimesStep
            discardMaterials={project.discardMaterials}
            priorityGoods={project.priorityGoods}
            onUpdateDiscard={handleUpdateDiscard}
            onUpdatePriorityGoods={handleUpdatePriorityGoods}
            onNext={() => setCurrentStep(5)}
            onBack={() => setCurrentStep(3)}
          />
        )}

        {currentStep === 5 && (
          <StorageTransportStep
            wastes={project.wastes}
            storageAreas={project.storageAreas}
            onUpdateStorage={handleUpdateStorage}
            onNext={() => setCurrentStep(6)}
            onBack={() => setCurrentStep(4)}
          />
        )}

        {currentStep === 6 && (
          <IndicatorsScheduleBudgetStep
            project={project}
            onUpdateProject={(updated) => saveCurrentProject({ ...project, ...updated })}
            onNext={() => setCurrentStep(7)}
            onBack={() => setCurrentStep(5)}
          />
        )}

        {currentStep === 7 && (
          <QualityChecklistStep
            project={project}
            onProceedToDocument={() => setCurrentStep(8)}
            onBack={() => setCurrentStep(6)}
          />
        )}

        {currentStep === 8 && (
          <PmmrsDocumentView
            project={project}
            onBack={() => setCurrentStep(7)}
          />
        )}
      </div>

    </div>
  );
};
