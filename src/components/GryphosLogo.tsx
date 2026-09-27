import React, { useState } from 'react';

interface GryphosLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  className?: string;
  withGlow?: boolean;
  withBorder?: boolean;
}

export const GryphosLogo: React.FC<GryphosLogoProps> = ({
  size = 'md',
  className = '',
  withGlow = true,
  withBorder = true,
}) => {
  const [imageError, setImageError] = useState(false);

  const sizeDimensions = {
    xs: 'w-7 h-7 min-w-7',
    sm: 'w-9 h-9 min-w-9',
    md: 'w-12 h-12 min-w-12',
    lg: 'w-16 h-16 min-w-16',
    xl: 'w-24 h-24 min-w-24',
    hero: 'w-32 h-32 min-w-32 sm:w-40 sm:h-40',
  }[size];

  const glowStyles = withGlow
    ? 'shadow-[0_0_25px_rgba(245,158,11,0.35),0_0_15px_rgba(147,51,234,0.45)]'
    : 'shadow-md';

  const borderStyles = withBorder
    ? 'ring-2 ring-amber-400/60 border border-purple-500/50'
    : '';

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-2xl overflow-hidden bg-gradient-to-br from-purple-950 via-slate-950 to-amber-950 transition-all duration-300 ${sizeDimensions} ${glowStyles} ${borderStyles} ${className}`}
    >
      {!imageError ? (
        <img
          src="/gryphos-logo.jpg"
          alt="Casa Gryphos Logo"
          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
          onError={() => setImageError(true)}
        />
      ) : (
        /* Vector SVG Fallback with Heraldic Griffin, Crown & Golden filigree */
        <svg
          viewBox="0 0 120 120"
          className="w-full h-full p-1"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="gryphosBg" cx="50%" cy="50%" r="60%">
              <stop offset="0%" stopColor="#4c1d95" />
              <stop offset="60%" stopColor="#2e1065" />
              <stop offset="100%" stopColor="#0f0728" />
            </radialGradient>
            <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="35%" stopColor="#f59e0b" />
              <stop offset="70%" stopColor="#d97706" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>
            <linearGradient id="purpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#c084fc" />
              <stop offset="50%" stopColor="#9333ea" />
              <stop offset="100%" stopColor="#581c87" />
            </linearGradient>
          </defs>

          {/* Shield Base */}
          <path
            d="M60 8 C88 8 108 24 108 55 C108 85 60 112 60 112 C60 112 12 85 12 55 C12 24 32 8 60 8 Z"
            fill="url(#gryphosBg)"
            stroke="url(#goldGrad)"
            strokeWidth="3.5"
          />

          {/* Inner Golden Border */}
          <path
            d="M60 15 C82 15 100 28 100 55 C100 80 60 102 60 102 C60 102 20 80 20 55 C20 28 38 15 60 15 Z"
            stroke="url(#goldGrad)"
            strokeWidth="1.2"
            strokeDasharray="2 2"
            opacity="0.8"
          />

          {/* Heraldic Crown */}
          <path
            d="M44 26 L50 34 L60 22 L70 34 L76 26 L74 38 L46 38 Z"
            fill="url(#goldGrad)"
            stroke="#78350f"
            strokeWidth="0.8"
          />
          <circle cx="44" cy="25" r="2" fill="#fde68a" />
          <circle cx="60" cy="21" r="2.5" fill="#fde68a" />
          <circle cx="76" cy="25" r="2" fill="#fde68a" />

          {/* Griffin Silhouette */}
          {/* Wings */}
          <path
            d="M60 48 C72 36 88 40 92 56 C86 54 80 58 76 64 C84 62 88 68 86 74 C78 72 74 76 70 80 C65 72 62 60 60 48 Z"
            fill="url(#goldGrad)"
          />
          <path
            d="M60 48 C48 36 32 40 28 56 C34 54 40 58 44 64 C36 62 32 68 34 74 C42 72 46 76 50 80 C55 72 58 60 60 48 Z"
            fill="url(#goldGrad)"
          />

          {/* Griffin Head & Eagle Beak */}
          <path
            d="M56 42 C56 36 64 36 64 42 C68 44 72 48 70 52 L62 52 L60 55 L58 52 L50 52 C48 48 52 44 56 42 Z"
            fill="#fde68a"
          />
          <polygon points="60,49 65,54 55,54" fill="#d97706" />

          {/* Lion Body & Paws */}
          <path
            d="M52 62 C52 56 68 56 68 62 C70 70 72 82 70 90 L64 90 L60 84 L56 90 L50 90 C48 82 50 70 52 62 Z"
            fill="url(#goldGrad)"
          />

          {/* Griffin Monogram Ribbon */}
          <rect x="36" y="94" width="48" height="12" rx="4" fill="url(#goldGrad)" />
          <text
            x="60"
            y="103"
            textAnchor="middle"
            fill="#2e1065"
            fontSize="7"
            fontWeight="900"
            letterSpacing="0.8"
            fontFamily="serif"
          >
            GRYPHOS
          </text>
        </svg>
      )}

      {/* Subtle royal purple & gold ambient sheen */}
      <div className="absolute inset-0 pointer-events-none rounded-2xl bg-gradient-to-t from-purple-900/20 via-transparent to-amber-300/10 mix-blend-overlay" />
    </div>
  );
};
