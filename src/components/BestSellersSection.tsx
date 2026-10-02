import React, { useState } from 'react';
import { ArrowRight, Star, Heart, Check, ShoppingBag } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { formatNaira } from '../utils/formatters';

interface BestSellersSectionProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  formatPrice?: (amount: number) => string;
  onViewAllClick: () => void;
  onToggleWishlist: (product: Product) => void;
  wishlistedIds: Set<string>;
}

export const BestSellersSection: React.FC<BestSellersSectionProps> = ({
  products,
  onSelectProduct,
  formatPrice,
  onViewAllClick,
  onToggleWishlist,
  wishlistedIds,
}) => {
  const { addItem } = useCart();
  const [addedId, setAddedId] = useState<string | null>(null);

  const bestSellerProducts = products.filter((p) => p.is_bestseller).slice(0, 3);

  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    const defaultVariant = product.variants && product.variants.length > 0 ? product.variants[0] : undefined;
    const result = addItem(product, defaultVariant, 1);
    if (result.success) {
      setAddedId(product.id);
      setTimeout(() => setAddedId(null), 1600);
    }
  };

  return (
    <section id="best_sellers" className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-gray-100">
      
      {/* Section Header */}
      <div className="flex items-center justify-between mb-8 pb-2">
        <h2 className="text-xl sm:text-2xl font-extrabold text-gray-950 font-heading tracking-tight">
          Best Sellers
        </h2>
        <button
          onClick={onViewAllClick}
          className="text-xs sm:text-sm font-semibold text-gray-600 hover:text-black flex items-center gap-1.5 transition-colors"
        >
          <span>View All Best Sellers</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* 3 Wide Best Seller Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {bestSellerProducts.map((product) => {
          const isWishlisted = wishlistedIds.has(product.id);
          const isAdded = addedId === product.id;

          return (
            <div
              key={product.id}
              onClick={() => onSelectProduct(product)}
              className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col justify-between group"
            >
              <div>
                {/* Top Badge & Heart */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-800">
                    Bestseller
                  </span>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleWishlist(product);
                    }}
                    className="p-1.5 rounded-full text-gray-400 hover:text-red-500 hover:bg-gray-100 transition-colors"
                  >
                    <Heart
                      className={`w-4.5 h-4.5 ${
                        isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400'
                      }`}
                    />
                  </button>
                </div>

                {/* Product Image */}
                <div className="aspect-[4/3] w-full rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center p-4 mb-4">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>

                {/* Product Info */}
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-[#EA580C] transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                  <span className="text-base font-extrabold text-gray-950 font-mono">
                    {formatNaira(product.price)}
                  </span>
                </div>

                {/* Ratings */}
                <div className="mt-1 flex items-center gap-1.5 text-xs text-gray-500">
                  <div className="flex items-center text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span>({product.reviews_count || 180})</span>
                </div>

                {/* Tagline Description */}
                <p className="mt-2 text-xs text-gray-500 line-clamp-2 leading-relaxed">
                  {product.tagline || product.description}
                </p>
              </div>

              {/* Action: Quick Add Button */}
              <div className="mt-5 pt-4 border-t border-gray-100 flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => handleQuickAdd(e, product)}
                  className={`flex-1 py-2.5 px-4 rounded-lg font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    isAdded
                      ? 'bg-emerald-600 text-white'
                      : 'bg-black hover:bg-gray-800 text-white shadow-xs'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Added to Bag</span>
                    </>
                  ) : (
                    <span>Quick Add</span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleWishlist(product);
                  }}
                  className="p-2.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors"
                  aria-label="Wishlist"
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </section>
  );
};
