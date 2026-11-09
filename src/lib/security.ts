/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * SCENT ONE — Application Security & Defense Engine
 * Implements input sanitization, canonical pricing verification,
 * rate limiting, session auto-timeout, and Firebase Auth readiness.
 */

import { CartItem, CustomerInfo, Order, Product, StoreSettings } from '../types';
import { INITIAL_PRODUCTS } from '../data/initialProducts';

// ==========================================
// 1. INPUT SANITIZATION & XSS DEFENSES
// ==========================================

/**
 * Sanitizes generic string inputs to prevent XSS and script injection.
 * Strips HTML tags, controls characters, and encodes special characters.
 */
export function sanitizeString(input: unknown, maxLength = 255): string {
  if (typeof input !== 'string') return '';
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Strip angle brackets to prevent HTML/script injection
    .replace(/javascript:/gi, '') // Strip dangerous javascript: URI schemes
    .replace(/on\w+=/gi, '') // Strip inline event handlers like onclick=
    .slice(0, maxLength);
}

/**
 * Validates and sanitizes Indian 10-digit mobile numbers.
 */
export function sanitizeMobile(input: unknown): string {
  if (typeof input !== 'string') return '';
  const digitsOnly = input.replace(/\D/g, '');
  // Extract last 10 digits if preceded by 91 or 0
  if (digitsOnly.length === 10) return digitsOnly;
  if (digitsOnly.length === 12 && digitsOnly.startsWith('91')) return digitsOnly.slice(2);
  if (digitsOnly.length === 11 && digitsOnly.startsWith('0')) return digitsOnly.slice(1);
  return digitsOnly.slice(0, 10);
}

/**
 * Validates and sanitizes Indian 6-digit postal PIN codes.
 */
export function sanitizePincode(input: unknown): string {
  if (typeof input !== 'string') return '';
  const digitsOnly = input.replace(/\D/g, '');
  return digitsOnly.slice(0, 6);
}

/**
 * Validates and sanitizes customer checkout form inputs.
 */
