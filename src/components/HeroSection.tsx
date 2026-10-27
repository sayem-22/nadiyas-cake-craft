import React from 'react';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { SHOP_CONFIG } from '../data/cakes';
import { buildWhatsAppUrl } from '../utils/whatsapp';
import { ResilientCakeImage } from './ResilientCakeImage';

interface HeroSectionProps {
  onBrowseCollection: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onBrowseCollection }) => {
  const directWhatsappUrl = buildWhatsAppUrl(
    `Hello ${SHOP_CONFIG.businessName}! I visited your website and would love to order a cake.`
  );

  return (
    <section className="pt-8 pb-12 sm:pt-12 sm:pb-16 border-b border-[#EADAD3] bg-gradient-to-b from-[#FCF4F5] via-[#FDF9F6] to-[#FDF9F6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 2-Column Balanced Split Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* Left Column: Editorial Story & Primary CTA */}
          <div className="lg:col-span-6 flex flex-col justify-center py-2 lg:py-6">
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-[#8C6830] mb-4">
              <span>{SHOP_CONFIG.city}</span>
              <span aria-hidden="true">·</span>
              <span>Handcrafted Small-Batch Patisserie</span>
              <span aria-hidden="true">·</span>
              <span>Made to Order</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-[3.35rem] font-semibold tracking-tight text-[#2B1E1A] leading-[1.12] text-balance">
              Bespoke Celebration Cakes in Pastel Cream &amp; Soft Gold
            </h1>

            <p className="mt-5 text-base sm:text-lg text-[#59443E] leading-relaxed max-w-xl">
              From intimate pastel bento boxes to tiered wedding centerpieces, every sponge at{' '}
              <span className="font-medium text-[#2B1E1A]">{SHOP_CONFIG.businessName}</span> is
              baked fresh to your flavor, weight, and custom message—with effortless ordering over
              WhatsApp.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <button
                type="button"
                onClick={onBrowseCollection}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-[#A64B5D] hover:bg-[#8D3B4C] rounded-lg transition-colors whitespace-nowrap shrink-0 min-h-11 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A64B5D]"
              >
                <span>Explore Cake Gallery</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </button>

              <a
                href={directWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-medium text-[#2B1E1A] bg-white hover:bg-[#FAF1EE] border border-[#DFC7BE] rounded-lg transition-colors whitespace-nowrap shrink-0 min-h-11"
              >
                <MessageCircle className="w-4 h-4 text-[#9A732C] shrink-0" />
                <span className="tabular-nums">WhatsApp · {SHOP_CONFIG.whatsappDisplay}</span>
              </a>
            </div>
          </div>

          {/* Right Column: Studio Showcase Photography */}
          <div className="lg:col-span-6">
            <div className="relative h-full min-h-[300px] sm:min-h-[380px] rounded-2xl overflow-hidden border border-[#E7D4CD] bg-[#FAF3EE] p-2 sm:p-3">
              <div className="relative h-full w-full overflow-hidden rounded-xl">
                <ResilientCakeImage
                  src={SHOP_CONFIG.heroImage}
                  alt="Two-tier pastel pink, warm cream, and edible gold leaf celebration cake on a brushed brass stand"
                  className="w-full h-full object-cover aspect-[4/3] lg:aspect-auto"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent px-5 py-4 flex items-end justify-between gap-4 text-white">
                  <div>
                    <p className="text-xs text-white/85">Signature Studio Piece</p>
                    <p className="font-serif text-base sm:text-lg font-medium">
                      Blush Rose &amp; 24k Gold Leaf Tiered Cake
                    </p>
                  </div>
                  <span className="text-xs font-medium text-[#F7E3B5] whitespace-nowrap shrink-0 tabular-nums">
                    Custom Sizes Available
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Full-Width 4-Column Patisserie Assurance Strip Below Hero Split */}
        <div className="mt-10 pt-8 border-t border-[#EADAD3] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <p className="text-xs font-semibold text-[#9A732C] tabular-nums">01. Freshly Baked</p>
            <p className="mt-1 text-sm font-medium text-[#2B1E1A]">100% Made-to-Order Sponge</p>
            <p className="mt-1 text-xs text-[#6E5650] leading-relaxed">
              Prepared fresh for your celebration date using pure butter and couverture chocolate.
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#9A732C] tabular-nums">02. Tailored to You</p>
            <p className="mt-1 text-sm font-medium text-[#2B1E1A]">Custom Sizes, Flavors &amp; Notes</p>
            <p className="mt-1 text-xs text-[#6E5650] leading-relaxed">
              Select pound weights, filling flavors, eggless options, and custom piped inscriptions.
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#9A732C] tabular-nums">03. BDT Pricing</p>
            <p className="mt-1 text-sm font-medium text-[#2B1E1A]">No Online Card Fees Required</p>
            <p className="mt-1 text-xs text-[#6E5650] leading-relaxed">
              Transparent pricing in Bangladeshi Taka with Cash on Delivery or bKash confirmation.
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#9A732C] tabular-nums">04. Direct Care</p>
            <p className="mt-1 text-sm font-medium text-[#2B1E1A]">Instant WhatsApp Ordering</p>
            <p className="mt-1 text-xs text-[#6E5650] leading-relaxed">
              Send your itemized cart directly to {SHOP_CONFIG.whatsappDisplay} in one tap.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
