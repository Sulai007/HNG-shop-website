import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Product } from '../types';
import { INITIAL_PRODUCTS } from '../data/seedData';

export const productService = {
  async getProducts(): Promise<Product[]> {
    if (!isSupabaseConfigured()) {
      return INITIAL_PRODUCTS;
    }

    try {
      const { data: productsData, error: prodError } = await supabase
        .from('products')
        .select('*')
        .eq('active', true)
        .order('price', { ascending: true });

      if (prodError || !productsData || productsData.length === 0) {
        console.warn('Falling back to local product catalogue:', prodError?.message);
        return INITIAL_PRODUCTS;
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

      return productsWithVariants;
    } catch (err) {
      console.error('Error fetching products from Supabase:', err);
      return INITIAL_PRODUCTS;
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

  async getFeaturedProducts(): Promise<Product[]> {
    const products = await this.getProducts();
    return products.filter((p) => p.featured);
  }
};
