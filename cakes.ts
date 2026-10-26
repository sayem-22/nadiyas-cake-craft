import { CakeProduct } from '../types/cake';

import heroShowcaseImg from '../assets/images/hero_patisserie_showcase_1793022506586.jpg';
import rosePistachioImg from '../assets/images/cake_rose_pistachio_1793022508198.jpg';
import vanillaBerryImg from '../assets/images/cake_vanilla_berry_chantilly_1793022510389.jpg';
import belgianChocolateImg from '../assets/images/cake_belgian_chocolate_gold_1793022510798.jpg';
import bentoPastelImg from '../assets/images/cake_bento_pastel_box_1793022513204.jpg';
import weddingChampagneImg from '../assets/images/cake_wedding_champagne_tier_1793022513973.jpg';
import cupcakeAssortmentImg from '../assets/images/cake_cupcake_assortment_1793022514161.jpg';

/**
 * ============================================================================
 * NADIYA'S CAKE CRAFT — EASY-TO-EDIT SHOP & PRODUCT CONFIGURATION
 * ============================================================================
 *
 * HOW TO EDIT YOUR SHOP OR CAKES IN GITHUB:
 * 1. To change your WhatsApp number, delivery fee, or studio hours, edit SHOP_CONFIG below.
 * 2. To edit cake names, descriptions, BDT prices, sizes, or flavors, edit INITIAL_CAKES below.
 * 3. To add your own cake photo:
 *    - Upload your image into the `public/cakes/` folder (for example `public/cakes/mango-cake.jpg`)
 *    - Set `image: '/cakes/mango-cake.jpg'` on your cake item!
 *    - Or use the "Edit Catalog" button on your website, make changes visually, and click
 *      "Download cakes.ts" to get this updated file automatically.
 */

