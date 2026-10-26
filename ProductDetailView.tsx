import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Check,
  MessageCircle,
  Minus,
  Pencil,
  Plus,
  ShoppingBag,
} from 'lucide-react';
import { CakeProduct, CakeSizeOption } from '../types/cake';
import { SHOP_CONFIG } from '../data/cakes';
import {
  buildSingleCakeMessage,
  buildWhatsAppUrl,
  formatBdt,
} from '../utils/whatsapp';
import { ResilientCakeImage } from './ResilientCakeImage';

interface ProductDetailViewProps {
  cake: CakeProduct;
  onBack: () => void;
  onAddToCart: (params: {
    cake: CakeProduct;
    size: CakeSizeOption;
    flavor: string;
    eggless: boolean;
    customMessage: string;
    quantity: number;
  }) => void;
  onEditCake: (cakeId: string) => void;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  cake,
  onBack,
  onAddToCart,
  onEditCake,
}) => {
  const [selectedSizeId, setSelectedSizeId] = useState<string>(cake.sizes[0]?.id || '');
  const [selectedFlavor, setSelectedFlavor] = useState<string>(cake.flavors[0] || 'Classic Vanilla');
  const [eggless, setEggless] = useState<boolean>(false);
  const [customMessage, setCustomMessage] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [justAdded, setJustAdded] = useState<boolean>(false);

  useEffect(() => {
    setSelectedSizeId(cake.sizes[0]?.id || '');
    setSelectedFlavor(cake.flavors[0] || 'Classic Vanilla');
    setEggless(false);
    setCustomMessage('');
    setQuantity(1);
    setJustAdded(false);
  }, [cake]);

  const activeSize: CakeSizeOption =
    cake.sizes.find((s) => s.id === selectedSizeId) ||
    cake.sizes[0] || {
      id: 'default',
      label: '1 Pound',
      servings: '6–8 slices',
      priceBdt: 1500,
    };

  const totalPriceBdt = activeSize.priceBdt * quantity;

  const directOrderWhatsappUrl = buildWhatsAppUrl(
    buildSingleCakeMessage({
      cake,
      size: activeSize,
      flavor: selectedFlavor,
      quantity,
      eggless,
      customMessage,
    })
  );

  const handleAdd = () => {
    onAddToCart({
      cake,
      size: activeSize,
      flavor: selectedFlavor,
      eggless,
      customMessage,
      quantity,
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2200);
  };

  return (
    <section className="py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Breadcrumb & Owner Edit Action */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#EADAD3]">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 text-sm font-medium text-[#59443E] hover:text-[#2B1E1A] transition-colors whitespace-nowrap shrink-0 min-h-10 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 shrink-0" />
            <span>Back to Cake Gallery</span>
          </button>

          <button
            type="button"
            onClick={() => onEditCake(cake.id)}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-[#59443E] hover:text-[#2B1E1A] bg-[#FAF2EE] hover:bg-[#F3E3DC] border border-[#E4CFC7] rounded-lg transition-colors whitespace-nowrap shrink-0 min-h-10 cursor-pointer"
          >
            <Pencil className="w-3.5 h-3.5 text-[#9A732C] shrink-0" />
            <span>Edit Cake Name, Photo or Prices</span>
          </button>
        </div>

        {/* 2-Column Sticky Gallery + Contiguous Purchase Module */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Product Photography & Care Notes */}
          <div className="lg:col-span-6 lg:sticky lg:top-24 space-y-6">
            <div className="rounded-2xl overflow-hidden border border-[#E7D4CD] bg-[#FAF3EE] p-2 sm:p-3">
              <div className="aspect-[4/3] w-full overflow-hidden rounded-xl">
                <ResilientCakeImage
                  src={cake.image}
                  alt={cake.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 rounded-xl border border-[#EADAD3] bg-white p-5">
              <div>
                <p className="text-xs font-semibold text-[#9A732C]">Preparation</p>
                <p className="mt-1 text-xs text-[#59443E] leading-relaxed">
                  Baked fresh to order ({cake.leadTime}).
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#9A732C]">Serving Tip</p>
                <p className="mt-1 text-xs text-[#59443E] leading-relaxed">
                  Let rest at room temperature 20 mins before slicing.
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#9A732C]">Payment</p>
                <p className="mt-1 text-xs text-[#59443E] leading-relaxed">
                  Cash on Delivery or bKash via WhatsApp.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Contiguous Purchase Module */}
          <div className="lg:col-span-6 bg-white rounded-2xl border border-[#EADAD3] p-6 sm:p-8">
            {/* Unboxed Metadata */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#7D655E]">
              <span className="uppercase tracking-wider font-medium text-[#9A732C]">
                {cake.category}
              </span>
              <span aria-hidden="true">·</span>
              <span>{cake.leadTime}</span>
              <span aria-hidden="true">·</span>
              <span>Made to Order in Dhaka</span>
            </div>

            <h1 className="mt-2 font-serif text-3xl sm:text-4xl font-semibold text-[#2B1E1A] leading-tight text-balance">
              {cake.name}
            </h1>

            {/* Dynamic BDT Price Display */}
            <div className="mt-4 pb-5 border-b border-[#F1E4DE] flex items-baseline justify-between gap-4">
              <div>
                <span className="text-2xl sm:text-3xl font-semibold text-[#2B1E1A] tabular-nums">
                  {formatBdt(totalPriceBdt)}
                </span>
                {quantity > 1 && (
                  <span className="ml-2 text-xs text-[#7D655E] tabular-nums">
                    ({formatBdt(activeSize.priceBdt)} each)
                  </span>
                )}
              </div>
              <span className="text-xs text-[#6E5650] tabular-nums">{activeSize.servings}</span>
            </div>

            <p className="mt-5 text-sm sm:text-base text-[#59443E] leading-relaxed">
              {cake.description}
            </p>

            {/* 1. Size & Weight Selector */}
            <div className="mt-7">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-[#2B1E1A]">
                  1. Choose Size &amp; Weight
                </label>
                <span className="text-xs text-[#7D655E]">Prices in BDT</span>
              </div>

              <div className="mt-2.5 grid grid-cols-1 gap-2.5">
                {cake.sizes.map((size) => {
                  const isSelected = size.id === activeSize.id;
                  return (
                    <button
                      key={size.id}
                      type="button"
                      onClick={() => setSelectedSizeId(size.id)}
                      className={`w-full flex items-center justify-between gap-4 px-4 py-3 rounded-xl border text-left transition-colors cursor-pointer ${
                        isSelected
                          ? 'border-[#A64B5D] bg-[#FCF3F5] text-[#2B1E1A]'
                          : 'border-[#E6D4CC] bg-white hover:bg-[#FAF4F0] text-[#59443E]'
                      }`}
                    >
                      <div>
                        <span className="block text-sm font-medium text-[#2B1E1A]">
                          {size.label}
                        </span>
                        <span className="block text-xs text-[#7D655E]">{size.servings}</span>
                      </div>
                      <span className="text-sm font-semibold text-[#2B1E1A] tabular-nums whitespace-nowrap shrink-0">
                        {formatBdt(size.priceBdt)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Flavor Selector */}
            <div className="mt-6">
              <label className="block text-sm font-semibold text-[#2B1E1A]">
                2. Select Cake Flavor
              </label>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {cake.flavors.map((flavor) => {
                  const isSelected = flavor === selectedFlavor;
                  return (
                    <button
                      key={flavor}
                      type="button"
                      onClick={() => setSelectedFlavor(flavor)}
                      className={`px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 min-h-10 cursor-pointer ${
                        isSelected
                          ? 'border-[#A64B5D] bg-[#A64B5D] text-white'
                          : 'border-[#E5D3CB] bg-[#FAF4F0] hover:bg-[#F3E5DE] text-[#2B1E1A]'
                      }`}
                    >
                      {flavor}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Custom Message & Eggless Toggle */}
            <div className="mt-6 space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="cake-custom-message"
                    className="text-sm font-semibold text-[#2B1E1A]"
                  >
                    3. Custom Message on Cake (Optional)
                  </label>
                  <span className="text-xs text-[#7D655E] tabular-nums">
                    {customMessage.length}/50
                  </span>
                </div>
                <input
                  id="cake-custom-message"
                  type="text"
                  maxLength={50}
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder='e.g., "Happy Birthday Amina!"'
                  className="mt-2 w-full px-3.5 py-2.5 text-sm bg-[#FDF9F6] border border-[#E4D1C9] rounded-lg text-[#2B1E1A] placeholder:text-[#8E7770] focus:outline-none focus:border-[#A64B5D]"
                />
              </div>

              {cake.egglessAvailable && (
                <label className="flex items-center gap-3 p-3 rounded-lg border border-[#ECE0DA] bg-[#FDF9F6] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={eggless}
                    onChange={(e) => setEggless(e.target.checked)}
                    className="w-4 h-4 accent-[#A64B5D] rounded"
                  />
                  <span className="text-sm text-[#2B1E1A]">
                    Prepare as <strong>100% Eggless Sponge</strong> (no extra charge)
                  </span>
                </label>
              )}
            </div>

            {/* 4. Quantity & Primary Purchase Buttons */}
            <div className="mt-8 pt-6 border-t border-[#F1E4DE] space-y-3">
              <div className="flex items-center gap-3">
                {/* Quantity Stepper */}
                <div className="inline-flex items-center rounded-lg border border-[#E4D1C9] bg-[#FDF9F6] h-12 shrink-0">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                    className="w-11 h-full inline-flex items-center justify-center text-[#59443E] hover:text-[#2B1E1A] cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-9 text-center text-sm font-semibold text-[#2B1E1A] tabular-nums">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    aria-label="Increase quantity"
                    className="w-11 h-full inline-flex items-center justify-center text-[#59443E] hover:text-[#2B1E1A] cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Add to Shopping Bag CTA */}
                <button
                  type="button"
                  onClick={handleAdd}
                  className="flex-1 h-12 px-5 inline-flex items-center justify-center gap-2 text-sm font-semibold text-white bg-[#A64B5D] hover:bg-[#8D3B4C] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {justAdded ? (
                    <>
                      <Check className="w-4 h-4 shrink-0" />
                      <span>Added to Bag</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4 shrink-0" />
                      <span className="tabular-nums">Add to Bag · {formatBdt(totalPriceBdt)}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Instant Direct WhatsApp Order CTA */}
              <a
                href={directOrderWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-12 px-5 inline-flex items-center justify-center gap-2 text-sm font-semibold text-[#2B1E1A] bg-[#FAF2EE] hover:bg-[#F3E3DC] border border-[#DEC6BC] rounded-lg transition-colors whitespace-nowrap shrink-0"
              >
                <MessageCircle className="w-4 h-4 text-[#9A732C] shrink-0" />
                <span className="tabular-nums">
                  Order Now on WhatsApp ({SHOP_CONFIG.whatsappDisplay})
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
