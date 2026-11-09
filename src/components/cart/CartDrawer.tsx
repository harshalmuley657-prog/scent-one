import React from 'react';
import { useStore } from '../../context/StoreContext';
import { PerfumeTinVisual } from '../common/PerfumeTinVisual';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, ShieldCheck, AlertCircle, Sparkles, Tag } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateCartQuantity,
    removeFromCart,
    totalQuantity,
    originalSubtotal,
    effectiveUnitPrice,
    isOfferApplied,
    unitsNeededForOffer,
    offerTitle,
    discountPercent,
    discountAmount,
    subtotal,
    deliveryCharge,
    total,
    settings,
    setIsCheckoutOpen,
  } = useStore();

  if (!isCartOpen) return null;

  // Validation: check if any item in cart exceeds current stock
  const hasStockIssue = cart.some((item) => item.quantity > item.product.stock);

  const handleProceedToCheckout = () => {
    if (cart.length === 0 || hasStockIssue) return;
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
        aria-hidden="true"
      />

      {/* Drawer Container: 100% height, flex column with distinct scrollable and sticky sections */}
      <div className="relative w-full max-w-md bg-[#0D0F17] text-[#F8F3EA] border-l border-neutral-800 h-full flex flex-col shadow-2xl z-10 animate-[slideLeft_0.25s_ease-out]">
        {/* Section 1 (Header): Sticky at top */}
        <div className="shrink-0 p-5 border-b border-neutral-800 flex items-center justify-between bg-[#0D0F17]/95">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#D8B66B]/15 text-[#D8B66B] flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold leading-none">Your Fragrance Bag</h3>
              <span className="text-[11px] font-mono text-neutral-400">
                {cart.reduce((s, i) => s + i.quantity, 0)} {cart.reduce((s, i) => s + i.quantity, 0) === 1 ? 'item' : 'items'}
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
            aria-label="Close fragrance bag"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Promotional Tier Meter: BUY 2 OR MORE - JUST ₹149 EACH! */}
        <div className="shrink-0 p-3.5 bg-gradient-to-r from-[#12141F] to-[#0A0C13] border-b border-[#D8B66B]/20 text-xs font-mono space-y-2">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-[#D8B66B] font-bold uppercase text-[11px] tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Special Volume Offer</span>
            </span>
            <span className="text-[10px] text-neutral-400 font-mono">
              {isOfferApplied ? (
                <span className="text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/30">
                  ₹149/TIN APPLIED
                </span>
              ) : (
                <span className="text-[#D8B66B] bg-[#D8B66B]/10 px-1.5 py-0.5 rounded border border-[#D8B66B]/30">
                  REGULAR ₹199
                </span>
              )}
            </span>
          </div>

          {/* Motivational nudge copy */}
          <p className="text-[11px] font-sans text-neutral-300 leading-snug">
            {totalQuantity === 0 ? (
              'BUY 2 OR MORE – JUST ₹149 EACH! Regular ₹199.'
            ) : totalQuantity === 1 ? (
              <>Add <strong>1 more perfume</strong> to automatically unlock <strong className="text-emerald-400">₹149 each</strong> on your entire bag (Save ₹100+)!</>
            ) : (
              <>🎉 <strong className="text-emerald-400">Offer Active: ₹149 per perfume!</strong> You are saving <strong>₹{discountAmount}</strong> on this order.</>
            )}
          </p>

          {/* Tier step indicator */}
          <div className="grid grid-cols-2 gap-2 pt-0.5 text-[10px] font-mono text-center">
            <div className={`py-1.5 px-2 rounded-lg border transition-colors ${
              !isOfferApplied
                ? 'border-[#D8B66B] bg-[#D8B66B]/15 text-[#D8B66B] font-bold'
                : 'border-neutral-800 bg-neutral-900/60 text-neutral-400'
            }`}>
              1 Tin: ₹199 each
            </div>
            <div className={`py-1.5 px-2 rounded-lg border transition-colors ${
              isOfferApplied
                ? 'border-emerald-500 bg-emerald-500/15 text-emerald-300 font-bold'
                : 'border-neutral-800 bg-neutral-900/60 text-neutral-500'
            }`}>
              2+ Tins: ₹149 each {isOfferApplied && '✓ Active'}
            </div>
          </div>
        </div>

        {/* Section 2 (Scrollable Items Area): Takes remaining vertical space */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 overscroll-contain">
          {cart.length === 0 ? (
            <div className="py-24 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center mx-auto text-neutral-500">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h4 className="font-serif text-2xl font-bold text-white">Your fragrance bag is empty</h4>
              <p className="text-xs text-neutral-400 max-w-xs mx-auto leading-relaxed">
                Discover our signature solid perfume collection and slide your favorite pocket scents into your bag.
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="mt-2 px-6 py-3 bg-[#D8B66B] text-neutral-950 text-xs font-semibold uppercase tracking-wider rounded-xl hover:bg-[#c9a759] transition-colors shadow-lg cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              {hasStockIssue && (
                <div className="p-3 rounded-xl border border-rose-500/40 bg-rose-500/10 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>One or more items exceed current available stock. Please adjust quantities.</span>
                </div>
              )}

              {cart.map((item) => {
                const isOutOfStock = item.product.stock <= 0;
                const exceedsStock = item.quantity > item.product.stock;

                return (
                  <div
                    key={item.product.id}
                    className="p-4 rounded-2xl border border-neutral-800 bg-neutral-900/50 flex items-center gap-4 transition-colors"
                  >
                    {/* Mini Tin Visual */}
                    <div className="w-14 h-18 shrink-0 flex items-center justify-center bg-black/60 rounded-xl p-1 border border-neutral-800">
                      <PerfumeTinVisual product={item.product} size="sm" interactive={false} />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="font-serif text-base font-bold text-white truncate">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="p-1 text-neutral-500 hover:text-rose-400 transition-colors"
                          aria-label={`Remove ${item.product.name}`}
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <p className="text-[11px] font-mono text-[#D8B66B]">
                        {item.product.identity}
                      </p>

                      <div className="flex items-baseline gap-2 mt-0.5">
                        <span className="text-xs font-serif font-bold text-white tabular-nums">
                          ₹{effectiveUnitPrice}
                        </span>
                        {isOfferApplied && (
                          <span className="text-[10px] text-neutral-500 font-mono line-through">
                            ₹199
                          </span>
                        )}
                        <span className="text-[10px] text-neutral-500 font-mono">
                          ({item.product.weightGrams}g)
                        </span>
                        {isOfferApplied && (
                          <span className="text-[10px] text-emerald-400 font-mono font-medium">
                            Offer applied
                          </span>
                        )}
                      </div>

                      {/* Stock Warning */}
                      {exceedsStock && (
                        <p className="text-[10px] text-rose-400 font-mono mt-1">
                          Only {item.product.stock} left in stock
                        </p>
                      )}

                      {/* Quantity Stepper */}
                      <div className="mt-2.5 flex items-center justify-between">
                        <div className="flex items-center border border-neutral-700/80 rounded-lg bg-black/60">
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                            className="p-1.5 text-neutral-400 hover:text-[#D8B66B] transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-3 text-xs font-mono font-bold tabular-nums text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                            disabled={item.quantity >= item.product.stock}
                            className="p-1.5 text-neutral-400 hover:text-[#D8B66B] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="font-serif text-sm font-bold text-[#F8F3EA] tabular-nums">
                          ₹{effectiveUnitPrice * item.quantity}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>

        {/* Section 3 (STICKY BOTTOM CHECKOUT SECTION): Always anchored at bottom regardless of scroll */}
        {cart.length > 0 && (
          <div className="shrink-0 p-5 border-t border-neutral-800 bg-[#090A0F] shadow-[0_-8px_24px_rgba(0,0,0,0.6)] space-y-3 pb-[calc(1.25rem+env(safe-area-inset-bottom,0px))]">
            {/* Totals Breakdown */}
            <div className="space-y-1.5 text-xs font-mono">
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
                <span>Delivery Charge:</span>
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
                      You save ₹{discountAmount} (₹149/tin offer)
                    </span>
                  )}
                </div>
                <span className="font-serif text-xl font-bold text-[#D8B66B] tabular-nums">
                  ₹{total}
                </span>
              </div>
            </div>

            {/* Guaranteed Highly Visible Full-Width Gold Checkout Button */}
            <button
              onClick={handleProceedToCheckout}
              disabled={hasStockIssue || cart.length === 0}
              className="w-full min-h-[52px] py-3.5 px-6 bg-[#D8B66B] hover:bg-[#c9a759] active:bg-[#b89547] text-neutral-950 font-sans text-xs sm:text-sm font-bold uppercase tracking-widest rounded-xl transition-all duration-200 flex items-center justify-center gap-2.5 shadow-xl shadow-[#D8B66B]/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Submit order"
            >
              <span>SUBMIT ORDER</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Continue Shopping Action */}
            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="text-xs font-mono text-neutral-400 hover:text-[#D8B66B] transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span>← Continue Shopping</span>
              </button>
              <span className="text-[10px] font-mono text-neutral-500">
                Official WhatsApp Checkout
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
