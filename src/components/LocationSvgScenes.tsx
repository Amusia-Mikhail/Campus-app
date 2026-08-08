/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface LocationSvgProps {
  locationId: string;
  isDark: boolean;
  className?: string;
}

export const LocationSvgScene: React.FC<LocationSvgProps> = ({
  locationId,
  isDark,
  className = 'w-full h-full object-cover rounded-2xl'
}) => {
  // Shared painterly canvas noise filter ID for rich brush texture
  const filterId = `painterly-texture-${locationId}`;

  switch (locationId) {
    case 'science_lab':
      return (
        <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" className={className}>
          <defs>
            <filter id={filterId} x="0%" y="0%" width="100%" height="100%">
              <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
              <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.04 0" in="noise" result="softNoise" />
              <feComposite operator="in" in2="SourceGraphic" />
              <feBlend mode="multiply" in="SourceGraphic" result="blend" />
            </filter>

            <linearGradient id="labBg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={isDark ? '#1C100B' : '#F7ECE1'} />
              <stop offset="50%" stopColor={isDark ? '#2D180E' : '#EEDCCA'} />
              <stop offset="100%" stopColor={isDark ? '#180B07' : '#DCBEA5'} />
            </linearGradient>

            <linearGradient id="labBrickPattern" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={isDark ? '#4A2218' : '#C26349'} />
              <stop offset="100%" stopColor={isDark ? '#260F09' : '#9E422C'} />
            </linearGradient>

            <linearGradient id="labSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={isDark ? '#050B14' : '#FFE0B2'} />
              <stop offset="100%" stopColor={isDark ? '#0F172A' : '#F8BBD0'} />
            </linearGradient>

            <linearGradient id="labBenchTop" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={isDark ? '#361A0E' : '#8A4222'} />
              <stop offset="50%" stopColor={isDark ? '#4A2414' : '#A3522C'} />
              <stop offset="100%" stopColor={isDark ? '#260F08' : '#692E15'} />
            </linearGradient>

            <linearGradient id="labWood" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={isDark ? '#2F160C' : '#7A381B'} />
              <stop offset="100%" stopColor={isDark ? '#170904' : '#4D200E'} />
            </linearGradient>

            <radialGradient id="lampGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFF176" stopOpacity={isDark ? '0.95' : '0.7'} />
              <stop offset="50%" stopColor="#FFB300" stopOpacity={isDark ? '0.45' : '0.3'} />
              <stop offset="100%" stopColor="#FF8F00" stopOpacity="0" />
            </radialGradient>

            <linearGradient id="sunRay" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FFF59D" stopOpacity={isDark ? '0.15' : '0.4'} />
              <stop offset="100%" stopColor="#FFE082" stopOpacity="0" />
            </linearGradient>

            <radialGradient id="liquidGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#4FC3F7" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#0288D1" stopOpacity="0.4" />
            </radialGradient>
          </defs>

          {/* Wall Background */}
          <rect width="400" height="300" fill="url(#labBg)" filter={`url(#${filterId})`} />

          {/* Warm Brick Wall Top Banner & Arches */}
          <path d="M 0 0 L 400 0 L 400 135 Q 200 165 0 135 Z" fill="url(#labBrickPattern)" opacity="0.9" />
          <path d="M 0 135 Q 200 165 400 135 L 400 140 Q 200 170 0 140 Z" fill={isDark ? '#1C0E0A' : '#6B311B'} />

          {/* Arched Window in Background */}
          <g id="lab-window">
            <path d="M 130 130 L 130 40 Q 200 12 270 40 L 270 130 Z" fill="url(#labSky)" stroke={isDark ? '#260F08' : '#5C2812'} strokeWidth="6" />
            <line x1="200" y1="20" x2="200" y2="130" stroke={isDark ? '#260F08' : '#5C2812'} strokeWidth="3" />
            <line x1="130" y1="75" x2="270" y2="75" stroke={isDark ? '#260F08' : '#5C2812'} strokeWidth="3" />
            
            {/* Campus Trees Outside Window */}
            {!isDark ? (
              <g opacity="0.85">
                <circle cx="160" cy="95" r="24" fill="#388E3C" />
                <circle cx="240" cy="100" r="28" fill="#1B5E20" />
                <circle cx="200" cy="105" r="20" fill="#66BB6A" />
              </g>
            ) : (
              <g opacity="0.8">
                <circle cx="225" cy="50" r="12" fill="#FFF59D" opacity="0.9" />
                <circle cx="230" cy="47" r="10" fill="#0F172A" />
              </g>
            )}
          </g>

          {/* Sun Rays streaming into lab */}
          <polygon points="130,40 270,40 380,280 0,280" fill="url(#sunRay)" />

          {/* Chalkboard with Chemistry Formulas (Left) */}
          <g id="lab-chalkboard" transform="translate(15, 30)">
            <rect x="0" y="0" width="100" height="90" fill="#1C3829" rx="4" stroke={isDark ? '#260F08' : '#6B311B'} strokeWidth="4" />
            <path d="M 15 25 Q 30 15 45 25 T 75 25" fill="none" stroke="#E8F5E9" strokeWidth="1.5" strokeDasharray="4 2" opacity="0.85" />
            <circle cx="30" cy="50" r="12" fill="none" stroke="#E8F5E9" strokeWidth="1.5" opacity="0.85" />
            <circle cx="65" cy="50" r="12" fill="none" stroke="#E8F5E9" strokeWidth="1.5" opacity="0.85" />
            <line x1="42" y1="50" x2="53" y2="50" stroke="#E8F5E9" strokeWidth="1.5" opacity="0.85" />
            <text x="12" y="80" fill="#E8F5E9" fontSize="9" fontFamily="serif" opacity="0.9">C8H10N4O2 + H2O</text>
          </g>

          {/* Reagent Cabinet / Wall Shelves (Right) */}
          <g id="lab-shelves" transform="translate(285, 30)">
            <rect x="0" y="0" width="100" height="95" fill={isDark ? '#231008' : '#7A381B'} rx="3" stroke={isDark ? '#170904' : '#4D200E'} strokeWidth="3" />
            <rect x="5" y="30" width="90" height="4" fill="#4D200E" />
            <rect x="5" y="62" width="90" height="4" fill="#4D200E" />

            {/* Glass Bottles with colorful fluids */}
            <rect x="10" y="8" width="14" height="22" rx="2" fill="#29B6F6" opacity="0.9" />
            <rect x="28" y="12" width="12" height="18" rx="2" fill="#EF5350" opacity="0.9" />
            <rect x="44" y="6" width="16" height="24" rx="2" fill="#66BB6A" opacity="0.9" />
            <rect x="64" y="10" width="14" height="20" rx="2" fill="#AB47BC" opacity="0.9" />

            <rect x="12" y="38" width="18" height="24" rx="2" fill="#FFA726" opacity="0.9" />
            <rect x="35" y="42" width="14" height="20" rx="2" fill="#26A69A" opacity="0.9" />
            <rect x="54" y="36" width="16" height="26" rx="2" fill="#EC407A" opacity="0.9" />
          </g>

          {/* Main Mahogany Lab Countertop */}
          <g id="lab-main-bench">
            <rect x="0" y="150" width="400" height="22" fill="url(#labBenchTop)" />
            <rect x="0" y="172" width="400" height="128" fill="url(#labWood)" />
            {/* Panel Doors with Wood Grain */}
            <rect x="15" y="185" width="80" height="105" fill="none" stroke={isDark ? '#120603' : '#3D180B'} strokeWidth="3" rx="4" />
            <rect x="110" y="185" width="80" height="105" fill="none" stroke={isDark ? '#120603' : '#3D180B'} strokeWidth="3" rx="4" />
            <rect x="210" y="185" width="80" height="105" fill="none" stroke={isDark ? '#120603' : '#3D180B'} strokeWidth="3" rx="4" />
            <rect x="305" y="185" width="80" height="105" fill="none" stroke={isDark ? '#120603' : '#3D180B'} strokeWidth="3" rx="4" />
            {/* Handles */}
            <rect x="82" y="230" width="5" height="18" fill="#FFB300" rx="1" />
            <rect x="118" y="230" width="5" height="18" fill="#FFB300" rx="1" />
            <rect x="277" y="230" width="5" height="18" fill="#FFB300" rx="1" />
            <rect x="313" y="230" width="5" height="18" fill="#FFB300" rx="1" />
          </g>

          {/* Brass Sink & Gooseneck Faucet */}
          <g id="lab-sink" transform="translate(180, 140)">
            <rect x="0" y="8" width="40" height="8" fill="#3D180B" rx="2" />
            <path d="M 20 8 L 20 -15 Q 20 -24 8 -24 L 2 -24" stroke="#FFB300" strokeWidth="4" fill="none" strokeLinecap="round" />
            <circle cx="20" cy="-2" r="3.5" fill="#FFA000" />
          </g>

          {/* DETAILED VINTAGE BRASS MICROSCOPE */}
          <g id="lab-microscope" transform="translate(30, 70)">
            <path d="M 10 80 L 45 80 L 40 72 L 15 72 Z" fill="#3D180B" />
            <path d="M 38 72 C 48 60 42 35 28 25 L 22 28 C 34 36 38 55 30 72 Z" fill="#FFB300" />
            <rect x="12" y="55" width="28" height="5" fill="#1C0E0A" />
            <path d="M 22 25 L 12 5" stroke="#4A2414" strokeWidth="4" strokeLinecap="round" />
            <path d="M 26 25 L 20 5" stroke="#FFB300" strokeWidth="3" strokeLinecap="round" />
            <circle cx="12" cy="5" r="4" fill="#FFB300" />
            <circle cx="20" cy="5" r="3.5" fill="#FFA000" />
            {/* Specimen Slide */}
            <rect x="16" y="52" width="20" height="3" fill="#E0F7FA" opacity="0.9" />
          </g>

          {/* ERLENMEYER FLASK & BUBBLING BLUE SOLUTION */}
          <g id="lab-flask" transform="translate(110, 75)">
            <polygon points="40,75 20,38 32,38 52,75" fill="url(#liquidGlow)" />
            <polygon points="40,75 20,38 32,38 52,75" stroke="#E0F7FA" strokeWidth="2" fill="none" />
            <rect x="23" y="33" width="6" height="6" fill="#7A381B" />
            <path d="M 26 33 L 26 18 Q 26 8 40 8 L 60 8" fill="none" stroke="#FFB300" strokeWidth="2.5" />
            {/* Bubbles */}
            <circle cx="34" cy="62" r="2.5" fill="#FFF" opacity="0.8" />
            <circle cx="38" cy="52" r="2" fill="#FFF" opacity="0.8" />
            <circle cx="32" cy="44" r="1.5" fill="#FFF" opacity="0.8" />
          </g>

          {/* BUNSEN BURNER & ROUND BOTTOM FLASK */}
          <g id="lab-distillation" transform="translate(230, 80)">
            <circle cx="25" cy="50" r="18" fill="#FFB300" opacity="0.85" />
            <circle cx="25" cy="50" r="18" stroke="#FFF59D" strokeWidth="2" fill="none" />
            <rect x="20" y="18" width="10" height="18" stroke="#FFF59D" strokeWidth="2" fill="none" />
            {/* Bunsen Stand */}
            <rect x="16" y="68" width="18" height="5" fill="#4A2414" />
            <path d="M 22 68 L 22 58 M 28 68 L 28 58" stroke="#4A2414" strokeWidth="2" />
            {/* Flame */}
            <path d="M 22 68 Q 25 56 28 68 Z" fill="#29B6F6" />
            <path d="M 23.5 68 Q 25 60 26.5 68 Z" fill="#FFF" />
          </g>

          {/* TEST TUBE RACK */}
          <g id="lab-test-tubes" transform="translate(315, 110)">
            <rect x="0" y="32" width="65" height="8" fill="#5C2812" rx="2" />
            <rect x="5" y="10" width="55" height="4" fill="#5C2812" />
            <rect x="8" y="12" width="7" height="24" rx="3.5" fill="#EF5350" opacity="0.9" />
            <rect x="19" y="12" width="7" height="24" rx="3.5" fill="#FFA726" opacity="0.9" />
            <rect x="30" y="12" width="7" height="24" rx="3.5" fill="#66BB6A" opacity="0.9" />
            <rect x="41" y="12" width="7" height="24" rx="3.5" fill="#29B6F6" opacity="0.9" />
            <rect x="52" y="12" width="7" height="24" rx="3.5" fill="#AB47BC" opacity="0.9" />
          </g>

          {/* REALISTIC PAINTE D STUDENTS IN LAB COATS */}
          <g id="lab-student-1" transform="translate(65, 90)">
            {/* Hair */}
            <path d="M 8 2 Q 18 -6 28 2 Q 32 12 28 22 L 8 22 Z" fill="#4A2414" />
            {/* Face */}
            <circle cx="18" cy="14" r="9" fill="#FFCC80" />
            {/* Goggles */}
            <rect x="10" y="10" width="16" height="6" rx="2" fill="#80DEEA" opacity="0.85" stroke="#37474F" strokeWidth="1" />
            {/* Lab Coat Body */}
            <path d="M 3 24 L 33 24 L 37 62 L -1 62 Z" fill="#FAFAFA" stroke="#CFD8DC" strokeWidth="1.5" />
            <path d="M 18 24 L 18 62" stroke="#B0BEC5" strokeWidth="1" />
            <rect x="8" y="36" width="8" height="10" rx="1" fill="none" stroke="#CFD8DC" strokeWidth="1" />
          </g>

          <g id="lab-student-2" transform="translate(285, 80)">
            {/* Hair */}
            <circle cx="16" cy="10" r="11" fill="#212121" />
            {/* Face */}
            <circle cx="16" cy="12" r="8.5" fill="#8D5B4C" />
            {/* Lab Coat */}
            <path d="M 2 22 L 30 22 L 34 72 L -2 72 Z" fill="#FAFAFA" stroke="#CFD8DC" strokeWidth="1.5" />
            <path d="M 16 22 L 16 72" stroke="#B0BEC5" strokeWidth="1" />
            <rect x="20" y="34" width="8" height="10" rx="1" fill="none" stroke="#CFD8DC" strokeWidth="1" />
          </g>

          {/* Overhead Brass Pendant Lamp */}
          <g id="lab-overhead-lamp">
            <line x1="200" y1="0" x2="200" y2="25" stroke="#4A2414" strokeWidth="3" />
            <path d="M 180 35 L 220 35 L 210 25 L 190 25 Z" fill="#FFB300" />
            <circle cx="200" cy="38" r="7" fill="#FFF" />
            <circle cx="200" cy="38" r="110" fill="url(#lampGlow)" />
          </g>
        </svg>
      );

    case 'dining_hall':
      return (
        <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" className={className}>
          <defs>
            <filter id={filterId} x="0%" y="0%" width="100%" height="100%">
              <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="3" result="noise" />
              <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.04 0" in="noise" result="softNoise" />
              <feComposite operator="in" in2="SourceGraphic" />
              <feBlend mode="multiply" in="SourceGraphic" result="blend" />
            </filter>

            <linearGradient id="diningBg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={isDark ? '#1C0C08' : '#FDF6EE'} />
              <stop offset="50%" stopColor={isDark ? '#2D160C' : '#F7E7D7'} />
              <stop offset="100%" stopColor={isDark ? '#170A06' : '#E8D2C0'} />
            </linearGradient>

            <linearGradient id="gothicWindowSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={isDark ? '#020617' : '#FFE082'} />
              <stop offset="50%" stopColor={isDark ? '#0F172A' : '#FFB74D'} />
              <stop offset="100%" stopColor={isDark ? '#1E293B' : '#81D4FA'} />
            </linearGradient>

            <linearGradient id="woodTableGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={isDark ? '#4A2213' : '#A0522D'} />
              <stop offset="100%" stopColor={isDark ? '#230E07' : '#5C2812'} />
            </linearGradient>

            <radialGradient id="chandelierGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFF59D" stopOpacity="0.95" />
              <stop offset="50%" stopColor="#FFA000" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#FF6F00" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Wall Background */}
          <rect width="400" height="300" fill="url(#diningBg)" filter={`url(#${filterId})`} />

          {/* Grand Timber Ceiling Trusses */}
          <g id="dining-roof-trusses">
            <polygon points="0,0 200,60 400,0 400,18 200,78 0,18" fill={isDark ? '#1C0E0A' : '#5C2812'} />
            <line x1="100" y1="30" x2="100" y2="70" stroke={isDark ? '#2D160C' : '#8A4222'} strokeWidth="4" />
            <line x1="200" y1="60" x2="200" y2="110" stroke={isDark ? '#2D160C' : '#8A4222'} strokeWidth="5" />
            <line x1="300" y1="30" x2="300" y2="70" stroke={isDark ? '#2D160C' : '#8A4222'} strokeWidth="4" />
          </g>

          {/* Wood Paneling Wainscoting */}
          <rect y="130" width="400" height="35" fill={isDark ? '#2D160C' : '#E0CCA9'} />
          <line x1="0" y1="130" x2="400" y2="130" stroke={isDark ? '#1C0E0A' : '#8A4222'} strokeWidth="3" />

          {/* GRAND GOTHIC ARCHED WINDOWS */}
          <g id="gothic-windows">
            {/* Left Window */}
            <path d="M 35 130 L 35 45 A 28 28 0 0 1 91 45 L 91 130 Z" fill="url(#gothicWindowSky)" stroke={isDark ? '#1C0E0A' : '#5C2812'} strokeWidth="6" />
            <line x1="63" y1="18" x2="63" y2="130" stroke={isDark ? '#1C0E0A' : '#5C2812'} strokeWidth="3" />

            {/* Center Window */}
            <path d="M 155 130 L 155 35 A 45 45 0 0 1 245 35 L 245 130 Z" fill="url(#gothicWindowSky)" stroke={isDark ? '#1C0E0A' : '#5C2812'} strokeWidth="7" />
            <line x1="200" y1="0" x2="200" y2="130" stroke={isDark ? '#1C0E0A' : '#5C2812'} strokeWidth="3.5" />
            <circle cx="200" cy="35" r="12" fill="#B71C1C" opacity="0.85" stroke="#FFD54F" strokeWidth="1.5" />

            {/* Right Window */}
            <path d="M 309 130 L 309 45 A 28 28 0 0 1 365 45 L 365 130 Z" fill="url(#gothicWindowSky)" stroke={isDark ? '#1C0E0A' : '#5C2812'} strokeWidth="6" />
            <line x1="337" y1="18" x2="337" y2="130" stroke={isDark ? '#1C0E0A' : '#5C2812'} strokeWidth="3" />
          </g>

          {/* University Banners */}
          <g id="dining-banners">
            <path d="M 102 45 L 140 45 L 140 120 L 121 106 L 102 120 Z" fill="#880E4F" stroke="#FFD54F" strokeWidth="2" />
            <path d="M 260 45 L 298 45 L 298 120 L 279 106 L 260 120 Z" fill="#0D47A1" stroke="#FFD54F" strokeWidth="2" />
          </g>

          {/* CHANDELIERS WITH CANDLE LIGHT */}
          <g id="dining-chandeliers">
            <line x1="115" y1="0" x2="115" y2="40" stroke="#3D180B" strokeWidth="3.5" />
            <ellipse cx="115" cy="40" rx="30" ry="8" fill="none" stroke="#3D180B" strokeWidth="4" />
            <circle cx="115" cy="40" r="55" fill="url(#chandelierGlow)" />

            <line x1="285" y1="0" x2="285" y2="40" stroke="#3D180B" strokeWidth="3.5" />
            <ellipse cx="285" cy="40" rx="30" ry="8" fill="none" stroke="#3D180B" strokeWidth="4" />
            <circle cx="285" cy="40" r="55" fill="url(#chandelierGlow)" />
          </g>

          {/* Serving Bar Buffer Counter (Midground) */}
          <g id="dining-serving-bar">
            <rect x="0" y="150" width="400" height="28" fill={isDark ? '#2D160C' : '#9E4A28'} />
            <rect x="0" y="146" width="400" height="5" fill="#FFB300" />
            {/* Buffet Chafing Dishes */}
            <rect x="35" y="148" width="40" height="10" rx="2" fill="#ECEFF1" stroke="#37474F" strokeWidth="1" />
            <rect x="120" y="148" width="40" height="10" rx="2" fill="#ECEFF1" stroke="#37474F" strokeWidth="1" />
            <rect x="240" y="148" width="40" height="10" rx="2" fill="#ECEFF1" stroke="#37474F" strokeWidth="1" />
            <rect x="325" y="148" width="40" height="10" rx="2" fill="#ECEFF1" stroke="#37474F" strokeWidth="1" />
          </g>

          {/* GRAND POLISHED OAK DINING TABLES (Foreground) */}
          <g id="dining-tables">
            <polygon points="0,200 180,200 150,300 0,300" fill="url(#woodTableGrad)" />
            <polygon points="220,200 400,200 400,300 250,300" fill="url(#woodTableGrad)" />
            <polygon points="180,200 220,200 250,300 150,300" fill={isDark ? '#1C0E0A' : '#D1C2A5'} opacity="0.5" />
          </g>

          {/* SEATED STUDENTS DINING AND TALKING */}
          <g transform="translate(45, 170)">
            <circle cx="12" cy="10" r="8.5" fill="#FFA726" />
            <path d="M 2 20 L 22 20 L 25 45 L -1 45 Z" fill="#1E88E5" />
          </g>
          <g transform="translate(105, 170)">
            <circle cx="12" cy="10" r="8.5" fill="#4E342E" />
            <path d="M 2 20 L 22 20 L 25 45 L -1 45 Z" fill="#880E4F" />
          </g>
          <g transform="translate(280, 170)">
            <circle cx="12" cy="10" r="8.5" fill="#FFCC80" />
            <path d="M 2 20 L 22 20 L 25 45 L -1 45 Z" fill="#2E7D32" />
          </g>

          {/* Plates & Food on Tables */}
          <circle cx="60" cy="220" r="8" fill="#FFF" />
          <circle cx="120" cy="220" r="8" fill="#FFF" />
          <circle cx="280" cy="220" r="8" fill="#FFF" />
        </svg>
      );

    case 'writing_center':
      return (
        <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" className={className}>
          <defs>
            <filter id={filterId} x="0%" y="0%" width="100%" height="100%">
              <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="3" result="noise" />
              <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.04 0" in="noise" result="softNoise" />
              <feComposite operator="in" in2="SourceGraphic" />
              <feBlend mode="multiply" in="SourceGraphic" result="blend" />
            </filter>

            <linearGradient id="wcBg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={isDark ? '#1C0E0A' : '#FDF6EE'} />
              <stop offset="50%" stopColor={isDark ? '#2D160C' : '#F7E7D7'} />
              <stop offset="100%" stopColor={isDark ? '#170A06' : '#E8CEB8'} />
            </linearGradient>

            <linearGradient id="wcSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={isDark ? '#050B14' : '#FFE082'} />
              <stop offset="100%" stopColor={isDark ? '#1E1B4B' : '#F8BBD0'} />
            </linearGradient>

            <radialGradient id="bankerLampGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFF59D" stopOpacity="0.95" />
              <stop offset="50%" stopColor="#FFB300" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#FF8F00" stopOpacity="0" />
            </radialGradient>

            <linearGradient id="wcRugGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#880E4F" />
              <stop offset="50%" stopColor="#4A148C" />
              <stop offset="100%" stopColor="#880E4F" />
            </linearGradient>
          </defs>

          {/* Wall Background */}
          <rect width="400" height="300" fill="url(#wcBg)" filter={`url(#${filterId})`} />

          {/* Wood Paneling Wainscoting (Lower Wall) */}
          <rect y="150" width="400" height="150" fill={isDark ? '#2D160C' : '#8A4222'} />
          <line x1="0" y1="150" x2="400" y2="150" stroke={isDark ? '#170A06' : '#5C2812'} strokeWidth="4" />
          {[10, 80, 150, 220, 290, 360].map((x, idx) => (
            <rect key={idx} x={x} y="168" width="60" height="80" fill="none" stroke={isDark ? '#170A06' : '#5C2812'} strokeWidth="3" rx="3" />
          ))}

          {/* Arched Window with Velvet Drapes */}
          <g id="wc-window">
            <path d="M 25 25 L 115 25 L 115 140 L 25 140 Z" fill="url(#wcSky)" stroke={isDark ? '#170A06' : '#5C2812'} strokeWidth="5" />
            <path d="M 25 25 Q 70 5 115 25" fill="none" stroke={isDark ? '#170A06' : '#5C2812'} strokeWidth="5" />
            <line x1="70" y1="15" x2="70" y2="140" stroke={isDark ? '#170A06' : '#5C2812'} strokeWidth="2.5" />
            <line x1="25" y1="70" x2="115" y2="70" stroke={isDark ? '#170A06' : '#5C2812'} strokeWidth="2.5" />
            {/* Velvet Drapes */}
            <path d="M 12 15 Q 35 70 18 145 L 8 145 L 8 15 Z" fill="#880E4F" />
            <path d="M 128 15 Q 105 70 122 145 L 132 145 L 132 15 Z" fill="#880E4F" />
          </g>

          {/* FLOOR-TO-CEILING BOOKSHELF WITH COLORFUL BOOKS */}
          <g id="wc-bookshelf">
            <rect x="270" y="15" width="120" height="170" fill="#5C2812" stroke="#3D180B" strokeWidth="5" rx="3" />
            <rect x="276" y="58" width="108" height="5" fill="#8A4222" />
            <rect x="276" y="105" width="108" height="5" fill="#8A4222" />
            <rect x="276" y="150" width="108" height="5" fill="#8A4222" />

            {/* Books Top Shelf */}
            <g transform="translate(280, 20)">
              <rect x="0" y="0" width="8" height="35" fill="#880E4F" rx="1" />
              <rect x="9" y="4" width="7" height="31" fill="#0D47A1" rx="1" />
              <rect x="17" y="2" width="10" height="33" fill="#2E7D32" rx="1" />
              <rect x="28" y="8" width="6" height="27" fill="#FFB300" rx="1" />
              <rect x="35" y="0" width="12" height="35" fill="#6A1B9A" rx="1" />
              <rect x="48" y="5" width="8" height="30" fill="#C2185B" rx="1" />
              <rect x="57" y="2" width="11" height="33" fill="#0288D1" rx="1" />
            </g>

            {/* Books Middle Shelf */}
            <g transform="translate(280, 66)">
              <rect x="0" y="2" width="11" height="35" fill="#FF8F00" rx="1" />
              <rect x="12" y="0" width="9" height="37" fill="#1B5E20" rx="1" />
              <rect x="22" y="6" width="7" height="31" fill="#880E4F" rx="1" />
              <rect x="30" y="1" width="13" height="36" fill="#1565C0" rx="1" />
              <rect x="44" y="4" width="8" height="33" fill="#4A148C" rx="1" />
              <rect x="53" y="0" width="10" height="37" fill="#AD1457" rx="1" />
            </g>
          </g>

          {/* FRAMED ARTWORK ON WALL */}
          <g id="wc-artwork">
            <rect x="150" y="25" width="95" height="95" fill="#FFF8E1" stroke="#FFB300" strokeWidth="4" rx="3" />
            <rect x="155" y="30" width="85" height="85" fill="none" stroke="#8A4222" strokeWidth="1.5" />
            <circle cx="197.5" cy="72.5" r="20" fill="none" stroke="#880E4F" strokeWidth="2.5" />
            <path d="M 185 72.5 L 210 72.5 M 197.5 60 L 197.5 85" stroke="#880E4F" strokeWidth="2.5" />
          </g>

          {/* AREA RUG */}
          <g id="wc-rug" transform="translate(60, 235)">
            <ellipse cx="140" cy="22" rx="135" ry="32" fill="url(#wcRugGrad)" />
            <ellipse cx="140" cy="22" rx="120" ry="26" fill="none" stroke="#FFB300" strokeWidth="2" strokeDasharray="6,3" />
          </g>

          {/* EXECUTIVE TUTORING DESK */}
          <g id="wc-desk" transform="translate(110, 175)">
            <polygon points="0,20 230,20 210,65 -20,65" fill={isDark ? '#2D160C' : '#9E4A28'} />
            <polygon points="-20,65 210,65 210,72 -20,72" fill="#5C2812" />

            {/* Green Glass Banker's Lamp */}
            <g transform="translate(170, -12)">
              <ellipse cx="15" cy="42" rx="12" ry="4" fill="#FFB300" />
              <path d="M 15 42 C 24 26 22 10 6 8" stroke="#FFB300" strokeWidth="3.5" fill="none" />
              <rect x="-14" y="-2" width="28" height="14" rx="5" fill="#2E7D32" stroke="#1B5E20" strokeWidth="1.5" />
              <circle cx="0" cy="20" r="50" fill="url(#bankerLampGlow)" />
            </g>

            {/* Essay Manuscript on Desk */}
            <g transform="translate(45, 28)">
              <rect x="0" y="0" width="65" height="40" fill="#FFF8E1" rx="2" transform="rotate(-5)" stroke="#BCAAA4" strokeWidth="1" />
              <line x1="8" y1="10" x2="56" y2="10" stroke="#8A4222" strokeWidth="1.5" />
              <line x1="8" y1="18" x2="50" y2="18" stroke="#8A4222" strokeWidth="1.5" />
              <line x1="8" y1="26" x2="52" y2="26" stroke="#8A4222" strokeWidth="1.5" />
            </g>
          </g>

          {/* TUTOR & STUDENT SEATED AT DESK */}
          <g transform="translate(120, 132)">
            <circle cx="14" cy="11" r="9" fill="#4E342E" />
            <path d="M 3 22 L 25 22 L 28 55 L -1 55 Z" fill="#880E4F" />
          </g>

          <g transform="translate(235, 132)">
            <circle cx="14" cy="11" r="9" fill="#FFCC80" />
            <path d="M 3 22 L 25 22 L 28 55 L -1 55 Z" fill="#1565C0" />
          </g>
        </svg>
      );

    case 'student_union':
      return (
        <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" className={className}>
          <defs>
            <filter id={filterId} x="0%" y="0%" width="100%" height="100%">
              <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="3" result="noise" />
              <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.04 0" in="noise" result="softNoise" />
              <feComposite operator="in" in2="SourceGraphic" />
              <feBlend mode="multiply" in="SourceGraphic" result="blend" />
            </filter>

            <linearGradient id="suBg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={isDark ? '#1C0E0A' : '#FDF6EE'} />
              <stop offset="50%" stopColor={isDark ? '#2D160C' : '#F7E7D7'} />
              <stop offset="100%" stopColor={isDark ? '#170A06' : '#E8CEB8'} />
            </linearGradient>

            <linearGradient id="fireGlow" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#D32F2F" />
              <stop offset="50%" stopColor="#FF9800" />
              <stop offset="100%" stopColor="#FFF59D" stopOpacity="0" />
            </linearGradient>

            <pattern id="brickPattern" width="18" height="12" patternUnits="userSpaceOnUse">
              <rect width="17" height="5" fill={isDark ? '#4A2218' : '#C26349'} rx="1" opacity="0.85" />
              <rect x="9" y="6" width="17" height="5" fill={isDark ? '#2D120B' : '#A04B32'} rx="1" opacity="0.85" />
            </pattern>
          </defs>

          {/* Wall Background */}
          <rect width="400" height="300" fill="url(#suBg)" filter={`url(#${filterId})`} />
          <rect x="0" y="0" width="220" height="175" fill="url(#brickPattern)" />

          {/* STRING LIGHTS */}
          <g id="su-string-lights">
            <path d="M 0 18 Q 100 42 200 18 Q 300 42 400 18" stroke="#5C2812" strokeWidth="2.5" fill="none" />
            {[25, 65, 105, 145, 185, 225, 265, 305, 345, 385].map((x, idx) => (
              <g key={idx} transform={`translate(${x}, ${26 + (idx % 2 === 0 ? 5 : 2)})`}>
                <line x1="0" y1="-5" x2="0" y2="0" stroke="#000" strokeWidth="1" />
                <circle cx="0" cy="5" r="5" fill="#FFF59D" opacity={isDark ? 0.95 : 0.85} />
                <circle cx="0" cy="5" r="10" fill="#FFB300" opacity="0.35" />
              </g>
            ))}
          </g>

          {/* STONE FIREPLACE */}
          <g id="su-fireplace" transform="translate(20, 30)">
            <rect x="0" y="0" width="115" height="145" fill={isDark ? '#2D160C' : '#8A4222'} rx="4" stroke="#5C2812" strokeWidth="3.5" />
            <rect x="-8" y="-6" width="131" height="12" fill="#5C2812" rx="2" />
            <path d="M 22 145 L 22 65 Q 57 42 93 65 L 93 145 Z" fill="#170A06" />

            {/* Fire */}
            <g transform="translate(32, 95)">
              <rect x="5" y="32" width="42" height="8" fill="#5C2812" rx="2" transform="rotate(-8)" />
              <rect x="10" y="30" width="42" height="8" fill="#3D180B" rx="2" transform="rotate(12)" />
              <path d="M 10 35 Q 26 -12 42 35 Z" fill="url(#fireGlow)" />
              <path d="M 18 35 Q 26 5 34 35 Z" fill="#FFF59D" />
            </g>
          </g>

          {/* BULLETIN BOARD WITH COLORFUL POSTERS */}
          <g id="su-bulletin-board" transform="translate(155, 35)">
            <rect x="0" y="0" width="225" height="115" fill="#FF8F00" stroke="#8A4222" strokeWidth="5" rx="3" />
            <rect x="15" y="15" width="48" height="58" fill="#FFF8E1" rx="2" transform="rotate(-3 15 15)" />
            <rect x="15" y="15" width="48" height="16" fill="#880E4F" transform="rotate(-3 15 15)" />
            <rect x="75" y="10" width="52" height="62" fill="#0D47A1" rx="2" transform="rotate(4 75 10)" />
            <circle cx="101" cy="41" r="14" fill="#FFB300" opacity="0.6" />
            <rect x="138" y="18" width="45" height="54" fill="#2E7D32" rx="2" transform="rotate(-2 138 18)" />
            <rect x="30" y="62" width="58" height="42" fill="#4A148C" rx="2" transform="rotate(2 30 62)" />
            <rect x="105" y="65" width="68" height="40" fill="#FF6F00" rx="2" transform="rotate(-4 105 65)" />
          </g>

          {/* PLUSH COZY SOFA */}
          <g id="su-sofa" transform="translate(15, 180)">
            <rect x="10" y="0" width="180" height="58" rx="14" fill="#D32F2F" />
            <rect x="5" y="34" width="90" height="40" rx="8" fill="#B71C1C" />
            <rect x="95" y="34" width="90" height="40" rx="8" fill="#B71C1C" />
            <rect x="-2" y="20" width="24" height="54" rx="10" fill="#880E4F" />
            <rect x="178" y="20" width="24" height="54" rx="10" fill="#880E4F" />
          </g>

          {/* STUDENTS SOCIALIZING */}
          <g transform="translate(50, 155)">
            <circle cx="13" cy="11" r="8.5" fill="#FFCC80" />
            <path d="M 2 21 L 24 21 L 27 48 L -1 48 Z" fill="#1565C0" />
          </g>
          <g transform="translate(125, 155)">
            <circle cx="13" cy="11" r="8.5" fill="#4E342E" />
            <path d="M 2 21 L 24 21 L 27 48 L -1 48 Z" fill="#2E7D32" />
          </g>

          {/* Coffee Table */}
          <g id="su-coffee-table" transform="translate(225, 220)">
            <ellipse cx="60" cy="16" rx="58" ry="18" fill="#8A4222" />
            <ellipse cx="60" cy="12" rx="54" ry="15" fill="#A0522D" />
            <rect x="35" y="4" width="9" height="11" rx="2" fill="#FFF8E1" />
            <rect x="75" y="6" width="9" height="11" rx="2" fill="#880E4F" />
          </g>
        </svg>
      );

    case 'career_center':
      return (
        <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" className={className}>
          <defs>
            <filter id={filterId} x="0%" y="0%" width="100%" height="100%">
              <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="3" result="noise" />
              <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.04 0" in="noise" result="softNoise" />
              <feComposite operator="in" in2="SourceGraphic" />
              <feBlend mode="multiply" in="SourceGraphic" result="blend" />
            </filter>

            <linearGradient id="ccBg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={isDark ? '#1C0E0A' : '#FDF6EE'} />
              <stop offset="50%" stopColor={isDark ? '#2D160C' : '#F7E7D7'} />
              <stop offset="100%" stopColor={isDark ? '#170A06' : '#E8CEB8'} />
            </linearGradient>

            <linearGradient id="ccSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={isDark ? '#050B14' : '#FFE082'} />
              <stop offset="100%" stopColor={isDark ? '#0F172A' : '#F8BBD0'} />
            </linearGradient>

            <linearGradient id="ccDeskWood" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={isDark ? '#4A2213' : '#A0522D'} />
              <stop offset="100%" stopColor={isDark ? '#230E07' : '#5C2812'} />
            </linearGradient>
          </defs>

          {/* Wall Background */}
          <rect width="400" height="300" fill="url(#ccBg)" filter={`url(#${filterId})`} />

          {/* Mahogany Wood Wainscoting */}
          <rect y="160" width="400" height="140" fill={isDark ? '#2D160C' : '#8A4222'} />
          <line x1="0" y1="160" x2="400" y2="160" stroke={isDark ? '#170A06' : '#5C2812'} strokeWidth="4" />

          {/* Office Window */}
          <g id="cc-window">
            <rect x="25" y="25" width="125" height="120" rx="4" fill="url(#ccSky)" stroke={isDark ? '#170A06' : '#5C2812'} strokeWidth="4" />
            <line x1="87" y1="25" x2="87" y2="145" stroke={isDark ? '#170A06' : '#5C2812'} strokeWidth="2" />
            {[35, 50, 65, 80, 95, 110, 125, 140].map((y, idx) => (
              <line key={idx} x1="27" y1={y} x2="147" y2={y} stroke="#FFB300" strokeWidth="1.5" opacity="0.65" />
            ))}
          </g>

          {/* FRAMED DIPLOMAS & CERTIFICATES */}
          <g id="cc-diplomas">
            <rect x="175" y="28" width="85" height="62" fill="#FFF8E1" stroke="#FFB300" strokeWidth="3.5" rx="2" />
            <rect x="179" y="32" width="77" height="54" fill="none" stroke="#8A4222" strokeWidth="1" />
            <circle cx="217.5" cy="65" r="8" fill="#FFB300" />

            <rect x="280" y="32" width="95" height="68" fill="#FFF8E1" stroke="#880E4F" strokeWidth="3.5" rx="2" />
            <rect x="284" y="36" width="87" height="60" fill="none" stroke="#4A148C" strokeWidth="1" />
            <circle cx="327.5" cy="72" r="9" fill="#880E4F" />
          </g>

          {/* BOOKSHELF */}
          <g id="cc-bookshelf" transform="translate(270, 110)">
            <rect x="0" y="0" width="120" height="65" fill="#5C2812" rx="2" />
            <rect x="5" y="30" width="110" height="4" fill="#8A4222" />
            <rect x="10" y="5" width="11" height="25" fill="#0D47A1" rx="1" />
            <rect x="23" y="8" width="9" height="22" fill="#880E4F" rx="1" />
            <rect x="34" y="4" width="13" height="26" fill="#1B5E20" rx="1" />
            <rect x="49" y="6" width="10" height="24" fill="#FF8F00" rx="1" />
            <rect x="61" y="5" width="12" height="25" fill="#4A148C" rx="1" />
          </g>

          {/* EXECUTIVE DESK */}
          <g id="cc-desk" transform="translate(90, 165)">
            <polygon points="0,20 240,20 220,68 -20,68" fill="url(#ccDeskWood)" />
            <polygon points="-20,68 220,68 220,75 -20,75" fill="#3D180B" />

            {/* Laptop */}
            <g transform="translate(85, 10)">
              <rect x="0" y="0" width="38" height="24" rx="2" fill="#5C2812" transform="skewX(-10)" />
              <rect x="2" y="2" width="34" height="20" rx="1" fill="#FFF59D" opacity="0.85" transform="skewX(-10)" />
              <polygon points="-5,24 43,24 48,28 -10,28" fill="#A0522D" />
            </g>

            {/* Resume Folder */}
            <g transform="translate(25, 28)">
              <rect x="0" y="0" width="42" height="30" fill="#FFB300" rx="2" transform="rotate(-6)" />
              <rect x="4" y="4" width="34" height="22" fill="#FFF8E1" transform="rotate(-6)" />
            </g>
          </g>

          {/* COUNSELOR AND STUDENT SEATED */}
          <g id="cc-advisor" transform="translate(110, 120)">
            <circle cx="15" cy="12" r="9" fill="#4E342E" />
            <path d="M 4 22 L 26 22 L 28 58 L 2 58 Z" fill="#880E4F" />
          </g>

          <g id="cc-student" transform="translate(235, 125)">
            <circle cx="15" cy="12" r="9" fill="#FFCC80" />
            <path d="M 4 22 L 26 22 L 28 58 L 2 58 Z" fill="#1565C0" />
          </g>
        </svg>
      );

    case 'quad':
      return (
        <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" className={className}>
          <defs>
            <filter id={filterId} x="0%" y="0%" width="100%" height="100%">
              <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="3" result="noise" />
              <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.04 0" in="noise" result="softNoise" />
              <feComposite operator="in" in2="SourceGraphic" />
              <feBlend mode="multiply" in="SourceGraphic" result="blend" />
            </filter>

            <linearGradient id="quadSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={isDark ? '#050B14' : '#FFE082'} />
              <stop offset="60%" stopColor={isDark ? '#0F172A' : '#F8BBD0'} />
              <stop offset="100%" stopColor={isDark ? '#1E1B4B' : '#B3E5FC'} />
            </linearGradient>

            <linearGradient id="grassGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={isDark ? '#1B5E20' : '#4CAF50'} />
              <stop offset="100%" stopColor={isDark ? '#0D3B11' : '#2E7D32'} />
            </linearGradient>

            <linearGradient id="pathGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={isDark ? '#2D160C' : '#E0CCA9'} />
              <stop offset="100%" stopColor={isDark ? '#170A06' : '#CBB89A'} />
            </linearGradient>

            <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFF59D" stopOpacity="0.95" />
              <stop offset="50%" stopColor="#FFB300" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#FF8F00" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Sky Background */}
          <rect width="400" height="300" fill="url(#quadSky)" filter={`url(#${filterId})`} />

          {/* Sun or Moon */}
          {!isDark ? (
            <g>
              <circle cx="85" cy="48" r="30" fill="#FFB300" opacity="0.9" />
              <circle cx="85" cy="48" r="55" fill="url(#sunGlow)" />
            </g>
          ) : (
            <g>
              <circle cx="320" cy="45" r="16" fill="#FFF59D" opacity="0.9" />
              <circle cx="326" cy="41" r="14" fill="#050B14" />
            </g>
          )}

          {/* DISTANT BRICK CLOCK TOWER */}
          <g id="quad-clock-tower" transform="translate(145, 55)">
            <rect x="0" y="55" width="110" height="65" fill={isDark ? '#2D120B' : '#A04B32'} />
            <polygon points="0,55 55,25 110,55" fill={isDark ? '#170A06' : '#5C2812'} />
            <rect x="38" y="-12" width="34" height="67" fill={isDark ? '#4A2218' : '#C26349'} />
            <polygon points="38,-12 55,-40 72,-12" fill={isDark ? '#170A06' : '#5C2812'} />
            <circle cx="55" cy="5" r="9" fill="#FFF8E1" stroke={isDark ? '#170A06' : '#5C2812'} strokeWidth="1.5" />
            <line x1="55" y1="5" x2="55" y2="0" stroke="#000" strokeWidth="1" />
            <line x1="55" y1="5" x2="59" y2="5" stroke="#000" strokeWidth="1" />
            <path d="M 44 120 L 44 92 Q 55 80 66 92 L 66 120 Z" fill="#170A06" />
          </g>

          {/* LUSH GREEN LAWN */}
          <polygon points="0,115 400,115 400,300 0,300" fill="url(#grassGrad)" />

          {/* Walkways */}
          <path d="M 200 115 Q 180 185 50 300 L 0 300 L 0 280 L 160 115 Z" fill="url(#pathGrad)" />
          <path d="M 200 115 Q 220 185 350 300 L 400 300 L 400 280 L 240 115 Z" fill="url(#pathGrad)" />

          {/* SHADE TREES WITH GOLDEN LEAVES */}
          <g transform="translate(25, 85)">
            <path d="M 25 75 L 35 75 L 32 30 L 28 30 Z" fill="#5C2812" />
            <circle cx="30" cy="25" r="32" fill={isDark ? '#1B5E20' : '#2E7D32'} />
            <circle cx="12" cy="35" r="24" fill={isDark ? '#0D3B11' : '#1B5E20'} />
            <circle cx="48" cy="35" r="24" fill={isDark ? '#2E7D32' : '#4CAF50'} opacity="0.85" />
          </g>

          <g transform="translate(305, 75)">
            <path d="M 30 85 L 40 85 L 37 35 L 33 35 Z" fill="#5C2812" />
            <circle cx="35" cy="25" r="38" fill={isDark ? '#1B5E20' : '#FB8C00'} />
            <circle cx="16" cy="38" r="28" fill={isDark ? '#0D3B11' : '#F57C00'} />
            <circle cx="54" cy="38" r="28" fill={isDark ? '#2E7D32' : '#FFB300'} opacity="0.85" />
          </g>

          {/* LAMPPOSTS */}
          <g id="quad-lamppost" transform="translate(135, 160)">
            <line x1="0" y1="45" x2="0" y2="0" stroke="#3D180B" strokeWidth="3" />
            <circle cx="0" cy="0" r="5" fill={isDark ? '#FFF59D' : '#FFF8E1'} />
            {isDark && <circle cx="0" cy="0" r="16" fill="#FFB300" opacity="0.4" />}
          </g>

          <g id="quad-lamppost-2" transform="translate(265, 160)">
            <line x1="0" y1="45" x2="0" y2="0" stroke="#3D180B" strokeWidth="3" />
            <circle cx="0" cy="0" r="5" fill={isDark ? '#FFF59D' : '#FFF8E1'} />
            {isDark && <circle cx="0" cy="0" r="16" fill="#FFB300" opacity="0.4" />}
          </g>

          {/* PARK BENCH WITH STUDENT */}
          <g transform="translate(75, 195)">
            <rect x="0" y="20" width="55" height="7" fill="#A0522D" rx="2" />
            <rect x="5" y="27" width="7" height="14" fill="#5C2812" />
            <rect x="43" y="27" width="7" height="14" fill="#5C2812" />
            <circle cx="22" cy="7" r="7" fill="#FFCC80" />
            <path d="M 13 15 L 31 15 L 33 28 L 11 28 Z" fill="#1565C0" />
          </g>

          {/* STUDENT WALKING ON PATHWAY */}
          <g transform="translate(225, 205)">
            <circle cx="11" cy="8" r="7" fill="#4E342E" />
            <path d="M 3 16 L 19 16 L 20 40 L 2 40 Z" fill="#880E4F" />
            <rect x="-3" y="18" width="7" height="16" rx="2" fill="#A0522D" />
          </g>
        </svg>
      );

    case 'seminar_room':
      return (
        <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" className={className}>
          <defs>
            <filter id={filterId} x="0%" y="0%" width="100%" height="100%">
              <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="3" result="noise" />
              <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.04 0" in="noise" result="softNoise" />
              <feComposite operator="in" in2="SourceGraphic" />
              <feBlend mode="multiply" in="SourceGraphic" result="blend" />
            </filter>

            <linearGradient id="semBg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={isDark ? '#1C0E0A' : '#FDF6EE'} />
              <stop offset="50%" stopColor={isDark ? '#2D160C' : '#F7E7D7'} />
              <stop offset="100%" stopColor={isDark ? '#170A06' : '#E8CEB8'} />
            </linearGradient>

            <linearGradient id="semSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={isDark ? '#050B14' : '#FFE082'} />
              <stop offset="100%" stopColor={isDark ? '#0F172A' : '#F8BBD0'} />
            </linearGradient>

            <linearGradient id="semTableWood" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={isDark ? '#4A2213' : '#A0522D'} />
              <stop offset="100%" stopColor={isDark ? '#230E07' : '#5C2812'} />
            </linearGradient>
          </defs>

          {/* Wall Background */}
          <rect width="400" height="300" fill="url(#semBg)" filter={`url(#${filterId})`} />

          {/* Baseboard */}
          <rect y="155" width="400" height="145" fill={isDark ? '#2D160C' : '#E0CCA9'} />
          <line x1="0" y1="155" x2="400" y2="155" stroke={isDark ? '#170A06' : '#8A4222'} strokeWidth="3.5" />

          {/* Side Window */}
          <g id="sem-window">
            <rect x="20" y="25" width="100" height="120" rx="3" fill="url(#semSky)" stroke={isDark ? '#170A06' : '#5C2812'} strokeWidth="4" />
            <line x1="70" y1="25" x2="70" y2="145" stroke={isDark ? '#170A06' : '#5C2812'} strokeWidth="2" />
            <line x1="20" y1="85" x2="120" y2="85" stroke={isDark ? '#170A06' : '#5C2812'} strokeWidth="2" />
          </g>

          {/* WHITEBOARD WITH ACADEMIC DIAGRAMS */}
          <g id="sem-whiteboard" transform="translate(140, 22)">
            <rect x="0" y="0" width="240" height="125" fill="#FFF8E1" stroke="#8A4222" strokeWidth="5" rx="3" />
            <rect x="0" y="121" width="240" height="5" fill="#5C2812" />

            <circle cx="50" cy="42" r="16" fill="none" stroke="#1565C0" strokeWidth="2" />
            <circle cx="115" cy="32" r="13" fill="none" stroke="#2E7D32" strokeWidth="2" />
            <circle cx="115" cy="78" r="15" fill="none" stroke="#880E4F" strokeWidth="2" />
            <circle cx="185" cy="52" r="17" fill="none" stroke="#FF8F00" strokeWidth="2" />

            <line x1="66" y1="39" x2="102" y2="34" stroke="#1565C0" strokeWidth="1.5" />
            <line x1="63" y1="50" x2="102" y2="71" stroke="#1565C0" strokeWidth="1.5" />
            <line x1="128" y1="37" x2="168" y2="47" stroke="#2E7D32" strokeWidth="1.5" />
            <line x1="130" y1="73" x2="168" y2="57" stroke="#880E4F" strokeWidth="1.5" />

            <circle cx="200" cy="90" r="16" fill="none" stroke="#6A1B9A" strokeWidth="1.5" />
            <circle cx="216" cy="90" r="16" fill="none" stroke="#1565C0" strokeWidth="1.5" />
          </g>

          {/* LARGE OVAL CONFERENCE TABLE */}
          <g id="sem-table" transform="translate(35, 175)">
            <ellipse cx="165" cy="32" rx="155" ry="38" fill="url(#semTableWood)" />
            <ellipse cx="165" cy="28" rx="150" ry="34" fill="none" stroke="#FFB300" strokeWidth="2" />

            <rect x="70" y="12" width="26" height="16" rx="2" fill="#5C2812" />
            <rect x="145" y="22" width="30" height="18" rx="2" fill="#FFF8E1" />
            <rect x="230" y="14" width="26" height="15" rx="2" fill="#5C2812" />
          </g>

          {/* PROFESSOR & STUDENTS SEATED */}
          <g transform="translate(185, 118)">
            <circle cx="15" cy="12" r="9" fill="#4E342E" />
            <path d="M 4 22 L 26 22 L 28 62 L 2 62 Z" fill="#880E4F" />
          </g>

          <g transform="translate(90, 128)">
            <circle cx="15" cy="12" r="9" fill="#FFCC80" />
            <path d="M 4 22 L 26 22 L 28 58 L 2 58 Z" fill="#1565C0" />
          </g>

          <g transform="translate(285, 128)">
            <circle cx="15" cy="12" r="9" fill="#8A4222" />
            <path d="M 4 22 L 26 22 L 28 58 L 2 58 Z" fill="#2E7D32" />
          </g>
        </svg>
      );

    default:
      return null;
  }
};
