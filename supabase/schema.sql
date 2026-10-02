-- ==============================================================================
-- NovaTrend Ecommerce Platform — Complete Supabase PostgreSQL Schema & Seed Data
-- Database: PostgreSQL (Supabase Project: swlcjcgrxbqjflgalszb)
-- Currency: Nigerian Naira (NGN / ₦)
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS
DO $$ BEGIN
  CREATE TYPE order_status_enum AS ENUM ('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE payment_status_enum AS ENUM ('pending', 'paid', 'failed');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 3. PROFILES TABLE (Linked with Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Trigger to automatically create profile on Supabase auth signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'Valued Customer'),
    NEW.email,
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO UPDATE
  SET
    full_name = EXCLUDED.full_name,
    email = EXCLUDED.email,
    avatar_url = EXCLUDED.avatar_url,
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  tagline TEXT,
  price NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
  original_price NUMERIC(12, 2),
  category TEXT NOT NULL,
  rating NUMERIC(3, 2) DEFAULT 4.8,
  reviews_count INTEGER DEFAULT 50,
  badge TEXT,
  image_url TEXT NOT NULL,
  secondary_image TEXT,
  stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  active BOOLEAN NOT NULL DEFAULT true,
  featured BOOLEAN NOT NULL DEFAULT false,
  is_bestseller BOOLEAN NOT NULL DEFAULT false,
  is_new_arrival BOOLEAN NOT NULL DEFAULT false,
  colors JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. PRODUCT VARIANTS TABLE
CREATE TABLE IF NOT EXISTS public.product_variants (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  value TEXT NOT NULL,
  price_adjustment NUMERIC(12, 2) NOT NULL DEFAULT 0,
  stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 6. CARTS TABLE
CREATE TABLE IF NOT EXISTS public.carts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  CONSTRAINT unique_user_cart UNIQUE (user_id)
);

-- 7. CART ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cart_id UUID NOT NULL REFERENCES public.carts(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  variant_id TEXT REFERENCES public.product_variants(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  CONSTRAINT unique_cart_product_variant UNIQUE (cart_id, product_id, variant_id)
);

-- 8. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  order_number TEXT NOT NULL UNIQUE,
  status order_status_enum NOT NULL DEFAULT 'pending',
  payment_status payment_status_enum NOT NULL DEFAULT 'pending',
  subtotal NUMERIC(12, 2) NOT NULL CHECK (subtotal >= 0),
  delivery_fee NUMERIC(12, 2) NOT NULL CHECK (delivery_fee >= 0),
  total NUMERIC(12, 2) NOT NULL CHECK (total >= 0),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  delivery_address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  notes TEXT,
  email_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 9. ORDER ITEMS TABLE (Snapshot table)
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  unit_price NUMERIC(12, 2) NOT NULL CHECK (unit_price >= 0),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  variant_information TEXT,
  subtotal NUMERIC(12, 2) NOT NULL CHECK (subtotal >= 0),
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_products_active ON public.products(active);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_orders_user ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON public.order_items(order_id);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Products RLS
DROP POLICY IF EXISTS "Public can view active products" ON public.products;
CREATE POLICY "Public can view active products" ON public.products FOR SELECT TO anon, authenticated USING (active = true);

-- Product Variants RLS
DROP POLICY IF EXISTS "Public can view product variants" ON public.product_variants;
CREATE POLICY "Public can view product variants" ON public.product_variants FOR SELECT TO anon, authenticated USING (true);

-- Profiles RLS
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Orders RLS
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
CREATE POLICY "Users can view their own orders" ON public.orders FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Public can insert orders" ON public.orders;
CREATE POLICY "Public can insert orders" ON public.orders FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Order Items RLS
DROP POLICY IF EXISTS "Users can view items in their orders" ON public.order_items;
CREATE POLICY "Users can view items in their orders" ON public.order_items FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);

DROP POLICY IF EXISTS "Public can insert order items" ON public.order_items;
CREATE POLICY "Public can insert order items" ON public.order_items FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Cart RLS
DROP POLICY IF EXISTS "Users can manage own cart" ON public.carts;
CREATE POLICY "Users can manage own cart" ON public.carts FOR ALL TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage own cart items" ON public.cart_items;
CREATE POLICY "Users can manage own cart items" ON public.cart_items FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.carts WHERE carts.id = cart_items.cart_id AND carts.user_id = auth.uid())
);

-- ==============================================================================
-- 10. AUTHORITATIVE SEED DATA (Naira Pricing)
-- ==============================================================================

