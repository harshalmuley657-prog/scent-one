import React from 'react';
import { Shield, Plane, Pocket, Sparkles, Feather, Clock } from 'lucide-react';

export const WhySolidPerfume: React.FC = () => {
  const benefits = [
    {
      icon: Pocket,
      title: 'Pocket Sized Architecture',
      description: 'Engineered into a tactile sliding tin that slips effortlessly into pocket, clutch, or travel pouch.',
    },
    {
      icon: Plane,
      title: '100% Travel & Flight Friendly',
      description: 'Solid wax formulation means zero liquid restrictions, no airport security delays, and zero leakage.',
    },
    {
      icon: Shield,
      title: 'No Fragile Glass to Break',
      description: 'Crafted with a durable metal casing that withstands drops, daily commutes, and active journeys.',
    },
    {
      icon: Feather,
      title: 'Alcohol-Free Wax Base',
      description: 'Pure wax and concentrated fragrance oils that melt smoothly without the harsh initial sting of alcohol spray.',
    },
    {
      icon: Clock,
      title: 'Intimate, Lasting Sillage',
      description: 'Warms with your natural body temperature, creating an alluring personal scent bubble rather than an overwhelming cloud.',
    },
    {
      icon: Sparkles,
      title: 'Discreet Touch-Ups Anywhere',
      description: 'Reapply effortlessly on the subway, before meetings, or mid-flight without spraying bystanders.',
    },
  ];

  return (
    <section id="why-solid" className="py-24 px-4 sm:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#D8B66B] font-semibold">
          The Solid Perfume Advantage
        </span>
        <h2 className="font-serif text-3xl sm:text-5xl font-bold text-neutral-900 dark:text-[#F8F3EA] mt-2">
          Why Choose Solid Perfume?
        </h2>
        <p className="mt-3 text-neutral-600 dark:text-neutral-400 font-sans text-sm sm:text-base font-light">
          Traditional alcohol colognes are 80% liquid filler in fragile glass. SCENT ONE condenses pure olfactory craft into pocket portability.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {benefits.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="p-8 rounded-2xl border border-neutral-800/80 dark:border-neutral-800/80 border-neutral-200 bg-neutral-900/40 dark:bg-neutral-900/40 bg-white hover:border-[#D8B66B]/50 transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-xl bg-[#D8B66B]/15 text-[#D8B66B] flex items-center justify-center mb-5">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl font-bold text-neutral-900 dark:text-[#F8F3EA] mb-2">
                {item.title}
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed font-light">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};
