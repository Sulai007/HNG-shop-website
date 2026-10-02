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
  tagline?: string;
  price: number; // base price
  original_price?: number;
  category: 'Fashion' | 'Electronics' | 'Beauty' | 'Fitness' | 'Home Decor' | 'Accessories' | string;
  rating?: number;
  reviews_count?: number;
  badge?: string; // e.g. "New", "-20%", "Bestseller"
  image_url: string;
  secondary_image?: string;
  stock_quantity: number;
  active: boolean;
  featured?: boolean;
  is_bestseller?: boolean;
  is_new_arrival?: boolean;
  variants?: ProductVariant[];
  colors?: string[];
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
