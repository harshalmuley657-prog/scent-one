import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { PerfumeTinVisual } from '../common/PerfumeTinVisual';
import { FragranceParticles } from '../common/FragranceParticles';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export const FragranceStory: React.FC = () => {
  const { products, setActiveProductModal, addToCart } = useStore();
  const [selectedSlug, setSelectedSlug] = useState<string>('midnight-aura');

  const activeProduct = products.find((p) => p.slug === selectedSlug) || products[0];

  if (!activeProduct) return null;

  return (
    <section id="storytelling" className="relative py-24 px-4 sm:px-8 overflow-hidden bg-neutral-950 text-[#F8F3EA] border-t border-b border-neutral-800">
      {/* Background Dynamic Particles */}
      <FragranceParticles mood={activeProduct.fragranceMood} />

      <div className="relative max-w-7xl mx-auto z-10">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-mono uppercase tracking-[0.3em] text-[#D8B66B] font-semibold">
            The S1 Fragrance Universes
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold mt-2">
            Four Moods. One Signature.
          </h2>
          <p className="mt-3 text-neutral-400 font-sans text-sm sm:text-base font-light">
            Every SCENT ONE solid perfume is formulated to evoke a distinctive world. Discover how nature, memory, and atmosphere combine in our pocket sliding tins.
          </p>

          {/* Interactive Universe Selector Tabs */}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {products.slice(0, 4).map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedSlug(p.slug)}
                className={`px-5 py-2.5 text-xs font-semibold uppercase tracking-wider rounded-xl transition-all duration-300 flex items-center gap-2 ${
                  selectedSlug === p.slug
                    ? 'bg-[#D8B66B] text-neutral-950 shadow-lg shadow-[#D8B66B]/20 scale-105'
                    : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700'
                }`}
              >
                <span>{p.name}</span>
                <span className="text-[10px] opacity-75 font-serif italic">({p.identity})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Universe Spotlight Canvas */}
        <div
          className="rounded-3xl p-8 sm:p-12 border border-white/10 transition-colors duration-700 backdrop-blur-md grid grid-cols-1 lg:grid-cols-12 gap-10 items-center"
          style={{
            background: `linear-gradient(135deg, ${activeProduct.visualEnvironment.primaryColor}CC 0%, #090A0FCC 100%)`,
          }}
        >
          {/* Left: Universe Narrative */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-[#D8B66B]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{activeProduct.visualEnvironment.atmosphereName}</span>
            </div>

            <h3 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-[#F8F3EA]">
              {activeProduct.name}
            </h3>

            <p className="font-serif text-xl italic text-[#D8B66B]">
              {activeProduct.identity}
            </p>

            <p className="text-neutral-300 text-sm sm:text-base font-light leading-relaxed">
              {activeProduct.longDescription}
            </p>

            {/* Inspiration Points */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-mono tracking-wider uppercase text-neutral-400">
                Fragrance Inspiration:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {activeProduct.fragranceInspiration.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-black/40 border border-white/10 text-xs font-medium text-neutral-200 flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D8B66B]" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button
                onClick={() => addToCart(activeProduct)}
                disabled={activeProduct.stock <= 0}
                className="px-6 py-3 bg-[#D8B66B] hover:bg-[#c9a759] text-neutral-950 text-xs font-semibold uppercase tracking-wider rounded transition-colors flex items-center gap-2 shadow-md"
              >
                <span>Add to Bag · ₹{activeProduct.price}</span>
              </button>

              <button
                onClick={() => setActiveProductModal(activeProduct)}
                className="px-5 py-3 border border-white/20 hover:border-white text-white text-xs font-semibold uppercase tracking-wider rounded transition-colors flex items-center gap-2"
              >
                <span>Explore Sillage Notes</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right: Tactile Perfume Tin with ambient lighting */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center py-6">
            <PerfumeTinVisual
              product={activeProduct}
              size="lg"
              interactive={true}
              showBadge={true}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
