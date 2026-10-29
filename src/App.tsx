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
import { AdminLogin } from './components/AdminLogin';
import { ResetPassword } from './components/ResetPassword';
import { supabase } from './lib/supabase';

const CATALOG_STORAGE_KEY = 'nadiyas_cake_craft_catalog_v1';
const CART_STORAGE_KEY = 'nadiyas_cake_craft_cart_v1';
const ADMIN_UID = 'a0c21275-4e48-41bf-b05e-4006faec9869';

function isRecoveryUrl() {
  const hash = window.location.hash;
  const params = new URLSearchParams(window.location.search);

  return (
    hash.includes('type=recovery') ||
    params.get('type') === 'recovery'
  );
}

export default function App() {
  const [cakes, setCakes] = useState<CakeProduct[]>(INITIAL_CAKES);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedCakeId, setSelectedCakeId] = useState<string | null>(null);
  const [cartOpen, setCartOpen] = useState(false);

  const [editorState, setEditorState] = useState<{
    open: boolean;
    cakeId?: string;
  }>({ open: false });

  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [catalogLoaded, setCatalogLoaded] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

  const [isPasswordRecovery, setIsPasswordRecovery] =
    useState(isRecoveryUrl);

  // Restore the cart on this device.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setCartItems(parsed);
      }
    } catch {
      // Ignore invalid local cart data.
    }
  }, []);

  // Save the cart locally.
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch {
      // Ignore local storage errors.
    }
  }, [cartItems]);

  // Detect password recovery and check the admin session.
  useEffect(() => {
    let active = true;

    async function checkSession() {
      const { data } = await supabase.auth.getSession();

      if (!active) return;

      const user = data.session?.user;

      setIsAdmin(user?.id === ADMIN_UID);

      if (isRecoveryUrl()) {
        setIsPasswordRecovery(true);
      }
    }

    void checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!active) return;

      const user = session?.user;
      setIsAdmin(user?.id === ADMIN_UID);

      if (event === 'PASSWORD_RECOVERY' || isRecoveryUrl()) {
        setIsPasswordRecovery(true);
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  // Load the shared cake catalog.
  useEffect(() => {
    let active = true;

    async function loadCatalog() {
      const { data, error } = await supabase
        .from('site_catalog')
        .select('cakes')
        .eq('id', 1)
        .maybeSingle();

      if (!active) return;

      if (!error && Array.isArray(data?.cakes) && data.cakes.length > 0) {
        setCakes(data.cakes as CakeProduct[]);
      } else {
        setCakes(INITIAL_CAKES);
      }

      setCatalogLoaded(true);
    }

    void loadCatalog();

    return () => {
      active = false;
    };
  }, []);

  // Keep a local backup of the catalog.
  useEffect(() => {
    if (!catalogLoaded) return;

    try {
      localStorage.setItem(CATALOG_STORAGE_KEY, JSON.stringify(cakes));
    } catch {
      // Ignore storage quota errors.
    }
  }, [cakes, catalogLoaded]);

  const selectedCake = useMemo(
    () => cakes.find((cake) => cake.id === selectedCakeId) || null,
    [cakes, selectedCakeId]
  );

  const cartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  const cartSubtotalBdt = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) => sum + item.size.priceBdt * item.quantity,
        0
      ),
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
    const compositeKey =
      `${cake.id}::${size.id}::${flavor}::${eggless}::${trimmedMsg.toLowerCase()}`;

    setCartItems((previous) => {
      const existingIndex = previous.findIndex(
        (item) => item.cartItemId === compositeKey
      );

      if (existingIndex >= 0) {
        return previous.map((item, index) =>
          index === existingIndex
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
        ...previous,
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

    handleAddToCart({
      cake,
      size: defaultSize,
      flavor: cake.flavors[0] || 'Signature Vanilla',
      eggless: false,
      customMessage: '',
      quantity: 1,
    });
  };

  const handleUpdateQuantity = (cartItemId: string, delta: number) => {
    setCartItems((previous) =>
      previous
        .map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveItem = (cartItemId: string) => {
    setCartItems((previous) =>
      previous.filter((item) => item.cartItemId !== cartItemId)
    );
  };

  const handleClearCart = () => setCartItems([]);

  // Update cakes and keep existing cart details in sync.
  const handleUpdateCakes = (nextCakes: CakeProduct[]) => {
    if (!isAdmin) {
      setShowAdminLogin(true);
      return;
    }

    setCakes(nextCakes);

    setCartItems((previous) =>
      previous.map((item) => {
        const updatedCake = nextCakes.find(
          (cake) => cake.id === item.cakeId
        );

        if (!updatedCake) return item;

        const updatedSize =
          updatedCake.sizes.find((size) => size.id === item.size.id) ||
          item.size;

        return {
          ...item,
          cakeName: updatedCake.name,
          cakeImage: updatedCake.image,
          size: updatedSize,
        };
      })
    );

    setSaveStatus('পরিবর্তন সেভ হচ্ছে…');
  };

  // Save catalog changes online.
  useEffect(() => {
    if (!isAdmin || !catalogLoaded) return;

    const timeout = window.setTimeout(async () => {
      setSaveStatus('অনলাইনে সেভ হচ্ছে…');

      const { error } = await supabase.from('site_catalog').upsert(
        {
          id: 1,
          cakes,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'id' }
      );

      if (error) {
        setSaveStatus('সেভ হয়নি। সংযোগ বা Supabase policy পরীক্ষা করুন।');
        console.error('Catalog save error:', error.message);
      } else {
        setSaveStatus('অনলাইনে সেভ হয়েছে ✓');
      }
    }, 1000);

    return () => window.clearTimeout(timeout);
  }, [cakes, isAdmin, catalogLoaded]);

  const handleResetCakes = () => {
    if (!isAdmin) {
      setShowAdminLogin(true);
      return;
    }

    handleUpdateCakes(INITIAL_CAKES);
  };

  const handleSelectCake = (cake: CakeProduct) => {
    setSelectedCakeId(cake.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBrowseCollection = () => {
    setSelectedCakeId(null);
    document.getElementById('collection')?.scrollIntoView({
      behavior: 'smooth',
    });
  };

  const openEditor = (cakeId?: string) => {
    if (!isAdmin) {
      setShowAdminLogin(true);
      return;
    }

    setEditorState({
      open: true,
      cakeId: cakeId || selectedCakeId || cakes[0]?.id,
    });
  };

  const handleLoginSuccess = () => {
    setShowAdminLogin(false);
    setSaveStatus('');
  };

  const handlePasswordResetCancel = () => {
    setIsPasswordRecovery(false);
    window.history.replaceState(
      {},
      document.title,
      window.location.pathname
    );
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAdmin(false);
    setEditorState({ open: false });
    setSaveStatus('');
  };

  // Show the password form when the recovery link is opened.
  if (isPasswordRecovery) {
    return <ResetPassword onCancel={handlePasswordResetCancel} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FDF9F6] text-[#2B1E1A]">
      <Navbar
        cartCount={cartCount}
        cartSubtotalBdt={cartSubtotalBdt}
        onOpenCart={() => setCartOpen(true)}
        onOpenEditor={() => openEditor()}
        onNavigateHome={() => setSelectedCakeId(null)}
      />

      <div className="flex items-center justify-end gap-3 px-4 py-2 text-sm">
        {saveStatus && (
          <span role="status" className="text-gray-600">
            {saveStatus}
          </span>
        )}

        {isAdmin ? (
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg border border-pink-300 px-3 py-2 text-pink-700"
          >
            Admin Logout
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setShowAdminLogin(true)}
            className="rounded-lg border border-pink-300 px-3 py-2 text-pink-700"
          >
            Admin Login
          </button>
        )}
      </div>

      <main className="flex-1">
        {selectedCake ? (
          <ProductDetailView
            cake={selectedCake}
            onBack={() => setSelectedCakeId(null)}
            onAddToCart={handleAddToCart}
            onEditCake={(cakeId) => openEditor(cakeId)}
          />
        ) : (
          <>
            <HeroSection onBrowseCollection={handleBrowseCollection} />
            <CakeGallery
              cakes={cakes}
              onSelectCake={handleSelectCake}
              onQuickAddCake={handleQuickAddCake}
              onEditCake={(cakeId) => openEditor(cakeId)}
            />
          </>
        )}

        <CraftAndContact onOpenEditor={() => openEditor()} />
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
        isOpen={editorState.open && isAdmin}
        initialCakeId={editorState.cakeId}
        cakes={cakes}
        onClose={() => setEditorState({ open: false })}
        onUpdateCakes={handleUpdateCakes}
        onResetCakes={handleResetCakes}
      />

      {showAdminLogin && (
        <AdminLogin
          onLoginSuccess={handleLoginSuccess}
          onCancel={() => setShowAdminLogin(false)}
        />
      )}
    </div>
  );
}
