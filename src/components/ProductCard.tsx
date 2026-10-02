import React, { useState } from 'react';
import { Product } from '../types';
import { ProductArtwork } from './ProductArtwork';
import { useCart } from '../context/CartContext';
import { Plus, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const { addItem } = useCart();
  const [addedNotice, setAddedNotice] = useState(false);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    // If product has multiple variants, open detail view so user can choose
    if (product.variants && product.variants.length > 1) {
      onSelect(product);
      return;
    }

    const defaultVariant = product.variants ? product.variants[0] : undefined;
    const result = addItem(product, defaultVariant, 1);
    if (result.success) {
      setAddedNotice(true);
      setTimeout(() => setAddedNotice(false), 1600);
    }
  };

  const isLowStock = product.stock_quantity > 0 && product.stock_quantity <= 5;
  const isOutOfStock = product.stock_quantity <= 0;

  return (
    <article
      onClick={() => onSelect(product)}
      className="group relative flex flex-col bg-[#FFFFFF] border border-[#E8E2D8] hover:border-[#2C241E]/40 transition-all duration-300 cursor-pointer overflow-hidden"
    >
      {/* Visual Asset Container (takes dominant 65% card height) */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F4EFEA]">
        {/* We use our bespoke SVG Artwork generator which guarantees zero broken links and high-luxury appearance */}
        <ProductArtwork
          category={product.category}
          name={product.name}
          aspectRatio="4/3"
          className="w-full h-full"
        />

        {/* Subtle status tag (unboxed text, zero-pill discipline) */}
        <div className="absolute top-3 left-3 text-[11px] font-mono tracking-wider uppercase text-[#594E45] bg-[#FAF8F5]/90 backdrop-blur-xs px-2 py-0.5">
          {product.category.replace('_', ' ')}
        </div>

        {isLowStock && (
          <div className="absolute top-3 right-3 text-[11px] font-mono text-[#B91C1C] bg-[#FEF2F2] px-2 py-0.5 border border-[#FECACA]">
            Only {product.stock_quantity} Left
          </div>
        )}

        {isOutOfStock && (
          <div className="absolute inset-0 bg-[#FAF8F5]/80 flex items-center justify-center">
            <span className="font-mono text-xs uppercase tracking-widest text-[#786B60] bg-white px-3 py-1 border border-[#E8E2D8]">
              Sold Out
            </span>
          </div>
        )}

        {/* Quick Add Button on Hover */}
        {!isOutOfStock && (
          <button
            type="button"
            onClick={handleQuickAdd}
            className="absolute bottom-3 right-3 p-2.5 bg-[#2C241E] text-[#FAF8F5] opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-md hover:bg-[#15120F] flex items-center gap-1 text-xs"
            aria-label={`Add ${product.name} to cart`}
          >
            {addedNotice ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#86EFAC]" />
                <span className="font-mono">Added</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span className="font-mono">Add</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Product Content & Baselines */}
      <div className="p-5 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="font-serif text-lg font-medium text-[#1E1B18] group-hover:text-[#8C4A26] transition-colors line-clamp-1">
              {product.name}
            </h3>
          </div>

          <p className="mt-1 text-xs text-[#695E54] line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {/* Scent notes kicker */}
          {product.scent_profile?.top?.length > 0 && (
            <div className="mt-3 flex items-center gap-1.5 text-[11px] text-[#7A6F65] font-mono overflow-hidden text-ellipsis whitespace-nowrap">
              <span>Notes:</span>
              <span>{product.scent_profile.top.slice(0, 2).join(' · ')}</span>
            </div>
          )}
        </div>

        {/* Price and Stock Baseline */}
        <div className="mt-4 pt-3 border-t border-[#E8E2D8] flex items-center justify-between">
          <div className="font-serif text-base font-semibold text-[#1E1B18] tabular-nums">
            ₦{product.price.toLocaleString()}
          </div>

          <span className="text-[11px] font-mono text-[#8C8075]">
            {isOutOfStock ? 'Backorder' : `${product.stock_quantity} available`}
          </span>
        </div>
      </div>
    </article>
  );
};
