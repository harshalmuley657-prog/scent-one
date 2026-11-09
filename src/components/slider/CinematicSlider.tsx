import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import { PerfumeTinVisual } from '../common/PerfumeTinVisual';
import { FragranceParticles } from '../common/FragranceParticles';
import { ChevronLeft, ChevronRight, ShoppingBag, Eye, Heart, Sparkles } from 'lucide-react';

export const CinematicSlider: React.FC = () => {
  const { products, addToCart, setActiveProductModal, toggleWishlist, isInWishlist } = useStore();
  const activeProducts = products.filter((p) => p.isActive);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentProduct = activeProducts[currentIndex] || activeProducts[0];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % activeProducts.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + activeProducts.length) % activeProducts.length);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only trigger if container is in viewport or active
      if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeProducts.length]);

  // Touch Swipe for mobile
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
  };

  if (!currentProduct) return null;

  return (
    <section
      id="campaign-slider"
      ref={containerRef}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      className="relative min-h-[85vh] py-16 px-4 sm:px-8 flex flex-col justify-center overflow-hidden transition-colors duration-1000"
      style={{
        background: `radial-gradient(ellipse at 60% 40%, ${currentProduct.visualEnvironment.secondaryColor} 0%, #090A0F 85%)`,
      }}
    >
      {/* Fragrance Environment Engine */}
      <FragranceParticles mood={currentProduct.fragranceMood} />

      {/* Atmospheric Header for Slider */}
      <div className="relative max-w-7xl w-full mx-auto mb-8 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 z-10 border-b border-white/10 pb-4">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-[#D8B66B] font-mono">
            Cinematic Fragrance Editions
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#F8F3EA] mt-1">
            Campaign Showcase · S1
          </h2>
        </div>

        {/* Campaign pagination numbers */}
        <div className="flex items-center gap-3 text-xs font-mono tracking-wider text-neutral-400">
          <span className="text-lg font-bold text-[#D8B66B] font-serif">
            0{currentIndex + 1}
          </span>
          <span>/</span>
          <span>0{activeProducts.length}</span>
        </div>
      </div>

      {/* Main Campaign Slide Container */}
      <div className="relative max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center z-10">
        {/* Left Column: Fragrance Campaign Editorial Copy */}
        <div className="lg:col-span-6 flex flex-col space-y-5 text-left order-2 lg:order-1">
          {/* Identity kicker */}
          <div className="flex items-center gap-2">
            <span
              className="text-xs font-semibold tracking-widest uppercase px-2.5 py-1 rounded"
              style={{
                backgroundColor: `${currentProduct.visualEnvironment.accentColor}25`,
                color: currentProduct.visualEnvironment.accentColor,
              }}
            >
              {currentProduct.identity}
            </span>
            <span className="text-xs text-neutral-400 font-serif italic">
              {currentProduct.category} Collection · {currentProduct.weightGrams}g
            </span>
          </div>

          {/* Perfume Name */}
          <h3 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-[#F8F3EA] tracking-tight transition-all duration-500">
            {currentProduct.name}
          </h3>

          {/* Tagline */}
          <p className="font-serif italic text-lg sm:text-xl text-[#D8B66B]">
            "{currentProduct.tagline}"
          </p>

          {/* Description */}
          <p className="font-sans text-sm sm:text-base text-neutral-300 leading-relaxed font-light">
            {currentProduct.longDescription}
          </p>

          {/* Visual Environment Mood */}
          <div className="p-4 rounded-xl border border-white/10 bg-black/40 backdrop-blur-md">
            <div className="text-[11px] font-mono uppercase tracking-wider text-[#D8B66B] mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Fragrance Environment: {currentProduct.visualEnvironment.atmosphereName}</span>
            </div>
            <div className="flex flex-wrap gap-2 text-xs text-neutral-300">
              {currentProduct.visualEnvironment.elements.map((el, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded-sm bg-white/5 border border-white/10"
                >
                  {el}
                </span>
              ))}
            </div>
          </div>

          {/* Olfactory Notes Grid */}
          <div className="grid grid-cols-3 gap-3 pt-1">
            <div className="p-3 rounded-lg border border-white/10 bg-black/30">
              <span className="text-[10px] font-mono tracking-widest text-[#D8B66B] uppercase block mb-1">
                Top Notes
              </span>
              <p className="text-xs text-neutral-300 leading-snug">
                {currentProduct.notes.top.join(' · ')}
              </p>
            </div>
            <div className="p-3 rounded-lg border border-white/10 bg-black/30">
              <span className="text-[10px] font-mono tracking-widest text-[#D8B66B] uppercase block mb-1">
                Heart Notes
              </span>
              <p className="text-xs text-neutral-300 leading-snug">
                {currentProduct.notes.heart.join(' · ')}
              </p>
            </div>
            <div className="p-3 rounded-lg border border-white/10 bg-black/30">
              <span className="text-[10px] font-mono tracking-widest text-[#D8B66B] uppercase block mb-1">
                Base Notes
              </span>
              <p className="text-xs text-neutral-300 leading-snug">
                {currentProduct.notes.base.join(' · ')}
              </p>
            </div>
          </div>

          {/* Pricing & Buying Action Row */}
          <div className="pt-3 flex flex-wrap items-center gap-4">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-serif font-bold text-[#F8F3EA] tabular-nums">
                  ₹199
                </span>
                <span className="text-xs font-mono text-emerald-400 font-semibold">
                  (or ₹149 for 2+)
                </span>
              </div>
              <span className="text-[10px] font-mono text-[#D8B66B]">
                BUY 2 OR MORE – JUST ₹149 EACH!
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => addToCart(currentProduct)}
                disabled={currentProduct.stock <= 0}
                className="px-6 py-3 bg-[#D8B66B] hover:bg-[#c9a759] text-neutral-950 text-xs font-semibold uppercase tracking-wider rounded transition-all flex items-center gap-2 shadow-lg disabled:opacity-50"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{currentProduct.stock > 0 ? 'ADD TO CART' : 'OUT OF STOCK'}</span>
              </button>

              <button
                onClick={() => setActiveProductModal(currentProduct)}
                className="px-4 py-3 border border-white/20 hover:border-white/50 text-[#F8F3EA] text-xs font-semibold uppercase tracking-wider rounded transition-colors flex items-center gap-1.5"
              >
                <Eye className="w-4 h-4" />
                <span>Explore Perfume</span>
              </button>

              <button
                onClick={() => toggleWishlist(currentProduct.id)}
                className={`p-3 border rounded transition-colors ${
                  isInWishlist(currentProduct.id)
                    ? 'border-[#D8B66B] bg-[#D8B66B]/20 text-[#D8B66B]'
                    : 'border-white/20 text-neutral-300 hover:text-white'
                }`}
                aria-label="Wishlist"
              >
                <Heart className={`w-4 h-4 ${isInWishlist(currentProduct.id) ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Large Perfume Showcase Visual */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center order-1 lg:order-2 relative py-8">
          <div className="relative group">
            <PerfumeTinVisual
              product={currentProduct}
              size="xl"
              interactive={true}
              showBadge={true}
            />
          </div>
        </div>
      </div>

      {/* Carousel Navigation Bar (Controls & Indicators) */}
      <div className="relative max-w-7xl w-full mx-auto mt-10 flex items-center justify-between z-10 pt-4 border-t border-white/10">
        {/* Slide Dots / Thumbnails */}
        <div className="flex items-center gap-2.5">
          {activeProducts.map((prod, idx) => (
            <button
              key={prod.id}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 transition-all duration-300 rounded-full ${
                idx === currentIndex
                  ? 'w-10 bg-[#D8B66B]'
                  : 'w-2 bg-neutral-600 hover:bg-neutral-400'
              }`}
              aria-label={`Go to slide ${idx + 1}: ${prod.name}`}
            />
          ))}
        </div>

        {/* Prev / Next Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrev}
            className="p-3 rounded-full border border-white/20 hover:border-[#D8B66B] hover:bg-[#D8B66B]/10 text-white transition-all cursor-pointer"
            aria-label="Previous fragrance campaign"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="p-3 rounded-full border border-white/20 hover:border-[#D8B66B] hover:bg-[#D8B66B]/10 text-white transition-all cursor-pointer"
            aria-label="Next fragrance campaign"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};
