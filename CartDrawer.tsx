import React, { useState } from 'react';
import {
  Check,
  Copy,
  MessageCircle,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  X,
} from 'lucide-react';
import { CartItem, FulfillmentMethod, OrderDetails } from '../types/cake';
import { SHOP_CONFIG } from '../data/cakes';
import {
  buildCartOrderMessage,
  buildWhatsAppUrl,
  formatBdt,
} from '../utils/whatsapp';
import { ResilientCakeImage } from './ResilientCakeImage';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (cartItemId: string, delta: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) => {
  const [details, setDetails] = useState<OrderDetails>({
    customerName: '',
    customerPhone: '',
    fulfillment: 'delivery',
    deliveryAddress: '',
    preferredDate: '',
    preferredTime: 'Afternoon (2:00 PM – 6:00 PM)',
    orderNotes: '',
  });

  const [orderSubmittedRef, setOrderSubmittedRef] = useState<string | null>(null);
  const [copiedSummary, setCopiedSummary] = useState(false);

  if (!isOpen) return null;

  const subtotalBdt = items.reduce(
    (sum, item) => sum + item.size.priceBdt * item.quantity,
    0
  );

  const deliveryFeeBdt =
    items.length === 0 || details.fulfillment === 'pickup'
      ? 0
      : subtotalBdt >= SHOP_CONFIG.freeDeliveryThresholdBdt
        ? 0
        : SHOP_CONFIG.deliveryFeeBdt;

  const totalBdt = subtotalBdt + deliveryFeeBdt;
  const activeOrderRef =
    orderSubmittedRef || `NCC-${String(subtotalBdt % 9000 + 1000)}`;

  const orderMessage = buildCartOrderMessage({
    items,
    details,
    subtotalBdt,
    deliveryFeeBdt,
    totalBdt,
    orderRef: activeOrderRef,
  });

  const whatsappCheckoutUrl = buildWhatsAppUrl(orderMessage);

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(orderMessage);
      setCopiedSummary(true);
      setTimeout(() => setCopiedSummary(false), 2200);
    } catch {
      // Fallback ignored silently
    }
  };

  const updateField = <K extends keyof OrderDetails>(
    field: K,
    value: OrderDetails[K]
  ) => {
    setDetails((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Bag and WhatsApp Order Summary"
    >
      {/* Backdrop click target */}
      <div className="flex-1" onClick={onClose} />

      {/* Slide-over Sheet */}
      <div className="relative w-full max-w-lg bg-[#FDF9F6] h-full flex flex-col border-l border-[#E6D3CB] shadow-xl">
        {/* Drawer Header */}
        <div className="px-6 py-4 bg-white border-b border-[#EADAD3] flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-[#A64B5D]" />
            <h2 className="font-serif text-xl font-semibold text-[#2B1E1A]">
              Your Cake Order Bag
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close shopping bag"
            className="w-10 h-10 rounded-lg inline-flex items-center justify-center text-[#59443E] hover:bg-[#FAF1EE] hover:text-[#2B1E1A] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {items.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-14 h-14 mx-auto rounded-full bg-[#FAF1EE] border border-[#E7D4CD] flex items-center justify-center text-[#9A732C]">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <p className="mt-4 font-serif text-xl font-medium text-[#2B1E1A]">
                Your shopping bag is empty
              </p>
              <p className="mt-2 text-sm text-[#6E5650] max-w-xs mx-auto">
                Explore our pastel celebration cakes, bento boxes, and cupcakes to customize your
                order.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-6 px-5 py-2.5 text-sm font-semibold text-white bg-[#A64B5D] hover:bg-[#8D3B4C] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Browse Cake Gallery
              </button>
            </div>
          ) : (
            <>
              {/* Post-Click Order Confirmation Banner */}
              {orderSubmittedRef && (
                <div className="rounded-xl border border-[#D7BE92] bg-[#FCF7EC] p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold text-[#9A732C] tabular-nums">
                        Order Summary Ready · {orderSubmittedRef}
                      </p>
                      <p className="mt-1 text-sm text-[#2B1E1A]">
                        WhatsApp opened with your complete order for{' '}
                        <strong className="tabular-nums">{SHOP_CONFIG.whatsappDisplay}</strong>. If
                        WhatsApp did not open automatically, copy the summary below.
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCopyMessage}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#2B1E1A] bg-white border border-[#DEC9A4] rounded-lg hover:bg-[#FAF3E6] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      {copiedSummary ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-[#9A732C]" />
                          <span>Order Text Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-[#9A732C]" />
                          <span>Copy Order Text</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setOrderSubmittedRef(null);
                        onClearCart();
                      }}
                      className="px-3 py-1.5 text-xs font-medium text-[#6E5650] hover:text-[#2B1E1A] underline underline-offset-4 whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      Clear Bag &amp; Start Fresh
                    </button>
                  </div>
                </div>
              )}

              {/* Free Delivery Progress Notice */}
              <div className="rounded-lg bg-[#FAF2EE] border border-[#EAD8D0] px-4 py-2.5 text-xs text-[#59443E] tabular-nums">
                {subtotalBdt >= SHOP_CONFIG.freeDeliveryThresholdBdt ? (
                  <span>
                    Complimentary Dhaka home delivery unlocked on orders over{' '}
                    <strong>{formatBdt(SHOP_CONFIG.freeDeliveryThresholdBdt)}</strong>.
                  </span>
                ) : (
                  <span>
                    Add{' '}
                    <strong>
                      {formatBdt(SHOP_CONFIG.freeDeliveryThresholdBdt - subtotalBdt)}
                    </strong>{' '}
                    more for free Dhaka home delivery (standard delivery{' '}
                    {formatBdt(SHOP_CONFIG.deliveryFeeBdt)}).
                  </span>
                )}
              </div>

              {/* Itemized Cart List */}
              <div className="space-y-3">
                {items.map((item) => {
                  const lineTotal = item.size.priceBdt * item.quantity;
                  return (
                    <div
                      key={item.cartItemId}
                      className="bg-white rounded-xl border border-[#EADAD3] p-3.5 flex gap-3.5"
                    >
                      <div className="w-20 h-20 rounded-lg overflow-hidden bg-[#FAF3EE] shrink-0">
                        <ResilientCakeImage
                          src={item.cakeImage}
                          alt={item.cakeName}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-serif text-base font-semibold text-[#2B1E1A] leading-snug">
                            {item.cakeName}
                          </h3>
                          <button
                            type="button"
                            onClick={() => onRemoveItem(item.cartItemId)}
                            aria-label={`Remove ${item.cakeName}`}
                            className="text-[#8E7770] hover:text-[#A64B5D] p-1 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <p className="mt-0.5 text-xs text-[#6E5650]">
                          {item.size.label} · {item.flavor}
                          {item.eggless ? ' · Eggless' : ''}
                        </p>

                        {item.customMessage && (
                          <p className="mt-1 text-xs text-[#9A732C] truncate">
                            Note: “{item.customMessage}”
                          </p>
                        )}

                        <div className="mt-3 flex items-center justify-between gap-2">
                          <div className="inline-flex items-center rounded-md border border-[#E5D3CB] bg-[#FDF9F6] h-8">
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(item.cartItemId, -1)}
                              aria-label="Decrease item quantity"
                              className="w-8 h-full inline-flex items-center justify-center text-[#59443E] hover:text-[#2B1E1A] cursor-pointer"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-7 text-center text-xs font-semibold text-[#2B1E1A] tabular-nums">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(item.cartItemId, 1)}
                              aria-label="Increase item quantity"
                              className="w-8 h-full inline-flex items-center justify-center text-[#59443E] hover:text-[#2B1E1A] cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <span className="text-sm font-semibold text-[#2B1E1A] tabular-nums">
                            {formatBdt(lineTotal)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Delivery & Customer Details for WhatsApp Summary */}
              <div className="bg-white rounded-xl border border-[#EADAD3] p-4 sm:p-5 space-y-4">
                <h3 className="font-serif text-lg font-semibold text-[#2B1E1A]">
                  Delivery &amp; Schedule Details
                </h3>

                {/* Fulfillment Segmented Control */}
                <div className="grid grid-cols-2 gap-1 p-1 bg-[#F6ECE7] rounded-lg">
                  {(['delivery', 'pickup'] as FulfillmentMethod[]).map((method) => {
                    const active = details.fulfillment === method;
                    return (
                      <button
                        key={method}
                        type="button"
                        onClick={() => updateField('fulfillment', method)}
                        className={`py-2 px-3 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                          active
                            ? 'bg-white text-[#2B1E1A] shadow-xs'
                            : 'text-[#6E5650] hover:text-[#2B1E1A]'
                        }`}
                      >
                        {method === 'delivery'
                          ? `Home Delivery (${deliveryFeeBdt === 0 ? 'Free' : formatBdt(SHOP_CONFIG.deliveryFeeBdt)})`
                          : 'Studio Pickup (Free)'}
                      </button>
                    );
                  })}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-[#59443E] mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={details.customerName}
                      onChange={(e) => updateField('customerName', e.target.value)}
                      placeholder="e.g., Nusrat Jahan"
                      className="w-full px-3 py-2 text-sm bg-[#FDF9F6] border border-[#E4D1C9] rounded-lg text-[#2B1E1A] focus:outline-none focus:border-[#A64B5D]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#59443E] mb-1">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      value={details.customerPhone}
                      onChange={(e) => updateField('customerPhone', e.target.value)}
                      placeholder="01XXXXXXXXX"
                      className="w-full px-3 py-2 text-sm bg-[#FDF9F6] border border-[#E4D1C9] rounded-lg text-[#2B1E1A] focus:outline-none focus:border-[#A64B5D]"
                    />
                  </div>
                </div>

                {details.fulfillment === 'delivery' && (
                  <div>
                    <label className="block text-xs font-medium text-[#59443E] mb-1">
                      Delivery Address (Dhaka)
                    </label>
                    <input
                      type="text"
                      value={details.deliveryAddress}
                      onChange={(e) => updateField('deliveryAddress', e.target.value)}
                      placeholder="House, Road, Area (e.g., Dhanmondi / Gulshan / Uttara)"
                      className="w-full px-3 py-2 text-sm bg-[#FDF9F6] border border-[#E4D1C9] rounded-lg text-[#2B1E1A] focus:outline-none focus:border-[#A64B5D]"
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-[#59443E] mb-1">
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      value={details.preferredDate}
                      onChange={(e) => updateField('preferredDate', e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-[#FDF9F6] border border-[#E4D1C9] rounded-lg text-[#2B1E1A] focus:outline-none focus:border-[#A64B5D]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#59443E] mb-1">
                      Time Window
                    </label>
                    <select
                      value={details.preferredTime}
                      onChange={(e) => updateField('preferredTime', e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-[#FDF9F6] border border-[#E4D1C9] rounded-lg text-[#2B1E1A] focus:outline-none focus:border-[#A64B5D]"
                    >
                      <option value="Morning (10:00 AM – 1:00 PM)">Morning (10 AM – 1 PM)</option>
                      <option value="Afternoon (2:00 PM – 6:00 PM)">Afternoon (2 PM – 6 PM)</option>
                      <option value="Evening (6:00 PM – 9:00 PM)">Evening (6 PM – 9 PM)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#59443E] mb-1">
                    Special Notes (Candles, Ribbon Color, Instructions)
                  </label>
                  <input
                    type="text"
                    value={details.orderNotes}
                    onChange={(e) => updateField('orderNotes', e.target.value)}
                    placeholder="Optional notes for Nadiya..."
                    className="w-full px-3 py-2 text-sm bg-[#FDF9F6] border border-[#E4D1C9] rounded-lg text-[#2B1E1A] focus:outline-none focus:border-[#A64B5D]"
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Sticky Order Summary Footer inside Drawer */}
        {items.length > 0 && (
          <div className="bg-white border-t border-[#EADAD3] px-6 py-4 space-y-3">
            <div className="space-y-1.5 text-sm">
              <div className="flex items-center justify-between text-[#59443E]">
                <span>Subtotal</span>
                <span className="tabular-nums">{formatBdt(subtotalBdt)}</span>
              </div>
              <div className="flex items-center justify-between text-[#59443E]">
                <span>
                  {details.fulfillment === 'delivery' ? 'Dhaka Home Delivery' : 'Studio Pickup'}
                </span>
                <span className="tabular-nums">
                  {deliveryFeeBdt === 0 ? 'Free' : formatBdt(deliveryFeeBdt)}
                </span>
              </div>
              <div className="pt-2 border-t border-[#F1E4DE] flex items-center justify-between text-base font-semibold text-[#2B1E1A]">
                <span>Total Payable (BDT)</span>
                <span className="tabular-nums">{formatBdt(totalBdt)}</span>
              </div>
            </div>

            <p className="text-[11px] text-[#7D655E]">
              No online payment needed now. Pay via Cash on Delivery or bKash after Nadiya confirms
              your order on WhatsApp.
            </p>

            <div className="flex items-center gap-2">
              <a
                href={whatsappCheckoutUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOrderSubmittedRef(activeOrderRef)}
                className="flex-1 h-12 px-4 inline-flex items-center justify-center gap-2 text-sm font-semibold text-white bg-[#A64B5D] hover:bg-[#8D3B4C] rounded-lg transition-colors whitespace-nowrap shrink-0"
              >
                <MessageCircle className="w-4 h-4 shrink-0" />
                <span>Send Order to WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={handleCopyMessage}
                title="Copy WhatsApp order summary"
                aria-label="Copy WhatsApp order summary"
                className="h-12 px-3.5 inline-flex items-center justify-center gap-1.5 text-xs font-medium text-[#2B1E1A] bg-[#FAF2EE] hover:bg-[#F3E2DA] border border-[#E4CFC7] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                {copiedSummary ? (
                  <>
                    <Check className="w-4 h-4 text-[#9A732C]" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-[#7D655E]" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
