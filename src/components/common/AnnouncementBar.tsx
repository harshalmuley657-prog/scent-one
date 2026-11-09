import React from 'react';
import { useStore } from '../../context/StoreContext';
import { DiwaliDiyaIcon } from './DiwaliMotifs';

export const AnnouncementBar: React.FC = () => {
  const { settings } = useStore();

  return (
    <div className="relative overflow-hidden bg-[#10121A] text-[#D8B66B] border-b border-[#D8B66B]/30 py-2 px-4 text-xs tracking-wider">
      {/* Subtle Diwali Gold Jaali Lattice Texture */}
      <div className="absolute inset-0 diwali-jaali-pattern opacity-[0.08] pointer-events-none" aria-hidden="true" />
      <div className="relative max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1.5 sm:gap-4 font-sans text-[11px] font-medium text-center sm:text-left z-10">
        <div className="flex items-center gap-2">
          <DiwaliDiyaIcon className="w-4 h-4 shrink-0" />
          <span className="font-mono text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#D8B66B]/15 text-[#D8B66B] border border-[#D8B66B]/30">
            FESTIVE OFFER
          </span>
          <span className="text-white font-medium">
            <strong className="text-[#D8B66B] font-bold">BUY 2 OR MORE – JUST ₹149 EACH!</strong> (Regular ₹199) · Automatically applies at checkout
          </span>
        </div>
        <div className="flex items-center gap-2.5 text-neutral-400 font-mono text-[10px]">
          <span>WhatsApp Desk: {settings.whatsappDisplay}</span>
        </div>
      </div>
    </div>
  );
};
