export type CakeCategory =
  | 'Signature Cakes'
  | 'Bento & Mini'
  | 'Tiered & Wedding'
  | 'Cupcake Boxes';

export interface CakeSizeOption {
  id: string;
  label: string;
  servings: string;
  priceBdt: number;
}

export interface CakeProduct {
  id: string;
  name: string;
  category: CakeCategory;
  description: string;
  image: string;
  leadTime: string;
  egglessAvailable: boolean;
  featured?: boolean;
  sizes: CakeSizeOption[];
  flavors: string[];
}

export interface CartItem {
  cartItemId: string;
  cakeId: string;
  cakeName: string;
  cakeImage: string;
  size: CakeSizeOption;
  flavor: string;
  eggless: boolean;
  customMessage: string;
  quantity: number;
}

export type FulfillmentMethod = 'delivery' | 'pickup';

export interface OrderDetails {
  customerName: string;
  customerPhone: string;
  fulfillment: FulfillmentMethod;
  deliveryAddress: string;
  preferredDate: string;
  preferredTime: string;
  orderNotes: string;
}
