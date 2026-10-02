import { NigerianDeliveryState, Product } from '../types';

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  image: string;
  itemCount: number;
}

export const CATEGORIES: CategoryItem[] = [
  {
    id: 'cat_fashion',
    name: 'Fashion',
    slug: 'fashion',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80',
    itemCount: 48,
  },
  {
    id: 'cat_electronics',
    name: 'Electronics',
    slug: 'electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
    itemCount: 36,
  },
  {
    id: 'cat_beauty',
    name: 'Beauty',
    slug: 'beauty',
    image: 'https://images.unsplash.com/photo-1608248597359-5975549e5d48?auto=format&fit=crop&w=600&q=80',
    itemCount: 24,
  },
  {
    id: 'cat_fitness',
    name: 'Fitness',
    slug: 'fitness',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80',
    itemCount: 32,
  },
  {
    id: 'cat_home',
    name: 'Home Decor',
    slug: 'home-decor',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=80',
    itemCount: 29,
  },
  {
    id: 'cat_accessories',
    name: 'Accessories',
    slug: 'accessories',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80',
    itemCount: 42,
  },
];

export const NIGERIAN_STATES: NigerianDeliveryState[] = [
  { code: 'LA_MAIN', name: 'Lagos (Mainland / Ikeja / Surulere)', delivery_fee: 3500, estimated_days: '1–2 business days' },
  { code: 'LA_ISL', name: 'Lagos (Island / Lekki / Ikoyi / VI)', delivery_fee: 3500, estimated_days: 'Same day or next day' },
  { code: 'ABJ', name: 'Abuja (Federal Capital Territory)', delivery_fee: 5500, estimated_days: '2–3 business days' },
  { code: 'RIV', name: 'Rivers (Port Harcourt)', delivery_fee: 6000, estimated_days: '2–4 business days' },
  { code: 'OYO', name: 'Oyo (Ibadan)', delivery_fee: 4500, estimated_days: '2–3 business days' },
  { code: 'OGN', name: 'Ogun (Abeokuta / Ota)', delivery_fee: 4000, estimated_days: '2–3 business days' },
  { code: 'ENU', name: 'Enugu', delivery_fee: 6000, estimated_days: '3–5 business days' },
  { code: 'ANA', name: 'Anambra (Awka / Onitsha)', delivery_fee: 6000, estimated_days: '3–5 business days' },
  { code: 'DEL', name: 'Delta (Warri / Asaba)', delivery_fee: 6000, estimated_days: '3–5 business days' },
  { code: 'EDO', name: 'Edo (Benin City)', delivery_fee: 5500, estimated_days: '3–5 business days' },
  { code: 'KAN', name: 'Kano', delivery_fee: 7000, estimated_days: '3–5 business days' },
  { code: 'KAD', name: 'Kaduna', delivery_fee: 7000, estimated_days: '3–5 business days' },
  { code: 'OTH', name: 'Other States (Nationwide Express)', delivery_fee: 7500, estimated_days: '4–6 business days' },
];

