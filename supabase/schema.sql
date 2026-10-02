-- ==============================================================================
-- ÈDÁ Artisanal Living — Supabase PostgreSQL Schema & Security Policies (RLS)
-- Target Platform: Supabase PostgreSQL with Supabase Auth & Google OAuth
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

-- 3. PROFILES TABLE (Linked with auth.users)
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
  price NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
  category TEXT NOT NULL,
  scent_profile JSONB DEFAULT '{}'::jsonb,
  burn_time TEXT,
  volume TEXT,
  image_url TEXT NOT NULL,
  stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  active BOOLEAN NOT NULL DEFAULT true,
  featured BOOLEAN NOT NULL DEFAULT false,
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
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
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

-- INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_products_active ON public.products(active);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_product_variants_product ON public.product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_carts_user ON public.carts(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_cart ON public.cart_items(cart_id);
CREATE INDEX IF NOT EXISTS idx_orders_user ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON public.order_items(order_id);

-- ==============================================================================
-- 10. ROW LEVEL SECURITY (RLS) POLICIES
-- Strict Isolation: Users can NEVER view or mutate another user's records.
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Profiles: Authenticated user can read & update their own profile only
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Products & Variants: Public can read active products; modifications restricted to service role
DROP POLICY IF EXISTS "Public can view active products" ON public.products;
CREATE POLICY "Public can view active products"
  ON public.products FOR SELECT
  TO anon, authenticated
  USING (active = true);

DROP POLICY IF EXISTS "Public can view product variants" ON public.product_variants;
CREATE POLICY "Public can view product variants"
  ON public.product_variants FOR SELECT
  TO anon, authenticated
  USING (true);

-- Carts: Authenticated user can only manage their own cart
DROP POLICY IF EXISTS "Users manage their own cart" ON public.carts;
CREATE POLICY "Users manage their own cart"
  ON public.carts FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Cart Items: User can only access items in their own cart
DROP POLICY IF EXISTS "Users manage their own cart items" ON public.cart_items;
CREATE POLICY "Users manage their own cart items"
  ON public.cart_items FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.carts
      WHERE carts.id = cart_items.cart_id
      AND carts.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.carts
      WHERE carts.id = cart_items.cart_id
      AND carts.user_id = auth.uid()
    )
  );

-- Orders: Authenticated user can only view their own orders
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
CREATE POLICY "Users can view their own orders"
  ON public.orders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own orders" ON public.orders;
CREATE POLICY "Users can insert their own orders"
  ON public.orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Order Items: User can only view items that belong to their own orders
DROP POLICY IF EXISTS "Users can view their own order items" ON public.order_items;
CREATE POLICY "Users can view their own order items"
  ON public.order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can insert their own order items" ON public.order_items;
CREATE POLICY "Users can insert their own order items"
  ON public.order_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- ==============================================================================
