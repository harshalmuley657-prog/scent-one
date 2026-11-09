import React from 'react';
import { useStore } from '../../context/StoreContext';
import { X, ShieldCheck, Mail, MessageCircle, Instagram } from 'lucide-react';

export const PolicyModal: React.FC = () => {
  const { policyModal, closePolicy, settings } = useStore();

  if (!policyModal.isOpen) return null;

  const contentMap: Record<
    string,
    { title: string; subtitle: string; content: React.ReactNode }
  > = {
    about: {
      title: 'About SCENT ONE',
      subtitle: 'Small Tin. Big Impressions.',
      content: (
        <div className="space-y-4 text-sm text-neutral-300 leading-relaxed font-light">
          <p>
            SCENT ONE was founded by Yash Jain with a singularly focused mission: to redefine how modern individuals carry, wear, and experience luxury fragrances.
          </p>
          <p>
            Traditional perfumes depend largely on alcohol spray carriers that evaporate in minutes, leak in luggage, and break easily in fragile glass bottles. SCENT ONE reimagines perfume as a solid tactile ritual — fusing pure waxes with concentrated perfume oils inside pocket-sized sliding metal tins.
          </p>
          <p>
            Designed for travel, work, and everyday life, SCENT ONE solid perfumes accompany your every movement, providing an intimate, lasting sillage that warms with your natural skin temperature.
          </p>
          <div className="pt-4 border-t border-neutral-800 text-xs font-mono text-neutral-400">
            Founded by <strong>{settings.ownerName}</strong> ({settings.ownerRole})
          </div>
        </div>
      ),
    },
    contact: {
      title: 'Official Contact Desk',
      subtitle: 'Get in touch directly with the SCENT ONE team',
      content: (
        <div className="space-y-5 text-sm text-neutral-300 leading-relaxed font-light">
          <p>
            For product inquiries, custom corporate orders, or order status confirmation, reach out through our official channels:
          </p>

          <div className="p-4 rounded-xl border border-neutral-800 bg-black/40 space-y-3 font-mono text-xs">
            <div className="flex items-center gap-3">
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              <div>
                <span className="text-neutral-400 block">WhatsApp Desk:</span>
                <a
                  href={`https://wa.me/${settings.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-[#D8B66B] font-bold text-sm"
                >
                  {settings.whatsappDisplay}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Instagram className="w-4 h-4 text-pink-400" />
              <div>
                <span className="text-neutral-400 block">Instagram:</span>
                <a
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-[#D8B66B]"
                >
                  @scent_one_
                </a>
              </div>
            </div>

            {settings.contactEmail && (
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#D8B66B]" />
                <div>
                  <span className="text-neutral-400 block">Email:</span>
                  <span className="text-white">{settings.contactEmail}</span>
                </div>
              </div>
            )}
          </div>

          <p className="text-xs text-neutral-400">
            Founder & Lead: <strong>{settings.ownerName}</strong>
          </p>
        </div>
      ),
    },
    faqs: {
      title: 'Frequently Asked Questions',
      subtitle: 'Everything about our solid fragrance editions',
      content: (
        <div className="space-y-4 text-sm text-neutral-300 leading-relaxed font-light">
          <div>
            <h4 className="font-serif font-bold text-white text-base">Is solid perfume leakproof?</h4>
            <p className="mt-1">Yes, because it is in solid wax form in a secure sliding metal tin, there is zero risk of leaking in bags, pockets, or air travel.</p>
          </div>
          <div>
            <h4 className="font-serif font-bold text-white text-base">How do I order?</h4>
            <p className="mt-1">Orders are placed via WhatsApp. Add items to your bag, fill your delivery address, and tap "Submit Order on WhatsApp" to message our team directly.</p>
          </div>
          <div>
            <h4 className="font-serif font-bold text-white text-base">What are the pricing details?</h4>
            <p className="mt-1">Every perfume is regularly ₹199 each (15g tin). When you purchase 2 or more perfumes, each perfume is automatically discounted to ₹149 (e.g. 2 = ₹298, 3 = ₹447, 4 = ₹596).</p>
          </div>
        </div>
      ),
    },
    shipping: {
      title: 'Shipping & Delivery Policy',
      subtitle: 'Careful packaging and dispatch across India',
      content: (
        <div className="space-y-4 text-sm text-neutral-300 leading-relaxed font-light">
          <p>
            Every SCENT ONE solid perfume tin is inspected and securely packaged to ensure it arrives in pristine condition.
          </p>
          <div className="p-4 rounded-xl border border-neutral-800 bg-black/40 text-xs font-mono space-y-2">
            <div>
              <span className="text-neutral-400 block">Delivery Charges:</span>
              <span>Complimentary delivery on every order (₹0 shipping).</span>
            </div>
            <div>
              <span className="text-neutral-400 block">Dispatch Timeline:</span>
              <span>Orders are dispatched within 24 to 48 hours following confirmation by the SCENT ONE team on WhatsApp.</span>
            </div>
            <div>
              <span className="text-neutral-400 block">Tracking:</span>
              <span>Courier tracking details will be shared directly via WhatsApp upon package dispatch.</span>
            </div>
          </div>
        </div>
      ),
    },
    returns: {
      title: 'Return & Refund Policy',
      subtitle: 'Customer satisfaction & hygiene standards',
      content: (
        <div className="space-y-4 text-sm text-neutral-300 leading-relaxed font-light">
          <p>
            Due to the personal hygiene and cosmetic nature of solid perfumes, tins that have been opened or tested cannot be returned for restock.
          </p>
          <p>
            If your order arrives damaged, defective, or incorrect, please reach out to Yash Jain via WhatsApp within 48 hours of delivery with photographic evidence, and our team will promptly arrange a replacement or appropriate resolution.
          </p>
        </div>
      ),
    },
    privacy: {
      title: 'Privacy Policy',
      subtitle: 'Your personal data privacy commitments',
      content: (
        <div className="space-y-4 text-sm text-neutral-300 leading-relaxed font-light">
          <p>
            SCENT ONE respects your personal privacy. When you place an order, we collect only the information necessary to fulfill your delivery: your name, contact mobile number, and delivery address.
          </p>
          <p>
            We do not sell, rent, or trade your personal data to third parties. If you utilize the "Use My Current Location" feature, your coordinates are processed strictly client-side to detect postal details and are never continuously tracked or stored without your explicit action.
          </p>
        </div>
      ),
    },
    terms: {
      title: 'Terms & Conditions',
      subtitle: 'Guidelines for using SCENT ONE services',
      content: (
        <div className="space-y-4 text-sm text-neutral-300 leading-relaxed font-light">
          <p>
            Welcome to SCENT ONE. By accessing this store and placing an order via WhatsApp, you agree to our standard terms of service.
          </p>
          <p>
            All products and brand marks (SCENT ONE, S1, Small Tin. Big Impressions.) are the intellectual property of founder Yash Jain. Orders submitted via WhatsApp represent a purchase intent and are subject to final confirmation and stock verification by the SCENT ONE team.
          </p>
        </div>
      ),
    },
  };

  const current = contentMap[policyModal.type] || contentMap.about;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md"
        onClick={closePolicy}
      />

      <div className="relative w-full max-w-2xl bg-[#0F111A] text-[#F8F3EA] rounded-3xl border border-neutral-800 shadow-2xl p-6 sm:p-8 z-10 my-8 animate-[scaleUp_0.2s_ease-out]">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div>
            <span className="text-[11px] font-mono tracking-widest text-[#D8B66B] uppercase font-semibold">
              SCENT ONE Policies & Trust
            </span>
            <h3 className="font-serif text-2xl font-bold mt-1">{current.title}</h3>
            <p className="text-xs text-neutral-400 font-light mt-0.5">{current.subtitle}</p>
          </div>

          <button
            onClick={closePolicy}
            className="p-2 rounded-full text-neutral-400 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-6 max-h-[65vh] overflow-y-auto pr-2">
          {current.content}
        </div>

        <div className="pt-4 border-t border-neutral-800 flex justify-end">
          <button
            onClick={closePolicy}
            className="px-6 py-2.5 bg-[#D8B66B] hover:bg-[#c9a759] text-neutral-950 font-sans text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};
