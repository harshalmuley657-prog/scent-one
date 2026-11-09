import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ShoppingBag } from 'lucide-react';

export const FloatingCartButton: React.FC = () => {
  const { cartCount, setIsCartOpen, isCartOpen, isCheckoutOpen, subtotal } = useStore();

  // Hide when cart or checkout modal is active
  if (isCartOpen || isCheckoutOpen) return null;

  return (
    <aside
      aria-label="Shopping bag quick access"
      className="fixed bottom-[calc(1.5rem+env(safe-area-inset-bottom,0px))] right-4 sm:right-6 z-40 flex items-center gap-2 group"
    >
      <button
        onClick={() => setIsCartOpen(true)}
        className="relative flex items-center gap-3 px-4 py-3.5 rounded-full bg-[#D8B66B] hover:bg-[#c9a759] text-neutral-950 shadow-2xl shadow-black/80 hover:scale-105 active:scale-95 transition-all duration-300 border border-[#FFF1CF]/40 cursor-pointer"
        aria-label={`Open shopping cart with ${cartCount} items, total ₹${subtotal}`}
      >
        <div className="relative">
          <ShoppingBag className="w-5 h-5" />
          {cartCount > 0 && (
            <span className="absolute -top-2.5 -right-2.5 min-w-[20px] h-5 px-1 rounded-full bg-neutral-950 text-[#D8B66B] font-mono text-[11px] font-bold flex items-center justify-center border border-[#D8B66B] animate-pulse">
              {cartCount}
            </span>
          )}
        </div>

        <div className="hidden sm:flex flex-col items-start text-left leading-none pr-1">
          <span className="text-[10px] uppercase font-mono tracking-wider font-semibold opacity-80">
            Bag
          </span>
          <span className="text-xs font-serif font-bold tabular-nums">
            {cartCount > 0 ? `₹${subtotal}` : 'Empty'}
          </span>
        </div>
      </button>
    </aside>
  );
};
