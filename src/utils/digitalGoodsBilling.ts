/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * ============================================================================
 * GOOGLE PLAY BILLING / DIGITAL GOODS API UTILITY
 * ============================================================================
 * 
 * Supports Trusted Web Activity (TWA) apps published on Google Play.
 * Uses Digital Goods API + Payment Request API as specified by Chrome & Play Store.
 * 
 * Reference: https://developer.chrome.com/docs/android/trusted-web-activity/digital-goods/
 * ============================================================================
 */

export const PRODUCT_ID_MONTHLY = 'campus_plus_monthly';
export const PRODUCT_ID_ANNUAL = 'campus_plus_annual';
export const PRODUCT_ID_REMOVE_ADS = 'campus_remove_ads_forever';
export const PLAY_BILLING_SERVICE_URL = 'https://play.google.com/billing';
export const PLAY_STORE_SUBSCRIPTIONS_URL = 'https://play.google.com/store/account/subscriptions';

export interface SubscriptionProduct {
  id: string;
  title: string;
  description: string;
  priceFormatted: string;
  currency: string;
  value: string;
  period: 'monthly' | 'annual' | 'one_time';
}

export const DEFAULT_PRODUCTS: SubscriptionProduct[] = [
  {
    id: PRODUCT_ID_MONTHLY,
    title: 'Campus Plus Monthly',
    description: 'Ad-free experience, unlimited AI feedback, unlimited practice & exclusive poses.',
    priceFormatted: '$4.99 / mo',
    currency: 'USD',
    value: '4.99',
    period: 'monthly'
  },
  {
    id: PRODUCT_ID_ANNUAL,
    title: 'Campus Plus Annual',
    description: 'All Plus features with 33% discount billed annually.',
    priceFormatted: '$39.99 / yr',
    currency: 'USD',
    value: '39.99',
    period: 'annual'
  },
  {
    id: PRODUCT_ID_REMOVE_ADS,
    title: 'Remove Ads Forever',
    description: 'Permanently remove all advertisements from Campus. One-time purchase, no subscription.',
    priceFormatted: '$2.99',
    currency: 'USD',
    value: '2.99',
    period: 'one_time'
  }
];

/**
 * Checks if the Digital Goods API is available in the current browser/TWA runtime.
 */
export function isDigitalGoodsSupported(): boolean {
  return typeof window !== 'undefined' && 'getDigitalGoodsService' in window;
}

/**
 * Queries active entitlements/purchases via Digital Goods API.
 */
export async function queryDigitalGoodsPurchases(): Promise<string[]> {
  if (!isDigitalGoodsSupported()) {
    return [];
  }

  try {
    const service = await (window as any).getDigitalGoodsService(PLAY_BILLING_SERVICE_URL);
    if (service && typeof service.listPurchases === 'function') {
      const purchases = await service.listPurchases();
      if (Array.isArray(purchases)) {
        return purchases
          .filter((p: any) => p && p.itemId)
          .map((p: any) => p.itemId);
      }
    }
  } catch (err) {
    console.warn('[Digital Goods API] Failed to query purchases:', err);
  }

  return [];
}

/**
 * Initiates Play Billing purchase via Digital Goods API + Payment Request API.
 */
export async function purchaseViaDigitalGoods(productId: string): Promise<{
  success: boolean;
  purchaseToken?: string;
  error?: string;
  isSimulated?: boolean;
}> {
  const targetProduct = DEFAULT_PRODUCTS.find((p) => p.id === productId) || DEFAULT_PRODUCTS[0];

  // If running inside TWA with Digital Goods API available:
  if (isDigitalGoodsSupported()) {
    try {
      const service = await (window as any).getDigitalGoodsService(PLAY_BILLING_SERVICE_URL);
      
      const paymentMethods = [
        {
          supportedMethods: PLAY_BILLING_SERVICE_URL,
          data: {
            sku: productId
          }
        }
      ];

      const paymentDetails = {
        total: {
          label: targetProduct.title,
          amount: {
            currency: targetProduct.currency,
            value: targetProduct.value
          }
        }
      };

      if (typeof (window as any).PaymentRequest === 'function') {
        const request = new (window as any).PaymentRequest(paymentMethods, paymentDetails);
        const paymentResponse = await request.show();
        
        const details = paymentResponse.details || {};
        const purchaseToken = details.purchaseToken || `token_${Date.now()}`;

        // Acknowledge purchase if service method exists
        if (service && typeof service.acknowledge === 'function') {
          try {
            await service.acknowledge(purchaseToken, 'repeatable');
          } catch (ackErr) {
            console.warn('[Digital Goods API] Acknowledge call non-fatal warning:', ackErr);
          }
        }

        await paymentResponse.complete('success');
        return { success: true, purchaseToken };
      }
    } catch (err: any) {
      console.error('[Digital Goods API] Purchase flow error:', err);
      // User cancelled or Play Billing error
      if (err.name === 'AbortError') {
        return { success: false, error: 'Purchase cancelled by user.' };
      }
      return { success: false, error: err.message || 'Play Billing transaction failed.' };
    }
  }

  // Web Browser / Dev Preview Fallback Simulation
  console.log('[Digital Goods API] Standard web environment detected. Simulating sandbox purchase...');
  return {
    success: true,
    purchaseToken: `sandbox_web_token_${Date.now()}`,
    isSimulated: true
  };
}

/**
 * Returns Google Play Store's subscription management web URL for active subscribers.
 */
export function openPlayStoreSubscriptions(): void {
  if (typeof window !== 'undefined') {
    window.open(PLAY_STORE_SUBSCRIPTIONS_URL, '_blank', 'noopener,noreferrer');
  }
}
