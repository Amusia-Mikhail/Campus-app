/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { useCampus } from '../context/CampusContext';

/**
 * ============================================================================
 * CAMPUS WEB ADVERTISING SLOT (RESERVED INFRASTRUCTURE)
 * ============================================================================
 * 
 * INTERNAL POLICY & CONTENT RATING MANDATE:
 * ----------------------------------------------------------------------------
 * When connecting a real web ad network (e.g., Google AdSense, Google Ad Manager,
 * or AdMob for web), the publisher placement & account content rating MUST be 
 * explicitly set to FAMILY-SAFE / NON-ADULT (Max content rating: G or PG).
 * 
 * Reason: "Campus" is an academic RPG language learning simulator whose target 
 * audience includes high school students, college undergraduates, teenage ESL
 * learners, and academic institution users.
 * ----------------------------------------------------------------------------
 * 
 * AD INTEGRATION GUIDE FOR FUTURE DEPLOYMENT:
 * 1. Insert publisher script (e.g., <script async src="...adsbygoogle.js"></script>)
 *    into index.html or load dynamically in this component's useEffect.
 * 2. Set window.__CAMPUS_ADS_ENABLED = true; or initialize window.adsbygoogle.
 * 3. Replace the placeholder div in this component with your network's <ins /> ad tag.
 */

interface AdBannerSlotProps {
  className?: string;
  slotId?: string;
}

export const AdBannerSlot: React.FC<AdBannerSlotProps> = ({
  className = '',
  slotId = 'campus-home-banner-ad-slot'
}) => {
  const { isCampusPlus, hasRemovedAds, isAdFree } = useCampus();
  const [isAdActive, setIsAdActive] = useState(false);

  useEffect(() => {
    // Check if live ad serving has been enabled via global window configuration or ad script injection
    if (
      typeof window !== 'undefined' &&
      ((window as any).__CAMPUS_ADS_ENABLED === true || (window as any).adsbygoogle)
    ) {
      setIsAdActive(true);
    }
  }, []);

  // Campus Plus subscribers and users with "Remove Ads Forever" enjoy a 100% ad-free experience!
  if (isCampusPlus || hasRemovedAds || isAdFree) {
    return null;
  }

  // When no active ad network script is loaded, render as an empty, invisible container
  // with zero visual impact, zero margin, zero padding, and zero layout shift.
  if (!isAdActive) {
    return (
      <div
        id={slotId}
        data-ad-slot-reserved="true"
        data-family-safe-rating="G_PG"
        style={{ display: 'none', height: 0, overflow: 'hidden' }}
        aria-hidden="true"
      />
    );
  }

  return (
    <div
      id={slotId}
      data-ad-slot-reserved="true"
      data-family-safe-rating="G_PG"
      className={`w-full max-w-2xl mx-auto my-3 overflow-hidden rounded-2xl border border-navy/10 dark:border-slate-800 bg-cream-card/50 dark:bg-slate-900/50 p-2 text-center transition-all ${className}`}
    >
      {/* Container where ad script drops its responsive ad banner */}
      <div className="w-full flex items-center justify-center min-h-[60px]" id={`${slotId}-container`}>
        {/* Network ad unit tag drops in here */}
      </div>
    </div>
  );
};
