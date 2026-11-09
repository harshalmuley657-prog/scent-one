import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { PerfumeTinVisual } from '../common/PerfumeTinVisual';
import { Product } from '../../types';
import { Sparkles, ArrowRight, RotateCcw, ShoppingBag, Eye } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: {
    label: string;
    description: string;
    targetMood: 'midnight' | 'ocean' | 'sky' | 'romantic';
  }[];
}

const QUIZ_QUESTIONS: Question[] = [
  {
    id: 1,
    question: 'What kind of fragrance mood do you naturally gravitate towards?',
    options: [
      { label: 'Deep, Cozy & Rich', description: 'Woody warmth, serene lavender, decadent evening ambiance', targetMood: 'midnight' },
      { label: 'Crisp, Marine & Energizing', description: 'Sunlit sea salt, bright citrus zest, ocean breezes', targetMood: 'ocean' },
      { label: 'Fresh, Free & Adventurous', description: 'High-altitude mountain air, sunset gold, open wanderlust', targetMood: 'sky' },
      { label: 'Sensual, Floral & Romantic', description: 'Soft velvet rose petals, champagne glow, warm heart', targetMood: 'romantic' },
    ],
  },
  {
    id: 2,
    question: 'When do you envision wearing your signature solid perfume?',
    options: [
      { label: 'Evening Dates & Quiet Nights', description: 'Intimate conversations and night-time confidence', targetMood: 'midnight' },
      { label: 'Morning Commute & Active Days', description: 'A refreshing post-gym or daytime surge of clarity', targetMood: 'ocean' },
      { label: 'Travel, Weekend Escapes & Flights', description: 'On-the-go touchups through changing climates', targetMood: 'sky' },
      { label: 'Romantic Evenings & Celebrations', description: 'Special moments with unforgettable sillage', targetMood: 'romantic' },
    ],
  },
  {
    id: 3,
    question: 'Which visual atmosphere feels most like home to you?',
    options: [
      { label: 'Midnight Blue & Violet Night Sky', description: 'Velvet darkness punctuated by soft moonlight', targetMood: 'midnight' },
      { label: 'Turquoise Waters & Coastal Sun', description: 'Clear ocean horizons, sea spray, and citrus groves', targetMood: 'ocean' },
      { label: 'Golden Hour Clouds at 30,000 Feet', description: 'Infinite horizon glowing in twilight lavender and gold', targetMood: 'sky' },
      { label: 'Velvet Burgundy & Rose Petals', description: 'Warm candlelight, champagne glasses, and delicate flowers', targetMood: 'romantic' },
    ],
  },
];

