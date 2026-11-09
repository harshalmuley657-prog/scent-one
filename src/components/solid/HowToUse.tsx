import React from 'react';

export const HowToUse: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Slide the Tin Open',
      desc: 'Use your thumb to glide the engraved metal lid open. The tactile resistance protects the wax inside.',
    },
    {
      step: '02',
      title: 'Swirl Fingertip Gently',
      desc: 'Rub your index finger or thumb in a light circular motion across the solid wax. Natural body warmth activates the fragrance oils.',
    },
    {
      step: '03',
      title: 'Apply to Pulse Points',
      desc: 'Dab onto your pulse points — wrists, neck sides, behind ears, or collarbone where skin warmth diffuses the scent.',
    },
    {
      step: '04',
      title: 'Enjoy All Day Sillage',
      desc: 'Slide the lid closed and pocket your S1 tin. Enjoy an intimate, lingering impression that journeys with you.',
    },
  ];

  return (
    <section id="how-to-use" className="py-20 px-4 sm:px-8 border-t border-neutral-800/80 dark:border-neutral-800/80 border-neutral-200 bg-neutral-900/20 dark:bg-neutral-900/20 bg-neutral-50/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#D8B66B] font-semibold">
            Simple Daily Ritual
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-neutral-900 dark:text-[#F8F3EA] mt-2">
            How to Use SCENT ONE
          </h2>
          <p className="mt-2 text-neutral-600 dark:text-neutral-400 text-sm font-light">
            Four simple steps to apply and carry your signature scent anywhere.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((st) => (
            <div
              key={st.step}
              className="p-6 rounded-2xl bg-neutral-900/40 dark:bg-neutral-900/40 bg-white border border-neutral-800 dark:border-neutral-800 border-neutral-200 relative group"
            >
              <div className="font-serif text-3xl font-bold text-[#D8B66B]/40 group-hover:text-[#D8B66B] transition-colors mb-3">
                {st.step}
              </div>
              <h3 className="font-serif text-xl font-bold text-neutral-900 dark:text-[#F8F3EA] mb-2">
                {st.title}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed font-light">
                {st.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
