import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Instagram, MessageCircle, Shield, ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const { settings, openPolicy, setIsAdminOpen } = useStore();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-[#D8B66B]/20 bg-[#06070A] text-[#F8F3EA] pt-16 pb-12 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-neutral-800">
        {/* Brand Column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <span className="font-serif text-2xl font-bold tracking-[0.2em] text-[#F8F3EA]">
              SCENT ONE
            </span>
            <span className="text-[10px] uppercase font-sans font-semibold tracking-widest text-[#D8B66B] border border-[#D8B66B]/40 px-1.5 py-0.5 rounded-sm">
              S1
            </span>
          </div>

          <p className="font-serif italic text-sm text-[#D8B66B]">
            "{settings.tagline}"
          </p>

          <p className="font-sans text-xs text-neutral-400 max-w-sm leading-relaxed font-light">
            Luxury handcrafted solid perfumes engineered in pocket-sized sliding tins. Pure wax base, concentrated sillage, zero liquid leaks.
          </p>

          <div className="pt-2 text-xs text-neutral-400">
            <span>{settings.ownerRole}: </span>
            <span className="text-[#F8F3EA] font-semibold">{settings.ownerName}</span>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-3 pt-2">
            <a
              href={settings.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-full border border-neutral-800 hover:border-[#D8B66B] hover:text-[#D8B66B] transition-colors text-neutral-300"
              aria-label="Follow SCENT ONE on Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href={`https://wa.me/${settings.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-full border border-neutral-800 hover:border-[#D8B66B] hover:text-[#D8B66B] transition-colors text-neutral-300"
              aria-label="Contact SCENT ONE on WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Column 2: Fragrance Editions */}
        <div className="space-y-3">
          <h5 className="font-serif text-base font-bold text-[#F8F3EA] tracking-wider uppercase">
            Fragrances
          </h5>
          <ul className="space-y-2 text-xs text-neutral-400 font-light">
            <li>
              <a href="#campaign-slider" className="hover:text-[#D8B66B] transition-colors">
                Midnight Aura (The Chocolate Dream)
              </a>
            </li>
            <li>
              <a href="#campaign-slider" className="hover:text-[#D8B66B] transition-colors">
                Fresh Drift (The Ocean Breeze)
              </a>
            </li>
            <li>
              <a href="#campaign-slider" className="hover:text-[#D8B66B] transition-colors">
                Aero Flex (The Sky Escape)
              </a>
            </li>
            <li>
              <a href="#campaign-slider" className="hover:text-[#D8B66B] transition-colors">
                Love Vibe (The Romantic Soul)
              </a>
            </li>
            <li>
              <a href="#fragrance-quiz" className="hover:text-[#D8B66B] transition-colors">
                Fragrance Quiz
              </a>
            </li>
          </ul>
        </div>

        {/* Column 3: Trust & Information */}
        <div className="space-y-3">
          <h5 className="font-serif text-base font-bold text-[#F8F3EA] tracking-wider uppercase">
            Information
          </h5>
          <ul className="space-y-2 text-xs text-neutral-400 font-light">
            <li>
              <button
                onClick={() => openPolicy('about')}
                className="hover:text-[#D8B66B] transition-colors text-left"
              >
                About Us
              </button>
            </li>
            <li>
              <button
                onClick={() => openPolicy('contact')}
                className="hover:text-[#D8B66B] transition-colors text-left"
              >
                Official Contact
              </button>
            </li>
            <li>
              <button
                onClick={() => openPolicy('faqs')}
                className="hover:text-[#D8B66B] transition-colors text-left"
              >
                FAQs
              </button>
            </li>
            <li>
              <button
                onClick={() => openPolicy('shipping')}
                className="hover:text-[#D8B66B] transition-colors text-left"
              >
                Shipping & Delivery
              </button>
            </li>
            <li>
              <button
                onClick={() => openPolicy('returns')}
                className="hover:text-[#D8B66B] transition-colors text-left"
              >
                Return & Refund Policy
              </button>
            </li>
          </ul>
        </div>

        {/* Column 4: Official Ordering & Legal */}
        <div className="space-y-3">
          <h5 className="font-serif text-base font-bold text-[#F8F3EA] tracking-wider uppercase">
            Ordering Desk
          </h5>
          <div className="text-xs text-neutral-400 space-y-2 font-light">
            <p>
              Direct WhatsApp Desk: <br />
              <strong className="text-white font-mono">{settings.whatsappDisplay}</strong>
            </p>
            <div className="pt-2 flex flex-col gap-1.5">
              <button
                onClick={() => openPolicy('privacy')}
                className="hover:text-[#D8B66B] transition-colors text-left"
              >
                Privacy Policy
              </button>
              <button
                onClick={() => openPolicy('terms')}
                className="hover:text-[#D8B66B] transition-colors text-left"
              >
                Terms & Conditions
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright and Controls */}
      <div className="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500 font-mono">
        <div>
          © {new Date().getFullYear()} SCENT ONE (S1). All rights reserved. Founded by Yash Jain.
        </div>

        <div className="flex items-center gap-5">
          {/* Owner Dashboard link */}
          <button
            onClick={() => setIsAdminOpen(true)}
            className="flex items-center gap-1.5 text-neutral-400 hover:text-[#D8B66B] transition-colors"
            title="Owner Portal for Yash Jain"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Owner Portal</span>
          </button>

          {/* Back to top */}
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1 hover:text-[#D8B66B] transition-colors cursor-pointer"
            aria-label="Scroll back to top"
          >
            <span>Top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
