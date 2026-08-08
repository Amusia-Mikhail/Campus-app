/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface AnimatedCoffeeMugProps {
  size?: 'small' | 'medium' | 'large';
  showAura?: boolean;
  isBursting?: boolean;
  floatAnimation?: boolean;
  className?: string;
}

export const AnimatedCoffeeMug: React.FC<AnimatedCoffeeMugProps> = ({
  size = 'large',
  showAura = true,
  isBursting = false,
  floatAnimation = true,
  className = '',
}) => {
  const dimensions = {
    small: { width: 42, height: 42, steamOffset: '-top-5', steamWidth: 'w-1 h-4', auraSize: 'w-12 h-12' },
    medium: { width: 56, height: 56, steamOffset: '-top-7', steamWidth: 'w-1.5 h-6', auraSize: 'w-16 h-16' },
    large: { width: 80, height: 80, steamOffset: '-top-9', steamWidth: 'w-2 h-8', auraSize: 'w-28 h-28' },
  }[size];

  return (
    <div className={`relative flex flex-col items-center justify-center select-none gpu-accelerated ${className}`}>
      {/* Glowing Warm Aura */}
      {showAura && (
        <div
          className={`absolute ${dimensions.auraSize} bg-gradient-to-tr from-amber-500/40 via-orange-400/30 to-terracotta/30 rounded-full blur-xl pointer-events-none animate-pulse gpu-accelerated`}
        />
      )}

      <div className={`relative flex flex-col items-center gpu-accelerated ${floatAnimation ? 'animate-float-mug' : ''}`}>
        {/* Steam Wisps */}
        <div className={`absolute ${dimensions.steamOffset} flex items-center justify-center space-x-2 pointer-events-none z-10 gpu-accelerated`}>
          {/* Steam Wisp 1 */}
          <svg className="w-3 h-7 text-amber-100/80 animate-steam-wisp-1 filter blur-[0.3px]" viewBox="0 0 10 30" fill="none">
            <path d="M5 28 C1 20, 9 12, 5 2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>

          {/* Steam Wisp 2 (Center) */}
          <svg className="w-3.5 h-8 text-amber-50/90 animate-steam-wisp-2 filter blur-[0.2px]" viewBox="0 0 10 30" fill="none">
            <path d="M5 28 C9 20, 1 12, 5 2" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>

          {/* Steam Wisp 3 */}
          <svg className="w-3 h-7 text-amber-100/80 animate-steam-wisp-3 filter blur-[0.3px]" viewBox="0 0 10 30" fill="none">
            <path d="M5 28 C2 19, 8 11, 5 2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>

        {/* Burst Effect on Tap */}
        {isBursting && (
          <div className="absolute -top-12 inset-x-0 flex items-center justify-center pointer-events-none z-20">
            <span className="w-16 h-16 bg-amber-200/90 rounded-full blur-md animate-steam-burst gpu-accelerated" />
          </div>
        )}

        {/* Rich Terracotta/Cream Vector Ceramic Mug */}
        <svg
          width={dimensions.width}
          height={dimensions.height}
          viewBox="0 0 72 72"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-2xl filter gpu-accelerated"
          style={{
            willChange: 'transform, opacity',
            transform: 'translate3d(0, 0, 0)',
            transition: 'transform 450ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 350ms ease-out',
          }}
        >
          {/* Drop Shadow Base */}
          <ellipse cx="36" cy="62" rx="22" ry="4" fill="#130a06" opacity="0.3" />

          {/* Ceramic Coaster / Saucer */}
          <ellipse cx="36" cy="58" rx="26" ry="6" fill="url(#saucerGrad)" stroke="#8d3d2c" strokeWidth="1.5" />
          <ellipse cx="36" cy="57" rx="22" ry="4.5" fill="#f5f0e6" opacity="0.6" />

          {/* Mug Outer Body */}
          <path
            d="M16 24 C16 22, 56 22, 56 24 L52 54 C51 60, 21 60, 20 54 Z"
            fill="url(#terracottaBodyGrad)"
            stroke="#6b2316"
            strokeWidth="2"
          />

          {/* Mug Handle */}
          <path
            d="M54 28 C64 28, 66 46, 52 48"
            stroke="url(#handleGrad)"
            strokeWidth="5.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Mug Handle Inner Accent */}
          <path
            d="M54 30 C60 30, 61 43, 52 45"
            stroke="#531b11"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Mug Inner Rim */}
          <ellipse cx="36" cy="24" rx="20" ry="5" fill="#4a180e" stroke="#2c0c07" strokeWidth="1" />

          {/* Rich Dark Roast Coffee Liquid Level */}
          <ellipse cx="36" cy="25" rx="18.5" ry="4.2" fill="url(#coffeeLiquidGrad)" />

          {/* Creamy Foam Surface Ring */}
          <ellipse cx="36" cy="25" rx="16.5" ry="3.5" fill="none" stroke="#d97706" strokeWidth="1" opacity="0.6" />

          {/* Latte Art Heart */}
          <path
            d="M36 26.5 C34 24, 30.5 25, 32.5 27.5 C33.8 28.8, 36 30.5, 36 30.5 C36 30.5, 38.2 28.8, 39.5 27.5 C41.5 25, 38 24, 36 26.5 Z"
            fill="url(#foamGrad)"
            opacity="0.95"
          />

          {/* Glossy Ceramic Highlight Arc */}
          <path
            d="M21 28 L23 52"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.3"
          />
          <path
            d="M25 29 L26.5 48"
            stroke="white"
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0.15"
          />

          <defs>
            {/* Terracotta Body Gradient */}
            <linearGradient id="terracottaBodyGrad" x1="16" y1="22" x2="56" y2="60" gradientUnits="userSpaceOnUse">
              <stop stopColor="#d96b52" />
              <stop offset="0.5" stopColor="#c05c46" />
              <stop offset="0.85" stopColor="#9a3e2a" />
              <stop offset="1" stopColor="#6b2316" />
            </linearGradient>

            {/* Handle Gradient */}
            <linearGradient id="handleGrad" x1="54" y1="28" x2="66" y2="48" gradientUnits="userSpaceOnUse">
              <stop stopColor="#d96b52" />
              <stop offset="1" stopColor="#8a3322" />
            </linearGradient>

            {/* Saucer Gradient */}
            <linearGradient id="saucerGrad" x1="10" y1="58" x2="62" y2="58" gradientUnits="userSpaceOnUse">
              <stop stopColor="#f5f0e6" />
              <stop offset="0.7" stopColor="#e2d6c3" />
              <stop offset="1" stopColor="#c0a98c" />
            </linearGradient>

            {/* Dark Roast Coffee Liquid Gradient */}
            <radialGradient id="coffeeLiquidGrad" cx="36" cy="25" r="18.5" fx="32" fy="23" gradientUnits="userSpaceOnUse">
              <stop stopColor="#6b3410" />
              <stop offset="0.6" stopColor="#3d1b08" />
              <stop offset="1" stopColor="#1e0b03" />
            </radialGradient>

            {/* Foam Latte Art Gradient */}
            <linearGradient id="foamGrad" x1="30" y1="24" x2="42" y2="30" gradientUnits="userSpaceOnUse">
              <stop stopColor="#fff8ed" />
              <stop offset="1" stopColor="#fef3c7" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
};
