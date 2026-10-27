import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, Pencil } from 'lucide-react';
import { CakeCategory, CakeProduct } from '../types/cake';
import { formatBdt, getStartingPrice } from '../utils/whatsapp';
import { ResilientCakeImage } from './ResilientCakeImage';

interface CakeGalleryProps {
  cakes: CakeProduct[];
  onSelectCake: (cake: CakeProduct) => void;
  onQuickAddCake: (cake: CakeProduct) => void;
  onEditCake: (cakeId: string) => void;
}

const CATEGORIES: Array<'All Cakes' | CakeCategory> = [
  'All Cakes',
  'Signature Cakes',
  'Bento & Mini',
  'Tiered & Wedding',
  'Cupcake Boxes',
];

type SortOption = 'featured' | 'price-asc' | 'price-desc';

export const CakeGallery: React.FC<CakeGalleryProps> = ({
  cakes,
  onSelectCake,
  onQuickAddCake,
  onEditCake,
}) => {
  const [activeCategory, setActiveCategory] = useState<'All Cakes' | CakeCategory>('All Cakes');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('featured');

  const filteredCakes = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    const matches = cakes.filter((cake) => {
      const categoryMatch = activeCategory === 'All Cakes' || cake.category === activeCategory;
      if (!categoryMatch) return false;
      if (!q) return true;

      const inName = cake.name.toLowerCase().includes(q);
      const inDesc = cake.description.toLowerCase().includes(q);
      const inFlavors = cake.flavors.some((f) => f.toLowerCase().includes(q));
      return inName || inDesc || inFlavors;
    });

    if (sortBy === 'price-asc') {
      return [...matches].sort((a, b) => getStartingPrice(a) - getStartingPrice(b));
    }
    if (sortBy === 'price-desc') {
      return [...matches].sort((a, b) => getStartingPrice(b) - getStartingPrice(a));
    }
    return matches;
  }, [cakes, activeCategory, searchQuery, sortBy]);

  return (
    <section id="collection" className="py-14 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading & Edit Shortcut */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-[#EADAD3]">
          <div>
            <p className="text-xs font-medium text-[#9A732C]">Curated Patisserie Menu</p>
            <h2 className="mt-1 font-serif text-3xl sm:text-4xl font-semibold text-[#2B1E1A] text-balance">
              Signature Cake Gallery
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[#59443E] max-w-2xl">
              Select any creation below to choose your pound size, sponge flavor, and custom cake
              message, or add directly to your WhatsApp order bag.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onEditCake(cakes[0]?.id || '')}
            className="self-start md:self-auto inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-[#59443E] hover:text-[#2B1E1A] bg-[#FAF2EE] hover:bg-[#F4E5DF] border border-[#E4CFC7] rounded-lg transition-colors whitespace-nowrap shrink-0 min-h-10 cursor-pointer"
          >
            <Pencil className="w-3.5 h-3.5 text-[#9A732C] shrink-0" />
            <span>Edit Cakes, Photos &amp; BDT Prices</span>
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="mt-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Interactive Segmented Category Tabs */}
          <div
            role="tablist"
            aria-label="Cake categories"
            className="flex items-center gap-1 p-1 bg-[#F6ECE7] rounded-lg overflow-x-auto"
          >
            {CATEGORIES.map((category) => {
              const isActive = activeCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveCategory(category)}
                  className={`px-3.5 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-white text-[#2B1E1A] shadow-xs'
                      : 'text-[#6E5650] hover:text-[#2B1E1A]'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>

          {/* Search & Sort Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-[#7D655E] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search flavor or cake..."
                aria-label="Search cakes by name or flavor"
                className="w-full pl-9 pr-3.5 py-2 text-sm bg-white border border-[#E4D1C9] rounded-lg text-[#2B1E1A] placeholder:text-[#8E7770] focus:outline-none focus:border-[#A64B5D] min-h-10"
              />
            </div>

            <div className="relative flex items-center">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#7D655E] absolute left-3 pointer-events-none" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                aria-label="Sort cakes"
                className="w-full sm:w-auto pl-8 pr-8 py-2 text-sm bg-white border border-[#E4D1C9] rounded-lg text-[#2B1E1A] focus:outline-none focus:border-[#A64B5D] min-h-10 cursor-pointer"
              >
                <option value="featured">Sort: Featured</option>
                <option value="price-asc">Price: Low to High (BDT)</option>
                <option value="price-desc">Price: High to Low (BDT)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-4 flex items-center justify-between text-xs text-[#6E5650]">
          <span className="tabular-nums">
            Showing {filteredCakes.length} of {cakes.length} handcrafted cakes
          </span>
          <span>All prices in Bangladeshi Taka (BDT)</span>
        </div>

        {/* 3-Column Product Grid */}
        {filteredCakes.length === 0 ? (
          <div className="mt-8 rounded-xl border border-[#EADAD3] bg-white p-12 text-center">
            <p className="font-serif text-xl font-medium text-[#2B1E1A]">
              No cakes match your current search
            </p>
            <p className="mt-2 text-sm text-[#6E5650] max-w-md mx-auto">
              Try clearing your search term or viewing all categories—or send us a custom flavor
              request on WhatsApp.
            </p>
            <button
              type="button"
              onClick={() => {
                setActiveCategory('All Cakes');
                setSearchQuery('');
                setSortBy('featured');
              }}
              className="mt-5 px-5 py-2.5 text-sm font-medium text-white bg-[#A64B5D] hover:bg-[#8D3B4C] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 lg:gap-8">
            {filteredCakes.map((cake) => {
              const startingPrice = getStartingPrice(cake);
              return (
                <article
                  key={cake.id}
                  className="group bg-white rounded-xl border border-[#EADAD3] overflow-hidden flex flex-col transition-transform duration-200 hover:-translate-y-0.5"
                >
                  {/* 4:3 Uniform Product Image */}
                  <div
                    onClick={() => onSelectCake(cake)}
                    className="relative aspect-[4/3] w-full overflow-hidden bg-[#FAF3EE] cursor-pointer"
                  >
                    <ResilientCakeImage
                      src={cake.image}
                      alt={cake.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  </div>

                  {/* Card Body with Uniform Field Order */}
                  <div className="p-5 sm:p-6 flex-1 flex flex-col">
                    {/* Unboxed Metadata (Zero Pills) */}
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#7D655E]">
                      <div className="flex items-center gap-1.5">
                        <span className="uppercase tracking-wider text-[11px] font-medium text-[#9A732C]">
                          {cake.category}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{cake.leadTime}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => onEditCake(cake.id)}
                        className="text-xs text-[#7D655E] hover:text-[#A64B5D] underline-offset-4 hover:underline transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        Edit
                      </button>
                    </div>

                    {/* Cake Title */}
                    <h3 className="mt-2 font-serif text-xl font-semibold text-[#2B1E1A] leading-snug">
                      <button
                        type="button"
                        onClick={() => onSelectCake(cake)}
                        className="text-left hover:text-[#A64B5D] transition-colors cursor-pointer"
                      >
                        {cake.name}
                      </button>
                    </h3>

                    {/* Description */}
                    <p className="mt-2 text-sm text-[#59443E] leading-relaxed line-clamp-2">
                      {cake.description}
                    </p>

                    {/* Sizes & Flavors Quiet Metadata */}
                    <div className="mt-3 text-xs text-[#7D655E] tabular-nums">
                      <span>{cake.sizes.length} sizes</span>
                      <span className="mx-1.5" aria-hidden="true">
                        ·
                      </span>
                      <span>{cake.flavors.length} flavors</span>
                      {cake.egglessAvailable && (
                        <>
                          <span className="mx-1.5" aria-hidden="true">
                            ·
                          </span>
                          <span>Eggless available</span>
                        </>
                      )}
                    </div>

                    {/* Aligned Baseline Price & Actions */}
                    <div className="mt-auto pt-5 flex items-center justify-between gap-3 border-t border-[#F2E6E0]">
                      <div>
                        <span className="block text-[11px] text-[#7D655E]">Starting from</span>
                        <span className="text-base font-semibold text-[#2B1E1A] tabular-nums">
                          {formatBdt(startingPrice)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => onQuickAddCake(cake)}
                          className="px-3 py-2 text-xs font-medium text-[#2B1E1A] bg-[#FAF2EE] hover:bg-[#F3E2DA] border border-[#E5D1C8] rounded-lg transition-colors whitespace-nowrap shrink-0 min-h-10 cursor-pointer"
                        >
                          Quick Add
                        </button>
                        <button
                          type="button"
                          onClick={() => onSelectCake(cake)}
                          className="px-3.5 py-2 text-xs font-semibold text-white bg-[#A64B5D] hover:bg-[#8D3B4C] rounded-lg transition-colors whitespace-nowrap shrink-0 min-h-10 cursor-pointer"
                        >
                          Customize
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
