import React from 'react';
import { useCart } from '../context/CartContext';
import { X, Plus, Minus, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { NIGERIAN_STATES } from '../data/seedData';
import { ProductArtwork } from './ProductArtwork';

interface CartDrawerProps {
  onProceedToCheckout: () => void;
  onExploreProducts: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  onProceedToCheckout,
  onExploreProducts,
}) => {
  const {
    items,
    itemCount,
    subtotal,
    deliveryFee,
    total,
    selectedState,
    setSelectedState,
    updateQuantity,
    removeItem,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
  } = useCart();

  if (!isCartDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end">
      <div
        className="w-full max-w-md bg-[#FAF8F5] h-full shadow-2xl flex flex-col justify-between border-l border-[#E8E2D8] animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-[#E8E2D8] flex items-center justify-between bg-[#FFFFFF]">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#2C241E]" />
            <h2 className="font-serif text-xl font-semibold text-[#1E1B18]">
              Sanctuary Bag
            </h2>
            <span className="font-mono text-xs text-[#7A6F65] tabular-nums">
              ({itemCount} {itemCount === 1 ? 'item' : 'items'})
            </span>
          </div>

          <button
            onClick={() => setIsCartDrawerOpen(false)}
            className="p-2 text-[#7A6F65] hover:text-[#1E1B18] transition-colors rounded-full"
            aria-label="Close bag drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#EFEAE2] flex items-center justify-center text-[#7A6F65]">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-lg text-[#2C241E]">Your Sanctuary Bag is empty</h3>
              <p className="text-xs text-[#695E54] max-w-xs mx-auto leading-relaxed">
                Discover our artisanal collection of hand-poured candles, reed diffusers, and atmospheric mists.
              </p>
              <button
                type="button"
                onClick={() => {
                  setIsCartDrawerOpen(false);
                  onExploreProducts();
                }}
                className="mt-4 px-6 py-2.5 bg-[#2C241E] text-[#FAF8F5] text-xs uppercase tracking-wider font-mono hover:bg-[#15120F] transition-colors"
              >
                Explore Catalogue
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="p-4 bg-[#FFFFFF] border border-[#E8E2D8] flex gap-4 relative group"
                >
                  {/* Thumbnail */}
                  <div className="w-20 h-20 bg-[#F4EFEA] border border-[#E8E2D8] flex-shrink-0 overflow-hidden">
                    <ProductArtwork
                      category={item.product.category}
                      name={item.product.name}
                      aspectRatio="1/1"
                      className="w-full h-full"
                    />
                  </div>

                  {/* Item Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <h4 className="font-serif text-sm font-semibold text-[#1E1B18] line-clamp-1">
                          {item.product.name}
                        </h4>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="text-[#9C8F84] hover:text-[#DC2626] transition-colors p-1"
                          aria-label={`Remove ${item.product.name}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {item.variant && (
                        <p className="text-[11px] text-[#7A6F65] font-mono mt-0.5">
                          {item.variant.value}
                        </p>
                      )}

                      <p className="text-xs font-serif font-medium text-[#1E1B18] mt-1 tabular-nums">
                        ₦{item.unit_price.toLocaleString()}
                      </p>
                    </div>

                    {/* Quantity Controls & Line Total */}
                    <div className="flex items-center justify-between pt-2 mt-2 border-t border-[#F0EBE3]">
                      <div className="flex items-center border border-[#D9D2C7] bg-[#FAF8F5]">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-1 text-[#2C241E] hover:bg-[#E8E2D8] text-xs transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-xs font-mono font-medium tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-1 text-[#2C241E] hover:bg-[#E8E2D8] text-xs transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs font-serif font-bold text-[#2C241E] tabular-nums">
                        ₦{item.subtotal.toLocaleString()}
                      </span>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Summary & Checkout */}
        {items.length > 0 && (
          <div className="p-6 bg-[#FFFFFF] border-t border-[#E8E2D8] space-y-4">
            
            {/* Delivery Destination Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-[#7A6F65] block">
                Calculate Delivery:
              </label>
              <select
                value={selectedState.code}
                onChange={(e) => {
                  const found = NIGERIAN_STATES.find((s) => s.code === e.target.value);
                  if (found) setSelectedState(found);
                }}
                className="w-full text-xs font-sans bg-[#FAF8F5] border border-[#D9D2C7] p-2.5 text-[#2C241E] focus:outline-none focus:border-[#2C241E]"
              >
                {NIGERIAN_STATES.map((state) => (
                  <option key={state.code} value={state.code}>
                    {state.name} — ₦{state.delivery_fee.toLocaleString()} ({state.estimated_days})
                  </option>
                ))}
              </select>
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-2 text-xs text-[#594E45] pt-2 border-t border-[#F0EBE3]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-serif text-sm font-semibold text-[#1E1B18] tabular-nums">
                  ₦{subtotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Delivery</span>
                <span className="font-mono text-xs tabular-nums text-[#1E1B18]">
                  ₦{deliveryFee.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#2C241E] text-base font-serif font-bold text-[#1E1B18]">
                <span>Total Amount</span>
                <span className="tabular-nums">₦{total.toLocaleString()}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 space-y-2">
              <button
                type="button"
                onClick={() => {
                  setIsCartDrawerOpen(false);
                  onProceedToCheckout();
                }}
                className="w-full py-3.5 bg-[#2C241E] text-[#FAF8F5] text-xs uppercase tracking-widest font-mono font-semibold hover:bg-[#15120F] transition-colors flex items-center justify-center gap-2"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setIsCartDrawerOpen(false)}
                className="w-full py-2 text-xs text-[#7A6F65] hover:text-[#1E1B18] transition-colors text-center"
              >
                Continue Browsing
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
