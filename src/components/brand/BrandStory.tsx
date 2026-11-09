import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Quote } from 'lucide-react';

export const BrandStory: React.FC = () => {
  const { settings } = useStore();

  return (
    <section id="brand-story" className="py-24 px-4 sm:px-8 max-w-5xl mx-auto text-center">
      <div className="relative p-8 sm:p-14 rounded-3xl border border-[#D8B66B]/30 bg-gradient-to-b from-neutral-900/80 to-[#090A0F] dark:from-neutral-900/80 dark:to-[#090A0F] bg-white shadow-2xl overflow-hidden">
        {/* Subtle gold emblem in backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-serif text-[180px] font-bold text-[#D8B66B]/5 select-none pointer-events-none">
          S1
        </div>

        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <div className="w-12 h-12 rounded-full bg-[#D8B66B]/15 text-[#D8B66B] flex items-center justify-center mx-auto mb-4">
            <Quote className="w-6 h-6" />
          </div>

          <span className="text-xs font-mono uppercase tracking-[0.3em] text-[#D8B66B] font-semibold">
            The Philosophy of SCENT ONE
          </span>

          <blockquote className="font-serif text-2xl sm:text-3xl lg:text-4xl italic text-neutral-900 dark:text-[#F8F3EA] leading-relaxed [text-wrap:balance]">
            "{settings.brandStory}"
          </blockquote>

          <div className="pt-4 flex flex-col items-center">
            <div className="h-[1px] w-16 bg-[#D8B66B]/60 mb-4" />
            <h4 className="font-serif text-lg font-bold text-neutral-900 dark:text-[#F8F3EA]">
              {settings.ownerName}
            </h4>
            <span className="text-xs font-mono tracking-wider text-[#D8B66B] uppercase mt-0.5">
              {settings.ownerRole}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