export const INITIAL_PRODUCTS: Product[] = [
  // 1. Essential Hoodie
  {
    id: 'prod_essential_hoodie',
    name: 'Essential Hoodie',
    slug: 'essential-hoodie',
    category: 'Fashion',
    description: 'Crafted from heavy 450gsm organic brushed French terry cotton. Features dropped shoulders, double-layered hood without drawstrings, and a kangaroo pouch pocket.',
    tagline: 'Premium quality hoodie perfect for everyday wear.',
    price: 78000, // ₦78,000
    original_price: 105000,
    rating: 4.9,
    reviews_count: 128,
    badge: 'New',
    image_url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
    stock_quantity: 45,
    active: true,
    featured: true,
    is_new_arrival: true,
    is_bestseller: true,
    colors: ['#D6C7B2', '#1E1E1E', '#9E9E9E'],
    variants: [
      { id: 'v_eh_s', product_id: 'prod_essential_hoodie', name: 'Size', value: 'S (Small)', price_adjustment: 0, stock_quantity: 12 },
      { id: 'v_eh_m', product_id: 'prod_essential_hoodie', name: 'Size', value: 'M (Medium)', price_adjustment: 0, stock_quantity: 18 },
      { id: 'v_eh_l', product_id: 'prod_essential_hoodie', name: 'Size', value: 'L (Large)', price_adjustment: 0, stock_quantity: 10 },
      { id: 'v_eh_xl', product_id: 'prod_essential_hoodie', name: 'Size', value: 'XL (Extra Large)', price_adjustment: 0, stock_quantity: 5 },
    ],
  },

  // 2. Air Max 270
  {
    id: 'prod_air_max_270',
    name: 'Air Max 270',
    slug: 'air-max-270',
    category: 'Fashion',
    description: "Boasting Nike's biggest heel Air unit yet, delivering a super-soft ride that feels as impossible as it looks. Knit fabric upper with no-sew overlays for comfort and support.",
    tagline: 'Iconic comfort meets modern style.',
    price: 169000, // ₦169,000
    original_price: 208000,
    rating: 4.8,
    reviews_count: 189,
    badge: '-20%',
    image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
    stock_quantity: 28,
    active: true,
    featured: true,
    is_new_arrival: true,
    is_bestseller: true,
    colors: ['#FFFFFF', '#FF4500', '#111111'],
    variants: [
      { id: 'v_am_41', product_id: 'prod_air_max_270', name: 'Shoe Size', value: 'EU 41 / US 8', price_adjustment: 0, stock_quantity: 6 },
      { id: 'v_am_42', product_id: 'prod_air_max_270', name: 'Shoe Size', value: 'EU 42 / US 8.5', price_adjustment: 0, stock_quantity: 8 },
      { id: 'v_am_43', product_id: 'prod_air_max_270', name: 'Shoe Size', value: 'EU 43 / US 9.5', price_adjustment: 0, stock_quantity: 9 },
      { id: 'v_am_44', product_id: 'prod_air_max_270', name: 'Shoe Size', value: 'EU 44 / US 10', price_adjustment: 0, stock_quantity: 5 },
    ],
  },

  // 3. Wireless Headphones
  {
    id: 'prod_wireless_headphones',
    name: 'Wireless Headphones',
    slug: 'wireless-headphones',
    category: 'Electronics',
    description: 'Immersive soundstage with hybrid active noise cancellation, 40mm titanium drivers, and ultra-plush protein leather ear cushions. Up to 40 hours of battery life on a single charge.',
    tagline: 'Crystal-clear acoustics with all-day comfort.',
    price: 130000, // ₦130,000
    original_price: 168000,
    rating: 4.9,
    reviews_count: 154,
    badge: 'New',
    image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    stock_quantity: 34,
    active: true,
    featured: true,
    is_new_arrival: true,
    is_bestseller: false,
    colors: ['#171717', '#E5E5E5'],
    variants: [
      { id: 'v_wh_blk', product_id: 'prod_wireless_headphones', name: 'Color', value: 'Matte Obsidian Black', price_adjustment: 0, stock_quantity: 20 },
      { id: 'v_wh_slv', product_id: 'prod_wireless_headphones', name: 'Color', value: 'Platinum Silver', price_adjustment: 6500, stock_quantity: 14 },
    ],
  },

  // 4. Smart Watch Series 9
  {
    id: 'prod_smart_watch_series_9',
    name: 'Smart Watch Series 9',
    slug: 'smart-watch-series-9',
    category: 'Electronics',
    description: 'Always-On Retina display with up to 2000 nits brightness. Advanced health sensors, ECG app, blood oxygen tracking, crash detection, and water resistant to 50 meters.',
    tagline: 'Your essential health & fitness companion.',
    price: 260000, // ₦260,000
    original_price: 305000,
    rating: 4.9,
    reviews_count: 103,
    badge: '-15%',
    image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    stock_quantity: 19,
    active: true,
    featured: true,
    is_new_arrival: true,
    is_bestseller: false,
    colors: ['#000000', '#F3F4F6'],
    variants: [
      { id: 'v_sw_41', product_id: 'prod_smart_watch_series_9', name: 'Case Size', value: '41mm Midnight Aluminum', price_adjustment: 0, stock_quantity: 11 },
      { id: 'v_sw_45', product_id: 'prod_smart_watch_series_9', name: 'Case Size', value: '45mm Midnight Aluminum', price_adjustment: 39000, stock_quantity: 8 },
    ],
  },

  // 5. Stainless Steel Bottle
  {
    id: 'prod_stainless_steel_bottle',
    name: 'Stainless Steel Bottle',
    slug: 'stainless-steel-bottle',
    category: 'Accessories',
    description: 'Double-wall vacuum insulation keeps drinks ice cold for up to 24 hours and piping hot for 12 hours. Sweat-free powder coat finish with leak-proof flex cap.',
    tagline: 'Stay hydrated with sustainable thermal insulation.',
    price: 32500, // ₦32,500
    original_price: 45000,
    rating: 4.7,
    reviews_count: 76,
    badge: 'New',
    image_url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80',
    stock_quantity: 60,
    active: true,
    featured: false,
    is_new_arrival: true,
    is_bestseller: false,
    colors: ['#1C1917', '#38BDF8', '#F43F5E'],
    variants: [
      { id: 'v_sb_500', product_id: 'prod_stainless_steel_bottle', name: 'Volume', value: '500ml (17 oz)', price_adjustment: 0, stock_quantity: 35 },
      { id: 'v_sb_750', product_id: 'prod_stainless_steel_bottle', name: 'Volume', value: '750ml (25 oz)', price_adjustment: 6500, stock_quantity: 25 },
    ],
  },

  // 6. Aviator Sunglasses
  {
    id: 'prod_aviator_sunglasses',
    name: 'Aviator Sunglasses',
    slug: 'aviator-sunglasses',
    category: 'Accessories',
    description: 'Timeless teardrop aviator silhouette crafted with lightweight monel alloy and scratch-resistant polarized crystal lenses. 100% UV400 radiation protection.',
    tagline: 'Iconic eyewear engineered for clarity and style.',
    price: 117000, // ₦117,000
    original_price: 130000,
    rating: 4.8,
    reviews_count: 57,
    badge: '-10%',
    image_url: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
    stock_quantity: 22,
    active: true,
    featured: false,
    is_new_arrival: true,
    is_bestseller: false,
    colors: ['#D4AF37', '#1E293B'],
    variants: [
      { id: 'v_as_gold', product_id: 'prod_aviator_sunglasses', name: 'Frame', value: 'Polished Gold / G-15 Green', price_adjustment: 0, stock_quantity: 14 },
      { id: 'v_as_black', product_id: 'prod_aviator_sunglasses', name: 'Frame', value: 'Matte Gunmetal / Polarized Grey', price_adjustment: 13000, stock_quantity: 8 },
    ],
  },

  // 7. Sony WH-1000XM5
  {
    id: 'prod_sony_wh1000xm5',
    name: 'Sony WH-1000XM5',
    slug: 'sony-wh-1000xm5',
    category: 'Electronics',
    description: 'Two processors and eight microphones for unprecedented noise cancellation. Superb High-Resolution Audio with the newly developed 30mm precision driver unit.',
    tagline: 'Industry-leading noise cancellation.',
    price: 455000, // ₦455,000
    original_price: 520000,
    rating: 5.0,
    reviews_count: 324,
    badge: 'Bestseller',
    image_url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80',
    stock_quantity: 16,
    active: true,
    featured: true,
    is_new_arrival: false,
    is_bestseller: true,
    colors: ['#0A0A0A', '#E2D9CE'],
    variants: [
      { id: 'v_sony_blk', product_id: 'prod_sony_wh1000xm5', name: 'Edition', value: 'Black Edition', price_adjustment: 0, stock_quantity: 10 },
      { id: 'v_sony_slv', product_id: 'prod_sony_wh1000xm5', name: 'Edition', value: 'Silver Sand', price_adjustment: 0, stock_quantity: 6 },
    ],
  },

  // 8. Classic Hoodie
  {
    id: 'prod_classic_hoodie',
    name: 'Classic Hoodie',
    slug: 'classic-hoodie',
    category: 'Fashion',
    description: 'An enduring staple tailored with pre-shrunk heavyweight cotton fleece, reinforced rib cuffs, and a timeless relaxed fit.',
    tagline: 'Premium quality hoodie perfect for everyday wear.',
    price: 78000, // ₦78,000
    original_price: 98000,
    rating: 4.9,
    reviews_count: 256,
    badge: 'Bestseller',
    image_url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
    stock_quantity: 50,
    active: true,
    featured: true,
    is_new_arrival: false,
    is_bestseller: true,
    colors: ['#E6DACB', '#111827'],
    variants: [
      { id: 'v_ch_m', product_id: 'prod_classic_hoodie', name: 'Size', value: 'M', price_adjustment: 0, stock_quantity: 25 },
      { id: 'v_ch_l', product_id: 'prod_classic_hoodie', name: 'Size', value: 'L', price_adjustment: 0, stock_quantity: 25 },
    ],
  },

  // 9. Luxury Botanical Dropper Serum (Beauty)
  {
    id: 'prod_botanical_serum',
    name: 'Radiance Peptide Botanical Serum',
    slug: 'radiance-peptide-botanical-serum',
    category: 'Beauty',
    description: 'Potent vitamin C and antioxidant botanical complex formulated with hyaluronic acid and rosehip fruit extract. Deeply hydrates and visibly brightens skin tone.',
    tagline: 'Ultra-concentrated restorative skin radiance.',
    price: 58500, // ₦58,500
    original_price: 78000,
    rating: 4.9,
    reviews_count: 112,
    badge: 'Popular',
    image_url: 'https://images.unsplash.com/photo-1608248597359-5975549e5d48?auto=format&fit=crop&w=800&q=80',
    stock_quantity: 38,
    active: true,
    featured: false,
    is_new_arrival: false,
    is_bestseller: false,
    variants: [
      { id: 'v_bs_30', product_id: 'prod_botanical_serum', name: 'Volume', value: '30ml Dropper', price_adjustment: 0, stock_quantity: 25 },
      { id: 'v_bs_50', product_id: 'prod_botanical_serum', name: 'Volume', value: '50ml Value Size', price_adjustment: 23400, stock_quantity: 13 },
    ],
  },

  // 10. Performance Seamless Workout Set (Fitness)
  {
    id: 'prod_fitness_seamless_set',
    name: 'Performance Seamless Active Set',
    slug: 'performance-seamless-active-set',
    category: 'Fitness',
    description: 'Engineered high-waisted compressive leggings and supportive racerback sports bra. Four-way stretch moisture-wicking weave for peak athletic performance.',
    tagline: 'High-performance comfort for training and studio.',
    price: 97500, // ₦97,500
    original_price: 125000,
    rating: 4.8,
    reviews_count: 94,
    badge: 'Trending',
    image_url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80',
    stock_quantity: 26,
    active: true,
    featured: false,
    is_new_arrival: false,
    is_bestseller: false,
    variants: [
      { id: 'v_fs_s', product_id: 'prod_fitness_seamless_set', name: 'Size', value: 'Small', price_adjustment: 0, stock_quantity: 8 },
      { id: 'v_fs_m', product_id: 'prod_fitness_seamless_set', name: 'Size', value: 'Medium', price_adjustment: 0, stock_quantity: 12 },
      { id: 'v_fs_l', product_id: 'prod_fitness_seamless_set', name: 'Size', value: 'Large', price_adjustment: 0, stock_quantity: 6 },
    ],
  },

  // 11. Sculptural Oak Lounge Chair (Home Decor)
  {
    id: 'prod_sculptural_lounge_chair',
    name: 'Sculptural Linen Accent Chair',
    slug: 'sculptural-linen-accent-chair',
    category: 'Home Decor',
    description: 'Solid European white oak framing with textured bouclé linen upholstery. Ergonomically reclined for luxurious lounging in modern living spaces.',
    tagline: 'Architectural minimalism crafted for timeless homes.',
    price: 505000, // ₦505,000
    original_price: 585000,
    rating: 4.9,
    reviews_count: 48,
    badge: 'Exclusive',
    image_url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
    stock_quantity: 12,
    active: true,
    featured: false,
    is_new_arrival: false,
    is_bestseller: false,
    variants: [
      { id: 'v_lc_cream', product_id: 'prod_sculptural_lounge_chair', name: 'Fabric', value: 'Chalk Cream Bouclé', price_adjustment: 0, stock_quantity: 7 },
      { id: 'v_lc_charcoal', product_id: 'prod_sculptural_lounge_chair', name: 'Fabric', value: 'Charcoal Textured Linen', price_adjustment: 26000, stock_quantity: 5 },
    ],
  },
];

export const BRAND_STORY = {
  name: 'NovaTrend',
  tagline: 'Discover Products You\'ll Love',
  origin: 'Lagos & Nationwide Nigeria Delivery',
  mission: 'We curate trending products across fashion, electronics, fitness, beauty, and home with 100% verified authentic items.',
  currencySymbol: '₦',
  contactEmail: 'support@novatrend.store',
  contactPhone: '+234 812 345 6789 / +234 803 123 4567',
  address: 'NovaTrend Hub, 14B Admiralty Way, Lekki Phase 1, Lagos, Nigeria',
};
