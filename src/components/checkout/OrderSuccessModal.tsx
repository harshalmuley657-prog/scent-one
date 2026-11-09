import React from 'react';
import { useStore } from '../../context/StoreContext';
import { CheckCircle2, MessageCircle, AlertCircle, X, ExternalLink } from 'lucide-react';

export const OrderSuccessModal: React.FC = () => {
  const {
    isOrderSuccessOpen,
    setIsOrderSuccessOpen,
    latestOrder,
    settings,
  } = useStore();

  if (!isOrderSuccessOpen || !latestOrder) return null;

  const handleReopenWhatsApp = () => {
    const unitPriceStr = latestOrder.effectiveUnitPrice === 149 ? '₹149 each (Offer)' : '₹199 each (Regular)';
    const itemsFormatted = latestOrder.items
      .map((item) => `${item.productName} x ${item.quantity} (${unitPriceStr})\nItem Total: ₹${item.totalPrice}`)
      .join('\n\n');

    const customer = latestOrder.customer;
    const cityStateStr = [customer.city, customer.state].filter(Boolean).join(', ');
    const fullAddress = `${customer.address}${customer.landmark ? `, Landmark: ${customer.landmark}` : ''}${cityStateStr ? `, ${cityStateStr}` : ''} - PIN: ${customer.pincode}`;

    const discountLines = (latestOrder.discountAmount && latestOrder.discountAmount > 0)
      ? `Original Subtotal (Regular ₹199 each): ₹${latestOrder.originalSubtotal || latestOrder.subtotal}
Offer Applied (BUY 2 OR MORE – JUST ₹149 EACH!): -₹${latestOrder.discountAmount}
Discounted Subtotal: ₹${latestOrder.subtotal}`
      : `Subtotal (Regular ₹199 each): ₹${latestOrder.subtotal}`;

    const message = `Hello SCENT ONE!

I would like to place an order.

ORDER REFERENCE:
${latestOrder.orderReference}

CUSTOMER DETAILS:
Name: ${customer.fullName}
Mobile: ${customer.mobile}
Delivery Address: ${fullAddress}

ORDER ITEMS:
${itemsFormatted}

${discountLines}
Delivery Charges: ${latestOrder.deliveryCharges === 0 ? 'FREE' : `₹${latestOrder.deliveryCharges}`}
Estimated Total: ₹${latestOrder.total}

Delivery Instructions:
${customer.deliveryInstructions || 'None'}

Please confirm the order.

Thank you!`;

    const cleanNumber = settings.whatsappNumber.replace(/\D/g, '');
    const waUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-md"
        onClick={() => setIsOrderSuccessOpen(false)}
      />

      <div className="relative w-full max-w-lg bg-[#0F111A] text-[#F8F3EA] rounded-3xl border border-[#D8B66B]/40 shadow-2xl p-6 sm:p-8 z-10 space-y-6 animate-[scaleUp_0.25s_ease-out]">
        <button
          onClick={() => setIsOrderSuccessOpen(false)}
          className="absolute top-5 right-5 p-1.5 rounded-full text-neutral-400 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-full bg-[#25D366]/15 text-[#25D366] flex items-center justify-center mx-auto mb-2 border border-[#25D366]/30">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <span className="text-xs font-mono text-[#D8B66B] uppercase tracking-widest font-semibold">
            Order Request Formatted
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold">
            Action Required: Press "Send" in WhatsApp
          </h3>
        </div>

        {/* Reference Box */}
        <div className="p-4 rounded-xl bg-black/50 border border-neutral-800 text-center space-y-1">
          <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
            Your Order Reference Code
          </span>
          <div className="font-mono text-xl font-bold text-[#D8B66B]">
            {latestOrder.orderReference}
          </div>
          <span className="text-[11px] text-neutral-500 block">
            Saved to Yash Jain's SCENT ONE store orders
          </span>
        </div>

        {/* Clear Instructions */}
        <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/50 space-y-2.5 text-xs text-neutral-300">
          <div className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-[#D8B66B]/20 text-[#D8B66B] flex items-center justify-center font-bold text-[11px] shrink-0">
              1
            </span>
            <p>
              Your WhatsApp chat with the official SCENT ONE number (<strong>{settings.whatsappDisplay}</strong>) was opened with your order pre-filled.
            </p>
          </div>

          <div className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-[#D8B66B]/20 text-[#D8B66B] flex items-center justify-center font-bold text-[11px] shrink-0">
              2
            </span>
            <p className="text-amber-200">
              <strong>CRITICAL:</strong> Please press <strong>Send</strong> in WhatsApp. Your order cannot be received until you press Send.
            </p>
          </div>

          <div className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-[#D8B66B]/20 text-[#D8B66B] flex items-center justify-center font-bold text-[11px] shrink-0">
              3
            </span>
            <p>
              Yash Jain & the SCENT ONE team will review stock, verify your address, and confirm your payment instructions directly in the chat.
            </p>
          </div>
        </div>

        {/* Notice on confirmation */}
        <div className="text-[11px] text-neutral-400 font-mono flex items-start gap-2 bg-neutral-900/30 p-3 rounded-lg border border-neutral-800">
          <AlertCircle className="w-4 h-4 text-[#D8B66B] shrink-0 mt-0.5" />
          <span>
            Please note: An order is confirmed only after the SCENT ONE team verifies and replies to your message. Opening WhatsApp does not constitute final delivery confirmation.
          </span>
        </div>

        {/* Button to re-open WhatsApp if blocked or closed */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleReopenWhatsApp}
            className="flex-1 py-3 bg-[#25D366] hover:bg-[#20ba59] text-white font-sans text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Re-open WhatsApp Chat</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsOrderSuccessOpen(false)}
            className="px-5 py-3 border border-neutral-700 hover:border-neutral-500 text-neutral-300 text-xs font-sans font-semibold uppercase tracking-wider rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
