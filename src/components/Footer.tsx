import React from 'react';
import { ShieldCheck, Award, BookOpen, Layers } from 'lucide-react';
import { GryphosLogo } from './GryphosLogo';

export const Footer: React.FC = () => {
  return (
    <footer className="no-print mt-auto border-t border-purple-900/40 bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-950 text-slate-400 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand & Slogan */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-3">
              <GryphosLogo size="sm" withGlow={true} withBorder={true} />
              <span className="text-lg font-black tracking-wider bg-gradient-to-r from-amber-300 via-yellow-200 to-purple-300 bg-clip-text text-transparent font-serif">
                CASA GRYPHOS
              </span>
            </div>
            <p className="text-sm italic text-amber-200/90 font-medium border-l-2 border-amber-400/60 pl-3">
              «Ciencia, tecnología y rigor técnico para la gestión ambiental sostenible y la economía circular.»
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              Plataforma desarrollada para facilitar el diagnóstico, elaboración progresiva, 
              control de calidad y revisión técnica automatizada del Plan de Minimización y Manejo 
              de Residuos Sólidos No Municipales (PMMRS) en el Perú.
            </p>
          </div>

          {/* Legal Framework */}
          <div>
            <h4 className="text-xs uppercase font-bold text-amber-300 tracking-wider mb-3 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              Marco Normativo
            </h4>
            <ul className="text-xs space-y-1.5 text-slate-400">
              <li>• R.M. N.° 089-2023-MINAM (Contenido Mínimo)</li>
              <li>• D.L. N.° 1278 y Ley N.° 32212</li>
              <li>• D.S. N.° 014-2017-MINAM y D.S. 001-2022</li>
              <li>• NTP 900.058:2019 (Código de Colores)</li>
              <li>• Convenio de Basilea (Anexos I, III, IV, V)</li>
              <li>• D.S. N.° 009-2019 (RAEE) / D.S. 024-2021 (NFU)</li>
            </ul>
          </div>

          {/* Metadata & Intellectual Property */}
          <div>
            <h4 className="text-xs uppercase font-bold text-purple-300 tracking-wider mb-3 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-purple-400" />
              Certificación & Propiedad
            </h4>
            <div className="text-xs space-y-2 text-slate-400">
              <p>
                <strong className="text-slate-300">Fecha de Creación:</strong> Septiembre de 2026
              </p>
              <p>
                <strong className="text-slate-300">Propiedad Intelectual:</strong> Todos los derechos reservados © CASA GRYPHOS
              </p>
              <div className="pt-2 flex items-center gap-1.5 text-amber-300 font-semibold">
                <ShieldCheck className="w-4 h-4 text-purple-400" />
                <span>Auditoría y Trazabilidad Certificada</span>
              </div>
            </div>
          </div>

        </div>

        <div className="border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
          <p>
            PLAN DE MINIMIZACIÓN DE RESIDUOS SÓLIDOS (PMMRS) — No municipales para empresas del sector privado.
          </p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/50 text-amber-300 border border-purple-800/40 text-[11px] font-semibold">
              <Layers className="w-3.5 h-3.5 text-amber-400" /> Versión 1.0 Oficial • CASA GRYPHOS
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
