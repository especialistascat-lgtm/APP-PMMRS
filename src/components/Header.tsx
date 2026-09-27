import React from 'react';
import { ShieldCheck, FileText, ClipboardCheck, Sparkles, Building2, UserCircle } from 'lucide-react';
import { UserRole } from '../types';
import { GryphosLogo } from './GryphosLogo';

interface HeaderProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  userRole: UserRole;
  onChangeRole: (role: UserRole) => void;
  projectName?: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onNavigate,
  userRole,
  onChangeRole,
  projectName
}) => {
  return (
    <header className="no-print sticky top-0 z-40 bg-slate-950/95 backdrop-blur border-b border-purple-900/30 shadow-xl shadow-purple-950/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand & Logo */}
          <div className="flex items-center gap-3.5 cursor-pointer group" onClick={() => onNavigate('home')}>
            <GryphosLogo size="md" withGlow={true} withBorder={true} />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-wider bg-gradient-to-r from-amber-300 via-yellow-200 to-purple-300 bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(245,158,11,0.25)] group-hover:brightness-110 transition-all font-serif">
                  CASA GRYPHOS
                </span>
                <span className="text-[10px] uppercase font-extrabold tracking-widest px-2 py-0.5 rounded-full bg-gradient-to-r from-purple-900/60 to-amber-950/60 text-amber-300 border border-amber-500/40 shadow-sm">
                  RM 089-2023-MINAM
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium flex items-center gap-1.5">
                <span className="text-amber-400/80 font-bold">PMMRS No Municipales</span>
                <span className="text-slate-500">•</span>
                <span className="text-purple-300/80">D.L. 1278</span>
              </p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => onNavigate('home')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentTab === 'home'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              Inicio
            </button>
            <button
              onClick={() => onNavigate('dashboard')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentTab === 'dashboard'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              Dashboard
            </button>
            <button
              onClick={() => onNavigate('no_pmmrs')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentTab === 'no_pmmrs'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              Elaborar PMMRS
            </button>
            <button
              onClick={() => onNavigate('tengo_pmmrs')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentTab === 'tengo_pmmrs'
                  ? 'bg-cyan-600 text-white shadow'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <ClipboardCheck className="w-3.5 h-3.5 text-cyan-400" />
              Revisar PMMRS
            </button>
          </nav>

          {/* Role selector & User profile */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-950/70 px-2.5 py-1 rounded-lg border border-slate-800">
              <UserCircle className="w-4 h-4 text-emerald-400" />
              <div className="flex flex-col text-left">
                <span className="text-[10px] text-slate-400 leading-tight">Perfil:</span>
                <select
                  value={userRole}
                  onChange={(e) => onChangeRole(e.target.value as UserRole)}
                  className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer"
                >
                  <option value="CONSULTOR" className="bg-slate-900 text-white">Consultor Ambiental</option>
                  <option value="EMPRESA" className="bg-slate-900 text-white">Empresa Privada</option>
                  <option value="ADMINISTRADOR" className="bg-slate-900 text-white">Administrador</option>
                </select>
              </div>
            </div>

            {projectName && (
              <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-300 max-w-xs truncate border-l border-slate-800 pl-3">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="truncate font-medium">{projectName}</span>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
