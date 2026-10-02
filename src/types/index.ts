export interface Profile {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
  phone?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  name: string; // e.g. "Size" or "Vessel"
  value: string; // e.g. "300g (Double Wick)" or "Raw Charcoal Ceramic"
  price_adjustment: number; // e.g. 0 or 6000
  stock_quantity: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number; // in NGN (Nigerian Naira)
  category: 'candles' | 'diffusers' | 'room_mists' | 'ceramic_vessels';
  scent_profile: {
    top: string[];
    heart: string[];
    base: string[];
  };
  burn_time?: string;
  volume?: string;
  image_url: string;
  stock_quantity: number;
  active: boolean;
  featured?: boolean;
  variants?: ProductVariant[];
  created_at?: string;
}

export interface CartItem {
  id: string;
  product_id: string;
  product: Product;
  variant_id?: string;
  variant?: ProductVariant;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export type OrderStatus = 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed';

export interface OrderItem {
  id?: string;
  order_id?: string;
  product_id: string;
  product_name: string;
  unit_price: number;
  quantity: number;
  variant_information?: string;
  subtotal: number;
  image_url?: string;
  created_at?: string;
}

export interface Order {
  id: string;
  user_id: string;
  order_number: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  subtotal: number;
  delivery_fee: number;
  total: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_address: string;
  city: string;
  state: string;
  notes?: string;
  items: OrderItem[];
  email_sent?: boolean;
  email_receipt_html?: string;
  created_at: string;
  updated_at?: string;
}

export interface NigerianDeliveryState {
  code: string;
  name: string;
  delivery_fee: number;
  estimated_days: string;
}

export interface CheckoutFormData {
  fullName: string;
  email: string;
  phone: string;
  deliveryAddress: string;
  city: string;
  state: string;
  notes?: string;
  simulatePaymentFailure?: boolean;
}
