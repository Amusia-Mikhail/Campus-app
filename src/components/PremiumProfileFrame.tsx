import React from 'react';
import { motion } from 'motion/react';
import { Crown } from 'lucide-react';

interface PremiumProfileFrameProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const PremiumProfileFrame: React.FC<PremiumProfileFrameProps> = ({
  children,
  size = 'md',
  className = ''
}) => {
  const isSm = size === 'sm';
  const isLg = size === 'lg';

  // Container dimensions
  const containerSize = isSm ? 'w-10 h-10' : isLg ? 'w-18 h-18 sm:w-20 sm:h-20' : 'w-14 h-14';
  const padding = isSm ? 'p-1' : isLg ? 'p-2' : 'p-1.5';
  const crownBadgeSize = isSm ? 'w-4 h-4 -top-1 -right-1' : isLg ? 'w-6 h-6 -top-1.5 -right-1.5' : 'w-5 h-5 -top-1 -right-1';
  const crownIconSize = isSm ? 'w-2.5 h-2.5' : isLg ? 'w-3.5 h-3.5' : 'w-3 h-3';

  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${containerSize} ${className}`}>
      {/* 1. Soft Warm Particle / Sparkle Glow Animation behind frame */}
      <motion.div
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.5, 0.85, 0.5],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-amber-400 via-terracotta/60 to-amber-300 blur-xs pointer-events-none"
      />

      {/* 2. Slow Orbiting Sparkle Accents */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
        className="absolute -inset-2 pointer-events-none opacity-70"
      >
        <span className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-amber-300 rounded-full shadow-[0_0_8px_#f59e0b]" />
        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-amber-200 rounded-full shadow-[0_0_8px_#f59e0b]" />
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-terracotta-light rounded-full shadow-[0_0_8px_#c05c46]" />
        <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-amber-300 rounded-full shadow-[0_0_8px_#f59e0b]" />
      </motion.div>

      {/* 3. Outer Line-Art Illustrated Frame SVG (Gold Rim, Corner Flourishes & Laurel Detail) */}
      <div className="absolute -inset-0.5 pointer-events-none z-10">
        <svg viewBox="0 0 80 80" className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="goldRimFrameGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FDE68A" />
              <stop offset="40%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#92400E" />
            </linearGradient>
          </defs>

          {/* Outer Scalloped Line-Art Gold Border */}
          <rect
            x="2"
            y="2"
            width="76"
            height="76"
            rx="18"
            fill="none"
            stroke="url(#goldRimFrameGrad)"
            strokeWidth="3"
          />
          <rect
            x="4.5"
            y="4.5"
            width="71"
            height="71"
            rx="15.5"
            fill="none"
            stroke="#FFFDF8"
            strokeWidth="1"
            strokeDasharray="2.5 2"
            opacity="0.9"
          />

          {/* Line-Art Laurel Leaves at bottom left */}
          <g transform="translate(6, 52) rotate(-12)">
            <path d="M0 12 Q 6 4, 12 0 Q 8 8, 0 12 Z" fill="#F59E0B" stroke="#78350F" strokeWidth="0.8" />
            <path d="M4 14 Q 10 8, 16 6 Q 12 12, 4 14 Z" fill="#FDE68A" stroke="#78350F" strokeWidth="0.8" />
          </g>
          {/* Line-Art Laurel Leaves at bottom right */}
          <g transform="translate(62, 52) scale(-1, 1) rotate(-12)">
            <path d="M0 12 Q 6 4, 12 0 Q 8 8, 0 12 Z" fill="#F59E0B" stroke="#78350F" strokeWidth="0.8" />
            <path d="M4 14 Q 10 8, 16 6 Q 12 12, 4 14 Z" fill="#FDE68A" stroke="#78350F" strokeWidth="0.8" />
          </g>

          {/* Sparkle Star Flourish at top left */}
          <path d="M12 10 L13.5 13.5 L17 15 L13.5 16.5 L12 20 L10.5 16.5 L7 15 L10.5 13.5 Z" fill="#FDE68A" stroke="#78350F" strokeWidth="0.6" />
        </svg>
      </div>

      {/* 4. Main Avatar Inner Box */}
      <div className={`relative z-0 w-full h-full rounded-2xl bg-gradient-to-br from-terracotta via-burgundy to-navy text-white dark:from-amber-500 dark:via-terracotta dark:to-burgundy flex items-center justify-center shadow-inner overflow-hidden border border-amber-300/50 ${padding}`}>
        {children}
      </div>

      {/* 5. Floating Illustrated Crown Seal Badge */}
      <div className={`absolute z-20 ${crownBadgeSize} bg-gradient-to-br from-amber-400 via-amber-500 to-terracotta text-white rounded-full flex items-center justify-center shadow-md border-2 border-white dark:border-slate-800 shrink-0`}>
        <Crown className={`${crownIconSize} fill-current text-amber-100 drop-shadow-xs`} />
      </div>
    </div>
  );
};
