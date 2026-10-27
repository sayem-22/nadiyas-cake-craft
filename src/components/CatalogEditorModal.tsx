import React, { useState, useEffect, useRef } from 'react';
import {
  Check,
  Copy,
  Download,
  Plus,
  RotateCcw,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import { CakeCategory, CakeProduct, CakeSizeOption } from '../types/cake';
import { STUDIO_IMAGE_PRESETS } from '../data/cakes';
import { formatBdt, generateCakesTsSource, getStartingPrice } from '../utils/whatsapp';
import { ResilientCakeImage } from './ResilientCakeImage';

interface CatalogEditorModalProps {
  isOpen: boolean;
  initialCakeId?: string;
  cakes: CakeProduct[];
  onClose: () => void;
  onUpdateCakes: (nextCakes: CakeProduct[]) => void;
  onResetCakes: () => void;
}

const CATEGORY_OPTIONS: CakeCategory[] = [
  'Signature Cakes',
  'Bento & Mini',
  'Tiered & Wedding',
  'Cupcake Boxes',
];

function resizeImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const maxWidth = 900;
        const scale = img.width > maxWidth ? maxWidth / img.width : 1;
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(String(reader.result));
          return;
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.84));
      };
      img.onerror = () => reject(new Error('Could not load image'));
      img.src = String(reader.result);
    };
    reader.onerror = () => reject(new Error('Could not read file'));
    reader.readAsDataURL(file);
  });
}

