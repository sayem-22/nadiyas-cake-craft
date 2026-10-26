import { CakeProduct, CakeSizeOption, CartItem, OrderDetails } from '../types/cake';
import { SHOP_CONFIG, STUDIO_IMAGE_PRESETS } from '../data/cakes';

export function formatBdt(amount: number): string {
  const rounded = Math.round(amount || 0);
  return `${SHOP_CONFIG.currencySymbol} ${rounded.toLocaleString('en-IN')}`;
}

export function getStartingPrice(cake: CakeProduct): number {
  if (!cake.sizes || cake.sizes.length === 0) return 0;
  return Math.min(...cake.sizes.map((s) => s.priceBdt));
}

export function buildWhatsAppUrl(message: string): string {
  const cleanPhone = SHOP_CONFIG.whatsappNumberRaw.replace(/[^\d]/g, '');
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

export function buildSingleCakeMessage(params: {
  cake: CakeProduct;
  size: CakeSizeOption;
  flavor: string;
  quantity: number;
  eggless: boolean;
  customMessage: string;
}): string {
  const { cake, size, flavor, quantity, eggless, customMessage } = params;
  const lineTotal = size.priceBdt * quantity;

  const lines = [
    `Hello ${SHOP_CONFIG.businessName}! I would like to place an order:`,
    '',
    `Cake: ${cake.name}`,
    `Size: ${size.label} (${size.servings})`,
    `Flavor: ${flavor}`,
    `Dietary: ${eggless ? 'Eggless Sponge' : 'Classic Recipe'}`,
    customMessage.trim() ? `Message on Cake: "${customMessage.trim()}"` : null,
    `Quantity: ${quantity}`,
    `Item Total: ${formatBdt(lineTotal)} (${SHOP_CONFIG.currencyCode})`,
    '',
    'Please let me know availability and delivery confirmation. Thank you!',
  ].filter(Boolean);

  return lines.join('\n');
}

export function buildCartOrderMessage(params: {
  items: CartItem[];
  details: OrderDetails;
  subtotalBdt: number;
  deliveryFeeBdt: number;
  totalBdt: number;
  orderRef: string;
}): string {
  const { items, details, subtotalBdt, deliveryFeeBdt, totalBdt, orderRef } = params;

  const itemLines = items.map((item, idx) => {
    const lineTotal = item.size.priceBdt * item.quantity;
    const extras = [
      `   Size: ${item.size.label}`,
      `   Flavor: ${item.flavor}`,
      item.eggless ? '   Dietary: Eggless Sponge' : null,
      item.customMessage.trim() ? `   Cake Message: "${item.customMessage.trim()}"` : null,
      `   Qty: ${item.quantity} × ${formatBdt(item.size.priceBdt)} = ${formatBdt(lineTotal)}`,
    ]
      .filter(Boolean)
      .join('\n');

    return `${idx + 1}. ${item.cakeName}\n${extras}`;
  });

  const fulfillmentLabel =
    details.fulfillment === 'delivery'
      ? `Home Delivery (${details.deliveryAddress.trim() || 'Address to be shared'})`
      : 'Studio Pickup (Dhaka)';

  const lines = [
    `Hello ${SHOP_CONFIG.businessName}! Here is my cake order (${orderRef}):`,
    '',
    'ORDER ITEMS:',
    ...itemLines,
    '',
    'ORDER SUMMARY (BDT):',
    `Subtotal: ${formatBdt(subtotalBdt)}`,
    details.fulfillment === 'delivery'
      ? `Delivery Charge: ${deliveryFeeBdt === 0 ? 'Free' : formatBdt(deliveryFeeBdt)}`
      : 'Studio Pickup: Free',
    `Total Payable: ${formatBdt(totalBdt)}`,
    '',
    'CUSTOMER & SCHEDULE:',
    `Name: ${details.customerName.trim() || 'Not specified'}`,
    `Phone: ${details.customerPhone.trim() || 'Same as WhatsApp'}`,
    `Fulfillment: ${fulfillmentLabel}`,
    `Preferred Date: ${details.preferredDate || 'Flexible / Earliest available'}`,
    details.preferredTime ? `Preferred Time: ${details.preferredTime}` : null,
    details.orderNotes.trim() ? `Special Notes: ${details.orderNotes.trim()}` : null,
    '',
    'Please confirm my order and payment details. Thank you!',
  ].filter(Boolean);

  return lines.join('\n');
}

export function buildCustomInquiryMessage(params: {
  customerName: string;
  occasion: string;
  eventDate: string;
  guestCount: string;
  flavorPreference: string;
  designNotes: string;
}): string {
  const lines = [
    `Hello ${SHOP_CONFIG.businessName}! I would like to inquire about a custom cake:`,
    '',
    params.customerName.trim() ? `Name: ${params.customerName.trim()}` : null,
    `Occasion: ${params.occasion || 'Celebration'}`,
    params.eventDate ? `Event Date: ${params.eventDate}` : null,
    params.guestCount ? `Estimated Servings / Weight: ${params.guestCount}` : null,
    params.flavorPreference ? `Preferred Flavor: ${params.flavorPreference}` : null,
    params.designNotes.trim() ? `Design Ideas: ${params.designNotes.trim()}` : null,
    '',
    'Could you share a quote in BDT and availability? Thank you!',
  ].filter(Boolean);

  return lines.join('\n');
}

export function generateCakesTsSource(cakes: CakeProduct[]): string {
  const urlToVarMap = new Map<string, string>();
  STUDIO_IMAGE_PRESETS.forEach((preset) => {
    urlToVarMap.set(preset.url, preset.key);
  });

  const serializedCakes = cakes
    .map((cake) => {
      const presetVar = urlToVarMap.get(cake.image);
      const imageValue = presetVar ? presetVar : JSON.stringify(cake.image);

      const sizesBlock = cake.sizes
        .map(
          (s) =>
            `      { id: ${JSON.stringify(s.id)}, label: ${JSON.stringify(s.label)}, servings: ${JSON.stringify(s.servings)}, priceBdt: ${Number(s.priceBdt) || 0} },`
        )
        .join('\n');

      const flavorsBlock = cake.flavors.map((f) => `      ${JSON.stringify(f)},`).join('\n');

      return `  {
    id: ${JSON.stringify(cake.id)},
    name: ${JSON.stringify(cake.name)},
    category: ${JSON.stringify(cake.category)},
    description: ${JSON.stringify(cake.description)},
    image: ${imageValue},
    leadTime: ${JSON.stringify(cake.leadTime)},
    egglessAvailable: ${Boolean(cake.egglessAvailable)},
    featured: true,
    sizes: [
${sizesBlock}
    ],
    flavors: [
${flavorsBlock}
    ],
  },`;
    })
    .join('\n');

  return `import { CakeProduct } from '../types/cake';

import heroShowcaseImg from '../assets/images/hero_patisserie_showcase_1793022506586.jpg';
import rosePistachioImg from '../assets/images/cake_rose_pistachio_1793022508198.jpg';
import vanillaBerryImg from '../assets/images/cake_vanilla_berry_chantilly_1793022510389.jpg';
import belgianChocolateImg from '../assets/images/cake_belgian_chocolate_gold_1793022510798.jpg';
import bentoPastelImg from '../assets/images/cake_bento_pastel_box_1793022513204.jpg';
import weddingChampagneImg from '../assets/images/cake_wedding_champagne_tier_1793022513973.jpg';
import cupcakeAssortmentImg from '../assets/images/cake_cupcake_assortment_1793022514161.jpg';

export const SHOP_CONFIG = {
  businessName: ${JSON.stringify(SHOP_CONFIG.businessName)},
  whatsappNumberRaw: ${JSON.stringify(SHOP_CONFIG.whatsappNumberRaw)},
  whatsappDisplay: ${JSON.stringify(SHOP_CONFIG.whatsappDisplay)},
  currencyCode: 'BDT',
  currencySymbol: '৳',
  city: ${JSON.stringify(SHOP_CONFIG.city)},
  studioHours: ${JSON.stringify(SHOP_CONFIG.studioHours)},
  deliveryFeeBdt: ${SHOP_CONFIG.deliveryFeeBdt},
  freeDeliveryThresholdBdt: ${SHOP_CONFIG.freeDeliveryThresholdBdt},
  heroImage: heroShowcaseImg,
};

export const STUDIO_IMAGE_PRESETS = [
  { key: 'rosePistachioImg', label: 'Rosewater & Pistachio Cake', url: rosePistachioImg },
  { key: 'vanillaBerryImg', label: 'Vanilla & Strawberry Chantilly', url: vanillaBerryImg },
  { key: 'belgianChocolateImg', label: 'Belgian Chocolate & Gold Drip', url: belgianChocolateImg },
  { key: 'bentoPastelImg', label: 'Pastel Vintage Bento Cake', url: bentoPastelImg },
  { key: 'weddingChampagneImg', label: 'Champagne Two-Tier Cake', url: weddingChampagneImg },
  { key: 'cupcakeAssortmentImg', label: 'Pastel Floral Cupcake Box', url: cupcakeAssortmentImg },
  { key: 'heroShowcaseImg', label: 'Blush & Gold Two-Tier Showcase', url: heroShowcaseImg },
];

export const INITIAL_CAKES: CakeProduct[] = [
${serializedCakes}
];
`;
}
