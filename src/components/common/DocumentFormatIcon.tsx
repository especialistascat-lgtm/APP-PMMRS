import React from 'react';
import { 
  FileText, 
  FileSpreadsheet, 
  FileCode, 
  FileCheck, 
  AlertCircle 
} from 'lucide-react';
import { SupportedDocType } from '../../services/documentExtractor';

interface DocumentFormatIconProps {
  type: SupportedDocType;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  extension?: string;
  className?: string;
}

export const DocumentFormatIcon: React.FC<DocumentFormatIconProps> = ({
  type,
  size = 'md',
  extension = '',
  className = '',
}) => {
  const extUpper = (extension || type).toUpperCase();

  const sizeClasses = {
    sm: { container: 'w-8 h-8 rounded-lg', icon: 'w-4 h-4', badge: 'text-[9px] px-1' },
    md: { container: 'w-12 h-12 rounded-xl', icon: 'w-6 h-6', badge: 'text-[10px] px-1.5' },
    lg: { container: 'w-16 h-16 rounded-2xl', icon: 'w-8 h-8', badge: 'text-xs px-2' },
    xl: { container: 'w-20 h-20 rounded-2xl', icon: 'w-10 h-10', badge: 'text-xs px-2.5' },
  }[size];

  // Specific visual styles for PDF, Word, and Excel
  if (type === 'pdf') {
    return (
      <div className={`relative flex items-center justify-center shrink-0 bg-gradient-to-br from-red-500/20 via-rose-600/15 to-red-950/40 border-2 border-red-500/50 text-red-400 shadow-lg shadow-red-950/30 ${sizeClasses.container} ${className}`}>
        <FileText className={sizeClasses.icon} />
        <span className={`absolute -bottom-1 font-black bg-red-600 text-white rounded font-mono tracking-tight shadow-md ${sizeClasses.badge}`}>
          PDF
        </span>
      </div>
    );
  }

  if (type === 'word') {
    return (
      <div className={`relative flex items-center justify-center shrink-0 bg-gradient-to-br from-blue-500/20 via-indigo-600/15 to-blue-950/40 border-2 border-blue-500/50 text-blue-400 shadow-lg shadow-blue-950/30 ${sizeClasses.container} ${className}`}>
        <FileText className={sizeClasses.icon} />
        <span className={`absolute -bottom-1 font-black bg-blue-600 text-white rounded font-mono tracking-tight shadow-md ${sizeClasses.badge}`}>
          {extUpper.includes('DOC') ? extUpper : 'DOCX'}
        </span>
      </div>
    );
  }

  if (type === 'excel') {
    return (
      <div className={`relative flex items-center justify-center shrink-0 bg-gradient-to-br from-emerald-500/20 via-teal-600/15 to-emerald-950/40 border-2 border-emerald-500/50 text-emerald-400 shadow-lg shadow-emerald-950/30 ${sizeClasses.container} ${className}`}>
        <FileSpreadsheet className={sizeClasses.icon} />
        <span className={`absolute -bottom-1 font-black bg-emerald-600 text-white rounded font-mono tracking-tight shadow-md ${sizeClasses.badge}`}>
          {extUpper.includes('XLS') || extUpper === 'CSV' ? extUpper : 'XLSX'}
        </span>
      </div>
    );
  }

  // Plain Text / Other
  return (
    <div className={`relative flex items-center justify-center shrink-0 bg-gradient-to-br from-slate-700/30 via-slate-800/20 to-slate-950/40 border-2 border-slate-600/50 text-slate-300 shadow-lg ${sizeClasses.container} ${className}`}>
      <FileCode className={sizeClasses.icon} />
      <span className={`absolute -bottom-1 font-black bg-slate-700 text-white rounded font-mono tracking-tight shadow-md ${sizeClasses.badge}`}>
        {extUpper || 'TXT'}
      </span>
    </div>
  );
};
