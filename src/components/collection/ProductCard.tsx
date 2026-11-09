import React from 'react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';
import { PerfumeTinVisual } from '../common/PerfumeTinVisual';
import { DiwaliCornerFiligree } from '../common/DiwaliMotifs';
import { Heart, ShoppingBag, Eye, Sparkles } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, toggleWishlist, isInWishlist, setActiveProductModal } = useStore();
  const wishlisted = isInWishlist(product.id);
  const isOutOfStock = product.stock <= 0;

  return (
    <div className="group relative flex flex-col rounded-2xl bg-neutral-900/60 dark:bg-neutral-900/60 bg-white border border-neutral-800 dark:border-neutral-800 border-neutral-200 p-5 transition-all duration-300 hover:border-[#D8B66B]/60 hover:shadow-xl hover:shadow-[#D8B66B]/10 overflow-hidden">
      {/* Subtle Festive Gold Glow at Top */}
      <div className="absolute inset-x-0 top-0 h-24 diwali-festive-glow pointer-events-none" aria-hidden="true" />

      {/* Top Meta Row (Zero-pill discipline: quiet unboxed text with separators) */}
      <div className="relative z-10 flex items-center justify-between text-xs text-neutral-400 font-mono tracking-wider mb-2">
        <div className="flex items-center gap-1.5">
          <span>{product.category}</span>
          <span aria-hidden="true">·</span>
          <span>{product.weightGrams}g Tin</span>
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`p-1.5 rounded-full transition-colors cursor-pointer ${
            wishlisted
              ? 'text-[#D8B66B] bg-[#D8B66B]/15'
              : 'text-neutral-400 hover:text-white dark:hover:text-white hover:bg-neutral-800'
          }`}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Visual Center: Solid Perfume Tin Display with Diwali Jaali & Corner Filigree */}
      <div
        onClick={() => setActiveProductModal(product)}
        className="cursor-pointer relative py-6 flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-b from-neutral-950/40 to-neutral-950/80 dark:from-neutral-950/60 dark:to-neutral-950/90 bg-neutral-50 border border-[#D8B66B]/15 group-hover:border-[#D8B66B]/35 transition-colors"
      >
        {/* Subtle Diwali Jaali Lattice Pattern */}
        <div className="absolute inset-0 diwali-jaali-pattern opacity-[0.07] pointer-events-none" aria-hidden="true" />
        {/* Corner Filigree Accents */}
        <DiwaliCornerFiligree position="top-left" />
        <DiwaliCornerFiligree position="top-right" />
        <DiwaliCornerFiligree position="bottom-left" />
        <DiwaliCornerFiligree position="bottom-right" />

        <PerfumeTinVisual
          product={product}
          size="md"
          interactive={false}
          className="relative z-10 transition-transform duration-500 group-hover:scale-105"
        />

        {/* Hover Quick Action Overlay */}
        <div className="absolute inset-0 z-20 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2.5 backdrop-blur-[2px]">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveProductModal(product);
            }}
            className="px-3.5 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-neutral-900/90 border border-white/20 hover:border-[#D8B66B] rounded transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-[#D8B66B]" />
            <span>Details</span>
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="mt-4 flex flex-col flex-grow">
        <div className="flex items-baseline justify-between gap-2">
          <h4
            onClick={() => setActiveProductModal(product)}
            className="font-serif text-xl font-bold text-neutral-900 dark:text-[#F8F3EA] group-hover:text-[#D8B66B] transition-colors cursor-pointer"
          >
            {product.name}
          </h4>
          <span className="font-sans text-xs font-medium text-[#D8B66B] italic font-serif">
            {product.identity}
          </span>
        </div>

        <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed font-light">
          {product.shortDescription}
        </p>

        {/* Fragrance Notes Snippet & Available Stock */}
        <div className="mt-3 pt-2 border-t border-neutral-800/60 dark:border-neutral-800/60 border-neutral-100 flex items-center justify-between text-[11px] font-mono">
          <span className="text-neutral-400 truncate max-w-[150px]">
            {product.notes.top[0]}, {product.notes.heart[0]}
          </span>
          <span className={isOutOfStock ? 'text-rose-400 font-semibold' : 'text-emerald-400'}>
            {isOutOfStock ? 'Sold Out' : `${product.stock} in stock`}
          </span>
        </div>

        {/* Price & Actions Row */}
        <div className="mt-4 pt-3 border-t border-neutral-800/80 dark:border-neutral-800/80 border-neutral-200">
          <div className="flex items-baseline justify-between mb-2">
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-xl font-bold text-neutral-900 dark:text-[#F8F3EA] tabular-nums">
                ₹199
              </span>
              <span className="text-xs font-mono text-emerald-400 font-medium">
                (or ₹149 for 2+)
              </span>
            </div>
            <span className="text-[10px] text-neutral-400 font-mono">
              15g Solid Tin
            </span>
          </div>

          {/* Buy 2+ Offer Promotional Badge */}
          <div className="mb-2.5 flex items-center justify-between text-[10px] font-mono bg-[#D8B66B]/10 border border-[#D8B66B]/25 px-2.5 py-1.5 rounded-lg text-[#D8B66B]">
            <span className="flex items-center gap-1.5 font-medium truncate">
              <Sparkles className="w-3 h-3 text-[#D8B66B] shrink-0" />
              <span className="truncate">BUY 2 OR MORE – JUST ₹149 EACH!</span>
            </span>
            <span className="text-[9px] uppercase tracking-wider text-emerald-400 font-semibold shrink-0 ml-1">Auto</span>
          </div>

          {/* Single Primary Shopping Button: ADD TO CART */}
          <div>
            <button
              onClick={() => addToCart(product)}
              disabled={isOutOfStock}
              className="w-full py-3 px-4 text-xs font-bold uppercase tracking-widest bg-[#D8B66B] hover:bg-[#c9a759] active:bg-[#b89547] text-neutral-950 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-[#D8B66B]/15 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              aria-label={`Add ${product.name} to cart`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{isOutOfStock ? 'Sold Out' : 'ADD TO CART'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
