import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: 'What is solid perfume and how is it formulated?',
    answer:
      'Solid perfume is a concentrated fragrance blend infused into a solid wax base rather than alcohol and water. It is packaged in a pocket-sized sliding metal tin, making it 100% leakproof, flight-ready, and discreet for touch-ups anytime.',
  },
  {
    question: 'How long does SCENT ONE solid perfume last after application?',
    answer:
      'Because solid perfume contains no evaporating alcohol, the natural waxes slowly warm with your skin temperature to provide an intimate sillage typically lingering for 4 to 6 hours. Longevity varies naturally based on personal skin warmth, climate, and application amount.',
  },
  {
    question: 'Will the perfume melt in my pocket or in hot summer conditions?',
    answer:
      'Our solid perfumes are formulated with high-melting-point waxes designed to remain solid at normal body temperatures and pocket carry. We recommend keeping the tin away from direct extreme heat (such as inside a car parked under direct sunlight).',
  },
  {
    question: 'How does ordering on WhatsApp work?',
    answer:
      'Simply choose your fragrances, add them to your shopping bag, and click "Submit Order on WhatsApp" at checkout. The system will pre-fill an exact order summary with your reference code and delivery address to our official WhatsApp number (+91 90115 58615). You simply hit Send in WhatsApp, and Yash Jain and the SCENT ONE team will review and confirm your order.',
  },
  {
    question: 'What is the official pricing and volume offer?',
    answer:
      'Every SCENT ONE solid perfume is priced regularly at ₹199 (15g tin). When you purchase 2 or more perfumes, our automatic volume offer charges just ₹149 per perfume across your entire order (e.g. 2 tins = ₹298, 3 tins = ₹447, 4 tins = ₹596).',
  },
  {
    question: 'Are there any alcohol or synthetic parabens in the wax?',
    answer:
      'SCENT ONE solid perfumes are formulated on a solid wax and fragrance oil base without alcohol spray carriers, eliminating the harsh chemical alcohol blast common to conventional perfumes.',
  },
];

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <section id="faqs" className="py-24 px-4 sm:px-8 max-w-4xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D8B66B]/10 text-[#D8B66B] text-xs font-mono tracking-wider uppercase mb-3">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Frequently Asked Questions</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-[#F8F3EA]">
          Everything You Need to Know
        </h2>
        <p className="mt-2 text-neutral-600 dark:text-neutral-400 text-sm font-light">
          Clear answers about our solid perfumes, packaging, and ordering process.
        </p>
      </div>

      <div className="space-y-3">
        {FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="rounded-2xl border border-neutral-800/80 dark:border-neutral-800/80 border-neutral-200 bg-neutral-900/40 dark:bg-neutral-900/40 bg-white overflow-hidden transition-colors"
            >
              <button
                onClick={() => toggle(idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-serif text-lg font-bold text-neutral-900 dark:text-[#F8F3EA] hover:text-[#D8B66B] transition-colors"
                aria-expanded={isOpen}
              >
                <span>{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-[#D8B66B] shrink-0 transition-transform duration-300 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-neutral-600 dark:text-neutral-300 text-sm leading-relaxed font-light border-t border-neutral-800/40 dark:border-neutral-800/40 border-neutral-100">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
