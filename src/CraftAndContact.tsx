import React, { useState } from 'react';
import { Clock, MapPin, MessageCircle, Phone } from 'lucide-react';
import { SHOP_CONFIG } from '../data/cakes';
import {
  buildCustomInquiryMessage,
  buildWhatsAppUrl,
  formatBdt,
} from '../utils/whatsapp';

interface CraftAndContactProps {
  onOpenEditor: () => void;
}

export const CraftAndContact: React.FC<CraftAndContactProps> = ({ onOpenEditor }) => {
  const [customerName, setCustomerName] = useState('');
  const [occasion, setOccasion] = useState('Birthday Celebration');
  const [eventDate, setEventDate] = useState('');
  const [guestCount, setGuestCount] = useState('2 Pounds (12–15 guests)');
  const [flavorPreference, setFlavorPreference] = useState('Pistachio Rosewater');
  const [designNotes, setDesignNotes] = useState('');

  const customInquiryUrl = buildWhatsAppUrl(
    buildCustomInquiryMessage({
      customerName,
      occasion,
      eventDate,
      guestCount,
      flavorPreference,
      designNotes,
    })
  );

  const directChatUrl = buildWhatsAppUrl(
    `Hello ${SHOP_CONFIG.businessName}! I have a question regarding a cake order.`
  );

  return (
    <>
      {/* Section 3: Our Craft & Ordering Process */}
      <section
        id="our-craft"
        className="py-14 sm:py-20 bg-[#FAF3EE] border-y border-[#EADAD3]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            {/* Craftsmanship Narrative */}
            <div className="lg:col-span-5">
              <p className="text-xs font-medium text-[#9A732C]">Artisanal Baking Philosophy</p>
              <h2 className="mt-1 font-serif text-3xl sm:text-4xl font-semibold text-[#2B1E1A] text-balance">
                Baked in Small Batches, Frosted by Hand
              </h2>
              <p className="mt-4 text-sm sm:text-base text-[#59443E] leading-relaxed">
                At {SHOP_CONFIG.businessName}, we balance delicate sweetness with rich natural
                ingredients—pure dairy butter, roasted nuts, seasonal fruit reductions, and
                Belgian dark couverture chocolate.
              </p>

              {/* Attributable Customer Testimonial adjacent to quality claim */}
              <blockquote className="mt-7 p-5 rounded-xl bg-white border border-[#EADAD3]">
                <p className="text-sm text-[#2B1E1A] leading-relaxed italic">
                  “We ordered a 6-pound Champagne Pearl two-tier cake and two pastel cupcake boxes
                  for my sister’s engagement in Dhanmondi. Guests normally leave heavy fondant
                  uneaten, yet every single slice of Nadiya’s pistachio-rose sponge was finished
                  within twenty minutes.”
                </p>
                <footer className="mt-3 text-xs text-[#6E5650]">
                  <strong className="font-semibold text-[#2B1E1A]">Farhana Rahman</strong> · Host
                  &amp; Bride’s Sister, Dhanmondi, Dhaka
                </footer>
              </blockquote>
            </div>

            {/* 3-Step Ordering Guide */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="bg-white rounded-xl border border-[#EADAD3] p-6">
                <span className="text-xs font-semibold text-[#9A732C] tabular-nums">
                  Step 01
                </span>
                <h3 className="mt-2 font-serif text-xl font-semibold text-[#2B1E1A]">
                  Select Size &amp; Flavor
                </h3>
                <p className="mt-2 text-sm text-[#59443E] leading-relaxed">
                  Pick any signature cake, bento box, or cupcake assortment and customize your
                  pound weight, sponge flavor, and piped message.
                </p>
              </div>

              <div className="bg-white rounded-xl border border-[#EADAD3] p-6">
                <span className="text-xs font-semibold text-[#9A732C] tabular-nums">
                  Step 02
                </span>
                <h3 className="mt-2 font-serif text-xl font-semibold text-[#2B1E1A]">
                  Review BDT Summary
                </h3>
                <p className="mt-2 text-sm text-[#59443E] leading-relaxed">
                  Check your itemized total in BDT inside the shopping bag. Dhaka home delivery is{' '}
                  <span className="tabular-nums">{formatBdt(SHOP_CONFIG.deliveryFeeBdt)}</span>{' '}
                  (free above{' '}
                  <span className="tabular-nums">
                    {formatBdt(SHOP_CONFIG.freeDeliveryThresholdBdt)}
                  </span>
                  ).
                </p>
              </div>

              <div className="bg-white rounded-xl border border-[#EADAD3] p-6">
                <span className="text-xs font-semibold text-[#9A732C] tabular-nums">
                  Step 03
                </span>
                <h3 className="mt-2 font-serif text-xl font-semibold text-[#2B1E1A]">
                  Confirm on WhatsApp
                </h3>
                <p className="mt-2 text-sm text-[#59443E] leading-relaxed">
                  Tap once to send your complete order directly to Nadiya on WhatsApp for personal
                  schedule confirmation—no online card required.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Contact & Custom Cake Inquiry */}
      <section id="contact" className="py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            {/* Studio Contact Card */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <p className="text-xs font-medium text-[#9A732C]">Get in Touch</p>
                <h2 className="mt-1 font-serif text-3xl sm:text-4xl font-semibold text-[#2B1E1A] text-balance">
                  Order or Plan a Custom Cake with Nadiya
                </h2>
                <p className="mt-3 text-sm sm:text-base text-[#59443E] leading-relaxed">
                  Have a reference photo, wedding color palette, or special dietary request? Reach
                  out directly on WhatsApp and we will reply promptly with options in BDT.
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-[#EADAD3] p-6 space-y-4">
                <div className="flex items-start gap-3.5">
                  <Phone className="w-4 h-4 text-[#9A732C] mt-1 shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-[#7D655E]">WhatsApp &amp; Direct Line</p>
                    <p className="text-base font-semibold text-[#2B1E1A] tabular-nums">
                      {SHOP_CONFIG.whatsappDisplay}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <MapPin className="w-4 h-4 text-[#9A732C] mt-1 shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-[#7D655E]">Studio &amp; Delivery Area</p>
                    <p className="text-sm font-medium text-[#2B1E1A]">
                      {SHOP_CONFIG.city} · Home Delivery &amp; Studio Pickup
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <Clock className="w-4 h-4 text-[#9A732C] mt-1 shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-[#7D655E]">Order Hours &amp; Notice</p>
                    <p className="text-sm font-medium text-[#2B1E1A]">{SHOP_CONFIG.studioHours}</p>
                    <p className="text-xs text-[#6E5650] mt-0.5">
                      24h notice for signature cakes · 48–72h for tiered designs
                    </p>
                  </div>
                </div>

                <div className="pt-2">
                  <a
                    href={directChatUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full h-11 px-5 inline-flex items-center justify-center gap-2 text-sm font-semibold text-white bg-[#A64B5D] hover:bg-[#8D3B4C] rounded-lg transition-colors whitespace-nowrap shrink-0"
                  >
                    <MessageCircle className="w-4 h-4 shrink-0" />
                    <span className="tabular-nums">
                      Chat on WhatsApp · {SHOP_CONFIG.whatsappDisplay}
                    </span>
                  </a>
                </div>
              </div>
            </div>

            {/* Custom Cake Quote Form -> WhatsApp */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-[#EADAD3] p-6 sm:p-8">
              <h3 className="font-serif text-2xl font-semibold text-[#2B1E1A]">
                Custom Celebration Cake Inquiry
              </h3>
              <p className="mt-1 text-sm text-[#6E5650]">
                Fill in your event details below to send a formatted quote inquiry directly to our
                WhatsApp.
              </p>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#59443E] mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Your full name"
                    className="w-full px-3.5 py-2.5 text-sm bg-[#FDF9F6] border border-[#E4D1C9] rounded-lg text-[#2B1E1A] focus:outline-none focus:border-[#A64B5D]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#59443E] mb-1">
                    Occasion
                  </label>
                  <select
                    value={occasion}
                    onChange={(e) => setOccasion(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-[#FDF9F6] border border-[#E4D1C9] rounded-lg text-[#2B1E1A] focus:outline-none focus:border-[#A64B5D]"
                  >
                    <option value="Birthday Celebration">Birthday Celebration</option>
                    <option value="Wedding / Engagement">Wedding / Engagement</option>
                    <option value="Anniversary">Anniversary</option>
                    <option value="Baby Shower / Bridal Shower">Baby / Bridal Shower</option>
                    <option value="Corporate / Gift Box">Corporate / Gift Box</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#59443E] mb-1">
                    Event Date
                  </label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-[#FDF9F6] border border-[#E4D1C9] rounded-lg text-[#2B1E1A] focus:outline-none focus:border-[#A64B5D]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#59443E] mb-1">
                    Estimated Size / Servings
                  </label>
                  <select
                    value={guestCount}
                    onChange={(e) => setGuestCount(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-[#FDF9F6] border border-[#E4D1C9] rounded-lg text-[#2B1E1A] focus:outline-none focus:border-[#A64B5D]"
                  >
                    <option value="1 Pound (6–8 guests)">1 Pound (6–8 guests)</option>
                    <option value="2 Pounds (12–15 guests)">2 Pounds (12–15 guests)</option>
                    <option value="3–4 Pounds (25–32 guests)">3–4 Pounds (25–32 guests)</option>
                    <option value="Two-Tier 5–8 Pounds (45–75 guests)">
                      Two-Tier 5–8 Pounds (45–75 guests)
                    </option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-[#59443E] mb-1">
                    Preferred Flavor
                  </label>
                  <input
                    type="text"
                    value={flavorPreference}
                    onChange={(e) => setFlavorPreference(e.target.value)}
                    placeholder="e.g., Pistachio Rosewater, Belgian Chocolate, Vanilla Strawberry"
                    className="w-full px-3.5 py-2.5 text-sm bg-[#FDF9F6] border border-[#E4D1C9] rounded-lg text-[#2B1E1A] focus:outline-none focus:border-[#A64B5D]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-[#59443E] mb-1">
                    Theme, Colors &amp; Inscription Notes
                  </label>
                  <textarea
                    rows={3}
                    value={designNotes}
                    onChange={(e) => setDesignNotes(e.target.value)}
                    placeholder="Share your pastel color palette, floral ideas, or message on cake..."
                    className="w-full px-3.5 py-2.5 text-sm bg-[#FDF9F6] border border-[#E4D1C9] rounded-lg text-[#2B1E1A] focus:outline-none focus:border-[#A64B5D]"
                  />
                </div>
              </div>

              <div className="mt-6">
                <a
                  href={customInquiryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-[#2B1E1A] bg-[#F7EFE0] hover:bg-[#EFE2C8] border border-[#DBC49B] rounded-lg transition-colors whitespace-nowrap shrink-0 min-h-11"
                >
                  <MessageCircle className="w-4 h-4 text-[#9A732C] shrink-0" />
                  <span>Send Custom Cake Inquiry via WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quiet Patisserie Footer */}
      <footer className="bg-[#FAF2EE] border-t border-[#E6D4CC] py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <p className="font-serif text-lg font-semibold text-[#2B1E1A]">
              {SHOP_CONFIG.businessName}
            </p>
            <p className="mt-1 text-xs text-[#6E5650]">
              Handcrafted celebration cakes in {SHOP_CONFIG.city} · WhatsApp{' '}
              <span className="tabular-nums">{SHOP_CONFIG.whatsappDisplay}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-xs font-medium text-[#59443E]">
            <a href="#collection" className="hover:text-[#2B1E1A] transition-colors">
              Cake Gallery
            </a>
            <a href="#our-craft" className="hover:text-[#2B1E1A] transition-colors">
              Our Craft
            </a>
            <button
              type="button"
              onClick={onOpenEditor}
              className="hover:text-[#2B1E1A] transition-colors cursor-pointer"
            >
              Edit Catalog
            </button>
            <a
              href={directChatUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#2B1E1A] transition-colors"
            >
              WhatsApp Order
            </a>
          </div>

          <p className="text-xs text-[#7D655E]">
            © {new Date().getFullYear()} {SHOP_CONFIG.businessName}. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
};
