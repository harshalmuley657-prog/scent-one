import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { CustomerInfo } from '../../types';
import {
  X,
  MapPin,
  Send,
  AlertCircle,
  Loader2,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Edit2,
  ShieldCheck,
  Package,
  Navigation,
  Tag,
  Sparkles,
} from 'lucide-react';
import { sanitizeCustomerInput, sanitizeMobile, sanitizePincode } from '../../lib/security';
import { PerfumeTinVisual } from '../common/PerfumeTinVisual';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    totalQuantity,
    originalSubtotal,
    effectiveUnitPrice,
    isOfferApplied,
    discountPercent,
    discountAmount,
    subtotal,
    deliveryCharge,
    total,
    settings,
    createOrder,
    showToast,
  } = useStore();

  // Multi-step checkout flow: 'details' -> 'review'
  const [step, setStep] = useState<'details' | 'review'>('details');

  // Customer Details Form State (Strictly 6 fields per Part 4 specification)
  const [formData, setFormData] = useState<CustomerInfo>({
    fullName: '',
    mobile: '',
    address: '',
    landmark: '',
    pincode: '',
    coordinates: undefined,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CustomerInfo | 'location', string>>>({});
  const [isLocating, setIsLocating] = useState(false);
  const [locationStatus, setLocationStatus] = useState<{
    type: 'idle' | 'success' | 'denied' | 'error';
    message: string;
    coords?: { latitude: number; longitude: number };
  }>({
    type: 'idle',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isCheckoutOpen) return null;

  // Exact Delivery Location Detection via Browser Geolocation API
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus({
        type: 'error',
        message: 'Geolocation is not supported by your browser. Please enter your address manually.',
      });
      return;
    }

    setIsLocating(true);
    setLocationStatus({
      type: 'idle',
      message: 'Requesting device GPS permission...',
    });

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        setFormData((prev) => ({
          ...prev,
          coordinates: { latitude: lat, longitude: lon },
        }));

        // Reverse geocode to assist with PIN and street if available
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 6000);
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`,
            { signal: controller.signal }
          );
          clearTimeout(timeoutId);

          if (res.ok) {
            const data = await res.json();
            const addr = data.address || {};
            const streetParts = [addr.house_number, addr.road, addr.suburb, addr.neighbourhood]
              .filter(Boolean)
              .join(', ');

            setFormData((prev) => ({
              ...prev,
              address: prev.address || streetParts,
              pincode: prev.pincode || (addr.postcode ? sanitizePincode(addr.postcode) : ''),
              landmark: prev.landmark || addr.suburb || addr.neighbourhood || '',
            }));

            setLocationStatus({
              type: 'success',
              message: `Exact GPS Pin Acquired (${lat.toFixed(4)}, ${lon.toFixed(4)}). Street address detected. Please confirm building/flat number.`,
              coords: { latitude: lat, longitude: lon },
            });
          } else {
            setLocationStatus({
              type: 'success',
              message: `Exact GPS Pin Acquired (${lat.toFixed(4)}, ${lon.toFixed(4)}). Please enter your building & street address below.`,
              coords: { latitude: lat, longitude: lon },
            });
          }
        } catch {
          setLocationStatus({
            type: 'success',
            message: `Exact GPS Pin Acquired (${lat.toFixed(4)}, ${lon.toFixed(4)}). Please type your street address below.`,
            coords: { latitude: lat, longitude: lon },
          });
        } finally {
          setIsLocating(false);
        }
      },
      (err) => {
        setIsLocating(false);
        if (err.code === err.PERMISSION_DENIED) {
          setLocationStatus({
            type: 'denied',
            message: 'Location access was declined. You can type your delivery address and PIN code manually.',
          });
        } else {
          setLocationStatus({
            type: 'error',
            message: 'Unable to acquire location coordinates. Please type your delivery address manually.',
          });
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Form Validation before Order Review
  const validateDetails = (): boolean => {
    const { sanitized, isValid, errors: validationErrors } = sanitizeCustomerInput(formData);
    const newErrors: Partial<Record<keyof CustomerInfo | 'location', string>> = { ...validationErrors };

    // Additional strict validation checks for Part 4
    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Please enter your full name';
    }

    const cleanMobile = sanitizeMobile(formData.mobile);
    if (!cleanMobile || cleanMobile.length !== 10) {
      newErrors.mobile = 'Please enter a valid 10-digit Indian mobile number';
    }

    if (!formData.address.trim() || formData.address.trim().length < 5) {
      newErrors.address = 'Please enter complete house/flat number, building, street and area';
    }

    const cleanPin = sanitizePincode(formData.pincode);
    if (!cleanPin || cleanPin.length !== 6) {
      newErrors.pincode = 'Please enter a valid 6-digit Indian PIN code';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setFormData((prev) => ({
        ...prev,
        fullName: sanitized.fullName,
        mobile: cleanMobile,
        address: sanitized.address,
        pincode: cleanPin,
        landmark: sanitized.landmark || '',
      }));
      return true;
    }
    return false;
  };

  // Advance from Customer Details to Order Review
  const handleProceedToReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      showToast('Your fragrance bag is empty.', 'error');
      setIsCheckoutOpen(false);
      return;
    }

    if (validateDetails()) {
      setStep('review');
    }
  };

  // Final Action: Submit Order on WhatsApp (Part 6)
  const handlePlaceOrderOnWhatsApp = () => {
    if (cart.length === 0 || isSubmitting) return;

    setIsSubmitting(true);

    try {
      // 1. Create order record with canonical prices and status 'Pending'
      const newOrder = createOrder(formData, formData.landmark ? `Landmark: ${formData.landmark}` : undefined);

      // 2. Build beautifully formatted WhatsApp message per official specification
      const unitPriceStr = (newOrder.effectiveUnitPrice || effectiveUnitPrice) === 149 ? '₹149 each (Offer)' : '₹199 each (Regular)';
      const itemsFormatted = newOrder.items
        .map((item) => `${item.productName} x ${item.quantity} (${unitPriceStr})\nItem Total: ₹${item.totalPrice}`)
        .join('\n\n');

      const fullAddress = `${formData.address}${
        formData.landmark ? `, Landmark: ${formData.landmark}` : ''
      }, PIN: ${formData.pincode}`;

      const locationLink = formData.coordinates
        ? `\nGPS Location: https://www.google.com/maps?q=${formData.coordinates.latitude},${formData.coordinates.longitude}`
        : '';

      const discountSection =
        newOrder.discountAmount && newOrder.discountAmount > 0
          ? `Original Subtotal (Regular ₹199 each): ₹${newOrder.originalSubtotal || originalSubtotal}\nOffer Applied (BUY 2 OR MORE – JUST ₹149 EACH!): -₹${newOrder.discountAmount}\nDiscounted Subtotal: ₹${newOrder.subtotal}`
          : `Subtotal (Regular ₹199 each): ₹${newOrder.subtotal}`;

      const message = `Hello SCENT ONE!

I would like to place an order.

ORDER REFERENCE:
${newOrder.orderReference}

CUSTOMER DETAILS:
Name: ${formData.fullName}
Mobile: ${formData.mobile}
Delivery Address: ${fullAddress}${locationLink}

ORDER ITEMS:
${itemsFormatted}

${discountSection}
Delivery Charges: ${newOrder.deliveryCharges === 0 ? 'FREE' : `₹${newOrder.deliveryCharges}`}
Estimated Total: ₹${newOrder.total}

Please confirm the order.

Thank you!`;

      // 3. Open WhatsApp click-to-chat
      const cleanNumber = settings.whatsappNumber.replace(/\D/g, '') || '919011558615';
      const encodedMessage = encodeURIComponent(message);
      const waUrl = `https://wa.me/${cleanNumber}?text=${encodedMessage}`;

      window.open(waUrl, '_blank', 'noopener,noreferrer');
    } catch (err) {
      console.error('[CHECKOUT ERROR]', err);
      showToast('Failed to prepare order. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
        onClick={() => setIsCheckoutOpen(false)}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-xl bg-[#0F111A] text-[#F8F3EA] rounded-3xl border border-[#D8B66B]/35 shadow-2xl z-10 my-6 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="p-5 sm:p-6 border-b border-neutral-800 bg-black/40 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#D8B66B]/15 text-[#D8B66B] flex items-center justify-center border border-[#D8B66B]/30 font-serif font-bold text-sm">
              S1
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-widest text-[#D8B66B] uppercase font-semibold block">
                {step === 'details' ? 'Step 1 of 2 · Delivery Information' : 'Step 2 of 2 · Order Review'}
              </span>
              <h3 className="font-serif text-lg sm:text-xl font-bold leading-tight">
                {step === 'details' ? 'Delivery Destination' : 'Review & Confirm'}
              </h3>
            </div>
          </div>

          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800/60 transition-colors cursor-pointer"
            aria-label="Close checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 overscroll-contain">
          {step === 'details' ? (
            /* ============================================================ */
            /* PART 4 & 5: SHORT, PREMIUM CUSTOMER DETAILS PAGE            */
            /* ============================================================ */
            <form onSubmit={handleProceedToReview} className="space-y-5">
              {/* Main Heading & Subtitle per Part 5 specification */}
              <div className="space-y-1">
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  Where should we deliver your fragrance?
                </h2>
                <p className="text-xs sm:text-sm text-neutral-400 font-sans leading-relaxed">
                  Just a few details and your fragrance will be on its way.
                </p>
              </div>

              {/* Exact Delivery Location: Attractive DETECT MY LOCATION button */}
              <div className="p-4 rounded-2xl border border-neutral-800 bg-neutral-900/50 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="text-xs text-neutral-300">
                    <span className="font-semibold text-white block">Exact Delivery Location</span>
                    <span className="text-[11px] text-neutral-400 font-sans">
                      Tap below to acquire your precise delivery coordinates.
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleDetectLocation}
                    disabled={isLocating}
                    className="px-4 py-2.5 rounded-xl border border-[#D8B66B]/50 hover:border-[#D8B66B] bg-[#D8B66B]/10 hover:bg-[#D8B66B]/20 text-[#D8B66B] text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 shrink-0 cursor-pointer shadow-sm disabled:opacity-50"
                  >
                    {isLocating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-[#D8B66B]" />
                        <span>Detecting...</span>
                      </>
                    ) : (
                      <>
                        <Navigation className="w-4 h-4 text-[#D8B66B]" />
                        <span>DETECT MY LOCATION</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Status or GPS Coordinates Badge */}
                {locationStatus.message && (
                  <div
                    className={`p-3 rounded-xl text-xs font-mono flex items-start gap-2 border ${
                      locationStatus.type === 'success'
                        ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                        : locationStatus.type === 'denied'
                        ? 'border-amber-500/40 bg-amber-500/10 text-amber-300'
                        : 'border-neutral-800 bg-neutral-950 text-neutral-300'
                    }`}
                  >
                    {locationStatus.type === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1 text-[11px] leading-relaxed">
                      <span>{locationStatus.message}</span>
                      {locationStatus.coords && (
                        <div className="pt-1.5 flex items-center gap-2 text-[10px]">
                          <a
                            href={`https://www.google.com/maps?q=${locationStatus.coords.latitude},${locationStatus.coords.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#D8B66B] hover:underline flex items-center gap-1 font-semibold"
                          >
                            <MapPin className="w-3 h-3" />
                            <span>Preview Pin on Map ↗</span>
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Form Fields: Strict 5 Customer Input Elements */}
              <div className="space-y-4">
                {/* 1. Full Name (Required) */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300 mb-1.5 font-medium">
                    1. Full Name <span className="text-[#D8B66B]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 rounded-xl border border-neutral-800 bg-neutral-900/60 text-white placeholder-neutral-500 text-sm focus:border-[#D8B66B] focus:ring-1 focus:ring-[#D8B66B] focus:outline-none transition-colors"
                  />
                  {errors.fullName && <p className="text-xs text-rose-400 mt-1 font-mono">{errors.fullName}</p>}
                </div>

                {/* 2. Mobile Number (Required, 10-Digit Indian) */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300 mb-1.5 font-medium">
                    2. Mobile Number <span className="text-[#D8B66B]">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 text-xs font-mono text-[#D8B66B] font-bold select-none">
                      +91
                    </span>
                    <input
                      type="tel"
                      inputMode="numeric"
                      required
                      maxLength={10}
                      value={formData.mobile}
                      onChange={(e) => {
                        const clean = e.target.value.replace(/\D/g, '').slice(0, 10);
                        setFormData({ ...formData, mobile: clean });
                      }}
                      placeholder="Enter your mobile number"
                      className="w-full pl-14 pr-4 py-3 rounded-xl border border-neutral-800 bg-neutral-900/60 text-white placeholder-neutral-500 text-sm font-mono focus:border-[#D8B66B] focus:ring-1 focus:ring-[#D8B66B] focus:outline-none transition-colors"
                    />
                  </div>
                  {errors.mobile && <p className="text-xs text-rose-400 mt-1 font-mono">{errors.mobile}</p>}
                </div>

                {/* 3. Complete Delivery Address (Required) */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300 mb-1.5 font-medium">
                    3. Complete Delivery Address <span className="text-[#D8B66B]">*</span>
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="House number, building, street and area"
                    className="w-full px-4 py-3 rounded-xl border border-neutral-800 bg-neutral-900/60 text-white placeholder-neutral-500 text-sm focus:border-[#D8B66B] focus:ring-1 focus:ring-[#D8B66B] focus:outline-none transition-colors leading-relaxed"
                  />
                  {errors.address && <p className="text-xs text-rose-400 mt-1 font-mono">{errors.address}</p>}
                </div>

                {/* 4. Landmark (Optional) & 5. PIN Code (Required) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300 mb-1.5 font-medium">
                      4. Landmark <span className="text-neutral-500 text-[10px]">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={formData.landmark || ''}
                      onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                      placeholder="Nearby landmark"
                      className="w-full px-4 py-3 rounded-xl border border-neutral-800 bg-neutral-900/60 text-white placeholder-neutral-500 text-sm focus:border-[#D8B66B] focus:ring-1 focus:ring-[#D8B66B] focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300 mb-1.5 font-medium">
                      5. PIN Code <span className="text-[#D8B66B]">*</span>
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      required
                      maxLength={6}
                      value={formData.pincode}
                      onChange={(e) => {
                        const clean = e.target.value.replace(/\D/g, '').slice(0, 6);
                        setFormData({ ...formData, pincode: clean });
                      }}
                      placeholder="6-digit PIN code"
                      className="w-full px-4 py-3 rounded-xl border border-neutral-800 bg-neutral-900/60 text-white placeholder-neutral-500 text-sm font-mono focus:border-[#D8B66B] focus:ring-1 focus:ring-[#D8B66B] focus:outline-none transition-colors"
                    />
                    {errors.pincode && <p className="text-xs text-rose-400 mt-1 font-mono">{errors.pincode}</p>}
                  </div>
                </div>
              </div>

              {/* Order Total Quick Summary */}
              <div className="p-3.5 rounded-xl border border-neutral-800/80 bg-neutral-950/40 space-y-1.5 text-xs font-mono">
                <div className="flex items-center justify-between text-neutral-400">
                  <span>
                    Items ({totalQuantity} {totalQuantity === 1 ? 'perfume' : 'perfumes'}):
                  </span>
                  <span className="text-white tabular-nums">₹{originalSubtotal}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex items-center justify-between text-emerald-400 font-semibold">
                    <span className="flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5" />
                      <span>Buy 2+ Offer (₹149/tin):</span>
                    </span>
                    <span className="tabular-nums">-₹{discountAmount}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-neutral-400">
                  <span>Delivery Charges:</span>
                  <span className="text-[#D8B66B] font-semibold">FREE</span>
                </div>
                <div className="pt-1.5 border-t border-neutral-800/80 flex items-center justify-between">
                  <span className="font-semibold text-white">Estimated Total:</span>
                  <span className="font-serif text-base font-bold text-[#D8B66B] tabular-nums">
                    ₹{total}
                  </span>
                </div>
              </div>

              {/* Primary Action Button: CONTINUE TO ORDER REVIEW */}
              <button
                type="submit"
                className="w-full min-h-[52px] py-4 px-6 bg-[#D8B66B] hover:bg-[#c9a759] active:bg-[#b89547] text-neutral-950 font-sans text-xs sm:text-sm font-bold uppercase tracking-widest rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-xl shadow-[#D8B66B]/20 cursor-pointer"
              >
                <span>CONTINUE TO ORDER REVIEW</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* ============================================================ */
            /* PART 6: COMPACT ORDER REVIEW STEP                           */
            /* ============================================================ */
            <div className="space-y-5">
              {/* Heading */}
              <div className="space-y-1">
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  Review Your Fragrance Order
                </h2>
                <p className="text-xs sm:text-sm text-neutral-400 font-sans leading-relaxed">
                  Please verify your delivery details and items before connecting on WhatsApp.
                </p>
              </div>

              {/* Customer Details Summary Card */}
              <div className="p-4 rounded-2xl border border-neutral-800 bg-neutral-900/60 space-y-3">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-[#D8B66B] font-bold">
                    Delivery Details
                  </span>
                  <button
                    type="button"
                    onClick={() => setStep('details')}
                    className="text-xs font-mono text-neutral-400 hover:text-[#D8B66B] transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit Details</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                  <div>
                    <span className="text-neutral-500 block text-[10px] uppercase">Customer Name:</span>
                    <span className="text-white font-semibold">{formData.fullName}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-[10px] uppercase">Mobile Number:</span>
                    <span className="text-white font-semibold">+91 {formData.mobile}</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-neutral-500 block text-[10px] uppercase">Complete Address:</span>
                    <span className="text-white font-sans text-xs leading-relaxed block">
                      {formData.address}
                    </span>
                  </div>
                  {formData.landmark && (
                    <div>
                      <span className="text-neutral-500 block text-[10px] uppercase">Landmark:</span>
                      <span className="text-neutral-300">{formData.landmark}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-neutral-500 block text-[10px] uppercase">Postal PIN Code:</span>
                    <span className="text-white font-semibold">{formData.pincode}</span>
                  </div>
                  {formData.coordinates && (
                    <div className="sm:col-span-2 pt-1 flex items-center gap-2 text-[11px] text-emerald-400">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span>
                        Exact GPS Pin: {formData.coordinates.latitude.toFixed(4)},{' '}
                        {formData.coordinates.longitude.toFixed(4)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Selected Fragrances List */}
              <div className="p-4 rounded-2xl border border-neutral-800 bg-neutral-900/60 space-y-3">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-[#D8B66B] font-bold">
                    Selected Fragrances ({cart.reduce((s, i) => s + i.quantity, 0)})
                  </span>
                  <span className="text-[10px] font-mono text-neutral-500">Solid Perfume Tins (15g)</span>
                </div>

                <div className="divide-y divide-neutral-800/60">
                  {cart.map((item) => (
                    <div key={item.product.id} className="py-2.5 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-12 shrink-0 bg-black/60 rounded-lg p-0.5 border border-neutral-800 flex items-center justify-center">
                          <PerfumeTinVisual product={item.product} size="sm" interactive={false} />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-serif text-sm font-bold text-white truncate">
                            {item.product.name}
                          </h4>
                          <span className="text-[11px] font-mono text-neutral-400">
                            Quantity: <strong className="text-white">{item.quantity}</strong> × ₹{effectiveUnitPrice}
                            {isOfferApplied && (
                              <span className="text-emerald-400 ml-1.5 font-medium">(₹149 offer)</span>
                            )}
                          </span>
                        </div>
                      </div>

                      <div className="font-serif text-sm font-bold text-[#F8F3EA] tabular-nums shrink-0">
                        ₹{effectiveUnitPrice * item.quantity}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price & Delivery Charge Breakdown */}
              <div className="p-4 rounded-2xl border border-neutral-800 bg-black/50 space-y-2 text-xs font-mono">
                <div className="flex justify-between text-neutral-400">
                  <span>Original Subtotal:</span>
                  <span className="text-white tabular-nums">₹{originalSubtotal}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-semibold">
                    <span className="flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Buy 2+ Offer (₹149/tin):</span>
                    </span>
                    <span className="tabular-nums">-₹{discountAmount}</span>
                  </div>
                )}

                <div className="flex justify-between text-neutral-400">
                  <span>Delivery Charges:</span>
                  <span className="text-white tabular-nums">
                    {deliveryCharge === 0 ? (
                      <span className="text-[#D8B66B] font-semibold">FREE</span>
                    ) : (
                      `₹${deliveryCharge}`
                    )}
                  </span>
                </div>

                <div className="pt-2 border-t border-neutral-800 flex justify-between items-baseline">
                  <div>
                    <span className="font-serif text-base font-bold text-white block">Final Total:</span>
                    {discountAmount > 0 && (
                      <span className="text-[10px] text-emerald-400 font-mono">
                        Includes ₹{discountAmount} savings with ₹149/tin offer
                      </span>
                    )}
                  </div>
                  <span className="font-serif text-xl font-bold text-[#D8B66B] tabular-nums">
                    ₹{total}
                  </span>
                </div>
              </div>

              {/* Payment Protocol & Delivery Clarity Notice */}
              <div className="p-3.5 rounded-xl border border-[#D8B66B]/30 bg-[#D8B66B]/5 text-xs text-neutral-300 flex items-start gap-2.5 font-sans">
                <ShieldCheck className="w-4 h-4 text-[#D8B66B] shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="font-bold text-white block">WhatsApp Direct Order Protocol</span>
                  <p className="text-[11px] text-neutral-400 leading-relaxed">
                    Clicking below prepares your pre-formatted order in WhatsApp with founder Yash Jain (+91 90115 58615). Payment details (UPI / GPay / NetBanking) will be shared directly upon confirmation.
                  </p>
                </div>
              </div>

              {/* Actions Row: Edit Details + Final PLACE ORDER ON WHATSAPP Button */}
              <div className="space-y-2.5 pt-1">
                <button
                  type="button"
                  onClick={handlePlaceOrderOnWhatsApp}
                  disabled={isSubmitting || cart.length === 0}
                  className="w-full min-h-[54px] py-4 px-6 bg-[#25D366] hover:bg-[#20ba59] active:bg-[#1caa50] text-white font-sans text-xs sm:text-sm font-bold uppercase tracking-widest rounded-xl transition-all duration-200 flex items-center justify-center gap-2.5 shadow-xl shadow-[#25D366]/25 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                  <span>PLACE ORDER ON WHATSAPP</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStep('details')}
                  className="w-full py-2.5 text-xs font-mono text-neutral-400 hover:text-white transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Modify Delivery Details</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
