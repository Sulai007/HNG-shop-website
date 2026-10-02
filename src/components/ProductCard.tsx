import React, { useState } from 'react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { Heart, ShoppingBag, Star, Check } from 'lucide-react';
import { formatNaira } from '../utils/formatters';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  currency?: 'USD' | 'NGN';
  formatPrice?: (amount: number) => string;
  isWishlisted?: boolean;
  onToggleWishlist?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  isWishlisted = false,
  onToggleWishlist,
}) => {
  const { addItem } = useCart();
  const [addedNotice, setAddedNotice] = useState(false);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    const defaultVariant = product.variants && product.variants.length > 0 ? product.variants[0] : undefined;
    const result = addItem(product, defaultVariant, 1);
    if (result.success) {
      setAddedNotice(true);
      setTimeout(() => setAddedNotice(false), 1600);
    }
  };

  const handleHeartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleWishlist) {
      onToggleWishlist(product);
    }
  };

  return (
    <div
      onClick={() => onSelect(product)}
      className="group bg-white rounded-2xl border border-gray-150 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col justify-between relative p-3 sm:p-4"
    >
      {/* Top Bar on Card: Badge on Left, Heart on Right */}
      <div className="flex items-center justify-between z-10 mb-2">
        {product.badge ? (
          <span
            className={`text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
              product.badge.includes('%')
                ? 'bg-[#EA580C] text-white'
                : 'bg-black text-white'
            }`}
          >
            {product.badge}
          </span>
        ) : (
          <span />
        )}

        <button
          type="button"
          onClick={handleHeartClick}
          className="p-1.5 rounded-full text-gray-400 hover:text-red-500 hover:bg-gray-100 transition-colors"
          aria-label="Save to wishlist"
        >
          <Heart
            className={`w-4.5 h-4.5 ${
              isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400'
            }`}
          />
        </button>
      </div>

      {/* Product Image */}
      <div className="aspect-square w-full rounded-xl overflow-hidden bg-[#F9FAFB] flex items-center justify-center p-3 relative">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>

      {/* Product Details & Actions */}
      <div className="mt-3.5 flex flex-col justify-between flex-1">
        <div>
          <h3 className="text-sm sm:text-[15px] font-bold text-gray-900 group-hover:text-[#EA580C] transition-colors line-clamp-1">
            {product.name}
          </h3>

          {/* Pricing Row */}
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-sm sm:text-base font-extrabold text-gray-950 font-mono">
              {formatNaira(product.price)}
            </span>

            {product.original_price && product.original_price > product.price && (
              <span className="text-xs text-gray-400 line-through font-mono">
                {formatNaira(product.original_price)}
              </span>
            )}
          </div>

          {/* Ratings */}
          <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-500">
            <div className="flex items-center text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(product.rating || 5)
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-gray-200'
                  }`}
                />
              ))}
            </div>
            <span className="text-[11px] text-gray-500">
              ({product.reviews_count || 120})
            </span>
          </div>
        </div>

        {/* Quick Add Button (Black Circle Button with Shopping Bag icon) */}
        <div className="mt-3 pt-2 flex items-center justify-end">
          <button
            type="button"
            onClick={handleQuickAdd}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
              addedNotice
                ? 'bg-emerald-600 text-white'
                : 'bg-black hover:bg-[#EA580C] text-white shadow-xs'
            }`}
            title="Quick add to cart"
            aria-label={`Add ${product.name} to cart`}
          >
            {addedNotice ? (
              <Check className="w-4 h-4" />
            ) : (
              <ShoppingBag className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
