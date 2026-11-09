import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Instagram, ArrowUpRight, Sparkles } from 'lucide-react';
import { PerfumeTinVisual } from '../common/PerfumeTinVisual';

export const InstagramGallery: React.FC = () => {
  const { settings, products, setActiveProductModal } = useStore();

  return (
    <section className="py-20 px-4 sm:px-8 max-w-7xl mx-auto border-t border-neutral-800/80 dark:border-neutral-800/80 border-neutral-200">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.25em] text-[#D8B66B]">
            <Instagram className="w-3.5 h-3.5" />
            <span>@scent_one_ on Instagram</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-[#F8F3EA] mt-1">
            Follow the SCENT ONE Journey
          </h2>
          <p className="mt-2 text-neutral-600 dark:text-neutral-400 text-sm font-light">
            Behind the scenes, fragrance pairings, and solid perfume life on our official Instagram feed.
          </p>
        </div>

        <a
          href={settings.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-[#D8B66B]/50 hover:border-[#D8B66B] bg-[#D8B66B]/10 hover:bg-[#D8B66B]/20 text-[#D8B66B] font-sans text-xs font-semibold uppercase tracking-wider transition-all self-start md:self-auto"
        >
          <Instagram className="w-4 h-4" />
          <span>Follow @scent_one_</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Editorial Grid of S1 Moments */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.slice(0, 4).map((prod) => (
          <div
            key={prod.id}
            onClick={() => setActiveProductModal(prod)}
            className="group relative cursor-pointer aspect-square rounded-2xl overflow-hidden border border-neutral-800 dark:border-neutral-800 border-neutral-200 bg-neutral-900/60 dark:bg-neutral-900/60 bg-neutral-50 p-4 flex flex-col items-center justify-center transition-all hover:border-[#D8B66B]/60"
          >
            {/* Tin Mini Preview */}
            <div className="transition-transform duration-500 group-hover:scale-110">
              <PerfumeTinVisual
                product={prod}
                size="sm"
                interactive={false}
              />
            </div>

            {/* Hover overlay with Instagram handle and perfume name */}
            <div className="absolute inset-0 bg-[#090A0F]/85 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4 text-center">
              <Instagram className="w-6 h-6 text-[#D8B66B] mb-2" />
              <span className="font-serif text-base font-bold text-white">
                {prod.name}
              </span>
              <span className="text-[11px] font-mono text-[#D8B66B] mt-0.5">
                {prod.identity}
              </span>
              <span className="text-[10px] text-neutral-400 mt-2 font-mono">
                Tap to view perfume
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