INSERT INTO public.products (id, name, slug, description, tagline, price, original_price, category, rating, reviews_count, badge, image_url, stock_quantity, active, featured, is_new_arrival, is_bestseller, colors)
VALUES
  ('prod_essential_hoodie', 'Essential Hoodie', 'essential-hoodie', 'Crafted from heavy 450gsm organic brushed French terry cotton. Features dropped shoulders, double-layered hood without drawstrings, and a kangaroo pouch pocket.', 'Premium quality hoodie perfect for everyday wear.', 78000.00, 105000.00, 'Fashion', 4.9, 128, 'New', 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80', 45, true, true, true, true, '["#D6C7B2", "#1E1E1E", "#9E9E9E"]'::jsonb),
  ('prod_air_max_270', 'Air Max 270', 'air-max-270', 'Boasting Nikes biggest heel Air unit yet, delivering a super-soft ride that feels as impossible as it looks. Knit fabric upper with no-sew overlays for comfort and support.', 'Iconic comfort meets modern style.', 169000.00, 208000.00, 'Fashion', 4.8, 189, '-20%', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80', 28, true, true, true, true, '["#FFFFFF", "#FF4500", "#111111"]'::jsonb),
  ('prod_wireless_headphones', 'Wireless Headphones', 'wireless-headphones', 'Immersive soundstage with hybrid active noise cancellation, 40mm titanium drivers, and ultra-plush protein leather ear cushions. Up to 40 hours of battery life on a single charge.', 'Crystal-clear acoustics with all-day comfort.', 130000.00, 168000.00, 'Electronics', 4.9, 154, 'New', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80', 34, true, true, true, false, '["#171717", "#E5E5E5"]'::jsonb),
  ('prod_smart_watch_series_9', 'Smart Watch Series 9', 'smart-watch-series-9', 'Always-On Retina display with up to 2000 nits brightness. Advanced health sensors, ECG app, blood oxygen tracking, crash detection, and water resistant to 50 meters.', 'Your essential health & fitness companion.', 260000.00, 305000.00, 'Electronics', 4.9, 103, '-15%', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80', 19, true, true, true, false, '["#000000", "#F3F4F6"]'::jsonb),
  ('prod_stainless_steel_bottle', 'Stainless Steel Bottle', 'stainless-steel-bottle', 'Double-wall vacuum insulation keeps drinks ice cold for up to 24 hours and piping hot for 12 hours. Sweat-free powder coat finish with leak-proof flex cap.', 'Stay hydrated with sustainable thermal insulation.', 32500.00, 45000.00, 'Accessories', 4.7, 76, 'New', 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80', 60, true, false, true, false, '["#1C1917", "#38BDF8", "#F43F5E"]'::jsonb),
  ('prod_aviator_sunglasses', 'Aviator Sunglasses', 'aviator-sunglasses', 'Timeless teardrop aviator silhouette crafted with lightweight monel alloy and scratch-resistant polarized crystal lenses. 100% UV400 radiation protection.', 'Iconic eyewear engineered for clarity and style.', 117000.00, 130000.00, 'Accessories', 4.8, 57, '-10%', 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80', 22, true, false, true, false, '["#D4AF37", "#1E293B"]'::jsonb),
  ('prod_sony_wh1000xm5', 'Sony WH-1000XM5', 'sony-wh-1000xm5', 'Two processors and eight microphones for unprecedented noise cancellation. Superb High-Resolution Audio with the newly developed 30mm precision driver unit.', 'Industry-leading noise cancellation.', 455000.00, 520000.00, 'Electronics', 5.0, 324, 'Bestseller', 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80', 16, true, true, false, true, '["#0A0A0A", "#E2D9CE"]'::jsonb),
  ('prod_classic_hoodie', 'Classic Hoodie', 'classic-hoodie', 'An enduring staple tailored with pre-shrunk heavyweight cotton fleece, reinforced rib cuffs, and a timeless relaxed fit.', 'Premium quality hoodie perfect for everyday wear.', 78000.00, 98000.00, 'Fashion', 4.9, 256, 'Bestseller', 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80', 50, true, true, false, true, '["#E6DACB", "#111827"]'::jsonb),
  ('prod_botanical_serum', 'Radiance Peptide Botanical Serum', 'radiance-peptide-botanical-serum', 'Potent vitamin C and antioxidant botanical complex formulated with hyaluronic acid and rosehip fruit extract. Deeply hydrates and visibly brightens skin tone.', 'Ultra-concentrated restorative skin radiance.', 58500.00, 78000.00, 'Beauty', 4.9, 112, 'Popular', 'https://images.unsplash.com/photo-1608248597359-5975549e5d48?auto=format&fit=crop&w=800&q=80', 38, true, false, false, false, '[]'::jsonb),
  ('prod_fitness_seamless_set', 'Performance Seamless Active Set', 'performance-seamless-active-set', 'Engineered high-waisted compressive leggings and supportive racerback sports bra. Four-way stretch moisture-wicking weave for peak athletic performance.', 'High-performance comfort for training and studio.', 97500.00, 125000.00, 'Fitness', 4.8, 94, 'Trending', 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80', 26, true, false, false, false, '[]'::jsonb),
  ('prod_sculptural_lounge_chair', 'Sculptural Linen Accent Chair', 'sculptural-linen-accent-chair', 'Solid European white oak framing with textured bouclé linen upholstery. Ergonomically reclined for luxurious lounging in modern living spaces.', 'Architectural minimalism crafted for timeless homes.', 505000.00, 585000.00, 'Home Decor', 4.9, 48, 'Exclusive', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80', 12, true, false, false, false, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  tagline = EXCLUDED.tagline,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  category = EXCLUDED.category,
  image_url = EXCLUDED.image_url,
  stock_quantity = EXCLUDED.stock_quantity,
  is_bestseller = EXCLUDED.is_bestseller,
  is_new_arrival = EXCLUDED.is_new_arrival,
  colors = EXCLUDED.colors;

-- 11. PRODUCT VARIANTS SEED DATA
INSERT INTO public.product_variants (id, product_id, name, value, price_adjustment, stock_quantity)
VALUES
  ('v_eh_s', 'prod_essential_hoodie', 'Size', 'S (Small)', 0, 12),
  ('v_eh_m', 'prod_essential_hoodie', 'Size', 'M (Medium)', 0, 18),
  ('v_eh_l', 'prod_essential_hoodie', 'Size', 'L (Large)', 0, 10),
  ('v_eh_xl', 'prod_essential_hoodie', 'Size', 'XL (Extra Large)', 0, 5),
  ('v_am_41', 'prod_air_max_270', 'Shoe Size', 'EU 41 / US 8', 0, 6),
  ('v_am_42', 'prod_air_max_270', 'Shoe Size', 'EU 42 / US 8.5', 0, 8),
  ('v_am_43', 'prod_air_max_270', 'Shoe Size', 'EU 43 / US 9.5', 0, 9),
  ('v_am_44', 'prod_air_max_270', 'Shoe Size', 'EU 44 / US 10', 0, 5),
  ('v_wh_blk', 'prod_wireless_headphones', 'Color', 'Matte Obsidian Black', 0, 20),
  ('v_wh_slv', 'prod_wireless_headphones', 'Color', 'Platinum Silver', 6500, 14),
  ('v_sw_41', 'prod_smart_watch_series_9', 'Case Size', '41mm Midnight Aluminum', 0, 11),
  ('v_sw_45', 'prod_smart_watch_series_9', 'Case Size', '45mm Midnight Aluminum', 39000, 8),
  ('v_sb_500', 'prod_stainless_steel_bottle', 'Volume', '500ml (17 oz)', 0, 35),
  ('v_sb_750', 'prod_stainless_steel_bottle', 'Volume', '750ml (25 oz)', 6500, 25),
  ('v_as_gold', 'prod_aviator_sunglasses', 'Frame', 'Polished Gold / G-15 Green', 0, 14),
  ('v_as_black', 'prod_aviator_sunglasses', 'Frame', 'Matte Gunmetal / Polarized Grey', 13000, 8),
  ('v_sony_blk', 'prod_sony_wh1000xm5', 'Edition', 'Black Edition', 0, 10),
  ('v_sony_slv', 'prod_sony_wh1000xm5', 'Edition', 'Silver Sand', 0, 6),
  ('v_ch_m', 'prod_classic_hoodie', 'Size', 'M', 0, 25),
  ('v_ch_l', 'prod_classic_hoodie', 'Size', 'L', 0, 25),
  ('v_bs_30', 'prod_botanical_serum', 'Volume', '30ml Dropper', 0, 25),
  ('v_bs_50', 'prod_botanical_serum', 'Volume', '50ml Value Size', 23400, 13),
  ('v_fs_s', 'prod_fitness_seamless_set', 'Size', 'Small', 0, 8),
  ('v_fs_m', 'prod_fitness_seamless_set', 'Size', 'Medium', 0, 12),
  ('v_fs_l', 'prod_fitness_seamless_set', 'Size', 'Large', 0, 6),
  ('v_lc_cream', 'prod_sculptural_lounge_chair', 'Fabric', 'Chalk Cream Bouclé', 0, 7),
  ('v_lc_charcoal', 'prod_sculptural_lounge_chair', 'Fabric', 'Charcoal Textured Linen', 26000, 5)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  value = EXCLUDED.value,
  price_adjustment = EXCLUDED.price_adjustment,
  stock_quantity = EXCLUDED.stock_quantity;
