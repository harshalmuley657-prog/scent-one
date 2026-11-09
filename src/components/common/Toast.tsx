import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Check, Info, AlertTriangle, X, ShoppingBag, ArrowRight } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useStore();

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col gap-2.5 max-w-xs sm:max-w-sm w-full pointer-events-none"
      aria-live="polite"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-xl border border-[#D8B66B]/45 bg-[#090A0F]/95 text-[#F8F3EA] shadow-2xl shadow-black/80 backdrop-blur-xl animate-[slideIn_0.25s_cubic-bezier(0.16,1,0.3,1)]"
        >
          <div className="flex items-center gap-3 min-w-0">
            {toast.type === 'success' && (
              <div className="w-6 h-6 rounded-full bg-[#D8B66B]/20 border border-[#D8B66B]/40 text-[#D8B66B] flex items-center justify-center shrink-0">
                <Check className="w-3.5 h-3.5" />
              </div>
            )}
            {toast.type === 'error' && (
              <div className="w-6 h-6 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-3.5 h-3.5" />
              </div>
            )}
            {toast.type === 'info' && (
              <div className="w-6 h-6 rounded-full bg-sky-500/20 border border-sky-500/40 text-sky-400 flex items-center justify-center shrink-0">
                <Info className="w-3.5 h-3.5" />
              </div>
            )}
            <div className="min-w-0">
              <span className="leading-snug text-[#F8F3EA] text-xs font-semibold font-sans block">
                {toast.message}
              </span>
              {toast.productName && (
                <span className="font-mono text-[11px] text-[#D8B66B] truncate block mt-0.5">
                  {toast.productName}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() => dismissToast(toast.id)}
            className="text-neutral-400 hover:text-white transition-colors p-1 shrink-0 cursor-pointer"
            aria-label="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

