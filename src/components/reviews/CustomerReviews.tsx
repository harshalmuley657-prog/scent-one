import React from 'react';
import { DEMO_REVIEWS } from '../../data/initialProducts';
import { useStore } from '../../context/StoreContext';
import { Star, MessageSquareHeart, AlertCircle, ArrowUpRight } from 'lucide-react';

export const CustomerReviews: React.FC = () => {
  const { settings } = useStore();

  return (
    <section id="reviews" className="py-20 px-4 sm:px-8 max-w-7xl mx-auto border-t border-neutral-800/80 dark:border-neutral-800/80 border-neutral-200">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D8B66B]/10 text-[#D8B66B] text-xs font-mono tracking-wider uppercase mb-3">
          <MessageSquareHeart className="w-3.5 h-3.5" />
          <span>Community Impressions</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-[#F8F3EA]">
          Early Fragrance Impressions
        </h2>
        
        {/* Honest Demo Content Disclaimer */}
        <div className="mt-3 p-3 rounded-xl border border-amber-500/30 bg-amber-500/5 text-xs text-amber-300 font-mono flex items-center justify-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
          <span>
            Sample preview feedback. Genuine verified reviews will replace these as customer submissions are recorded.
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {DEMO_REVIEWS.map((rev) => (
          <div
            key={rev.id}
            className="p-6 rounded-2xl border border-neutral-800 dark:border-neutral-800 border-neutral-200 bg-neutral-900/40 dark:bg-neutral-900/40 bg-white flex flex-col justify-between space-y-4 hover:border-[#D8B66B]/40 transition-colors"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-1 text-[#D8B66B]">
                {Array.from({ length: rev.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>

              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 font-light leading-relaxed italic font-serif">
                "{rev.reviewText}"
              </p>
            </div>

            <div className="pt-3 border-t border-neutral-800/60 dark:border-neutral-800/60 border-neutral-100 flex items-baseline justify-between text-xs font-mono">
              <div>
                <span className="font-bold text-neutral-900 dark:text-white block font-sans">
                  {rev.customerName}
                </span>
                <span className="text-[11px] text-neutral-400">
                  {rev.city} · {rev.fragrancePurchased}
                </span>
              </div>
              <span className="text-[10px] uppercase text-[#D8B66B] border border-[#D8B66B]/30 px-1.5 py-0.5 rounded">
                Demo
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Invitation to leave feedback */}
      <div className="mt-12 text-center">
        <a
          href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent('Hi Yash! I would like to share my feedback on SCENT ONE solid perfume:')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-xs font-mono text-[#D8B66B] hover:underline"
        >
          <span>Have you tried SCENT ONE? Send us your review on WhatsApp</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </section>
  );
};
