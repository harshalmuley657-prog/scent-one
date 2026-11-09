import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { PerfumeTinVisual } from '../common/PerfumeTinVisual';
import { FragranceParticles } from '../common/FragranceParticles';
import { X, Heart, ShoppingBag, Plus, Minus, Sparkles, Check, ArrowRight } from 'lucide-react';
import { Product } from '../../types';

export const ProductDetailModal: React.FC = () => {
  const {
    activeProductModal,
    setActiveProductModal,
    addToCart,
    toggleWishlist,
    isInWishlist,
    products,
  } = useStore();

  const [quantity, setQuantity] = useState(1);
  const [isTinOpen, setIsTinOpen] = useState(false);

  if (!activeProductModal) return null;

  const product = activeProductModal;
  const wishlisted = isInWishlist(product.id);

  // Related products
  const related = products
    .filter((p) => p.id !== product.id && p.isActive)
    .slice(0, 3);

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
        onClick={() => setActiveProductModal(null)}
      />

      {/* Main PDP Modal Container */}
      <div
        className="relative w-full max-w-5xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden z-10 my-8 transition-colors duration-500 bg-[#0C0E17] text-[#F8F3EA]"
        style={{
          background: `radial-gradient(circle at 30% 30%, ${product.visualEnvironment.secondaryColor}99 0%, #090A0F 80%)`,
        }}
      >
        {/* Dynamic Background Particle System */}
        <FragranceParticles mood={product.fragranceMood} />

        {/* Close Button */}
        <button
          onClick={() => setActiveProductModal(null)}
          className="absolute top-5 right-5 z-20 p-2 rounded-full bg-black/50 border border-white/20 text-neutral-300 hover:text-white hover:border-[#D8B66B] transition-colors"
          aria-label="Close product view"
        >
          <X className="w-5 h-5" />
        </button>

        {/* PDP Layout Grid */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 p-6 sm:p-10">
          {/* Left Column: Visual Showcase with Interactive Sliding Tin */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center py-6 sm:py-10">
            <div className="relative group">
              <PerfumeTinVisual
                product={product}
                size="lg"
                interactive={true}
                isOpen={isTinOpen}
              />
            </div>

            {/* Slider Toggle Pill */}
            <div className="mt-6 flex items-center gap-3">
              <button
                onClick={() => setIsTinOpen((prev) => !prev)}
                className="px-4 py-1.5 text-xs font-mono uppercase tracking-widest border border-[#D8B66B]/50 hover:border-[#D8B66B] bg-[#090A0F]/80 text-[#D8B66B] rounded-full transition-all flex items-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isTinOpen ? 'Close Metal Lid' : 'Slide Open Metal Lid'}</span>
              </button>
            </div>

            <p className="mt-3 text-[11px] font-mono text-neutral-400">
              * Click the tin to test sliding pocket mechanism
            </p>
          </div>

          {/* Right Column: Product Narrative & Contiguous Purchase Module */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            {/* Header info */}
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-neutral-400 uppercase tracking-widest mb-1">
                <span>{product.category} Collection · {product.weightGrams}g</span>
                <span className="text-[#D8B66B]">{product.stock > 0 ? 'In Stock' : 'Sold Out'}</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#F8F3EA]">
                {product.name}
              </h2>

              <p className="font-serif italic text-lg text-[#D8B66B] mt-0.5">
                {product.identity}
              </p>

              {/* Price Display */}
              <div className="mt-3 flex flex-wrap items-baseline gap-2.5">
                <span className="font-serif text-3xl font-bold text-white tabular-nums">
                  ₹{quantity >= 2 ? 149 * quantity : 199}
                </span>
                {quantity >= 2 ? (
                  <span className="text-xs font-mono text-emerald-400 font-semibold bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded">
                    Offer Price: ₹149 each (Saved ₹{quantity * 50}!)
                  </span>
                ) : (
                  <span className="text-xs font-mono text-[#D8B66B] font-medium">
                    (or ₹149 each on 2+ units)
                  </span>
                )}
              </div>
            </div>

            {/* Story & Description */}
            <div className="space-y-3 text-sm text-neutral-300 font-light leading-relaxed">
              <p>{product.longDescription}</p>
            </div>

            {/* Olfactory Notes Pyramid */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2.5">
              <span className="text-xs font-mono uppercase tracking-wider text-[#D8B66B] font-semibold block">
                Olfactory Composition
              </span>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <span className="text-[10px] font-mono text-neutral-400 uppercase block">Top</span>
                  <span className="text-neutral-200">{product.notes.top.join(', ')}</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-neutral-400 uppercase block">Heart</span>
                  <span className="text-neutral-200">{product.notes.heart.join(', ')}</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-neutral-400 uppercase block">Base</span>
                  <span className="text-neutral-200">{product.notes.base.join(', ')}</span>
                </div>
              </div>
            </div>

            {/* Quick 4-Step How to Use summary */}
            <div className="text-xs text-neutral-400 space-y-1 font-mono">
              <span className="text-[#D8B66B] font-semibold uppercase">Application Ritual:</span>
              <p className="font-sans text-neutral-300 font-light">
                1. Open tin · 2. Swirl fingertip over wax · 3. Apply to pulse points · 4. Enjoy lingering sillage.
              </p>
            </div>

            {/* BUY 2 OR MORE - JUST ₹149 EACH Dynamic Offer Callout */}
            <div className="p-3 rounded-xl bg-[#D8B66B]/10 border border-[#D8B66B]/25">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#D8B66B] shrink-0" />
                  <span className="text-[#F8F3EA]">
                    {quantity === 1 ? (
                      <>
                        <strong className="text-[#D8B66B]">BUY 2 OR MORE – JUST ₹149 EACH!</strong> Add 1 more to unlock <span className="text-emerald-400 font-semibold">₹149/tin</span> (Save ₹100+)
                      </>
                    ) : (
                      <>
                        <strong className="text-emerald-400">Offer Active: ₹149 Each!</strong> Total: <span className="text-white font-bold">₹{149 * quantity}</span> · You save <span className="text-emerald-400 font-bold">₹{quantity * 50}</span>
                      </>
                    )}
                  </span>
                </div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#D8B66B] font-bold shrink-0 ml-2">
                  Auto-applied
                </span>
              </div>
            </div>

            {/* Purchase Row */}
            <div className="pt-2 flex items-center gap-3">
              {/* Quantity Stepper */}
              <div className="flex items-center border border-white/20 rounded-xl bg-black/40 px-2 py-1">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-1.5 text-neutral-400 hover:text-white"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-3 text-xs font-mono font-bold tabular-nums">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  disabled={quantity >= product.stock}
                  className="p-1.5 text-neutral-400 hover:text-white disabled:opacity-40"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Single Primary Action: ADD TO CART */}
              <button
                onClick={() => {
                  addToCart(product, quantity);
                }}
                disabled={product.stock <= 0}
                className="flex-1 py-3.5 bg-[#D8B66B] hover:bg-[#c9a759] active:bg-[#b89547] text-neutral-950 text-xs font-bold uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 shadow-xl shadow-[#D8B66B]/20 disabled:opacity-50 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>
                  {product.stock <= 0
                    ? 'OUT OF STOCK'
                    : quantity >= 2
                    ? `ADD TO CART · ₹${149 * quantity}`
                    : `ADD TO CART · ₹${199 * quantity}`}
                </span>
              </button>

              {/* Wishlist */}
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`p-3.5 rounded-xl border transition-colors cursor-pointer ${
                  wishlisted
                    ? 'border-[#D8B66B] bg-[#D8B66B]/20 text-[#D8B66B]'
                    : 'border-white/20 text-neutral-400 hover:text-white'
                }`}
                aria-label="Wishlist toggle"
              >
                <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Related Fragrances Strip */}
        {related.length > 0 && (
          <div className="border-t border-white/10 p-6 sm:p-8 bg-black/40">
            <span className="text-xs font-mono uppercase tracking-widest text-[#D8B66B] block mb-4">
              Explore More S1 Fragrances
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {related.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => {
                    setActiveProductModal(rel);
                    setQuantity(1);
                    setIsTinOpen(false);
                  }}
                  className="p-3 rounded-xl border border-white/10 hover:border-[#D8B66B]/50 bg-black/30 cursor-pointer flex items-center gap-3 transition-colors group"
                >
                  <div className="w-10 h-12 flex items-center justify-center bg-black/40 rounded">
                    <PerfumeTinVisual product={rel} size="sm" interactive={false} />
                  </div>
                  <div>
                    <h5 className="font-serif text-sm font-bold text-white group-hover:text-[#D8B66B] transition-colors">
                      {rel.name}
                    </h5>
                    <span className="text-[11px] font-mono text-[#D8B66B]">
                      {rel.identity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
