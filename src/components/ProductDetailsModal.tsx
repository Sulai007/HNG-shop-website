import React, { useState } from 'react';
import { Product, ProductVariant } from '../types';
import { useCart } from '../context/CartContext';
import { X, Plus, Minus, Check, Star, Truck, ShieldCheck, RefreshCw, Heart } from 'lucide-react';
import { formatNaira } from '../utils/formatters';

interface ProductDetailsModalProps {
  product: Product | null;
  allProducts: Product[];
  onClose: () => void;
  onSelectProduct: (p: Product) => void;
  onBuyNow?: () => void;
  currency?: 'USD' | 'NGN';
  formatPrice?: (amount: number) => string;
  isWishlisted?: boolean;
  onToggleWishlist?: (p: Product) => void;
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  product,
  allProducts,
  onClose,
  onSelectProduct,
  onBuyNow,
  currency,
  formatPrice,
  isWishlisted = false,
  onToggleWishlist,
}) => {
  if (!product) return null;

  const { addItem } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product.variants && product.variants.length > 0 ? product.variants[0] : undefined
  );
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    product.colors && product.colors.length > 0 ? product.colors[0] : undefined
  );
  const [quantity, setQuantity] = useState(1);
  const [addedNotice, setAddedNotice] = useState(false);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  const effectiveStock = selectedVariant ? selectedVariant.stock_quantity : product.stock_quantity;
  const currentPrice = product.price + (selectedVariant ? selectedVariant.price_adjustment : 0);

  const handleVariantChange = (variant: ProductVariant) => {
    setSelectedVariant(variant);
    setErrorNotice(null);
    if (quantity > variant.stock_quantity) {
      setQuantity(Math.max(1, variant.stock_quantity));
    }
  };

  const handleQuantityChange = (newQty: number) => {
    if (newQty < 1) return;
    if (newQty > effectiveStock) {
      setErrorNotice(`Only ${effectiveStock} units available.`);
      return;
    }
    setErrorNotice(null);
    setQuantity(newQty);
  };

  const handleAddToCart = () => {
    setErrorNotice(null);
    const result = addItem(product, selectedVariant, quantity);
    if (result.success) {
      setAddedNotice(true);
      setTimeout(() => {
        setAddedNotice(false);
        onClose(); // Automatically close product modal so the cart drawer is clean and unobstructed
      }, 500);
    } else {
      setErrorNotice(result.message || 'Could not add item to cart');
    }
  };

  const handleBuyNow = () => {
    setErrorNotice(null);
    const result = addItem(product, selectedVariant, quantity);
    if (result.success) {
      onClose(); // Close modal immediately
      if (onBuyNow) {
        onBuyNow();
      }
    } else {
      setErrorNotice(result.message || 'Could not add item to cart');
    }
  };

  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 3);

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-3xl border border-gray-100 w-full max-w-4xl shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Dismiss Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-gray-500 hover:text-black hover:bg-gray-100 transition-colors rounded-full"
          aria-label="Close product view"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 max-h-[85vh] overflow-y-auto">
          
          {/* Left Column: Visual Presentation */}
          <div className="md:col-span-6 bg-[#F8FAFC] p-6 sm:p-8 flex flex-col justify-center items-center relative border-b md:border-b-0 md:border-r border-gray-100">
            <div className="w-full max-w-md aspect-square rounded-2xl overflow-hidden bg-white p-6 shadow-xs flex items-center justify-center">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Badges on detail view */}
            <div className="mt-4 flex items-center gap-2">
              {product.badge && (
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#EA580C] text-white">
                  {product.badge}
                </span>
              )}
              <span className="text-xs font-medium px-3 py-1 rounded-full bg-gray-100 text-gray-700">
                Category: {product.category}
              </span>
            </div>
          </div>

          {/* Right Column: Purchase Module */}
          <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    {product.category}
                  </span>

                  {onToggleWishlist && (
                    <button
                      type="button"
                      onClick={() => onToggleWishlist(product)}
                      className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                    </button>
                  )}
                </div>

                <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold text-gray-950 font-heading">
                  {product.name}
                </h1>

                {/* Rating stars */}
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex items-center text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < Math.floor(product.rating || 5)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500 font-medium">
                    {product.rating || 4.9} ({product.reviews_count || 120} reviews)
                  </span>
                </div>

                {/* Price Display */}
                <div className="mt-4 flex items-baseline gap-3">
                  <span className="text-2xl sm:text-3xl font-extrabold text-gray-950 font-mono">
                    {formatNaira(currentPrice)}
                  </span>
                  {product.original_price && product.original_price > product.price && (
                    <span className="text-base text-gray-400 line-through font-mono">
                      {formatNaira(product.original_price)}
                    </span>
                  )}
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">
                    {effectiveStock > 0 ? `${effectiveStock} in stock` : 'Sold out'}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                {product.description}
              </p>

              {/* Color Swatches if available */}
              {product.colors && product.colors.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-gray-100">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block">
                    Color:
                  </label>
                  <div className="flex items-center gap-2">
                    {product.colors.map((colorHex, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedColor(colorHex)}
                        style={{ backgroundColor: colorHex }}
                        className={`w-7 h-7 rounded-full border-2 transition-all ${
                          selectedColor === colorHex ? 'border-[#EA580C] ring-2 ring-orange-200 scale-110' : 'border-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Variant Selector */}
              {product.variants && product.variants.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-gray-100">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block">
                    Choose Options:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {product.variants.map((v) => (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => handleVariantChange(v)}
                        className={`p-2.5 text-xs rounded-lg border text-left transition-all ${
                          selectedVariant?.id === v.id
                            ? 'border-[#EA580C] bg-orange-50/50 font-semibold text-gray-900 shadow-2xs'
                            : 'border-gray-200 hover:border-gray-400 text-gray-700'
                        }`}
                      >
                        <p className="font-medium">{v.value}</p>
                        {v.price_adjustment > 0 && (
                          <p className="text-[10px] text-gray-500 font-mono mt-0.5">
                            +{formatNaira(v.price_adjustment)}
                          </p>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Stepper & Add to Bag */}
              <div className="space-y-3 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50">
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                      className="p-2.5 text-gray-700 hover:bg-gray-100 disabled:opacity-30 transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-10 text-center text-xs font-mono font-bold text-gray-900">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(quantity + 1)}
                      disabled={quantity >= effectiveStock}
                      className="p-2.5 text-gray-700 hover:bg-gray-100 disabled:opacity-30 transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={effectiveStock <= 0}
                    className="flex-1 py-3 px-4 bg-gray-900 hover:bg-black text-white text-xs sm:text-sm font-bold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:bg-gray-400"
                  >
                    {addedNotice ? (
                      <>
                        <Check className="w-4 h-4 text-white" />
                        <span>Added to Cart</span>
                      </>
                    ) : (
                      <span>Add to Cart</span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleBuyNow}
                    disabled={effectiveStock <= 0}
                    className="flex-1 py-3 px-4 bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs sm:text-sm font-bold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:bg-gray-400"
                  >
                    <span>Buy Now · {formatNaira(currentPrice * quantity)}</span>
                  </button>
                </div>

                {errorNotice && (
                  <p className="text-xs text-red-600 font-medium">{errorNotice}</p>
                )}
              </div>

              {/* Trust Features */}
              <div className="pt-3 border-t border-gray-100 grid grid-cols-3 gap-2 text-[11px] text-gray-500 font-medium">
                <div className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-gray-700" />
                  <span>Free Shipping</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5 text-gray-700" />
                  <span>30-Day Returns</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-gray-700" />
                  <span>Verified Auth</span>
                </div>
              </div>

            </div>

            {/* Related products */}
            {relatedProducts.length > 0 && (
              <div className="pt-4 border-t border-gray-100">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-2">
                  You Might Also Like
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {relatedProducts.map((rel) => (
                    <button
                      key={rel.id}
                      onClick={() => onSelectProduct(rel)}
                      className="p-2 bg-gray-50 hover:bg-orange-50 rounded-lg text-left transition-colors flex items-center gap-2"
                    >
                      <img src={rel.image_url} alt={rel.name} className="w-9 h-9 object-contain bg-white rounded" />
                      <div className="overflow-hidden">
                        <p className="text-[11px] font-bold text-gray-900 truncate">{rel.name}</p>
                        <p className="text-[10px] font-mono text-[#EA580C]">{formatNaira(rel.price)}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
};