export const SHOP_CONFIG = {
  businessName: 'Nadiya’s Cake Craft',
  whatsappNumberRaw: '8801903588929',
  whatsappDisplay: '+880 1903-588929',
  currencyCode: 'BDT',
  currencySymbol: '৳',
  city: 'Dhaka, Bangladesh',
  studioHours: 'Daily, 10:00 AM – 9:00 PM',
  deliveryFeeBdt: 120,
  freeDeliveryThresholdBdt: 4500,
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
  {
    id: 'rosewater-pistachio-velvet',
    name: 'Rosewater & Pistachio Velvet Cake',
    category: 'Signature Cakes',
    description:
      'Delicate cardamom-infused sponge layered with pastel blush Swiss meringue buttercream, roasted Iranian pistachios, organic dried rose petals, and edible gold leaf.',
    image: rosePistachioImg,
    leadTime: '24h notice',
    egglessAvailable: true,
    featured: true,
    sizes: [
      { id: 'size-1lb', label: '1 Pound (0.5 kg)', servings: '6–8 slices', priceBdt: 1650 },
      { id: 'size-2lb', label: '2 Pounds (1.0 kg)', servings: '12–15 slices', priceBdt: 3100 },
      { id: 'size-3lb', label: '3 Pounds (1.5 kg)', servings: '20–24 slices', priceBdt: 4450 },
    ],
    flavors: [
      'Pistachio Rosewater',
      'Madagascar Vanilla Rose',
      'White Chocolate Raspberry',
      'Cardamom Almond Cream',
    ],
  },
  {
    id: 'vanilla-strawberry-chantilly',
    name: 'Madagascar Vanilla & Berry Chantilly',
    category: 'Signature Cakes',
    description:
      'Light chiffon sponge brushed with berry compote, whipped mascarpone Chantilly cream, fresh glazed strawberries, and handmade white chocolate curls.',
    image: vanillaBerryImg,
    leadTime: '24h notice',
    egglessAvailable: true,
    featured: true,
    sizes: [
      { id: 'size-1lb', label: '1 Pound (0.5 kg)', servings: '6–8 slices', priceBdt: 1550 },
      { id: 'size-2lb', label: '2 Pounds (1.0 kg)', servings: '12–15 slices', priceBdt: 2900 },
      { id: 'size-3lb', label: '3 Pounds (1.5 kg)', servings: '20–24 slices', priceBdt: 4200 },
    ],
    flavors: [
      'Vanilla Strawberry Compote',
      'Lemon Blueberry Mascarpone',
      'Mango Passionfruit Cream',
      'Classic Red Velvet Cream Cheese',
    ],
  },
  {
    id: 'belgian-chocolate-caramel-gold',
    name: 'Belgian Chocolate & Salted Caramel Gold',
    category: 'Signature Cakes',
    description:
      'Rich dark cocoa sponge filled with sea-salt caramel praline, frosted in silky espresso cream with a dark couverture ganache drip and gold-dusted truffles.',
    image: belgianChocolateImg,
    leadTime: '24h notice',
    egglessAvailable: true,
    featured: true,
    sizes: [
      { id: 'size-1lb', label: '1 Pound (0.5 kg)', servings: '6–8 slices', priceBdt: 1750 },
      { id: 'size-2lb', label: '2 Pounds (1.0 kg)', servings: '12–15 slices', priceBdt: 3300 },
      { id: 'size-3lb', label: '3 Pounds (1.5 kg)', servings: '20–24 slices', priceBdt: 4750 },
    ],
    flavors: [
      'Dark Chocolate Salted Caramel',
      'Hazelnut Ferrero Gianduja',
      'Mocha Espresso Ganache',
      'Double Belgian Fudge',
    ],
  },
  {
    id: 'pastel-lambeth-bento-cake',
    name: 'Pastel Vintage Ribbon Bento Cake',
    category: 'Bento & Mini',
    description:
      'Intimate Lambeth-piped mini celebration cake in soft pastel pink and warm ivory buttercream with sugar pearls, presented in an eco-cream gift box.',
    image: bentoPastelImg,
    leadTime: 'Same-day / 12h notice',
    egglessAvailable: true,
    featured: true,
    sizes: [
      { id: 'bento-350g', label: 'Mini Bento (350g · 4 inch)', servings: '2–3 servings', priceBdt: 850 },
      { id: 'bento-550g', label: 'Lunchbox Plus (550g · 5 inch)', servings: '4–5 servings', priceBdt: 1250 },
      { id: 'bento-combo', label: 'Bento + 2 Matching Cupcakes', servings: '4–6 servings', priceBdt: 1490 },
    ],
    flavors: [
      'Vanilla Berry Jam',
      'Belgian Chocolate Fudge',
      'Butterscotch Praline',
      'Red Velvet Cream Cheese',
    ],
  },
  {
    id: 'champagne-pearl-tiered-cake',
    name: 'Champagne Pearl Two-Tier Engagement Cake',
    category: 'Tiered & Wedding',
    description:
      'Architectural two-tier centerpiece finished in warm ivory buttercream, delicate wafer-paper ruffles, hand-placed sugar pearls, and soft champagne gold leaf.',
    image: weddingChampagneImg,
    leadTime: '48–72h notice',
    egglessAvailable: true,
    featured: true,
    sizes: [
      { id: 'tier-4lb', label: 'Two-Tier Petit (4 Pounds)', servings: '28–32 guests', priceBdt: 5800 },
      { id: 'tier-6lb', label: 'Two-Tier Classic (6 Pounds)', servings: '45–50 guests', priceBdt: 8400 },
      { id: 'tier-8lb', label: 'Two-Tier Grand (8 Pounds)', servings: '65–75 guests', priceBdt: 10900 },
    ],
    flavors: [
      'Pistachio Rose & Vanilla Berry (Split Tiers)',
      'Belgian Chocolate & Vanilla Chantilly',
      'White Chocolate Raspberry',
      'Lemon Elderflower & Berry',
    ],
  },
  {
    id: 'pastel-peony-cupcake-box',
    name: 'Signature Pastel Floral Cupcake Box',
    category: 'Cupcake Boxes',
    description:
      'Hand-piped buttercream peonies, champagne vanilla swirls, and roasted pistachio crowns baked fresh each morning and packed in a ribboned cream keepsake box.',
    image: cupcakeAssortmentImg,
    leadTime: '12–24h notice',
    egglessAvailable: true,
    featured: true,
    sizes: [
      { id: 'box-6', label: 'Box of 6 Artisanal Cupcakes', servings: '6 pieces', priceBdt: 980 },
      { id: 'box-12', label: 'Box of 12 Artisanal Cupcakes', servings: '12 pieces', priceBdt: 1850 },
      { id: 'box-24', label: 'Event Platter (24 Cupcakes)', servings: '24 pieces', priceBdt: 3500 },
    ],
    flavors: [
      'Assorted Signature Flavors',
      'All Rose & Vanilla Bean',
      'All Belgian Chocolate Truffle',
      'Strawberry & Lemon Curd Mix',
    ],
  },
];
