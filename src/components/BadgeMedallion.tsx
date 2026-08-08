import React from 'react';

interface BadgeMedallionProps {
  badgeId: string;
  isEarned?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const BadgeMedallion: React.FC<BadgeMedallionProps> = ({
  badgeId,
  isEarned = true,
  size = 'md',
  className = '',
}) => {
  const dimensions = {
    xs: 'w-6 h-6',
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-20 h-20',
    xl: 'w-28 h-28',
  }[size];

  // Colors & Styles
  const primaryTerracotta = '#C25941';
  const accentGold = '#F59E0B';
  const darkNavy = '#1E293B';
  const warmCream = '#FFFDF8';
  const deepBurgundy = '#6B2D39';
  const emeraldGreen = '#10B981';

  // SVG Artwork per badge
  const renderGraphic = () => {
    switch (badgeId) {
      case 'rug_investigator':
        return (
          <g>
            {/* Outer Warm Medallion Background */}
            <circle cx="32" cy="32" r="22" fill="#FDF6E3" stroke="#F59E0B" strokeWidth="2" />
            <circle cx="32" cy="32" r="19" fill={deepBurgundy} />

            {/* Playful Rounded Seat/Peach Shape */}
            <path
              d="M22 32 C21 24, 30 24, 32 29 C34 24, 43 24, 42 32 C41 40, 32 43, 32 43 C32 43, 23 40, 22 32 Z"
              fill="#FFEDD5"
              stroke="#F59E0B"
              strokeWidth="1.5"
            />

            {/* Two Funny Cartoon Waving Hands Sticking Out */}
            {/* Left Waving Hand */}
            <g fill="#FED7AA" stroke="#78350F" strokeWidth="1.2" strokeLinejoin="round" strokeLinecap="round">
              <path d="M 23 36 L 16 33 C 14 32, 12 29, 13 27 C 14 25, 16 26, 17 28 C 15 24, 18 23, 19 25 C 18 21, 21 20, 22 23 C 21 18, 24 18, 25 21 C 26 24, 25 30, 25 35 Z" />
            </g>
            {/* Right Waving Hand */}
            <g fill="#FED7AA" stroke="#78350F" strokeWidth="1.2" strokeLinejoin="round" strokeLinecap="round">
              <path d="M 41 36 L 48 33 C 50 32, 52 29, 51 27 C 50 25, 48 26, 47 28 C 49 24, 46 23, 45 25 C 46 21, 43 20, 42 23 C 43 18, 40 18, 39 21 C 38 24, 39 30, 39 35 Z" />
            </g>

            {/* Sparkles / Crown Gold Star */}
            <polygon points="32,9 34,14 39,14 35,17 37,22 32,19 27,22 29,17 25,14 30,14" fill="#F59E0B" stroke="#78350F" strokeWidth="0.8" />
            <circle cx="15" cy="18" r="1.5" fill="#F59E0B" />
            <circle cx="49" cy="18" r="1.5" fill="#F59E0B" />

            {/* Waving motion accents */}
            <path d="M 10 22 C 8 20, 8 24, 6 22" stroke="#F59E0B" strokeWidth="1.2" strokeLinecap="round" fill="none" />
            <path d="M 54 22 C 56 20, 56 24, 58 22" stroke="#F59E0B" strokeWidth="1.2" strokeLinecap="round" fill="none" />
          </g>
        );

      case 'first_steps':
        return (
          <g>
            {/* Background sunburst path */}
            <circle cx="32" cy="32" r="22" fill="#FDE68A" opacity="0.4" />
            <path d="M32 10 L32 54 M10 32 L54 32" stroke="#F59E0B" strokeWidth="1" strokeDasharray="2 2" opacity="0.6" />
            {/* Winding Golden Pathway */}
            <path d="M18 48 C 22 42, 26 44, 30 36 C 34 28, 38 26, 44 18" stroke="#D97706" strokeWidth="6" strokeLinecap="round" fill="none" />
            <path d="M18 48 C 22 42, 26 44, 30 36 C 34 28, 38 26, 44 18" stroke="#FDE68A" strokeWidth="3" strokeLinecap="round" fill="none" />
            {/* Footprints / Boots */}
            <g fill={primaryTerracotta}>
              <ellipse cx="26" cy="39" rx="3" ry="5" transform="rotate(-15 26 39)" />
              <ellipse cx="36" cy="27" rx="3" ry="5" transform="rotate(15 36 27)" />
              <circle cx="27" cy="45" r="1.5" />
              <circle cx="37" cy="33" r="1.5" />
            </g>
            {/* Oak leaf sparkles */}
            <path d="M16 22 Q19 20 20 23 Q18 25 16 22 Z" fill="#F59E0B" />
            <path d="M46 38 Q48 35 50 37 Q49 40 46 38 Z" fill="#F59E0B" />
          </g>
        );

      case 'bookworm':
        return (
          <g>
            {/* Stack of vintage leatherbound books */}
            {/* Bottom Book */}
            <rect x="14" y="40" width="36" height="8" rx="2" fill={deepBurgundy} stroke="#4A1D24" strokeWidth="1" />
            <rect x="18" y="42" width="30" height="4" fill="#FDF6E3" />
            {/* Middle Book */}
            <rect x="17" y="31" width="32" height="8" rx="2" fill={primaryTerracotta} stroke="#8C3A27" strokeWidth="1" />
            <rect x="20" y="33" width="27" height="4" fill="#FDF6E3" />
            {/* Top Book */}
            <rect x="19" y="22" width="28" height="8" rx="2" fill={darkNavy} stroke="#0F172A" strokeWidth="1" />
            <rect x="22" y="24" width="23" height="4" fill="#FDF6E3" />
            {/* Ribbon bookmark */}
            <path d="M41 22 L41 38 L38 35 L35 38 L35 22" fill="#E11D48" />
            {/* Gold Wire-rim Spectacles */}
            <g stroke="#F59E0B" strokeWidth="1.5" fill="none">
              <circle cx="28" cy="18" r="4.5" fill="rgba(255,255,255,0.7)" />
              <circle cx="38" cy="18" r="4.5" fill="rgba(255,255,255,0.7)" />
              <path d="M32.5 18 L33.5 18" strokeWidth="2" />
              <path d="M23.5 18 Q20 16 19 19" />
              <path d="M42.5 18 Q46 16 47 19" />
            </g>
          </g>
        );

      case 'night_owl':
        return (
          <g>
            {/* Midnight Sky Background */}
            <circle cx="32" cy="32" r="21" fill="#0F172A" />
            {/* Crescent Moon */}
            <path d="M42 16 C36 16 31 21 31 27 C31 33 36 38 42 38 C39 38 35 36 34 32 C33 27 36 21 42 16 Z" fill="#FDE047" />
            {/* Twinkling Stars */}
            <circle cx="18" cy="18" r="1" fill="#FFF" />
            <circle cx="24" cy="14" r="1.5" fill="#FDE047" />
            <circle cx="16" cy="28" r="1" fill="#FFF" />
            <circle cx="22" cy="40" r="1.2" fill="#FDE047" />
            {/* Illustrated Storybook Owl */}
            {/* Owl Body */}
            <ellipse cx="32" cy="38" rx="9" ry="11" fill={primaryTerracotta} />
            <ellipse cx="32" cy="40" rx="6" ry="8" fill="#FDF6E3" />
            {/* Eyes */}
            <circle cx="28" cy="33" r="4" fill="#FFF" stroke="#78350F" strokeWidth="1" />
            <circle cx="36" cy="33" r="4" fill="#FFF" stroke="#78350F" strokeWidth="1" />
            <circle cx="28" cy="33" r="2" fill="#0F172A" />
            <circle cx="36" cy="33" r="2" fill="#0F172A" />
            <circle cx="29" cy="32" r="0.7" fill="#FFF" />
            <circle cx="37" cy="32" r="0.7" fill="#FFF" />
            {/* Beak */}
            <polygon points="32,35 30,38 34,38" fill="#F59E0B" />
            {/* Mini Mortarboard Cap */}
            <polygon points="32,23 21,27 32,31 43,27" fill="#1E293B" stroke="#F59E0B" strokeWidth="0.8" />
            <rect x="29" y="28" width="6" height="3" fill="#1E293B" />
            <path d="M40 28 L42 33" stroke="#F59E0B" strokeWidth="1" />
            <circle cx="42" cy="33" r="1" fill="#F59E0B" />
          </g>
        );

      case 'full_house':
        return (
          <g>
            {/* Compass Rose & Campus Clocktower Silhouette */}
            <circle cx="32" cy="32" r="22" fill="#FFFDF8" opacity="0.2" />
            {/* Compass Points */}
            <path d="M32 10 L35 28 L32 25 L29 28 Z" fill="#D97706" />
            <path d="M32 54 L35 36 L32 39 L29 36 Z" fill="#D97706" />
            <path d="M10 32 L28 29 L25 32 L28 35 Z" fill="#D97706" />
            <path d="M54 32 L36 29 L39 32 L36 35 Z" fill="#D97706" />
            {/* Central Clocktower Emblem */}
            <rect x="25" y="22" width="14" height="24" rx="1" fill={primaryTerracotta} />
            <polygon points="32,13 23,22 41,22" fill={deepBurgundy} />
            <circle cx="32" cy="28" r="3.5" fill="#FFFDF8" stroke="#78350F" strokeWidth="1" />
            <path d="M32 28 L32 26 M32 28 L34 28" stroke="#78350F" strokeWidth="1" strokeLinecap="round" />
            <rect x="28" y="35" width="8" height="11" rx="1" fill={darkNavy} />
            {/* Ring of 10 golden stars along rim */}
            {[...Array(10)].map((_, i) => {
              const angle = (i * 36 * Math.PI) / 180;
              const x = 32 + 20 * Math.cos(angle);
              const y = 32 + 20 * Math.sin(angle);
              return <circle key={i} cx={x} cy={y} r="1.2" fill="#F59E0B" />;
            })}
          </g>
        );

      case 'perfect_attendance':
        return (
          <g>
            {/* Calendar parchment sheet */}
            <rect x="16" y="16" width="32" height="34" rx="4" fill="#FFFDF8" stroke="#D97706" strokeWidth="1.5" />
            {/* Calendar Header Bar */}
            <path d="M16 20 C16 17.8 17.8 16 20 16 L44 16 C46.2 16 48 17.8 48 20 L48 25 L16 25 Z" fill={primaryTerracotta} />
            {/* Rings */}
            <rect x="22" y="13" width="3" height="6" rx="1" fill="#78350F" />
            <rect x="30" y="13" width="3" height="6" rx="1" fill="#78350F" />
            <rect x="38" y="13" width="3" height="6" rx="1" fill="#78350F" />
            {/* Calendar Grid Dots */}
            <circle cx="22" cy="30" r="1.5" fill="#CBD5E1" />
            <circle cx="28" cy="30" r="1.5" fill="#CBD5E1" />
            <circle cx="34" cy="30" r="1.5" fill="#CBD5E1" />
            <circle cx="40" cy="30" r="1.5" fill="#CBD5E1" />
            <circle cx="22" cy="36" r="1.5" fill="#CBD5E1" />
            <circle cx="28" cy="36" r="1.5" fill="#CBD5E1" />
            <circle cx="34" cy="36" r="1.5" fill="#CBD5E1" />
            <circle cx="40" cy="36" r="1.5" fill="#CBD5E1" />
            {/* Prominent Emerald Seal with Checkmark */}
            <circle cx="34" cy="37" r="10" fill={emeraldGreen} stroke="#065F46" strokeWidth="1" />
            <path d="M29 37 L32 40 L39 33" stroke="#FFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            {/* Ribbon Tails */}
            <path d="M28 45 L25 53 L29 51 L33 53 L31 46" fill="#E11D48" />
            <path d="M35 46 L37 53 L41 51 L45 53 L42 45" fill="#BE123C" />
          </g>
        );

      case 'wordsmith':
        return (
          <g>
            {/* Parchment Scroll behind */}
            <path d="M14 18 C 14 14, 22 14, 22 18 L 22 46 C 22 50, 14 50, 14 46 Z" fill="#FDE68A" stroke="#B45309" strokeWidth="1" />
            <rect x="20" y="16" width="28" height="32" rx="2" fill="#FFFDF8" stroke="#D97706" strokeWidth="1" />
            {/* Text lines */}
            <line x1="25" y1="22" x2="43" y2="22" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="25" y1="27" x2="40" y2="27" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="25" y1="32" x2="43" y2="32" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
            {/* Ink Pot */}
            <rect x="15" y="38" width="10" height="10" rx="2" fill={darkNavy} stroke="#0F172A" strokeWidth="1" />
            <rect x="17" y="36" width="6" height="3" fill="#D97706" />
            {/* Fountain Pen / Quill */}
            <path d="M48 12 L28 36 L24 42 L30 38 L52 16 Z" fill={primaryTerracotta} />
            <polygon points="24,42 22,46 26,44" fill="#F59E0B" />
            <path d="M48 12 L52 16 L44 24 L40 20 Z" fill="#F59E0B" />
            <circle cx="25" cy="43" r="0.8" fill="#1E293B" />
          </g>
        );

      case 'conversationalist':
        return (
          <g>
            {/* Left Chat Bubble (Terracotta) */}
            <path d="M14 26 C14 20, 22 20, 28 20 C34 20, 40 20, 40 26 C40 32, 34 34, 28 34 C25 34, 21 35, 17 38 C18 35, 18 34, 17 33 C15 31, 14 29, 14 26 Z" fill={primaryTerracotta} stroke="#8C3A27" strokeWidth="1" />
            {/* Right Chat Bubble (Navy) */}
            <path d="M24 36 C24 30, 32 30, 38 30 C44 30, 50 30, 50 36 C50 42, 44 44, 38 44 C35 44, 31 45, 27 48 C28 45, 28 44, 27 43 C25 41, 24 39, 24 36 Z" fill={darkNavy} stroke="#0F172A" strokeWidth="1" />
            {/* Dots inside chat bubble 1 */}
            <circle cx="22" cy="27" r="1.8" fill="#FFFDF8" />
            <circle cx="27" cy="27" r="1.8" fill="#FFFDF8" />
            <circle cx="32" cy="27" r="1.8" fill="#FFFDF8" />
            {/* Heart symbol inside chat bubble 2 */}
            <path d="M37 37 C37 35.5, 35.5 35, 34.5 36 C33.5 35, 32 35.5, 32 37 C32 39, 34.5 41, 34.5 41 C34.5 41, 37 39, 37 37 Z" fill="#F59E0B" />
            {/* Sparkle stars */}
            <path d="M46 16 L47 18 L49 19 L47 20 L46 22 L45 20 L43 19 L45 18 Z" fill="#F59E0B" />
          </g>
        );

      case 'halfway_there':
        return (
          <g>
            {/* Mountain Summit */}
            <polygon points="32,16 10,48 54,48" fill="#94A3B8" />
            <polygon points="32,16 22,31 28,34 32,28 38,35 43,31 54,48 32,48" fill="#64748B" />
            {/* Snowcap */}
            <polygon points="32,16 25,26 29,28 32,24 36,29 40,26" fill="#FFFDF8" />
            {/* Campus Flag Pole */}
            <line x1="32" y1="16" x2="32" y2="8" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />
            {/* Triumphant Flag */}
            <path d="M32 8 L46 12 L32 17 Z" fill={primaryTerracotta} />
            <text x="36" y="14" fontSize="5" fontWeight="bold" fill="#FFFDF8">50%</text>
            {/* Sunburst behind peak */}
            <circle cx="32" cy="16" r="14" fill="#FDE68A" opacity="0.3" />
            {/* Milestone Compass Rose Star at base */}
            <circle cx="32" cy="44" r="5" fill="#F59E0B" />
            <path d="M32 37 L33.5 42.5 L39 44 L33.5 45.5 L32 51 L30.5 45.5 L25 44 L30.5 42.5 Z" fill="#FFFDF8" />
          </g>
        );

      case 'semester_complete':
        return (
          <g>
            {/* Laurel Wreath */}
            <path d="M14 36 C12 26, 20 16, 32 14 C44 16, 52 26, 50 36" fill="none" stroke="#F59E0B" strokeWidth="2" strokeDasharray="3 3" />
            {/* Mortarboard Graduation Cap */}
            {/* Cap Skull Base */}
            <rect x="26" y="27" width="12" height="7" rx="1" fill="#1E293B" stroke="#D97706" strokeWidth="1" />
            {/* Cap Diamond Top */}
            <polygon points="32,16 12,24 32,32 52,24" fill={deepBurgundy} stroke="#F59E0B" strokeWidth="1.2" />
            <polygon points="32,18 16,24 32,30 48,24" fill="#8C3A27" />
            {/* Button */}
            <circle cx="32" cy="24" r="2" fill="#F59E0B" />
            {/* Tassel */}
            <path d="M32 24 L44 28 L43 37" stroke="#F59E0B" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            <circle cx="43" cy="38" r="1.8" fill="#F59E0B" />
            {/* Diploma Scroll Below */}
            <rect x="20" y="40" width="24" height="7" rx="3.5" fill="#FFFDF8" stroke="#B45309" strokeWidth="1" />
            <rect x="30" y="40" width="4" height="7" fill="#E11D48" />
            <circle cx="18" cy="43.5" r="3.5" fill="#FDE68A" stroke="#B45309" strokeWidth="1" />
          </g>
        );

      case 'social_butterfly':
        return (
          <g>
            {/* Butterfly Wings (Heart Patterned) */}
            {/* Top Left Wing */}
            <path d="M32 30 C 26 14, 10 16, 12 28 C 13 36, 26 34, 32 32 Z" fill={primaryTerracotta} stroke="#8C3A27" strokeWidth="1" />
            <circle cx="20" cy="24" r="3" fill="#FDE68A" />
            {/* Top Right Wing */}
            <path d="M32 30 C 38 14, 54 16, 52 28 C 51 36, 38 34, 32 32 Z" fill={primaryTerracotta} stroke="#8C3A27" strokeWidth="1" />
            <circle cx="44" cy="24" r="3" fill="#FDE68A" />
            {/* Bottom Left Wing */}
            <path d="M32 32 C 22 36, 14 44, 20 48 C 26 52, 30 42, 32 36 Z" fill="#E11D48" stroke="#9F1239" strokeWidth="1" />
            {/* Bottom Right Wing */}
            <path d="M32 32 C 42 36, 50 44, 44 48 C 38 52, 34 42, 32 36 Z" fill="#E11D48" stroke="#9F1239" strokeWidth="1" />
            {/* Body */}
            <ellipse cx="32" cy="33" rx="2.5" ry="10" fill={darkNavy} />
            <circle cx="32" cy="21" r="3" fill={darkNavy} />
            {/* Antennae */}
            <path d="M31 19 C28 14, 24 13, 23 15" stroke={darkNavy} strokeWidth="1.2" fill="none" strokeLinecap="round" />
            <circle cx="23" cy="15" r="1" fill="#F59E0B" />
            <path d="M33 19 C36 14, 40 13, 41 15" stroke={darkNavy} strokeWidth="1.2" fill="none" strokeLinecap="round" />
            <circle cx="41" cy="15" r="1" fill="#F59E0B" />
          </g>
        );

      case 'scholar':
        return (
          <g>
            {/* Double Golden Laurel Branches */}
            <path d="M16 42 C12 30, 18 18, 32 14 C46 18, 52 30, 48 42" fill="none" stroke="#F59E0B" strokeWidth="1.5" />
            {[...Array(6)].map((_, i) => {
              const angleL = (150 + i * 22) * (Math.PI / 180);
              const angleR = (30 - i * 22) * (Math.PI / 180);
              return (
                <React.Fragment key={i}>
                  <circle cx={32 + 18 * Math.cos(angleL)} cy={32 + 18 * Math.sin(angleL)} r="2" fill="#D97706" />
                  <circle cx={32 + 18 * Math.cos(angleR)} cy={32 + 18 * Math.sin(angleR)} r="2" fill="#D97706" />
                </React.Fragment>
              );
            })}
            {/* University Heraldic Shield */}
            <path d="M22 20 L42 20 L42 36 C42 43, 32 48, 32 48 C32 48, 22 43, 22 36 Z" fill={deepBurgundy} stroke="#F59E0B" strokeWidth="1.5" />
            {/* Crossed Quills / Key */}
            <line x1="26" y1="24" x2="38" y2="38" stroke="#FFFDF8" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="38" y1="24" x2="26" y2="38" stroke="#FFFDF8" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="32" cy="31" r="3" fill="#F59E0B" />
          </g>
        );

      case 'master_of_skills':
        return (
          <g>
            {/* Glowing 4-Element Constellation Crest */}
            <circle cx="32" cy="32" r="20" fill="url(#masterGrad)" opacity="0.3" />
            {/* Central 8-pointed golden star */}
            <path d="M32 12 L35 25 L48 22 L38 30 L45 42 L32 35 L19 42 L26 30 L16 22 L29 25 Z" fill="#F59E0B" stroke="#B45309" strokeWidth="1" />
            {/* 4 Skill Gemstones (Reading/Writing/Listening/Speaking) */}
            {/* Top: Reading Gem (Ruby) */}
            <circle cx="32" cy="16" r="3.5" fill="#E11D48" stroke="#FFF" strokeWidth="1" />
            {/* Right: Writing Gem (Sapphire) */}
            <circle cx="48" cy="32" r="3.5" fill="#2563EB" stroke="#FFF" strokeWidth="1" />
            {/* Bottom: Listening Gem (Emerald) */}
            <circle cx="32" cy="48" r="3.5" fill="#10B981" stroke="#FFF" strokeWidth="1" />
            {/* Left: Speaking Gem (Topaz/Amber) */}
            <circle cx="16" cy="32" r="3.5" fill="#D97706" stroke="#FFF" strokeWidth="1" />
            {/* Sparkles */}
            <circle cx="32" cy="32" r="2.5" fill="#FFFDF8" />
          </g>
        );

      default:
        return (
          <g>
            <circle cx="32" cy="32" r="16" fill="#F59E0B" />
            <path d="M32 20 L35 28 L44 28 L37 33 L40 42 L32 37 L24 42 L27 33 L20 28 L29 28 Z" fill="#FFFDF8" />
          </g>
        );
    }
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 ${dimensions} ${className}`}
      title={badgeId}
    >
      <svg
        viewBox="0 0 64 64"
        className={`w-full h-full transition-all duration-300 transform ${
          isEarned
            ? 'filter drop-shadow-md hover:scale-105'
            : 'filter grayscale contrast-75 brightness-90 opacity-60'
        }`}
      >
        <defs>
          {/* Radial Gradient for Master Badge */}
          <radialGradient id="masterGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F59E0B" stopOpacity="1" />
            <stop offset="100%" stopColor="#C25941" stopOpacity="0" />
          </radialGradient>

          {/* Enamel Gloss Overlay */}
          <linearGradient id="glossOverlay" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.4" />
            <stop offset="35%" stopColor="#FFFFFF" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.15" />
          </linearGradient>

          {/* Golden Rim Gradient */}
          <linearGradient id="goldRim" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="50%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#92400E" />
          </linearGradient>

          {/* Pewter Muted Rim Gradient */}
          <linearGradient id="pewterRim" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E2E8F0" />
            <stop offset="50%" stopColor="#94A3B8" />
            <stop offset="100%" stopColor="#475569" />
          </linearGradient>
        </defs>

        {/* 1. Outer Wax-Seal / Scalloped Rim Frame */}
        <path
          d="M32 2 C 36 2, 38 5, 42 4 C 46 3, 49 7, 52 9 C 55 11, 59 12, 60 16 C 61 20, 63 23, 62 27 C 62 31, 62 33, 62 37 C 63 41, 61 44, 60 48 C 59 52, 55 53, 52 55 C 49 57, 46 61, 42 60 C 38 59, 36 62, 32 62 C 28 62, 26 59, 22 60 C 18 61, 15 57, 12 55 C 9 53, 5 52, 4 48 C 3 44, 1 41, 2 37 C 2 33, 2 31, 2 27 C 1 23, 3 20, 4 16 C 5 12, 9 11, 12 9 C 15 7, 18 3, 22 4 C 26 5, 28 2, 32 2 Z"
          fill={isEarned ? 'url(#goldRim)' : 'url(#pewterRim)'}
          stroke={isEarned ? '#78350F' : '#334155'}
          strokeWidth="1"
        />

        {/* 2. Inner Enamel Medallion Circle */}
        <circle
          cx="32"
          cy="32"
          r="26"
          fill={isEarned ? warmCream : '#E2E8F0'}
          stroke={isEarned ? primaryTerracotta : '#64748B'}
          strokeWidth="2"
        />

        {/* 3. Inner Stitching / Bead Detail */}
        <circle
          cx="32"
          cy="32"
          r="24"
          fill="none"
          stroke={isEarned ? '#D97706' : '#94A3B8'}
          strokeWidth="0.8"
          strokeDasharray="2 1.5"
        />

        {/* 4. Central Vector Graphic */}
        {renderGraphic()}

        {/* 5. Glossy Enamel Highlight Overlay */}
        <circle
          cx="32"
          cy="32"
          r="26"
          fill="url(#glossOverlay)"
          pointerEvents="none"
        />
      </svg>
    </div>
  );
};
