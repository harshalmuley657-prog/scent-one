import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { PerfumeTinVisual } from '../common/PerfumeTinVisual';
import { FragranceParticles } from '../common/FragranceParticles';
import { DiwaliMandalaBackdrop, DiwaliJaaliOverlay, DiwaliDiyaIcon } from '../common/DiwaliMotifs';
import { Sparkles, ArrowRight, Compass } from 'lucide-react';

export const Hero: React.FC = () => {
  const { products, setActiveProductModal } = useStore();
  // Select featured product (default Midnight Aura or first)
  const heroProduct = products.find((p) => p.isFeatured && p.isActive) || products[0];
  const [isTinOpen, setIsTinOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#090A0F] via-[#10121A] to-[#090A0F] dark:from-[#090A0F] dark:via-[#10121A] dark:to-[#090A0F] text-[#F8F3EA] px-4 sm:px-8 py-16">
      {/* Subtle Royal Diwali Jaali Latticework Texture */}
      <DiwaliJaaliOverlay />

      {/* Background Fragrance Particles & Atmospheric Lights */}
      {heroProduct && <FragranceParticles mood={heroProduct.fragranceMood} />}

      {/* Cinematic Studio & Warm Diwali Diya Spotlight Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-b from-[#D8B66B]/18 via-amber-500/8 to-transparent blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[900px] h-[300px] bg-[#D8B66B]/10 blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center z-10">
        {/* Left Column: Brand Typography & Call to Actions */}
        <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
          {/* Brand Mark and Tagline with Festive Diya Accent */}
          <div className="flex items-center gap-3 text-xs tracking-[0.3em] uppercase text-[#D8B66B] font-medium">
            <span className="w-8 h-[1px] bg-[#D8B66B]/60" />
            <DiwaliDiyaIcon className="w-4 h-4" />
            <span>SCENT ONE · FESTIVE LUXURY EDITION</span>
            <span className="w-8 h-[1px] bg-[#D8B66B]/60 lg:hidden" />
          </div>

          {/* Main Headline */}
          <h1 className="font-serif text-4xl sm:text-6xl xl:text-7xl font-bold tracking-tight text-[#F8F3EA] leading-[1.08] [text-wrap:balance]">
            YOUR SCENT. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D8B66B] via-[#FFF1CF] to-[#D8B66B]">
              YOUR SIGNATURE.
            </span>
          </h1>

          {/* Supporting Brand Copy */}
          <p className="max-w-xl font-sans text-base sm:text-lg text-neutral-300 dark:text-neutral-300 font-light leading-relaxed">
            Small in size. Unforgettable in impression. Celebrate the season of light with pocket-sized solid perfumes crafted for every radiant moment.
          </p>

          {/* Festive Offer Highlight */}
          <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#D8B66B]/20 via-amber-500/10 to-[#D8B66B]/20 border border-[#D8B66B]/40 text-xs font-mono text-[#D8B66B] shadow-lg shadow-[#D8B66B]/5">
            <DiwaliDiyaIcon className="w-4 h-4 shrink-0" />
            <span>BUY 2 OR MORE – JUST ₹149 EACH! (Regular ₹199)</span>
          </div>

          {/* Luxury Meta Trust Row */}
          <div className="pt-1 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-mono tracking-wider text-neutral-400">
            <span>WAX BASE FORMULA</span>
            <span className="text-[#D8B66B]">·</span>
            <span>LEAKPROOF SLIDING TIN</span>
            <span className="text-[#D8B66B]">·</span>
            <span>FESTIVE GIFT READY</span>
          </div>

          {/* Action CTAs */}
          <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-3 w-full sm:w-auto">
            <button
              onClick={() => scrollToSection('collection')}
              className="w-full sm:w-auto px-8 py-3.5 bg-[#D8B66B] hover:bg-[#c9a759] active:bg-[#b89547] text-neutral-950 text-xs font-bold uppercase tracking-widest transition-all duration-300 rounded-xl shadow-lg shadow-[#D8B66B]/25 flex items-center justify-center gap-2 group whitespace-nowrap cursor-pointer"
            >
              <span>Shop Now</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            <button
              onClick={() => scrollToSection('campaign-slider')}
              className="w-full sm:w-auto px-7 py-3.5 border border-white/25 hover:border-[#D8B66B] hover:bg-white/5 text-[#F8F3EA] text-xs font-semibold uppercase tracking-widest transition-all duration-300 rounded-xl flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
            >
              <span>Explore Collection</span>
            </button>

            <button
              onClick={() => scrollToSection('fragrance-quiz')}
              className="w-full sm:w-auto px-6 py-3.5 border border-[#D8B66B]/40 hover:border-[#D8B66B] hover:bg-[#D8B66B]/10 text-[#D8B66B] text-xs font-semibold uppercase tracking-widest transition-all duration-300 rounded-xl flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
            >
              <Compass className="w-4 h-4" />
              <span>Fragrance Finder</span>
            </button>
          </div>

          {/* Subtle Quote */}
          <div className="pt-4 text-xs text-neutral-400 italic font-serif">
            "Small Tin. Big Impressions." — Yash Jain, Founder
          </div>
        </div>

        {/* Right Column: Hero Tactile Solid Perfume Tin Visual with Royal Mandala Halo */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
          {/* Rotating Golden Diwali Mandala Ring Behind Pedestal */}
          <DiwaliMandalaBackdrop className="absolute w-[340px] h-[340px] sm:w-[420px] sm:h-[420px] opacity-85" />
          {/* Warm Diya Golden Glow Behind Tin */}
          <div className="absolute w-52 h-52 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />

          {/* Subtle pedestal illumination */}
          <div className="relative flex flex-col items-center z-10">
            {heroProduct && (
              <PerfumeTinVisual
                product={heroProduct}
                size="lg"
                interactive={true}
                isOpen={isTinOpen}
              />
            )}

            {/* Quick Interactive Slide Toggle Control */}
            <div className="mt-4 flex items-center gap-3">
              <button
                onClick={() => setIsTinOpen((prev) => !prev)}
                className="px-4 py-1.5 text-xs font-sans tracking-wider uppercase border border-[#D8B66B]/30 hover:border-[#D8B66B] bg-[#090A0F]/80 text-[#D8B66B] rounded transition-all flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#D8B66B]" />
                <span>{isTinOpen ? 'Close Lid' : 'Slide Open Tin'}</span>
              </button>

              {heroProduct && (
                <button
                  onClick={() => setActiveProductModal(heroProduct)}
                  className="px-4 py-1.5 text-xs font-sans tracking-wider uppercase bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 rounded transition-colors cursor-pointer"
                >
                  View Details
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Elegant Scroll Down Prompt */}
      <button
        onClick={() => scrollToSection('campaign-slider')}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-neutral-400 hover:text-[#D8B66B] transition-colors cursor-pointer group"
        aria-label="Scroll down to perfume campaigns"
      >
        <span className="text-[10px] uppercase font-sans tracking-[0.25em] font-medium">Scroll to Discover</span>
        <div className="w-4 h-7 rounded-full border border-neutral-600 group-hover:border-[#D8B66B] flex items-start justify-center p-1 transition-colors">
          <div className="w-1 h-2 bg-[#D8B66B] rounded-full animate-bounce" />
        </div>
      </button>
    </section>
  );
};
