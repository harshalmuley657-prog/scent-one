import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from './ProductCard';
import { DiwaliDivider, DiwaliDiyaIcon } from '../common/DiwaliMotifs';
import { Search, SlidersHorizontal, Sparkles } from 'lucide-react';
import { ProductCategory } from '../../types';

export const ProductGrid: React.FC = () => {
  const { products, settings } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');

  const categories: ProductCategory[] = ['All', 'Men', 'Women', 'Unisex'];

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => p.isActive)
      .filter((p) => {
        if (selectedCategory === 'All') return true;
        return p.category === selectedCategory;
      })
      .filter((p) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.identity.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.notes.top.some((n) => n.toLowerCase().includes(q)) ||
          p.notes.heart.some((n) => n.toLowerCase().includes(q)) ||
          p.notes.base.some((n) => n.toLowerCase().includes(q))
        );
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        // featured first
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      });
  }, [products, selectedCategory, searchQuery, sortBy]);

  return (
    <section id="collection" className="relative py-20 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Ornamental Diwali Section Divider */}
      <DiwaliDivider className="mb-8" />

      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-neutral-800/80 dark:border-neutral-800/80 border-neutral-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.25em] text-[#D8B66B]">
            <DiwaliDiyaIcon className="w-4 h-4" />
            <span>Curated Solid Fragrance Line</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-neutral-900 dark:text-[#F8F3EA] mt-2">
            Discover Our Collection
          </h2>
          <p className="font-sans text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-xl mt-2 font-light">
            Engineered in compact pocket sliding tins with pure wax base and concentrated fragrance oils.
          </p>
        </div>

        {/* Promotional Offer Banner with Diwali Jaali Texture */}
        <div className="relative overflow-hidden p-3.5 rounded-xl border border-[#D8B66B]/35 bg-[#D8B66B]/10 text-xs font-mono max-w-md flex items-center justify-between gap-3">
          <div className="absolute inset-0 diwali-jaali-pattern opacity-10 pointer-events-none" aria-hidden="true" />
          <div className="relative z-10 flex items-center gap-2.5">
            <DiwaliDiyaIcon className="w-5 h-5 shrink-0" />
            <div>
              <span className="font-bold text-[#D8B66B] block">FESTIVE VOLUME OFFER:</span>
              <span className="text-white">BUY 2 OR MORE – JUST ₹149 EACH! (Regular ₹199)</span>
            </div>
          </div>
          <span className="relative z-10 text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-1 rounded shrink-0">Auto-Applied</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="mt-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-neutral-900/50 dark:bg-neutral-900/50 bg-neutral-100 border border-neutral-800 dark:border-neutral-800 border-neutral-200 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                selectedCategory === cat
                  ? 'bg-[#D8B66B] text-neutral-950 shadow-sm'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              {cat} {cat === 'All' ? `(${products.filter((p) => p.isActive).length})` : ''}
            </button>
          ))}
        </div>

        {/* Search & Sort Controls */}
        <div className="flex items-center gap-3">
          {/* Live Search Input */}
          <div className="relative flex-grow sm:w-64">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search scent, notes..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-neutral-800 dark:border-neutral-800 border-neutral-300 bg-neutral-900/40 dark:bg-neutral-900/40 bg-white text-neutral-900 dark:text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#D8B66B]"
            />
          </div>

          {/* Sort Selector */}
          <div className="relative shrink-0">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="appearance-none pl-3 pr-8 py-2 text-xs rounded-xl border border-neutral-800 dark:border-neutral-800 border-neutral-300 bg-neutral-900/40 dark:bg-neutral-900/40 bg-white text-neutral-900 dark:text-white focus:outline-none focus:border-[#D8B66B] cursor-pointer"
            >
              <option value="featured">Sort: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
            <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Product Grid Display */}
      {filteredProducts.length > 0 ? (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="mt-16 p-12 text-center rounded-2xl border border-neutral-800 dark:border-neutral-800 border-neutral-200">
          <p className="font-serif text-xl text-neutral-400">No fragrances match your search.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
            className="mt-4 px-4 py-2 text-xs font-semibold text-[#D8B66B] border border-[#D8B66B]/40 rounded hover:bg-[#D8B66B]/10 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}
    </section>
  );
};
