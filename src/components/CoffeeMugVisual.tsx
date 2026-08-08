/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface CoffeeMugVisualProps {
  size?: 'small' | 'medium' | 'large';
  showAura?: boolean;
  isBursting?: boolean;
  className?: string;
}

export const CoffeeMugVisual: React.FC<CoffeeMugVisualProps> = ({
  size = 'large',
  showAura = true,
  isBursting = false,
  className = ''
}) => {
  const dimensions = {
    small: { width: 38, height: 38, steamOffset: '-top-5', steamWidth: 'w-1 h-4', auraSize: 'w-12 h-12' },
    medium: { width: 52, height: 52, steamOffset: '-top-6', steamWidth: 'w-1.5 h-5', auraSize: 'w-16 h-16' },
    large: { width: 72, height: 72, steamOffset: '-top-8', steamWidth: 'w-2 h-7', auraSize: 'w-24 h-24' },
  }[size];

  return (
    <div className={`relative flex flex-col items-center justify-center select-none ${className}`}>
      {/* Glowing Backdrop Aura */}
      {showAura && (
        <div className={`absolute ${dimensions.auraSize} bg-gradient-to-tr from-amber-500/35 via-orange-400/25 to-amber-300/35 rounded-full blur-xl pointer-events-none animate-pulse`} />
      )}

      <div className="relative animate-float-mug flex flex-col items-center">
        {/* Steam Particles */}
        <div className={`absolute ${dimensions.steamOffset} flex items-center justify-center space-x-2 pointer-events-none z-10`}>
          <span className={`${dimensions.steamWidth} bg-gradient-to-t from-amber-200/90 to-transparent rounded-full blur-[0.5px] animate-steam-1`} />
          <span className={`${dimensions.steamWidth} h-8 bg-gradient-to-t from-white/95 via-amber-100/80 to-transparent rounded-full blur-[0.5px] animate-steam-2`} />
          <span className={`${dimensions.steamWidth} bg-gradient-to-t from-amber-200/90 to-transparent rounded-full blur-[0.5px] animate-steam-3`} />
        </div>

        {/* Steam Burst effect on tap */}
        {isBursting && (
          <div className="absolute -top-12 inset-x-0 flex items-center justify-center pointer-events-none z-20">
            <span className="w-14 h-14 bg-amber-200/80 rounded-full blur-md animate-steam-burst" />
          </div>
        )}

        {/* Vector Coffee Mug */}
        <svg
          width={dimensions.width}
          height={dimensions.height}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-xl filter transition-transform"
        >
          {/* Mug Body */}
          <path
            d="M14 22 C14 20, 50 20, 50 22 L47 50 C46 56, 18 56, 17 50 Z"
            fill="url(#mugGradient)"
            stroke="#78350f"
            strokeWidth="2"
          />
          {/* Coffee Surface */}
          <ellipse cx="32" cy="22" rx="18" ry="4" fill="#451a03" />
          <ellipse cx="32" cy="22" rx="14" ry="2.8" fill="#78350f" />
          {/* Latte Art / Foam Heart */}
          <path
            d="M32 23.5 C30 21.5, 27 22.5, 28.5 24.5 C29.5 25.5, 32 27, 32 27 C32 27, 34.5 25.5, 35.5 24.5 C37 22.5, 34 21.5, 32 23.5 Z"
            fill="#fef3c7"
            opacity="0.95"
          />
          {/* Mug Handle */}
          <path
            d="M48 26 C56 26, 57 42, 46 44"
            stroke="url(#mugHandleGradient)"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
          />
          {/* Glass Highlight Reflection */}
          <path
            d="M18 25 L20 48"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.35"
          />

          <defs>
            <linearGradient id="mugGradient" x1="14" y1="20" x2="50" y2="56" gradientUnits="userSpaceOnUse">
              <stop stopColor="#d97706" />
              <stop offset="0.65" stopColor="#b45309" />
              <stop offset="1" stopColor="#78350f" />
            </linearGradient>
            <linearGradient id="mugHandleGradient" x1="48" y1="26" x2="56" y2="44" gradientUnits="userSpaceOnUse">
              <stop stopColor="#d97706" />
              <stop offset="1" stopColor="#78350f" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
};
