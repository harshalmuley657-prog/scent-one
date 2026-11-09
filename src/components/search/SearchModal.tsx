import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { Search, X, ArrowRight, Eye, ShoppingBag } from 'lucide-react';
import { PerfumeTinVisual } from '../common/PerfumeTinVisual';

export const SearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, products, setActiveProductModal, addToCart } = useStore();
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (!query.trim()) return products.filter((p) => p.isActive);
    const q = query.toLowerCase();
    return products
      .filter((p) => p.isActive)
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.identity.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.notes.top.some((n) => n.toLowerCase().includes(q)) ||
          p.notes.heart.some((n) => n.toLowerCase().includes(q)) ||
          p.notes.base.some((n) => n.toLowerCase().includes(q))
      );
  }, [products, query]);

  if (!isSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md"
        onClick={() => setIsSearchOpen(false)}
      />

      <div className="relative w-full max-w-2xl bg-[#0F111A] text-[#F8F3EA] rounded-3xl border border-neutral-800 shadow-2xl p-6 z-10 animate-[scaleUp_0.2s_ease-out]">
        {/* Search Input Bar */}
        <div className="relative flex items-center border-b border-neutral-800 pb-4">
          <Search className="w-5 h-5 text-[#D8B66B] mr-3 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by scent name, mood, lavender, woody, ocean..."
            className="w-full bg-transparent text-base sm:text-lg text-white placeholder:text-neutral-500 focus:outline-none font-sans"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-neutral-400 hover:text-white mr-2"
              aria-label="Clear query"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white transition-colors"
            aria-label="Close search"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Popular searches suggestions */}
        <div className="pt-3 flex flex-wrap gap-2 text-xs font-mono text-neutral-400">
          <span className="text-neutral-500">Try:</span>
          {['Lavender', 'Citrus', 'Woody', 'Rose', 'The Ocean Breeze', 'Chocolate'].map((term) => (
            <button
              key={term}
              onClick={() => setQuery(term)}
              className="px-2 py-0.5 rounded bg-neutral-900 hover:bg-[#D8B66B]/20 hover:text-[#D8B66B] transition-colors"
            >
              {term}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="mt-5 max-h-96 overflow-y-auto space-y-3 pr-1">
          {results.length > 0 ? (
            results.map((prod) => (
              <div
                key={prod.id}
                onClick={() => {
                  setActiveProductModal(prod);
                  setIsSearchOpen(false);
                }}
                className="p-3.5 rounded-xl border border-neutral-800 hover:border-[#D8B66B]/50 bg-neutral-900/40 hover:bg-neutral-900/80 cursor-pointer flex items-center justify-between gap-4 transition-all group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-14 bg-black/40 rounded flex items-center justify-center shrink-0">
                    <PerfumeTinVisual product={prod} size="sm" interactive={false} />
                  </div>
                  <div>
                    <h4 className="font-serif text-base font-bold text-white group-hover:text-[#D8B66B] transition-colors">
                      {prod.name}
                    </h4>
                    <span className="text-xs font-mono text-[#D8B66B]">
                      {prod.identity}
                    </span>
                    <span className="text-xs text-neutral-400 block font-light">
                      {prod.category} · {prod.weightGrams}g
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-serif font-bold text-white tabular-nums">
                    ₹{prod.price}
                  </span>
                  <div className="p-2 rounded-lg bg-[#D8B66B]/10 text-[#D8B66B] group-hover:bg-[#D8B66B] group-hover:text-black transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-neutral-400 font-serif text-lg">
              No fragrances found matching "{query}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