-- 11. SEED DATA (Products & Variants)
-- ==============================================================================
INSERT INTO public.products (id, name, slug, description, price, category, scent_profile, burn_time, volume, image_url, stock_quantity, active, featured)
VALUES
  ('prod_zobo_oud', 'Zobo & Royal Oud Artisanal Candle', 'zobo-royal-oud-candle', 'A tribute to the vibrant soul of Lagos. Hand-poured in small batches using 100% natural coconut-soy wax, blending tart wild Nigerian hibiscus calyces (Zobo) with deep smoky Assam oud, crushed clove buds, and dark amber.', 24500.00, 'candles', '{"top":["Wild Hibiscus Calyces", "Spiced Pomegranate"], "heart":["Dark Assam Oud", "Crushed Clove Buds"], "base":["Smoked Birch", "Golden Amber"]}'::jsonb, '60+ hours', NULL, 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80', 18, true, true),
  ('prod_calabar_cedar', 'Calabar Cedar & Spiced Frankincense Mist', 'calabar-cedar-spiced-frankincense-mist', 'An atmospheric room and linen elixir formulated with botanical alcohol and organic essential oils. Inspired by morning rain across the Cross River rainforests, cedar bark, and sacred incense resins.', 18500.00, 'room_mists', '{"top":["Cardamom Pods", "Rainwater Accord"], "heart":["Calabar Cedarwood", "Frankincense Resin"], "base":["Haitian Vetiver", "Warm Tobacco Leaf"]}'::jsonb, NULL, '150ml with fine mist atomizer', 'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&w=800&q=80', 24, true, true),
  ('prod_vanilla_amber_diffuser', 'Nigerian Wild Vanilla & Raw Amber Reed Diffuser', 'nigerian-wild-vanilla-raw-amber-diffuser', 'Continuous, flame-free sanctuary scenting. Our bespoke solvent-free diffusion blend features Madagascan & Nigerian cured vanilla pods steeped in warm Baltic amber and velvety benzoin gum.', 32000.00, 'diffusers', '{"top":["Cured Vanilla Orchid", "Golden Honeycomb"], "heart":["Warm Baltic Amber", "Benzoin Resin"], "base":["Sandalwood Cream", "Tonka Bean"]}'::jsonb, NULL, '200ml (Diffuses for 4–5 months)', 'https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&w=800&q=80', 14, true, true),
  ('prod_benin_bronze_candle', 'Benin Bronze Earth & Olibanum Candle', 'benin-bronze-earth-olibanum-candle', 'Housed in a raw terracotta vessel thrown by ceramic artisans in Edo State. Scented with sun-baked laterite earth, ancient olibanum, charred fig wood, and earthy roasted cocoa husk.', 28500.00, 'candles', '{"top":["Sun-Baked Earth", "Green Fig Leaf"], "heart":["Ancient Olibanum", "Roasted Cocoa Husk"], "base":["Cedar Heartwood", "Charred Oak"]}'::jsonb, '75+ hours', NULL, 'https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?auto=format&fit=crop&w=800&q=80', 10, true, true),
  ('prod_shea_ginger_mist', 'Lekki Solitude: Shea Blossom & Ginger Linen Mist', 'lekki-solitude-shea-blossom-ginger-mist', 'Formulated to mist over fine Egyptian cotton sheets and loungewear. Delicately combines creamy Nigerian cold-pressed shea blossom, freshly bruised ginger root, and coastal morning dew.', 19500.00, 'room_mists', '{"top":["Fresh Nigerian Ginger", "Pink Peppercorn"], "heart":["Shea Blossom", "Lily of the Valley"], "base":["Cashmere Wood", "Clean White Musk"]}'::jsonb, NULL, '150ml fine spray', 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80', 20, true, false),
  ('prod_ikoyi_twilight_diffuser', 'Ikoyi Twilight: Night Jasmine & Cypress Diffuser', 'ikoyi-twilight-jasmine-cypress-diffuser', 'Evoking the warm, fragrant evening breeze drifting through the lush tree canopies of Old Ikoyi. Star jasmine blooming at dusk, green Italian cypress, and subtle wet stone.', 34000.00, 'diffusers', '{"top":["Night-Blooming Jasmine", "Wild Bergamot"], "heart":["Italian Cypress", "Tuberose Petals"], "base":["Blonde Woods", "Clean Patchouli"]}'::jsonb, NULL, '200ml (Diffuses for 4–5 months)', 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80', 11, true, false),
  ('prod_raw_vessel_trio', 'ÈDÁ Artisanal Studio Ceramic Vessels (Set of 3)', 'eda-artisanal-studio-ceramic-vessels-trio', 'Handcrafted stoneware vessels designed to hold your candle refills or serve as sculptural interior pieces. Wheel-thrown by master Nigerian ceramists using local clay deposits.', 42000.00, 'ceramic_vessels', '{"top":["Mineral Stoneware", "Unglazed Clay"], "heart":["Hand-Carved Ridges", "Earth Pigments"], "base":["Natural Matte Finish", "Heat Resistant"]}'::jsonb, NULL, 'Set of 3 assorted heights', 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80', 8, true, false),
  ('prod_plateau_lavender_candle', 'Jos Plateau Wild Lavender & Honey Candle', 'jos-plateau-wild-lavender-honey-candle', 'Harvested from the temperate highland hills of the Jos Plateau. Wild French lavender hybrid infused with raw mountain acacia honey, dried chamomile blossoms, and soft cedar needles.', 26000.00, 'candles', '{"top":["Jos Highland Lavender", "Mountain Honey"], "heart":["Dried Chamomile", "Violet Leaf"], "base":["Acacia Wood", "Golden Amber"]}'::jsonb, '65+ hours', NULL, 'https://images.unsplash.com/photo-1572726729207-a78d6feb18d7?auto=format&fit=crop&w=800&q=80', 15, true, false)
ON CONFLICT (id) DO UPDATE
SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  category = EXCLUDED.category,
  image_url = EXCLUDED.image_url,
  stock_quantity = EXCLUDED.stock_quantity;

INSERT INTO public.product_variants (id, product_id, name, value, price_adjustment, stock_quantity)
VALUES
  ('var_zo_standard', 'prod_zobo_oud', 'Vessel Size', 'Standard 240g (Single Cotton Wick)', 0.00, 12),
  ('var_zo_grand', 'prod_zobo_oud', 'Vessel Size', 'Grand 450g (Double Wooden Wick)', 9500.00, 6),
  ('var_cc_frosted', 'prod_calabar_cedar', 'Bottle Finish', 'Frosted Glass with Matte Brass Sprayer', 0.00, 16),
  ('var_cc_amber', 'prod_calabar_cedar', 'Bottle Finish', 'Apothecary Amber with Gunmetal Sprayer', 1500.00, 8),
  ('var_va_amber', 'prod_vanilla_amber_diffuser', 'Glass Vessel', 'Smoked Charcoal Flacon (8 Black Reeds)', 0.00, 9),
  ('var_va_clear', 'prod_vanilla_amber_diffuser', 'Glass Vessel', 'Architectural Fluted Glass (8 Natural Reeds)', 3500.00, 5),
  ('var_bb_terracotta', 'prod_benin_bronze_candle', 'Vessel Style', 'Hand-Thrown Red Terracotta (320g)', 0.00, 6),
  ('var_bb_basalt', 'prod_benin_bronze_candle', 'Vessel Style', 'Matte Basalt Black Clay (320g)', 2000.00, 4)
ON CONFLICT (id) DO NOTHING;
