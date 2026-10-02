import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Product } from '../types';
import { INITIAL_PRODUCTS } from '../data/seedData';

export const productService = {
  /**
   * Fetches active products from Supabase (or fallback persistent local seed)
   */
  async getProducts(): Promise<Product[]> {
    // 1. Check local storage cache first to see if any custom seeded items exist
    const cachedLocal = typeof localStorage !== 'undefined' ? localStorage.getItem('novatrend_products') : null;
    let localProducts = INITIAL_PRODUCTS;
    if (cachedLocal) {
      try {
        const parsed = JSON.parse(cachedLocal);
        if (Array.isArray(parsed) && parsed.length > 0) {
          localProducts = parsed;
        }
      } catch (e) {
        console.error('Failed to parse cached products:', e);
      }
    }

    if (!isSupabaseConfigured()) {
      return localProducts;
    }

    try {
      const { data: productsData, error: prodError } = await supabase
        .from('products')
        .select('*')
        .eq('active', true)
        .order('price', { ascending: true });

      if (prodError || !productsData || productsData.length === 0) {
        // If Supabase table exists but is empty, try seeding it
        if (!prodError && productsData?.length === 0) {
          this.seedSupabase();
        }
        return localProducts;
      }

      // Fetch variants
      const { data: variantsData } = await supabase
        .from('product_variants')
        .select('*');

      const productsWithVariants: Product[] = productsData.map((p) => {
        const variants = (variantsData || []).filter((v) => v.product_id === p.id);
        return {
          ...p,
          variants: variants.length > 0 ? variants : undefined,
        };
      });

      // Cache locally for offline resilience
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('novatrend_products', JSON.stringify(productsWithVariants));
      }
      return productsWithVariants;
    } catch (err) {
      console.warn('[ProductService] Supabase query notice (using persistent seed catalogue):', err);
      return localProducts;
    }
  },

  async getProductById(id: string): Promise<Product | null> {
    const products = await this.getProducts();
    return products.find((p) => p.id === id) || null;
  },

  async getProductBySlug(slug: string): Promise<Product | null> {
    const products = await this.getProducts();
    return products.find((p) => p.slug === slug) || null;
  },

  async getNewArrivals(): Promise<Product[]> {
    const products = await this.getProducts();
    return products.filter((p) => p.is_new_arrival);
  },

  async getBestSellers(): Promise<Product[]> {
    const products = await this.getProducts();
    return products.filter((p) => p.is_bestseller);
  },

  /**
   * Automatically attempts to seed products into the Supabase database if connected
   */
  async seedSupabase(): Promise<{ success: boolean; message: string }> {
    if (!isSupabaseConfigured()) {
      // Seed local storage cache
      localStorage.setItem('novatrend_products', JSON.stringify(INITIAL_PRODUCTS));
      return { success: true, message: 'Products seeded into local persistent storage.' };
    }

    try {
      const recordsToInsert = INITIAL_PRODUCTS.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        description: p.description,
        tagline: p.tagline,
        price: p.price,
        original_price: p.original_price,
        category: p.category,
        rating: p.rating || 4.8,
        reviews_count: p.reviews_count || 100,
        badge: p.badge,
        image_url: p.image_url,
        stock_quantity: p.stock_quantity,
        active: p.active,
        featured: p.featured || false,
        is_new_arrival: p.is_new_arrival || false,
        is_bestseller: p.is_bestseller || false,
      }));

      const { error } = await supabase.from('products').upsert(recordsToInsert, { onConflict: 'id' });

      if (error) {
        console.warn('[ProductService] Supabase seed notice:', error.message);
        localStorage.setItem('novatrend_products', JSON.stringify(INITIAL_PRODUCTS));
        return {
          success: false,
          message: error.message.includes('schema cache')
            ? "Table 'products' not created in Supabase yet. Please run supabase/schema.sql in your Supabase SQL Editor. Local persistence is active."
            : error.message,
        };
      }

      localStorage.setItem('novatrend_products', JSON.stringify(INITIAL_PRODUCTS));
      return { success: true, message: 'Successfully seeded NovaTrend catalogue into Supabase!' };
    } catch (e: any) {
      localStorage.setItem('novatrend_products', JSON.stringify(INITIAL_PRODUCTS));
      return { success: false, message: e.message };
    }
  },
};
