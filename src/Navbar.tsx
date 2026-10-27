import React, { useState } from 'react';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { SHOP_CONFIG } from '../data/cakes';
import { formatBdt } from '../utils/whatsapp';

interface NavbarProps {
  cartCount: number;
  cartSubtotalBdt: number;
  onOpenCart: () => void;
  onOpenEditor: () => void;
  onNavigateHome: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  cartSubtotalBdt,
  onOpenCart,
  onOpenEditor,
  onNavigateHome,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSectionJump = (hash: string) => {
    onNavigateHome();
    setMobileMenuOpen(false);
    setTimeout(() => {
      const el = document.getElementById(hash);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 40);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FDF9F6]/95 backdrop-blur-md border-b border-[#EADAD3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <button
          type="button"
          onClick={() => {
            onNavigateHome();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="font-serif text-lg sm:text-xl font-semibold tracking-tight text-[#2B1E1A] hover:text-[#A64B5D] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#A64B5D] cursor-pointer"
        >
          {SHOP_CONFIG.businessName}
        </button>

        {/* Zone 2: 4 concise single-line navigation links */}
        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-[#59443E]"
        >
          <button
            type="button"
            onClick={() => handleSectionJump('collection')}
            className="hover:text-[#2B1E1A] underline-offset-8 hover:underline transition-colors whitespace-nowrap shrink-0 py-1 cursor-pointer"
          >
            Collection
          </button>
          <button
            type="button"
            onClick={() => handleSectionJump('our-craft')}
            className="hover:text-[#2B1E1A] underline-offset-8 hover:underline transition-colors whitespace-nowrap shrink-0 py-1 cursor-pointer"
          >
            Our Craft
          </button>
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenEditor();
            }}
            className="hover:text-[#2B1E1A] underline-offset-8 hover:underline transition-colors whitespace-nowrap shrink-0 py-1 cursor-pointer"
          >
            Edit Catalog
          </button>
          <button
            type="button"
            onClick={() => handleSectionJump('contact')}
            className="hover:text-[#2B1E1A] underline-offset-8 hover:underline transition-colors whitespace-nowrap shrink-0 py-1 cursor-pointer"
          >
            Contact
          </button>
        </nav>

        {/* Zone 3: 1 primary action (plus mobile menu trigger on small screens) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenCart}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-medium text-white bg-[#A64B5D] hover:bg-[#8D3B4C] rounded-lg transition-colors whitespace-nowrap shrink-0 min-h-10 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A64B5D]"
          >
            <ShoppingBag className="w-4 h-4 shrink-0" />
            <span className="tabular-nums">
              {cartCount > 0
                ? `Bag (${cartCount}) · ${formatBdt(cartSubtotalBdt)}`
                : 'Shopping Bag (0)'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-[#E6D3CB] text-[#2B1E1A] hover:bg-[#FAF1EE] transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#EADAD3] bg-[#FDF9F6] px-4 py-4 space-y-1">
          <button
            type="button"
            onClick={() => handleSectionJump('collection')}
            className="block w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-[#2B1E1A] hover:bg-[#F8E7EA] transition-colors"
          >
            Collection
          </button>
          <button
            type="button"
            onClick={() => handleSectionJump('our-craft')}
            className="block w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-[#2B1E1A] hover:bg-[#F8E7EA] transition-colors"
          >
            Our Craft
          </button>
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenEditor();
            }}
            className="block w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-[#2B1E1A] hover:bg-[#F8E7EA] transition-colors"
          >
            Edit Catalog (Names, Photos & BDT Prices)
          </button>
          <button
            type="button"
            onClick={() => handleSectionJump('contact')}
            className="block w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-[#2B1E1A] hover:bg-[#F8E7EA] transition-colors"
          >
            Contact & Custom Orders
          </button>
        </div>
      )}
    </header>
  );
};
