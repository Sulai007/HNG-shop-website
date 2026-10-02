import React, { useState } from 'react';
import { Product, ProductVariant } from '../types';
import { ProductArtwork } from './ProductArtwork';
import { useCart } from '../context/CartContext';
import { X, Plus, Minus, Check, Clock, ShieldCheck, Truck } from 'lucide-react';

interface ProductDetailsModalProps {
  product: Product | null;
  allProducts: Product[];
  onClose: () => void;
  onSelectProduct: (p: Product) => void;
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  product,
  allProducts,
  onClose,
  onSelectProduct,
}) => {
  if (!product) return null;

  const { addItem } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product.variants && product.variants.length > 0 ? product.variants[0] : undefined
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
      setTimeout(() => setAddedNotice(false), 2000);
    } else {
      setErrorNotice(result.message || 'Could not add item to cart');
    }
  };

  // 2-3 Related products from similar or complementary categories
  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id)
    .slice(0, 3);

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
    >
      <div
        className="relative bg-[#FAF8F5] border border-[#E8E2D8] w-full max-w-4xl shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Dismiss Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-[#2C241E] hover:bg-[#E8E2D8] transition-colors rounded-full"
          aria-label="Close product view"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 max-h-[85vh] overflow-y-auto">
          
          {/* Left Column: Visual Presentation */}
          <div className="md:col-span-6 bg-[#EDE6DC] p-6 flex flex-col justify-center items-center relative border-b md:border-b-0 md:border-r border-[#E8E2D8]">
            <div className="w-full max-w-sm">
              <ProductArtwork
                category={product.category}
                name={product.name}
                aspectRatio="1/1"
                className="w-full shadow-lg border border-[#D9D2C7]"
              />
            </div>

            {/* Scent notes breakdown */}
            {product.scent_profile && (
              <div className="mt-6 w-full max-w-sm bg-[#FAF8F5] p-4 border border-[#E8E2D8] text-xs font-mono">
                <span className="text-[10px] tracking-widest uppercase text-[#7A6F65] block mb-2 font-bold">
                  Olfactory Notes Formulation
                </span>
                <div className="space-y-1.5 text-[#594E45]">
                  <div>
                    <span className="text-[#2C241E] font-semibold">Top:</span> {product.scent_profile.top.join(', ')}
                  </div>
                  <div>
                    <span className="text-[#2C241E] font-semibold">Heart:</span> {product.scent_profile.heart.join(', ')}
                  </div>
                  <div>
                    <span className="text-[#2C241E] font-semibold">Base:</span> {product.scent_profile.base.join(', ')}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Contiguous Purchase Module */}
          <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between">
            <div className="space-y-5">
              
              <div>
                <span className="text-xs uppercase tracking-widest text-[#7A6F65] font-mono">
                  {product.category.replace('_', ' ')} · Handcrafted in Lagos
                </span>
                <h1 className="mt-1 text-2xl sm:text-3xl font-serif font-semibold text-[#1E1B18] [text-wrap:balance]">
                  {product.name}
                </h1>
                
                <div className="mt-3 flex items-center justify-between">
                  <div className="text-2xl font-serif font-bold text-[#1E1B18] tabular-nums">
                    ₦{currentPrice.toLocaleString()}
                  </div>
                  
                  <span className={`text-xs font-mono px-2 py-0.5 ${
                    effectiveStock <= 5 ? 'text-[#B91C1C] bg-[#FEF2F2]' : 'text-[#166534] bg-[#F0FDF4]'
                  }`}>
                    {effectiveStock > 0 ? `${effectiveStock} Units in Atelier` : 'Out of Stock'}
                  </span>
                </div>
              </div>

              <p className="text-sm text-[#594E45] leading-relaxed">
                {product.description}
              </p>

              {/* Variant Selector */}
              {product.variants && product.variants.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-[#E8E2D8]">
                  <label className="text-xs uppercase font-mono tracking-wider text-[#7A6F65] block">
                    Choose Selection:
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {product.variants.map((v) => (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => handleVariantChange(v)}
                        className={`text-left p-3 text-xs flex items-center justify-between border transition-all ${
                          selectedVariant?.id === v.id
                            ? 'border-[#2C241E] bg-[#FFFFFF] shadow-xs'
                            : 'border-[#E8E2D8] bg-[#FAF8F5] hover:border-[#8C8075]'
                        }`}
                      >
                        <span className="font-medium text-[#2C241E]">{v.value}</span>
                        <span className="font-mono text-[#594E45]">
                          {v.price_adjustment > 0 ? `+₦${v.price_adjustment.toLocaleString()}` : 'Standard'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Stepper & Add to Cart */}
              <div className="space-y-3 pt-3 border-t border-[#E8E2D8]">
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-[#D9D2C7] bg-[#FFFFFF]">
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                      className="p-2.5 text-[#2C241E] hover:bg-[#F4EFEA] disabled:opacity-30 transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-12 text-center text-sm font-mono font-medium text-[#1E1B18] tabular-nums">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(quantity + 1)}
                      disabled={quantity >= effectiveStock}
                      className="p-2.5 text-[#2C241E] hover:bg-[#F4EFEA] disabled:opacity-30 transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={effectiveStock <= 0}
                    className="flex-1 py-3.5 px-6 bg-[#2C241E] text-[#FAF8F5] text-xs uppercase tracking-widest font-mono font-semibold hover:bg-[#15120F] disabled:bg-[#A89F95] transition-all flex items-center justify-center gap-2"
                  >
                    {addedNotice ? (
                      <>
                        <Check className="w-4 h-4 text-[#86EFAC]" />
                        <span>Added to Sanctuary Bag</span>
                      </>
                    ) : (
                      <span>Add to Bag · ₦{(currentPrice * quantity).toLocaleString()}</span>
                    )}
                  </button>
                </div>

                {errorNotice && (
                  <p className="text-xs text-[#DC2626] font-mono">{errorNotice}</p>
                )}
              </div>

              {/* Atelier Trust Markers */}
              <div className="pt-4 border-t border-[#E8E2D8] grid grid-cols-2 gap-3 text-xs text-[#7A6F65]">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#2C241E]" />
                  <span>Express Nigerian Dispatch</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#2C241E]" />
                  <span>100% Non-Toxic Botanicals</span>
                </div>
              </div>

            </div>

            {/* Related Sanctuary Pieces */}
            {relatedProducts.length > 0 && (
              <div className="mt-8 pt-6 border-t border-[#E8E2D8]">
                <span className="text-[11px] uppercase tracking-wider font-mono text-[#7A6F65] block mb-3">
                  Complementary Rituals
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {relatedProducts.map((rel) => (
                    <button
                      key={rel.id}
                      onClick={() => onSelectProduct(rel)}
                      className="text-left p-2 bg-[#FFFFFF] border border-[#E8E2D8] hover:border-[#2C241E] transition-colors"
                    >
                      <p className="text-xs font-serif font-medium text-[#2C241E] line-clamp-1">{rel.name}</p>
                      <p className="text-[11px] font-mono text-[#7A6F65] mt-1 tabular-nums">₦{rel.price.toLocaleString()}</p>
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