export const FragranceQuiz: React.FC = () => {
  const { products, addToCart, setActiveProductModal } = useStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [recommendedProduct, setRecommendedProduct] = useState<Product | null>(null);

  const handleSelectOption = (mood: 'midnight' | 'ocean' | 'sky' | 'romantic') => {
    const updated = [...selectedMoods, mood];
    setSelectedMoods(updated);

    if (currentStep < QUIZ_QUESTIONS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Calculate winner
      const counts: Record<string, number> = {};
      updated.forEach((m) => {
        counts[m] = (counts[m] || 0) + 1;
      });
      const topMood = Object.keys(counts).reduce((a, b) => (counts[a] > counts[b] ? a : b));

      const match = products.find((p) => p.fragranceMood === topMood) || products[0];
      setRecommendedProduct(match);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setSelectedMoods([]);
    setRecommendedProduct(null);
  };

  return (
    <section id="fragrance-quiz" className="py-24 px-4 sm:px-8 max-w-5xl mx-auto">
      <div className="rounded-3xl border border-neutral-800 dark:border-neutral-800 border-neutral-200 bg-neutral-900/60 dark:bg-neutral-900/60 bg-white p-8 sm:p-14 shadow-2xl relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D8B66B]/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D8B66B]/10 text-[#D8B66B] text-xs font-mono tracking-wider uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Fragrance Finder</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-[#F8F3EA]">
            Discover Your Perfect Solid Scent
          </h2>
          <p className="mt-2 text-neutral-600 dark:text-neutral-400 text-xs sm:text-sm font-light">
            Answer 3 simple sensory questions to match your daily lifestyle and mood with the right SCENT ONE edition.
          </p>
        </div>

        {/* Quiz Body or Recommendation */}
        {!recommendedProduct ? (
          <div>
            {/* Step indicator */}
            <div className="flex items-center justify-between text-xs font-mono text-neutral-500 mb-6 border-b border-neutral-800 dark:border-neutral-800 border-neutral-200 pb-3">
              <span>Question {currentStep + 1} of {QUIZ_QUESTIONS.length}</span>
              <div className="flex gap-1.5">
                {QUIZ_QUESTIONS.map((_, i) => (
                  <span
                    key={i}
                    className={`w-6 h-1.5 rounded-full transition-colors ${
                      i <= currentStep ? 'bg-[#D8B66B]' : 'bg-neutral-800'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Current Question */}
            <h3 className="font-serif text-xl sm:text-2xl font-semibold text-neutral-900 dark:text-[#F8F3EA] mb-6 text-center">
              {QUIZ_QUESTIONS[currentStep].question}
            </h3>

            {/* Option Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {QUIZ_QUESTIONS[currentStep].options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(opt.targetMood)}
                  className="p-5 text-left rounded-xl border border-neutral-800 dark:border-neutral-800 border-neutral-200 bg-neutral-900/40 dark:bg-neutral-900/40 bg-neutral-50 hover:border-[#D8B66B] hover:bg-[#D8B66B]/5 transition-all duration-200 group flex flex-col justify-between"
                >
                  <div>
                    <h4 className="font-serif text-lg font-bold text-neutral-900 dark:text-[#F8F3EA] group-hover:text-[#D8B66B] transition-colors">
                      {opt.label}
                    </h4>
                    <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-light">
                      {opt.description}
                    </p>
                  </div>
                  <div className="mt-4 flex items-center gap-1 text-[11px] font-mono text-[#D8B66B] opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Select this preference</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </button>
              ))}
            </div>

            {/* Skip Quiz Link */}
            <div className="mt-8 text-center">
              <a
                href="#collection"
                className="text-xs text-neutral-500 hover:text-[#D8B66B] transition-colors underline underline-offset-4"
              >
                Or skip and browse all solid perfumes
              </a>
            </div>
          </div>
        ) : (
          /* Recommended Result */
          <div className="text-center py-4 animate-[fadeIn_0.3s_ease-out]">
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#D8B66B] font-semibold">
              Your S1 Fragrance Match
            </span>
            <h3 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-[#F8F3EA] mt-1">
              {recommendedProduct.name}
            </h3>
            <p className="font-serif italic text-base text-[#D8B66B] mt-0.5">
              {recommendedProduct.identity}
            </p>

            <div className="py-6 flex justify-center">
              <PerfumeTinVisual
                product={recommendedProduct}
                size="md"
                interactive={true}
              />
            </div>

            <p className="max-w-xl mx-auto text-sm text-neutral-600 dark:text-neutral-400 font-light leading-relaxed">
              {recommendedProduct.shortDescription}
            </p>

            <div className="mt-2 text-xs font-mono text-neutral-400">
              Notes: {recommendedProduct.notes.top.join(' · ')} & {recommendedProduct.notes.heart[0]}
            </div>

            <div className="mt-6 flex flex-wrap justify-center items-center gap-3">
              <button
                onClick={() => addToCart(recommendedProduct)}
                className="px-6 py-3 bg-[#D8B66B] hover:bg-[#c9a759] text-neutral-950 text-xs font-semibold uppercase tracking-wider rounded transition-colors flex items-center gap-2 shadow-md"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>ADD TO CART · ₹{recommendedProduct.price}</span>
              </button>

              <button
                onClick={() => setActiveProductModal(recommendedProduct)}
                className="px-5 py-3 border border-neutral-700 dark:border-neutral-700 border-neutral-300 text-neutral-900 dark:text-[#F8F3EA] text-xs font-semibold uppercase tracking-wider rounded transition-colors flex items-center gap-1.5"
              >
                <Eye className="w-4 h-4" />
                <span>Full Details</span>
              </button>

              <button
                onClick={handleReset}
                className="px-4 py-3 text-neutral-400 hover:text-white text-xs font-mono flex items-center gap-1 transition-colors"
                title="Retake Quiz"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retake</span>
              </button>
            </div>

            <p className="mt-6 text-[11px] text-neutral-500 font-mono">
              Note: Recommendation is mood and preference based, not scientifically personalized.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
