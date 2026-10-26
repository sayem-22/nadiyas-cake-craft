/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import { INITIAL_CAKES } from './data/cakes';
import { CakeProduct, CakeSizeOption, CartItem } from './types/cake';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { CakeGallery } from './components/CakeGallery';
import { ProductDetailView } from './components/ProductDetailView';
import { CartDrawer } from './components/CartDrawer';
import { CatalogEditorModal } from './components/CatalogEditorModal';
import { CraftAndContact } from './components/CraftAndContact';

const CATALOG_STORAGE_KEY = 'nadiyas_cake_craft_catalog_v1';
const CART_STORAGE_KEY = 'nadiyas_cake_craft_cart_v1';

export default function App() {
  const [cakes, setCakes] = useState<CakeProduct[]>(() => {
    try {
      const saved = localStorage.getItem(CATALOG_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Fallback to initial file catalog
    }
    return INITIAL_CAKES;
  });

  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch {
      // Fallback to empty cart
    }
    return [];
  });

  const [selectedCakeId, setSelectedCakeId] = useState<string | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [editorState, setEditorState] = useState<{ open: boolean; cakeId?: string }>({
    open: false,
  });

  useEffect(() => {
    try {
      localStorage.setItem(CATALOG_STORAGE_KEY, JSON.stringify(cakes));
    } catch {
      // Ignore storage quota errors
    }
  }, [cakes]);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch {
      // Ignore storage quota errors
    }
  }, [cartItems]);

  const selectedCake = useMemo(
    () => cakes.find((c) => c.id === selectedCakeId) || null,
    [cakes, selectedCakeId]
  );

  const cartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  const cartSubtotalBdt = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.size.priceBdt * item.quantity, 0),
    [cartItems]
  );

  const handleAddToCart = (params: {
    cake: CakeProduct;
    size: CakeSizeOption;
    flavor: string;
    eggless: boolean;
    customMessage: string;
    quantity: number;
  }) => {
    const { cake, size, flavor, eggless, customMessage, quantity } = params;
    const trimmedMsg = customMessage.trim();
    const compositeKey = `${cake.id}::${size.id}::${flavor}::${eggless}::${trimmedMsg.toLowerCase()}`;

    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.cartItemId === compositeKey);
      if (existingIndex >= 0) {
        return prev.map((item, idx) =>
          idx === existingIndex
            ? {
                ...item,
                cakeName: cake.name,
                cakeImage: cake.image,
                size,
                quantity: item.quantity + quantity,
              }
            : item
        );
      }

      return [
        ...prev,
        {
          cartItemId: compositeKey,
          cakeId: cake.id,
          cakeName: cake.name,
          cakeImage: cake.image,
          size,
          flavor,
          eggless,
          customMessage: trimmedMsg,
          quantity,
        },
      ];
    });

    setCartOpen(true);
  };

  const handleQuickAddCake = (cake: CakeProduct) => {
    const defaultSize = cake.sizes[0] || {
      id: 'default',
      label: '1 Pound',
      servings: '6–8 slices',
      priceBdt: 1500,
    };
    const defaultFlavor = cake.flavors[0] || 'Signature Vanilla';

    handleAddToCart({
      cake,
      size: defaultSize,
      flavor: defaultFlavor,
      eggless: false,
      customMessage: '',
      quantity: 1,
    });
  };

  const handleUpdateQuantity = (cartItemId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveItem = (cartItemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleUpdateCakes = (nextCakes: CakeProduct[]) => {
    setCakes(nextCakes);
    // Keep cart item names, images, and updated size prices synced with catalog edits
    setCartItems((prev) =>
      prev.map((item) => {
        const updatedCake = nextCakes.find((c) => c.id === item.cakeId);
        if (!updatedCake) return item;
        const updatedSize =
          updatedCake.sizes.find((s) => s.id === item.size.id) || item.size;
        return {
          ...item,
          cakeName: updatedCake.name,
          cakeImage: updatedCake.image,
          size: updatedSize,
        };
      })
    );
  };

  const handleResetCakes = () => {
    setCakes(INITIAL_CAKES);
    try {
      localStorage.removeItem(CATALOG_STORAGE_KEY);
    } catch {
      // Ignore
    }
  };

  const handleSelectCake = (cake: CakeProduct) => {
    setSelectedCakeId(cake.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBrowseCollection = () => {
    setSelectedCakeId(null);
    const el = document.getElementById('collection');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FDF9F6] text-[#2B1E1A]">
      <Navbar
        cartCount={cartCount}
        cartSubtotalBdt={cartSubtotalBdt}
        onOpenCart={() => setCartOpen(true)}
        onOpenEditor={() =>
          setEditorState({ open: true, cakeId: selectedCakeId || cakes[0]?.id })
        }
        onNavigateHome={() => setSelectedCakeId(null)}
      />

      <main className="flex-1">
        {selectedCake ? (
          <ProductDetailView
            cake={selectedCake}
            onBack={() => setSelectedCakeId(null)}
            onAddToCart={handleAddToCart}
            onEditCake={(cakeId) => setEditorState({ open: true, cakeId })}
          />
        ) : (
          <>
            <HeroSection onBrowseCollection={handleBrowseCollection} />
            <CakeGallery
              cakes={cakes}
              onSelectCake={handleSelectCake}
              onQuickAddCake={handleQuickAddCake}
              onEditCake={(cakeId) => setEditorState({ open: true, cakeId })}
            />
          </>
        )}

        <CraftAndContact
          onOpenEditor={() =>
            setEditorState({ open: true, cakeId: selectedCakeId || cakes[0]?.id })
          }
        />
      </main>

      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />

      <CatalogEditorModal
        isOpen={editorState.open}
        initialCakeId={editorState.cakeId}
        cakes={cakes}
        onClose={() => setEditorState({ open: false })}
        onUpdateCakes={handleUpdateCakes}
        onResetCakes={handleResetCakes}
      />
    </div>
  );
}
