import React from 'react';
import { X, Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { formatNaira } from '../utils/formatters';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistProducts: Product[];
  onRemoveFromWishlist: (productId: string) => void;
  onSelectProduct: (product: Product) => void;
  formatPrice?: (amount: number) => string;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlistProducts,
  onRemoveFromWishlist,
  onSelectProduct,
  formatPrice,
}) => {
  const { addItem } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end">
      <div
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-gray-100 animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-gray-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 fill-red-500 text-red-500" />
            <h2 className="text-lg sm:text-xl font-extrabold text-gray-950 font-heading">
              My Wishlist
            </h2>
            <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
              {wishlistProducts.length}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 transition-colors rounded-full"
            aria-label="Close wishlist drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          {wishlistProducts.length === 0 ? (
            <div className="py-24 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-red-50 flex items-center justify-center text-red-500">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Your wishlist is empty</h3>
              <p className="text-xs text-gray-500 max-w-xs mx-auto leading-relaxed">
                Click the heart icon on any product card to save items you love for later.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {wishlistProducts.map((product) => (
                <div
                  key={product.id}
                  className="p-3.5 bg-gray-50/80 rounded-xl border border-gray-100 flex gap-3 relative group"
                >
                  {/* Thumbnail */}
                  <div
                    onClick={() => {
                      onSelectProduct(product);
                      onClose();
                    }}
                    className="w-18 h-18 bg-white rounded-lg border border-gray-100 flex-shrink-0 overflow-hidden p-2 flex items-center justify-center cursor-pointer"
                  >
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Item Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <h4
                          onClick={() => {
                            onSelectProduct(product);
                            onClose();
                          }}
                          className="text-xs sm:text-sm font-bold text-gray-900 line-clamp-1 hover:text-[#EA580C] cursor-pointer"
                        >
                          {product.name}
                        </h4>
                        <button
                          type="button"
                          onClick={() => onRemoveFromWishlist(product.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-1"
                          aria-label={`Remove ${product.name}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <p className="text-[11px] text-gray-500">{product.category}</p>
                      <p className="text-xs font-extrabold text-gray-950 font-mono mt-1">
                        {formatNaira(product.price)}
                      </p>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          addItem(product, product.variants?.[0], 1);
                        }}
                        className="px-3 py-1.5 bg-black hover:bg-[#EA580C] text-white text-[11px] font-bold rounded-md flex items-center gap-1.5 transition-colors"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        <span>Move to Bag</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 sm:p-6 bg-white border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold text-xs uppercase tracking-wider rounded-lg transition-colors text-center"
          >
            Continue Shopping
          </button>
        </div>

      </div>
    </div>
  );
};
