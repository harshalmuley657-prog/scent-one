import React from 'react';
import { useStore } from '../../context/StoreContext';
import { PerfumeTinVisual } from '../common/PerfumeTinVisual';
import { X, Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';

export const WishlistDrawer: React.FC = () => {
  const {
    wishlist,
    isWishlistOpen,
    setIsWishlistOpen,
    products,
    toggleWishlist,
    addToCart,
    setActiveProductModal,
  } = useStore();

  if (!isWishlistOpen) return null;

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm"
        onClick={() => setIsWishlistOpen(false)}
      />

      <div className="relative w-full max-w-md bg-[#0D0F17] text-[#F8F3EA] border-l border-neutral-800 h-full flex flex-col shadow-2xl z-10 animate-[slideLeft_0.25s_ease-out]">
        {/* Header */}
        <div className="p-5 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-[#D8B66B] fill-current" />
            <h3 className="font-serif text-xl font-bold">Saved Fragrances</h3>
            <span className="text-xs font-mono text-neutral-400">
              ({wishlistedProducts.length})
            </span>
          </div>
          <button
            onClick={() => setIsWishlistOpen(false)}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white transition-colors"
            aria-label="Close wishlist"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {wishlistedProducts.length === 0 ? (
            <div className="py-24 text-center space-y-4">
              <Heart className="w-12 h-12 text-neutral-600 mx-auto" />
              <p className="font-serif text-lg text-neutral-400">
                Your wishlist is empty
              </p>
              <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                Explore our collection and click the heart icon on any solid perfume to save your favorites.
              </p>
            </div>
          ) : (
            wishlistedProducts.map((prod) => (
              <div
                key={prod.id}
                className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/40 flex items-center gap-4"
              >
                <div
                  onClick={() => {
                    setActiveProductModal(prod);
                    setIsWishlistOpen(false);
                  }}
                  className="w-14 h-18 bg-black/40 rounded flex items-center justify-center shrink-0 cursor-pointer"
                >
                  <PerfumeTinVisual product={prod} size="sm" interactive={false} />
                </div>

                <div className="flex-1 min-w-0">
                  <h4
                    onClick={() => {
                      setActiveProductModal(prod);
                      setIsWishlistOpen(false);
                    }}
                    className="font-serif text-base font-bold text-white hover:text-[#D8B66B] transition-colors truncate cursor-pointer"
                  >
                    {prod.name}
                  </h4>
                  <span className="text-xs font-mono text-[#D8B66B] block">
                    {prod.identity}
                  </span>
                  <div className="mt-1 font-serif text-sm font-bold text-white tabular-nums">
                    ₹{prod.price}
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <button
                      onClick={() => addToCart(prod)}
                      className="px-3 py-1.5 bg-[#D8B66B] hover:bg-[#c9a759] text-neutral-950 text-xs font-semibold uppercase tracking-wider rounded transition-colors flex items-center gap-1.5"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Move to Bag</span>
                    </button>
                    <button
                      onClick={() => toggleWishlist(prod.id)}
                      className="p-1.5 text-neutral-400 hover:text-rose-400 transition-colors"
                      aria-label="Remove from wishlist"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