export const CatalogEditorModal: React.FC<CatalogEditorModalProps> = ({
  isOpen,
  initialCakeId,
  cakes,
  onClose,
  onUpdateCakes,
  onResetCakes,
}) => {
  const [selectedId, setSelectedId] = useState<string>(initialCakeId || cakes[0]?.id || '');
  const [confirmReset, setConfirmReset] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (initialCakeId && cakes.some((c) => c.id === initialCakeId)) {
      setSelectedId(initialCakeId);
    } else if (!cakes.some((c) => c.id === selectedId) && cakes[0]) {
      setSelectedId(cakes[0].id);
    }
  }, [initialCakeId, cakes, selectedId]);

  if (!isOpen) return null;

  const activeCake = cakes.find((c) => c.id === selectedId) || cakes[0];

  const updateActiveCake = (updater: (cake: CakeProduct) => CakeProduct) => {
    if (!activeCake) return;
    const next = cakes.map((c) => (c.id === activeCake.id ? updater(c) : c));
    onUpdateCakes(next);
  };

  const handleAddNewCake = () => {
    const newId = `custom-cake-${Date.now()}`;
    const newCake: CakeProduct = {
      id: newId,
      name: 'New Signature Celebration Cake',
      category: 'Signature Cakes',
      description:
        'Freshly baked sponge frosted with smooth pastel buttercream and custom piped details.',
      image: STUDIO_IMAGE_PRESETS[0].url,
      leadTime: '24h notice',
      egglessAvailable: true,
      featured: true,
      sizes: [
        { id: `size-${Date.now()}-1`, label: '1 Pound (0.5 kg)', servings: '6–8 slices', priceBdt: 1500 },
        { id: `size-${Date.now()}-2`, label: '2 Pounds (1.0 kg)', servings: '12–15 slices', priceBdt: 2850 },
      ],
      flavors: ['Madagascar Vanilla', 'Belgian Chocolate'],
    };
    onUpdateCakes([...cakes, newCake]);
    setSelectedId(newId);
  };

  const handleDeleteCake = (id: string) => {
    if (cakes.length <= 1) return;
    const remaining = cakes.filter((c) => c.id !== id);
    onUpdateCakes(remaining);
    setConfirmDeleteId(null);
    if (remaining[0]) {
      setSelectedId(remaining[0].id);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadStatus('Optimizing photo...');
      const dataUrl = await resizeImageFile(file);
      updateActiveCake((c) => ({ ...c, image: dataUrl }));
      setUploadStatus('Photo updated');
      setTimeout(() => setUploadStatus(''), 2000);
    } catch {
      setUploadStatus('Could not read image file');
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleUpdateSize = (
    sizeId: string,
    field: keyof CakeSizeOption,
    value: string | number
  ) => {
    updateActiveCake((c) => ({
      ...c,
      sizes: c.sizes.map((s) => (s.id === sizeId ? { ...s, [field]: value } : s)),
    }));
  };

  const handleAddSize = () => {
    updateActiveCake((c) => ({
      ...c,
      sizes: [
        ...c.sizes,
        {
          id: `size-${Date.now()}`,
          label: `${c.sizes.length + 1} Pounds`,
          servings: '10–12 slices',
          priceBdt: 2200,
        },
      ],
    }));
  };

  const handleRemoveSize = (sizeId: string) => {
    if (!activeCake || activeCake.sizes.length <= 1) return;
    updateActiveCake((c) => ({
      ...c,
      sizes: c.sizes.filter((s) => s.id !== sizeId),
    }));
  };

  const handleUpdateFlavor = (index: number, value: string) => {
    updateActiveCake((c) => ({
      ...c,
      flavors: c.flavors.map((f, idx) => (idx === index ? value : f)),
    }));
  };

  const handleAddFlavor = () => {
    updateActiveCake((c) => ({
      ...c,
      flavors: [...c.flavors, 'New Custom Flavor'],
    }));
  };

  const handleRemoveFlavor = (index: number) => {
    if (!activeCake || activeCake.flavors.length <= 1) return;
    updateActiveCake((c) => ({
      ...c,
      flavors: c.flavors.filter((_, idx) => idx !== index),
    }));
  };

  const handleCopyCakesTs = async () => {
    try {
      const code = generateCakesTsSource(cakes);
      await navigator.clipboard.writeText(code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2500);
    } catch {
      // Clipboard restricted
    }
  };

  const handleDownloadCakesTs = () => {
    const code = generateCakesTsSource(cakes);
    const blob = new Blob([code], { type: 'text/typescript;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'cakes.ts';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-[2px] p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Edit Cake Catalog"
    >
      <div className="bg-[#FDF9F6] border border-[#E5D1C8] rounded-2xl w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="px-5 sm:px-7 py-4 bg-white border-b border-[#EADAD3] flex items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-[#2B1E1A]">
              Cake Catalog Editor
            </h2>
            <p className="text-xs text-[#6E5650]">
              Edit cake names, photos, BDT prices, sizes, and flavors—then export{' '}
              <code className="font-mono text-[#9A732C]">src/data/cakes.ts</code> for GitHub.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close catalog editor"
            className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-[#A64B5D] hover:bg-[#8D3B4C] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer inline-flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>Done Editing</span>
          </button>
        </div>

        {/* Main 2-Pane Editor Body */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12">
          {/* Left Sidebar: Cake List */}
          <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-[#EADAD3] bg-[#FAF3EE] p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-[#59443E] tabular-nums">
                Your Cakes ({cakes.length})
              </span>
              <button
                type="button"
                onClick={handleAddNewCake}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-[#A64B5D] hover:bg-[#8D3B4C] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Cake</span>
              </button>
            </div>

            <div className="space-y-2 max-h-60 lg:max-h-[54vh] overflow-y-auto pr-1">
              {cakes.map((cake) => {
                const isSelected = activeCake?.id === cake.id;
                return (
                  <button
                    key={cake.id}
                    type="button"
                    onClick={() => {
                      setSelectedId(cake.id);
                      setConfirmDeleteId(null);
                    }}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-xl border text-left transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-white border-[#A64B5D]'
                        : 'bg-white/70 border-[#E6D4CC] hover:bg-white'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#FDF9F6] shrink-0">
                      <ResilientCakeImage
                        src={cake.image}
                        alt={cake.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-[#2B1E1A] truncate">{cake.name}</p>
                      <p className="text-xs text-[#7D655E] tabular-nums">
                        From {formatBdt(getStartingPrice(cake))} · {cake.sizes.length} sizes
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Reset Default Catalog Control */}
            <div className="pt-3 border-t border-[#E6D4CC]">
              {!confirmReset ? (
                <button
                  type="button"
                  onClick={() => setConfirmReset(true)}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-[#6E5650] hover:text-[#2B1E1A] cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset to Original Sample Cakes</span>
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onResetCakes();
                      setConfirmReset(false);
                    }}
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-[#A64B5D] rounded-md whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    Confirm Reset
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmReset(false)}
                    className="px-2.5 py-1.5 text-xs text-[#59443E] hover:text-[#2B1E1A] whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Form: Active Cake Editor */}
          {activeCake && (
            <div className="lg:col-span-8 p-5 sm:p-7 space-y-6 bg-[#FDF9F6]">
              {/* Name, Category & Delete */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-[#EADAD3]">
                <div className="flex-1 space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#59443E] mb-1">
                      Cake Name
                    </label>
                    <input
                      type="text"
                      value={activeCake.name}
                      onChange={(e) =>
                        updateActiveCake((c) => ({ ...c, name: e.target.value }))
                      }
                      className="w-full px-3.5 py-2.5 text-sm font-medium bg-white border border-[#E4D1C9] rounded-lg text-[#2B1E1A] focus:outline-none focus:border-[#A64B5D]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#59443E] mb-1">
                        Category
                      </label>
                      <select
                        value={activeCake.category}
                        onChange={(e) =>
                          updateActiveCake((c) => ({
                            ...c,
                            category: e.target.value as CakeCategory,
                          }))
                        }
                        className="w-full px-3 py-2 text-sm bg-white border border-[#E4D1C9] rounded-lg text-[#2B1E1A] focus:outline-none focus:border-[#A64B5D]"
                      >
                        {CATEGORY_OPTIONS.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#59443E] mb-1">
                        Preparation Lead Time
                      </label>
                      <input
                        type="text"
                        value={activeCake.leadTime}
                        onChange={(e) =>
                          updateActiveCake((c) => ({ ...c, leadTime: e.target.value }))
                        }
                        placeholder="e.g., 24h notice"
                        className="w-full px-3 py-2 text-sm bg-white border border-[#E4D1C9] rounded-lg text-[#2B1E1A] focus:outline-none focus:border-[#A64B5D]"
                      />
                    </div>
                  </div>
                </div>

                {cakes.length > 1 && (
                  <div className="shrink-0">
                    {confirmDeleteId !== activeCake.id ? (
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(activeCake.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#8D3B4C] bg-[#FCF2F4] hover:bg-[#F8E2E7] border border-[#ECC8D0] rounded-lg whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete Cake</span>
                      </button>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleDeleteCake(activeCake.id)}
                          className="px-3 py-2 text-xs font-semibold text-white bg-[#8D3B4C] rounded-lg whitespace-nowrap shrink-0 cursor-pointer"
                        >
                          Confirm Delete
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(null)}
                          className="p-2 text-xs text-[#59443E] cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Photo Editor */}
              <div className="bg-white rounded-xl border border-[#EADAD3] p-4 space-y-3">
                <label className="block text-xs font-semibold text-[#2B1E1A]">
                  Cake Photo (Upload, Paste URL, or Choose Studio Preset)
                </label>

                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  <div className="w-36 aspect-[4/3] rounded-lg overflow-hidden border border-[#E6D4CC] bg-[#FAF3EE] shrink-0">
                    <ResilientCakeImage
                      src={activeCake.image}
                      alt={activeCake.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 w-full space-y-2.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-[#2B1E1A] bg-[#FAF2EE] hover:bg-[#F3E2DA] border border-[#E4CFC7] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5 text-[#9A732C]" />
                        <span>Upload Photo</span>
                      </button>

                      <select
                        value={
                          STUDIO_IMAGE_PRESETS.some((p) => p.url === activeCake.image)
                            ? activeCake.image
                            : ''
                        }
                        onChange={(e) => {
                          if (e.target.value) {
                            updateActiveCake((c) => ({ ...c, image: e.target.value }));
                          }
                        }}
                        className="px-3 py-2 text-xs bg-[#FDF9F6] border border-[#E4D1C9] rounded-lg text-[#2B1E1A] focus:outline-none focus:border-[#A64B5D]"
                      >
                        <option value="">Choose Studio Photo...</option>
                        {STUDIO_IMAGE_PRESETS.map((preset) => (
                          <option key={preset.key} value={preset.url}>
                            {preset.label}
                          </option>
                        ))}
                      </select>

                      {uploadStatus && (
                        <span className="text-xs text-[#9A732C]">{uploadStatus}</span>
                      )}
                    </div>

                    <input
                      type="text"
                      value={activeCake.image.startsWith('data:') ? '' : activeCake.image}
                      onChange={(e) =>
                        updateActiveCake((c) => ({ ...c, image: e.target.value }))
                      }
                      placeholder="Or paste photo path / URL (e.g., /cakes/rose-cake.jpg)"
                      className="w-full px-3 py-2 text-xs bg-[#FDF9F6] border border-[#E4D1C9] rounded-lg text-[#2B1E1A] placeholder:text-[#8E7770] focus:outline-none focus:border-[#A64B5D]"
                    />
                  </div>
                </div>
              </div>

              {/* Description & Eggless */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-[#59443E] mb-1">
                    Cake Description
                  </label>
                  <textarea
                    rows={2}
                    value={activeCake.description}
                    onChange={(e) =>
                      updateActiveCake((c) => ({ ...c, description: e.target.value }))
                    }
                    className="w-full px-3.5 py-2 text-sm bg-white border border-[#E4D1C9] rounded-lg text-[#2B1E1A] focus:outline-none focus:border-[#A64B5D]"
                  />
                </div>

                <label className="inline-flex items-center gap-2.5 text-xs font-medium text-[#2B1E1A] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={activeCake.egglessAvailable}
                    onChange={(e) =>
                      updateActiveCake((c) => ({
                        ...c,
                        egglessAvailable: e.target.checked,
                      }))
                    }
                    className="w-4 h-4 accent-[#A64B5D] rounded"
                  />
                  <span>Offer 100% Eggless Sponge option on this cake</span>
                </label>
              </div>

              {/* Editable Sizes & Prices in BDT */}
              <div className="bg-white rounded-xl border border-[#EADAD3] p-4 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <label className="text-xs font-semibold text-[#2B1E1A]">
                    Sizes &amp; Prices in BDT (৳)
                  </label>
                  <button
                    type="button"
                    onClick={handleAddSize}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-[#2B1E1A] bg-[#FAF2EE] hover:bg-[#F3E2DA] border border-[#E4CFC7] rounded-md whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#9A732C]" />
                    <span>Add Size</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {activeCake.sizes.map((size) => (
                    <div
                      key={size.id}
                      className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center bg-[#FDF9F6] p-2.5 rounded-lg border border-[#EFE2DC]"
                    >
                      <div className="sm:col-span-5">
                        <input
                          type="text"
                          value={size.label}
                          onChange={(e) =>
                            handleUpdateSize(size.id, 'label', e.target.value)
                          }
                          placeholder="Size (e.g., 1 Pound)"
                          aria-label="Size label"
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-[#E4D1C9] rounded-md text-[#2B1E1A]"
                        />
                      </div>
                      <div className="sm:col-span-3">
                        <input
                          type="text"
                          value={size.servings}
                          onChange={(e) =>
                            handleUpdateSize(size.id, 'servings', e.target.value)
                          }
                          placeholder="Servings"
                          aria-label="Servings"
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-[#E4D1C9] rounded-md text-[#2B1E1A]"
                        />
                      </div>
                      <div className="sm:col-span-3 relative">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-[#7D655E]">
                          ৳
                        </span>
                        <input
                          type="number"
                          min={0}
                          value={size.priceBdt}
                          onChange={(e) =>
                            handleUpdateSize(
                              size.id,
                              'priceBdt',
                              Math.max(0, Number(e.target.value) || 0)
                            )
                          }
                          aria-label="Price in BDT"
                          className="w-full pl-6 pr-2.5 py-1.5 text-xs font-semibold tabular-nums bg-white border border-[#E4D1C9] rounded-md text-[#2B1E1A]"
                        />
                      </div>
                      <div className="sm:col-span-1 flex justify-end">
                        <button
                          type="button"
                          disabled={activeCake.sizes.length <= 1}
                          onClick={() => handleRemoveSize(size.id)}
                          aria-label="Remove size"
                          className="p-1.5 text-[#8E7770] hover:text-[#A64B5D] disabled:opacity-30 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Editable Flavors */}
              <div className="bg-white rounded-xl border border-[#EADAD3] p-4 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <label className="text-xs font-semibold text-[#2B1E1A]">
                    Available Cake Flavors
                  </label>
                  <button
                    type="button"
                    onClick={handleAddFlavor}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-[#2B1E1A] bg-[#FAF2EE] hover:bg-[#F3E2DA] border border-[#E4CFC7] rounded-md whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#9A732C]" />
                    <span>Add Flavor</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {activeCake.flavors.map((flavor, idx) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={flavor}
                        onChange={(e) => handleUpdateFlavor(idx, e.target.value)}
                        aria-label={`Flavor ${idx + 1}`}
                        className="flex-1 px-3 py-1.5 text-xs bg-[#FDF9F6] border border-[#E4D1C9] rounded-md text-[#2B1E1A]"
                      />
                      <button
                        type="button"
                        disabled={activeCake.flavors.length <= 1}
                        onClick={() => handleRemoveFlavor(idx)}
                        aria-label="Remove flavor"
                        className="p-1.5 text-[#8E7770] hover:text-[#A64B5D] disabled:opacity-30 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* GitHub Export Footer */}
        <div className="px-5 sm:px-7 py-3.5 bg-white border-t border-[#EADAD3] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="text-xs text-[#59443E]">
            <strong>GitHub Sync Tip:</strong> Your edits are active immediately here. To save them
            permanently in your GitHub repository, replace{' '}
            <code className="font-mono text-[#9A732C]">src/data/cakes.ts</code> with this updated
            file:
          </p>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleCopyCakesTs}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-[#2B1E1A] bg-[#FAF2EE] hover:bg-[#F3E2DA] border border-[#E4CFC7] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {copiedCode ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#9A732C]" />
                  <span>Copied cakes.ts</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#7D655E]" />
                  <span>Copy cakes.ts</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleDownloadCakesTs}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#2B1E1A] bg-[#F7EFE0] hover:bg-[#EFE2C8] border border-[#DBC49B] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#9A732C]" />
              <span>Download cakes.ts</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
