import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Search, Heart, ShoppingBag, Sun, Moon, Menu, X, Shield } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    cartCount,
    wishlist,
    setIsCartOpen,
    setIsSearchOpen,
    setIsWishlistOpen,
    setIsAdminOpen,
    isDark,
    toggleTheme,
    settings,
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#090A0F]/85 dark:bg-[#090A0F]/85 bg-white/90 border-b border-[#D8B66B]/20 dark:border-[#D8B66B]/20 border-neutral-200 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-8 py-4">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#"
          className="group flex items-center gap-2.5 whitespace-nowrap shrink-0 text-decoration-none"
        >
          <span className="font-serif text-2xl font-bold tracking-[0.22em] text-neutral-900 dark:text-[#F8F3EA] group-hover:text-[#D8B66B] transition-colors">
            SCENT ONE
          </span>
          <span className="text-[10px] uppercase font-sans font-semibold tracking-widest text-[#D8B66B] border border-[#D8B66B]/40 px-1.5 py-0.5 rounded-sm">
            S1
          </span>
        </a>

        {/* Zone 2: 4–5 clean single-line text navigation links */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-neutral-700 dark:text-neutral-300">
          <button
            onClick={() => scrollTo('collection')}
            className="hover:text-[#D8B66B] dark:hover:text-[#D8B66B] transition-colors whitespace-nowrap shrink-0"
          >
            Collection
          </button>
          <button
            onClick={() => scrollTo('campaign-slider')}
            className="hover:text-[#D8B66B] dark:hover:text-[#D8B66B] transition-colors whitespace-nowrap shrink-0"
          >
            Fragrance Editions
          </button>
          <button
            onClick={() => scrollTo('storytelling')}
            className="hover:text-[#D8B66B] dark:hover:text-[#D8B66B] transition-colors whitespace-nowrap shrink-0"
          >
            The Universes
          </button>
          <button
            onClick={() => scrollTo('why-solid')}
            className="hover:text-[#D8B66B] dark:hover:text-[#D8B66B] transition-colors whitespace-nowrap shrink-0"
          >
            Solid Ritual
          </button>
          <button
            onClick={() => scrollTo('fragrance-quiz')}
            className="hover:text-[#D8B66B] dark:hover:text-[#D8B66B] transition-colors whitespace-nowrap shrink-0"
          >
            Fragrance Quiz
          </button>
          <button
            onClick={() => scrollTo('brand-story')}
            className="hover:text-[#D8B66B] dark:hover:text-[#D8B66B] transition-colors whitespace-nowrap shrink-0"
          >
            About Yash Jain
          </button>
        </nav>

        {/* Zone 3: Functional Interactive Action Area */}
        <div className="flex items-center gap-2 sm:gap-3.5 shrink-0">
          {/* Quick Search */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="p-2 text-neutral-700 dark:text-neutral-300 hover:text-[#D8B66B] dark:hover:text-[#D8B66B] transition-colors cursor-pointer"
            aria-label="Search fragrances"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Wishlist */}
          <button
            onClick={() => setIsWishlistOpen(true)}
            className="relative p-2 text-neutral-700 dark:text-neutral-300 hover:text-[#D8B66B] dark:hover:text-[#D8B66B] transition-colors cursor-pointer"
            aria-label="Wishlist"
          >
            <Heart className="w-4 h-4" />
            {wishlist.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#D8B66B]" />
            )}
          </button>

          {/* Theme Switcher: Dark Luxury / Pearl Ivory (Desktop/Tablet in header, Mobile in menu) */}
          <button
            onClick={toggleTheme}
            className="hidden sm:inline-flex p-2 text-neutral-700 dark:text-neutral-300 hover:text-[#D8B66B] dark:hover:text-[#D8B66B] transition-colors cursor-pointer"
            aria-label={isDark ? 'Switch to Pearl Ivory theme' : 'Switch to Obsidian Dark theme'}
            title={isDark ? 'Switch to Pearl Ivory theme' : 'Switch to Obsidian Dark theme'}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Owner Admin Access Button */}
          <button
            onClick={() => setIsAdminOpen(true)}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-sans font-semibold tracking-wider uppercase text-[#D8B66B] hover:text-[#F8F3EA] border border-[#D8B66B]/30 hover:border-[#D8B66B] rounded transition-all cursor-pointer"
            title="Owner Portal for Yash Jain"
          >
            <Shield className="w-3 h-3" />
            <span>Admin</span>
          </button>

          {/* Top Navigation Shopping Bag / Cart Icon with Live Quantity Badge */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-2 px-3 sm:px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-neutral-950 bg-[#D8B66B] hover:bg-[#c9a759] active:bg-[#b89547] rounded-xl transition-all whitespace-nowrap shrink-0 shadow-md shadow-[#D8B66B]/20 cursor-pointer"
            aria-label={`Open shopping cart with ${cartCount} items`}
          >
            <div className="relative flex items-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <span className="hidden sm:inline">Cart</span>
            <span
              key={cartCount}
              className="min-w-[20px] h-5 px-1.5 flex items-center justify-center text-[11px] font-mono font-bold rounded-full bg-neutral-950 text-[#D8B66B] border border-[#D8B66B]/50 tabular-nums animate-[scaleUp_0.2s_ease-out]"
            >
              {cartCount}
            </span>
          </button>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="p-2 lg:hidden text-neutral-700 dark:text-neutral-300 cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-6 py-6 border-t border-[#D8B66B]/20 bg-[#090A0F] text-[#F8F3EA] flex flex-col gap-3.5 animate-[fadeIn_0.2s_ease-out]">
          <button
            onClick={() => scrollTo('collection')}
            className="text-left py-1.5 text-base font-serif hover:text-[#D8B66B]"
          >
            Fragrance Collection
          </button>
          <button
            onClick={() => scrollTo('campaign-slider')}
            className="text-left py-1.5 text-base font-serif hover:text-[#D8B66B]"
          >
            Fragrance Editions Showcase
          </button>
          <button
            onClick={() => scrollTo('storytelling')}
            className="text-left py-1.5 text-base font-serif hover:text-[#D8B66B]"
          >
            The Four Universes
          </button>
          <button
            onClick={() => scrollTo('why-solid')}
            className="text-left py-1.5 text-base font-serif hover:text-[#D8B66B]"
          >
            Why Choose Solid Perfume
          </button>
          <button
            onClick={() => scrollTo('how-to-use')}
            className="text-left py-1.5 text-base font-serif hover:text-[#D8B66B]"
          >
            How to Use
          </button>
          <button
            onClick={() => scrollTo('fragrance-quiz')}
            className="text-left py-1.5 text-base font-serif hover:text-[#D8B66B]"
          >
            Fragrance Finder Quiz
          </button>
          <button
            onClick={() => scrollTo('brand-story')}
            className="text-left py-1.5 text-base font-serif hover:text-[#D8B66B]"
          >
            Founder Yash Jain & Story
          </button>
          <div className="pt-4 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
            <button
              onClick={toggleTheme}
              className="flex items-center gap-1.5 text-neutral-300 hover:text-[#D8B66B]"
            >
              {isDark ? <Sun className="w-3.5 h-3.5 text-[#D8B66B]" /> : <Moon className="w-3.5 h-3.5 text-[#D8B66B]" />}
              <span>{isDark ? 'Pearl Ivory Mode' : 'Obsidian Dark Mode'}</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsAdminOpen(true);
              }}
              className="text-[#D8B66B] flex items-center gap-1 font-semibold"
            >
              <Shield className="w-3.5 h-3.5" />
              Owner Admin
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
