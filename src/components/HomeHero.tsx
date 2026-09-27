import React from 'react';
import { 
  FilePlus, 
  SearchCheck, 
  ArrowRight, 
  Building2, 
  Scale, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  FileSpreadsheet,
  Award,
  Layers,
  BarChart3,
  ShieldCheck
} from 'lucide-react';
import { PmmrsProject } from '../types';
import { GryphosLogo } from './GryphosLogo';

interface HomeHeroProps {
  onSelectOption: (mode: 'no_pmmrs' | 'tengo_pmmrs' | 'dashboard') => void;
  activeProject: PmmrsProject;
  onLoadDemoProject: () => void;
}

export const HomeHero: React.FC<HomeHeroProps> = ({
  onSelectOption,
  activeProject,
  onLoadDemoProject
}) => {
  return (
    <div className="space-y-12 py-4">
      
      {/* Top Banner / Heading with Casa Gryphos Emblem */}
      <div className="text-center max-w-4xl mx-auto space-y-6">
        
        {/* Gryphos Hero Emblem & House Badge */}
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="relative group cursor-default">
            <GryphosLogo size="hero" withGlow={true} withBorder={true} />
            <div className="absolute -bottom-2 bg-gradient-to-r from-purple-900 to-amber-900 text-amber-200 border border-amber-400/50 px-3 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-widest shadow-lg">
              CASA GRYPHOS
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-950/80 via-slate-900/90 to-amber-950/80 border border-amber-500/40 text-amber-300 text-xs font-semibold tracking-wide shadow-md mt-2">
            <Scale className="w-3.5 h-3.5 text-amber-400" />
            Conforme a la R.M. N.° 089-2023-MINAM • D.L. N.° 1278 • NTP 900.058:2019
          </div>
        </div>

        {/* Title in Casa Gryphos Colors (Imperial Gold & Royal Purple) */}
        <div className="space-y-2">
          <p className="text-xs uppercase font-extrabold tracking-[0.25em] text-purple-300">
            Plataforma Oficial de Gestión Ambiental
          </p>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            <span className="bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-300 bg-clip-text text-transparent font-serif drop-shadow-sm">
              PLAN DE MINIMIZACIÓN DE
            </span>
            <br />
            <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-purple-400 bg-clip-text text-transparent drop-shadow-[0_4px_24px_rgba(245,158,11,0.35)]">
              RESIDUOS SÓLIDOS (PMMRS)
            </span>
          </h1>
        </div>

        <p className="text-base sm:text-xl text-slate-200 font-medium">
          No municipales para empresas del sector privado en el Perú
        </p>

        <p className="text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Plataforma técnica inteligente desarrollada con el rigor metodológico de <strong className="text-amber-300 font-semibold">CASA GRYPHOS</strong> para estructurar planes desde la fuente generadora, auditar la trazabilidad de datos y fiscalizar documentos técnicos contra omisiones e inconsistencias normativas.
        </p>
      </div>

      {/* Two Main Cards: MÓDULO 1 & MÓDULO 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        
        {/* CARD 1: NO TENGO PMMRS */}
        <div className="relative group bg-gradient-to-b from-slate-800/90 to-slate-900/90 p-8 rounded-2xl border border-slate-700/80 hover:border-emerald-500/70 transition-all duration-300 shadow-xl hover:shadow-emerald-500/10 flex flex-col justify-between">
          <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-500 text-slate-950 shadow-md">
              MÓDULO 1
            </span>
          </div>

          <div className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
              <FilePlus className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Paso a Paso Asistido
              </span>
              <h2 className="text-2xl font-black text-white">
                NO TENGO PMMRS
              </h2>
              <p className="text-sm font-semibold text-slate-300">
                Elaborar mi PMMRS desde cero
              </p>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Herramienta guiada para empresas o consultores que necesitan construir su plan completo. 
              Mapeo de procesos, árbol lógico de residuos, jerarquía de minimización, cálculo cuantitativo 
              y generación de documento técnico formal.
            </p>

            <ul className="text-xs space-y-2 text-slate-300 pt-2 border-t border-slate-700/50">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Test sectorial (Minería, Construcción, Comercio, etc.)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Matriz Maestra con códigos de Basilea y NTP 900.058:2019</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Fichas de minimización, Gantt, CAPEX/OPEX y exportación Word/PDF</span>
              </li>
            </ul>
          </div>

          <div className="pt-6 mt-6 border-t border-slate-700/50">
            <button
              onClick={() => onSelectOption('no_pmmrs')}
              className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
            >
              <span>Comenzar a Elaborar PMMRS</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* CARD 2: TENGO PMMRS */}
        <div className="relative group bg-gradient-to-b from-slate-800/90 to-slate-900/90 p-8 rounded-2xl border border-slate-700/80 hover:border-cyan-500/70 transition-all duration-300 shadow-xl hover:shadow-cyan-500/10 flex flex-col justify-between">
          <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold bg-cyan-500 text-slate-950 shadow-md">
              MÓDULO 2
            </span>
          </div>

          <div className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
              <SearchCheck className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                Auditoría Técnica Automatizada
              </span>
              <h2 className="text-2xl font-black text-white">
                TENGO PMMRS
              </h2>
              <p className="text-sm font-semibold text-slate-300">
                Revisar y auditar mi PMMRS existente
              </p>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Carga tu archivo PDF/Word o texto existente. El motor analiza los 13 capítulos mínimos de la RM 089, 
              detecta omisiones, frases genéricas no trazables, inconsistencias numéricas y calcula el porcentaje de cumplimiento técnico.
            </p>

            <ul className="text-xs space-y-2 text-slate-300 pt-2 border-t border-slate-700/50">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Mapeo estricto contra los 13 capítulos de la RM 089-2023-MINAM</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Detección de contenido genérico ("se dispondrá adecuadamente", etc.)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Informe Técnico descargable con semáforo y plan de subsanación</span>
              </li>
            </ul>
          </div>

          <div className="pt-6 mt-6 border-t border-slate-700/50">
            <button
              onClick={() => onSelectOption('tengo_pmmrs')}
              className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-cyan-600/30 transition-all cursor-pointer"
            >
              <span>Cargar Documento y Auditar</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* Active Project Card / Quick Demo Project Banner */}
      <div className="max-w-5xl mx-auto bg-slate-950/80 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-semibold">Proyecto en Sesión:</span>
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                {activeProject.version}
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                {activeProject.status}
              </span>
            </div>
            <p className="text-base font-bold text-white">
              {activeProject.company.businessName}
            </p>
            <p className="text-xs text-slate-400">
              Sector: {activeProject.company.sector} • {activeProject.wastes.length} residuos identificados • {activeProject.minimizationMeasures.length} medidas de minimización
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => onSelectOption('dashboard')}
            className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700 cursor-pointer"
          >
            <BarChart3 className="w-4 h-4 text-emerald-400" />
            Ver Dashboard
          </button>
          <button
            onClick={onLoadDemoProject}
            className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 text-xs font-bold transition-all border border-emerald-700/50 cursor-pointer"
            title="Cargar datos de la empresa de ejemplo: Minera & Construcción Andina S.A.C."
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            Cargar Datos Demo
          </button>
        </div>
      </div>

      {/* Feature highlights: Technical pillars of RM 089 */}
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-left">
          <div className="text-emerald-400 text-xs font-bold mb-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Jerarquía Oficial
          </div>
          <p className="text-xs text-slate-300 font-semibold">1° Minimizar | 2° Valorizar</p>
          <p className="text-[11px] text-slate-500 mt-1">La disposición final en relleno queda como última opción técnica.</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-left">
          <div className="text-cyan-400 text-xs font-bold mb-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Georreferenciación
          </div>
          <p className="text-xs text-slate-300 font-semibold">Coordenadas UTM WGS 84</p>
          <p className="text-[11px] text-slate-500 mt-1">Almacén central e intermedio georreferenciados para fiscalización OEFA.</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-left">
          <div className="text-amber-400 text-xs font-bold mb-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Regímenes Especiales
          </div>
          <p className="text-xs text-slate-300 font-semibold">RAEE, NFU y Descarte</p>
          <p className="text-[11px] text-slate-500 mt-1">Tratamiento de REP para 11 categorías de RAEE y material de descarte Art. 9.</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-left">
          <div className="text-purple-400 text-xs font-bold mb-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Cero Alucinaciones
          </div>
          <p className="text-xs text-slate-300 font-semibold">Trazabilidad Total</p>
          <p className="text-[11px] text-slate-500 mt-1">No se inventan datos ni números; campos no informados se marcan pendientes.</p>
        </div>
      </div>

    </div>
  );
};