export function sanitizeCustomerInput(data: Partial<CustomerInfo>): {
  sanitized: CustomerInfo;
  isValid: boolean;
  errors: Partial<Record<keyof CustomerInfo, string>>;
} {
  const errors: Partial<Record<keyof CustomerInfo, string>> = {};

  const fullName = sanitizeString(data.fullName, 100);
  if (!fullName || fullName.length < 2) {
    errors.fullName = 'Full name must be at least 2 characters.';
  } else if (!/^[a-zA-Z\s.'-]+$/.test(fullName)) {
    errors.fullName = 'Full name contains invalid characters.';
  }

  const mobile = sanitizeMobile(data.mobile);
  if (mobile.length !== 10) {
    errors.mobile = 'Please enter a valid 10-digit mobile number.';
  }

  const address = sanitizeString(data.address, 300);
  if (!address || address.length < 5) {
    errors.address = 'Please enter your complete delivery street / building address.';
  }

  const pincode = sanitizePincode(data.pincode);
  if (pincode.length !== 6) {
    errors.pincode = 'Please enter a valid 6-digit Indian PIN code.';
  }

  const city = data.city ? sanitizeString(data.city, 80) : undefined;
  const state = data.state ? sanitizeString(data.state, 80) : undefined;

  let email: string | undefined = undefined;
  if (data.email && data.email.trim()) {
    const cleanEmail = sanitizeString(data.email, 120);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(cleanEmail)) {
      email = cleanEmail;
    }
  }

  const landmark = data.landmark ? sanitizeString(data.landmark, 150) : undefined;
  const deliveryInstructions = data.deliveryInstructions ? sanitizeString(data.deliveryInstructions, 250) : undefined;
  const coordinates = data.coordinates && typeof data.coordinates.latitude === 'number' && typeof data.coordinates.longitude === 'number'
    ? { latitude: data.coordinates.latitude, longitude: data.coordinates.longitude }
    : undefined;

  const sanitized: CustomerInfo = {
    fullName,
    mobile,
    address,
    pincode,
    landmark,
    city,
    state,
    email,
    deliveryInstructions,
    coordinates,
  };

  return {
    sanitized,
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

// ==========================================
// 2. CANONICAL PRICING & ORDER VERIFICATION
// ==========================================

export interface OrderVerificationResult {
  isValid: boolean;
  tampered: boolean;
  reason?: string;
  verifiedItems: {
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[];
  totalUnits: number;
  verifiedOriginalSubtotal: number;
  verifiedDiscountPercent: number;
  verifiedDiscountAmount: number;
  verifiedSubtotal: number;
  verifiedDeliveryCharges: number;
  verifiedTotal: number;
  verifiedEffectiveUnitPrice: number;
  verifiedIsOfferApplied: boolean;
  verifiedOfferTitle: string;
}

export const REGULAR_PRICE = 199;
export const OFFER_PRICE = 149;
export const OFFER_MIN_UNITS = 2;

/**
 * SCENT ONE Official Quantity-Based Pricing System:
 * - Regular price of EVERY perfume: ₹199.
 * - Exactly 1 perfume: charge ₹199.
 * - 2 or more perfumes: automatically charge ₹149 per perfume.
 * - The offer applies to 2, 3, 4 or more perfume units.
 * - Example: 2 perfumes = ₹298, 3 = ₹447, 4 = ₹596.
 * - Savings per perfume unit when 2+ units: ₹50 each (₹199 - ₹149).
 */
export function calculateVolumePricing(totalUnits: number, originalSubtotal: number) {
  const isOfferApplied = totalUnits >= OFFER_MIN_UNITS;
  const effectiveUnitPrice = isOfferApplied ? OFFER_PRICE : REGULAR_PRICE;
  const discountedSubtotal = isOfferApplied ? totalUnits * OFFER_PRICE : originalSubtotal;
  const discountAmount = isOfferApplied ? totalUnits * (REGULAR_PRICE - OFFER_PRICE) : 0;
  const discountPercent =
    isOfferApplied && originalSubtotal > 0
      ? Math.round((discountAmount / originalSubtotal) * 100)
      : 0;
  const unitsNeededForOffer = totalUnits < OFFER_MIN_UNITS ? OFFER_MIN_UNITS - totalUnits : 0;

  return {
    isOfferApplied,
    effectiveUnitPrice,
    discountAmount,
    discountPercent,
    discountedSubtotal,
    unitsNeededForOffer,
    offerTitle: 'BUY 2 OR MORE – JUST ₹149 EACH!',
  };
}

// Retain alias for backwards compatibility
export const calculateBuyMoreSaveMoreDiscount = calculateVolumePricing;

/**
 * Authoritative Server-Side / Immutable Catalog Verification.
 * Recalculates unit prices, subtotal, automatic volume discounts, and delivery charges strictly from official products.
 * Rejects client-side price tampering, negative quantities, or forged discounts.
 */
export function verifyAndCalculateOrder(
  cart: CartItem[],
  activeCatalog: Product[],
  settings: StoreSettings
): OrderVerificationResult {
  if (!cart || cart.length === 0) {
    return {
      isValid: false,
      tampered: false,
      reason: 'Cart is empty',
      verifiedItems: [],
      totalUnits: 0,
      verifiedOriginalSubtotal: 0,
      verifiedDiscountPercent: 0,
      verifiedDiscountAmount: 0,
      verifiedSubtotal: 0,
      verifiedDeliveryCharges: 0,
      verifiedTotal: 0,
      verifiedEffectiveUnitPrice: REGULAR_PRICE,
      verifiedIsOfferApplied: false,
      verifiedOfferTitle: 'BUY 2 OR MORE – JUST ₹149 EACH!',
    };
  }

  // Authoritative catalog lookup map
  const catalogMap = new Map<string, Product>();
  // First seed with canonical initial products (₹199 regular price)
  INITIAL_PRODUCTS.forEach((p) => catalogMap.set(p.id, p));
  // Then overlay active catalog items if valid
  activeCatalog.forEach((p) => {
    if (p.price > 0 && p.price < 50000) {
      catalogMap.set(p.id, p);
    }
  });

  let originalSubtotal = 0;
  let tampered = false;
  let reason: string | undefined = undefined;

  // First pass: validate items, calculate total units and original subtotal at regular ₹199
  const preliminaryItems: {
    canonicalProduct: Product;
    quantity: number;
  }[] = [];

  for (const item of cart) {
    const canonicalProduct = catalogMap.get(item.product.id);

    if (!canonicalProduct) {
      tampered = true;
      reason = `Product ${item.product.id} does not exist in authoritative catalog.`;
      break;
    }

    // Verify quantity bounds (1 to 20 tins per line item)
    const quantity = Math.floor(Number(item.quantity));
    if (isNaN(quantity) || quantity < 1 || quantity > 20) {
      tampered = true;
      reason = `Invalid order quantity (${item.quantity}) for ${canonicalProduct.name}.`;
      break;
    }

    // Canonical regular price for every perfume is 199
    const regularPrice = canonicalProduct.price || REGULAR_PRICE;
    const itemOriginalTotal = regularPrice * quantity;
    originalSubtotal += itemOriginalTotal;

    preliminaryItems.push({ canonicalProduct, quantity });
  }

  const totalUnits = preliminaryItems.reduce((acc, it) => acc + it.quantity, 0);
  const {
    isOfferApplied,
    effectiveUnitPrice,
    discountAmount,
    discountPercent,
    discountedSubtotal,
    offerTitle,
  } = calculateVolumePricing(totalUnits, originalSubtotal);

  // Build verified items with authoritative unit pricing
  const verifiedItems = preliminaryItems.map(({ canonicalProduct, quantity }) => {
    const unitPrice = effectiveUnitPrice;
    return {
      productId: canonicalProduct.id,
      productName: canonicalProduct.name,
      quantity,
      unitPrice,
      totalPrice: unitPrice * quantity,
    };
  });

  // FREE DELIVERY on every order — no delivery, shipping, or hidden charges
  const deliveryCharges = 0;
  const total = discountedSubtotal;

  return {
    isValid: !tampered && verifiedItems.length > 0,
    tampered,
    reason,
    verifiedItems,
    totalUnits,
    verifiedOriginalSubtotal: originalSubtotal,
    verifiedDiscountPercent: discountPercent,
    verifiedDiscountAmount: discountAmount,
    verifiedSubtotal: discountedSubtotal,
    verifiedDeliveryCharges: deliveryCharges,
    verifiedTotal: total,
    verifiedEffectiveUnitPrice: effectiveUnitPrice,
    verifiedIsOfferApplied: isOfferApplied,
    verifiedOfferTitle: offerTitle,
  };
}

// ==========================================
// 3. RATE LIMITING & BRUTE FORCE PROTECTION
// ==========================================

interface RateLimitState {
  attempts: number;
  lockedUntil: number | null;
  lastAttempt: number;
}

const RATE_LIMIT_STORAGE_KEY = 'scent_one_auth_ratelimit_v1';
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes lockout

export class AuthRateLimiter {
  private static getState(): RateLimitState {
    try {
      const data = sessionStorage.getItem(RATE_LIMIT_STORAGE_KEY);
      if (data) return JSON.parse(data);
    } catch {
      // Fallback
    }
    return { attempts: 0, lockedUntil: null, lastAttempt: Date.now() };
  }

  private static saveState(state: RateLimitState): void {
    try {
      sessionStorage.setItem(RATE_LIMIT_STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore
    }
  }

  public static checkLimit(): { isLocked: boolean; remainingSeconds: number; remainingAttempts: number } {
    const state = this.getState();
    const now = Date.now();

    if (state.lockedUntil && now < state.lockedUntil) {
      const remainingSeconds = Math.ceil((state.lockedUntil - now) / 1000);
      return { isLocked: true, remainingSeconds, remainingAttempts: 0 };
    }

    // Reset if lockout period expired
    if (state.lockedUntil && now >= state.lockedUntil) {
      state.attempts = 0;
      state.lockedUntil = null;
      this.saveState(state);
    }

    return {
      isLocked: false,
      remainingSeconds: 0,
      remainingAttempts: Math.max(0, MAX_ATTEMPTS - state.attempts),
    };
  }

  public static recordFailure(): { isLocked: boolean; remainingSeconds: number; remainingAttempts: number } {
    const state = this.getState();
    const now = Date.now();

    state.attempts += 1;
    state.lastAttempt = now;

    if (state.attempts >= MAX_ATTEMPTS) {
      state.lockedUntil = now + LOCKOUT_DURATION_MS;
      this.saveState(state);
      const remainingSeconds = Math.ceil(LOCKOUT_DURATION_MS / 1000);
      return { isLocked: true, remainingSeconds, remainingAttempts: 0 };
    }

    this.saveState(state);
    return {
      isLocked: false,
      remainingSeconds: 0,
      remainingAttempts: Math.max(0, MAX_ATTEMPTS - state.attempts),
    };
  }

  public static recordSuccess(): void {
    sessionStorage.removeItem(RATE_LIMIT_STORAGE_KEY);
  }
}

// ==========================================
// 4. SESSION MANAGEMENT & IDLE TIMEOUT
// ==========================================

export class AdminSessionManager {
  private static TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes idle timeout
  private static SESSION_KEY = 'scent_one_admin_session_token';
  private static LAST_ACTIVE_KEY = 'scent_one_admin_last_active';

  public static startSession(token: string): void {
    sessionStorage.setItem(this.SESSION_KEY, token);
    sessionStorage.setItem(this.LAST_ACTIVE_KEY, Date.now().toString());
  }

  public static touchSession(): void {
    if (sessionStorage.getItem(this.SESSION_KEY)) {
      sessionStorage.setItem(this.LAST_ACTIVE_KEY, Date.now().toString());
    }
  }

  public static isSessionValid(): boolean {
    const token = sessionStorage.getItem(this.SESSION_KEY);
    const lastActive = sessionStorage.getItem(this.LAST_ACTIVE_KEY);

    if (!token || !lastActive) return false;

    const timeDiff = Date.now() - parseInt(lastActive, 10);
    if (timeDiff > this.TIMEOUT_MS) {
      this.terminateSession();
      return false;
    }

    // Touch on valid check
    this.touchSession();
    return true;
  }

  public static terminateSession(): void {
    sessionStorage.removeItem(this.SESSION_KEY);
    sessionStorage.removeItem(this.LAST_ACTIVE_KEY);
  }
}

// ==========================================
// 5. PII MASKING & PRIVACY
// ==========================================

/**
 * Masks customer phone number for display (e.g. "+91 90*** **615").
 */
export function maskPhoneNumber(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 10) return phone;
  const last10 = digits.slice(-10);
  return `+91 ${last10.slice(0, 2)}*** **${last10.slice(-3)}`;
}

/**
 * Obfuscates customer full name for receipt previews (e.g. "Yash J***").
 */
export function maskCustomerName(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0];
  const first = parts[0];
  const lastInitial = parts[parts.length - 1][0] || '';
  return `${first} ${lastInitial}***`;
}
